# Security review dossier

Copy to `reports/security/<YYYY-MM-DD>-<short-slug>.md` when security review finds issues or records accepted risk.

## Summary

- **Date:**
- **Scope:** branch / PR / uncommitted diff
- **Reviewer:** agent | human | subagent
- **Status:** open | resolved | accepted-risk | escalated
- **PLAN.md feature:** (if applicable)

## Preconditions

- [ ] `pnpm gate` green
- [ ] `pnpm security:check` green (or N/A — docs only)

## Findings

| ID  | Severity                          | Location          | Issue | Action                    |
| --- | --------------------------------- | ----------------- | ----- | ------------------------- |
| S1  | critical \| high \| medium \| low | file:line or area |       | fix \| accept \| escalate |

## Diff review checklist

(copy unchecked items that failed)

- Supply chain:
- Secrets:
- API:
- Web:
- Auth / data:

## Fix attempts (if applicable)

### Attempt 1

- **Change:**
- **Result:**

## Escalation (if status = escalated)

- **Blocked on:**
- **Human decision needed:**

## Resolution (if status = resolved | accepted-risk)

- **Outcome:**
- **ADR reference:** (if accepted-risk is surprising)
