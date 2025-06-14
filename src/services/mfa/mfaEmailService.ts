
import { supabase } from "@/integrations/supabase/client";
import { mfaSessionManager } from './mfaSessionManager';
import type { MFAResendResult } from './mfaTypes';

export class MFAEmailService {
  async sendMFAEmail(email: string): Promise<{ challengeId?: string }> {
    console.log('📧 MFA Email Service: Sending MFA email...');
    
    const { data: emailData, error: emailError } = await supabase.functions.invoke('send-mfa-email', {
      body: { email }
    });

    if (emailError) {
      console.error('❌ MFA Email Service: Failed to send MFA email:', emailError);
      throw new Error('Failed to send verification email');
    }

    console.log('✅ MFA Email Service: MFA email sent, response:', emailData);

    // Store the challenge ID returned from the edge function
    if (emailData?.challengeId) {
      mfaSessionManager.storeChallengeId(emailData.challengeId);
    }

    return emailData;
  }

  async resendCode(): Promise<MFAResendResult> {
    const sessionData = mfaSessionManager.getSessionData();
    if (!sessionData) {
      throw new Error('No pending MFA verification');
    }

    try {
      const emailData = await this.sendMFAEmail(sessionData.email);

      // Update the challenge ID
      if (emailData?.challengeId) {
        mfaSessionManager.storeChallengeId(emailData.challengeId);
      }

      return { success: true };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to resend code');
    }
  }
}

export const mfaEmailService = new MFAEmailService();
