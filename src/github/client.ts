import { Octokit } from '@octokit/rest';
import { Logger } from '../utils/logger.js';
import { handleError, GitHubAPIError } from '../utils/error-handler.js';
import type {
  GitHubConfig,
  Repository,
  Issue,
  PullRequest,
  CreateIssueParams,
  CreatePullRequestParams,
  ListIssuesParams,
  ListPullRequestsParams,
  CreateRepositoryParams,
  Comment,
  CreateCommentParams,
  UpdateCommentParams,
  Label,
  CreateLabelParams,
  UpdateLabelParams,
  Milestone,
  CreateMilestoneParams,
  UpdateMilestoneParams,
  FileContent,
  GetFileParams,
  CreateFileParams,
  UpdateFileParams,
  DeleteFileParams,
  Tree,
  Branch,
  BranchProtection,
  CreateBranchParams,
  UpdateBranchProtectionParams,
  MergeBranchParams,
  Commit,
  ListCommitsParams,
  CommitComparison,
  GitReference,
  CreateReferenceParams,
  UpdateReferenceParams,
  GitTag,
  CreateTagParams,
  Release,
  ReleaseAsset,
  CreateReleaseParams,
  UpdateReleaseParams,
  ListReleasesParams,
  UploadReleaseAssetParams,
  GenerateReleaseNotesParams,
  GeneratedReleaseNotes,
  Workflow,
  WorkflowRun,
  WorkflowJob,
  Artifact,
  ListWorkflowsParams,
  ListWorkflowRunsParams,
  ListWorkflowJobsParams,
  ListArtifactsParams,
  CreateWorkflowDispatchParams,
  WorkflowUsage,
  WorkflowRunUsage,
  SearchRepositoriesParams,
  SearchCodeParams,
  SearchCommitsParams,
  SearchIssuesParams,
  SearchUsersParams,
  SearchTopicsParams,
  SearchLabelsParams,
  RepositorySearchResult,
  CodeSearchResult,
  CommitSearchResult,
  IssueSearchResult,
  UserSearchResult,
  TopicSearchResult,
  LabelSearchResult,
  SearchResults,
  Webhook,
  CreateWebhookParams,
  UpdateWebhookParams,
  WebhookDelivery,
  ListWebhooksParams,
  ListWebhookDeliveriesParams,
  UpdateRepositoryParams,
  RepositoryTopics,
  Collaborator,
  AddCollaboratorParams,
  ListCollaboratorsParams,
  RepositoryInvitation,
  RepositoryLanguages,
  CodeFrequency,
  ContributorActivity,
  ParticipationStats,
  TransferRepositoryParams,
  RepositoryTeam,
  AddRepositoryTeamParams,
  RepositoryRuleset,
} from '../types/github.js';

export class GitHubClient {
  private octokit: Octokit;
  private logger: Logger;

  constructor(config: GitHubConfig) {
    this.logger = new Logger('GitHubClient');
    this.octokit = new Octokit({
      auth: config.token,
      baseUrl: config.baseUrl || 'https://api.github.com',
    });
    this.logger.info('GitHub client initialized');
  }

  async getRepository(owner: string, repo: string): Promise<Repository> {
    try {
      this.logger.info(`Fetching repository: ${owner}/${repo}`);
      const { data } = await this.octokit.repos.get({ owner, repo });
      return data as any as Repository;
    } catch (error) {
      throw handleError(error);
    }
  }

  async listRepositories(username: string): Promise<Repository[]> {
    try {
      this.logger.info(`Listing repositories for user: ${username}`);
      const { data } = await this.octokit.repos.listForUser({
        username,
        per_page: 100,
      });
      return data as any as Repository[];
    } catch (error) {
      throw handleError(error);
    }
  }

  async createRepository(params: CreateRepositoryParams): Promise<Repository> {
    try {
      this.logger.info(`Creating repository: ${params.name}`);
      const { data } = await this.octokit.repos.createForAuthenticatedUser({
        name: params.name,
        description: params.description,
        private: params.private,
        auto_init: params.auto_init,
        gitignore_template: params.gitignore_template,
        license_template: params.license_template,
        homepage: params.homepage,
        has_issues: params.has_issues,
        has_projects: params.has_projects,
        has_wiki: params.has_wiki,
      });
      return data as any as Repository;
    } catch (error) {
      throw handleError(error);
    }
  }

  async deleteRepository(owner: string, repo: string): Promise<void> {
    try {
      this.logger.info(`Deleting repository: ${owner}/${repo}`);
      await this.octokit.repos.delete({ owner, repo });
    } catch (error) {
      throw handleError(error);
    }
  }


  async createIssue(params: CreateIssueParams): Promise<Issue> {
    try {
      this.logger.info(`Creating issue in ${params.owner}/${params.repo}`);
      const { data } = await this.octokit.issues.create({
        owner: params.owner,
        repo: params.repo,
        title: params.title,
        body: params.body,
        labels: params.labels,
        assignees: params.assignees,
      });
      return data as any as Issue;
    } catch (error) {
      throw handleError(error);
    }
  }

  async listIssues(params: ListIssuesParams): Promise<Issue[]> {
    try {
      this.logger.info(`Listing issues for ${params.owner}/${params.repo}`);
      const { data } = await this.octokit.issues.listForRepo({
        owner: params.owner,
        repo: params.repo,
        state: params.state || 'open',
        labels: params.labels?.join(','),
        sort: params.sort,
        direction: params.direction,
        per_page: params.per_page || 30,
        page: params.page || 1,
      });
      return data as any as Issue[];
    } catch (error) {
      throw handleError(error);
    }
  }

  async getIssue(owner: string, repo: string, issueNumber: number): Promise<Issue> {
    try {
      this.logger.info(`Fetching issue #${issueNumber} from ${owner}/${repo}`);
      const { data } = await this.octokit.issues.get({
        owner,
        repo,
        issue_number: issueNumber,
      });
      return data as any as Issue;
    } catch (error) {
      throw handleError(error);
    }
  }

  async updateIssue(
    owner: string,
    repo: string,
    issueNumber: number,
    updates: Partial<CreateIssueParams>
  ): Promise<Issue> {
    try {
      this.logger.info(`Updating issue #${issueNumber} in ${owner}/${repo}`);
      const { data } = await this.octokit.issues.update({
        owner,
        repo,
        issue_number: issueNumber,
        title: updates.title,
        body: updates.body,
        labels: updates.labels,
        assignees: updates.assignees,
      });
      return data as any as Issue;
    } catch (error) {
      throw handleError(error);
    }
  }

  async closeIssue(owner: string, repo: string, issueNumber: number): Promise<Issue> {
    try {
      this.logger.info(`Closing issue #${issueNumber} in ${owner}/${repo}`);
      const { data } = await this.octokit.issues.update({
        owner,
        repo,
        issue_number: issueNumber,
        state: 'closed',
      });
      return data as any as Issue;
    } catch (error) {
      throw handleError(error);
    }
  }

  async createPullRequest(params: CreatePullRequestParams): Promise<PullRequest> {
    try {
      this.logger.info(`Creating pull request in ${params.owner}/${params.repo}`);
      const { data } = await this.octokit.pulls.create({
        owner: params.owner,
        repo: params.repo,
        title: params.title,
        body: params.body,
        head: params.head,
        base: params.base,
      });
      return data as any as PullRequest;
    } catch (error) {
      throw handleError(error);
    }
  }

  async listPullRequests(params: ListPullRequestsParams): Promise<PullRequest[]> {
    try {
      this.logger.info(`Listing pull requests for ${params.owner}/${params.repo}`);
      const { data } = await this.octokit.pulls.list({
        owner: params.owner,
        repo: params.repo,
        state: params.state || 'open',
        sort: params.sort,
        direction: params.direction,
        per_page: params.per_page || 30,
        page: params.page || 1,
      });
      return data as any as PullRequest[];
    } catch (error) {
      throw handleError(error);
    }
  }

  async getPullRequest(
    owner: string,
    repo: string,
    pullNumber: number
  ): Promise<PullRequest> {
    try {
      this.logger.info(`Fetching pull request #${pullNumber} from ${owner}/${repo}`);
      const { data } = await this.octokit.pulls.get({
        owner,
        repo,
        pull_number: pullNumber,
      });
      return data as any as PullRequest;
    } catch (error) {
      throw handleError(error);
    }
  }

  async mergePullRequest(
    owner: string,
    repo: string,
    pullNumber: number,
    commitMessage?: string
  ): Promise<void> {
    try {
      this.logger.info(`Merging pull request #${pullNumber} in ${owner}/${repo}`);
      await this.octokit.pulls.merge({
        owner,
        repo,
        pull_number: pullNumber,
        commit_message: commitMessage,
      });
    } catch (error) {
      throw handleError(error);
    }
  }


  async getAuthenticatedUser(): Promise<any> {
    try {
      this.logger.info('Fetching authenticated user');
      const { data } = await this.octokit.users.getAuthenticated();
      return data;
    } catch (error) {
      throw handleError(error);
    }
  }

  async listIssueComments(
    owner: string,
    repo: string,
    issueNumber: number,
    perPage = 30,
    page = 1
  ): Promise<Comment[]> {
    try {
      this.logger.info(`Listing comments for issue #${issueNumber} in ${owner}/${repo}`);
      const { data } = await this.octokit.issues.listComments({
        owner,
        repo,
        issue_number: issueNumber,
        per_page: perPage,
        page,
      });
      return data as any as Comment[];
    } catch (error) {
      throw handleError(error);
    }
  }

  async createIssueComment(params: CreateCommentParams): Promise<Comment> {
    try {
      this.logger.info(
        `Creating comment on issue #${params.issue_number} in ${params.owner}/${params.repo}`
      );
      const { data } = await this.octokit.issues.createComment({
        owner: params.owner,
        repo: params.repo,
        issue_number: params.issue_number,
        body: params.body,
      });
      return data as any as Comment;
    } catch (error) {
      throw handleError(error);
    }
  }

  async updateIssueComment(params: UpdateCommentParams): Promise<Comment> {
    try {
      this.logger.info(
        `Updating comment #${params.comment_id} in ${params.owner}/${params.repo}`
      );
      const { data } = await this.octokit.issues.updateComment({
        owner: params.owner,
        repo: params.repo,
        comment_id: params.comment_id,
        body: params.body,
      });
      return data as any as Comment;
    } catch (error) {
      throw handleError(error);
    }
  }

  async deleteIssueComment(
    owner: string,
    repo: string,
    commentId: number
  ): Promise<void> {
    try {
      this.logger.info(`Deleting comment #${commentId} in ${owner}/${repo}`);
      await this.octokit.issues.deleteComment({
        owner,
        repo,
        comment_id: commentId,
      });
    } catch (error) {
      throw handleError(error);
    }
  }

  async listPullRequestComments(
    owner: string,
    repo: string,
    pullNumber: number,
    perPage = 30,
    page = 1
  ): Promise<Comment[]> {
    try {
      this.logger.info(
        `Listing comments for pull request #${pullNumber} in ${owner}/${repo}`
      );
      const { data } = await this.octokit.pulls.listReviewComments({
        owner,
        repo,
        pull_number: pullNumber,
        per_page: perPage,
        page,
      });
      return data as any as Comment[];
    } catch (error) {
      throw handleError(error);
    }
  }

  async createPullRequestComment(
    owner: string,
    repo: string,
    pullNumber: number,
    body: string,
    commitId?: string,
    path?: string,
    position?: number
  ): Promise<Comment> {
    try {
      this.logger.info(
        `Creating comment on pull request #${pullNumber} in ${owner}/${repo}`
      );
      const params: any = {
        owner,
        repo,
        pull_number: pullNumber,
        body,
      };

      if (commitId) params.commit_id = commitId;
      if (path) params.path = path;
      if (position !== undefined) params.position = position;

      const { data } = await this.octokit.pulls.createReviewComment(params);
      return data as any as Comment;
    } catch (error) {
      throw handleError(error);
    }
  }

  async listLabels(owner: string, repo: string, perPage = 100, page = 1): Promise<Label[]> {
    try {
      this.logger.info(`Listing labels for ${owner}/${repo}`);
      const { data } = await this.octokit.issues.listLabelsForRepo({
        owner,
        repo,
        per_page: perPage,
        page,
      });
      return data as any as Label[];
    } catch (error) {
      throw handleError(error);
    }
  }

  async getLabel(owner: string, repo: string, name: string): Promise<Label> {
    try {
      this.logger.info(`Fetching label '${name}' from ${owner}/${repo}`);
      const { data } = await this.octokit.issues.getLabel({
        owner,
        repo,
        name,
      });
      return data as any as Label;
    } catch (error) {
      throw handleError(error);
    }
  }

  async createLabel(params: CreateLabelParams): Promise<Label> {
    try {
      this.logger.info(`Creating label '${params.name}' in ${params.owner}/${params.repo}`);
      const { data } = await this.octokit.issues.createLabel({
        owner: params.owner,
        repo: params.repo,
        name: params.name,
        color: params.color,
        description: params.description,
      });
      return data as any as Label;
    } catch (error) {
      throw handleError(error);
    }
  }

  async updateLabel(params: UpdateLabelParams): Promise<Label> {
    try {
      this.logger.info(`Updating label '${params.name}' in ${params.owner}/${params.repo}`);
      const { data } = await this.octokit.issues.updateLabel({
        owner: params.owner,
        repo: params.repo,
        name: params.name,
        new_name: params.new_name,
        color: params.color,
        description: params.description,
      });
      return data as any as Label;
    } catch (error) {
      throw handleError(error);
    }
  }

  async deleteLabel(owner: string, repo: string, name: string): Promise<void> {
    try {
      this.logger.info(`Deleting label '${name}' from ${owner}/${repo}`);
      await this.octokit.issues.deleteLabel({
        owner,
        repo,
        name,
      });
    } catch (error) {
      throw handleError(error);
    }
  }

  async listMilestones(
    owner: string,
    repo: string,
    state: 'open' | 'closed' | 'all' = 'open',
    perPage = 30,
    page = 1
  ): Promise<Milestone[]> {
    try {
      this.logger.info(`Listing milestones for ${owner}/${repo}`);
      const { data } = await this.octokit.issues.listMilestones({
        owner,
        repo,
        state,
        per_page: perPage,
        page,
      });
      return data as any as Milestone[];
    } catch (error) {
      throw handleError(error);
    }
  }

  async getMilestone(
    owner: string,
    repo: string,
    milestoneNumber: number
  ): Promise<Milestone> {
    try {
      this.logger.info(`Fetching milestone #${milestoneNumber} from ${owner}/${repo}`);
      const { data } = await this.octokit.issues.getMilestone({
        owner,
        repo,
        milestone_number: milestoneNumber,
      });
      return data as any as Milestone;
    } catch (error) {
      throw handleError(error);
    }
  }

  async createMilestone(params: CreateMilestoneParams): Promise<Milestone> {
    try {
      this.logger.info(`Creating milestone '${params.title}' in ${params.owner}/${params.repo}`);
      const { data } = await this.octokit.issues.createMilestone({
        owner: params.owner,
        repo: params.repo,
        title: params.title,
        description: params.description,
        due_on: params.due_on,
        state: params.state,
      });
      return data as any as Milestone;
    } catch (error) {
      throw handleError(error);
    }
  }

  async updateMilestone(params: UpdateMilestoneParams): Promise<Milestone> {
    try {
      this.logger.info(
        `Updating milestone #${params.milestone_number} in ${params.owner}/${params.repo}`
      );
      const { data } = await this.octokit.issues.updateMilestone({
        owner: params.owner,
        repo: params.repo,
        milestone_number: params.milestone_number,
        title: params.title,
        description: params.description,
        due_on: params.due_on,
        state: params.state,
      });
      return data as any as Milestone;
    } catch (error) {
      throw handleError(error);
    }
  }

  async deleteMilestone(
    owner: string,
    repo: string,
    milestoneNumber: number
  ): Promise<void> {
    try {
      this.logger.info(`Deleting milestone #${milestoneNumber} from ${owner}/${repo}`);
      await this.octokit.issues.deleteMilestone({
        owner,
        repo,
        milestone_number: milestoneNumber,
      });
    } catch (error) {
      throw handleError(error);
    }
  }

  async getFileContent(params: GetFileParams): Promise<FileContent> {
    try {
      this.logger.info(`Fetching file content: ${params.path} from ${params.owner}/${params.repo}`);
      const { data } = await this.octokit.repos.getContent({
        owner: params.owner,
        repo: params.repo,
        path: params.path,
        ref: params.ref,
      });
      return data as any as FileContent;
    } catch (error) {
      throw handleError(error);
    }
  }

  async getDirectoryContent(
    owner: string,
    repo: string,
    path: string,
    ref?: string
  ): Promise<FileContent[]> {
    try {
      this.logger.info(`Fetching directory content: ${path} from ${owner}/${repo}`);
      const { data } = await this.octokit.repos.getContent({
        owner,
        repo,
        path,
        ref,
      });
      return data as any as FileContent[];
    } catch (error) {
      throw handleError(error);
    }
  }

  async createFile(params: CreateFileParams): Promise<any> {
    try {
      this.logger.info(`Creating file: ${params.path} in ${params.owner}/${params.repo}`);
      const { data } = await this.octokit.repos.createOrUpdateFileContents({
        owner: params.owner,
        repo: params.repo,
        path: params.path,
        message: params.message,
        content: Buffer.from(params.content).toString('base64'),
        branch: params.branch,
        committer: params.committer,
        author: params.author,
      });
      return data;
    } catch (error) {
      throw handleError(error);
    }
  }

  async updateFile(params: UpdateFileParams): Promise<any> {
    try {
      this.logger.info(`Updating file: ${params.path} in ${params.owner}/${params.repo}`);
      const { data } = await this.octokit.repos.createOrUpdateFileContents({
        owner: params.owner,
        repo: params.repo,
        path: params.path,
        message: params.message,
        content: Buffer.from(params.content).toString('base64'),
        sha: params.sha,
        branch: params.branch,
        committer: params.committer,
        author: params.author,
      });
      return data;
    } catch (error) {
      throw handleError(error);
    }
  }

  async deleteFile(params: DeleteFileParams): Promise<any> {
    try {
      this.logger.info(`Deleting file: ${params.path} from ${params.owner}/${params.repo}`);
      const { data } = await this.octokit.repos.deleteFile({
        owner: params.owner,
        repo: params.repo,
        path: params.path,
        message: params.message,
        sha: params.sha,
        branch: params.branch,
        committer: params.committer,
        author: params.author,
      });
      return data;
    } catch (error) {
      throw handleError(error);
    }
  }

  async getRepositoryTree(
    owner: string,
    repo: string,
    treeSha: string,
    recursive = false
  ): Promise<Tree> {
    try {
      this.logger.info(`Fetching repository tree: ${treeSha} from ${owner}/${repo}`);
      const { data } = await this.octokit.git.getTree({
        owner,
        repo,
        tree_sha: treeSha,
        recursive: recursive ? 'true' : undefined,
      });
      return data as any as Tree;
    } catch (error) {
      throw handleError(error);
    }
  }

  async downloadRepositoryArchive(
    owner: string,
    repo: string,
    archiveFormat: 'tarball' | 'zipball' = 'zipball',
    ref?: string
  ): Promise<any> {
    try {
      this.logger.info(
        `Downloading repository archive: ${owner}/${repo} as ${archiveFormat}`
      );
      const { data } = await this.octokit.repos.downloadArchive({
        owner,
        repo,
        archive_format: archiveFormat,
        ref: ref || 'HEAD',
      });
      return data;
    } catch (error) {
      throw handleError(error);
    }
  }

  async listBranches(owner: string, repo: string, perPage = 100, page = 1): Promise<Branch[]> {
    try {
      this.logger.info(`Listing branches for ${owner}/${repo}`);
      const { data } = await this.octokit.repos.listBranches({
        owner,
        repo,
        per_page: perPage,
        page,
      });
      return data as any as Branch[];
    } catch (error) {
      throw handleError(error);
    }
  }

  async getBranch(owner: string, repo: string, branch: string): Promise<Branch> {
    try {
      this.logger.info(`Fetching branch '${branch}' from ${owner}/${repo}`);
      const { data } = await this.octokit.repos.getBranch({
        owner,
        repo,
        branch,
      });
      return data as any as Branch;
    } catch (error) {
      throw handleError(error);
    }
  }

  async createBranch(params: CreateBranchParams): Promise<any> {
    try {
      this.logger.info(`Creating branch '${params.branch}' in ${params.owner}/${params.repo}`);

      let sha = params.sha;
      if (!sha && params.from_branch) {
        const fromBranch = await this.getBranch(params.owner, params.repo, params.from_branch);
        sha = fromBranch.commit.sha;
      }

      if (!sha) {
        const repo = await this.getRepository(params.owner, params.repo);
        const defaultBranch = await this.getBranch(params.owner, params.repo, repo.default_branch);
        sha = defaultBranch.commit.sha;
      }

      const { data } = await this.octokit.git.createRef({
        owner: params.owner,
        repo: params.repo,
        ref: `refs/heads/${params.branch}`,
        sha,
      });
      return data;
    } catch (error) {
      throw handleError(error);
    }
  }

  async deleteBranch(owner: string, repo: string, branch: string): Promise<void> {
    try {
      this.logger.info(`Deleting branch '${branch}' from ${owner}/${repo}`);
      await this.octokit.git.deleteRef({
        owner,
        repo,
        ref: `heads/${branch}`,
      });
    } catch (error) {
      throw handleError(error);
    }
  }

  async mergeBranch(params: MergeBranchParams): Promise<any> {
    try {
      this.logger.info(
        `Merging branch '${params.head}' into '${params.base}' in ${params.owner}/${params.repo}`
      );
      const { data } = await this.octokit.repos.merge({
        owner: params.owner,
        repo: params.repo,
        base: params.base,
        head: params.head,
        commit_message: params.commit_message,
      });
      return data;
    } catch (error) {
      throw handleError(error);
    }
  }

  async getBranchProtection(
    owner: string,
    repo: string,
    branch: string
  ): Promise<BranchProtection> {
    try {
      this.logger.info(`Fetching branch protection for '${branch}' in ${owner}/${repo}`);
      const { data } = await this.octokit.repos.getBranchProtection({
        owner,
        repo,
        branch,
      });
      return data as any as BranchProtection;
    } catch (error) {
      throw handleError(error);
    }
  }

  async updateBranchProtection(params: UpdateBranchProtectionParams): Promise<any> {
    try {
      this.logger.info(
        `Updating branch protection for '${params.branch}' in ${params.owner}/${params.repo}`
      );
      const { data } = await this.octokit.repos.updateBranchProtection({
        owner: params.owner,
        repo: params.repo,
        branch: params.branch,
        required_status_checks: params.required_status_checks,
        enforce_admins: params.enforce_admins,
        required_pull_request_reviews: params.required_pull_request_reviews,
        restrictions: params.restrictions,
      });
      return data;
    } catch (error) {
      throw handleError(error);
    }
  }

  async deleteBranchProtection(owner: string, repo: string, branch: string): Promise<void> {
    try {
      this.logger.info(`Deleting branch protection for '${branch}' in ${owner}/${repo}`);
      await this.octokit.repos.deleteBranchProtection({
        owner,
        repo,
        branch,
      });
    } catch (error) {
      throw handleError(error);
    }
  }

  async listCommits(params: ListCommitsParams): Promise<Commit[]> {
    try {
      this.logger.info(`Listing commits for ${params.owner}/${params.repo}`);
      const { data } = await this.octokit.repos.listCommits({
        owner: params.owner,
        repo: params.repo,
        sha: params.sha,
        path: params.path,
        author: params.author,
        committer: params.committer,
        since: params.since,
        until: params.until,
        per_page: params.per_page,
        page: params.page,
      });
      return data as any as Commit[];
    } catch (error) {
      throw handleError(error);
    }
  }

  async getCommit(owner: string, repo: string, ref: string): Promise<Commit> {
    try {
      this.logger.info(`Fetching commit ${ref} from ${owner}/${repo}`);
      const { data } = await this.octokit.repos.getCommit({
        owner,
        repo,
        ref,
      });
      return data as any as Commit;
    } catch (error) {
      throw handleError(error);
    }
  }

  async compareCommits(
    owner: string,
    repo: string,
    base: string,
    head: string
  ): Promise<CommitComparison> {
    try {
      this.logger.info(`Comparing commits ${base}...${head} in ${owner}/${repo}`);
      const { data } = await this.octokit.repos.compareCommits({
        owner,
        repo,
        base,
        head,
      });
      return data as any as CommitComparison;
    } catch (error) {
      throw handleError(error);
    }
  }

  async listReferences(
    owner: string,
    repo: string,
    namespace?: string,
    perPage = 100,
    page = 1
  ): Promise<GitReference[]> {
    try {
      this.logger.info(
        `Listing git references${namespace ? ` (${namespace})` : ''} for ${owner}/${repo}`
      );
      const params: any = {
        owner,
        repo,
        per_page: perPage,
        page,
      };
      if (namespace) {
        params.ref = namespace;
        const { data } = await this.octokit.git.listMatchingRefs(params);
        return data as any as GitReference[];
      }
      const { data } = await this.octokit.git.listMatchingRefs({
        owner,
        repo,
        ref: 'heads/',
        per_page: perPage,
        page,
      });
      return data as any as GitReference[];
    } catch (error) {
      throw handleError(error);
    }
  }

  async getReference(owner: string, repo: string, ref: string): Promise<GitReference> {
    try {
      this.logger.info(`Fetching git reference '${ref}' from ${owner}/${repo}`);
      const { data } = await this.octokit.git.getRef({
        owner,
        repo,
        ref,
      });
      return data as any as GitReference;
    } catch (error) {
      throw handleError(error);
    }
  }

  async createReference(params: CreateReferenceParams): Promise<GitReference> {
    try {
      this.logger.info(`Creating git reference '${params.ref}' in ${params.owner}/${params.repo}`);
      const { data } = await this.octokit.git.createRef({
        owner: params.owner,
        repo: params.repo,
        ref: params.ref,
        sha: params.sha,
      });
      return data as any as GitReference;
    } catch (error) {
      throw handleError(error);
    }
  }

  async updateReference(params: UpdateReferenceParams): Promise<GitReference> {
    try {
      this.logger.info(`Updating git reference '${params.ref}' in ${params.owner}/${params.repo}`);
      const { data } = await this.octokit.git.updateRef({
        owner: params.owner,
        repo: params.repo,
        ref: params.ref,
        sha: params.sha,
        force: params.force,
      });
      return data as any as GitReference;
    } catch (error) {
      throw handleError(error);
    }
  }

  async deleteReference(owner: string, repo: string, ref: string): Promise<void> {
    try {
      this.logger.info(`Deleting git reference '${ref}' from ${owner}/${repo}`);
      await this.octokit.git.deleteRef({
        owner,
        repo,
        ref,
      });
    } catch (error) {
      throw handleError(error);
    }
  }

  async createTag(params: CreateTagParams): Promise<GitTag> {
    try {
      this.logger.info(`Creating tag '${params.tag}' in ${params.owner}/${params.repo}`);
      const { data } = await this.octokit.git.createTag({
        owner: params.owner,
        repo: params.repo,
        tag: params.tag,
        message: params.message,
        object: params.object,
        type: params.type,
        tagger: params.tagger,
      });
      return data as any as GitTag;
    } catch (error) {
      throw handleError(error);
    }
  }

  async getTag(owner: string, repo: string, tagSha: string): Promise<GitTag> {
    try {
      this.logger.info(`Fetching tag ${tagSha} from ${owner}/${repo}`);
      const { data } = await this.octokit.git.getTag({
        owner,
        repo,
        tag_sha: tagSha,
      });
      return data as any as GitTag;
    } catch (error) {
      throw handleError(error);
    }
  }

  async listReleases(params: ListReleasesParams): Promise<Release[]> {
    try {
      this.logger.info(`Listing releases for ${params.owner}/${params.repo}`);
      const { data } = await this.octokit.repos.listReleases({
        owner: params.owner,
        repo: params.repo,
        per_page: params.per_page,
        page: params.page,
      });
      return data as any as Release[];
    } catch (error) {
      throw handleError(error);
    }
  }

  async getRelease(owner: string, repo: string, releaseId: number): Promise<Release> {
    try {
      this.logger.info(`Fetching release ${releaseId} from ${owner}/${repo}`);
      const { data } = await this.octokit.repos.getRelease({
        owner,
        repo,
        release_id: releaseId,
      });
      return data as any as Release;
    } catch (error) {
      throw handleError(error);
    }
  }

  async getReleaseByTag(owner: string, repo: string, tag: string): Promise<Release> {
    try {
      this.logger.info(`Fetching release by tag '${tag}' from ${owner}/${repo}`);
      const { data } = await this.octokit.repos.getReleaseByTag({
        owner,
        repo,
        tag,
      });
      return data as any as Release;
    } catch (error) {
      throw handleError(error);
    }
  }

  async getLatestRelease(owner: string, repo: string): Promise<Release> {
    try {
      this.logger.info(`Fetching latest release from ${owner}/${repo}`);
      const { data } = await this.octokit.repos.getLatestRelease({
        owner,
        repo,
      });
      return data as any as Release;
    } catch (error) {
      throw handleError(error);
    }
  }

  async createRelease(params: CreateReleaseParams): Promise<Release> {
    try {
      this.logger.info(`Creating release '${params.tag_name}' in ${params.owner}/${params.repo}`);
      const { data } = await this.octokit.repos.createRelease({
        owner: params.owner,
        repo: params.repo,
        tag_name: params.tag_name,
        target_commitish: params.target_commitish,
        name: params.name,
        body: params.body,
        draft: params.draft,
        prerelease: params.prerelease,
        discussion_category_name: params.discussion_category_name,
        generate_release_notes: params.generate_release_notes,
      });
      return data as any as Release;
    } catch (error) {
      throw handleError(error);
    }
  }

  async updateRelease(params: UpdateReleaseParams): Promise<Release> {
    try {
      this.logger.info(`Updating release ${params.release_id} in ${params.owner}/${params.repo}`);
      const { data } = await this.octokit.repos.updateRelease({
        owner: params.owner,
        repo: params.repo,
        release_id: params.release_id,
        tag_name: params.tag_name,
        target_commitish: params.target_commitish,
        name: params.name,
        body: params.body,
        draft: params.draft,
        prerelease: params.prerelease,
        discussion_category_name: params.discussion_category_name,
      });
      return data as any as Release;
    } catch (error) {
      throw handleError(error);
    }
  }

  async deleteRelease(owner: string, repo: string, releaseId: number): Promise<void> {
    try {
      this.logger.info(`Deleting release ${releaseId} from ${owner}/${repo}`);
      await this.octokit.repos.deleteRelease({
        owner,
        repo,
        release_id: releaseId,
      });
    } catch (error) {
      throw handleError(error);
    }
  }

  async listReleaseAssets(
    owner: string,
    repo: string,
    releaseId: number,
    perPage = 30,
    page = 1
  ): Promise<ReleaseAsset[]> {
    try {
      this.logger.info(`Listing assets for release ${releaseId} in ${owner}/${repo}`);
      const { data } = await this.octokit.repos.listReleaseAssets({
        owner,
        repo,
        release_id: releaseId,
        per_page: perPage,
        page,
      });
      return data as any as ReleaseAsset[];
    } catch (error) {
      throw handleError(error);
    }
  }

  async getReleaseAsset(owner: string, repo: string, assetId: number): Promise<ReleaseAsset> {
    try {
      this.logger.info(`Fetching asset ${assetId} from ${owner}/${repo}`);
      const { data } = await this.octokit.repos.getReleaseAsset({
        owner,
        repo,
        asset_id: assetId,
      });
      return data as any as ReleaseAsset;
    } catch (error) {
      throw handleError(error);
    }
  }

  async uploadReleaseAsset(params: UploadReleaseAssetParams): Promise<ReleaseAsset> {
    try {
      this.logger.info(
        `Uploading asset '${params.name}' to release ${params.release_id} in ${params.owner}/${params.repo}`
      );
      const { data } = await this.octokit.repos.uploadReleaseAsset({
        owner: params.owner,
        repo: params.repo,
        release_id: params.release_id,
        name: params.name,
        data: params.data as any,
        label: params.label,
      });
      return data as any as ReleaseAsset;
    } catch (error) {
      throw handleError(error);
    }
  }

  async updateReleaseAsset(
    owner: string,
    repo: string,
    assetId: number,
    name?: string,
    label?: string
  ): Promise<ReleaseAsset> {
    try {
      this.logger.info(`Updating asset ${assetId} in ${owner}/${repo}`);
      const { data } = await this.octokit.repos.updateReleaseAsset({
        owner,
        repo,
        asset_id: assetId,
        name,
        label,
      });
      return data as any as ReleaseAsset;
    } catch (error) {
      throw handleError(error);
    }
  }

  async deleteReleaseAsset(owner: string, repo: string, assetId: number): Promise<void> {
    try {
      this.logger.info(`Deleting asset ${assetId} from ${owner}/${repo}`);
      await this.octokit.repos.deleteReleaseAsset({
        owner,
        repo,
        asset_id: assetId,
      });
    } catch (error) {
      throw handleError(error);
    }
  }

  async generateReleaseNotes(params: GenerateReleaseNotesParams): Promise<GeneratedReleaseNotes> {
    try {
      this.logger.info(
        `Generating release notes for tag '${params.tag_name}' in ${params.owner}/${params.repo}`
      );
      const { data } = await this.octokit.repos.generateReleaseNotes({
        owner: params.owner,
        repo: params.repo,
        tag_name: params.tag_name,
        target_commitish: params.target_commitish,
        previous_tag_name: params.previous_tag_name,
        configuration_file_path: params.configuration_file_path,
      });
      return data as any as GeneratedReleaseNotes;
    } catch (error) {
      throw handleError(error);
    }
  }

  async listWorkflows(params: ListWorkflowsParams): Promise<Workflow[]> {
    try {
      this.logger.info(`Listing workflows for ${params.owner}/${params.repo}`);
      const { data } = await this.octokit.actions.listRepoWorkflows({
        owner: params.owner,
        repo: params.repo,
        per_page: params.per_page,
        page: params.page,
      });
      return data.workflows as any as Workflow[];
    } catch (error) {
      throw handleError(error);
    }
  }

  async getWorkflow(owner: string, repo: string, workflowId: number | string): Promise<Workflow> {
    try {
      this.logger.info(`Fetching workflow ${workflowId} from ${owner}/${repo}`);
      const { data } = await this.octokit.actions.getWorkflow({
        owner,
        repo,
        workflow_id: workflowId,
      });
      return data as any as Workflow;
    } catch (error) {
      throw handleError(error);
    }
  }

  async listWorkflowRuns(params: ListWorkflowRunsParams): Promise<WorkflowRun[]> {
    try {
      this.logger.info(`Listing workflow runs for ${params.owner}/${params.repo}`);
      const requestParams: any = {
        owner: params.owner,
        repo: params.repo,
        per_page: params.per_page,
        page: params.page,
      };

      if (params.actor) requestParams.actor = params.actor;
      if (params.branch) requestParams.branch = params.branch;
      if (params.event) requestParams.event = params.event;
      if (params.status) requestParams.status = params.status;
      if (params.created) requestParams.created = params.created;
      if (params.exclude_pull_requests !== undefined) requestParams.exclude_pull_requests = params.exclude_pull_requests;
      if (params.check_suite_id) requestParams.check_suite_id = params.check_suite_id;
      if (params.head_sha) requestParams.head_sha = params.head_sha;

      let response;
      if (params.workflow_id) {
        response = await this.octokit.actions.listWorkflowRuns({
          ...requestParams,
          workflow_id: params.workflow_id,
        });
      } else {
        response = await this.octokit.actions.listWorkflowRunsForRepo(requestParams);
      }

      return response.data.workflow_runs as any as WorkflowRun[];
    } catch (error) {
      throw handleError(error);
    }
  }

  async getWorkflowRun(owner: string, repo: string, runId: number): Promise<WorkflowRun> {
    try {
      this.logger.info(`Fetching workflow run ${runId} from ${owner}/${repo}`);
      const { data } = await this.octokit.actions.getWorkflowRun({
        owner,
        repo,
        run_id: runId,
      });
      return data as any as WorkflowRun;
    } catch (error) {
      throw handleError(error);
    }
  }

  async rerunWorkflow(owner: string, repo: string, runId: number): Promise<void> {
    try {
      this.logger.info(`Re-running workflow ${runId} in ${owner}/${repo}`);
      await this.octokit.actions.reRunWorkflow({
        owner,
        repo,
        run_id: runId,
      });
    } catch (error) {
      throw handleError(error);
    }
  }

  async rerunFailedJobs(owner: string, repo: string, runId: number): Promise<void> {
    try {
      this.logger.info(`Re-running failed jobs for workflow ${runId} in ${owner}/${repo}`);
      await this.octokit.actions.reRunWorkflowFailedJobs({
        owner,
        repo,
        run_id: runId,
      });
    } catch (error) {
      throw handleError(error);
    }
  }

  async cancelWorkflowRun(owner: string, repo: string, runId: number): Promise<void> {
    try {
      this.logger.info(`Cancelling workflow run ${runId} in ${owner}/${repo}`);
      await this.octokit.actions.cancelWorkflowRun({
        owner,
        repo,
        run_id: runId,
      });
    } catch (error) {
      throw handleError(error);
    }
  }

  async deleteWorkflowRun(owner: string, repo: string, runId: number): Promise<void> {
    try {
      this.logger.info(`Deleting workflow run ${runId} from ${owner}/${repo}`);
      await this.octokit.actions.deleteWorkflowRun({
        owner,
        repo,
        run_id: runId,
      });
    } catch (error) {
      throw handleError(error);
    }
  }

  async listWorkflowJobs(params: ListWorkflowJobsParams): Promise<WorkflowJob[]> {
    try {
      this.logger.info(`Listing jobs for workflow run ${params.run_id} in ${params.owner}/${params.repo}`);
      const { data } = await this.octokit.actions.listJobsForWorkflowRun({
        owner: params.owner,
        repo: params.repo,
        run_id: params.run_id,
        filter: params.filter,
        per_page: params.per_page,
        page: params.page,
      });
      return data.jobs as any as WorkflowJob[];
    } catch (error) {
      throw handleError(error);
    }
  }

  async getWorkflowJob(owner: string, repo: string, jobId: number): Promise<WorkflowJob> {
    try {
      this.logger.info(`Fetching job ${jobId} from ${owner}/${repo}`);
      const { data } = await this.octokit.actions.getJobForWorkflowRun({
        owner,
        repo,
        job_id: jobId,
      });
      return data as any as WorkflowJob;
    } catch (error) {
      throw handleError(error);
    }
  }

  async downloadJobLogs(owner: string, repo: string, jobId: number): Promise<string> {
    try {
      this.logger.info(`Downloading logs for job ${jobId} from ${owner}/${repo}`);
      const { data } = await this.octokit.actions.downloadJobLogsForWorkflowRun({
        owner,
        repo,
        job_id: jobId,
      });
      return data as any as string;
    } catch (error) {
      throw handleError(error);
    }
  }

  async downloadWorkflowRunLogs(owner: string, repo: string, runId: number): Promise<string> {
    try {
      this.logger.info(`Downloading logs for workflow run ${runId} from ${owner}/${repo}`);
      const { data } = await this.octokit.actions.downloadWorkflowRunLogs({
        owner,
        repo,
        run_id: runId,
      });
      return data as any as string;
    } catch (error) {
      throw handleError(error);
    }
  }

  async deleteWorkflowRunLogs(owner: string, repo: string, runId: number): Promise<void> {
    try {
      this.logger.info(`Deleting logs for workflow run ${runId} from ${owner}/${repo}`);
      await this.octokit.actions.deleteWorkflowRunLogs({
        owner,
        repo,
        run_id: runId,
      });
    } catch (error) {
      throw handleError(error);
    }
  }

  async listArtifacts(params: ListArtifactsParams): Promise<Artifact[]> {
    try {
      this.logger.info(`Listing artifacts for ${params.owner}/${params.repo}`);
      let response;

      if (params.run_id) {
        response = await this.octokit.actions.listWorkflowRunArtifacts({
          owner: params.owner,
          repo: params.repo,
          run_id: params.run_id,
          per_page: params.per_page,
          page: params.page,
          name: params.name,
        });
      } else {
        response = await this.octokit.actions.listArtifactsForRepo({
          owner: params.owner,
          repo: params.repo,
          per_page: params.per_page,
          page: params.page,
          name: params.name,
        });
      }

      return response.data.artifacts as any as Artifact[];
    } catch (error) {
      throw handleError(error);
    }
  }

  async getArtifact(owner: string, repo: string, artifactId: number): Promise<Artifact> {
    try {
      this.logger.info(`Fetching artifact ${artifactId} from ${owner}/${repo}`);
      const { data } = await this.octokit.actions.getArtifact({
        owner,
        repo,
        artifact_id: artifactId,
      });
      return data as any as Artifact;
    } catch (error) {
      throw handleError(error);
    }
  }

  async downloadArtifact(owner: string, repo: string, artifactId: number): Promise<ArrayBuffer> {
    try {
      this.logger.info(`Downloading artifact ${artifactId} from ${owner}/${repo}`);
      const { data } = await this.octokit.actions.downloadArtifact({
        owner,
        repo,
        artifact_id: artifactId,
        archive_format: 'zip',
      });
      return data as any as ArrayBuffer;
    } catch (error) {
      throw handleError(error);
    }
  }

  async deleteArtifact(owner: string, repo: string, artifactId: number): Promise<void> {
    try {
      this.logger.info(`Deleting artifact ${artifactId} from ${owner}/${repo}`);
      await this.octokit.actions.deleteArtifact({
        owner,
        repo,
        artifact_id: artifactId,
      });
    } catch (error) {
      throw handleError(error);
    }
  }

  async createWorkflowDispatch(params: CreateWorkflowDispatchParams): Promise<void> {
    try {
      this.logger.info(`Triggering workflow ${params.workflow_id} in ${params.owner}/${params.repo}`);
      await this.octokit.actions.createWorkflowDispatch({
        owner: params.owner,
        repo: params.repo,
        workflow_id: params.workflow_id,
        ref: params.ref,
        inputs: params.inputs,
      });
    } catch (error) {
      throw handleError(error);
    }
  }

  async getWorkflowUsage(owner: string, repo: string, workflowId: number | string): Promise<WorkflowUsage> {
    try {
      this.logger.info(`Fetching usage for workflow ${workflowId} in ${owner}/${repo}`);
      const { data } = await this.octokit.actions.getWorkflowUsage({
        owner,
        repo,
        workflow_id: workflowId,
      });
      return data as any as WorkflowUsage;
    } catch (error) {
      throw handleError(error);
    }
  }

  async getWorkflowRunUsage(owner: string, repo: string, runId: number): Promise<WorkflowRunUsage> {
    try {
      this.logger.info(`Fetching usage for workflow run ${runId} in ${owner}/${repo}`);
      const { data } = await this.octokit.actions.getWorkflowRunUsage({
        owner,
        repo,
        run_id: runId,
      });
      return data as any as WorkflowRunUsage;
    } catch (error) {
      throw handleError(error);
    }
  }

  async searchRepositories(params: SearchRepositoriesParams): Promise<SearchResults<RepositorySearchResult>> {
    try {
      this.logger.info(`Searching repositories with query: ${params.q}`);
      const { data } = await this.octokit.search.repos({
        q: params.q,
        sort: params.sort,
        order: params.order,
        per_page: params.per_page,
        page: params.page,
      });
      return data as any as SearchResults<RepositorySearchResult>;
    } catch (error) {
      throw handleError(error);
    }
  }

  async searchCode(params: SearchCodeParams): Promise<SearchResults<CodeSearchResult>> {
    try {
      this.logger.info(`Searching code with query: ${params.q}`);
      const { data } = await this.octokit.search.code({
        q: params.q,
        sort: params.sort,
        order: params.order,
        per_page: params.per_page,
        page: params.page,
      });
      return data as any as SearchResults<CodeSearchResult>;
    } catch (error) {
      throw handleError(error);
    }
  }

  async searchCommits(params: SearchCommitsParams): Promise<SearchResults<CommitSearchResult>> {
    try {
      this.logger.info(`Searching commits with query: ${params.q}`);
      const { data } = await this.octokit.search.commits({
        q: params.q,
        sort: params.sort,
        order: params.order,
        per_page: params.per_page,
        page: params.page,
      });
      return data as any as SearchResults<CommitSearchResult>;
    } catch (error) {
      throw handleError(error);
    }
  }

  async searchIssuesAndPullRequests(params: SearchIssuesParams): Promise<SearchResults<IssueSearchResult>> {
    try {
      this.logger.info(`Searching issues/PRs with query: ${params.q}`);
      const { data } = await this.octokit.search.issuesAndPullRequests({
        q: params.q,
        sort: params.sort,
        order: params.order,
        per_page: params.per_page,
        page: params.page,
      });
      return data as any as SearchResults<IssueSearchResult>;
    } catch (error) {
      throw handleError(error);
    }
  }

  async searchUsers(params: SearchUsersParams): Promise<SearchResults<UserSearchResult>> {
    try {
      this.logger.info(`Searching users with query: ${params.q}`);
      const { data } = await this.octokit.search.users({
        q: params.q,
        sort: params.sort,
        order: params.order,
        per_page: params.per_page,
        page: params.page,
      });
      return data as any as SearchResults<UserSearchResult>;
    } catch (error) {
      throw handleError(error);
    }
  }

  async searchTopics(params: SearchTopicsParams): Promise<SearchResults<TopicSearchResult>> {
    try {
      this.logger.info(`Searching topics with query: ${params.q}`);
      const { data } = await this.octokit.search.topics({
        q: params.q,
        per_page: params.per_page,
        page: params.page,
      });
      return data as any as SearchResults<TopicSearchResult>;
    } catch (error) {
      throw handleError(error);
    }
  }

  async searchLabels(params: SearchLabelsParams): Promise<SearchResults<LabelSearchResult>> {
    try {
      this.logger.info(`Searching labels in repository ${params.repository_id} with query: ${params.q}`);
      const { data } = await this.octokit.search.labels({
        repository_id: params.repository_id,
        q: params.q,
        sort: params.sort,
        order: params.order,
        per_page: params.per_page,
        page: params.page,
      });
      return data as any as SearchResults<LabelSearchResult>;
    } catch (error) {
      throw handleError(error);
    }
  }

  async listWebhooks(params: ListWebhooksParams): Promise<Webhook[]> {
    try {
      this.logger.info(`Listing webhooks for ${params.owner}/${params.repo}`);
      const { data } = await this.octokit.repos.listWebhooks({
        owner: params.owner,
        repo: params.repo,
        per_page: params.per_page,
        page: params.page,
      });
      return data as any as Webhook[];
    } catch (error) {
      throw handleError(error);
    }
  }

  async getWebhook(owner: string, repo: string, hookId: number): Promise<Webhook> {
    try {
      this.logger.info(`Getting webhook ${hookId} for ${owner}/${repo}`);
      const { data } = await this.octokit.repos.getWebhook({
        owner,
        repo,
        hook_id: hookId,
      });
      return data as any as Webhook;
    } catch (error) {
      throw handleError(error);
    }
  }

  async createWebhook(params: CreateWebhookParams): Promise<Webhook> {
    try {
      this.logger.info(`Creating webhook for ${params.owner}/${params.repo}`);
      const { data } = await this.octokit.repos.createWebhook({
        owner: params.owner,
        repo: params.repo,
        config: params.config,
        events: params.events || ['push'],
        active: params.active !== undefined ? params.active : true,
      });
      return data as any as Webhook;
    } catch (error) {
      throw handleError(error);
    }
  }

  async updateWebhook(params: UpdateWebhookParams): Promise<Webhook> {
    try {
      this.logger.info(`Updating webhook ${params.hook_id} for ${params.owner}/${params.repo}`);
      const { data } = await this.octokit.repos.updateWebhook({
        owner: params.owner,
        repo: params.repo,
        hook_id: params.hook_id,
        config: params.config,
        events: params.events,
        active: params.active,
        add_events: params.add_events,
        remove_events: params.remove_events,
      });
      return data as any as Webhook;
    } catch (error) {
      throw handleError(error);
    }
  }

  async deleteWebhook(owner: string, repo: string, hookId: number): Promise<void> {
    try {
      this.logger.info(`Deleting webhook ${hookId} for ${owner}/${repo}`);
      await this.octokit.repos.deleteWebhook({
        owner,
        repo,
        hook_id: hookId,
      });
    } catch (error) {
      throw handleError(error);
    }
  }

  async pingWebhook(owner: string, repo: string, hookId: number): Promise<void> {
    try {
      this.logger.info(`Pinging webhook ${hookId} for ${owner}/${repo}`);
      await this.octokit.repos.pingWebhook({
        owner,
        repo,
        hook_id: hookId,
      });
    } catch (error) {
      throw handleError(error);
    }
  }

  async testWebhook(owner: string, repo: string, hookId: number): Promise<void> {
    try {
      this.logger.info(`Testing webhook ${hookId} for ${owner}/${repo}`);
      await this.octokit.repos.testPushWebhook({
        owner,
        repo,
        hook_id: hookId,
      });
    } catch (error) {
      throw handleError(error);
    }
  }

  async listWebhookDeliveries(params: ListWebhookDeliveriesParams): Promise<WebhookDelivery[]> {
    try {
      this.logger.info(`Listing deliveries for webhook ${params.hook_id} in ${params.owner}/${params.repo}`);
      const { data } = await this.octokit.repos.listWebhookDeliveries({
        owner: params.owner,
        repo: params.repo,
        hook_id: params.hook_id,
        per_page: params.per_page,
        cursor: params.cursor,
        redelivery: params.redelivery,
      });
      return data as any as WebhookDelivery[];
    } catch (error) {
      throw handleError(error);
    }
  }

  async getWebhookDelivery(
    owner: string,
    repo: string,
    hookId: number,
    deliveryId: number
  ): Promise<WebhookDelivery> {
    try {
      this.logger.info(`Getting delivery ${deliveryId} for webhook ${hookId} in ${owner}/${repo}`);
      const { data } = await this.octokit.repos.getWebhookDelivery({
        owner,
        repo,
        hook_id: hookId,
        delivery_id: deliveryId,
      });
      return data as any as WebhookDelivery;
    } catch (error) {
      throw handleError(error);
    }
  }

  async redeliverWebhook(
    owner: string,
    repo: string,
    hookId: number,
    deliveryId: number
  ): Promise<void> {
    try {
      this.logger.info(`Redelivering webhook ${hookId} delivery ${deliveryId} for ${owner}/${repo}`);
      await this.octokit.repos.redeliverWebhookDelivery({
        owner,
        repo,
        hook_id: hookId,
        delivery_id: deliveryId,
      });
    } catch (error) {
      throw handleError(error);
    }
  }

  async updateRepository(params: UpdateRepositoryParams): Promise<Repository> {
    try {
      this.logger.info(`Updating repository ${params.owner}/${params.repo}`);
      const { data } = await this.octokit.repos.update({
        owner: params.owner,
        repo: params.repo,
        name: params.name,
        description: params.description,
        homepage: params.homepage,
        private: params.private,
        has_issues: params.has_issues,
        has_projects: params.has_projects,
        has_wiki: params.has_wiki,
        has_downloads: params.has_downloads,
        is_template: params.is_template,
        default_branch: params.default_branch,
        allow_squash_merge: params.allow_squash_merge,
        allow_merge_commit: params.allow_merge_commit,
        allow_rebase_merge: params.allow_rebase_merge,
        allow_auto_merge: params.allow_auto_merge,
        delete_branch_on_merge: params.delete_branch_on_merge,
        allow_update_branch: params.allow_update_branch,
        use_squash_pr_title_as_default: params.use_squash_pr_title_as_default,
        squash_merge_commit_title: params.squash_merge_commit_title,
        squash_merge_commit_message: params.squash_merge_commit_message,
        merge_commit_title: params.merge_commit_title,
        merge_commit_message: params.merge_commit_message,
        archived: params.archived,
        allow_forking: params.allow_forking,
        web_commit_signoff_required: params.web_commit_signoff_required,
      } as any);
      return data as any as Repository;
    } catch (error) {
      throw handleError(error);
    }
  }

  async getRepositoryTopics(owner: string, repo: string): Promise<RepositoryTopics> {
    try {
      this.logger.info(`Getting topics for ${owner}/${repo}`);
      const { data } = await this.octokit.repos.getAllTopics({
        owner,
        repo,
      });
      return data as any as RepositoryTopics;
    } catch (error) {
      throw handleError(error);
    }
  }

  async replaceRepositoryTopics(owner: string, repo: string, topics: string[]): Promise<RepositoryTopics> {
    try {
      this.logger.info(`Replacing topics for ${owner}/${repo}`);
      const { data } = await this.octokit.repos.replaceAllTopics({
        owner,
        repo,
        names: topics,
      });
      return data as any as RepositoryTopics;
    } catch (error) {
      throw handleError(error);
    }
  }

  async listCollaborators(params: ListCollaboratorsParams): Promise<Collaborator[]> {
    try {
      this.logger.info(`Listing collaborators for ${params.owner}/${params.repo}`);
      const { data } = await this.octokit.repos.listCollaborators({
        owner: params.owner,
        repo: params.repo,
        affiliation: params.affiliation,
        permission: params.permission,
        per_page: params.per_page,
        page: params.page,
      });
      return data as any as Collaborator[];
    } catch (error) {
      throw handleError(error);
    }
  }

  async checkCollaborator(owner: string, repo: string, username: string): Promise<boolean> {
    try {
      this.logger.info(`Checking if ${username} is a collaborator on ${owner}/${repo}`);
      await this.octokit.repos.checkCollaborator({
        owner,
        repo,
        username,
      });
      return true;
    } catch (error: any) {
      if (error.status === 404) {
        return false;
      }
      throw handleError(error);
    }
  }

  async addCollaborator(params: AddCollaboratorParams): Promise<RepositoryInvitation | null> {
    try {
      this.logger.info(`Adding ${params.username} as collaborator to ${params.owner}/${params.repo}`);
      const { data } = await this.octokit.repos.addCollaborator({
        owner: params.owner,
        repo: params.repo,
        username: params.username,
        permission: params.permission,
      });
      return data as any as RepositoryInvitation | null;
    } catch (error) {
      throw handleError(error);
    }
  }

  async removeCollaborator(owner: string, repo: string, username: string): Promise<void> {
    try {
      this.logger.info(`Removing ${username} from ${owner}/${repo}`);
      await this.octokit.repos.removeCollaborator({
        owner,
        repo,
        username,
      });
    } catch (error) {
      throw handleError(error);
    }
  }

  async getCollaboratorPermission(owner: string, repo: string, username: string): Promise<string> {
    try {
      this.logger.info(`Getting permission level for ${username} on ${owner}/${repo}`);
      const { data } = await this.octokit.repos.getCollaboratorPermissionLevel({
        owner,
        repo,
        username,
      });
      return data.permission;
    } catch (error) {
      throw handleError(error);
    }
  }

  async listRepositoryInvitations(owner: string, repo: string, perPage = 30, page = 1): Promise<RepositoryInvitation[]> {
    try {
      this.logger.info(`Listing invitations for ${owner}/${repo}`);
      const { data } = await this.octokit.repos.listInvitations({
        owner,
        repo,
        per_page: perPage,
        page,
      });
      return data as any as RepositoryInvitation[];
    } catch (error) {
      throw handleError(error);
    }
  }

  async deleteRepositoryInvitation(owner: string, repo: string, invitationId: number): Promise<void> {
    try {
      this.logger.info(`Deleting invitation ${invitationId} for ${owner}/${repo}`);
      await this.octokit.repos.deleteInvitation({
        owner,
        repo,
        invitation_id: invitationId,
      });
    } catch (error) {
      throw handleError(error);
    }
  }

  async getRepositoryLanguages(owner: string, repo: string): Promise<RepositoryLanguages> {
    try {
      this.logger.info(`Getting languages for ${owner}/${repo}`);
      const { data } = await this.octokit.repos.listLanguages({
        owner,
        repo,
      });
      return data as RepositoryLanguages;
    } catch (error) {
      throw handleError(error);
    }
  }

  async getCodeFrequencyStats(owner: string, repo: string): Promise<CodeFrequency[]> {
    try {
      this.logger.info(`Getting code frequency stats for ${owner}/${repo}`);
      const { data } = await this.octokit.repos.getCodeFrequencyStats({
        owner,
        repo,
      });
      return (data as any[]).map(([week, additions, deletions]) => ({
        week,
        additions,
        deletions,
      }));
    } catch (error) {
      throw handleError(error);
    }
  }

  async getContributorsStats(owner: string, repo: string): Promise<ContributorActivity[]> {
    try {
      this.logger.info(`Getting contributor stats for ${owner}/${repo}`);
      const { data } = await this.octokit.repos.getContributorsStats({
        owner,
        repo,
      });
      return data as any as ContributorActivity[];
    } catch (error) {
      throw handleError(error);
    }
  }

  async getParticipationStats(owner: string, repo: string): Promise<ParticipationStats> {
    try {
      this.logger.info(`Getting participation stats for ${owner}/${repo}`);
      const { data } = await this.octokit.repos.getParticipationStats({
        owner,
        repo,
      });
      return data as any as ParticipationStats;
    } catch (error) {
      throw handleError(error);
    }
  }

  async transferRepository(params: TransferRepositoryParams): Promise<Repository> {
    try {
      this.logger.info(`Transferring ${params.owner}/${params.repo} to ${params.new_owner}`);
      const { data } = await this.octokit.repos.transfer({
        owner: params.owner,
        repo: params.repo,
        new_owner: params.new_owner,
        team_ids: params.team_ids,
      });
      return data as any as Repository;
    } catch (error) {
      throw handleError(error);
    }
  }

  async listRepositoryTeams(owner: string, repo: string, perPage = 30, page = 1): Promise<RepositoryTeam[]> {
    try {
      this.logger.info(`Listing teams for ${owner}/${repo}`);
      const { data } = await this.octokit.repos.listTeams({
        owner,
        repo,
        per_page: perPage,
        page,
      });
      return data as any as RepositoryTeam[];
    } catch (error) {
      throw handleError(error);
    }
  }

  async checkTeamPermission(owner: string, repo: string, teamSlug: string): Promise<RepositoryTeam | null> {
    try {
      this.logger.info(`Checking team ${teamSlug} permission for ${owner}/${repo}`);
      const { data } = await this.octokit.teams.checkPermissionsForRepoInOrg({
        org: owner,
        team_slug: teamSlug,
        owner,
        repo,
      });
      return data as any as RepositoryTeam;
    } catch (error: any) {
      if (error.status === 404) {
        return null;
      }
      throw handleError(error);
    }
  }

  async addRepositoryTeam(params: AddRepositoryTeamParams): Promise<void> {
    try {
      this.logger.info(`Adding team ${params.team_slug} to ${params.owner}/${params.repo}`);
      await this.octokit.teams.addOrUpdateRepoPermissionsInOrg({
        org: params.owner,
        team_slug: params.team_slug,
        owner: params.owner,
        repo: params.repo,
        permission: params.permission,
      });
    } catch (error) {
      throw handleError(error);
    }
  }

  async removeRepositoryTeam(owner: string, repo: string, teamSlug: string): Promise<void> {
    try {
      this.logger.info(`Removing team ${teamSlug} from ${owner}/${repo}`);
      await this.octokit.teams.removeRepoInOrg({
        org: owner,
        team_slug: teamSlug,
        owner,
        repo,
      });
    } catch (error) {
      throw handleError(error);
    }
  }

  async enableAutomatedSecurityFixes(owner: string, repo: string): Promise<void> {
    try {
      this.logger.info(`Enabling automated security fixes for ${owner}/${repo}`);
      await this.octokit.repos.enableAutomatedSecurityFixes({
        owner,
        repo,
      });
    } catch (error) {
      throw handleError(error);
    }
  }

  async disableAutomatedSecurityFixes(owner: string, repo: string): Promise<void> {
    try {
      this.logger.info(`Disabling automated security fixes for ${owner}/${repo}`);
      await this.octokit.repos.disableAutomatedSecurityFixes({
        owner,
        repo,
      });
    } catch (error) {
      throw handleError(error);
    }
  }

  async enableVulnerabilityAlerts(owner: string, repo: string): Promise<void> {
    try {
      this.logger.info(`Enabling vulnerability alerts for ${owner}/${repo}`);
      await this.octokit.repos.enableVulnerabilityAlerts({
        owner,
        repo,
      });
    } catch (error) {
      throw handleError(error);
    }
  }

  async disableVulnerabilityAlerts(owner: string, repo: string): Promise<void> {
    try {
      this.logger.info(`Disabling vulnerability alerts for ${owner}/${repo}`);
      await this.octokit.repos.disableVulnerabilityAlerts({
        owner,
        repo,
      });
    } catch (error) {
      throw handleError(error);
    }
  }
}
