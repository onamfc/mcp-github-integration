# GitHub MCP API Client

A comprehensive TypeScript package for interacting with the GitHub API through an MCP (Model Context Protocol) server integration.

## Features

- Full TypeScript support with type definitions
- **129 MCP tools** covering all major GitHub API operations:
  - Repository management (create, update, delete, search, settings, administration)
  - Issue tracking (create, update, close, comments, search)
  - Pull request management (create, merge, review, comments)
  - Branch operations (create, delete, list, protect)
  - Commit operations (list, get, compare)
  - Release management (create, update, delete, assets)
  - Content operations (read, write, delete files)
  - GitHub Actions (workflows, runs, artifacts)
  - Webhooks (create, update, delete, deliveries, redelivery)
  - Collaborators and teams (add, remove, permissions)
  - Repository statistics and insights
  - Security settings (Dependabot, vulnerability alerts)
  - Advanced search across repositories, issues, PRs, code, commits, users, topics, and labels
- Built-in logging with `@onamfc/developer-log`
- Package inspection with `@onamfc/pkg-inspect`
- Robust error handling

## Installation

```bash
npm install
npm run build
```

## Configuration

Set your GitHub personal access token as an environment variable:

```bash
export GITHUB_TOKEN=your_github_token_here
```

## Usage

### Using the MCP Server

```typescript
import { MCPServer } from '@github-mcp/api-client';

const server = new MCPServer(process.env.GITHUB_TOKEN);

// Get authenticated user
const response = await server.handleRequest({
  method: 'github_get_authenticated_user',
  params: {},
});

if (response.success) {
  console.log('User:', response.data);
}

// Search repositories
const searchResponse = await server.handleRequest({
  method: 'github_search_repositories',
  params: {
    q: 'typescript',
    per_page: 10,
  },
});
```

### Using the GitHub Client Directly

```typescript
import { GitHubClient } from '@github-mcp/api-client';

const client = new GitHubClient({
  token: process.env.GITHUB_TOKEN,
});

// Create a new repository
const newRepo = await client.createRepository({
  name: 'my-awesome-project',
  description: 'My awesome project description',
  private: false,
  auto_init: true,
});

// Get repository information
const repo = await client.getRepository('owner', 'repo-name');
console.log(repo);

// Create an issue
const issue = await client.createIssue({
  owner: 'owner',
  repo: 'repo-name',
  title: 'Bug Report',
  body: 'Description of the bug',
  labels: ['bug'],
});

// List pull requests
const prs = await client.listPullRequests({
  owner: 'owner',
  repo: 'repo-name',
  state: 'open',
});
```

## Available GitHub API Operations

### Repository Operations (25 endpoints)

- `github_get_repository` - Get repository information
- `github_list_repositories` - List user's public repositories
- `github_create_repository` - Create a new repository
- `github_delete_repository` - Delete a repository
- `github_update_repository` - Update repository settings and configuration
- `github_get_repository_topics` - Get repository topics/tags
- `github_replace_repository_topics` - Set repository topics for discoverability
- `github_get_repository_languages` - Get programming languages used
- `github_get_code_frequency_stats` - Get weekly addition/deletion statistics
- `github_get_contributors_stats` - Get contributor activity statistics
- `github_get_participation_stats` - Get weekly commit count statistics
- `github_transfer_repository` - Transfer repository to new owner
- `github_list_repository_teams` - List teams with access to repository
- `github_check_team_permission` - Check team permission for repository
- `github_add_repository_team` - Add or update team access to repository
- `github_remove_repository_team` - Remove team access from repository
- `github_enable_automated_security_fixes` - Enable Dependabot automated security fixes
- `github_disable_automated_security_fixes` - Disable automated security fixes
- `github_enable_vulnerability_alerts` - Enable Dependabot vulnerability alerts
- `github_disable_vulnerability_alerts` - Disable vulnerability alerts

### Collaborator Management (7 endpoints)

- `github_list_collaborators` - List repository collaborators
- `github_check_collaborator` - Check if user is a collaborator
- `github_add_collaborator` - Add collaborator to repository
- `github_remove_collaborator` - Remove collaborator from repository
- `github_get_collaborator_permission` - Get collaborator permission level
- `github_list_repository_invitations` - List pending repository invitations
- `github_delete_repository_invitation` - Delete/cancel a repository invitation

### Issue Operations (9 endpoints)

- `github_create_issue` - Create a new issue
- `github_list_issues` - List issues in a repository
- `github_get_issue` - Get a specific issue
- `github_update_issue` - Update an existing issue
- `github_close_issue` - Close an issue
- `github_create_issue_comment` - Add a comment to an issue
- `github_list_issue_comments` - List comments on an issue
- `github_update_issue_comment` - Update an issue comment
- `github_delete_issue_comment` - Delete an issue comment

### Pull Request Operations (4 endpoints)

- `github_create_pull_request` - Create a new pull request
- `github_list_pull_requests` - List pull requests in a repository
- `github_get_pull_request` - Get a specific pull request
- `github_merge_pull_request` - Merge a pull request

### Branch Operations (5 endpoints)

- `github_list_branches` - List all branches in a repository
- `github_get_branch` - Get information about a specific branch
- `github_create_branch` - Create a new branch
- `github_delete_branch` - Delete a branch
- `github_get_branch_protection` - Get branch protection rules

### Commit Operations (3 endpoints)

- `github_list_commits` - List commits in a repository
- `github_get_commit` - Get a specific commit
- `github_compare_commits` - Compare two commits or branches

### Release Operations (6 endpoints)

- `github_list_releases` - List all releases
- `github_get_latest_release` - Get the latest release
- `github_get_release` - Get a specific release by ID
- `github_create_release` - Create a new release
- `github_update_release` - Update a release
- `github_delete_release` - Delete a release

### Content Operations (5 endpoints)

- `github_get_file_content` - Get contents of a file
- `github_create_file` - Create a file
- `github_update_file` - Update a file
- `github_delete_file` - Delete a file
- `github_get_directory_content` - Get contents of a directory

### GitHub Actions (9 endpoints)

- `github_list_workflows` - List all workflows
- `github_get_workflow` - Get a specific workflow
- `github_list_workflow_runs` - List workflow runs
- `github_get_workflow_run` - Get a specific workflow run
- `github_cancel_workflow_run` - Cancel a workflow run
- `github_rerun_workflow` - Re-run a workflow
- `github_delete_workflow_run` - Delete a workflow run
- `github_list_workflow_run_artifacts` - List artifacts for a workflow run
- `github_download_artifact` - Download a workflow artifact

### Webhook Operations (11 endpoints)

- `github_list_webhooks` - List all webhooks for a repository
- `github_get_webhook` - Get a specific webhook by ID
- `github_create_webhook` - Create a new webhook
- `github_update_webhook` - Update an existing webhook
- `github_delete_webhook` - Delete a webhook
- `github_ping_webhook` - Trigger a ping event to webhook
- `github_test_webhook` - Trigger a test push event to webhook
- `github_list_webhook_deliveries` - List deliveries for a webhook
- `github_get_webhook_delivery` - Get a specific webhook delivery
- `github_redeliver_webhook` - Redeliver a webhook delivery

### Search Operations (8 endpoints)

- `github_search_repositories` - Search for repositories
- `github_search_issues` - Search for issues and pull requests
- `github_search_code` - Search code across repositories
- `github_search_commits` - Search commits
- `github_search_users` - Search for users
- `github_search_topics` - Search for topics
- `github_search_labels` - Search for labels in a repository

### User Operations (1 endpoint)

- `github_get_authenticated_user` - Get authenticated user information

## Common Use Cases

### Repository Automation

Create and configure repositories programmatically:

```typescript
// Create repository with full configuration
await server.handleRequest({
  method: 'github_create_repository',
  params: {
    name: 'my-project',
    description: 'My awesome project',
    private: false,
    auto_init: true,
    gitignore_template: 'Node',
    license_template: 'mit',
  },
});

// Update repository settings
await server.handleRequest({
  method: 'github_update_repository',
  params: {
    owner: 'myorg',
    repo: 'my-project',
    has_issues: true,
    has_wiki: false,
    allow_squash_merge: true,
    delete_branch_on_merge: true,
  },
});

// Add topics for discoverability
await server.handleRequest({
  method: 'github_replace_repository_topics',
  params: {
    owner: 'myorg',
    repo: 'my-project',
    topics: ['javascript', 'api', 'automation'],
  },
});
```

### Team & Access Management

Manage collaborators and permissions:

```typescript
// Add collaborator
await server.handleRequest({
  method: 'github_add_collaborator',
  params: {
    owner: 'myorg',
    repo: 'my-project',
    username: 'developer123',
    permission: 'push',
  },
});

// Add team access
await server.handleRequest({
  method: 'github_add_repository_team',
  params: {
    owner: 'myorg',
    repo: 'my-project',
    team_slug: 'backend-team',
    permission: 'admin',
  },
});
```

### CI/CD Integration

Automate workflows and deployments:

```typescript
// List workflow runs
await server.handleRequest({
  method: 'github_list_workflow_runs',
  params: {
    owner: 'myorg',
    repo: 'my-project',
    workflow_id: 'deploy.yml',
  },
});

// Re-run failed workflow
await server.handleRequest({
  method: 'github_rerun_workflow',
  params: {
    owner: 'myorg',
    repo: 'my-project',
    run_id: 123456,
  },
});

// Download build artifacts
await server.handleRequest({
  method: 'github_download_artifact',
  params: {
    owner: 'myorg',
    repo: 'my-project',
    artifact_id: 789012,
  },
});
```

### Webhook Management

Set up event-driven integrations:

```typescript
// Create webhook
await server.handleRequest({
  method: 'github_create_webhook',
  params: {
    owner: 'myorg',
    repo: 'my-project',
    config: {
      url: 'https://myapp.com/webhooks',
      content_type: 'json',
      secret: 'my-secret-key',
    },
    events: ['push', 'pull_request', 'issues'],
    active: true,
  },
});

// List webhook deliveries
await server.handleRequest({
  method: 'github_list_webhook_deliveries',
  params: {
    owner: 'myorg',
    repo: 'my-project',
    hook_id: 12345,
  },
});

// Redeliver failed webhook
await server.handleRequest({
  method: 'github_redeliver_webhook',
  params: {
    owner: 'myorg',
    repo: 'my-project',
    hook_id: 12345,
    delivery_id: 67890,
  },
});
```

### Release Management

Automate release workflows:

```typescript
// Create release
await server.handleRequest({
  method: 'github_create_release',
  params: {
    owner: 'myorg',
    repo: 'my-project',
    tag_name: 'v1.0.0',
    name: 'Version 1.0.0',
    body: 'Release notes here',
    draft: false,
    prerelease: false,
  },
});

// Get latest release
await server.handleRequest({
  method: 'github_get_latest_release',
  params: {
    owner: 'myorg',
    repo: 'my-project',
  },
});
```

## Examples

A working example demonstrating the client's capabilities is provided in `examples/basic-usage.ts`:

### Basic Usage Example

Demonstrates all core operations:
- Getting repository information
- Listing issues and pull requests
- Listing branches and commits
- Getting authenticated user information

**Run the example:**
```bash
# Using default repository (octocat/Hello-World)
GITHUB_TOKEN=your_token npm run example:basic

# Using your own repository
GITHUB_TOKEN=your_token REPO_OWNER=owner REPO_NAME=repo npm run example:basic
```

**Note:** The `examples/` directory also contains advanced examples (setup-new-repo, pr-automation, webhook-handler, ci-cd-integration, repository-insights) that demonstrate more complex automation workflows. These are provided as reference implementations and may require additional client methods to be fully functional. See [`examples/README.md`](./examples/README.md) for details.

## MCP Request/Response Format

### Request Format

```typescript
{
  method: string,        // The tool/method name
  params: {              // Parameters for the method
    [key: string]: any
  }
}
```

### Response Format

```typescript
{
  success: boolean,      // Whether the request succeeded
  data?: any,            // Response data (if successful)
  error?: {              // Error information (if failed)
    code: string,
    message: string,
    details?: any
  }
}
```

## Important Notes

### GitHub Token Requirements

- A GitHub personal access token is required
- Generate one at: https://github.com/settings/tokens
- Required scopes depend on operations:
  - `repo` - Full repository access (for private repos)
  - `public_repo` - Public repository access only
  - `read:user` - Read user profile data
  - `user:email` - Read user email addresses
  - `admin:repo_hook` - Full control of repository hooks (webhooks)
  - `admin:org` - Full control of organization settings (for team operations)
  - `workflow` - Update GitHub Actions workflows

### Rate Limiting

GitHub API has rate limits:

- **Authenticated requests**: 5,000 requests per hour
- **Unauthenticated requests**: 60 requests per hour
- Check rate limit status in response headers
- The client will throw an error if rate limited

### Error Handling

All methods throw `GitHubAPIError` on failure:

```typescript
try {
  const repo = await client.getRepository('owner', 'repo');
} catch (error) {
  if (error instanceof GitHubAPIError) {
    console.error(`Error ${error.code}: ${error.message}`);
    console.error('Status:', error.statusCode);
  }
}
```

### Security Best Practices

- Never commit your GitHub token to version control
- Use environment variables for tokens
- Rotate tokens regularly
- Use minimal required scopes for your token
- Consider using GitHub Apps for production applications
- Always use webhook secrets for signature verification
- Enable Dependabot security alerts on repositories

## API Documentation

For detailed GitHub API documentation, visit:

- [GitHub REST API Documentation](https://docs.github.com/en/rest)
- [Octokit.js Documentation](https://octokit.github.io/rest.js/)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.
