/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  
  // Vite configuration for build
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  // Vitest configuration for testing
  test: {
    // Test environment
    environment: 'jsdom',
    
    // Global test setup
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        'src/main.tsx',
        'src/vite-env.d.ts',
        'postcss.config.js',
        'tailwind.config.ts',
        'vite.config.ts'
      ],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70
        },
        // Higher thresholds for critical error handling code
        'src/components/ErrorBoundary.tsx': {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90
        },
        'src/services/logger.ts': {
          branches: 85,
          functions: 85,
          lines: 85,
          statements: 85
        },
        'src/utils/errorHandlers.ts': {
          branches: 85,
          functions: 85,
          lines: 85,
          statements: 85
        }
      }
    },
    
    // Include and exclude patterns
    include: [
      'src/**/*.{test,spec}.{js,ts,jsx,tsx}'
    ],
    exclude: [
      'node_modules/',
      'dist/',
      '.git/',
      '.cache/',
      'e2e/'
    ],
    
    // Test timeouts
    testTimeout: 10000,
    hookTimeout: 10000,
    
    // Reporter configuration
    reporter: ['verbose', 'html'],
    outputFile: {
      html: './coverage/test-results.html'
    },
    
    // Mock configuration
    deps: {
      // External dependencies that need special handling
      external: []
    },
    
    // Environment variables for testing
    env: {
      NODE_ENV: 'test',
      VITE_SUPABASE_URL: 'http://localhost:54321',
      VITE_SUPABASE_ANON_KEY: 'test-anon-key'
    }
  }
})
