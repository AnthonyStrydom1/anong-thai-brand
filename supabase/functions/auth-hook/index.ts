
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
    
    console.log('Auth hook triggered:', hookData);
    console.log('Event type:', hookData.event);
    console.log('User email:', hookData.user.email);
    console.log('Email confirmed at:', hookData.user.email_confirmed_at);

    // Handle different auth events
    switch (hookData.event) {
      case 'user.created':
        // Send account confirmation email when user signs up
        console.log('New user created, sending confirmation email for:', hookData.user.email);
        await sendAccountConfirmationEmail(hookData.user);
        break;
      case 'user.confirmation.requested':
        // Alternative event name for confirmation requests
        console.log('User confirmation requested for:', hookData.user.email);
        await sendAccountConfirmationEmail(hookData.user);
        break;
      case 'user.password_recovery.requested':
        console.log('Password recovery requested for:', hookData.user.email);
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
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

async function sendAccountConfirmationEmail(user: any) {
  const firstName = user.user_metadata?.first_name || 'there';
  
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
            <a href="${getAppUrl()}/shop" 
               style="background-color: #d4af37; color: #1a1a1a; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Start Shopping
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
    console.log('Account confirmation email sent successfully:', result);
  } catch (error) {
    console.error('Failed to send account confirmation email:', error);
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
            <a href="${getAppUrl()}/auth" 
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

function getAppUrl(): string {
  // Try to get the app URL from various sources
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  if (supabaseUrl) {
    // Convert Supabase URL to likely app URL
    return supabaseUrl.replace('.supabase.co', '.vercel.app');
  }
  
  // Fallback to a default URL
  return 'https://your-domain.com';
}

serve(handler);
