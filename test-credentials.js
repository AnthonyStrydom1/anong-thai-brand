// Test script to verify new Supabase credentials
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env file')
  process.exit(1)
}

if (supabaseServiceKey === 'PASTE_YOUR_NEW_SERVICE_ROLE_KEY_HERE') {
  console.error('❌ Please update .env file with your actual new service role key')
  process.exit(1)
}

console.log('🔄 Testing new Supabase credentials...')

try {
  // Create Supabase client with service role
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  // Test connection by trying to read from auth.users (requires service role)
  const { data, error } = await supabase.auth.admin.listUsers()
  
  if (error) {
    console.error('❌ Credential test failed:', error.message)
    process.exit(1)
  }
  
  console.log('✅ New credentials are working correctly!')
  console.log('✅ Service role access confirmed')
  console.log('✅ Database connection successful')
  console.log(`✅ Found ${data.users?.length || 0} users in auth system`)
  
} catch (error) {
  console.error('❌ Connection test failed:', error.message)
  process.exit(1)
}
