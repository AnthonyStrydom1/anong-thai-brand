/**
 * ERROR DISPLAY COMPONENTS TESTS
 * Testing user-friendly error display components
 * 
 * Tests error display with different severities, interactive elements, and accessibility
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  InlineError,
  FullPageError,
  LoadingWithError,
  FieldError,
  ErrorList,
  EmptyState,
  ValidationErrorSummary
} from '@/components/ui/ErrorDisplay'
import { render, createMockError, checkA11y } from '@/test/utils'
import { ErrorSeverity, ErrorCategory } from '@/types/errors'

describe('Error Display Components', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('InlineError', () => {
    it('should display error message', () => {
      const error = createMockError({
        userMessage: 'Test error message'
      })
      
      render(<InlineError error={error} />)
      
      expect(screen.getByText('Test error message')).toBeInTheDocument()
    })

    it('should show appropriate icon for error severity', () => {
      const criticalError = createMockError({
        severity: ErrorSeverity.CRITICAL,
        userMessage: 'Critical error'
      })
      
      render(<InlineError error={criticalError} />)
      
      // Should have critical error styling
      expect(screen.getByRole('alert')).toHaveClass('bg-red-50', 'border-red-200')
    })

    it('should show retry button for retryable errors', async () => {
      const user = userEvent.setup()
      const onRetry = vi.fn()
      const error = createMockError({
        retryable: true,
        userMessage: 'Retryable error'
      })
      
      render(<InlineError error={error} onRetry={onRetry} />)
      
      const retryButton = screen.getByText(/retry/i)
      expect(retryButton).toBeInTheDocument()
      
      await user.click(retryButton)
      expect(onRetry).toHaveBeenCalled()
    })

    it('should show technical details when enabled', () => {
      const error = createMockError({
        code: 'TEST_ERROR_001',
        trackingId: 'test-tracking-123'
      })
      
      render(<InlineError error={error} showDetails={true} />)
      
      expect(screen.getByText(/technical details/i)).toBeInTheDocument()
    })

    it('should be accessible', async () => {
      const error = createMockError()
      const { container } = render(<InlineError error={error} />)
      
      await checkA11y(container)
    })
  })

  describe('FullPageError', () => {
    it('should display full page error for critical errors', () => {
      const criticalError = createMockError({
        severity: ErrorSeverity.CRITICAL,
        userMessage: 'Critical system error'
      })
      
      render(<FullPageError error={criticalError} />)
      
      expect(screen.getByText('Critical Error')).toBeInTheDocument()
      expect(screen.getByText('Critical system error')).toBeInTheDocument()
    })

    it('should show different titles based on severity', () => {
      const severityTitles = [
        { severity: ErrorSeverity.CRITICAL, title: 'Critical Error' },
        { severity: ErrorSeverity.HIGH, title: 'Something Went Wrong' },
        { severity: ErrorSeverity.MEDIUM, title: 'Minor Issue' },
        { severity: ErrorSeverity.LOW, title: 'Notice' }
      ]
      
      severityTitles.forEach(({ severity, title }) => {
        const error = createMockError({ severity })
        const { unmount } = render(<FullPageError error={error} />)
        
        expect(screen.getByText(title)).toBeInTheDocument()
        unmount()
      })
    })
  })

  describe('LoadingWithError', () => {
    it('should show loading state', () => {
      render(
        <LoadingWithError isLoading={true} error={null}>
          <div>Content</div>
        </LoadingWithError>
      )
      
      expect(screen.getByText(/loading/i)).toBeInTheDocument()
      expect(screen.queryByText('Content')).not.toBeInTheDocument()
    })

    it('should show error state', () => {
      const error = createMockError({
        userMessage: 'Loading failed'
      })
      
      render(
        <LoadingWithError isLoading={false} error={error}>
          <div>Content</div>
        </LoadingWithError>
      )
      
      expect(screen.getByText('Loading failed')).toBeInTheDocument()
      expect(screen.queryByText('Content')).not.toBeInTheDocument()
    })

    it('should show content when loaded successfully', () => {
      render(
        <LoadingWithError isLoading={false} error={null}>
          <div>Content loaded</div>
        </LoadingWithError>
      )
      
      expect(screen.getByText('Content loaded')).toBeInTheDocument()
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    })
  })

  describe('FieldError', () => {
    it('should display field error message', () => {
      render(<FieldError error="Field is required" />)
      
      expect(screen.getByText('Field is required')).toBeInTheDocument()
    })

    it('should not render when no error', () => {
      render(<FieldError />)
      
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument()
    })

    it('should have proper styling for field errors', () => {
      render(<FieldError error="Validation error" />)
      
      const errorElement = screen.getByText('Validation error')
      expect(errorElement).toHaveClass('text-sm', 'text-red-600', 'mt-1')
    })
  })

  describe('ValidationErrorSummary', () => {
    it('should display validation error summary', () => {
      const errors = {
        email: 'Invalid email format',
        password: 'Password too short'
      }
      
      render(<ValidationErrorSummary errors={errors} />)
      
      expect(screen.getByText(/please fix the following errors/i)).toBeInTheDocument()
      expect(screen.getByText('Invalid email format')).toBeInTheDocument()
      expect(screen.getByText('Password too short')).toBeInTheDocument()
    })

    it('should not render when no errors', () => {
      render(<ValidationErrorSummary errors={{}} />)
      
      expect(screen.queryByText(/please fix/i)).not.toBeInTheDocument()
    })
  })
})
