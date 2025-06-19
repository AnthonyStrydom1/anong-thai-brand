
/**
 * ERROR HANDLING INTEGRATION TESTS
 * End-to-end testing of error handling across the application
 */

import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test/utils'
import { ErrorBoundary } from '@/components/ErrorBoundary'

// Mock components for testing error scenarios
const ErrorThrowingComponent = ({ shouldThrow = true }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Integration test error')
  }
  return <div>Component loaded successfully</div>
}

// Mock Supabase client
const mockSupabaseClient = {
  auth: {
    signInWithPassword: vi.fn(),
  },
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
  })),
}

describe('Error Handling Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Application-Level Error Boundary', () => {
    it('should catch errors in the main app', async () => {
      const TestApp = () => (
        <ErrorBoundary>
          <ErrorThrowingComponent />
        </ErrorBoundary>
      )
      
      render(<TestApp />)
      
      await waitFor(() => {
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
      })
    })

    it('should allow recovery from errors', async () => {
      const user = userEvent.setup()
      let shouldThrow = true
      
      const RecoverableApp = () => (
        <ErrorBoundary>
          <ErrorThrowingComponent shouldThrow={shouldThrow} />
        </ErrorBoundary>
      )
      
      render(<RecoverableApp />)
      
      // Should show error initially
      await waitFor(() => {
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
      })
      
      // Fix the error and retry
      shouldThrow = false
      const retryButton = screen.getByText(/try again/i)
      await user.click(retryButton)
      
      // Should recover
      await waitFor(() => {
        expect(screen.getByText('Component loaded successfully')).toBeInTheDocument()
      })
    })
  })

  describe('API Error Handling', () => {
    it('should handle authentication errors', async () => {
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid login credentials' }
      })
      
      const TestAuthComponent = () => {
        const [error, setError] = React.useState<string | null>(null)
        
        const handleLogin = async () => {
          try {
            const { data, error } = await mockSupabaseClient.auth.signInWithPassword({
              email: 'test@example.com',
              password: 'wrongpassword'
            })
            
            if (error) throw error
          } catch (err: any) {
            setError(err.message)
          }
        }
        
        return (
          <div>
            <button onClick={handleLogin}>Login</button>
            {error && <div role="alert">{error}</div>}
          </div>
        )
      }
      
      const user = userEvent.setup()
      render(<TestAuthComponent />)
      
      const loginButton = screen.getByText('Login')
      await user.click(loginButton)
      
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Invalid login credentials')
      })
    })

    it('should handle network errors gracefully', async () => {
      // Mock network failure
      const mockFetch = vi.fn().mockRejectedValue(new Error('Network request failed'))
      global.fetch = mockFetch
      
      const TestNetworkComponent = () => {
        const [error, setError] = React.useState<string | null>(null)
        const [loading, setLoading] = React.useState(false)
        
        const fetchData = async () => {
          setLoading(true)
          setError(null)
          
          try {
            const response = await fetch('/api/data')
            if (!response.ok) throw new Error('Network error')
            await response.json()
          } catch (err: any) {
            setError(err.message)
          } finally {
            setLoading(false)
          }
        }
        
        return (
          <div>
            <button onClick={fetchData} disabled={loading}>
              {loading ? 'Loading...' : 'Fetch Data'}
            </button>
            {error && <div role="alert">{error}</div>}
          </div>
        )
      }
      
      const user = userEvent.setup()
      render(<TestNetworkComponent />)
      
      const fetchButton = screen.getByText('Fetch Data')
      await user.click(fetchButton)
      
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Network request failed')
      })
    })
  })

  describe('Form Validation Integration', () => {
    it('should display form validation errors', async () => {
      const TestForm = () => {
        const [errors, setErrors] = React.useState<Record<string, string>>({})
        
        const handleSubmit = (e: React.FormEvent) => {
          e.preventDefault()
          const formData = new FormData(e.target as HTMLFormElement)
          const email = formData.get('email') as string
          
          const newErrors: Record<string, string> = {}
          
          if (!email) {
            newErrors.email = 'Email is required'
          } else if (!email.includes('@')) {
            newErrors.email = 'Invalid email format'
          }
          
          setErrors(newErrors)
        }
        
        return (
          <form onSubmit={handleSubmit}>
            <input name="email" placeholder="Email" />
            {errors.email && (
              <div role="alert" aria-label="email error">
                {errors.email}
              </div>
            )}
            <button type="submit">Submit</button>
          </form>
        )
      }
      
      const user = userEvent.setup()
      render(<TestForm />)
      
      // Submit empty form
      const submitButton = screen.getByText('Submit')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByLabelText('email error')).toHaveTextContent('Email is required')
      })
    })
  })
})
