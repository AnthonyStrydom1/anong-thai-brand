// EMERGENCY PRODUCTION SUPABASE CLIENT - HARDCODED CREDENTIALS
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// HARDCODED CREDENTIALS FOR PRODUCTION DEPLOYMENT
const SUPABASE_URL = 'https://nyadgiutmweuyxqetfuh.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55YWRnaXV0bXdldXl4cWV0ZnVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyOTA3MjQsImV4cCI6MjA2NDg2NjcyNH0.2A1-OfpJiAxIGWxa4PdBtnFNDwBuV3X38fB21AWo88A';

console.log('🔧 Emergency Supabase Client: Using hardcoded production credentials');
console.log('📍 URL:', SUPABASE_URL);
console.log('🔑 Key prefix:', SUPABASE_PUBLISHABLE_KEY?.substring(0, 20) + '...');

// Enhanced client configuration for better mobile support
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
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