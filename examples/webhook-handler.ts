import { createServer, IncomingMessage, ServerResponse } from 'http';
import { createHmac } from 'crypto';
import { GitHubClient } from '../src/index.js';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || '';
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const client = new GitHubClient({ token: GITHUB_TOKEN });

function verifySignature(payload: string, signature: string, secret: string): boolean {
  if (!signature) return false;

  const hmac = createHmac('sha256', secret);
  hmac.update(payload);
  const expectedSignature = 'sha256=' + hmac.digest('hex');

  return signature === expectedSignature;
}

async function handlePushEvent(payload: any) {
  console.log('\n📦 Push Event Received');
  console.log(`Repository: ${payload.repository.full_name}`);
  console.log(`Branch: ${payload.ref.replace('refs/heads/', '')}`);
  console.log(`Commits: ${payload.commits.length}`);

  for (const commit of payload.commits) {
    console.log(`  - ${commit.message.split('\n')[0]} (${commit.author.name})`);
  }

  const mainBranch = payload.repository.default_branch;
  if (payload.ref === `refs/heads/${mainBranch}`) {
    console.log(`\n✓ Push to main branch detected`);
  }
}

async function handlePullRequestEvent(payload: any) {
  console.log('\n🔀 Pull Request Event Received');

  const action = payload.action;
  const pr = payload.pull_request;
  const repo = payload.repository;

  console.log(`Action: ${action}`);
  console.log(`PR #${pr.number}: ${pr.title}`);
  console.log(`Author: ${pr.user.login}`);
  console.log(`${pr.head.ref} → ${pr.base.ref}`);

  if (action === 'opened') {
    console.log('\n🎉 New PR opened! Adding welcome comment...');

    try {
      await client.createIssueComment({
        owner: repo.owner.login,
        repo: repo.name,
        issue_number: pr.number,
        body: `## 👋 Welcome!

Thanks for opening this pull request! Here's what happens next:

- ✅ Automated checks will run
- 👀 A maintainer will review your changes
- 💬 Feel free to ask questions in the comments

**Checklist:**
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Changelog entry added (if applicable)

We appreciate your contribution! 🎉`,
      });
      console.log('✓ Welcome comment added');
    } catch (error: any) {
      console.error('Error adding comment:', error.message);
    }
  }

  if (action === 'closed' && pr.merged) {
    console.log('\n🎉 PR merged! Cleaning up...');

    try {
      const branch = pr.head.ref;
      if (branch !== repo.default_branch) {
        await client.deleteBranch({
          owner: repo.owner.login,
          repo: repo.name,
          branch,
        });
        console.log(`✓ Deleted branch: ${branch}`);
      }
    } catch (error: any) {
      console.error('Error deleting branch:', error.message);
    }
  }
}

async function handleIssuesEvent(payload: any) {
  console.log('\n🐛 Issue Event Received');

  const action = payload.action;
  const issue = payload.issue;
  const repo = payload.repository;

  console.log(`Action: ${action}`);
  console.log(`Issue #${issue.number}: ${issue.title}`);
  console.log(`Author: ${issue.user.login}`);

  if (action === 'opened') {
    console.log('\n📝 New issue opened! Auto-labeling...');

    const title = issue.title.toLowerCase();
    const body = (issue.body || '').toLowerCase();
    const labels: string[] = [];

    if (title.includes('bug') || body.includes('bug')) {
      labels.push('bug');
    }
    if (title.includes('feature') || title.includes('enhancement')) {
      labels.push('enhancement');
    }
    if (title.includes('docs') || title.includes('documentation')) {
      labels.push('documentation');
    }
    if (title.includes('help') || title.includes('question')) {
      labels.push('question');
    }

    if (labels.length > 0) {
      try {
        await client.addLabelsToIssue({
          owner: repo.owner.login,
          repo: repo.name,
          issue_number: issue.number,
          labels,
        });
        console.log(`✓ Added labels: ${labels.join(', ')}`);
      } catch (error: any) {
        console.error('Error adding labels:', error.message);
      }
    }

    if (!issue.assignee) {
      console.log('\n👤 Assigning issue to triage...');
      console.log('  (Configure default assignee in webhook handler)');
    }
  }
}

async function handleWorkflowRunEvent(payload: any) {
  console.log('\n⚙️ Workflow Run Event Received');

  const action = payload.action;
  const workflow = payload.workflow_run;
  const repo = payload.repository;

  console.log(`Action: ${action}`);
  console.log(`Workflow: ${workflow.name}`);
  console.log(`Status: ${workflow.status}`);
  console.log(`Conclusion: ${workflow.conclusion || 'N/A'}`);

  if (action === 'completed' && workflow.conclusion === 'failure') {
    console.log('\n❌ Workflow failed! Creating issue...');

    const headCommit = workflow.head_commit;
    const issueTitle = `CI Failed: ${workflow.name} on ${workflow.head_branch}`;
    const issueBody = `## ❌ Workflow Failure

**Workflow:** ${workflow.name}
**Branch:** ${workflow.head_branch}
**Commit:** ${headCommit.message} (${workflow.head_sha.substring(0, 7)})
**Author:** ${headCommit.author.name}
**Run URL:** ${workflow.html_url}

### Action Required
Please investigate and fix the failing tests.

---
*This issue was automatically created by the webhook handler*`;

    try {
      const existingIssues = await client.searchIssues({
        q: `repo:${repo.full_name} is:open "${issueTitle}" in:title`,
      });

      if (existingIssues.total_count === 0) {
        await client.createIssue({
          owner: repo.owner.login,
          repo: repo.name,
          title: issueTitle,
          body: issueBody,
          labels: ['ci-failure', 'bug'],
        });
        console.log('✓ Issue created for CI failure');
      } else {
        console.log('  (Issue already exists for this failure)');
      }
    } catch (error: any) {
      console.error('Error creating issue:', error.message);
    }
  }
}

async function handleWebhook(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'POST') {
    res.writeHead(405);
    res.end('Method Not Allowed');
    return;
  }

  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    try {
      const signature = req.headers['x-hub-signature-256'] as string;
      const event = req.headers['x-github-event'] as string;

      if (WEBHOOK_SECRET && !verifySignature(body, signature, WEBHOOK_SECRET)) {
        console.error('❌ Invalid webhook signature');
        res.writeHead(401);
        res.end('Unauthorized');
        return;
      }

      const payload = JSON.parse(body);

      console.log(`\n${'═'.repeat(60)}`);
      console.log(`Webhook received at ${new Date().toISOString()}`);
      console.log(`Event type: ${event}`);
      console.log(`${'═'.repeat(60)}`);

      switch (event) {
        case 'push':
          await handlePushEvent(payload);
          break;
        case 'pull_request':
          await handlePullRequestEvent(payload);
          break;
        case 'issues':
          await handleIssuesEvent(payload);
          break;
        case 'workflow_run':
          await handleWorkflowRunEvent(payload);
          break;
        default:
          console.log(`Unhandled event type: ${event}`);
      }

      res.writeHead(200);
      res.end('OK');
    } catch (error: any) {
      console.error('Error processing webhook:', error.message);
      res.writeHead(500);
      res.end('Internal Server Error');
    }
  });
}

const server = createServer(handleWebhook);

server.listen(PORT, () => {
  console.log(`\n${'═'.repeat(60)}`);
  console.log('🚀 GitHub Webhook Handler Started');
  console.log(`${'═'.repeat(60)}`);
  console.log(`Port: ${PORT}`);
  console.log(`Signature verification: ${WEBHOOK_SECRET ? 'ENABLED' : 'DISABLED'}`);
  console.log(`\nListening for GitHub webhooks...`);
  console.log(`\nWebhook URL: http://localhost:${PORT}/`);
  console.log(`\nSupported events:`);
  console.log('  - push');
  console.log('  - pull_request');
  console.log('  - issues');
  console.log('  - workflow_run');
  console.log(`\n${'═'.repeat(60)}\n`);
});

process.on('SIGINT', () => {
  console.log('\n\nShutting down webhook handler...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
