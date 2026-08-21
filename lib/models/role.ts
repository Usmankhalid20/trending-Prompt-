import { ObjectId } from 'mongodb';

export type Permission =
  | 'dashboard:view'
  | 'prompts:view'
  | 'prompts:review'
  | 'prompts:approve'
  | 'prompts:reject'
  | 'prompts:publish'
  | 'prompts:hide'
  | 'prompts:edit'
  | 'prompts:delete'
  | 'users:view'
  | 'users:edit'
  | 'users:suspend'
  | 'users:delete'
  | 'creators:view'
  | 'creators:approve'
  | 'creators:reject'
  | 'creators:suspend'
  | 'categories:manage'
  | 'admins:view'
  | 'admins:create'
  | 'admins:edit'
  | 'admins:delete'
  | 'settings:manage'
  | 'logs:view';

export interface Role {
  _id?: ObjectId;
  key: string;
  name: string;
  description: string;
  permissions: Permission[];
  isSystem?: boolean;
}

export const ALL_PERMISSIONS: { key: Permission; label: string; group: string }[] = [
  { key: 'dashboard:view', label: 'View Dashboard Analytics', group: 'Dashboard' },
  { key: 'prompts:view', label: 'View Prompts', group: 'Prompt Management' },
  { key: 'prompts:review', label: 'Review Prompts Queue', group: 'Prompt Management' },
  { key: 'prompts:approve', label: 'Approve Submitted Prompts', group: 'Prompt Management' },
  { key: 'prompts:reject', label: 'Reject Submitted Prompts', group: 'Prompt Management' },
  { key: 'prompts:publish', label: 'Publish Prompts', group: 'Prompt Management' },
  { key: 'prompts:hide', label: 'Hide Prompts', group: 'Prompt Management' },
  { key: 'prompts:edit', label: 'Edit Prompts', group: 'Prompt Management' },
  { key: 'prompts:delete', label: 'Delete Prompts', group: 'Prompt Management' },
  { key: 'users:view', label: 'View Users List', group: 'User Management' },
  { key: 'users:edit', label: 'Edit User Info', group: 'User Management' },
  { key: 'users:suspend', label: 'Suspend Users', group: 'User Management' },
  { key: 'users:delete', label: 'Delete User Accounts', group: 'User Management' },
  { key: 'creators:view', label: 'View Creator Applications', group: 'Creator Management' },
  { key: 'creators:approve', label: 'Approve Creator Applications', group: 'Creator Management' },
  { key: 'creators:reject', label: 'Reject Creator Applications', group: 'Creator Management' },
  { key: 'creators:suspend', label: 'Suspend Creator Accounts', group: 'Creator Management' },
  { key: 'categories:manage', label: 'Manage Categories', group: 'Category Management' },
  { key: 'admins:view', label: 'View Admin Accounts', group: 'Admin Management' },
  { key: 'admins:create', label: 'Create New Admins', group: 'Admin Management' },
  { key: 'admins:edit', label: 'Edit Admin Roles & Status', group: 'Admin Management' },
  { key: 'admins:delete', label: 'Delete Admin Accounts', group: 'Admin Management' },
  { key: 'settings:manage', label: 'Manage Platform Settings', group: 'Platform Settings' },
  { key: 'logs:view', label: 'View Audit Logs', group: 'Activity Logs' },
];

export const DEFAULT_ROLE_PERMISSIONS: Record<string, Permission[]> = {
  super_admin: ALL_PERMISSIONS.map((p) => p.key),
  senior_admin: [
    'dashboard:view',
    'prompts:view',
    'prompts:review',
    'prompts:approve',
    'prompts:reject',
    'prompts:publish',
    'prompts:hide',
    'prompts:edit',
    'prompts:delete',
    'users:view',
    'users:edit',
    'users:suspend',
    'creators:view',
    'creators:approve',
    'creators:reject',
    'creators:suspend',
    'categories:manage',
    'admins:view',
    'logs:view',
  ],
  content_admin: [
    'dashboard:view',
    'prompts:view',
    'prompts:review',
    'prompts:approve',
    'prompts:reject',
    'prompts:publish',
    'prompts:hide',
    'prompts:edit',
    'categories:manage',
  ],
  moderator: [
    'dashboard:view',
    'prompts:view',
    'prompts:review',
    'prompts:approve',
    'prompts:reject',
  ],
  user: [],
  creator: [],
};
