# Session Handoff — AI Workflow

Use this file to start a **new chat** and continue the workflow design without prior context.

**Primary decision log:** [`WORKFLOW.md`](./WORKFLOW.md) — update it as each fork is decided.

---

## What we're building

A rigorous, agent-assisted workflow for senior engineers, demonstrated in video:

**New project or feature → all gates green → production**

The agent runs the feedback loop; the human steers architecture and approves merges.

---

## Repositories

| Repo                          | Path / URL                                          | Role                                                       |
| ----------------------------- | --------------------------------------------------- | ---------------------------------------------------------- |
| **Decision log**              | `Projects/Mercor/ai-workflows/`                     | `WORKFLOW.md`, this handoff — **not** copied into projects |
| **Scaffold (deliverable)**    | https://github.com/tommulkins/tanstack-spa-scaffold | Greenfield template — **built and pushed**                 |
| **Local scaffold**            | `Projects/Mercor/tanstack-spa-scaffold/`            | Clone of above                                             |
| **Examples (reference only)** | `shelf-life`, `basic-template` in workspace         | Ideas only — **do not copy code**                          |

`ai-workflows/` is **not** a git repo yet. Only `tanstack-spa-scaffold` is on GitHub.

---

## Completed (Forks #1–#5 + scaffold)

### Stack (locked in)

- React SPA — TanStack Router, Query, Form
- Hono API — separate process in monorepo
- Zod — shared contracts in `packages/schemas`
- pnpm workspaces
- Vitest (unit) + Playwright (e2e)
- Lefthook pre-commit — `typecheck` + `lint` (not full e2e locally)
- **sfw** — install/add/update via Socket Firewall; scripts use plain `pnpm`

### Agent files (no duplication)

| File                              | Purpose                                                                                       |
| --------------------------------- | --------------------------------------------------------------------------------------------- |
| `AGENTS.md`                       | Canonical agent instructions ([agents.md](https://agents.md)); nested in each package         |
| `CLAUDE.md`                       | Symlink → `AGENTS.md`                                                                         |
| `PLAN.md`                         | Current feature plan                                                                          |
| `DESIGN.md`                       | Visual identity — [google-labs-code/design.md](https://github.com/google-labs-code/design.md) |
| `CONTEXT.md`                      | Glossary only (grill-with-docs)                                                               |
| `docs/adr/`                       | Surprising architectural trade-offs                                                           |
| `docs/kickoff-protocol.md`        | Agent-agnostic kickoff procedure                                                              |
| `.agents/skills/grill-with-docs/` | Thin skill → protocol                                                                         |

### Scaffold verification (must exit zero)

```sh
cd tanstack-spa-scaffold
pnpm typecheck
pnpm lint
pnpm test:unit
pnpm test
```

Setup on fresh clone:

```sh
cp .env.example .env
sfw pnpm install
pnpm exec playwright install chromium
```

### Scaffold implementation notes

- **E2E** does not use Playwright `webServer` (unreliable in pnpm subprocess). Uses `scripts/run-e2e.mjs` → starts API on **3101**, web preview on **4174**, then runs Playwright.
- **Dev** uses API **3001**, web **5173** (proxy `/api` → API).
- Example schema: `packages/schemas/src/health.ts` + co-located Vitest test.
- Smoke e2e: `tests/e2e/smoke.spec.ts` — home page + API health via proxy.

### Fork #3 (TDD + Zod)

- `docs/tdd-protocol.md` — canonical red-green procedure at the contract boundary
- `.agents/skills/tdd/SKILL.md` — discovery wrapper
- `AGENTS.md` § TDD and Zod — Kinney rule, layer order, Zod conventions
- **Notes reference slice:** schemas → `packages/api/src/app.ts` → `apps/web/src/lib/notes.ts` → `/notes` route → `tests/e2e/notes.spec.ts`

### Fork #4 (Find bugs)

- `docs/debug-protocol.md` — self-heal loop, retry budget, escalate rules
- `docs/dossier-template.md` — failure evidence shape
- `.agents/skills/verify/SKILL.md` — run gates + heal on red
- `reports/dossiers/` — gitignored session evidence

### Fork #5 (Static analysis)

- [fallow](https://github.com/fallow-rs/fallow) — `pnpm analyze` (audit, new-issues gate), `pnpm analyze:report` (informational)
- `docs/static-analysis-protocol.md`, ADR 0002, `.fallowrc.json`, `.agents/skills/analyze/`
- Full gate: `typecheck` + `lint` + `test` + **`analyze`**

---

### Doc naming (fork #2 patch)

- **`PLAN.md`** — feature kickoff (goal, plan, verification, recovery)
- **`DESIGN.md`** — visual identity only ([google-labs-code/design.md](https://github.com/google-labs-code/design.md)); default dark-slate stub ships in scaffold

---

## Resolved (forks #1–#5)

| Topic               | Decision                                                                        |
| ------------------- | ------------------------------------------------------------------------------- |
| Pre-commit vs e2e   | Fast: `typecheck` + `lint` in Lefthook. Full `pnpm test` before merge. ADR 0001 |
| CI `sfw pnpm`       | Fork #11 — `sfw pnpm install --frozen-lockfile`                                 |
| Plan approval       | `PLAN.md` § Plan checkbox canonical; GitHub issues optional                     |
| firstmate           | Fork #7                                                                         |
| Skill symlinks      | Run `./scripts/link-agent-skills.sh` after clone                                |
| `ai-workflows` repo | Optional later; `WORKFLOW.md` in scaffold for now                               |

No open carry-forward items — proceed to **Fork #6**.

---

## Remaining forks (in order)

Discuss **one fork per session**. After each, patch `WORKFLOW.md` § Decisions + Changelog.

### Fork #3 — TDD and Zod ✓

**Decided:** Schema-first red-green at `packages/schemas` → API → web → e2e. Kinney rule; Zod single source of truth. Delivered: `docs/tdd-protocol.md`, `.agents/skills/tdd/`, `AGENTS.md` § TDD, Notes reference slice.

---

### Fork #4 — Find bugs, deal with them ✓

**Decided:** Self-healing loop on red gates — dossier → hypothesize → fix → re-run (max 3 attempts) → escalate. Delivered: `docs/debug-protocol.md`, `docs/dossier-template.md`, `.agents/skills/verify/`, `AGENTS.md` § When gates fail.

---

### Fork #5 — Linters, formatters, static analysis ✓

**Decided:** ESLint/Prettier (fast) + fallow (full). `pnpm analyze` gates new complexity/dead-code/dupes. Delivered: ADR 0002, static-analysis protocol, analyze skill.

---

### Fork #6 — Skills inventory ← **START HERE**

**Goal:** Consolidate project skills and optional harness wiring.

**Suggested topics:**

- Inventory: grill-with-docs, tdd, verify, analyze, security-review (#13 planned)
- Optional `.cursor/skills` / `.claude/skills` symlinks (`./scripts/link-agent-skills.sh`)
- Defer duplicate content — skills point to protocols

**Prompt for new session:**

> Read `WORKFLOW.md` and `SESSION-HANDOFF.md`. We're on **Fork #6 — Skills inventory**. Propose decisions, keep it succinct, update WORKFLOW.md when we agree.

---

### Fork #7 — Sub-agents and quality gates

- [firstmate](https://github.com/kunchenguid/firstmate) orchestration
- When to delegate; keep crewmates on same gates

### Fork #8 — Optimizations

- Tool: [ponytail](https://github.com/DietrichGebert/ponytail)

### Fork #9 — Hooks (prevent agent false-positives)

- Cursor hooks, lefthook extensions
- Block `@ts-expect-error`, `eslint-disable`, etc.

### Fork #10 — MCPs

- Custom verification MCPs; AXI-style CLI output
- [axi.md](https://axi.md/), TOON for token savings

### Fork #11 — CI/CD

- GitHub Actions; `sfw pnpm install --frozen-lockfile`
- [no-mistakes](https://github.com/kunchenguid/no-mistakes) pipeline
- Deploy preview probes

### Fork #12 — E2E, unit tests, and acceptance rigor

**Goal:** Rigorous acceptance scenarios so agents cannot greenwash with trivial tests.

**Planned (see `WORKFLOW.md` § Fork #12):**

- § **Acceptance scenarios** in `PLAN.md` — Gherkin-style bullets, human-approved before code
- Mandatory mix: schema/API rejects + **e2e happy + e2e failure path** per feature
- Optional executable `.feature` (playwright-bdd); Vitest stays the contract layer
- `docs/e2e-protocol.md`, anti-lazy rules, Notes failure-path e2e
- Playwright trace checklist (extends fork #4 dossiers)

**Prompt for fork #12 session:**

> Read `WORKFLOW.md` § Fork #12 and `SESSION-HANDOFF.md`. Implement acceptance rigor — PLAN scenarios, e2e protocol, Notes reject e2e, update WORKFLOW when decided.

### Fork #13 — Security review

**Goal:** Mandatory security pass before merge — supply chain + diff review + API baseline.

**Planned (see `WORKFLOW.md` § Fork #13):**

- Slow gate after lint/tests, before CI (#11)
- `docs/security-protocol.md`, `.agents/skills/security-review/`
- `PLAN.md` § Security constraints at kickoff
- Critical/high findings block merge until human ack
- Builds on `sfw` (fork #1) and debug dossiers (fork #4)

**Prompt for fork #13 session:**

> Read `WORKFLOW.md` § Fork #13 and `SESSION-HANDOFF.md`. Implement security review — protocol, skill, PLAN stub, AGENTS.md gate; update WORKFLOW when decided.

---

## Cross-cutting (apply across forks)

- **GitButler** — virtual branches for parallel agent work
- **TOON** — token-efficient structured I/O (AXI)
- **Kun Chen tooling** — [lavish-axi](https://github.com/kunchenguid/lavish-axi), [no-mistakes](https://github.com/kunchenguid/no-mistakes), [firstmate](https://github.com/kunchenguid/firstmate)
- **Video demo** — single-agent direct model unless showing parallel crew

---

## Rules for the next agent

1. Read `WORKFLOW.md` + this file first.
2. **Do not copy** from workspace example repos into scaffold.
3. **Do not commit** unless user asks.
4. Changes to workflow → `WORKFLOW.md`. Changes to template → `tanstack-spa-scaffold` repo.
5. Task not done until `typecheck`, `lint`, `test` exit zero (in scaffold).
6. Dependency changes → `sfw pnpm` only; flag new deps.
7. One fork per conversation; update decision log when fork completes.

---

## Original fork list (user's master outline)

1. ~~Template choice~~ ✓
2. ~~Kickoff / grill-with-docs~~ ✓
3. ~~TDD + Zod~~ ✓
4. ~~Find bugs, deal with them~~ ✓
5. ~~Linters / fallow~~ ✓
6. Skills inventory
7. Sub-agents
8. Optimizations / ponytail
9. Hooks
10. MCPs
11. CI/CD
12. E2E + Vitest conventions
13. Security review

---

_Last updated: 2026-06-21_
