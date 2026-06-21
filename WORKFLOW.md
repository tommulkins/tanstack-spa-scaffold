# AI Workflow — Decision Log

Living document for a rigorous, agent-assisted workflow: **new project or feature → all gates green → production**.

Each forked discussion adds decisions here. Prefer succinct entries; link out for detail.

> **New session?** Read [`SESSION-HANDOFF.md`](./SESSION-HANDOFF.md) first — current state, repos, and workflow status (all 13 forks complete).

---

## Repository roles

| Path                                                                           | Purpose                                                                                                                              |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| `ai-workflows/WORKFLOW.md`                                                     | Meta decision log for designing the workflow (this file). Not copied into greenfield projects.                                       |
| [`tanstack-spa-scaffold`](https://github.com/tommulkins/tanstack-spa-scaffold) | **Deliverable:** greenfield monorepo template (TanStack + Hono + Zod + gates). Own repo at `Projects/Mercor/tanstack-spa-scaffold/`. |
| Example repos in workspace                                                     | **Reference only** — patterns and ideas, not code to copy. See [Reference material](#reference-material).                            |

---

## End goal

Demonstrate in video form a repeatable workflow for senior engineers:

1. Scaffold a greenfield project with hard quality gates baked in
2. Clarify the goal, write the plan, implement, verify
3. Catch bugs with TDD and shared schemas
4. Pass static analysis, **security review**, e2e, and CI before prod

**Principle:** The agent runs the feedback loop; the human steers architecture and approves merges.

---

## Stack (decided)

| Layer             | Choice                                            | Notes                                                                           |
| ----------------- | ------------------------------------------------- | ------------------------------------------------------------------------------- |
| Frontend          | **React SPA**                                     | No SSR in the base template                                                     |
| Routing & data    | **TanStack** (Router, Query, Form)                | File-based routing; Query for server state                                      |
| Backend           | **Hono**                                          | Separate process in monorepo; HTTP API only from web                            |
| Shared contracts  | **Zod**                                           | Schemas in `packages/schemas`; TDD at boundaries                                |
| Styling           | **Tailwind CSS v4**                               | Part of scaffold                                                                |
| Unit tests        | **Vitest**                                        | Co-located with source                                                          |
| E2E               | **Playwright**                                    | Smoke + feature probes; locator rules in agent contract                         |
| Package manager   | **pnpm** workspaces                               | `pnpm-workspace.yaml`; `packageManager` field in root `package.json`            |
| Supply-chain gate | **[Socket Firewall (`sfw`)](https://socket.dev)** | Wrap install/add/update — see [Package management](#package-management-decided) |

### Explicitly not in the base template

Add during feature work, not at scaffold time:

- Auth, database, i18n, full UI kit
- fallow, ponytail, custom MCPs, CI (later forks)
- Dedicated SAST/DAST stack (fork #13 — security review)
- Third-party deploy/vendor lock-in

### Package management (decided)

**pnpm workspaces** for the monorepo (`apps/*`, `packages/*`).

**Socket Firewall (`sfw`)** intercepts package-manager network requests and blocks known-malicious or policy-violating packages. Local setup aliases package managers through `sfw` (e.g. `pnpm` → `sfw pnpm`).

| Command type                                     | Use                                                            |
| ------------------------------------------------ | -------------------------------------------------------------- |
| Install / add / update / remove (hits registry)  | `sfw pnpm …` — or aliased `pnpm` if the shell already wraps it |
| Run scripts (`test`, `lint`, `dev`, `typecheck`) | `pnpm run …` / `pnpm …` — no registry fetch                    |
| CI install                                       | `sfw pnpm install --frozen-lockfile` (fork #11)                |

**Agent rule (goes in scaffold `AGENTS.md`):** Any command that installs or changes dependencies must go through `sfw pnpm`, not bare `npm`/`pnpm`/`yarn`. Do not add dependencies without flagging them in the summary.

**Scaffold files:**

- `pnpm-workspace.yaml`
- Root `package.json` → `"packageManager": "pnpm@<version>"`
- Optional `.sfw.config` in repo if team policy needs project-level rules (inspect before first run in untrusted clones)

**Recovery example** (scripts only; use `sfw pnpm install` when node_modules missing):

```sh
git stash && git checkout main && sfw pnpm install && pnpm typecheck && pnpm lint && pnpm test
```

---

## Agent instruction files (decided)

Three files, four jobs — **no duplication of content**.

| File             | Role                                                             | When written                                                                                                     | Loaded by                                                             |
| ---------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| **`AGENTS.md`**  | How to work in this repo — [agents.md](https://agents.md) format | Scaffold + per-package nested files                                                                              | Cursor, Claude Code, Codex, etc.                                      |
| **`CLAUDE.md`**  | Symlink → `AGENTS.md`                                            | Scaffold                                                                                                         | Claude Code (convention)                                              |
| **`PLAN.md`**    | Current feature — goal, plan, verification, recovery             | Kickoff (fork #2); new file or section per feature                                                               | All agents; re-grounding when context compacts                        |
| **`DESIGN.md`**  | Visual identity — design tokens + rationale                      | Kickoff or when UI direction is set; [google-labs-code/design.md](https://github.com/google-labs-code/design.md) | UI-facing agents; lint with `npx @google/design.md lint`              |
| **`CONTEXT.md`** | Ubiquitous language — glossary only, no implementation           | Kickoff; updated inline as terms resolve                                                                         | All agents; [grill-with-docs](https://www.aihero.dev/grill-with-docs) |
| **`docs/adr/`**  | Durable architectural decisions (surprising trade-offs)          | Kickoff; sparingly when ADR criteria met                                                                         | All agents; long-lived project memory                                 |

**They do not conflict.** `AGENTS.md` is the single source of truth for _how to work in this repo_. `CLAUDE.md` exists so Claude-native tools find instructions without maintaining a second copy ([firstmate pattern](https://github.com/kunchenguid/firstmate): `CLAUDE.md` → `AGENTS.md`). `PLAN.md` holds _what we're building now_. `DESIGN.md` holds _how it should look_ (Google design.md format — not feature specs). `CONTEXT.md` holds _what words mean_. ADRs hold _why we chose something non-obvious_.

| Doc             | Contains                                         | Must not contain                         |
| --------------- | ------------------------------------------------ | ---------------------------------------- |
| `CONTEXT.md`    | Canonical terms, `_Avoid_` aliases               | Plans, specs, code details               |
| `PLAN.md`       | Goal, plan, verification for this slice          | Glossary (link to `CONTEXT.md` instead)  |
| `DESIGN.md`     | Colors, typography, components, visual rationale | Feature plans, API specs (use `PLAN.md`) |
| `docs/adr/*.md` | Hard-to-reverse trade-offs                       | Routine or obvious choices               |

`WORKFLOW.md` stays in `ai-workflows/` only — it documents how we designed the workflow, not how an agent implements a task.

---

## Fork #1 — Template selection

**Status:** Decided

### Decision

Build a **new greenfield scaffold** in the [`tanstack-spa-scaffold`](https://github.com/tommulkins/tanstack-spa-scaffold) repo — TanStack SPA monorepo with Hono API and shared Zod schemas.

### Target layout

```
tanstack-spa-scaffold/
├── apps/
│   └── web/                 # Vite + React + TanStack Router / Query / Form
│       └── src/routes/      # File-based routes
├── packages/
│   ├── api/                 # Hono HTTP server (separate port)
│   └── schemas/             # Zod schemas — shared API + web contract
├── lefthook.yml
├── AGENTS.md                # Root agent instructions (agents.md format)
├── apps/web/AGENTS.md       # Package-specific (nearest wins)
├── packages/api/AGENTS.md
├── packages/schemas/AGENTS.md
├── CLAUDE.md                # Symlink → AGENTS.md
├── CONTEXT.md               # Glossary stub; filled at kickoff
├── PLAN.md                  # Feature stub; copy or branch per feature
├── DESIGN.md                # Visual identity (google-labs-code/design.md format)
├── docs/
│   ├── kickoff-protocol.md  # Agent-agnostic procedure (canonical)
│   └── adr/                 # Architectural decision records
├── .agents/skills/          # Canonical skill files (harness-agnostic)
└── package.json             # Workspace root
```

### Why this shape

- **SPA + separate backend** — no TanStack Start server functions in the base template.
- **`packages/schemas`** — natural TDD boundary (fork #3).
- **Agent legibility** — small surface area, predictable folders.
- **Greenfield** — every line intentional; no inherited opinions from example templates.

### Rejected for base template

| Option                               | Reason                                                      |
| ------------------------------------ | ----------------------------------------------------------- |
| Copy from workspace examples         | Reference only; wrong stack or outdated harness             |
| TanStack Start community monorepos   | Auth, DB, Biome, FSD, deploy configs — too much for day one |
| TanStack Start official (full-stack) | Blurs separate-backend story                                |

### Day-one scaffold must include

- [x] `typecheck`, `lint`, `test` scripts per package; root orchestration
- [x] Lefthook pre-commit: fast gates (`typecheck` + `lint`)
- [x] Vitest + Playwright smoke spec (page load + API round-trip)
- [x] `AGENTS.md` + `CLAUDE.md` symlink — done = all gates exit zero
- [x] `PLAN.md`, `DESIGN.md`, `CONTEXT.md`, `docs/kickoff-protocol.md`, `.agents/skills/grill-with-docs/`
- [x] `.env.example` for web + api URLs only
- [x] `pnpm-workspace.yaml` + root `packageManager` field
- [x] `AGENTS.md` note: dependency changes via `sfw pnpm`

### Closed from fork #1

- [x] **Pre-commit:** fast gates only (`typecheck` + `lint` + agent-policy via Lefthook). Full suite in CI and before merge — `pnpm gate`. See [ADR 0001](./docs/adr/0001-tiered-quality-gates.md).
- [x] **CI install:** `sfw pnpm install --frozen-lockfile` in GitHub Actions — fork #11

---

## Fork #2 — Kickoff → plan → implement

**Status:** Decided

### Decision

Every greenfield project or feature starts with a **five-phase kickoff** before implementation. No code until `PLAN.md` has a signed-off plan section and at least one failing test is named (actual test written in fork #3).

### Flow

```
Grill → Prepare plan → Make plan → Implement → Verify
  │          │              │            │          │
  ▼          ▼              ▼            ▼          ▼
PLAN.md  options      tasks +      code +     gates
(goal)     + rejects    recovery     tests      green
```

| Phase               | Human role                         | Agent role                                                           | Output                                                               |
| ------------------- | ---------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------- |
| **1. Grill**        | Answer hard questions; cut scope   | Adversarial clarification (`/grill-me` skill or equivalent)          | `PLAN.md` § Goal, § Non-goals, § Constraints                         |
| **2. Prepare plan** | Pick direction; reject bad options | Propose 1–2 approaches; list tradeoffs and anti-patterns             | `PLAN.md` § Architecture, § Rejected alternatives, § Anti-patterns   |
| **3. Make plan**    | Approve plan before code           | Break into ordered tasks; name verification; write recovery commands | `PLAN.md` § Plan, § Verification, § Recovery; optional GitHub issues |
| **4. Implement**    | Steer; don't micromanage diffs     | Red-green against plan; stay inside `AGENTS.md` rules                | Code + tests (fork #3+)                                              |
| **5. Verify**       | Approve merge/deploy               | Run all gates; produce evidence on failure                           | Green `typecheck`, `lint`, `test`; dossier if red (fork #12)         |

**Gate between 3 and 4:** Human explicitly approves the plan. Record approval as `approved: [x] yes` in `PLAN.md` § Plan after verbal "go" — **this is the canonical gate** (in-repo, versioned with the feature). GitHub issues are optional for team tracking; they do not replace the checkbox.

### Kickoff: `/grill-with-docs` (agent-agnostic)

Adopt Matt Pocock's [grill-with-docs](https://www.aihero.dev/grill-with-docs) for all engineering kickoffs — including greenfield scaffold and every feature. It extends plain grilling with **shared language** (`CONTEXT.md`) and **ADRs** inline as decisions crystallise.

Reference implementation: [mattpocock/skills](https://github.com/mattpocock/skills) (`grilling` + `domain-modeling` + `grill-with-docs`).

| Situation                             | Use                                            |
| ------------------------------------- | ---------------------------------------------- |
| Engineering / has or will have a repo | **grill-with-docs**                            |
| Non-code (eulogy, essay, no repo)     | grill-me only — out of scope for this workflow |

**Agent-agnostic rule:** the _procedure and outputs live in the repo_, not in a harness-specific slash command.

```
.agents/skills/grill-with-docs/SKILL.md   ← thin wrapper (discovery for agents)
docs/kickoff-protocol.md                  ← canonical steps (any agent can follow)
CONTEXT.md + PLAN.md + docs/adr/        ← committed outputs (any agent can read)
AGENTS.md                                 ← “Before code: follow docs/kickoff-protocol.md”
```

Harness symlinks (optional, same content everywhere):

```
.cursor/skills  → ../.agents/skills
.claude/skills  → ../.agents/skills
```

Cursor, Claude Code, Codex, or a firstmate crewmate all read the same files. Slash names (`/grill-with-docs`) differ per tool; the protocol does not.

#### Three layers

| Layer                                                                | Purpose                                                                            |
| -------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| **1. Protocol** (`docs/kickoff-protocol.md`)                         | Full procedure: interview loop, domain rules, doc updates, approval gate           |
| **2. Skills** (`.agents/skills/`)                                    | Short `SKILL.md` frontmatter so agents _discover_ kickoff; body points to protocol |
| **3. Artifacts** (`CONTEXT.md`, `PLAN.md`, `DESIGN.md`, `docs/adr/`) | Durable memory any agent loads after context compaction                            |

#### Session behavior (from grill-with-docs)

1. **Grilling loop** — one question at a time; recommend an answer; explore codebase when that answers the question ([grilling skill](https://github.com/mattpocock/skills/blob/main/skills/productivity/grilling/SKILL.md)).
2. **Challenge glossary** — flag terms that conflict with `CONTEXT.md`.
3. **Sharpen language** — replace fuzzy words with canonical terms; write to `CONTEXT.md` immediately (lazy-create file on first resolved term).
4. **Concrete scenarios** — edge cases to nail boundaries between concepts.
5. **Cross-reference code** — surface contradictions between plan and existing implementation.
6. **ADRs sparingly** — only when hard to reverse, surprising without context, and a real trade-off ([domain-modeling](https://github.com/mattpocock/skills/blob/main/skills/engineering/domain-modeling/SKILL.md)).
7. **Update `PLAN.md`** — goal, non-goals, plan, verification, recovery as the interview progresses.

Do not batch glossary updates. Do not put implementation details in `CONTEXT.md`.

#### Vendoring vs authoring

| Approach                                                                                                               | When                                                |
| ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| **Vendor** — copy/adapt `grilling`, `domain-modeling`, `grill-with-docs` from mattpocock/skills into `.agents/skills/` | Fastest; keep upstream attribution in skill headers |
| **Wrap** — single `docs/kickoff-protocol.md` that merges Pocock's rules + our `PLAN.md` sections                       | Maximum control; one file for humans to edit        |

Recommended: **wrap + thin skills** — protocol is the source of truth; skills are pointers with YAML `description` for discovery.

#### Install elsewhere (optional)

For personal machines already using [skills CLI](https://www.aihero.dev/skills):

```sh
npx skills add mattpocock/skills --skill=grill-with-docs -y -g
```

Project scaffold still ships `.agents/skills/` + `docs/kickoff-protocol.md` so the repo is self-contained without global installs.

### `PLAN.md` template (scaffold stub)

```markdown
# Plan

## Goal

<!-- one paragraph -->

## Non-goals

<!-- bullet list -->

## Constraints

<!-- stack, timeline, deploy, etc. -->

## Architecture

<!-- components, data flow, API boundaries -->

## Rejected alternatives

<!-- what we didn't choose and why -->

## Anti-patterns

<!-- things the agent must not reintroduce -->

## Plan

<!-- ordered tasks -->

**Approval gate:** set `approved: [x] yes` only after explicit human go-ahead.

approved: [ ] yes

## Verification

<!-- commands + named tests that must pass -->

## Acceptance scenarios

<!-- Gherkin-style — approve before implement. Min: 1 happy + 1 failure path per feature. -->

<!--
- [ ] **Happy:** Given …, when …, then …
- [ ] **Reject:** Given …, when …, then …
-->

## Recovery

<!-- exact commands to return to last green state -->
```

When context compacts, follow [`context-protocol.md`](./context-protocol.md) — re-read `PLAN.md` + `AGENTS.md` before continuing; do not rely on chat history. For UI work, also re-read `DESIGN.md`.

### Recovery commands (required in every plan)

At minimum, document:

```sh
git stash && git checkout main && sfw pnpm install && pnpm typecheck && pnpm lint && pnpm test
```

Adjust to project scripts. Use `sfw pnpm install` when restoring `node_modules`; script runs need no registry access. Purpose: zero-guess resume after a broken session.

### Orchestration model

| Scope                                     | Model                                                                                                                                            |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Single feature, one agent                 | Direct: grill → plan → implement in one session                                                                                                  |
| Parallel work (fixes + features + audits) | [firstmate](https://github.com/kunchenguid/firstmate)-style: one liaison, crewmates in worktrees; each crewmate gets brief + project `AGENTS.md` |
| Human review of plan/UI                   | [lavish-axi](https://github.com/kunchenguid/lavish-axi) — HTML artifacts for annotate-and-feedback                                               |

For the video demo: **single-agent direct model** unless showing parallel crew intentionally.

### Tooling interfaces (AXI)

Prefer [AXI](https://axi.md/)-style CLIs for agent-facing tools (GitHub, browser, DB): token-efficient TOON output, structured errors, contextual next-step hints. Canonical rules: [`docs/mcp-protocol.md`](./docs/mcp-protocol.md) (fork #10). CI wiring: fork #11.

### Clean delivery

Projects that ship through full validation use a [no-mistakes](https://github.com/kunchenguid/no-mistakes)-style pipeline (fork #11): evidence on failure, no "trust me it's green."

### Closed from fork #2

- [x] Write `docs/kickoff-protocol.md` in scaffold (canonical procedure)
- [x] Add `.agents/skills/grill-with-docs/SKILL.md`
- [x] Add `CONTEXT.md` stub and `docs/adr/.gitkeep`
- [x] **Naming:** `PLAN.md` for feature kickoff; `DESIGN.md` for visual identity ([google-labs-code/design.md](https://github.com/google-labs-code/design.md))
- [x] **Plan approval:** `PLAN.md` § Plan checkbox is canonical; GitHub issues optional for tracking only
- [x] **firstmate integration:** fork #7 — `docs/subagents-protocol.md`, ADR 0003, orchestrate skill

---

## Fork #3 — TDD and Zod

**Status:** Decided

### Decision

**Schema-first red-green-refactor** at `packages/schemas`, propagating outward to API, web helpers, UI, and e2e. Zod is the single source of truth for boundary types and runtime validation.

### Red-green order

```
schemas (fail) → API (fail) → web helpers (fail) → UI → e2e (fail) → green gates
```

| Layer   | Test location                         | Tooling                                       |
| ------- | ------------------------------------- | --------------------------------------------- |
| Schemas | `packages/schemas/src/<name>.test.ts` | Vitest; assert `parse` accepts/rejects        |
| API     | `packages/api/src/<name>.test.ts`     | Vitest + Hono `app.request()`; no live server |
| Web     | `apps/web/src/**/*.test.ts`           | Vitest; mock `fetch`; test pure helpers       |
| E2E     | `tests/e2e/<feature>.spec.ts`         | Playwright; one happy path per feature        |

### Kinney rule

1. `PLAN.md` § Verification names at least one failing test before Phase 4 (Implement).
2. Write the test; confirm it fails for the right reason.
3. Implement minimum code to pass; refactor with gates green.

Kickoff gate (fork #2) already requires named tests; fork #3 defines _how_ to write and order them.

### Zod conventions

- Schemas and `z.infer<typeof schema>` types live in `packages/schemas` — no duplicate TS interfaces at boundaries.
- Separate request/response schemas when shapes differ (`createNoteSchema` vs `noteSchema`).
- API parses inbound bodies and outbound JSON with shared schemas.
- Web parses API responses and validates TanStack Form input with the same request schemas.

### Agent files (scaffold)

| File                                 | Role                                     |
| ------------------------------------ | ---------------------------------------- |
| `docs/tdd-protocol.md`               | Canonical TDD procedure (agent-agnostic) |
| `.agents/skills/tdd/SKILL.md`        | Thin discovery wrapper → protocol        |
| `AGENTS.md` § TDD and Zod            | Contract summary + link to protocol      |
| `docs/kickoff-protocol.md` § Phase 4 | Cross-link to TDD protocol               |

Same pattern as kickoff: **protocol in repo, skills are pointers**.

### Reference slice

**Notes** feature in `tanstack-spa-scaffold` demonstrates the full vertical stack:

- `packages/schemas/src/note.ts` + tests
- `packages/api/src/app.ts` (testable Hono app) + `app.test.ts`
- `apps/web/src/lib/notes.ts` + tests
- `apps/web/src/routes/notes.tsx` (Query + Form)
- `tests/e2e/notes.spec.ts`

Replace with product features during kickoff; keep as template until then.

### Closed from fork #3

- [x] **Component-level Vitest / RTL:** not in base template — test pure helpers at the contract edge (`apps/web/src/lib/`)
- [x] **`@hono/zod-validator`:** not in base template — manual `schema.parse()` is sufficient
- [x] **Failure dossiers on red gates:** fork #4 (agent loop) + fork #12 (e2e conventions) — explicitly out of fork #3 scope

---

## Carry-forward resolutions (forks #1–#3)

All items below were open across forks #1–#3; closed before starting fork #4.

| Topic                   | Decision                                                                                                            |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Pre-commit vs full e2e  | Fast hook: `typecheck` + `lint`. Full `pnpm test` before merge. [ADR 0001](./docs/adr/0001-tiered-quality-gates.md) |
| CI `sfw pnpm install`   | Fork #11 ✓ — `.github/workflows/ci.yml`, `pnpm gate`, [ci-protocol](./docs/ci-protocol.md)                          |
| Plan approval           | `PLAN.md` checkbox canonical; GitHub issues optional                                                                |
| firstmate               | Fork #7 ✓ — subagents-protocol; register as `no-mistakes`; ADR 0003 same gates                                      |
| Component / RTL tests   | Not in base template                                                                                                |
| `@hono/zod-validator`   | Not in base template                                                                                                |
| Failure dossiers        | Fork #4 — `docs/debug-protocol.md`; fork #12 for e2e trace depth                                                    |
| Skill harness symlinks  | Run `./scripts/link-agent-skills.sh` → `.cursor/skills` + `.claude/skills` → `.agents/skills`                       |
| `ai-workflows` git repo | Optional meta repo later; `WORKFLOW.md` lives in scaffold for now                                                   |

---

## Fork #4 — Find bugs, deal with them

**Status:** Decided

### Decision

When gates fail, agents run a **structured self-healing loop** with evidence — never claim done on red, never weaken tests to pass.

```
run gate → dossier → hypothesize → fix → re-run (max 3 per root error) → escalate
```

### Self-healing loop

| Step       | Agent action                                                         |
| ---------- | -------------------------------------------------------------------- |
| 1. Run     | Execute failing gate from repo root (or named package)               |
| 2. Capture | Full stdout/stderr; e2e spec name + trace path when present          |
| 3. Dossier | Write `reports/dossiers/<date>-<slug>.md` from template (gitignored) |
| 4. Fix     | Minimum change per `PLAN.md` + `AGENTS.md`                           |
| 5. Re-run  | Same gate first, then full `typecheck && lint && test`               |

**Retry budget:** 3 attempts per root error. New error after a fix → new thread. Same error after 3 tries → escalate.

### Escalate to human when

- Plan / product ambiguity or scope change needed
- Architecture fork (ADR-level)
- Environment / infra (`sfw`, Playwright browser, ports, permissions)
- Flake (passes on immediate re-run without code change)
- Agent cannot distinguish test bug vs product bug

### Failure dossiers

Structured markdown per [`docs/dossier-template.md`](./docs/dossier-template.md). Fields: gate, exit code, raw output, hypothesis, fix attempts, status (`open` | `resolved` | `escalated`). Session evidence — not committed unless human asks.

Playwright: cite trace zip from `test-results/`; fork #12 adds deeper trace-reading conventions.

### Agent files (scaffold)

| File                                 | Role                               |
| ------------------------------------ | ---------------------------------- |
| `docs/debug-protocol.md`             | Canonical self-heal procedure      |
| `docs/dossier-template.md`           | Copy-paste dossier shape           |
| `.agents/skills/verify/SKILL.md`     | Discovery wrapper → debug protocol |
| `AGENTS.md` § When gates fail        | Contract summary                   |
| `docs/kickoff-protocol.md` § Phase 5 | Cross-link                         |

### Open from fork #4

- [ ] Playwright trace reading checklist — fork #12 (`docs/e2e-protocol.md`)
- [x] no-mistakes / CI evidence — fork #11: Playwright artifacts on failure; no-mistakes optional local ([ci-protocol](./docs/ci-protocol.md))

---

## Fork #5 — Linters, formatters, static analysis

**Status:** Decided

### Decision

**Two-layer static checks:** ESLint + Prettier (file lint, fast tier) and [fallow](https://github.com/fallow-rs/fallow) (codebase analyze, full tier).

| Command               | Tool                         | Tier                | Gates           |
| --------------------- | ---------------------------- | ------------------- | --------------- |
| `pnpm lint`           | Prettier + ESLint            | Fast (pre-commit)   | yes             |
| `pnpm analyze`        | `fallow audit`               | Full (before merge) | new issues only |
| `pnpm analyze:report` | `fallow dead-code`, `health` | Optional triage     | no              |

### fallow scope (full tier)

- **Complexity** — cyclomatic/cognitive thresholds in `.fallowrc.json` (15 / 12 defaults)
- **Dead code** — unused exports, files, dependencies (introduced changes gate via audit)
- **Duplication** — clone families touching changed files
- **Not in fork #5:** `fallow security` → fork #13

### Gate policy

- **`fallow audit`** with `audit.gate: "new-only"` — fail only on findings **introduced** vs merge-base; inherited debt is context
- **Not in Lefthook** — keeps pre-commit fast (ADR 0001 + ADR 0002)
- **Agent done** — `pnpm analyze` added to full gate alongside typecheck, lint, test

### Agent files (scaffold)

| File                                    | Purpose                                        |
| --------------------------------------- | ---------------------------------------------- |
| `.fallowrc.json`                        | Thresholds, audit gate, e2e script entry point |
| `docs/static-analysis-protocol.md`      | Canonical procedure                            |
| `docs/adr/0002-static-analysis-tier.md` | Tier placement                                 |
| `.agents/skills/analyze/SKILL.md`       | Discovery wrapper                              |
| `AGENTS.md`                             | Done definition + PR instructions              |

Fallow ships MCP/LSP/skills in `node_modules`; we use the **protocol + root skill pointer** pattern (same as kickoff/TDD).

### Open from fork #5

- [x] fallow in CI — fork #11: `pnpm analyze` in `pnpm gate`, merge-base via `fetch-depth: 0`
- [ ] `fallow security` integration — fork #13

---

## Fork #6 — Skills inventory

**Status:** Decided

### Decision

**`.agents/skills/` is the single canonical skill tree.** Each skill is a thin YAML-frontmatter wrapper pointing at a `docs/*-protocol.md` file. Harness-specific dirs symlink here — no duplicated content.

### Inventory (lifecycle order)

| Skill           | Protocol                           | Status |
| --------------- | ---------------------------------- | ------ |
| grill-with-docs | `docs/kickoff-protocol.md`         | Active |
| tdd             | `docs/tdd-protocol.md`             | Active |
| verify          | `docs/debug-protocol.md`           | Active |
| analyze         | `docs/static-analysis-protocol.md` | Active |
| security-review | `docs/security-protocol.md`        | Active |

Meta doc: `docs/skills-protocol.md`. Index: `.agents/skills/README.md`.

### Harness wiring

```sh
./scripts/link-agent-skills.sh   # .cursor/skills + .claude/skills → .agents/skills
```

Optional — repo works without symlinks; agents read `.agents/skills/` directly.

### Rules

- **`disable-model-invocation: true`** on all workflow skills (explicit human/agent invoke)
- Fix skill → protocol relative links as `../../../docs/...` from skill subfolders
- Do not add skills without a protocol file first
- fallow's bundled `node_modules` skill is separate; project workflow skills stay in `.agents/skills/`

### Agent files (scaffold)

| File                              | Purpose                                   |
| --------------------------------- | ----------------------------------------- |
| `docs/skills-protocol.md`         | Inventory, lifecycle, add-skill procedure |
| `.agents/skills/README.md`        | Quick index                               |
| `.agents/skills/security-review/` | Pre-PR security review skill              |
| `AGENTS.md` § Skills              | Summary table                             |

### Open from fork #6

- [ ] Harness-specific slash names doc — optional appendix in skills-protocol
- [ ] Codex / Gemini skill path notes — add when adopted

---

## Fork #7 — Sub-agents and quality gates

**Status:** Decided

### Decision

**Default single-agent; delegate only with a brief and isolated scope.** Sub-agents and firstmate crewmates follow the same `AGENTS.md` and **full gate** as direct work ([ADR 0003](./docs/adr/0003-subagent-gates.md)).

### When to delegate

| Yes                                   | No                                 |
| ------------------------------------- | ---------------------------------- |
| Parallel independent tasks            | Kickoff / grill                    |
| Read-only explore or review subagents | Same-file overlap                  |
| firstmate ship/scout in worktrees     | Small single-package edits         |
| Investigation while parent plans      | Continuous mid-task human steering |

### Orchestration

| Pattern               | Role                                                                                            |
| --------------------- | ----------------------------------------------------------------------------------------------- |
| **Direct session**    | Default — one agent, full lifecycle                                                             |
| **In-harness parent** | Cursor Task / similar — parent is liaison; typed subagents                                      |
| **firstmate**         | External liaison + tmux crewmates + treehouse worktrees; register scaffold as **`no-mistakes`** |
| **GitButler**         | Optional virtual branches — same crewmate contract                                              |

Video demo: **single-agent** unless intentionally showing parallel crew.

### Crewmate contract

1. Read `AGENTS.md` (+ nested package files)
2. Scoped brief — [`docs/crewmate-brief-template.md`](./docs/crewmate-brief-template.md)
3. Full gate before done: `typecheck` + `lint` + `test` + `analyze`
4. Red gates → [`docs/debug-protocol.md`](./docs/debug-protocol.md)
5. Liaison runs verify on integrated result before merge

### Agent files (scaffold)

| File                                  | Purpose                        |
| ------------------------------------- | ------------------------------ |
| `docs/subagents-protocol.md`          | Canonical delegation procedure |
| `docs/crewmate-brief-template.md`     | Per-delegate brief             |
| `docs/adr/0003-subagent-gates.md`     | Same gates for all agents      |
| `.agents/skills/orchestrate/SKILL.md` | Discovery wrapper → protocol   |
| `AGENTS.md` § Orchestration           | Summary for all agents         |

### Open from fork #7

- [ ] firstmate `data/projects.md` one-liner in firstmate upstream docs — optional cross-link
- [ ] GitButler + firstmate combined demo — video only

---

## Fork #8 — Optimizations

**Status:** Decided

### Decision

**Repo files beat chat for memory; minimal code is always on; ponytail is optional.**

Token savings come from re-reading the right files after compaction, targeted exploration, and dossiers — not from skipping gates or tests.

### Re-read ladder

Formalized in [`docs/context-protocol.md`](./docs/context-protocol.md):

- Session start → `AGENTS.md`
- Feature work → `PLAN.md`, `CONTEXT.md`
- UI → + `DESIGN.md`
- Active phase → one protocol only (kickoff / tdd / debug / static / subagents)

Compaction = hard reset; re-run ladder; confirm plan approval before more feature code.

### Minimal implementation

Already in `AGENTS.md`: smallest correct diff, schema-first TDD, full gate before done. This is the baseline — no plugin required.

### ponytail (optional)

[ponytail](https://github.com/DietrichGebert/ponytail) — optional harness plugin for YAGNI / stdlib-first during **implement**. Not vendored; not a project dependency. Never cuts validation, security, accessibility, or tests. Install per harness upstream docs; `/ponytail-review` is advisory — verify still required.

### Token habits

- Targeted reads; dossiers for failures; analyze JSON for pass/fail
- TOON/AXI CLI output → fork #10

### Agent files (scaffold)

| File                       | Purpose                                       |
| -------------------------- | --------------------------------------------- |
| `docs/context-protocol.md` | Compaction, re-read ladder, ponytail adoption |
| `AGENTS.md`                | Links context protocol on compaction          |

### Open from fork #8

- [ ] Pin ponytail version in video demo notes — optional
- [ ] Benchmark ponytail on Notes slice — optional experiment

---

## Fork #9 — Hooks (prevent agent false-positives)

**Status:** Decided

### Decision

**Mechanical ban on TypeScript/ESLint suppressions** — agents cannot `@ts-expect-error` or `eslint-disable` their way to green.

### Enforcement

| Layer      | Mechanism                                                                |
| ---------- | ------------------------------------------------------------------------ |
| Cursor IDE | `.cursor/hooks.json` → `preToolUse` denies suppressions in writes        |
| Pre-commit | Lefthook `agent-policy` → `scripts/check-agent-suppressions.sh --staged` |
| ESLint     | `@typescript-eslint/no-explicit-any` (existing)                          |
| Allowlist  | `routeTree.gen.ts` only                                                  |

### Agent files (scaffold)

| File                                     | Purpose                          |
| ---------------------------------------- | -------------------------------- |
| `docs/hooks-protocol.md`                 | Banned patterns, tiers, commands |
| `docs/adr/0004-no-agent-suppressions.md` | Decision record                  |
| `scripts/check-agent-suppressions.sh`    | Grep checker                     |
| `.cursor/hooks/`                         | Cursor project hooks             |

### Open from fork #9

- [ ] `beforeShellExecution` deny `git commit --no-verify` — optional hardening
- [x] `.env` / secret scan — `pnpm security:check` before PR (fork #13); not in pre-commit

---

## Fork #10 — MCPs

**Status:** Decided

### Decision

**Shell gates canonical; MCP optional.** Document when to use MCP vs AXI CLIs vs `pnpm` scripts. No MCP required for done; no MCP servers vendored into the monorepo.

### Layer model

| Layer    | Mechanism                                                                   |
| -------- | --------------------------------------------------------------------------- |
| Done     | `typecheck` + `lint` + `test` + `analyze`                                   |
| Optional | context7 (docs), browser MCP (e2e debug), fallow MCP (triage)               |
| Prefer   | AXI CLIs (gh-axi, chrome-devtools-axi) over schema-heavy MCP when available |
| CI       | Shell only — fork #11                                                       |

### TOON / AXI

Agent-facing tools should use TOON or compact JSON, minimal default fields, structured errors, and next-step hints ([axi.md](https://axi.md/)). fallow gate JSON stays as-is for automation.

### Agent files (scaffold)

| File                                         | Purpose                      |
| -------------------------------------------- | ---------------------------- |
| `docs/mcp-protocol.md`                       | When to use MCP, AXI, shell  |
| `docs/mcp.example.json`                      | Optional Cursor MCP template |
| `docs/adr/0005-mcp-optional-augmentation.md` | Decision record              |
| `AGENTS.md` § MCP                            | Summary pointer              |

### Open from fork #10

- [ ] Wire gh-axi in fork #11 CI evidence
- [ ] Custom verification MCP (deploy probe) — product-specific, not scaffold base

---

## Fork #11 — CI/CD

**Status:** Decided

### Decision

**GitHub Actions runs `pnpm gate` on every PR and push to `main`.** Install via `sfw pnpm install --frozen-lockfile`. Playwright artifacts uploaded on failure. Deploy preview deferred to products with a host.

### CI job (`quality`)

| Step     | Command / action                                        |
| -------- | ------------------------------------------------------- |
| Install  | `sfw pnpm install --frozen-lockfile`                    |
| Browser  | `playwright install chromium --with-deps`               |
| Gate     | `pnpm gate`                                             |
| Evidence | Upload `playwright-report/`, `test-results/` on failure |

### `pnpm gate`

```sh
pnpm typecheck && pnpm lint && pnpm test:agent-policy && pnpm test:unit && pnpm test && pnpm analyze
```

Local parity before PR. no-mistakes optional for push-time gate — not a repo dependency.

### Agent files (scaffold)

| File                                 | Purpose                     |
| ------------------------------------ | --------------------------- |
| `.github/workflows/ci.yml`           | GitHub Actions workflow     |
| `docs/ci-protocol.md`                | Canonical CI procedure      |
| `docs/adr/0006-ci-github-actions.md` | Decision record             |
| `package.json` `ci` script           | Local / Actions entry point |

### Open from fork #11

- [ ] Branch protection on `main` — enable in GitHub Settings (human)
- [ ] Deploy preview job — when product has host
- [ ] Security CI job — optional product extension (local gate in fork #13 ✓)
- [ ] gh-axi in failure triage docs — optional

---

## Fork #12 — E2E, unit tests, and acceptance rigor

**Status:** Decided

### Decision

**Human-approved scenarios in `PLAN.md` before code; executable proof at every layer.** Minimum **1 happy + 1 reject** e2e per user-visible feature. `PLAN.md` is the scenario source of truth — plain Playwright, no playwright-bdd in base scaffold.

### Scenario gate

§ **Acceptance scenarios** required at kickoff Phase 3 — approved with § Plan checkbox. § Verification links each scenario to a named test.

### Mandatory mix

| Layer       | Minimum                          |
| ----------- | -------------------------------- |
| Schemas     | valid + invalid                  |
| API         | happy + 4xx                      |
| Web helpers | reject before fetch              |
| E2E         | 1 happy + 1 user-visible failure |

### Agent files (scaffold)

| File                                 | Purpose                   |
| ------------------------------------ | ------------------------- |
| `docs/e2e-protocol.md`               | Acceptance + e2e rules    |
| `docs/examples/notes-acceptance.md`  | Filled Notes example      |
| `.agents/skills/acceptance/SKILL.md` | Discovery wrapper         |
| `tests/e2e/notes.spec.ts`            | Happy + whitespace reject |

### Closed from fork #12

- [x] playwright-bdd vs plain Playwright → **plain Playwright + PLAN.md**
- [x] `.feature` vs PLAN.md → **PLAN.md canonical**
- [x] Trace checklist → `docs/e2e-protocol.md`

---

## Fork #13 — Security review

**Status:** ✓ Decided — 2026-06-21

**Goal:** Mandatory security pass before merge — supply chain, code diff review, and API/web baseline checks so agents cannot skip security the way they skip rigorous tests.

**Pipeline position:** after `pnpm gate`; **before PR/merge**. Not in fast pre-commit (ADR 0001). Not in CI baseline (ADR 0006) — local agent/human gate (ADR 0007).

### Decisions

#### 1. When security review runs

| Trigger                                   | Required                                |
| ----------------------------------------- | --------------------------------------- |
| Feature complete (before merge / PR)      | yes — slow gate                         |
| Any dependency add/change                 | yes — re-run supply-chain + diff review |
| Architecture / auth / PII boundary change | yes — human sign-off on findings        |
| Docs-only change                          | skip unless touching security protocol  |

Runs after `pnpm gate` green — security is an additional gate, not a substitute.

#### 2. Layers

| Layer                 | Tool / practice                                          | Notes                                    |
| --------------------- | -------------------------------------------------------- | ---------------------------------------- |
| **Supply chain**      | `sfw pnpm` (decided)                                     | Install/add/update only; flag new deps   |
| **Secrets**           | `pnpm security:check` / `scripts/check-secrets.sh`       | Staged grep; block `.env` commits        |
| **Diff review**       | Security-review skill + optional readonly subagent       | Checklist in `docs/security-protocol.md` |
| **Static (optional)** | ESLint + fallow                                          | No Semgrep in base scaffold              |
| **API baseline**      | Zod on all inputs; no stack traces in 4xx; CORS explicit | Align with existing scaffold             |

#### 3. Kickoff integration

§ **Security constraints** in `PLAN.md` — filled at grill when auth, PII, payments, or trust boundaries apply.

#### 4. Findings and escalation

- **Security dossier** — `docs/security-dossier-template.md` → `reports/security/` (gitignored)
- **Critical / high:** stop — human must acknowledge before merge
- **Medium / low:** fix or document in dossier
- Same retry budget as debug protocol; no silent dismiss

#### 5. Deliverables ✓

| Artifact                                           | Status |
| -------------------------------------------------- | ------ |
| `docs/security-protocol.md`                        | ✓      |
| `docs/security-dossier-template.md`                | ✓      |
| `docs/adr/0007-security-review-tier.md`            | ✓      |
| `scripts/check-secrets.sh` + `pnpm security:check` | ✓      |
| `.agents/skills/security-review/SKILL.md`          | ✓      |
| `PLAN.md` § Security constraints                   | ✓      |
| `AGENTS.md`                                        | ✓      |
| ADR 0001 security tier                             | ✓      |

#### 6. Resolved open items

- Harness-native security subagent vs protocol-only → **protocol + optional readonly subagent**
- Additional SAST → **defer** (ESLint + checklist + secrets grep)
- Findings format → **markdown security dossier**

#### 7. Explicitly not in fork #13 base scope

- Full penetration test / bug bounty
- Auth implementation (product feature)
- SOC2/compliance checklists
- Semgrep / CI security job

---

## Delivery pipeline (fork order vs run order)

Fork **numbers** are discussion order; **run order** for a feature slice:

```
kickoff (#2) → implement (#3) → verify (#4) → lint (#5) → security (#13) → CI (#11) → prod
                                                      ↘ acceptance depth (#12) ↗
```

Hooks (#9), MCPs (#10), sub-agents (#7) wire in as adopted.

---

## Cross-cutting notes

### Token efficiency

Repo files (`AGENTS.md`, `PLAN.md`, protocols) are durable memory; chat is not. Re-read ladder: [`docs/context-protocol.md`](./docs/context-protocol.md). Optional implement-phase plugin: [ponytail](https://github.com/DietrichGebert/ponytail). MCP / AXI: [`docs/mcp-protocol.md`](./docs/mcp-protocol.md).

### Git workflow

- **GitButler** for virtual branches and parallel agent work — [docs](https://docs.gitbutler.com/guide)

### Supply-chain workflow

- **[Socket Firewall (`sfw`)](https://socket.dev)** — package manager commands that hit the registry run through `sfw` (local shell aliases; explicit in agent docs and CI)
- Keep `sfw` ≥ 0.15.5 (wrapper via `npm install -g sfw` auto-updates the binary)

### Reference material

Ideas only — **do not copy code or config from these into `scaffold/`:**

| Source                                                                                    | Borrow                                                                           |
| ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Kinney — [Self-Testing AI Agents](https://stevekinney.com/courses/self-testing-ai-agents) | Agent self-verification loop, Playwright armor, dossiers, CI capstone            |
| shelf-life (workspace example)                                                            | `AGENTS.md` contract shape, done definition, locator rules — not SvelteKit stack |
| basic-template (workspace example)                                                        | ESLint strictness ideas — outdated hooks; scaffold replaces entirely             |
| firstmate                                                                                 | `CLAUDE.md` → `AGENTS.md` symlink; orchestration for parallel crew               |
| axi.md                                                                                    | Agent-ergonomic CLI design; TOON output                                          |
| no-mistakes                                                                               | Validated delivery pipeline with evidence                                        |
| lavish-axi                                                                                | Human review surfaces for plans and UI                                           |

---

## Changelog

| Date       | Fork          | Summary                                                                                                    |
| ---------- | ------------- | ---------------------------------------------------------------------------------------------------------- |
| 2026-06-21 | #1            | Greenfield scaffold at `ai-workflows/scaffold/`; TanStack + Hono + Zod; examples reference-only            |
| 2026-06-21 | #1 patch      | Clarified repo roles; examples not source material                                                         |
| 2026-06-21 | #2            | Five-phase kickoff; DESIGN.md template; AGENTS.md canonical + CLAUDE.md symlink; grill-me skill            |
| 2026-06-21 | #2            | grill-with-docs; CONTEXT.md + ADRs; `.agents/skills/` + `docs/kickoff-protocol.md` for harness agnosticism |
| 2026-06-21 | scaffold      | Initial greenfield repo pushed — `tommulkins/tanstack-spa-scaffold`                                        |
| 2026-06-21 | #3            | Schema-first TDD; `docs/tdd-protocol.md` + `/tdd` skill; Notes reference slice in scaffold                 |
| 2026-06-21 | #2 patch      | Split docs: `PLAN.md` for feature kickoff; `DESIGN.md` for visual identity (google-labs-code/design.md)    |
| 2026-06-21 | #4            | Self-heal loop on red gates; dossiers; verify skill; escalate rules                                        |
| 2026-06-21 | carry-forward | Closed open items from forks #1–#3; ADR 0001 tiered gates; skill symlinks; plan approval = PLAN.md         |
| 2026-06-21 | scaffold      | Align `AGENTS.md` with agents.md — dev/test/PR sections; nested package AGENTS.md                          |
| 2026-06-21 | #5            | fallow static analysis; ADR 0002; `pnpm analyze` in full gate; analyze skill                               |
| 2026-06-21 | #6            | Skills inventory; `docs/skills-protocol.md`; security-review stub; fix skill protocol links                |
| 2026-06-21 | #12           | E2e protocol; happy+reject e2e; acceptance skill; Notes whitespace reject spec                             |
| 2026-06-21 | #11           | GitHub Actions CI; `pnpm gate`; ADR 0006; sfw frozen install; Playwright artifacts                         |
| 2026-06-21 | #9            | Agent suppression hooks; ADR 0004; lefthook agent-policy; Cursor preToolUse block                          |
| 2026-06-21 | #8            | Context protocol; re-read ladder; optional ponytail; compaction recovery                                   |
| 2026-06-21 | #7            | Sub-agents protocol; ADR 0003 same gates; orchestrate skill; firstmate no-mistakes registration            |
| 2026-06-21 | #13           | Security protocol; ADR 0007; secrets check; security dossier; security-review skill                        |
