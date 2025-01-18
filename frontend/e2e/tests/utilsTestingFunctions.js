import { test, expect } from '@playwright/test';

let code = '';

async function signIn(page) {
    await page.goto('http://area-workspace.fr:8081/#/');
    await page.getByLabel('signup-text-button-router-link').click();
    await page.getByPlaceholder('Enter your email...').click();
    await page.getByPlaceholder('Enter your email...').fill('bidule@gmail.com');
    await page.locator('input[name="password"]').click();
    await page.locator('input[name="password"]').fill('lalalalallala');
    await page.locator('input[name="confirmPassword"]').click();
    await page.locator('input[name="confirmPassword"]').fill('lalalalallala');
    await page.getByLabel('I agree to the Terms').check();
    await page.getByLabel('sign-up-form-button').click();
    await page.getByPlaceholder('Enter your username...').click();
    await page.getByPlaceholder('Enter your username...').fill('lallalallaa');
    await page.getByPlaceholder('Enter a description for your').click();
    await page.getByPlaceholder('Enter a description for your').fill('lalallalaa');
    await page.getByLabel('validate-details-form-button').click();
}

async function deleteAccount(page) {
    await page.getByRole('img', { name: 'User profile picture' }).click();
    await page.getByLabel('Edit Profile').click();
    await page.getByLabel('delete-user-button').click();
    code = await page.getByLabel('verify-code').textContent() || "";
    await page.getByPlaceholder('Enter the code...').click();
    await page.getByPlaceholder('Enter the code...').fill(code);
    await page.getByLabel('delete-account-button').click();
    await expect(page.getByRole('navigation')).toContainText('AREA');
    await expect(page.locator('.w-80')).toBeVisible();

}

export const utilsTestingFunctions = {
    signIn,
    deleteAccount
};