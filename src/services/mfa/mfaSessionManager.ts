
import type { MFASessionData } from './mfaTypes';

const MFA_SESSION_KEY = 'mfa_session_data';
const SESSION_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds

export class MFASessionManager {
  private isStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  storeSessionData(data: MFASessionData): void {
    console.log('💾 MFA Session Manager: Storing session data for:', data.email);
    
    if (!this.isStorageAvailable()) {
      console.warn('⚠️ MFA Session Manager: localStorage not available, using sessionStorage fallback');
      try {
        sessionStorage.setItem(MFA_SESSION_KEY, JSON.stringify(data));
      } catch (error) {
        console.error('❌ MFA Session Manager: Failed to store session data in sessionStorage:', error);
      }
      return;
    }

    try {
      localStorage.setItem(MFA_SESSION_KEY, JSON.stringify(data));
      
      // Also store in sessionStorage as backup for mobile browsers
      try {
        sessionStorage.setItem(MFA_SESSION_KEY, JSON.stringify(data));
      } catch (sessionError) {
        console.warn('⚠️ MFA Session Manager: Failed to store backup in sessionStorage:', sessionError);
      }
    } catch (error) {
      console.error('❌ MFA Session Manager: Failed to store session data:', error);
    }
  }

  getSessionData(): MFASessionData | null {
    const tryGetFromStorage = (storage: Storage): MFASessionData | null => {
      try {
        const stored = storage.getItem(MFA_SESSION_KEY);
        if (!stored) return null;

        const data = JSON.parse(stored) as MFASessionData;
        
        // Check if session is expired
        if (this.isSessionExpired(data)) {
          console.log('⏰ MFA Session Manager: Session expired, clearing data');
          this.clearSession();
          return null;
        }

        return data;
      } catch (error) {
        console.error('❌ MFA Session Manager: Failed to retrieve session data from storage:', error);
        return null;
      }
    };

    // Try localStorage first
    if (this.isStorageAvailable()) {
      const data = tryGetFromStorage(localStorage);
      if (data) {
        console.log('📋 MFA Session Manager: Retrieved valid session data from localStorage for:', data.email);
        return data;
      }
    }

    // Fallback to sessionStorage
    try {
      const data = tryGetFromStorage(sessionStorage);
      if (data) {
        console.log('📋 MFA Session Manager: Retrieved valid session data from sessionStorage for:', data.email);
        return data;
      }
    } catch (error) {
      console.error('❌ MFA Session Manager: Failed to access sessionStorage:', error);
    }

    console.log('📭 MFA Session Manager: No stored session data found');
    return null;
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
    
    // Clear from both localStorage and sessionStorage
    if (this.isStorageAvailable()) {
      try {
        localStorage.removeItem(MFA_SESSION_KEY);
      } catch (error) {
        console.error('❌ MFA Session Manager: Failed to clear localStorage:', error);
      }
    }

    try {
      sessionStorage.removeItem(MFA_SESSION_KEY);
    } catch (error) {
      console.error('❌ MFA Session Manager: Failed to clear sessionStorage:', error);
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
    
    if (this.isStorageAvailable()) {
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
          console.log('🧹 Removing MFA key from localStorage:', key);
          localStorage.removeItem(key);
        });
      } catch (error) {
        console.error('❌ MFA Session Manager: Force cleanup failed for localStorage:', error);
      }
    }

    try {
      // Clear from sessionStorage
      sessionStorage.removeItem(MFA_SESSION_KEY);
      
      // Clear any other MFA-related storage from sessionStorage
      const keysToRemove = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.includes('mfa')) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => {
        console.log('🧹 Removing MFA key from sessionStorage:', key);
        sessionStorage.removeItem(key);
      });
    } catch (error) {
      console.error('❌ MFA Session Manager: Force cleanup failed for sessionStorage:', error);
    }
  }
}

export const mfaSessionManager = new MFASessionManager();
