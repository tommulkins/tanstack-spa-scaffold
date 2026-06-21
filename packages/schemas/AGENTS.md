# @scaffold/schemas

Nearest agent instructions for shared Zod contracts. Shared rules: [`../../AGENTS.md`](../../AGENTS.md).

## Role

Single source of truth for boundary types and runtime validation. Web and API import from `@scaffold/schemas` — never duplicate TS interfaces for the same boundary.

## Layout

- One module per domain (`health.ts`, `note.ts`, …)
- Export public API from `src/index.ts`
- Co-locate `*.test.ts` — **write schema tests first** in the TDD order

## Conventions

- Entity: `noteSchema` + `type Note = z.infer<typeof noteSchema>`
- Create input: `createNoteSchema` when request shape differs from response
- List response: `notesListResponseSchema` when wrapped

## Testing

```sh
pnpm --filter @scaffold/schemas test:unit
pnpm --filter @scaffold/schemas exec vitest run -t "<pattern>"
```

Assert `parse` accepts valid payloads and rejects invalid shapes.
