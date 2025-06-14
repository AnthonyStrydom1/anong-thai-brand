
import { supabaseService } from './supabaseService';
import { enhancedSecurityService } from './enhancedSecurityService';

class SecurityService {
  private rateLimitCache = new Map<string, { count: number; resetTime: number }>();

  // Delegate to enhanced security service for most operations
  sanitizeInput(input: string): string {
    return enhancedSecurityService.sanitizeInput(input);
  }

  isValidEmail(email: string): boolean {
    const result = enhancedSecurityService.validateEmail(email);
    return result.isValid;
  }

  isStrongPassword(password: string): { isStrong: boolean; message: string } {
    const result = enhancedSecurityService.validatePassword(password);
    return { isStrong: result.isValid, message: result.message };
  }

  checkRateLimit(key: string, maxRequests: number, windowMs: number): boolean {
    return enhancedSecurityService.checkRateLimit(key, { maxRequests, windowMs });
  }

  async logSecurityEvent(
    action: string,
    resourceType: string,
    resourceId?: string,
    details?: any
  ): Promise<void> {
    await enhancedSecurityService.logSecurityEvent(action, resourceType, resourceId, details);
  }

  escapeHtml(unsafe: string): string {
    return enhancedSecurityService.escapeHtml(unsafe);
  }

  containsSqlInjection(input: string): boolean {
    const result = enhancedSecurityService.containsSqlInjection(input);
    return !result.isValid;
  }

  // Additional security methods
  validateInput(input: string, type: 'email' | 'password' | 'general' = 'general') {
    switch (type) {
      case 'email':
        return enhancedSecurityService.validateEmail(input);
      case 'password':
        return enhancedSecurityService.validatePassword(input);
      default:
        const sqlCheck = enhancedSecurityService.containsSqlInjection(input);
        if (!sqlCheck.isValid) return sqlCheck;
        
        return { isValid: true, message: 'Input is valid', severity: 'low' as const };
    }
  }

  getSecurityMetrics() {
    return enhancedSecurityService.getSecurityMetrics();
  }

  clearSecurityCaches(): void {
    this.rateLimitCache.clear();
    enhancedSecurityService.clearSecurityCaches();
  }
}

export const securityService = new SecurityService();
