# 01. Project Overview & Purpose

## 🎯 Executive Summary

**AI Trending Prompts** is a modern, high-performance web platform designed to serve as a centralized hub and marketplace for discovering, sharing, testing, and managing high-quality AI prompts across top generative AI models (ChatGPT, Midjourney, Claude, DALL-E 3, Gemini, Stable Diffusion, and custom LLMs).

The platform connects **Prompt Creators** who design effective prompts with **AI Users** looking for optimized instructions to achieve high-quality AI outputs, while providing **Administrators** with robust moderation, role management, and analytics tools.

---

## 💡 Background & Motivation

Generative AI capabilities have advanced rapidly, but unlocking their full potential requires precise **Prompt Engineering**. Most users struggle with trial-and-error, resulting in generic or broken outputs. Meanwhile, talented prompt engineers have limited platforms to showcase, structure, and share their battle-tested prompts.

### Why We Built This Project

1. **Eliminate Prompt Engineering Friction:** Save users hours of trial-and-error by providing curated, copy-ready prompts with visual examples and parameter guides.
2. **Empower Creator Community:** Give creators a dedicated portal to submit, track, and showcase their custom prompt recipes.
3. **Ensure High Content Quality:** Prevent spam, broken prompts, and low-quality submissions through an admin review and moderation pipeline.
4. **Deliver Sub-50ms Response Times:** Utilize a hybrid Redis caching layer to deliver near-instant prompt retrieval, even under heavy search and filter operations.

---

## 🛠️ Problems Solved

| Problem in Market | Solution Provided by AI Trending Prompts |
| :--- | :--- |
| **Fragmented Prompt Sources** | Centralized, searchable directory categorized by AI Model (ChatGPT, Midjourney, Claude, etc.) and Domain (Marketing, Coding, Design, Copywriting). |
| **Low Quality & Spam** | Multi-tier approval workflow (`pending` -> `approved`/`rejected`) enforced by Admin/Super-Admin roles before public visibility. |
| **Slow Search & Latency** | Redis cache integration (`getCache`/`setCache`) invalidating on mutation, reducing fetch latency from 1,300ms down to ~40ms. |
| **Lack of Visual Proof** | Cloudinary image upload integration allowing creators to attach exact visual outputs (e.g., Midjourney renders) for every prompt. |
| **Role Ambiguity** | Granular JWT-backed authentication supporting **User**, **Creator**, **Admin**, and **Super Admin** roles with distinct permissions. |

---

## 👥 Target Audience & User Roles

### 1. Public Users & AI Enthusiasts
- Browse trending prompts by popularity, category, or AI model.
- Search prompts with instant regex matching and filters.
- Copy prompt text to clipboard with one click.
- View detailed modal cards containing prompt variables and preview images.

### 2. Prompt Creators
- Register through a dedicated Creator portal (`/creator/register`).
- Submit custom prompts with title, instructions, target AI model, category, and output image.
- Track submission status (`pending`, `approved`, `rejected`) in their creator dashboard.

### 3. Admins & Super Admins
- Review pending prompt submissions with approve/reject actions.
- Edit, hide, or delete prompts in real-time.
- Manage user roles, toggle account status (`active`, `suspended`), and access platform analytics.
