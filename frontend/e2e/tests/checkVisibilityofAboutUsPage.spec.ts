import { test, expect } from '@playwright/test';

test.use({
  viewport: {
    height: 1080,
    width: 1920
  }
});

test('test', async ({ page }) => {
  await page.goto('http://localhost:8081/');
  await expect(page.locator('path:nth-child(3)').first()).toBeVisible();
  await expect(page.locator('.w-80 > path').first()).toBeVisible();
  await expect(page.locator('.w-80 > path:nth-child(2)')).toBeVisible();
  await expect(page.getByRole('navigation').getByRole('heading', { name: 'AREA' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'About us', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'How', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Services', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Reviews', exact: true })).toBeVisible();
  await expect(page.getByLabel('login-text-button-router-link')).toBeVisible();
  await expect(page.getByLabel('signup-text-button-router-link')).toBeVisible();
  await expect(page.locator('#icons').getByRole('img')).toBeVisible();
  await expect(page.locator('#icons path').nth(2)).toBeVisible();
  await expect(page.locator('#icons rect').first()).toBeVisible();
  await expect(page.locator('svg').filter({ hasText: 'Project EndFinal' })).toBeVisible();
  await expect(page.getByLabel('project-start-button')).toBeVisible();
  await expect(page.getByLabel('final-product-button')).toBeVisible();
  await expect(page.getByLabel('mvp-button')).toBeVisible();
  await expect(page.getByLabel('project-end-button')).toBeVisible();
  await expect(page.getByText('We are a team of 5 developers')).toBeVisible();
  await expect(page.getByText('Adam Lesage Scrum')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Mathieu Mazeau' })).toBeVisible();
  await expect(page.getByText('Mathieu Mazeau Front')).toBeVisible();
  await expect(page.getByText('Romain Chevallier DevOps')).toBeVisible();
  await expect(page.getByText('Victor Hritsea Backend')).toBeVisible();
  await expect(page.getByText('Tugdual de Reviers Front')).toBeVisible();
  await expect(page.getByRole('heading', { name: '# HOW IT WORKS' })).toBeVisible();
  await expect(page.locator('#how-it-works svg').first()).toBeVisible();
  await expect(page.locator('#how-it-works path').nth(2)).toBeVisible();
  await expect(page.locator('#how-it-works path').nth(3)).toBeVisible();
  await expect(page.getByLabel('Explore github')).toBeVisible();
  await expect(page.getByLabel('Explore dropbox')).toBeVisible();
  await expect(page.getByLabel('Explore spotify')).toBeVisible();
  await expect(page.getByLabel('Explore area')).toBeVisible();
  await expect(page.getByLabel('explore-all-services')).toBeVisible();
  await page.locator('div:nth-child(6) > div > .w-12').first().click();
  await expect(page.getByLabel('Explore gmail')).toBeVisible();
  await page.locator('div:nth-child(6) > div > .w-12').first().click();
  await expect(page.getByLabel('Explore strava')).toBeVisible();
  await page.locator('div:nth-child(6) > div > .w-12').first().click();
  await expect(page.getByLabel('Explore discord')).toBeVisible();
  await page.locator('div:nth-child(6) > div > .w-12').first().click();
  await expect(page.getByLabel('Explore timer')).toBeVisible();
  await page.locator('div:nth-child(6) > div > .w-12').first().click();
  await expect(page.getByLabel('Explore news')).toBeVisible();
  await expect(page.getByText('CONTACT UScontact.area.')).toBeVisible();
});