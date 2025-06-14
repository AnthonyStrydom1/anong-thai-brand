
import type { MFASessionData } from './mfaTypes';

export class MFASessionManager {
  private readonly MFA_SESSION_KEY = 'mfa_session_data';
  private readonly MFA_CHALLENGE_KEY = 'mfa_challenge_id';

  storeSessionData(sessionData: MFASessionData): void {
    console.log('💾 MFA Session Manager: Storing session data...', { 
      email: sessionData.email, 
      userId: sessionData.userId, 
      timestamp: sessionData.timestamp 
    });
    
    try {
      // Use both sessionStorage and localStorage for redundancy
      const dataStr = JSON.stringify(sessionData);
      sessionStorage.setItem(this.MFA_SESSION_KEY, dataStr);
      localStorage.setItem(this.MFA_SESSION_KEY, dataStr);
      
      console.log('📡 MFA Session Manager: Session data stored');
    } catch (error) {
      console.error('❌ MFA Session Manager: Failed to store session data:', error);
    }
  }

  getSessionData(): MFASessionData | null {
    try {
      // Try sessionStorage first, then localStorage as fallback
      let data = sessionStorage.getItem(this.MFA_SESSION_KEY);
      if (!data) {
        data = localStorage.getItem(this.MFA_SESSION_KEY);
      }
      
      const parsed = data ? JSON.parse(data) : null;
      console.log('📖 MFA Session Manager: Getting session data:', parsed ? { 
        email: parsed.email, 
        hasData: true, 
        timestamp: parsed.timestamp 
      } : null);
      return parsed;
    } catch (error) {
      console.error('❌ MFA Session Manager: Failed to get session data:', error);
      return null;
    }
  }

  storeChallengeId(challengeId: string): void {
    console.log('🔑 MFA Session Manager: Storing challenge ID:', challengeId);
    try {
      sessionStorage.setItem(this.MFA_CHALLENGE_KEY, challengeId);
      localStorage.setItem(this.MFA_CHALLENGE_KEY, challengeId);
    } catch (error) {
      console.error('❌ MFA Session Manager: Failed to store challenge ID:', error);
    }
  }

  getChallengeId(): string | null {
    try {
      // Try sessionStorage first, then localStorage as fallback
      let challengeId = sessionStorage.getItem(this.MFA_CHALLENGE_KEY);
      if (!challengeId) {
        challengeId = localStorage.getItem(this.MFA_CHALLENGE_KEY);
      }
      return challengeId;
    } catch (error) {
      console.error('❌ MFA Session Manager: Failed to get challenge ID:', error);
      return null;
    }
  }

  clearSession(): void {
    console.log('🧹 MFA Session Manager: Clearing session data');
    try {
      sessionStorage.removeItem(this.MFA_SESSION_KEY);
      sessionStorage.removeItem(this.MFA_CHALLENGE_KEY);
      localStorage.removeItem(this.MFA_SESSION_KEY);
      localStorage.removeItem(this.MFA_CHALLENGE_KEY);
      
      // Also clear any other potential MFA-related keys that might exist
      const keysToCheck = ['mfa_session_data', 'mfa_challenge_id', 'mfaSessionData', 'mfaChallengeId'];
      keysToCheck.forEach(key => {
        sessionStorage.removeItem(key);
        localStorage.removeItem(key);
      });
      
      // Dispatch event to notify listeners
      window.dispatchEvent(new CustomEvent('mfa-session-cleared'));
      
      console.log('✅ MFA Session Manager: All MFA data cleared from storage');
    } catch (error) {
      console.error('❌ MFA Session Manager: Failed to clear session:', error);
    }
  }

  isSessionExpired(sessionData: MFASessionData): boolean {
    // Check session timeout (10 minutes)
    return Date.now() - sessionData.timestamp > 10 * 60 * 1000;
  }

  getPendingEmail(): string | null {
    const sessionData = this.getSessionData();
    const email = sessionData?.email || null;
    console.log('📧 MFA Session Manager: Getting pending email:', email);
    return email;
  }

  hasPendingMFA(): boolean {
    console.log('🔍 MFA Session Manager: Starting hasPendingMFA check...');
    
    const sessionData = this.getSessionData();
    const challengeId = this.getChallengeId();
    
    console.log('📊 MFA Session Manager: Raw data check:', {
      hasSessionData: !!sessionData,
      sessionDataEmail: sessionData?.email,
      sessionDataTimestamp: sessionData?.timestamp,
      challengeId: challengeId,
      hasChallengeId: !!challengeId
    });
    
    // If no session data, definitely no pending MFA
    if (!sessionData) {
      console.log('❌ MFA Session Manager: No session data - no pending MFA');
      return false;
    }
    
    // If session is expired, no pending MFA
    if (this.isSessionExpired(sessionData)) {
      console.log('⏰ MFA Session Manager: Session expired - clearing and returning false');
      this.clearSession();
      return false;
    }
    
    // Must have both session data AND challenge ID for pending MFA
    const result = !!challengeId;
    
    console.log('🎯 MFA Session Manager: Final hasPendingMFA result:', result, {
      hasSessionData: true,
      hasChallengeId: !!challengeId,
      email: sessionData.email,
      timestamp: sessionData.timestamp,
      isExpired: false
    });
    
    return result;
  }

  // Force clear everything - emergency cleanup
  forceCleanupAll(): void {
    console.log('🚨 MFA Session Manager: FORCE CLEANUP - Clearing ALL storage');
    
    try {
      // Clear all localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.toLowerCase().includes('mfa')) {
          localStorage.removeItem(key);
          console.log('🗑️ Removed from localStorage:', key);
        }
      });
      
      // Clear all sessionStorage
      Object.keys(sessionStorage).forEach(key => {
        if (key.toLowerCase().includes('mfa')) {
          sessionStorage.removeItem(key);
          console.log('🗑️ Removed from sessionStorage:', key);
        }
      });
      
      // Clear our specific keys
      this.clearSession();
      
      console.log('✅ MFA Session Manager: Force cleanup completed');
    } catch (error) {
      console.error('❌ MFA Session Manager: Force cleanup failed:', error);
    }
  }
}

export const mfaSessionManager = new MFASessionManager();
