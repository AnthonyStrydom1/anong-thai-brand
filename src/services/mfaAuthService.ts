
import { supabase } from "@/integrations/supabase/client";

interface MFASignInData {
  email: string;
  password: string;
}

class MFAAuthService {
  private readonly MFA_SESSION_KEY = 'mfa_session_data';

  async initiateSignIn({ email, password }: MFASignInData) {
    try {
      // First verify credentials without completing sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Immediately sign out to prevent session creation
      await supabase.auth.signOut();

      // Store encrypted session data temporarily
      const sessionData = {
        email,
        password, // In production, this should be encrypted
        timestamp: Date.now()
      };
      
      sessionStorage.setItem(this.MFA_SESSION_KEY, JSON.stringify(sessionData));

      // Generate a simple 6-digit code for demonstration
      // In production, you'd want to send this via email
      const mfaCode = Math.floor(100000 + Math.random() * 900000).toString();
      console.log('MFA Code for testing:', mfaCode); // For testing purposes
      
      // Store the code temporarily (in production, this would be in the database)
      sessionStorage.setItem('mfa_code', mfaCode);
      sessionStorage.setItem('mfa_code_timestamp', Date.now().toString());

      return { mfaRequired: true };
    } catch (error: any) {
      this.clearMFASession();
      throw error;
    }
  }

  async verifyAndSignIn(code: string) {
    const sessionData = this.getMFASessionData();
    if (!sessionData) {
      throw new Error('No pending MFA verification');
    }

    // Check session timeout (10 minutes)
    if (Date.now() - sessionData.timestamp > 10 * 60 * 1000) {
      this.clearMFASession();
      throw new Error('MFA session expired');
    }

    // Verify MFA code
    const storedCode = sessionStorage.getItem('mfa_code');
    const codeTimestamp = sessionStorage.getItem('mfa_code_timestamp');
    
    if (!storedCode || !codeTimestamp) {
      throw new Error('No MFA code available');
    }

    // Check if code is expired (5 minutes)
    if (Date.now() - parseInt(codeTimestamp) > 5 * 60 * 1000) {
      sessionStorage.removeItem('mfa_code');
      sessionStorage.removeItem('mfa_code_timestamp');
      throw new Error('MFA code expired');
    }

    if (code !== storedCode) {
      throw new Error('Invalid MFA code');
    }

    // Complete sign in with verified credentials
    const { data, error } = await supabase.auth.signInWithPassword({
      email: sessionData.email,
      password: sessionData.password,
    });

    if (error) {
      this.clearMFASession();
      throw error;
    }

    // Clear MFA session data
    this.clearMFASession();
    sessionStorage.removeItem('mfa_code');
    sessionStorage.removeItem('mfa_code_timestamp');

    return data;
  }

  async resendCode() {
    const sessionData = this.getMFASessionData();
    if (!sessionData) {
      throw new Error('No pending MFA verification');
    }

    // Generate a new code
    const mfaCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('New MFA Code for testing:', mfaCode); // For testing purposes
    
    // Store the new code
    sessionStorage.setItem('mfa_code', mfaCode);
    sessionStorage.setItem('mfa_code_timestamp', Date.now().toString());

    return { success: true };
  }

  private getMFASessionData() {
    const data = sessionStorage.getItem(this.MFA_SESSION_KEY);
    return data ? JSON.parse(data) : null;
  }

  clearMFASession() {
    sessionStorage.removeItem(this.MFA_SESSION_KEY);
  }

  getPendingMFAEmail(): string | null {
    const sessionData = this.getMFASessionData();
    return sessionData?.email || null;
  }

  hasPendingMFA(): boolean {
    return !!this.getMFASessionData();
  }
}

export const mfaAuthService = new MFAAuthService();
