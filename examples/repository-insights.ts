import { GitHubClient } from '../src/index.js';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const REPO_OWNER = process.env.REPO_OWNER || '';
const REPO_NAME = process.env.REPO_NAME || '';

interface ContributorStats {
  author: string;
  commits: number;
  additions: number;
  deletions: number;
}

async function generateRepositoryInsights() {
  const client = new GitHubClient({ token: GITHUB_TOKEN });

  console.log('GitHub Repository Insights Report\n');
  console.log(`Repository: ${REPO_OWNER}/${REPO_NAME}\n`);
  console.log(`Generated: ${new Date().toLocaleString()}\n`);
  console.log(`${'═'.repeat(70)}\n`);

  try {
    console.log('📊 REPOSITORY OVERVIEW\n');

    const repo = await client.getRepository(REPO_OWNER, REPO_NAME);

    console.log(`Name: ${repo.name}`);
    console.log(`Description: ${repo.description || 'N/A'}`);
    console.log(`Visibility: ${repo.private ? 'Private' : 'Public'}`);
    console.log(`Default Branch: ${repo.default_branch}`);
    console.log(`Created: ${new Date(repo.created_at).toLocaleDateString()}`);
    console.log(`Last Updated: ${new Date(repo.updated_at).toLocaleDateString()}`);
    console.log(`\nStatistics:`);
    console.log(`  ⭐ Stars: ${repo.stargazers_count}`);
    console.log(`  👁️  Watchers: ${repo.watchers_count}`);
    console.log(`  🍴 Forks: ${repo.forks_count}`);
    console.log(`  🐛 Open Issues: ${repo.open_issues_count}`);
    console.log(`  📦 Size: ${(repo.size / 1024).toFixed(2)} MB`);

    const topics = await client.getRepositoryTopics({
      owner: REPO_OWNER,
      repo: REPO_NAME,
    });
    console.log(`  🏷️  Topics: ${topics.names.join(', ') || 'None'}\n`);

    console.log(`${'═'.repeat(70)}\n`);
    console.log('💻 PROGRAMMING LANGUAGES\n');

    const languages = await client.getRepositoryLanguages({
      owner: REPO_OWNER,
      repo: REPO_NAME,
    });

    const totalBytes = Object.values(languages).reduce((sum: number, bytes) => sum + (bytes as number), 0);

    const languageStats = Object.entries(languages)
      .map(([lang, bytes]) => ({
        language: lang,
        bytes: bytes as number,
        percentage: ((bytes as number) / totalBytes) * 100,
      }))
      .sort((a, b) => b.bytes - a.bytes);

    for (const stat of languageStats) {
      const bar = '█'.repeat(Math.round(stat.percentage / 2));
      console.log(`${stat.language.padEnd(20)} ${bar} ${stat.percentage.toFixed(1)}%`);
    }

    console.log(`\n${'═'.repeat(70)}\n`);
    console.log('👥 CONTRIBUTOR ACTIVITY\n');

    const contributors = await client.listRepositoryContributors({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      per_page: 10,
    });

    console.log(`Total Contributors: ${contributors.length}\n`);
    console.log('Top 10 Contributors:\n');

    for (let i = 0; i < Math.min(10, contributors.length); i++) {
      const contributor = contributors[i];
      console.log(`${(i + 1).toString().padStart(2)}. ${contributor.login}`);
      console.log(`    Contributions: ${contributor.contributions}`);
      console.log(`    Profile: ${contributor.html_url}\n`);
    }

    console.log(`${'═'.repeat(70)}\n`);
    console.log('📈 COMMIT ACTIVITY\n');

    const commits = await client.listCommits({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      per_page: 100,
    });

    const commitsByAuthor = new Map<string, ContributorStats>();

    for (const commit of commits.slice(0, 100)) {
      const author = commit.commit.author.name;
      if (!commitsByAuthor.has(author)) {
        commitsByAuthor.set(author, {
          author,
          commits: 0,
          additions: 0,
          deletions: 0,
        });
      }

      const stats = commitsByAuthor.get(author)!;
      stats.commits++;

      try {
        const commitDetails = await client.getCommit({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          ref: commit.sha,
        });

        if (commitDetails.stats) {
          stats.additions += commitDetails.stats.additions;
          stats.deletions += commitDetails.stats.deletions;
        }
      } catch (error) {
        // Skip if commit details not available
      }
    }

    const topCommitters = Array.from(commitsByAuthor.values())
      .sort((a, b) => b.commits - a.commits)
      .slice(0, 5);

    console.log('Recent commit activity (last 100 commits):\n');
    for (const committer of topCommitters) {
      console.log(`${committer.author}`);
      console.log(`  Commits: ${committer.commits}`);
      console.log(`  Lines added: +${committer.additions}`);
      console.log(`  Lines removed: -${committer.deletions}`);
      console.log(`  Net change: ${committer.additions - committer.deletions}\n`);
    }

    console.log(`${'═'.repeat(70)}\n`);
    console.log('🔀 PULL REQUEST METRICS\n');

    const openPRs = await client.listPullRequests({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      state: 'open',
      per_page: 100,
    });

    const closedPRs = await client.listPullRequests({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      state: 'closed',
      per_page: 100,
    });

    const mergedPRs = closedPRs.filter(pr => pr.merged_at);

    console.log(`Open PRs: ${openPRs.length}`);
    console.log(`Merged PRs (last 100): ${mergedPRs.length}`);
    console.log(`Closed without merge (last 100): ${closedPRs.length - mergedPRs.length}`);

    if (mergedPRs.length > 0) {
      const mergeTimes = mergedPRs
        .filter(pr => pr.created_at && pr.merged_at)
        .map(pr => {
          const created = new Date(pr.created_at).getTime();
          const merged = new Date(pr.merged_at!).getTime();
          return (merged - created) / (1000 * 60 * 60);
        });

      const avgMergeTime = mergeTimes.reduce((sum, time) => sum + time, 0) / mergeTimes.length;
      console.log(`\nAverage time to merge: ${avgMergeTime.toFixed(1)} hours`);
    }

    console.log(`\n${'═'.repeat(70)}\n`);
    console.log('🐛 ISSUE METRICS\n');

    const openIssues = await client.listIssues({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      state: 'open',
      per_page: 100,
    });

    const closedIssues = await client.listIssues({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      state: 'closed',
      per_page: 100,
    });

    console.log(`Open Issues: ${openIssues.length}`);
    console.log(`Closed Issues (last 100): ${closedIssues.length}`);

    const labelCounts = new Map<string, number>();
    for (const issue of [...openIssues, ...closedIssues]) {
      for (const label of issue.labels) {
        const labelName = typeof label === 'string' ? label : label.name;
        labelCounts.set(labelName, (labelCounts.get(labelName) || 0) + 1);
      }
    }

    if (labelCounts.size > 0) {
      console.log('\nTop Issue Labels:\n');
      const topLabels = Array.from(labelCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      for (const [label, count] of topLabels) {
        console.log(`  ${label}: ${count}`);
      }
    }

    if (closedIssues.length > 0) {
      const resolutionTimes = closedIssues
        .filter(issue => issue.created_at && issue.closed_at)
        .map(issue => {
          const created = new Date(issue.created_at).getTime();
          const closed = new Date(issue.closed_at!).getTime();
          return (closed - created) / (1000 * 60 * 60 * 24);
        });

      const avgResolutionTime = resolutionTimes.reduce((sum, time) => sum + time, 0) / resolutionTimes.length;
      console.log(`\nAverage time to close: ${avgResolutionTime.toFixed(1)} days`);
    }

    console.log(`\n${'═'.repeat(70)}\n`);
    console.log('🔄 RECENT ACTIVITY\n');

    const recentCommits = commits.slice(0, 5);
    console.log('Last 5 commits:\n');
    for (const commit of recentCommits) {
      console.log(`  ${commit.sha.substring(0, 7)} - ${commit.commit.message.split('\n')[0]}`);
      console.log(`  By: ${commit.commit.author.name}`);
      console.log(`  Date: ${new Date(commit.commit.author.date).toLocaleString()}\n`);
    }

    console.log(`${'═'.repeat(70)}\n`);
    console.log('📦 RELEASE INFORMATION\n');

    try {
      const latestRelease = await client.getLatestRelease({
        owner: REPO_OWNER,
        repo: REPO_NAME,
      });

      console.log(`Latest Release: ${latestRelease.tag_name}`);
      console.log(`Name: ${latestRelease.name || 'N/A'}`);
      console.log(`Published: ${new Date(latestRelease.published_at).toLocaleDateString()}`);
      console.log(`Downloads: ${latestRelease.assets.reduce((sum, asset) => sum + asset.download_count, 0)}`);
      console.log(`URL: ${latestRelease.html_url}`);
    } catch (error) {
      console.log('No releases found');
    }

    console.log(`\n${'═'.repeat(70)}\n`);
    console.log('✅ REPORT COMPLETE\n');

    console.log('Summary:');
    console.log(`  Repository has ${repo.stargazers_count} stars and ${repo.forks_count} forks`);
    console.log(`  ${contributors.length} contributors have made ${commits.length}+ commits`);
    console.log(`  ${openPRs.length} open PRs and ${openIssues.length} open issues`);
    console.log(`  Primary language: ${languageStats[0]?.language || 'Unknown'}\n`);

  } catch (error: any) {
    console.error('Error generating insights:', error.message);
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
  console.error('  npm run example:insights\n');
  process.exit(1);
}

generateRepositoryInsights();
