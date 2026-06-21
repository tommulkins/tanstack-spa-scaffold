---
name: security-review
description: Security pass before merge — supply chain, secrets scan, diff checklist, API baseline. Use after pnpm gate green and before PR.
disable-model-invocation: true
---

Follow [`docs/security-protocol.md`](../../../docs/security-protocol.md).

## Prerequisites

- **verify** green — `pnpm gate` (typecheck, lint, test, analyze)
- Dependency changes installed only via `sfw pnpm` and flagged in summary

## Steps

1. `pnpm security:check` on staged files (or `bash scripts/check-secrets.sh --repo` for full audit)
2. Walk the diff review checklist in the protocol (`git diff origin/main...HEAD`)
3. Optional: readonly security-review subagent on branch diff — protocol checklist stays canonical
4. Record findings in [`docs/security-dossier-template.md`](../../../docs/security-dossier-template.md) under `reports/security/` when severity ≥ medium or risk is accepted

**Critical / high** findings block merge until fixed or human acknowledges in the dossier.
