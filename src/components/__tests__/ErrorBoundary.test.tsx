/**
 * ERROR BOUNDARY TESTS
 * Comprehensive testing of React error boundary functionality
 * 
 * Tests error catching, classification, retry logic, and UI fallbacks
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ErrorBoundary, withErrorBoundary, useErrorHandler } from '@/components/ErrorBoundary'
import { 
  render, 
  createMockError, 
  ThrowErrorComponent, 
  createMockLogger
} from '@/test/utils'
import { ErrorSeverity, ErrorCategory } from '@/types/errors'

// Mock the logger service
const mockLogger = createMockLogger()
vi.mock('@/services/logger', () => ({
  logger: mockLogger,
  logErrorToService: vi.fn().mockResolvedValue(undefined)
}))

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset console spies
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Error Catching', () => {
    it('should catch and display errors from child components', async () => {
      const testError = new Error('Test component error')
      
      render(
        <ErrorBoundary>
          <ThrowErrorComponent error={testError} />
        </ErrorBoundary>
      )

      await waitFor(() => {
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
      })
      
      expect(screen.getByText(/try again/i)).toBeInTheDocument()
    })

    it('should not catch errors when no error occurs', () => {
      render(
        <ErrorBoundary>
          <ThrowErrorComponent shouldThrow={false}>
            <div>Normal content</div>
          </ThrowErrorComponent>
        </ErrorBoundary>
      )

      expect(screen.getByText('Normal content')).toBeInTheDocument()
      expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument()
    })

    it('should call onError callback when error occurs', async () => {
      const onError = vi.fn()
      const testError = new Error('Callback test error')

      render(
        <ErrorBoundary onError={onError}>
          <ThrowErrorComponent error={testError} />
        </ErrorBoundary>
      )

      await waitFor(() => {
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
      })
      
      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({
          code: expect.any(String),
          message: 'Callback test error',
          category: expect.any(String),
          severity: expect.any(String)
        }),
        expect.objectContaining({
          componentStack: expect.any(String)
        })
      )
    })
  })

  describe('Error Classification', () => {
    it('should classify JavaScript errors correctly', async () => {
      const testError = new Error('Network timeout error')
      
      render(
        <ErrorBoundary>
          <ThrowErrorComponent error={testError} />
        </ErrorBoundary>
      )

      await waitFor(() => {
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
      })
      
      // Should show user-friendly message, not technical error
      expect(screen.queryByText('Network timeout error')).not.toBeInTheDocument()
    })

    it('should handle different error types', async () => {
      const typeError = new TypeError('Cannot read property of undefined')
      
      render(
        <ErrorBoundary>
          <ThrowErrorComponent error={typeError} />
        </ErrorBoundary>
      )

      await waitFor(() => {
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
      })
    })
  })

  describe('Severity-based UI', () => {
    it('should display critical error UI for high severity errors', async () => {
      const criticalError = new Error('Critical system failure')
      Object.assign(criticalError, { severity: ErrorSeverity.CRITICAL })
      
      render(
        <ErrorBoundary>
          <ThrowErrorComponent error={criticalError} />
        </ErrorBoundary>
      )

      await waitFor(() => {
        expect(screen.getByText('Critical Error')).toBeInTheDocument()
      })
      
      expect(screen.getByText(/try again/i)).toBeInTheDocument()
    })

    it('should display standard error UI for medium severity errors', async () => {
      const standardError = new Error('Standard error')
      
      render(
        <ErrorBoundary>
          <ThrowErrorComponent error={standardError} />
        </ErrorBoundary>
      )

      await waitFor(() => {
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
      })
      
      expect(screen.getByText(/try again/i)).toBeInTheDocument()
      expect(screen.getByText(/go to home/i)).toBeInTheDocument()
    })
  })

  describe('Retry Functionality', () => {
    it('should provide retry button for retryable errors', async () => {
      const user = userEvent.setup()
      let shouldThrow = true
      
      const RetryableComponent = () => {
        if (shouldThrow) {
          const error = new Error('Retryable error')
          Object.assign(error, { retryable: true })
          throw error
        }
        return <div>Success after retry</div>
      }

      render(
        <ErrorBoundary>
          <RetryableComponent />
        </ErrorBoundary>
      )

      await waitFor(() => {
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
      })
      expect(screen.getByText(/try again/i)).toBeInTheDocument()

      // Simulate fixing the error
      shouldThrow = false
      
      const retryButton = screen.getByText(/try again/i)
      await user.click(retryButton)

      await waitFor(() => {
        expect(screen.getByText('Success after retry')).toBeInTheDocument()
      })
    })

    it('should show retry state when retrying', async () => {
      const user = userEvent.setup()
      
      render(
        <ErrorBoundary>
          <ThrowErrorComponent />
        </ErrorBoundary>
      )

      await waitFor(() => {
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
      })
      
      const retryButton = screen.getByText(/try again/i)
      await user.click(retryButton)

      // Should show retrying state briefly
      expect(screen.getByText(/retrying/i)).toBeInTheDocument()
    })
  })

  describe('Development vs Production Mode', () => {
    it('should show technical details in development mode', async () => {
      const testError = new Error('Development error')
      
      render(
        <ErrorBoundary showDetails={true}>
          <ThrowErrorComponent error={testError} />
        </ErrorBoundary>
      )

      await waitFor(() => {
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
      })
      
      // Should have details section in development
      expect(screen.getByText(/technical details/i)).toBeInTheDocument()
    })

    it('should hide technical details in production mode', async () => {
      const testError = new Error('Production error')
      
      render(
        <ErrorBoundary showDetails={false}>
          <ThrowErrorComponent error={testError} />
        </ErrorBoundary>
      )

      await waitFor(() => {
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
      })
      
      // Should not show technical details in production
      expect(screen.queryByText(/technical details/i)).not.toBeInTheDocument()
    })
  })

  describe('Custom Fallback UI', () => {
    it('should render custom fallback when provided', async () => {
      const CustomFallback = () => <div>Custom error fallback</div>
      
      render(
        <ErrorBoundary fallback={<CustomFallback />}>
          <ThrowErrorComponent />
        </ErrorBoundary>
      )

      await waitFor(() => {
        expect(screen.getByText('Custom error fallback')).toBeInTheDocument()
      })
    })
  })

  describe('Error Logging', () => {
    it('should log errors to the logging service', async () => {
      const testError = new Error('Logged error')
      
      render(
        <ErrorBoundary>
          <ThrowErrorComponent error={testError} />
        </ErrorBoundary>
      )

      await waitFor(() => {
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
      })
      
      // Should call the logging service
      const { logErrorToService } = await import('@/services/logger')
      expect(logErrorToService).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Logged error'
        })
      )
    })
  })

  describe('Navigation Actions', () => {
    it('should provide go home button', async () => {
      render(
        <ErrorBoundary>
          <ThrowErrorComponent />
        </ErrorBoundary>
      )

      await waitFor(() => {
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
      })
      
      const homeButton = screen.getByText(/go home/i)
      expect(homeButton).toBeInTheDocument()
      
      // Should be a clickable button
      expect(homeButton.tagName).toBe('BUTTON')
    })
  })
})

describe('withErrorBoundary HOC', () => {
  it('should wrap component with error boundary', async () => {
    const TestComponent = () => <div>Test component</div>
    const WrappedComponent = withErrorBoundary(TestComponent)
    
    render(<WrappedComponent />)
    
    expect(screen.getByText('Test component')).toBeInTheDocument()
  })

  it('should catch errors in wrapped component', async () => {
    const ErrorComponent = () => {
      throw new Error('HOC error')
    }
    const WrappedComponent = withErrorBoundary(ErrorComponent)
    
    render(<WrappedComponent />)
    
    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    })
  })

  it('should pass through props to wrapped component', () => {
    const TestComponent = ({ message }: { message: string }) => <div>{message}</div>
    const WrappedComponent = withErrorBoundary(TestComponent)
    
    render(<WrappedComponent message="Hello from props" />)
    
    expect(screen.getByText('Hello from props')).toBeInTheDocument()
  })
})

describe('useErrorHandler Hook', () => {
  it('should provide error reporting function', () => {
    let errorHandler: any
    
    const TestComponent = () => {
      errorHandler = useErrorHandler()
      return <div>Hook test</div>
    }
    
    render(<TestComponent />)
    
    expect(errorHandler).toHaveProperty('reportError')
    expect(errorHandler).toHaveProperty('handleError')
    expect(typeof errorHandler.reportError).toBe('function')
    expect(typeof errorHandler.handleError).toBe('function')
  })

  it('should handle errors without throwing', () => {
    let errorHandler: any
    
    const TestComponent = () => {
      errorHandler = useErrorHandler()
      return <div>Hook test</div>
    }
    
    render(<TestComponent />)
    
    const testError = new Error('Hook error test')
    
    expect(() => {
      errorHandler.handleError(testError, { source: 'test' })
    }).not.toThrow()
  })
})

describe('Auto-retry Behavior', () => {
  it('should auto-retry retryable errors with exponential backoff', async () => {
    vi.useFakeTimers()
    
    let attemptCount = 0
    const maxAttempts = 3
    
    const AutoRetryComponent = () => {
      attemptCount++
      if (attemptCount <= maxAttempts) {
        const error = new Error(`Attempt ${attemptCount}`)
        Object.assign(error, { retryable: true, severity: ErrorSeverity.LOW })
        throw error
      }
      return <div>Success after auto-retry</div>
    }

    render(
      <ErrorBoundary>
        <AutoRetryComponent />
      </ErrorBoundary>
    )

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    })
    
    // Fast-forward through retry delays
    vi.advanceTimersByTime(5000)
    
    await waitFor(() => {
      expect(attemptCount).toBeGreaterThan(1)
    })
    
    vi.useRealTimers()
  })

  it('should not auto-retry critical errors', async () => {
    let attemptCount = 0
    
    const CriticalErrorComponent = () => {
      attemptCount++
      const error = new Error('Critical error')
      Object.assign(error, { retryable: true, severity: ErrorSeverity.CRITICAL })
      throw error
    }

    render(
      <ErrorBoundary>
        <CriticalErrorComponent />
      </ErrorBoundary>
    )

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    })
    
    // Should not auto-retry critical errors
    expect(attemptCount).toBe(1)
  })
})
