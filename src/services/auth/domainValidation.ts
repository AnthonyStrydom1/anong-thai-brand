
export class DomainValidationService {
  private readonly DOMAIN_KEY = 'anongthaibrand_domain';
  private readonly TARGET_DOMAIN = 'anongthaibrand.com';

  isDomainValid(): boolean {
    const currentDomain = window.location.hostname.toLowerCase();
    
    // Allow the target production domain
    if (currentDomain === this.TARGET_DOMAIN) {
      return true;
    }
    
    // Allow localhost for development
    if (currentDomain === 'localhost') {
      return true;
    }
    
    // Allow Lovable preview domains (pattern: *.lovableproject.com)
    if (currentDomain.endsWith('.lovableproject.com')) {
      return true;
    }
    
    // Allow any other development/staging domains for flexibility
    if (currentDomain.includes('localhost') || 
        currentDomain.includes('127.0.0.1') ||
        currentDomain.includes('preview') ||
        currentDomain.includes('staging')) {
      return true;
    }
    
    console.log('🚫 Domain validation failed for:', currentDomain);
    return false;
  }

  clearCrossDomainSessions() {
    // Clear any sessions that may have been set from other domains
    const storedDomain = localStorage.getItem(this.DOMAIN_KEY);
    const currentDomain = window.location.hostname.toLowerCase();
    
    if (storedDomain && storedDomain !== currentDomain) {
      localStorage.clear();
      sessionStorage.clear();
    }
    
    localStorage.setItem(this.DOMAIN_KEY, currentDomain);
  }

  clearDomainKey() {
    localStorage.removeItem(this.DOMAIN_KEY);
  }

  validateSessionDomain(): boolean {
    const sessionDomain = localStorage.getItem(this.DOMAIN_KEY);
    return !sessionDomain || sessionDomain === window.location.hostname.toLowerCase();
  }
}

export const domainValidationService = new DomainValidationService();
