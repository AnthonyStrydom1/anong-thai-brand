
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

// Middleware to verify JWT token and extract user info
export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' })
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }

    req.user = user
    next()
  } catch (error) {
    console.error('Authentication error:', error)
    res.status(401).json({ error: 'Authentication failed' })
  }
}

// Middleware to check if user has admin role
export const requireAdmin = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', req.user.id)
      .eq('role', 'admin')
      .single()

    if (error || !data) {
      return res.status(403).json({ error: 'Admin access required' })
    }

    next()
  } catch (error) {
    console.error('Admin check error:', error)
    res.status(500).json({ error: 'Authorization check failed' })
  }
}

// Middleware to validate customer ownership or admin access
export const validateCustomerAccess = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  try {
    const customerId = req.params.id || req.body.id

    // Check if user is admin
    const { data: adminRole } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', req.user.id)
      .eq('role', 'admin')
      .maybeSingle()

    if (adminRole) {
      return next() // Admin can access any customer
    }

    // Check if user owns this customer record
    const { data: customer, error } = await supabase
      .from('customers')
      .select('user_id')
      .eq('id', customerId)
      .single()

    if (error) {
      return res.status(404).json({ error: 'Customer not found' })
    }

    if (customer.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' })
    }

    next()
  } catch (error) {
    console.error('Customer access validation error:', error)
    res.status(500).json({ error: 'Access validation failed' })
  }
}
