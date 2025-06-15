
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Enhanced authentication middleware with security logging
export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const userAgent = req.headers['user-agent'];
    const clientIp = req.ip || req.connection.remoteAddress;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Log authentication attempt without proper headers
      await logSecurityEvent('AUTH_MISSING_HEADER', {
        ip: clientIp,
        userAgent,
        path: req.path,
        method: req.method
      });
      
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.substring(7);
    
    // Validate token format
    if (!token || token.length < 10) {
      await logSecurityEvent('AUTH_INVALID_TOKEN_FORMAT', {
        ip: clientIp,
        userAgent,
        tokenLength: token?.length || 0
      });
      
      return res.status(401).json({ error: 'Invalid token format' });
    }
    
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      await logSecurityEvent('AUTH_TOKEN_VERIFICATION_FAILED', {
        ip: clientIp,
        userAgent,
        error: error?.message,
        path: req.path
      });
      
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Check if user account is active
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (!profile) {
      await logSecurityEvent('AUTH_INACTIVE_USER_ATTEMPT', {
        userId: user.id,
        ip: clientIp,
        userAgent
      });
      
      return res.status(401).json({ error: 'User account not found or inactive' });
    }

    // Log successful authentication
    await logSecurityEvent('AUTH_SUCCESS', {
      userId: user.id,
      ip: clientIp,
      userAgent,
      path: req.path,
      method: req.method
    });

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    await logSecurityEvent('AUTH_SYSTEM_ERROR', {
      error: error.message,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });
    
    res.status(401).json({ error: 'Authentication failed' });
  }
};

// Enhanced admin role checking with detailed logging
export const requireAdmin = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', req.user.id)
      .eq('role', 'admin')
      .single();

    if (error || !data) {
      await logSecurityEvent('ADMIN_ACCESS_DENIED', {
        userId: req.user.id,
        email: req.user.email,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        path: req.path,
        method: req.method,
        reason: 'No admin role found'
      });
      
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Log successful admin access
    await logSecurityEvent('ADMIN_ACCESS_GRANTED', {
      userId: req.user.id,
      email: req.user.email,
      ip: req.ip,
      path: req.path,
      method: req.method
    });

    next();
  } catch (error) {
    console.error('Admin check error:', error);
    
    await logSecurityEvent('ADMIN_CHECK_ERROR', {
      userId: req.user.id,
      error: error.message,
      ip: req.ip
    });
    
    res.status(500).json({ error: 'Authorization check failed' });
  }
};

// Enhanced customer access validation
export const validateCustomerAccess = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const customerId = req.params.id || req.body.id;

    if (!customerId) {
      return res.status(400).json({ error: 'Customer ID required' });
    }

    // Check if user is admin first
    const { data: adminRole } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', req.user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (adminRole) {
      await logSecurityEvent('CUSTOMER_ACCESS_ADMIN', {
        userId: req.user.id,
        customerId,
        ip: req.ip,
        path: req.path
      });
      return next();
    }

    // Check customer ownership
    const { data: customer, error } = await supabase
      .from('customers')
      .select('user_id')
      .eq('id', customerId)
      .single();

    if (error) {
      await logSecurityEvent('CUSTOMER_ACCESS_NOT_FOUND', {
        userId: req.user.id,
        customerId,
        ip: req.ip,
        error: error.message
      });
      return res.status(404).json({ error: 'Customer not found' });
    }

    if (customer.user_id !== req.user.id) {
      await logSecurityEvent('CUSTOMER_ACCESS_UNAUTHORIZED', {
        userId: req.user.id,
        customerId,
        actualOwnerId: customer.user_id,
        ip: req.ip,
        path: req.path
      });
      return res.status(403).json({ error: 'Access denied' });
    }

    await logSecurityEvent('CUSTOMER_ACCESS_AUTHORIZED', {
      userId: req.user.id,
      customerId,
      ip: req.ip
    });

    next();
  } catch (error) {
    console.error('Customer access validation error:', error);
    
    await logSecurityEvent('CUSTOMER_ACCESS_ERROR', {
      userId: req.user.id,
      error: error.message,
      ip: req.ip
    });
    
    res.status(500).json({ error: 'Access validation failed' });
  }
};

// Helper function for security event logging
async function logSecurityEvent(action, details) {
  try {
    await supabase.rpc('log_security_event_enhanced', {
      p_action: action,
      p_resource_type: 'authentication',
      p_details: details,
      p_success: !action.includes('FAILED') && !action.includes('DENIED') && !action.includes('ERROR'),
      p_severity: getSeverityFromAction(action)
    });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
}

function getSeverityFromAction(action) {
  if (action.includes('ERROR') || action.includes('DENIED')) {
    return 'high';
  } else if (action.includes('FAILED') || action.includes('UNAUTHORIZED')) {
    return 'medium';
  } else {
    return 'info';
  }
}
