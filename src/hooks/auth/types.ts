
import { User, Session } from '@supabase/supabase-js';
import { AuthUser } from '@/services/authService';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: AuthUser | null;
  isLoading: boolean;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ accountCreated: boolean; user?: User | null; session?: Session | null; }>;
  signIn: (email: string, password: string) => Promise<{ mfaRequired?: boolean; }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<Omit<AuthUser, 'id' | 'email'>>) => Promise<void>;
  mfaPending: boolean;
}
