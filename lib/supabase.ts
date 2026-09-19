import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ujhwkuszmgsojumjknnc.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqaHdrdXN6bWdzb2p1bWprbm5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2NTA5MzMsImV4cCI6MjEwNTIyNjkzM30.2hu18FIc5dQoVIfRlPbogU2AeWTuZLF14KAD6owBJRo';

export const supabase = createClient(supabaseUrl, supabaseKey);