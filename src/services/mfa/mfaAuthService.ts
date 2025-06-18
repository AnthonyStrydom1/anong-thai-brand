
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
        
        // Provide more specific error messages
        if (error.message?.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please check your credentials and try again.');
        }
        
        throw error;
      }

      console.log('✅ MFA Service: Credentials validated for user:', data.user?.id);

      // Get the user ID before proceeding with MFA
      const userId = data.user?.id;
      
      // Sign out to prevent session persistence until MFA is complete
      console.log('🚪 MFA Service: Signing out to start MFA flow...');
      await supabase.auth.signOut();
      
      // Wait to ensure signout is complete
      await new Promise(resolve => setTimeout(resolve, 500));

      // Store the session data temporarily for MFA
      const sessionData: MFASessionData = {
        email,
        password,
        timestamp: Date.now(),
        userId: userId,
        type: 'signin'
      };
      
      console.log('💾 MFA Service: Storing session data for MANDATORY MFA flow');
      mfaSessionManager.storeSessionData(sessionData);

      // Send MFA email
      console.log('📧 MFA Service: Sending MANDATORY MFA email...');
      const emailResult = await mfaEmailService.sendMFAEmail(email);

      if (emailResult.success) {
        console.log('✅ MFA Service: MFA email sent successfully');
        // Trigger MFA session stored event to update UI - but don't show success toast yet
        window.dispatchEvent(new CustomEvent('mfa-session-stored', { 
          detail: { email, challengeId: emailResult.challengeId, skipSuccessToast: true } 
        }));
        console.log('🎯 MFA Service: MANDATORY MFA flow initiated successfully');
      } else {
        // If email failed, clear the session and throw the specific error
        mfaSessionManager.clearSession();
        throw new Error(emailResult.error || 'Failed to send MFA email');
      }

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
    return null;
  }
}

export const mfaAuthService = new MFAAuthService();
