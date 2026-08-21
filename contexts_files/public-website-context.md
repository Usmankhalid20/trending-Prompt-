# Public Website Context — AI Prompt Hub

## Core Directive

- **Single Clean Landing Page (`/`):** One modern, professional landing page that introduces AI Prompt Hub and guides users into exploring prompts or creating an account.
- **No Extraneous Pages:** No Pricing, FAQ, About, Contact, Blog, or Careers. Keep the public site clean, minimalist, and direct.

---

## Target Audience

- AI Artists & Prompt Engineers
- Designers & Content Creators (couple portraits, editorial/dress styling, fantasy scenes)
- Developers & AI Enthusiasts

---

## Design System (v1 — built)

The design direction is a **"light table / contact sheet"** concept: prompts are treated like frames on a photographer's light table — tagged, numbered, and ready to pull. This is grounded in the real content (AI image prompts carry real parameters like aspect ratio and model name), so the visual language borrows those as design material rather than decoration.

### Color

| Token          | Hex       | Use                                               |
| -------------- | --------- | ------------------------------------------------- |
| `--ink`        | `#14121A` | Page background (warm near-black, not pure black) |
| `--surface`    | `#1D1926` | Card background                                   |
| `--surface-2`  | `#262131` | Hover / raised surface                            |
| `--line`       | `#37324A` | Hairlines, borders                                |
| `--paper`      | `#F3F0FA` | CTA band background (light contrast moment)       |
| `--coral`      | `#FF6B4A` | Primary action color (Copy, Get started)          |
| `--mint`       | `#83E6C9` | Tags, badges, secondary accents                   |
| `--text`       | `#EDE9F7` | Primary text on dark                              |
| `--text-muted` | `#A79FC4` | Secondary text on dark                            |

Deliberately avoided the generic "cream + serif + terracotta" and "black + acid-green" AI-template looks — this palette is a warm violet-black instead of pure black, paired with coral + mint rather than a single neon accent.

### Type

- **Display:** `Space Grotesk` — headlines, brand wordmark. Geometric with enough personality to carry the hero.
- **Body:** `IBM Plex Sans` — all paragraph copy.
- **Mono (utility):** `IBM Plex Mono` — prompt strings, tags, badges, step numbers. Ties directly to the subject matter: prompts _are_ code-like strings, so mono type is functional, not decorative.

### Layout & Signature Element

- Hero splits copy (left) against a **stacked "film card" light table** (right): three tilted prompt cards fanned like negatives, sprocket-style frame label (`CS·014`, aspect ratio), front card interactive with a working **Copy prompt → "Copied" toast** micro-interaction.
- Feature grid uses **mono tag badges** (`PREVIEW`, `COPY`, `VERIFIED`, `TAXONOMY`...) instead of numbered markers — the badges are real classification labels, not decoration.
- "How It Works" _is_ a genuine 3-step sequence, so it keeps numbered markers, styled as film-frame counters (`01 / 02 / 03`) on a thin strip line — consistent with the light-table motif.
- CTA band flips to the light **paper** surface as the one high-contrast moment in the page.

### Motion

Restrained: card hover-tilt in the hero, button hover lift, toast fade on copy. No scroll-jacking or auto-playing effects. `prefers-reduced-motion` respected globally.

---

## Single Landing Page Sections (`app/page.tsx`)

### 1. Header (`components/Navbar.tsx`)

- Brand Logo: **AI Prompt Hub**
- Links: _Explore Prompts (`/explore`)_, _Features (`/#features`)_, _How It Works (`/#how-it-works`)_
- Actions: _Log In (`/login`)_, _Get Started (`/register`)_ (or _User Portal (`/dashboard`)_ when logged in)
- Sticky, blurred backdrop; collapses to a hamburger menu under 720px.

### 2. Hero Section (`components/Hero.tsx`)

- Eyebrow: `CURATED PROMPT LIBRARY`
- Headline: _"Discover & generate stunning AI artwork."_
- Subtitle: _"A tested library of image prompts for Midjourney, DALL·E 3, and Stable Diffusion — couple portraits, editorial dress, fantasy scenes, and more. Copy the exact syntax, paste it in, and render."_
- Visual: light-table card stack with working **Copy prompt** interaction
- Primary CTA: _Explore AI Image Prompts (`/explore`)_ · Secondary: _Create free account (`/register`)_

### 3. Features Section (`components/Features.tsx`)

| Tag              | Title                    | Copy                                                                                                                      |
| ---------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| PREVIEW          | High-resolution previews | See the full render before you commit to a prompt — every card shows a real example, not a thumbnail guess.               |
| COPY             | One-click prompt copy    | Copy the exact string, parameters included. No retyping, no missing weights or aspect ratios.                             |
| MJ · DALL·E · SD | Built for every model    | Prompts are tagged and formatted for Midjourney, DALL·E 3, and Stable Diffusion, so the syntax already matches your tool. |
| VERIFIED         | Checked by admins        | Every prompt is tested and confirmed to render before it's published — no dead syntax, no surprises.                      |
| TAXONOMY         | Organized by style       | Browse by category — couple portraits, editorial dress, fantasy scenes — filtered, not buried in folders.                 |
| SAVED            | Your own workspace       | Save prompts you like, build a personal collection, and pick up your last search where you left off.                      |

### 4. Simple Workflow Section (`components/HowItWorks.tsx`)

1. **Browse & discover** — Scroll the library by style and open any card for the full prompt.
2. **One-click copy** — Copy the exact prompt, parameters and all, straight to your clipboard.
3. **Paste & generate** — Drop it into Midjourney, DALL·E 3, or Stable Diffusion and render.

### 5. Call to Action Banner (`components/CTASection.tsx`)

- Eyebrow: `GET STARTED`
- Headline: _"Your next prompt is one copy away."_
- Subtext: _"Create a free account to save prompts, build a personal collection, and pick up where you left off."_
- Buttons: _Create free account_ (primary) · _Log in_ (secondary)

### 6. Minimal Footer (`components/Footer.tsx`)

- Logo + one-line description: _"A curated library of tested AI image prompts — browse, copy, generate."_
- Copyright notice only. No extra link columns.

---

## Design Standards

- **Minimalist & Professional:** Clean typography, consistent spacing, restrained dark palette with a light CTA band, subtle micro-interactions.
- **Authentic SaaS Aesthetic:** No generic AI-template layout, no fake testimonials, no fake stats/numbers, no stock-photo clutter. Artwork previews in the shipped build use abstract gradient swatches (style/mood placeholders) rather than photos of real people — this keeps the page ready for real admin-uploaded artwork later without depicting anyone.
- **Accessibility floor:** Visible keyboard focus states, responsive to mobile, reduced-motion respected.

---

## Build Notes

- Shipped as a single self-contained HTML file (`index.html`) — fonts via Google Fonts, no build step required. Maps directly onto the Next.js component structure above (`Navbar`, `Hero`, `Features`, `HowItWorks`, `CTASection`, `Footer`) when ported into `app/page.tsx`.
- Copy-to-clipboard on the hero card is wired and functional (`navigator.clipboard` with a `document.execCommand` fallback) as a demo of the core product interaction.
- Next pass: swap gradient swatches for real admin-uploaded artwork thumbnails once `/explore` and the prompt database exist; wire `/login` and `/register` routes.
