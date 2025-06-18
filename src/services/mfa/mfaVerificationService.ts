
import { supabase } from "@/integrations/supabase/client";
import { mfaSessionManager } from './mfaSessionManager';
import type { MFASessionData } from './mfaTypes';

export class MFAVerificationService {
  async verifyCode(code: string, sessionData: MFASessionData) {
    console.log('🔍 MFA Verification: Verifying code');
    
    const { data: verifyData, error: verifyError } = await supabase.rpc('verify_mfa_challenge', {
      user_email: sessionData.email,
      provided_code: code
    });

    if (verifyError) {
      console.log('❌ MFA Verification: Code verification failed:', verifyError);
      
      if (verifyError.message?.includes('No valid challenge found') || 
          verifyError.message?.includes('expired')) {
        throw new Error('Verification code has expired. Please request a new code.');
      }
      
      throw new Error('Invalid verification code');
    }

    if (!verifyData) {
      throw new Error('Invalid verification code');
    }

    console.log('✅ MFA Verification: Code verified successfully');
    return verifyData;
  }

  async signInWithCredentials(email: string, password: string) {
    console.log('🔐 MFA Verification: Completing sign in');
    
    // Ensure clean slate
    await supabase.auth.signOut();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log('❌ MFA Verification: Sign in failed:', error);
      throw error;
    }

    console.log('✅ MFA Verification: Sign in completed');
    return data;
  }

  async verifyAndSignIn(code: string) {
    console.log('🔍 MFA Verification: Starting verification with code:', code);
    
    const sessionData = mfaSessionManager.getSessionData();
    if (!sessionData) {
      console.log('❌ MFA Verification: No session data');
      throw new Error('No pending MFA verification. Please sign in again.');
    }

    console.log('📋 MFA Verification: Session found for:', sessionData.email);

    // Check session timeout (15 minutes)
    const sessionAge = Date.now() - sessionData.timestamp;
    const maxAge = 15 * 60 * 1000;
    
    if (sessionAge > maxAge) {
      console.log('⏰ MFA Verification: Session expired');
      mfaSessionManager.clearSession();
      throw new Error('MFA session expired. Please sign in again.');
    }

    try {
      // Verify MFA code
      await this.verifyCode(code, sessionData);

      if (!sessionData.password) {
        throw new Error('Invalid session data - missing credentials');
      }

      // Complete sign in
      const data = await this.signInWithCredentials(sessionData.email, sessionData.password);

      // Clear MFA session immediately
      console.log('✅ MFA Verification: Clearing session after success');
      mfaSessionManager.clearSession();
      window.dispatchEvent(new CustomEvent('mfa-session-cleared'));

      // Allow auth state to propagate
      await new Promise(resolve => setTimeout(resolve, 1000));

      return data;
    } catch (error: any) {
      console.error('❌ MFA Verification: Failed:', error);
      
      // Only clear session on expiration/session errors
      if (error.message?.includes('expired') || error.message?.includes('session')) {
        mfaSessionManager.clearSession();
        window.dispatchEvent(new CustomEvent('mfa-session-cleared'));
      }
      
      throw error;
    }
  }
}

export const mfaVerificationService = new MFAVerificationService();
