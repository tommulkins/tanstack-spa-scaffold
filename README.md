# tanstack-spa-scaffold

[![CI](https://github.com/tommulkins/tanstack-spa-scaffold/actions/workflows/ci.yml/badge.svg)](https://github.com/tommulkins/tanstack-spa-scaffold/actions/workflows/ci.yml)

Greenfield monorepo template for agent-assisted development: **TanStack SPA + Hono API + Zod contracts + quality gates**.

**Agents:** read [`AGENTS.md`](./AGENTS.md) (canonical instructions). **Claude Code** also loads it via [`CLAUDE.md`](./CLAUDE.md) (`@AGENTS.md` import).

## Stack

- **apps/web** — React 19, Vite, TanStack Router / Query / Form, Tailwind CSS v4
- **packages/api** — Hono on Node
- **packages/schemas** — Zod shared contracts (TDD boundary)

## Prerequisites

- Node.js 22+
- [pnpm](https://pnpm.io) 10+
- [Socket Firewall (`sfw`)](https://socket.dev) — **recommended** for install/add/update (supply-chain screening); not required

## Quick start

1. Install prerequisites (Node 22+, pnpm 10+)
2. Run setup (below)
3. `pnpm dev` — web at http://localhost:5173, API at http://localhost:3001

## Setup

```sh
cp .env.example .env
pnpm install                     # recommended: sfw pnpm install
pnpm exec playwright install chromium
./scripts/link-agent-skills.sh   # optional: Cursor / Claude Code skill discovery
# Optional MCP: copy docs/mcp.example.json → .cursor/mcp.json (see docs/mcp-protocol.md)
```

For registry commands (install/add/update/remove), prefer **`sfw pnpm`** when you have Socket Firewall installed. Plain **`pnpm`** works for everything, including scripts (`dev`, `test`, `gate`, etc.).

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

Before opening a PR, run `pnpm gate` from the repo root (matches CI). Agents: see [`AGENTS.md`](./AGENTS.md) for the full done definition.

## CI

The badge at the top shows whether the latest [GitHub Actions](https://github.com/tommulkins/tanstack-spa-scaffold/actions/workflows/ci.yml) run passed. On every push to `main` and on all pull requests, CI runs `pnpm gate` — the same full suite as local (`typecheck`, `lint`, unit tests, Playwright e2e, fallow analyze). Failed e2e runs upload Playwright artifacts for debugging.

Run `pnpm gate` locally before opening a PR so CI is not the first time the full suite runs. Details: [`docs/ci-protocol.md`](./docs/ci-protocol.md).

## Project files

| File         | Role                                                                                          |
| ------------ | --------------------------------------------------------------------------------------------- |
| `AGENTS.md`  | Agent instructions ([agents.md](https://agents.md)); nested per package                       |
| `CLAUDE.md`  | Claude Code entry — imports `AGENTS.md` via `@AGENTS.md`                                      |
| `PLAN.md`    | Current feature plan (kickoff output)                                                         |
| `DESIGN.md`  | Visual identity ([google-labs-code/design.md](https://github.com/google-labs-code/design.md)) |
| `CONTEXT.md` | Ubiquitous language glossary                                                                  |

## Protocols

Read when relevant — full inventory in [`AGENTS.md`](./AGENTS.md).

| When               | Read                        |
| ------------------ | --------------------------- |
| Starting a feature | `docs/kickoff-protocol.md`  |
| Writing tests      | `docs/tdd-protocol.md`      |
| E2e / acceptance   | `docs/e2e-protocol.md`      |
| Gates fail         | `docs/debug-protocol.md`    |
| Before PR          | `docs/security-protocol.md` |

## Kickoff

Before feature work, follow `docs/kickoff-protocol.md` (or the grill-with-docs skill). No feature code until `PLAN.md` § Plan has `approved: [x] yes`.
