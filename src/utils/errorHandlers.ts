/**
 * ERROR HANDLER UTILITIES
 * Common error handling patterns and utility functions
 * 
 * Provides reusable error handling patterns for consistent 
 * error management across the application
 */

import { toast } from 'sonner';
import { BaseError, ErrorClassifier, ErrorSeverity, ErrorCategory } from '@/types/errors';
import { logger } from '@/services/logger';

// ========================
// ASYNC OPERATION HELPERS
// ========================

export interface AsyncResult<T> {
  data?: T;
  error?: BaseError;
  success: boolean;
}

/**
 * Safe async wrapper that catches and classifies errors
 */
export async function safeAsync<T>(
  operation: () => Promise<T>,
  context?: Record<string, any>
): Promise<AsyncResult<T>> {
  try {
    const data = await operation();
    return { data, success: true };
  } catch (error) {
    const classifiedError = ErrorClassifier.classifyError(error, {
      source: 'safe_async',
      ...context
    });
    
    logger.logError(classifiedError, context);
    
    return { error: classifiedError, success: false };
  }
}

/**
 * Retry wrapper for operations that might fail temporarily
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  options: {
    maxRetries?: number;
    baseDelay?: number;
    maxDelay?: number;
    backoffFactor?: number;
    retryCondition?: (error: BaseError) => boolean;
    context?: Record<string, any>;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
    retryCondition = (error) => error.retryable === true,
    context = {}
  } = options;

  let lastError: BaseError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      const classifiedError = ErrorClassifier.classifyError(error, {
        source: 'retry_wrapper',
        attempt: attempt + 1,
        maxRetries: maxRetries + 1,
        ...context
      });
      
      lastError = classifiedError;
      
      // Don't retry if this is the last attempt or error is not retryable
      if (attempt === maxRetries || !retryCondition(classifiedError)) {
        logger.logError(classifiedError, {
          finalAttempt: true,
          totalAttempts: attempt + 1,
          ...context
        });
        throw classifiedError;
      }
      
      // Calculate delay with exponential backoff
      const delay = Math.min(
        baseDelay * Math.pow(backoffFactor, attempt),
        maxDelay
      );
      
      logger.warn(`Operation failed, retrying in ${delay}ms`, {
        attempt: attempt + 1,
        maxRetries: maxRetries + 1,
        error: classifiedError.code,
        delay
      });
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}

/**
 * Circuit breaker pattern implementation
 */
export class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  constructor(
    private options: {
      failureThreshold: number;
      resetTimeout: number;
      monitoringPeriod: number;
    } = {
      failureThreshold: 5,
      resetTimeout: 60000, // 1 minute
      monitoringPeriod: 30000 // 30 seconds
    }
  ) {}

  async execute<T>(operation: () => Promise<T>, context?: Record<string, any>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.options.resetTimeout) {
        this.state = 'HALF_OPEN';
        logger.info('Circuit breaker transitioning to HALF_OPEN', context);
      } else {
        throw ErrorClassifier.classifyError(
          new Error('Circuit breaker is OPEN'),
          { source: 'circuit_breaker', state: this.state, ...context }
        );
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw ErrorClassifier.classifyError(error, context);
    }
  }

  private onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  private onFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();
    
    if (this.failures >= this.options.failureThreshold) {
      this.state = 'OPEN';
      logger.warn('Circuit breaker opened', {
        failures: this.failures,
        threshold: this.options.failureThreshold
      });
    }
  }

  getState() {
    return {
      state: this.state,
      failures: this.failures,
      lastFailureTime: this.lastFailureTime
    };
  }
}

// ========================
// USER FEEDBACK UTILITIES
// ========================

export interface ErrorDisplayOptions {
  showToast?: boolean;
  toastDuration?: number;
  logError?: boolean;
  context?: Record<string, any>;
}

/**
 * Display user-friendly error messages
 */
export function handleUserError(
  error: unknown,
  options: ErrorDisplayOptions = {}
): BaseError {
  const {
    showToast = true,
    toastDuration = 5000,
    logError = true,
    context = {}
  } = options;

  const classifiedError = ErrorClassifier.classifyError(error, {
    source: 'user_error_handler',
    ...context
  });

  if (logError) {
    logger.logError(classifiedError, context);
  }

  if (showToast) {
    const toastOptions = {
      duration: toastDuration,
      id: classifiedError.trackingId
    };

    switch (classifiedError.severity) {
      case ErrorSeverity.CRITICAL:
        toast.error(classifiedError.userMessage!, {
          ...toastOptions,
          description: 'Please contact support if this continues.',
          action: {
            label: 'Copy Error ID',
            onClick: () => navigator.clipboard.writeText(classifiedError.trackingId!)
          }
        });
        break;
      
      case ErrorSeverity.HIGH:
        toast.error(classifiedError.userMessage!, toastOptions);
        break;
      
      case ErrorSeverity.MEDIUM:
        toast.warning(classifiedError.userMessage!, toastOptions);
        break;
      
      case ErrorSeverity.LOW:
        toast.info(classifiedError.userMessage!, toastOptions);
        break;
    }
  }

  return classifiedError;
}

/**
 * Success message helper
 */
export function showSuccess(
  message: string,
  description?: string,
  duration: number = 3000
) {
  toast.success(message, {
    description,
    duration
  });
}

// ========================
// FORM ERROR HANDLING
// ========================

export interface FormErrorState {
  [field: string]: string | undefined;
}

/**
 * Extract field errors from validation errors
 */
export function extractFormErrors(error: BaseError): FormErrorState {
  const fieldErrors: FormErrorState = {};

  if (error.category === ErrorCategory.VALIDATION) {
    // Handle field-specific validation errors
    if (error.context?.field) {
      fieldErrors[error.context.field] = error.userMessage;
    }
    
    // Handle multiple field errors
    if (error.context?.fields) {
      Object.entries(error.context.fields).forEach(([field, message]) => {
        fieldErrors[field] = String(message);
      });
    }
    
    // Handle missing fields
    if (error.context?.missingFields) {
      error.context.missingFields.forEach((field: string) => {
        fieldErrors[field] = `${field} is required`;
      });
    }
  }

  return fieldErrors;
}

/**
 * Form submission error handler
 */
export function handleFormError(
  error: unknown,
  setFieldErrors: (errors: FormErrorState) => void,
  context?: Record<string, any>
): BaseError {
  const classifiedError = handleUserError(error, {
    showToast: true,
    context: { source: 'form_submission', ...context }
  });

  // Extract and set field-specific errors
  const fieldErrors = extractFormErrors(classifiedError);
  setFieldErrors(fieldErrors);

  return classifiedError;
}

// ========================
// API CALL UTILITIES
// ========================

/**
 * Enhanced fetch wrapper with error handling
 */
export async function safeFetch<T>(
  url: string,
  options: RequestInit = {},
  context?: Record<string, any>
): Promise<AsyncResult<T>> {
  return safeAsync(async () => {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      throw new Error(
        errorData.error?.message || 
        errorData.message || 
        `HTTP ${response.status}: ${response.statusText}`
      );
    }

    return response.json();
  }, {
    source: 'safe_fetch',
    url,
    method: options.method || 'GET',
    ...context
  });
}

/**
 * Supabase operation wrapper
 */
export async function safeSupabaseOperation<T>(
  operation: () => Promise<{ data: T; error: any }>,
  context?: Record<string, any>
): Promise<AsyncResult<T>> {
  return safeAsync(async () => {
    const { data, error } = await operation();
    
    if (error) {
      throw error;
    }
    
    return data;
  }, {
    source: 'supabase_operation',
    ...context
  });
}

// ========================
// DEVELOPMENT UTILITIES
// ========================

/**
 * Development-only error assertions
 */
export function devAssert(condition: boolean, message: string): asserts condition {
  if (process.env.NODE_ENV === 'development' && !condition) {
    const error = new Error(`Development Assertion Failed: ${message}`);
    logger.error('Development assertion failed', error, {
      source: 'dev_assert',
      assertion: message
    });
    throw error;
  }
}

/**
 * Debug error information
 */
export function debugError(error: unknown, context?: Record<string, any>) {
  if (process.env.NODE_ENV === 'development') {
    const classifiedError = ErrorClassifier.classifyError(error, {
      source: 'debug_error',
      ...context
    });
    
    console.group(`🐛 Debug Error: ${classifiedError.code}`);
    console.log('Message:', classifiedError.message);
    console.log('Category:', classifiedError.category);
    console.log('Severity:', classifiedError.severity);
    console.log('Retryable:', classifiedError.retryable);
    console.log('Context:', classifiedError.context);
    console.log('Stack:', classifiedError.details?.stack);
    console.groupEnd();
  }
}

// ========================
// ERROR BOUNDARY HELPERS
// ========================

/**
 * Create error boundary fallback component
 */
export function createErrorFallback(
  componentName: string,
  customMessage?: string
) {
  return function ErrorFallback() {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-medium">
          {componentName} Error
        </h3>
        <p className="text-red-600 text-sm mt-1">
          {customMessage || `The ${componentName} component encountered an error.`}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
        >
          Reload Page
        </button>
      </div>
    );
  };
}

// ========================
// PERFORMANCE ERROR HANDLING
// ========================

/**
 * Handle performance-related errors
 */
export function handlePerformanceError(
  metric: string,
  value: number,
  threshold: number,
  context?: Record<string, any>
) {
  if (value > threshold) {
    logger.performance(`Performance threshold exceeded: ${metric}`, value, {
      threshold,
      exceeded: value - threshold,
      ...context
    });
    
    if (process.env.NODE_ENV === 'development') {
      console.warn(`⚠️ Performance Warning: ${metric} took ${value}ms (threshold: ${threshold}ms)`);
    }
  }
}

/**
 * Measure and handle operation performance
 */
export async function withPerformanceTracking<T>(
  operation: () => Promise<T>,
  operationName: string,
  warningThreshold: number = 1000,
  context?: Record<string, any>
): Promise<T> {
  const startTime = performance.now();
  
  try {
    const result = await operation();
    const duration = performance.now() - startTime;
    
    logger.performance(operationName, duration, context);
    handlePerformanceError(operationName, duration, warningThreshold, context);
    
    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    const classifiedError = ErrorClassifier.classifyError(error, {
      source: 'performance_tracking',
      operationName,
      duration,
      ...context
    });
    
    logger.logError(classifiedError);
    throw classifiedError;
  }
}

// ========================
// EXPORTS
// ========================

export {
  safeAsync,
  withRetry,
  CircuitBreaker,
  handleUserError,
  showSuccess,
  extractFormErrors,
  handleFormError,
  safeFetch,
  safeSupabaseOperation,
  devAssert,
  debugError,
  createErrorFallback,
  handlePerformanceError,
  withPerformanceTracking
};

export default {
  safeAsync,
  withRetry,
  CircuitBreaker,
  handleUserError,
  showSuccess,
  handleFormError,
  safeFetch,
  safeSupabaseOperation
};
