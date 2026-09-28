import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const PLAN_PRICES: Record<string, number> = {
  'Quarterly Plan (3 Months)': 399,
  'Annual VIP Plan (1 Year)': 999,
};

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) throw new Error('Server payment configuration is incomplete');
  return createClient(url, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const firstName = String(body.firstName ?? '').trim().slice(0, 80);
    const lastName = String(body.lastName ?? '').trim().slice(0, 80);
    const username = String(body.username ?? '').trim().slice(0, 40);
    const email = String(body.email ?? '').trim().toLowerCase().slice(0, 254);
    const upiName = String(body.upiName ?? '').trim().slice(0, 120);
    const utrNumber = String(body.utrNumber ?? '').trim();
    const planName = String(body.planName ?? '');
    const referralCode = String(body.affiliateCode ?? '').trim().toUpperCase();

    if (!firstName || !lastName || !username || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !upiName || !/^\d{12}$/.test(utrNumber)) {
      return NextResponse.json({ error: 'Enter valid account and payment details.' }, { status: 400 });
    }
    const originalAmount = PLAN_PRICES[planName];
    if (!originalAmount) return NextResponse.json({ error: 'The selected plan is not valid.' }, { status: 400 });

    const admin = getAdminClient();
    let affiliateUserId: string | null = null;
    if (referralCode) {
      const { data: affiliate, error: affiliateError } = await admin
        .from('affiliate_accounts').select('user_id').eq('referral_code', referralCode).maybeSingle();
      if (affiliateError) throw affiliateError;
      if (!affiliate) return NextResponse.json({ error: 'This affiliate link is invalid or expired.' }, { status: 400 });
      const resolvedAffiliateUserId = affiliate.user_id;
      if (typeof resolvedAffiliateUserId !== 'string' || !resolvedAffiliateUserId) {
        return NextResponse.json({ error: 'This affiliate link is invalid or expired.' }, { status: 400 });
      }
      affiliateUserId = resolvedAffiliateUserId;
      const { data: referredUser, error: referredUserError } = await admin.auth.admin.getUserById(affiliateUserId);
      if (referredUserError) throw referredUserError;
      if (referredUser.user?.email?.toLowerCase() === email) {
        return NextResponse.json({ error: 'You cannot use your own affiliate link.' }, { status: 400 });
      }
    }

    const { data: duplicateUtr, error: utrError } = await admin
      .from('payment_submissions').select('id').eq('utr_number', utrNumber).maybeSingle();
    if (utrError) throw utrError;
    if (duplicateUtr) return NextResponse.json({ error: 'This UTR / reference number has already been submitted.' }, { status: 409 });

    const discountAmount = referralCode ? Math.round(originalAmount * 0.30 * 100) / 100 : 0;
    const amountPaid = Math.round((originalAmount - discountAmount) * 100) / 100;
    const { data, error } = await admin.from('payment_submissions').insert({
      first_name: firstName,
      last_name: lastName,
      username,
      email,
      upi_name: upiName,
      utr_number: utrNumber,
      amount: amountPaid,
      original_amount: originalAmount,
      discount_amount: discountAmount,
      affiliate_code: affiliateUserId ? referralCode : null,
      plan_name: planName,
      status: 'PENDING APPROVAL',
    }).select('id').single();

    if (error) throw error;
    return NextResponse.json({ success: true, paymentId: data.id, originalAmount, discountAmount, amountPaid }, { status: 200 });
  } catch (error) {
    console.error('Payment proof registration failed:', error);
    return NextResponse.json({ error: 'Payment proof could not be submitted. Check your details and try again.' }, { status: 500 });
  }
}
