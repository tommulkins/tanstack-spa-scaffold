# ADR 0007: Security review slow gate

## Status

Accepted — fork #13

## Context

`sfw` (fork #1) screens registry installs. Verify and analyze (forks #4–#5) catch functional and static issues but not secrets in diffs, missing validation on new endpoints, or unapproved auth boundaries. Fork #13 planned a mandatory pre-merge security pass.

## Decision

Add a **slow security tier** after the full gate, before PR/merge:

```sh
pnpm gate && pnpm security:check && security-review checklist (skill / subagent)
```

| Tier         | When                                      | Commands                                                                                     |
| ------------ | ----------------------------------------- | -------------------------------------------------------------------------------------------- |
| **Security** | Before PR / merge (feature or dep change) | `pnpm security:check` + diff checklist per [`security-protocol.md`](../security-protocol.md) |

- Not in Lefthook pre-commit (ADR 0001)
- Not in GitHub Actions baseline (ADR 0006) — human/agent before PR; CI still runs `pnpm gate`
- Critical/high findings block merge until fixed or human acknowledges (security dossier)

## Consequences

- Agents run **security-review** skill after verify
- `reports/security/` holds dossiers (gitignored)
- Optional readonly security subagent supplements but does not replace checklist

## Alternatives considered

- **Security in CI only** — rejected; agents could open PR without local review
- **Semgrep in base scaffold** — deferred; manual checklist + secrets grep sufficient for greenfield template
