
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { AuthUser, authService } from '@/services/authService';
import { mfaAuthService } from '@/services/mfaAuthService';
import { mfaSessionManager } from '@/services/mfa/mfaSessionManager';

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mfaPending, setMfaPending] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Simple MFA event handlers
    const handleMFAStored = () => { 
      if (mounted) {
        console.log('📧 Auth: MFA session stored - setting mfaPending to true');
        setMfaPending(true);
        setIsLoading(false);
      }
    };
    
    const handleMFACleared = () => { 
      if (mounted) {
        console.log('🧹 Auth: MFA cleared event - setting mfaPending to false');
        setMfaPending(false);
      }
    };

    // Set up event listeners
    window.addEventListener('mfa-session-stored', handleMFAStored);
    window.addEventListener('mfa-session-cleared', handleMFACleared);

    // Check initial MFA state
    const initialMFAState = mfaAuthService.hasPendingMFA();
    console.log('🎯 Auth: Initial MFA state:', initialMFAState);
    setMfaPending(initialMFAState);

    // Set up auth state change listener
    const { data: { subscription } } = authService.onAuthStateChange(
      (user, session) => {
        if (!mounted) return;

        console.log('🔄 Auth: State change event:', { 
          user: !!user, 
          session: !!session,
          sessionId: session?.access_token ? 'present' : 'missing'
        });

        // For authenticated users - only set if no MFA is pending
        if (user && session) {
          const pendingMFA = mfaAuthService.hasPendingMFA();
          console.log('🔍 Auth: Auth success - MFA check:', pendingMFA);
          
          if (!pendingMFA) {
            console.log('✅ Auth: No pending MFA, setting authenticated state');
            setUser(user);
            setSession(session);
            setMfaPending(false);
            setIsLoading(false);

            // Load user profile
            authService.getUserProfile(user.id)
              .then(profile => {
                if (mounted) setUserProfile(profile);
              })
              .catch(error => {
                console.error('❌ Auth: Failed to load user profile:', error);
                if (mounted) setUserProfile(null);
              });
          } else {
            console.log('🔒 Auth: MFA pending - keeping MFA state active');
            // Don't change anything - let MFA flow continue
            setIsLoading(false);
          }
          return;
        }

        // For unauthenticated users
        const pendingMFA = mfaAuthService.hasPendingMFA();
        console.log('🔍 Auth: No user/session, MFA check:', pendingMFA);
        
        // Only clear MFA state if there's truly no pending MFA
        if (!pendingMFA) {
          setMfaPending(false);
          setUser(null);
          setSession(null);
          setUserProfile(null);
        }
        setIsLoading(false);
      }
    );

    // Check for existing session
    const checkSession = async () => {
      try {
        console.log('🔍 Auth: Checking existing session');
        const session = await authService.getCurrentSession();
        console.log('📊 Auth: Session check result:', { 
          hasSession: !!session, 
          hasUser: !!session?.user
        });
        
        if (mounted) {
          if (session?.user) {
            const pendingMFA = mfaAuthService.hasPendingMFA();
            console.log('🔍 Auth: Existing session MFA check:', pendingMFA);
            
            if (!pendingMFA) {
              console.log('✅ Auth: No pending MFA for existing session');
              setUser(session.user);
              setSession(session);
              setMfaPending(false);
            } else {
              console.log('🔒 Auth: MFA pending for existing session');
              setMfaPending(true);
              // Don't clear user/session here - let MFA complete
            }
          } else {
            const pendingMFA = mfaAuthService.hasPendingMFA();
            setMfaPending(pendingMFA);
            setUser(null);
            setSession(null);
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error('❌ Auth: Session check failed:', error);
        if (mounted) {
          const pendingMFA = mfaAuthService.hasPendingMFA();
          setMfaPending(pendingMFA);
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

  return {
    user,
    session,
    userProfile,
    isLoading,
    mfaPending,
    setUser,
    setSession,
    setUserProfile,
    setMfaPending
  };
}
