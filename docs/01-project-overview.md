# 01. Project Overview & Purpose

## 🎯 Executive Summary

**AI Prompt Hub** (AI Trending Prompts) is a modern, production-ready web platform and marketplace designed for discovering, testing, copying, and publishing high-fidelity AI image and LLM prompts across leading generative AI models including **Midjourney v6**, **DALL·E 3**, **Stable Diffusion (SDXL)**, **ChatGPT**, and **Claude**.

The platform connects **Prompt Creators** who engineer tested prompt recipes with **AI Designers & Artists** seeking reliable instructions with exact aspect ratio flags and model weights, while providing **Administrators** with multi-tier moderation queues, role-based access controls, and analytics tools.

---

## 💡 Background & Motivation

Generative AI image models require precise **Prompt Engineering** with model-specific syntax, stylize values, aspect ratio parameters, and weight modifiers. Most users struggle with trial-and-error across random blogs, Pinterest, or Discord channels, resulting in wasted generation credits and inconsistent outputs.

### Core Value Pillars

1. **Find Prompts That Actually Work:** Save creators hours of trial-and-error with curated, copy-ready prompt syntax containing verified parameters.
2. **High-Resolution Visual Proof:** Every prompt card features authentic renders produced by the exact prompt syntax.
3. **Multi-Dimensional Discovery:** Filter prompts simultaneously by Domain/Style, Target AI Model, Aspect Ratio (`16:9`, `4:5`, `3:4`, `1:1`), and Popularity.
4. **Enterprise Dual-Token Security:** Secure short-lived Access Tokens (15m) paired with database-backed Refresh Tokens (7d) featuring Refresh Token Rotation (RTR).
5. **Creator Publishing Studio:** Dedicated portal for prompt engineers to publish recipes, track approval status, and build public portfolios.
6. **Sub-50ms Response Times:** Redis caching layer reducing database fetch times from 1,300ms down to ~40ms with graceful in-memory fallback.

---

## 🛠️ Problems Solved & Differentiators

| Random Prompt Websites & Social Media (✕) | AI Prompt Hub Solution (✓) |
| :--- | :--- |
| **Generic & Broken Syntax** | Model-specific prompts calibrated for Midjourney v6, DALL·E 3, SDXL. |
| **Missing or Stock Previews** | Real high-resolution visual preview render for every recipe. |
| **Missing Parameter Flags** | 1-click copy with complete flags (`--ar`, `--stylize`, `--v`, seeds, weights). |
| **Unmoderated Junk Submissions** | Multi-tier Admin/Moderator approval workflow before public visibility. |
| **Scattered Bookmarks** | Personal workspace with saved collections and creator studio dashboard. |
| **Vulnerable Auth / Broken Sessions** | `HttpOnly` dual-token authentication with automatic silent refresh. |

---

## 👥 Target Audience & User Roles

### 1. Public Users & AI Designers
- Explore prompt recipes across **Editor's Picks**, **Trending**, **Popular**, and **Newest** tabs.
- Filter by category (*Architecture, Editorial / Portrait, Cinematic, Abstract*), AI Model, and Aspect Ratio.
- 1-click prompt copying with instant clipboard toast confirmation.
- Inspect full prompt syntax, variables, and model specifications via detailed modals.

### 2. Prompt Creators
- Register through dedicated creator onboarding (`/creator/register`).
- Submit prompt recipes with title, body, aspect ratio, AI model, category, and Cloudinary preview image.
- Track submission moderation status (`pending`, `approved`, `rejected`) in the Creator Studio.

### 3. Administrators & Moderators
- Moderate pending prompt submissions with one-click approve/reject/hide actions.
- Granular permission-based RBAC: `super_admin`, `senior_admin`, `content_admin`, `moderator`.
- Manage user accounts, toggle suspension status, and view real-time audit logs.
