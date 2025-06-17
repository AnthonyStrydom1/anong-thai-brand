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

        // For authenticated users, wait for MFA clearing before proceeding
        if (user && session) {
          console.log('✅ Auth: User authenticated, checking MFA state');
          
          // Small delay to ensure MFA clearing has completed
          setTimeout(() => {
            if (!mounted) return;
            
            const pendingMFA = isMFAPending();
            console.log('🔍 Auth: MFA check after login:', pendingMFA);
            
            if (!pendingMFA) {
              console.log('✅ Auth: No pending MFA, setting authenticated state');
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
              console.log('🔒 Auth: MFA still pending, waiting...');
            }
          }, 100);
          return;
        }

        // For unauthenticated users, check MFA status
        const pendingMFA = isMFAPending();
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
            console.log('✅ Auth: Found existing session, checking MFA');
            
            // Wait a moment for potential MFA clearing
            setTimeout(() => {
              if (!mounted) return;
              
              const pendingMFA = isMFAPending();
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
              setIsLoading(false);
            }, 50);
          } else {
            console.log('❌ Auth: No existing session found');
            const pendingMFA = isMFAPending();
            setMfaPending(pendingMFA);
            setUser(null);
            setSession(null);
            setIsLoading(false);
          }
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
