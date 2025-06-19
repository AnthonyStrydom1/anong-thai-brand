// PRODUCTION SUPABASE CLIENT - USING ENVIRONMENT VARIABLES
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Get environment variables with fallbacks for production
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nyadgiutmweuyxqetfuh.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55YWRnaXV0bXdldXl4cWV0ZnVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyOTA3MjQsImV4cCI6MjA2NDg2NjcyNH0.2A1-OfpJiAxIGWxa4PdBtnFNDwBuV3X38fB21AWo88A';

// Debug logging to verify credentials
console.log('🔧 Supabase Client Debug:');
console.log('- URL from env:', import.meta.env.VITE_SUPABASE_URL);
console.log('- Key from env:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Present' : 'Missing');
console.log('- Using URL:', supabaseUrl);
console.log('- Using Key:', supabaseKey ? 'Present' : 'Missing');

// Validate credentials before creating client
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials:', {
    url: !!supabaseUrl,
    key: !!supabaseKey,
    envVars: Object.keys(import.meta.env).filter(k => k.startsWith('VITE_'))
  });
  throw new Error('Missing required Supabase credentials. Please check your .env file contains:\n- VITE_SUPABASE_URL\n- VITE_SUPABASE_ANON_KEY');
}

console.log('✅ Supabase credentials validated');

// Enhanced client configuration
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    storage: localStorage,
    storageKey: 'supabase.auth.token',
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'x-client-info': 'supabase-js-web'
    }
  },
  db: {
    schema: 'public'
  }
});