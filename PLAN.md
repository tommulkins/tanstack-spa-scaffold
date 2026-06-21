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

## Recovery

```sh
git stash && git checkout main && sfw pnpm install && pnpm typecheck && pnpm lint && pnpm test
```
