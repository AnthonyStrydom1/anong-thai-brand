
import { supabaseService } from './supabaseService';

class SecurityService {
  // Log security events for audit trail
  async logSecurityEvent(
    action: string,
    resourceType: string,
    resourceId?: string,
    details?: any
  ) {
    try {
      const { error } = await supabaseService.supabase.rpc('log_security_event', {
        _action: action,
        _resource_type: resourceType,
        _resource_id: resourceId || null,
        _details: details || null
      });

      if (error) {
        console.error('Failed to log security event:', error);
      }
    } catch (err) {
      console.error('Security logging error:', err);
    }
  }

  // Input sanitization
  sanitizeInput(input: string): string {
    if (typeof input !== 'string') return input;
    
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }

  // Validate email format
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Check password strength
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
    
    return { isStrong: true, message: 'Password is strong' };
  }

  // Rate limiting check (client-side)
  private rateLimitMap = new Map<string, { count: number; resetTime: number }>();
  
  checkRateLimit(identifier: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    const key = identifier;
    
    if (!this.rateLimitMap.has(key)) {
      this.rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }
    
    const rateData = this.rateLimitMap.get(key)!;
    
    if (now > rateData.resetTime) {
      this.rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }
    
    if (rateData.count >= maxRequests) {
      return false;
    }
    
    rateData.count++;
    return true;
  }
}

export const securityService = new SecurityService();
