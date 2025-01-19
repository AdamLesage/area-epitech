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
  await expect(page.locator('.w-36 > path')).toBeVisible();
  await expect(page.locator('#app')).toContainText('MY AREA');
  await expect(page.locator('h2')).toContainText('0 Area');
  await expect(page.locator('#app')).toContainText('No areas found');
  await expect(page.locator('#app')).toContainText('You have not created any areas yet.');
  await expect(page.locator('#main-content')).toContainText('Explore');
  await expect(page.getByText('github4.8 by 250k+ reviews4.8')).toBeVisible();
  await expect(page.locator('#main-content')).toContainText('github4.8 by 250k+ reviews4.8');
  await expect(page.getByText('dropbox2.5 by 100+ reviews2.5')).toBeVisible();
  await expect(page.locator('#main-content')).toContainText('dropbox2.5 by 100+ reviews2.5');
  await expect(page.getByText('spotify4.8 by 250k+ reviews4.8')).toBeVisible();
  await expect(page.locator('#main-content')).toContainText('spotify4.8 by 250k+ reviews4.8');
  await expect(page.getByText('area5 by 40k+ reviews5')).toBeVisible();
  await expect(page.locator('#main-content')).toContainText('area5 by 40k+ reviews5');
  await expect(page.getByText('gmail4.5 by 450k+ reviews4.5')).toBeVisible();
  await expect(page.locator('#main-content')).toContainText('gmail4.5 by 450k+ reviews4.5');
  await expect(page.getByText('strava4.8 by 250k+ reviews4.8')).toBeVisible();
  await expect(page.locator('#main-content')).toContainText('strava4.8 by 250k+ reviews4.8');
  await expect(page.getByText('discord4.8 by 250k+ reviews4.8')).toBeVisible();
  await expect(page.locator('#main-content')).toContainText('discord4.8 by 250k+ reviews4.8');
  await expect(page.getByText('timer4.8 by 250k+ reviews4.8')).toBeVisible();
  await expect(page.locator('#main-content')).toContainText('timer4.8 by 250k+ reviews4.8');
  await expect(page.getByText('news4.8 by 250k+ reviews4.8')).toBeVisible();
  await expect(page.locator('#main-content')).toContainText('news4.8 by 250k+ reviews4.8');
  await expect(page.locator('#area-content').getByLabel('Explore github')).toBeVisible();
  await expect(page.locator('#area-content').getByLabel('Explore dropbox')).toBeVisible();
  await expect(page.locator('#area-content').getByLabel('Explore spotify')).toBeVisible();
  await expect(page.locator('#area-content').getByLabel('Explore area')).toBeVisible();
  await expect(page.locator('#area-content').getByLabel('Explore gmail')).toBeVisible();
  await expect(page.locator('#area-content').getByLabel('Explore news')).toBeVisible();
  await expect(page.locator('#area-content').getByLabel('Explore timer')).toBeVisible();
  await expect(page.locator('#area-content').getByLabel('Explore discord')).toBeVisible();
  await expect(page.locator('#area-content').getByLabel('Explore strava')).toBeVisible();
  await utilsTestingFunctions.deleteAccount(page);

});