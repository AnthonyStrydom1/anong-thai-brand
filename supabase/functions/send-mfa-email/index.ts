
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
  console.log('🚀 MFA Email Function: Request received', req.method);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    console.log('🔧 Environment check:', {
      hasSupabaseUrl: !!supabaseUrl,
      hasSupabaseKey: !!supabaseKey,
      hasResendKey: !!resendApiKey
    });

    if (!resendApiKey) {
      console.error('❌ RESEND_API_KEY is not configured');
      throw new Error('Email service not configured. Please contact support.');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const requestBody = await req.text();
    console.log('📝 Request body:', requestBody);

    const { email }: RequestBody = JSON.parse(requestBody);

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

    console.log('📧 Creating MFA challenge for email:', email);

    // Create MFA challenge using the database function
    const { data: challengeData, error: challengeError } = await supabase
      .rpc('create_mfa_challenge', { user_email: email });

    if (challengeError) {
      console.error('❌ Error creating MFA challenge:', challengeError);
      throw new Error(`Failed to create MFA challenge: ${challengeError.message}`);
    }

    if (!challengeData || challengeData.length === 0) {
      console.error('❌ No challenge data returned');
      throw new Error('Failed to generate verification code');
    }

    const mfaCode = challengeData[0].code;
    const challengeId = challengeData[0].challenge_id;

    console.log('✅ MFA challenge created:', { challengeId, codeLength: mfaCode?.length });

    // Send email using Resend
    console.log('📤 Sending email via Resend...');
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'AnongThaiBrand <onboarding@resend.dev>',
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
      }),
    });

    console.log('📧 Email response status:', emailResponse.status);

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error('❌ Resend API error:', {
        status: emailResponse.status,
        statusText: emailResponse.statusText,
        error: errorText
      });
      throw new Error(`Failed to send email: ${emailResponse.status} ${errorText}`);
    }

    const emailResult = await emailResponse.json();
    console.log('✅ Email sent successfully:', emailResult);

    const response = {
      success: true,
      challengeId: challengeId,
      message: 'Verification code sent successfully'
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
    console.error('❌ Error in send-mfa-email function:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to send verification email',
        details: 'Please try again or contact support if the issue persists'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
