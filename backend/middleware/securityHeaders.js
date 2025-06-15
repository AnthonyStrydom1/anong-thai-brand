
export const securityHeaders = (req, res, next) => {
  // Enhanced Content Security Policy - more restrictive
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'", // TODO: Replace with nonce-based approach
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https://nyadgiutmweuyxqetfuh.supabase.co https://anong-thai-brand.onrender.com wss://nyadgiutmweuyxqetfuh.supabase.co",
    "media-src 'self' data: blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ];
  
  res.setHeader('Content-Security-Policy', cspDirectives.join('; '));
  
  // Enhanced security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  
  // Additional security headers
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  
  // Remove server information
  res.removeHeader('X-Powered-By');
  res.removeHeader('Server');
  
  next();
};

// Rate limiting enhancement with progressive penalties
const requestCounts = new Map();
const suspiciousIPs = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100;
const SUSPICIOUS_THRESHOLD = 5; // Failed attempts before marking as suspicious

export const enhancedRateLimiter = (req, res, next) => {
  const clientId = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  
  // Check if IP is marked as suspicious
  if (suspiciousIPs.has(clientId)) {
    const suspiciousData = suspiciousIPs.get(clientId);
    if (now < suspiciousData.blockedUntil) {
      return res.status(429).json({ 
        error: 'IP temporarily blocked due to suspicious activity',
        retryAfter: Math.ceil((suspiciousData.blockedUntil - now) / 1000)
      });
    } else {
      suspiciousIPs.delete(clientId);
    }
  }
  
  if (!requestCounts.has(clientId)) {
    requestCounts.set(clientId, { 
      count: 1, 
      resetTime: now + RATE_LIMIT_WINDOW,
      failedAttempts: 0
    });
    return next();
  }
  
  const clientData = requestCounts.get(clientId);
  
  if (now > clientData.resetTime) {
    requestCounts.set(clientId, { 
      count: 1, 
      resetTime: now + RATE_LIMIT_WINDOW,
      failedAttempts: 0
    });
    return next();
  }
  
  if (clientData.count >= MAX_REQUESTS) {
    clientData.failedAttempts = (clientData.failedAttempts || 0) + 1;
    
    // Mark as suspicious after repeated violations
    if (clientData.failedAttempts >= SUSPICIOUS_THRESHOLD) {
      suspiciousIPs.set(clientId, {
        blockedUntil: now + (60 * 60 * 1000), // Block for 1 hour
        reason: 'Rate limit violations'
      });
    }
    
    return res.status(429).json({ 
      error: 'Rate limit exceeded',
      retryAfter: Math.ceil((clientData.resetTime - now) / 1000)
    });
  }
  
  clientData.count++;
  next();
};

// Input validation with enhanced sanitization
export const enhancedInputValidation = (req, res, next) => {
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    
    // Enhanced XSS prevention
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/data:text\/html/gi, '')
      .replace(/vbscript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/style\s*=\s*[^>]*/gi, '')
      .trim();
  };

  const validateSqlInjection = (str) => {
    if (typeof str !== 'string') return false;
    
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
      /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i,
      /(UNION\s+SELECT)/i,
      /(\bINTO\s+OUTFILE\b)/i,
      /(--|#|\/\*|\*\/)/
    ];
    
    return sqlPatterns.some(pattern => pattern.test(str));
  };

  const sanitizeObject = (obj, depth = 0) => {
    if (depth > 10) return obj; // Prevent deep recursion attacks
    if (obj === null || typeof obj !== 'object') return obj;
    
    const sanitized = Array.isArray(obj) ? [] : {};
    
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        // Check for SQL injection patterns
        if (validateSqlInjection(value)) {
          return res.status(400).json({ 
            error: 'Invalid input detected',
            field: key 
          });
        }
        sanitized[key] = sanitizeString(value);
      } else if (typeof value === 'object') {
        sanitized[key] = sanitizeObject(value, depth + 1);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  };

  if (req.body) {
    try {
      req.body = sanitizeObject(req.body);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid request body' });
    }
  }
  
  next();
};
