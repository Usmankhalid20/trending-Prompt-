# Creator Portal Context

## Purpose

The Creator Portal allows registered creators to create, manage, and submit AI prompts for admin review. Creators can manage their own prompt drafts and submissions, but they cannot directly publish prompts.

---

## Technical Implementation Status

* **Status:** Fully built & themed using single Light-Table design system tokens.
* **Routes:** `/creator`, `/creator/prompts`, `/creator/prompts/new`, `/creator/prompts/[id]/edit`, `/creator/profile`, `/creator/register`
* **Theme Support:** Fully refactored to use semantic theme tokens (`bg-card`, `bg-background`, `border-border`, `text-foreground`, `text-muted-foreground`), supporting seamless Light/Dark mode toggling via `PortalSidebar`.
* **Cache Invalidation:** Creating, editing, or deleting prompt drafts automatically invalidates the Redis cache pattern `prompts:`. Specific triggers:
  - `POST /api/creator/prompts` (create) → invalidates `prompts:`
  - `PUT /api/creator/prompts/:id` (edit) → invalidates `prompts:`
  - `DELETE /api/creator/prompts/:id` (delete) → invalidates `prompts:`
  - Submitting for review (status change to `pending`) → also invalidates `prompts:`.
* **Loading & Error States:** All form submissions and data fetches display skeleton loaders and clear error banners (e.g., on network failure or validation errors).

---

## Creator Authentication & Role Guard

Creators can:
- Register (`/creator/register` via `AuthForm`)
- Login & Logout
- Manage Profile & Security Credentials (`/creator/profile`)

*Guard Behavior:* `app/creator/layout.tsx` verifies JWT session role (`creator`). If applicant status is `pending`, `rejected`, or `suspended`, the layout renders a clear status card with escape routes rather than a dead-end UI.

---

## Creator Dashboard (`/creator`)

Features 5 dynamic stat cards:
- Total Prompts
- Drafts
- Pending Prompts
- Approved Prompts
- Rejected Prompts

Includes a recent submissions table with status badges (`draft`, `pending`, `approved`, `rejected`).

---

## Prompt Management & Workflow

```text
Creator
   ↓
Create Prompt (/creator/prompts/new) -> Upload Artwork Sample to Cloudinary
   ↓
Save Draft OR Submit for Review
   ↓
Pending Status (Cached & Invalidated on Status Change)
   ↓
Admin Review (/admin/prompts)
   ↓
Approve / Reject
   ↓
Approved & Visible in User Portal & Public Explore Section
```

---

## Form Component Architecture

* **`components/PromptForm.tsx`** — Reusable form component handling both create and edit flows.
* **Fields:** Title, Category, Sample Artwork Image (Cloudinary `/api/upload` integration), Prompt Content Payload, Description, Tags.
* **Read-only Enforcement:** Disables edits when a prompt is in `pending` or `approved` state.

---

## UI/UX Standards

* Clean workspace layout with `PortalSidebar`.
* Standardized button & badge variants.
* Skeleton loading states and empty state messages.
* Theme-aware typography using `Space Grotesk`, `IBM Plex Sans`, and `IBM Plex Mono`.
