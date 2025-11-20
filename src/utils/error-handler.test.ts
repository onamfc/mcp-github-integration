import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GitHubAPIError, handleError } from './error-handler.js';

vi.mock('./logger.js', () => ({
  Logger: class {
    error = vi.fn();
    info = vi.fn();
    warn = vi.fn();
    debug = vi.fn();
  },
}));

describe('GitHubAPIError', () => {
  it('should create an error with message and code', () => {
    const error = new GitHubAPIError('Test error', 'TEST_CODE');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(GitHubAPIError);
    expect(error.message).toBe('Test error');
    expect(error.code).toBe('TEST_CODE');
    expect(error.name).toBe('GitHubAPIError');
    expect(error.statusCode).toBeUndefined();
    expect(error.details).toBeUndefined();
  });

  it('should create an error with status code', () => {
    const error = new GitHubAPIError('Not found', 'NOT_FOUND', 404);

    expect(error.message).toBe('Not found');
    expect(error.code).toBe('NOT_FOUND');
    expect(error.statusCode).toBe(404);
  });

  it('should create an error with details', () => {
    const details = { field: 'value', nested: { data: 'test' } };
    const error = new GitHubAPIError('Validation error', 'VALIDATION_ERROR', 422, details);

    expect(error.details).toEqual(details);
  });
});

describe('handleError', () => {
  it('should return the same error if already a GitHubAPIError', () => {
    const originalError = new GitHubAPIError('Original error', 'ORIGINAL_CODE', 500);
    const result = handleError(originalError);

    expect(result).toBe(originalError);
  });

  it('should convert error with status to GitHubAPIError', () => {
    const apiError = {
      status: 404,
      message: 'Resource not found',
      response: {
        data: { error: 'Not found' },
      },
    };

    const result = handleError(apiError);

    expect(result).toBeInstanceOf(GitHubAPIError);
    expect(result.message).toBe('Resource not found');
    expect(result.code).toBe('HTTP_404');
    expect(result.statusCode).toBe(404);
    expect(result.details).toEqual({ error: 'Not found' });
  });

  it('should handle error without message', () => {
    const apiError = {
      status: 500,
    };

    const result = handleError(apiError);

    expect(result.message).toBe('GitHub API request failed');
    expect(result.code).toBe('HTTP_500');
    expect(result.statusCode).toBe(500);
  });

  it('should handle unknown errors', () => {
    const unknownError = new Error('Something went wrong');

    const result = handleError(unknownError);

    expect(result).toBeInstanceOf(GitHubAPIError);
    expect(result.message).toBe('Something went wrong');
    expect(result.code).toBe('UNKNOWN_ERROR');
    expect(result.statusCode).toBeUndefined();
    expect(result.details).toBe(unknownError);
  });

  it('should handle error without message property', () => {
    const result = handleError({});

    expect(result.message).toBe('Unknown error occurred');
    expect(result.code).toBe('UNKNOWN_ERROR');
  });

  it('should handle rate limit errors', () => {
    const rateLimitError = {
      status: 403,
      message: 'API rate limit exceeded',
      response: {
        data: {
          message: 'API rate limit exceeded for user',
          documentation_url: 'https://docs.github.com/rest',
        },
      },
    };

    const result = handleError(rateLimitError);

    expect(result.code).toBe('HTTP_403');
    expect(result.statusCode).toBe(403);
    expect(result.message).toBe('API rate limit exceeded');
  });

  it('should handle authentication errors', () => {
    const authError = {
      status: 401,
      message: 'Bad credentials',
    };

    const result = handleError(authError);

    expect(result.code).toBe('HTTP_401');
    expect(result.statusCode).toBe(401);
  });
});
