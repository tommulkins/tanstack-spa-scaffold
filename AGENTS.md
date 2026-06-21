# Agent Contract

Greenfield monorepo: React SPA (`apps/web`), Hono API (`packages/api`), shared Zod contracts (`packages/schemas`).

## What "done" means

A task is not done until these exit zero from the repository root:

1. `pnpm typecheck`
2. `pnpm lint`
3. `pnpm test`

Do not report a task complete with any of these failing. If a failure looks unrelated, say so explicitly and name the failing test.

## Before implementation

Follow [`docs/kickoff-protocol.md`](./docs/kickoff-protocol.md). No feature code until `DESIGN.md` § Plan is approved.

When context compacts, re-read `AGENTS.md`, `DESIGN.md`, and `CONTEXT.md` before continuing.

## Dependencies

Any command that installs or changes dependencies must use **`sfw pnpm`**, not bare `npm` / `pnpm` / `yarn`.

Flag new dependencies in your summary.

## Package layout

| Path               | Role                                                      |
| ------------------ | --------------------------------------------------------- |
| `apps/web`         | TanStack Router + Query + Form; talks to API over HTTP    |
| `packages/api`     | Hono server; validates responses with `@scaffold/schemas` |
| `packages/schemas` | Zod schemas and types shared by web and API               |

## Tests

- Unit tests: co-located as `<name>.test.ts`, run with Vitest.
- E2E tests: `tests/e2e/`, run with Playwright from the repo root.

Write a failing test before implementation when adding behavior (fork #3).

## Playwright locator rules

- `getByRole` first. `getByLabel` or `getByText` second. `data-testid` only when semantics genuinely do not exist.
- Never use raw CSS or XPath selectors in specs.
- Never use `page.waitForTimeout` or `waitForLoadState('networkidle')`. Use `expect(locator).toBeVisible()`, `page.waitForResponse`, or `page.waitForRequest`.
- Do not fix a failing Playwright test by weakening the assertion to match broken UI.

## Do not

- Do not silence type errors with `any` or `@ts-expect-error`. Fix the type.
- Do not add `eslint-disable` comments. Fix the code.
- Do not hand-edit `apps/web/src/routeTree.gen.ts`. Regenerate via Vite / TanStack Router plugin.
- Do not put implementation details in `CONTEXT.md` (glossary only).
- Do not add server functions to the web app — API lives in `packages/api`.

## Recovery

```sh
git stash && git checkout main && sfw pnpm install && pnpm typecheck && pnpm lint && pnpm test
```

## Skills

Project skills live in `.agents/skills/`. Start kickoff with `grill-with-docs` (see skill file → `docs/kickoff-protocol.md`).
