# ADR 0004: No agent suppressions in source

## Status

Accepted — fork #9

## Context

Agents under time pressure add `@ts-expect-error` and `eslint-disable` to pass typecheck or lint without fixing root causes. Prose in `AGENTS.md` ("do not silence types") is necessary but not sufficient — suppressions can slip through until a human reads the diff.

## Decision

**Ban TypeScript and ESLint suppressions in hand-written source.** Enforce with:

1. `scripts/check-agent-suppressions.sh` — grep-based check on staged source files
2. Lefthook pre-commit command `agent-policy`
3. Cursor `preToolUse` hook (`.cursor/hooks/block-suppressions.sh`) for immediate denial

Allowlist: `apps/web/src/routeTree.gen.ts` only (generated, ESLint-ignored).

## Consequences

- Agents must fix types and lint errors properly; escalate via debug protocol when stuck.
- Fast tier grows by one cheap check; still no e2e in pre-commit (ADR 0001).
- Markdown and protocol docs may mention banned patterns as documentation — checker scans code extensions only.

## Alternatives considered

- **ESLint-only** — does not catch `@ts-expect-error` without extra plugin config; grep is explicit and fast.
- **Block `any` via hook** — already `@typescript-eslint/no-explicit-any` in ESLint; comment suppressions are the main agent shortcut.
