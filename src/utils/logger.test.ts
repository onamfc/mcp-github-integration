import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Logger } from './logger.js';
import log from '@onamfc/developer-log';

vi.mock('@onamfc/developer-log', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

describe('Logger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create a logger with a context', () => {
      const logger = new Logger('TestContext');
      expect(logger).toBeInstanceOf(Logger);
    });
  });

  describe('info', () => {
    it('should log info message with context', () => {
      const logger = new Logger('TestContext');
      logger.info('Test message');

      expect(log.info).toHaveBeenCalledWith('[TestContext] Test message', undefined);
    });

    it('should log info message with data', () => {
      const logger = new Logger('TestContext');
      const data = { foo: 'bar' };
      logger.info('Test message', data);

      expect(log.info).toHaveBeenCalledWith('[TestContext] Test message', data);
    });
  });

  describe('error', () => {
    it('should log error message with context', () => {
      const logger = new Logger('ErrorContext');
      logger.error('Error occurred');

      expect(log.error).toHaveBeenCalledWith('[ErrorContext] Error occurred', undefined);
    });

    it('should log error message with error object', () => {
      const logger = new Logger('ErrorContext');
      const error = new Error('Test error');
      logger.error('Error occurred', error);

      expect(log.error).toHaveBeenCalledWith('[ErrorContext] Error occurred', error);
    });
  });

  describe('warn', () => {
    it('should log warning message with context', () => {
      const logger = new Logger('WarnContext');
      logger.warn('Warning message');

      expect(log.warn).toHaveBeenCalledWith('[WarnContext] Warning message', undefined);
    });

    it('should log warning message with data', () => {
      const logger = new Logger('WarnContext');
      const data = { warning: 'details' };
      logger.warn('Warning message', data);

      expect(log.warn).toHaveBeenCalledWith('[WarnContext] Warning message', data);
    });
  });

  describe('debug', () => {
    it('should log debug message with context', () => {
      const logger = new Logger('DebugContext');
      logger.debug('Debug message');

      expect(log.debug).toHaveBeenCalledWith('[DebugContext] Debug message', undefined);
    });

    it('should log debug message with data', () => {
      const logger = new Logger('DebugContext');
      const data = { debug: 'info' };
      logger.debug('Debug message', data);

      expect(log.debug).toHaveBeenCalledWith('[DebugContext] Debug message', data);
    });
  });

  describe('multiple contexts', () => {
    it('should maintain separate contexts for different loggers', () => {
      const logger1 = new Logger('Context1');
      const logger2 = new Logger('Context2');

      logger1.info('Message from logger 1');
      logger2.info('Message from logger 2');

      expect(log.info).toHaveBeenCalledWith('[Context1] Message from logger 1', undefined);
      expect(log.info).toHaveBeenCalledWith('[Context2] Message from logger 2', undefined);
    });
  });

  describe('special characters in messages', () => {
    it('should handle messages with special characters', () => {
      const logger = new Logger('SpecialContext');
      logger.info('Message with "quotes" and \'apostrophes\'');

      expect(log.info).toHaveBeenCalledWith(
        '[SpecialContext] Message with "quotes" and \'apostrophes\'',
        undefined
      );
    });

    it('should handle messages with newlines and tabs', () => {
      const logger = new Logger('SpecialContext');
      logger.info('Message\nwith\tnewlines\tand\ttabs');

      expect(log.info).toHaveBeenCalledWith(
        '[SpecialContext] Message\nwith\tnewlines\tand\ttabs',
        undefined
      );
    });
  });
});
