
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  email: string;
}

serve(async (req: Request) => {
  console.log('🚀 MFA Email Function: Request received', req.method, req.url);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('📋 MFA Email Function: Handling OPTIONS request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    console.log('🔧 Environment check:', {
      hasSupabaseUrl: !!supabaseUrl,
      hasSupabaseKey: !!supabaseKey,
      hasResendKey: !!resendApiKey,
      supabaseUrl: supabaseUrl ? supabaseUrl.substring(0, 20) + '...' : 'missing',
      resendKeyLength: resendApiKey ? resendApiKey.length : 0
    });

    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Missing Supabase environment variables');
      throw new Error('Supabase configuration missing');
    }

    if (!resendApiKey) {
      console.error('❌ RESEND_API_KEY is not configured');
      throw new Error('Email service not configured. Please contact support.');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    let requestBody;
    try {
      const requestText = await req.text();
      console.log('📝 Raw request body:', requestText);
      requestBody = JSON.parse(requestText);
    } catch (parseError) {
      console.error('❌ Failed to parse request body:', parseError);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { email }: RequestBody = requestBody;

    if (!email) {
      console.error('❌ No email provided in request');
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('📧 Processing MFA challenge for email:', email);

    // Create MFA challenge using the database function
    console.log('🔍 Calling create_mfa_challenge function...');
    const { data: challengeData, error: challengeError } = await supabase
      .rpc('create_mfa_challenge', { user_email: email });

    console.log('📊 Challenge creation result:', { 
      challengeData, 
      challengeError,
      dataType: typeof challengeData,
      dataLength: Array.isArray(challengeData) ? challengeData.length : 'not array'
    });

    if (challengeError) {
      console.error('❌ Error creating MFA challenge:', challengeError);
      throw new Error(`Failed to create MFA challenge: ${challengeError.message}`);
    }

    if (!challengeData || challengeData.length === 0) {
      console.error('❌ No challenge data returned from database function');
      throw new Error('Failed to generate verification code - no data returned');
    }

    const mfaCode = challengeData[0].code;
    const challengeId = challengeData[0].challenge_id;

    console.log('✅ MFA challenge created successfully:', { 
      challengeId, 
      codeExists: !!mfaCode,
      codeLength: mfaCode?.length 
    });

    if (!mfaCode) {
      console.error('❌ No MFA code generated');
      throw new Error('Failed to generate verification code');
    }

    // Send email using Resend
    console.log('📤 Sending email via Resend API...');
    const emailPayload = {
      from: 'Anong Thai Brand <hello@anonghthaibrand.com>',
      to: [email],
      subject: 'Your Verification Code - Anong Thai Brand',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2c3e50; margin-bottom: 10px;">Anong Thai Brand</h1>
            <h2 style="color: #34495e; font-weight: normal;">Your Verification Code</h2>
          </div>
          
          <div style="background-color: #f8f9fa; border-radius: 8px; padding: 30px; text-align: center; margin: 20px 0;">
            <p style="font-size: 16px; color: #666; margin-bottom: 20px;">Your verification code is:</p>
            <div style="background-color: white; border: 2px solid #e9ecef; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #2c3e50; font-family: monospace;">${mfaCode}</span>
            </div>
            <p style="color: #dc3545; font-weight: bold; margin-top: 15px;">This code will expire in 5 minutes.</p>
          </div>
          
          <div style="background-color: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #1565c0; font-size: 14px;">
              <strong>Security Notice:</strong> If you didn't request this code, please ignore this email and consider changing your password.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              © 2024 Anong Thai Brand. This is an automated message.
            </p>
          </div>
        </div>
      `,
    };

    console.log('📬 Email payload prepared for:', email);

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload),
    });

    console.log('📧 Resend API response status:', emailResponse.status, emailResponse.statusText);

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error('❌ Resend API error details:', {
        status: emailResponse.status,
        statusText: emailResponse.statusText,
        headers: Object.fromEntries(emailResponse.headers.entries()),
        errorBody: errorText
      });
      
      throw new Error(`Failed to send email: ${emailResponse.status} - ${errorText}`);
    }

    const emailResult = await emailResponse.json();
    console.log('✅ Email sent successfully via Resend:', emailResult);

    const response = {
      success: true,
      challengeId: challengeId,
      message: 'Verification code sent successfully',
      debug: {
        emailSent: true,
        emailId: emailResult.id,
        challengeCreated: true
      }
    };

    console.log('🎯 Function completed successfully:', response);

    return new Response(
      JSON.stringify(response),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('❌ Critical error in send-mfa-email function:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      cause: error.cause
    });
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to send verification email',
        details: 'Check edge function logs for more information',
        debug: {
          timestamp: new Date().toISOString(),
          errorType: error.name
        }
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
