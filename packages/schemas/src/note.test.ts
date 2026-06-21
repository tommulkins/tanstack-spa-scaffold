import { describe, expect, it } from 'vitest';

import {
  createNoteSchema,
  noteSchema,
  notesListResponseSchema,
} from './note.js';

describe('noteSchema', () => {
  it('accepts a valid note', () => {
    expect(
      noteSchema.parse({
        id: '550e8400-e29b-41d4-a716-446655440000',
        text: 'Hello',
        createdAt: '2026-01-01T12:00:00.000Z',
      }),
    ).toMatchObject({ text: 'Hello' });
  });

  it('rejects empty text', () => {
    expect(() =>
      noteSchema.parse({
        id: '550e8400-e29b-41d4-a716-446655440000',
        text: '',
        createdAt: '2026-01-01T12:00:00.000Z',
      }),
    ).toThrow();
  });
});

describe('createNoteSchema', () => {
  it('accepts non-empty trimmed text', () => {
    expect(createNoteSchema.parse({ text: '  Buy milk  ' })).toEqual({
      text: 'Buy milk',
    });
  });

  it('rejects whitespace-only text', () => {
    expect(() => createNoteSchema.parse({ text: '   ' })).toThrow();
  });
});

describe('notesListResponseSchema', () => {
  it('accepts an empty list', () => {
    expect(notesListResponseSchema.parse({ notes: [] })).toEqual({ notes: [] });
  });
});
