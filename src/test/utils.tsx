
/**
 * TEST UTILITIES
 * Reusable testing utilities and helpers
 */

import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'
import { ErrorBoundary } from '@/components/ErrorBoundary'

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
  code: string
  message: string
  category: string
  severity: string
  timestamp: Date
  trackingId: string
  userMessage: string
  retryable: boolean
  context?: Record<string, any>
}

export function createMockError(overrides: Partial<MockError> = {}): MockError {
  return {
    code: 'TEST_ERROR',
    message: 'Test error message',
    category: 'system',
    severity: 'medium',
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
  }
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
