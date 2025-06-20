
export class DomainValidationService {
  private readonly DOMAIN_KEY = 'anongthaibrand_domain';
  private readonly TARGET_DOMAIN = 'anongthaibrand.com';

  isDomainValid(): boolean {
    const currentDomain = window.location.hostname.toLowerCase();
    const normalizedDomain = currentDomain.replace(/^www\./, '');

    // Allow target production domain
    if (normalizedDomain === this.TARGET_DOMAIN) {
      return true;
    }

    // Allow localhost for development
    if (currentDomain === 'localhost') {
      return true;
    }

    // Allow Lovable preview domains
    if (currentDomain.endsWith('.lovableproject.com')) {
      return true;
    }

    // Allow other development/staging domains
    if (
      currentDomain.includes('localhost') || 
      currentDomain.includes('127.0.0.1') ||
      currentDomain.includes('preview') ||
      currentDomain.includes('staging') ||
      currentDomain.includes('dev') ||
      currentDomain.includes('test')
    ) {
      return true;
    }

    console.log('🚫 Domain validation failed for:', currentDomain);
    return false;
  }

  clearCrossDomainSessions() {
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
    const currentDomain = window.location.hostname.toLowerCase();
    return !sessionDomain || sessionDomain === currentDomain;
  }
}

export const domainValidationService = new DomainValidationService();
