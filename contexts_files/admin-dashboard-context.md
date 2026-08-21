# Admin Dashboard Context — AI Prompt Hub

## Purpose

Provide administrators and content moderators with tools (`/admin`) to upload AI artwork prompts, review user submissions, manage categories, and enforce platform quality control.

---

## Admin Portal Modules

- **Overview (`/admin`):** Platform metrics, total prompts, pending queue count, and user activity.
- **Prompt Moderation & Management (`/admin/prompts`):**
  - **Add AI Image Prompt:** Open creation modal (`AddPromptModal`) to upload high-res image artwork via Cloudinary, enter prompt text, assign model tags, and publish instantly.
  - **Review Queue:** Review pending prompt submissions, inspect prompt text, approve, reject with reason, publish, hide, or delete.
- **User Management (`/admin/users`):** Search users, view activity, suspend, or reactivate accounts.
- **Admin Management (`/admin/admins`):** Super Admin management of administrator credentials and role assignments.
- **Roles & Permissions (`/admin/roles`):** Dynamic permission matrix (`super_admin`, `senior_admin`, `content_admin`, `moderator`).
- **Audit Logs (`/admin/logs`):** Historical log of all administrative actions and moderation events.
