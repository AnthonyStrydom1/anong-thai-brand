
/**
 * ERROR HANDLER UTILITIES
 * Common error handling patterns and utility functions
 */

import { toast } from 'sonner';
import { BaseError } from '@/types/errors';
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
      severity: 'medium',
      userMessage: 'Something went wrong. Please try again.',
      trackingId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      retryable: true,
      category: 'unknown',
      timestamp: new Date(),
      details: context
    } as BaseError;
    
    logger.error('Safe async operation failed', error, context);
    
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
    severity: 'medium',
    userMessage: 'Something went wrong. Please try again.',
    trackingId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    retryable: true,
    category: 'unknown',
    timestamp: new Date(),
    details: context
  } as BaseError;

  if (logError) {
    logger.error('User error handled', error, context);
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

export default {
  safeAsync,
  handleUserError,
  showSuccess,
  safeFetch
};
