# Customs Broker Onboarding System

Enterprise-style MVP for customs brokers to onboard and manage exporter/importer customers.

## Stack

- **Frontend:** React 19, Vite, Tailwind CSS, React Router, React Hook Form, Zod
- **Backend:** Node.js, Express 5, PostgreSQL, JWT, bcrypt, Zod
- **Database:** PostgreSQL

## Prerequisites

- Node.js 20+
- PostgreSQL 14+

## Quick Start

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
# Edit .env with your DATABASE_URL and a JWT_SECRET (min 32 chars)
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

## Production Build

```bash
# Backend
cd backend
NODE_ENV=production npm start

# Frontend
cd frontend
npm run build
npm run preview
```

Serve the `frontend/dist` folder via a static host or reverse proxy. Point `VITE_API_URL` to your production API (e.g. `https://api.example.com/api`).

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | Min 32 characters |
| `FRONTEND_URL` | Yes | Comma-separated CORS origins |
| `PORT` | No | Default 5000 |
| `NODE_ENV` | No | `production` hides error details |
| `ALLOW_PUBLIC_REGISTRATION` | No | Set `false` to disable signup |

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | Yes | Backend API base URL |

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/health` | No | Health check |
| POST | `/api/auth/register` | No | Register broker |
| POST | `/api/auth/login` | No | Login |
| GET | `/api/auth/me` | Yes | Current user |
| GET | `/api/dashboard` | Yes | Broker-scoped stats |
| GET/POST | `/api/customers` | Yes | List / create customers |
| GET/PUT/DELETE | `/api/customers/:id` | Yes | Customer CRUD |

## Security Notes

- JWT tokens expire after 7 days
- Auth routes are rate-limited (20 requests / 15 min)
- Customer data is scoped per broker
- Set `ALLOW_PUBLIC_REGISTRATION=false` in production unless open signup is intended
- Use HTTPS in production
- Configure database backups and monitoring

## Deployment Checklist

- [ ] Set strong `JWT_SECRET` (32+ chars)
- [ ] Configure `FRONTEND_URL` for CORS
- [ ] Run database schema + migrations
- [ ] Set `NODE_ENV=production`
- [ ] Disable public registration if not needed
- [ ] Enable HTTPS / reverse proxy
- [ ] Configure PostgreSQL backups
- [ ] Build and deploy frontend static assets
