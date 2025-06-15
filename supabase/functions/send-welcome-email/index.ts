
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import React from "npm:react@18.3.1";
import { WelcomeEmail } from "./_templates/welcome-email.tsx";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  customerName: string;
  customerEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('👋 === WelcomeEmail.sendWelcomeEmail START ===');
    
    const { customerName, customerEmail }: WelcomeEmailRequest = await req.json();
    
    console.log('👋 WelcomeEmail: Received request:', {
      customerName,
      customerEmail,
      timestamp: new Date().toISOString()
    });

    // Check if Resend API key is available
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    console.log('👋 WelcomeEmail: Resend API key available:', !!resendApiKey);
    if (!resendApiKey) {
      console.error('❌ WelcomeEmail: RESEND_API_KEY is missing from environment variables');
      throw new Error('RESEND_API_KEY is not configured');
    }

    // Validate required data
    if (!customerEmail) {
      console.error('👋 WelcomeEmail: Customer email is missing');
      throw new Error('Customer email is missing');
    }

    if (!customerName) {
      console.error('👋 WelcomeEmail: Customer name is missing');
      throw new Error('Customer name is missing');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      console.error('👋 WelcomeEmail: Invalid email format:', customerEmail);
      throw new Error('Invalid email format');
    }

    console.log('👋 WelcomeEmail: Validation passed, rendering email template...');

    // Create login URL - using the current domain
    const loginUrl = "https://anongthaibrand.com/auth";

    // Render the email template
    const emailHtml = await renderAsync(
      React.createElement(WelcomeEmail, {
        customerName,
        loginUrl,
      })
    );

    console.log('👋 WelcomeEmail: Email template rendered successfully');
    console.log('👋 WelcomeEmail: Email HTML length:', emailHtml.length);

    console.log('👋 WelcomeEmail: Attempting to send email via Resend...');
    console.log('👋 WelcomeEmail: Email details:', {
      from: "Anong Thai Brand <welcome@anongthaibrand.com>",
      to: customerEmail,
      subject: "Welcome to Anong Thai Brand! 🙏"
    });

    // Send the email using your verified domain
    const result = await resend.emails.send({
      from: "Anong Thai Brand <welcome@anongthaibrand.com>",
      to: [customerEmail],
      subject: "Welcome to Anong Thai Brand! 🙏",
      html: emailHtml,
    });

    console.log('👋 WelcomeEmail: Email sent via Resend - Full response:', JSON.stringify(result, null, 2));
    
    if (result.error) {
      console.error('❌ WelcomeEmail: Resend returned error:', result.error);
      throw new Error(`Resend error: ${JSON.stringify(result.error)}`);
    }

    if (result.data) {
      console.log('✅ WelcomeEmail: Email sent successfully with ID:', result.data.id);
    }

    console.log('✅ WelcomeEmail: Welcome email process completed successfully');
    console.log('👋 === WelcomeEmail.sendWelcomeEmail END ===');

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Welcome email sent successfully",
      messageId: result.data?.id,
      recipient: customerEmail
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('❌ === WelcomeEmail ERROR ===');
    console.error('❌ WelcomeEmail: Error in sendWelcomeEmail:', error);
    console.error('❌ WelcomeEmail: Error details:', {
      message: error?.message || 'Unknown error message',
      stack: error?.stack || 'No stack trace available',
      errorType: typeof error,
      errorName: error?.name || 'Unknown error name',
      errorCode: error?.code || 'No error code'
    });
    console.error('❌ === WelcomeEmail ERROR END ===');

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to send welcome email",
        details: error.toString()
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
