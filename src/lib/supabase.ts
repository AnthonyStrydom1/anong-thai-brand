
import { createClient } from '@supabase/supabase-js';

// Use environment variables for credentials with fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nyadgiutmweuyxqetfuh.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55YWRnaXV0bXdldXl4cWV0ZnVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyOTA3MjQsImV4cCI6MjA2NDg2NjcyNH0.2A1-OfpJiAxIGWxa4PdBtnFNDwBuV3X38fB21AWo88A';

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
