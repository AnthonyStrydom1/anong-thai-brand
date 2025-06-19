
/**
 * CENTRALIZED LOGGING SERVICE
 * Provides structured logging with different levels and targets
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4,
  PERFORMANCE = 5
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: Record<string, any>;
  error?: any;
  source?: string;
  userId?: string;
  sessionId?: string;
  url?: string;
  userAgent?: string;
  performance?: {
    operation: string;
    duration: number;
    memory?: number;
  };
}

interface LoggerConfig {
  minLevel: LogLevel;
  enableConsole: boolean;
  enableRemote: boolean;
  enablePerformance: boolean;
  remoteEndpoint?: string;
  maxRetries: number;
  bufferSize: number;
}

class Logger {
  private config: LoggerConfig;
  private buffer: LogEntry[] = [];
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    
    this.config = {
      minLevel: process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
      enableConsole: true,
      enableRemote: process.env.NODE_ENV === 'production',
      enablePerformance: process.env.NODE_ENV === 'development',
      maxRetries: 3,
      bufferSize: 100
    };

    this.info('Logger initialized', {
      environment: process.env.NODE_ENV,
      sessionId: this.sessionId,
      config: this.config
    });
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.config.minLevel;
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    error?: any,
    context?: Record<string, any>
  ): LogEntry {
    return {
      level,
      message,
      timestamp: new Date(),
      error,
      context,
      sessionId: this.sessionId,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined
    };
  }

  private formatConsoleMessage(entry: LogEntry): string {
    const timestamp = entry.timestamp.toISOString();
    const levelName = LogLevel[entry.level];
    return `[${timestamp}] ${levelName}: ${entry.message}`;
  }

  private logToConsole(entry: LogEntry): void {
    if (!this.config.enableConsole) return;

    const message = this.formatConsoleMessage(entry);
    
    try {
      switch (entry.level) {
        case LogLevel.DEBUG:
          console.debug(message, entry.context, entry.error);
          break;
        case LogLevel.INFO:
          console.info(message, entry.context);
          break;
        case LogLevel.WARN:
          console.warn(message, entry.context, entry.error);
          break;
        case LogLevel.ERROR:
          console.error(message, entry.context, entry.error);
          break;
        case LogLevel.CRITICAL:
          console.error(`🚨 CRITICAL: ${message}`, entry.context, entry.error);
          break;
        case LogLevel.PERFORMANCE:
          if (this.config.enablePerformance) {
            console.log(`⚡ PERFORMANCE: ${message}`, entry.context);
          }
          break;
        default:
          console.log(message, entry.context);
      }
    } catch (consoleError) {
      console.log(`Logger error: ${consoleError}, Original: ${message}`);
    }
  }

  private async logToRemote(entry: LogEntry): Promise<void> {
    if (!this.config.enableRemote || !this.config.remoteEndpoint) return;

    try {
      await fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(entry)
      });
    } catch (error) {
      console.warn('Failed to send log to remote endpoint:', error);
    }
  }

  private processLogEntry(entry: LogEntry): void {
    this.buffer.push(entry);
    if (this.buffer.length > this.config.bufferSize) {
      this.buffer.shift();
    }

    this.logToConsole(entry);
    this.logToRemote(entry).catch(() => {});
  }

  debug(message: string, context?: Record<string, any>): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;
    const entry = this.createLogEntry(LogLevel.DEBUG, message, undefined, context);
    this.processLogEntry(entry);
  }

  info(message: string, context?: Record<string, any>): void {
    if (!this.shouldLog(LogLevel.INFO)) return;
    const entry = this.createLogEntry(LogLevel.INFO, message, undefined, context);
    this.processLogEntry(entry);
  }

  warn(message: string, context?: Record<string, any>): void {
    if (!this.shouldLog(LogLevel.WARN)) return;
    const entry = this.createLogEntry(LogLevel.WARN, message, undefined, context);
    this.processLogEntry(entry);
  }

  error(message: string, error?: any, context?: Record<string, any>): void {
    if (!this.shouldLog(LogLevel.ERROR)) return;
    const entry = this.createLogEntry(LogLevel.ERROR, message, error, context);
    this.processLogEntry(entry);
  }

  critical(message: string, error?: any, context?: Record<string, any>): void {
    if (!this.shouldLog(LogLevel.CRITICAL)) return;
    const entry = this.createLogEntry(LogLevel.CRITICAL, message, error, context);
    this.processLogEntry(entry);
  }

  performance(operation: string, duration: number, context?: Record<string, any>): void {
    if (!this.shouldLog(LogLevel.PERFORMANCE) || !this.config.enablePerformance) return;
    
    const entry = this.createLogEntry(
      LogLevel.PERFORMANCE, 
      `Performance: ${operation}`, 
      undefined, 
      {
        ...context,
        performance: {
          operation,
          duration,
          // Safe memory access - check if performance.memory exists
          memory: typeof performance !== 'undefined' && 'memory' in performance 
            ? (performance as any).memory?.usedJSHeapSize 
            : undefined
        }
      }
    );
    this.processLogEntry(entry);
  }

  logError(error: any, context?: Record<string, any>): void {
    try {
      if (error?.severity === 'critical') {
        this.critical(error.message || 'Critical error occurred', error, context);
      } else if (error?.severity === 'high') {
        this.error(error.message || 'High severity error occurred', error, context);
      } else if (error?.severity === 'medium') {
        this.warn(error.message || 'Medium severity error occurred', { ...context, error });
      } else {
        this.error(error?.message || 'Unknown error occurred', error, context);
      }
    } catch (logError) {
      console.error('Logger.logError failed:', logError, 'Original error:', error);
    }
  }

  getBuffer(): LogEntry[] {
    return [...this.buffer];
  }

  clearBuffer(): void {
    this.buffer = [];
  }

  setConfig(newConfig: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.info('Logger configuration updated', { config: this.config });
  }

  getSessionId(): string {
    return this.sessionId;
  }
}

export const logger = new Logger();

// ========================
// ERROR LOGGING SERVICE
// ========================

export async function logErrorToService(error: any): Promise<void> {
  try {
    logger.error('Error service log', error, {
      code: error.code,
      severity: error.severity,
      category: error.category,
      trackingId: error.trackingId,
      retryable: error.retryable,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      timestamp: new Date().toISOString()
    });
  } catch (loggingError) {
    console.error('Failed to log error to service:', loggingError);
  }
}

export default logger;
