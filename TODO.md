# TODO

- [ ] Wire Workers to real Cloudflare persistence: add D1 schema migrations and wrangler/infra bindings for DB/R2, hook upload/metadata flows to R2 storage, and add persistence/integration tests that validate domain vs infrastructure behavior.
- [ ] Make Access integration verifiable end to end: configure wrangler dev with the Access JWKS (or a local mock) and add contract/e2e tests that hit auth-protected routes with Cf-Access-Jwt-Assertion headers.
- [ ] Harden Terraform modules: replace the placeholder Workers script with the built artifact, attach D1/R2/KV bindings and routes, extend R2 with lifecycle rules, add Access service tokens, and fold DNS failover/records into dev/prod envs.
- [ ] Instrument backend and frontend with structured logging/monitoring and emit traces/metrics per the infra plan.
- [x] Deployment playbooks in `docs/` (dev/prod runbooks, rollback steps) are done.
