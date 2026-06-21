import { describe, expect, it, beforeEach } from 'vitest';

import { app, resetNotesForTests } from './app.js';

describe('GET /notes', () => {
  beforeEach(() => {
    resetNotesForTests();
  });

  it('returns an empty list initially', async () => {
    const response = await app.request('/notes');

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ notes: [] });
  });
});

describe('POST /notes', () => {
  beforeEach(() => {
    resetNotesForTests();
  });

  it('creates a note and lists it', async () => {
    const createResponse = await app.request('/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'Buy milk' }),
    });

    expect(createResponse.status).toBe(201);
    const created = await createResponse.json();
    expect(created).toMatchObject({ text: 'Buy milk' });
    expect(created.id).toEqual(expect.any(String));
    expect(created.createdAt).toEqual(expect.any(String));

    const listResponse = await app.request('/notes');
    const list = await listResponse.json();
    expect(list.notes).toHaveLength(1);
    expect(list.notes[0]).toMatchObject({ text: 'Buy milk' });
  });

  it('returns 400 for invalid input', async () => {
    const response = await app.request('/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: '   ' }),
    });

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: 'Invalid note' });
  });
});

describe('GET /health', () => {
  it('returns ok', async () => {
    const response = await app.request('/health');

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ status: 'ok' });
  });
});
