
import { supabaseService } from './supabaseService';
import { enhancedSecurityService } from './enhancedSecurityService';

class SecurityService {
  private rateLimitCache = new Map<string, { count: number; resetTime: number }>();
  private sessionCache = new Map<string, { userId: string; expiresAt: number }>();

  // Enhanced input sanitization
  sanitizeInput(input: string, options: {
    allowHtml?: boolean;
    maxLength?: number;
    stripScripts?: boolean;
  } = {}): string {
    return enhancedSecurityService.sanitizeInput(input, options);
  }

  // Enhanced email validation with additional security checks
  isValidEmail(email: string): boolean {
    const result = enhancedSecurityService.validateEmail(email);
    
    // Log suspicious email patterns
    if (!result.isValid && result.severity === 'high') {
      this.logSecurityEvent('SUSPICIOUS_EMAIL_PATTERN', 'authentication', undefined, {
        email: this.escapeHtml(email),
        reason: result.message
      });
    }
    
    return result.isValid;
  }

  // Enhanced password validation
  isStrongPassword(password: string): { isStrong: boolean; message: string } {
    const result = enhancedSecurityService.validatePassword(password);
    return { isStrong: result.isValid, message: result.message };
  }

  // Enhanced rate limiting with progressive penalties
  checkRateLimit(key: string, maxRequests: number, windowMs: number): boolean {
    const result = enhancedSecurityService.checkRateLimit(key, { maxRequests, windowMs });
    
    if (!result) {
      this.logSecurityEvent('RATE_LIMIT_VIOLATION', 'authentication', undefined, {
        key: this.escapeHtml(key),
        maxRequests,
        windowMs
      });
    }
    
    return result;
  }

  // Enhanced security event logging
  async logSecurityEvent(
    action: string,
    resourceType: string,
    resourceId?: string,
    details?: any
  ): Promise<void> {
    try {
      // Add additional context for enhanced logging
      const enhancedDetails = {
        ...details,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        referrer: document.referrer,
        sessionId: this.generateSessionId()
      };

      await enhancedSecurityService.logSecurityEvent(
        action, 
        resourceType, 
        resourceId, 
        enhancedDetails
      );
    } catch (error) {
      console.error('Security logging failed:', error);
    }
  }

  // Enhanced XSS protection
  escapeHtml(unsafe: string): string {
    return enhancedSecurityService.escapeHtml(unsafe);
  }

  // Enhanced SQL injection detection
  containsSqlInjection(input: string): boolean {
    const result = enhancedSecurityService.containsSqlInjection(input);
    
    if (!result.isValid) {
      this.logSecurityEvent('SQL_INJECTION_ATTEMPT', 'input_validation', undefined, {
        input: this.escapeHtml(input.substring(0, 100)), // Log first 100 chars only
        severity: result.severity
      });
    }
    
    return !result.isValid;
  }

  // Session security management
  generateSessionId(): string {
    return crypto.randomUUID();
  }

  validateSession(sessionId: string): boolean {
    const session = this.sessionCache.get(sessionId);
    if (!session) return false;
    
    if (Date.now() > session.expiresAt) {
      this.sessionCache.delete(sessionId);
      return false;
    }
    
    return true;
  }

  createSecureSession(userId: string, expirationMinutes: number = 60): string {
    const sessionId = this.generateSessionId();
    const expiresAt = Date.now() + (expirationMinutes * 60 * 1000);
    
    this.sessionCache.set(sessionId, { userId, expiresAt });
    
    this.logSecurityEvent('SESSION_CREATED', 'authentication', userId, {
      sessionId,
      expirationMinutes
    });
    
    return sessionId;
  }

  invalidateSession(sessionId: string): void {
    const session = this.sessionCache.get(sessionId);
    if (session) {
      this.sessionCache.delete(sessionId);
      this.logSecurityEvent('SESSION_INVALIDATED', 'authentication', session.userId, {
        sessionId
      });
    }
  }

  // Enhanced input validation with multiple layers
  validateInput(input: string, type: 'email' | 'password' | 'general' = 'general') {
    // First check for SQL injection
    if (this.containsSqlInjection(input)) {
      return { 
        isValid: false, 
        message: 'Input contains potentially dangerous content', 
        severity: 'critical' as const 
      };
    }

    // Then apply type-specific validation
    switch (type) {
      case 'email':
        return enhancedSecurityService.validateEmail(input);
      case 'password':
        return enhancedSecurityService.validatePassword(input);
      default:
        return { 
          isValid: true, 
          message: 'Input is valid', 
          severity: 'low' as const 
        };
    }
  }

  // Security metrics for monitoring
  getSecurityMetrics() {
    const baseMetrics = enhancedSecurityService.getSecurityMetrics();
    
    return {
      ...baseMetrics,
      activeSessions: this.sessionCache.size,
      cacheSize: this.rateLimitCache.size + this.sessionCache.size
    };
  }

  // Cleanup expired data
  clearSecurityCaches(): void {
    this.rateLimitCache.clear();
    this.sessionCache.clear();
    enhancedSecurityService.clearSecurityCaches();
    
    this.logSecurityEvent('SECURITY_CACHE_CLEARED', 'maintenance', undefined, {
      timestamp: new Date().toISOString()
    });
  }

  // Periodic cleanup of expired sessions
  cleanupExpiredSessions(): number {
    let cleanedCount = 0;
    const now = Date.now();
    
    for (const [sessionId, session] of this.sessionCache.entries()) {
      if (now > session.expiresAt) {
        this.sessionCache.delete(sessionId);
        cleanedCount++;
      }
    }
    
    if (cleanedCount > 0) {
      this.logSecurityEvent('EXPIRED_SESSIONS_CLEANED', 'maintenance', undefined, {
        cleanedCount,
        timestamp: new Date().toISOString()
      });
    }
    
    return cleanedCount;
  }
}

export const securityService = new SecurityService();

// Set up periodic cleanup
setInterval(() => {
  securityService.cleanupExpiredSessions();
}, 5 * 60 * 1000); // Clean up every 5 minutes
