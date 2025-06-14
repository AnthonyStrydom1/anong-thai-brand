
import type { User, Session } from '@supabase/supabase-js';
import { authOperationsService, type SignUpData, type SignInData } from './auth/authOperations';
import { sessionManagerService } from './auth/sessionManager';
import { userProfileService, type AuthUser } from './auth/userProfile';

export type { AuthUser, SignUpData, SignInData };

class AuthService {
  // Authentication operations
  async signUp(data: SignUpData) {
    return authOperationsService.signUp(data);
  }

  async signIn(data: SignInData) {
    return authOperationsService.signIn(data);
  }

  async signOut() {
    return authOperationsService.signOut();
  }

  async resetPassword(email: string) {
    return authOperationsService.resetPassword(email);
  }

  // Session management
  async getCurrentUser(): Promise<User | null> {
    return sessionManagerService.getCurrentUser();
  }

  async getCurrentSession(): Promise<Session | null> {
    return sessionManagerService.getCurrentSession();
  }

  onAuthStateChange(callback: (user: User | null, session: Session | null) => void) {
    return sessionManagerService.onAuthStateChange(callback);
  }

  // User profile management
  async getUserProfile(userId: string): Promise<AuthUser | null> {
    return userProfileService.getUserProfile(userId);
  }

  async updateUserProfile(userId: string, updates: Partial<Omit<AuthUser, 'id' | 'email'>>) {
    return userProfileService.updateUserProfile(userId, updates);
  }
}

export const authService = new AuthService();
