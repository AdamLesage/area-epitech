import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto('http://area-workspace.fr:8081/#/');
    await page.waitForTimeout(2000);
    await page.getByRole('heading', { name: 'Services', exact: true }).click();
    await page.getByLabel('Explore spotify').click();
    await expect(page.locator('#app')).toContainText('SPOTIFY');
});