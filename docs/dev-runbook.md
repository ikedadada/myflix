# Dev Deployment Runbook

This runbook explains how to ship backend (Workers), frontend (Pages), and infra changes to the shared dev environment.

## Prerequisites
- Cloudflare account with access to the dev Workers service, Pages project, and R2/D1/KV bindings.
- `wrangler`, `npm`, and `terraform` installed locally (Node 24.11.1 via mise).
- Logged into Cloudflare via `wrangler login`.

## Backend (Workers API)
1. Apply schema changes locally: `npm run migrate` (or `npx wrangler d1 migrations apply myflix-dev-db`).
2. Run `npm run lint` and `npm run test` in `backend/`.
3. Deploy to dev: `npm run deploy -- --env dev`. Wranger will push the latest build and bind to dev resources specified in `wrangler.toml`.
4. Verify logs: `wrangler tail --env dev` while hitting `/auth/me` with a dev Access token.

## Frontend (Pages)
1. `npm run build` in `frontend/` and ensure `dist/` renders locally via `npm run preview`.
2. Push to the dev branch configured for the Pages project (refer to Terraform `envs/dev`).
3. Cloudflare Pages will automatically build; monitor build status in the Pages dashboard.
4. Smoke test the dev URL (e.g., `https://myflix-dev.example.com`) ensuring it reaches the dev Worker via `/api/*` routes.

## Infra (Terraform)
1. From `infra/terraform`, run `terraform init envs/dev` (first-time only).
2. Plan changes: `terraform plan -chdir=envs/dev -var-file=dev.tfvars`.
3. On approval, apply: `terraform apply -chdir=envs/dev -var-file=dev.tfvars`.
4. Document any manual steps (e.g., Access policy tweaks) in this runbook after execution.

## Rollback
- Backend: redeploy the previous git commit via `npm run deploy -- --env dev --tag <commit>`. Wrangler keeps prior deployments.
- Frontend: revert/rollback the Pages deployment from the Cloudflare UI or redeploy the last good commit.
- Infra: run `terraform apply` with the last known good state or `terraform state` import to correct drift.

## Validation Checklist
- [ ] `/auth/me` returns the authenticated developer profile.
- [ ] `/videos` returns seeded videos.
- [ ] Frontend dev URL loads without console errors.
- [ ] Terraform state shows no pending changes.
