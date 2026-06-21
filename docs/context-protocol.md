# Context protocol

Token and context efficiency without weakening gates, tests, or security.

Any agent harness can follow this file. Optional [ponytail](https://github.com/DietrichGebert/ponytail) reinforcement is documented below — not required for this scaffold.

## Principle

**Chat is ephemeral; repo files are durable memory.**

Decisions, plans, glossary, and procedures live in committed files. After compaction, a new session, or a long implement phase, **re-read files** — do not rely on chat history or summaries.

## Re-read ladder

Use the minimum set for the current phase:

| Phase                     | Read (in order)                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------------- |
| Any session start         | `AGENTS.md`                                                                                 |
| Feature work              | `PLAN.md` → `CONTEXT.md`                                                                    |
| UI work                   | + `DESIGN.md`                                                                               |
| Kickoff                   | [`kickoff-protocol.md`](./kickoff-protocol.md)                                              |
| Implement (post-approval) | [`tdd-protocol.md`](./tdd-protocol.md)                                                      |
| Red gates                 | [`debug-protocol.md`](./debug-protocol.md)                                                  |
| Before merge / done       | full gate + [`static-analysis-protocol.md`](./static-analysis-protocol.md) if analyze fails |
| Parallel delegates        | [`subagents-protocol.md`](./subagents-protocol.md) + brief                                  |

Do **not** load every protocol every turn. Read the active one for the phase you are in.

## When context compacts

Cursor and similar harnesses summarize or drop older chat. Treat compaction as a **hard reset** for working memory:

1. Stop claiming progress from chat alone.
2. Re-run the re-read ladder for your phase.
3. Confirm `PLAN.md` § Plan is still approved before more feature code.
4. Re-run the failing gate if you were mid-debug — do not assume green.

`SESSION-HANDOFF.md` and `WORKFLOW.md` are for **meta workflow design** across forks; greenfield product agents normally read `AGENTS.md` + `PLAN.md`, not the full decision log.

## Token-efficient habits

| Do                                              | Don't                                          |
| ----------------------------------------------- | ---------------------------------------------- |
| Targeted `read` / search on paths in scope      | Paste whole directories into chat              |
| Link to protocol sections                       | Duplicate protocol text in replies             |
| Dossiers under `reports/dossiers/` for failures | Repeat full gate logs in chat after capture    |
| `pnpm analyze` JSON verdict for pass/fail       | Dump full fallow report unless triaging        |
| One package at a time (`pnpm --filter …`)       | Run redundant full-suite loops while iterating |
| Return brief summaries from subagents           | Merge subagent chat logs verbatim              |

These habits do not replace the full gate before done.

## Minimal implementation (always on)

Root `AGENTS.md` and user-facing agent rules already require:

- Smallest correct diff; no speculative abstractions
- Schema-first TDD; no duplicate boundary types
- Full gate before done; no weakened assertions

That is the **baseline** optimization layer — no plugin required.

## ponytail (optional)

[ponytail](https://github.com/DietrichGebert/ponytail) is an **optional harness plugin** that reinforces YAGNI and native/stdlib-before-dependency choices during implement. It is **not** a project dependency and is **not** vendored into this repo.

### When to adopt

| Situation                                           | ponytail                                              |
| --------------------------------------------------- | ----------------------------------------------------- |
| Agent over-builds (extra libs, wrappers, config)    | consider enabling                                     |
| Scaffold / protocol / docs-only work                | skip — not the target                                 |
| Kickoff, grill, plan approval                       | skip — human-in-the-loop                              |
| Security, validation, accessibility, error handling | **never** cut — ponytail's own ladder preserves these |

### Install (pick your harness)

- **Cursor:** install plugin or copy rules from [ponytail `.cursor/rules/`](https://github.com/DietrichGebert/ponytail/tree/main/.cursor/rules) — optional per developer
- **Claude Code / Codex / Copilot CLI:** ponytail marketplace plugin (see upstream README)
- **Instruction-only:** ponytail reads project `AGENTS.md`; our minimal-code rules already align — plugin adds intensity levels and `/ponytail-review`

Do not duplicate ponytail's full ruleset in `AGENTS.md`. Link here; adopt upstream when needed.

### Conflicts

- ponytail reduces **unnecessary** code; it does **not** skip tests, Zod boundaries, or gates
- If ponytail suggests deleting required validation, **keep the validation** — gates win
- `/ponytail-review` on a diff is advisory; verify skill still runs before merge

## Deferred to later forks

| Topic                                                | Fork     |
| ---------------------------------------------------- | -------- |
| TOON / AXI structured CLI output                     | #10 MCPs |
| Hooks blocking `eslint-disable` / `@ts-expect-error` | #9 ✓     |
| CI artifact retention                                | #11      |

## Related

- [`kickoff-protocol.md`](./kickoff-protocol.md) — durable artifacts at kickoff
- [`debug-protocol.md`](./debug-protocol.md) — dossiers instead of chat logs
- [`skills-protocol.md`](./skills-protocol.md) — thin skills, fat protocols
