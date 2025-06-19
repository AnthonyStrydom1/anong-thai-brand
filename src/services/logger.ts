/**
 * CENTRALIZED LOGGING SERVICE
 * Unified logging system for Anthony Anong Project
 * 
 * Provides structured logging with multiple levels, targets, and formats
 * Supports both development and production environments
 */

import { BaseError, ErrorSeverity, ErrorCategory } from '@/types/errors';

// ========================
// LOGGING CONFIGURATION
// ========================

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4
}

export enum LogTarget {
  CONSOLE = 'console',
  LOCAL_STORAGE = 'localStorage',
  SESSION_STORAGE = 'sessionStorage',
  EXTERNAL_SERVICE = 'externalService',
  SUPABASE = 'supabase'
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  category: string;
  message: string;
  data?: any;
  context?: Record<string, any>;
  userId?: string;
  sessionId?: string;
  url?: string;
  userAgent?: string;
  trackingId?: string;
  source?: string;
}

export interface LoggerConfig {
  level: LogLevel;
  targets: LogTarget[];
  enabledInProduction: boolean;
  maxStorageEntries: number;
  formatters: {
    console: boolean;
    structured: boolean;
  };
  externalService?: {
    endpoint: string;
    apiKey?: string;
    batchSize: number;
    flushInterval: number;
  };
}

// ========================
// DEFAULT CONFIGURATION
// ========================

const DEFAULT_CONFIG: LoggerConfig = {
  level: process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO,
  targets: process.env.NODE_ENV === 'development' 
    ? [LogTarget.CONSOLE, LogTarget.SESSION_STORAGE]
    : [LogTarget.CONSOLE, LogTarget.SUPABASE],
  enabledInProduction: true,
  maxStorageEntries: 1000,
  formatters: {
    console: true,
    structured: true
  },
  externalService: {
    endpoint: process.env.VITE_LOGGING_ENDPOINT || '',
    batchSize: 10,
    flushInterval: 30000 // 30 seconds
  }
};

// ========================
// LOGGER IMPLEMENTATION
// ========================

class Logger {
  private config: LoggerConfig;
  private logBuffer: LogEntry[] = [];
  private flushTimer?: NodeJS.Timeout;
  private sessionId: string;
  private userId?: string;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.sessionId = this.generateSessionId();
    this.setupFlushTimer();
    this.setupErrorHandlers();
  }

  // ========================
  // PUBLIC API
  // ========================

  debug(message: string, data?: any, context?: Record<string, any>) {
    this.log(LogLevel.DEBUG, 'debug', message, data, context);
  }

  info(message: string, data?: any, context?: Record<string, any>) {
    this.log(LogLevel.INFO, 'info', message, data, context);
  }

  warn(message: string, data?: any, context?: Record<string, any>) {
    this.log(LogLevel.WARN, 'warn', message, data, context);
  }

  error(message: string, error?: any, context?: Record<string, any>) {
    // Enhanced error logging with stack traces
    const errorData = this.extractErrorData(error);
    this.log(LogLevel.ERROR, 'error', message, errorData, context);
  }

  critical(message: string, error?: any, context?: Record<string, any>) {
    const errorData = this.extractErrorData(error);
    this.log(LogLevel.CRITICAL, 'critical', message, errorData, context);
    
    // Immediate flush for critical errors
    this.flush();
  }

  // Log a classified error from our error system
  logError(error: BaseError, context?: Record<string, any>) {
    const level = this.mapErrorSeverityToLogLevel(error.severity);
    
    this.log(level, error.category, error.message, {
      code: error.code,
      severity: error.severity,
      trackingId: error.trackingId,
      retryable: error.retryable,
      details: error.details,
      userMessage: error.userMessage
    }, {
      ...error.context,
      ...context
    });
  }

  // Security-specific logging
  security(action: string, data?: any, context?: Record<string, any>) {
    this.log(LogLevel.WARN, 'security', action, data, {
      ...context,
      requiresAlert: true,
      ipAddress: this.getClientIP(),
      userAgent: navigator.userAgent
    });
  }

  // Performance logging
  performance(metric: string, value: number, context?: Record<string, any>) {
    this.log(LogLevel.INFO, 'performance', metric, { value, unit: 'ms' }, context);
  }

  // User action logging
  userAction(action: string, data?: any, context?: Record<string, any>) {
    this.log(LogLevel.INFO, 'user_action', action, data, context);
  }

  // ========================
  // CONFIGURATION
  // ========================

  setUserId(userId: string) {
    this.userId = userId;
  }

  clearUserId() {
    this.userId = undefined;
  }

  updateConfig(newConfig: Partial<LoggerConfig>) {
    this.config = { ...this.config, ...newConfig };
    this.setupFlushTimer();
  }

  // ========================
  // UTILITY METHODS
  // ========================

  getLogs(limit?: number): LogEntry[] {
    const logs = this.getStoredLogs();
    return limit ? logs.slice(-limit) : logs;
  }

  clearLogs() {
    this.logBuffer = [];
    localStorage.removeItem('app_logs');
    sessionStorage.removeItem('app_logs');
  }

  exportLogs(): string {
    const logs = this.getLogs();
    return JSON.stringify(logs, null, 2);
  }

  // ========================
  // PRIVATE METHODS
  // ========================

  private log(
    level: LogLevel, 
    category: string, 
    message: string, 
    data?: any, 
    context?: Record<string, any>
  ) {
    // Check if logging is enabled for this level
    if (level < this.config.level) {
      return;
    }

    // Create log entry
    const entry: LogEntry = {
      id: this.generateLogId(),
      timestamp: new Date(),
      level,
      category,
      message,
      data,
      context,
      userId: this.userId,
      sessionId: this.sessionId,
      url: window.location.href,
      userAgent: navigator.userAgent,
      trackingId: context?.trackingId,
      source: 'frontend'
    };

    // Add to buffer
    this.logBuffer.push(entry);

    // Output to configured targets
    this.outputToTargets(entry);

    // Auto-flush for high-level errors
    if (level >= LogLevel.ERROR) {
      this.flush();
    }
  }

  private outputToTargets(entry: LogEntry) {
    this.config.targets.forEach(target => {
      switch (target) {
        case LogTarget.CONSOLE:
          this.outputToConsole(entry);
          break;
        case LogTarget.LOCAL_STORAGE:
          this.outputToLocalStorage(entry);
          break;
        case LogTarget.SESSION_STORAGE:
          this.outputToSessionStorage(entry);
          break;
        case LogTarget.SUPABASE:
          this.outputToSupabase(entry);
          break;
        case LogTarget.EXTERNAL_SERVICE:
          // Buffered - will be sent in batches
          break;
      }
    });
  }

  private outputToConsole(entry: LogEntry) {
    if (!this.config.formatters.console) {
      return;
    }

    const timestamp = entry.timestamp.toISOString();
    const level = LogLevel[entry.level];
    const prefix = `[${timestamp}] [${level}] [${entry.category}]`;
    
    const consoleMethod = this.getConsoleMethod(entry.level);
    
    if (entry.data || entry.context) {
      consoleMethod(`${prefix} ${entry.message}`, {
        data: entry.data,
        context: entry.context,
        trackingId: entry.trackingId
      });
    } else {
      consoleMethod(`${prefix} ${entry.message}`);
    }
  }

  private outputToLocalStorage(entry: LogEntry) {
    try {
      const stored = this.getStoredLogs('localStorage');
      stored.push(entry);
      
      // Limit storage size
      if (stored.length > this.config.maxStorageEntries) {
        stored.splice(0, stored.length - this.config.maxStorageEntries);
      }
      
      localStorage.setItem('app_logs', JSON.stringify(stored));
    } catch (error) {
      console.warn('Failed to write to localStorage:', error);
    }
  }

  private outputToSessionStorage(entry: LogEntry) {
    try {
      const stored = this.getStoredLogs('sessionStorage');
      stored.push(entry);
      
      // Limit storage size
      if (stored.length > this.config.maxStorageEntries) {
        stored.splice(0, stored.length - this.config.maxStorageEntries);
      }
      
      sessionStorage.setItem('app_logs', JSON.stringify(stored));
    } catch (error) {
      console.warn('Failed to write to sessionStorage:', error);
    }
  }

  private async outputToSupabase(entry: LogEntry) {
    try {
      // Import Supabase client dynamically to avoid circular dependencies
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { error } = await supabase
        .from('application_logs')
        .insert([{
          id: entry.id,
          level: LogLevel[entry.level].toLowerCase(),
          category: entry.category,
          message: entry.message,
          data: entry.data,
          context: entry.context,
          user_id: entry.userId,
          session_id: entry.sessionId,
          url: entry.url,
          user_agent: entry.userAgent,
          tracking_id: entry.trackingId,
          source: entry.source,
          created_at: entry.timestamp.toISOString()
        }]);

      if (error) {
        console.warn('Failed to log to Supabase:', error);
      }
    } catch (error) {
      console.warn('Failed to log to Supabase:', error);
    }
  }

  private setupFlushTimer() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    if (this.config.externalService?.flushInterval) {
      this.flushTimer = setInterval(() => {
        this.flush();
      }, this.config.externalService.flushInterval);
    }
  }

  private flush() {
    if (this.logBuffer.length === 0) {
      return;
    }

    // Send to external service if configured
    if (this.config.targets.includes(LogTarget.EXTERNAL_SERVICE) && 
        this.config.externalService?.endpoint) {
      this.sendToExternalService([...this.logBuffer]);
    }

    // Clear buffer
    this.logBuffer = [];
  }

  private async sendToExternalService(logs: LogEntry[]) {
    try {
      const response = await fetch(this.config.externalService!.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.externalService?.apiKey && {
            'Authorization': `Bearer ${this.config.externalService.apiKey}`
          })
        },
        body: JSON.stringify({ logs })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.warn('Failed to send logs to external service:', error);
    }
  }

  private setupErrorHandlers() {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.error('Global Error', event.error, {
        filename: event.filename,
        line: event.lineno,
        column: event.colno,
        source: 'global_error_handler'
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.error('Unhandled Promise Rejection', event.reason, {
        source: 'unhandled_promise_rejection'
      });
    });
  }

  // ========================
  // HELPER METHODS
  // ========================

  private extractErrorData(error: any) {
    if (!error) return undefined;

    if (error instanceof Error) {
      return {
        name: error.name,
        message: error.message,
        stack: error.stack
      };
    }

    if (typeof error === 'object') {
      return error;
    }

    return { value: error };
  }

  private mapErrorSeverityToLogLevel(severity: ErrorSeverity): LogLevel {
    switch (severity) {
      case ErrorSeverity.LOW:
        return LogLevel.INFO;
      case ErrorSeverity.MEDIUM:
        return LogLevel.WARN;
      case ErrorSeverity.HIGH:
        return LogLevel.ERROR;
      case ErrorSeverity.CRITICAL:
        return LogLevel.CRITICAL;
      default:
        return LogLevel.ERROR;
    }
  }

  private getConsoleMethod(level: LogLevel) {
    switch (level) {
      case LogLevel.DEBUG:
        return console.debug;
      case LogLevel.INFO:
        return console.info;
      case LogLevel.WARN:
        return console.warn;
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        return console.error;
      default:
        return console.log;
    }
  }

  private getStoredLogs(storage: 'localStorage' | 'sessionStorage' = 'sessionStorage'): LogEntry[] {
    try {
      const stored = storage === 'localStorage' 
        ? localStorage.getItem('app_logs')
        : sessionStorage.getItem('app_logs');
      
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      return [];
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateLogId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getClientIP(): string {
    // In a real application, you might get this from a service
    // or include it in the request headers from the server
    return 'unknown';
  }
}

// ========================
// SINGLETON INSTANCE
// ========================

export const logger = new Logger();

// ========================
// CONVENIENCE FUNCTIONS
// ========================

export function logErrorToService(error: BaseError): Promise<void> {
  return new Promise((resolve) => {
    logger.logError(error);
    resolve();
  });
}

export function createLogger(config?: Partial<LoggerConfig>): Logger {
  return new Logger(config);
}

// ========================
// REACT HOOKS
// ========================

export function useLogger() {
  return {
    debug: logger.debug.bind(logger),
    info: logger.info.bind(logger),
    warn: logger.warn.bind(logger),
    error: logger.error.bind(logger),
    critical: logger.critical.bind(logger),
    security: logger.security.bind(logger),
    performance: logger.performance.bind(logger),
    userAction: logger.userAction.bind(logger),
    setUserId: logger.setUserId.bind(logger),
    clearUserId: logger.clearUserId.bind(logger)
  };
}

export default logger;
