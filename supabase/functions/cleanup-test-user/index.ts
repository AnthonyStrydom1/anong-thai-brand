
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
    console.log('🧹 CleanupTestUser: Request method:', req.method);
    console.log('🧹 CleanupTestUser: Request URL:', req.url);
    
    // Validate environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('🧹 CleanupTestUser: Missing environment variables');
      throw new Error('Missing required environment variables');
    }
    
    console.log('🧹 CleanupTestUser: Environment variables OK');
    
    const supabaseAdmin = createClient(
      supabaseUrl,
      supabaseServiceKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      }
    );

    let requestBody;
    try {
      requestBody = await req.json();
      console.log('🧹 CleanupTestUser: Request body:', requestBody);
    } catch (parseError) {
      console.error('🧹 CleanupTestUser: Failed to parse request body:', parseError);
      throw new Error('Invalid request body');
    }

    const { email }: CleanupRequest = requestBody;
    
    if (!email) {
      console.error('🧹 CleanupTestUser: Email is missing from request');
      throw new Error('Email is required');
    }
    
    console.log('🧹 CleanupTestUser: Cleaning up user with email:', email);

    // Step 1: Find the auth user
    console.log('🧹 CleanupTestUser: Fetching auth users...');
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (authError) {
      console.error('🧹 CleanupTestUser: Error fetching auth users:', authError);
      throw new Error(`Failed to fetch auth users: ${authError.message}`);
    }

    console.log('🧹 CleanupTestUser: Found', authUsers?.users?.length || 0, 'auth users');
    const authUser = authUsers.users.find(user => user.email === email);
    let userId = null;

    if (authUser) {
      userId = authUser.id;
      console.log('🧹 CleanupTestUser: Found auth user with ID:', userId);
    } else {
      console.log('🧹 CleanupTestUser: No auth user found with email:', email);
    }

    // Step 2: Clean up public tables if user exists
    if (userId) {
      console.log('🧹 CleanupTestUser: Starting database cleanup for user:', userId);
      
      // Delete from user_roles
      try {
        const { error: rolesError } = await supabaseAdmin
          .from('user_roles')
          .delete()
          .eq('user_id', userId);

        if (rolesError) {
          console.error('🧹 CleanupTestUser: Error deleting user_roles:', rolesError);
        } else {
          console.log('✅ CleanupTestUser: Deleted from user_roles');
        }
      } catch (error) {
        console.error('🧹 CleanupTestUser: Exception deleting user_roles:', error);
      }

      // Delete from profiles
      try {
        const { error: profilesError } = await supabaseAdmin
          .from('profiles')
          .delete()
          .eq('id', userId);

        if (profilesError) {
          console.error('🧹 CleanupTestUser: Error deleting profiles:', profilesError);
        } else {
          console.log('✅ CleanupTestUser: Deleted from profiles');
        }
      } catch (error) {
        console.error('🧹 CleanupTestUser: Exception deleting profiles:', error);
      }

      // Delete from customers (by user_id)
      try {
        const { error: customersError } = await supabaseAdmin
          .from('customers')
          .delete()
          .eq('user_id', userId);

        if (customersError) {
          console.error('🧹 CleanupTestUser: Error deleting customers:', customersError);
        } else {
          console.log('✅ CleanupTestUser: Deleted from customers');
        }
      } catch (error) {
        console.error('🧹 CleanupTestUser: Exception deleting customers:', error);
      }

      // Delete from mfa_challenges
      try {
        const { error: mfaError } = await supabaseAdmin
          .from('mfa_challenges')
          .delete()
          .eq('user_id', userId);

        if (mfaError) {
          console.error('🧹 CleanupTestUser: Error deleting mfa_challenges:', mfaError);
        } else {
          console.log('✅ CleanupTestUser: Deleted from mfa_challenges');
        }
      } catch (error) {
        console.error('🧹 CleanupTestUser: Exception deleting mfa_challenges:', error);
      }

      // Step 3: Delete the auth user
      try {
        console.log('🧹 CleanupTestUser: Deleting auth user:', userId);
        const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(userId);

        if (deleteAuthError) {
          console.error('🧹 CleanupTestUser: Error deleting auth user:', deleteAuthError);
          throw new Error(`Failed to delete auth user: ${deleteAuthError.message}`);
        } else {
          console.log('✅ CleanupTestUser: Deleted auth user');
        }
      } catch (error) {
        console.error('🧹 CleanupTestUser: Exception deleting auth user:', error);
        throw error;
      }
    }

    // Step 4: Also clean up any customers by email (in case there are orphaned records)
    try {
      const { error: customersByEmailError } = await supabaseAdmin
        .from('customers')
        .delete()
        .eq('email', email);

      if (customersByEmailError) {
        console.error('🧹 CleanupTestUser: Error deleting customers by email:', customersByEmailError);
      } else {
        console.log('✅ CleanupTestUser: Deleted any orphaned customers by email');
      }
    } catch (error) {
      console.error('🧹 CleanupTestUser: Exception deleting customers by email:', error);
    }

    console.log('✅ CleanupTestUser: User cleanup completed successfully');
    console.log('🧹 === CleanupTestUser END ===');

    const successResponse = { 
      success: true, 
      message: `User ${email} has been completely removed from all tables`,
      userId: userId 
    };

    return new Response(JSON.stringify(successResponse), {
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

    const errorResponse = { 
      success: false, 
      error: error.message || "Failed to cleanup user",
      details: error.stack || 'No additional details'
    };

    return new Response(
      JSON.stringify(errorResponse),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
