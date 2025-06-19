/**
 * EMERGENCY DEBUG SCRIPT
 * Test Supabase connection and environment variables
 */

console.log('🔧 EMERGENCY SUPABASE CONNECTION TEST');
console.log('=====================================');

// 1. Check environment variables
console.log('📍 Environment Variables:');
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY (first 20 chars):', import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20) + '...');

// 2. Test Supabase client creation
try {
  const { supabase } = await import('@/integrations/supabase/client');
  console.log('✅ Supabase client created successfully');
  
  // 3. Test basic connection
  const { data, error } = await supabase
    .from('products')
    .select('count(*)', { count: 'exact', head: true });
    
  if (error) {
    console.error('❌ Supabase connection test failed:', error);
  } else {
    console.log('✅ Supabase connection test successful');
    console.log('📊 Products count:', data);
  }
  
  // 4. Test authentication status
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) {
    console.log('⚠️ Auth check error:', authError.message);
  } else {
    console.log('👤 Current user:', user ? user.email : 'Not logged in');
  }
  
} catch (error) {
  console.error('❌ Critical error:', error);
}

console.log('=====================================');
