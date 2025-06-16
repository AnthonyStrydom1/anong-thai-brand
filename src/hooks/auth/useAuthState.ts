
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

    // Clear any stale MFA data on app start
    console.log('🧹 Auth: Cleaning up any stale MFA data on app initialization');
    
    const checkInitialMFAState = () => {
      const hasPendingMFA = mfaAuthService.hasPendingMFA();
      console.log('🔍 Auth: Initial MFA check:', hasPendingMFA);
      return hasPendingMFA;
    };

    const handleMFAStored = () => { 
      if (mounted) {
        console.log('📧 Auth: MFA session stored - setting mfaPending to true');
        setMfaPending(true);
      }
    };
    
    const handleMFACleared = () => { 
      if (mounted) {
        console.log('🧹 Auth: MFA cleared event - setting mfaPending to false');
        setMfaPending(false);
      }
    };

    // Mobile-specific auth completion handler
    const handleMobileAuthComplete = () => {
      if (mounted) {
        console.log('📱 Auth: Mobile auth complete - forcing state refresh');
        const isMobile = window.innerWidth < 768;
        
        if (isMobile) {
          // Force a complete auth state refresh on mobile
          setTimeout(() => {
            authService.getCurrentSession().then(session => {
              if (session?.user && mounted) {
                console.log('📱 Auth: Mobile auth refresh - setting authenticated state');
                setUser(session.user);
                setSession(session);
                setMfaPending(false);
                setIsLoading(false);
              }
            });
          }, 100);
        }
      }
    };

    window.addEventListener('mfa-session-stored', handleMFAStored);
    window.addEventListener('mfa-session-cleared', handleMFACleared);
    window.addEventListener('mobile-auth-complete', handleMobileAuthComplete);

    // Set initial MFA state
    const initialMFAState = checkInitialMFAState();
    setMfaPending(initialMFAState);
    console.log('🎯 Auth: Initial MFA state:', initialMFAState);

    const { data: { subscription } } = authService.onAuthStateChange(
      (user, session) => {
        if (!mounted) return;

        const isMobile = window.innerWidth < 768;
        console.log('🔄 Auth: State change event:', { 
          user: !!user, 
          session: !!session,
          sessionId: session?.access_token ? 'present' : 'missing',
          isMobile,
          pathname: window.location.pathname
        });

        // For authenticated users
        if (user && session) {
          console.log('✅ Auth: User authenticated');
          
          // Longer delay for mobile to ensure proper state settling
          const delay = isMobile ? 200 : 100;
          
          setTimeout(() => {
            if (!mounted) return;
            
            const pendingMFA = mfaAuthService.hasPendingMFA();
            console.log('🔍 Auth: Post-auth MFA check:', pendingMFA);
            
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
              console.log('🔒 Auth: MFA still pending');
              setMfaPending(true);
              setUser(null);
              setSession(null);
              setIsLoading(false);
            }
          }, delay);
          return;
        }

        // For unauthenticated users
        const pendingMFA = mfaAuthService.hasPendingMFA();
        console.log('🔍 Auth: No user/session, MFA check:', pendingMFA);
        
        setMfaPending(pendingMFA);
        setUser(null);
        setSession(null);
        setUserProfile(null);
        setIsLoading(false);
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
          if (session?.user) {
            console.log('✅ Auth: Found existing session');
            
            const pendingMFA = checkInitialMFAState();
            console.log('🔍 Auth: Existing session MFA check:', pendingMFA);
            
            if (!pendingMFA) {
              console.log('✅ Auth: No pending MFA for existing session');
              setUser(session.user);
              setSession(session);
              setMfaPending(false);
            } else {
              console.log('🔒 Auth: MFA pending for existing session');
              setMfaPending(true);
              setUser(null);
              setSession(null);
            }
          } else {
            console.log('❌ Auth: No existing session found');
            const pendingMFA = checkInitialMFAState();
            setMfaPending(pendingMFA);
            setUser(null);
            setSession(null);
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

    checkSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
      window.removeEventListener('mfa-session-stored', handleMFAStored);
      window.removeEventListener('mfa-session-cleared', handleMFACleared);
      window.removeEventListener('mobile-auth-complete', handleMobileAuthComplete);
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
