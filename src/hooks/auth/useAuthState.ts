
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { AuthUser, authService } from '@/services/authService';

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mfaPending, setMfaPending] = useState(false); // Always false with MFA disabled

  useEffect(() => {
    let mounted = true;

    console.log('🔄 Auth: Initializing auth state (MFA disabled)');

    const { data: { subscription } } = authService.onAuthStateChange(
      (user, session) => {
        if (!mounted) return;

        console.log('🔄 Auth: State change event:', { 
          user: !!user, 
          session: !!session,
          sessionId: session?.access_token ? 'present' : 'missing'
        });

        // Direct authentication without MFA checks
        if (user && session) {
          console.log('✅ Auth: User authenticated directly');
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
          return;
        }

        // No user/session
        console.log('❌ Auth: No user/session found');
        setMfaPending(false);
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
            setUser(session.user);
            setSession(session);
            setMfaPending(false);
          } else {
            console.log('❌ Auth: No existing session found');
            setMfaPending(false);
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
          setMfaPending(false);
          setIsLoading(false);
        }
      }
    };

    checkSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    session,
    userProfile,
    isLoading,
    mfaPending, // Always false
    setUser,
    setSession,
    setUserProfile,
    setMfaPending
  };
}
