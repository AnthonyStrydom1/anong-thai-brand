
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CleanupRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🧹 === CleanupTestUser START ===');
    
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      }
    );

    const { email }: CleanupRequest = await req.json();
    
    console.log('🧹 CleanupTestUser: Cleaning up user with email:', email);

    // Step 1: Find the auth user
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (authError) {
      console.error('🧹 CleanupTestUser: Error fetching auth users:', authError);
      throw authError;
    }

    const authUser = authUsers.users.find(user => user.email === email);
    let userId = null;

    if (authUser) {
      userId = authUser.id;
      console.log('🧹 CleanupTestUser: Found auth user with ID:', userId);
    }

    // Step 2: Clean up public tables if user exists
    if (userId) {
      // Delete from user_roles
      const { error: rolesError } = await supabaseAdmin
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (rolesError) {
        console.error('🧹 CleanupTestUser: Error deleting user_roles:', rolesError);
      } else {
        console.log('✅ CleanupTestUser: Deleted from user_roles');
      }

      // Delete from profiles
      const { error: profilesError } = await supabaseAdmin
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profilesError) {
        console.error('🧹 CleanupTestUser: Error deleting profiles:', profilesError);
      } else {
        console.log('✅ CleanupTestUser: Deleted from profiles');
      }

      // Delete from customers (by user_id)
      const { error: customersError } = await supabaseAdmin
        .from('customers')
        .delete()
        .eq('user_id', userId);

      if (customersError) {
        console.error('🧹 CleanupTestUser: Error deleting customers:', customersError);
      } else {
        console.log('✅ CleanupTestUser: Deleted from customers');
      }

      // Delete from mfa_challenges
      const { error: mfaError } = await supabaseAdmin
        .from('mfa_challenges')
        .delete()
        .eq('user_id', userId);

      if (mfaError) {
        console.error('🧹 CleanupTestUser: Error deleting mfa_challenges:', mfaError);
      } else {
        console.log('✅ CleanupTestUser: Deleted from mfa_challenges');
      }

      // Step 3: Delete the auth user
      const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(userId);

      if (deleteAuthError) {
        console.error('🧹 CleanupTestUser: Error deleting auth user:', deleteAuthError);
        throw deleteAuthError;
      } else {
        console.log('✅ CleanupTestUser: Deleted auth user');
      }
    }

    // Step 4: Also clean up any customers by email (in case there are orphaned records)
    const { error: customersByEmailError } = await supabaseAdmin
      .from('customers')
      .delete()
      .eq('email', email);

    if (customersByEmailError) {
      console.error('🧹 CleanupTestUser: Error deleting customers by email:', customersByEmailError);
    } else {
      console.log('✅ CleanupTestUser: Deleted any orphaned customers by email');
    }

    console.log('✅ CleanupTestUser: User cleanup completed successfully');
    console.log('🧹 === CleanupTestUser END ===');

    return new Response(JSON.stringify({ 
      success: true, 
      message: `User ${email} has been completely removed from all tables`,
      userId: userId 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('❌ === CleanupTestUser ERROR ===');
    console.error('❌ CleanupTestUser: Error cleaning up user:', error);
    console.error('❌ CleanupTestUser: Error details:', {
      message: error?.message || 'Unknown error message',
      stack: error?.stack || 'No stack trace available',
      errorType: typeof error,
      errorName: error?.name || 'Unknown error name'
    });
    console.error('❌ === CleanupTestUser ERROR END ===');

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to cleanup user" 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
