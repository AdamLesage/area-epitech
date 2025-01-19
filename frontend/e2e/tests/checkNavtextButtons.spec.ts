import { test, expect } from '@playwright/test';

test.use({
  viewport: {
    height: 1080,
    width: 1920
  }
});

test('test', async ({ page }) => {
  await page.goto('http://localhost:8081/');
  await expect(page.getByRole('navigation')).toContainText('About us');
  await expect(page.getByRole('navigation')).toContainText('How');
  await expect(page.getByRole('navigation')).toContainText('Services');
  await expect(page.getByRole('navigation')).toContainText('Reviews');
});