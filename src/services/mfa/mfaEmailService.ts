import { supabase } from "@/integrations/supabase/client";
import { mfaSessionManager } from './mfaSessionManager';
import type { MFAResendResult } from './mfaTypes';

export class MFAEmailService {
  async sendMFAEmail(email: string): Promise<{ success: boolean; challengeId?: string; error?: string }> {
    console.log('📧 MFA Email Service: Sending MFA email to:', email);
    
    try {
      // First check if the user exists in auth.users before attempting MFA challenge
      console.log('🔍 MFA Email Service: Checking if user exists in auth.users...');
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error('❌ MFA Email Service: Could not check auth users:', authError);
        // Continue anyway, let the edge function handle it
      } else {
        const userExists = authUsers.users.find((u: any) => u.email?.toLowerCase() === email.toLowerCase());
        console.log('👤 MFA Email Service: User exists in auth.users:', !!userExists);
        
        if (!userExists) {
          console.log('❌ MFA Email Service: User not found in auth.users');
          return {
            success: false,
            error: 'Account not found. Please check your email address or create a new account.'
          };
        }
        
        console.log('📧 MFA Email Service: Found user with email:', userExists.email, 'ID:', userExists.id);
      }

      console.log('📤 MFA Email Service: Calling send-mfa-email edge function...');
      const { data, error } = await supabase.functions.invoke('send-mfa-email', {
        body: { email }
      });

      if (error) {
        console.error('❌ MFA Email Service: Edge function error:', error);
        
        // Provide more specific error messages based on the error
        if (error.message?.includes('User not found') || error.message?.includes('non-2xx status code')) {
          return {
            success: false,
            error: 'Account not found. Please check your email address or create a new account.'
          };
        }
        
        if (error.message?.includes('Email service not configured')) {
          return {
            success: false,
            error: 'Email service is temporarily unavailable. Please try again later.'
          };
        }
        
        return {
          success: false,
          error: 'Failed to send verification email. Please try again.'
        };
      }

      if (!data || !data.success) {
        console.error('❌ MFA Email Service: Edge function returned failure:', data);
        
        // Check for specific error messages from the edge function
        if (data?.error?.includes('User not found')) {
          return {
            success: false,
            error: 'Account not found. Please check your email address or create a new account.'
          };
        }
        
        return {
          success: false,
          error: data?.error || 'Failed to send verification email. Please try again.'
        };
      }

      console.log('✅ MFA Email Service: Email sent successfully:', data);
      return {
        success: true,
        challengeId: data.challengeId
      };
    } catch (error: any) {
      console.error('❌ MFA Email Service: Unexpected error:', error);
      
      // Handle specific error types
      if (error.message?.includes('User not found')) {
        return {
          success: false,
          error: 'Account not found. Please check your email address or create a new account.'
        };
      }
      
      if (error.message?.includes('network') || error.message?.includes('fetch')) {
        return {
          success: false,
          error: 'Network error. Please check your connection and try again.'
        };
      }
      
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.'
      };
    }
  }

  async resendCode(): Promise<MFAResendResult> {
    console.log('🔄 MFA Email Service: Resending verification code');
    
    const sessionData = mfaSessionManager.getSessionData();
    if (!sessionData) {
      console.log('❌ MFA Email Service: No session data for resend');
      throw new Error('No pending MFA verification found');
    }

    // Check if we can resend (not too recent)
    const timeSinceLastSend = Date.now() - sessionData.timestamp;
    const minResendInterval = 30 * 1000; // 30 seconds
    
    if (timeSinceLastSend < minResendInterval) {
      const waitTime = Math.ceil((minResendInterval - timeSinceLastSend) / 1000);
      throw new Error(`Please wait ${waitTime} seconds before requesting a new code`);
    }

    try {
      const result = await this.sendMFAEmail(sessionData.email);
      
      if (result.success) {
        // Update session timestamp for the resend
        const updatedSessionData = {
          ...sessionData,
          timestamp: Date.now()
        };
        mfaSessionManager.storeSessionData(updatedSessionData);
        
        console.log('✅ MFA Email Service: Code resent successfully');
        return { success: true };
      } else {
        throw new Error(result.error || 'Failed to resend code');
      }
    } catch (error: any) {
      console.error('❌ MFA Email Service: Resend failed:', error);
      throw error;
    }
  }
}

export const mfaEmailService = new MFAEmailService();
