
import { createClient } from '@supabase/supabase-js';

// Use environment variables for credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate credentials
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing required Supabase credentials. Please check your .env file contains:\n' +
    '- VITE_SUPABASE_URL\n' +
    '- VITE_SUPABASE_ANON_KEY'
  );
}

console.log('🔧 Supabase Client: Using environment variables');
console.log('📍 URL:', supabaseUrl);
console.log('🔑 Key prefix:', supabaseAnonKey?.substring(0, 20) + '...');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
