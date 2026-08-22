# Public Website Context — AI Prompt Hub

## Core Directive

- **Single Clean Landing Page (`/`):** One cohesive, high-performance landing page introducing AI Prompt Hub, incorporating an interactive 3D fanned editorial hero carousel, an embedded prompt catalogue with model/category filters, a contact sheet feature grid, a film-frame workflow, and a single light paper CTA band.
- **No Extraneous Pages:** No Pricing, FAQ, About, Contact, Blog, or Careers. Keeps the public site focused, minimalist, and direct.

---

## Target Audience

- AI Artists, Prompt Engineers & Creators
- Designers & Content Creators (portraiture, editorial styling, architectural render, digital art)
- Developers & Generative AI Enthusiasts

---

## Design System & Light-Table Visual Identity

The design direction is grounded in a **"light table / contact sheet"** concept: prompts are treated like frames on a photographer's light table — tagged with real parameters (`--ar 16:9`, `MJ v6.0`, `ChatGPT`, `DALL·E 3`) in `IBM Plex Mono` type.

### Color Tokens

| Token | Hex | Purpose |
| :--- | :--- | :--- |
| `--ink` | `#14121A` | Page background (warm near-black, not pure black) |
| `--surface` | `#1D1926` | Card background surface |
| `--surface-2` | `#262131` | Hover / raised card states |
| `--line` | `#37324A` | Hairlines, card borders |
| `--paper` | `#F3F0FA` | Light CTA band background (the single high-contrast moment) |
| `--coral` | `#FF6B4A` | Primary action color (Buttons, CTAs, copy triggers) |
| `--mint` | `#83E6C9` | Secondary accent (Badges, parameters, status tags) |
| `--text` | `#EDE9F7` | Primary text on dark |
| `--text-muted` | `#A79FC4` | Secondary text on dark |

### Typography

- **Display:** `Space Grotesk` — Headlines & brand wordmark. Set in a **single solid color** (`#EDE9F7` or `#14121A`).
- **Body:** `IBM Plex Sans` — All body text (`#A79FC4` / `#3a3550`).
- **Mono:** `IBM Plex Mono` — Prompt syntax, metadata flags (`--ar 16:9`, `MJ v6.0`), model tags, and frame counters.

---

## Single Landing Page Architecture (`app/page.tsx`)

### 1. Header (`components/Navbar.tsx`)
- Brand Mark: `CS` film frame + **AI Prompt Hub** wordmark
- Links: `Explore Prompts`, `Features`, `How It Works`, `Become a Creator`
- Actions: `Log in`, `Create free account` (or `User Portal` / `Creator Studio` / `Admin Portal` when authenticated)
- Sticky, blurred backdrop (`#14121A`/95).

### 2. 3D Fanned Editorial Hero (`components/Hero.tsx`)
- **Top Section:** Centered Eyebrow badge (`LIGHT-TABLE PROMPT GALLERY`) + Single-color headline (`Discover & copy battle-tested AI image prompts.`) + Subtitle + Action buttons (`Explore Prompts` + `Create free account`).
- **Hero Centerpiece:** 5-card fanned arch 3D carousel (`perspective: 1200px`) displaying real prompt recipes:
  - `01 / spatial` — Brutalist architectural corridor
  - `02 / identity` — Mysterious human silhouette
  - `03 / editorial` — Minimal typography & beige paper
  - `04 / digital` — Translucent holographic glass
  - `05 / spatial` — Monolithic dusk courtyard
  - `06 / motion` — Glossy purple organic fluid
  - `07 / identity` — High fashion rim light portrait
- **Interactive Micro-Interaction:** One-click **Copy Prompt Syntax** button on the active card with copy toast notification (`Copied to Clipboard!`).

### 3. Interactive Prompt Catalogue (`components/ExploreSection.tsx`)
- Embedded directly on the landing page (`#explore`).
- Search input matching prompt keywords & style syntax.
- Filter pills: AI Models (`ChatGPT`, `Midjourney`, `Claude`, `DALL-E 3`, `SDXL`) and Categories (`Couple Portraits`, `Editorial`, `Fantasy`, `Architecture`, `Abstract`).
- 6-card Skeleton loading animation & honest "Reset Filters" empty state.

### 4. Features Section (`components/Features.tsx`)
- 6 contact sheet cards with mono badges (`01 / PREVIEW`, `02 / COPY`, `03 / TAXONOMY`, `04 / VERIFIED`, `05 / CREATOR`, `06 / SPEED`).

### 5. Simple Workflow Section (`components/HowItWorks.tsx`)
- 3 film-frame step counters (`01 / DISCOVER`, `02 / COPY`, `03 / GENERATE`) on a connecting hairline strip (`#37324A`).

### 6. Call to Action Banner (`components/CTASection.tsx`)
- High-contrast paper band (`#F3F0FA`).
- Headline: _"Your next prompt is one copy away."_
- Subtext: _"Create a free account to save prompts, build a personal collection, and pick up where you left off."_
- Buttons: _Create free account_ (primary coral `#FF6B4A`) · _Log in_ (secondary border button).

### 7. Minimal Footer (`components/Footer.tsx`)
- Logo + description: _"A curated library of battle-tested AI image prompts — browse, copy syntax, and render."_
- Copyright notice in `IBM Plex Mono`.

### 8. Custom 404 Page (`app/not-found.tsx`)
- Dark theme matching `#14121A` background with frame counter `404 / MISSING` and return button.
