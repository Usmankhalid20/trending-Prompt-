# Super Admin Context — AI Prompt Hub

## Purpose

The Super Admin has complete control over the platform, system security, administrator accounts, dynamic role-permission matrices, category definitions, and audit activity logging.

---

## Super Admin Responsibilities

1. **Administrator Lifecycle Management:** Create, edit, suspend, activate, and delete administrator accounts (`/admin/admins`).
2. **Dynamic Permission Matrices:** Define granular permission sets (`prompts:view`, `prompts:review`, `prompts:approve`, `prompts:delete`, `users:view`, `users:suspend`, `admins:create`, `logs:view`) for custom admin roles (`/admin/roles`).
3. **Audit Activity Monitoring:** Track administrative login histories, prompt moderation actions, and account state modifications in the platform audit logs (`/admin/logs`).
4. **Automated System Seeding:** Built-in auto-seeding (`ensureSuperAdmin()`) creates default system roles and the initial Super Admin account upon server boot.
