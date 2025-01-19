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
    await page.getByLabel('Edit Profile').click();
    await expect(page.getByRole('img', { name: 'Profile Picture', exact: true })).toBeVisible();
    await expect(page.getByRole('heading')).toContainText('Edit Profile');
    await expect(page.locator('#app')).toContainText('Edit ProfileProfile NameBirth DatePhone NumberBio Save Changes Cancel Delete Account');
    await expect(page.getByText('Edit ProfileProfile NameBirth')).toBeVisible();
    await expect(page.getByLabel('save-user-edit-button')).toContainText('Save Changes');
    await expect(page.getByLabel('cancel-user-edit-button')).toContainText('Cancel');
    await expect(page.getByLabel('delete-user-button')).toContainText('Delete Account');
    await expect(page.getByLabel('save-user-edit-button')).toBeVisible();
    await expect(page.getByLabel('cancel-user-edit-button')).toBeVisible();
    await expect(page.getByLabel('delete-user-button')).toBeVisible();
    await page.getByLabel('upload button').click();
    await page.getByRole('img', { name: 'Option 2' }).click();
    await expect(page.getByRole('img', { name: 'Profile Picture', exact: true })).toBeVisible();
    await page.getByLabel('upload button').click();
    await page.getByRole('img', { name: 'Option 1' }).click();
    await expect(page.getByRole('img', { name: 'Profile Picture', exact: true })).toBeVisible();
    await page.getByLabel('upload button').click();
    await expect(page.getByRole('img', { name: 'Option 1' })).toBeVisible();
    await expect(page.getByRole('img', { name: 'Option 2' })).toBeVisible();
    await expect(page.getByRole('img', { name: 'Option 3' })).toBeVisible();
    await expect(page.getByRole('img', { name: 'Option 4' })).toBeVisible();
    await expect(page.getByRole('img', { name: 'Option 5' })).toBeVisible();
    await expect(page.getByRole('img', { name: 'Option 6' })).toBeVisible();
    await expect(page.getByRole('img', { name: 'Option 7' })).toBeVisible();
    await expect(page.getByRole('img', { name: 'Option 8' })).toBeVisible();
    await expect(page.getByRole('img', { name: 'Option 9' })).toBeVisible();
    await page.getByRole('img', { name: 'Option 4' }).click();
    await expect(page.getByRole('img', { name: 'Profile Picture', exact: true })).toBeVisible();
    await page.getByLabel('upload button').click();
    await page.getByRole('img', { name: 'Option 5' }).click();
    await expect(page.getByRole('img', { name: 'Profile Picture', exact: true })).toBeVisible();
    await page.getByLabel('upload button').click();
    await page.getByRole('img', { name: 'Option 6' }).click();
    await expect(page.getByRole('img', { name: 'Profile Picture', exact: true })).toBeVisible();
    await page.getByLabel('upload button').click();
    await page.getByRole('img', { name: 'Option 7' }).click();
    await expect(page.getByRole('img', { name: 'Profile Picture', exact: true })).toBeVisible();
    await page.getByLabel('upload button').click();
    await page.getByRole('img', { name: 'Option 8' }).click();
    await expect(page.getByRole('img', { name: 'Profile Picture', exact: true })).toBeVisible();
    await page.getByLabel('upload button').click();
    await page.getByRole('img', { name: 'Option 9' }).click();
    await expect(page.getByRole('img', { name: 'Profile Picture', exact: true })).toBeVisible();
    await page.getByLabel('save-user-edit-button').click();
    await expect(page.getByRole('img', { name: 'Profile Picture', exact: true })).toBeVisible();
    await utilsTestingFunctions.deleteAccount(page);

});