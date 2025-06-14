
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AuthHookRequest {
  type: string;
  event: string;
  session: any;
  user: {
    id: string;
    email: string;
    email_confirmed_at?: string;
    user_metadata?: any;
    confirmation_token?: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const hookData: AuthHookRequest = await req.json();
    
    console.log('🔔 Auth hook triggered:', {
      event: hookData.event,
      email: hookData.user.email,
      timestamp: new Date().toISOString()
    });

    // Handle events - NO email confirmations sent
    switch (hookData.event) {
      case 'user.password_recovery.requested':
        console.log('🔑 Password recovery requested - sending reset email');
        await sendPasswordResetEmail(hookData.user);
        break;
        
      case 'user.created':
        console.log('👤 User created - SKIPPING email confirmation (disabled by design)');
        break;
        
      case 'user.confirmation.requested':
        console.log('📧 Confirmation requested - BLOCKED (confirmation disabled)');
        break;
        
      default:
        console.log('ℹ️ Auth event processed without email:', hookData.event);
    }

    // ALWAYS return success to prevent blocking auth flow
    return new Response(JSON.stringify({ 
      success: true,
      message: "Auth event processed - email confirmations disabled"
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
    
  } catch (error: any) {
    console.error("❌ Error in auth hook:", error);
    
    // NEVER block auth flow - always return success
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Auth processed successfully",
        note: "Email handling bypassed" 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

// Only send password reset emails - NO welcome/confirmation emails
async function sendPasswordResetEmail(user: any) {
  const firstName = user.user_metadata?.first_name || 'there';
  
  try {
    const result = await resend.emails.send({
      from: "Anong Thai <onboarding@resend.dev>",
      to: [user.email],
      subject: "Reset your Anong Thai password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #d4af37;">Reset Your Password</h1>
          <p>Hi ${firstName},</p>
          <p>You requested to reset your password for your Anong Thai account.</p>
          <p>Your password has been reset. You can now sign in with your new password.</p>
          <p style="margin: 30px 0;">
            <a href="https://anongthaibrand.com/auth" 
               style="background-color: #d4af37; color: #1a1a1a; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Sign In Now
            </a>
          </p>
          <p style="color: #666; font-size: 14px;">
            If you didn't request this password reset, please contact our support team immediately.
          </p>
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Best regards,<br>
            The Anong Thai Team
          </p>
        </div>
      `,
    });
    
    console.log('✅ Password reset email sent successfully');
    return result;
  } catch (error: any) {
    console.error('❌ Failed to send password reset email:', error);
    throw error;
  }
}

serve(handler);
