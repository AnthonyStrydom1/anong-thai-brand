
export class DomainValidationService {
  private readonly DOMAIN_KEY = 'anongthaibrand_domain';
  private readonly TARGET_DOMAIN = 'anongthaibrand.com';

  isDomainValid(): boolean {
    const currentDomain = window.location.hostname.toLowerCase();
    return currentDomain === this.TARGET_DOMAIN || currentDomain === 'localhost';
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
