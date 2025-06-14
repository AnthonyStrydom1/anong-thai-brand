
import { authService, type AuthUser } from '@/services/authService';
import { mfaAuthService } from '@/services/mfaAuthService';

export function useAuthOperations(
  user: any,
  setUser: (user: any) => void,
  setSession: (session: any) => void,
  setUserProfile: (profile: any) => void,
  setMfaPending: (pending: boolean) => void
) {
  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      const result = await authService.signUp({ email, password, firstName, lastName });
      
      // Account is created immediately, no email confirmation needed
      console.log('✅ Account created successfully - no confirmation email sent');
      
      return { 
        accountCreated: true, 
        user: result.user,
        session: result.session
      };
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Starting sign in process with MFA enforcement');
      
      mfaAuthService.clearMFASession();
      
      console.log('🔒 Initiating MFA signin (required for all users)');
      const mfaResult = await mfaAuthService.initiateSignIn({ email, password });
      
      console.log('🎯 MFA signin result:', mfaResult);
      
      if (mfaResult.mfaRequired) {
        console.log('✅ MFA flow initiated successfully');
        return { mfaRequired: true };
      }
      
      console.error('❌ Unexpected: MFA not required when it should be');
      throw new Error('Authentication system error - MFA expected');
      
    } catch (error) {
      console.error('❌ Sign in error:', error);
      mfaAuthService.clearMFASession();
      throw error;
    }
  };

  const signOut = async () => {
    console.log('🔄 Auth: Starting logout process');
    
    // Always clear local state first, regardless of Supabase session validity
    console.log('🧹 Auth: Clearing local state immediately');
    mfaAuthService.clearMFASession();
    setMfaPending(false);
    setUser(null);
    setSession(null);
    setUserProfile(null);
    
    // Check if we have a valid session before attempting Supabase logout
    try {
      console.log('🔍 Auth: Checking current session validity');
      const currentSession = await authService.getCurrentSession();
      
      if (currentSession) {
        console.log('🔄 Auth: Valid session found, attempting Supabase logout');
        await authService.signOut();
        console.log('✅ Auth: Supabase logout successful');
      } else {
        console.log('ℹ️ Auth: No valid session found, skipping Supabase logout');
      }
      
    } catch (error: any) {
      console.log('ℹ️ Auth: Supabase logout failed (expected for invalid sessions):', error?.message);
      // Don't throw - the user is effectively logged out locally
    }
    
    console.log('✅ Auth: Logout process completed');
  };

  const resetPassword = async (email: string) => {
    try {
      await authService.resetPassword(email);
    } catch (error) {
      console.error('Reset password error:', error);
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

  return {
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile
  };
}
