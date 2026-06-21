# ADR 0006: GitHub Actions CI runs the full gate

## Status

Accepted — fork #11

## Context

[ADR 0001](./0001-tiered-quality-gates.md) defined a CI tier but deferred implementation. Agents and humans need a remote referee that matches local done: typecheck, lint, test, analyze, with supply-chain screened install.

## Decision

1. **Workflow** `.github/workflows/ci.yml` — job `quality` on `push` to `main` and all `pull_request`s.
2. **Install** via `sfw pnpm install --frozen-lockfile` on Ubuntu, Node 22, pnpm 10.12.1.
3. **Gate script** `pnpm gate` — typecheck, lint, test:agent-policy, test:unit, test (e2e), analyze.
4. **Evidence** — upload Playwright report and test-results on failure (7-day retention).
5. **Checkout** `fetch-depth: 0` so fallow `new-only` attribution works against merge-base on PRs.
6. **Deploy preview** — not in base scaffold; products add when they have a host.

Security-review is a **local slow gate** before PR ([ADR 0007](./adr/0007-security-review-tier.md)); not a separate CI job in base scaffold.

## Consequences

- README CI badge links to Actions.
- `docs/ci-protocol.md` is canonical; agents run `pnpm gate` locally before PR.
- no-mistakes remains optional local push gate — not a repo dependency.
- Branch protection should require the `quality` check.

## Alternatives considered

- **E2e in pre-commit** — rejected (ADR 0001).
- **MCP in CI** — rejected (ADR 0005).
- **fallow `--gate all` on main** — deferred; `new-only` matches local and PR attribution.
