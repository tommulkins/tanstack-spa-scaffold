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

## Completed (Forks #1–#13 + scaffold)

All forks from the master outline are **decided and delivered** in the scaffold.

### Stack (locked in)

- React SPA — TanStack Router, Query, Form
- Hono API — separate process in monorepo
- Zod — shared contracts in `packages/schemas`
- pnpm workspaces
- Vitest (unit) + Playwright (e2e)
- Lefthook pre-commit — `typecheck` + `lint` + agent-policy (not full e2e locally)
- **sfw** — install/add/update via Socket Firewall; scripts use plain `pnpm`

### Agent files (no duplication)

| File                              | Purpose                                                                                       |
| --------------------------------- | --------------------------------------------------------------------------------------------- |
| `AGENTS.md`                       | Canonical agent instructions ([agents.md](https://agents.md)); nested in each package         |
| `CLAUDE.md`                       | Symlink → `AGENTS.md`                                                                         |
| `PLAN.md`                         | Current feature plan                                                                          |
| `DESIGN.md`                       | Visual identity — [google-labs-code/design.md](https://github.com/google-labs-code/design.md) |
| `CONTEXT.md`                      | Glossary only (grill-with-docs)                                                               |
| `docs/adr/`                       | Surprising architectural trade-offs (0001–0007)                                               |
| `docs/kickoff-protocol.md`        | Agent-agnostic kickoff procedure                                                              |
| `.agents/skills/grill-with-docs/` | Thin skill → protocol                                                                         |

### Scaffold verification (must exit zero)

```sh
cd tanstack-spa-scaffold
pnpm gate
```

Before PR (feature or dependency change): `pnpm security:check` + security-review skill.

Setup on fresh clone:

```sh
cp .env.example .env
sfw pnpm install
pnpm exec playwright install chromium
./scripts/link-agent-skills.sh
```

### Scaffold implementation notes

- **E2E** does not use Playwright `webServer` (unreliable in pnpm subprocess). Uses `scripts/run-e2e.mjs` → starts API on **3101**, web preview on **4174**, then runs Playwright.
- **Dev** uses API **3001**, web **5173** (proxy `/api` → API).
- Example schema: `packages/schemas/src/health.ts` + co-located Vitest test.
- Smoke e2e: `tests/e2e/smoke.spec.ts` — home page + API health via proxy.

### Fork #3 (TDD + Zod)

- `docs/tdd-protocol.md` — canonical red-green procedure at the contract boundary
- `.agents/skills/tdd/SKILL.md` — discovery wrapper
- **Notes reference slice:** schemas → API → web → e2e

### Fork #4 (Find bugs)

- `docs/debug-protocol.md` — self-heal loop, retry budget, escalate rules
- `docs/dossier-template.md` — failure evidence shape
- `.agents/skills/verify/SKILL.md` — run gates + heal on red
- `reports/dossiers/` — gitignored session evidence

### Fork #5 (Static analysis)

- fallow — `pnpm analyze` in `pnpm gate`
- `docs/static-analysis-protocol.md`, ADR 0002, `.agents/skills/analyze/`

### Fork #6 (Skills inventory)

- `docs/skills-protocol.md` — lifecycle, inventory
- `.agents/skills/README.md` + seven skills
- `./scripts/link-agent-skills.sh`

### Fork #7 (Sub-agents)

- `docs/subagents-protocol.md`, ADR 0003, orchestrate skill

### Fork #8 (Optimizations)

- `docs/context-protocol.md` — re-read ladder, compaction recovery

### Fork #9 (Hooks)

- `docs/hooks-protocol.md`, ADR 0004 — ban suppressions

### Fork #10 (MCPs)

- `docs/mcp-protocol.md`, ADR 0005 — shell gates canonical

### Fork #11 (CI/CD)

- `.github/workflows/ci.yml`, `pnpm gate`, ADR 0006

### Fork #12 (Acceptance rigor)

- `docs/e2e-protocol.md`, acceptance skill, Notes reject e2e

### Fork #13 (Security review)

- `docs/security-protocol.md` — pre-PR slow gate
- `docs/security-dossier-template.md`, `reports/security/`
- ADR 0007 — security tier after `pnpm gate`, before PR
- `scripts/check-secrets.sh`, `pnpm security:check`
- `.agents/skills/security-review/SKILL.md`

---

## Resolved (forks #1–#13)

| Topic              | Decision                                                             |
| ------------------ | -------------------------------------------------------------------- |
| Pre-commit vs e2e  | Fast: typecheck + lint + agent-policy. Full: `pnpm gate`. ADR 0001   |
| Security before PR | `pnpm security:check` + diff checklist. ADR 0007. Not in CI baseline |
| CI `sfw pnpm`      | `.github/workflows/ci.yml`, `pnpm gate`                              |
| Plan approval      | `PLAN.md` § Plan checkbox canonical                                  |
| firstmate          | Subagents-protocol; ADR 0003                                         |
| Skill symlinks     | `./scripts/link-agent-skills.sh` after clone                         |

**No remaining forks** from the original master outline.

---

## Cross-cutting (apply across forks)

- **GitButler** — virtual branches for parallel agent work
- **TOON** — token-efficient structured I/O (AXI)
- **Kun Chen tooling** — lavish-axi, no-mistakes, firstmate
- **Video demo** — single-agent direct model unless showing parallel crew

---

## Rules for the next agent

1. Read `WORKFLOW.md` + this file first.
2. **Do not copy** from workspace example repos into scaffold.
3. **Do not commit** unless user asks.
4. Changes to workflow → `WORKFLOW.md`. Changes to template → `tanstack-spa-scaffold` repo.
5. Task not done until `pnpm gate` exits zero; security review before PR when applicable.
6. Dependency changes → `sfw pnpm` only; flag new deps.
7. New workflow forks → add to `WORKFLOW.md` (master outline #1–#13 is complete).

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
12. ~~E2E + Vitest conventions~~ ✓
13. ~~Security review~~ ✓

---

_Last updated: 2026-06-21_
