
import { supabase } from "@/integrations/supabase/client";

interface SecurityValidationResult {
  isValid: boolean;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

class EnhancedSecurityService {
  private rateLimitCache = new Map<string, { count: number; resetTime: number }>();
  private suspiciousActivityCache = new Map<string, number>();

  // Enhanced input sanitization with multiple layers
  sanitizeInput(input: string, options: { 
    allowHtml?: boolean;
    maxLength?: number;
    stripScripts?: boolean;
  } = {}): string {
    const { allowHtml = false, maxLength = 1000, stripScripts = true } = options;

    let sanitized = input.trim();
    
    // Length validation
    if (sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength);
    }

    // Remove potentially dangerous content
    if (stripScripts) {
      sanitized = sanitized
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .replace(/data:text\/html/gi, '')
        .replace(/vbscript:/gi, '');
    }

    // HTML encoding if HTML not allowed
    if (!allowHtml) {
      sanitized = this.escapeHtml(sanitized);
    }

    return sanitized;
  }

  // Comprehensive email validation
  validateEmail(email: string): SecurityValidationResult {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    if (!email) {
      return { isValid: false, message: 'Email is required', severity: 'medium' };
    }

    if (email.length > 254) {
      return { isValid: false, message: 'Email is too long', severity: 'medium' };
    }

    if (!emailRegex.test(email)) {
      return { isValid: false, message: 'Invalid email format', severity: 'medium' };
    }

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /(.)\1{4,}/, // Repeated characters
      /<script/i,
      /javascript:/i,
      /data:text\/html/i
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(email)) {
        return { isValid: false, message: 'Email contains suspicious content', severity: 'high' };
      }
    }

    return { isValid: true, message: 'Valid email', severity: 'low' };
  }

  // Enhanced password validation
  validatePassword(password: string): SecurityValidationResult {
    if (!password) {
      return { isValid: false, message: 'Password is required', severity: 'critical' };
    }

    if (password.length < 8) {
      return { isValid: false, message: 'Password must be at least 8 characters long', severity: 'high' };
    }

    if (password.length > 128) {
      return { isValid: false, message: 'Password is too long', severity: 'medium' };
    }

    const checks = [
      { regex: /[a-z]/, message: 'Password must contain at least one lowercase letter' },
      { regex: /[A-Z]/, message: 'Password must contain at least one uppercase letter' },
      { regex: /\d/, message: 'Password must contain at least one number' },
      { regex: /[@$!%*?&]/, message: 'Password must contain at least one special character' }
    ];

    for (const check of checks) {
      if (!check.regex.test(password)) {
        return { isValid: false, message: check.message, severity: 'medium' };
      }
    }

    // Check for common weak passwords
    const commonPasswords = ['password', '123456', 'qwerty', 'admin', 'letmein'];
    if (commonPasswords.some(weak => password.toLowerCase().includes(weak))) {
      return { isValid: false, message: 'Password contains common weak patterns', severity: 'high' };
    }

    return { isValid: true, message: 'Password meets security requirements', severity: 'low' };
  }

  // Enhanced rate limiting with progressive penalties
  checkRateLimit(key: string, config: RateLimitConfig): boolean {
    const now = Date.now();
    const rateLimitData = this.rateLimitCache.get(key);
    
    if (!rateLimitData || now > rateLimitData.resetTime) {
      this.rateLimitCache.set(key, { count: 1, resetTime: now + config.windowMs });
      return true;
    }
    
    if (rateLimitData.count >= config.maxRequests) {
      // Track suspicious activity
      const suspiciousCount = this.suspiciousActivityCache.get(key) || 0;
      this.suspiciousActivityCache.set(key, suspiciousCount + 1);
      
      // Log security event for rate limit violation
      this.logSecurityEvent('RATE_LIMIT_EXCEEDED', 'authentication', undefined, {
        key,
        attempts: rateLimitData.count,
        suspiciousCount: suspiciousCount + 1
      });
      
      return false;
    }
    
    rateLimitData.count++;
    return true;
  }

  // Security event logging with enhanced context
  async logSecurityEvent(
    action: string,
    resourceType: string,
    resourceId?: string,
    details?: any
  ): Promise<void> {
    try {
      // Get additional context
      const context = {
        ...details,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        url: window.location.href
      };

      console.log('Security Event:', {
        action,
        resourceType,
        resourceId,
        context
      });

      // Use the database function to log security events
      const { error } = await supabase.rpc('log_security_event', {
        p_action: action,
        p_resource_type: resourceType,
        p_resource_id: resourceId || null,
        p_details: context
      });

      if (error) {
        console.error('Failed to log security event:', error);
      }
    } catch (error) {
      console.error('Security logging failed:', error);
    }
  }

  // Enhanced XSS protection
  escapeHtml(unsafe: string): string {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
      .replace(/\//g, "&#x2F;");
  }

  // SQL injection prevention with enhanced detection
  containsSqlInjection(input: string): SecurityValidationResult {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
      /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i,
      /(UNION\s+SELECT)/i,
      /(\bINTO\s+OUTFILE\b)/i,
      /(\bLOAD_FILE\s*\()/i,
      /(benchmark\s*\(|sleep\s*\()/i,
      /('|(\\')|(;)|(=))/,
      /(--|#|\/\*|\*\/)/
    ];

    for (const pattern of sqlPatterns) {
      if (pattern.test(input)) {
        return {
          isValid: false,
          message: 'Input contains potential SQL injection patterns',
          severity: 'critical'
        };
      }
    }

    return { isValid: true, message: 'Input appears safe', severity: 'low' };
  }

  // CSRF token validation (placeholder for implementation)
  generateCSRFToken(): string {
    return crypto.randomUUID();
  }

  validateCSRFToken(token: string, expectedToken: string): boolean {
    return token === expectedToken;
  }

  // Session security validation
  validateSession(): boolean {
    // Check for session timeout, suspicious activity patterns, etc.
    const sessionStart = sessionStorage.getItem('session_start');
    if (!sessionStart) return false;

    const sessionAge = Date.now() - parseInt(sessionStart);
    const maxSessionAge = 24 * 60 * 60 * 1000; // 24 hours

    return sessionAge < maxSessionAge;
  }

  // Clear security caches (useful for cleanup)
  clearSecurityCaches(): void {
    this.rateLimitCache.clear();
    this.suspiciousActivityCache.clear();
  }

  // Get security metrics for monitoring
  getSecurityMetrics(): {
    rateLimitViolations: number;
    suspiciousActivities: number;
    activeRateLimits: number;
  } {
    return {
      rateLimitViolations: Array.from(this.rateLimitCache.values()).reduce((acc, data) => acc + data.count, 0),
      suspiciousActivities: Array.from(this.suspiciousActivityCache.values()).reduce((acc, count) => acc + count, 0),
      activeRateLimits: this.rateLimitCache.size
    };
  }
}

export const enhancedSecurityService = new EnhancedSecurityService();
