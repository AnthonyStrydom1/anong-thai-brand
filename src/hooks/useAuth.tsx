
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
    const handleMFACleared = () => { 
      if (mounted) {
        console.log('📡 Auth: MFA cleared event - setting mfaPending to false');
        setMfaPending(false);
      }
    };

    window.addEventListener('mfa-session-stored', handleMFAStored);
    window.addEventListener('mfa-session-cleared', handleMFACleared);

    // After force cleanup, this should be false
    const initialMFAState = isMFAPending();
    setMfaPending(initialMFAState);
    console.log('🎯 Auth: Initial MFA state after cleanup:', initialMFAState);

    const { data: { subscription } } = authService.onAuthStateChange(
      (user, session) => {
        if (!mounted) return;

        console.log('🔄 Auth: State change event:', { 
          user: !!user, 
          session: !!session,
          sessionId: session?.access_token ? 'present' : 'missing'
        });

        // CRITICAL FIX: Check MFA status but with a small delay to allow clearing to complete
        setTimeout(() => {
          if (!mounted) return;
          
          const pendingMFA = isMFAPending();
          console.log('🔍 Auth: MFA check after delay:', pendingMFA);
          setMfaPending(pendingMFA);

          // If there's a pending MFA, block session/user/profile
          if (pendingMFA) {
            console.log('🔒 Auth: MFA pending, blocking auth state');
            setUser(null);
            setSession(null);
            setUserProfile(null);
            setIsLoading(false);
            return;
          }

          // No pending MFA - proceed with normal auth state
          console.log('✅ Auth: No pending MFA, setting auth state');
          setUser(user);
          setSession(session);

          if (user && session) {
            console.log('✅ Auth: User authenticated, ensuring MFA session is cleared');
            // Ensure MFA session is cleared for authenticated users
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
                console.error('❌ Auth: Failed to load user profile:', error);
                if (mounted) setUserProfile(null);
              }
            }, 0);
          } else {
            console.log('❌ Auth: No user/session, clearing profile');
            setUserProfile(null);
          }

          setIsLoading(false);
        }, 50); // Small delay to allow MFA clearing to complete
      }
    );

    const checkSession = async () => {
      try {
        console.log('🔍 Auth: Checking existing session');
        const session = await authService.getCurrentSession();
        console.log('📊 Auth: Session check result:', { 
          hasSession: !!session, 
          hasUser: !!session?.user,
          sessionId: session?.access_token ? 'present' : 'missing'
        });
        
        if (mounted) {
          // Small delay for MFA check to ensure any clearing has completed
          setTimeout(() => {
            if (!mounted) return;
            
            const pendingMFA = isMFAPending();
            setMfaPending(pendingMFA);
            if (pendingMFA) {
              console.log('🔒 Auth: MFA pending during session check');
              setUser(null);
              setSession(null);
              setUserProfile(null);
              setIsLoading(false);
              return;
            }
            if (session?.user) {
              console.log('✅ Auth: Found existing session');
              setUser(session.user);
              setSession(session);
            } else {
              console.log('❌ Auth: No existing session found');
              setUser(null);
              setSession(null);
            }
            setIsLoading(false);
          }, 50);
        }
      } catch (error) {
        console.error('❌ Auth: Session check failed:', error);
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
    console.log('🔄 Auth: Starting logout process');
    
    // Always clear local state first, regardless of Supabase session validity
    console.log('🧹 Auth: Clearing local state immediately');
    mfaAuthService.clearMFASession();
    setMfaPending(false);
    setUser(null);
    setSession(null);
    setUserProfile(null);
    
    // Check if we have a valid session before attempting Supabase logout
    try {
      console.log('🔍 Auth: Checking current session validity');
      const currentSession = await authService.getCurrentSession();
      
      if (currentSession) {
        console.log('🔄 Auth: Valid session found, attempting Supabase logout');
        await authService.signOut();
        console.log('✅ Auth: Supabase logout successful');
      } else {
        console.log('ℹ️ Auth: No valid session found, skipping Supabase logout');
      }
      
    } catch (error: any) {
      console.log('ℹ️ Auth: Supabase logout failed (expected for invalid sessions):', error?.message);
      // Don't throw - the user is effectively logged out locally
    }
    
    console.log('✅ Auth: Logout process completed');
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
