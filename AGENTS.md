# tanstack-spa-scaffold

Agent instructions for this repo. Format: [agents.md](https://agents.md).

Greenfield monorepo — React SPA (`apps/web`), Hono API (`packages/api`), shared Zod contracts (`packages/schemas`). Human-oriented setup lives in [`README.md`](./README.md).

**Nested `AGENTS.md`:** packages ship their own files; the closest one to edited files takes precedence. Root rules here still apply unless a nested file overrides for that tree.

## Project overview

| Path               | Package             | Role                                                         |
| ------------------ | ------------------- | ------------------------------------------------------------ |
| `apps/web`         | `@scaffold/web`     | TanStack Router + Query + Form; HTTP to API via `/api` proxy |
| `packages/api`     | `@scaffold/api`     | Hono server; validates with `@scaffold/schemas`              |
| `packages/schemas` | `@scaffold/schemas` | Zod contracts — TDD boundary; write schema tests first       |

Feature plans → [`PLAN.md`](./PLAN.md). Visual identity → [`DESIGN.md`](./DESIGN.md). Glossary → [`CONTEXT.md`](./CONTEXT.md).

## Dev environment tips

**First-time setup** (from repo root):

```sh
cp .env.example .env
sfw pnpm install
pnpm exec playwright install chromium
./scripts/link-agent-skills.sh   # optional: .cursor/skills + .claude/skills → .agents/skills
```

**Day-to-day:**

- `pnpm dev` — web on **5173**, API on **3001** (web proxies `/api` → API).
- E2E uses **3101** (API) and **4174** (web preview) via `scripts/run-e2e.mjs` — do not assume dev ports in Playwright specs.
- Use **`sfw pnpm`** for install/add/update/remove (registry access). Use plain **`pnpm`** for scripts (`dev`, `test`, `lint`, `typecheck`).
- Target one workspace package: `pnpm --filter @scaffold/web <script>` (same for `@scaffold/api`, `@scaffold/schemas`). Check each `package.json` `name` field — not the root package name.
- After adding routes under `apps/web/src/routes/`, rebuild or run dev so TanStack Router regenerates `routeTree.gen.ts` — never hand-edit it.
- UI work: read [`DESIGN.md`](./DESIGN.md) ([google-labs-code/design.md](https://github.com/google-labs-code/design.md)).

## Testing instructions

**Done means all of these exit zero from the repo root:**

```sh
pnpm typecheck
pnpm lint
pnpm test
pnpm analyze
```

Do not report a task complete with any gate failing. If a failure looks unrelated, say so and name the failing test.

| Command               | Scope                                               |
| --------------------- | --------------------------------------------------- |
| `pnpm test:unit`      | Vitest in all packages                              |
| `pnpm test`           | Playwright e2e (`tests/e2e/`)                       |
| `pnpm test:all`       | Unit then e2e                                       |
| `pnpm analyze`        | fallow audit — new issues on changed code only      |
| `pnpm analyze:report` | fallow dead-code + health (informational, optional) |

Static analysis details: [`docs/static-analysis-protocol.md`](./docs/static-analysis-protocol.md). Tier placement: [ADR 0002](./docs/adr/0002-static-analysis-tier.md).

**Per package:**

```sh
pnpm --filter @scaffold/schemas test:unit
pnpm --filter @scaffold/api test:unit
pnpm --filter @scaffold/web test:unit
```

**Focus one test:**

```sh
pnpm --filter @scaffold/schemas exec vitest run -t "accepts a valid note"
pnpm --filter @scaffold/api exec vitest run -t "creates a note"
pnpm exec playwright test tests/e2e/notes.spec.ts
```

**TDD order** (details in [`docs/tdd-protocol.md`](./docs/tdd-protocol.md)): schemas → API → web helpers → UI → e2e. Name at least one failing test in `PLAN.md` § Verification before implementation.

**Playwright locators:** `getByRole` first; `getByLabel` / `getByText` second; `data-testid` only when semantics do not exist. No raw CSS/XPath. No `waitForTimeout` or `networkidle` — use `expect(…).toBeVisible()`, `waitForResponse`, or `waitForRequest`. Do not weaken assertions to match broken UI.

Add or update tests for behavior you change.

## When gates fail

Follow [`docs/debug-protocol.md`](./docs/debug-protocol.md). **Do not claim done on red.**

1. Re-run the failing gate; capture full output.
2. Write a dossier from [`docs/dossier-template.md`](./docs/dossier-template.md) under `reports/dossiers/` (gitignored).
3. Hypothesize → fix minimum change → re-run the same gate, then the full suite.
4. Up to **3** fix attempts per root error; then **escalate** with dossier status `escalated`.

**Escalate immediately** (do not spin): plan ambiguity, architecture fork, missing infra (Playwright browser, ports, `sfw`), or flake (passes on bare re-run without code change).

Never weaken tests or assertions to green a gate.

## Before implementation

Follow [`docs/kickoff-protocol.md`](./docs/kickoff-protocol.md). No feature code until `PLAN.md` § Plan has `approved: [x] yes`.

When context compacts, follow [`docs/context-protocol.md`](./docs/context-protocol.md) — re-read `AGENTS.md`, `PLAN.md`, and `CONTEXT.md`; for UI, also `DESIGN.md`. Do not rely on chat history.

## Skills

Project skills in [`.agents/skills/`](./.agents/skills/) — inventory and lifecycle in [`docs/skills-protocol.md`](./docs/skills-protocol.md). After clone: `./scripts/link-agent-skills.sh` for Cursor/Claude discovery.

| Order | Skill               | Use                                                        |
| ----- | ------------------- | ---------------------------------------------------------- |
| 1     | **grill-with-docs** | Kickoff → `PLAN.md` approved                               |
| 2     | **tdd**             | Red-green at Zod boundary                                  |
| 3     | **verify**          | Full gates + self-heal on failure                          |
| 4     | **analyze**         | fallow (included in verify; run alone when triaging)       |
| 5     | **security-review** | Before merge — stub until fork #13                         |
| —     | **orchestrate**     | Parallel work / delegation — not part of feature lifecycle |

Protocols are canonical; skills are pointers only.

## Orchestration

Default: **one agent, one session** (grill → tdd → verify). For parallel tasks or broad exploration, follow [`docs/subagents-protocol.md`](./docs/subagents-protocol.md). Every delegate runs the **same full gate** before reporting done ([ADR 0003](./docs/adr/0003-subagent-gates.md)). Brief template: [`docs/crewmate-brief-template.md`](./docs/crewmate-brief-template.md).

## Code style and conventions

- Zod schemas in `packages/schemas` are the single source of truth — export schemas and `z.infer` types; no duplicate boundary types.
- API: parse request bodies and outbound JSON with shared schemas.
- Web: parse API responses; validate forms with the same request schemas the API uses.
- Do not silence types with `any` or `@ts-expect-error`. Do not add `eslint-disable` — fix the code.
- Do not put implementation details in `CONTEXT.md` (glossary only).
- Do not add server functions to the web app — API lives in `packages/api`.

Reference slice: Notes (`packages/schemas/src/note.ts` → API → `apps/web/src/routes/notes.tsx` → `tests/e2e/notes.spec.ts`).

## PR instructions

- Run the **full gate** before opening or updating a PR: `pnpm typecheck`, `pnpm lint`, `pnpm test`, and `pnpm analyze`.
- Pre-commit (Lefthook) runs **fast gates only** (`typecheck` + `lint`) — see [ADR 0001](./docs/adr/0001-tiered-quality-gates.md) and [ADR 0002](./docs/adr/0002-static-analysis-tier.md). E2e and fallow are not in the hook; run `pnpm test` and `pnpm analyze` explicitly.
- Flag new dependencies in the PR/summary; install only via `sfw pnpm`.
- Only create commits or PRs when the human asks.

## Recovery

```sh
git stash && git checkout main && sfw pnpm install && pnpm typecheck && pnpm lint && pnpm test && pnpm analyze
```
