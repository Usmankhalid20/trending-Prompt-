# Project Progress & Agent Handoff Context — AI Prompt Hub

**Last updated:** 2026-08-22  
**Status:** Creator Portal built and wired. MongoDB Atlas connection is the active blocker for all dynamic features.

---

## What This Project Is

A Next.js 15 application — **AI Prompt Hub** — with three separate portals:

| Portal | Route | Role | Purpose |
|---|---|---|---|
| Public landing | `/` | Guest | Marketing page, explore prompts |
| User portal | `/dashboard` | `user` | Browse saved prompts, basic profile |
| **Creator portal** | `/creator` | `creator` | Submit AI prompts for admin review |
| Admin portal | `/admin` | admin roles | Moderate prompts, manage users |

---

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Database:** MongoDB Atlas (`/lib/mongodb.ts` — `clientPromise`)
- **Auth:** JOSE JWT in HTTP-only cookie (`session`), scrypt password hashing
- **Fonts:** Space Grotesk (display), IBM Plex Sans (body), IBM Plex Mono (mono)
- **Styling:** Tailwind CSS + inline design-system styles (see `globals.css`)
- **Storage:** Cloudinary (image uploads)

---

## Active Blocker — MongoDB

The Atlas cluster (`cluster0.mj7ebdh.mongodb.net`) throws `querySrv ENOTFOUND` / TLS alert 80.  
**Fix required before any dynamic feature works:**  
1. Log into MongoDB Atlas → Network Access → Add current IP (or `0.0.0.0/0` for dev)  
2. Check cluster is not paused  
3. Optionally switch from SRV URI to standard URI in `.env`

---

## What Was Built in This Session

### 1. Public Landing Page — Redesigned (`/`)
All components rebuilt with the "light table / contact sheet" design system:
- `components/Navbar.tsx` — sticky blur nav, hamburger menu, creator/user/admin routing
- `components/Hero.tsx` — 3 stacked film-card light table, gradient swatches, copy toast
- `components/Features.tsx` — mono tag badges (PREVIEW, COPY, VERIFIED, etc.)
- `components/HowItWorks.tsx` — film-frame counter circles on a hairline strip
- `components/CTASection.tsx` — paper (#F3F0FA) light band (only light moment on dark page)
- `components/Footer.tsx` — minimal, logo + one-line description
- `app/globals.css` — full design token set (`--ink`, `--coral`, `--mint`, `--paper`, etc.)
- `app/layout.tsx` — Space Grotesk + IBM Plex Sans + IBM Plex Mono via next/font/google

### 2. Shared Auth Component
- **`components/AuthForm.tsx`** — single component handles `login`, `register`, `creator-register` modes  
  Config-driven: heading, CTA text, API path, redirect all set per mode.  
  Role-to-redirect map centralised here.
- `app/login/page.tsx` — thin wrapper: `<AuthForm mode="login" />`
- `app/register/page.tsx` — thin wrapper: `<AuthForm mode="register" />`
- `app/creator/register/page.tsx` — thin wrapper: `<AuthForm mode="creator-register" />`
- `app/api/auth/register/route.ts` — updated to accept optional `role: 'creator'`

### 3. Creator Portal (NEW — fully built)
Routes: `/creator`, `/creator/prompts`, `/creator/prompts/new`, `/creator/prompts/[id]/edit`, `/creator/profile`, `/creator/register`

**Layout:** `app/creator/layout.tsx`  
- Verifies session role === `creator`, else redirects to `/login`
- Sticky sidebar (desktop) / hamburger drawer (mobile)  
- Shows "CREATOR STUDIO" label to distinguish from user/admin

**Pages built:**
- `app/creator/page.tsx` — Dashboard: 5 stat cards (Total/Drafts/Pending/Approved/Rejected) + recent table
- `app/creator/prompts/page.tsx` — Prompt list with status tabs, edit/delete actions
- `app/creator/prompts/new/page.tsx` — Create: thin wrapper over `PromptForm`
- `app/creator/prompts/[id]/edit/page.tsx` — Edit: thin wrapper over `PromptForm`, auto-readonly for pending/approved
- `app/creator/profile/page.tsx` — Name, bio, password change

**Shared form component:**  
`components/PromptForm.tsx` — reusable for both create and edit. Props: `initial`, `rejectionReason`, `readonly`, `readonlyNotice`, `onSubmit`. No UI duplication.

**API routes (creator-specific, role-guarded):**
- `app/api/creator/prompts/route.ts` — GET (own prompts), POST (create draft/submit)
- `app/api/creator/prompts/[id]/route.ts` — GET, PUT (only draft/rejected editable), DELETE (only draft)

### 4. Data Model Updates
- `lib/models/user.ts` — added `'creator'` to `UserRole` union
- `lib/models/role.ts` — added `creator: []` to `DEFAULT_ROLE_PERMISSIONS`
- `lib/models/prompt.ts` — added `description?: string` and `tags?: string[]` fields

---

## What Is NOT Yet Done

### Creator portal gaps (minor)
- [ ] Admin portal has no "Creator" filter in the prompt queue — admins see all pending prompts regardless of source (user or creator). No action needed unless you want to distinguish.
- [ ] No `/api/creator/profile` dedicated route — profile page uses existing `/api/user/profile` PUT which is generic enough.

### User portal (`/dashboard`) — existing code, not yet updated
The old `/dashboard` still exists and works for `user` role. It has its own `app/api/user/prompts` routes. These are independent from the creator portal routes.

### Admin portal (`/admin`)
Exists and works (separate codebase). The admin prompt moderation queue will automatically show creator-submitted prompts (same `prompts` MongoDB collection, status `pending`). No admin-side changes needed to support creator prompts.

---

## File Map (Key Files)

```
app/
  globals.css                        ← design tokens + fonts
  layout.tsx                         ← root layout (Space Grotesk + IBM Plex)
  page.tsx                           ← public landing
  login/page.tsx                     ← <AuthForm mode="login" />
  register/page.tsx                  ← <AuthForm mode="register" />
  creator/
    layout.tsx                       ← creator guard + sidebar
    page.tsx                         ← dashboard
    register/page.tsx                ← <AuthForm mode="creator-register" />
    prompts/
      page.tsx                       ← my prompts list
      new/page.tsx                   ← create (uses PromptForm)
      [id]/edit/page.tsx             ← edit (uses PromptForm)
    profile/page.tsx
  api/
    auth/
      login/route.ts
      register/route.ts              ← accepts role:'creator'
      logout/route.ts
      me/route.ts
    creator/
      prompts/route.ts               ← GET + POST
      prompts/[id]/route.ts          ← GET + PUT + DELETE
    user/
      prompts/route.ts
      prompts/[id]/route.ts
      profile/route.ts
    admin/ ...

components/
  AuthForm.tsx                       ← shared login/register component
  PromptForm.tsx                     ← shared create/edit form
  Navbar.tsx                         ← handles user/creator/admin routing
  Hero.tsx  Features.tsx  HowItWorks.tsx  CTASection.tsx  Footer.tsx

lib/
  mongodb.ts                         ← MongoDB connection
  auth.ts                            ← JWT, getSession, ensureSuperAdmin
  password.ts                        ← scrypt hash/verify
  models/
    user.ts                          ← UserRole includes 'creator'
    prompt.ts                        ← includes tags, description
    role.ts                          ← DEFAULT_ROLE_PERMISSIONS includes creator:[]
```

---

## Default Credentials

From `.env`:
- **Email:** `admin@gmail.com`
- **Password:** `password`

Auto-seeded via `ensureSuperAdmin()` on first login API call (once MongoDB is reachable).

---

## Design Tokens (from globals.css)

| Token | Value | Use |
|---|---|---|
| `--ink` | `#14121A` | Page background |
| `--surface` | `#1D1926` | Card background |
| `--surface-2` | `#262131` | Hover/raised |
| `--line` | `#37324A` | Borders |
| `--paper` | `#F3F0FA` | CTA band (light moment) |
| `--coral` | `#FF6B4A` | Primary action |
| `--mint` | `#83E6C9` | Tags, badges, accents |
| `--text` | `#EDE9F7` | Primary text |
| `--text-muted` | `#A79FC4` | Secondary text |
