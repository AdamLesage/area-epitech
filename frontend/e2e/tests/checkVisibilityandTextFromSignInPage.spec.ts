import { test, expect } from '@playwright/test';

test.use({
  viewport: {
    height: 1080,
    width: 1920
  }
});

test('test', async ({ page }) => {
  await page.goto('http://localhost:8081/');
  await page.getByLabel('signup-text-button-router-link').click();
  await page.getByPlaceholder('Enter your email...').click();
  await page.getByPlaceholder('Enter your email...').fill('ttest87@gmail.com');
  await page.locator('input[name="password"]').click();
  await page.locator('input[name="password"]').fill('ttestttest');
  await page.locator('form svg').first().click();
  await page.getByPlaceholder('•••••••••••••').click();
  await page.getByPlaceholder('•••••••••••••').fill('ttesttest');
  await expect(page.getByRole('banner')).toContainText('Sign Up');
  await expect(page.getByRole('banner')).toContainText('Please enter your details to sign up.');
  await expect(page.getByLabel('auth-buttonmdi:github')).toBeVisible();
  await expect(page.getByLabel('auth-buttonic:baseline-discord')).toBeVisible();
  await expect(page.getByLabel('auth-buttonflat-color-icons:')).toBeVisible();
  await expect(page.getByLabel('auth-buttonlogos:spotify-icon')).toBeVisible();
  await expect(page.locator('form svg').first()).toBeVisible();
  await page.locator('form svg').first().click();
  await expect(page.locator('div').filter({ hasText: /^Passwords must match$/ }).locator('svg')).toBeVisible();
  await expect(page.locator('label')).toContainText('I agree to the Terms');
  await expect(page.getByLabel('I agree to the Terms')).toBeVisible();
  await page.getByLabel('I agree to the Terms').check();
  await expect(page.getByLabel('I agree to the Terms')).toBeVisible();
  await expect(page.getByLabel('sign-up-form-button')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Already have an account?' })).toBeVisible();
  await expect(page.getByLabel('signin-redirect-link')).toBeVisible();
  await expect(page.locator('form')).toContainText('Already have an account? Login');
});