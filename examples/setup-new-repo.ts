import { GitHubClient } from '../src/index.js';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';

async function setupNewRepository() {
  const client = new GitHubClient({ token: GITHUB_TOKEN });

  console.log('Creating and configuring a new GitHub repository...\n');

  try {
    const repoName = `example-project-${Date.now()}`;

    console.log(`Step 1: Creating repository "${repoName}"...`);
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
    console.log(`✓ Repository created: ${repo.html_url}\n`);

    const owner = repo.owner.login;

    console.log('Step 2: Adding repository topics...');
    await client.replaceRepositoryTopics({
      owner,
      repo: repoName,
      topics: ['example', 'demo', 'automation', 'github-api'],
    });
    console.log('✓ Topics added\n');

    console.log('Step 3: Creating initial issue...');
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
    console.log(`✓ Issue created: #${issue.number}\n`);

    console.log('Step 4: Enabling security features...');
    await client.enableVulnerabilityAlerts({
      owner,
      repo: repoName,
    });
    console.log('✓ Dependabot vulnerability alerts enabled\n');

    await client.enableAutomatedSecurityFixes({
      owner,
      repo: repoName,
    });
    console.log('✓ Automated security fixes enabled\n');

    console.log('Step 5: Creating labels for issue tracking...');
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
        console.log(`  ✓ Created label: ${label.name}`);
      } catch (error: any) {
        if (error.statusCode === 422) {
          console.log(`  - Label already exists: ${label.name}`);
        } else {
          throw error;
        }
      }
    }
    console.log();

    console.log('Step 6: Adding collaborator (example - update with real username)...');
    console.log('  (Skipped - update code with real GitHub username)\n');

    console.log('═══════════════════════════════════════════════════════');
    console.log('✓ Repository setup complete!');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`Repository URL: ${repo.html_url}`);
    console.log(`Clone URL: ${repo.clone_url}`);
    console.log(`Initial Issue: ${repo.html_url}/issues/${issue.number}`);
    console.log('═══════════════════════════════════════════════════════\n');

    console.log('Next steps:');
    console.log('1. Clone the repository');
    console.log('2. Add your project code');
    console.log('3. Set up CI/CD workflows');
    console.log('4. Configure branch protection rules');
    console.log('5. Invite team members\n');

  } catch (error: any) {
    console.error('Error setting up repository:', error.message);
    if (error.statusCode) {
      console.error(`Status Code: ${error.statusCode}`);
    }
    process.exit(1);
  }
}

if (!GITHUB_TOKEN) {
  console.error('Error: GITHUB_TOKEN environment variable is required');
  console.error('Usage: GITHUB_TOKEN=your_token_here npm run example:setup-repo');
  process.exit(1);
}

setupNewRepository();
