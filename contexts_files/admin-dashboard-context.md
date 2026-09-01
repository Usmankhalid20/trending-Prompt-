# Admin Dashboard Context — AI Prompt Hub

## Purpose

Provide administrators and content moderators with tools (`/admin`) to upload AI artwork prompts, review user/creator submissions, manage categories, enforce platform quality control, and manage system roles.

---

## Technical Implementation Status

* **Status:** Fully operational & integrated with Redis cache invalidation.
* **Routes:** `/admin`, `/admin/prompts`, `/admin/users`, `/admin/creators`, `/admin/admins`, `/admin/categories`, `/admin/roles`, `/admin/logs`, `/admin/settings`
* **Theme Support:** Fully compatible with Light/Dark mode via `PortalSidebar`.
* **Cache Invalidation:** Approving, rejecting, updating visibility, or deleting a prompt instantly calls `clearCachePattern('prompts:')` to invalidate public Redis cache queries.
* **Security:** IP‑based rate limiting (5 attempts/60s) is enforced on `/api/auth/login` and `/api/auth/register`; CSRF protection is recommended for all state‑changing operations and will be added in a future update.

---

## Admin Portal Modules

1. **Overview (`/admin`):**
   * Real-time metrics for Pending Submissions, Published Prompts, Registered Users, and Active Categories.
   * Quick-review preview queue for pending prompt submissions.

2. **Prompt Queue & Moderation (`/admin/prompts`):**
   * **Approve / Reject Pipeline:** Approve pending creator prompts or reject with specific feedback.
   * **Visibility Toggle:** Toggle public visibility (`visible: true/false`).
   * **Add & Edit Prompts:** Open `AddPromptModal` or `PromptForm` with direct Cloudinary artwork upload (`/api/upload`).
   * **Delete Prompts:** Permanently remove bad or broken prompt submissions.

3. **User & Creator Management (`/admin/users`, `/admin/creators`):**
   * Search users, toggle account status (`active` / `suspended`), and assign roles.
   * Review creator applications and change creator status (`pending` -> `approved`).

4. **Super Admin Management (`/admin/admins`, `/admin/roles`):**
   * Manage administrator credentials (`ADMIN_EMAIL`, `ADMIN_PASSWORD`).
   * Super Admin dynamic permission matrix (`super_admin`, `senior_admin`, `content_admin`, `moderator`).
   * Permissions use the standardised `resource:action` naming (e.g., `prompt:approve`, `user:suspend`).

5. **Audit Logs & Platform Settings (`/admin/logs`, `/admin/settings`):**
   * Historical record of moderation actions and system configuration settings.

---

## Cache Invalidation Matrix

| Operation | Cache Pattern Invalidated | Affected Routes |
|---|---|---|
| Approve Prompt | `prompts:` | `/api/prompts`, `/api/admin/prompts` |
| Reject Prompt | `prompts:` | `/api/prompts`, `/api/admin/prompts` |
| Create Prompt | `prompts:` | `/api/prompts` |
| Delete Prompt | `prompts:` | `/api/prompts`, `/api/admin/prompts` |
| Update Visibility | `prompts:` | `/api/prompts` |
| Update Category | `categories:` | `/api/categories` (if categories are cached) |
