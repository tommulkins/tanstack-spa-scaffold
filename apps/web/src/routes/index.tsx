import { healthResponseSchema } from '@scaffold/schemas';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

async function fetchHealth() {
  const response = await fetch('/api/health');

  if (!response.ok) {
    throw new Error('Health check failed');
  }

  const json: unknown = await response.json();
  return healthResponseSchema.parse(json);
}

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  const health = useQuery({
    queryKey: ['health'],
    queryFn: fetchHealth,
  });

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold tracking-tight">Scaffold</h1>
      <p className="text-slate-300">
        TanStack SPA with a separate Hono API and shared Zod schemas.
      </p>
      <p aria-live="polite" className="text-sm text-slate-400">
        API status: {health.isLoading && 'checking…'}
        {health.isError && 'unavailable'}
        {health.isSuccess && health.data.status}
      </p>
    </section>
  );
}
