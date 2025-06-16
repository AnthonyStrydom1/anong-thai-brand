import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { AuthUser, authService } from '@/services/authService';
import { mfaAuthService } from '@/services/mfaAuthService';

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

    // Check initial MFA state - but don't let stale MFA block normal flow
    const initialMFAState = mfaAuthService.hasPendingMFA();
    console.log('🎯 Auth: Initial MFA state:', initialMFAState);
    
    // Only set MFA pending if we're actually on auth page or just initiated MFA
    const isOnAuthPage = window.location.pathname === '/auth';
    if (initialMFAState && isOnAuthPage) {
      setMfaPending(true);
    } else if (initialMFAState && !isOnAuthPage) {
      // Clear stale MFA session if we're not on auth page
      console.log('🧹 Auth: Clearing stale MFA session - not on auth page');
      mfaAuthService.clearMFASession();
      setMfaPending(false);
    } else {
      setMfaPending(false);
    }

    // Set up auth state change listener
    const { data: { subscription } } = authService.onAuthStateChange(
      (user, session) => {
        if (!mounted) return;

        console.log('🔄 Auth: State change event:', { 
          user: !!user, 
          session: !!session,
          sessionId: session?.access_token ? 'present' : 'missing'
        });

        // For authenticated users
        if (user && session) {
          console.log('✅ Auth: User authenticated successfully');
          setUser(user);
          setSession(session);
          setMfaPending(false); // Clear MFA when auth is successful
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
          return;
        }

        // For unauthenticated users
        console.log('❌ Auth: No user/session - user logged out');
        setUser(null);
        setSession(null);
        setUserProfile(null);
        
        // Only keep MFA pending if we're on the auth page
        if (!window.location.pathname.includes('/auth')) {
          console.log('🧹 Auth: Not on auth page, clearing MFA state');
          setMfaPending(false);
          mfaAuthService.clearMFASession();
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
            console.log('✅ Auth: Found existing valid session');
            setUser(session.user);
            setSession(session);
            setMfaPending(false); // Clear MFA if we have valid session
          } else {
            console.log('❌ Auth: No valid existing session');
            setUser(null);
            setSession(null);
            // Only set MFA pending if we're on auth page
            if (window.location.pathname.includes('/auth')) {
              const pendingMFA = mfaAuthService.hasPendingMFA();
              setMfaPending(pendingMFA);
            } else {
              setMfaPending(false);
              mfaAuthService.clearMFASession();
            }
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error('❌ Auth: Session check failed:', error);
        if (mounted) {
          setUser(null);
          setSession(null);
          setMfaPending(false);
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
