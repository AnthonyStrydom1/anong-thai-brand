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

    const loadUserProfile = async (userId: string) => {
      try {
        const profile = await authService.getUserProfile(userId);
        if (mounted) setUserProfile(profile);
      } catch (error) {
        console.error('❌ Auth: Failed to load user profile:', error);
        if (mounted) setUserProfile(null);
      }
    };

    const setAuthenticatedState = (user: User, session: Session) => {
      if (!mounted) return;
      
      console.log('✅ Auth: Setting authenticated state');
      setUser(user);
      setSession(session);
      setMfaPending(false);
      setIsLoading(false);
      
      // Load user profile
      loadUserProfile(user.id);
    };

    const handleMFAStored = () => {
      if (mounted) {
        console.log('🔒 Auth: MFA session stored - setting pending state');
        setMfaPending(true);
      }
    };

    const handleMFACleared = async () => {
      if (!mounted) return;
      
      console.log('📡 Auth: MFA cleared event - checking for valid session');
      
      try {
        // Check if we have a valid session after MFA completion
        const currentSession = await authService.getCurrentSession();
        
        if (currentSession?.user) {
          console.log('✅ Auth: Valid session found after MFA completion');
          setAuthenticatedState(currentSession.user, currentSession);
        } else {
          console.log('❌ Auth: No valid session after MFA completion');
          setMfaPending(false);
          setUser(null);
          setSession(null);
          setUserProfile(null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('❌ Auth: Error checking session after MFA cleared:', error);
        setMfaPending(false);
        setUser(null);
        setSession(null);
        setUserProfile(null);
        setIsLoading(false);
      }
    };

    // Only clear stale MFA data, not active sessions
    const initializeMFAState = () => {
      // Check if there's a current session first
      authService.getCurrentSession().then(currentSession => {
        if (!currentSession?.user) {
          // Only clear MFA data if there's no active session
          console.log('🧹 Auth: Clearing stale MFA data (no active session)');
          mfaSessionManager.forceCleanupAll();
        }
        
        const pendingMFA = mfaAuthService.hasPendingMFA();
        console.log('🎯 Auth: Initial MFA state:', pendingMFA);
        
        if (mounted) {
          setMfaPending(pendingMFA);
        }
      });
    };

    // Set up event listeners
    window.addEventListener('mfa-session-stored', handleMFAStored);
    window.addEventListener('mfa-session-cleared', handleMFACleared);

    // Initialize MFA state
    initializeMFAState();

    // Set up auth state change listener
    const { data: { subscription } } = authService.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('🔄 Auth: State change event:', { 
          event,
          user: !!session?.user, 
          session: !!session,
          sessionId: session?.access_token ? 'present' : 'missing',
          userId: session?.user?.id || 'none'
        });

        // Handle different auth events
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('✅ Auth: SIGNED_IN event with valid session');
          
          // Check if MFA is required/pending
          const pendingMFA = mfaAuthService.hasPendingMFA();
          console.log('🔍 Auth: MFA pending check:', pendingMFA);
          
          if (pendingMFA) {
            console.log('🔒 Auth: MFA verification still required, staying in pending state');
            setMfaPending(true);
            setUser(null);
            setSession(null);
            setUserProfile(null);
            setIsLoading(false);
          } else {
            console.log('✅ Auth: No MFA required, setting authenticated state');
            setAuthenticatedState(session.user, session);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('❌ Auth: SIGNED_OUT event');
          const pendingMFA = mfaAuthService.hasPendingMFA();
          
          setMfaPending(pendingMFA);
          setUser(null);
          setSession(null);
          setUserProfile(null);
          setIsLoading(false);
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          console.log('🔄 Auth: TOKEN_REFRESHED event');
          const pendingMFA = mfaAuthService.hasPendingMFA();
          
          if (!pendingMFA) {
            console.log('✅ Auth: Token refreshed, updating session');
            setAuthenticatedState(session.user, session);
          }
        } else {
          console.log(`⚠️ Auth: Unhandled event or invalid session:`, { event, hasSession: !!session, hasUser: !!session?.user });
          
          // Only clear state if we're certain there's no valid session
          if (event === 'INITIAL_SESSION' && !session) {
            console.log('❌ Auth: No initial session found');
            const pendingMFA = mfaAuthService.hasPendingMFA();
            setMfaPending(pendingMFA);
            setUser(null);
            setSession(null);
            setUserProfile(null);
            setIsLoading(false);
          }
        }
      }
    );

    // Check for existing session
    const checkInitialSession = async () => {
      try {
        console.log('🔍 Auth: Checking for existing session');
        const currentSession = await authService.getCurrentSession();
        
        if (mounted) {
          if (currentSession?.user) {
            console.log('✅ Auth: Found existing session');
            
            const pendingMFA = mfaAuthService.hasPendingMFA();
            
            if (pendingMFA) {
              console.log('🔒 Auth: Existing session has pending MFA');
              setMfaPending(true);
              setUser(null);
              setSession(null);
              setUserProfile(null);
            } else {
              console.log('✅ Auth: Existing session is valid, no MFA required');
              setAuthenticatedState(currentSession.user, currentSession);
            }
          } else {
            console.log('❌ Auth: No existing session');
            const pendingMFA = mfaAuthService.hasPendingMFA();
            setMfaPending(pendingMFA);
            setUser(null);
            setSession(null);
            setUserProfile(null);
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error('❌ Auth: Initial session check failed:', error);
        if (mounted) {
          setUser(null);
          setSession(null);
          setUserProfile(null);
          setIsLoading(false);
        }
      }
    };

    checkInitialSession();

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