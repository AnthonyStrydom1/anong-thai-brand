
import { supabase } from "@/integrations/supabase/client";

interface MFASignInData {
  email: string;
  password: string;
}

class MFAAuthService {
  private readonly MFA_SESSION_KEY = 'mfa_session_data';
  private readonly MFA_CHALLENGE_KEY = 'mfa_challenge_id';

  async initiateSignIn({ email, password }: MFASignInData) {
    try {
      // Clear any existing session first
      await supabase.auth.signOut();
      await new Promise(resolve => setTimeout(resolve, 500));

      // First, validate credentials by attempting sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Get the user ID before signing out
      const userId = data.user?.id;
      
      // Immediately sign out to prevent session persistence
      await supabase.auth.signOut();
      await new Promise(resolve => setTimeout(resolve, 500));

      // Verify we're actually signed out
      const { data: sessionCheck } = await supabase.auth.getSession();
      if (sessionCheck.session) {
        await supabase.auth.signOut();
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // Store the session data temporarily
      const sessionData = {
        email,
        password,
        timestamp: Date.now(),
        userId: userId
      };
      
      sessionStorage.setItem(this.MFA_SESSION_KEY, JSON.stringify(sessionData));

      // Call the send-mfa-email edge function to send the actual email
      const { data: emailData, error: emailError } = await supabase.functions.invoke('send-mfa-email', {
        body: { email }
      });

      if (emailError) {
        console.error('Failed to send MFA email:', emailError);
        throw new Error('Failed to send verification email');
      }

      // Store the challenge ID returned from the edge function
      if (emailData?.challengeId) {
        sessionStorage.setItem(this.MFA_CHALLENGE_KEY, emailData.challengeId);
      }

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

    try {
      // Verify the MFA code using Supabase RPC function
      const { data: verifyData, error: verifyError } = await supabase.rpc('verify_mfa_challenge', {
        user_email: sessionData.email,
        provided_code: code
      });

      if (verifyError || !verifyData) {
        throw new Error('Invalid or expired verification code');
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
    } catch (error: any) {
      throw new Error(error.message || 'Verification failed');
    }
  }

  async resendCode() {
    const sessionData = this.getMFASessionData();
    if (!sessionData) {
      throw new Error('No pending MFA verification');
    }

    try {
      // Call the send-mfa-email edge function to send a new code
      const { data: emailData, error: emailError } = await supabase.functions.invoke('send-mfa-email', {
        body: { email: sessionData.email }
      });

      if (emailError) {
        console.error('Failed to resend MFA email:', emailError);
        throw new Error('Failed to send verification email');
      }

      // Update the challenge ID
      if (emailData?.challengeId) {
        sessionStorage.setItem(this.MFA_CHALLENGE_KEY, emailData.challengeId);
      }

      return { success: true };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to resend code');
    }
  }

  private getMFASessionData() {
    const data = sessionStorage.getItem(this.MFA_SESSION_KEY);
    return data ? JSON.parse(data) : null;
  }

  clearMFASession() {
    sessionStorage.removeItem(this.MFA_SESSION_KEY);
    sessionStorage.removeItem(this.MFA_CHALLENGE_KEY);
  }

  getPendingMFAEmail(): string | null {
    const sessionData = this.getMFASessionData();
    return sessionData?.email || null;
  }

  hasPendingMFA(): boolean {
    const sessionData = this.getMFASessionData();
    const hasChallenge = !!sessionStorage.getItem(this.MFA_CHALLENGE_KEY);
    return !!sessionData && hasChallenge;
  }

  getCurrentMFACode(): string | null {
    // This is for demo purposes - in production, codes are sent via email
    return null;
  }
}

export const mfaAuthService = new MFAAuthService();
