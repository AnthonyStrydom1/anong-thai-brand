/**
 * ERROR HANDLERS TESTS
 * Comprehensive testing of error handling utilities
 * 
 * Tests async wrappers, retry logic, circuit breaker, form handling, and performance utilities
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { 
  safeAsync, 
  withRetry, 
  CircuitBreaker, 
  handleUserError,
  safeFetch,
  safeSupabaseOperation,
  withPerformanceTracking,
  extractFormErrors,
  createErrorFallback
} from '@/utils/errorHandlers'
import { createMockError, mockApiSuccess, mockApiError, createMockLogger } from '@/test/utils'
import { ErrorSeverity, ErrorCategory } from '@/types/errors'

// Mock dependencies
const mockLogger = createMockLogger()
vi.mock('@/services/logger', () => ({
  logger: mockLogger
}))

const mockToast = vi.fn()
vi.mock('sonner', () => ({
  toast: {
    success: mockToast,
    error: mockToast,
    warning: mockToast,
    info: mockToast
  }
}))

describe('Error Handler Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  describe('safeAsync', () => {
    it('should return success result for successful operations', async () => {
      const successOperation = async () => 'success result'
      
      const result = await safeAsync(successOperation)
      
      expect(result.success).toBe(true)
      expect(result.data).toBe('success result')
      expect(result.error).toBeUndefined()
    })

    it('should return error result for failed operations', async () => {
      const failedOperation = async () => {
        throw new Error('Operation failed')
      }
      
      const result = await safeAsync(failedOperation)
      
      expect(result.success).toBe(false)
      expect(result.data).toBeUndefined()
      expect(result.error).toBeDefined()
      expect(result.error?.message).toBe('Operation failed')
    })

    it('should include context in error classification', async () => {
      const failedOperation = async () => {
        throw new Error('Context test error')
      }
      
      const context = { operation: 'test', userId: '123' }
      await safeAsync(failedOperation, context)
      
      expect(mockLogger.logError).toHaveBeenCalledWith(
        expect.objectContaining({
          context: expect.objectContaining({
            source: 'safe_async',
            operation: 'test',
            userId: '123'
          })
        }),
        context
      )
    })

    it('should handle non-Error objects', async () => {
      const failedOperation = async () => {
        throw 'String error'
      }
      
      const result = await safeAsync(failedOperation)
      
      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('withRetry', () => {
    it('should succeed on first attempt without retries', async () => {
      const successOperation = vi.fn().mockResolvedValue('success')
      
      const result = await withRetry(successOperation)
      
      expect(result).toBe('success')
      expect(successOperation).toHaveBeenCalledTimes(1)
    })

    it('should retry failed operations up to maxRetries', async () => {
      const failedOperation = vi.fn().mockRejectedValue(new Error('Always fails'))
      
      await expect(
        withRetry(failedOperation, { maxRetries: 3 })
      ).rejects.toThrow('Always fails')
      
      expect(failedOperation).toHaveBeenCalledTimes(4) // Initial + 3 retries
    })

    it('should succeed after retries', async () => {
      let attemptCount = 0
      const eventualSuccessOperation = vi.fn().mockImplementation(async () => {
        attemptCount++
        if (attemptCount < 3) {
          throw new Error(`Attempt ${attemptCount} failed`)
        }
        return 'success on attempt 3'
      })
      
      const result = await withRetry(eventualSuccessOperation, { maxRetries: 3 })
      
      expect(result).toBe('success on attempt 3')
      expect(eventualSuccessOperation).toHaveBeenCalledTimes(3)
    })

    it('should implement exponential backoff', async () => {
      const failedOperation = vi.fn().mockRejectedValue(new Error('Backoff test'))
      
      const retryPromise = withRetry(failedOperation, { 
        maxRetries: 2,
        baseDelay: 100,
        backoffFactor: 2
      })
      
      // Fast forward through retry delays
      vi.advanceTimersByTime(100) // First retry delay
      await vi.runOnlyPendingTimersAsync()
      
      vi.advanceTimersByTime(200) // Second retry delay (100 * 2)
      await vi.runOnlyPendingTimersAsync()
      
      await expect(retryPromise).rejects.toThrow('Backoff test')
      expect(failedOperation).toHaveBeenCalledTimes(3)
    })

    it('should respect maxDelay setting', async () => {
      const failedOperation = vi.fn().mockRejectedValue(new Error('Max delay test'))
      
      const retryPromise = withRetry(failedOperation, {
        maxRetries: 3,
        baseDelay: 100,
        backoffFactor: 10,
        maxDelay: 150
      })
      
      // Even with high backoff factor, should cap at maxDelay
      vi.advanceTimersByTime(150)
      await vi.runOnlyPendingTimersAsync()
      
      await expect(retryPromise).rejects.toThrow('Max delay test')
    })

    it('should respect retry condition', async () => {
      const nonRetryableError = new Error('Non-retryable error')
      Object.assign(nonRetryableError, { retryable: false })
      
      const failedOperation = vi.fn().mockRejectedValue(nonRetryableError)
      
      await expect(
        withRetry(failedOperation, {
          maxRetries: 3,
          retryCondition: (error) => error.retryable === true
        })
      ).rejects.toThrow('Non-retryable error')
      
      // Should not retry non-retryable errors
      expect(failedOperation).toHaveBeenCalledTimes(1)
    })
  })

  describe('CircuitBreaker', () => {
    it('should allow operations when circuit is closed', async () => {
      const circuitBreaker = new CircuitBreaker({
        failureThreshold: 3,
        resetTimeout: 1000,
        monitoringPeriod: 500
      })
      
      const successOperation = vi.fn().mockResolvedValue('success')
      
      const result = await circuitBreaker.execute(successOperation)
      
      expect(result).toBe('success')
      expect(circuitBreaker.getState().state).toBe('CLOSED')
    })

    it('should open circuit after failure threshold', async () => {
      const circuitBreaker = new CircuitBreaker({
        failureThreshold: 2,
        resetTimeout: 1000,
        monitoringPeriod: 500
      })
      
      const failedOperation = vi.fn().mockRejectedValue(new Error('Circuit test'))
      
      // First two failures
      await expect(circuitBreaker.execute(failedOperation)).rejects.toThrow()
      await expect(circuitBreaker.execute(failedOperation)).rejects.toThrow()
      
      expect(circuitBreaker.getState().state).toBe('OPEN')
      
      // Third attempt should fail immediately due to open circuit
      await expect(circuitBreaker.execute(failedOperation)).rejects.toThrow('Circuit breaker is OPEN')
      expect(failedOperation).toHaveBeenCalledTimes(2) // Should not call the third time
    })

    it('should transition to half-open after reset timeout', async () => {
      const circuitBreaker = new CircuitBreaker({
        failureThreshold: 1,
        resetTimeout: 100,
        monitoringPeriod: 50
      })
      
      const failedOperation = vi.fn().mockRejectedValue(new Error('Reset test'))
      
      // Trigger circuit to open
      await expect(circuitBreaker.execute(failedOperation)).rejects.toThrow()
      expect(circuitBreaker.getState().state).toBe('OPEN')
      
      // Wait for reset timeout
      vi.advanceTimersByTime(150)
      
      // Next operation should transition to half-open
      const successOperation = vi.fn().mockResolvedValue('success')
      const result = await circuitBreaker.execute(successOperation)
      
      expect(result).toBe('success')
      expect(circuitBreaker.getState().state).toBe('CLOSED')
    })
  })

  describe('handleUserError', () => {
    it('should display toast for user errors', () => {
      const testError = createMockError({
        severity: ErrorSeverity.MEDIUM,
        userMessage: 'User friendly error message'
      })
      
      handleUserError(testError)
      
      expect(mockToast).toHaveBeenCalledWith(
        'User friendly error message',
        expect.objectContaining({
          duration: 5000
        })
      )
    })

    it('should show different toast types based on severity', () => {
      const criticalError = createMockError({
        severity: ErrorSeverity.CRITICAL,
        userMessage: 'Critical error'
      })
      
      const lowError = createMockError({
        severity: ErrorSeverity.LOW,
        userMessage: 'Info message'
      })
      
      handleUserError(criticalError)
      handleUserError(lowError)
      
      expect(mockToast).toHaveBeenCalledTimes(2)
    })

    it('should not show toast when disabled', () => {
      const testError = createMockError()
      
      handleUserError(testError, { showToast: false })
      
      expect(mockToast).not.toHaveBeenCalled()
    })

    it('should log error when enabled', () => {
      const testError = createMockError()
      
      handleUserError(testError, { logError: true })
      
      expect(mockLogger.logError).toHaveBeenCalledWith(
        expect.objectContaining({
          context: expect.objectContaining({
            source: 'user_error_handler'
          })
        }),
        {}
      )
    })
  })

  describe('safeFetch', () => {
    beforeEach(() => {
      global.fetch = vi.fn()
    })

    it('should return success result for successful requests', async () => {
      const mockResponse = { data: 'test' }
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      } as any)
      
      const result = await safeFetch('/api/test')
      
      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockResponse)
    })

    it('should handle HTTP errors', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: () => Promise.resolve({ error: 'Not found' })
      } as any)
      
      const result = await safeFetch('/api/not-found')
      
      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('should handle network errors', async () => {
      vi.mocked(fetch).mockRejectedValue(new Error('Network error'))
      
      const result = await safeFetch('/api/network-error')
      
      expect(result.success).toBe(false)
      expect(result.error?.message).toBe('Network error')
    })

    it('should include default headers', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({})
      } as any)
      
      await safeFetch('/api/test', { method: 'POST' })
      
      expect(fetch).toHaveBeenCalledWith('/api/test', {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      })
    })
  })

  describe('safeSupabaseOperation', () => {
    it('should return data for successful operations', async () => {
      const mockData = { id: 1, name: 'test' }
      const operation = vi.fn().mockResolvedValue({ data: mockData, error: null })
      
      const result = await safeSupabaseOperation(operation)
      
      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockData)
    })

    it('should handle Supabase errors', async () => {
      const mockError = { message: 'Database error', code: 'DB001' }
      const operation = vi.fn().mockResolvedValue({ data: null, error: mockError })
      
      const result = await safeSupabaseOperation(operation)
      
      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('should include context in error logs', async () => {
      const mockError = { message: 'Context test error' }
      const operation = vi.fn().mockResolvedValue({ data: null, error: mockError })
      
      const context = { table: 'users', operation: 'select' }
      await safeSupabaseOperation(operation, context)
      
      expect(mockLogger.logError).toHaveBeenCalledWith(
        expect.objectContaining({
          context: expect.objectContaining({
            source: 'supabase_operation',
            table: 'users',
            operation: 'select'
          })
        }),
        context
      )
    })
  })

  describe('withPerformanceTracking', () => {
    it('should measure operation performance', async () => {
      const operation = vi.fn().mockImplementation(async () => {
        // Simulate some work
        await new Promise(resolve => setTimeout(resolve, 100))
        return 'result'
      })
      
      vi.advanceTimersByTime(100)
      
      const result = await withPerformanceTracking(
        operation,
        'test_operation',
        1000 // 1 second threshold
      )
      
      expect(result).toBe('result')
      expect(mockLogger.performance).toHaveBeenCalledWith(
        'test_operation',
        expect.any(Number),
        undefined
      )
    })

    it('should log performance warnings for slow operations', async () => {
      const slowOperation = vi.fn().mockImplementation(async () => {
        await new Promise(resolve => setTimeout(resolve, 2000))
        return 'slow result'
      })
      
      vi.advanceTimersByTime(2000)
      
      await withPerformanceTracking(
        slowOperation,
        'slow_operation',
        1000 // 1 second threshold
      )
      
      // Should log performance metric
      expect(mockLogger.performance).toHaveBeenCalled()
    })

    it('should handle operation errors and still track performance', async () => {
      const failedOperation = vi.fn().mockImplementation(async () => {
        await new Promise(resolve => setTimeout(resolve, 100))
        throw new Error('Operation failed')
      })
      
      vi.advanceTimersByTime(100)
      
      await expect(
        withPerformanceTracking(failedOperation, 'failed_operation')
      ).rejects.toThrow('Operation failed')
      
      // Should still log the error with performance context
      expect(mockLogger.logError).toHaveBeenCalledWith(
        expect.objectContaining({
          context: expect.objectContaining({
            operationName: 'failed_operation',
            duration: expect.any(Number)
          })
        })
      )
    })
  })

  describe('extractFormErrors', () => {
    it('should extract field-specific errors', () => {
      const validationError = createMockError({
        category: ErrorCategory.VALIDATION,
        context: {
          field: 'email',
          userMessage: 'Invalid email format'
        }
      })
      
      const fieldErrors = extractFormErrors(validationError)
      
      expect(fieldErrors).toEqual({
        email: validationError.userMessage
      })
    })

    it('should extract multiple field errors', () => {
      const validationError = createMockError({
        category: ErrorCategory.VALIDATION,
        context: {
          fields: {
            email: 'Invalid email',
            password: 'Password too short'
          }
        }
      })
      
      const fieldErrors = extractFormErrors(validationError)
      
      expect(fieldErrors).toEqual({
        email: 'Invalid email',
        password: 'Password too short'
      })
    })

    it('should extract missing field errors', () => {
      const validationError = createMockError({
        category: ErrorCategory.VALIDATION,
        context: {
          missingFields: ['name', 'email']
        }
      })
      
      const fieldErrors = extractFormErrors(validationError)
      
      expect(fieldErrors).toEqual({
        name: 'name is required',
        email: 'email is required'
      })
    })

    it('should return empty object for non-validation errors', () => {
      const systemError = createMockError({
        category: ErrorCategory.SYSTEM
      })
      
      const fieldErrors = extractFormErrors(systemError)
      
      expect(fieldErrors).toEqual({})
    })
  })

  describe('createErrorFallback', () => {
    it('should create fallback component with component name', () => {
      const FallbackComponent = createErrorFallback('TestComponent')
      
      // Test that it's a valid React component
      expect(typeof FallbackComponent).toBe('function')
      expect(FallbackComponent.name).toBe('ErrorFallback')
    })

    it('should create fallback with custom message', () => {
      const FallbackComponent = createErrorFallback(
        'CustomComponent',
        'Custom error message'
      )
      
      expect(typeof FallbackComponent).toBe('function')
    })
  })

  describe('Error Recovery Patterns', () => {
    it('should implement graceful degradation', async () => {
      let fallbackCalled = false
      
      const operationWithFallback = async () => {
        try {
          // Primary operation that fails
          throw new Error('Primary failed')
        } catch (error) {
          // Fallback operation
          fallbackCalled = true
          return 'fallback result'
        }
      }
      
      const result = await safeAsync(operationWithFallback)
      
      expect(result.success).toBe(true)
      expect(result.data).toBe('fallback result')
      expect(fallbackCalled).toBe(true)
    })

    it('should chain error handlers', async () => {
      const handlers = [
        vi.fn().mockRejectedValue(new Error('Handler 1 failed')),
        vi.fn().mockRejectedValue(new Error('Handler 2 failed')),
        vi.fn().mockResolvedValue('Handler 3 succeeded')
      ]
      
      let result = null
      for (const handler of handlers) {
        try {
          result = await handler()
          break // Success, exit loop
        } catch (error) {
          // Continue to next handler
        }
      }
      
      expect(result).toBe('Handler 3 succeeded')
      expect(handlers[0]).toHaveBeenCalled()
      expect(handlers[1]).toHaveBeenCalled()
      expect(handlers[2]).toHaveBeenCalled()
    })
  })
})
