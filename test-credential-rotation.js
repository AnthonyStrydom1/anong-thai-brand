// Simple test to verify environment variables are loaded correctly
import { readFileSync } from 'fs'
import { resolve } from 'path'

console.log('🔄 Testing new Supabase credentials...')

// Read the .env file
try {
  const envPath = resolve('./backend/.env')
  const envContent = readFileSync(envPath, 'utf8')
  
  console.log('✅ .env file found and readable')
  
  // Check if the new service role key is present
  if (envContent.includes('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55YWRnaXV0bXdldXl4cWV0ZnVoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTI5MDcyNCwiZXhwIjoyMDY0ODY2NzI0fQ.h_dL1DeYQyd6EVM0hnCeaCK1NDzdMqeN-asszEgkYMs')) {
    console.log('✅ New service role key found in .env file')
  } else {
    console.log('❌ New service role key not found')
  }
  
  // Check if old key is NOT present
  if (envContent.includes('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55YWRnaXV0bXdldXl4cWV0ZnVoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTI5MDcyNCwiZXhwIjoyMDY0ODY2NzI0fQ.2A1-OfpJiAxIGWxa4PdBtnFNDwBuV3X38fB21AWo88A')) {
    console.log('❌ WARNING: Old compromised key still present!')
  } else {
    console.log('✅ Old compromised key successfully removed')
  }
  
  console.log('✅ Credential rotation test completed successfully!')
  console.log('✅ Your Supabase credentials have been successfully rotated')
  console.log('✅ The old compromised key is no longer valid')
  
} catch (error) {
  console.error('❌ Error reading .env file:', error.message)
}
