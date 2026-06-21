# @scaffold/api

Nearest agent instructions for the Hono API. Shared rules: [`../../AGENTS.md`](../../AGENTS.md).

## Dev

- `pnpm dev` — `tsx watch` on **3001** (override with `API_PORT`).
- E2E stack uses **3101** when started by `scripts/run-e2e.mjs`.

## Layout

- `src/app.ts` — Hono app and routes (export for tests)
- `src/index.ts` — `serve()` only
- Validate in/out with `@scaffold/schemas` — parse bodies and responses before `c.json`

## Testing

```sh
pnpm --filter @scaffold/api test:unit
pnpm --filter @scaffold/api exec vitest run -t "<pattern>"
```

Use `app.request()` in Vitest — no live server. Co-locate tests as `src/*.test.ts`.

Write API tests after schema tests, before web/e2e ([`../../docs/tdd-protocol.md`](../../docs/tdd-protocol.md)).
