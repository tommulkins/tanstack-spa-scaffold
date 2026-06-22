# Debug protocol

Canonical procedure when quality gates fail. Any agent harness can follow this file.

Complements [`docs/kickoff-protocol.md`](./kickoff-protocol.md) Phase 5 (Verify) and [`docs/tdd-protocol.md`](./tdd-protocol.md).

Inspired by [Self-Testing AI Agents](https://stevekinney.com/courses/self-testing-ai-agents) — structured evidence, not “trust me it’s green.”

## Principle

**Red gates are data.** Capture output, form a hypothesis, fix, re-run. Never claim done on a failing gate. Never weaken a test to match broken code.

## When to run

- Any time `pnpm typecheck`, `pnpm lint`, `pnpm test`, or `pnpm analyze` exits non-zero
- Before telling the human a task is complete (must be green first)

## Self-healing loop

```
run gate → capture evidence → hypothesize → fix → re-run
     ↑                                              │
     └──────────── same gate still red ─────────────┘
```

1. **Run** the failing gate from repo root (or the package named in output).
2. **Capture** full stdout/stderr — not a paraphrase. For e2e, note spec name and attach Playwright trace path if present.
3. **Hypothesize** one likely root cause (single sentence).
4. **Fix** the minimum change aligned with `PLAN.md` and `AGENTS.md`.
5. **Re-run** the same gate. Only after it passes, run the full done suite.

### Gate order after a fix

When one gate was red, re-run that gate first, then the full suite:

```sh
pnpm typecheck && pnpm lint && pnpm test && pnpm analyze
```

## Failure dossier

When a gate fails — or when escalating to the human — write a dossier from [`docs/dossier-template.md`](./dossier-template.md).

| Field                          | Required                          |
| ------------------------------ | --------------------------------- |
| Gate command                   | yes                               |
| Exit code                      | yes                               |
| Raw output (or last ~80 lines) | yes                               |
| Failing test / file:line       | when applicable                   |
| Hypothesis                     | yes                               |
| Fix attempted                  | yes, each iteration               |
| Status                         | `open` / `resolved` / `escalated` |

**Location:** `reports/dossiers/<YYYY-MM-DD>-<slug>.md` (gitignored — session evidence, not product docs).

One dossier per failure thread; append iterations rather than starting fresh files.

## Retry budget

| Situation                            | Agent action                                        |
| ------------------------------------ | --------------------------------------------------- |
| Same gate, same root error           | Up to **3** fix attempts with dossier updates       |
| New error after a fix                | Reset count for the new error                       |
| Fix passes gate but full suite fails | New thread — dossier the new failure                |
| 3 attempts, same error               | **Stop.** Set dossier status `escalated`; ask human |

Do not loop blindly. Each attempt must change something justified by the evidence.

## Escalate to human when

Stop retrying and ask — even before the retry budget is exhausted:

- **Product / plan ambiguity** — spec unclear, conflicting with `PLAN.md`, or needs scope change
- **Architecture fork** — fix requires ADR-level trade-off
- **Infra / environment** — missing Playwright browser, port in use, registry/network block, sandbox permission
- **Flake** — same command passes on immediate re-run without code change (note in dossier; do not “fix” with retries)
- **Suspected test bug vs product bug** — agent cannot tell which is wrong without human call

On escalate: dossier status `escalated`, summarize what was tried, paste the smallest reproduction command.

## Playwright-specific

- Read `test-results/` and `playwright-report/` after failure
- Prefer `pnpm exec playwright show-trace <path>` for human handoff; in dossier, cite trace zip path
- Follow locator rules in `AGENTS.md` — if the test is wrong, fix the test for the right reason (missing role, wrong label), not weaker assertions

## Done

Same as `AGENTS.md`: all gates green. Dossier status `resolved` or file removed after human confirms. Do not commit dossiers unless the human asks for evidence in-repo.
