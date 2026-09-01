# AI Trending Prompts (AI Prompt Hub)

**AI Prompt Hub** is a Next.js application designed as a light-table prompt engineering catalogue and creator ecosystem for Midjourney, DALL·E 3, Stable Diffusion, and ChatGPT. It features sub-50ms Redis query caching, 4 distinct portals, Cloudinary image upload, and an Apple/Framer-inspired 3D fanned editorial card carousel hero.

> 📖 **Comprehensive Technical Documentation:** Detailed guides covering project vision, system architecture, component design, Redis caching engine, API endpoints, Docker setup, and Vercel deployment can be found in the [`docs/`](docs/README.md) directory.

---

## 🌟 Key Features

* **Photographer's Light-Table Visual Identity:** Built using CSS design tokens (`#14121A` warm near-black background, `#1D1926` card surface, `#37324A` borders, Coral `#FF6B4A` primary action, Mint `#83E6C9` parameter badges, and `#F3F0FA` light paper band).
* **3D Fanned Editorial Card Carousel (`Hero.tsx`):** 5-card fanned arch 3D stack (`perspective: 1200px`) featuring kinetic rotating word reels, 1-second entrance animations, 1000ms spring cubic-bezier transitions, and desktop drag / mobile swipe pointer gestures.
* **4 Ecosystem Portals:**
  * **Public Landing (`/`):** Hero carousel, prompt catalogue, contact sheet feature cards, 3-step workflow, high-contrast paper CTA band.
  * **User Workspace (`/dashboard`):** Saved prompts, category usage analytics breakdown, community explorer.
  * **Creator Studio (`/creator`):** Prompt submission form with Cloudinary image upload, draft management, and review status tracking (`pending`, `approved`, `rejected`).
  * **Admin Control Panel (`/admin`):** Moderation queue, user management, creator application reviews, Super Admin RBAC matrix, and audit logs.
* **Sub-50ms Redis Caching Layer (`lib/redis.ts`):** Invalidation-aware Redis caching engine with automatic failover to an internal Node.js `Map` memory cache if Redis is offline.
* **Containerized Environment:** Pre-configured `docker-compose.yml` for Redis 7 and Redis Commander Web GUI (`http://localhost:8081`).

---

## 🛠️ Tech Stack

* **Framework:** Next.js 16 (App Router with Turbopack) & React 19
* **Styling:** Tailwind CSS v4 & Shadcn UI primitives
* **Typography:** Space Grotesk (`display`), IBM Plex Sans (`sans`), IBM Plex Mono (`mono`)
* **Database:** MongoDB Atlas (`lib/mongodb.ts`)
* **Caching:** Redis (`ioredis`) with memory fallback (`lib/redis.ts`)
* **Infrastructure:** Docker & Docker Compose (`docker-compose.yml`)
* **Media Upload:** Cloudinary Stream API (`/api/upload`)
* **Auth:** JOSE JWT HTTP-only cookies & scrypt password hashing
* **Icons:** Lucide React

---

## 🚀 Quick Start (Local Setup)

### 1. Prerequisites
* Node.js 18+
* Docker Desktop (optional, for Redis container)

### 2. Environment Configuration
Create a `.env` file in the project root:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mj7ebdh.mongodb.net/ai_trending_prompts?retryWrites=true&w=majority
REDIS_URL=redis://localhost:6379

ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=password
JWT_SECRET=your-random-jwt-secret-key

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 3. Launch Redis (via Docker Compose)
```bash
docker compose up -d
```
* Redis running on `localhost:6379`
* Redis Commander GUI accessible at `http://localhost:8081`

### 4. Install & Run Development Server
```bash
npm install
npm run dev
```
Open `http://localhost:3000` to view the application.

---

## 📚 Technical Documentation Suite (`docs/`)

Explore the 6 modular documentation guides:

1. [docs/README.md](docs/README.md) — Master Documentation Index
2. [docs/01-project-overview.md](docs/01-project-overview.md) — Vision, Target Audiences & Problem Statements
3. [docs/02-architecture-and-tech-stack.md](docs/02-architecture-and-tech-stack.md) — System Architecture, Schemas & RBAC Security
4. [docs/03-components-and-features.md](docs/03-components-and-features.md) — Component Hierarchy, 3D Hero & User Flows
5. [docs/04-api-and-caching-system.md](docs/04-api-and-caching-system.md) — REST API Endpoints & Redis Caching Policies
6. [docs/05-setup-and-deployment.md](docs/05-setup-and-deployment.md) — Docker Setup, Troubleshooting & Vercel Deployment

---

## 📦 Production Build

```bash
npm run build
npm run start
```
* Production build verified cleanly across all 40 static & dynamic App Router routes.
