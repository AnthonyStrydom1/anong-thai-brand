
import { createClient } from '@supabase/supabase-js'

// Create a separate admin client with service role key for admin operations only
const adminClient = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export const requireAdminRole = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  try {
    const { data, error } = await adminClient
      .from('user_roles')
      .select('role')
      .eq('user_id', req.user.id)
      .eq('role', 'admin')
      .single()

    if (error || !data) {
      console.log(`Admin access denied for user: ${req.user.id}`)
      return res.status(403).json({ error: 'Admin access required' })
    }

    next()
  } catch (error) {
    console.error('Admin check error:', error)
    res.status(500).json({ error: 'Authorization check failed' })
  }
}

export const validateCustomerOwnership = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  try {
    const customerId = req.params.id || req.body.id

    // Check if user is admin first
    const { data: adminRole } = await adminClient
      .from('user_roles')
      .select('role')
      .eq('user_id', req.user.id)
      .eq('role', 'admin')
      .maybeSingle()

    if (adminRole) {
      return next() // Admin can access any customer
    }

    // Check if user owns this customer record
    const { data: customer, error } = await adminClient
      .from('customers')
      .select('user_id')
      .eq('id', customerId)
      .single()

    if (error) {
      return res.status(404).json({ error: 'Customer not found' })
    }

    if (customer.user_id !== req.user.id) {
      console.log(`Access denied: User ${req.user.id} tried to access customer ${customerId}`)
      return res.status(403).json({ error: 'Access denied' })
    }

    next()
  } catch (error) {
    console.error('Customer access validation error:', error)
    res.status(500).json({ error: 'Access validation failed' })
  }
}
