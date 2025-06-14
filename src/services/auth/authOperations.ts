
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from '@supabase/supabase-js';
import { domainValidationService } from './domainValidation';

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

    // Sign up without email confirmation and without automatic sign-in
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined, // Disable email confirmation
        data: {
          first_name: firstName,
          last_name: lastName,
        }
      }
    });

    if (error) throw error;

    // Immediately sign out to prevent auto-login
    if (data.session) {
      await supabase.auth.signOut();
    }

    return data;
  }

  async signIn({ email, password }: SignInData) {
    if (!domainValidationService.isDomainValid()) {
      throw new Error('Authentication not available on this domain');
    }

    domainValidationService.clearCrossDomainSessions();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    domainValidationService.clearDomainKey();
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
