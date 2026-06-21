# Failure dossier

Copy this file to `reports/dossiers/<YYYY-MM-DD>-<short-slug>.md` when a gate fails.

## Summary

- **Date:**
- **Gate:** `pnpm typecheck` | `pnpm lint` | `pnpm test` | other: \_\_\_
- **Exit code:**
- **Status:** open | resolved | escalated
- **PLAN.md feature:** (if applicable)

## Failing target

- **Test name:** (Vitest `-t` pattern or Playwright spec title)
- **File:line:** (from stack trace, if any)

## Raw output

```
(paste full command output — trim only if enormous; keep the error and stack)
```

## Hypothesis

(one sentence — what you think broke and why)

## Fix attempts

### Attempt 1

- **Change:**
- **Result:** pass | fail — (one line)

### Attempt 2

- **Change:**
- **Result:**

### Attempt 3

- **Change:**
- **Result:**

## Escalation (if status = escalated)

- **Blocked on:**
- **Smallest repro command:**
- **Artifacts:** (trace path, screenshot, etc.)

## Resolution (if status = resolved)

- **Root cause:**
- **Fix:**
