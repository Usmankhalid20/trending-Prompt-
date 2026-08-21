# User Portal Context — AI Prompt Hub

## Purpose

Provide authenticated users with a personal workspace (`/dashboard`) to manage their AI prompt creations, track submission review statuses, and save favorite image prompts.

---

## User Workspace Dashboard (`/dashboard`)

- **Overview Cards:** Total Prompts, Pending Review, Approved/Published, Drafts
- **My Prompts (`/dashboard/prompts`):** List of user-submitted prompts with real-time status indicators
- **Create Prompt (`/dashboard/prompts/new`):** Prompt submission form with Cloudinary image upload, prompt text, title, and target AI model
- **Profile & Security (`/dashboard/profile`):** User profile information and password management

---

## Prompt Life-Cycle

1. **Submission:** User fills out title, prompt text, target AI model (Midjourney, DALL-E 3, ChatGPT), and uploads artwork sample image.
2. **Pending Moderation:** Submission defaults to `pending` status and enters the Admin Moderation Queue.
3. **Review Decision:**
   - **Approved / Published:** Prompt becomes publicly visible in the `/explore` gallery and landing page showcase.
   - **Rejected:** Feedback/rejection reason is provided to the user.
