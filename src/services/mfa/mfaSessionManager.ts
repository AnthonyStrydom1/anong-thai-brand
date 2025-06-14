
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
    
    // Use both sessionStorage and a custom event to ensure detection
    sessionStorage.setItem(this.MFA_SESSION_KEY, JSON.stringify(sessionData));
    
    // Dispatch a custom event to notify listeners
    window.dispatchEvent(new CustomEvent('mfa-session-stored', { detail: sessionData }));
    
    console.log('📡 MFA Session Manager: Session data stored and event dispatched');
  }

  getSessionData(): MFASessionData | null {
    const data = sessionStorage.getItem(this.MFA_SESSION_KEY);
    const parsed = data ? JSON.parse(data) : null;
    console.log('📖 MFA Session Manager: Getting session data:', parsed ? { 
      email: parsed.email, 
      hasData: true, 
      timestamp: parsed.timestamp 
    } : null);
    return parsed;
  }

  storeChallengeId(challengeId: string): void {
    console.log('🔑 MFA Session Manager: Storing challenge ID:', challengeId);
    sessionStorage.setItem(this.MFA_CHALLENGE_KEY, challengeId);
  }

  getChallengeId(): string | null {
    return sessionStorage.getItem(this.MFA_CHALLENGE_KEY);
  }

  clearSession(): void {
    console.log('🧹 MFA Session Manager: Clearing session data');
    sessionStorage.removeItem(this.MFA_SESSION_KEY);
    sessionStorage.removeItem(this.MFA_CHALLENGE_KEY);
    
    // Dispatch event to notify listeners
    window.dispatchEvent(new CustomEvent('mfa-session-cleared'));
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
    const result = !!sessionData && hasChallenge;
    console.log('❓ MFA Session Manager: Has pending MFA:', result, { 
      hasSessionData: !!sessionData, 
      hasChallenge 
    });
    return result;
  }
}

export const mfaSessionManager = new MFASessionManager();
