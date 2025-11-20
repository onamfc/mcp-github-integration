import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GitHubClient } from './client.js';
import { GitHubAPIError } from '../utils/error-handler.js';

vi.mock('@octokit/rest', () => ({
  Octokit: class {
    repos = {
      get: vi.fn(),
      listForUser: vi.fn(),
      createForAuthenticatedUser: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
      listBranches: vi.fn(),
      getBranch: vi.fn(),
    };
    issues = {
      create: vi.fn(),
      listForRepo: vi.fn(),
      get: vi.fn(),
      update: vi.fn(),
      createComment: vi.fn(),
      listComments: vi.fn(),
    };
    pulls = {
      create: vi.fn(),
      list: vi.fn(),
      get: vi.fn(),
      merge: vi.fn(),
    };
    users = {
      getAuthenticated: vi.fn(),
    };
    search = {
      repos: vi.fn(),
      code: vi.fn(),
      issuesAndPullRequests: vi.fn(),
    };
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

describe('GitHubClient', () => {
  let client: GitHubClient;

  beforeEach(() => {
    vi.clearAllMocks();
    client = new GitHubClient({ token: 'test-token' });
  });

  describe('constructor', () => {
    it('should create a client with token', () => {
      expect(client).toBeInstanceOf(GitHubClient);
    });

    it('should create a client with custom base URL', () => {
      const customClient = new GitHubClient({
        token: 'test-token',
        baseUrl: 'https://github.enterprise.com/api/v3',
      });
      expect(customClient).toBeInstanceOf(GitHubClient);
    });
  });

  describe('getRepository', () => {
    it('should fetch repository information', async () => {
      const mockRepo = {
        id: 1,
        name: 'test-repo',
        full_name: 'owner/test-repo',
        private: false,
      };

      const mockOctokit = (client as any).octokit;
      mockOctokit.repos.get.mockResolvedValue({ data: mockRepo });

      const result = await client.getRepository('owner', 'test-repo');

      expect(result).toEqual(mockRepo);
      expect(mockOctokit.repos.get).toHaveBeenCalledWith({
        owner: 'owner',
        repo: 'test-repo',
      });
    });

    it('should throw GitHubAPIError on failure', async () => {
      const mockOctokit = (client as any).octokit;
      const apiError = {
        status: 404,
        message: 'Not Found',
      };
      mockOctokit.repos.get.mockRejectedValue(apiError);

      await expect(client.getRepository('owner', 'test-repo')).rejects.toThrow(GitHubAPIError);
    });
  });

  describe('listRepositories', () => {
    it('should list repositories for a user', async () => {
      const mockRepos = [
        { id: 1, name: 'repo1' },
        { id: 2, name: 'repo2' },
      ];

      const mockOctokit = (client as any).octokit;
      mockOctokit.repos.listForUser.mockResolvedValue({ data: mockRepos });

      const result = await client.listRepositories('testuser');

      expect(result).toEqual(mockRepos);
      expect(mockOctokit.repos.listForUser).toHaveBeenCalledWith({
        username: 'testuser',
        per_page: 100,
      });
    });
  });

  describe('createRepository', () => {
    it('should create a new repository', async () => {
      const mockRepo = {
        id: 1,
        name: 'new-repo',
        full_name: 'owner/new-repo',
      };

      const mockOctokit = (client as any).octokit;
      mockOctokit.repos.createForAuthenticatedUser.mockResolvedValue({ data: mockRepo });

      const result = await client.createRepository({
        name: 'new-repo',
        description: 'Test repository',
        private: false,
        auto_init: true,
      });

      expect(result).toEqual(mockRepo);
      expect(mockOctokit.repos.createForAuthenticatedUser).toHaveBeenCalledWith({
        name: 'new-repo',
        description: 'Test repository',
        private: false,
        auto_init: true,
        gitignore_template: undefined,
        license_template: undefined,
        homepage: undefined,
        has_issues: undefined,
        has_projects: undefined,
        has_wiki: undefined,
      });
    });
  });

  describe('deleteRepository', () => {
    it('should delete a repository', async () => {
      const mockOctokit = (client as any).octokit;
      mockOctokit.repos.delete.mockResolvedValue({});

      await client.deleteRepository('owner', 'test-repo');

      expect(mockOctokit.repos.delete).toHaveBeenCalledWith({
        owner: 'owner',
        repo: 'test-repo',
      });
    });
  });

  describe('createIssue', () => {
    it('should create an issue', async () => {
      const mockIssue = {
        id: 1,
        number: 1,
        title: 'Test issue',
        body: 'Test body',
        state: 'open',
      };

      const mockOctokit = (client as any).octokit;
      mockOctokit.issues.create.mockResolvedValue({ data: mockIssue });

      const result = await client.createIssue({
        owner: 'owner',
        repo: 'repo',
        title: 'Test issue',
        body: 'Test body',
        labels: ['bug'],
      });

      expect(result).toEqual(mockIssue);
      expect(mockOctokit.issues.create).toHaveBeenCalledWith({
        owner: 'owner',
        repo: 'repo',
        title: 'Test issue',
        body: 'Test body',
        labels: ['bug'],
        assignees: undefined,
      });
    });
  });

  describe('listIssues', () => {
    it('should list issues for a repository', async () => {
      const mockIssues = [
        { id: 1, number: 1, title: 'Issue 1' },
        { id: 2, number: 2, title: 'Issue 2' },
      ];

      const mockOctokit = (client as any).octokit;
      mockOctokit.issues.listForRepo.mockResolvedValue({ data: mockIssues });

      const result = await client.listIssues({
        owner: 'owner',
        repo: 'repo',
        state: 'open',
      });

      expect(result).toEqual(mockIssues);
      expect(mockOctokit.issues.listForRepo).toHaveBeenCalledWith({
        owner: 'owner',
        repo: 'repo',
        state: 'open',
        labels: undefined,
        sort: undefined,
        direction: undefined,
        per_page: 30,
        page: 1,
      });
    });
  });

  describe('createPullRequest', () => {
    it('should create a pull request', async () => {
      const mockPR = {
        id: 1,
        number: 1,
        title: 'Test PR',
        state: 'open',
      };

      const mockOctokit = (client as any).octokit;
      mockOctokit.pulls.create.mockResolvedValue({ data: mockPR });

      const result = await client.createPullRequest({
        owner: 'owner',
        repo: 'repo',
        title: 'Test PR',
        body: 'Test description',
        head: 'feature-branch',
        base: 'main',
      });

      expect(result).toEqual(mockPR);
      expect(mockOctokit.pulls.create).toHaveBeenCalledWith({
        owner: 'owner',
        repo: 'repo',
        title: 'Test PR',
        body: 'Test description',
        head: 'feature-branch',
        base: 'main',
      });
    });
  });

  describe('getAuthenticatedUser', () => {
    it('should get authenticated user information', async () => {
      const mockUser = {
        login: 'testuser',
        id: 1,
        name: 'Test User',
      };

      const mockOctokit = (client as any).octokit;
      mockOctokit.users.getAuthenticated.mockResolvedValue({ data: mockUser });

      const result = await client.getAuthenticatedUser();

      expect(result).toEqual(mockUser);
      expect(mockOctokit.users.getAuthenticated).toHaveBeenCalled();
    });
  });

  describe('searchRepositories', () => {
    it('should search repositories', async () => {
      const mockResults = {
        total_count: 1,
        incomplete_results: false,
        items: [{ id: 1, name: 'test-repo' }],
      };

      const mockOctokit = (client as any).octokit;
      mockOctokit.search.repos.mockResolvedValue({ data: mockResults });

      const result = await client.searchRepositories({
        q: 'typescript',
        sort: 'stars',
        order: 'desc',
      });

      expect(result).toEqual(mockResults);
      expect(mockOctokit.search.repos).toHaveBeenCalledWith({
        q: 'typescript',
        sort: 'stars',
        order: 'desc',
        per_page: undefined,
        page: undefined,
      });
    });
  });

  describe('listBranches', () => {
    it('should list branches for a repository', async () => {
      const mockBranches = [
        { name: 'main', commit: { sha: 'abc123' } },
        { name: 'develop', commit: { sha: 'def456' } },
      ];

      const mockOctokit = (client as any).octokit;
      mockOctokit.repos.listBranches.mockResolvedValue({ data: mockBranches });

      const result = await client.listBranches('owner', 'repo');

      expect(result).toEqual(mockBranches);
      expect(mockOctokit.repos.listBranches).toHaveBeenCalledWith({
        owner: 'owner',
        repo: 'repo',
        per_page: 100,
        page: 1,
      });
    });
  });

  describe('updateRepository', () => {
    it('should update repository settings', async () => {
      const mockRepo = {
        id: 1,
        name: 'updated-repo',
        description: 'Updated description',
      };

      const mockOctokit = (client as any).octokit;
      mockOctokit.repos.update.mockResolvedValue({ data: mockRepo });

      const result = await client.updateRepository({
        owner: 'owner',
        repo: 'repo',
        description: 'Updated description',
        has_issues: true,
      });

      expect(result).toEqual(mockRepo);
    });
  });
});
