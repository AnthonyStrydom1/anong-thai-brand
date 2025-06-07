import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config()

console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'Loaded' : 'Missing')
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Loaded' : 'Missing')

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables.')
  process.exit(1)
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

const app = express()
app.use(cors())
app.use(express.json())

// Update existing customer by id
app.post('/update-customer', async (req, res) => {
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

// Create new customer
app.post('/create-customer', async (req, res) => {
  try {
    const data = req.body
    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ error: 'Missing customer data in request body' })
    }

    const { data: createdCustomer, error } = await supabase
      .from('customers')
      .insert([data])
      .select()

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    res.json({ message: 'Customer created successfully', customer: createdCustomer[0] })
  } catch (err) {
    console.error('Create customer error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
