````markdown
# 🚀 Vercel + Render + Neon Deployment Guide

Deploy the **React frontend on Vercel**, the **Express backend on Render**, and use **Neon PostgreSQL** as the managed cloud database.

```text
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│     Vercel      │  HTTPS  │     Render      │         │      Neon       │
│   React + Vite  │ ──────► │  Express API    │ ──────► │  PostgreSQL     │
│ *.vercel.app    │         │ *.onrender.com  │         │  Managed Cloud  │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

---

# Why this stack?

| Service | Role | Why |
|---------|------|-----|
| **Vercel** | Frontend | Optimised for React & Vite, global CDN, free SSL, automatic GitHub deployments |
| **Render** | Backend | Easy Node.js hosting with automatic deployments and HTTPS |
| **Neon** | PostgreSQL | Serverless PostgreSQL with generous free tier, automatic backups and branching |
| **GitHub** | Source Control | Automatic deployments on every push to `main` |

---

# Architecture

```text
GitHub Repository
        │
        ▼
 ┌─────────────────┐
 │     Vercel      │
 │  React Frontend │
 └────────┬────────┘
          │ HTTPS
          ▼
 ┌─────────────────┐
 │     Render      │
 │  Express API    │
 └────────┬────────┘
          │
          ▼
 ┌─────────────────┐
 │      Neon       │
 │ PostgreSQL DB   │
 └─────────────────┘
```

---

# Part 1 — Neon PostgreSQL

## Step 1 — Create a Database

1. Sign in to Neon.
2. Click **Create Project**.
3. Choose a project name.
4. Select the nearest region.
5. Create the database.

Neon generates a connection string similar to:

```text
postgresql://username:password@ep-xxxx.ap-southeast-1.aws.neon.tech/customsbroker?sslmode=require
```

Keep this connection string safe.

---

## Step 2 — Import Database Schema

Open **SQL Editor** inside Neon.

Run:

```sql
backend/database/schema.sql
```

(Optional)

```sql
backend/database/seed.sql
```

for sample data.

---

# Part 2 — Deploy Backend on Render

## Step 1 — Create Web Service

1. Sign in to Render.
2. Click **New → Web Service**.
3. Connect your GitHub repository.
4. Select this project.

Use these settings:

| Setting | Value |
|---------|-------|
| Name | customs-broker-api |
| Runtime | Node |
| Root Directory | backend |
| Branch | main |
| Build Command | `npm install` |
| Start Command | `npm start` |

---

## Step 2 — Environment Variables

Add the following variables.

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `JWT_SECRET` | Generate using `openssl rand -hex 32` |
| `FRONTEND_URL` | `https://your-project.vercel.app` |
| `ALLOW_PUBLIC_REGISTRATION` | `false` |

If your application supports SSL configuration, ensure your PostgreSQL client accepts Neon SSL connections (`sslmode=require`).

---

## Step 3 — Deploy

Click **Create Web Service**.

After deployment you'll receive a URL similar to:

```text
https://customs-broker-api.onrender.com
```

Verify:

```bash
curl https://customs-broker-api.onrender.com/api/health
```

Expected response:

```json
{
  "status": "OK"
}
```

---

# Part 3 — Deploy Frontend on Vercel

## Step 1 — Import Repository

1. Sign in to Vercel.
2. Click **Add New Project**.
3. Import your GitHub repository.

Configuration:

| Setting | Value |
|---------|-------|
| Framework | Vite |
| Root Directory | frontend |
| Build Command | `npm run build` |
| Output Directory | dist |
| Install Command | `npm ci` |

---

## Step 2 — Environment Variables

Add:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://customs-broker-api.onrender.com/api` |

> **Important:** Vite embeds environment variables during the build. Redeploy the frontend after changing `VITE_API_URL`.

---

## Step 3 — Deploy

Click **Deploy**.

Your application will be available at:

```text
https://your-project.vercel.app
```

---

# Part 4 — Update Backend CORS

Return to Render.

Update:

```env
FRONTEND_URL=https://your-project.vercel.app
```

Save the changes.

Render automatically redeploys your backend.

---

# Part 5 — Automatic Deployments

Both platforms support GitHub integration.

## Vercel

Every push to

```text
main
```

automatically redeploys the frontend.

---

## Render

Enable

```text
Auto Deploy = Yes
```

Every push to

```text
main
```

automatically redeploys the backend.

No GitHub Actions are required unless you want additional CI/CD checks.

---

# Verification Checklist

Backend health:

```bash
curl https://customs-broker-api.onrender.com/api/health
```

Frontend:

```text
https://your-project.vercel.app
```

Verify:

- ✅ Application loads
- ✅ Registration works
- ✅ Login works
- ✅ Dashboard loads
- ✅ Customer CRUD works
- ✅ No CORS errors
- ✅ No browser console errors

---

# Troubleshooting

| Problem | Solution |
|---------|----------|
| CORS errors | Ensure `FRONTEND_URL` exactly matches your Vercel URL (no trailing slash). |
| Render service unavailable | Free Render instances may take 30–60 seconds to wake after inactivity. |
| Database connection failed | Confirm the Neon connection string includes `sslmode=require`. |
| API returns 500 | Verify `schema.sql` has been imported into Neon. |
| Frontend uses incorrect API | Update `VITE_API_URL` and redeploy Vercel. |
| 404 after refreshing a page | Verify `frontend/vercel.json` contains the SPA rewrite configuration. |

---

# Cost Estimate

| Service | Free Tier | Notes |
|---------|-----------|------|
| Vercel | Generous | Suitable for React/Vite applications |
| Render | Free Web Service | May sleep after inactivity |
| Neon | Generous PostgreSQL Free Tier | Serverless PostgreSQL with backups |
| GitHub | Free | Source control and automatic deployments |

---

# Recommended for Production

- Enable HTTPS (enabled by default on Vercel and Render)
- Use a strong 32+ character `JWT_SECRET`
- Disable public registration (`ALLOW_PUBLIC_REGISTRATION=false`)
- Configure custom domains (optional)
- Monitor `/api/health`
- Schedule regular database backups
- Enable automatic deployments from GitHub
- Keep all secrets in environment variables—never commit them to Git

This deployment stack is ideal for MVPs, portfolios, and small production applications, offering automatic deployments, managed infrastructure, and minimal maintenance.
````
