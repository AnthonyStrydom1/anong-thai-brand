
import { supabase } from "@/integrations/supabase/client";
import { mfaSessionManager } from './mfaSessionManager';
import type { MFAResendResult } from './mfaTypes';

export class MFAEmailService {
  async sendMFAEmail(email: string): Promise<{ success: boolean; challengeId?: string; error?: string }> {
    console.log('📧 MFA Email Service: Sending MFA email to:', email);
    
    try {
      // First check if the user exists in auth.users
      console.log('🔍 MFA Email Service: Checking if user exists in auth.users...');
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error('❌ MFA Email Service: Could not check auth users:', authError);
      } else {
        const userExists = authUsers.users.find((u: any) => u.email?.toLowerCase() === email.toLowerCase());
        console.log('👤 MFA Email Service: User exists in auth.users:', !!userExists);
        if (userExists) {
          console.log('📧 MFA Email Service: Found user with email:', userExists.email, 'ID:', userExists.id);
        }
      }

      const { data, error } = await supabase.functions.invoke('send-mfa-email', {
        body: { email }
      });

      if (error) {
        console.error('❌ MFA Email Service: Supabase function error:', error);
        
        // If it's a user not found error, provide more helpful feedback
        if (error.message?.includes('User not found')) {
          return {
            success: false,
            error: 'Account not found. Please check your email address or sign up for a new account.'
          };
        }
        
        throw new Error(`Failed to send MFA email: ${error.message}`);
      }

      if (!data || !data.success) {
        console.error('❌ MFA Email Service: Function returned failure:', data);
        
        // Check for specific error messages
        if (data?.error?.includes('User not found')) {
          return {
            success: false,
            error: 'Account not found. Please check your email address or sign up for a new account.'
          };
        }
        
        throw new Error(data?.error || 'Failed to send MFA email');
      }

      console.log('✅ MFA Email Service: Email sent successfully:', data);
      return {
        success: true,
        challengeId: data.challengeId
      };
    } catch (error: any) {
      console.error('❌ MFA Email Service: Error sending email:', error);
      return {
        success: false,
        error: error.message || 'Failed to send MFA email'
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
