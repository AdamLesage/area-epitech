import { test, expect } from '@playwright/test';

test.use({
  viewport: {
    height: 1080,
    width: 1920
  }
});

test('test', async ({ page }) => {
  await page.goto('http://localhost:8081/');
  await page.getByLabel('login-text-button-router-link').click();
  await page.getByLabel('signup-redirect-link').click();
  await page.getByLabel('agree-terms-router-link').click();
  await expect(page.locator('.absolute')).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^AREA$/ })).toBeVisible();
  await expect(page.getByLabel('login-text-button-router-link')).toBeVisible();
  await expect(page.getByLabel('signup-text-button-router-link')).toBeVisible();
});