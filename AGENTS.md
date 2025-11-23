# Repository Guidelines

## Project Structure & Module Organization
Top-level directories separate concerns: `backend` (Cloudflare Workers API with domain/application/infrastructure/presentation layers), `frontend` (Vite-powered React SPA organized into `src/app`, `pages`, `features`, `shared`, and `assets`), and `infra` (Terraform under `terraform/envs` for dev/prod and reusable `modules`). Planning documents in each folder describe the intended file trees—mirror those layouts when adding code so reviewers can map changes quickly.

## Build, Test, and Development Commands
Install dependencies per package: `cd backend && npm install`, `cd frontend && npm install`. Start local dev with `npm run dev` in each directory (Workers via `wrangler dev`, frontend via Vite). Build artifacts with `npm run build` and preview using `npm run preview`. Run unit tests through `npm run test` (Vitest/Jest depending on package) and lint via `npm run lint`. Infra changes must be validated with `cd infra/terraform && terraform init && terraform plan -var-file=envs/dev/dev.tfvars` before apply.

## Coding Style & Naming Conventions
Use TypeScript everywhere with strict mode enabled. Prefer 2-space indentation, single quotes, and trailing commas (ESLint default). Name files kebab-case for modules (`video-service.ts`) and PascalCase for React components. Keep React components functional, colocate hooks under `shared/hooks`, and describe DTOs/entities with descriptive suffixes (`-dto.ts`, `-entity.ts`). Always format with Prettier (`npm run format`) before pushing and ensure Tailwind classes follow utility grouping (layout → spacing → color) per shadcn/ui guidance.

## Testing Guidelines
Adopt co-located `*.test.ts` or `*.test.tsx` files unless an integration `tests/` directory already exists. Favor Vitest in frontend and backend for speed; configure Hono handlers with request mocks. Cover key domain invariants (entity validators, repositories) and user flows (upload, playback, settings). Use descriptive test names (`should reject oversized uploads`) and target ≥80% coverage where meaningful (`npm run test -- --coverage`).

## Commit & Pull Request Guidelines
Git history is not yet established; start using concise imperative commit subjects inspired by Conventional Commits (e.g., `feat: add upload service`). Each PR should explain scope, affected directories, test evidence, and related issue/plan section. Include screenshots or curl logs when UI or API behavior changes. Draft PRs for work-in-progress but keep checklist of TODOs visible.

## Security & Access Notes
All services rely on Cloudflare Zero Trust Access; never bypass it in code. Avoid embedding secrets—reference Workers bindings or Terraform variables instead. Local development still targets the shared `dev` environment, so coordinate schema or R2 mutations and document destructive operations in PR descriptions.
