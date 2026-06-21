---
name: security-review
description: Security pass before merge — supply chain, diff review, API baseline. Use after verify is green and before PR/CI. Full procedure lands in fork #13.
disable-model-invocation: true
---

Follow [`docs/security-protocol.md`](../../../docs/security-protocol.md) (stub until fork #13).

Prerequisites:

- **verify** gates green (`typecheck`, `lint`, `test`, `analyze`)
- Dependency changes flagged; installed only via `sfw pnpm`

Until fork #13: escalate critical/high security concerns to human; do not skip verify/analyze and claim secure.
