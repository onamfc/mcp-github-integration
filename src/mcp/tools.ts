import type { MCPToolDefinition } from '../types/mcp.js';

export const tools: MCPToolDefinition[] = [
  {
    name: 'github_get_repository',
    description: 'Get information about a specific GitHub repository',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner (username or organization)',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
      },
      required: ['owner', 'repo'],
    },
  },
  {
    name: 'github_list_repositories',
    description: 'List all public repositories for a user',
    parameters: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          description: 'GitHub username',
        },
      },
      required: ['username'],
    },
  },
  {
    name: 'github_create_repository',
    description: 'Create a new repository for the authenticated user',
    parameters: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Repository name',
        },
        description: {
          type: 'string',
          description: 'Repository description',
        },
        private: {
          type: 'boolean',
          description: 'Whether the repository is private',
        },
        auto_init: {
          type: 'boolean',
          description: 'Initialize repository with README',
        },
        gitignore_template: {
          type: 'string',
          description: 'Gitignore template to use (e.g., "Node", "Python")',
        },
        license_template: {
          type: 'string',
          description: 'License template to use (e.g., "mit", "apache-2.0")',
        },
        homepage: {
          type: 'string',
          description: 'Repository homepage URL',
        },
        has_issues: {
          type: 'boolean',
          description: 'Enable issues',
        },
        has_projects: {
          type: 'boolean',
          description: 'Enable projects',
        },
        has_wiki: {
          type: 'boolean',
          description: 'Enable wiki',
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'github_delete_repository',
    description: 'Delete a repository',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
      },
      required: ['owner', 'repo'],
    },
  },
  {
    name: 'github_update_repository',
    description: 'Update repository settings',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        name: {
          type: 'string',
          description: 'New repository name',
        },
        description: {
          type: 'string',
          description: 'New description',
        },
        private: {
          type: 'boolean',
          description: 'Set repository visibility',
        },
        homepage: {
          type: 'string',
          description: 'Repository homepage URL',
        },
        has_issues: {
          type: 'boolean',
          description: 'Enable/disable issues',
        },
        has_projects: {
          type: 'boolean',
          description: 'Enable/disable projects',
        },
        has_wiki: {
          type: 'boolean',
          description: 'Enable/disable wiki',
        },
      },
      required: ['owner', 'repo'],
    },
  },
  {
    name: 'github_create_issue',
    description: 'Create a new issue in a repository',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        title: {
          type: 'string',
          description: 'Issue title',
        },
        body: {
          type: 'string',
          description: 'Issue body/description',
        },
        labels: {
          type: 'array',
          items: { type: 'string' },
          description: 'Labels to add to the issue',
        },
        assignees: {
          type: 'array',
          items: { type: 'string' },
          description: 'Users to assign to the issue',
        },
      },
      required: ['owner', 'repo', 'title'],
    },
  },
  {
    name: 'github_list_issues',
    description: 'List issues in a repository',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        state: {
          type: 'string',
          enum: ['open', 'closed', 'all'],
          description: 'Issue state filter',
        },
        labels: {
          type: 'array',
          items: { type: 'string' },
          description: 'Filter by labels',
        },
        per_page: {
          type: 'number',
          description: 'Number of results per page',
        },
        page: {
          type: 'number',
          description: 'Page number',
        },
      },
      required: ['owner', 'repo'],
    },
  },
  {
    name: 'github_get_issue',
    description: 'Get a specific issue by number',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        issue_number: {
          type: 'number',
          description: 'Issue number',
        },
      },
      required: ['owner', 'repo', 'issue_number'],
    },
  },
  {
    name: 'github_update_issue',
    description: 'Update an existing issue',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        issue_number: {
          type: 'number',
          description: 'Issue number',
        },
        title: {
          type: 'string',
          description: 'New issue title',
        },
        body: {
          type: 'string',
          description: 'New issue body',
        },
        labels: {
          type: 'array',
          items: { type: 'string' },
          description: 'New labels',
        },
      },
      required: ['owner', 'repo', 'issue_number'],
    },
  },
  {
    name: 'github_close_issue',
    description: 'Close an issue',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        issue_number: {
          type: 'number',
          description: 'Issue number',
        },
      },
      required: ['owner', 'repo', 'issue_number'],
    },
  },
  {
    name: 'github_create_pull_request',
    description: 'Create a new pull request',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        title: {
          type: 'string',
          description: 'Pull request title',
        },
        body: {
          type: 'string',
          description: 'Pull request description',
        },
        head: {
          type: 'string',
          description: 'The name of the branch where changes are',
        },
        base: {
          type: 'string',
          description: 'The name of the branch to merge into',
        },
      },
      required: ['owner', 'repo', 'title', 'head', 'base'],
    },
  },
  {
    name: 'github_list_pull_requests',
    description: 'List pull requests in a repository',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        state: {
          type: 'string',
          enum: ['open', 'closed', 'all'],
          description: 'Pull request state filter',
        },
        per_page: {
          type: 'number',
          description: 'Number of results per page',
        },
        page: {
          type: 'number',
          description: 'Page number',
        },
      },
      required: ['owner', 'repo'],
    },
  },
  {
    name: 'github_get_pull_request',
    description: 'Get a specific pull request by number',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        pull_number: {
          type: 'number',
          description: 'Pull request number',
        },
      },
      required: ['owner', 'repo', 'pull_number'],
    },
  },
  {
    name: 'github_merge_pull_request',
    description: 'Merge a pull request',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        pull_number: {
          type: 'number',
          description: 'Pull request number',
        },
        commit_message: {
          type: 'string',
          description: 'Custom merge commit message',
        },
      },
      required: ['owner', 'repo', 'pull_number'],
    },
  },
  {
    name: 'github_get_authenticated_user',
    description: 'Get information about the authenticated user',
    parameters: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'github_list_issue_comments',
    description: 'List all comments on an issue',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        issue_number: {
          type: 'number',
          description: 'Issue number',
        },
        per_page: {
          type: 'number',
          description: 'Number of results per page',
        },
        page: {
          type: 'number',
          description: 'Page number',
        },
      },
      required: ['owner', 'repo', 'issue_number'],
    },
  },
  {
    name: 'github_create_issue_comment',
    description: 'Create a comment on an issue',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        issue_number: {
          type: 'number',
          description: 'Issue number',
        },
        body: {
          type: 'string',
          description: 'Comment body text',
        },
      },
      required: ['owner', 'repo', 'issue_number', 'body'],
    },
  },
  {
    name: 'github_update_issue_comment',
    description: 'Update an existing issue comment',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        comment_id: {
          type: 'number',
          description: 'Comment ID',
        },
        body: {
          type: 'string',
          description: 'New comment body text',
        },
      },
      required: ['owner', 'repo', 'comment_id', 'body'],
    },
  },
  {
    name: 'github_delete_issue_comment',
    description: 'Delete an issue comment',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        comment_id: {
          type: 'number',
          description: 'Comment ID',
        },
      },
      required: ['owner', 'repo', 'comment_id'],
    },
  },
  {
    name: 'github_list_pull_request_comments',
    description: 'List all review comments on a pull request',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        pull_number: {
          type: 'number',
          description: 'Pull request number',
        },
        per_page: {
          type: 'number',
          description: 'Number of results per page',
        },
        page: {
          type: 'number',
          description: 'Page number',
        },
      },
      required: ['owner', 'repo', 'pull_number'],
    },
  },
  {
    name: 'github_create_pull_request_comment',
    description: 'Create a review comment on a pull request',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        pull_number: {
          type: 'number',
          description: 'Pull request number',
        },
        body: {
          type: 'string',
          description: 'Comment body text',
        },
        commit_id: {
          type: 'string',
          description: 'SHA of the commit to comment on',
        },
        path: {
          type: 'string',
          description: 'Relative path of the file to comment on',
        },
        position: {
          type: 'number',
          description: 'Line position in the diff to comment on',
        },
      },
      required: ['owner', 'repo', 'pull_number', 'body'],
    },
  },
  {
    name: 'github_list_labels',
    description: 'List all labels in a repository',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        per_page: {
          type: 'number',
          description: 'Number of results per page',
        },
        page: {
          type: 'number',
          description: 'Page number',
        },
      },
      required: ['owner', 'repo'],
    },
  },
  {
    name: 'github_get_label',
    description: 'Get a specific label by name',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        name: {
          type: 'string',
          description: 'Label name',
        },
      },
      required: ['owner', 'repo', 'name'],
    },
  },
  {
    name: 'github_create_label',
    description: 'Create a new label in a repository',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        name: {
          type: 'string',
          description: 'Label name',
        },
        color: {
          type: 'string',
          description: 'Label color (6-character hex code without #)',
        },
        description: {
          type: 'string',
          description: 'Label description',
        },
      },
      required: ['owner', 'repo', 'name', 'color'],
    },
  },
  {
    name: 'github_update_label',
    description: 'Update an existing label',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        name: {
          type: 'string',
          description: 'Current label name',
        },
        new_name: {
          type: 'string',
          description: 'New label name',
        },
        color: {
          type: 'string',
          description: 'New label color (6-character hex code without #)',
        },
        description: {
          type: 'string',
          description: 'New label description',
        },
      },
      required: ['owner', 'repo', 'name'],
    },
  },
  {
    name: 'github_delete_label',
    description: 'Delete a label from a repository',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        name: {
          type: 'string',
          description: 'Label name',
        },
      },
      required: ['owner', 'repo', 'name'],
    },
  },
  {
    name: 'github_list_milestones',
    description: 'List milestones in a repository',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        state: {
          type: 'string',
          enum: ['open', 'closed', 'all'],
          description: 'Milestone state filter',
        },
        per_page: {
          type: 'number',
          description: 'Number of results per page',
        },
        page: {
          type: 'number',
          description: 'Page number',
        },
      },
      required: ['owner', 'repo'],
    },
  },
  {
    name: 'github_get_milestone',
    description: 'Get a specific milestone by number',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        milestone_number: {
          type: 'number',
          description: 'Milestone number',
        },
      },
      required: ['owner', 'repo', 'milestone_number'],
    },
  },
  {
    name: 'github_create_milestone',
    description: 'Create a new milestone',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        title: {
          type: 'string',
          description: 'Milestone title',
        },
        description: {
          type: 'string',
          description: 'Milestone description',
        },
        due_on: {
          type: 'string',
          description: 'Due date (ISO 8601 format)',
        },
        state: {
          type: 'string',
          enum: ['open', 'closed'],
          description: 'Milestone state',
        },
      },
      required: ['owner', 'repo', 'title'],
    },
  },
  {
    name: 'github_update_milestone',
    description: 'Update an existing milestone',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        milestone_number: {
          type: 'number',
          description: 'Milestone number',
        },
        title: {
          type: 'string',
          description: 'New milestone title',
        },
        description: {
          type: 'string',
          description: 'New milestone description',
        },
        due_on: {
          type: 'string',
          description: 'New due date (ISO 8601 format)',
        },
        state: {
          type: 'string',
          enum: ['open', 'closed'],
          description: 'New milestone state',
        },
      },
      required: ['owner', 'repo', 'milestone_number'],
    },
  },
  {
    name: 'github_delete_milestone',
    description: 'Delete a milestone',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        milestone_number: {
          type: 'number',
          description: 'Milestone number',
        },
      },
      required: ['owner', 'repo', 'milestone_number'],
    },
  },
  {
    name: 'github_get_file_content',
    description: 'Get the contents of a file in a repository',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        path: {
          type: 'string',
          description: 'Path to the file',
        },
        ref: {
          type: 'string',
          description: 'Branch, tag, or commit SHA (defaults to default branch)',
        },
      },
      required: ['owner', 'repo', 'path'],
    },
  },
  {
    name: 'github_get_directory_content',
    description: 'Get the contents of a directory in a repository',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        path: {
          type: 'string',
          description: 'Path to the directory',
        },
        ref: {
          type: 'string',
          description: 'Branch, tag, or commit SHA (defaults to default branch)',
        },
      },
      required: ['owner', 'repo', 'path'],
    },
  },
  {
    name: 'github_create_file',
    description: 'Create a new file in a repository',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        path: {
          type: 'string',
          description: 'Path where to create the file',
        },
        message: {
          type: 'string',
          description: 'Commit message',
        },
        content: {
          type: 'string',
          description: 'File content (will be base64 encoded automatically)',
        },
        branch: {
          type: 'string',
          description: 'Branch to create the file in',
        },
        committer: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string' },
          },
          description: 'Committer information',
        },
        author: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string' },
          },
          description: 'Author information',
        },
      },
      required: ['owner', 'repo', 'path', 'message', 'content'],
    },
  },
  {
    name: 'github_update_file',
    description: 'Update an existing file in a repository',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        path: {
          type: 'string',
          description: 'Path to the file',
        },
        message: {
          type: 'string',
          description: 'Commit message',
        },
        content: {
          type: 'string',
          description: 'New file content (will be base64 encoded automatically)',
        },
        sha: {
          type: 'string',
          description: 'SHA of the file being replaced',
        },
        branch: {
          type: 'string',
          description: 'Branch to update the file in',
        },
        committer: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string' },
          },
          description: 'Committer information',
        },
        author: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string' },
          },
          description: 'Author information',
        },
      },
      required: ['owner', 'repo', 'path', 'message', 'content', 'sha'],
    },
  },
  {
    name: 'github_delete_file',
    description: 'Delete a file from a repository',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        path: {
          type: 'string',
          description: 'Path to the file',
        },
        message: {
          type: 'string',
          description: 'Commit message',
        },
        sha: {
          type: 'string',
          description: 'SHA of the file being deleted',
        },
        branch: {
          type: 'string',
          description: 'Branch to delete the file from',
        },
        committer: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string' },
          },
          description: 'Committer information',
        },
        author: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string' },
          },
          description: 'Author information',
        },
      },
      required: ['owner', 'repo', 'path', 'message', 'sha'],
    },
  },
  {
    name: 'github_get_repository_tree',
    description: 'Get the tree structure of a repository',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        tree_sha: {
          type: 'string',
          description: 'SHA of the tree (can use branch name or commit SHA)',
        },
        recursive: {
          type: 'boolean',
          description: 'Get tree recursively',
        },
      },
      required: ['owner', 'repo', 'tree_sha'],
    },
  },
  {
    name: 'github_download_repository_archive',
    description: 'Download a repository archive (zip or tarball)',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        archive_format: {
          type: 'string',
          enum: ['zipball', 'tarball'],
          description: 'Archive format',
        },
        ref: {
          type: 'string',
          description: 'Branch, tag, or commit SHA (defaults to HEAD)',
        },
      },
      required: ['owner', 'repo', 'archive_format'],
    },
  },
  {
    name: 'github_list_branches',
    description: 'List all branches in a repository',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        per_page: {
          type: 'number',
          description: 'Results per page (default: 100)',
        },
        page: {
          type: 'number',
          description: 'Page number (default: 1)',
        },
      },
      required: ['owner', 'repo'],
    },
  },
  {
    name: 'github_get_branch',
    description: 'Get details of a specific branch',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        branch: {
          type: 'string',
          description: 'Branch name',
        },
      },
      required: ['owner', 'repo', 'branch'],
    },
  },
  {
    name: 'github_create_branch',
    description: 'Create a new branch',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        branch: {
          type: 'string',
          description: 'Name for the new branch',
        },
        from_branch: {
          type: 'string',
          description: 'Branch to create from (optional, defaults to default branch)',
        },
        sha: {
          type: 'string',
          description: 'SHA to create branch from (optional, overrides from_branch)',
        },
      },
      required: ['owner', 'repo', 'branch'],
    },
  },
  {
    name: 'github_delete_branch',
    description: 'Delete a branch',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        branch: {
          type: 'string',
          description: 'Branch name to delete',
        },
      },
      required: ['owner', 'repo', 'branch'],
    },
  },
  {
    name: 'github_merge_branch',
    description: 'Merge one branch into another',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        base: {
          type: 'string',
          description: 'Base branch (branch to merge into)',
        },
        head: {
          type: 'string',
          description: 'Head branch (branch to merge from)',
        },
        commit_message: {
          type: 'string',
          description: 'Commit message for the merge',
        },
      },
      required: ['owner', 'repo', 'base', 'head'],
    },
  },
  {
    name: 'github_get_branch_protection',
    description: 'Get branch protection rules',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        branch: {
          type: 'string',
          description: 'Branch name',
        },
      },
      required: ['owner', 'repo', 'branch'],
    },
  },
  {
    name: 'github_update_branch_protection',
    description: 'Update branch protection rules',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        branch: {
          type: 'string',
          description: 'Branch name',
        },
        required_status_checks: {
          type: 'object',
          properties: {
            strict: { type: 'boolean' },
            contexts: {
              type: 'array',
              items: { type: 'string' },
            },
          },
          description: 'Require status checks before merging',
        },
        enforce_admins: {
          type: 'boolean',
          description: 'Enforce restrictions for admins',
        },
        required_pull_request_reviews: {
          type: 'object',
          properties: {
            dismiss_stale_reviews: { type: 'boolean' },
            require_code_owner_reviews: { type: 'boolean' },
            required_approving_review_count: { type: 'number' },
          },
          description: 'Require pull request reviews before merging',
        },
        restrictions: {
          type: 'object',
          properties: {
            users: {
              type: 'array',
              items: { type: 'string' },
            },
            teams: {
              type: 'array',
              items: { type: 'string' },
            },
            apps: {
              type: 'array',
              items: { type: 'string' },
            },
          },
          description: 'Restrict who can push to the branch',
        },
      },
      required: ['owner', 'repo', 'branch', 'enforce_admins'],
    },
  },
  {
    name: 'github_delete_branch_protection',
    description: 'Remove branch protection rules',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        branch: {
          type: 'string',
          description: 'Branch name',
        },
      },
      required: ['owner', 'repo', 'branch'],
    },
  },
  {
    name: 'github_list_commits',
    description: 'List commits in a repository with optional filtering',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        sha: {
          type: 'string',
          description: 'SHA or branch to start listing from',
        },
        path: {
          type: 'string',
          description: 'Only commits containing this file path',
        },
        author: {
          type: 'string',
          description: 'GitHub username or email address',
        },
        committer: {
          type: 'string',
          description: 'GitHub username or email address',
        },
        since: {
          type: 'string',
          description: 'Only commits after this date (ISO 8601)',
        },
        until: {
          type: 'string',
          description: 'Only commits before this date (ISO 8601)',
        },
        per_page: {
          type: 'number',
          description: 'Results per page (default: 30)',
        },
        page: {
          type: 'number',
          description: 'Page number (default: 1)',
        },
      },
      required: ['owner', 'repo'],
    },
  },
  {
    name: 'github_get_commit',
    description: 'Get details of a specific commit',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        ref: {
          type: 'string',
          description: 'Commit SHA, branch name, or tag',
        },
      },
      required: ['owner', 'repo', 'ref'],
    },
  },
  {
    name: 'github_compare_commits',
    description: 'Compare two commits or branches',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        base: {
          type: 'string',
          description: 'Base branch or commit SHA',
        },
        head: {
          type: 'string',
          description: 'Head branch or commit SHA',
        },
      },
      required: ['owner', 'repo', 'base', 'head'],
    },
  },
  {
    name: 'github_list_references',
    description: 'List git references (branches, tags, etc.)',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        namespace: {
          type: 'string',
          description: 'Reference namespace (e.g., "heads/", "tags/")',
        },
        per_page: {
          type: 'number',
          description: 'Results per page (default: 100)',
        },
        page: {
          type: 'number',
          description: 'Page number (default: 1)',
        },
      },
      required: ['owner', 'repo'],
    },
  },
  {
    name: 'github_get_reference',
    description: 'Get a specific git reference',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        ref: {
          type: 'string',
          description: 'Reference (e.g., "heads/main", "tags/v1.0")',
        },
      },
      required: ['owner', 'repo', 'ref'],
    },
  },
  {
    name: 'github_create_reference',
    description: 'Create a new git reference',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        ref: {
          type: 'string',
          description: 'Fully qualified reference (e.g., "refs/heads/feature")',
        },
        sha: {
          type: 'string',
          description: 'SHA to point the reference at',
        },
      },
      required: ['owner', 'repo', 'ref', 'sha'],
    },
  },
  {
    name: 'github_update_reference',
    description: 'Update a git reference',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        ref: {
          type: 'string',
          description: 'Reference to update (e.g., "heads/main")',
        },
        sha: {
          type: 'string',
          description: 'New SHA for the reference',
        },
        force: {
          type: 'boolean',
          description: 'Force update (default: false)',
        },
      },
      required: ['owner', 'repo', 'ref', 'sha'],
    },
  },
  {
    name: 'github_delete_reference',
    description: 'Delete a git reference',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        ref: {
          type: 'string',
          description: 'Reference to delete (e.g., "heads/feature")',
        },
      },
      required: ['owner', 'repo', 'ref'],
    },
  },
  {
    name: 'github_create_tag',
    description: 'Create a new tag object',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        tag: {
          type: 'string',
          description: 'Tag name',
        },
        message: {
          type: 'string',
          description: 'Tag message',
        },
        object: {
          type: 'string',
          description: 'SHA of the git object being tagged',
        },
        type: {
          type: 'string',
          enum: ['commit', 'tree', 'blob'],
          description: 'Type of the object',
        },
        tagger: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string' },
            date: { type: 'string' },
          },
          description: 'Tagger information (optional)',
        },
      },
      required: ['owner', 'repo', 'tag', 'message', 'object', 'type'],
    },
  },
  {
    name: 'github_get_tag',
    description: 'Get a tag object',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        tag_sha: {
          type: 'string',
          description: 'SHA of the tag',
        },
      },
      required: ['owner', 'repo', 'tag_sha'],
    },
  },
  {
    name: 'github_list_releases',
    description: 'List releases for a repository',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        per_page: {
          type: 'number',
          description: 'Results per page (default: 30)',
        },
        page: {
          type: 'number',
          description: 'Page number (default: 1)',
        },
      },
      required: ['owner', 'repo'],
    },
  },
  {
    name: 'github_get_release',
    description: 'Get a specific release by ID',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        release_id: {
          type: 'number',
          description: 'Release ID',
        },
      },
      required: ['owner', 'repo', 'release_id'],
    },
  },
  {
    name: 'github_get_release_by_tag',
    description: 'Get a release by tag name',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        tag: {
          type: 'string',
          description: 'Tag name',
        },
      },
      required: ['owner', 'repo', 'tag'],
    },
  },
  {
    name: 'github_get_latest_release',
    description: 'Get the latest published release',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
      },
      required: ['owner', 'repo'],
    },
  },
  {
    name: 'github_create_release',
    description: 'Create a new release',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        tag_name: {
          type: 'string',
          description: 'Tag name for the release',
        },
        target_commitish: {
          type: 'string',
          description: 'Commitish value (branch or commit SHA)',
        },
        name: {
          type: 'string',
          description: 'Release name',
        },
        body: {
          type: 'string',
          description: 'Release description',
        },
        draft: {
          type: 'boolean',
          description: 'Create as draft (default: false)',
        },
        prerelease: {
          type: 'boolean',
          description: 'Mark as pre-release (default: false)',
        },
        discussion_category_name: {
          type: 'string',
          description: 'Discussion category name',
        },
        generate_release_notes: {
          type: 'boolean',
          description: 'Auto-generate release notes (default: false)',
        },
      },
      required: ['owner', 'repo', 'tag_name'],
    },
  },
  {
    name: 'github_update_release',
    description: 'Update an existing release',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        release_id: {
          type: 'number',
          description: 'Release ID',
        },
        tag_name: {
          type: 'string',
          description: 'Tag name',
        },
        target_commitish: {
          type: 'string',
          description: 'Commitish value',
        },
        name: {
          type: 'string',
          description: 'Release name',
        },
        body: {
          type: 'string',
          description: 'Release description',
        },
        draft: {
          type: 'boolean',
          description: 'Draft status',
        },
        prerelease: {
          type: 'boolean',
          description: 'Pre-release status',
        },
        discussion_category_name: {
          type: 'string',
          description: 'Discussion category name',
        },
      },
      required: ['owner', 'repo', 'release_id'],
    },
  },
  {
    name: 'github_delete_release',
    description: 'Delete a release',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        release_id: {
          type: 'number',
          description: 'Release ID',
        },
      },
      required: ['owner', 'repo', 'release_id'],
    },
  },
  {
    name: 'github_list_release_assets',
    description: 'List assets for a release',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        release_id: {
          type: 'number',
          description: 'Release ID',
        },
        per_page: {
          type: 'number',
          description: 'Results per page (default: 30)',
        },
        page: {
          type: 'number',
          description: 'Page number (default: 1)',
        },
      },
      required: ['owner', 'repo', 'release_id'],
    },
  },
  {
    name: 'github_get_release_asset',
    description: 'Get a release asset',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        asset_id: {
          type: 'number',
          description: 'Asset ID',
        },
      },
      required: ['owner', 'repo', 'asset_id'],
    },
  },
  {
    name: 'github_upload_release_asset',
    description: 'Upload an asset to a release',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        release_id: {
          type: 'number',
          description: 'Release ID',
        },
        name: {
          type: 'string',
          description: 'Asset filename',
        },
        data: {
          type: 'string',
          description: 'Asset data (string, ArrayBuffer, or Uint8Array)',
        },
        label: {
          type: 'string',
          description: 'Asset label',
        },
      },
      required: ['owner', 'repo', 'release_id', 'name', 'data'],
    },
  },
  {
    name: 'github_update_release_asset',
    description: 'Update a release asset',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        asset_id: {
          type: 'number',
          description: 'Asset ID',
        },
        name: {
          type: 'string',
          description: 'New asset name',
        },
        label: {
          type: 'string',
          description: 'New asset label',
        },
      },
      required: ['owner', 'repo', 'asset_id'],
    },
  },
  {
    name: 'github_delete_release_asset',
    description: 'Delete a release asset',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        asset_id: {
          type: 'number',
          description: 'Asset ID',
        },
      },
      required: ['owner', 'repo', 'asset_id'],
    },
  },
  {
    name: 'github_generate_release_notes',
    description: 'Generate release notes automatically',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        tag_name: {
          type: 'string',
          description: 'Tag name for the release',
        },
        target_commitish: {
          type: 'string',
          description: 'Commitish value',
        },
        previous_tag_name: {
          type: 'string',
          description: 'Previous tag to compare from',
        },
        configuration_file_path: {
          type: 'string',
          description: 'Path to release notes config file',
        },
      },
      required: ['owner', 'repo', 'tag_name'],
    },
  },
  {
    name: 'github_list_workflows',
    description: 'List workflows for a repository',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        per_page: {
          type: 'number',
          description: 'Results per page (default: 30)',
        },
        page: {
          type: 'number',
          description: 'Page number (default: 1)',
        },
      },
      required: ['owner', 'repo'],
    },
  },
  {
    name: 'github_get_workflow',
    description: 'Get a workflow by ID or filename',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        workflow_id: {
          description: 'Workflow ID or filename',
        },
      },
      required: ['owner', 'repo', 'workflow_id'],
    },
  },
  {
    name: 'github_list_workflow_runs',
    description: 'List workflow runs for a repository or specific workflow',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        workflow_id: {
          description: 'Workflow ID or filename (optional)',
        },
        actor: {
          type: 'string',
          description: 'Filter by actor username',
        },
        branch: {
          type: 'string',
          description: 'Filter by branch name',
        },
        event: {
          type: 'string',
          description: 'Filter by event type',
        },
        status: {
          type: 'string',
          description: 'Filter by status',
        },
        per_page: {
          type: 'number',
          description: 'Results per page (default: 30)',
        },
        page: {
          type: 'number',
          description: 'Page number (default: 1)',
        },
        created: {
          type: 'string',
          description: 'Filter by created date',
        },
        exclude_pull_requests: {
          type: 'boolean',
          description: 'Exclude workflow runs from pull requests',
        },
        check_suite_id: {
          type: 'number',
          description: 'Filter by check suite ID',
        },
        head_sha: {
          type: 'string',
          description: 'Filter by head SHA',
        },
      },
      required: ['owner', 'repo'],
    },
  },
  {
    name: 'github_get_workflow_run',
    description: 'Get a workflow run',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        run_id: {
          type: 'number',
          description: 'Workflow run ID',
        },
      },
      required: ['owner', 'repo', 'run_id'],
    },
  },
  {
    name: 'github_rerun_workflow',
    description: 'Re-run a workflow',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        run_id: {
          type: 'number',
          description: 'Workflow run ID',
        },
      },
      required: ['owner', 'repo', 'run_id'],
    },
  },
  {
    name: 'github_rerun_failed_jobs',
    description: 'Re-run failed jobs in a workflow',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        run_id: {
          type: 'number',
          description: 'Workflow run ID',
        },
      },
      required: ['owner', 'repo', 'run_id'],
    },
  },
  {
    name: 'github_cancel_workflow_run',
    description: 'Cancel a workflow run',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        run_id: {
          type: 'number',
          description: 'Workflow run ID',
        },
      },
      required: ['owner', 'repo', 'run_id'],
    },
  },
  {
    name: 'github_delete_workflow_run',
    description: 'Delete a workflow run',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        run_id: {
          type: 'number',
          description: 'Workflow run ID',
        },
      },
      required: ['owner', 'repo', 'run_id'],
    },
  },
  {
    name: 'github_list_workflow_jobs',
    description: 'List jobs for a workflow run',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        run_id: {
          type: 'number',
          description: 'Workflow run ID',
        },
        filter: {
          type: 'string',
          description: 'Filter: "latest" or "all" (default: all)',
        },
        per_page: {
          type: 'number',
          description: 'Results per page (default: 30)',
        },
        page: {
          type: 'number',
          description: 'Page number (default: 1)',
        },
      },
      required: ['owner', 'repo', 'run_id'],
    },
  },
  {
    name: 'github_get_workflow_job',
    description: 'Get a workflow job',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        job_id: {
          type: 'number',
          description: 'Job ID',
        },
      },
      required: ['owner', 'repo', 'job_id'],
    },
  },
  {
    name: 'github_download_job_logs',
    description: 'Download logs for a workflow job',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        job_id: {
          type: 'number',
          description: 'Job ID',
        },
      },
      required: ['owner', 'repo', 'job_id'],
    },
  },
  {
    name: 'github_download_workflow_run_logs',
    description: 'Download logs for a workflow run',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        run_id: {
          type: 'number',
          description: 'Workflow run ID',
        },
      },
      required: ['owner', 'repo', 'run_id'],
    },
  },
  {
    name: 'github_delete_workflow_run_logs',
    description: 'Delete logs for a workflow run',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        run_id: {
          type: 'number',
          description: 'Workflow run ID',
        },
      },
      required: ['owner', 'repo', 'run_id'],
    },
  },
  {
    name: 'github_list_artifacts',
    description: 'List artifacts for a repository or workflow run',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        run_id: {
          type: 'number',
          description: 'Workflow run ID (optional)',
        },
        per_page: {
          type: 'number',
          description: 'Results per page (default: 30)',
        },
        page: {
          type: 'number',
          description: 'Page number (default: 1)',
        },
        name: {
          type: 'string',
          description: 'Filter by artifact name',
        },
      },
      required: ['owner', 'repo'],
    },
  },
  {
    name: 'github_get_artifact',
    description: 'Get an artifact',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        artifact_id: {
          type: 'number',
          description: 'Artifact ID',
        },
      },
      required: ['owner', 'repo', 'artifact_id'],
    },
  },
  {
    name: 'github_download_artifact',
    description: 'Download an artifact as a zip file',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        artifact_id: {
          type: 'number',
          description: 'Artifact ID',
        },
      },
      required: ['owner', 'repo', 'artifact_id'],
    },
  },
  {
    name: 'github_delete_artifact',
    description: 'Delete an artifact',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        artifact_id: {
          type: 'number',
          description: 'Artifact ID',
        },
      },
      required: ['owner', 'repo', 'artifact_id'],
    },
  },
  {
    name: 'github_create_workflow_dispatch',
    description: 'Trigger a workflow dispatch event',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        workflow_id: {
          description: 'Workflow ID or filename',
        },
        ref: {
          type: 'string',
          description: 'Git ref (branch or tag)',
        },
        inputs: {
          type: 'object',
          description: 'Workflow inputs (key-value pairs)',
        },
      },
      required: ['owner', 'repo', 'workflow_id', 'ref'],
    },
  },
  {
    name: 'github_get_workflow_usage',
    description: 'Get workflow usage statistics',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        workflow_id: {
          description: 'Workflow ID or filename',
        },
      },
      required: ['owner', 'repo', 'workflow_id'],
    },
  },
  {
    name: 'github_get_workflow_run_usage',
    description: 'Get workflow run usage statistics',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        run_id: {
          type: 'number',
          description: 'Workflow run ID',
        },
      },
      required: ['owner', 'repo', 'run_id'],
    },
  },
  {
    name: 'github_search_repositories',
    description: 'Search for repositories using GitHub query syntax',
    parameters: {
      type: 'object',
      properties: {
        q: {
          type: 'string',
          description: 'Search query (e.g., "language:javascript stars:>1000")',
        },
        sort: {
          type: 'string',
          description: 'Sort by: stars, forks, help-wanted-issues, or updated',
        },
        order: {
          type: 'string',
          description: 'Order: asc or desc',
        },
        per_page: {
          type: 'number',
          description: 'Results per page (default: 30, max: 100)',
        },
        page: {
          type: 'number',
          description: 'Page number (default: 1)',
        },
      },
      required: ['q'],
    },
  },
  {
    name: 'github_search_code',
    description: 'Search for code across GitHub repositories',
    parameters: {
      type: 'object',
      properties: {
        q: {
          type: 'string',
          description: 'Search query (e.g., "addClass in:file language:js repo:jquery/jquery")',
        },
        sort: {
          type: 'string',
          description: 'Sort by: indexed',
        },
        order: {
          type: 'string',
          description: 'Order: asc or desc',
        },
        per_page: {
          type: 'number',
          description: 'Results per page (default: 30, max: 100)',
        },
        page: {
          type: 'number',
          description: 'Page number (default: 1)',
        },
      },
      required: ['q'],
    },
  },
  {
    name: 'github_search_commits',
    description: 'Search for commits across GitHub',
    parameters: {
      type: 'object',
      properties: {
        q: {
          type: 'string',
          description: 'Search query (e.g., "css committer-date:>2021-01-01")',
        },
        sort: {
          type: 'string',
          description: 'Sort by: author-date or committer-date',
        },
        order: {
          type: 'string',
          description: 'Order: asc or desc',
        },
        per_page: {
          type: 'number',
          description: 'Results per page (default: 30, max: 100)',
        },
        page: {
          type: 'number',
          description: 'Page number (default: 1)',
        },
      },
      required: ['q'],
    },
  },
  {
    name: 'github_search_issues',
    description: 'Search for issues and pull requests',
    parameters: {
      type: 'object',
      properties: {
        q: {
          type: 'string',
          description: 'Search query (e.g., "is:issue is:open label:bug")',
        },
        sort: {
          type: 'string',
          description: 'Sort by: comments, reactions, reactions-+1, reactions--1, reactions-smile, reactions-thinking_face, reactions-heart, reactions-tada, interactions, created, or updated',
        },
        order: {
          type: 'string',
          description: 'Order: asc or desc',
        },
        per_page: {
          type: 'number',
          description: 'Results per page (default: 30, max: 100)',
        },
        page: {
          type: 'number',
          description: 'Page number (default: 1)',
        },
      },
      required: ['q'],
    },
  },
  {
    name: 'github_search_users',
    description: 'Search for users on GitHub',
    parameters: {
      type: 'object',
      properties: {
        q: {
          type: 'string',
          description: 'Search query (e.g., "tom location:London followers:>1000")',
        },
        sort: {
          type: 'string',
          description: 'Sort by: followers, repositories, or joined',
        },
        order: {
          type: 'string',
          description: 'Order: asc or desc',
        },
        per_page: {
          type: 'number',
          description: 'Results per page (default: 30, max: 100)',
        },
        page: {
          type: 'number',
          description: 'Page number (default: 1)',
        },
      },
      required: ['q'],
    },
  },
  {
    name: 'github_search_topics',
    description: 'Search for topics on GitHub',
    parameters: {
      type: 'object',
      properties: {
        q: {
          type: 'string',
          description: 'Search query (e.g., "ruby is:featured")',
        },
        per_page: {
          type: 'number',
          description: 'Results per page (default: 30, max: 100)',
        },
        page: {
          type: 'number',
          description: 'Page number (default: 1)',
        },
      },
      required: ['q'],
    },
  },
  {
    name: 'github_search_labels',
    description: 'Search for labels in a repository',
    parameters: {
      type: 'object',
      properties: {
        repository_id: {
          type: 'number',
          description: 'Repository ID',
        },
        q: {
          type: 'string',
          description: 'Search query',
        },
        sort: {
          type: 'string',
          description: 'Sort by: created or updated',
        },
        order: {
          type: 'string',
          description: 'Order: asc or desc',
        },
        per_page: {
          type: 'number',
          description: 'Results per page (default: 30, max: 100)',
        },
        page: {
          type: 'number',
          description: 'Page number (default: 1)',
        },
      },
      required: ['repository_id', 'q'],
    },
  },
  {
    name: 'github_list_webhooks',
    description: 'List all webhooks for a repository',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        per_page: {
          type: 'number',
          description: 'Results per page (default: 30, max: 100)',
        },
        page: {
          type: 'number',
          description: 'Page number (default: 1)',
        },
      },
      required: ['owner', 'repo'],
    },
  },
  {
    name: 'github_get_webhook',
    description: 'Get a specific webhook by ID',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        hook_id: {
          type: 'number',
          description: 'Webhook ID',
        },
      },
      required: ['owner', 'repo', 'hook_id'],
    },
  },
  {
    name: 'github_create_webhook',
    description: 'Create a new webhook for a repository',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        config: {
          type: 'object',
          description: 'Webhook configuration',
          properties: {
            url: {
              type: 'string',
              description: 'The URL to which the payloads will be delivered',
            },
            content_type: {
              type: 'string',
              description: 'The media type used to serialize the payloads (json or form)',
            },
            secret: {
              type: 'string',
              description: 'Secret used for webhook signature verification',
            },
            insecure_ssl: {
              type: 'string',
              description: 'Whether to verify SSL certificates (0 or 1)',
            },
          },
          required: ['url'],
        },
        events: {
          type: 'array',
          description: 'Events that trigger the webhook (default: ["push"])',
          items: {
            type: 'string',
          },
        },
        active: {
          type: 'boolean',
          description: 'Whether the webhook is active (default: true)',
        },
      },
      required: ['owner', 'repo', 'config'],
    },
  },
  {
    name: 'github_update_webhook',
    description: 'Update an existing webhook',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        hook_id: {
          type: 'number',
          description: 'Webhook ID',
        },
        config: {
          type: 'object',
          description: 'Webhook configuration',
          properties: {
            url: {
              type: 'string',
              description: 'The URL to which the payloads will be delivered',
            },
            content_type: {
              type: 'string',
              description: 'The media type used to serialize the payloads (json or form)',
            },
            secret: {
              type: 'string',
              description: 'Secret used for webhook signature verification',
            },
            insecure_ssl: {
              type: 'string',
              description: 'Whether to verify SSL certificates (0 or 1)',
            },
          },
        },
        events: {
          type: 'array',
          description: 'Events that trigger the webhook',
          items: {
            type: 'string',
          },
        },
        add_events: {
          type: 'array',
          description: 'Events to add to the webhook',
          items: {
            type: 'string',
          },
        },
        remove_events: {
          type: 'array',
          description: 'Events to remove from the webhook',
          items: {
            type: 'string',
          },
        },
        active: {
          type: 'boolean',
          description: 'Whether the webhook is active',
        },
      },
      required: ['owner', 'repo', 'hook_id'],
    },
  },
  {
    name: 'github_delete_webhook',
    description: 'Delete a webhook',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        hook_id: {
          type: 'number',
          description: 'Webhook ID',
        },
      },
      required: ['owner', 'repo', 'hook_id'],
    },
  },
  {
    name: 'github_ping_webhook',
    description: 'Trigger a ping event to be sent to the webhook',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        hook_id: {
          type: 'number',
          description: 'Webhook ID',
        },
      },
      required: ['owner', 'repo', 'hook_id'],
    },
  },
  {
    name: 'github_test_webhook',
    description: 'Trigger a test push event to be sent to the webhook',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        hook_id: {
          type: 'number',
          description: 'Webhook ID',
        },
      },
      required: ['owner', 'repo', 'hook_id'],
    },
  },
  {
    name: 'github_list_webhook_deliveries',
    description: 'List deliveries for a webhook',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        hook_id: {
          type: 'number',
          description: 'Webhook ID',
        },
        per_page: {
          type: 'number',
          description: 'Results per page (default: 30, max: 100)',
        },
        cursor: {
          type: 'string',
          description: 'Cursor for pagination',
        },
        redelivery: {
          type: 'boolean',
          description: 'Filter by redelivery status',
        },
      },
      required: ['owner', 'repo', 'hook_id'],
    },
  },
  {
    name: 'github_get_webhook_delivery',
    description: 'Get a specific webhook delivery',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        hook_id: {
          type: 'number',
          description: 'Webhook ID',
        },
        delivery_id: {
          type: 'number',
          description: 'Delivery ID',
        },
      },
      required: ['owner', 'repo', 'hook_id', 'delivery_id'],
    },
  },
  {
    name: 'github_redeliver_webhook',
    description: 'Redeliver a webhook delivery',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        hook_id: {
          type: 'number',
          description: 'Webhook ID',
        },
        delivery_id: {
          type: 'number',
          description: 'Delivery ID',
        },
      },
      required: ['owner', 'repo', 'hook_id', 'delivery_id'],
    },
  },
  {
    name: 'github_update_repository',
    description: 'Update repository settings and configuration',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        name: {
          type: 'string',
          description: 'New repository name',
        },
        description: {
          type: 'string',
          description: 'Repository description',
        },
        homepage: {
          type: 'string',
          description: 'Repository homepage URL',
        },
        private: {
          type: 'boolean',
          description: 'Make repository private',
        },
        visibility: {
          type: 'string',
          description: 'Repository visibility: public, private, or internal',
        },
        has_issues: {
          type: 'boolean',
          description: 'Enable issues',
        },
        has_projects: {
          type: 'boolean',
          description: 'Enable projects',
        },
        has_wiki: {
          type: 'boolean',
          description: 'Enable wiki',
        },
        has_downloads: {
          type: 'boolean',
          description: 'Enable downloads',
        },
        is_template: {
          type: 'boolean',
          description: 'Make this a template repository',
        },
        default_branch: {
          type: 'string',
          description: 'Default branch name',
        },
        allow_squash_merge: {
          type: 'boolean',
          description: 'Allow squash merge',
        },
        allow_merge_commit: {
          type: 'boolean',
          description: 'Allow merge commit',
        },
        allow_rebase_merge: {
          type: 'boolean',
          description: 'Allow rebase merge',
        },
        allow_auto_merge: {
          type: 'boolean',
          description: 'Allow auto-merge',
        },
        delete_branch_on_merge: {
          type: 'boolean',
          description: 'Automatically delete head branches after PRs are merged',
        },
        archived: {
          type: 'boolean',
          description: 'Archive this repository',
        },
        allow_forking: {
          type: 'boolean',
          description: 'Allow forking',
        },
      },
      required: ['owner', 'repo'],
    },
  },
  {
    name: 'github_get_repository_topics',
    description: 'Get topics for a repository',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
      },
      required: ['owner', 'repo'],
    },
  },
  {
    name: 'github_replace_repository_topics',
    description: 'Replace all topics for a repository',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        topics: {
          type: 'array',
          description: 'Array of topic names',
          items: {
            type: 'string',
          },
        },
      },
      required: ['owner', 'repo', 'topics'],
    },
  },
  {
    name: 'github_list_collaborators',
    description: 'List collaborators for a repository',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        affiliation: {
          type: 'string',
          description: 'Filter by affiliation: outside, direct, or all',
        },
        permission: {
          type: 'string',
          description: 'Filter by permission: pull, triage, push, maintain, or admin',
        },
        per_page: {
          type: 'number',
          description: 'Results per page (default: 30, max: 100)',
        },
        page: {
          type: 'number',
          description: 'Page number (default: 1)',
        },
      },
      required: ['owner', 'repo'],
    },
  },
  {
    name: 'github_check_collaborator',
    description: 'Check if a user is a collaborator',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        username: {
          type: 'string',
          description: 'Username to check',
        },
      },
      required: ['owner', 'repo', 'username'],
    },
  },
  {
    name: 'github_add_collaborator',
    description: 'Add a collaborator to a repository',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        username: {
          type: 'string',
          description: 'Username to add',
        },
        permission: {
          type: 'string',
          description: 'Permission level: pull, push, admin, maintain, or triage',
        },
      },
      required: ['owner', 'repo', 'username'],
    },
  },
  {
    name: 'github_remove_collaborator',
    description: 'Remove a collaborator from a repository',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        username: {
          type: 'string',
          description: 'Username to remove',
        },
      },
      required: ['owner', 'repo', 'username'],
    },
  },
  {
    name: 'github_get_collaborator_permission',
    description: 'Get permission level for a collaborator',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        username: {
          type: 'string',
          description: 'Username',
        },
      },
      required: ['owner', 'repo', 'username'],
    },
  },
  {
    name: 'github_list_repository_invitations',
    description: 'List pending repository invitations',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        per_page: {
          type: 'number',
          description: 'Results per page (default: 30, max: 100)',
        },
        page: {
          type: 'number',
          description: 'Page number (default: 1)',
        },
      },
      required: ['owner', 'repo'],
    },
  },
  {
    name: 'github_delete_repository_invitation',
    description: 'Delete a repository invitation',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        invitation_id: {
          type: 'number',
          description: 'Invitation ID',
        },
      },
      required: ['owner', 'repo', 'invitation_id'],
    },
  },
  {
    name: 'github_get_repository_languages',
    description: 'Get programming languages used in a repository',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
      },
      required: ['owner', 'repo'],
    },
  },
  {
    name: 'github_get_code_frequency_stats',
    description: 'Get weekly addition and deletion stats',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
      },
      required: ['owner', 'repo'],
    },
  },
  {
    name: 'github_get_contributors_stats',
    description: 'Get contributor activity statistics',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
      },
      required: ['owner', 'repo'],
    },
  },
  {
    name: 'github_get_participation_stats',
    description: 'Get weekly commit count statistics',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
      },
      required: ['owner', 'repo'],
    },
  },
  {
    name: 'github_transfer_repository',
    description: 'Transfer a repository to a new owner',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Current repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        new_owner: {
          type: 'string',
          description: 'New owner username or organization',
        },
        team_ids: {
          type: 'array',
          description: 'Team IDs to add (only for orgs)',
          items: {
            type: 'number',
          },
        },
      },
      required: ['owner', 'repo', 'new_owner'],
    },
  },
  {
    name: 'github_list_repository_teams',
    description: 'List teams with access to a repository',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        per_page: {
          type: 'number',
          description: 'Results per page (default: 30, max: 100)',
        },
        page: {
          type: 'number',
          description: 'Page number (default: 1)',
        },
      },
      required: ['owner', 'repo'],
    },
  },
  {
    name: 'github_check_team_permission',
    description: 'Check team permission for a repository',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        team_slug: {
          type: 'string',
          description: 'Team slug',
        },
      },
      required: ['owner', 'repo', 'team_slug'],
    },
  },
  {
    name: 'github_add_repository_team',
    description: 'Add or update team access to a repository',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        team_slug: {
          type: 'string',
          description: 'Team slug',
        },
        permission: {
          type: 'string',
          description: 'Permission level: pull, push, admin, maintain, or triage',
        },
      },
      required: ['owner', 'repo', 'team_slug'],
    },
  },
  {
    name: 'github_remove_repository_team',
    description: 'Remove team access from a repository',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
        team_slug: {
          type: 'string',
          description: 'Team slug',
        },
      },
      required: ['owner', 'repo', 'team_slug'],
    },
  },
  {
    name: 'github_enable_automated_security_fixes',
    description: 'Enable automated security fixes (Dependabot)',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
      },
      required: ['owner', 'repo'],
    },
  },
  {
    name: 'github_disable_automated_security_fixes',
    description: 'Disable automated security fixes (Dependabot)',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
      },
      required: ['owner', 'repo'],
    },
  },
  {
    name: 'github_enable_vulnerability_alerts',
    description: 'Enable vulnerability alerts (Dependabot alerts)',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
      },
      required: ['owner', 'repo'],
    },
  },
  {
    name: 'github_disable_vulnerability_alerts',
    description: 'Disable vulnerability alerts (Dependabot alerts)',
    parameters: {
      type: 'object',
      properties: {
        owner: {
          type: 'string',
          description: 'Repository owner',
        },
        repo: {
          type: 'string',
          description: 'Repository name',
        },
      },
      required: ['owner', 'repo'],
    },
  },
];
