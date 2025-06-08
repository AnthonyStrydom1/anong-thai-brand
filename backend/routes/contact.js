
import express from 'express'
import { createClient } from '@supabase/supabase-js'

const router = express.Router()
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

// Submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' })
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }
    
    const contactData = {
      name,
      email,
      subject: subject || 'Contact Form Submission',
      message,
      created_at: new Date().toISOString()
    }
    
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([contactData])
      .select()
    
    if (error) {
      return res.status(500).json({ error: error.message })
    }
    
    res.status(201).json({ 
      message: 'Contact form submitted successfully', 
      submission: data[0] 
    })
  } catch (err) {
    console.error('Contact form error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get all contact submissions (admin only)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      return res.status(500).json({ error: error.message })
    }
    
    res.json({ submissions: data })
  } catch (err) {
    console.error('Get contact submissions error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
