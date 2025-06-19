/**
 * TEST SETUP CONFIGURATION
 * Global test setup for Anthony Anong Project
 * 
 * This file configures the testing environment with necessary
 * polyfills, mocks, and global test utilities
 */

import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, afterAll, vi } from 'vitest'

// ========================
// GLOBAL TEST CLEANUP
// ========================

// Clean up after each test
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
  vi.clearAllTimers()
})

// ========================
// GLOBAL MOCKS
// ========================

// Mock window.matchMedia (for responsive components)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock window.ResizeObserver (for layout components)
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock IntersectionObserver (for lazy loading)
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
}
global.localStorage = localStorageMock as any

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
}
global.sessionStorage = sessionStorageMock as any

// Mock console methods for testing (to avoid noise in test output)
const originalConsole = global.console
beforeAll(() => {
  global.console = {
    ...originalConsole,
    // Comment out methods you want to see in tests
    log: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  } as any
})

afterAll(() => {
  global.console = originalConsole
})

// ========================
// ENVIRONMENT VARIABLES
// ========================

// Set test environment variables
process.env.NODE_ENV = 'test'
process.env.VITE_SUPABASE_URL = 'http://localhost:54321'
process.env.VITE_SUPABASE_ANON_KEY = 'test-anon-key'

// ========================
// FETCH MOCK
// ========================

// Mock fetch for API calls
global.fetch = vi.fn()

// Helper function to mock fetch responses
export const mockFetch = (response: any, options: { ok?: boolean; status?: number } = {}) => {
  const { ok = true, status = 200 } = options
  
  ;(global.fetch as any).mockResolvedValueOnce({
    ok,
    status,
    json: () => Promise.resolve(response),
    text: () => Promise.resolve(JSON.stringify(response)),
    headers: new Headers(),
  })
}

// Helper function to mock fetch errors
export const mockFetchError = (error: Error | string) => {
  const errorObj = typeof error === 'string' ? new Error(error) : error
  ;(global.fetch as any).mockRejectedValueOnce(errorObj)
}

// ========================
// ROUTER MOCK
// ========================

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({
      pathname: '/',
      search: '',
      hash: '',
      state: null,
    }),
    useParams: () => ({}),
  }
})

// ========================
// SUPABASE MOCK
// ========================

// Mock Supabase client
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

vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabaseClient
}))

// ========================
// CUSTOM MATCHERS
// ========================

// Extend expect with custom matchers for error testing
expect.extend({
  toBeValidError(received: any) {
    const pass = received && 
                 typeof received.code === 'string' &&
                 typeof received.message === 'string' &&
                 typeof received.category === 'string' &&
                 typeof received.severity === 'string'
    
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid error object`,
        pass: true,
      }
    } else {
      return {
        message: () => `expected ${received} to be a valid error object with code, message, category, and severity`,
        pass: false,
      }
    }
  },
  
  toHaveBeenLoggedWithLevel(loggerSpy: any, level: string) {
    const calls = loggerSpy.mock.calls
    const levelCalls = calls.filter((call: any) => call[0] === level)
    
    if (levelCalls.length > 0) {
      return {
        message: () => `expected logger not to have been called with level ${level}`,
        pass: true,
      }
    } else {
      return {
        message: () => `expected logger to have been called with level ${level}`,
        pass: false,
      }
    }
  }
})

// Type declarations for custom matchers
declare global {
  namespace Vi {
    interface JestAssertion<T = any> {
      toBeValidError(): T
      toHaveBeenLoggedWithLevel(level: string): T
    }
  }
}
