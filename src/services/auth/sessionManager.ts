
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from '@supabase/supabase-js';
import { domainValidationService } from './domainValidation';
import { authOperationsService } from './authOperations';

export class SessionManagerService {
  async getCurrentUser(): Promise<User | null> {
    if (!domainValidationService.isDomainValid()) {
      return null;
    }

    domainValidationService.clearCrossDomainSessions();

    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Get user error:', error);
      return null;
    }
    return user;
  }

  async getCurrentSession(): Promise<Session | null> {
    if (!domainValidationService.isDomainValid()) {
      return null;
    }

    domainValidationService.clearCrossDomainSessions();

    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Get session error:', error);
      return null;
    }
    
    // Strict session validation
    if (session && session.expires_at) {
      const expiresAt = new Date(session.expires_at * 1000);
      const now = new Date();
      
      if (expiresAt <= now) {
        console.log('Session expired, signing out');
        await authOperationsService.signOut();
        return null;
      }

      // Additional validation - check if session is from correct domain
      if (!domainValidationService.validateSessionDomain()) {
        console.log('Cross-domain session detected, clearing');
        await authOperationsService.signOut();
        return null;
      }
    }
    
    return session;
  }

  onAuthStateChange(callback: (user: User | null, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change event:', event, 'Valid domain:', domainValidationService.isDomainValid());
      
      // Only process auth changes on valid domain
      if (!domainValidationService.isDomainValid()) {
        callback(null, null);
        return;
      }

      if (session && session.user) {
        // Validate session belongs to current domain
        if (!domainValidationService.validateSessionDomain()) {
          console.log('Rejecting cross-domain session');
          callback(null, null);
          return;
        }
        callback(session.user, session);
      } else {
        callback(null, null);
      }
    });
  }
}

export const sessionManagerService = new SessionManagerService();
