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
```

## Scripts

| Command          | Purpose                 |
| ---------------- | ----------------------- |
| `pnpm dev`       | Web + API in parallel   |
| `pnpm typecheck` | TypeScript all packages |
| `pnpm lint`      | Prettier + ESLint       |
| `pnpm test:unit` | Vitest                  |
| `pnpm test`      | Playwright e2e          |
| `pnpm test:all`  | Unit then e2e           |

A task is not done until `typecheck`, `lint`, and `test` all exit zero.

## Agent files

| File                       | Role                                  |
| -------------------------- | ------------------------------------- |
| `AGENTS.md`                | Canonical agent contract              |
| `CLAUDE.md`                | Symlink → `AGENTS.md`                 |
| `DESIGN.md`                | Current feature plan (kickoff output) |
| `CONTEXT.md`               | Ubiquitous language glossary          |
| `docs/kickoff-protocol.md` | Kickoff procedure                     |

## Kickoff

Before feature work, run the grill-with-docs skill or follow `docs/kickoff-protocol.md`.
