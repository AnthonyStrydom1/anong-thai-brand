
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { authService, type AuthUser } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: AuthUser | null;
  isLoading: boolean;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ mfaRequired?: boolean }>;
  signIn: (email: string, password: string) => Promise<{ mfaRequired?: boolean }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<Omit<AuthUser, 'id' | 'email'>>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMfaFlow, setIsMfaFlow] = useState(false);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = authService.onAuthStateChange(
      (user, session) => {
        console.log('Auth state changed:', { user: user?.id, session: !!session, isMfaFlow });
        
        // If we're in MFA flow, ignore temporary auth states
        if (isMfaFlow && !session) {
          console.log('Ignoring auth state change during MFA flow');
          return;
        }
        
        setUser(user);
        setSession(session);
        
        if (user && session) {
          // Clear MFA flow state when successfully authenticated
          setIsMfaFlow(false);
          
          // Defer profile loading to prevent auth deadlock
          setTimeout(async () => {
            try {
              const profile = await authService.getUserProfile(user.id);
              setUserProfile(profile);
            } catch (error) {
              console.error('Error fetching user profile:', error);
              setUserProfile(null);
            }
          }, 0);
        } else {
          setUserProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session with proper validation
    authService.getCurrentSession().then((session) => {
      if (session?.user) {
        console.log('Found existing session:', session.user.id);
        setUser(session.user);
        setSession(session);
      } else {
        console.log('No valid session found');
        setUser(null);
        setSession(null);
      }
      setIsLoading(false);
    }).catch((error) => {
      console.error('Session check error:', error);
      setUser(null);
      setSession(null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [isMfaFlow]);

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      setIsMfaFlow(true);
      const result = await authService.signUp({ email, password, firstName, lastName });
      return result;
    } catch (error) {
      setIsMfaFlow(false);
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Starting sign in - setting MFA flow state');
      setIsMfaFlow(true);
      const result = await authService.signIn({ email, password });
      console.log('✅ Sign in result:', result);
      return result;
    } catch (error) {
      console.error('❌ Sign in error:', error);
      setIsMfaFlow(false);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setIsMfaFlow(false);
      await authService.signOut();
      // Clear local state immediately
      setUser(null);
      setSession(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await authService.resetPassword(email);
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<Omit<AuthUser, 'id' | 'email'>>) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      await authService.updateUserProfile(user.id, updates);
      const updatedProfile = await authService.getUserProfile(user.id);
      setUserProfile(updatedProfile);
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const value = {
    user,
    session,
    userProfile,
    isLoading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
