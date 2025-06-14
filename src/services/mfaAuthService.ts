
import { supabase } from "@/integrations/supabase/client";

interface MFASignInData {
  email: string;
  password: string;
}

class MFAAuthService {
  private readonly MFA_SESSION_KEY = 'mfa_session_data';
  private readonly MFA_CODE_KEY = 'mfa_code';
  private readonly MFA_CODE_TIMESTAMP_KEY = 'mfa_code_timestamp';

  async initiateSignIn({ email, password }: MFASignInData) {
    try {
      // Clear any existing session first - be more aggressive about this
      await supabase.auth.signOut();
      
      // Wait longer to ensure signout completes
      await new Promise(resolve => setTimeout(resolve, 500));

      // First, just validate credentials by attempting sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Get the user ID before signing out
      const userId = data.user?.id;
      
      // Immediately and aggressively sign out to prevent session persistence
      await supabase.auth.signOut();
      
      // Clear local storage to ensure no session remnants
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.removeItem('supabase.auth.token');
      
      // Wait longer to ensure signout completes
      await new Promise(resolve => setTimeout(resolve, 500));

      // Verify we're actually signed out
      const { data: sessionCheck } = await supabase.auth.getSession();
      if (sessionCheck.session) {
        console.warn('Session still exists after signout attempt');
        // Force another signout
        await supabase.auth.signOut();
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // Store the session data temporarily (encrypted in production)
      const sessionData = {
        email,
        password, // In production, this should be encrypted
        timestamp: Date.now(),
        userId: userId
      };
      
      sessionStorage.setItem(this.MFA_SESSION_KEY, JSON.stringify(sessionData));

      // Generate a simple 6-digit code for demonstration
      const mfaCode = Math.floor(100000 + Math.random() * 900000).toString();
      console.log('MFA Code for testing:', mfaCode);
      
      // Store the code temporarily
      sessionStorage.setItem(this.MFA_CODE_KEY, mfaCode);
      sessionStorage.setItem(this.MFA_CODE_TIMESTAMP_KEY, Date.now().toString());

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
    const storedCode = sessionStorage.getItem(this.MFA_CODE_KEY);
    const codeTimestamp = sessionStorage.getItem(this.MFA_CODE_TIMESTAMP_KEY);
    
    if (!storedCode || !codeTimestamp) {
      throw new Error('No MFA code available');
    }

    // Check if code is expired (5 minutes)
    if (Date.now() - parseInt(codeTimestamp) > 5 * 60 * 1000) {
      this.clearMFASession();
      throw new Error('MFA code expired');
    }

    if (code !== storedCode) {
      throw new Error('Invalid MFA code');
    }

    // Ensure we're signed out before attempting final sign in
    await supabase.auth.signOut();
    await new Promise(resolve => setTimeout(resolve, 200));

    // Complete sign in with verified credentials
    const { data, error } = await supabase.auth.signInWithPassword({
      email: sessionData.email,
      password: sessionData.password,
    });

    if (error) {
      this.clearMFASession();
      throw error;
    }

    // Clear MFA session data after successful login
    this.clearMFASession();

    return data;
  }

  async resendCode() {
    const sessionData = this.getMFASessionData();
    if (!sessionData) {
      throw new Error('No pending MFA verification');
    }

    // Generate a new code
    const mfaCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('New MFA Code for testing:', mfaCode);
    
    // Store the new code
    sessionStorage.setItem(this.MFA_CODE_KEY, mfaCode);
    sessionStorage.setItem(this.MFA_CODE_TIMESTAMP_KEY, Date.now().toString());

    return { success: true };
  }

  private getMFASessionData() {
    const data = sessionStorage.getItem(this.MFA_SESSION_KEY);
    return data ? JSON.parse(data) : null;
  }

  clearMFASession() {
    sessionStorage.removeItem(this.MFA_SESSION_KEY);
    sessionStorage.removeItem(this.MFA_CODE_KEY);
    sessionStorage.removeItem(this.MFA_CODE_TIMESTAMP_KEY);
  }

  getPendingMFAEmail(): string | null {
    const sessionData = this.getMFASessionData();
    return sessionData?.email || null;
  }

  hasPendingMFA(): boolean {
    const sessionData = this.getMFASessionData();
    const hasCode = !!sessionStorage.getItem(this.MFA_CODE_KEY);
    return !!sessionData && hasCode;
  }

  getCurrentMFACode(): string | null {
    return sessionStorage.getItem(this.MFA_CODE_KEY);
  }
}

export const mfaAuthService = new MFAAuthService();
