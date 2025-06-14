
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
    user_metadata?: any;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const hookData: AuthHookRequest = await req.json();
    
    console.log('Auth hook triggered:', hookData.type, hookData.event);
    console.log('User data:', hookData.user);

    // Handle different auth events
    switch (hookData.event) {
      case 'user.created':
        console.log('Sending welcome email for user:', hookData.user.email);
        await sendWelcomeEmail(hookData.user);
        break;
      case 'user.confirmation.requested':
        console.log('Sending confirmation email for user:', hookData.user.email);
        await sendConfirmationEmail(hookData.user);
        break;
      case 'user.password_recovery.requested':
        console.log('Sending password reset email for user:', hookData.user.email);
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

async function sendWelcomeEmail(user: any) {
  const firstName = user.user_metadata?.first_name || 'there';
  
  try {
    const result = await resend.emails.send({
      from: "Anong Thai <onboarding@resend.dev>",
      to: [user.email],
      subject: "Welcome to Anong Thai!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #d4af37;">Welcome to Anong Thai, ${firstName}!</h1>
          <p>Thank you for joining our community. Your account has been successfully created.</p>
          <p>You can now start exploring our authentic Thai products and recipes.</p>
          <p style="margin-top: 30px;">
            <a href="${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '.vercel.app') || 'https://your-domain.com'}" 
               style="background-color: #d4af37; color: #1a1a1a; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
              Start Shopping
            </a>
          </p>
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Best regards,<br>
            The Anong Thai Team
          </p>
        </div>
      `,
    });
    console.log('Welcome email sent successfully:', result);
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    throw error;
  }
}

async function sendConfirmationEmail(user: any) {
  const firstName = user.user_metadata?.first_name || 'there';
  
  try {
    const result = await resend.emails.send({
      from: "Anong Thai <onboarding@resend.dev>",
      to: [user.email],
      subject: "Welcome to Anong Thai - Account Created!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #d4af37;">Account Created Successfully!</h1>
          <p>Hi ${firstName},</p>
          <p>Your Anong Thai account has been created successfully! No further confirmation is required.</p>
          <p>You can now sign in and start exploring our authentic Thai products and recipes.</p>
          <p style="margin: 30px 0;">
            <a href="${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '.vercel.app') || 'https://your-domain.com'}/auth" 
               style="background-color: #d4af37; color: #1a1a1a; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
              Sign In Now
            </a>
          </p>
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Best regards,<br>
            The Anong Thai Team
          </p>
        </div>
      `,
    });
    console.log('Confirmation email sent successfully:', result);
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
    throw error;
  }
}

async function sendPasswordResetEmail(user: any) {
  const firstName = user.user_metadata?.first_name || 'there';
  
  try {
    const result = await resend.emails.send({
      from: "Anong Thai <onboarding@resend.dev>",
      to: [user.email],
      subject: "Reset your password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #d4af37;">Reset Your Password</h1>
          <p>Hi ${firstName},</p>
          <p>You requested to reset your password. Click the button below to create a new password:</p>
          <p style="margin: 30px 0;">
            <a href="#" 
               style="background-color: #d4af37; color: #1a1a1a; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
              Reset Password
            </a>
          </p>
          <p style="color: #666; font-size: 14px;">
            If you didn't request this, please ignore this email.
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
