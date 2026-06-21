# ADR 0001: Tiered quality gates

## Status

Accepted

## Context

Pre-commit hooks that run full Playwright e2e are slow and flaky on laptops. Agents and humans still need a hard definition of done before merge.

## Decision

**Three tiers:**

| Tier     | When                     | Commands                                                             |
| -------- | ------------------------ | -------------------------------------------------------------------- |
| **Fast** | Lefthook pre-commit      | `pnpm typecheck`, `pnpm lint`                                        |
| **Full** | Before merge / task done | `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm analyze`           |
| **CI**   | Pull request (fork #11)  | Full suite + fallow baselines + `sfw pnpm install --frozen-lockfile` |

E2e and fallow audit do not run in pre-commit. Agents must run `pnpm test` and `pnpm analyze` explicitly before claiming done. See [ADR 0002](./0002-static-analysis-tier.md).

## Consequences

- Faster local commits; no false blocks from e2e infra on commit.
- Merge risk is covered by agent contract + CI, not the hook.
