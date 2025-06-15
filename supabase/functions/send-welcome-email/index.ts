
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

    console.log('👋 WelcomeEmail: Email template rendered, sending email...');

    // Send the email
    const result = await resend.emails.send({
      from: "Anong Thai Brand <onboarding@resend.dev>",
      to: [customerEmail],
      subject: "Welcome to Anong Thai Brand! 🙏",
      html: emailHtml,
    });

    console.log('👋 WelcomeEmail: Email sent successfully:', result);
    console.log('✅ WelcomeEmail: Welcome email process completed successfully');
    console.log('👋 === WelcomeEmail.sendWelcomeEmail END ===');

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Welcome email sent successfully",
      messageId: result.data?.id 
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
      errorName: error?.name || 'Unknown error name'
    });
    console.error('❌ === WelcomeEmail ERROR END ===');

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to send welcome email" 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
