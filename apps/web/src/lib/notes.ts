import {
  createNoteSchema,
  noteSchema,
  notesListResponseSchema,
  type CreateNoteInput,
  type Note,
  type NotesListResponse,
} from '@scaffold/schemas';

export async function fetchNotes(): Promise<NotesListResponse> {
  const response = await fetch('/api/notes');

  if (!response.ok) {
    throw new Error('Failed to fetch notes');
  }

  const json: unknown = await response.json();
  return notesListResponseSchema.parse(json);
}

export async function createNote(input: CreateNoteInput): Promise<Note> {
  const body = createNoteSchema.parse(input);

  const response = await fetch('/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error('Failed to create note');
  }

  const json: unknown = await response.json();
  return noteSchema.parse(json);
}
