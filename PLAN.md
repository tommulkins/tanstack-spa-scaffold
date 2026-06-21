# Plan

> Stub for kickoff. Replace or duplicate per feature branch.

## Goal

<!-- one paragraph -->

## Non-goals

<!-- bullet list -->

## Constraints

<!-- stack, timeline, deploy, etc. -->

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

<!-- Gherkin-style scenarios — human-approved before implement (fork #12). See WORKFLOW.md § Fork #12. -->

<!--
Example:
- [ ] **Happy:** Given I am on /notes, when I add "Buy milk", then it appears in the list
- [ ] **Reject:** Given whitespace-only input, when I submit, then I see validation error and no item is created
-->

## Recovery

```sh
git stash && git checkout main && sfw pnpm install && pnpm typecheck && pnpm lint && pnpm test
```
