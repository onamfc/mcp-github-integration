import { Logger } from './logger.js';

const logger = new Logger('ErrorHandler');

export class GitHubAPIError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'GitHubAPIError';
  }
}

export function handleError(error: any): GitHubAPIError {
  logger.error('API Error occurred', error);

  if (error instanceof GitHubAPIError) {
    return error;
  }

  if (error.status) {
    return new GitHubAPIError(
      error.message || 'GitHub API request failed',
      `HTTP_${error.status}`,
      error.status,
      error.response?.data
    );
  }

  return new GitHubAPIError(
    error.message || 'Unknown error occurred',
    'UNKNOWN_ERROR',
    undefined,
    error
  );
}
