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
  await expect(page.getByRole('img', { name: 'Profile Picture', exact: true })).toBeVisible();
  await expect(page.locator('#app')).toContainText('0');
  await expect(page.locator('#app')).toContainText('0Actions Created0Actions On0Actions Off');
  await expect(page.locator('#app')).toContainText('Connected Platforms');
  await expect(page.getByLabel('connected-api-button').first()).toBeVisible();
  await expect(page.getByLabel('connected-api-button').nth(1)).toBeVisible();
  await expect(page.getByLabel('add-connections-button')).toContainText('Add Connections');
  await page.getByText('ExploreMy AreaWorkshopEdit').click();
  await utilsTestingFunctions.deleteAccount(page);

});