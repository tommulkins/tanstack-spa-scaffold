import { expect, test } from '@playwright/test';

test('creates a note and shows it in the list', async ({ page }) => {
  await page.goto('/notes');

  await expect(
    page.getByRole('heading', { name: 'Notes', level: 1 }),
  ).toBeVisible();

  const createResponse = page.waitForResponse(
    (response) =>
      response.url().includes('/api/notes') &&
      response.request().method() === 'POST' &&
      response.status() === 201,
  );

  await page.getByLabel('New note').fill('Ship fork #3');
  await page.getByRole('button', { name: 'Add note' }).click();

  await createResponse;

  await expect(page.getByRole('list', { name: 'Notes list' })).toContainText(
    'Ship fork #3',
  );
});

test('rejects whitespace-only note without creating one', async ({ page }) => {
  await page.goto('/notes');

  await expect(
    page.getByRole('heading', { name: 'Notes', level: 1 }),
  ).toBeVisible();

  let postSucceeded = false;
  page.on('response', (response) => {
    if (
      response.url().includes('/api/notes') &&
      response.request().method() === 'POST' &&
      response.status() === 201
    ) {
      postSucceeded = true;
    }
  });

  await page.getByLabel('New note').fill('   ');
  await page.getByRole('button', { name: 'Add note' }).click();

  await expect(page.getByRole('alert')).toContainText('Text is required');
  await expect(page.getByRole('list', { name: 'Notes list' })).toContainText(
    'No notes yet.',
  );
  expect(postSucceeded).toBe(false);
});
