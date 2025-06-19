
import React, { useEffect, useState } from 'react';

const DebugPage = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [supabaseTest, setSupabaseTest] = useState<string>('');

  const addLog = (message: string) => {
    console.log(message);
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    const runTests = async () => {
      addLog('🔧 STARTING EMERGENCY DEBUG');
      addLog('================================');

      // Test 1: Environment variables
      addLog('📍 Testing environment variables...');
      addLog(`VITE_SUPABASE_URL: ${import.meta.env.VITE_SUPABASE_URL || 'MISSING'}`);
      addLog(`VITE_SUPABASE_ANON_KEY: ${import.meta.env.VITE_SUPABASE_ANON_KEY ? 'EXISTS' : 'MISSING'}`);
      
      if (import.meta.env.VITE_SUPABASE_ANON_KEY) {
        addLog(`Key preview: ${import.meta.env.VITE_SUPABASE_ANON_KEY.substring(0, 30)}...`);
      }

      // Test 2: Import emergency client
      try {
        addLog('🔧 Importing emergency Supabase client...');
        const { emergencySupabase } = await import('@/lib/emergency-supabase');
        addLog('✅ Emergency client imported successfully');

        // Test 3: Connection test
        addLog('🔗 Testing Supabase connection...');
        const { data, error } = await emergencySupabase
          .from('products')
          .select('count(*)', { count: 'exact', head: true });

        if (error) {
          addLog(`❌ Connection failed: ${error.message}`);
          setSupabaseTest(`ERROR: ${error.message}`);
        } else {
          addLog('✅ Connection successful!');
          setSupabaseTest('SUCCESS: Connected to Supabase');
        }

        // Test 4: Auth test
        addLog('👤 Testing auth status...');
        const { data: authData, error: authError } = await emergencySupabase.auth.getUser();
        if (authError) {
          addLog(`⚠️ Auth error: ${authError.message}`);
        } else {
          addLog(`👤 Auth status: ${authData.user ? `Logged in as ${authData.user.email}` : 'Not logged in'}`);
        }

      } catch (error: any) {
        addLog(`❌ Critical error: ${error.message}`);
        setSupabaseTest(`CRITICAL ERROR: ${error.message}`);
      }

      addLog('================================');
      addLog('🔧 DEBUG COMPLETE');
    };

    runTests();
  }, []);

  const testLogin = async () => {
    try {
      addLog('🔐 Testing login...');
      const { emergencySupabase } = await import('@/lib/emergency-supabase');
      
      const { data, error } = await emergencySupabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'testpassword'
      });

      if (error) {
        addLog(`❌ Login failed: ${error.message}`);
      } else {
        addLog('✅ Login successful!');
      }
    } catch (error: any) {
      addLog(`❌ Login error: ${error.message}`);
    }
  };

  const testProducts = async () => {
    try {
      addLog('📦 Testing product loading...');
      const { emergencySupabase } = await import('@/lib/emergency-supabase');
      
      const { data, error } = await emergencySupabase
        .from('products')
        .select('*')
        .limit(5);

      if (error) {
        addLog(`❌ Products failed: ${error.message}`);
      } else {
        addLog(`✅ Products loaded: ${data?.length || 0} items`);
      }
    } catch (error: any) {
      addLog(`❌ Products error: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>🚨 Emergency Supabase Debug</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Connection Status:</h2>
        <div style={{ 
          padding: '10px', 
          backgroundColor: supabaseTest.includes('SUCCESS') ? '#d4edda' : '#f8d7da',
          border: '1px solid',
          borderRadius: '4px'
        }}>
          {supabaseTest || 'Testing...'}
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={testLogin} style={{ marginRight: '10px', padding: '10px' }}>
          Test Login
        </button>
        <button onClick={testProducts} style={{ padding: '10px' }}>
          Test Products
        </button>
      </div>

      <div>
        <h2>Debug Logs:</h2>
        <div style={{ 
          height: '400px', 
          overflow: 'auto', 
          backgroundColor: '#f8f9fa', 
          padding: '10px',
          border: '1px solid #ccc'
        }}>
          {logs.map((log, index) => (
            <div key={index} style={{ marginBottom: '5px' }}>
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DebugPage;
