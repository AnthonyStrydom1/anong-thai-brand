
import { supabase } from "@/integrations/supabase/client";

interface MFASignInData {
  email: string;
  password: string;
}

class MFAAuthService {
  private readonly MFA_SESSION_KEY = 'mfa_session_data';
  private readonly MFA_CHALLENGE_KEY = 'mfa_challenge_id';

  async initiateSignIn({ email, password }: MFASignInData) {
    console.log('🔑 MFA Service: Starting sign in for', email);
    
    try {
      // Clear any existing session first
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
      
      console.log('💾 MFA Service: Storing session data:', { email, userId, timestamp: sessionData.timestamp });
      sessionStorage.setItem(this.MFA_SESSION_KEY, JSON.stringify(sessionData));

      // Call the send-mfa-email edge function to send the actual email
      console.log('📧 MFA Service: Sending MFA email...');
      const { data: emailData, error: emailError } = await supabase.functions.invoke('send-mfa-email', {
        body: { email }
      });

      if (emailError) {
        console.error('❌ MFA Service: Failed to send MFA email:', emailError);
        throw new Error('Failed to send verification email');
      }

      console.log('✅ MFA Service: MFA email sent, response:', emailData);

      // Store the challenge ID returned from the edge function
      if (emailData?.challengeId) {
        console.log('🔑 MFA Service: Storing challenge ID:', emailData.challengeId);
        sessionStorage.setItem(this.MFA_CHALLENGE_KEY, emailData.challengeId);
      }

      console.log('🎯 MFA Service: Sign in initiated successfully');
      return { mfaRequired: true };
    } catch (error: any) {
      console.error('❌ MFA Service: Sign in initiation failed:', error);
      this.clearMFASession();
      throw error;
    }
  }

  async verifyAndSignIn(code: string) {
    console.log('🔍 MFA Service: Starting verification with code:', code);
    
    const sessionData = this.getMFASessionData();
    if (!sessionData) {
      console.log('❌ MFA Service: No session data found');
      throw new Error('No pending MFA verification');
    }

    console.log('📋 MFA Service: Found session data for:', sessionData.email);

    // Check session timeout (10 minutes)
    if (Date.now() - sessionData.timestamp > 10 * 60 * 1000) {
      console.log('⏰ MFA Service: Session expired');
      this.clearMFASession();
      throw new Error('MFA session expired');
    }

    try {
      // Verify the MFA code using Supabase RPC function
      console.log('🔍 MFA Service: Verifying code with Supabase...');
      const { data: verifyData, error: verifyError } = await supabase.rpc('verify_mfa_challenge', {
        user_email: sessionData.email,
        provided_code: code
      });

      if (verifyError || !verifyData) {
        console.log('❌ MFA Service: Code verification failed:', verifyError);
        throw new Error('Invalid or expired verification code');
      }

      console.log('✅ MFA Service: Code verified successfully');

      // Ensure we're signed out before attempting final sign in
      await supabase.auth.signOut();
      await new Promise(resolve => setTimeout(resolve, 200));

      // Complete sign in with verified credentials
      console.log('🔐 MFA Service: Completing sign in...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sessionData.email,
        password: sessionData.password,
      });

      if (error) {
        console.log('❌ MFA Service: Final sign in failed:', error);
        this.clearMFASession();
        throw error;
      }

      console.log('✅ MFA Service: Sign in completed successfully');

      // Clear MFA session data after successful login
      this.clearMFASession();

      return data;
    } catch (error: any) {
      console.error('❌ MFA Service: Verification failed:', error);
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
    const parsed = data ? JSON.parse(data) : null;
    console.log('📖 MFA Service: Getting session data:', parsed ? { email: parsed.email, hasData: true } : null);
    return parsed;
  }

  clearMFASession() {
    console.log('🧹 MFA Service: Clearing session data');
    sessionStorage.removeItem(this.MFA_SESSION_KEY);
    sessionStorage.removeItem(this.MFA_CHALLENGE_KEY);
  }

  getPendingMFAEmail(): string | null {
    const sessionData = this.getMFASessionData();
    const email = sessionData?.email || null;
    console.log('📧 MFA Service: Getting pending email:', email);
    return email;
  }

  hasPendingMFA(): boolean {
    const sessionData = this.getMFASessionData();
    const hasChallenge = !!sessionStorage.getItem(this.MFA_CHALLENGE_KEY);
    const result = !!sessionData && hasChallenge;
    console.log('❓ MFA Service: Has pending MFA:', result, { hasSessionData: !!sessionData, hasChallenge });
    return result;
  }

  getCurrentMFACode(): string | null {
    // This is for demo purposes - in production, codes are sent via email
    return null;
  }
}

export const mfaAuthService = new MFAAuthService();
