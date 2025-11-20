import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MCPServer } from './server.js';
import { GitHubClient } from '../github/client.js';
import { tools } from './tools.js';

vi.mock('../github/client.js', () => ({
  GitHubClient: class {
    getRepository = vi.fn();
    listRepositories = vi.fn();
    createRepository = vi.fn();
    deleteRepository = vi.fn();
    createIssue = vi.fn();
    listIssues = vi.fn();
    getIssue = vi.fn();
    updateIssue = vi.fn();
    closeIssue = vi.fn();
    createPullRequest = vi.fn();
    listPullRequests = vi.fn();
    getPullRequest = vi.fn();
    mergePullRequest = vi.fn();
    getAuthenticatedUser = vi.fn();
    searchRepositories = vi.fn();
    updateRepository = vi.fn();
  },
}));

vi.mock('../utils/logger.js', () => ({
  Logger: class {
    info = vi.fn();
    error = vi.fn();
    warn = vi.fn();
    debug = vi.fn();
  },
}));

describe('MCPServer', () => {
  let server: MCPServer;
  let mockClient: any;

  beforeEach(() => {
    vi.clearAllMocks();
    server = new MCPServer('test-token');
    mockClient = (server as any).client;
  });

  describe('constructor', () => {
    it('should initialize with a GitHub token', () => {
      expect(server).toBeInstanceOf(MCPServer);
    });
  });

  describe('getTools', () => {
    it('should return all available tools', () => {
      const result = server.getTools();
      expect(result).toEqual(tools);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('handleRequest', () => {
    describe('github_get_repository', () => {
      it('should handle get repository request', async () => {
        const mockRepo = { id: 1, name: 'test-repo' };
        mockClient.getRepository.mockResolvedValue(mockRepo);

        const result = await server.handleRequest({
          method: 'github_get_repository',
          params: { owner: 'owner', repo: 'repo' },
        });

        expect(result.success).toBe(true);
        expect(result.data).toEqual(mockRepo);
        expect(mockClient.getRepository).toHaveBeenCalledWith('owner', 'repo');
      });
    });

    describe('github_list_repositories', () => {
      it('should handle list repositories request', async () => {
        const mockRepos = [{ id: 1, name: 'repo1' }];
        mockClient.listRepositories.mockResolvedValue(mockRepos);

        const result = await server.handleRequest({
          method: 'github_list_repositories',
          params: { username: 'testuser' },
        });

        expect(result.success).toBe(true);
        expect(result.data).toEqual(mockRepos);
        expect(mockClient.listRepositories).toHaveBeenCalledWith('testuser');
      });
    });

    describe('github_create_repository', () => {
      it('should handle create repository request', async () => {
        const mockRepo = { id: 1, name: 'new-repo' };
        mockClient.createRepository.mockResolvedValue(mockRepo);

        const result = await server.handleRequest({
          method: 'github_create_repository',
          params: {
            name: 'new-repo',
            description: 'Test repo',
            private: false,
          },
        });

        expect(result.success).toBe(true);
        expect(result.data).toEqual(mockRepo);
        expect(mockClient.createRepository).toHaveBeenCalledWith({
          name: 'new-repo',
          description: 'Test repo',
          private: false,
          auto_init: undefined,
          gitignore_template: undefined,
          license_template: undefined,
          homepage: undefined,
          has_issues: undefined,
          has_projects: undefined,
          has_wiki: undefined,
        });
      });
    });

    describe('github_create_issue', () => {
      it('should handle create issue request', async () => {
        const mockIssue = { id: 1, number: 1, title: 'Test issue' };
        mockClient.createIssue.mockResolvedValue(mockIssue);

        const result = await server.handleRequest({
          method: 'github_create_issue',
          params: {
            owner: 'owner',
            repo: 'repo',
            title: 'Test issue',
            body: 'Test body',
          },
        });

        expect(result.success).toBe(true);
        expect(result.data).toEqual(mockIssue);
      });
    });

    describe('github_create_pull_request', () => {
      it('should handle create pull request', async () => {
        const mockPR = { id: 1, number: 1, title: 'Test PR' };
        mockClient.createPullRequest.mockResolvedValue(mockPR);

        const result = await server.handleRequest({
          method: 'github_create_pull_request',
          params: {
            owner: 'owner',
            repo: 'repo',
            title: 'Test PR',
            head: 'feature',
            base: 'main',
          },
        });

        expect(result.success).toBe(true);
        expect(result.data).toEqual(mockPR);
      });
    });

    describe('github_get_authenticated_user', () => {
      it('should handle get authenticated user request', async () => {
        const mockUser = { login: 'testuser', id: 1 };
        mockClient.getAuthenticatedUser.mockResolvedValue(mockUser);

        const result = await server.handleRequest({
          method: 'github_get_authenticated_user',
          params: {},
        });

        expect(result.success).toBe(true);
        expect(result.data).toEqual(mockUser);
        expect(mockClient.getAuthenticatedUser).toHaveBeenCalled();
      });
    });

    describe('github_search_repositories', () => {
      it('should handle search repositories request', async () => {
        const mockResults = {
          total_count: 1,
          items: [{ id: 1, name: 'test-repo' }],
        };
        mockClient.searchRepositories.mockResolvedValue(mockResults);

        const result = await server.handleRequest({
          method: 'github_search_repositories',
          params: { q: 'typescript', sort: 'stars' },
        });

        expect(result.success).toBe(true);
        expect(result.data).toEqual(mockResults);
      });
    });

    describe('error handling', () => {
      it('should return error response for unknown method', async () => {
        const result = await server.handleRequest({
          method: 'unknown_method',
          params: {},
        });

        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
        expect(result.error?.code).toBe('METHOD_NOT_FOUND');
        expect(result.error?.message).toContain('unknown_method');
      });

      it('should handle client errors', async () => {
        const error = new Error('GitHub API error');
        (error as any).code = 'API_ERROR';
        mockClient.getRepository.mockRejectedValue(error);

        const result = await server.handleRequest({
          method: 'github_get_repository',
          params: { owner: 'owner', repo: 'repo' },
        });

        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
        expect(result.error?.code).toBe('API_ERROR');
        expect(result.error?.message).toBe('GitHub API error');
      });

      it('should handle errors without code', async () => {
        const error = new Error('Unknown error');
        mockClient.getRepository.mockRejectedValue(error);

        const result = await server.handleRequest({
          method: 'github_get_repository',
          params: { owner: 'owner', repo: 'repo' },
        });

        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
        expect(result.error?.code).toBe('INTERNAL_ERROR');
      });
    });

    describe('parameter passing', () => {
      it('should pass all parameters correctly to client methods', async () => {
        mockClient.listIssues.mockResolvedValue([]);

        await server.handleRequest({
          method: 'github_list_issues',
          params: {
            owner: 'owner',
            repo: 'repo',
            state: 'open',
            labels: ['bug', 'enhancement'],
            per_page: 50,
            page: 2,
          },
        });

        expect(mockClient.listIssues).toHaveBeenCalledWith({
          owner: 'owner',
          repo: 'repo',
          state: 'open',
          labels: ['bug', 'enhancement'],
          per_page: 50,
          page: 2,
        });
      });

      it('should handle optional parameters', async () => {
        mockClient.createRepository.mockResolvedValue({});

        await server.handleRequest({
          method: 'github_create_repository',
          params: {
            name: 'test-repo',
          },
        });

        expect(mockClient.createRepository).toHaveBeenCalledWith({
          name: 'test-repo',
          description: undefined,
          private: undefined,
          auto_init: undefined,
          gitignore_template: undefined,
          license_template: undefined,
          homepage: undefined,
          has_issues: undefined,
          has_projects: undefined,
          has_wiki: undefined,
        });
      });
    });

    describe('update repository', () => {
      it('should handle update repository request', async () => {
        const mockRepo = { id: 1, name: 'updated-repo' };
        mockClient.updateRepository.mockResolvedValue(mockRepo);

        const result = await server.handleRequest({
          method: 'github_update_repository',
          params: {
            owner: 'owner',
            repo: 'repo',
            description: 'Updated description',
            has_issues: true,
          },
        });

        expect(result.success).toBe(true);
        expect(result.data).toEqual(mockRepo);
        expect(mockClient.updateRepository).toHaveBeenCalledWith({
          owner: 'owner',
          repo: 'repo',
          description: 'Updated description',
          has_issues: true,
        });
      });
    });
  });
});
