
import type { MFASessionData } from './mfaTypes';

const MFA_SESSION_KEY = 'mfa_session_data';
const SESSION_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds

export class MFASessionManager {
  storeSessionData(data: MFASessionData): void {
    console.log('💾 MFA Session Manager: Storing session data for:', data.email);
    try {
      localStorage.setItem(MFA_SESSION_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('❌ MFA Session Manager: Failed to store session data:', error);
    }
  }

  getSessionData(): MFASessionData | null {
    try {
      const stored = localStorage.getItem(MFA_SESSION_KEY);
      if (!stored) {
        console.log('📭 MFA Session Manager: No stored session data found');
        return null;
      }

      const data = JSON.parse(stored) as MFASessionData;
      
      // Check if session is expired
      if (this.isSessionExpired(data)) {
        console.log('⏰ MFA Session Manager: Session expired, clearing data');
        this.clearSession();
        return null;
      }

      console.log('📋 MFA Session Manager: Retrieved valid session data for:', data.email);
      return data;
    } catch (error) {
      console.error('❌ MFA Session Manager: Failed to retrieve session data:', error);
      this.clearSession();
      return null;
    }
  }

  isSessionExpired(data: MFASessionData): boolean {
    const age = Date.now() - data.timestamp;
    const expired = age > SESSION_TIMEOUT;
    
    if (expired) {
      console.log('⏰ MFA Session Manager: Session age:', Math.round(age / 1000), 'seconds (max:', Math.round(SESSION_TIMEOUT / 1000), 'seconds)');
    }
    
    return expired;
  }

  clearSession(): void {
    console.log('🧹 MFA Session Manager: Clearing session data');
    try {
      localStorage.removeItem(MFA_SESSION_KEY);
    } catch (error) {
      console.error('❌ MFA Session Manager: Failed to clear session data:', error);
    }
  }

  hasPendingMFA(): boolean {
    const data = this.getSessionData();
    const hasPending = data !== null;
    console.log('🔍 MFA Session Manager: Has pending MFA:', hasPending);
    return hasPending;
  }

  getPendingEmail(): string | null {
    const data = this.getSessionData();
    const email = data?.email || null;
    console.log('📧 MFA Session Manager: Pending email:', email);
    return email;
  }

  forceCleanupAll(): void {
    console.log('🚨 MFA Session Manager: FORCE CLEANUP - Removing all MFA data');
    try {
      // Clear from localStorage
      localStorage.removeItem(MFA_SESSION_KEY);
      
      // Clear any other MFA-related storage
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes('mfa')) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => {
        console.log('🧹 Removing MFA key:', key);
        localStorage.removeItem(key);
      });
      
    } catch (error) {
      console.error('❌ MFA Session Manager: Force cleanup failed:', error);
    }
  }
}

export const mfaSessionManager = new MFASessionManager();
