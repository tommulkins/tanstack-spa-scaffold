# Hooks protocol

Mechanical enforcement so agents cannot fake green gates with suppressions. Complements `AGENTS.md` prose rules and ESLint.

Any harness benefits from the **Lefthook** check; **Cursor** project hooks add pre-edit denial in the IDE.

## Banned in source

In `*.ts`, `*.tsx`, `*.js`, `*.jsx`, `*.mjs`, `*.cjs`:

| Pattern                     | Why                    |
| --------------------------- | ---------------------- |
| `@ts-expect-error`          | Hides real type errors |
| `@ts-ignore`                | Same                   |
| `@ts-nocheck`               | Disables entire file   |
| `eslint-disable` (any form) | Hides lint failures    |

**Fix the code.** ESLint already enforces `@typescript-eslint/no-explicit-any`; this layer catches comment-based escapes agents add when stuck.

## Allowlist

| File                            | Reason                                                            |
| ------------------------------- | ----------------------------------------------------------------- |
| `apps/web/src/routeTree.gen.ts` | TanStack Router generated; do not hand-edit — regenerate via Vite |

Add allowlist entries only via ADR — not for agent convenience.

## Enforcement tiers

| Tier     | When                       | Mechanism                                                                |
| -------- | -------------------------- | ------------------------------------------------------------------------ |
| **IDE**  | Before tool write (Cursor) | `.cursor/hooks.json` → `preToolUse` → `block-suppressions.sh`            |
| **Fast** | Pre-commit                 | Lefthook `agent-policy` → `scripts/check-agent-suppressions.sh --staged` |
| **Lint** | `pnpm lint`                | ESLint rules (e.g. `no-explicit-any`)                                    |
| **Full** | Before done                | verify skill — full gate still required                                  |

Hooks do not replace typecheck, lint, test, or analyze.

## Commands

```sh
# Staged files (pre-commit)
bash scripts/check-agent-suppressions.sh --staged

# Explicit paths
bash scripts/check-agent-suppressions.sh path/to/file.ts

# Whole repo (audit)
bash scripts/check-agent-suppressions.sh --repo

# Checker self-test
pnpm test:agent-policy
```

## Cursor setup

Project hooks ship in `.cursor/hooks.json`. Cursor reloads on save; restart if hooks do not attach.

Hooks run from repo root. Scripts must be executable:

```sh
chmod +x .cursor/hooks/block-suppressions.sh scripts/check-agent-suppressions.sh
```

Other harnesses (Claude Code, Codex): rely on Lefthook + `AGENTS.md` unless they adopt the same hook pattern.

## Agent behavior on deny

1. Read the typecheck or ESLint error that caused the urge to suppress.
2. Fix types, imports, or logic — smallest correct change.
3. Re-run the failing gate.
4. If genuinely blocked (bad upstream types), escalate with dossier — do not suppress.

## Related

- [ADR 0001](./adr/0001-tiered-quality-gates.md) — fast vs full tiers
- [ADR 0004](./adr/0004-no-agent-suppressions.md) — decision record
- [`docs/debug-protocol.md`](./debug-protocol.md) — escalate when stuck
- Fork #13 — secrets in commits (`.env`); hook reinforcement planned there

## Explicitly not in scope

- Banning `any` in comments or docs (prose examples are fine)
- Blocking `@types/*` or dependency suppressions in lockfiles
- Running full e2e in pre-commit (ADR 0001)
