# AI Trending Prompts

AI Trending Prompts is a Next.js app for browsing, copying, and managing AI prompt cards. It has a public gallery for visitors and a protected admin dashboard for creating, editing, hiding, and deleting prompts.

> 📖 **Comprehensive Technical Documentation:** Detailed guides covering project purpose, architecture, components, API reference, Redis caching, and setup can be found in the [`docs/`](docs/README.md) directory.


## Overview

The project is built around a simple content workflow:

1. Admin logs in.
2. Admin uploads an image, writes a prompt, and saves it to MongoDB.
3. Public users browse the gallery, search prompts, sort them, open details, and copy the prompt text.

Images are uploaded through a custom API route that uses `multer` for multipart parsing and Cloudinary for storage.

## Features

- Public prompt gallery with modern card-based UI
- Search prompts by title or prompt text
- Sort by newest or oldest
- Pagination for large prompt collections
- Prompt detail modal with full text and copy-to-clipboard
- Admin login with cookie-based session auth
- Admin dashboard with prompt statistics
- Create, edit, delete, and hide/show prompts
- Image upload with drag and drop support
- Cloudinary image storage
- MongoDB persistence

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- MongoDB
- Cloudinary
- `multer` for upload parsing
- `jose` for session JWT encryption
- `sonner` for toast notifications
- Radix UI and Shadcn-style components

## Project Structure

```txt
app/
  page.tsx                Public gallery page
  admin/page.tsx          Admin dashboard
  admin/login/page.tsx     Admin login page
  api/
    auth/                 Login, logout, auth check
    prompts/              Prompt CRUD endpoints
components/
  Header.tsx              Gallery header with search and sort
  ImageGrid.tsx           Prompt cards
  PromptDetailsModal.tsx  Prompt details and copy action
  Pagination.tsx          Pagination controls
  AddPromptModal.tsx      Create/edit prompt form
  PromptsTable.tsx        Admin prompt table
  AdminSidebar.tsx        Admin navigation
lib/
  auth.ts                 Session helpers
  mongodb.ts              Mongo client connection
  models/prompt.ts        Prompt type definition
pages/api/upload.ts       Multer + Cloudinary upload endpoint
public/                   Icons and placeholder assets
```

## Requirements

- Node.js 18+ recommended
- MongoDB database
- Cloudinary account

## Environment Variables

Create a `.env.local` file in the project root.

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/ai_trending_prompts?retryWrites=true&w=majority

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-secure-password-here
JWT_SECRET=your-random-jwt-secret-key-here

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

The repository also includes `.env.local.example` as a template.

## Installation

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

Open:

- `http://localhost:3000` for the public gallery
- `http://localhost:3000/admin/login` for the admin login page

## How It Works

### Public Gallery

The home page at [`app/page.tsx`](app/page.tsx) fetches prompts from `GET /api/prompts`.

Users can:

- search by title or prompt text
- sort by newest or oldest
- open a prompt in the detail modal
- copy the prompt text to clipboard

### Admin Dashboard

The admin page at [`app/admin/page.tsx`](app/admin/page.tsx) checks authentication using `GET /api/auth/check`.

If authenticated, the dashboard can:

- view summary stats
- list all prompts
- toggle visibility
- edit prompt content
- delete prompts
- add new prompts with image upload

### Authentication

Auth is session-based and stored in an HTTP-only cookie.

- `POST /api/auth/login` validates the admin credentials
- `GET /api/auth/check` confirms the session is valid
- `POST /api/auth/logout` clears the session cookie

Session helpers live in [`lib/auth.ts`](lib/auth.ts).

### Prompt CRUD

Prompt data is stored in MongoDB and managed through:

- `GET /api/prompts` for public visible prompts
- `GET /api/prompts?all=true` for admin access to all prompts
- `POST /api/prompts` to create a prompt
- `PUT /api/prompts/[id]` to update a prompt
- `PATCH /api/prompts/[id]` to toggle visibility
- `DELETE /api/prompts/[id]` to remove a prompt

The prompt schema is defined in [`lib/models/prompt.ts`](lib/models/prompt.ts).

### Image Upload

The upload flow works like this:

1. The admin selects or drags an image in [`components/AddPromptModal.tsx`](components/AddPromptModal.tsx).
2. The browser sends the file as `FormData` to `POST /api/upload`.
3. [`pages/api/upload.ts`](pages/api/upload.ts) uses `multer.memoryStorage()` to parse the file.
4. The file buffer is sent to Cloudinary with `upload_stream`.
5. The API returns the secure image URL.
6. The form saves that URL in MongoDB.

This project uses `multer` only for the upload endpoint. It does not use it in the frontend.

## API Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/prompts` | Fetch public prompts |
| GET | `/api/prompts?all=true` | Fetch all prompts for admin |
| POST | `/api/prompts` | Create a prompt |
| PUT | `/api/prompts/[id]` | Update a prompt |
| PATCH | `/api/prompts/[id]` | Update visibility |
| DELETE | `/api/prompts/[id]` | Delete a prompt |
| POST | `/api/auth/login` | Log in admin |
| GET | `/api/auth/check` | Check admin session |
| POST | `/api/auth/logout` | Log out admin |
| POST | `/api/upload` | Upload prompt image to Cloudinary |

## Important Notes

- The upload route uses `pages/api/upload.ts` because `multer` is easier to use in a Pages API route than in an App Router route handler.
- Uploaded images are served from Cloudinary, so `next.config.mjs` allows `res.cloudinary.com` in `images.remotePatterns`.
- If upload fails with `Invalid cloud_name`, the Cloudinary cloud name in `.env.local` does not match your Cloudinary account.
- Restart the dev server after changing environment variables.

## Customization

- Update the site title and metadata in [`app/layout.tsx`](app/layout.tsx)
- Adjust the gallery layout in [`components/ImageGrid.tsx`](components/ImageGrid.tsx)
- Adjust the admin experience in [`app/admin/page.tsx`](app/admin/page.tsx)
- Update colors and theme tokens in [`app/globals.css`](app/globals.css)

## Build

```bash
npm run build
```

## Start Production

```bash
npm run start
```

## License

No license file is included yet. Add one if you want to publish or share the project publicly.
