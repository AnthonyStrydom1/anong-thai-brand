import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { authService, type AuthUser } from '@/services/authService';
import { mfaAuthService } from '@/services/mfaAuthService';
import { mfaSessionManager } from '@/services/mfa/mfaSessionManager';

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
  mfaPending: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mfaPending, setMfaPending] = useState(false);

  useEffect(() => {
    let mounted = true;

    // FORCE CLEAR ALL MFA DATA ON APP START
    console.log('🚨 Auth: FORCE CLEARING ALL MFA DATA on app initialization');
    mfaSessionManager.forceCleanupAll();

    const isMFAPending = () => {
      const mfaPendingRaw = mfaAuthService.hasPendingMFA();
      console.log(
        "🔍 Auth: Checking for pending MFA session: ",
        mfaPendingRaw,
        " (should be FALSE on fresh app start)"
      );
      return mfaPendingRaw;
    };

    const handleMFAStored = () => { if (mounted) setMfaPending(true); };
    const handleMFACleared = () => { if (mounted) setMfaPending(false); };

    window.addEventListener('mfa-session-stored', handleMFAStored);
    window.addEventListener('mfa-session-cleared', handleMFACleared);

    // After force cleanup, this should be false
    const initialMFAState = isMFAPending();
    setMfaPending(initialMFAState);
    console.log('🎯 Auth: Initial MFA state after cleanup:', initialMFAState);

    const { data: { subscription } } = authService.onAuthStateChange(
      (user, session) => {
        if (!mounted) return;

        const pendingMFA = isMFAPending();
        setMfaPending(pendingMFA);

        // If there's a pending MFA, block session/user/profile
        if (pendingMFA) {
          setUser(null);
          setSession(null);
          setUserProfile(null);
          setIsLoading(false);
          return;
        }

        setUser(user);
        setSession(session);

        if (user && session) {
          setTimeout(() => {
            if (mounted) {
              mfaAuthService.clearMFASession();
            }
          }, 100);

          setTimeout(async () => {
            if (!mounted) return;
            try {
              const profile = await authService.getUserProfile(user.id);
              if (mounted) setUserProfile(profile);
            } catch (error) {
              if (mounted) setUserProfile(null);
            }
          }, 0);
        } else {
          setUserProfile(null);
        }

        setIsLoading(false);
      }
    );

    const checkSession = async () => {
      try {
        const session = await authService.getCurrentSession();
        if (mounted) {
          const pendingMFA = isMFAPending();
          setMfaPending(pendingMFA);
          if (pendingMFA) {
            setUser(null);
            setSession(null);
            setUserProfile(null);
            setIsLoading(false);
            return;
          }
          if (session?.user) {
            setUser(session.user);
            setSession(session);
          } else {
            setUser(null);
            setSession(null);
          }
          setIsLoading(false);
        }
      } catch (error) {
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
      window.removeEventListener('mfa-session-stored', handleMFAStored);
      window.removeEventListener('mfa-session-cleared', handleMFACleared);
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
      
      mfaAuthService.clearMFASession();
      
      console.log('🔒 Initiating MFA signin (required for all users)');
      const mfaResult = await mfaAuthService.initiateSignIn({ email, password });
      
      console.log('🎯 MFA signin result:', mfaResult);
      
      if (mfaResult.mfaRequired) {
        console.log('✅ MFA flow initiated successfully');
        return { mfaRequired: true };
      }
      
      console.error('❌ Unexpected: MFA not required when it should be');
      throw new Error('Authentication system error - MFA expected');
      
    } catch (error) {
      console.error('❌ Sign in error:', error);
      mfaAuthService.clearMFASession();
      throw error;
    }
  };

  const signOut = async () => {
    try {
      mfaAuthService.clearMFASession();
      
      await authService.signOut();
      
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
    mfaPending,
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
