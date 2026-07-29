# Customs Broker Onboarding System

Enterprise-style MVP for customs brokers to onboard and manage exporter/importer customers.

## Stack

- **Frontend:** React 19, Vite, Tailwind CSS, React Router, React Hook Form, Zod
- **Backend:** Node.js, Express 5, PostgreSQL, JWT, bcrypt, Zod
- **Database:** PostgreSQL
- **Deployment:** Vercel, Railway, Docker Compose

## Prerequisites

- Node.js 20+
- PostgreSQL 14+ (for local dev)
- Docker & Docker Compose (for production deployment)

---

## Production Deployment

### Recommended: Vercel (frontend) + Railway (backend)

| Layer | Platform | Docs |
|-------|----------|------|
| Frontend | [Vercel](https://vercel.com) | `frontend/vercel.json` |
| Backend API | [Railway](https://railway.app) | `backend/railway.json` |
| Database | Railway PostgreSQL | `backend/database/schema.sql` |
| CI/CD | GitHub Actions | `.github/workflows/` |

**Full step-by-step guide:** see [DEPLOYMENT.md](./DEPLOYMENT.md)

Quick start:

```bash
# 1. Push repo to GitHub
# 2. Deploy backend on Railway (root: backend/) + add PostgreSQL
# 3. Run schema.sql on Railway Postgres
# 4. Deploy frontend on Vercel (root: frontend/)
# 5. Set VITE_API_URL=https://your-api.railway.app/api on Vercel
# 6. Set FRONTEND_URL=https://your-app.vercel.app on Railway
```

### Docker (self-hosted alternative)

```bash
cp .env.example .env
docker compose up --build -d
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for Vercel + Railway setup, or use Docker below.

### Docker Deployment

#### 1. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and set a strong secret:

```bash
# Generate a secure JWT secret
openssl rand -hex 32
```

Required values in `.env`:

| Variable | Example | Notes |
|----------|---------|-------|
| `JWT_SECRET` | `a1b2c3...` | Min 32 chars, required |
| `POSTGRES_PASSWORD` | strong password | Change default |
| `FRONTEND_URL` | `https://yourdomain.com` | Used for CORS |
| `ALLOW_PUBLIC_REGISTRATION` | `false` | Disable open signup in prod |

#### 2. Start the stack

```bash
docker compose up --build -d
```

This starts:

- **PostgreSQL** — database with schema auto-applied
- **API** — Node.js backend on port 5000 (internal)
- **Web** — Nginx serving React app + proxying `/api` to backend

App available at `http://localhost` (or `WEB_PORT` from `.env`).

#### 3. Verify health

```bash
curl http://localhost/health          # Frontend/nginx
curl http://localhost/api/health      # Backend + database
```

#### 4. Production hardening checklist

- [ ] Set strong `JWT_SECRET` (32+ chars)
- [ ] Change `POSTGRES_PASSWORD` from default
- [ ] Set `ALLOW_PUBLIC_REGISTRATION=false`
- [ ] Set `FRONTEND_URL` to your real domain(s)
- [ ] Put HTTPS in front (Cloudflare, AWS ALB, Caddy, etc.)
- [ ] Configure PostgreSQL backups (volume snapshots or pg_dump cron)
- [ ] Set up monitoring on `/api/health`
- [ ] Restrict database port — do not expose `5432` publicly

#### 5. Useful Docker commands

```bash
npm run docker:up       # Build and start
npm run docker:down     # Stop containers
npm run docker:logs     # Tail logs
docker compose ps       # Check status
```

---

## Local Development

### 1. Database setup

```bash
createdb customs_broker
psql -d customs_broker -f backend/database/schema.sql
psql -d customs_broker -f backend/database/seed.sql
```

Seed credentials: `sai@example.com` / `Password1`

For existing databases, apply migrations:

```bash
psql -d customs_broker -f backend/database/migrations/001_add_indexes_and_unique_constraints.sql
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET (min 32 chars)
npm install
npm run dev
```

API runs at `http://localhost:5000`

### 3. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

App runs at `http://localhost:5173`

Or from the project root:

```bash
npm run install:all
npm run dev:backend   # terminal 1
npm run dev:frontend  # terminal 2
```

---

## Manual Production Build (without Docker)

### Backend

```bash
cd backend
cp .env.example .env
# Set NODE_ENV=production, DATABASE_URL, JWT_SECRET, FRONTEND_URL
npm ci --omit=dev
NODE_ENV=production npm start
```

### Frontend

```bash
cd frontend
cp .env.example .env
# Set VITE_API_URL=https://api.yourdomain.com/api
npm ci
npm run build
```

Serve `frontend/dist` with Nginx or any static host. Use the included `frontend/nginx.conf` as a reference for SPA routing and API proxying.

---

## Environment Variables

### Root (Docker) — `.env`

| Variable | Required | Description |
|----------|----------|-------------|
| `JWT_SECRET` | Yes | Min 32 characters |
| `POSTGRES_USER` | No | Default `broker` |
| `POSTGRES_PASSWORD` | Yes | Database password |
| `POSTGRES_DB` | No | Default `customs_broker` |
| `FRONTEND_URL` | Yes | CORS origin(s) |
| `ALLOW_PUBLIC_REGISTRATION` | No | Default `false` in Docker |
| `WEB_PORT` | No | Default `80` |

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | Min 32 characters |
| `FRONTEND_URL` | Yes (prod) | Comma-separated CORS origins |
| `PORT` | No | Default 5000 |
| `HOST` | No | Default 0.0.0.0 |
| `NODE_ENV` | No | `production` enables strict mode |
| `ALLOW_PUBLIC_REGISTRATION` | No | Set `false` to disable signup |
| `DB_POOL_MAX` | No | Connection pool size |
| `DB_SSL` | No | Set `true` for managed PostgreSQL |

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | Yes | Dev: `http://localhost:5000/api`, Docker prod: `/api` |

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/health` | No | Health check (includes DB) |
| POST | `/api/auth/register` | No | Register broker |
| POST | `/api/auth/login` | No | Login |
| GET | `/api/auth/me` | Yes | Current user |
| GET | `/api/dashboard` | Yes | Broker-scoped stats |
| GET/POST | `/api/customers` | Yes | List / create customers |
| GET/PUT/DELETE | `/api/customers/:id` | Yes | Customer CRUD |

---

## Security Features

- JWT authentication with 7-day expiry
- bcrypt password hashing
- Rate limiting on auth (20/15min) and API (300/15min)
- Helmet security headers
- CORS restricted to configured origins
- Broker-scoped customer data (tenant isolation)
- Input validation with Zod (frontend + backend)
- Unique customer email/GSTIN per broker
- Graceful shutdown (SIGTERM/SIGINT)
- Production error masking (no stack traces to clients)
- Optional registration lockdown via env var

---

## Architecture (Production)

```
Browser
   │
   ▼
[Nginx :80] ── /api/* ──► [Express API :5000]
   │                              │
   └── /* (React SPA)             ▼
                           [PostgreSQL :5432]
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `JWT_SECRET must be at least 32 characters` | Use a longer secret in `.env` |
| CORS errors | Ensure `FRONTEND_URL` matches your browser URL exactly |
| `503 unhealthy` on `/api/health` | Database not ready — check `docker compose logs db` |
| Frontend blank page | Verify `VITE_API_URL` was set at build time |
| Registration disabled | Set `ALLOW_PUBLIC_REGISTRATION=true` (dev only) |
