# Static analysis protocol

Canonical procedure for codebase-level static analysis beyond ESLint and Prettier. Any agent harness can follow this file.

Tool: [fallow](https://github.com/fallow-rs/fallow) — complexity, dead code, duplication, dependency hygiene. **No AI inside the analyzer** — deterministic JSON for agents and CI.

Complements [ADR 0001](./adr/0001-tiered-quality-gates.md) and [ADR 0002](./adr/0002-static-analysis-tier.md).

## Layer split

| Layer       | Tool              | Scope                                               |
| ----------- | ----------------- | --------------------------------------------------- |
| **Lint**    | ESLint + Prettier | File-level style, TS rules, Playwright test rules   |
| **Analyze** | fallow            | Codebase graph — complexity, dead code, dupes, deps |

Do not duplicate fallow checks in ESLint or vice versa.

## When to run

| Command               | When                                                                |
| --------------------- | ------------------------------------------------------------------- |
| `pnpm lint`           | Pre-commit (fast tier)                                              |
| `pnpm analyze`        | Before merge / task done (full tier) — **gates on new issues only** |
| `pnpm analyze:report` | Human triage — full dead-code report, non-gating                    |

Run `pnpm analyze` after `pnpm test` green. On failure, follow [`docs/debug-protocol.md`](./debug-protocol.md).

## `pnpm analyze` (gate)

```sh
fallow audit --format json
```

- Compares working tree to merge-base with `origin/main` (or current branch upstream)
- **Fails only on findings introduced by your changes** (`audit.gate: "new-only"` in `.fallowrc.json`)
- Inherited debt in touched files is reported as context, not a block

Fix or suppress with justification (`fallow-ignore-*` comment + reason). Do not weaken ESLint to compensate.

## `pnpm analyze:report` (informational)

```sh
fallow dead-code
fallow health --score --hotspots
```

Use for refactors and fork triage — not required for every commit on a clean audit gate.

## Complexity thresholds

Defaults in `.fallowrc.json`:

- `maxCyclomatic`: 15
- `maxCognitive`: 12

Override per legacy path via `health.thresholdOverrides` when kickoff approves debt.

## Monorepo notes

- Entry points from `package.json` scripts and framework plugins
- `scripts/e2e-webserver.mjs` listed in `entry` — spawned by `run-e2e.mjs`, not a package script
- Workspace packages analyzed as one graph

## Agent output

Prefer JSON for dossiers:

```sh
pnpm analyze 2>&1 | tee reports/dossiers/latest-fallow.json
```

Parse `verdict`, `attribution`, and issue lists — do not paraphrase.

## Explicitly deferred

- `fallow security` — fork #13 (security review)
- Full-repo `--gate all` — fork #11 (CI baselines)
