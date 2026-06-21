# Sub-agents protocol

When to delegate work to sub-agents or crewmates, and how to keep them on the same quality gates as a single-agent session.

Any harness can follow this file. [firstmate](https://github.com/kunchenguid/firstmate) implements the liaison + worktree model externally; Cursor and similar tools expose in-harness subagents (e.g. Task tool).

## Default model

**Single agent, one session:** grill-with-docs → tdd → verify (+ analyze) → security-review (fork #13).

Use this for normal feature slices, scaffold changes, and the video demo unless you are intentionally showing parallel crew.

## When to delegate

| Situation                                                     | Delegate? | Typical delegate                                                   |
| ------------------------------------------------------------- | --------- | ------------------------------------------------------------------ |
| Independent parallel tasks (fix + feature, audit + implement) | yes       | firstmate crewmate or harness subagent in separate worktree/branch |
| Broad codebase exploration before planning                    | yes       | read-only explore subagent; parent synthesizes                     |
| Read-only diff review (security, bugbot)                      | yes       | readonly security-review / bugbot subagent                         |
| Long investigation while parent continues kickoff/plan        | yes       | scout brief (firstmate) or explore subagent                        |
| Kickoff / grill-with-docs                                     | no        | Human-in-the-loop; one question at a time                          |
| Small change in one package                                   | no        | Direct session is cheaper                                          |
| Overlapping edits to the same files                           | no        | Serialize or split by file ownership                               |
| Mid-implementation human steering every few minutes           | no        | Stay in one session                                                |

## Orchestration patterns

### 1. In-harness parent (Cursor, Claude Code, etc.)

The **parent agent** is the liaison. It spawns typed subagents, waits for results, and merges outcomes.

- **explore** — read-only codebase search; parent writes the plan
- **generalPurpose** — implementation in scoped brief when parent cannot fit context
- **shell** — git/terminal sequences the parent should not interleave with edits
- **bugbot / security-review** — readonly review of branch or uncommitted diff (fork #13)

Rules:

- One brief per subagent (see [`crewmate-brief-template.md`](./crewmate-brief-template.md))
- Subagent returns summary + gate status; parent runs **verify** on integrated result before claiming done
- Do not delegate kickoff or plan approval

### 2. firstmate (external liaison)

[firstmate](https://github.com/kunchenguid/firstmate) is a separate orchestrator repo (`AGENTS.md` + tmux + [treehouse](https://github.com/kunchenguid/treehouse) worktrees). You talk to the first mate; it spawns **crewmates** that never touch your main checkout.

Register this scaffold in firstmate `data/projects.md`:

```markdown
| tanstack-spa-scaffold | no-mistakes | /path/to/tanstack-spa-scaffold |
```

- **`no-mistakes` mode** — crewmates run the full validation pipeline before PR (aligns with this repo's full gate)
- Each crewmate gets a **ship brief** (`fm-brief.sh`) pointing at this repo's `AGENTS.md`
- **Scout** tasks (investigate, plan, reproduce) produce `data/<id>/report.md` — no push
- Captain merges only after explicit approval; first mate reconciles tmux windows

Project memory stays in **this repo's committed `AGENTS.md`** — not in firstmate `data/`.

### 3. GitButler (optional)

[GitButler](https://docs.gitbutler.com/guide) virtual branches complement parallel work: one agent per virtual branch, human merges stacks. Same crewmate contract and gates apply per branch.

## Crewmate / subagent contract

Every delegate — harness subagent or firstmate crewmate — must:

1. **Read** root `AGENTS.md` and the closest nested `AGENTS.md` for files touched
2. **Follow** the scoped brief (goal, in-scope paths, out-of-scope, done definition)
3. **Run the full gate** from repo root before reporting complete:

   ```sh
   pnpm typecheck && pnpm lint && pnpm test && pnpm analyze
   ```

4. **On red gates** — follow [`debug-protocol.md`](./debug-protocol.md) (dossier, max 3 attempts, escalate)
5. **Skills** — use project skills via `.agents/skills/` (tdd, verify, analyze); protocols are canonical
6. **Commits** — only when the human asked (same rule as root `AGENTS.md`)
7. **Return** — plain summary: what changed, gate output, blockers, files touched

Liaison must not merge or claim done without green gates on the integrated result.

## Anti-patterns

- Spawning subagents without a written brief
- Overlapping file ownership across parallel agents
- Parent merges on "trust me" without running verify
- Skipping `pnpm analyze` because a subagent only changed tests
- Weakening assertions or gates to green a crewmate branch
- Duplicating kickoff/plan content in chat instead of `PLAN.md`

## Liaison checklist

Before spawn:

- [ ] Brief written (template below)
- [ ] No file overlap with other in-flight agents
- [ ] `PLAN.md` approved if the task is feature work

After return:

- [ ] Read subagent summary and diff
- [ ] Run full gate on integrated tree (or trust crewmate log only after spot-check)
- [ ] Escalate architecture forks to human

## Related

- [`crewmate-brief-template.md`](./crewmate-brief-template.md) — copy for each delegate
- [`debug-protocol.md`](./debug-protocol.md) — self-heal on red gates
- [`skills-protocol.md`](./skills-protocol.md) — project skills inventory
- [ADR 0003](./adr/0003-subagent-gates.md) — sub-agents use the same gate tier as single-agent work
