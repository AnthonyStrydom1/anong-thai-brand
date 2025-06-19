/**
 * EMERGENCY SUPABASE CLIENT
 * Simplified client with direct credentials for immediate testing
 */

import { createClient } from '@supabase/supabase-js';

// Get environment variables with fallbacks for debugging
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nyadgiutmweuyxqetfuh.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55YWRnaXV0bXdldXl4cWV0ZnVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNzM0OTksImV4cCI6MjA2NTg0OTQ5OX0.VTEDEpoDtq_C_gglFz8Zrs_3HsX43VM3ZXsoYgTMP5c';

console.log('🚨 EMERGENCY SUPABASE CLIENT');
console.log('Environment URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Environment Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
console.log('Using URL:', supabaseUrl);
console.log('Using Key prefix:', supabaseKey.substring(0, 20) + '...');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  throw new Error('Missing Supabase credentials');
}

// Create client with enhanced configuration
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'emergency-client'
    }
  }
});

// Test connection immediately
supabase.from('products').select('count(*)', { count: 'exact', head: true })
  .then(({ data, error }) => {
    if (error) {
      console.error('❌ Supabase connection test failed:', error);
    } else {
      console.log('✅ Supabase connection test successful');
    }
  })
  .catch(err => {
    console.error('❌ Supabase connection error:', err);
  });

export default supabase;
