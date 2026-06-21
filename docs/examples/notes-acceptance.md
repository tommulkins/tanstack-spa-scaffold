# Notes feature — acceptance example

Copy into `PLAN.md` § Acceptance scenarios and § Verification when kicking off a similar CRUD feature.

## Acceptance scenarios

- [x] **Happy:** Given I am on `/notes`, when I enter "Buy milk" and submit, then the note appears in the notes list
- [x] **Reject:** Given whitespace-only input in the new-note field, when I submit, then I see "Text is required", the list stays empty, and no note is created

## Verification (named tests)

```sh
pnpm gate
```

| Scenario          | Named test                                                                                    |
| ----------------- | --------------------------------------------------------------------------------------------- |
| Happy             | `pnpm exec playwright test tests/e2e/notes.spec.ts -g "creates a note"`                       |
| Reject            | `pnpm exec playwright test tests/e2e/notes.spec.ts -g "whitespace-only"`                      |
| Schema reject     | `pnpm --filter @scaffold/schemas exec vitest run -t "whitespace-only"`                        |
| API reject        | `pnpm --filter @scaffold/api exec vitest run -t "returns 400"`                                |
| Web helper reject | `pnpm --filter @scaffold/web exec vitest run -t "rejects invalid input before calling fetch"` |
