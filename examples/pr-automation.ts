import { GitHubClient } from '../src/index.js';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const REPO_OWNER = process.env.REPO_OWNER || '';
const REPO_NAME = process.env.REPO_NAME || '';

async function automatePullRequests() {
  const client = new GitHubClient({ token: GITHUB_TOKEN });

  console.log('GitHub Pull Request Automation\n');
  console.log(`Repository: ${REPO_OWNER}/${REPO_NAME}\n`);

  try {
    console.log('Step 1: Fetching open pull requests...');
    const prs = await client.listPullRequests({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      state: 'open',
      per_page: 10,
    });

    if (prs.length === 0) {
      console.log('No open pull requests found.\n');
      return;
    }

    console.log(`Found ${prs.length} open pull request(s)\n`);

    for (const pr of prs) {
      console.log(`\n${'═'.repeat(60)}`);
      console.log(`PR #${pr.number}: ${pr.title}`);
      console.log(`Author: ${pr.user.login}`);
      console.log(`Branch: ${pr.head.ref} → ${pr.base.ref}`);
      console.log(`${'═'.repeat(60)}`);

      const reviews = await client.listPullRequestReviews({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        pull_number: pr.number,
      });

      console.log(`\nCurrent reviews: ${reviews.length}`);

      const approvals = reviews.filter(r => r.state === 'APPROVED');
      const changesRequested = reviews.filter(r => r.state === 'CHANGES_REQUESTED');
      const comments = reviews.filter(r => r.state === 'COMMENTED');

      console.log(`  ✓ Approved: ${approvals.length}`);
      console.log(`  ✗ Changes requested: ${changesRequested.length}`);
      console.log(`  💬 Comments: ${comments.length}`);

      const files = await client.listPullRequestFiles({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        pull_number: pr.number,
      });

      console.log(`\nFiles changed: ${files.length}`);
      const additions = files.reduce((sum, f) => sum + f.additions, 0);
      const deletions = files.reduce((sum, f) => sum + f.deletions, 0);
      console.log(`  +${additions} -${deletions}`);

      const hasTestFiles = files.some(f =>
        f.filename.includes('test') ||
        f.filename.includes('spec') ||
        f.filename.endsWith('.test.ts') ||
        f.filename.endsWith('.spec.ts')
      );

      const hasDocumentation = files.some(f =>
        f.filename.endsWith('.md') ||
        f.filename.includes('README')
      );

      console.log('\nAutomated checks:');
      console.log(`  ${hasTestFiles ? '✓' : '✗'} Test files included`);
      console.log(`  ${hasDocumentation ? '✓' : '✗'} Documentation updated`);
      console.log(`  ${additions + deletions < 500 ? '✓' : '⚠'} Size check (${additions + deletions < 500 ? 'small' : 'large'} PR)`);

      const shouldAutoApprove =
        hasTestFiles &&
        additions + deletions < 500 &&
        changesRequested.length === 0 &&
        pr.user.login !== REPO_OWNER;

      if (shouldAutoApprove && approvals.length === 0) {
        console.log('\n🤖 Auto-approving PR (meets criteria)...');

        await client.createPullRequestReview({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          pull_number: pr.number,
          event: 'APPROVE',
          body: `✓ Automated approval based on criteria:
- Tests included
- Small PR size
- No changes requested
- Passes automated checks

Great work! 🎉`,
        });
        console.log('✓ Review submitted');
      } else if (!hasTestFiles) {
        console.log('\n💬 Requesting tests...');

        await client.createPullRequestReviewComment({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          pull_number: pr.number,
          body: `## 🧪 Tests Required

Please add tests for your changes to ensure code quality and prevent regressions.

- [ ] Unit tests added
- [ ] Integration tests (if applicable)
- [ ] Tests passing locally

Thanks for your contribution!`,
          commit_id: pr.head.sha,
        });
        console.log('✓ Comment added requesting tests');
      }

      const canMerge =
        approvals.length >= 1 &&
        changesRequested.length === 0 &&
        pr.mergeable &&
        hasTestFiles;

      console.log(`\nMerge status: ${canMerge ? '✓ Ready to merge' : '✗ Not ready'}`);

      if (canMerge && process.env.AUTO_MERGE === 'true') {
        console.log('\n🔄 Auto-merging PR...');

        try {
          await client.mergePullRequest({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            pull_number: pr.number,
            commit_title: `Merge PR #${pr.number}: ${pr.title}`,
            commit_message: 'Auto-merged via GitHub MCP API Client',
            merge_method: 'squash',
          });
          console.log('✓ PR merged successfully!');
        } catch (error: any) {
          console.log(`✗ Merge failed: ${error.message}`);
        }
      } else if (!canMerge) {
        console.log('\nReasons preventing merge:');
        if (approvals.length < 1) console.log('  - Needs approval');
        if (changesRequested.length > 0) console.log('  - Changes requested');
        if (!pr.mergeable) console.log('  - Has conflicts');
        if (!hasTestFiles) console.log('  - Missing tests');
      }
    }

    console.log(`\n${'═'.repeat(60)}`);
    console.log('✓ Pull request automation complete!');
    console.log(`${'═'.repeat(60)}\n`);

  } catch (error: any) {
    console.error('Error in PR automation:', error.message);
    if (error.statusCode) {
      console.error(`Status Code: ${error.statusCode}`);
    }
    process.exit(1);
  }
}

if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
  console.error('Error: Required environment variables missing\n');
  console.error('Usage:');
  console.error('  GITHUB_TOKEN=your_token \\');
  console.error('  REPO_OWNER=owner \\');
  console.error('  REPO_NAME=repo \\');
  console.error('  AUTO_MERGE=true \\  # Optional: enable auto-merge');
  console.error('  npm run example:pr-automation\n');
  process.exit(1);
}

automatePullRequests();
