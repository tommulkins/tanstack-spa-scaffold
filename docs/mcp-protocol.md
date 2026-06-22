# MCP protocol

When to use MCP servers, AXI-style CLIs, and plain shell — without replacing repo quality gates.

Any harness can follow this file. MCP is **optional augmentation**; `pnpm typecheck`, `pnpm lint`, `pnpm test`, and `pnpm analyze` remain the definition of done.

## Principle

**Shell gates are canonical truth.** MCP and browser tools help agents explore, debug, and fetch docs — they do not replace Vitest, Playwright, or fallow for merge decisions.

Prefer **[AXI](https://axi.md/)**-style CLIs over schema-heavy MCP when both exist: combined operations, TOON output, contextual next-step hints, lower token overhead.

## Layer model

| Layer         | Mechanism                     | Role                                              |
| ------------- | ----------------------------- | ------------------------------------------------- |
| **Done**      | `pnpm` scripts from repo root | typecheck, lint, test, analyze — required         |
| **Protocol**  | `docs/*-protocol.md`          | Procedures any harness follows                    |
| **Skill**     | `.agents/skills/`             | Thin pointers to protocols                        |
| **MCP / AXI** | Optional harness integrations | Docs lookup, browser debug, deep graph inspection |
| **CI**        | GitHub Actions (fork #11)     | Re-runs shell gates; no MCP in CI baseline        |

## When to use what

| Task                         | Prefer                                        | Not                               |
| ---------------------------- | --------------------------------------------- | --------------------------------- |
| Prove feature done           | Full gate suite                               | Browser MCP alone                 |
| Library API during implement | context7 MCP or upstream docs                 | Guessing from training data       |
| E2e failure / UI debug       | Playwright trace + optional browser MCP       | Weakening Playwright assertions   |
| Dead code / graph triage     | `pnpm analyze` JSON; fallow MCP for deep dive | Manual grep across monorepo       |
| GitHub PR / CI status        | `gh` CLI or gh-axi                            | Raw REST in chat                  |
| Kickoff / plan               | `PLAN.md` + grill-with-docs                   | MCP research before plan approved |

## Recommended optional MCPs (local dev)

Enable in your harness — **not required** for scaffold green. Copy [`docs/mcp.example.json`](./mcp.example.json) to `.cursor/mcp.json` (or equivalent) and adjust paths.

| MCP                    | Use in this workflow                           | Phase          |
| ---------------------- | ---------------------------------------------- | -------------- |
| **context7**           | Current TanStack, Hono, Zod, Playwright docs   | implement      |
| **cursor-ide-browser** | Reproduce e2e failures, inspect DOM            | verify / debug |
| **fallow** (bundled)   | Deep codebase inspection beyond `pnpm analyze` | analyze triage |

Do not commit secrets, tokens, or personal `mcp.json` with credentials. Example config stays generic.

## AXI and TOON

**TOON** (Token-Optimized Object Notation) — compact structured output (~40% fewer tokens vs JSON for list-heavy data). Use when an agent-facing tool supports it.

**AXI principles** (summary — full spec at [axi.md](https://axi.md/)):

1. Token-efficient output (TOON default where available)
2. Minimal default fields; `--fields` for more
3. Truncate large bodies with escape hatches
4. Pre-computed aggregates (counts, statuses)
5. Definitive empty states
6. Structured errors and exit codes
7. Contextual next-step hints after output
8. Consistent `--help` per subcommand

Official AXIs relevant to this scaffold:

| AXI                                                                       | Domain                                               |
| ------------------------------------------------------------------------- | ---------------------------------------------------- |
| [gh-axi](https://github.com/kunchenguid/gh-axi)                           | GitHub — PRs, CI runs (fork #11)                     |
| [chrome-devtools-axi](https://github.com/kunchenguid/chrome-devtools-axi) | Browser — prefer over raw browser MCP when installed |
| [lavish-axi](https://github.com/kunchenguid/lavish-axi)                   | Human review of HTML plan/UI artifacts               |

**fallow** already emits JSON for gates (`pnpm analyze`). Use JSON for pass/fail automation; use fallow MCP interactively when triaging complex findings.

## Verification MCP pattern (custom — fork #11+)

When adding project-specific MCPs (DB fixtures, deploy probes):

1. **Read-only by default** — mutations behind explicit human approval
2. **Structured output** — TOON or small JSON; include `next` hints
3. **Same gates** — MCP smoke does not replace unit/e2e
4. **Document** in this file + example config; no server code in `packages/` unless the product needs it

no-mistakes evidence pipeline wires in fork #11.

## Agent rules

- Run full gate before claiming done — MCP exploration is not verification
- On e2e red: read trace, use browser MCP if available, fix code, re-run `pnpm test`
- On analyze red: read JSON verdict first; fallow MCP only if attribution unclear
- Do not add MCP servers to the monorepo `package.json` without human approval; prefer `sfw pnpm` for the install
- Subagents follow [`subagents-protocol.md`](./subagents-protocol.md) — same gates, MCP optional

## Related

- [ADR 0005](./adr/0005-mcp-optional-augmentation.md) — MCP vs shell decision
- [`docs/context-protocol.md`](./context-protocol.md) — token habits
- [`docs/debug-protocol.md`](./debug-protocol.md) — dossiers, Playwright traces
- [`docs/static-analysis-protocol.md`](./static-analysis-protocol.md) — fallow gate vs MCP
- Fork #11 — CI, gh-axi, no-mistakes
- Fork #13 — security-review subagent (readonly MCP pattern)

## Explicitly not in scope

- Vendoring MCP server implementations into the scaffold
- Replacing Playwright with browser MCP in CI
- Requiring MCP for contributors without Cursor/Claude MCP support
