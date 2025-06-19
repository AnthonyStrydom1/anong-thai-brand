
import React from 'react';
import { AlertTriangle, RefreshCw, Home, Bug, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BaseError } from '@/types/errors';

// ========================
// ERROR SEVERITY MAPPING
// ========================

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

const ErrorIcons = {
  [ErrorSeverity.LOW]: AlertCircle,
  [ErrorSeverity.MEDIUM]: AlertTriangle,
  [ErrorSeverity.HIGH]: AlertTriangle,
  [ErrorSeverity.CRITICAL]: AlertTriangle
};

const ErrorColors = {
  [ErrorSeverity.LOW]: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'text-blue-600',
    text: 'text-blue-800'
  },
  [ErrorSeverity.MEDIUM]: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    icon: 'text-yellow-600',
    text: 'text-yellow-800'
  },
  [ErrorSeverity.HIGH]: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    icon: 'text-orange-600',
    text: 'text-orange-800'
  },
  [ErrorSeverity.CRITICAL]: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: 'text-red-600',
    text: 'text-red-800'
  }
};

// ========================
// INLINE ERROR COMPONENT
// ========================

interface InlineErrorProps {
  error: BaseError;
  onRetry?: () => void;
  onDismiss?: () => void;
  showDetails?: boolean;
  className?: string;
}

export function InlineError({
  error,
  onRetry,
  onDismiss,
  showDetails = false,
  className = ''
}: InlineErrorProps) {
  const Icon = ErrorIcons[error.severity as ErrorSeverity] || AlertTriangle;
  const colors = ErrorColors[error.severity as ErrorSeverity] || ErrorColors[ErrorSeverity.MEDIUM];

  return (
    <Alert className={`${colors.bg} ${colors.border} ${className}`}>
      <Icon className={`h-4 w-4 ${colors.icon}`} />
      <AlertDescription>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className={`font-medium ${colors.text}`}>
              {error.userMessage || error.message}
            </p>
            {showDetails && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm text-gray-600">
                  Technical Details
                </summary>
                <div className="mt-1 text-xs text-gray-500 font-mono">
                  <div>Code: {error.code}</div>
                  <div>ID: {error.trackingId}</div>
                </div>
              </details>
            )}
          </div>
          
          <div className="flex gap-2 ml-4">
            {error.retryable && onRetry && (
              <Button size="sm" variant="outline" onClick={onRetry}>
                <RefreshCw className="h-3 w-3" />
              </Button>
            )}
            {onDismiss && (
              <Button size="sm" variant="ghost" onClick={onDismiss}>
                ×
              </Button>
            )}
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}

// ========================
// FULL PAGE ERROR COMPONENT
// ========================

interface FullPageErrorProps {
  error: BaseError;
  onRetry?: () => void;
  onGoHome?: () => void;
  onReportError?: () => void;
  showDetails?: boolean;
}

export function FullPageError({
  error,
  onRetry,
  onGoHome = () => window.location.href = '/',
  onReportError,
  showDetails = false
}: FullPageErrorProps) {
  const Icon = ErrorIcons[error.severity as ErrorSeverity] || AlertTriangle;
  const colors = ErrorColors[error.severity as ErrorSeverity] || ErrorColors[ErrorSeverity.MEDIUM];

  const handleReportError = () => {
    if (onReportError) {
      onReportError();
    } else {
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
            {error.userMessage || error.message}
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
                <div><strong>Timestamp:</strong> {error.timestamp?.toLocaleString()}</div>
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

export default {
  InlineError,
  FullPageError
};
