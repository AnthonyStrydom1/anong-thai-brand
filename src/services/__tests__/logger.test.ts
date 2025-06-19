
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logger, LogLevel } from '../logger';

// Mock console methods
const mockConsole = {
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  log: vi.fn()
};

// Mock sessionStorage
const mockSessionStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage
});

describe('Logger Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(console, mockConsole);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Basic Logging', () => {
    it('should log debug messages', () => {
      logger.debug('Debug message', { test: true });
      expect(console.debug).toHaveBeenCalled();
    });

    it('should log info messages', () => {
      logger.info('Info message', { test: true });
      expect(console.info).toHaveBeenCalled();
    });

    it('should log warning messages', () => {
      logger.warn('Warning message', { test: true });
      expect(console.warn).toHaveBeenCalled();
    });

    it('should log error messages', () => {
      const error = new Error('Test error');
      logger.error('Error message', error, { test: true });
      expect(console.error).toHaveBeenCalled();
    });

    it('should log critical messages', () => {
      const error = new Error('Critical error');
      logger.critical('Critical message', error, { test: true });
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('Performance Logging', () => {
    it('should log performance metrics', () => {
      logger.performance('test-operation', 150, { component: 'TestComponent' });
      expect(console.log).toHaveBeenCalled();
    });

    it('should include memory information when available', () => {
      logger.performance('memory-test', 200);
      expect(console.log).toHaveBeenCalled();
    });
  });

  describe('Configuration', () => {
    it('should respect minimum log level', () => {
      logger.setConfig({ minLevel: LogLevel.ERROR });
      
      logger.debug('Should not log');
      expect(console.debug).not.toHaveBeenCalled();
      
      logger.error('Should log', new Error('test'));
      expect(console.error).toHaveBeenCalled();
    });

    it('should update configuration dynamically', () => {
      logger.setConfig({ minLevel: LogLevel.CRITICAL });
      
      logger.error('Should not log');
      expect(console.error).not.toHaveBeenCalled();
      
      logger.critical('Should log', new Error('critical'));
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('Buffer Management', () => {
    it('should maintain log buffer', () => {
      logger.info('Test log entry');
      const buffer = logger.getBuffer();
      expect(buffer.length).toBeGreaterThan(0);
    });

    it('should clear buffer when requested', () => {
      logger.info('Test entry');
      logger.clearBuffer();
      const buffer = logger.getBuffer();
      expect(buffer.length).toBe(0);
    });
  });

  describe('Session Management', () => {
    it('should generate unique session ID', () => {
      const sessionId = logger.getSessionId();
      expect(sessionId).toBeTruthy();
      expect(typeof sessionId).toBe('string');
    });

    it('should maintain consistent session ID', () => {
      const sessionId1 = logger.getSessionId();
      const sessionId2 = logger.getSessionId();
      expect(sessionId1).toBe(sessionId2);
    });
  });
});
