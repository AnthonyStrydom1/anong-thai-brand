
/**
 * ERROR TYPE DEFINITIONS
 * Common error types and interfaces used throughout the application
 */

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum ErrorCategory {
  NETWORK = 'network',
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  SYSTEM = 'system',
  BUSINESS = 'business',
  USER_INPUT = 'user_input',
  EXTERNAL_SERVICE = 'external_service'
}

export interface BaseError extends Error {
  code: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  timestamp: Date;
  trackingId: string;
  userMessage?: string;
  retryable: boolean;
  context?: Record<string, any>;
  details?: Record<string, any>;
}

export interface NetworkError extends BaseError {
  category: ErrorCategory.NETWORK;
  statusCode?: number;
  endpoint?: string;
  method?: string;
}

export interface ValidationError extends BaseError {
  category: ErrorCategory.VALIDATION;
  field?: string;
  value?: any;
  constraint?: string;
}

export interface AuthenticationError extends BaseError {
  category: ErrorCategory.AUTHENTICATION;
  provider?: string;
  reason?: 'invalid_credentials' | 'expired_token' | 'missing_token';
}

export interface SystemError extends BaseError {
  category: ErrorCategory.SYSTEM;
  component?: string;
  stackTrace?: string;
}
