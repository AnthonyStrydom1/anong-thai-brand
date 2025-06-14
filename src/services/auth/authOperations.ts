
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from '@supabase/supabase-js';
import { domainValidationService } from './domainValidation';
import { mfaAuthService } from '../mfaAuthService';

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
  async signUp({ email, password, firstName, lastName }: SignUpData) {
    if (!domainValidationService.isDomainValid()) {
      throw new Error('Authentication not available on this domain');
    }

    domainValidationService.clearCrossDomainSessions();

    // Clear any existing session
    await supabase.auth.signOut();

    // Sign up without email confirmation - user account is immediately active
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined, // No email confirmation needed
        data: {
          first_name: firstName,
          last_name: lastName,
        }
      }
    });

    if (error) throw error;

    // The account is now created and active, no email confirmation needed
    // User can immediately proceed to sign in with MFA
    return { ...data, accountCreated: true };
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
}

export const authOperationsService = new AuthOperationsService();
