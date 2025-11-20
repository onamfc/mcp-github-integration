# GitHub MCP API Client - Examples

This directory contains practical, real-world examples demonstrating how to use the GitHub MCP API Client for common automation tasks.

## Available Examples

### 1. Basic Usage (`basic-usage.ts`)

Demonstrates fundamental operations with the GitHub API client:

- Fetch repository information
- List open issues
- List pull requests
- List branches
- List recent commits
- Get authenticated user info

**Usage:**
```bash
GITHUB_TOKEN=your_token npm run example:basic
```

**Optional Environment Variables:**
```bash
GITHUB_TOKEN=your_token \
REPO_OWNER=octocat \
REPO_NAME=Hello-World \
npm run example:basic
```

---

### 2. Setup New Repository (`setup-new-repo.ts`)

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

Available scripts in `package.json`:

```json
{
  "scripts": {
    "example:basic": "node dist/examples/basic-usage.js",
    "example:setup-repo": "node dist/examples/setup-new-repo.js"
  }
}
```

## Best Practices

### Security

1. **Never commit tokens**
   - Use environment variables
   - Add `.env` to `.gitignore`

2. **Use minimal token scopes**
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
3. **Store metrics** - Save insights to a database
4. **Extend functionality** - Add more GitHub operations as needed

## Support

For issues or questions:
1. Check the main README for API documentation
2. Review GitHub's API documentation: https://docs.github.com/en/rest
3. Open an issue in the repository

## License

These examples are part of the GitHub MCP API Client package and follow the same MIT license.
