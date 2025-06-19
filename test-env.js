// Quick environment variable test
console.log('=== ENVIRONMENT VARIABLE TEST ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

if (import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.log('Key preview:', import.meta.env.VITE_SUPABASE_ANON_KEY.substring(0, 30) + '...');
} else {
  console.error('❌ VITE_SUPABASE_ANON_KEY is missing!');
}

// Test Supabase import
try {
  const { supabase } = await import('./src/integrations/supabase/client.ts');
  console.log('✅ Supabase client imported');
  
  // Test connection
  const { data, error } = await supabase.from('products').select('count(*)').limit(1);
  if (error) {
    console.error('❌ Supabase error:', error);
  } else {
    console.log('✅ Supabase connected successfully');
  }
} catch (err) {
  console.error('❌ Import/Connection error:', err);
}
