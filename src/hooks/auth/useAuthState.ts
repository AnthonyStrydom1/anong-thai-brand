
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
        // Clear any existing user/session when MFA is required
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

    // Check initial MFA state - only set if we're on auth page
    const isOnAuthPage = window.location.pathname === '/auth';
    const initialMFAState = mfaAuthService.hasPendingMFA();
    console.log('🎯 Auth: Initial MFA state:', initialMFAState, 'on auth page:', isOnAuthPage);
    
    if (initialMFAState && isOnAuthPage) {
      setMfaPending(true);
      setUser(null);
      setSession(null);
      setUserProfile(null);
    } else {
      setMfaPending(false);
      // Clear stale MFA if not on auth page
      if (initialMFAState && !isOnAuthPage) {
        console.log('🧹 Auth: Clearing stale MFA session - not on auth page');
        mfaAuthService.clearMFASession();
      }
    }

    // Set up auth state change listener
    const { data: { subscription } } = authService.onAuthStateChange(
      (user, session) => {
        if (!mounted) return;

        console.log('🔄 Auth: State change event:', { 
          user: !!user, 
          session: !!session,
          sessionId: session?.access_token ? 'present' : 'missing',
          mfaPending
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

        // If we have a user/session but MFA is pending, ignore it
        if (user && session && mfaPending) {
          console.log('⏸️ Auth: Ignoring auth event - MFA is pending');
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

    // Check for existing session
    const checkSession = async () => {
      try {
        console.log('🔍 Auth: Checking existing session');
        const session = await authService.getCurrentSession();
        console.log('📊 Auth: Session check result:', { 
          hasSession: !!session, 
          hasUser: !!session?.user,
          mfaPending
        });
        
        if (mounted) {
          // Only accept session if no MFA is pending
          if (session?.user && !mfaPending) {
            console.log('✅ Auth: Found existing valid session (no MFA pending)');
            setUser(session.user);
            setSession(session);
          } else {
            console.log('❌ Auth: No valid existing session or MFA pending');
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
  }, []); // Remove mfaPending from dependency array to prevent loops

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
