# GitHub MCP API Client - Examples

This directory contains practical, real-world examples demonstrating how to use the GitHub MCP API Client for common automation tasks.

## Available Examples

### 1. Setup New Repository (`setup-new-repo.ts`)

Automates the complete setup of a new GitHub repository with best practices:

- Creates a new repository with proper configuration
- Adds repository topics for discoverability
- Creates an initial issue for tracking setup tasks
- Enables security features (Dependabot alerts & automated fixes)
- Creates custom labels for issue management
- Demonstrates proper error handling

**Usage:**
```bash
GITHUB_TOKEN=your_token npm run example:setup-repo
```

**What it does:**
1. Creates a new public repository with MIT license and Node gitignore
2. Configures repository settings (issues, projects, wiki)
3. Adds relevant topics for searchability
4. Creates a setup tracking issue
5. Enables Dependabot security features
6. Creates priority and workflow labels

---

### 2. Pull Request Automation (`pr-automation.ts`)

Automates pull request reviews and management:

- Lists all open pull requests
- Analyzes PR characteristics (size, tests, documentation)
- Auto-approves PRs that meet quality criteria
- Requests tests for PRs missing them
- Optionally auto-merges approved PRs
- Provides detailed metrics for each PR

**Usage:**
```bash
GITHUB_TOKEN=your_token \
REPO_OWNER=owner \
REPO_NAME=repo \
AUTO_MERGE=true \
npm run example:pr-automation
```

**Environment Variables:**
- `GITHUB_TOKEN` (required) - Your GitHub personal access token
- `REPO_OWNER` (required) - Repository owner username or organization
- `REPO_NAME` (required) - Repository name
- `AUTO_MERGE` (optional) - Set to `true` to enable auto-merge for approved PRs

**Auto-approval criteria:**
- Tests are included
- PR size < 500 lines changed
- No changes requested in reviews
- PR author is not the repository owner

---

### 3. Webhook Handler (`webhook-handler.ts`)

A complete HTTP server for handling GitHub webhooks:

- Verifies webhook signatures for security
- Handles multiple event types (push, pull_request, issues, workflow_run)
- Automatically labels new issues
- Adds welcome comments to new PRs
- Cleans up merged PR branches
- Creates issues for CI failures

**Usage:**
```bash
GITHUB_TOKEN=your_token \
WEBHOOK_SECRET=your_webhook_secret \
PORT=3000 \
npm run example:webhook
```

**Environment Variables:**
- `GITHUB_TOKEN` (required) - Your GitHub personal access token
- `WEBHOOK_SECRET` (optional) - Webhook secret for signature verification
- `PORT` (optional) - Server port (default: 3000)

**Supported Events:**
- `push` - Logs commit information
- `pull_request` - Adds welcome comments, cleans up branches
- `issues` - Auto-labels based on title/body content
- `workflow_run` - Creates issues for CI failures

**Setting up webhooks:**
1. Start the webhook handler locally or deploy to a server
2. Use a tunnel service (ngrok) if testing locally
3. Go to your repository settings → Webhooks
4. Add webhook URL (e.g., `https://your-domain.com/`)
5. Select events: Push, Pull requests, Issues, Workflow runs
6. Add webhook secret (if using)

---

### 4. CI/CD Integration (`ci-cd-integration.ts`)

Manages GitHub Actions workflows and CI/CD pipelines:

- Lists all workflows in a repository
- Shows recent workflow runs with status
- Calculates success rates and durations
- Optionally cancels in-progress runs
- Optionally retries failed runs
- Lists workflow artifacts
- Manages repository secrets
- Can trigger workflows programmatically

**Usage:**
```bash
GITHUB_TOKEN=your_token \
REPO_OWNER=owner \
REPO_NAME=repo \
CANCEL_IN_PROGRESS=true \
RETRY_FAILED=true \
npm run example:ci-cd
```

**Environment Variables:**
- `GITHUB_TOKEN` (required) - Your GitHub personal access token
- `REPO_OWNER` (required) - Repository owner
- `REPO_NAME` (required) - Repository name
- `CANCEL_IN_PROGRESS` (optional) - Cancel running workflows
- `RETRY_FAILED` (optional) - Retry failed workflows

**Triggering workflows:**
```bash
GITHUB_TOKEN=your_token \
REPO_OWNER=owner \
REPO_NAME=repo \
WORKFLOW_ID=deploy.yml \
REF=main \
ENVIRONMENT=production \
npm run example:ci-cd trigger
```

---

### 5. Repository Insights (`repository-insights.ts`)

Generates comprehensive repository analytics and reports:

- Repository overview (stars, forks, size, topics)
- Programming language breakdown
- Contributor statistics
- Commit activity analysis
- Pull request metrics (merge times, open/closed counts)
- Issue metrics (resolution times, label distribution)
- Recent activity summary
- Release information

**Usage:**
```bash
GITHUB_TOKEN=your_token \
REPO_OWNER=owner \
REPO_NAME=repo \
npm run example:insights
```

**Output includes:**
- Top contributors with commit counts and line changes
- Language distribution with percentages
- Average PR merge time
- Average issue resolution time
- Top issue labels
- Recent commits and releases

---

## Running Examples

### Prerequisites

1. **GitHub Personal Access Token**
   - Create at: https://github.com/settings/tokens
   - Required scopes depend on operations:
     - `repo` - Full repository access
     - `workflow` - Manage GitHub Actions
     - `admin:repo_hook` - Manage webhooks
     - `admin:org` - For organization operations

2. **Build the project**
   ```bash
   npm install
   npm run build
   ```

3. **Set environment variables**
   ```bash
   export GITHUB_TOKEN=your_token_here
   export REPO_OWNER=your_username
   export REPO_NAME=your_repo
   ```

### Quick Start Scripts

Add these to your `package.json`:

```json
{
  "scripts": {
    "example:setup-repo": "node dist/examples/setup-new-repo.js",
    "example:pr-automation": "node dist/examples/pr-automation.js",
    "example:webhook": "node dist/examples/webhook-handler.js",
    "example:ci-cd": "node dist/examples/ci-cd-integration.js",
    "example:insights": "node dist/examples/repository-insights.js"
  }
}
```

## Best Practices

### Security

1. **Never commit tokens**
   - Use environment variables
   - Add `.env` to `.gitignore`

2. **Verify webhook signatures**
   - Always use `WEBHOOK_SECRET` in production
   - The webhook handler validates signatures automatically

3. **Use minimal token scopes**
   - Only request permissions you need
   - Rotate tokens regularly

### Rate Limiting

GitHub has API rate limits:
- **Authenticated**: 5,000 requests/hour
- **Unauthenticated**: 60 requests/hour

Tips:
- Use conditional requests with ETags
- Cache responses when possible
- Implement exponential backoff on errors

### Error Handling

All examples include comprehensive error handling:
- HTTP status codes are checked
- Errors are logged with context
- Graceful degradation where possible

## Customization

Each example can be customized for your needs:

1. **Modify criteria** - Change auto-approval rules, label matching, etc.
2. **Add notifications** - Integrate with Slack, Discord, email
3. **Store metrics** - Save insights to a database (Supabase recommended)
4. **Add more events** - Extend webhook handler with additional event types

## Support

For issues or questions:
1. Check the main README for API documentation
2. Review GitHub's API documentation: https://docs.github.com/en/rest
3. Open an issue in the repository

## License

These examples are part of the GitHub MCP API Client package and follow the same license.
