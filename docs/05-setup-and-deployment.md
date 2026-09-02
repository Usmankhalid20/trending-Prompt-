# 05. Setup, Infrastructure & Deployment

## 📋 Prerequisites

Ensure your development environment meets the following requirements:

* **Node.js**: v18.x, v20.x, or v22.x installed.
* **Package Manager**: `npm`, `pnpm`, or `yarn`.
* **Docker Desktop**: Installed and running (for local Redis container & Redis Commander GUI).
* **MongoDB Atlas Account**: Connection URI string.
* **Cloudinary Account**: Cloud Name, API Key, and API Secret for image hosting.
* **Upstash Redis Account** *(Optional for production on Vercel)*: Serverless Redis REST URL and Token.

---

## 🔑 Environment Configuration

Create a `.env` file in the project root:

```env
# ── MongoDB Database Connection ──
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ai_prompt_hub?retryWrites=true&w=majority

# ── Admin Default Credentials & JWT Secret ──
ADMIN_EMAIL=admin@aiprompthub.com
ADMIN_PASSWORD=AdminPass123!
JWT_SECRET=super-secure-production-jwt-secret-key-2026

# ── Cloudinary Image Asset Storage ──
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ── Redis Cache Connection ──
# Local Docker Redis:
REDIS_URL=redis://localhost:6379

# Production Upstash Serverless Redis (Vercel):
# UPSTASH_REDIS_REST_URL=https://your-db.upstash.io
# UPSTASH_REDIS_REST_TOKEN=your_token_here
```

---

## 🐳 Docker Infrastructure (Local Redis & GUI)

The project includes a [`docker-compose.yml`](file:///c:/Users/usman/Documents/AiTrendingPrompts/AiTrendingPrompts/docker-compose.yml) stack for local development.

### Starting the Local Redis Stack

1. Open **Docker Desktop**.
2. Start the background containers:
   ```bash
   docker compose up -d
   ```
3. Check container health:
   ```bash
   docker compose ps
   ```
4. **Access Redis Commander Web GUI:**
   Open `http://localhost:8081` in your browser to inspect cached prompt keys visually.

---

## 💻 Local Development Workflow

```bash
# 1. Install dependencies
npm install

# 2. Start local Redis (Docker)
docker compose up -d

# 3. Launch Next.js dev server with Turbopack
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🚨 Troubleshooting Common Issues

### Issue 1: `SSL alert number 80` or `MongoServerSelectionError`
* **Root Cause:** Your local IP address is not whitelisted in MongoDB Atlas.
* **Solution:**
  1. Open [MongoDB Atlas Dashboard](https://cloud.mongodb.com/).
  2. Navigate to **Security** → **Network Access**.
  3. Click **Add IP Address** → select **Allow Access from Anywhere (`0.0.0.0/0`)** or add your current public IP.

### Issue 2: `open //./pipe/dockerDesktopLinuxEngine`
* **Root Cause:** Docker Desktop service is closed.
* **Solution:** Start Docker Desktop from the Windows Start menu and wait until the engine is in the "Running" state.

### Issue 3: Redis Fallback Warning in Console
* **Behavior:** `[Redis] Max connection retries reached. Falling back to in-memory caching.`
* **Result:** The app automatically switches to the built-in `Map` memory cache without throwing errors or breaking user requests.

---

## 🚀 Vercel Production Deployment

### Step 1: Connect Repository to Vercel
1. Push your branch to GitHub (`git push -u origin <branch-name>`).
2. Log in to [Vercel](https://vercel.com) and click **Add New Project** → Import repository.

### Step 2: Configure Production Environment Variables
Under **Project Settings** → **Environment Variables**, add:
* `MONGODB_URI`
* `JWT_SECRET`
* `ADMIN_EMAIL` & `ADMIN_PASSWORD`
* `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
* `UPSTASH_REDIS_REST_URL` & `UPSTASH_REDIS_REST_TOKEN` (or `REDIS_URL`)

### Step 3: Configure Upstash Serverless Redis on Vercel
1. In Vercel Project Dashboard → Click **Storage** → Select **Upstash Redis**.
2. Click **Create & Connect**. Vercel will automatically inject the `UPSTASH_REDIS_REST_*` environment variables.

### Step 4: Deploy & Verify
Click **Deploy**. Next.js will compile all static routes and serverless API endpoints.
