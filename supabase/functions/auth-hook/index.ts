
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

// Circuit breaker state - stops all email sending when rate limited
let isCircuitBreakerOpen = false;
let circuitBreakerResetTime = 0;
const CIRCUIT_BREAKER_TIMEOUT = 60000; // 1 minute

// Much more conservative rate limiting
let lastEmailSent = 0;
const MIN_EMAIL_INTERVAL = 3000; // 3 seconds between emails (very conservative)

// Simple email queue
const emailQueue: Array<{
  id: string;
  email: string;
  type: 'welcome' | 'reset';
  userData: any;
  timestamp: number;
}> = [];

let isProcessing = false;

// Check and reset circuit breaker if timeout has passed
function checkCircuitBreaker() {
  if (isCircuitBreakerOpen && Date.now() > circuitBreakerResetTime) {
    console.log('🔄 Circuit breaker reset - resuming email sending');
    isCircuitBreakerOpen = false;
  }
}

// Process email queue with very conservative rate limiting
async function processEmailQueue() {
  if (isProcessing || emailQueue.length === 0) {
    return;
  }

  checkCircuitBreaker();
  
  if (isCircuitBreakerOpen) {
    console.log('⚡ Circuit breaker open - skipping email processing');
    return;
  }

  isProcessing = true;
  console.log(`📧 Processing email queue: ${emailQueue.length} emails pending`);

  // Process only ONE email at a time
  const emailTask = emailQueue.shift();
  if (!emailTask) {
    isProcessing = false;
    return;
  }

  try {
    const now = Date.now();
    const timeSinceLastEmail = now - lastEmailSent;
    
    // Ensure minimum 3 second interval
    if (timeSinceLastEmail < MIN_EMAIL_INTERVAL) {
      const delayNeeded = MIN_EMAIL_INTERVAL - timeSinceLastEmail;
      console.log(`⏱️ Rate limiting: waiting ${delayNeeded}ms before sending email`);
      await new Promise(resolve => setTimeout(resolve, delayNeeded));
    }

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
    
    // Check if this is a rate limit error
    if (error.message?.toLowerCase().includes('rate limit') || 
        error.message?.toLowerCase().includes('too many requests')) {
      console.log('🚨 Rate limit detected - opening circuit breaker');
      isCircuitBreakerOpen = true;
      circuitBreakerResetTime = Date.now() + CIRCUIT_BREAKER_TIMEOUT;
      
      // Put the email back in queue for later
      emailQueue.unshift(emailTask);
    } else {
      console.log(`💀 Email permanently failed for: ${emailTask.email}`);
    }
  }

  isProcessing = false;
  
  // Schedule next processing if queue has more items
  if (emailQueue.length > 0) {
    console.log(`📮 Scheduling next email processing in ${MIN_EMAIL_INTERVAL}ms`);
    setTimeout(() => processEmailQueue(), MIN_EMAIL_INTERVAL);
  } else {
    console.log('📪 Email queue processing completed');
  }
}

// Queue email with deduplication
function queueEmail(email: string, type: 'welcome' | 'reset', userData: any) {
  // Simple deduplication - don't queue same email+type combination
  const existingEmail = emailQueue.find(item => 
    item.email === email && item.type === type
  );
  
  if (existingEmail) {
    console.log(`📮 Email already queued for: ${email} (${type})`);
    return;
  }
  
  const emailTask = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    email,
    type,
    userData,
    timestamp: Date.now()
  };
  
  emailQueue.push(emailTask);
  console.log(`📮 Queued ${type} email for: ${email} (Queue size: ${emailQueue.length})`);
  
  // Start processing with delay to avoid immediate execution
  setTimeout(() => processEmailQueue(), 1000);
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
      timestamp: new Date().toISOString(),
      circuitBreakerOpen: isCircuitBreakerOpen,
      queueSize: emailQueue.length
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
      email_status: isCircuitBreakerOpen ? "circuit_breaker_open" : "queued",
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

// Direct email sending functions
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
