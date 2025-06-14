
import { supabase } from "@/integrations/supabase/client";
import { mfaSessionManager } from './mfaSessionManager';
import { mfaEmailService } from './mfaEmailService';
import { mfaVerificationService } from './mfaVerificationService';
import type { MFASignInData, MFASessionData, MFAAuthResult, MFAResendResult } from './mfaTypes';

class MFAAuthService {
  async initiateSignIn({ email, password }: MFASignInData): Promise<MFAAuthResult> {
    console.log('🔑 MFA Service: Starting MANDATORY MFA sign in for', email);
    
    try {
      // Clear any existing MFA session first
      mfaSessionManager.clearSession();
      
      // First, validate credentials by attempting sign in
      console.log('🔍 MFA Service: Validating credentials...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.log('❌ MFA Service: Credential validation failed:', error.message);
        throw error;
      }

      console.log('✅ MFA Service: Credentials validated for user:', data.user?.id);

      // Get the user ID before proceeding with MFA
      const userId = data.user?.id;
      
      // Sign out immediately to prevent session persistence until MFA is complete
      console.log('🚪 MFA Service: Signing out to start MFA flow...');
      await supabase.auth.signOut();
      
      // Wait a bit to ensure signout is complete
      await new Promise(resolve => setTimeout(resolve, 500));

      // Store the session data temporarily for MFA
      const sessionData: MFASessionData = {
        email,
        password,
        timestamp: Date.now(),
        userId: userId
      };
      
      console.log('💾 MFA Service: Storing session data for MANDATORY MFA flow');
      mfaSessionManager.storeSessionData(sessionData);

      // Send MFA email and wait for it to complete
      console.log('📧 MFA Service: Sending MANDATORY MFA email...');
      const emailResult = await mfaEmailService.sendMFAEmail(email);
      console.log('✅ MFA Service: MFA email sent successfully:', emailResult);

      // Only trigger MFA session stored event after successful email sending
      if (emailResult.success) {
        // Trigger MFA session stored event to update UI
        window.dispatchEvent(new CustomEvent('mfa-session-stored', { 
          detail: { email, challengeId: emailResult.challengeId } 
        }));
        console.log('🎯 MFA Service: MANDATORY MFA flow initiated successfully');
      } else {
        // If email failed, clear the session
        mfaSessionManager.clearSession();
        throw new Error('Failed to send MFA email');
      }

      // ALWAYS return MFA required - no bypassing
      return { mfaRequired: true };
    } catch (error: any) {
      console.error('❌ MFA Service: Sign in initiation failed:', error);
      mfaSessionManager.clearSession();
      throw error;
    }
  }

  async verifyAndSignIn(code: string) {
    return mfaVerificationService.verifyAndSignIn(code);
  }

  async resendCode(): Promise<MFAResendResult> {
    return mfaEmailService.resendCode();
  }

  clearMFASession(): void {
    mfaSessionManager.clearSession();
  }

  getPendingMFAEmail(): string | null {
    return mfaSessionManager.getPendingEmail();
  }

  hasPendingMFA(): boolean {
    return mfaSessionManager.hasPendingMFA();
  }

  getCurrentMFACode(): string | null {
    // This is for demo purposes - in production, codes are sent via email
    return null;
  }
}

export const mfaAuthService = new MFAAuthService();
