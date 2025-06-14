import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { authService, type AuthUser } from '@/services/authService';
import { mfaAuthService } from '@/services/mfaAuthService';

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

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = authService.onAuthStateChange(
      (user, session) => {
        if (!mounted) return;
        
        console.log('🔄 Auth state changed:', { 
          userId: user?.id, 
          hasSession: !!session,
          sessionExpiry: session?.expires_at 
        });
        
        setUser(user);
        setSession(session);
        
        if (user && session) {
          // Load user profile after successful auth
          setTimeout(async () => {
            if (!mounted) return;
            try {
              const profile = await authService.getUserProfile(user.id);
              if (mounted) {
                setUserProfile(profile);
              }
            } catch (error) {
              console.error('Error fetching user profile:', error);
              if (mounted) {
                setUserProfile(null);
              }
            }
          }, 0);
        } else {
          setUserProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session on mount
    const checkSession = async () => {
      try {
        const session = await authService.getCurrentSession();
        if (mounted) {
          if (session?.user) {
            console.log('✅ Found existing session:', session.user.id);
            setUser(session.user);
            setSession(session);
          } else {
            console.log('❌ No valid session found');
            setUser(null);
            setSession(null);
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Session check error:', error);
        if (mounted) {
          setUser(null);
          setSession(null);
          setIsLoading(false);
        }
      }
    };

    checkSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      const result = await authService.signUp({ email, password, firstName, lastName });
      return result;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Starting sign in process with MFA enforcement');
      
      // Clear any existing MFA session first
      mfaAuthService.clearMFASession();
      
      // ALWAYS use MFA flow - no fallback to regular signin
      console.log('🔒 Initiating MFA signin (required for all users)');
      const mfaResult = await mfaAuthService.initiateSignIn({ email, password });
      
      console.log('🎯 MFA signin result:', mfaResult);
      
      // MFA should always be required now
      if (mfaResult.mfaRequired) {
        console.log('✅ MFA flow initiated successfully');
        return { mfaRequired: true };
      }
      
      // This should not happen - log error if we get here
      console.error('❌ Unexpected: MFA not required when it should be');
      throw new Error('Authentication system error - MFA expected');
      
    } catch (error) {
      console.error('❌ Sign in error:', error);
      // Clear any MFA session on error
      mfaAuthService.clearMFASession();
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Clear MFA session first
      mfaAuthService.clearMFASession();
      
      // Then sign out from Supabase
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
