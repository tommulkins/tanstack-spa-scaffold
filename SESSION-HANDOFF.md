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

## Completed (Forks #1–#11 + scaffold)

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

### Fork #6 (Skills inventory)

- `docs/skills-protocol.md` — lifecycle, inventory, add-skill rules
- `.agents/skills/README.md` + five skills (security-review stub for fork #13)
- Fixed skill → protocol paths; verify skill includes `pnpm analyze`
- `./scripts/link-agent-skills.sh` for Cursor/Claude symlinks

---

### Doc naming (fork #2 patch)

- **`PLAN.md`** — feature kickoff (goal, plan, verification, recovery)
- **`DESIGN.md`** — visual identity only ([google-labs-code/design.md](https://github.com/google-labs-code/design.md)); default dark-slate stub ships in scaffold

---

### Fork #8 (Optimizations)

- `docs/context-protocol.md` — re-read ladder, compaction recovery, token habits
- ponytail optional (harness plugin, not vendored); baseline minimal-code rules stay in `AGENTS.md`
- TOON/AXI — [`docs/mcp-protocol.md`](./docs/mcp-protocol.md) (fork #10 ✓)

---

### Fork #9 (Hooks)

- `docs/hooks-protocol.md`, ADR 0004 — ban `@ts-expect-error`, `eslint-disable`, etc.
- `scripts/check-agent-suppressions.sh` + Lefthook `agent-policy`
- `.cursor/hooks.json` — `preToolUse` deny on suppressions
- `pnpm test:agent-policy` — checker self-test

---

### Fork #10 (MCPs)

- `docs/mcp-protocol.md`, ADR 0005 — shell gates canonical; MCP optional
- `docs/mcp.example.json` — optional Cursor MCP template (context7)
- AXI/TOON guidance; gh-axi / browser AXI deferred to fork #11

---

### Fork #11 (CI/CD)

- `.github/workflows/ci.yml` — job `quality` on PR + push to main
- `pnpm gate` — full gate script (local parity with Actions)
- `docs/ci-protocol.md`, ADR 0006
- Playwright artifacts on failure; deploy preview deferred

---

## Resolved (forks #1–#11)

| Topic               | Decision                                                                        |
| ------------------- | ------------------------------------------------------------------------------- |
| Pre-commit vs e2e   | Fast: `typecheck` + `lint` in Lefthook. Full `pnpm test` before merge. ADR 0001 |
| CI `sfw pnpm`       | Fork #11 ✓ — `.github/workflows/ci.yml`, `pnpm gate`                            |
| Plan approval       | `PLAN.md` § Plan checkbox canonical; GitHub issues optional                     |
| firstmate           | Fork #7 ✓ — `no-mistakes` mode; subagents-protocol; ADR 0003                    |
| Skill symlinks      | Run `./scripts/link-agent-skills.sh` after clone                                |
| `ai-workflows` repo | Optional later; `WORKFLOW.md` in scaffold for now                               |

No open carry-forward items — proceed to **Fork #12**.

---

### Fork #7 (Sub-agents and quality gates)

- `docs/subagents-protocol.md` — when to delegate, liaison/crewmate contracts, firstmate registration
- `docs/crewmate-brief-template.md` — per-delegate brief
- `docs/adr/0003-subagent-gates.md` — full gate required for every code-changing agent
- `.agents/skills/orchestrate/SKILL.md` — meta skill for parallel work
- Default: single-agent; video demo stays single-agent unless showing parallel crew

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

### Fork #6 — Skills inventory ✓

**Decided:** `.agents/skills/` canonical; five skills → protocols; `docs/skills-protocol.md`; harness symlinks via script; security-review stub.

---

### Fork #7 — Sub-agents and quality gates ✓

**Decided:** Default single-agent; delegate with brief + isolated scope; same full gate (ADR 0003); firstmate `no-mistakes`; orchestrate skill.

---

### Fork #8 — Optimizations ✓

**Decided:** Repo files over chat; re-read ladder in context-protocol; ponytail optional for implement; gates never skipped for tokens.

---

### Fork #9 — Hooks ✓

**Decided:** Mechanical ban on suppressions; lefthook agent-policy; Cursor preToolUse; ADR 0004.

---

### Fork #10 — MCPs ✓

**Decided:** Shell gates canonical; MCP optional for docs/debug/triage; AXI preferred over heavy MCP; mcp.example.json.

---

### Fork #11 — CI/CD ✓

**Decided:** GitHub Actions `pnpm gate`; sfw frozen install; Playwright evidence on failure; no-mistakes optional.

---

### Fork #12 — E2E, unit tests, and acceptance rigor ← **START HERE**

**Goal:** Rigorous acceptance scenarios; mandatory happy + failure e2e; anti-lazy rules.

**Prompt for new session:**

> Read `WORKFLOW.md` § Fork #12 and `SESSION-HANDOFF.md`. Implement acceptance rigor — PLAN scenarios, e2e protocol, Notes reject e2e, update WORKFLOW when decided.

---

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
6. ~~Skills inventory~~ ✓
7. ~~Sub-agents~~ ✓
8. ~~Optimizations / ponytail~~ ✓
9. ~~Hooks~~ ✓
10. ~~MCPs~~ ✓
11. ~~CI/CD~~ ✓
12. E2E + Vitest conventions
13. Security review

---

_Last updated: 2026-06-21_
