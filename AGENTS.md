# tanstack-spa-scaffold

Agent instructions for this repo. Format: [agents.md](https://agents.md).

Greenfield monorepo — React SPA (`apps/web`), Hono API (`packages/api`), shared Zod contracts (`packages/schemas`). Humans: see [`README.md`](./README.md) for overview and quick start.

**You are an agent working in this repo.**

**Read order:** this file → `PLAN.md` (if doing feature work) → the protocol for your current phase (see table below).

**Nested `AGENTS.md`:** packages ship their own files; the closest one to edited files takes precedence. Root rules here still apply unless a nested file overrides for that tree.

## Harness files

| File        | Role                                                                   |
| ----------- | ---------------------------------------------------------------------- |
| `AGENTS.md` | Canonical instructions (this file) — Cursor, Codex, and similar tools  |
| `CLAUDE.md` | Claude Code only — contains `@AGENTS.md`; do not duplicate rules there |

## Project overview

| Path               | Package             | Role                                                         |
| ------------------ | ------------------- | ------------------------------------------------------------ |
| `apps/web`         | `@scaffold/web`     | TanStack Router + Query + Form; HTTP to API via `/api` proxy |
| `packages/api`     | `@scaffold/api`     | Hono server; validates with `@scaffold/schemas`              |
| `packages/schemas` | `@scaffold/schemas` | Zod contracts — TDD boundary; write schema tests first       |

Feature plans → [`PLAN.md`](./PLAN.md). Visual identity → [`DESIGN.md`](./DESIGN.md). Glossary → [`CONTEXT.md`](./CONTEXT.md).

## Phase → protocol

| Phase              | Read                                                                     |
| ------------------ | ------------------------------------------------------------------------ |
| Session start      | this file                                                                |
| Feature kickoff    | [`docs/kickoff-protocol.md`](./docs/kickoff-protocol.md)                 |
| Implement          | [`docs/tdd-protocol.md`](./docs/tdd-protocol.md)                         |
| E2e / acceptance   | [`docs/e2e-protocol.md`](./docs/e2e-protocol.md)                         |
| Red gates          | [`docs/debug-protocol.md`](./docs/debug-protocol.md)                     |
| Static analysis    | [`docs/static-analysis-protocol.md`](./docs/static-analysis-protocol.md) |
| Before PR          | [`docs/security-protocol.md`](./docs/security-protocol.md)               |
| Context compaction | [`docs/context-protocol.md`](./docs/context-protocol.md)                 |
| Parallel delegates | [`docs/subagents-protocol.md`](./docs/subagents-protocol.md)             |

## Dev environment tips

**First-time setup** (from repo root; same as [`README.md`](./README.md) § Setup):

```sh
cp .env.example .env
pnpm install                     # recommended: sfw pnpm install
pnpm exec playwright install chromium
./scripts/link-agent-skills.sh   # optional: .cursor/skills + .claude/skills → .agents/skills
```

**Day-to-day:**

- `pnpm dev` — web on **5173**, API on **3001** (web proxies `/api` → API).
- E2E uses **3101** (API) and **4174** (web preview) via `scripts/run-e2e.mjs` — do not assume dev ports in Playwright specs.
- Prefer **`sfw pnpm`** for install/add/update/remove when [Socket Firewall](https://socket.dev) is available (supply-chain screening). Plain **`pnpm`** is fine for all commands, including scripts (`dev`, `test`, `lint`, `typecheck`).
- Target one workspace package: `pnpm --filter @scaffold/web <script>` (same for `@scaffold/api`, `@scaffold/schemas`). Check each `package.json` `name` field — not the root package name.
- After adding routes under `apps/web/src/routes/`, rebuild or run dev so TanStack Router regenerates `routeTree.gen.ts` — never hand-edit it.
- UI work: read [`DESIGN.md`](./DESIGN.md) ([google-labs-code/design.md](https://github.com/google-labs-code/design.md)).

## Testing instructions

**Done means the full gate exits zero from the repo root:**

```sh
pnpm gate
```

Equivalent to `typecheck`, `lint`, `test:agent-policy`, `test:unit`, `test`, and `analyze`.

**Before PR / merge** (feature or dependency change), also run security review per [`docs/security-protocol.md`](./docs/security-protocol.md): `pnpm security:check` + diff checklist (security-review skill). Not part of `pnpm gate` or CI — agent/human before PR ([ADR 0007](./docs/adr/0007-security-review-tier.md)).

Do not report a task complete with any gate failing. If a failure looks unrelated, say so and name the failing test.

| Command               | Scope                                               |
| --------------------- | --------------------------------------------------- |
| `pnpm test:unit`      | Vitest in all packages                              |
| `pnpm test`           | Playwright e2e (`tests/e2e/`)                       |
| `pnpm test:all`       | Unit then e2e                                       |
| `pnpm analyze`        | fallow audit — new issues on changed code only      |
| `pnpm analyze:report` | fallow dead-code + health (informational, optional) |
| `pnpm security:check` | Secrets grep on staged files (before PR)            |
| `pnpm gate`           | Full gate — matches CI                              |

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

**Acceptance rigor:** Each user-visible feature needs **1 happy + 1 failure** e2e matching `PLAN.md` § Acceptance scenarios. Reject paths must assert no successful mutation when validation blocks submit. Details: [`docs/e2e-protocol.md`](./docs/e2e-protocol.md). Smoke-only "page loads" belongs in `smoke.spec.ts`, not feature specs.

Add or update tests for behavior you change.

## When gates fail

Follow [`docs/debug-protocol.md`](./docs/debug-protocol.md). **Do not claim done on red.**

1. Re-run the failing gate; capture full output.
2. Write a dossier from [`docs/dossier-template.md`](./docs/dossier-template.md) under `reports/dossiers/` (gitignored).
3. Hypothesize → fix minimum change → re-run the same gate, then the full suite.
4. Up to **3** fix attempts per root error; then **escalate** with dossier status `escalated`.

**Escalate immediately** (do not spin): plan ambiguity, architecture fork, missing infra (Playwright browser, ports, registry/network), or flake (passes on bare re-run without code change).

Never weaken tests or assertions to green a gate.

## Before implementation

Follow [`docs/kickoff-protocol.md`](./docs/kickoff-protocol.md). No feature code until `PLAN.md` § Plan has `approved: [x] yes`.

When context compacts, follow [`docs/context-protocol.md`](./docs/context-protocol.md) — re-read `AGENTS.md`, `PLAN.md`, and `CONTEXT.md`; for UI, also `DESIGN.md`. Do not rely on chat history.

## Skills

Project skills in [`.agents/skills/`](./.agents/skills/) — inventory and lifecycle in [`docs/skills-protocol.md`](./docs/skills-protocol.md). After clone: `./scripts/link-agent-skills.sh` for Cursor/Claude discovery.

| Order | Skill               | Use                                                                                  |
| ----- | ------------------- | ------------------------------------------------------------------------------------ |
| 1     | **grill-with-docs** | Kickoff → `PLAN.md` approved                                                         |
| 2     | **tdd**             | Red-green at Zod boundary                                                            |
| 3     | **acceptance**      | Happy + failure e2e from `PLAN.md` scenarios                                         |
| 4     | **verify**          | Full gates + self-heal on failure                                                    |
| 5     | **analyze**         | fallow (included in verify; run alone when triaging)                                 |
| 6     | **security-review** | After `pnpm gate`; before PR — [`security-protocol.md`](./docs/security-protocol.md) |
| —     | **orchestrate**     | Parallel work / delegation — not part of feature lifecycle                           |

Protocols are canonical; skills are pointers only.

## Orchestration

Default: **one agent, one session** (grill → tdd → verify). For parallel tasks or broad exploration, follow [`docs/subagents-protocol.md`](./docs/subagents-protocol.md). Every delegate runs the **same full gate** before reporting done ([ADR 0003](./docs/adr/0003-subagent-gates.md)). Brief template: [`docs/crewmate-brief-template.md`](./docs/crewmate-brief-template.md).

## MCP and external tools

Shell gates are canonical ([ADR 0005](./docs/adr/0005-mcp-optional-augmentation.md)). Optional MCP / AXI for docs, browser debug, and triage: [`docs/mcp-protocol.md`](./docs/mcp-protocol.md). Example harness config: [`docs/mcp.example.json`](./docs/mcp.example.json). Do not claim done from MCP observation alone.

## Code style and conventions

- Zod schemas in `packages/schemas` are the single source of truth — export schemas and `z.infer` types; no duplicate boundary types.
- API: parse request bodies and outbound JSON with shared schemas.
- Web: parse API responses; validate forms with the same request schemas the API uses.
- Do not silence types with `any` or `@ts-expect-error`. Do not add `eslint-disable` — fix the code. Enforced: [`docs/hooks-protocol.md`](./docs/hooks-protocol.md), Lefthook `agent-policy`, Cursor `preToolUse` hook ([ADR 0004](./docs/adr/0004-no-agent-suppressions.md)).
- Do not put implementation details in `CONTEXT.md` (glossary only).
- Do not add server functions to the web app — API lives in `packages/api`.

Reference slice: Notes (`packages/schemas/src/note.ts` → API → `apps/web/src/routes/notes.tsx` → `tests/e2e/notes.spec.ts`).

## PR instructions

- Run **`pnpm gate`** before opening or updating a PR (same as [CI](./docs/ci-protocol.md)).
- Run **`pnpm security:check`** + security-review checklist before PR when the change is a feature slice or touches dependencies ([security-protocol](./docs/security-protocol.md)).
- Pre-commit (Lefthook) runs **fast gates only** (`typecheck` + `lint` + **agent-policy**) — see [ADR 0001](./docs/adr/0001-tiered-quality-gates.md), [ADR 0002](./docs/adr/0002-static-analysis-tier.md), and [ADR 0004](./docs/adr/0004-no-agent-suppressions.md). E2e, fallow, and security review are not in the hook.
- Flag new dependencies in the PR/summary; prefer `sfw pnpm` for install/add/update when available.
- Only create commits or PRs when the human asks.

## Recovery

```sh
git stash && git checkout main && pnpm install && pnpm gate
```
