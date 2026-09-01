# Project Progress & Agent Handoff Context — AI Prompt Hub

**Last updated:** 2026-08-22  
**Status:** Production Ready. Caching engine, Docker infrastructure, complete technical documentation, single light-table visual system, and 3D fanned editorial hero carousel fully implemented & verified.

---

## 🚀 Executive Summary & Architecture

**AI Prompt Hub** is a Next.js 14 application (App Router with Turbopack) featuring four distinct portals and high-speed Redis caching:

| Portal / Module | Route | Role | Purpose & Features |
| :--- | :--- | :--- | :--- |
| **Public Landing** | `/` | Guest | Light-table visual gallery, 3D fanned card carousel, prompt search, model/category filters |
| **User Portal** | `/dashboard` | `user` | Saved prompts, category breakdown, community exploration |
| **Creator Studio** | `/creator` | `creator` | Submit prompts, Cloudinary image upload, review status tracking (`pending`, `approved`, `rejected`) |
| **Admin Portal** | `/admin` | admin roles | Prompt queue moderation, user management, category CRUD, system audit logs |
| **Documentation** | `/docs` | All | 6-part modular technical documentation suite ([`docs/README.md`](file:///c:/Users/usman/Documents/AiTrendingPrompts/AiTrendingPrompts/docs/README.md)) |

---

## 🛠️ Complete Tech Stack

- **Framework:** Next.js 14 (App Router with Turbopack)
- **Database:** MongoDB Atlas (`lib/mongodb.ts` — `getMongoClient`)
- **Cache Engine:** Redis (`ioredis`) in [`lib/redis.ts`](file:///c:/Users/usman/Documents/AiTrendingPrompts/AiTrendingPrompts/lib/redis.ts) with silent fallback in-memory `Map` cache
- **Container Infrastructure:** Docker Compose ([`docker-compose.yml`](file:///c:/Users/usman/Documents/AiTrendingPrompts/AiTrendingPrompts/docker-compose.yml)) running Redis 7 & Redis Commander GUI (`localhost:8081`)
- **Auth:** JOSE JWT in HTTP-only cookie (`session`), scrypt password hashing; IP‑based rate limiting (5/60s) on login/register
- **Fonts:** Space Grotesk (`--font-display`), IBM Plex Sans (`--font-sans`), IBM Plex Mono (`--font-mono`)
- **Styling:** Tailwind CSS + Shadcn UI + CSS Tokens (`globals.css`)
- **Storage:** Cloudinary API for prompt artwork samples (`/api/upload`)

---

## ⚡ Caching & Infrastructure Setup

1. **Redis Engine & Fallback:**
   * Prompts fetch (`GET /api/prompts`) checks Redis cache first (`prompts:query:...`).
   * On cache hit: returns sub-50ms response.
   * On prompt creation/update/deletion: invalidates cache pattern `prompts:`.
   * If Redis is unconfigured or disconnected: gracefully falls back to Node.js `Map` memory cache without crashing.

2. **Docker Compose Stack:**
   ```bash
   # Run local Redis server on 6379 and Web GUI on 8081
   docker compose up -d
   ```
   * Environment variable set in `.env`: `REDIS_URL=redis://localhost:6379`.

---

## 🎨 Design System & 3D Hero Carousel

1. **Single Light-Table Visual Identity:**
   * **Background:** `#14121A` (warm near-black) → token `--background`
   * **Card Surface:** `#1D1926` (border `#37324A`) → token `--card`
   * **Primary Accent:** Coral `#FF6B4A` (CTAs, buttons, links) → token `--primary`
   * **Secondary Accent:** Mint `#83E6C9` (badges & parameter tags) → token `--secondary`
   * **Paper Band:** `#F3F0FA` (reserved ONLY for final CTA section) → token `--paper`

2. **3D Fanned Editorial Hero Carousel ([`components/Hero.tsx`](file:///c:/Users/usman/Documents/AiTrendingPrompts/AiTrendingPrompts/components/Hero.tsx)):**
   * **Top Area:** Centered eyebrow tag + single-color headline (`Space Grotesk`) + subtitle + action buttons.
   * **Centerpiece:** 5-card 3D fanned arch carousel (`perspective: 1200px`) with 1.1s cubic-bezier easing.
   * **7-Card Sequence:** `spatial` (brutalist corridor), `identity` (silhouette), `editorial` (paper typography), `digital` (holographic glass), `spatial` (dusk courtyard), `motion` (glossy fluid), `identity` (high-fashion rim light).
   * **Functional Actions:** One-click copy button on active card + working toast notification.

---

## 📚 Technical Documentation Suite (`docs/`)

Created a dedicated documentation folder with 6 files:

1. [`docs/README.md`](file:///c:/Users/usman/Documents/AiTrendingPrompts/AiTrendingPrompts/docs/README.md) — Master Index
2. [`docs/01-project-overview.md`](file:///c:/Users/usman/Documents/AiTrendingPrompts/AiTrendingPrompts/docs/01-project-overview.md) — Project Vision & Problems Solved
3. [`docs/02-architecture-and-tech-stack.md`](file:///c:/Users/usman/Documents/AiTrendingPrompts/AiTrendingPrompts/docs/02-architecture-and-tech-stack.md) — System Diagrams & Schemas
4. [`docs/03-components-and-features.md`](file:///c:/Users/usman/Documents/AiTrendingPrompts/AiTrendingPrompts/docs/03-components-and-features.md) — Component Hierarchy & Sequence Flows
5. [`docs/04-api-and-caching-system.md`](file:///c:/Users/usman/Documents/AiTrendingPrompts/AiTrendingPrompts/docs/04-api-and-caching-system.md) — API Reference & Redis TTL Policies
6. [`docs/05-setup-and-deployment.md`](file:///c:/Users/usman/Documents/AiTrendingPrompts/AiTrendingPrompts/docs/05-setup-and-deployment.md) — Docker Setup & Production Deployment

---

## 🌐 File Map (Key Workspace Files)

```text
app/
  globals.css                        ← Design tokens & typography
  layout.tsx                         ← Root layout with fonts & ThemeProvider
  page.tsx                           ← Public landing page
  not-found.tsx                      ← Custom styled 404 page
  login/page.tsx                     ← Auth login
  register/page.tsx                  ← Auth register
  creator/
    layout.tsx                       ← Creator portal guard & sidebar
    page.tsx                         ← Creator dashboard
    register/page.tsx                ← Creator application
    prompts/
      page.tsx                       ← My submissions list
      new/page.tsx                   ← Prompt creation form
      [id]/edit/page.tsx             ← Edit submission
    profile/page.tsx                 ← Profile settings
  dashboard/                         ← User portal dashboard
  admin/                             ← Admin moderation portal
  api/                               ← REST API route handlers (prompts, auth, admin, creator, upload, demo)

components/
  Hero.tsx                           ← 3D fanned editorial card carousel hero
  ExploreSection.tsx                 ← Interactive prompt library with search & model filters
  Features.tsx                       ← 6 contact sheet feature cards
  HowItWorks.tsx                     ← 3 film-frame step counters (01/02/03)
  CTASection.tsx                     ← Paper band high-contrast CTA block (#F3F0FA)
  Navbar.tsx                         ← Sticky nav & theme toggle
  Footer.tsx                         ← Film logo footer
  PortalSidebar.tsx                  ← Portal sidebar navigation

docs/                                ← 6-part technical documentation suite
docker-compose.yml                   ← Redis 7 & Redis Commander GUI container stack
```

---

## ⚡ Default Credentials (Development Only)

* **Admin Email:** `admin@gmail.com`
* **Admin Password:** `password`
* **Important:** These credentials are only for local development. For production, they must be overridden via environment variables (`DEFAULT_ADMIN_EMAIL`, `DEFAULT_ADMIN_PASSWORD`) and the default account should be disabled or removed.
* **Production Build:** `npm run build` verified — **0 errors across all 40 routes**.

---

## 🔒 Environment Validation & Health Checks

* **Environment Variables:** All required variables (e.g., `MONGODB_URI`, `JWT_SECRET`, `CLOUDINARY_URL`) are validated on startup using a Zod schema. Missing or invalid values will cause the server to exit with a clear error.
* **Health Check Endpoint:** `/api/health` returns JSON with service statuses (MongoDB, Redis, Cloudinary) for monitoring and container orchestration.
