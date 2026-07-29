# Vercel + Railway Deployment Guide

Deploy the **frontend on Vercel** and the **backend on Railway** (recommended pairing).

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│  Vercel         │  HTTPS  │  Railway        │         │  Railway        │
│  React SPA      │ ──────► │  Express API    │ ──────► │  PostgreSQL     │
│  your-app.vercel│         │  *.railway.app  │         │  (managed)      │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

---

## Why this stack?

| Service | Role | Why |
|---------|------|-----|
| **Vercel** | Frontend | Best-in-class for React/Vite, global CDN, free tier |
| **Railway** | Backend + DB | Node.js + PostgreSQL in one place, GitHub deploy, simple env vars |
| **GitHub Actions** | CI/CD | Lint/build on every PR, auto-deploy on merge to `main` |

**Alternatives for backend:** Render, Fly.io, or DigitalOcean App Platform if you prefer.

---

## Part 1 — Railway (Backend + Database)

### Step 1: Create Railway project

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. **New Project** → **Deploy from GitHub repo** → select this repo
3. Set **Root Directory** to `backend`
4. Railway auto-detects Node.js via `railway.json`

### Step 2: Add PostgreSQL

1. In the same project, click **+ New** → **Database** → **PostgreSQL**
2. Railway creates `DATABASE_URL` automatically

### Step 3: Configure backend environment variables

In the **backend service** → **Variables**, set:

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` (reference from Postgres service) |
| `JWT_SECRET` | Generate: `openssl rand -hex 32` |
| `FRONTEND_URL` | `https://your-app.vercel.app` (update after Vercel deploy) |
| `ALLOW_PUBLIC_REGISTRATION` | `false` |
| `DB_SSL` | `true` |
| `DB_SSL_REJECT_UNAUTHORIZED` | `false` |
| `PORT` | `5000` |

### Step 4: Run database schema

After Postgres is running, open **PostgreSQL → Connect → Query** (or use Railway CLI):

```bash
railway connect postgres
```

Then run the SQL files:

```sql
-- Paste contents of backend/database/schema.sql
```

Optional seed for dev/staging only.

### Step 5: Get your API URL

1. Backend service → **Settings** → **Networking** → **Generate Domain**
2. Your API URL will be like: `https://customs-broker-api-production.up.railway.app`
3. Test: `curl https://YOUR-API.railway.app/api/health`

### Step 6: Railway GitHub secrets (for Actions CD)

1. Railway → Account Settings → **Tokens** → create token
2. Backend service → **Settings** → copy **Service ID**
3. Add to GitHub repo → **Settings → Secrets → Actions**:

| Secret | Value |
|--------|-------|
| `RAILWAY_TOKEN` | Railway API token |
| `RAILWAY_SERVICE_ID` | Backend service ID |

> **Tip:** Railway also auto-deploys on push when connected to GitHub — you can use either native Railway deploy or the GitHub Actions workflow.

---

## Part 2 — Vercel (Frontend)

### Step 1: Import project

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. **Add New Project** → import this repo
3. Configure:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Vite |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm ci` |

### Step 2: Environment variables

In Vercel project → **Settings → Environment Variables**:

| Variable | Value | Environments |
|----------|-------|--------------|
| `VITE_API_URL` | `https://YOUR-API.railway.app/api` | Production, Preview, Development |

> **Important:** `VITE_API_URL` is baked in at build time. Redeploy after changing it.

### Step 3: Deploy

Click **Deploy**. Vercel uses `frontend/vercel.json` for SPA routing.

Your app will be at: `https://your-project.vercel.app`

### Step 4: Update Railway CORS

Go back to Railway backend variables and set:

```
FRONTEND_URL=https://your-project.vercel.app
```

If you use preview deployments too:

```
FRONTEND_URL=https://your-project.vercel.app,https://your-project-*.vercel.app
```

(Railway CORS uses exact origins — for preview URLs you may need to list each or use a single production URL.)

### Step 5: Vercel GitHub secrets (for Actions CD)

1. Vercel → Account Settings → **Tokens** → create token
2. Project → **Settings → General** → copy **Project ID** and **Org ID**
3. Add to GitHub **Secrets**:

| Secret | Value |
|--------|-------|
| `VERCEL_TOKEN` | Vercel API token |
| `VERCEL_ORG_ID` | Team/personal org ID |
| `VERCEL_PROJECT_ID` | Project ID |
| `VITE_API_URL` | `https://YOUR-API.railway.app/api` |

---

## Part 3 — GitHub Actions

Two workflows are included:

### `ci.yml` — Runs on every push & PR

- Frontend: `npm ci` → lint → build
- Backend: syntax check + env validation

### `deploy.yml` — Runs on push to `main`

- Deploys frontend to Vercel (production)
- Deploys backend to Railway

**To enable CD:** Add all secrets listed above, then merge to `main`.

**CI-only (no Actions deploy):** Use native Vercel + Railway GitHub integrations instead — both auto-deploy on push without GitHub Actions secrets.

---

## Verification checklist

```bash
# 1. Backend health
curl https://YOUR-API.railway.app/api/health

# 2. Frontend loads
open https://YOUR-APP.vercel.app

# 3. Register/login works
# 4. Customer CRUD works
# 5. Check browser console — no CORS errors
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| CORS error in browser | Set `FRONTEND_URL` on Railway to exact Vercel URL (no trailing slash) |
| `503 unhealthy` on API | DB schema not applied — run `schema.sql` on Railway Postgres |
| Frontend calls wrong API | Rebuild Vercel after changing `VITE_API_URL` |
| `JWT_SECRET` startup error | Must be 32+ characters |
| SSL database error | Set `DB_SSL=true` on Railway |
| 404 on page refresh | `vercel.json` rewrites should handle this — verify Root Directory is `frontend` |

---

## Cost estimate (hobby / small team)

| Service | Free tier | Paid starting |
|---------|-----------|---------------|
| Vercel | Generous free tier | ~$20/mo Pro |
| Railway | $5 credit/month | ~$5+/mo usage-based |
| GitHub Actions | 2000 min/month free | Usually sufficient |

---

## Alternative backend: Render

If you prefer Render over Railway:

1. [render.com](https://render.com) → **New Web Service** → connect repo, root `backend`
2. **New PostgreSQL** database → copy `Internal Database URL`
3. Set same env vars as Railway table above
4. Health check path: `/api/health`
5. Use Render URL in `VITE_API_URL` and `FRONTEND_URL`

Render is slightly slower on free tier (cold starts) but works well for MVPs.
