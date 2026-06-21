import { spawn } from 'node:child_process';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const webPort = process.env.WEB_PORT ?? '4174';
const apiPort = process.env.API_PORT ?? '3101';

function waitForUrl(url, attempts = 120) {
  return new Promise((resolve, reject) => {
    let tries = 0;

    const check = () => {
      tries += 1;
      http
        .get(url, (response) => {
          response.resume();
          resolve(undefined);
        })
        .on('error', () => {
          if (tries >= attempts) {
            reject(new Error(`Timed out waiting for ${url}`));
            return;
          }
          setTimeout(check, 1000);
        });
    };

    check();
  });
}

const server = spawn('node', ['scripts/e2e-webserver.mjs'], {
  cwd: root,
  env: {
    ...process.env,
    API_PORT: apiPort,
    WEB_PORT: webPort,
  },
  stdio: 'inherit',
});

try {
  await waitForUrl(`http://127.0.0.1:${apiPort}/health`);
  await waitForUrl(`http://127.0.0.1:${webPort}`);

  const playwright = spawn(
    path.join(root, 'node_modules/.bin/playwright'),
    ['test'],
    {
      cwd: root,
      env: {
        ...process.env,
        WEB_PORT: webPort,
      },
      stdio: 'inherit',
    },
  );

  playwright.on('close', (code) => {
    server.kill('SIGTERM');
    process.exit(code ?? 0);
  });
} catch (error) {
  server.kill('SIGTERM');
  console.error(error);
  process.exit(1);
}
