
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import React from 'npm:react@18.3.1'
import { MfaVerificationEmail } from './_templates/mfa-verification.tsx'

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
      resendKeyLength: resendApiKey ? resendApiKey.length : 0,
      resendKeyStart: resendApiKey ? resendApiKey.substring(0, 8) + '...' : 'missing'
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

    // Render the React email template
    console.log('🎨 Rendering branded MFA email template...');
    const html = await renderAsync(
      React.createElement(MfaVerificationEmail, {
        verificationCode: mfaCode
      })
    );

    // Send email using Resend API
    console.log('📤 Preparing to send branded email via Resend API...');
    
    const emailPayload = {
      from: 'ANONG Thai Kitchen <noreply@anongthaibrand.com>',
      to: [email],
      subject: 'Your ANONG Verification Code - Welcome to Authentic Thai Flavors!',
      html,
    };

    console.log('📧 Email payload prepared:', {
      from: emailPayload.from,
      to: emailPayload.to,
      subject: emailPayload.subject,
      htmlLength: emailPayload.html.length
    });

    try {
      console.log('🌐 Making Resend API request...');
      console.log('🔑 Using API key (first 8 chars):', resendApiKey.substring(0, 8) + '...');
      
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailPayload),
      });

      console.log('📧 Resend API response received:', {
        status: emailResponse.status,
        statusText: emailResponse.statusText,
        ok: emailResponse.ok,
        headers: Object.fromEntries(emailResponse.headers.entries())
      });

      const responseText = await emailResponse.text();
      console.log('📧 Resend API raw response:', responseText);

      if (!emailResponse.ok) {
        console.error('❌ Resend API error response:', {
          status: emailResponse.status,
          statusText: emailResponse.statusText,
          body: responseText
        });
        throw new Error(`Resend API error (${emailResponse.status}): ${responseText}`);
      }

      let emailResult;
      try {
        emailResult = JSON.parse(responseText);
        console.log('✅ Branded MFA email sent successfully:', emailResult);
      } catch (parseError) {
        console.error('❌ Failed to parse Resend response as JSON:', parseError);
        console.log('📄 Raw response text:', responseText);
        throw new Error('Invalid response from email service');
      }

      const response = {
        success: true,
        challengeId: challengeId,
        message: 'Branded verification code sent successfully',
        debug: {
          emailSent: true,
          emailId: emailResult.id,
          challengeCreated: true,
          resendResponse: emailResult
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

    } catch (emailError) {
      console.error('❌ Email sending failed with detailed error:', {
        message: emailError.message,
        stack: emailError.stack,
        name: emailError.name,
        cause: emailError.cause
      });
      throw new Error(`Failed to send verification email: ${emailError.message}`);
    }

  } catch (error: any) {
    console.error('❌ Critical error in send-mfa-email function:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      cause: error.cause,
      fullError: error
    });
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to send verification email',
        details: 'Check edge function logs for more information',
        debug: {
          timestamp: new Date().toISOString(),
          errorType: error.name,
          errorMessage: error.message
        }
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
