import { createClient } from '@supabase/supabase-js';

// Environment variables se Supabase URL aur Anon Key lena
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const db = createClient(supabaseUrl, supabaseKey);