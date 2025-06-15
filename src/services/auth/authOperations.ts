
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from '@supabase/supabase-js';
import { domainValidationService } from './domainValidation';
import { mfaAuthService } from '../mfaAuthService';
import { mfaPasswordChangeService } from '../mfa/mfaPasswordChangeService';
import { WelcomeEmailService } from '../welcomeEmailService';

export interface SignUpData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export class AuthOperationsService {
  async signUp(data: SignUpData) {
    try {
      console.log('🔐 AuthOperations: Starting sign up process');
      
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        console.error('🔐 AuthOperations: Sign up error:', error);
        throw error;
      }

      console.log('🔐 AuthOperations: Sign up successful, user created:', authData.user?.id);

      // Send welcome email after successful signup
      if (authData.user && data.firstName) {
        try {
          console.log('👋 AuthOperations: Sending welcome email...');
          await WelcomeEmailService.sendWelcomeEmail({
            customerName: data.firstName + (data.lastName ? ` ${data.lastName}` : ''),
            customerEmail: data.email,
          });
          console.log('✅ AuthOperations: Welcome email sent successfully');
        } catch (emailError) {
          console.error('❌ AuthOperations: Failed to send welcome email:', emailError);
          // Don't throw here - we don't want to block the signup process if email fails
        }
      }

      return {
        user: authData.user,
        session: authData.session,
      };
    } catch (error) {
      console.error('🔐 AuthOperations: Sign up process failed:', error);
      throw error;
    }
  }

  async signIn({ email, password }: SignInData) {
    if (!domainValidationService.isDomainValid()) {
      throw new Error('Authentication not available on this domain');
    }

    domainValidationService.clearCrossDomainSessions();

    // Always use MFA flow for sign-in
    return mfaAuthService.initiateSignIn({ email, password });
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    domainValidationService.clearDomainKey();
    mfaAuthService.clearMFASession();
    mfaPasswordChangeService.clearSession();
    if (error) throw error;
  }

  async resetPassword(email: string) {
    if (!domainValidationService.isDomainValid()) {
      throw new Error('Authentication not available on this domain');
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth?mode=reset`,
    });

    if (error) throw error;
  }

  // New MFA-protected password change
  async initiatePasswordChange(email: string) {
    if (!domainValidationService.isDomainValid()) {
      throw new Error('Authentication not available on this domain');
    }

    return mfaPasswordChangeService.initiatePasswordChange(email);
  }

  async verifyAndChangePassword(code: string, newPassword: string) {
    return mfaPasswordChangeService.verifyAndChangePassword(code, newPassword);
  }

  async resendPasswordChangeCode() {
    return mfaPasswordChangeService.resendCode();
  }

  getPendingPasswordChangeEmail(): string | null {
    return mfaPasswordChangeService.getPendingEmail();
  }
}

export const authOperationsService = new AuthOperationsService();
