import { expect, test } from '@playwright/test';

test('home page loads and reports API health', async ({ page }) => {
  const healthResponse = page.waitForResponse(
    (response) =>
      response.url().includes('/api/health') && response.status() === 200,
  );

  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: 'Scaffold', level: 1 }),
  ).toBeVisible();

  await healthResponse;

  await expect(page.getByText('API status: ok')).toBeVisible();
});
