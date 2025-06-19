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

  private renderStandardError() {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-gray-800">Oops!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              {this.state.error?.userMessage || 'Something unexpected happened.'}
            </p>
            <div className="flex gap-2 justify-center">
              <Button 
                onClick={this.handleRetry} 
                disabled={this.state.isRetrying}
                size="sm"
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
                size="sm"
              >
                <Home className="mr-2 h-4 w-4" />
                Home
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
