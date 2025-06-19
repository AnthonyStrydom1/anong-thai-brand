
/**
 * ERROR DISPLAY COMPONENTS TESTS
 * Testing user-friendly error display components
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  InlineError,
  FullPageError,
  LoadingWithError,
  FieldError,
  ValidationErrorSummary
} from '@/components/ui/ErrorDisplay'
import { render, createMockError } from '@/test/utils'
import { ErrorSeverity } from '@/types/errors'

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

    it('should show retry button for retryable errors', async () => {
      const user = userEvent.setup()
      const onRetry = vi.fn()
      const error = createMockError({
        retryable: true,
        userMessage: 'Retryable error'
      })
      
      render(<InlineError error={error} onRetry={onRetry} />)
      
      const retryButton = screen.getByRole('button')
      expect(retryButton).toBeInTheDocument()
      
      await user.click(retryButton)
      expect(onRetry).toHaveBeenCalled()
    })
  })

  describe('FullPageError', () => {
    it('should display full page error', () => {
      const error = createMockError({
        severity: ErrorSeverity.CRITICAL,
        userMessage: 'Critical system error'
      })
      
      render(<FullPageError error={error} />)
      
      expect(screen.getByText('Critical system error')).toBeInTheDocument()
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

    it('should show content when loaded successfully', () => {
      render(
        <LoadingWithError isLoading={false} error={null}>
          <div>Content loaded</div>
        </LoadingWithError>
      )
      
      expect(screen.getByText('Content loaded')).toBeInTheDocument()
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
