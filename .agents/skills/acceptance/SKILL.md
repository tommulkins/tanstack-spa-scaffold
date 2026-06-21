---
name: acceptance
description: Map PLAN.md acceptance scenarios to tests — happy + failure e2e per feature. Use after plan approval when writing or extending Playwright specs.
disable-model-invocation: true
---

Follow [`docs/e2e-protocol.md`](../../../docs/e2e-protocol.md).

Prerequisites: `PLAN.md` § Acceptance scenarios approved with at least one **Happy** and one **Reject** per feature.

For each scenario: write or extend `tests/e2e/<feature>.spec.ts` — assert outcomes, block spurious POST on reject paths, then run `pnpm gate`.

Reference: [`docs/examples/notes-acceptance.md`](../../../docs/examples/notes-acceptance.md).
