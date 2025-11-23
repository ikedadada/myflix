# TODO

- Connect backend repositories to real R2/D1/KV bindings and add persistence tests (D1 seeding + integration harness).
- Implement authenticated API flows end-to-end by wiring wrangler dev to Cloudflare Access and adding contract tests.
- Flesh out Terraform modules with additional policies (R2 lifecycle, Access service tokens).
- Add continuous integration workflow (lint/test/build) for backend and frontend packages.
- Document deployment playbooks per environment in `docs/` (dev/prod runbooks, rollback steps).
