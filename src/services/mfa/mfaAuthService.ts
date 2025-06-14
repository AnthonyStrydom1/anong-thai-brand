
import { supabase } from "@/integrations/supabase/client";
import { mfaSessionManager } from './mfaSessionManager';
import { mfaEmailService } from './mfaEmailService';
import { mfaVerificationService } from './mfaVerificationService';
import type { MFASignInData, MFASessionData, MFAAuthResult, MFAResendResult } from './mfaTypes';

class MFAAuthService {
  async initiateSignIn({ email, password }: MFASignInData): Promise<MFAAuthResult> {
    console.log('🔑 MFA Service: Starting sign in for', email);
    
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
      
      mfaSessionManager.storeSessionData(sessionData);

      // Send MFA email
      await mfaEmailService.sendMFAEmail(email);

      console.log('🎯 MFA Service: MFA flow initiated successfully');
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
