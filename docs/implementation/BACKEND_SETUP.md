# Backend Setup

## Requirements

- Node.js 20.11 or newer (Node.js 22 LTS recommended).
- npm.
- Docker Desktop with Docker Compose for the local PostgreSQL service.

## Configure

From the repository root, copy `.env.example` to `.env`. The included values are local-only development settings. Change them for your environment; never put production secrets in source control.

The backend validates `NODE_ENV`, `PORT`, `DATABASE_URL`, and `FRONTEND_ORIGINS` at startup. `FRONTEND_ORIGINS` is a comma-separated allowlist. Production requires HTTPS origins and production database credentials managed outside the repository.

## Install and start

```powershell
npm install
npm run db:up
npm run db:migrate
npm run dev
```

The existing root `npm run dev` starts the NestJS backend and Vite frontend together. The API listens on port 4000; Vite listens on port 5173.

## Scripts

From the repository root:

| Command | Purpose |
|---|---|
| `npm run dev` | Start frontend and backend together |
| `npm run dev:frontend` | Start only Vite |
| `npm run dev:backend` | Start only NestJS (generates Prisma client first) |
| `npm run build` | Build backend and frontend |
| `npm test` | Run backend Jest unit tests |
| `npm run db:up` | Start local PostgreSQL with Compose |
| `npm run db:down` | Stop Compose services |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:migrate` | Create/apply a local development migration |
| `npm run db:deploy` | Apply committed migrations in a deployment |

Backend workspace commands also include `npm run test:e2e --workspace backend` and `npm run prisma:format --workspace backend`.

## Check the service

- `GET http://localhost:4000/api/health`
- `GET http://localhost:4000/api/listings`
- `GET http://localhost:4000/api/verification-status`
- `http://localhost:4000/api/docs` (development and test only)

The health endpoint reports the database separately. Listings and verification counts currently come from explicit fictional demo data and do not require database seed records.

## If Docker is unavailable

Install/start PostgreSQL locally or enable Docker Desktop, then ensure the `DATABASE_URL` in `.env` points to a running PostgreSQL database. The commands to continue are:

```powershell
npm run db:up
npm run db:migrate
npm run dev
```

The NestJS API can start without connecting to PostgreSQL; `/api/health` reports a disconnected database. Applying migrations requires a reachable PostgreSQL instance.
