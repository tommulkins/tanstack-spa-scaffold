import { afterEach, describe, expect, it, vi } from 'vitest';

import { createNote, fetchNotes } from './notes.js';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('fetchNotes', () => {
  it('parses a valid notes list response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          notes: [
            {
              id: '550e8400-e29b-41d4-a716-446655440000',
              text: 'Hello',
              createdAt: '2026-01-01T12:00:00.000Z',
            },
          ],
        }),
      }),
    );

    await expect(fetchNotes()).resolves.toEqual({
      notes: [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          text: 'Hello',
          createdAt: '2026-01-01T12:00:00.000Z',
        },
      ],
    });
  });

  it('throws when the response is not ok', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
      }),
    );

    await expect(fetchNotes()).rejects.toThrow('Failed to fetch notes');
  });
});

describe('createNote', () => {
  it('posts validated input and parses the created note', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        id: '550e8400-e29b-41d4-a716-446655440000',
        text: 'Buy milk',
        createdAt: '2026-01-01T12:00:00.000Z',
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(createNote({ text: '  Buy milk  ' })).resolves.toMatchObject({
      text: 'Buy milk',
    });

    expect(fetchMock).toHaveBeenCalledWith('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'Buy milk' }),
    });
  });

  it('rejects invalid input before calling fetch', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(createNote({ text: '   ' })).rejects.toThrow();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
