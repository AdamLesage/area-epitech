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
    await page.getByRole('img', { name: 'User profile picture' }).click();
    await page.getByLabel('add-connections-button').click();
    await expect(page.getByRole('heading')).toContainText('Add a new account');
    await expect(page.locator('#app')).toContainText('Add a new account');
    await expect(page.locator('div').filter({ hasText: 'Add a new account' }).nth(2)).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Add a new account' })).toBeVisible();
    await expect(page.getByLabel('Select github')).toBeVisible();
    await expect(page.getByLabel('Select dropbox')).toBeVisible();
    await expect(page.getByLabel('Select spotify')).toBeVisible();
    await expect(page.getByLabel('Select gmail')).toBeVisible();
    await expect(page.getByLabel('Select strava')).toBeVisible();
    await expect(page.getByLabel('Select discord')).toBeVisible();
    await expect(page.getByLabel('Select news')).toBeVisible();
    await expect(page.locator('rect')).toBeVisible();
    await expect(page.getByLabel('nav-buttonExplore')).toBeVisible();
    await expect(page.getByLabel('nav-buttonMy Area')).toBeVisible();
    await expect(page.getByLabel('nav-buttonWorkshop')).toBeVisible();
    await expect(page.getByRole('img', { name: 'User profile picture' })).toBeVisible();
    await page.getByLabel('back-button-nav').click();
    await utilsTestingFunctions.deleteAccount(page);

});