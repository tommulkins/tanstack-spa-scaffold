# AI Workflow — Decision Log

Living document for a rigorous, agent-assisted workflow: **new project or feature → all gates green → production**.

Each forked discussion adds decisions here. Prefer succinct entries; link out for detail.

> **New session?** Read [`SESSION-HANDOFF.md`](./SESSION-HANDOFF.md) first — current state, repos, and **Fork #4** pickup prompt.

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
4. Pass static analysis, review, e2e, and CI before prod

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

- [x] **Pre-commit:** fast gates only (`typecheck` + `lint` via Lefthook). Full suite including e2e before merge — agent runs `pnpm test`; CI enforces in fork #11. See [ADR 0001](./docs/adr/0001-tiered-quality-gates.md).
- [x] **CI install:** fork #11 will use `sfw pnpm install --frozen-lockfile` + Socket pin — decided in principle; implementation deferred to fork #11.

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

## Recovery

<!-- exact commands to return to last green state -->
```

When context compacts, agent re-reads `PLAN.md` + `AGENTS.md` before continuing — do not rely on chat history. For UI work, also re-read `DESIGN.md`.

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

Prefer [AXI](https://axi.md/)-style CLIs for agent-facing tools (GitHub, browser, DB): token-efficient TOON output, structured errors, contextual next-step hints. Relevant when wiring MCPs/CLIs in forks #10–#11 — not required at kickoff.

### Clean delivery

Projects that ship through full validation use a [no-mistakes](https://github.com/kunchenguid/no-mistakes)-style pipeline (fork #11): evidence on failure, no "trust me it's green."

### Closed from fork #2

- [x] Write `docs/kickoff-protocol.md` in scaffold (canonical procedure)
- [x] Add `.agents/skills/grill-with-docs/SKILL.md`
- [x] Add `CONTEXT.md` stub and `docs/adr/.gitkeep`
- [x] **Naming:** `PLAN.md` for feature kickoff; `DESIGN.md` for visual identity ([google-labs-code/design.md](https://github.com/google-labs-code/design.md))
- [x] **Plan approval:** `PLAN.md` § Plan checkbox is canonical; GitHub issues optional for tracking only
- [x] **firstmate integration:** fork #7 (sub-agents) — not in scope until then

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
| CI `sfw pnpm install`   | Fork #11 — `sfw pnpm install --frozen-lockfile`                                                                     |
| Plan approval           | `PLAN.md` checkbox canonical; GitHub issues optional                                                                |
| firstmate               | Fork #7                                                                                                             |
| Component / RTL tests   | Not in base template                                                                                                |
| `@hono/zod-validator`   | Not in base template                                                                                                |
| Failure dossiers        | Fork #4 + #12                                                                                                       |
| Skill harness symlinks  | Run `./scripts/link-agent-skills.sh` → `.cursor/skills` + `.claude/skills` → `.agents/skills`                       |
| `ai-workflows` git repo | Optional meta repo later; `WORKFLOW.md` lives in scaffold for now                                                   |

---

## Fork #4 — Find bugs, deal with them

**Status:** Not started

### Decisions

_To be filled in this fork._

---

## Fork #5 — Linters, formatters, static analysis

**Status:** Not started

Tooling candidate: [fallow](https://github.com/fallow-rs/fallow)

### Decisions

_To be filled in this fork._

---

## Fork #6 — Skills inventory

**Status:** Not started

Define project skills beyond `/grill-me` (e.g. project-kickoff, verify, review). Overlaps with agent files — see [Agent instruction files](#agent-instruction-files-decided).

### Decisions

_To be filled in this fork._

---

## Fork #7 — Sub-agents and quality gates

**Status:** Not started

When to delegate; keep sub-agents aligned with project gates; avoid anti-patterns. firstmate orchestration fits here.

### Decisions

_To be filled in this fork._

---

## Fork #8 — Optimizations

**Status:** Not started

Tooling candidate: [ponytail](https://github.com/DietrichGebert/ponytail)

### Decisions

_To be filled in this fork._

---

## Fork #9 — Hooks (prevent agent false-positives)

**Status:** Not started

### Decisions

_To be filled in this fork._

---

## Fork #10 — MCPs

**Status:** Not started

### Decisions

_To be filled in this fork._

---

## Fork #11 — CI/CD

**Status:** Not started

GitHub Actions; deploy preview probes; no-mistakes pipeline.

### Decisions

_To be filled in this fork._

---

## Fork #12 — E2E and unit tests

**Status:** Not started

Playwright + Vitest conventions, dossiers, failure evidence for agents.

### Decisions

_To be filled in this fork._

---

## Cross-cutting notes

### Token efficiency

- **TOON** for structured agent I/O where applicable ([AXI principle #1](https://axi.md/))

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
| 2026-06-21 | carry-forward | Closed open items from forks #1–#3; ADR 0001 tiered gates; skill symlinks; plan approval = PLAN.md         |
