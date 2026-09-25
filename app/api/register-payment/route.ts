import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      firstName, 
      lastName, 
      username, 
      email, 
      password, 
      upiName, 
      utrNumber, 
      amount, 
      planName 
    } = body;

    // Validation Check
    if (!username || !email || !utrNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Insert Data into Supabase
    const { data, error } = await supabase
      .from('payment_submissions')
      .insert([
        {
          first_name: firstName,
          last_name: lastName,
          username: username,
          email: email,
          password: password,
          upi_name: upiName,
          utr_number: utrNumber,
          amount: amount || 399,
          plan_name: planName || 'Quarterly Plan (3 Months)',
          status: 'PENDING APPROVAL',
        },
      ])
      .select();

    if (error) {
      console.error('Supabase Error Detailed:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });

  } catch (err: any) {
    console.error('Server Unexpected Error:', err);
    return NextResponse.json({ error: err?.message || 'Internal Server Error' }, { status: 500 });
  }
}