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

    // Force clear all MFA data on app start to prevent stale sessions
    console.log('🚨 Auth: Force clearing MFA data on app initialization');
    mfaSessionManager.forceCleanupAll();

    const checkMFAPending = () => {
      const pending = mfaAuthService.hasPendingMFA();
      console.log('🔍 Auth: MFA pending check:', pending);
      return pending;
    };

    const handleMFAStored = () => { 
      if (mounted) {
        console.log('📡 Auth: MFA stored - setting pending true');
        setMfaPending(true);
        // Keep user and session null during MFA to prevent premature navigation
        setUser(null);
        setSession(null);
      }
    };
    
    const handleMFACleared = () => { 
      if (mounted) {
        console.log('📡 Auth: MFA cleared - setting pending false');
        setMfaPending(false);
        
        // Re-check auth state after MFA clearing with a slight delay
        setTimeout(() => {
          if (!mounted) return;
          authService.getCurrentSession().then(session => {
            if (session?.user && mounted) {
              console.log('✅ Auth: Setting authenticated state after MFA clear');
              setUser(session.user);
              setSession(session);
              setIsLoading(false);
            }
          });
        }, 200);
      }
    };

    window.addEventListener('mfa-session-stored', handleMFAStored);
    window.addEventListener('mfa-session-cleared', handleMFACleared);

    const initialMFAState = checkMFAPending();
    setMfaPending(initialMFAState);
    console.log('🎯 Auth: Initial MFA state:', initialMFAState);

    const { data: { subscription } } = authService.onAuthStateChange(
      (user, session) => {
        if (!mounted) return;

        console.log('🔄 Auth: State change:', { 
          hasUser: !!user, 
          hasSession: !!session,
          domain: window.location.hostname
        });

        if (user && session) {
          const pendingMFA = checkMFAPending();
          console.log('🔍 Auth: MFA check for authenticated user:', pendingMFA);
          
          if (!pendingMFA) {
            console.log('✅ Auth: User authenticated, no MFA pending');
            setUser(user);
            setSession(session);
            setMfaPending(false);

            // Load user profile
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
            
            setIsLoading(false);
          } else {
            console.log('🔒 Auth: MFA pending for authenticated user - keeping user null');
            setMfaPending(true);
            setUser(null);
            setSession(null);
            setIsLoading(false);
          }
          return;
        }

        // Handle unauthenticated state
        const pendingMFA = checkMFAPending();
        console.log('🔍 Auth: No auth session, MFA check:', pendingMFA);
        
        setMfaPending(pendingMFA);
        setUser(null);
        setSession(null);
        setUserProfile(null);
        setIsLoading(false);
      }
    );

    const checkExistingSession = async () => {
      try {
        console.log('🔍 Auth: Checking existing session');
        const session = await authService.getCurrentSession();
        
        if (mounted) {
          if (session?.user) {
            const pendingMFA = checkMFAPending();
            console.log('🔍 Auth: Existing session MFA check:', pendingMFA);
            
            if (!pendingMFA) {
              console.log('✅ Auth: Valid existing session');
              setUser(session.user);
              setSession(session);
            } else {
              console.log('🔒 Auth: MFA pending for existing session');
              setMfaPending(true);
            }
          } else {
            console.log('❌ Auth: No existing session');
            const pendingMFA = checkMFAPending();
            setMfaPending(pendingMFA);
          }
          setIsLoading(false);
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

    checkExistingSession();

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
