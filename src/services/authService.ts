
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
  async signUp({ email, password, firstName, lastName }: SignUpData) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
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
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  }

  async getCurrentSession(): Promise<Session | null> {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
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
      callback(session?.user ?? null, session);
    });
  }
}

export const authService = new AuthService();
