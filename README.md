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
3. Run local services:
   - Backend: `npm run dev` (wrangler) exposing Cloudflare bindings defined in `backend/wrangler.toml`.
   - Frontend: `npm run dev` (Vite) and configure `VITE_API_BASE_URL` to point at the dev Worker route.
4. Execute automated checks before committing:
   - Backend: `npm run lint`, `npm run test`, `npm run build`.
   - Frontend: `npm run lint`, `npm run test`, `npm run build`.
5. For infrastructure updates, run `terraform plan -chdir=infra/terraform/envs/dev` and include the plan summary in pull requests.

Refer to `AGENTS.md` for contributor etiquette and to the plan documents for module-level expectations.
