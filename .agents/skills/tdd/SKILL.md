---
name: tdd
description: Red-green-refactor at the Zod contract boundary — schema tests first, then API, web helpers, and e2e. Use when implementing an approved PLAN.md plan or adding shared contracts.
disable-model-invocation: true
---

Follow the canonical TDD procedure in [`docs/tdd-protocol.md`](../../docs/tdd-protocol.md).

Prerequisites:

- `PLAN.md` § Plan has `approved: [x] yes`
- § Verification names at least one failing test

Order: **schemas → API → web helpers → UI → e2e**. Do not skip layers when the feature crosses them.

Zod schemas in `packages/schemas` are the single source of truth — infer types, validate API in/out and form input.
