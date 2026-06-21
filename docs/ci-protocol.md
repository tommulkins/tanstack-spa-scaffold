# CI protocol

Canonical CI/CD procedure for this scaffold. GitHub Actions re-runs the **full gate** — same commands as local done, plus supply-chain install via `sfw`.

Complements [ADR 0001](./adr/0001-tiered-quality-gates.md) (CI tier) and [ADR 0006](./adr/0006-ci-github-actions.md).

## Principle

**CI is the merge referee.** Local pre-commit is fast (typecheck + lint + agent-policy). CI runs everything agents must run before claiming done — no MCP, no browser tools.

Inspired by [no-mistakes](https://github.com/kunchenguid/no-mistakes): evidence on failure (Playwright artifacts), no "trust me it's green."

## CI tier commands

From repo root, after `sfw pnpm install --frozen-lockfile`:

```sh
pnpm gate
```

Equivalent to:

```sh
pnpm typecheck
pnpm lint
pnpm test:agent-policy
pnpm test:unit
pnpm test          # Playwright e2e
pnpm analyze       # fallow audit, new-only gate
```

## GitHub Actions

Workflow: [`.github/workflows/ci.yml`](../.github/workflows/ci.yml)

| Trigger        | Branches |
| -------------- | -------- |
| `push`         | `main`   |
| `pull_request` | all      |

| Step                                      | Purpose                                                   |
| ----------------------------------------- | --------------------------------------------------------- |
| `fetch-depth: 0`                          | fallow merge-base attribution on PRs                      |
| `sfw pnpm install --frozen-lockfile`      | Supply-chain screened install ([fork #1](../WORKFLOW.md)) |
| `playwright install chromium --with-deps` | E2e browser + OS deps                                     |
| `pnpm gate`                               | Full gate                                                 |
| Artifact upload on failure                | `playwright-report/`, `test-results/` (7-day retention)   |

Status badge in [`README.md`](../README.md).

## Local parity

Before opening a PR, run the same suite:

```sh
sfw pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm gate
```

Agents: follow verify skill — CI must not be the first time e2e or analyze runs.

## no-mistakes (optional local gate)

[no-mistakes](https://github.com/kunchenguid/no-mistakes) wraps push → disposable worktree → pipeline → PR. **Not required** for this scaffold; GitHub Actions is the shared gate.

Adopt locally when you want push-time validation before `origin`:

```sh
no-mistakes init   # once per clone
git push no-mistakes <branch>
```

Configure pipeline steps to match `pnpm gate`. firstmate `no-mistakes` project mode aligns with this full gate.

## Deploy preview (optional — product-specific)

This greenfield scaffold has **no default host**. When a product adds deploy:

1. Add a `deploy-preview` job after `quality` passes
2. Probe health URL + smoke route (not browser MCP)
3. Document host and env in product `PLAN.md` — not in base scaffold

Fork #11 leaves deploy as an open extension point.

## Pipeline order

```
implement → pnpm gate → pnpm security:check + security-review → PR → CI quality job → merge
```

Security review is **local before PR** ([security-protocol](./security-protocol.md), [ADR 0007](./adr/0007-security-review-tier.md)). CI runs `pnpm gate` only — do not skip local verify or security waiting for CI.

## Branch protection (recommended)

On `main`:

- Require status check **quality** (CI job name)
- Require PR before merge
- Do not allow bypassing failing checks

Configure in GitHub repo Settings → Branches.

## Agent rules

- Flag CI failures with job name + log excerpt; attach artifact links when e2e fails
- Do not weaken tests to green CI
- Use `gh run view` or gh-axi for run inspection ([mcp-protocol](./mcp-protocol.md))
- Dependency changes must update `pnpm-lock.yaml`; CI uses `--frozen-lockfile`

## Related

- [`docs/debug-protocol.md`](./debug-protocol.md) — self-heal before push
- [`docs/mcp-protocol.md`](./mcp-protocol.md) — CI is shell-only
- [`docs/static-analysis-protocol.md`](./static-analysis-protocol.md) — fallow in CI
- [`docs/security-protocol.md`](./security-protocol.md) — pre-PR security review
- Fork #13 ✓ — security slow gate (local); optional CI security job deferred

## Explicitly not in base CI

- MCP servers
- Deploy / preview probes (no default host)
- no-mistakes runner (optional local tool)
- `pnpm analyze:report` full dead-code scan (informational only)
