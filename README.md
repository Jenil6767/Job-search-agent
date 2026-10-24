# AI JobPilot 🚀
> Production-grade AI-powered Job Search & Workflow Automation Platform

Built with modern MERN, TypeScript, Next.js, BullMQ, Redis, MongoDB, and pluggable AI providers (OpenAI / Anthropic Claude / Mock).

---

## Architecture Highlights
- **Full-Stack Monorepo**: Managed via `pnpm` workspaces + Turborepo (`apps/web`, `apps/api`, `apps/worker`, `packages/*`).
- **Decoupled Asynchronous Workers**: The worker process (`apps/worker`) runs completely independently from the API server (`apps/api`).
- **Pluggable AI Layer**: Unified `AIProvider` abstraction with support for OpenAI, Anthropic Claude, and offline deterministic Mock.
- **Enterprise Security**: Strict Zod schema validation, Helmet, CORS, structured Pino logging, and JWT authentication.
- **Visual Workflow Automation**: Scheduled triggers, condition filters, and automated job matching pipelines.

---

## Monorepo Layout
```
apps/
  ├── web/       # Next.js 15+ App Router client with Tailwind CSS
  ├── api/       # Express.js REST API with TypeScript
  └── worker/    # Standalone BullMQ worker process
packages/
  ├── types/     # TypeScript domain models and DTO interfaces
  ├── config/    # Zod environment schemas and system constants
  ├── database/  # Mongoose models and resilient MongoDB connection
  └── ai/        # Pluggable AIProvider (OpenAI, Claude, Mock)
```

---

## Quickstart Guide

### 1. Prerequisites
- **Node.js**: `v20+` (v22 recommended)
- **pnpm**: `v10+`
- **Docker**: For running MongoDB and Redis

### 2. Infrastructure Setup (MongoDB & Redis)
Start the local MongoDB and Redis containers using Docker Compose:
```bash
docker compose up -d
```

Verify services are healthy:
```bash
docker compose ps
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 4. Install Dependencies
```bash
pnpm install
```

### 5. Running the Application
To run all apps concurrently (API, Worker, Web):
```bash
pnpm dev
```

Or run individual services:
```bash
pnpm dev:api     # Starts Express API at http://localhost:5000
pnpm dev:worker  # Starts BullMQ Worker cluster
pnpm dev:web     # Starts Next.js Web App at http://localhost:3000
```

### 6. Build, Typecheck & Tests
```bash
pnpm build       # Turbo builds all packages and applications
pnpm typecheck   # Type checks across all projects
pnpm test        # Runs test suites
```

---

## API Health Check
Test the running API server and its connections to MongoDB and Redis:
```bash
curl http://localhost:5000/api/v1/health
```
Example response:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "services": {
      "mongodb": "connected",
      "redis": "connected"
    },
    "timestamp": "2026-09-19T12:50:00.000Z"
  }
}
```
