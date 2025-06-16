
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from '@supabase/supabase-js';
import { domainValidationService } from './domainValidation';
import { authOperationsService } from './authOperations';

export class SessionManagerService {
  async getCurrentUser(): Promise<User | null> {
    // Temporarily disable domain validation for development
    // if (!domainValidationService.isDomainValid()) {
    //   return null;
    // }

    // domainValidationService.clearCrossDomainSessions();

    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Get user error:', error);
      return null;
    }
    return user;
  }

  async getCurrentSession(): Promise<Session | null> {
    // Temporarily disable domain validation for development
    // if (!domainValidationService.isDomainValid()) {
    //   return null;
    // }

    // domainValidationService.clearCrossDomainSessions();

    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Get session error:', error);
      return null;
    }
    
    // Basic session validation
    if (session && session.expires_at) {
      const expiresAt = new Date(session.expires_at * 1000);
      const now = new Date();
      
      if (expiresAt <= now) {
        console.log('Session expired, signing out');
        await authOperationsService.signOut();
        return null;
      }
    }
    
    return session;
  }

  onAuthStateChange(callback: (user: User | null, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change event:', event, 'Session:', !!session);
      
      // Process all auth changes without domain restrictions for now
      if (session && session.user) {
        callback(session.user, session);
      } else {
        callback(null, null);
      }
    });
  }
}

export const sessionManagerService = new SessionManagerService();
