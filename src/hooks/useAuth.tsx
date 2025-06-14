
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { authService, type AuthUser } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: AuthUser | null;
  isLoading: boolean;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Omit<AuthUser, 'id' | 'email'>>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = authService.onAuthStateChange(
      (user, session) => {
        console.log('Auth state changed:', { user: user?.id, session: !!session });
        setUser(user);
        setSession(session);
        
        if (user && session) {
          // Defer profile loading to prevent auth deadlock
          setTimeout(async () => {
            try {
              const profile = await authService.getUserProfile(user.id);
              setUserProfile(profile);
            } catch (error) {
              console.error('Error fetching user profile:', error);
              setUserProfile(null);
            }
          }, 0);
        } else {
          setUserProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session with proper validation
    authService.getCurrentSession().then((session) => {
      if (session?.user) {
        console.log('Found existing session:', session.user.id);
        setUser(session.user);
        setSession(session);
      } else {
        console.log('No valid session found');
        setUser(null);
        setSession(null);
      }
      setIsLoading(false);
    }).catch((error) => {
      console.error('Session check error:', error);
      setUser(null);
      setSession(null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      await authService.signUp({ email, password, firstName, lastName });
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await authService.signIn({ email, password });
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      // Clear local state immediately
      setUser(null);
      setSession(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Sign out error:', error);
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
    updateProfile,
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
