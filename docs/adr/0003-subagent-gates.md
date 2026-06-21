# ADR 0003: Sub-agents use the same quality gates

## Status

Accepted — fork #7

## Context

Parallel agents (harness subagents, firstmate crewmates, GitButler virtual branches) can ship faster but risk "greenwashing" — one agent skips e2e or fallow because another agent "already ran tests."

## Decision

**Every agent that changes project code must run the full gate before reporting done:**

```sh
pnpm typecheck && pnpm lint && pnpm test && pnpm analyze
```

- Pre-commit fast tier ([ADR 0001](./0001-tiered-quality-gates.md)) applies per worktree; it is not sufficient for done.
- Static analysis tier ([ADR 0002](./0002-static-analysis-tier.md)) applies to all changed code, including subagent branches.
- The **liaison** runs verify on the integrated result before merge or session handoff.
- Read-only subagents (explore, bugbot, security-review) do not run gates; they do not commit code.

## Consequences

- firstmate projects register as **`no-mistakes`** delivery mode when using this scaffold.
- Crewmate briefs must include the full gate command in done definition.
- Parallel work costs more CPU; trade accepted for isolation and honest green.

## Alternatives considered

- **Trust parent gate only** — rejected; integration conflicts and partial runs miss subagent regressions.
- **Unit tests only for crewmates** — rejected; e2e and fallow catch agent-specific shortcuts.
