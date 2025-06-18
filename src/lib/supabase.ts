
import { createClient } from '@supabase/supabase-js';

// PRODUCTION FIX: Force new credentials (June 18, 2025)
// TODO: Revert to environment variables once production env is updated
const supabaseUrl = 'https://nyadgiutmweuyxqetfuh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55YWRnaXV0bXdldXl4cWV0ZnVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyOTA3MjQsImV4cCI6MjA2NDg2NjcyNH0.2A1-OfpJiAxIGWxa4PdBtnFNDwBuV3X38fB21AWo88A';

// Validate credentials
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing required Supabase credentials');
}

console.log('🔧 Supabase Client: Using hardcoded credentials for production fix');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
