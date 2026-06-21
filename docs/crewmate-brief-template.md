# Crewmate brief template

Copy this block for each subagent or firstmate crewmate. The liaison fills it in; the delegate follows it.

```markdown
## Brief: <short task id>

### Goal

One sentence — what "done" looks like.

### Context

- Branch / worktree: <name or path>
- PLAN.md relevant sections: <links or § names, if feature work>
- Read first: <files or AGENTS.md paths>

### In scope

- <paths or packages>

### Out of scope

- <explicit non-goals>

### Done definition

- [ ] <observable behavior or test name>
- [ ] Full gate green from repo root:

      pnpm typecheck && pnpm lint && pnpm test && pnpm analyze

### Return format

Summary (3–5 bullets), files changed, gate command output (last run), blockers.
```

For firstmate ship tasks, scaffold the brief with `fm-brief.sh` in the firstmate repo and paste the gate block above into § Done definition.
