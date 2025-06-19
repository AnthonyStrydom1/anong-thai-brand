
/**
 * ERROR HANDLER UTILITIES
 * Common error handling patterns and utility functions
 */

import React from 'react';
import { toast } from 'sonner';
import { BaseError, ErrorCategory, ErrorSeverity } from '@/types/errors';
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
    const classifiedError = {
      name: error instanceof Error ? error.name : 'UnknownError',
      message: error instanceof Error ? error.message : 'An unknown error occurred',
      code: 'UNKNOWN_ERROR',
      severity: ErrorSeverity.MEDIUM,
      userMessage: 'Something went wrong. Please try again.',
      trackingId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      retryable: true,
      category: ErrorCategory.SYSTEM,
      timestamp: new Date(),
      details: context
    } as BaseError;
    
    logger.error('Safe async operation failed', error, {
      source: 'safe_async',
      ...context
    });
    
    return { error: classifiedError, success: false };
  }
}

/**
 * Display user-friendly error messages
 */
export function handleUserError(
  error: unknown,
  options: {
    showToast?: boolean;
    toastDuration?: number;
    logError?: boolean;
    context?: Record<string, any>;
  } = {}
): BaseError {
  const {
    showToast = true,
    toastDuration = 5000,
    logError = true,
    context = {}
  } = options;

  const classifiedError = {
    name: error instanceof Error ? error.name : 'UnknownError',
    message: error instanceof Error ? error.message : 'An unknown error occurred',
    code: 'UNKNOWN_ERROR',
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'Something went wrong. Please try again.',
    trackingId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    retryable: true,
    category: ErrorCategory.SYSTEM,
    timestamp: new Date(),
    details: context
  } as BaseError;

  if (logError) {
    logger.error('User error handled', error, {
      source: 'user_error_handler',
      ...context
    });
  }

  if (showToast) {
    toast.error(classifiedError.userMessage!, {
      duration: toastDuration,
      id: classifiedError.trackingId
    });
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
 * Retry mechanism with exponential backoff
 */
interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
  retryCondition?: (error: any) => boolean;
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
    retryCondition = () => true
  } = options;

  let lastError: any;
  let attempt = 0;

  while (attempt <= maxRetries) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      attempt++;

      if (attempt > maxRetries || !retryCondition(error)) {
        throw error;
      }

      const delay = Math.min(baseDelay * Math.pow(backoffFactor, attempt - 1), maxDelay);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/**
 * Circuit breaker pattern implementation
 */
interface CircuitBreakerOptions {
  failureThreshold: number;
  resetTimeout: number;
  monitoringPeriod: number;
}

export class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  constructor(private options: CircuitBreakerOptions) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.options.resetTimeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
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

/**
 * Supabase operation wrapper
 */
export async function safeSupabaseOperation<T>(
  operation: () => Promise<{ data: T | null; error: any }>,
  context?: Record<string, any>
): Promise<AsyncResult<T>> {
  return safeAsync(async () => {
    const { data, error } = await operation();
    
    if (error) {
      throw error;
    }
    
    return data!;
  }, {
    source: 'supabase_operation',
    ...context
  });
}

/**
 * Performance tracking wrapper
 */
export async function withPerformanceTracking<T>(
  operation: () => Promise<T>,
  operationName: string,
  slowThreshold?: number
): Promise<T> {
  const startTime = performance.now();
  
  try {
    const result = await operation();
    const duration = performance.now() - startTime;
    
    logger.performance(operationName, duration);
    
    if (slowThreshold && duration > slowThreshold) {
      logger.warn(`Slow operation detected: ${operationName}`, {
        duration,
        threshold: slowThreshold
      });
    }
    
    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    
    logger.error('Operation failed with performance context', error, {
      operationName,
      duration
    });
    
    throw error;
  }
}

/**
 * Extract form errors from validation error
 */
export function extractFormErrors(error: BaseError): Record<string, string> {
  if (error.category !== ErrorCategory.VALIDATION) {
    return {};
  }

  const fieldErrors: Record<string, string> = {};

  if (error.context?.field && error.userMessage) {
    fieldErrors[error.context.field] = error.userMessage;
  }

  if (error.context?.fields) {
    Object.assign(fieldErrors, error.context.fields);
  }

  if (error.context?.missingFields && Array.isArray(error.context.missingFields)) {
    error.context.missingFields.forEach((field: string) => {
      fieldErrors[field] = `${field} is required`;
    });
  }

  return fieldErrors;
}

/**
 * Create error fallback component
 */
export function createErrorFallback(
  componentName: string,
  customMessage?: string
) {
  return function ErrorFallback() {
    return React.createElement('div', {
      className: 'p-4 bg-gray-50 rounded-lg border border-gray-200'
    }, React.createElement('p', {
      className: 'text-sm text-gray-600'
    }, customMessage || `Unable to load ${componentName}. Please refresh the page.`));
  };
}

export default {
  safeAsync,
  handleUserError,
  showSuccess,
  safeFetch,
  withRetry,
  CircuitBreaker,
  safeSupabaseOperation,
  withPerformanceTracking,
  extractFormErrors,
  createErrorFallback
};
