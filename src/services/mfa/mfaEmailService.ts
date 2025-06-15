
import { supabase } from "@/integrations/supabase/client";
import { mfaSessionManager } from './mfaSessionManager';
import type { MFAResendResult } from './mfaTypes';

export class MFAEmailService {
  async sendMFAEmail(email: string): Promise<{ success: boolean; challengeId?: string; error?: string }> {
    console.log('📧 MFA Email Service: Sending MFA email to:', email);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-mfa-email', {
        body: { email }
      });

      if (error) {
        console.error('❌ MFA Email Service: Supabase function error:', error);
        throw new Error(`Failed to send MFA email: ${error.message}`);
      }

      if (!data || !data.success) {
        console.error('❌ MFA Email Service: Function returned failure:', data);
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
