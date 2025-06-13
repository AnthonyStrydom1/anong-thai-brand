
import { supabaseService } from './supabaseService';

class SecurityService {
  private rateLimitCache = new Map<string, { count: number; resetTime: number }>();

  // Input sanitization
  sanitizeInput(input: string): string {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .trim();
  }

  // Email validation
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Strong password validation
  isStrongPassword(password: string): { isStrong: boolean; message: string } {
    if (password.length < 8) {
      return { isStrong: false, message: 'Password must be at least 8 characters long' };
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
      return { isStrong: false, message: 'Password must contain at least one lowercase letter' };
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
      return { isStrong: false, message: 'Password must contain at least one uppercase letter' };
    }
    
    if (!/(?=.*\d)/.test(password)) {
      return { isStrong: false, message: 'Password must contain at least one number' };
    }
    
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      return { isStrong: false, message: 'Password must contain at least one special character' };
    }
    
    return { isStrong: true, message: 'Password is strong' };
  }

  // Rate limiting
  checkRateLimit(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const rateLimitData = this.rateLimitCache.get(key);
    
    if (!rateLimitData || now > rateLimitData.resetTime) {
      this.rateLimitCache.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }
    
    if (rateLimitData.count >= maxRequests) {
      return false;
    }
    
    rateLimitData.count++;
    return true;
  }

  // Security event logging with fallback
  async logSecurityEvent(
    action: string,
    resourceType: string,
    resourceId?: string,
    details?: any
  ): Promise<void> {
    try {
      // Try using the RPC function if it exists
      await supabaseService.supabase.rpc('log_security_event', {
        _action: action,
        _resource_type: resourceType,
        _resource_id: resourceId || null,
        _details: details || null
      }).catch(() => {
        // Fallback: log to console if RPC doesn't exist
        console.log('Security Event:', {
          action,
          resourceType,
          resourceId,
          details,
          timestamp: new Date().toISOString(),
          userId: 'current-user' // Would get from auth context
        });
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  // XSS protection
  escapeHtml(unsafe: string): string {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // SQL injection prevention (basic check)
  containsSqlInjection(input: string): boolean {
    const sqlKeywords = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i;
    return sqlKeywords.test(input);
  }
}

export const securityService = new SecurityService();
