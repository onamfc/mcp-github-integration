import { GitHubClient } from '../src/index.js';
import dev from '@onamfc/developer-log';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';

async function setupNewRepository() {
  const client = new GitHubClient({ token: GITHUB_TOKEN });

  dev.info('Creating and configuring a new GitHub repository...\n');

  try {
    const repoName = `example-project-${Date.now()}`;

    dev.info(`Step 1: Creating repository "${repoName}"...`);
    const repo = await client.createRepository({
      name: repoName,
      description: 'Example project created via GitHub MCP API Client',
      private: false,
      auto_init: true,
      gitignore_template: 'Node',
      license_template: 'mit',
      has_issues: true,
      has_projects: true,
      has_wiki: false,
    });
    dev.info(`✓ Repository created: ${repo.html_url}\n`);

    const owner = repo.owner.login;

    dev.info('Step 2: Adding repository topics...');
    await client.replaceRepositoryTopics(
      owner,
      repoName,
      ['example', 'demo', 'automation', 'github-api']
    );
    dev.info('✓ Topics added\n');

    dev.info('Step 3: Creating initial issue...');
    const issue = await client.createIssue({
      owner,
      repo: repoName,
      title: 'Setup project documentation',
      body: `## Welcome to ${repoName}!

This issue tracks the initial setup tasks:

- [x] Repository created
- [x] Basic configuration set
- [ ] Add README content
- [ ] Set up CI/CD
- [ ] Configure branch protection

Created automatically via GitHub MCP API Client.`,
      labels: ['documentation', 'setup'],
    });
    dev.info(`✓ Issue created: #${issue.number}\n`);

    dev.info('Step 4: Enabling security features...');
    await client.enableVulnerabilityAlerts(owner, repoName);
    dev.info('✓ Dependabot vulnerability alerts enabled\n');

    await client.enableAutomatedSecurityFixes(owner, repoName);
    dev.info('✓ Automated security fixes enabled\n');

    dev.info('Step 5: Creating labels for issue tracking...');
    const customLabels = [
      { name: 'priority-high', color: 'd73a4a', description: 'High priority items' },
      { name: 'priority-medium', color: 'fbca04', description: 'Medium priority items' },
      { name: 'priority-low', color: '0e8a16', description: 'Low priority items' },
      { name: 'needs-review', color: 'fbca04', description: 'Waiting for review' },
    ];

    for (const label of customLabels) {
      try {
        await client.createLabel({
          owner,
          repo: repoName,
          name: label.name,
          color: label.color,
          description: label.description,
        });
        dev.info(`  ✓ Created label: ${label.name}`);
      } catch (error: any) {
        if (error.statusCode === 422) {
          dev.info(`  - Label already exists: ${label.name}`);
        } else {
          throw error;
        }
      }
    }
    dev.info('');

    dev.info('Step 6: Adding collaborator (example - update with real username)...');
    dev.info('  (Skipped - update code with real GitHub username)\n');

    dev.info('═══════════════════════════════════════════════════════');
    dev.info('✓ Repository setup complete!');
    dev.info('═══════════════════════════════════════════════════════');
    dev.info(`Repository URL: ${repo.html_url}`);
    dev.info(`Clone URL: ${repo.html_url}.git`);
    dev.info(`Initial Issue: ${repo.html_url}/issues/${issue.number}`);
    dev.info('═══════════════════════════════════════════════════════\n');

    dev.info('Next steps:');
    dev.info('1. Clone the repository');
    dev.info('2. Add your project code');
    dev.info('3. Set up CI/CD workflows');
    dev.info('4. Configure branch protection rules');
    dev.info('5. Invite team members\n');

  } catch (error: any) {
    dev.error('Error setting up repository:', error.message);
    if (error.statusCode) {
      dev.error(`Status Code: ${error.statusCode}`);
    }
    process.exit(1);
  }
}

if (!GITHUB_TOKEN) {
  dev.error('Error: GITHUB_TOKEN environment variable is required');
  dev.error('Usage: GITHUB_TOKEN=your_token_here npm run example:setup-repo');
  process.exit(1);
}

setupNewRepository();
