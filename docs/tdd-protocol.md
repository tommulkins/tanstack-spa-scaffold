# TDD protocol

Canonical procedure for red-green-refactor at the Zod contract boundary. Any agent harness can follow this file.

Complements [`docs/kickoff-protocol.md`](./kickoff-protocol.md) — kickoff names tests; this file defines how to write them.

## Principle

**Zod schemas in `packages/schemas` are the single source of truth.**

- Export runtime schemas and `z.infer<typeof schema>` types — never duplicate TS interfaces for boundaries.
- API validates inbound request bodies and outbound responses with shared schemas.
- Web validates API JSON with response schemas and form input with request schemas before submit.

## When to run

- Any feature that adds or changes API contracts, forms, or shared types
- Phase 4 (Implement) of kickoff — after `PLAN.md` § Plan is approved and § Verification names at least one failing test

## Red-green order

Work **outward from the contract**:

```
schemas (fail) → API (fail) → web helpers (fail) → UI → e2e (fail) → green gates
```

| Layer       | Test location                         | What to assert                                                                |
| ----------- | ------------------------------------- | ----------------------------------------------------------------------------- |
| **Schemas** | `packages/schemas/src/<name>.test.ts` | `parse` accepts valid payloads; rejects invalid shapes                        |
| **API**     | `packages/api/src/<name>.test.ts`     | Hono `app.request()` — status, JSON shape, validation errors; no live server  |
| **Web**     | `apps/web/src/**/*.test.ts`           | Pure fetch/mutation helpers with mocked `fetch`; schema parse at the boundary |
| **E2E**     | `tests/e2e/<feature>.spec.ts`         | One happy path per user-visible feature; semantic locators only               |

## Kinney rule

1. Name the failing test in `PLAN.md` § Verification before writing code.
2. Write the test; confirm it **fails** for the right reason.
3. Implement the minimum code to pass.
4. Refactor only with tests green.

Prefer a separate commit for the failing test when the human is reviewing diffs; in agent sessions, failing test must exist before implementation lands in the same PR.

## Schema conventions

| Pattern       | Naming                                       | Example                   |
| ------------- | -------------------------------------------- | ------------------------- |
| Entity        | `<entity>Schema`                             | `noteSchema`              |
| Create body   | `create<Entity>Schema`                       | `createNoteSchema`        |
| List response | `<entities>ListResponseSchema`               | `notesListResponseSchema` |
| Types         | `type Entity = z.infer<typeof entitySchema>` | co-located in same file   |

Keep request and response schemas separate when shapes differ.

## API conventions

- Extract the Hono app to a testable module (`app.ts`); `index.ts` only calls `serve`.
- Parse request bodies with request schemas; parse handler output with response schemas before `c.json`.
- Return `400` with a JSON error body when `parse` throws on input (do not leak stack traces).

## Web conventions

- Put fetch/mutation helpers in `apps/web/src/lib/` (or next to the route if tiny).
- TanStack Query `queryFn` / `mutationFn` call helpers that return schema-validated data.
- TanStack Form: validate with the same `create*Schema` the API uses.
- Component tests are optional; prefer testing pure helpers at the contract edge.

## E2E conventions

Follow `AGENTS.md` Playwright locator rules.

**Current (until fork #12):** one happy-path e2e per user-visible feature.

**Fork #12 (planned):** min **1 happy + 1 failure-path** e2e per feature; scenarios approved in `PLAN.md` § Acceptance scenarios before implement. See `WORKFLOW.md` § Fork #12.

## Reference slice

The in-repo **Notes** feature demonstrates the full stack:

- `packages/schemas/src/note.ts` — contracts + co-located Vitest
- `packages/api/src/app.ts` — routes validated with `@scaffold/schemas`
- `apps/web/src/lib/notes.ts` — client helpers + tests
- `apps/web/src/routes/notes.tsx` — Query + Form UI
- `tests/e2e/notes.spec.ts` — create note, see it in the list

Use it as a template; replace with product features during kickoff.

## Done

Same as `AGENTS.md`: from repo root, `pnpm typecheck`, `pnpm lint`, and `pnpm test` must exit zero.
