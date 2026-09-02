# AI Prompt Hub — Technical Documentation & Architecture Manual

Welcome to the comprehensive technical documentation for **AI Prompt Hub** (AI Trending Prompts). This directory contains detailed guides covering the system's vision, full-stack architecture, components, caching engines, dual-token security, API reference, and deployment procedures.

---

## 📚 Documentation Index

| Guide | Title | Key Topics Covered |
| :--- | :--- | :--- |
| **[01-project-overview.md](file:///c:/Users/usman/Documents/AiTrendingPrompts/AiTrendingPrompts/docs/01-project-overview.md)** | **Project Overview & Purpose** | Executive summary, problems solved, core value pillars, target audience, and user roles. |
| **[02-architecture-and-tech-stack.md](file:///c:/Users/usman/Documents/AiTrendingPrompts/AiTrendingPrompts/docs/02-architecture-and-tech-stack.md)** | **Architecture & Tech Stack** | System architecture diagrams, tech stack breakdown, MongoDB schemas, and 24-permission RBAC matrix. |
| **[03-components-and-features.md](file:///c:/Users/usman/Documents/AiTrendingPrompts/AiTrendingPrompts/docs/03-components-and-features.md)** | **Components & Frontend Modules** | Deep dive into 3D fanned carousel showcase, Editor's Picks, multi-dimensional filters, and user flow diagrams. |
| **[04-api-and-caching-system.md](file:///c:/Users/usman/Documents/AiTrendingPrompts/AiTrendingPrompts/docs/04-api-and-caching-system.md)** | **API & Redis Caching System** | Complete REST endpoint directory, Dual-Token rotation lifecycle, Redis TTLs, and error sanitization. |
| **[05-setup-and-deployment.md](file:///c:/Users/usman/Documents/AiTrendingPrompts/AiTrendingPrompts/docs/05-setup-and-deployment.md)** | **Setup, Infrastructure & Deployment** | Step-by-step local setup, Docker Compose Redis configuration, Upstash Redis Vercel deployment, and troubleshooting. |

---

## 🚀 Quick Technical Summary

* **Frontend:** Next.js 16 (App Router + Turbopack), React 19, TypeScript, Tailwind CSS v4, Light-Table Design System with seamless Dark/Light mode synchronization.
* **Backend:** Next.js Serverless Route Handlers, MongoDB Atlas, Redis (with in-memory fallback), Cloudinary Asset CDN.
* **Security:** Dual-Token Authentication (15-min Access JWT + 7-day Refresh Token Rotation in MongoDB), `HttpOnly` / `SameSite: 'lax'` cookies, IP Rate Limiting.
* **Performance:** Sub-50ms query cache latency on prompt explorations with automated mutation-based cache invalidation.
