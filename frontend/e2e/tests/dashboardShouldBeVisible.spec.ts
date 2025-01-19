import { test, expect } from '@playwright/test';
import { utilsTestingFunctions } from './utilsTestingFunctions.js';

test.use({
    viewport: {
        height: 1080,
        width: 1920
    }
});

test('test', async ({ page }) => {
    await utilsTestingFunctions.signIn(page);
    await expect(page.locator('#app')).toContainText('MY AREA0 Area');
    await expect(page.locator('#area-content').getByLabel('Explore github')).toBeVisible();
    await expect(page.locator('#area-content').getByLabel('Explore dropbox')).toBeVisible();
    await expect(page.locator('#area-content').getByLabel('Explore spotify')).toBeVisible();
    await expect(page.locator('#area-content').getByLabel('Explore gmail')).toBeVisible();
    await expect(page.locator('#area-content').getByLabel('Explore strava')).toBeVisible();
    await expect(page.locator('#area-content').getByLabel('Explore discord')).toBeVisible();
    await expect(page.locator('#area-content').getByLabel('Explore timer')).toBeVisible();
    await expect(page.locator('#area-content').getByLabel('Explore news')).toBeVisible();
    await expect(page.locator('#area-content').getByLabel('Explore area')).toBeVisible();
    await expect(page.getByRole('contentinfo')).toContainText('CONTACT US');
    await expect(page.getByText('ExploreMy AreaWorkshop')).toBeVisible();
    await utilsTestingFunctions.deleteAccount(page);
});
