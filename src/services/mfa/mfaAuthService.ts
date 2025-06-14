
import { supabase } from "@/integrations/supabase/client";
import { mfaSessionManager } from './mfaSessionManager';
import { mfaEmailService } from './mfaEmailService';
import { mfaVerificationService } from './mfaVerificationService';
import type { MFASignInData, MFASessionData, MFAAuthResult, MFAResendResult } from './mfaTypes';

class MFAAuthService {
  async initiateSignIn({ email, password }: MFASignInData): Promise<MFAAuthResult> {
    console.log('🔑 MFA Service: Starting sign in for', email);
    
    try {
      // Clear any existing session first
      console.log('🧹 MFA Service: Clearing existing session...');
      await supabase.auth.signOut();
      await new Promise(resolve => setTimeout(resolve, 500));

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

      // Get the user ID before signing out
      const userId = data.user?.id;
      
      // Immediately sign out to prevent session persistence
      console.log('🚪 MFA Service: Signing out to prevent session persistence...');
      await supabase.auth.signOut();
      await new Promise(resolve => setTimeout(resolve, 500));

      // Verify we're actually signed out
      const { data: sessionCheck } = await supabase.auth.getSession();
      if (sessionCheck.session) {
        console.log('⚠️ MFA Service: Still have session, forcing another signout...');
        await supabase.auth.signOut();
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // Store the session data temporarily
      const sessionData: MFASessionData = {
        email,
        password,
        timestamp: Date.now(),
        userId: userId
      };
      
      mfaSessionManager.storeSessionData(sessionData);

      // Send MFA email
      await mfaEmailService.sendMFAEmail(email);

      console.log('🎯 MFA Service: Sign in initiated successfully');
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
