
import { useContext } from 'react';
import { AuthContext } from './auth/AuthProvider';

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Instead of throwing an error immediately, return null
    // This allows components to handle missing context gracefully
    console.warn('useAuth called outside of AuthProvider context');
    return null;
  }
  return context;
}

// Re-export the AuthProvider for convenience
export { AuthProvider } from './auth/AuthProvider';
