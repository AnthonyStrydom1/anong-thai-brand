
import { supabase } from "@/integrations/supabase/client";
import { mfaSessionManager } from './mfaSessionManager';
import type { MFAResendResult } from './mfaTypes';

export class MFAEmailService {
  async sendMFAEmail(email: string): Promise<{ challengeId?: string; success?: boolean }> {
    console.log('📧 MFA Email Service: Starting email send for:', email);
    
    try {
      console.log('🔄 MFA Email Service: Invoking send-mfa-email function...');
      
      const { data: emailData, error: emailError } = await supabase.functions.invoke('send-mfa-email', {
        body: { email }
      });

      console.log('📧 MFA Email Service: Function response received:', { 
        emailData, 
        emailError,
        hasData: !!emailData,
        hasError: !!emailError 
      });

      if (emailError) {
        console.error('❌ MFA Email Service: Function error:', emailError);
        throw new Error(`Failed to send verification email: ${emailError.message}`);
      }

      if (!emailData) {
        console.error('❌ MFA Email Service: No data returned from function');
        throw new Error('No response from email service');
      }

      if (!emailData.success) {
        console.error('❌ MFA Email Service: Function returned error:', emailData);
        throw new Error(emailData.error || 'Failed to send verification email');
      }

      console.log('✅ MFA Email Service: Email sent successfully, challenge ID:', emailData.challengeId);

      // Store the challenge ID returned from the edge function
      if (emailData.challengeId) {
        mfaSessionManager.storeChallengeId(emailData.challengeId);
        console.log('💾 MFA Email Service: Challenge ID stored');
      } else {
        console.warn('⚠️ MFA Email Service: No challenge ID returned');
      }

      return { ...emailData, success: true };
    } catch (error: any) {
      console.error('❌ MFA Email Service: Critical error:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      throw new Error(error.message || 'Failed to send verification email');
    }
  }

  async resendCode(): Promise<MFAResendResult> {
    const sessionData = mfaSessionManager.getSessionData();
    if (!sessionData) {
      throw new Error('No pending MFA verification');
    }

    console.log('🔄 MFA Email Service: Resending code to:', sessionData.email);

    try {
      const emailData = await this.sendMFAEmail(sessionData.email);

      // Update the challenge ID
      if (emailData?.challengeId) {
        mfaSessionManager.storeChallengeId(emailData.challengeId);
      }

      return { success: true };
    } catch (error: any) {
      console.error('❌ MFA Email Service: Resend failed:', error);
      throw new Error(error.message || 'Failed to resend code');
    }
  }
}

export const mfaEmailService = new MFAEmailService();
