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
  await page.getByLabel('nav-buttonExplore').click();
  await page.getByLabel('nav-buttonMy Area').click();
  await expect(page.locator('#app')).toContainText('MY AREA');
  await expect(page.locator('#app')).toContainText('No areas foundYou have not created any areas yet.');
  await expect(page.getByRole('navigation')).toContainText('ExploreMy AreaWorkshop');
  await utilsTestingFunctions.deleteAccount(page);

});