# Skills protocol

Canonical inventory and lifecycle for project agent skills. Any harness can load skills from `.agents/skills/` or via symlinks.

**Pattern:** skills are **thin discovery wrappers** — procedures live in `docs/*-protocol.md`. Do not duplicate protocol content in skills.

## Canonical location

```
.agents/skills/<name>/SKILL.md    ← source of truth
.cursor/skills  → ../.agents/skills   (optional, after ./scripts/link-agent-skills.sh)
.claude/skills  → ../.agents/skills   (optional)
```

Run after clone:

```sh
./scripts/link-agent-skills.sh
```

Cursor, Claude Code, Codex, and fallow-bundled skills all read the same files; slash command names differ per harness.

## Skill frontmatter

Every project skill includes:

```yaml
---
name: <kebab-case>
description: <when to use — one sentence for harness discovery>
disable-model-invocation: true
---
```

Body: link to protocol + prerequisites only. **`disable-model-invocation: true`** on workflow skills — human invokes explicitly (`/grill-with-docs`, `/tdd`, etc.).

## Lifecycle (feature slice)

Use in order for a typical feature; skip steps that do not apply.

```
grill-with-docs → tdd → verify (+ analyze) → security-review
     │              │         │                      │
     ▼              ▼         ▼                      ▼
 kickoff        implement   gates green         before merge/CI
```

| #   | Skill               | Protocol                                                       | When                                                |
| --- | ------------------- | -------------------------------------------------------------- | --------------------------------------------------- |
| 1   | **grill-with-docs** | [`kickoff-protocol.md`](./kickoff-protocol.md)                 | New product or feature; before any feature code     |
| 2   | **tdd**             | [`tdd-protocol.md`](./tdd-protocol.md)                         | After `PLAN.md` § Plan approved                     |
| 2b  | **acceptance**      | [`e2e-protocol.md`](./e2e-protocol.md)                         | E2e happy + reject from § Acceptance scenarios      |
| 3   | **verify**          | [`debug-protocol.md`](./debug-protocol.md)                     | After implement; any red gate; before claiming done |
| 4   | **analyze**         | [`static-analysis-protocol.md`](./static-analysis-protocol.md) | Part of full verify (fallow); after tests green     |
| 5   | **security-review** | [`security-protocol.md`](./security-protocol.md)               | After `pnpm gate`; before merge/PR                  |

**Meta (parallel work, not lifecycle order):**

| Skill           | Protocol                                           | When                                                      |
| --------------- | -------------------------------------------------- | --------------------------------------------------------- |
| **orchestrate** | [`subagents-protocol.md`](./subagents-protocol.md) | Parallel tasks, exploration, firstmate crew — not kickoff |

**verify** runs the full gate suite including **analyze**. Invoke **analyze** alone when triaging fallow after ESLint is already green.

## Adding a skill

1. Add `docs/<topic>-protocol.md` (canonical procedure)
2. Add `.agents/skills/<name>/SKILL.md` (pointer only)
3. List in this file and `AGENTS.md`
4. Re-run `./scripts/link-agent-skills.sh` if harness symlinks exist

Do not vendor harness-specific copies. Do not put implementation detail in skills — use protocols and `AGENTS.md`.

## Explicitly not skills

| Concern              | Where it lives                                        |
| -------------------- | ----------------------------------------------------- |
| Always-on contract   | `AGENTS.md` (+ nested package `AGENTS.md`)            |
| Feature plan         | `PLAN.md`                                             |
| Visual identity      | `DESIGN.md`                                           |
| Glossary             | `CONTEXT.md`                                          |
| Meta workflow design | `WORKFLOW.md` (not copied to all greenfield products) |

## fallow bundled skills

Installing `fallow` adds its own skill and MCP under `node_modules`. Project skills in `.agents/skills/` take precedence for **this workflow**; use fallow MCP for deep inspection when triaging beyond `pnpm analyze` — see [`mcp-protocol.md`](./mcp-protocol.md).
