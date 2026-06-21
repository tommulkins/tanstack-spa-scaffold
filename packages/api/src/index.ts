import { serve } from '@hono/node-server';
import { healthResponseSchema } from '@scaffold/schemas';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

const host = process.env.API_HOST ?? '127.0.0.1';
const port = Number(process.env.API_PORT ?? 3001);

const app = new Hono();

app.use(
  '*',
  cors({
    origin: ['http://127.0.0.1:4173', 'http://localhost:4173'],
  }),
);

app.get('/health', (c) => {
  const body = healthResponseSchema.parse({ status: 'ok' });
  return c.json(body);
});

serve({ fetch: app.fetch, hostname: host, port }, (info) => {
  console.log(`API listening on http://${info.address}:${info.port}`);
});

export default app;
