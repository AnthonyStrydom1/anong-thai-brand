
import { createClient } from '@supabase/supabase-js';

// UPDATED: Fresh Supabase credentials (June 18, 2025)
const supabaseUrl = 'https://nyadgiutmweuyxqetfuh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55YWRnaXV0bXdldXl4cWV0ZnVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNzM0OTksImV4cCI6MjA2NTg0OTQ5OX0.VTEDEpoDtq_C_gglFz8Zrs_3HsX43VM3ZXsoYgTMP5c';

// Validate credentials
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing required Supabase credentials');
}

console.log('🔧 Supabase Client: Using fresh credentials (June 18, 2025)');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
