import { GitHubClient } from '../src/index.js';
import dev from '@onamfc/developer-log';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const REPO_OWNER = process.env.REPO_OWNER || 'octocat';
const REPO_NAME = process.env.REPO_NAME || 'Hello-World';

async function basicUsageExample() {
  const client = new GitHubClient({ token: GITHUB_TOKEN });

  dev.info('GitHub MCP API Client - Basic Usage Example\n');
  dev.info(`${'═'.repeat(60)}\n`);

  try {
    dev.info('1. Getting Repository Information\n');
    const repo = await client.getRepository(REPO_OWNER, REPO_NAME);
    dev.info(`Repository: ${repo.full_name}`);
    dev.info(`Description: ${repo.description}`);
    dev.info(`Stars: ${repo.stargazers_count}`);
    dev.info(`Forks: ${repo.forks_count}`);
    dev.info(`Default Branch: ${repo.default_branch}`);
    dev.info(`Created: ${new Date(repo.created_at).toLocaleDateString()}`);
    dev.info('');

    dev.info('2. Listing Open Issues\n');
    const issues = await client.listIssues({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      state: 'open',
      per_page: 5,
    });

    if (issues.length === 0) {
      dev.info('No open issues found.');
    } else {
      dev.info(`Found ${issues.length} open issue(s):\n`);
      issues.forEach(issue => {
        dev.info(`  #${issue.number}: ${issue.title}`);
        dev.info(`  Created by: ${issue.user.login}`);
        dev.info(`  State: ${issue.state}`);
        dev.info('');
      });
    }

    dev.info('3. Listing Pull Requests\n');
    const pullRequests = await client.listPullRequests({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      state: 'open',
      per_page: 5,
    });

    if (pullRequests.length === 0) {
      dev.info('No open pull requests found.');
    } else {
      dev.info(`Found ${pullRequests.length} open PR(s):\n`);
      pullRequests.forEach(pr => {
        dev.info(`  #${pr.number}: ${pr.title}`);
        dev.info(`  Author: ${pr.user.login}`);
        dev.info(`  State: ${pr.state}`);
        dev.info('');
      });
    }

    dev.info('4. Listing Branches\n');
    const branches = await client.listBranches(REPO_OWNER, REPO_NAME, 10);

    dev.info(`Found ${branches.length} branch(es):\n`);
    branches.forEach(branch => {
      dev.info(`  - ${branch.name} (${branch.commit.sha.substring(0, 7)})`);
    });
    dev.info('');

    dev.info('5. Listing Recent Commits\n');
    const commits = await client.listCommits({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      per_page: 5,
    });

    dev.info(`Last ${commits.length} commit(s):\n`);
    commits.forEach(commit => {
      dev.info(`  ${commit.sha.substring(0, 7)} - ${commit.commit.message.split('\n')[0]}`);
      dev.info(`  By: ${commit.commit.author.name}`);
      dev.info(`  Date: ${new Date(commit.commit.author.date).toLocaleString()}`);
      dev.info('');
    });

    dev.info('6. Getting Authenticated User Info\n');
    const user = await client.getAuthenticatedUser();
    dev.info(`Logged in as: ${user.login}`);
    dev.info(`Name: ${user.name || 'N/A'}`);
    dev.info(`Public Repos: ${user.public_repos}`);
    dev.info(`Followers: ${user.followers}`);
    dev.info('');

    dev.info(`${'═'.repeat(60)}`);
    dev.info('✓ Basic usage example complete!');
    dev.info(`${'═'.repeat(60)}\n`);

  } catch (error: any) {
    dev.error('\n❌ Error:', error.message);
    if (error.statusCode) {
      dev.error(`Status Code: ${error.statusCode}`);
    }
    if (error.code) {
      dev.error(`Error Code: ${error.code}`);
    }
    process.exit(1);
  }
}

if (!GITHUB_TOKEN) {
  dev.error('Error: GITHUB_TOKEN environment variable is required\n');
  dev.error('Usage:');
  dev.error('  GITHUB_TOKEN=your_token npm run example:basic');
  dev.error('\nOptional:');
  dev.error('  REPO_OWNER=owner REPO_NAME=repo npm run example:basic');
  dev.error('\n');
  process.exit(1);
}

basicUsageExample();
