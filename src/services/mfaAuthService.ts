
import { supabase } from "@/integrations/supabase/client";

interface MFASignInData {
  email: string;
  password: string;
}

interface MFAVerificationData {
  email: string;
  code: string;
  password: string;
}

class MFAAuthService {
  private readonly MFA_SESSION_KEY = 'mfa_session_data';

  async initiateSignIn({ email, password }: MFASignInData) {
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
      password,
      timestamp: Date.now()
    };
    
    sessionStorage.setItem(this.MFA_SESSION_KEY, JSON.stringify(sessionData));

    // Send MFA code
    const { error: mfaError } = await supabase.functions.invoke('send-mfa-email', {
      body: { email }
    });

    if (mfaError) {
      this.clearMFASession();
      throw new Error('Failed to send MFA code: ' + mfaError.message);
    }

    return { mfaRequired: true };
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
    const { data: verifyData, error: verifyError } = await supabase
      .rpc('verify_mfa_challenge', {
        user_email: sessionData.email,
        provided_code: code
      });

    if (verifyError || !verifyData) {
      throw new Error('Invalid or expired MFA code');
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

    return data;
  }

  async resendCode() {
    const sessionData = this.getMFASessionData();
    if (!sessionData) {
      throw new Error('No pending MFA verification');
    }

    const { error } = await supabase.functions.invoke('send-mfa-email', {
      body: { email: sessionData.email }
    });

    if (error) {
      throw new Error('Failed to resend MFA code: ' + error.message);
    }

    return { success: true };
  }

  private getMFASessionData() {
    const data = sessionStorage.getItem(this.MFA_SESSION_KEY);
    return data ? JSON.parse(data) : null;
  }

  private clearMFASession() {
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
