// Debug script to test Supabase connection and products
import { createClient } from '@supabase/supabase-js';

// Create clients with both keys
const anonClient = createClient(
  'https://nyadgiutmweuyxqetfuh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55YWRnaXV0bXdldXl4cWV0ZnVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNzM0OTksImV4cCI6MjA2NTg0OTQ5OX0.VTEDEpoDtq_C_gglFz8Zrs_3HsX43VM3ZXsoYgTMP5c'
);

const serviceClient = createClient(
  'https://nyadgiutmweuyxqetfuh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55YWRnaXV0bXdldXl4cWV0ZnVoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDI3MzQ5OSwiZXhwIjoyMDY1ODQ5NDk5fQ.N4knRTBs8V0ozVDXgY4E-KkRgnZwCEb8fHTWawDGWIg'
);

async function testDatabase() {
  console.log('🔍 Testing Supabase database connection...\n');
  
  try {
    // Test 1: Service role - all products
    console.log('📊 TEST 1: Service role - all products');
    const { data: allProducts, error: allError } = await serviceClient
      .from('products')
      .select('id, name, is_active')
      .limit(5);
    
    if (allError) {
      console.log('❌ Service role error:', allError.message);
    } else {
      console.log(`✅ Found ${allProducts.length} total products:`);
      allProducts.forEach(p => console.log(`   - ${p.name}: active=${p.is_active}`));
    }
    
    console.log('\n');
    
    // Test 2: Service role - active products only
    console.log('📊 TEST 2: Service role - active products only');
    const { data: activeProducts, error: activeError } = await serviceClient
      .from('products')
      .select('id, name, is_active')
      .eq('is_active', true);
    
    if (activeError) {
      console.log('❌ Active products error:', activeError.message);
    } else {
      console.log(`✅ Found ${activeProducts.length} active products`);
    }
    
    console.log('\n');
    
    // Test 3: Anon role - active products (this is what frontend uses)
    console.log('📊 TEST 3: Anon role - active products (frontend query)');
    const { data: anonProducts, error: anonError } = await anonClient
      .from('products')
      .select('*')
      .eq('is_active', true);
    
    if (anonError) {
      console.log('❌ Anon role error:', anonError.message);
      console.log('   Full error:', anonError);
    } else {
      console.log(`✅ Anon role success: ${anonProducts.length} products`);
    }
    
    console.log('\n');
    
    // Test 4: Check if products need to be activated
    if (allProducts && allProducts.length > 0 && activeProducts && activeProducts.length === 0) {
      console.log('🔧 FIXING: Activating products...');
      const { error: updateError } = await serviceClient
        .from('products')
        .update({ is_active: true })
        .eq('is_active', false);
      
      if (updateError) {
        console.log('❌ Failed to activate products:', updateError.message);
      } else {
        console.log('✅ Products activated! Testing anon access again...');
        
        const { data: fixedProducts, error: fixedError } = await anonClient
          .from('products')
          .select('*')
          .eq('is_active', true)
          .limit(3);
        
        if (fixedError) {
          console.log('❌ Still failing:', fixedError.message);
        } else {
          console.log(`✅ SUCCESS! Anon can now access ${fixedProducts.length} products`);
        }
      }
    }
    
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  }
}

testDatabase();