# OpenAPI

This folder contains the backend OpenAPI spec derived from the current Hono routes.

## Preview (Swagger UI)

From `backend`:

```bash
npm install
npm run openapi:preview
```

Then open:

- http://localhost:8080

## Notes

- The API base path is `/api`.
- Auth is enforced via the `cf-access-jwt-assertion` header in non-local environments.
- Keep `openapi.yaml` as the source of truth and update it when routes or payloads change.
