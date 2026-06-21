---
name: analyze
description: Run fallow static analysis on changed code — complexity, dead code, duplication. Use before claiming done or when ESLint passes but codebase hygiene is suspect.
disable-model-invocation: true
---

Follow [`docs/static-analysis-protocol.md`](../../docs/static-analysis-protocol.md).

After tests are green:

```sh
pnpm analyze
```

Gates on **new** findings vs merge-base (`fallow audit`). On failure, capture JSON output in a dossier per [`docs/debug-protocol.md`](../../docs/debug-protocol.md).

Informational full-repo report (non-gating): `pnpm analyze:report`.

Do not substitute ESLint disables for fallow findings.
