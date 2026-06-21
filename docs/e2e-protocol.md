# E2E and acceptance protocol

Canonical rules for acceptance scenarios and Playwright tests. Stops agents from greenwashing with shallow "page loads" specs.

Complements [`kickoff-protocol.md`](./kickoff-protocol.md) (scenarios at plan time), [`tdd-protocol.md`](./tdd-protocol.md) (layer order), and [`debug-protocol.md`](./debug-protocol.md) (no weakening assertions).

## Principle

**Scenarios are approved before code; tests prove scenarios — not the other way around.**

Gherkin syntax in `PLAN.md` is the human-readable contract. Playwright specs are the executable proof. Vitest stays the fast contract layer at schemas/API/web helpers.

## When scenarios are required

At kickoff Phase 3, before `PLAN.md` § Plan `approved: [x] yes`:

1. Fill § **Acceptance scenarios** — at least **one happy** and **one reject** per user-visible feature
2. Link each scenario to a **named test** in § Verification
3. Do not implement until both are approved

Amending scenarios mid-implement requires human approval and `PLAN.md` update.

## Scenario format (`PLAN.md`)

Gherkin-_like_ bullets — no Cucumber required in the base scaffold:

```markdown
## Acceptance scenarios

- [ ] **Happy:** Given I am on /notes, when I add "Buy milk", then it appears in the list
- [ ] **Reject:** Given whitespace-only input, when I submit, then I see a validation error and no note is created
```

Use observable outcomes (DOM text, network status, error message) — not implementation details.

## Mandatory mix per feature

| Layer       | Minimum                              | Example                                    |
| ----------- | ------------------------------------ | ------------------------------------------ |
| Schemas     | valid + invalid                      | `createNoteSchema` rejects whitespace      |
| API         | happy + 4xx                          | POST `{ text: "   " }` → 400               |
| Web helpers | parse fail before `fetch`            | `createNote` rejects without calling fetch |
| E2E         | **1 happy + 1 user-visible failure** | validation error; no successful POST       |

Skip layers the feature does not touch (document in plan).

## Executable specs (scaffold default)

**`PLAN.md` is the single source of truth.** Plain Playwright specs in `tests/e2e/` — no playwright-bdd / `.feature` files in the base template.

Teams may add executable Gherkin later; step definitions must stay thin and call shared helpers/schemas.

## Anti-lazy e2e rules

| Rule                           | Detail                                                                                     |
| ------------------------------ | ------------------------------------------------------------------------------------------ |
| No smoke-only features         | "Page loads" is not a feature scenario — use `tests/e2e/smoke.spec.ts` for app shell only  |
| Assert outcomes                | DOM content, `role=alert`, list membership, or HTTP status — not bare container visibility |
| Reject path blocks mutation    | When validation should block submit, assert **no successful POST** (or no 201)             |
| Semantic locators              | `getByRole` → `getByLabel` / `getByText` — see `AGENTS.md`                                 |
| No weakened assertions         | Same as debug protocol — fix UI, not the test                                              |
| One spec file per feature area | `tests/e2e/<feature>.spec.ts` may contain happy + reject tests                             |

## Writing failure-path e2e

1. Reproduce the **Reject** scenario from `PLAN.md` literally
2. Set up network observation before submit:

   ```ts
   let postSucceeded = false;
   page.on('response', (response) => {
     if (
       response.url().includes('/api/notes') &&
       response.request().method() === 'POST' &&
       response.status() === 201
     ) {
       postSucceeded = true;
     }
   });
   ```

3. Assert user-visible error (`role=alert` or equivalent)
4. Assert side effect absent (list unchanged, `postSucceeded === false`)
5. Name the test so § Verification can reference it: `rejects whitespace-only note without creating one`

## Playwright trace checklist (on e2e failure)

Extend the debug dossier when `pnpm test` fails:

1. Open trace: `pnpm exec playwright show-trace test-results/.../trace.zip`
2. **Timeline** — last action before failure; unexpected navigation?
3. **Network** — was a POST sent when validation should block?
4. **Console** — uncaught errors?
5. **Snapshot** — what did the user actually see vs what the test expected?
6. Hypothesis → fix → re-run **same spec** then `pnpm gate`

## Red-green order (e2e)

E2e is last in the pyramid — see [`tdd-protocol.md`](./tdd-protocol.md):

```
schemas → API → web helpers → UI wiring → e2e happy → e2e reject → pnpm gate
```

Write failing e2e for **both** scenarios before claiming feature done.

## Reference slice — Notes

| Scenario                     | Test                                                                            |
| ---------------------------- | ------------------------------------------------------------------------------- |
| Happy: add note, see in list | `tests/e2e/notes.spec.ts` — `creates a note and shows it in the list`           |
| Reject: whitespace-only      | `tests/e2e/notes.spec.ts` — `rejects whitespace-only note without creating one` |

Layer coverage: `packages/schemas/src/note.test.ts`, `packages/api/src/app.test.ts`, `apps/web/src/lib/notes.test.ts`.

Example plan text: [`docs/examples/notes-acceptance.md`](./examples/notes-acceptance.md).

## Done

Feature work is not done until:

- Every § Acceptance scenario has a passing named test
- `pnpm gate` exits zero

## Related

- [`docs/debug-protocol.md`](./debug-protocol.md) — dossiers, retry budget
- [`docs/tdd-protocol.md`](./tdd-protocol.md) — layer table
- Fork #13 — security scenarios in § Security constraints

## Explicitly not in scope

- Replacing Vitest schema tests with Cucumber
- Component/RTL tests in base template
- Mutation testing
