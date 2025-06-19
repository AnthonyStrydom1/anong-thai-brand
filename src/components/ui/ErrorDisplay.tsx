  const Icon = ErrorIcons[error.severity];
  const colors = ErrorColors[error.severity];

  const handleReportError = () => {
    if (onReportError) {
      onReportError();
    } else {
      // Default error reporting
      const report = {
        code: error.code,
        message: error.message,
        category: error.category,
        severity: error.severity,
        trackingId: error.trackingId,
        timestamp: error.timestamp,
        url: window.location.href,
        userAgent: navigator.userAgent
      };

      const subject = encodeURIComponent(`Error Report: ${error.code}`);
      const body = encodeURIComponent(`Error Details:\n\n${JSON.stringify(report, null, 2)}`);
      window.open(`mailto:support@anong-thai.com?subject=${subject}&body=${body}`);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${colors.bg}`}>
      <Card className={`max-w-md w-full ${colors.border}`}>
        <CardHeader className="text-center">
          <div className={`mx-auto w-12 h-12 ${colors.bg} rounded-full flex items-center justify-center mb-4`}>
            <Icon className={`h-6 w-6 ${colors.icon}`} />
          </div>
          <CardTitle className={colors.text}>
            {error.severity === ErrorSeverity.CRITICAL ? 'Critical Error' :
             error.severity === ErrorSeverity.HIGH ? 'Something Went Wrong' :
             error.severity === ErrorSeverity.MEDIUM ? 'Minor Issue' :
             'Notice'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            {error.userMessage}
          </p>
          
          <div className="space-y-2">
            {error.retryable && onRetry && (
              <Button onClick={onRetry} className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            )}
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={onGoHome} className="flex-1">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
              
              <Button variant="outline" onClick={handleReportError} className="flex-1">
                <Bug className="mr-2 h-4 w-4" />
                Report
              </Button>
            </div>
          </div>
          
          {showDetails && (
            <details className="mt-4 p-4 bg-gray-50 rounded-lg text-left">
              <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                Technical Details
              </summary>
              <div className="space-y-2 text-sm text-gray-600 font-mono">
                <div><strong>Error Code:</strong> {error.code}</div>
                <div><strong>Tracking ID:</strong> {error.trackingId}</div>
                <div><strong>Category:</strong> {error.category}</div>
                <div><strong>Severity:</strong> {error.severity}</div>
                <div><strong>Retryable:</strong> {error.retryable ? 'Yes' : 'No'}</div>
                <div><strong>Timestamp:</strong> {error.timestamp.toLocaleString()}</div>
                {error.details && (
                  <div>
                    <strong>Details:</strong>
                    <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto">
                      {JSON.stringify(error.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ========================
// LOADING STATE WITH ERROR FALLBACK
// ========================

interface LoadingWithErrorProps {
  isLoading: boolean;
  error: BaseError | null;
  onRetry?: () => void;
  loadingText?: string;
  children: React.ReactNode;
}

export function LoadingWithError({
  isLoading,
  error,
  onRetry,
  loadingText = 'Loading...',
  children
}: LoadingWithErrorProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">{loadingText}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <InlineError
        error={error}
        onRetry={onRetry}
        showDetails={process.env.NODE_ENV === 'development'}
      />
    );
  }

  return <>{children}</>;
}

// ========================
// FIELD ERROR DISPLAY
// ========================

interface FieldErrorProps {
  error?: string;
  className?: string;
}

export function FieldError({ error, className = '' }: FieldErrorProps) {
  if (!error) return null;

  return (
    <p className={`text-sm text-red-600 mt-1 ${className}`}>
      {error}
    </p>
  );
}

// ========================
// ERROR LIST DISPLAY
// ========================

interface ErrorListProps {
  errors: BaseError[];
  onDismiss?: (index: number) => void;
  onDismissAll?: () => void;
  maxHeight?: string;
}

export function ErrorList({ 
  errors, 
  onDismiss, 
  onDismissAll,
  maxHeight = 'max-h-96' 
}: ErrorListProps) {
  if (errors.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">
          Errors ({errors.length})
        </h3>
        {onDismissAll && errors.length > 1 && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onDismissAll}
            className="text-xs"
          >
            Clear All
          </Button>
        )}
      </div>
      
      <div className={`space-y-2 overflow-y-auto ${maxHeight}`}>
        {errors.map((error, index) => (
          <InlineError
            key={`${error.trackingId}-${index}`}
            error={error}
            onDismiss={onDismiss ? () => onDismiss(index) : undefined}
            className="text-sm"
          />
        ))}
      </div>
    </div>
  );
}

// ========================
// EMPTY STATE WITH ERROR HANDLING
// ========================

interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  error?: BaseError;
  onRetry?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
}

export function EmptyState({
  title,
  description,
  action,
  error,
  onRetry,
  icon: Icon = AlertCircle
}: EmptyStateProps) {
  if (error) {
    return (
      <div className="text-center py-12">
        <InlineError
          error={error}
          onRetry={onRetry}
          showDetails={process.env.NODE_ENV === 'development'}
        />
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <Icon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-sm mx-auto">{description}</p>
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

// ========================
// ERROR TOAST VARIANTS
// ========================

export const ErrorToastVariants = {
  success: (message: string, description?: string) => ({
    title: message,
    description,
    variant: 'default' as const,
    className: 'border-green-200 bg-green-50 text-green-800'
  }),
  
  warning: (message: string, description?: string) => ({
    title: message,
    description,
    variant: 'default' as const,
    className: 'border-yellow-200 bg-yellow-50 text-yellow-800'
  }),
  
  error: (message: string, description?: string) => ({
    title: message,
    description,
    variant: 'destructive' as const
  }),
  
  info: (message: string, description?: string) => ({
    title: message,
    description,
    variant: 'default' as const,
    className: 'border-blue-200 bg-blue-50 text-blue-800'
  })
};

// ========================
// VALIDATION ERROR SUMMARY
// ========================

interface ValidationErrorSummaryProps {
  errors: Record<string, string>;
  onFieldFocus?: (field: string) => void;
}

export function ValidationErrorSummary({ 
  errors, 
  onFieldFocus 
}: ValidationErrorSummaryProps) {
  const errorEntries = Object.entries(errors).filter(([_, message]) => message);
  
  if (errorEntries.length === 0) return null;

  return (
    <Alert className="border-red-200 bg-red-50">
      <AlertTriangle className="h-4 w-4 text-red-600" />
      <AlertDescription>
        <div className="text-red-800">
          <p className="font-medium mb-2">Please fix the following errors:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            {errorEntries.map(([field, message]) => (
              <li key={field}>
                {onFieldFocus ? (
                  <button
                    type="button"
                    className="text-red-700 hover:text-red-900 underline"
                    onClick={() => onFieldFocus(field)}
                  >
                    {message}
                  </button>
                ) : (
                  message
                )}
              </li>
            ))}
          </ul>
        </div>
      </AlertDescription>
    </Alert>
  );
}

// ========================
// EXPORTS
// ========================

export {
  InlineError,
  FullPageError,
  LoadingWithError,
  FieldError,
  ErrorList,
  EmptyState,
  ErrorToastVariants,
  ValidationErrorSummary
};

export default {
  InlineError,
  FullPageError,
  LoadingWithError,
  FieldError,
  ErrorList,
  EmptyState,
  ValidationErrorSummary
};
