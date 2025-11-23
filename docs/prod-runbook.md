# Prod Deployment Runbook

Guidelines for promoting changes to the production environment once they have soaked in dev.

## Gate Criteria
- All backend/frontend tests pass locally and in CI.
- Dev environment verified per `docs/dev-runbook.md`.
- Incident commander (or project owner) signs off on scope.

## Backend (Workers API)
1. Update `wrangler.toml` with prod bindings if necessary (avoid committing secrets; rely on Cloudflare dashboard).
2. Run `npm run build` and `npm run test` in `backend/`.
3. Deploy using `npm run deploy -- --env prod`. Confirm the `prod` environment in Cloudflare uses the correct R2/D1/KV resources.
4. Monitor `wrangler tail --env prod` for at least 5 minutes, watching auth/video/upload routes.

## Frontend (Pages)
1. Merge to `main` (or the production branch defined in Terraform `envs/prod`).
2. Cloudflare Pages will trigger a build; confirm the build uses prod environment variables (API base URL, Access domain).
3. Validate `https://myflix.example.com` (or configured host) for:
   - Authenticated load via Cloudflare Access.
   - Video library fetches hitting the prod Worker.
   - Settings and upload flows succeed.

## Infra (Terraform)
1. From `infra/terraform`, run `terraform plan -chdir=envs/prod -var-file=prod.tfvars`.
2. Review the plan with another maintainer.
3. Apply via `terraform apply -chdir=envs/prod -var-file=prod.tfvars`.
4. Record the Terraform run ID and summarize changes in the deployment log (issue tracker or `docs/deployment-log.md`).

## Rollback
- Backend: `wrangler rollback --env prod` to the previous deployment ID.
- Frontend: use Pages “Rollback” on the previous successful build.
- Infra: apply the prior state file (Terraform Cloud or remote backend) or revert the change commit and re-apply.

## Post-Deployment Checklist
- [ ] Synthetic check hitting `/videos` returns HTTP 200.
- [ ] Pages analytics shows successful production build.
- [ ] Access policies still restrict to approved groups.
- [ ] On-call engineer notified of the release.
