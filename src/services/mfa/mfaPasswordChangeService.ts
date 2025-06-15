
import { supabase } from "@/integrations/supabase/client";
import { mfaSessionManager } from './mfaSessionManager';
import { mfaEmailService } from './mfaEmailService';
import type { MFAAuthResult, MFAResendResult } from './mfaTypes';

export class MFAPasswordChangeService {
  async initiatePasswordChange(email: string): Promise<MFAAuthResult> {
    console.log('🔐 MFA Password Change: Starting password change MFA process for:', email);
    
    try {
      // Clear any existing MFA session
      mfaSessionManager.clearSession();
      
      console.log('📧 MFA Password Change: Sending MFA email...');
      const emailResult = await mfaEmailService.sendMFAEmail(email);
      
      if (!emailResult.success) {
        console.error('❌ MFA Password Change: Failed to send MFA email');
        throw new Error('Failed to send verification email');
      }
      
      // Store session data for password change flow
      const sessionData = {
        email,
        challengeId: emailResult.challengeId,
        type: 'password_change' as const,
        timestamp: Date.now()
      };
      
      mfaSessionManager.storeSessionData(sessionData);
      console.log('✅ MFA Password Change: Session stored, MFA required');
      
      return {
        mfaRequired: true,
        user: null,
        session: null
      };
      
    } catch (error: any) {
      console.error('❌ MFA Password Change: Process failed:', error);
      mfaSessionManager.clearSession();
      throw new Error(error.message || 'Failed to initiate password change verification');
    }
  }

  async verifyAndChangePassword(code: string, newPassword: string): Promise<void> {
    console.log('🔍 MFA Password Change: Starting verification with code length:', code.length);
    
    const sessionData = mfaSessionManager.getSessionData();
    
    if (!sessionData) {
      console.error('❌ MFA Password Change: No session data found');
      throw new Error('No pending password change verification');
    }

    if (sessionData.type !== 'password_change') {
      console.error('❌ MFA Password Change: Invalid session type:', sessionData.type);
      throw new Error('Invalid verification session');
    }

    if (!sessionData.challengeId) {
      console.error('❌ MFA Password Change: No challenge ID found');
      throw new Error('Invalid verification session - no challenge ID');
    }

    try {
      console.log('🔍 MFA Password Change: Verifying code against challenge ID:', sessionData.challengeId);
      
      const { data: verificationData, error: verificationError } = await supabase
        .rpc('verify_mfa_challenge', {
          user_email: sessionData.email,
          provided_code: code
        });

      console.log('📊 MFA Password Change: Verification result:', { 
        verificationData, 
        verificationError,
        hasData: !!verificationData
      });

      if (verificationError) {
        console.error('❌ MFA Password Change: Verification error:', verificationError);
        throw new Error(`Verification failed: ${verificationError.message}`);
      }

      if (!verificationData) {
        console.error('❌ MFA Password Change: Invalid verification code');
        throw new Error('Invalid or expired verification code');
      }

      console.log('✅ MFA Password Change: Code verified successfully');

      // Get all users to find the one with matching email
      const { data: usersResponse, error: userError } = await supabase.auth.admin.listUsers();
      
      if (userError) {
        console.error('❌ MFA Password Change: Error fetching users:', userError);
        throw new Error('Failed to fetch user data');
      }

      const user = usersResponse.users.find((u: any) => u.email === sessionData.email);
      
      if (!user) {
        console.error('❌ MFA Password Change: User not found');
        throw new Error('User not found');
      }

      // Update password using admin function
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        user.id,
        { password: newPassword }
      );

      if (updateError) {
        console.error('❌ MFA Password Change: Password update failed:', updateError);
        throw new Error('Failed to update password');
      }

      console.log('✅ MFA Password Change: Password updated successfully');
      
      // Clear the MFA session
      mfaSessionManager.clearSession();
      
    } catch (error: any) {
      console.error('❌ MFA Password Change: Verification/update process failed:', error);
      throw new Error(error.message || 'Failed to verify code and update password');
    }
  }

  async resendCode(): Promise<MFAResendResult> {
    return mfaEmailService.resendCode();
  }

  getPendingEmail(): string | null {
    const sessionData = mfaSessionManager.getSessionData();
    return sessionData?.type === 'password_change' ? sessionData.email : null;
  }

  clearSession(): void {
    mfaSessionManager.clearSession();
  }
}

export const mfaPasswordChangeService = new MFAPasswordChangeService();
