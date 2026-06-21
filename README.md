# tanstack-spa-scaffold

[![CI](https://github.com/tommulkins/tanstack-spa-scaffold/actions/workflows/ci.yml/badge.svg)](https://github.com/tommulkins/tanstack-spa-scaffold/actions/workflows/ci.yml)

Greenfield monorepo template for agent-assisted development: **TanStack SPA + Hono API + Zod contracts + quality gates**.

Part of the [ai-workflows](https://github.com/tommulkins/ai-workflows) decision log.

## Stack

- **apps/web** — React 19, Vite, TanStack Router / Query / Form, Tailwind CSS v4
- **packages/api** — Hono on Node
- **packages/schemas** — Zod shared contracts (TDD boundary)

## Prerequisites

- Node.js 22+
- [pnpm](https://pnpm.io) 10+
- [Socket Firewall (`sfw`)](https://socket.dev) for install/add/update

## Setup

```sh
cp .env.example .env
sfw pnpm install
pnpm exec playwright install chromium
./scripts/link-agent-skills.sh   # optional: Cursor / Claude Code skill discovery
# Optional MCP: copy docs/mcp.example.json → .cursor/mcp.json (see docs/mcp-protocol.md)
```

## Scripts

| Command               | Purpose                                  |
| --------------------- | ---------------------------------------- |
| `pnpm dev`            | Web + API in parallel                    |
| `pnpm typecheck`      | TypeScript all packages                  |
| `pnpm lint`           | Prettier + ESLint                        |
| `pnpm test:unit`      | Vitest                                   |
| `pnpm test`           | Playwright e2e                           |
| `pnpm test:all`       | Unit then e2e                            |
| `pnpm analyze`        | fallow audit (new-only gate)             |
| `pnpm gate`           | Full gate — matches GitHub Actions       |
| `pnpm security:check` | Secrets scan on staged files (before PR) |

A task is not done until `pnpm gate` exits zero (or each gate individually).

## Agent files

| File                               | Role                                                                                          |
| ---------------------------------- | --------------------------------------------------------------------------------------------- |
| `AGENTS.md`                        | Agent instructions ([agents.md](https://agents.md)); nested per package                       |
| `CLAUDE.md`                        | Symlink → `AGENTS.md`                                                                         |
| `PLAN.md`                          | Current feature plan (kickoff output)                                                         |
| `DESIGN.md`                        | Visual identity ([google-labs-code/design.md](https://github.com/google-labs-code/design.md)) |
| `CONTEXT.md`                       | Ubiquitous language glossary                                                                  |
| `docs/kickoff-protocol.md`         | Kickoff procedure                                                                             |
| `docs/tdd-protocol.md`             | TDD at the Zod contract boundary                                                              |
| `docs/static-analysis-protocol.md` | fallow — complexity, dead code, full-tier gate                                                |
| `docs/debug-protocol.md`           | Self-heal when gates fail                                                                     |
| `docs/skills-protocol.md`          | Skill inventory and lifecycle                                                                 |
| `docs/subagents-protocol.md`       | When to delegate; crewmate contract; firstmate registration                                   |
| `docs/context-protocol.md`         | Compaction recovery; re-read ladder; optional ponytail                                        |
| `docs/hooks-protocol.md`           | Ban agent suppressions; Lefthook + Cursor hooks                                               |
| `docs/mcp-protocol.md`             | Optional MCP / AXI; shell gates canonical                                                     |
| `docs/ci-protocol.md`              | GitHub Actions full gate; `pnpm gate`; no-mistakes optional                                   |
| `docs/e2e-protocol.md`             | Acceptance scenarios; anti-lazy e2e rules                                                     |
| `docs/security-protocol.md`        | Pre-PR security review; secrets scan; diff checklist                                          |
| `WORKFLOW.md` § Fork #13           | ~~Planned~~ ✓ — see `docs/security-protocol.md`                                               |

## Kickoff

Before feature work, run the grill-with-docs skill or follow `docs/kickoff-protocol.md`.
