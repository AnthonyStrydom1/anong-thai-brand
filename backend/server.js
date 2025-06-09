
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Import routes
import productsRouter from './routes/products.js'
import contactRouter from './routes/contact.js'

dotenv.config()

console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'Loaded' : 'Missing')
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Loaded' : 'Missing')

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables.')
  process.exit(1)
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

const app = express()

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// API routes - These must come BEFORE any catch-all routes
app.use('/api/products', productsRouter)
app.use('/api/contact', contactRouter)

// Customer endpoints
app.post('/api/update-customer', async (req, res) => {
  try {
    const { id, ...updates } = req.body
    if (!id) {
      return res.status(400).json({ error: 'Missing customer id' })
    }
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No fields to update' })
    }

    const { data, error } = await supabase
      .from('customers')
      .update(updates)
      .eq('id', id)
      .select()

    if (error) {
      return res.status(500).json({ error: error.message })
    }
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Customer not found' })
    }

    res.json({ message: 'Customer updated successfully', customer: data[0] })
  } catch (err) {
    console.error('Update customer error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.post('/api/create-customer', async (req, res) => {
  try {
    const data = req.body
    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ error: 'Missing customer data in request body' })
    }

    // Validate required fields
    if (!data.fullName || !data.email) {
      return res.status(400).json({ error: 'Full name and email are required' })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    const { data: createdCustomer, error } = await supabase
      .from('customers')
      .insert([{ ...data, created_at: new Date().toISOString() }])
      .select()

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    res.status(201).json({ message: 'Customer created successfully', customer: createdCustomer[0] })
  } catch (err) {
    console.error('Create customer error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.get('/api/customers', async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query
    
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1)

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    res.json({ customers: data })
  } catch (err) {
    console.error('Get customers error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: 'Internal server error' })
})

// 404 handler - this should be last
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Health check available at: http://localhost:${PORT}/health`)
})
