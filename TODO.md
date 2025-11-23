# TODO

- Connect backend repositories to real R2/D1/KV bindings and add persistence/integration tests (domain vs. infrastructure parity).
- Implement authenticated API flows end-to-end by wiring wrangler dev to Cloudflare Access and adding contract/e2e tests that mimic the Access headers.
- Flesh out Terraform modules with additional policies (R2 lifecycle management, Access service tokens, DNS failover).
- Instrument backend and frontend with structured logging/monitoring (align with infra plan’s observability section).
- Document deployment playbooks per environment in `docs/` (dev/prod runbooks, rollback steps). ✅
