import { test, expect } from '@playwright/test';

test.use({
    viewport: {
        height: 1080,
        width: 1920
    }
});

test('test', async ({ page }) => {
    await page.goto('http://localhost:8081/');
    await page.getByRole('heading', { name: 'About us', exact: true }).click();
    await page.getByRole('heading', { name: 'How', exact: true }).click();
    await page.getByRole('heading', { name: 'Services', exact: true }).click();
    await page.getByRole('heading', { name: 'Reviews', exact: true }).click();
    await page.getByRole('heading', { name: 'How', exact: true }).click();
    await page.getByRole('heading', { name: 'About us', exact: true }).click();
    await page.getByRole('heading', { name: 'Reviews', exact: true }).click();
    await page.getByRole('heading', { name: 'About us', exact: true }).click();
});