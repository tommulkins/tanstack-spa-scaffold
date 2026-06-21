# Kickoff protocol

Canonical procedure for starting a project or feature. Any agent harness can follow this file.

Inspired by [grill-with-docs](https://www.aihero.dev/grill-with-docs) and [mattpocock/skills](https://github.com/mattpocock/skills).

## When to run

- New greenfield product built from this scaffold
- Any feature that changes behavior, API contracts, or architecture

## Gate

**Do not write feature code** until `PLAN.md` § Plan has `approved: [x] yes` and verification tests are named.

## Phase 1 — Grill

Interview the human relentlessly. **One question at a time.** Offer a recommended answer with each question.

Resolve before moving on:

1. One-sentence goal
2. Explicit non-goals
3. User and happy path
4. Fixed constraints (stack, auth, deploy, **security / data sensitivity**)
5. Anti-patterns from past work
6. Definition of done (named tests or observable behavior)
7. Recovery if the session breaks

Write answers into `PLAN.md` (Goal, Non-goals, Constraints, Anti-patterns). Add § Security constraints when the feature touches auth, PII, or trust boundaries (full rules: fork #13).

If the question is answerable from the repo, explore the codebase instead of asking.

## Phase 2 — Prepare plan

Propose one or two approaches. Document tradeoffs.

Update `PLAN.md` § Architecture and § Rejected alternatives.

### Domain language (`CONTEXT.md`)

- Challenge terms that conflict with `CONTEXT.md`
- Sharpen fuzzy words; pick canonical terms
- Update `CONTEXT.md` **immediately** when a term is resolved — do not batch
- `CONTEXT.md` is glossary only — no implementation details

### ADRs (`docs/adr/`)

Create an ADR only when **all** are true:

1. Hard to reverse
2. Surprising without context
3. Result of a genuine trade-off

Otherwise skip.

## Phase 3 — Make plan

Produce ordered tasks in `PLAN.md` § Plan.

Add § Verification:

- Root commands: `pnpm typecheck`, `pnpm lint`, `pnpm test`
- Named unit and e2e tests
- **Acceptance scenarios** (Gherkin-style bullets in § Acceptance scenarios) — at least one happy path and one failure path per feature; human approves before implement (full rules: fork #12 in `WORKFLOW.md`)

Add § Recovery (minimum):

```sh
git stash && git checkout main && sfw pnpm install && pnpm typecheck && pnpm lint && pnpm test
```

**Stop.** Wait for human approval. Set `approved: [x] yes` in § Plan only after explicit go-ahead. This checkbox is the canonical gate — optional GitHub issues for team tracking do not replace it.

## Phase 4 — Implement

- Red-green against § Verification — follow [`docs/tdd-protocol.md`](./tdd-protocol.md)
- Order: schemas → API → web helpers → UI → e2e when the feature crosses layers
- Follow `AGENTS.md`
- Update `CONTEXT.md` / ADRs if new terms or surprising decisions emerge

## Phase 5 — Verify

Run all gates from the repo root. Task is not done until all exit zero.

On failure, follow [`docs/debug-protocol.md`](./debug-protocol.md) — dossier, self-heal loop (max 3 attempts), escalate when stuck. Do not claim done on red.
