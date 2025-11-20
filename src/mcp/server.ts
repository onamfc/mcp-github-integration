import { GitHubClient } from '../github/client.js';
import { Logger } from '../utils/logger.js';
import { tools } from './tools.js';
import type { MCPRequest, MCPResponse, MCPToolDefinition } from '../types/mcp.js';

export class MCPServer {
  private client: GitHubClient;
  private logger: Logger;

  constructor(githubToken: string) {
    this.logger = new Logger('MCPServer');
    this.client = new GitHubClient({ token: githubToken });
    this.logger.info('MCP Server initialized');
  }

  getTools(): MCPToolDefinition[] {
    return tools;
  }

  async handleRequest(request: MCPRequest): Promise<MCPResponse> {
    try {
      this.logger.info(`Handling MCP request: ${request.method}`);

      const handler = this.getMethodHandler(request.method);
      if (!handler) {
        return {
          success: false,
          error: {
            code: 'METHOD_NOT_FOUND',
            message: `Method '${request.method}' not found`,
          },
        };
      }

      const result = await handler(request.params);
      return {
        success: true,
        data: result,
      };
    } catch (error: any) {
      this.logger.error(`Error handling request: ${request.method}`, error);
      return {
        success: false,
        error: {
          code: error.code || 'INTERNAL_ERROR',
          message: error.message || 'An internal error occurred',
          details: error.details,
        },
      };
    }
  }

  private getMethodHandler(method: string): ((params: any) => Promise<any>) | null {
    const handlers: Record<string, (params: any) => Promise<any>> = {
      github_get_repository: (params) =>
        this.client.getRepository(params.owner, params.repo),

      github_list_repositories: (params) =>
        this.client.listRepositories(params.username),

      github_create_repository: (params) =>
        this.client.createRepository({
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
        }),

      github_delete_repository: (params) =>
        this.client.deleteRepository(params.owner, params.repo),

      github_create_issue: (params) =>
        this.client.createIssue({
          owner: params.owner,
          repo: params.repo,
          title: params.title,
          body: params.body,
          labels: params.labels,
          assignees: params.assignees,
        }),

      github_list_issues: (params) =>
        this.client.listIssues({
          owner: params.owner,
          repo: params.repo,
          state: params.state,
          labels: params.labels,
          per_page: params.per_page,
          page: params.page,
        }),

      github_get_issue: (params) =>
        this.client.getIssue(params.owner, params.repo, params.issue_number),

      github_update_issue: (params) =>
        this.client.updateIssue(params.owner, params.repo, params.issue_number, {
          title: params.title,
          body: params.body,
          labels: params.labels,
        }),

      github_close_issue: (params) =>
        this.client.closeIssue(params.owner, params.repo, params.issue_number),

      github_create_pull_request: (params) =>
        this.client.createPullRequest({
          owner: params.owner,
          repo: params.repo,
          title: params.title,
          body: params.body,
          head: params.head,
          base: params.base,
        }),

      github_list_pull_requests: (params) =>
        this.client.listPullRequests({
          owner: params.owner,
          repo: params.repo,
          state: params.state,
          per_page: params.per_page,
          page: params.page,
        }),

      github_get_pull_request: (params) =>
        this.client.getPullRequest(params.owner, params.repo, params.pull_number),

      github_merge_pull_request: (params) =>
        this.client.mergePullRequest(
          params.owner,
          params.repo,
          params.pull_number,
          params.commit_message
        ),

      github_get_authenticated_user: () =>
        this.client.getAuthenticatedUser(),

      github_list_issue_comments: (params) =>
        this.client.listIssueComments(
          params.owner,
          params.repo,
          params.issue_number,
          params.per_page,
          params.page
        ),

      github_create_issue_comment: (params) =>
        this.client.createIssueComment({
          owner: params.owner,
          repo: params.repo,
          issue_number: params.issue_number,
          body: params.body,
        }),

      github_update_issue_comment: (params) =>
        this.client.updateIssueComment({
          owner: params.owner,
          repo: params.repo,
          comment_id: params.comment_id,
          body: params.body,
        }),

      github_delete_issue_comment: (params) =>
        this.client.deleteIssueComment(params.owner, params.repo, params.comment_id),

      github_list_pull_request_comments: (params) =>
        this.client.listPullRequestComments(
          params.owner,
          params.repo,
          params.pull_number,
          params.per_page,
          params.page
        ),

      github_create_pull_request_comment: (params) =>
        this.client.createPullRequestComment(
          params.owner,
          params.repo,
          params.pull_number,
          params.body,
          params.commit_id,
          params.path,
          params.position
        ),

      github_list_labels: (params) =>
        this.client.listLabels(params.owner, params.repo, params.per_page, params.page),

      github_get_label: (params) =>
        this.client.getLabel(params.owner, params.repo, params.name),

      github_create_label: (params) =>
        this.client.createLabel({
          owner: params.owner,
          repo: params.repo,
          name: params.name,
          color: params.color,
          description: params.description,
        }),

      github_update_label: (params) =>
        this.client.updateLabel({
          owner: params.owner,
          repo: params.repo,
          name: params.name,
          new_name: params.new_name,
          color: params.color,
          description: params.description,
        }),

      github_delete_label: (params) =>
        this.client.deleteLabel(params.owner, params.repo, params.name),

      github_list_milestones: (params) =>
        this.client.listMilestones(
          params.owner,
          params.repo,
          params.state,
          params.per_page,
          params.page
        ),

      github_get_milestone: (params) =>
        this.client.getMilestone(params.owner, params.repo, params.milestone_number),

      github_create_milestone: (params) =>
        this.client.createMilestone({
          owner: params.owner,
          repo: params.repo,
          title: params.title,
          description: params.description,
          due_on: params.due_on,
          state: params.state,
        }),

      github_update_milestone: (params) =>
        this.client.updateMilestone({
          owner: params.owner,
          repo: params.repo,
          milestone_number: params.milestone_number,
          title: params.title,
          description: params.description,
          due_on: params.due_on,
          state: params.state,
        }),

      github_delete_milestone: (params) =>
        this.client.deleteMilestone(params.owner, params.repo, params.milestone_number),

      github_get_file_content: (params) =>
        this.client.getFileContent({
          owner: params.owner,
          repo: params.repo,
          path: params.path,
          ref: params.ref,
        }),

      github_get_directory_content: (params) =>
        this.client.getDirectoryContent(params.owner, params.repo, params.path, params.ref),

      github_create_file: (params) =>
        this.client.createFile({
          owner: params.owner,
          repo: params.repo,
          path: params.path,
          message: params.message,
          content: params.content,
          branch: params.branch,
          committer: params.committer,
          author: params.author,
        }),

      github_update_file: (params) =>
        this.client.updateFile({
          owner: params.owner,
          repo: params.repo,
          path: params.path,
          message: params.message,
          content: params.content,
          sha: params.sha,
          branch: params.branch,
          committer: params.committer,
          author: params.author,
        }),

      github_delete_file: (params) =>
        this.client.deleteFile({
          owner: params.owner,
          repo: params.repo,
          path: params.path,
          message: params.message,
          sha: params.sha,
          branch: params.branch,
          committer: params.committer,
          author: params.author,
        }),

      github_get_repository_tree: (params) =>
        this.client.getRepositoryTree(
          params.owner,
          params.repo,
          params.tree_sha,
          params.recursive
        ),

      github_download_repository_archive: (params) =>
        this.client.downloadRepositoryArchive(
          params.owner,
          params.repo,
          params.archive_format,
          params.ref
        ),

      github_list_branches: (params) =>
        this.client.listBranches(params.owner, params.repo, params.per_page, params.page),

      github_get_branch: (params) =>
        this.client.getBranch(params.owner, params.repo, params.branch),

      github_create_branch: (params) =>
        this.client.createBranch({
          owner: params.owner,
          repo: params.repo,
          branch: params.branch,
          from_branch: params.from_branch,
          sha: params.sha,
        }),

      github_delete_branch: (params) =>
        this.client.deleteBranch(params.owner, params.repo, params.branch),

      github_merge_branch: (params) =>
        this.client.mergeBranch({
          owner: params.owner,
          repo: params.repo,
          base: params.base,
          head: params.head,
          commit_message: params.commit_message,
        }),

      github_get_branch_protection: (params) =>
        this.client.getBranchProtection(params.owner, params.repo, params.branch),

      github_update_branch_protection: (params) =>
        this.client.updateBranchProtection({
          owner: params.owner,
          repo: params.repo,
          branch: params.branch,
          required_status_checks: params.required_status_checks,
          enforce_admins: params.enforce_admins,
          required_pull_request_reviews: params.required_pull_request_reviews,
          restrictions: params.restrictions,
        }),

      github_delete_branch_protection: (params) =>
        this.client.deleteBranchProtection(params.owner, params.repo, params.branch),

      github_list_commits: (params) =>
        this.client.listCommits({
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
        }),

      github_get_commit: (params) =>
        this.client.getCommit(params.owner, params.repo, params.ref),

      github_compare_commits: (params) =>
        this.client.compareCommits(params.owner, params.repo, params.base, params.head),

      github_list_references: (params) =>
        this.client.listReferences(
          params.owner,
          params.repo,
          params.namespace,
          params.per_page,
          params.page
        ),

      github_get_reference: (params) =>
        this.client.getReference(params.owner, params.repo, params.ref),

      github_create_reference: (params) =>
        this.client.createReference({
          owner: params.owner,
          repo: params.repo,
          ref: params.ref,
          sha: params.sha,
        }),

      github_update_reference: (params) =>
        this.client.updateReference({
          owner: params.owner,
          repo: params.repo,
          ref: params.ref,
          sha: params.sha,
          force: params.force,
        }),

      github_delete_reference: (params) =>
        this.client.deleteReference(params.owner, params.repo, params.ref),

      github_create_tag: (params) =>
        this.client.createTag({
          owner: params.owner,
          repo: params.repo,
          tag: params.tag,
          message: params.message,
          object: params.object,
          type: params.type,
          tagger: params.tagger,
        }),

      github_get_tag: (params) =>
        this.client.getTag(params.owner, params.repo, params.tag_sha),

      github_list_releases: (params) =>
        this.client.listReleases({
          owner: params.owner,
          repo: params.repo,
          per_page: params.per_page,
          page: params.page,
        }),

      github_get_release: (params) =>
        this.client.getRelease(params.owner, params.repo, params.release_id),

      github_get_release_by_tag: (params) =>
        this.client.getReleaseByTag(params.owner, params.repo, params.tag),

      github_get_latest_release: (params) =>
        this.client.getLatestRelease(params.owner, params.repo),

      github_create_release: (params) =>
        this.client.createRelease({
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
        }),

      github_update_release: (params) =>
        this.client.updateRelease({
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
        }),

      github_delete_release: (params) =>
        this.client.deleteRelease(params.owner, params.repo, params.release_id),

      github_list_release_assets: (params) =>
        this.client.listReleaseAssets(
          params.owner,
          params.repo,
          params.release_id,
          params.per_page,
          params.page
        ),

      github_get_release_asset: (params) =>
        this.client.getReleaseAsset(params.owner, params.repo, params.asset_id),

      github_upload_release_asset: (params) =>
        this.client.uploadReleaseAsset({
          owner: params.owner,
          repo: params.repo,
          release_id: params.release_id,
          name: params.name,
          data: params.data,
          label: params.label,
        }),

      github_update_release_asset: (params) =>
        this.client.updateReleaseAsset(
          params.owner,
          params.repo,
          params.asset_id,
          params.name,
          params.label
        ),

      github_delete_release_asset: (params) =>
        this.client.deleteReleaseAsset(params.owner, params.repo, params.asset_id),

      github_generate_release_notes: (params) =>
        this.client.generateReleaseNotes({
          owner: params.owner,
          repo: params.repo,
          tag_name: params.tag_name,
          target_commitish: params.target_commitish,
          previous_tag_name: params.previous_tag_name,
          configuration_file_path: params.configuration_file_path,
        }),

      github_list_workflows: (params) =>
        this.client.listWorkflows({
          owner: params.owner,
          repo: params.repo,
          per_page: params.per_page,
          page: params.page,
        }),

      github_get_workflow: (params) =>
        this.client.getWorkflow(params.owner, params.repo, params.workflow_id),

      github_list_workflow_runs: (params) =>
        this.client.listWorkflowRuns({
          owner: params.owner,
          repo: params.repo,
          workflow_id: params.workflow_id,
          actor: params.actor,
          branch: params.branch,
          event: params.event,
          status: params.status,
          per_page: params.per_page,
          page: params.page,
          created: params.created,
          exclude_pull_requests: params.exclude_pull_requests,
          check_suite_id: params.check_suite_id,
          head_sha: params.head_sha,
        }),

      github_get_workflow_run: (params) =>
        this.client.getWorkflowRun(params.owner, params.repo, params.run_id),

      github_rerun_workflow: (params) =>
        this.client.rerunWorkflow(params.owner, params.repo, params.run_id),

      github_rerun_failed_jobs: (params) =>
        this.client.rerunFailedJobs(params.owner, params.repo, params.run_id),

      github_cancel_workflow_run: (params) =>
        this.client.cancelWorkflowRun(params.owner, params.repo, params.run_id),

      github_delete_workflow_run: (params) =>
        this.client.deleteWorkflowRun(params.owner, params.repo, params.run_id),

      github_list_workflow_jobs: (params) =>
        this.client.listWorkflowJobs({
          owner: params.owner,
          repo: params.repo,
          run_id: params.run_id,
          filter: params.filter,
          per_page: params.per_page,
          page: params.page,
        }),

      github_get_workflow_job: (params) =>
        this.client.getWorkflowJob(params.owner, params.repo, params.job_id),

      github_download_job_logs: (params) =>
        this.client.downloadJobLogs(params.owner, params.repo, params.job_id),

      github_download_workflow_run_logs: (params) =>
        this.client.downloadWorkflowRunLogs(params.owner, params.repo, params.run_id),

      github_delete_workflow_run_logs: (params) =>
        this.client.deleteWorkflowRunLogs(params.owner, params.repo, params.run_id),

      github_list_artifacts: (params) =>
        this.client.listArtifacts({
          owner: params.owner,
          repo: params.repo,
          run_id: params.run_id,
          per_page: params.per_page,
          page: params.page,
          name: params.name,
        }),

      github_get_artifact: (params) =>
        this.client.getArtifact(params.owner, params.repo, params.artifact_id),

      github_download_artifact: (params) =>
        this.client.downloadArtifact(params.owner, params.repo, params.artifact_id),

      github_delete_artifact: (params) =>
        this.client.deleteArtifact(params.owner, params.repo, params.artifact_id),

      github_create_workflow_dispatch: (params) =>
        this.client.createWorkflowDispatch({
          owner: params.owner,
          repo: params.repo,
          workflow_id: params.workflow_id,
          ref: params.ref,
          inputs: params.inputs,
        }),

      github_get_workflow_usage: (params) =>
        this.client.getWorkflowUsage(params.owner, params.repo, params.workflow_id),

      github_get_workflow_run_usage: (params) =>
        this.client.getWorkflowRunUsage(params.owner, params.repo, params.run_id),

      github_search_repositories: (params) =>
        this.client.searchRepositories({
          q: params.q,
          sort: params.sort,
          order: params.order,
          per_page: params.per_page,
          page: params.page,
        }),

      github_search_code: (params) =>
        this.client.searchCode({
          q: params.q,
          sort: params.sort,
          order: params.order,
          per_page: params.per_page,
          page: params.page,
        }),

      github_search_commits: (params) =>
        this.client.searchCommits({
          q: params.q,
          sort: params.sort,
          order: params.order,
          per_page: params.per_page,
          page: params.page,
        }),

      github_search_issues: (params) =>
        this.client.searchIssuesAndPullRequests({
          q: params.q,
          sort: params.sort,
          order: params.order,
          per_page: params.per_page,
          page: params.page,
        }),

      github_search_users: (params) =>
        this.client.searchUsers({
          q: params.q,
          sort: params.sort,
          order: params.order,
          per_page: params.per_page,
          page: params.page,
        }),

      github_search_topics: (params) =>
        this.client.searchTopics({
          q: params.q,
          per_page: params.per_page,
          page: params.page,
        }),

      github_search_labels: (params) =>
        this.client.searchLabels({
          repository_id: params.repository_id,
          q: params.q,
          sort: params.sort,
          order: params.order,
          per_page: params.per_page,
          page: params.page,
        }),

      github_list_webhooks: (params) =>
        this.client.listWebhooks({
          owner: params.owner,
          repo: params.repo,
          per_page: params.per_page,
          page: params.page,
        }),

      github_get_webhook: (params) =>
        this.client.getWebhook(params.owner, params.repo, params.hook_id),

      github_create_webhook: (params) =>
        this.client.createWebhook({
          owner: params.owner,
          repo: params.repo,
          config: params.config,
          events: params.events,
          active: params.active,
        }),

      github_update_webhook: (params) =>
        this.client.updateWebhook({
          owner: params.owner,
          repo: params.repo,
          hook_id: params.hook_id,
          config: params.config,
          events: params.events,
          active: params.active,
          add_events: params.add_events,
          remove_events: params.remove_events,
        }),

      github_delete_webhook: (params) =>
        this.client.deleteWebhook(params.owner, params.repo, params.hook_id),

      github_ping_webhook: (params) =>
        this.client.pingWebhook(params.owner, params.repo, params.hook_id),

      github_test_webhook: (params) =>
        this.client.testWebhook(params.owner, params.repo, params.hook_id),

      github_list_webhook_deliveries: (params) =>
        this.client.listWebhookDeliveries({
          owner: params.owner,
          repo: params.repo,
          hook_id: params.hook_id,
          per_page: params.per_page,
          cursor: params.cursor,
          redelivery: params.redelivery,
        }),

      github_get_webhook_delivery: (params) =>
        this.client.getWebhookDelivery(
          params.owner,
          params.repo,
          params.hook_id,
          params.delivery_id
        ),

      github_redeliver_webhook: (params) =>
        this.client.redeliverWebhook(
          params.owner,
          params.repo,
          params.hook_id,
          params.delivery_id
        ),

      github_update_repository: (params) =>
        this.client.updateRepository(params),

      github_get_repository_topics: (params) =>
        this.client.getRepositoryTopics(params.owner, params.repo),

      github_replace_repository_topics: (params) =>
        this.client.replaceRepositoryTopics(params.owner, params.repo, params.topics),

      github_list_collaborators: (params) =>
        this.client.listCollaborators(params),

      github_check_collaborator: (params) =>
        this.client.checkCollaborator(params.owner, params.repo, params.username),

      github_add_collaborator: (params) =>
        this.client.addCollaborator(params),

      github_remove_collaborator: (params) =>
        this.client.removeCollaborator(params.owner, params.repo, params.username),

      github_get_collaborator_permission: (params) =>
        this.client.getCollaboratorPermission(params.owner, params.repo, params.username),

      github_list_repository_invitations: (params) =>
        this.client.listRepositoryInvitations(params.owner, params.repo, params.per_page, params.page),

      github_delete_repository_invitation: (params) =>
        this.client.deleteRepositoryInvitation(params.owner, params.repo, params.invitation_id),

      github_get_repository_languages: (params) =>
        this.client.getRepositoryLanguages(params.owner, params.repo),

      github_get_code_frequency_stats: (params) =>
        this.client.getCodeFrequencyStats(params.owner, params.repo),

      github_get_contributors_stats: (params) =>
        this.client.getContributorsStats(params.owner, params.repo),

      github_get_participation_stats: (params) =>
        this.client.getParticipationStats(params.owner, params.repo),

      github_transfer_repository: (params) =>
        this.client.transferRepository(params),

      github_list_repository_teams: (params) =>
        this.client.listRepositoryTeams(params.owner, params.repo, params.per_page, params.page),

      github_check_team_permission: (params) =>
        this.client.checkTeamPermission(params.owner, params.repo, params.team_slug),

      github_add_repository_team: (params) =>
        this.client.addRepositoryTeam(params),

      github_remove_repository_team: (params) =>
        this.client.removeRepositoryTeam(params.owner, params.repo, params.team_slug),

      github_enable_automated_security_fixes: (params) =>
        this.client.enableAutomatedSecurityFixes(params.owner, params.repo),

      github_disable_automated_security_fixes: (params) =>
        this.client.disableAutomatedSecurityFixes(params.owner, params.repo),

      github_enable_vulnerability_alerts: (params) =>
        this.client.enableVulnerabilityAlerts(params.owner, params.repo),

      github_disable_vulnerability_alerts: (params) =>
        this.client.disableVulnerabilityAlerts(params.owner, params.repo),
    };

    return handlers[method] || null;
  }
}
