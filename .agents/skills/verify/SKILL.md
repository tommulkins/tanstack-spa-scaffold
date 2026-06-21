---
name: verify
description: Run quality gates and self-heal on failure — capture dossiers, retry with evidence, escalate when stuck. Use after implementation or when any gate is red.
disable-model-invocation: true
---

Follow [`docs/debug-protocol.md`](../../../docs/debug-protocol.md).

From repo root, run until green or escalated:

```sh
pnpm typecheck && pnpm lint && pnpm test && pnpm analyze
```

Or run the CI-parity bundle:

```sh
pnpm gate
```

On failure: capture evidence → dossier from [`docs/dossier-template.md`](../../../docs/dossier-template.md) → fix → re-run. Max 3 attempts per root error; escalate on ambiguity, infra, or flake.

Do not claim done until all gates exit zero.
