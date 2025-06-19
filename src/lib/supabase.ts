// EMERGENCY PRODUCTION SUPABASE CLIENT - HARDCODED CREDENTIALS
import { createClient } from '@supabase/supabase-js';

// HARDCODED CREDENTIALS FOR PRODUCTION DEPLOYMENT
const supabaseUrl = 'https://nyadgiutmweuyxqetfuh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55YWRnaXV0bXdldXl4cWV0ZnVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyOTA3MjQsImV4cCI6MjA2NDg2NjcyNH0.2A1-OfpJiAxIGWxa4PdBtnFNDwBuV3X38fB21AWo88A';

console.log('🔧 Emergency Supabase Lib: Using hardcoded production credentials');
console.log('📍 URL:', supabaseUrl);
console.log('🔑 Key prefix:', supabaseAnonKey?.substring(0, 20) + '...');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);