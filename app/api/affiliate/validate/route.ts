import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const code = new URL(request.url).searchParams.get('code')?.trim().toUpperCase() ?? '';
  if (!/^[A-F0-9]{10}$/.test(code)) return NextResponse.json({ valid: false }, { headers: { 'Cache-Control': 'no-store' } });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ error: 'Affiliate validation is temporarily unavailable.' }, { status: 503 });
  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await supabase.from('affiliate_accounts').select('user_id').eq('referral_code', code).maybeSingle();
  if (error) return NextResponse.json({ error: 'Affiliate validation is temporarily unavailable.' }, { status: 503 });
  return NextResponse.json({ valid: Boolean(data), code: data ? code : null }, { headers: { 'Cache-Control': 'no-store' } });
}
