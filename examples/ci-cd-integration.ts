import { GitHubClient } from '../src/index.js';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const REPO_OWNER = process.env.REPO_OWNER || '';
const REPO_NAME = process.env.REPO_NAME || '';

async function manageCICD() {
  const client = new GitHubClient({ token: GITHUB_TOKEN });

  console.log('GitHub Actions CI/CD Management\n');
  console.log(`Repository: ${REPO_OWNER}/${REPO_NAME}\n`);

  try {
    console.log('Step 1: Listing all workflows...\n');
    const workflows = await client.listWorkflows({
      owner: REPO_OWNER,
      repo: REPO_NAME,
    });

    console.log(`Found ${workflows.total_count} workflow(s):\n`);
    for (const workflow of workflows.workflows) {
      console.log(`  - ${workflow.name}`);
      console.log(`    Path: ${workflow.path}`);
      console.log(`    State: ${workflow.state}`);
      console.log(`    ID: ${workflow.id}\n`);
    }

    if (workflows.workflows.length === 0) {
      console.log('No workflows found. Exiting...\n');
      return;
    }

    console.log('Step 2: Checking recent workflow runs...\n');

    for (const workflow of workflows.workflows.slice(0, 3)) {
      console.log(`${'═'.repeat(60)}`);
      console.log(`Workflow: ${workflow.name}`);
      console.log(`${'═'.repeat(60)}`);

      const runs = await client.listWorkflowRuns({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        workflow_id: workflow.id,
        per_page: 5,
      });

      console.log(`\nRecent runs: ${runs.total_count} total\n`);

      if (runs.workflow_runs.length === 0) {
        console.log('  No runs found for this workflow\n');
        continue;
      }

      let successCount = 0;
      let failureCount = 0;
      let inProgressCount = 0;

      for (const run of runs.workflow_runs) {
        const status = run.status;
        const conclusion = run.conclusion;

        let statusIcon = '⏳';
        if (status === 'completed') {
          if (conclusion === 'success') {
            statusIcon = '✅';
            successCount++;
          } else if (conclusion === 'failure') {
            statusIcon = '❌';
            failureCount++;
          } else if (conclusion === 'cancelled') {
            statusIcon = '🚫';
          } else {
            statusIcon = '⚠️';
          }
        } else {
          inProgressCount++;
        }

        console.log(`  ${statusIcon} Run #${run.run_number} - ${run.event} on ${run.head_branch}`);
        console.log(`     Status: ${status}${conclusion ? ` (${conclusion})` : ''}`);
        console.log(`     Started: ${new Date(run.created_at).toLocaleString()}`);
        console.log(`     Duration: ${calculateDuration(run.created_at, run.updated_at)}`);
        console.log(`     URL: ${run.html_url}\n`);

        if (status !== 'completed' && process.env.CANCEL_IN_PROGRESS === 'true') {
          console.log(`     🛑 Cancelling in-progress run...`);
          try {
            await client.cancelWorkflowRun({
              owner: REPO_OWNER,
              repo: REPO_NAME,
              run_id: run.id,
            });
            console.log(`     ✓ Run cancelled\n`);
          } catch (error: any) {
            console.log(`     ✗ Failed to cancel: ${error.message}\n`);
          }
        }

        if (conclusion === 'failure' && process.env.RETRY_FAILED === 'true') {
          console.log(`     🔄 Retrying failed run...`);
          try {
            await client.rerunWorkflow({
              owner: REPO_OWNER,
              repo: REPO_NAME,
              run_id: run.id,
            });
            console.log(`     ✓ Run restarted\n`);
          } catch (error: any) {
            console.log(`     ✗ Failed to retry: ${error.message}\n`);
          }
        }
      }

      console.log(`Summary for ${workflow.name}:`);
      console.log(`  Success: ${successCount}`);
      console.log(`  Failures: ${failureCount}`);
      console.log(`  In Progress: ${inProgressCount}`);
      console.log(`  Success Rate: ${successCount > 0 ? ((successCount / (successCount + failureCount)) * 100).toFixed(1) : 0}%\n`);
    }

    console.log('Step 3: Checking for workflow artifacts...\n');

    const latestRun = await client.listWorkflowRuns({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      per_page: 1,
    });

    if (latestRun.workflow_runs.length > 0) {
      const run = latestRun.workflow_runs[0];

      const artifacts = await client.listWorkflowRunArtifacts({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        run_id: run.id,
      });

      console.log(`Artifacts from latest run (#${run.run_number}):`);
      if (artifacts.total_count === 0) {
        console.log('  No artifacts found\n');
      } else {
        console.log(`  Total: ${artifacts.total_count}\n`);
        for (const artifact of artifacts.artifacts) {
          console.log(`  - ${artifact.name}`);
          console.log(`    Size: ${(artifact.size_in_bytes / 1024).toFixed(2)} KB`);
          console.log(`    Expired: ${artifact.expired ? 'Yes' : 'No'}`);
          console.log(`    Created: ${new Date(artifact.created_at).toLocaleString()}\n`);
        }
      }
    }

    console.log('Step 4: Managing repository secrets...\n');

    const secrets = await client.listRepositorySecrets({
      owner: REPO_OWNER,
      repo: REPO_NAME,
    });

    console.log(`Repository secrets: ${secrets.total_count}\n`);
    for (const secret of secrets.secrets) {
      console.log(`  - ${secret.name}`);
      console.log(`    Updated: ${new Date(secret.updated_at).toLocaleString()}\n`);
    }

    console.log(`${'═'.repeat(60)}`);
    console.log('✓ CI/CD management complete!');
    console.log(`${'═'.repeat(60)}\n`);

    console.log('Available actions:');
    console.log('  - Set CANCEL_IN_PROGRESS=true to cancel running workflows');
    console.log('  - Set RETRY_FAILED=true to retry failed workflows');
    console.log('  - Check workflow logs in the GitHub UI\n');

  } catch (error: any) {
    console.error('Error managing CI/CD:', error.message);
    if (error.statusCode) {
      console.error(`Status Code: ${error.statusCode}`);
    }
    process.exit(1);
  }
}

function calculateDuration(start: string, end: string): string {
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  const diffMs = endTime - startTime;

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

async function triggerWorkflow() {
  const client = new GitHubClient({ token: GITHUB_TOKEN });

  const workflowId = process.env.WORKFLOW_ID;
  const ref = process.env.REF || 'main';

  if (!workflowId) {
    console.error('Error: WORKFLOW_ID required for trigger mode');
    process.exit(1);
  }

  console.log(`\nTriggering workflow: ${workflowId}`);
  console.log(`Branch: ${ref}\n`);

  try {
    await client.triggerWorkflow({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      workflow_id: workflowId,
      ref,
      inputs: {
        environment: process.env.ENVIRONMENT || 'production',
      },
    });

    console.log('✓ Workflow triggered successfully!\n');
  } catch (error: any) {
    console.error('Error triggering workflow:', error.message);
    process.exit(1);
  }
}

if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
  console.error('Error: Required environment variables missing\n');
  console.error('Usage:');
  console.error('  GITHUB_TOKEN=your_token \\');
  console.error('  REPO_OWNER=owner \\');
  console.error('  REPO_NAME=repo \\');
  console.error('  CANCEL_IN_PROGRESS=true \\  # Optional: cancel running workflows');
  console.error('  RETRY_FAILED=true \\        # Optional: retry failed workflows');
  console.error('  npm run example:ci-cd\n');
  console.error('Or to trigger a workflow:');
  console.error('  WORKFLOW_ID=workflow.yml \\');
  console.error('  REF=main \\');
  console.error('  ENVIRONMENT=production \\');
  console.error('  npm run example:ci-cd:trigger\n');
  process.exit(1);
}

if (process.argv.includes('trigger')) {
  triggerWorkflow();
} else {
  manageCICD();
}
