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
      console.log('🔐 AuthOperations: Starting sign up process for:', data.email);
      console.log('🔐 AuthOperations: Sign up data:', {
        email: data.email,
        hasPassword: !!data.password,
        firstName: data.firstName,
        lastName: data.lastName
      });
      
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
      console.log('🔐 AuthOperations: Auth data received:', {
        userId: authData.user?.id,
        userEmail: authData.user?.email,
        hasSession: !!authData.session
      });

      // Send welcome email after successful signup
      if (authData.user && data.firstName) {
        try {
          console.log('👋 AuthOperations: Attempting to send welcome email to:', data.email);
          const customerName = data.firstName + (data.lastName ? ` ${data.lastName}` : '');
          console.log('👋 AuthOperations: Customer name for email:', customerName);
          
          await WelcomeEmailService.sendWelcomeEmail({
            customerName: customerName,
            customerEmail: data.email,
          });
          console.log('✅ AuthOperations: Welcome email sent successfully to:', data.email);
        } catch (emailError: any) {
          console.error('❌ AuthOperations: Failed to send welcome email:', emailError);
          console.error('❌ AuthOperations: Email error details:', {
            message: emailError?.message,
            stack: emailError?.stack,
            email: data.email,
            customerName: data.firstName + (data.lastName ? ` ${data.lastName}` : '')
          });
          // Don't throw here - we don't want to block the signup process if email fails
        }
      } else {
        console.log('⚠️ AuthOperations: Skipping welcome email - missing user or firstName:', {
          hasUser: !!authData.user,
          hasFirstName: !!data.firstName,
          email: data.email
        });
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
