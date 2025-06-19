/**
 * ERROR CLASSIFICATION SYSTEM
 * Comprehensive error type definitions for Anthony Anong Project
 * 
 * This file defines the error hierarchy, severity levels, and error codes
 * for consistent error handling across the application.
 */

// ========================
// BASE ERROR TYPES
// ========================

export enum ErrorSeverity {
  LOW = 'low',           // Minor issues, degraded experience
  MEDIUM = 'medium',     // Significant issues, partial functionality lost
  HIGH = 'high',         // Critical issues, major functionality broken
  CRITICAL = 'critical'  // Application-breaking issues
}

export enum ErrorCategory {
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization', 
  VALIDATION = 'validation',
  DATABASE = 'database',
  NETWORK = 'network',
  BUSINESS_LOGIC = 'business_logic',
  SYSTEM = 'system',
  SECURITY = 'security',
  USER_INPUT = 'user_input',
  EXTERNAL_SERVICE = 'external_service'
}

export interface BaseError {
  code: string;
  message: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  timestamp: Date;
  context?: Record<string, any>;
  userMessage?: string;  // Friendly message for users
  details?: any;         // Technical details for developers
  retryable?: boolean;   // Whether the operation can be retried
  trackingId?: string;   // Unique identifier for error tracking
}

// ========================
// SPECIFIC ERROR TYPES
// ========================

export interface AuthenticationError extends BaseError {
  category: ErrorCategory.AUTHENTICATION;
  authType: 'login' | 'mfa' | 'session' | 'token' | 'logout';
  userId?: string;
}

export interface ValidationError extends BaseError {
  category: ErrorCategory.VALIDATION;
  field?: string;
  value?: any;
  constraint?: string;
  validationRule?: string;
}

export interface DatabaseError extends BaseError {
  category: ErrorCategory.DATABASE;
  operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'RPC';
  table?: string;
  query?: string;
  constraint?: string;
}

export interface NetworkError extends BaseError {
  category: ErrorCategory.NETWORK;
  url?: string;
  method?: string;
  statusCode?: number;
  timeout?: boolean;
  retryCount?: number;
}

export interface BusinessLogicError extends BaseError {
  category: ErrorCategory.BUSINESS_LOGIC;
  operation: string;
  businessRule: string;
  conflictData?: any;
}

export interface SecurityError extends BaseError {
  category: ErrorCategory.SECURITY;
  securityType: 'unauthorized_access' | 'injection' | 'xss' | 'csrf' | 'rate_limit' | 'suspicious_activity';
  ipAddress?: string;
  userAgent?: string;
  requiresAlert?: boolean;
}

// ========================
// ERROR CLASSIFICATION SYSTEM
// ========================

export class ErrorClassifier {
  /**
   * Classify an unknown error into our standard error types
   */
  static classifyError(error: unknown, context?: Record<string, any>): BaseError {
    const timestamp = new Date();
    const trackingId = generateTrackingId();

    // Handle different error types
    if (error instanceof Error) {
      return this.classifyJavaScriptError(error, context, timestamp, trackingId);
    }

    if (typeof error === 'string') {
      return this.classifyStringError(error, context, timestamp, trackingId);
    }

    if (typeof error === 'object' && error !== null) {
      return this.classifyObjectError(error as any, context, timestamp, trackingId);
    }

    // Unknown error type
    return {
      code: 'UNKNOWN_ERROR',
      message: 'An unknown error occurred',
      category: ErrorCategory.SYSTEM,
      severity: ErrorSeverity.MEDIUM,
      timestamp,
      trackingId,
      context,
      userMessage: 'Something went wrong. Please try again.',
      details: error,
      retryable: true
    };
  }

  private static classifyJavaScriptError(
    error: Error, 
    context?: Record<string, any>,
    timestamp?: Date,
    trackingId?: string
  ): BaseError {
    const message = error.message.toLowerCase();
    
    // Authentication errors
    if (message.includes('unauthorized') || message.includes('authentication') || 
        message.includes('login') || message.includes('token')) {
      return {
        code: 'AUTH_ERROR',
        message: error.message,
        category: ErrorCategory.AUTHENTICATION,
        severity: ErrorSeverity.HIGH,
        timestamp: timestamp!,
        trackingId: trackingId!,
        context,
        userMessage: 'Authentication failed. Please log in again.',
        retryable: true
      } as AuthenticationError;
    }

    // Validation errors
    if (message.includes('validation') || message.includes('invalid') || 
        message.includes('required') || message.includes('format')) {
      return {
        code: 'VALIDATION_ERROR',
        message: error.message,
        category: ErrorCategory.VALIDATION,
        severity: ErrorSeverity.MEDIUM,
        timestamp: timestamp!,
        trackingId: trackingId!,
        context,
        userMessage: 'Please check your input and try again.',
        retryable: false
      } as ValidationError;
    }

    // Network errors
    if (message.includes('network') || message.includes('fetch') || 
        message.includes('timeout') || message.includes('connection')) {
      return {
        code: 'NETWORK_ERROR',
        message: error.message,
        category: ErrorCategory.NETWORK,
        severity: ErrorSeverity.MEDIUM,
        timestamp: timestamp!,
        trackingId: trackingId!,
        context,
        userMessage: 'Connection problem. Please check your internet and try again.',
        retryable: true
      } as NetworkError;
    }

    // Default to system error
    return {
      code: 'SYSTEM_ERROR',
      message: error.message,
      category: ErrorCategory.SYSTEM,
      severity: ErrorSeverity.MEDIUM,
      timestamp: timestamp!,
      trackingId: trackingId!,
      context,
      userMessage: 'Something went wrong. Please try again.',
      details: { stack: error.stack },
      retryable: true
    };
  }

  private static classifyStringError(
    error: string,
    context?: Record<string, any>,
    timestamp?: Date,
    trackingId?: string
  ): BaseError {
    return {
      code: 'STRING_ERROR',
      message: error,
      category: ErrorCategory.SYSTEM,
      severity: ErrorSeverity.LOW,
      timestamp: timestamp!,
      trackingId: trackingId!,
      context,
      userMessage: 'Something went wrong. Please try again.',
      retryable: true
    };
  }

  private static classifyObjectError(
    error: any,
    context?: Record<string, any>,
    timestamp?: Date,
    trackingId?: string
  ): BaseError {
    // Handle Supabase errors
    if (error.code && error.message) {
      return this.classifySupabaseError(error, context, timestamp!, trackingId!);
    }

    // Handle HTTP response errors
    if (error.status || error.statusCode) {
      return this.classifyHttpError(error, context, timestamp!, trackingId!);
    }

    return {
      code: 'OBJECT_ERROR',
      message: error.message || 'Unknown object error',
      category: ErrorCategory.SYSTEM,
      severity: ErrorSeverity.MEDIUM,
      timestamp: timestamp!,
      trackingId: trackingId!,
      context,
      userMessage: 'Something went wrong. Please try again.',
      details: error,
      retryable: true
    };
  }

  private static classifySupabaseError(
    error: any,
    context?: Record<string, any>,
    timestamp?: Date,
    trackingId?: string
  ): DatabaseError {
    const severity = error.code?.startsWith('23') ? ErrorSeverity.HIGH : ErrorSeverity.MEDIUM;
    
    return {
      code: `DB_${error.code || 'UNKNOWN'}`,
      message: error.message,
      category: ErrorCategory.DATABASE,
      severity,
      timestamp: timestamp!,
      trackingId: trackingId!,
      context,
      userMessage: 'Database operation failed. Please try again.',
      operation: 'SELECT', // Default, should be provided in context
      retryable: !error.code?.startsWith('23'), // Don't retry constraint violations
      details: error
    };
  }

  private static classifyHttpError(
    error: any,
    context?: Record<string, any>, 
    timestamp?: Date,
    trackingId?: string
  ): NetworkError {
    const statusCode = error.status || error.statusCode;
    let severity = ErrorSeverity.MEDIUM;
    let userMessage = 'Request failed. Please try again.';

    if (statusCode >= 500) {
      severity = ErrorSeverity.HIGH;
      userMessage = 'Server error. Please try again later.';
    } else if (statusCode === 401) {
      severity = ErrorSeverity.HIGH;
      userMessage = 'Authentication required. Please log in.';
    } else if (statusCode === 403) {
      severity = ErrorSeverity.MEDIUM;
      userMessage = 'Access denied.';
    } else if (statusCode === 404) {
      severity = ErrorSeverity.LOW;
      userMessage = 'Requested resource not found.';
    }

    return {
      code: `HTTP_${statusCode}`,
      message: error.message || `HTTP ${statusCode} error`,
      category: ErrorCategory.NETWORK,
      severity,
      timestamp: timestamp!,
      trackingId: trackingId!,
      context,
      userMessage,
      statusCode,
      retryable: statusCode >= 500 || statusCode === 408 || statusCode === 429
    };
  }
}

// ========================
// ERROR CODES REGISTRY
// ========================

export const ERROR_CODES = {
  // Authentication
  AUTH_INVALID_CREDENTIALS: 'AUTH_001',
  AUTH_TOKEN_EXPIRED: 'AUTH_002', 
  AUTH_MFA_REQUIRED: 'AUTH_003',
  AUTH_MFA_INVALID: 'AUTH_004',
  AUTH_SESSION_EXPIRED: 'AUTH_005',

  // Authorization
  AUTHZ_INSUFFICIENT_PERMISSIONS: 'AUTHZ_001',
  AUTHZ_RESOURCE_ACCESS_DENIED: 'AUTHZ_002',

  // Validation
  VALIDATION_REQUIRED_FIELD: 'VAL_001',
  VALIDATION_INVALID_FORMAT: 'VAL_002',
  VALIDATION_OUT_OF_RANGE: 'VAL_003',
  VALIDATION_DUPLICATE_VALUE: 'VAL_004',

  // Database
  DB_CONNECTION_FAILED: 'DB_001',
  DB_QUERY_FAILED: 'DB_002',
  DB_CONSTRAINT_VIOLATION: 'DB_003',
  DB_RECORD_NOT_FOUND: 'DB_004',

  // Business Logic
  BL_INSUFFICIENT_STOCK: 'BL_001',
  BL_INVALID_ORDER_STATE: 'BL_002',
  BL_PAYMENT_FAILED: 'BL_003',
  BL_SHIPPING_UNAVAILABLE: 'BL_004',

  // System
  SYS_INTERNAL_ERROR: 'SYS_001',
  SYS_SERVICE_UNAVAILABLE: 'SYS_002',
  SYS_TIMEOUT: 'SYS_003',

  // Security
  SEC_SUSPICIOUS_ACTIVITY: 'SEC_001',
  SEC_RATE_LIMIT_EXCEEDED: 'SEC_002',
  SEC_INVALID_INPUT: 'SEC_003'
} as const;

// ========================
// UTILITY FUNCTIONS
// ========================

function generateTrackingId(): string {
  return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function isRetryableError(error: BaseError): boolean {
  return error.retryable === true;
}

export function shouldAlert(error: BaseError): boolean {
  return error.severity === ErrorSeverity.CRITICAL || 
         (error.category === ErrorCategory.SECURITY && 
          (error as SecurityError).requiresAlert === true);
}

export function formatUserMessage(error: BaseError): string {
  return error.userMessage || 'Something went wrong. Please try again.';
}

export function formatDeveloperMessage(error: BaseError): string {
  return `[${error.code}] ${error.message} (${error.trackingId})`;
}
