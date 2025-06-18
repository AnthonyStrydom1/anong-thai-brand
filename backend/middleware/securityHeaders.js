import crypto from 'crypto';

// Generate nonce for CSP
const generateNonce = () => crypto.randomBytes(16).toString('base64');

export const securityHeaders = (req, res, next) => {
  // Generate a unique nonce for each request
  const nonce = generateNonce();
  req.nonce = nonce;
  
  // Enhanced Content Security Policy with nonce-based approach
  const cspDirectives = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'`, // Removed 'unsafe-inline', using nonce
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com", // Keep for external fonts
    "img-src 'self' data: https: blob:",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https://nyadgiutmweuyxqetfuh.supabase.co wss://nyadgiutmweuyxqetfuh.supabase.co",
    "media-src 'self' data: blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
    "worker-src 'self' blob:"
  ];
  
  res.setHeader('Content-Security-Policy', cspDirectives.join('; '));
  
  // Enhanced security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=()');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  
  // Additional modern security headers
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  
  // Anti-fingerprinting and privacy headers
  res.setHeader('X-DNS-Prefetch-Control', 'off');
  res.setHeader('X-Download-Options', 'noopen');
  
  // Remove server information
  res.removeHeader('X-Powered-By');
  res.removeHeader('Server');
  
  next();
};

// Enhanced rate limiting with progressive penalties and threat detection
const requestCounts = new Map();
const suspiciousIPs = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100;
const SUSPICIOUS_THRESHOLD = 5; // Failed attempts before marking as suspicious

export const enhancedRateLimiter = (req, res, next) => {
  const clientId = getClientIdentifier(req);
  const now = Date.now();
  
  // Check if IP is marked as suspicious
  if (suspiciousIPs.has(clientId)) {
    const suspiciousData = suspiciousIPs.get(clientId);
    if (now < suspiciousData.blockedUntil) {
      logSecurityEvent('rate_limit_blocked', clientId, req);
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
      logSecurityEvent('suspicious_ip_blocked', clientId, req);
    }
    
    logSecurityEvent('rate_limit_exceeded', clientId, req);
    return res.status(429).json({ 
      error: 'Rate limit exceeded',
      retryAfter: Math.ceil((clientData.resetTime - now) / 1000)
    });
  }
  
  clientData.count++;
  next();
};

// Enhanced input validation with comprehensive threat detection
export const enhancedInputValidation = (req, res, next) => {
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    
    // Enhanced XSS prevention with more patterns
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/data:text\/html/gi, '')
      .replace(/vbscript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/style\s*=\s*[^>]*expression\s*\(/gi, '')
      .replace(/mocha:/gi, '')
      .replace(/livescript:/gi, '')
      .trim();
  };

  const validateSqlInjection = (str) => {
    if (typeof str !== 'string') return false;
    
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
      /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i,
      /(UNION\s+SELECT)/i,
      /(\bINTO\s+OUTFILE\b)/i,
      /(--|#|\/\*|\*\/)/,
      /(\bxp_cmdshell\b)/i,
      /(\bsp_executesql\b)/i
    ];
    
    return sqlPatterns.some(pattern => pattern.test(str));
  };

  const detectMaliciousPatterns = (str) => {
    if (typeof str !== 'string') return false;
    
    const maliciousPatterns = [
      /\.\.\/|\.\.\\/, // Path traversal
      /\/etc\/passwd/i, // System file access
      /\/proc\/self\/environ/i, // Environment variable access
      /\${.*}/, // Template injection
      /\{\{.*\}\}/, // Template injection
      /%2e%2e%2f/i, // Encoded path traversal
      /%252e%252e%252f/i, // Double encoded path traversal
      /\beval\s*\(/i, // Code evaluation
      /\bexec\s*\(/i, // Code execution
      /\bsystem\s*\(/i, // System command execution
    ];
    
    return maliciousPatterns.some(pattern => pattern.test(str));
  };

  const sanitizeObject = (obj, depth = 0) => {
    if (depth > 10) {
      logSecurityEvent('deep_object_detected', getClientIdentifier(req), req);
      return {}; // Prevent deep recursion attacks
    }
    if (obj === null || typeof obj !== 'object') return obj;
    
    const sanitized = Array.isArray(obj) ? [] : {};
    
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        // Check for various injection patterns
        if (validateSqlInjection(value)) {
          logSecurityEvent('sql_injection_attempt', getClientIdentifier(req), req, { field: key, value });
          return res.status(400).json({ 
            error: 'Invalid input detected',
            field: key 
          });
        }
        
        if (detectMaliciousPatterns(value)) {
          logSecurityEvent('malicious_pattern_detected', getClientIdentifier(req), req, { field: key, value });
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

  try {
    if (req.body) {
      req.body = sanitizeObject(req.body);
    }
    
    // Also sanitize query parameters
    if (req.query) {
      req.query = sanitizeObject(req.query);
    }
  } catch (error) {
    logSecurityEvent('input_validation_error', getClientIdentifier(req), req, { error: error.message });
    return res.status(400).json({ error: 'Invalid request format' });
  }
  
  next();
};

// Utility function to get consistent client identifier
function getClientIdentifier(req) {
  return req.ip || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
         'unknown';
}

// Security event logging function
function logSecurityEvent(event, clientId, req, details = {}) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    event,
    clientId,
    userAgent: req.get('User-Agent'),
    url: req.originalUrl,
    method: req.method,
    details
  };
  
  // Log to console (in production, this should go to a proper logging service)
  console.warn('SECURITY EVENT:', JSON.stringify(logEntry));
  
  // In production, integrate with security monitoring service
  if (process.env.NODE_ENV === 'production' && process.env.SECURITY_WEBHOOK_URL) {
    try {
      fetch(process.env.SECURITY_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logEntry)
      }).catch(err => console.error('Failed to send security event:', err));
    } catch (error) {
      console.error('Security monitoring service unavailable:', error);
    }
  }
}

// HTTPS enforcement middleware
export const enforceHTTPS = (req, res, next) => {
  if (process.env.NODE_ENV === 'production' && req.header('x-forwarded-proto') !== 'https') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
};

// Request timing middleware for detecting slow loris attacks
export const requestTiming = (req, res, next) => {
  const timeout = setTimeout(() => {
    logSecurityEvent('slow_request_timeout', getClientIdentifier(req), req);
    res.status(408).json({ error: 'Request timeout' });
  }, 30000); // 30 second timeout
  
  res.on('finish', () => {
    clearTimeout(timeout);
  });
  
  next();
};
