# @scaffold/web

Nearest agent instructions for the React SPA. Shared rules: [`../../AGENTS.md`](../../AGENTS.md).

## Dev

- `pnpm dev` from repo root (or `pnpm dev` in this directory) — Vite on **5173**.
- `/api/*` proxies to the API (`vite.config.ts`); use `/api/...` in fetch helpers, not bare API origin.
- Routes: file-based under `src/routes/`. Regenerate `src/routeTree.gen.ts` via dev/build — do not edit by hand.

## Layout

- `src/routes/` — pages (TanStack Router)
- `src/lib/` — fetch/mutation helpers with schema validation (prefer testing here)
- Visual tokens and rationale: [`../../DESIGN.md`](../../DESIGN.md)

## Testing

```sh
pnpm --filter @scaffold/web test:unit
pnpm --filter @scaffold/web exec vitest run -t "<pattern>"
pnpm exec playwright test tests/e2e/   # from repo root
```

Co-locate unit tests as `*.test.ts` next to helpers. E2e specs live in `tests/e2e/` at repo root.
