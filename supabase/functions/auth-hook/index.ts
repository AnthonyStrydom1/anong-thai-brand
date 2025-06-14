
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

    // Handle different auth events
    switch (hookData.event) {
      case 'user.created':
        await sendWelcomeEmail(hookData.user);
        break;
      case 'user.confirmation.requested':
        await sendConfirmationEmail(hookData.user);
        break;
      case 'user.password_recovery.requested':
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
  
  await resend.emails.send({
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
}

async function sendConfirmationEmail(user: any) {
  const firstName = user.user_metadata?.first_name || 'there';
  
  // Generate confirmation link (you may need to customize this based on your setup)
  const confirmationUrl = `${Deno.env.get('SUPABASE_URL')}/auth/v1/verify?token=${user.email}&type=signup&redirect_to=${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '.vercel.app') || 'https://your-domain.com'}`;
  
  await resend.emails.send({
    from: "Anong Thai <onboarding@resend.dev>",
    to: [user.email],
    subject: "Confirm your email address",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #d4af37;">Confirm Your Email Address</h1>
        <p>Hi ${firstName},</p>
        <p>Please confirm your email address by clicking the button below:</p>
        <p style="margin: 30px 0;">
          <a href="${confirmationUrl}" 
             style="background-color: #d4af37; color: #1a1a1a; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
            Confirm Email Address
          </a>
        </p>
        <p style="color: #666; font-size: 14px;">
          If you didn't create an account with us, please ignore this email.
        </p>
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          Best regards,<br>
          The Anong Thai Team
        </p>
      </div>
    `,
  });
}

async function sendPasswordResetEmail(user: any) {
  const firstName = user.user_metadata?.first_name || 'there';
  
  await resend.emails.send({
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
}

serve(handler);
