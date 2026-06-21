# ADR 0001: Tiered quality gates

## Status

Accepted

## Context

Pre-commit hooks that run full Playwright e2e are slow and flaky on laptops. Agents and humans still need a hard definition of done before merge.

## Decision

**Three tiers:**

| Tier         | When                                      | Commands                                                                                                    |
| ------------ | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Fast**     | Lefthook pre-commit                       | `pnpm typecheck`, `pnpm lint`, agent-policy (no suppressions — [ADR 0004](./0004-no-agent-suppressions.md)) |
| **Full**     | Before merge / task done                  | `pnpm gate`                                                                                                 |
| **Security** | Before PR / merge (feature or dep change) | `pnpm security:check` + diff checklist — [ADR 0007](./0007-security-review-tier.md)                         |
| **CI**       | Pull request / push to `main`             | `pnpm gate` (see [ADR 0006](./0006-ci-github-actions.md), [ci-protocol](../ci-protocol.md))                 |

E2e, fallow audit, and security review do not run in pre-commit. Agents must run `pnpm gate` before claiming done and `pnpm security:check` + security-review before PR. See [ADR 0002](./0002-static-analysis-tier.md) and [ADR 0007](./0007-security-review-tier.md).

## Consequences

- Faster local commits; no false blocks from e2e infra on commit.
- Merge risk is covered by agent contract + CI, not the hook.
