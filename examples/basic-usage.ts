import { GitHubClient } from '../src/index.js';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const REPO_OWNER = process.env.REPO_OWNER || 'octocat';
const REPO_NAME = process.env.REPO_NAME || 'Hello-World';

async function basicUsageExample() {
  const client = new GitHubClient({ token: GITHUB_TOKEN });

  console.log('GitHub MCP API Client - Basic Usage Example\n');
  console.log(`${'═'.repeat(60)}\n`);

  try {
    console.log('1. Getting Repository Information\n');
    const repo = await client.getRepository(REPO_OWNER, REPO_NAME);
    console.log(`Repository: ${repo.full_name}`);
    console.log(`Description: ${repo.description}`);
    console.log(`Stars: ${repo.stargazers_count}`);
    console.log(`Forks: ${repo.forks_count}`);
    console.log(`Default Branch: ${repo.default_branch}`);
    console.log(`Created: ${new Date(repo.created_at).toLocaleDateString()}`);
    console.log();

    console.log('2. Listing Open Issues\n');
    const issues = await client.listIssues({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      state: 'open',
      per_page: 5,
    });

    if (issues.length === 0) {
      console.log('No open issues found.');
    } else {
      console.log(`Found ${issues.length} open issue(s):\n`);
      issues.forEach(issue => {
        console.log(`  #${issue.number}: ${issue.title}`);
        console.log(`  Created by: ${issue.user.login}`);
        console.log(`  State: ${issue.state}`);
        console.log();
      });
    }

    console.log('3. Listing Pull Requests\n');
    const pullRequests = await client.listPullRequests({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      state: 'open',
      per_page: 5,
    });

    if (pullRequests.length === 0) {
      console.log('No open pull requests found.');
    } else {
      console.log(`Found ${pullRequests.length} open PR(s):\n`);
      pullRequests.forEach(pr => {
        console.log(`  #${pr.number}: ${pr.title}`);
        console.log(`  Author: ${pr.user.login}`);
        console.log(`  State: ${pr.state}`);
        console.log();
      });
    }

    console.log('4. Listing Branches\n');
    const branches = await client.listBranches(REPO_OWNER, REPO_NAME, 10);

    console.log(`Found ${branches.length} branch(es):\n`);
    branches.forEach(branch => {
      console.log(`  - ${branch.name} (${branch.commit.sha.substring(0, 7)})`);
    });
    console.log();

    console.log('5. Listing Recent Commits\n');
    const commits = await client.listCommits({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      per_page: 5,
    });

    console.log(`Last ${commits.length} commit(s):\n`);
    commits.forEach(commit => {
      console.log(`  ${commit.sha.substring(0, 7)} - ${commit.commit.message.split('\n')[0]}`);
      console.log(`  By: ${commit.commit.author.name}`);
      console.log(`  Date: ${new Date(commit.commit.author.date).toLocaleString()}`);
      console.log();
    });

    console.log('6. Getting Authenticated User Info\n');
    const user = await client.getAuthenticatedUser();
    console.log(`Logged in as: ${user.login}`);
    console.log(`Name: ${user.name || 'N/A'}`);
    console.log(`Public Repos: ${user.public_repos}`);
    console.log(`Followers: ${user.followers}`);
    console.log();

    console.log(`${'═'.repeat(60)}`);
    console.log('✓ Basic usage example complete!');
    console.log(`${'═'.repeat(60)}\n`);

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    if (error.statusCode) {
      console.error(`Status Code: ${error.statusCode}`);
    }
    if (error.code) {
      console.error(`Error Code: ${error.code}`);
    }
    process.exit(1);
  }
}

if (!GITHUB_TOKEN) {
  console.error('Error: GITHUB_TOKEN environment variable is required\n');
  console.error('Usage:');
  console.error('  GITHUB_TOKEN=your_token npm run example:basic');
  console.error('\nOptional:');
  console.error('  REPO_OWNER=owner REPO_NAME=repo npm run example:basic');
  console.error('\n');
  process.exit(1);
}

basicUsageExample();
