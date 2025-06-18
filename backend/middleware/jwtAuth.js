
import { createClient } from '@supabase/supabase-js'

// Use anon key for JWT verification instead of service role key
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY // Fallback for deployment compatibility
)

export const verifyJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authorization token provided' })
    }

    const token = authHeader.substring(7)
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }

    req.user = user
    next()
  } catch (err) {
    console.error('JWT verification error:', err)
    res.status(500).json({ error: 'Authentication error' })
  }
}

// Rate limiting middleware
const requestCounts = new Map()
const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes
const MAX_REQUESTS = 100

export const rateLimiter = (req, res, next) => {
  const clientId = req.ip || req.connection.remoteAddress
  const now = Date.now()
  
  if (!requestCounts.has(clientId)) {
    requestCounts.set(clientId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return next()
  }
  
  const clientData = requestCounts.get(clientId)
  
  if (now > clientData.resetTime) {
    requestCounts.set(clientId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return next()
  }
  
  if (clientData.count >= MAX_REQUESTS) {
    return res.status(429).json({ error: 'Too many requests' })
  }
  
  clientData.count++
  next()
}

// Input validation middleware
export const validateInput = (req, res, next) => {
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str
    return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
              .replace(/javascript:/gi, '')
              .replace(/on\w+\s*=/gi, '')
  }

  const sanitizeObject = (obj) => {
    if (obj === null || typeof obj !== 'object') return obj
    
    const sanitized = Array.isArray(obj) ? [] : {}
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = sanitizeString(value)
      } else if (typeof value === 'object') {
        sanitized[key] = sanitizeObject(value)
      } else {
        sanitized[key] = value
      }
    }
    return sanitized
  }

  if (req.body) {
    req.body = sanitizeObject(req.body)
  }
  
  next()
}
