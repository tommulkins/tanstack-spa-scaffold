# tanstack-spa-scaffold

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
```

## Scripts

| Command          | Purpose                  |
| ---------------- | ------------------------ |
| `pnpm dev`       | Web + API in parallel    |
| `pnpm typecheck` | TypeScript all packages  |
| `pnpm lint`      | Prettier + ESLint        |
| `pnpm test:unit` | Vitest                   |
| `pnpm test`      | Playwright e2e           |
| `pnpm test:all`  | Unit then e2e            |
| `pnpm analyze`   | fallow audit (full gate) |

A task is not done until `typecheck`, `lint`, `test`, and `analyze` all exit zero.

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
| `WORKFLOW.md` § Fork #12           | Planned: acceptance scenarios, anti-lazy e2e rules (not implemented yet)                      |
| `WORKFLOW.md` § Fork #13           | Planned: security review before CI (not implemented yet)                                      |

## Kickoff

Before feature work, run the grill-with-docs skill or follow `docs/kickoff-protocol.md`.
