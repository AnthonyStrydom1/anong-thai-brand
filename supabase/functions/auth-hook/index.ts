
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

// Enhanced rate limiting with timestamps
const emailTimestamps: number[] = [];
const MAX_EMAILS_PER_SECOND = 1; // Conservative limit (less than Resend's 2/sec)
const RATE_LIMIT_WINDOW = 1000; // 1 second

// Clean old timestamps
const cleanTimestamps = () => {
  const now = Date.now();
  while (emailTimestamps.length > 0 && emailTimestamps[0] < now - RATE_LIMIT_WINDOW) {
    emailTimestamps.shift();
  }
};

// Check if we can send an email now
const canSendEmail = (): boolean => {
  cleanTimestamps();
  return emailTimestamps.length < MAX_EMAILS_PER_SECOND;
};

// Add timestamp when sending email
const recordEmailSent = () => {
  emailTimestamps.push(Date.now());
};

// Calculate delay needed before next email
const getDelayUntilNextSlot = (): number => {
  cleanTimestamps();
  if (emailTimestamps.length === 0) return 0;
  
  const oldestTimestamp = emailTimestamps[0];
  const timeSinceOldest = Date.now() - oldestTimestamp;
  return Math.max(0, RATE_LIMIT_WINDOW - timeSinceOldest + 100); // Add 100ms buffer
};

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
        // Don't block auth process - send email in background
        sendEmailWithRateLimit(() => sendWelcomeEmail(hookData.user));
        break;
      case 'user.confirmation.requested':
        console.log('Handling user.confirmation.requested event for:', hookData.user.email);
        sendEmailWithRateLimit(() => sendWelcomeEmail(hookData.user));
        break;
      case 'user.password_recovery.requested':
        console.log('Handling password recovery for:', hookData.user.email);
        sendEmailWithRateLimit(() => sendPasswordResetEmail(hookData.user));
        break;
      default:
        console.log('Unhandled auth event:', hookData.event);
    }

    // Always return success immediately - never block auth
    return new Response(JSON.stringify({ 
      success: true,
      message: "Authentication processed successfully",
      email_status: "queued"
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in auth hook:", error);
    console.error("Error stack:", error.stack);
    
    // Never fail the auth process - always return success
    return new Response(
      JSON.stringify({ 
        success: true, 
        warning: "Authentication successful, email processing encountered an issue" 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

// Background email sending with rate limiting
async function sendEmailWithRateLimit(emailFunction: () => Promise<void>) {
  // Use setTimeout to not block the response
  setTimeout(async () => {
    try {
      // Check if we can send immediately
      if (canSendEmail()) {
        console.log('📧 Sending email immediately');
        recordEmailSent();
        await emailFunction();
      } else {
        // Calculate delay and wait
        const delay = getDelayUntilNextSlot();
        console.log(`⏱️ Rate limit active, delaying email by ${delay}ms`);
        
        setTimeout(async () => {
          try {
            recordEmailSent();
            await emailFunction();
          } catch (error: any) {
            console.error('❌ Delayed email failed:', error);
          }
        }, delay);
      }
    } catch (error: any) {
      console.error('❌ Email rate limit handler failed:', error);
    }
  }, 0);
}

async function sendWelcomeEmail(user: any) {
  const firstName = user.user_metadata?.first_name || 'there';
  
  console.log('Attempting to send welcome email to:', user.email);
  
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
            <a href="https://anongthaibrand.com" 
               style="background-color: #d4af37; color: #1a1a1a; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Visit Our Store
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
    console.log('✅ Welcome email sent successfully:', result);
  } catch (error: any) {
    console.error('❌ Failed to send welcome email:', error);
    
    // If it's a rate limit error, log it but don't throw
    if (error.message?.includes('rate limit') || error.message?.includes('429')) {
      console.log('⚠️ Email rate limited, but auth process continues');
    } else {
      throw error;
    }
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
    console.log('✅ Password reset email sent successfully:', result);
  } catch (error: any) {
    console.error('❌ Failed to send password reset email:', error);
    
    // If it's a rate limit error, log it but don't throw
    if (error.message?.includes('rate limit') || error.message?.includes('429')) {
      console.log('⚠️ Email rate limited, but auth process continues');
    } else {
      throw error;
    }
  }
}

serve(handler);
