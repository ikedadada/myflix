# MYFLIX Monorepo

This repository contains the MYFLIX backend (Cloudflare Workers + Hono), frontend (Vite + React), and infrastructure (Terraform) code. Planning documents live under `docs/` and each package exposes dedicated tooling via npm scripts.

## Project Structure

- `backend/` – Workers API implemented with the four-layer DDD structure described in `backend/docs/backend_plan.md`.
- `frontend/` – Vite-powered SPA matching `frontend/docs/frontend_plan.md` with TanStack Router and shadcn-inspired UI building blocks.
- `infra/` – Terraform stack with `envs/` for dev/prod environments and reusable Cloudflare modules per `infra/docs/infra_plan.md`.
- `docs/` – Top-level `project_plan.md` plus other reference material.

## Development Workflow

1. Install toolchains via [mise](https://mise.jdx.dev/): `mise use -C backend`, `mise use -C frontend`.
2. Install package dependencies with `npm install` inside `backend/` and `frontend/`.
3. Configure environment files:
   - Backend: copy `backend/.dev.vars.example` to `.dev.vars` and update `ACCESS_JWKS_URL` / `ACCESS_JWT_AUD`. Run `npm run migrate:local` to apply D1 migrations when using `wrangler dev`.
   - Frontend: copy `frontend/.env.example` to `.env.local` (or `.env`) and update `VITE_API_BASE_URL`.
4. Run local services:
   - Backend: `npm run dev` (wrangler) exposing Cloudflare bindings defined in `backend/wrangler.toml`. Run `npx wrangler d1 migrations apply myflix-dev-db --local` before starting to create the schema.
   - Frontend: `npm run dev` (Vite) and configure `VITE_API_BASE_URL` to point at the dev Worker route (e.g., `http://127.0.0.1:8787`). The SPA now reads `/videos`, `/uploads`, and `/settings` endpoints during development.
5. Execute automated checks before committing:
   - Backend: `npm run lint`, `npm run test`, `npm run build`.
   - Frontend: `npm run lint`, `npm run test`, `npm run build`.
6. For infrastructure updates, run `terraform plan -chdir=infra/terraform/envs/dev` and include the plan summary in pull requests.

## Deployment & CI

- GitHub Actions (`.github/workflows/ci.yml`) runs lint and test jobs for backend and frontend on every push and pull request. Keep both toolchains green before pushing to avoid CI failures.
- Deployment runbooks live in `docs/dev-runbook.md` and `docs/prod-runbook.md`. Follow them for dev soak tests and production releases.

Refer to `AGENTS.md` for contributor etiquette and to the plan documents for module-level expectations.
