/**
 * TEST UTILITIES
 * Reusable testing utilities and helpers
 * 
 * Provides common testing patterns, component wrappers,
 * and utilities for testing React components and error handling
 */

import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { BaseError, ErrorSeverity, ErrorCategory } from '@/types/errors'

// ========================
// TEST PROVIDERS WRAPPER
// ========================

interface TestProvidersProps {
  children: React.ReactNode
  queryClient?: QueryClient
  initialRoute?: string
  withErrorBoundary?: boolean
}

export function TestProviders({ 
  children, 
  queryClient,
  initialRoute = '/',
  withErrorBoundary = false
}: TestProvidersProps) {
  const testQueryClient = queryClient || new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  })

  // Set initial route if provided
  if (initialRoute !== '/') {
    window.history.pushState({}, 'Test page', initialRoute)
  }

  const content = (
    <QueryClientProvider client={testQueryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  )

  if (withErrorBoundary) {
    return (
      <ErrorBoundary 
        showDetails={true}
        onError={vi.fn()}
      >
        {content}
      </ErrorBoundary>
    )
  }

  return content
}

// ========================
// CUSTOM RENDER FUNCTION
// ========================

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient
  initialRoute?: string
  withErrorBoundary?: boolean
}

export function renderWithProviders(
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) {
  const { queryClient, initialRoute, withErrorBoundary, ...renderOptions } = options
  
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <TestProviders 
      queryClient={queryClient}
      initialRoute={initialRoute}
      withErrorBoundary={withErrorBoundary}
    >
      {children}
    </TestProviders>
  )

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// ========================
// ERROR TESTING UTILITIES
// ========================

// Create mock error objects for testing
export function createMockError(overrides: Partial<BaseError> = {}): BaseError {
  return {
    code: 'TEST_ERROR',
    message: 'Test error message',
    category: ErrorCategory.SYSTEM,
    severity: ErrorSeverity.MEDIUM,
    timestamp: new Date(),
    trackingId: 'test-tracking-id',
    userMessage: 'Something went wrong. Please try again.',
    retryable: true,
    context: { test: true },
    ...overrides,
  }
}

// Create a component that throws an error (for error boundary testing)
export function ThrowErrorComponent({ 
  shouldThrow = true, 
  error = new Error('Test error'),
  children 
}: { 
  shouldThrow?: boolean
  error?: Error
  children?: React.ReactNode 
}) {
  if (shouldThrow) {
    throw error
  }
  return <>{children || <div>No error thrown</div>}</>
}

// Create async component that throws (for async error testing)
export function AsyncThrowErrorComponent({ 
  delay = 100,
  error = new Error('Async test error')
}: {
  delay?: number
  error?: Error
}) {
  React.useEffect(() => {
    setTimeout(() => {
      throw error
    }, delay)
  }, [delay, error])

  return <div>Async component loaded</div>
}

// Mock logger for testing
export function createMockLogger() {
  return {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    critical: vi.fn(),
    logError: vi.fn(),
    security: vi.fn(),
    performance: vi.fn(),
    userAction: vi.fn(),
    setUserId: vi.fn(),
    clearUserId: vi.fn(),
  }
}

// ========================
// FORM TESTING UTILITIES
// ========================

// Helper for testing form interactions
export async function fillAndSubmitForm(
  form: HTMLFormElement,
  data: Record<string, string>
) {
  const { fireEvent } = await import('@testing-library/react')
  
  // Fill form fields
  Object.entries(data).forEach(([name, value]) => {
    const field = form.querySelector(`[name="${name}"]`) as HTMLInputElement
    if (field) {
      fireEvent.change(field, { target: { value } })
    }
  })

  // Submit form
  fireEvent.submit(form)
}

// Helper for testing form validation errors
export function expectFormError(form: HTMLElement, fieldName: string, errorMessage?: string) {
  const field = form.querySelector(`[name="${fieldName}"]`)
  const errorElement = form.querySelector(`[data-testid="${fieldName}-error"]`) ||
                      form.querySelector('.error-message')
  
  expect(field).toHaveAttribute('aria-invalid', 'true')
  
  if (errorMessage) {
    expect(errorElement).toHaveTextContent(errorMessage)
  } else {
    expect(errorElement).toBeInTheDocument()
  }
}

// ========================
// API TESTING UTILITIES
// ========================

// Mock successful API response
export function mockApiSuccess(data: any, delay = 0) {
  return new Promise(resolve => 
    setTimeout(() => resolve({ data, error: null }), delay)
  )
}

// Mock API error response
export function mockApiError(error: any, delay = 0) {
  return new Promise((_, reject) => 
    setTimeout(() => reject(error), delay)
  )
}

// Mock Supabase operation
export function mockSupabaseOperation(data: any, error: any = null) {
  return Promise.resolve({ data, error })
}

// ========================
// ACCESSIBILITY TESTING
// ========================

// Check for basic accessibility requirements
export async function checkA11y(container: HTMLElement) {
  const { axe, toHaveNoViolations } = await import('jest-axe')
  expect.extend(toHaveNoViolations)
  
  const results = await axe(container)
  expect(results).toHaveNoViolations()
}

// ========================
// PERFORMANCE TESTING
// ========================

// Measure component render time
export function measureRenderTime<T>(renderFn: () => T): { result: T; time: number } {
  const start = performance.now()
  const result = renderFn()
  const end = performance.now()
  
  return {
    result,
    time: end - start
  }
}

// Test for memory leaks
export function expectNoMemoryLeaks(cleanup: () => void) {
  const initialMemory = (performance as any).memory?.usedJSHeapSize
  cleanup()
  
  // Force garbage collection if available (in test environment)
  if (global.gc) {
    global.gc()
  }
  
  const finalMemory = (performance as any).memory?.usedJSHeapSize
  
  if (initialMemory && finalMemory) {
    // Allow for some variance, but flag significant increases
    const memoryIncrease = finalMemory - initialMemory
    const threshold = initialMemory * 0.1 // 10% increase threshold
    
    expect(memoryIncrease).toBeLessThan(threshold)
  }
}

// ========================
// WAIT UTILITIES
// ========================

// Wait for element to appear
export async function waitForElement(selector: string, timeout = 1000) {
  const { waitFor } = await import('@testing-library/react')
  
  return waitFor(
    () => {
      const element = document.querySelector(selector)
      if (!element) throw new Error(`Element ${selector} not found`)
      return element
    },
    { timeout }
  )
}

// Wait for error to be displayed
export async function waitForError(errorMessage?: string, timeout = 1000) {
  const { waitFor } = await import('@testing-library/react')
  
  return waitFor(
    () => {
      const errorElements = document.querySelectorAll('[role="alert"], .error-message, [data-testid*="error"]')
      
      if (errorElements.length === 0) {
        throw new Error('No error elements found')
      }
      
      if (errorMessage) {
        const matchingElement = Array.from(errorElements).find(el => 
          el.textContent?.includes(errorMessage)
        )
        if (!matchingElement) {
          throw new Error(`Error with message "${errorMessage}" not found`)
        }
        return matchingElement
      }
      
      return errorElements[0]
    },
    { timeout }
  )
}

// ========================
// EXPORTS
// ========================

export {
  renderWithProviders as render,
  TestProviders,
  createMockError,
  ThrowErrorComponent,
  AsyncThrowErrorComponent,
  createMockLogger,
  fillAndSubmitForm,
  expectFormError,
  mockApiSuccess,
  mockApiError,
  mockSupabaseOperation,
  checkA11y,
  measureRenderTime,
  expectNoMemoryLeaks,
  waitForElement,
  waitForError,
}

// Re-export common testing library functions
export * from '@testing-library/react'
export { userEvent } from '@testing-library/user-event'
