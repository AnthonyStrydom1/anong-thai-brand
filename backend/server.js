
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// Import routes
import productsRouter from './routes/products.js'
import contactRouter from './routes/contact.js'

// Import security middleware
import { verifyJWT, validateInput } from './middleware/jwtAuth.js'
import { securityHeaders, enhancedRateLimiter, enhancedInputValidation, enforceHTTPS, requestTiming } from './middleware/securityHeaders.js'
import { requireAdminRole, validateCustomerOwnership } from './middleware/adminAuth.js'

dotenv.config()

// Validate required environment variables
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`)
    process.exit(1)
  }
}

// Warn about optional but recommended environment variables
if (!process.env.SUPABASE_ANON_KEY) {
  console.warn('WARNING: SUPABASE_ANON_KEY not set - some features may not work correctly')
}

const app = express()

// Apply security middleware first (with error handling for deployment)
try {
  app.use(enforceHTTPS)
  app.use(requestTiming)
  app.use(securityHeaders)
  app.use(enhancedRateLimiter)
} catch (error) {
  console.warn('Some security middleware failed to load:', error.message)
  // Fallback to basic security
  app.use(securityHeaders)
}

// Enhanced CORS configuration with environment-based origins
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [process.env.FRONTEND_URL].filter(Boolean)
  : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-client-info', 'apikey'],
  maxAge: 86400 // 24 hours preflight cache
}))

app.use(express.json({ limit: '1mb' })) // Reduced from 10mb
app.use(express.urlencoded({ extended: true, limit: '1mb' }))
// Enhanced input validation with fallback
try {
  app.use(enhancedInputValidation)
} catch (error) {
  console.warn('Enhanced input validation failed, using basic validation:', error.message)
  app.use(validateInput)
}

// Health check endpoint (public)
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Public API routes (no authentication required)
app.use('/api/products', productsRouter)
app.use('/api/contact', contactRouter)

// Protected customer endpoints
app.post('/api/create-customer', verifyJWT, async (req, res) => {
  try {
    const data = req.body
    
    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ error: 'Missing customer data' })
    }

    // Validate required fields
    if (!data.fullname || !data.email) {
      return res.status(400).json({ error: 'Full name and email are required' })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    // Use user's own Supabase client for this operation
    const { createClient } = await import('@supabase/supabase-js')
    const userClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
    
    // Set the user's JWT token
    await userClient.auth.setSession({
      access_token: req.headers.authorization.substring(7),
      refresh_token: null
    })

    const customerData = {
      ...data,
      user_id: req.user.id,
      created_at: new Date().toISOString()
    }

    const { data: createdCustomer, error } = await userClient
      .from('customers')
      .insert([customerData])
      .select()
      .single()

    if (error) {
      console.error('Create customer error:', error)
      return res.status(500).json({ error: 'Failed to create customer' })
    }

    console.log(`Customer created: ${createdCustomer.id} for user: ${req.user.id}`)
    res.status(201).json({ message: 'Customer created successfully', customer: createdCustomer })
  } catch (err) {
    console.error('Create customer error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.post('/api/update-customer', verifyJWT, validateCustomerOwnership, async (req, res) => {
  try {
    const { id, ...updates } = req.body
    
    if (!id) {
      return res.status(400).json({ error: 'Missing customer id' })
    }
    
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No fields to update' })
    }

    // Ensure user_id cannot be changed
    delete updates.user_id

    const { createClient } = await import('@supabase/supabase-js')
    const userClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
    
    await userClient.auth.setSession({
      access_token: req.headers.authorization.substring(7),
      refresh_token: null
    })

    const { data, error } = await userClient
      .from('customers')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Update customer error:', error)
      return res.status(500).json({ error: 'Failed to update customer' })
    }

    console.log(`Customer updated: ${id} by user: ${req.user.id}`)
    res.json({ message: 'Customer updated successfully', customer: data })
  } catch (err) {
    console.error('Update customer error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Admin-only endpoint to get all customers
app.get('/api/customers', verifyJWT, requireAdminRole, async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query
    
    const { createClient } = await import('@supabase/supabase-js')
    const adminClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

    const { data, error } = await adminClient
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1)

    if (error) {
      console.error('Get customers error:', error)
      return res.status(500).json({ error: 'Failed to fetch customers' })
    }

    console.log(`Admin ${req.user.id} accessed customer list`)
    res.json({ customers: data })
  } catch (err) {
    console.error('Get customers error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// User endpoint to get their own customer record
app.get('/api/customer/me', verifyJWT, async (req, res) => {
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const userClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
    
    await userClient.auth.setSession({
      access_token: req.headers.authorization.substring(7),
      refresh_token: null
    })

    const { data, error } = await userClient
      .from('customers')
      .select('*')
      .eq('user_id', req.user.id)
      .maybeSingle()

    if (error) {
      console.error('Get customer error:', error)
      return res.status(500).json({ error: 'Failed to fetch customer data' })
    }

    if (!data) {
      return res.status(404).json({ error: 'Customer profile not found' })
    }

    res.json({ customer: data })
  } catch (err) {
    console.error('Get customer error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: 'Internal server error' })
})

// 404 handler - this should be last
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Health check available at: http://localhost:${PORT}/health`)
})
