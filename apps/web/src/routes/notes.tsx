import { createNoteSchema } from '@scaffold/schemas';
import { useForm } from '@tanstack/react-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';

import { createNote, fetchNotes } from '../lib/notes.js';
import { formatFieldError } from '../lib/format-field-error.js';

export const Route = createFileRoute('/notes')({
  component: NotesPage,
});

function NotesPage() {
  const queryClient = useQueryClient();

  const notes = useQuery({
    queryKey: ['notes'],
    queryFn: fetchNotes,
  });

  const addNote = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const form = useForm({
    defaultValues: { text: '' },
    onSubmit: async ({ value }) => {
      await addNote.mutateAsync({ text: value.text });
      form.reset();
    },
  });

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <Link
          to="/"
          className="text-sm text-slate-400 underline-offset-4 hover:text-slate-200 hover:underline"
        >
          ← Home
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight">Notes</h1>
        <p className="text-slate-300">
          Reference TDD slice — shared Zod contracts from API to form.
        </p>
      </div>

      <form
        className="flex flex-col gap-3 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
      >
        <form.Field
          name="text"
          validators={{
            onChange: createNoteSchema.shape.text,
          }}
        >
          {(field) => (
            <div className="flex flex-1 flex-col gap-1">
              <label htmlFor="note-text" className="text-sm text-slate-400">
                New note
              </label>
              <input
                id="note-text"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100"
                aria-invalid={field.state.meta.errors.length > 0}
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-red-400" role="alert">
                  {field.state.meta.errors.map(formatFieldError).join(', ')}
                </p>
              )}
            </div>
          )}
        </form.Field>
        <button
          type="submit"
          className="self-end rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 disabled:opacity-50 sm:self-auto"
          disabled={addNote.isPending}
        >
          Add note
        </button>
      </form>

      {notes.isLoading && (
        <p className="text-sm text-slate-400" aria-live="polite">
          Loading notes…
        </p>
      )}

      {notes.isError && (
        <p className="text-sm text-red-400" role="alert">
          Could not load notes.
        </p>
      )}

      {notes.isSuccess && (
        <ul className="space-y-2" aria-label="Notes list">
          {notes.data.notes.length === 0 ? (
            <li className="text-sm text-slate-400">No notes yet.</li>
          ) : (
            notes.data.notes.map((note) => (
              <li
                key={note.id}
                className="rounded-md border border-slate-800 px-3 py-2 text-slate-100"
              >
                {note.text}
              </li>
            ))
          )}
        </ul>
      )}
    </section>
  );
}
