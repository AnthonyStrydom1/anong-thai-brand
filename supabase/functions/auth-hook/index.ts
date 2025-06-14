
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
    
    console.log('Auth hook triggered:', JSON.stringify(hookData, null, 2));
    console.log('RESEND_API_KEY configured:', !!Deno.env.get("RESEND_API_KEY"));

    // Handle different auth events
    switch (hookData.event) {
      case 'user.created':
        console.log('Handling user.created event for:', hookData.user.email);
        await sendWelcomeEmail(hookData.user);
        break;
      case 'user.confirmation.requested':
        console.log('Handling user.confirmation.requested event for:', hookData.user.email);
        await sendWelcomeEmail(hookData.user);
        break;
      case 'user.password_recovery.requested':
        console.log('Handling password recovery for:', hookData.user.email);
        await sendPasswordResetEmail(hookData.user);
        break;
      default:
        console.log('Unhandled auth event:', hookData.event);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in auth hook:", error);
    console.error("Error stack:", error.stack);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

async function sendWelcomeEmail(user: any) {
  const firstName = user.user_metadata?.first_name || 'there';
  
  console.log('Attempting to send welcome email to:', user.email);
  console.log('Using Resend API key:', Deno.env.get("RESEND_API_KEY") ? 'Present' : 'Missing');
  
  try {
    const result = await resend.emails.send({
      from: "Anong Thai <onboarding@resend.dev>",
      to: [user.email],
      subject: "Welcome to Anong Thai - Account Created!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #d4af37;">Welcome to Anong Thai, ${firstName}!</h1>
          <p>Your account has been successfully created and is ready to use!</p>
          <p>You can now sign in and start exploring our authentic Thai products and recipes.</p>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">What's Next?</h3>
            <ul style="color: #666;">
              <li>Browse our premium Thai ingredients</li>
              <li>Discover authentic recipes</li>
              <li>Join our community of Thai food enthusiasts</li>
            </ul>
          </div>
          <p style="margin: 30px 0;">
            <a href="https://nyadgiutmweuyxqetfuh.supabase.co/auth" 
               style="background-color: #d4af37; color: #1a1a1a; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Sign In Now
            </a>
          </p>
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Best regards,<br>
            The Anong Thai Team
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">
            This email was sent because you created an account at Anong Thai. 
            If you didn't create this account, please contact our support team.
          </p>
        </div>
      `,
    });
    console.log('Welcome email sent successfully:', result);
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    console.error('Resend error details:', JSON.stringify(error, null, 2));
    throw error;
  }
}

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
            <a href="https://nyadgiutmweuyxqetfuh.supabase.co/auth" 
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
    console.log('Password reset email sent successfully:', result);
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    throw error;
  }
}

serve(handler);
