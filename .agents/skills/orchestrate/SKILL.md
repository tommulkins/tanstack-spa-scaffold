---
name: orchestrate
description: Decide when to delegate to sub-agents or firstmate crewmates; write briefs; keep delegates on full gates. Use for parallel work or broad exploration—not for kickoff.
disable-model-invocation: true
---

Follow [`docs/subagents-protocol.md`](../../../docs/subagents-protocol.md).

**Default:** single-agent session (grill → tdd → verify). Delegate only when the protocol table says yes.

Before spawn: fill [`docs/crewmate-brief-template.md`](../../../docs/crewmate-brief-template.md) — no overlapping file ownership.

After return: read summary + diff; run full gate on integrated tree before claiming done:

```sh
pnpm typecheck && pnpm lint && pnpm test && pnpm analyze
```

firstmate: register project as `no-mistakes` in `data/projects.md`; crewmates read this repo's `AGENTS.md`.
