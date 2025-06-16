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

    // Check initial MFA state first
    const initialMFAState = mfaAuthService.hasPendingMFA();
    const isOnAuthPage = window.location.pathname === '/auth';
    
    console.log('🔍 Auth: Initial state check:', { 
      initialMFAState, 
      isOnAuthPage,
      pathname: window.location.pathname 
    });
    
    if (initialMFAState && isOnAuthPage) {
      console.log('🔐 Auth: Setting initial MFA pending state');
      setMfaPending(true);
      setUser(null);
      setSession(null);
      setUserProfile(null);
      setIsLoading(false);
      return;
    } else if (initialMFAState && !isOnAuthPage) {
      console.log('🧹 Auth: Clearing stale MFA session - not on auth page');
      mfaAuthService.clearMFASession();
      setMfaPending(false);
    }

    // MFA event handlers
    const handleMFAStored = () => { 
      if (mounted) {
        console.log('📧 Auth: MFA session stored - setting mfaPending to true');
        setMfaPending(true);
        setIsLoading(false);
        // CRITICAL: Clear any existing auth state when MFA starts
        setUser(null);
        setSession(null);
        setUserProfile(null);
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

    // Set up auth state change listener
    const { data: { subscription } } = authService.onAuthStateChange(
      (user, session) => {
        if (!mounted) return;

        console.log('🔄 Auth: State change event:', { 
          user: !!user, 
          session: !!session,
          sessionId: session?.access_token ? 'present' : 'missing',
          mfaPending,
          currentPath: window.location.pathname
        });

        // CRITICAL: Only accept authenticated sessions if NO MFA is pending
        if (user && session && !mfaPending) {
          console.log('✅ Auth: User authenticated successfully (no MFA pending)');
          setUser(user);
          setSession(session);
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

        // If we have a user/session but MFA is pending, IGNORE it completely
        if (user && session && mfaPending) {
          console.log('⏸️ Auth: IGNORING auth event - MFA is pending, preventing premature login');
          // Don't update any auth state - keep MFA flow active
          return;
        }

        // For unauthenticated users
        console.log('❌ Auth: No user/session - user logged out');
        if (!mfaPending) {
          setUser(null);
          setSession(null);
          setUserProfile(null);
        }
        
        // Only clear MFA pending if we're not on the auth page
        if (!window.location.pathname.includes('/auth')) {
          console.log('🧹 Auth: Not on auth page, clearing MFA state');
          setMfaPending(false);
          mfaAuthService.clearMFASession();
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session - but only if no MFA is pending
    const checkSession = async () => {
      if (mfaPending) {
        console.log('⏸️ Auth: Skipping session check - MFA is pending');
        setIsLoading(false);
        return;
      }

      try {
        console.log('🔍 Auth: Checking existing session');
        const session = await authService.getCurrentSession();
        console.log('📊 Auth: Session check result:', { hasSession: !!session, hasUser: !!session?.user });
        
        if (mounted && session?.user) {
          console.log('✅ Auth: Found existing valid session');
          setUser(session.user);
          setSession(session);
        } else {
          console.log('❌ Auth: No valid existing session');
          setUser(null);
          setSession(null);
        }
        setIsLoading(false);
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

    // Only check session if MFA is not pending
    if (!initialMFAState) {
      checkSession();
    }

    return () => {
      mounted = false;
      subscription.unsubscribe();
      window.removeEventListener('mfa-session-stored', handleMFAStored);
      window.removeEventListener('mfa-session-cleared', handleMFACleared);
    };
  }, []); // No dependencies to prevent loops

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
