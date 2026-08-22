# 05. Setup, Infrastructure & Deployment

## 📋 Prerequisites

Before running the project locally, ensure you have the following installed:

* **Node.js**: v18.x or v20.x installed.
* **Package Manager**: `npm` or `pnpm`.
* **Docker Desktop**: Installed and running (required for local Redis container).
* **MongoDB Atlas Account**: Database connection string.
* **Cloudinary Account**: Cloud name, API key, and API secret for image storage.

---

## 🔑 Environment Configuration

Create a `.env` file in the root directory ([`AiTrendingPrompts/.env`](file:///c:/Users/usman/Documents/AiTrendingPrompts/AiTrendingPrompts/.env)) based on [.env.local.example](file:///c:/Users/usman/Documents/AiTrendingPrompts/AiTrendingPrompts/.env.local.example):

```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/?appName=Cluster0

# Admin Default Credentials & Security
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=your-secure-password
JWT_SECRET=TRENDING_PROMPT_SECRET_KEY

# Cloudinary Assets Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Redis Cache Connection
REDIS_URL=redis://localhost:6379
```

---

## 🐳 Docker Infrastructure (Redis & GUI)

The project includes a production-ready [`docker-compose.yml`](file:///c:/Users/usman/Documents/AiTrendingPrompts/AiTrendingPrompts/docker-compose.yml) file.

### Starting Local Redis & Web GUI

1. Launch **Docker Desktop** on your computer.
2. Run the following command in your terminal:
   ```bash
   docker compose up -d
   ```
3. Verify running containers:
   ```bash
   docker compose ps
   ```
4. Access **Redis Commander Web GUI**:
   Open `http://localhost:8081` in your browser to inspect Redis cache keys visually.

---

## 💻 Local Development Workflow

1. **Install Dependencies:**
   ```bash
   npm install
   ```
2. **Start Docker Redis Stack:**
   ```bash
   docker compose up -d
   ```
3. **Run Next.js Development Server:**
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000` in your browser.

---

## 🚨 Troubleshooting Common Issues

### Issue 1: `open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified`
* **Cause:** Docker Desktop background service (`com.docker.service`) is closed or stopped.
* **Fix:** Open Windows Start Menu -> Search **Docker Desktop** -> Right-Click -> **Run as Administrator**. Wait until Docker displays "Engine Running" before running `docker compose up -d`.

### Issue 2: Redis Connection Warning in Console
* **Symptom:** `[Redis] Max connection retries reached. Falling back to in-memory caching.`
* **Cause:** Redis server is not running on port 6379.
* **Effect:** The application **automatically switches to in-memory fallback cache mode**, ensuring zero interruption to users.

---

## 🚀 Production Deployment Guide

### Deploying to Vercel

1. Push your repository to GitHub / GitLab.
2. Import the repository into **Vercel**.
3. Add Environment Variables in Vercel Project Settings (`MONGODB_URI`, `JWT_SECRET`, `CLOUDINARY_*`, `REDIS_URL`).
4. Set Build Command: `npm run build`
5. For Production Redis, use **Upstash Redis** (Serverless Redis for Vercel) and paste the `rediss://...` URL into `REDIS_URL`.
