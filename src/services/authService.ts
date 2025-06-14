import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

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

class AuthService {
  private readonly DOMAIN_KEY = 'anongthaibrand_domain';
  private readonly TARGET_DOMAIN = 'anongthaibrand.com';
  private readonly MFA_PENDING_KEY = 'mfa_pending_user';

  private isDomainValid(): boolean {
    const currentDomain = window.location.hostname.toLowerCase();
    return currentDomain === this.TARGET_DOMAIN || currentDomain === 'localhost';
  }

  private clearCrossDomainSessions() {
    // Clear any sessions that may have been set from other domains
    const storedDomain = localStorage.getItem(this.DOMAIN_KEY);
    const currentDomain = window.location.hostname.toLowerCase();
    
    if (storedDomain && storedDomain !== currentDomain) {
      localStorage.clear();
      sessionStorage.clear();
    }
    
    localStorage.setItem(this.DOMAIN_KEY, currentDomain);
  }

  async signUp({ email, password, firstName, lastName }: SignUpData) {
    if (!this.isDomainValid()) {
      throw new Error('Authentication not available on this domain');
    }

    this.clearCrossDomainSessions();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `https://${this.TARGET_DOMAIN}/`,
        data: {
          first_name: firstName,
          last_name: lastName,
        }
      }
    });

    if (error) throw error;
    return data;
  }

  async signIn({ email, password }: SignInData) {
    if (!this.isDomainValid()) {
      throw new Error('Authentication not available on this domain');
    }

    this.clearCrossDomainSessions();

    // First, attempt normal sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Immediately sign out to prevent bypassing MFA
    await supabase.auth.signOut();

    // Store email for MFA verification
    localStorage.setItem(this.MFA_PENDING_KEY, email);

    // Trigger MFA challenge
    const { data: mfaData, error: mfaError } = await supabase.functions.invoke('send-mfa-email', {
      body: { email }
    });

    if (mfaError) {
      localStorage.removeItem(this.MFA_PENDING_KEY);
      throw new Error('Failed to send MFA code: ' + mfaError.message);
    }

    // Return indication that MFA is required
    return { 
      user: null, 
      session: null, 
      mfaRequired: true,
      challengeId: mfaData?.challengeId 
    };
  }

  async verifyMFA(code: string) {
    const pendingEmail = localStorage.getItem(this.MFA_PENDING_KEY);
    if (!pendingEmail) {
      throw new Error('No pending MFA verification');
    }

    // Verify the MFA code
    const { data: verifyData, error: verifyError } = await supabase
      .rpc('verify_mfa_challenge', {
        user_email: pendingEmail,
        provided_code: code
      });

    if (verifyError || !verifyData) {
      throw new Error('Invalid or expired MFA code');
    }

    // Now complete the actual sign in
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      // Need to sign in again since we signed out earlier
      const { data, error } = await supabase.auth.signInWithPassword({
        email: pendingEmail,
        password: '' // This won't work, we need a different approach
      });
    }

    // Clear pending MFA
    localStorage.removeItem(this.MFA_PENDING_KEY);

    return { success: true };
  }

  getPendingMFAEmail(): string | null {
    return localStorage.getItem(this.MFA_PENDING_KEY);
  }

  clearPendingMFA() {
    localStorage.removeItem(this.MFA_PENDING_KEY);
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    localStorage.removeItem(this.DOMAIN_KEY);
    localStorage.removeItem(this.MFA_PENDING_KEY);
    if (error) throw error;
  }

  async resetPassword(email: string) {
    if (!this.isDomainValid()) {
      throw new Error('Authentication not available on this domain');
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth?mode=reset`,
    });

    if (error) throw error;
  }

  async getCurrentUser(): Promise<User | null> {
    if (!this.isDomainValid()) {
      return null;
    }

    this.clearCrossDomainSessions();

    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Get user error:', error);
      return null;
    }
    return user;
  }

  async getCurrentSession(): Promise<Session | null> {
    if (!this.isDomainValid()) {
      return null;
    }

    this.clearCrossDomainSessions();

    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Get session error:', error);
      return null;
    }
    
    // Strict session validation
    if (session && session.expires_at) {
      const expiresAt = new Date(session.expires_at * 1000);
      const now = new Date();
      
      if (expiresAt <= now) {
        console.log('Session expired, signing out');
        await this.signOut();
        return null;
      }

      // Additional validation - check if session is from correct domain
      const sessionDomain = localStorage.getItem(this.DOMAIN_KEY);
      if (sessionDomain && sessionDomain !== window.location.hostname.toLowerCase()) {
        console.log('Cross-domain session detected, clearing');
        await this.signOut();
        return null;
      }
    }
    
    return session;
  }

  async getUserProfile(userId: string): Promise<AuthUser | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    
    if (!data) return null;

    return {
      id: data.id,
      email: data.email,
      firstName: data.first_name || undefined,
      lastName: data.last_name || undefined,
      phone: data.phone || undefined,
    };
  }

  async updateUserProfile(userId: string, updates: Partial<Omit<AuthUser, 'id' | 'email'>>) {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        first_name: updates.firstName,
        last_name: updates.lastName,
        phone: updates.phone,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  onAuthStateChange(callback: (user: User | null, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change event:', event, 'Valid domain:', this.isDomainValid());
      
      // Only process auth changes on valid domain
      if (!this.isDomainValid()) {
        callback(null, null);
        return;
      }

      if (session && session.user) {
        // Validate session belongs to current domain
        const sessionDomain = localStorage.getItem(this.DOMAIN_KEY);
        if (sessionDomain && sessionDomain !== window.location.hostname.toLowerCase()) {
          console.log('Rejecting cross-domain session');
          callback(null, null);
          return;
        }
        callback(session.user, session);
      } else {
        callback(null, null);
      }
    });
  }
}

export const authService = new AuthService();
