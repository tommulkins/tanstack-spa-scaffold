# ADR 0002: Static analysis tier (fallow)

## Status

Accepted

## Context

Fork #1 (ADR 0001) split fast pre-commit gates from full test suite. ESLint and Prettier cover file-level lint; they do not detect unused exports, complexity hotspots, or dependency hygiene across the monorepo graph.

## Decision

Add a **slow static-analysis tier** using [fallow](https://github.com/fallow-rs/fallow):

| Tier     | When                     | Commands                                                             |
| -------- | ------------------------ | -------------------------------------------------------------------- |
| **Fast** | Lefthook pre-commit      | `pnpm typecheck`, `pnpm lint`                                        |
| **Full** | Before merge / task done | above + `pnpm test` + **`pnpm analyze`**                             |
| **CI**   | Pull request (fork #11)  | full suite + fallow baselines + `sfw pnpm install --frozen-lockfile` |

- **`pnpm lint`** — Prettier + ESLint only (unchanged)
- **`pnpm analyze`** — `fallow audit` with `gate: "new"` (introduced findings only)
- **`pnpm analyze:report`** — informational `fallow dead-code` / `health` (non-gating)

Fallow is **not** in pre-commit — keeps commits fast; agents run `pnpm analyze` explicitly before claiming done.

Config: `.fallowrc.json`. Cache: `.fallow/` (gitignored).

## Consequences

- Agents get structured JSON evidence for complexity and dead-code regressions
- Inherited monorepo debt does not block every PR — only **new** findings gate
- One additional devDependency (`fallow`); install via `sfw pnpm`
