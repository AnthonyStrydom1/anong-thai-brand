
import React, { Component, ReactNode, ErrorInfo } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { logger } from '@/services/logger';

// ========================
// ERROR TYPES AND INTERFACES
// ========================

export interface BaseError extends Error {
  code?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  userMessage?: string;
  trackingId?: string;
  retryable?: boolean;
  category?: string;
  details?: Record<string, any>;
  timestamp?: Date;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: BaseError | null;
  errorInfo: ErrorInfo | null;
  isRetrying: boolean;
  retryCount: number;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: BaseError, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
  maxRetries?: number;
}

// ========================
// ERROR CLASSIFICATION
// ========================

class ErrorClassifier {
  static classifyError(error: unknown, context?: Record<string, any>): BaseError {
    const baseError: BaseError = {
      name: 'UnknownError',
      message: 'An unknown error occurred',
      code: 'UNKNOWN_ERROR',
      severity: 'medium',
      userMessage: 'Something went wrong. Please try again.',
      trackingId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      retryable: true,
      category: 'unknown',
      timestamp: new Date(),
      details: context
    };

    if (error instanceof Error) {
      baseError.name = error.name;
      baseError.message = error.message;
      baseError.stack = error.stack;

      // Classify based on error type
      if (error.name === 'ChunkLoadError' || error.message.includes('Loading chunk')) {
        baseError.code = 'CHUNK_LOAD_ERROR';
        baseError.severity = 'low';
        baseError.userMessage = 'Failed to load application resources. Please refresh the page.';
        baseError.category = 'network';
        baseError.retryable = true;
      } else if (error.message.includes('Network Error') || error.message.includes('fetch')) {
        baseError.code = 'NETWORK_ERROR';
        baseError.severity = 'medium';
        baseError.userMessage = 'Network connection issue. Please check your internet connection.';
        baseError.category = 'network';
        baseError.retryable = true;
      } else if (error.name === 'TypeError' && error.message.includes('Cannot read prop')) {
        baseError.code = 'NULL_REFERENCE_ERROR';
        baseError.severity = 'high';
        baseError.userMessage = 'Application data error. Please refresh the page.';
        baseError.category = 'data';
        baseError.retryable = true;
      }
    }

    return baseError;
  }
}

// ========================
// ERROR LOGGING SERVICE
// ========================

async function logErrorToService(error: BaseError): Promise<void> {
  try {
    logger.error('Error boundary caught error', error, {
      code: error.code,
      severity: error.severity,
      category: error.category,
      trackingId: error.trackingId,
      retryable: error.retryable,
      userAgent: navigator.userAgent,
      url: window.location.href
    });
  } catch (loggingError) {
    console.error('Failed to log error to service:', loggingError);
  }
}

// ========================
// ERROR BOUNDARY COMPONENT
// ========================

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isRetrying: false,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error: ErrorClassifier.classifyError(error),
      isRetrying: false
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const classifiedError = ErrorClassifier.classifyError(error, {
      errorInfo,
      retryCount: this.state.retryCount
    });

    this.setState({
      error: classifiedError,
      errorInfo
    });

    // Log the error
    logErrorToService(classifiedError).catch(console.error);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(classifiedError, errorInfo);
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  handleRetry = () => {
    const maxRetries = this.props.maxRetries || 3;
    
    if (this.state.retryCount >= maxRetries) {
      return;
    }

    this.setState({ isRetrying: true });

    this.retryTimeoutId = window.setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        isRetrying: false,
        retryCount: this.state.retryCount + 1
      });
    }, 1000);
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  renderErrorDetails() {
    if (!this.props.showDetails || !this.state.error) return null;

    return (
      <details className="mt-4 p-4 bg-gray-50 rounded-lg text-left">
        <summary className="cursor-pointer font-medium text-gray-700 mb-2">
          Technical Details
        </summary>
        <div className="space-y-2 text-sm text-gray-600 font-mono">
          <div><strong>Error:</strong> {this.state.error.name}</div>
          <div><strong>Message:</strong> {this.state.error.message}</div>
          <div><strong>Code:</strong> {this.state.error.code}</div>
          <div><strong>Tracking ID:</strong> {this.state.error.trackingId}</div>
          {this.state.error.stack && (
            <div>
              <strong>Stack Trace:</strong>
              <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-32">
                {this.state.error.stack}
              </pre>
            </div>
          )}
        </div>
      </details>
    );
  }

  renderFallbackUI() {
    if (this.props.fallback) {
      return this.props.fallback;
    }

    const error = this.state.error;
    if (!error) return null;

    const isCritical = error.severity === 'critical' || error.severity === 'high';

    if (isCritical) {
      return this.renderCriticalError();
    }

    return this.renderStandardError();
  }

  renderCriticalError() {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-red-50">
        <Card className="max-w-md w-full border-red-200">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-red-800">Critical Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              {this.state.error?.userMessage || 'A critical error has occurred.'}
            </p>
            <div className="space-y-2">
              <Button 
                onClick={this.handleRetry} 
                disabled={this.state.isRetrying}
                className="w-full"
                variant="destructive"
              >
                {this.state.isRetrying ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={this.handleGoHome}
                className="w-full"
              >
                <Home className="mr-2 h-4 w-4" />
                Go to Home
              </Button>
            </div>
            {this.renderErrorDetails()}
          </CardContent>
        </Card>
      </div>
    );
  }

  renderStandardError() {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
            <CardTitle className="text-orange-800">Something Went Wrong</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              {this.state.error?.userMessage || 'An unexpected error occurred.'}
            </p>
            <div className="space-y-2">
              <Button 
                onClick={this.handleRetry} 
                disabled={this.state.isRetrying}
                className="w-full"
              >
                {this.state.isRetrying ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={this.handleGoHome}
                className="w-full"
              >
                <Home className="mr-2 h-4 w-4" />
                Go to Home
              </Button>
            </div>
            {this.renderErrorDetails()}
          </CardContent>
        </Card>
      </div>
    );
  }

  render() {
    if (this.state.hasError) {
      return this.renderFallbackUI();
    }

    return this.props.children;
  }
}

// ========================
// HOC for easier usage
// ========================

interface WithErrorBoundaryProps {
  fallback?: ReactNode;
  onError?: (error: BaseError, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: WithErrorBoundaryProps
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// ========================
// Hook for error boundary context
// ========================

export function useErrorHandler() {
  return {
    reportError: (error: unknown, context?: Record<string, any>) => {
      const classifiedError = ErrorClassifier.classifyError(error, {
        source: 'manual_report',
        ...context
      });
      
      // Log the error
      logErrorToService(classifiedError).catch(loggingError => {
        console.error('Failed to log error:', loggingError);
        console.error('Original error:', classifiedError);
      });
      
      // Re-throw to trigger error boundary if needed
      throw error;
    },
    
    handleError: (error: unknown, context?: Record<string, any>) => {
      const classifiedError = ErrorClassifier.classifyError(error, {
        source: 'handled_error',
        ...context
      });
      
      // Log but don't re-throw
      logErrorToService(classifiedError).catch(loggingError => {
        console.error('Failed to log error:', loggingError);
        console.error('Original error:', classifiedError);
      });
      
      return classifiedError;
    }
  };
}

// ========================
// Specialized Error Boundaries
// ========================

export function RouteErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      showDetails={process.env.NODE_ENV === 'development'}
      onError={(error, errorInfo) => {
        console.error('Route Error:', error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

export function ComponentErrorBoundary({ 
  children, 
  componentName 
}: { 
  children: ReactNode;
  componentName: string;
}) {
  return (
    <ErrorBoundary
      showDetails={process.env.NODE_ENV === 'development'}
      onError={(error, errorInfo) => {
        console.error(`Component Error in ${componentName}:`, error, errorInfo);
      }}
      fallback={
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">
            Unable to load {componentName}. Please refresh the page.
          </p>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="mt-2"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}

export default ErrorBoundary;
