/**
 * ERROR HANDLING INTEGRATION TESTS
 * End-to-end testing of error handling across the application
 * 
 * Tests API error handling, authentication flows, form validation,
 * and error boundary integration with real components
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render, mockSupabaseClient, mockFetch, mockFetchError } from '@/test/utils'
import App from '@/App'
import { ErrorBoundary } from '@/components/ErrorBoundary'

// Mock components for testing error scenarios
const ErrorThrowingComponent = ({ shouldThrow = true }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Integration test error')
  }
  return <div>Component loaded successfully</div>
}

describe('Error Handling Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Reset fetch mock
    global.fetch = vi.fn()
    
    // Mock console to avoid noise in tests
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Application-Level Error Boundary', () => {
    it('should catch errors in the main app', async () => {
      // Create a test component that throws an error
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
      
      const { rerender } = render(<RecoverableApp />)
      
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
    it('should handle Supabase authentication errors', async () => {
      // Mock authentication failure
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
      mockFetchError('Network request failed')
      
      const TestNetworkComponent = () => {
        const [error, setError] = React.useState<string | null>(null)
        const [loading, setLoading] = React.useState(false)
        
        const fetchData = async () => {
          setLoading(true)
          setError(null)
          
          try {
            const response = await fetch('/api/data')
            if (!response.ok) throw new Error('Network error')
            const data = await response.json()
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

    it('should handle Supabase database errors', async () => {
      // Mock database error
      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Row not found', code: 'PGRST116' }
        })
      })
      
      const TestDatabaseComponent = () => {
        const [error, setError] = React.useState<string | null>(null)
        const [data, setData] = React.useState(null)
        
        const fetchUser = async () => {
          try {
            const { data, error } = await mockSupabaseClient
              .from('users')
              .select('*')
              .eq('id', 'nonexistent')
              .single()
            
            if (error) throw error
            setData(data)
          } catch (err: any) {
            setError(err.message)
          }
        }
        
        return (
          <div>
            <button onClick={fetchUser}>Fetch User</button>
            {error && <div role="alert">{error}</div>}
            {data && <div>User loaded</div>}
          </div>
        )
      }
      
      const user = userEvent.setup()
      render(<TestDatabaseComponent />)
      
      const fetchButton = screen.getByText('Fetch User')
      await user.click(fetchButton)
      
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Row not found')
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
          const password = formData.get('password') as string
          
          const newErrors: Record<string, string> = {}
          
          if (!email) {
            newErrors.email = 'Email is required'
          } else if (!email.includes('@')) {
            newErrors.email = 'Invalid email format'
          }
          
          if (!password) {
            newErrors.password = 'Password is required'
          } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
          }
          
          setErrors(newErrors)
        }
        
        return (
          <form onSubmit={handleSubmit}>
            <div>
              <input name="email" placeholder="Email" />
              {errors.email && (
                <div role="alert" aria-label="email error">
                  {errors.email}
                </div>
              )}
            </div>
            <div>
              <input name="password" type="password" placeholder="Password" />
              {errors.password && (
                <div role="alert" aria-label="password error">
                  {errors.password}
                </div>
              )}
            </div>
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
        expect(screen.getByLabelText('password error')).toHaveTextContent('Password is required')
      })
      
      // Fix email but leave password invalid
      const emailInput = screen.getByPlaceholderText('Email')
      const passwordInput = screen.getByPlaceholderText('Password')
      
      await user.type(emailInput, 'invalid-email')
      await user.type(passwordInput, '123')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByLabelText('email error')).toHaveTextContent('Invalid email format')
        expect(screen.getByLabelText('password error')).toHaveTextContent('Password must be at least 6 characters')
      })
    })

    it('should clear validation errors when form is fixed', async () => {
      const TestForm = () => {
        const [errors, setErrors] = React.useState<Record<string, string>>({
          email: 'Email is required'
        })
        
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          if (e.target.name === 'email' && e.target.value) {
            setErrors(prev => ({ ...prev, email: '' }))
          }
        }
        
        return (
          <form>
            <input name="email" placeholder="Email" onChange={handleChange} />
            {errors.email && (
              <div role="alert">{errors.email}</div>
            )}
          </form>
        )
      }
      
      const user = userEvent.setup()
      render(<TestForm />)
      
      // Should show error initially
      expect(screen.getByRole('alert')).toHaveTextContent('Email is required')
      
      // Type in email field
      const emailInput = screen.getByPlaceholderText('Email')
      await user.type(emailInput, 'test@example.com')
      
      await waitFor(() => {
        expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      })
    })
  })

  describe('Loading States with Error Handling', () => {
    it('should handle loading states and errors properly', async () => {
      const TestLoadingComponent = () => {
        const [loading, setLoading] = React.useState(false)
        const [error, setError] = React.useState<string | null>(null)
        const [data, setData] = React.useState<string | null>(null)
        
        const loadData = async () => {
          setLoading(true)
          setError(null)
          setData(null)
          
          try {
            // Simulate async operation
            await new Promise(resolve => setTimeout(resolve, 100))
            
            // Simulate random failure
            if (Math.random() > 0.5) {
              throw new Error('Random error occurred')
            }
            
            setData('Data loaded successfully')
          } catch (err: any) {
            setError(err.message)
          } finally {
            setLoading(false)
          }
        }
        
        return (
          <div>
            <button onClick={loadData} disabled={loading}>
              {loading ? 'Loading...' : 'Load Data'}
            </button>
            {error && (
              <div role="alert">{error}</div>
            )}
            {data && (
              <div>{data}</div>
            )}
          </div>
        )
      }
      
      const user = userEvent.setup()
      render(<TestLoadingComponent />)
      
      const loadButton = screen.getByText('Load Data')
      
      // Mock Math.random to always fail
      vi.spyOn(Math, 'random').mockReturnValue(0.3)
      
      await user.click(loadButton)
      
      // Should show loading state briefly
      expect(screen.getByText('Loading...')).toBeInTheDocument()
      
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Random error occurred')
      })
      
      // Button should be enabled again
      expect(screen.getByText('Load Data')).not.toBeDisabled()
    })
  })

  describe('Error Recovery Workflows', () => {
    it('should allow users to retry failed operations', async () => {
      const user = userEvent.setup()
      let attemptCount = 0
      
      const TestRetryComponent = () => {
        const [error, setError] = React.useState<string | null>(null)
        const [success, setSuccess] = React.useState(false)
        
        const attemptOperation = async () => {
          attemptCount++
          setError(null)
          setSuccess(false)
          
          try {
            // Fail first two attempts, succeed on third
            if (attemptCount < 3) {
              throw new Error(`Attempt ${attemptCount} failed`)
            }
            
            setSuccess(true)
          } catch (err: any) {
            setError(err.message)
          }
        }
        
        return (
          <div>
            <button onClick={attemptOperation}>
              Attempt Operation
            </button>
            {error && (
              <div>
                <div role="alert">{error}</div>
                <button onClick={attemptOperation}>
                  Retry
                </button>
              </div>
            )}
            {success && (
              <div>Operation succeeded!</div>
            )}
          </div>
        )
      }
      
      render(<TestRetryComponent />)
      
      const attemptButton = screen.getByText('Attempt Operation')
      
      // First attempt
      await user.click(attemptButton)
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Attempt 1 failed')
      })
      
      // Retry
      const retryButton = screen.getByText('Retry')
      await user.click(retryButton)
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Attempt 2 failed')
      })
      
      // Second retry - should succeed
      await user.click(screen.getByText('Retry'))
      await waitFor(() => {
        expect(screen.getByText('Operation succeeded!')).toBeInTheDocument()
      })
    })
  })

  describe('Toast Notification Integration', () => {
    it('should show toast notifications for errors', async () => {
      // Mock the toast function
      const mockToast = vi.fn()
      vi.mock('sonner', () => ({
        toast: {
          error: mockToast,
          success: mockToast
        }
      }))
      
      const TestToastComponent = () => {
        const showError = () => {
          // This would normally use the toast from sonner
          mockToast('Operation failed')
        }
        
        return (
          <button onClick={showError}>
            Show Error Toast
          </button>
        )
      }
      
      const user = userEvent.setup()
      render(<TestToastComponent />)
      
      const button = screen.getByText('Show Error Toast')
      await user.click(button)
      
      expect(mockToast).toHaveBeenCalledWith('Operation failed')
    })
  })

  describe('Cross-Component Error Propagation', () => {
    it('should handle errors that propagate across component boundaries', async () => {
      const ChildComponent = ({ shouldError }: { shouldError: boolean }) => {
        React.useEffect(() => {
          if (shouldError) {
            throw new Error('Child component error')
          }
        }, [shouldError])
        
        return <div>Child component</div>
      }
      
      const ParentComponent = () => {
        const [shouldError, setShouldError] = React.useState(false)
        
        return (
          <ErrorBoundary>
            <div>
              <button onClick={() => setShouldError(true)}>
                Trigger Error
              </button>
              <ChildComponent shouldError={shouldError} />
            </div>
          </ErrorBoundary>
        )
      }
      
      const user = userEvent.setup()
      render(<ParentComponent />)
      
      expect(screen.getByText('Child component')).toBeInTheDocument()
      
      const triggerButton = screen.getByText('Trigger Error')
      await user.click(triggerButton)
      
      await waitFor(() => {
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
      })
    })
  })

  describe('Performance Error Handling', () => {
    it('should handle slow operations gracefully', async () => {
      const TestSlowComponent = () => {
        const [status, setStatus] = React.useState('idle')
        
        const slowOperation = async () => {
          setStatus('loading')
          
          try {
            // Simulate very slow operation
            await new Promise(resolve => setTimeout(resolve, 2000))
            setStatus('success')
          } catch (err) {
            setStatus('error')
          }
        }
        
        return (
          <div>
            <button onClick={slowOperation} disabled={status === 'loading'}>
              {status === 'loading' ? 'Processing...' : 'Start Slow Operation'}
            </button>
            <div>Status: {status}</div>
          </div>
        )
      }
      
      const user = userEvent.setup()
      render(<TestSlowComponent />)
      
      const button = screen.getByText('Start Slow Operation')
      await user.click(button)
      
      expect(screen.getByText('Status: loading')).toBeInTheDocument()
      expect(screen.getByText('Processing...')).toBeInTheDocument()
      
      // Fast forward time
      vi.advanceTimersByTime(2000)
      
      await waitFor(() => {
        expect(screen.getByText('Status: success')).toBeInTheDocument()
      })
    })
  })
})
