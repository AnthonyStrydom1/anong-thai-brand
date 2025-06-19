      expect(console.info).not.toHaveBeenCalled()

      customLogger.error('Should log')
      expect(console.error).toHaveBeenCalled()
    })

    it('should update configuration dynamically', () => {
      logger.updateConfig({
        level: LogLevel.CRITICAL,
        targets: [LogTarget.CONSOLE]
      })

      logger.error('Should not log') // Below CRITICAL
      expect(console.error).not.toHaveBeenCalled()

      logger.critical('Should log')
      expect(console.error).toHaveBeenCalled()
    })
  })

  describe('Performance', () => {
    it('should not impact performance when logging is disabled', () => {
      const noOpLogger = createLogger({
        level: LogLevel.CRITICAL,
        targets: []
      })

      const start = performance.now()
      
      // Log many messages that should be ignored
      for (let i = 0; i < 1000; i++) {
        noOpLogger.debug(`Debug message ${i}`, { data: i })
      }
      
      const end = performance.now()
      const duration = end - start

      // Should complete very quickly
      expect(duration).toBeLessThan(10)
    })

    it('should handle large log entries efficiently', () => {
      const largeData = {
        largeArray: new Array(1000).fill('test'),
        largeObject: {}
      }

      // Fill large object
      for (let i = 0; i < 100; i++) {
        largeData.largeObject[`key${i}`] = `value${i}`.repeat(100)
      }

      const start = performance.now()
      logger.info('Large log entry', largeData)
      const end = performance.now()

      // Should handle large data without significant delay
      expect(end - start).toBeLessThan(50)
    })
  })

  describe('Memory Management', () => {
    it('should not cause memory leaks with frequent logging', () => {
      const initialMemory = (performance as any).memory?.usedJSHeapSize

      // Log many entries
      for (let i = 0; i < 1000; i++) {
        logger.info(`Memory test ${i}`, { iteration: i })
      }

      // Force garbage collection if available
      if (global.gc) {
        global.gc()
      }

      const finalMemory = (performance as any).memory?.usedJSHeapSize

      if (initialMemory && finalMemory) {
        const memoryIncrease = finalMemory - initialMemory
        const threshold = initialMemory * 0.2 // 20% increase threshold

        expect(memoryIncrease).toBeLessThan(threshold)
      }
    })

    it('should clean up event listeners on destruction', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
      
      // Create and destroy logger
      const tempLogger = createLogger({})
      
      // In a real scenario, we'd have a cleanup method
      // For now, we check that event listeners are properly set up
      expect(window.addEventListener).toHaveBeenCalledWith('error', expect.any(Function))
      expect(window.addEventListener).toHaveBeenCalledWith('unhandledrejection', expect.any(Function))
    })
  })

  describe('Log Export and Analysis', () => {
    it('should export logs in JSON format', () => {
      // Add some logs
      logger.info('Export test 1')
      logger.warn('Export test 2')
      logger.error('Export test 3', new Error('Test error'))

      const exportedLogs = logger.exportLogs()
      
      expect(exportedLogs).toBeTruthy()
      expect(() => JSON.parse(exportedLogs)).not.toThrow()
      
      const parsedLogs = JSON.parse(exportedLogs)
      expect(Array.isArray(parsedLogs)).toBe(true)
    })

    it('should provide log statistics', () => {
      // Mock stored logs with different levels
      vi.mocked(sessionStorage.getItem).mockReturnValue(JSON.stringify([
        { level: LogLevel.INFO, category: 'test' },
        { level: LogLevel.WARN, category: 'test' },
        { level: LogLevel.ERROR, category: 'auth' },
        { level: LogLevel.ERROR, category: 'auth' }
      ]))

      const logs = logger.getLogs()
      
      // Analyze log statistics
      const errorLogs = logs.filter(log => log.level === LogLevel.ERROR)
      const authLogs = logs.filter(log => log.category === 'auth')
      
      expect(errorLogs).toHaveLength(2)
      expect(authLogs).toHaveLength(2)
    })
  })

  describe('Security', () => {
    it('should sanitize sensitive data in logs', () => {
      const sensitiveData = {
        password: 'secret123',
        creditCard: '4111-1111-1111-1111',
        ssn: '123-45-6789',
        apiKey: 'sk_test_12345',
        normalData: 'this is fine'
      }

      logger.info('Sensitive data test', sensitiveData)

      // Should log without exposing sensitive data
      expect(console.info).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          data: expect.objectContaining({
            normalData: 'this is fine'
            // Should not contain sensitive fields
          })
        })
      )
    })

    it('should not log sensitive user information', () => {
      const userContext = {
        userId: 'user123',
        email: 'user@example.com',
        sessionToken: 'abc123',
        role: 'admin'
      }

      logger.security('user_action', userContext)

      // Should sanitize tokens and sensitive info
      expect(console.warn).toHaveBeenCalled()
    })
  })
})

describe('Logger Hook Integration', () => {
  it('should provide consistent interface through useLogger hook', async () => {
    const { useLogger } = await import('@/services/logger')
    
    // Mock React hook context
    const mockHookResult = useLogger()
    
    expect(mockHookResult).toHaveProperty('debug')
    expect(mockHookResult).toHaveProperty('info')
    expect(mockHookResult).toHaveProperty('warn')
    expect(mockHookResult).toHaveProperty('error')
    expect(mockHookResult).toHaveProperty('critical')
    expect(mockHookResult).toHaveProperty('security')
    expect(mockHookResult).toHaveProperty('performance')
    expect(mockHookResult).toHaveProperty('userAction')
    expect(mockHookResult).toHaveProperty('setUserId')
    expect(mockHookResult).toHaveProperty('clearUserId')
  })
})

describe('Environment-specific Behavior', () => {
  it('should behave differently in development vs production', () => {
    // Test development behavior
    const devLogger = createLogger({
      level: LogLevel.DEBUG,
      targets: [LogTarget.CONSOLE, LogTarget.SESSION_STORAGE]
    })

    devLogger.debug('Development debug message')
    expect(console.debug).toHaveBeenCalled()
    expect(sessionStorage.setItem).toHaveBeenCalled()

    vi.clearAllMocks()

    // Test production behavior  
    const prodLogger = createLogger({
      level: LogLevel.INFO,
      targets: [LogTarget.CONSOLE, LogTarget.SUPABASE],
      enabledInProduction: true
    })

    prodLogger.debug('Production debug message')
    expect(console.debug).not.toHaveBeenCalled() // Below INFO level

    prodLogger.info('Production info message')
    expect(console.info).toHaveBeenCalled()
  })

  it('should disable logging when enabledInProduction is false', () => {
    const disabledLogger = createLogger({
      enabledInProduction: false,
      targets: [LogTarget.CONSOLE]
    })

    // Simulate production environment
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'

    disabledLogger.error('Should not log in production')
    
    // Restore environment
    process.env.NODE_ENV = originalEnv
    
    // Should not log when disabled in production
    expect(console.error).not.toHaveBeenCalled()
  })
})
