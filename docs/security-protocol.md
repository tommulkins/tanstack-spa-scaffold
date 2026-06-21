# Security protocol

> **Stub — full procedure in fork #13.** See [`WORKFLOW.md`](../WORKFLOW.md) § Fork #13.

Until fork #13 lands:

- Use **`sfw pnpm`** for any dependency change
- Capture auth, secrets, and PII boundaries in `PLAN.md` § Security constraints at kickoff
- Run **verify** + **analyze** before merge
- Escalate to human: new auth, env secrets in code, CORS/origin changes, user-data storage

Do not claim security review complete without fork #13 deliverables.
