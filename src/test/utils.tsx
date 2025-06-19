/**
 * TEST UTILITIES
 * Reusable testing utilities and helpers
 */

import React from 'react'
import { render, RenderOptions, waitFor, screen, expect } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { vi, expect } from 'vitest'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ErrorCategory, ErrorSeverity } from '@/types/errors'

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

export interface MockError {
  name: string
  code: string
  message: string
  category: ErrorCategory
  severity: ErrorSeverity
  timestamp: Date
  trackingId: string
  userMessage: string
  retryable: boolean
  context?: Record<string, any>
}

export function createMockError(overrides: Partial<MockError> = {}): MockError {
  return {
    name: 'TestError',
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

export function createMockLogger() {
  return {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    critical: vi.fn(),
    logError: vi.fn(),
    performance: vi.fn(),
  }
}

// ========================
// ASYNC ERROR COMPONENT
// ========================

export function AsyncThrowErrorComponent({ 
  shouldThrow = true, 
  delay = 0,
  error = new Error('Async test error'),
  children 
}: { 
  shouldThrow?: boolean
  delay?: number
  error?: Error
  children?: React.ReactNode 
}) {
  React.useEffect(() => {
    if (shouldThrow) {
      setTimeout(() => {
        throw error
      }, delay)
    }
  }, [shouldThrow, delay, error])

  return <>{children || <div>Async component loaded</div>}</>
}

// ========================
// FORM TESTING UTILITIES
// ========================

export async function fillAndSubmitForm(
  formFields: Record<string, string>,
  submitButtonText = 'Submit'
) {
  const { userEvent } = await import('@testing-library/user-event')
  const user = userEvent.setup()
  
  for (const [fieldName, value] of Object.entries(formFields)) {
    const field = screen.getByLabelText(new RegExp(fieldName, 'i'))
    await user.clear(field)
    await user.type(field, value)
  }
  
  const submitButton = screen.getByRole('button', { name: new RegExp(submitButtonText, 'i') })
  await user.click(submitButton)
}

export function expectFormError(fieldName: string, errorMessage?: string) {
  const errorElement = screen.getByText(
    errorMessage ? new RegExp(errorMessage, 'i') : new RegExp(`${fieldName}.*required`, 'i')
  )
  expect(errorElement).toBeInTheDocument()
}

// ========================
// API TESTING UTILITIES
// ========================

export function mockApiSuccess(data: any, delay = 0) {
  return new Promise(resolve => 
    setTimeout(() => resolve({ data, error: null }), delay)
  )
}

export function mockApiError(error: any, delay = 0) {
  return new Promise((_, reject) => 
    setTimeout(() => reject(error), delay)
  )
}

export function mockSupabaseOperation(result: { data?: any; error?: any }) {
  return vi.fn().mockResolvedValue(result)
}

// ========================
// ACCESSIBILITY UTILITIES
// ========================

export async function checkA11y(container: HTMLElement) {
  expect(container).toBeInTheDocument()
  expect(container.querySelector('[aria-label], [aria-labelledby]')).toBeTruthy()
}

// ========================
// PERFORMANCE UTILITIES
// ========================

export function measureRenderTime(renderFn: () => void): number {
  const start = performance.now()
  renderFn()
  const end = performance.now()
  return end - start
}

export function expectNoMemoryLeaks() {
  const initialMemory = (performance as any).memory?.usedJSHeapSize || 0
  
  return {
    check: () => {
      const currentMemory = (performance as any).memory?.usedJSHeapSize || 0
      const memoryIncrease = currentMemory - initialMemory
      expect(memoryIncrease).toBeLessThan(1024 * 1024)
    }
  }
}

// ========================
// WAITING UTILITIES
// ========================

export async function waitForElement(
  selector: string,
  timeout = 5000
): Promise<HTMLElement> {
  return waitFor(
    () => {
      const element = screen.getByTestId(selector) || screen.getByText(selector)
      expect(element).toBeInTheDocument()
      return element
    },
    { timeout }
  )
}

export async function waitForError(
  errorText?: string,
  timeout = 5000
): Promise<void> {
  return waitFor(
    () => {
      const errorElement = errorText 
        ? screen.getByText(new RegExp(errorText, 'i'))
        : screen.getByText(/error|wrong|failed/i)
      expect(errorElement).toBeInTheDocument()
    },
    { timeout }
  )
}

export const mockSupabaseClient = {
  auth: {
    getUser: vi.fn(),
    getSession: vi.fn(),
    signUp: vi.fn(),
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChange: vi.fn(() => ({
      data: { subscription: { unsubscribe: vi.fn() } }
    })),
  },
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
  })),
  rpc: vi.fn(),
}

// ========================
// EXPORTS
// ========================

export {
  renderWithProviders as render,
}

// Re-export common testing library functions
export * from '@testing-library/react'
export { userEvent } from '@testing-library/user-event'
