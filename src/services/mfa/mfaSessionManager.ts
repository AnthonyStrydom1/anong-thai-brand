
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
      
      // Dispatch event to notify listeners
      window.dispatchEvent(new CustomEvent('mfa-session-cleared'));
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
    const sessionData = this.getSessionData();
    const hasChallenge = !!this.getChallengeId();
    const isValid = sessionData && !this.isSessionExpired(sessionData);
    const result = !!sessionData && hasChallenge && isValid;
    
    console.log('❓ MFA Session Manager: Has pending MFA:', result, { 
      hasSessionData: !!sessionData, 
      hasChallenge,
      isExpired: sessionData ? this.isSessionExpired(sessionData) : false,
      isValid
    });
    
    return result;
  }
}

export const mfaSessionManager = new MFASessionManager();
