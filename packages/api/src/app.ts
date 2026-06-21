import {
  createNoteSchema,
  healthResponseSchema,
  noteSchema,
  notesListResponseSchema,
  type Note,
} from '@scaffold/schemas';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

const notes: Note[] = [];

export function createApp() {
  const app = new Hono();

  app.use(
    '*',
    cors({
      origin: [
        'http://127.0.0.1:4173',
        'http://localhost:4173',
        'http://127.0.0.1:4174',
        'http://localhost:4174',
      ],
    }),
  );

  app.get('/health', (c) => {
    const body = healthResponseSchema.parse({ status: 'ok' });
    return c.json(body);
  });

  app.get('/notes', (c) => {
    const body = notesListResponseSchema.parse({ notes });
    return c.json(body);
  });

  app.post('/notes', async (c) => {
    let json: unknown;
    try {
      json = await c.req.json();
    } catch {
      return c.json({ error: 'Invalid JSON body' }, 400);
    }

    let input;
    try {
      input = createNoteSchema.parse(json);
    } catch {
      return c.json({ error: 'Invalid note' }, 400);
    }

    const note = noteSchema.parse({
      id: crypto.randomUUID(),
      text: input.text,
      createdAt: new Date().toISOString(),
    });

    notes.push(note);
    return c.json(note, 201);
  });

  return app;
}

export function resetNotesForTests() {
  notes.length = 0;
}

export const app = createApp();
