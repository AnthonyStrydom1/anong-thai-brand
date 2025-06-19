  // Handle validation errors
  if (error.name === 'ValidationError' || error.type === 'validation') {
    return ValidationError(
      ERROR_CODES.VALIDATION_INVALID_INPUT,
      error.message,
      error.field,
      context
    );
  }

  // Handle authentication errors
  if (error.message && (
    error.message.includes('unauthorized') ||
    error.message.includes('authentication') ||
    error.message.includes('invalid credentials') ||
    error.message.includes('token')
  )) {
    return AuthenticationError(
      ERROR_CODES.AUTH_UNAUTHORIZED,
      error.message,
      context
    );
  }

  // Handle network/timeout errors
  if (error.code === 'ECONNREFUSED' || 
      error.code === 'ETIMEDOUT' ||
      error.message.includes('timeout')) {
    return SystemError(
      ERROR_CODES.SYS_TIMEOUT,
      'Request timeout',
      context
    );
  }

  // Default to system error
  return SystemError(
    ERROR_CODES.SYS_INTERNAL_ERROR,
    error.message || 'Internal server error',
    context
  );
}

function classifySupabaseError(error, context = {}) {
  const code = error.code;
  const message = error.message;

  // Authentication errors
  if (code === 'PGRST301' || message.includes('JWT')) {
    return AuthenticationError(
      ERROR_CODES.AUTH_TOKEN_EXPIRED,
      'Authentication token expired',
      context
    );
  }

  // Authorization errors  
  if (code === 'PGRST001' || message.includes('permission')) {
    return AuthorizationError(
      ERROR_CODES.AUTHZ_INSUFFICIENT_PERMISSIONS,
      'Insufficient permissions',
      context
    );
  }

  // Constraint violations
  if (code?.startsWith('23')) {
    return DatabaseError(
      ERROR_CODES.DB_CONSTRAINT_VIOLATION,
      'Database constraint violation',
      'constraint_check',
      context
    );
  }

  // Not found
  if (code === 'PGRST116') {
    return DatabaseError(
      ERROR_CODES.DB_RECORD_NOT_FOUND,
      'Record not found',
      'SELECT',
      context
    );
  }

  // Default database error
  return DatabaseError(
    ERROR_CODES.DB_QUERY_FAILED,
    message,
    'unknown',
    context
  );
}

function classifyHttpError(error, context = {}) {
  const status = error.status || error.statusCode || error.response?.status;
  const message = error.message || error.response?.statusText || 'HTTP error';

  switch (status) {
    case 400:
      return ValidationError(ERROR_CODES.VALIDATION_INVALID_INPUT, message, null, context);
    case 401:
      return AuthenticationError(ERROR_CODES.AUTH_UNAUTHORIZED, message, context);
    case 403:
      return AuthorizationError(ERROR_CODES.AUTHZ_INSUFFICIENT_PERMISSIONS, message, context);
    case 404:
      return DatabaseError(ERROR_CODES.DB_RECORD_NOT_FOUND, 'Resource not found', 'SELECT', context);
    case 422:
      return ValidationError(ERROR_CODES.VALIDATION_INVALID_INPUT, message, null, context);
    case 429:
      return SystemError(ERROR_CODES.SYS_RATE_LIMITED, 'Rate limit exceeded', context);
    case 500:
    case 502:
    case 503:
    case 504:
      return SystemError(ERROR_CODES.SYS_INTERNAL_ERROR, message, context);
    default:
      return SystemError(ERROR_CODES.SYS_INTERNAL_ERROR, message, context);
  }
}

// ========================
// ERROR LOGGING
// ========================

async function logError(error, req, additionalContext = {}) {
  try {
    const logEntry = {
      error_code: error.code,
      error_message: error.message,
      error_category: error.category,
      error_severity: error.severity,
      tracking_id: error.trackingId,
      status_code: error.statusCode,
      user_id: req.user?.id || null,
      session_id: req.session?.id || null,
      ip_address: req.ip || req.connection?.remoteAddress,
      user_agent: req.headers['user-agent'],
      request_method: req.method,
      request_url: req.originalUrl,
      request_body: req.method !== 'GET' ? JSON.stringify(req.body) : null,
      context: JSON.stringify({
        ...error.context,
        ...additionalContext,
        stack: error.stack
      }),
      created_at: new Date().toISOString()
    };

    // Log to Supabase
    const { error: logError } = await supabase
      .from('error_logs')
      .insert([logEntry]);

    if (logError) {
      console.error('Failed to log error to database:', logError);
    }

    // Also log to console for development
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', {
        code: error.code,
        message: error.message,
        category: error.category,
        severity: error.severity,
        trackingId: error.trackingId,
        context: error.context,
        stack: error.stack
      });
    }

    // Send alerts for critical errors
    if (error.severity === ERROR_SEVERITY.CRITICAL) {
      await sendErrorAlert(error, req);
    }

  } catch (loggingError) {
    console.error('Error logging failed:', loggingError);
  }
}

async function sendErrorAlert(error, req) {
  try {
    // In production, this would integrate with your alerting system
    // (email, Slack, PagerDuty, etc.)
    console.error('CRITICAL ERROR ALERT:', {
      code: error.code,
      message: error.message,
      trackingId: error.trackingId,
      timestamp: error.timestamp,
      userId: req.user?.id,
      url: req.originalUrl
    });

    // Example: Send to webhook if configured
    if (process.env.ALERT_WEBHOOK_URL) {
      await fetch(process.env.ALERT_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'critical_error',
          error: error.toJSON(),
          request: {
            method: req.method,
            url: req.originalUrl,
            userId: req.user?.id,
            ip: req.ip
          }
        })
      });
    }
  } catch (alertError) {
    console.error('Failed to send error alert:', alertError);
  }
}

// ========================
// MIDDLEWARE FUNCTIONS
// ========================

export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export function notFoundHandler(req, res, next) {
  const error = new AppError(
    ERROR_CODES.DB_RECORD_NOT_FOUND,
    `Route ${req.originalUrl} not found`,
    404,
    ERROR_CATEGORIES.SYSTEM,
    ERROR_SEVERITY.LOW,
    'The requested resource was not found.'
  );
  next(error);
}

export function errorHandler(error, req, res, next) {
  // Classify the error
  const classifiedError = classifyError(error, {
    route: req.route?.path,
    method: req.method,
    params: req.params,
    query: req.query
  });

  // Log the error
  logError(classifiedError, req);

  // Prepare response
  const response = {
    success: false,
    error: {
      code: classifiedError.code,
      message: classifiedError.userMessage,
      category: classifiedError.category,
      severity: classifiedError.severity,
      retryable: classifiedError.retryable,
      trackingId: classifiedError.trackingId,
      timestamp: classifiedError.timestamp
    }
  };

  // Add details in development
  if (process.env.NODE_ENV === 'development') {
    response.error.details = {
      originalMessage: classifiedError.message,
      stack: classifiedError.stack,
      context: classifiedError.context
    };
  }

  // Set security headers
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block'
  });

  // Send response
  res.status(classifiedError.statusCode).json(response);
}

// ========================
// VALIDATION HELPERS
// ========================

export function validateRequired(fields, data) {
  const missing = [];
  
  for (const field of fields) {
    if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
      missing.push(field);
    }
  }
  
  if (missing.length > 0) {
    throw ValidationError(
      ERROR_CODES.VALIDATION_REQUIRED_FIELD,
      `Missing required fields: ${missing.join(', ')}`,
      missing[0],
      { missingFields: missing }
    );
  }
}

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw ValidationError(
      ERROR_CODES.VALIDATION_INVALID_FORMAT,
      'Invalid email format',
      'email',
      { value: email }
    );
  }
}

export function validateLength(field, value, min, max) {
  if (value.length < min || value.length > max) {
    throw ValidationError(
      ERROR_CODES.VALIDATION_INVALID_FORMAT,
      `${field} must be between ${min} and ${max} characters`,
      field,
      { value, min, max, actualLength: value.length }
    );
  }
}

// ========================
// SUCCESS RESPONSE HELPER
// ========================

export function successResponse(res, data, message = 'Success', statusCode = 200) {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
}

// ========================
// EXPORTS
// ========================

export {
  AppError,
  ERROR_CODES,
  ERROR_CATEGORIES,
  ERROR_SEVERITY,
  classifyError,
  logError
};
