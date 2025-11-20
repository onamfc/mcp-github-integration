export interface GitHubConfig {
  token: string;
  baseUrl?: string;
}

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  private: boolean;
  html_url: string;
  created_at: string;
  updated_at: string;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  default_branch: string;
  owner: {
    login: string;
    id: number;
    avatar_url: string;
  };
}

export interface Issue {
  number: number;
  title: string;
  body: string | null;
  state: string;
  user: {
    login: string;
  };
  created_at: string;
  updated_at: string;
  html_url: string;
}

export interface PullRequest {
  number: number;
  title: string;
  body: string | null;
  state: string;
  user: {
    login: string;
  };
  created_at: string;
  updated_at: string;
  html_url: string;
  merged: boolean;
  mergeable: boolean | null;
}

export interface CreateIssueParams {
  owner: string;
  repo: string;
  title: string;
  body?: string;
  labels?: string[];
  assignees?: string[];
}

export interface CreatePullRequestParams {
  owner: string;
  repo: string;
  title: string;
  body?: string;
  head: string;
  base: string;
}

export interface ListIssuesParams {
  owner: string;
  repo: string;
  state?: 'open' | 'closed' | 'all';
  labels?: string[];
  sort?: 'created' | 'updated' | 'comments';
  direction?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface ListPullRequestsParams {
  owner: string;
  repo: string;
  state?: 'open' | 'closed' | 'all';
  sort?: 'created' | 'updated' | 'popularity' | 'long-running';
  direction?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface CreateRepositoryParams {
  name: string;
  description?: string;
  private?: boolean;
  auto_init?: boolean;
  gitignore_template?: string;
  license_template?: string;
  homepage?: string;
  has_issues?: boolean;
  has_projects?: boolean;
  has_wiki?: boolean;
}

export interface Comment {
  id: number;
  body: string;
  user: {
    login: string;
    id: number;
    avatar_url: string;
  };
  created_at: string;
  updated_at: string;
  html_url: string;
}

export interface CreateCommentParams {
  owner: string;
  repo: string;
  issue_number: number;
  body: string;
}

export interface UpdateCommentParams {
  owner: string;
  repo: string;
  comment_id: number;
  body: string;
}

export interface Label {
  id: number;
  name: string;
  color: string;
  description: string | null;
  default: boolean;
}

export interface CreateLabelParams {
  owner: string;
  repo: string;
  name: string;
  color: string;
  description?: string;
}

export interface UpdateLabelParams {
  owner: string;
  repo: string;
  name: string;
  new_name?: string;
  color?: string;
  description?: string;
}

export interface Milestone {
  id: number;
  number: number;
  title: string;
  description: string | null;
  state: string;
  open_issues: number;
  closed_issues: number;
  created_at: string;
  updated_at: string;
  due_on: string | null;
  html_url: string;
}

export interface CreateMilestoneParams {
  owner: string;
  repo: string;
  title: string;
  description?: string;
  due_on?: string;
  state?: 'open' | 'closed';
}

export interface UpdateMilestoneParams {
  owner: string;
  repo: string;
  milestone_number: number;
  title?: string;
  description?: string;
  due_on?: string;
  state?: 'open' | 'closed';
}

export interface FileContent {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string | null;
  type: 'file' | 'dir' | 'symlink' | 'submodule';
  content?: string;
  encoding?: string;
}

export interface GetFileParams {
  owner: string;
  repo: string;
  path: string;
  ref?: string;
}

export interface CreateFileParams {
  owner: string;
  repo: string;
  path: string;
  message: string;
  content: string;
  branch?: string;
  committer?: {
    name: string;
    email: string;
  };
  author?: {
    name: string;
    email: string;
  };
}

export interface UpdateFileParams {
  owner: string;
  repo: string;
  path: string;
  message: string;
  content: string;
  sha: string;
  branch?: string;
  committer?: {
    name: string;
    email: string;
  };
  author?: {
    name: string;
    email: string;
  };
}

export interface DeleteFileParams {
  owner: string;
  repo: string;
  path: string;
  message: string;
  sha: string;
  branch?: string;
  committer?: {
    name: string;
    email: string;
  };
  author?: {
    name: string;
    email: string;
  };
}

export interface TreeItem {
  path: string;
  mode: string;
  type: string;
  sha: string;
  size?: number;
  url: string;
}

export interface Tree {
  sha: string;
  url: string;
  tree: TreeItem[];
  truncated: boolean;
}

export interface Branch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
  protected: boolean;
  protection?: BranchProtection;
  protection_url?: string;
}

export interface BranchProtection {
  enabled: boolean;
  required_status_checks?: {
    enforcement_level: string;
    contexts: string[];
    checks: Array<{
      context: string;
      app_id: number | null;
    }>;
  };
  enforce_admins?: {
    url: string;
    enabled: boolean;
  };
  required_pull_request_reviews?: {
    url: string;
    dismiss_stale_reviews: boolean;
    require_code_owner_reviews: boolean;
    required_approving_review_count: number;
  };
  restrictions?: {
    url: string;
    users_url: string;
    teams_url: string;
    apps_url: string;
    users: Array<{ login: string }>;
    teams: Array<{ slug: string }>;
    apps: Array<{ slug: string }>;
  };
}

export interface CreateBranchParams {
  owner: string;
  repo: string;
  branch: string;
  from_branch?: string;
  sha?: string;
}

export interface UpdateBranchProtectionParams {
  owner: string;
  repo: string;
  branch: string;
  required_status_checks: {
    strict: boolean;
    contexts: string[];
  } | null;
  enforce_admins: boolean;
  required_pull_request_reviews: {
    dismiss_stale_reviews?: boolean;
    require_code_owner_reviews?: boolean;
    required_approving_review_count?: number;
  } | null;
  restrictions: {
    users: string[];
    teams: string[];
    apps?: string[];
  } | null;
}

export interface MergeBranchParams {
  owner: string;
  repo: string;
  base: string;
  head: string;
  commit_message?: string;
}

export interface Commit {
  sha: string;
  node_id: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    committer: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
    tree: {
      sha: string;
      url: string;
    };
    url: string;
    comment_count: number;
    verification?: {
      verified: boolean;
      reason: string;
      signature: string | null;
      payload: string | null;
    };
  };
  url: string;
  html_url: string;
  comments_url: string;
  author: {
    login: string;
    id: number;
    avatar_url: string;
  } | null;
  committer: {
    login: string;
    id: number;
    avatar_url: string;
  } | null;
  parents: Array<{
    sha: string;
    url: string;
    html_url: string;
  }>;
}

export interface ListCommitsParams {
  owner: string;
  repo: string;
  sha?: string;
  path?: string;
  author?: string;
  committer?: string;
  since?: string;
  until?: string;
  per_page?: number;
  page?: number;
}

export interface CommitComparison {
  url: string;
  html_url: string;
  permalink_url: string;
  diff_url: string;
  patch_url: string;
  base_commit: Commit;
  merge_base_commit: Commit;
  status: 'diverged' | 'ahead' | 'behind' | 'identical';
  ahead_by: number;
  behind_by: number;
  total_commits: number;
  commits: Commit[];
  files?: Array<{
    sha: string;
    filename: string;
    status: string;
    additions: number;
    deletions: number;
    changes: number;
    blob_url: string;
    raw_url: string;
    contents_url: string;
    patch?: string;
  }>;
}

export interface GitReference {
  ref: string;
  node_id: string;
  url: string;
  object: {
    type: string;
    sha: string;
    url: string;
  };
}

export interface CreateReferenceParams {
  owner: string;
  repo: string;
  ref: string;
  sha: string;
}

export interface UpdateReferenceParams {
  owner: string;
  repo: string;
  ref: string;
  sha: string;
  force?: boolean;
}

export interface GitTag {
  node_id: string;
  tag: string;
  sha: string;
  url: string;
  message: string;
  tagger: {
    name: string;
    email: string;
    date: string;
  };
  object: {
    type: string;
    sha: string;
    url: string;
  };
  verification?: {
    verified: boolean;
    reason: string;
    signature: string | null;
    payload: string | null;
  };
}

export interface CreateTagParams {
  owner: string;
  repo: string;
  tag: string;
  message: string;
  object: string;
  type: 'commit' | 'tree' | 'blob';
  tagger?: {
    name: string;
    email: string;
    date?: string;
  };
}

export interface Release {
  url: string;
  html_url: string;
  assets_url: string;
  upload_url: string;
  tarball_url: string | null;
  zipball_url: string | null;
  id: number;
  node_id: string;
  tag_name: string;
  target_commitish: string;
  name: string | null;
  body?: string | null;
  draft: boolean;
  prerelease: boolean;
  created_at: string;
  published_at: string | null;
  author: {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
  };
  assets: ReleaseAsset[];
}

export interface ReleaseAsset {
  url: string;
  browser_download_url: string;
  id: number;
  node_id: string;
  name: string;
  label: string | null;
  state: 'uploaded' | 'open';
  content_type: string;
  size: number;
  download_count: number;
  created_at: string;
  updated_at: string;
  uploader: {
    login: string;
    id: number;
    avatar_url: string;
  };
}

export interface CreateReleaseParams {
  owner: string;
  repo: string;
  tag_name: string;
  target_commitish?: string;
  name?: string;
  body?: string;
  draft?: boolean;
  prerelease?: boolean;
  discussion_category_name?: string;
  generate_release_notes?: boolean;
}

export interface UpdateReleaseParams {
  owner: string;
  repo: string;
  release_id: number;
  tag_name?: string;
  target_commitish?: string;
  name?: string;
  body?: string;
  draft?: boolean;
  prerelease?: boolean;
  discussion_category_name?: string;
}

export interface ListReleasesParams {
  owner: string;
  repo: string;
  per_page?: number;
  page?: number;
}

export interface UploadReleaseAssetParams {
  owner: string;
  repo: string;
  release_id: number;
  name: string;
  data: string | ArrayBuffer | Uint8Array;
  label?: string;
}

export interface GenerateReleaseNotesParams {
  owner: string;
  repo: string;
  tag_name: string;
  target_commitish?: string;
  previous_tag_name?: string;
  configuration_file_path?: string;
}

export interface GeneratedReleaseNotes {
  name: string;
  body: string;
}

export interface Workflow {
  id: number;
  node_id: string;
  name: string;
  path: string;
  state: 'active' | 'deleted' | 'disabled_fork' | 'disabled_inactivity' | 'disabled_manually';
  created_at: string;
  updated_at: string;
  url: string;
  html_url: string;
  badge_url: string;
}

export interface WorkflowRun {
  id: number;
  name: string;
  node_id: string;
  head_branch: string;
  head_sha: string;
  path: string;
  display_title: string;
  run_number: number;
  event: string;
  status: string | null;
  conclusion: string | null;
  workflow_id: number;
  check_suite_id: number;
  check_suite_node_id: string;
  url: string;
  html_url: string;
  pull_requests: Array<{
    url: string;
    id: number;
    number: number;
    head: {
      ref: string;
      sha: string;
      repo: {
        id: number;
        url: string;
        name: string;
      };
    };
    base: {
      ref: string;
      sha: string;
      repo: {
        id: number;
        url: string;
        name: string;
      };
    };
  }>;
  created_at: string;
  updated_at: string;
  actor: {
    login: string;
    id: number;
    avatar_url: string;
  };
  run_attempt: number;
  referenced_workflows: Array<{
    path: string;
    sha: string;
    ref?: string;
  }>;
  run_started_at: string;
  triggering_actor: {
    login: string;
    id: number;
    avatar_url: string;
  };
  jobs_url: string;
  logs_url: string;
  check_suite_url: string;
  artifacts_url: string;
  cancel_url: string;
  rerun_url: string;
  workflow_url: string;
  head_commit: {
    id: string;
    tree_id: string;
    message: string;
    timestamp: string;
    author: {
      name: string;
      email: string;
    };
    committer: {
      name: string;
      email: string;
    };
  };
  repository: {
    id: number;
    name: string;
    full_name: string;
  };
  head_repository: {
    id: number;
    name: string;
    full_name: string;
  };
}

export interface WorkflowJob {
  id: number;
  run_id: number;
  workflow_name: string;
  head_branch: string;
  run_url: string;
  run_attempt: number;
  node_id: string;
  head_sha: string;
  url: string;
  html_url: string;
  status: 'queued' | 'in_progress' | 'completed' | 'waiting';
  conclusion: string | null;
  created_at: string;
  started_at: string;
  completed_at: string | null;
  name: string;
  steps: Array<{
    name: string;
    status: 'queued' | 'in_progress' | 'completed';
    conclusion: string | null;
    number: number;
    started_at: string | null;
    completed_at: string | null;
  }>;
  check_run_url: string;
  labels: string[];
  runner_id: number | null;
  runner_name: string | null;
  runner_group_id: number | null;
  runner_group_name: string | null;
}

export interface Artifact {
  id: number;
  node_id: string;
  name: string;
  size_in_bytes: number;
  url: string;
  archive_download_url: string;
  expired: boolean;
  created_at: string;
  updated_at: string;
  expires_at: string;
  workflow_run?: {
    id: number;
    repository_id: number;
    head_repository_id: number;
    head_branch: string;
    head_sha: string;
  };
}

export interface ListWorkflowsParams {
  owner: string;
  repo: string;
  per_page?: number;
  page?: number;
}

export interface ListWorkflowRunsParams {
  owner: string;
  repo: string;
  workflow_id?: number | string;
  actor?: string;
  branch?: string;
  event?: string;
  status?: 'completed' | 'action_required' | 'cancelled' | 'failure' | 'neutral' | 'skipped' | 'stale' | 'success' | 'timed_out' | 'in_progress' | 'queued' | 'requested' | 'waiting' | 'pending';
  per_page?: number;
  page?: number;
  created?: string;
  exclude_pull_requests?: boolean;
  check_suite_id?: number;
  head_sha?: string;
}

export interface ListWorkflowJobsParams {
  owner: string;
  repo: string;
  run_id: number;
  filter?: 'latest' | 'all';
  per_page?: number;
  page?: number;
}

export interface ListArtifactsParams {
  owner: string;
  repo: string;
  run_id?: number;
  per_page?: number;
  page?: number;
  name?: string;
}

export interface CreateWorkflowDispatchParams {
  owner: string;
  repo: string;
  workflow_id: number | string;
  ref: string;
  inputs?: Record<string, string>;
}

export interface WorkflowUsage {
  billable: {
    UBUNTU?: {
      total_ms: number;
      jobs: number;
      job_runs?: Array<{
        job_id: number;
        duration_ms: number;
      }>;
    };
    MACOS?: {
      total_ms: number;
      jobs: number;
      job_runs?: Array<{
        job_id: number;
        duration_ms: number;
      }>;
    };
    WINDOWS?: {
      total_ms: number;
      jobs: number;
      job_runs?: Array<{
        job_id: number;
        duration_ms: number;
      }>;
    };
  };
}

export interface WorkflowRunUsage {
  billable: {
    UBUNTU?: {
      total_ms: number;
      jobs: number;
      job_runs?: Array<{
        job_id: number;
        duration_ms: number;
      }>;
    };
    MACOS?: {
      total_ms: number;
      jobs: number;
      job_runs?: Array<{
        job_id: number;
        duration_ms: number;
      }>;
    };
    WINDOWS?: {
      total_ms: number;
      jobs: number;
      job_runs?: Array<{
        job_id: number;
        duration_ms: number;
      }>;
    };
  };
  run_duration_ms: number;
}

export interface SearchRepositoriesParams {
  q: string;
  sort?: 'stars' | 'forks' | 'help-wanted-issues' | 'updated';
  order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface SearchCodeParams {
  q: string;
  sort?: 'indexed';
  order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface SearchCommitsParams {
  q: string;
  sort?: 'author-date' | 'committer-date';
  order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface SearchIssuesParams {
  q: string;
  sort?: 'comments' | 'reactions' | 'reactions-+1' | 'reactions--1' | 'reactions-smile' | 'reactions-thinking_face' | 'reactions-heart' | 'reactions-tada' | 'interactions' | 'created' | 'updated';
  order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface SearchUsersParams {
  q: string;
  sort?: 'followers' | 'repositories' | 'joined';
  order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface SearchTopicsParams {
  q: string;
  per_page?: number;
  page?: number;
}

export interface SearchLabelsParams {
  repository_id: number;
  q: string;
  sort?: 'created' | 'updated';
  order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface RepositorySearchResult {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  owner: {
    login: string;
    id: number;
    avatar_url: string;
    type: string;
  };
  private: boolean;
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  open_issues_count: number;
  default_branch: string;
  score: number;
  topics?: string[];
  visibility?: string;
  license?: {
    key: string;
    name: string;
    url: string | null;
    spdx_id: string | null;
  } | null;
}

export interface CodeSearchResult {
  name: string;
  path: string;
  sha: string;
  url: string;
  git_url: string;
  html_url: string;
  repository: {
    id: number;
    name: string;
    full_name: string;
    owner: {
      login: string;
      avatar_url: string;
    };
    html_url: string;
    description: string | null;
    private: boolean;
  };
  score: number;
  text_matches?: Array<{
    object_url: string;
    object_type: string;
    property: string;
    fragment: string;
    matches: Array<{
      text: string;
      indices: number[];
    }>;
  }>;
}

export interface CommitSearchResult {
  sha: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    committer: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
    tree: {
      sha: string;
      url: string;
    };
    comment_count: number;
  };
  url: string;
  html_url: string;
  comments_url: string;
  author: {
    login: string;
    id: number;
    avatar_url: string;
  } | null;
  committer: {
    login: string;
    id: number;
    avatar_url: string;
  } | null;
  parents: Array<{
    url: string;
    sha: string;
  }>;
  repository: {
    id: number;
    name: string;
    full_name: string;
    owner: {
      login: string;
      avatar_url: string;
    };
    html_url: string;
  };
  score: number;
}

export interface IssueSearchResult {
  id: number;
  node_id: string;
  url: string;
  repository_url: string;
  labels_url: string;
  comments_url: string;
  events_url: string;
  html_url: string;
  number: number;
  state: string;
  title: string;
  body: string | null;
  user: {
    login: string;
    id: number;
    avatar_url: string;
  };
  labels: Array<{
    id: number;
    node_id: string;
    url: string;
    name: string;
    color: string;
    default: boolean;
    description: string | null;
  }>;
  assignee: {
    login: string;
    id: number;
    avatar_url: string;
  } | null;
  assignees: Array<{
    login: string;
    id: number;
    avatar_url: string;
  }>;
  milestone: {
    url: string;
    html_url: string;
    labels_url: string;
    id: number;
    node_id: string;
    number: number;
    state: string;
    title: string;
    description: string | null;
    creator: {
      login: string;
      id: number;
      avatar_url: string;
    };
    open_issues: number;
    closed_issues: number;
    created_at: string;
    updated_at: string;
    closed_at: string | null;
    due_on: string | null;
  } | null;
  locked: boolean;
  comments: number;
  pull_request?: {
    url: string;
    html_url: string;
    diff_url: string;
    patch_url: string;
  };
  closed_at: string | null;
  created_at: string;
  updated_at: string;
  repository?: {
    id: number;
    name: string;
    full_name: string;
    owner: {
      login: string;
      avatar_url: string;
    };
    html_url: string;
    description: string | null;
  };
  score: number;
}

export interface UserSearchResult {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string | null;
  url: string;
  html_url: string;
  followers_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  type: string;
  score: number;
  site_admin: boolean;
  name?: string;
  company?: string | null;
  blog?: string;
  location?: string | null;
  email?: string | null;
  bio?: string | null;
  public_repos?: number;
  public_gists?: number;
  followers?: number;
  following?: number;
  created_at?: string;
  updated_at?: string;
}

export interface TopicSearchResult {
  name: string;
  display_name: string | null;
  short_description: string | null;
  description: string | null;
  created_by: string | null;
  released: string | null;
  created_at: string;
  updated_at: string;
  featured: boolean;
  curated: boolean;
  score: number;
}

export interface LabelSearchResult {
  id: number;
  node_id: string;
  url: string;
  name: string;
  color: string;
  default: boolean;
  description: string | null;
  score: number;
}

export interface SearchResults<T> {
  total_count: number;
  incomplete_results: boolean;
  items: T[];
}

export interface Webhook {
  id: number;
  type: string;
  name: string;
  active: boolean;
  events: string[];
  config: {
    url: string;
    content_type: string;
    secret?: string;
    insecure_ssl?: string;
  };
  updated_at: string;
  created_at: string;
  url: string;
  test_url: string;
  ping_url: string;
  deliveries_url: string;
  last_response?: {
    code: number | null;
    status: string;
    message: string | null;
  };
}

export interface CreateWebhookParams {
  owner: string;
  repo: string;
  config: {
    url: string;
    content_type?: 'json' | 'form';
    secret?: string;
    insecure_ssl?: '0' | '1';
  };
  events?: string[];
  active?: boolean;
}

export interface UpdateWebhookParams {
  owner: string;
  repo: string;
  hook_id: number;
  config?: {
    url?: string;
    content_type?: 'json' | 'form';
    secret?: string;
    insecure_ssl?: '0' | '1';
  };
  events?: string[];
  active?: boolean;
  add_events?: string[];
  remove_events?: string[];
}

export interface WebhookDelivery {
  id: number;
  guid: string;
  delivered_at: string;
  redelivery: boolean;
  duration: number;
  status: string;
  status_code: number;
  event: string;
  action: string | null;
  installation_id: number | null;
  repository_id: number;
  url?: string;
  request?: {
    headers: Record<string, string>;
    payload: any;
  };
  response?: {
    headers: Record<string, string>;
    payload: string;
  };
}

export interface ListWebhooksParams {
  owner: string;
  repo: string;
  per_page?: number;
  page?: number;
}

export interface ListWebhookDeliveriesParams {
  owner: string;
  repo: string;
  hook_id: number;
  per_page?: number;
  cursor?: string;
  redelivery?: boolean;
}

export interface WebhookConfig {
  url: string;
  content_type: string;
  secret?: string;
  insecure_ssl?: string;
}

export interface UpdateRepositoryParams {
  owner: string;
  repo: string;
  name?: string;
  description?: string;
  homepage?: string;
  private?: boolean;
  visibility?: 'public' | 'private' | 'internal';
  has_issues?: boolean;
  has_projects?: boolean;
  has_wiki?: boolean;
  has_downloads?: boolean;
  is_template?: boolean;
  default_branch?: string;
  allow_squash_merge?: boolean;
  allow_merge_commit?: boolean;
  allow_rebase_merge?: boolean;
  allow_auto_merge?: boolean;
  delete_branch_on_merge?: boolean;
  allow_update_branch?: boolean;
  use_squash_pr_title_as_default?: boolean;
  squash_merge_commit_title?: 'PR_TITLE' | 'COMMIT_OR_PR_TITLE';
  squash_merge_commit_message?: 'PR_BODY' | 'COMMIT_MESSAGES' | 'BLANK';
  merge_commit_title?: 'PR_TITLE' | 'MERGE_MESSAGE';
  merge_commit_message?: 'PR_BODY' | 'PR_TITLE' | 'BLANK';
  archived?: boolean;
  allow_forking?: boolean;
  web_commit_signoff_required?: boolean;
}

export interface RepositoryTopics {
  names: string[];
}

export interface Collaborator {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  type: string;
  site_admin: boolean;
  permissions?: {
    pull: boolean;
    triage?: boolean;
    push: boolean;
    maintain?: boolean;
    admin: boolean;
  };
  role_name?: string;
}

export interface AddCollaboratorParams {
  owner: string;
  repo: string;
  username: string;
  permission?: 'pull' | 'push' | 'admin' | 'maintain' | 'triage';
}

export interface ListCollaboratorsParams {
  owner: string;
  repo: string;
  affiliation?: 'outside' | 'direct' | 'all';
  permission?: 'pull' | 'triage' | 'push' | 'maintain' | 'admin';
  per_page?: number;
  page?: number;
}

export interface RepositoryInvitation {
  id: number;
  repository: {
    id: number;
    name: string;
    full_name: string;
    owner: {
      login: string;
      id: number;
      avatar_url: string;
    };
  };
  invitee: {
    login: string;
    id: number;
    avatar_url: string;
  } | null;
  inviter: {
    login: string;
    id: number;
    avatar_url: string;
  };
  permissions: string;
  created_at: string;
  expired: boolean;
  url: string;
  html_url: string;
}

export interface RepositoryLanguages {
  [language: string]: number;
}

export interface CodeFrequency {
  week: number;
  additions: number;
  deletions: number;
}

export interface ContributorActivity {
  author: {
    login: string;
    id: number;
    avatar_url: string;
  };
  total: number;
  weeks: Array<{
    w: number;
    a: number;
    d: number;
    c: number;
  }>;
}

export interface ParticipationStats {
  all: number[];
  owner: number[];
}

export interface TransferRepositoryParams {
  owner: string;
  repo: string;
  new_owner: string;
  team_ids?: number[];
}

export interface RepositoryTeam {
  id: number;
  node_id: string;
  name: string;
  slug: string;
  description: string | null;
  privacy: string;
  permission: string;
  url: string;
  html_url: string;
  members_url: string;
  repositories_url: string;
  parent: {
    id: number;
    node_id: string;
    name: string;
    slug: string;
    description: string | null;
    privacy: string;
    url: string;
    html_url: string;
  } | null;
}

export interface AddRepositoryTeamParams {
  owner: string;
  repo: string;
  team_slug: string;
  permission?: 'pull' | 'push' | 'admin' | 'maintain' | 'triage';
}

export interface RepositoryRuleset {
  id: number;
  name: string;
  source_type: string;
  source: string;
  enforcement: 'disabled' | 'active' | 'evaluate';
  conditions?: {
    ref_name?: {
      include?: string[];
      exclude?: string[];
    };
  };
  rules?: Array<{
    type: string;
    parameters?: any;
  }>;
  bypass_actors?: Array<{
    actor_id: number;
    actor_type: string;
    bypass_mode: string;
  }>;
  created_at: string;
  updated_at: string;
}
