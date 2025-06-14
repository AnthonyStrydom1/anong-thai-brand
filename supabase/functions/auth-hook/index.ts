
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

// Global email queue with persistent tracking
const emailQueue: Array<{
  id: string;
  email: string;
  type: 'welcome' | 'reset';
  userData: any;
  timestamp: number;
  attempts: number;
}> = [];

let isProcessingQueue = false;
let lastEmailSent = 0;
const MIN_EMAIL_INTERVAL = 1500; // 1.5 seconds between emails (well under Resend's limit)

// Process email queue with guaranteed rate limiting
async function processEmailQueue() {
  if (isProcessingQueue || emailQueue.length === 0) {
    return;
  }

  isProcessingQueue = true;
  console.log(`📧 Processing email queue: ${emailQueue.length} emails pending`);

  while (emailQueue.length > 0) {
    const emailTask = emailQueue.shift();
    if (!emailTask) break;

    // Ensure minimum interval between emails
    const now = Date.now();
    const timeSinceLastEmail = now - lastEmailSent;
    
    if (timeSinceLastEmail < MIN_EMAIL_INTERVAL) {
      const delayNeeded = MIN_EMAIL_INTERVAL - timeSinceLastEmail;
      console.log(`⏱️ Waiting ${delayNeeded}ms before sending next email`);
      await new Promise(resolve => setTimeout(resolve, delayNeeded));
    }

    try {
      console.log(`📤 Sending ${emailTask.type} email to: ${emailTask.email}`);
      
      if (emailTask.type === 'welcome') {
        await sendWelcomeEmailDirect(emailTask.userData);
      } else if (emailTask.type === 'reset') {
        await sendPasswordResetEmailDirect(emailTask.userData);
      }
      
      lastEmailSent = Date.now();
      console.log(`✅ Email sent successfully to: ${emailTask.email}`);
      
    } catch (error: any) {
      console.error(`❌ Failed to send email to ${emailTask.email}:`, error.message);
      
      // Retry logic for failed emails
      if (emailTask.attempts < 3 && !error.message?.includes('rate limit')) {
        emailTask.attempts++;
        emailTask.timestamp = Date.now();
        emailQueue.push(emailTask); // Re-queue for retry
        console.log(`🔄 Re-queued email for retry (attempt ${emailTask.attempts})`);
      } else {
        console.log(`💀 Permanently failed email to: ${emailTask.email}`);
      }
    }

    // Small delay between iterations to prevent overwhelming
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  isProcessingQueue = false;
  console.log('📪 Email queue processing completed');
}

// Queue email for later processing
function queueEmail(email: string, type: 'welcome' | 'reset', userData: any) {
  const emailTask = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    email,
    type,
    userData,
    timestamp: Date.now(),
    attempts: 0
  };
  
  emailQueue.push(emailTask);
  console.log(`📮 Queued ${type} email for: ${email} (Queue size: ${emailQueue.length})`);
  
  // Start processing if not already running
  setTimeout(() => processEmailQueue(), 0);
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

    // Handle different auth events by queuing emails
    switch (hookData.event) {
      case 'user.created':
        console.log('👤 User created event - queuing welcome email');
        queueEmail(hookData.user.email, 'welcome', hookData.user);
        break;
        
      case 'user.confirmation.requested':
        console.log('📧 User confirmation requested - queuing welcome email');
        queueEmail(hookData.user.email, 'welcome', hookData.user);
        break;
        
      case 'user.password_recovery.requested':
        console.log('🔑 Password recovery requested - queuing reset email');
        queueEmail(hookData.user.email, 'reset', hookData.user);
        break;
        
      default:
        console.log('ℹ️ Unhandled auth event:', hookData.event);
    }

    // Always return success immediately - NEVER block auth
    return new Response(JSON.stringify({ 
      success: true,
      message: "Authentication processed successfully",
      email_status: "queued",
      queue_size: emailQueue.length
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
    
  } catch (error: any) {
    console.error("❌ Error in auth hook:", error);
    
    // CRITICAL: Never fail the auth process
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Authentication successful",
        warning: "Email processing will be handled separately" 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

// Direct email sending functions (no rate limiting here - handled by queue)
async function sendWelcomeEmailDirect(user: any) {
  const firstName = user.user_metadata?.first_name || 'there';
  
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
  
  return result;
}

async function sendPasswordResetEmailDirect(user: any) {
  const firstName = user.user_metadata?.first_name || 'there';
  
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
  
  return result;
}

serve(handler);
