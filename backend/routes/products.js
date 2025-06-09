
import express from 'express'
import { createClient } from '@supabase/supabase-js'

const router = express.Router()
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

// Get all products with optional filtering
router.get('/', async (req, res) => {
  try {
    const { category, search, limit = 50 } = req.query
    
    let query = supabase.from('products').select('*')
    
    if (category) {
      query = query.eq('category', category)
    }
    
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }
    
    query = query.limit(parseInt(limit))
    
    const { data, error } = await query
    
    if (error) {
      return res.status(500).json({ error: error.message })
    }
    
    res.json({ products: data })
  } catch (err) {
    console.error('Get products error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get single product by ID - Fixed route parameter
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params
    
    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' })
    }
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single()
    
    if (error) {
      return res.status(500).json({ error: error.message })
    }
    
    if (!data) {
      return res.status(404).json({ error: 'Product not found' })
    }
    
    res.json({ product: data })
  } catch (err) {
    console.error('Get product error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Create new product (authenticated)
router.post('/', async (req, res) => {
  try {
    const productData = req.body
    
    if (!productData.name || !productData.price) {
      return res.status(400).json({ error: 'Name and price are required' })
    }
    
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
    
    if (error) {
      return res.status(500).json({ error: error.message })
    }
    
    res.status(201).json({ message: 'Product created successfully', product: data[0] })
  } catch (err) {
    console.error('Create product error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
