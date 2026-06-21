import { z } from 'zod';

export const noteSchema = z.object({
  id: z.uuid(),
  text: z.string().min(1).max(500),
  createdAt: z.iso.datetime(),
});

export type Note = z.infer<typeof noteSchema>;

export const createNoteSchema = z.object({
  text: z.string().trim().min(1, 'Text is required').max(500),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;

export const notesListResponseSchema = z.object({
  notes: z.array(noteSchema),
});

export type NotesListResponse = z.infer<typeof notesListResponseSchema>;
