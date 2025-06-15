
import { supabase } from "@/integrations/supabase/client";
import { mfaSessionManager } from './mfaSessionManager';
import type { MFASessionData } from './mfaTypes';

export class MFAVerificationService {
  async verifyCode(code: string, sessionData: MFASessionData) {
    console.log('🔍 MFA Verification Service: Verifying code with Supabase...');
    
    const { data: verifyData, error: verifyError } = await supabase.rpc('verify_mfa_challenge', {
      user_email: sessionData.email,
      provided_code: code
    });

    if (verifyError || !verifyData) {
      console.log('❌ MFA Verification Service: Code verification failed:', verifyError);
      throw new Error('Invalid or expired verification code');
    }

    console.log('✅ MFA Verification Service: Code verified successfully');
    return verifyData;
  }

  async signInWithCredentials(email: string, password: string) {
    // Ensure we're starting fresh
    console.log('🔐 MFA Verification Service: Signing out any existing session...');
    await supabase.auth.signOut();
    
    // Wait for signout to complete
    await new Promise(resolve => setTimeout(resolve, 500));

    // Complete sign in with verified credentials
    console.log('🔐 MFA Verification Service: Completing final sign in...');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log('❌ MFA Verification Service: Final sign in failed:', error);
      throw error;
    }

    console.log('✅ MFA Verification Service: Sign in completed successfully');
    return data;
  }

  async verifyAndSignIn(code: string) {
    console.log('🔍 MFA Verification Service: Starting verification with code:', code);
    
    const sessionData = mfaSessionManager.getSessionData();
    if (!sessionData) {
      console.log('❌ MFA Verification Service: No session data found');
      throw new Error('No pending MFA verification');
    }

    console.log('📋 MFA Verification Service: Found session data for:', sessionData.email);

    // Check session timeout
    if (mfaSessionManager.isSessionExpired(sessionData)) {
      console.log('⏰ MFA Verification Service: Session expired');
      mfaSessionManager.clearSession();
      throw new Error('MFA session expired. Please sign in again.');
    }

    try {
      // Verify the MFA code
      await this.verifyCode(code, sessionData);

      // Complete sign in with verified credentials (only if password exists)
      if (!sessionData.password) {
        throw new Error('Invalid session data - missing credentials');
      }

      const data = await this.signInWithCredentials(sessionData.email, sessionData.password);

      // CRITICAL FIX: Clear MFA session ONLY after successful sign-in completion
      // This prevents the auth state from seeing pending MFA after login
      console.log('🧹 MFA Verification Service: Clearing MFA session after successful login');
      mfaSessionManager.clearSession();
      
      // Dispatch event to notify that MFA has been cleared
      window.dispatchEvent(new CustomEvent('mfa-session-cleared'));

      return data;
    } catch (error: any) {
      console.error('❌ MFA Verification Service: Verification failed:', error);
      
      // Don't clear session on verification failures - let user retry
      if (error.message?.includes('expired')) {
        mfaSessionManager.clearSession();
      }
      
      throw new Error(error.message || 'Verification failed');
    }
  }
}

export const mfaVerificationService = new MFAVerificationService();
