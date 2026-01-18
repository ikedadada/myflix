# MYFLIX Monorepo

This repository contains the MYFLIX backend (Cloudflare Workers + Hono), frontend (Vite + React), and infrastructure (Terraform) code. Planning documents live under `docs/` and each package exposes dedicated tooling via npm scripts.

## Project Structure

- `backend/` – Workers API implemented with the four-layer DDD structure described in `backend/docs/backend_plan.md`.
- `frontend/` – Vite-powered SPA with TanStack Router, shadcn UI, and feature-oriented React components.
- `infra/` – Terraform stack with `envs/` for dev/prod environments and reusable Cloudflare modules per `infra/docs/infra_plan.md`.
- `docs/` – Top-level `project_plan.md` plus other reference material.

## Development Workflow

1. Install toolchains via [mise](https://mise.jdx.dev/): `mise use -C backend`, `mise use -C frontend`.
2. Install package dependencies with `npm install` inside `backend/` and `frontend/`.
3. Configure environment files:
   - Backend: copy `backend/.dev.vars.example` to `.dev.vars` and update `ACCESS_JWKS_URL` / `ACCESS_JWT_AUD`. Update `backend/wrangler.toml` `env.dev` bindings (D1/R2/KV) using the Terraform outputs for dev. Run `npm run migrate:local` to apply D1 migrations when using `wrangler dev`.
   - Frontend: copy `frontend/.env.example` to `.env.local` (or `.env`) and update `VITE_API_BASE_URL`.
4. Run local services:
   - Backend: `npm run dev` (wrangler) exposing Cloudflare bindings defined in `backend/wrangler.toml`. Run `npx wrangler d1 migrations apply myflix-dev-db --local` before starting to create the schema.
   - Frontend: `npm run dev` (Vite) and configure `VITE_API_BASE_URL` to point at the dev Worker route (e.g., `http://127.0.0.1:8787`). The SPA now reads `/videos`, `/uploads`, and `/settings` endpoints during development.
5. Execute automated checks before committing:
   - Backend: `npm run lint`, `npm run test`, `npm run build`, `npm run migrate:dev` (before deploying to dev/prod).
   - Frontend: `npm run lint`, `npm run test`, `npm run build`.
6. For infrastructure updates, run `terraform plan -chdir=infra/terraform/envs/dev` and include the plan summary in pull requests.

## Deployment & CI

- GitHub Actions (`.github/workflows/ci.yml`) runs lint and test jobs for backend and frontend on every push and pull request. Keep both toolchains green before pushing to avoid CI failures.
- Deployment runbooks live in `docs/dev-runbook.md` and `docs/prod-runbook.md`. Follow them for dev soak tests and production releases.

## GitHub Actions secrets

- Terraform dev workflow (`terraform-dev.yml`): `CLOUDFLARE_API_TOKEN`, `TF_DEV_ACCOUNT_ID`, `R2_DEV_STATE_ACCESS_KEY`, `R2_DEV_STATE_SECRET_ACCESS_KEY`, `TF_DEV_ACCESS_DOMAIN`, `TF_DEV_ALLOWED_EMAIL`.
- Backend/Pages deploy workflows should source any Access/JWKS URLs, audiences, and API base URLs from repository/environment secrets instead of committing values. Provide the names in workflow `env:` blocks and set them in the GitHub UI.

Refer to `AGENTS.md` for contributor etiquette and to the plan documents for module-level expectations.

## Frontend Structure & Policy

The frontend follows a simple, explicit layout. React component definitions live under `src/components`, and shadcn-generated files are isolated under `src/components/shadcn`.

```
frontend/src/
  app/
    layout/       # app shell layout
    providers/    # Query/Theme/other providers
    router/       # route definitions
    pages/        # route-aligned pages (formerly src/pages)
  components/
    features/     # feature-scoped UI/hooks/state per use case
    ui/           # app-wide reusable UI (wrappers/compose shadcn)
    layout/       # shared layout UI (PageHeader, etc.)
    shadcn/       # shadcn-generated files (ui/, hooks/)
  lib/            # reusable non-React helpers (api-client, utils)
  types/          # shared type definitions
  config.ts       # app settings/env values
```

Frontend conventions:

- `components/features` and `components/ui` are peer categories; both contain React components.
- shadcn output stays in `src/components/shadcn` and should not be edited directly unless required.
- `components/ui` wraps/compose shadcn components; app pages/features should prefer `components/ui` over direct shadcn imports.
- Configuration is centralized in `src/config.ts`. API helpers live in `src/lib/api-client.ts`.

Shadcn aliases (from `frontend/components.json`) point to:

- `components`: `@/components/shadcn`
- `ui`: `@/components/shadcn/ui`
- `hooks`: `@/components/shadcn/hooks`
