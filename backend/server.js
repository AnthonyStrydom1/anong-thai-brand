
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Import routes
import productsRouter from './routes/products.js'
import contactRouter from './routes/contact.js'

// Import middleware
import { authenticateUser, requireAdmin, validateCustomerAccess } from './middleware/authMiddleware.js'

dotenv.config()

// Validate required environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing required environment variables: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

const app = express()

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  next()
})

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Health check endpoint (public)
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// API routes
app.use('/api/products', productsRouter)
app.use('/api/contact', contactRouter)

// Secured customer endpoints
app.post('/api/update-customer', authenticateUser, validateCustomerAccess, async (req, res) => {
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

    const { data, error } = await supabase
      .from('customers')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Update customer error:', error)
      return res.status(500).json({ error: 'Failed to update customer' })
    }

    res.json({ message: 'Customer updated successfully', customer: data })
  } catch (err) {
    console.error('Update customer error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.post('/api/create-customer', authenticateUser, async (req, res) => {
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

    // Ensure user_id is set to the authenticated user
    const customerData = {
      ...data,
      user_id: req.user.id,
      created_at: new Date().toISOString()
    }

    const { data: createdCustomer, error } = await supabase
      .from('customers')
      .insert([customerData])
      .select()
      .single()

    if (error) {
      console.error('Create customer error:', error)
      return res.status(500).json({ error: 'Failed to create customer' })
    }

    res.status(201).json({ message: 'Customer created successfully', customer: createdCustomer })
  } catch (err) {
    console.error('Create customer error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Admin-only endpoint to get all customers
app.get('/api/customers', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query
    
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1)

    if (error) {
      console.error('Get customers error:', error)
      return res.status(500).json({ error: 'Failed to fetch customers' })
    }

    res.json({ customers: data })
  } catch (err) {
    console.error('Get customers error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// User endpoint to get their own customer record
app.get('/api/customer/me', authenticateUser, async (req, res) => {
  try {
    const { data, error } = await supabase
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
