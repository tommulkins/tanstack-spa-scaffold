# Plan

> Stub for kickoff. Replace or duplicate per feature branch.

## Goal

<!-- one paragraph -->

## Non-goals

<!-- bullet list -->

## Constraints

<!-- stack, timeline, deploy, security, etc. -->

## Security constraints

<!-- data sensitivity, trust boundaries, explicit non-goals for auth/secrets — fill at kickoff when feature touches auth, PII, payments, or third-party trust; see docs/security-protocol.md -->

## Architecture

<!-- components, data flow, API boundaries -->

## Rejected alternatives

<!-- what we didn't choose and why -->

## Anti-patterns

<!-- things the agent must not reintroduce -->

## Plan

<!-- ordered tasks -->

**Approval gate:** set `approved: [x] yes` only after explicit human go-ahead. Verbal approval in chat is not enough without updating this line. GitHub issues may track work but do not replace this checkbox.

approved: [ ] yes

## Verification

<!-- commands + named tests that must pass -->

## Acceptance scenarios

Required before implement — at least one **Happy** and one **Reject** per user-visible feature. Link each to a named test in § Verification. See [`docs/e2e-protocol.md`](./docs/e2e-protocol.md) and [`docs/examples/notes-acceptance.md`](./docs/examples/notes-acceptance.md).

```markdown
- [ ] **Happy:** Given I am on /notes, when I add "Buy milk", then it appears in the list
- [ ] **Reject:** Given whitespace-only input, when I submit, then I see a validation error and no note is created
```

## Recovery

```sh
git stash && git checkout main && sfw pnpm install && pnpm gate
```
