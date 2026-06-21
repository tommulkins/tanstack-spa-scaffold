import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const webDir = path.join(root, 'apps/web');

process.env.API_HOST ??= '127.0.0.1';
process.env.API_PORT ??= '3101';
process.env.WEB_PORT ??= '4173';
process.env.API_PROXY_TARGET = `http://${process.env.API_HOST}:${process.env.API_PORT}`;

const bin = (packageDir, name) =>
  path.join(root, packageDir, 'node_modules/.bin', name);

const api = spawn(
  bin('packages/api', 'tsx'),
  [path.join(root, 'packages/api/src/index.ts')],
  { cwd: root, env: process.env, stdio: 'inherit' },
);

const web = spawn(
  [
    `${bin('apps/web', 'tsc')} -b`,
    `${bin('apps/web', 'vite')} build`,
    `${bin('apps/web', 'vite')} preview --host 127.0.0.1 --port ${process.env.WEB_PORT}`,
  ].join(' && '),
  { cwd: webDir, env: process.env, stdio: 'inherit', shell: true },
);

const children = [api, web];

const cleanup = () => {
  for (const child of children) {
    child.kill('SIGTERM');
  }
};

process.on('SIGTERM', () => {
  cleanup();
  process.exit(0);
});

process.on('SIGINT', () => {
  cleanup();
  process.exit(0);
});

web.on('exit', (code) => {
  cleanup();
  process.exit(code ?? 0);
});

api.on('exit', (code) => {
  if (code && code !== 0) {
    cleanup();
    process.exit(code);
  }
});
