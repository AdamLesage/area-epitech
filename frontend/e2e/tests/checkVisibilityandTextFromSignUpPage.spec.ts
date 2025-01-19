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
  await page.getByLabel('signin-redirect-link').click();
  await page.getByLabel('signup-redirect-link').click();
  await expect(page.getByRole('banner')).toContainText('Sign Up');
  await expect(page.getByRole('banner')).toContainText('Please enter your details to sign up.');
  await expect(page.locator('label')).toContainText('I agree to the Terms');
  await expect(page.getByLabel('agree-terms-router-link')).toContainText('Terms');
  await expect(page.locator('form')).toContainText('Already have an account? Login');
  await expect(page.getByLabel('signin-redirect-link')).toContainText('Login');
  await expect(page.locator('label')).toContainText('I agree to the Terms');
  await expect(page.getByLabel('agree-terms-router-link')).toContainText('Terms');
  await expect(page.getByLabel('sign-up-form-button')).toContainText('Sign Up');
  await expect(page.getByLabel('auth-buttonmdi:github')).toBeVisible();
  await expect(page.getByLabel('auth-buttonic:baseline-discord')).toBeVisible();
  await expect(page.getByLabel('auth-buttonflat-color-icons:')).toBeVisible();
  await expect(page.getByLabel('auth-buttonlogos:spotify-icon')).toBeVisible();
  await expect(page.locator('input[name="password"]')).toBeVisible();
  await expect(page.getByText('Sign UpPlease enter your details to sign up.OR I agree to the Terms Sign Up')).toBeVisible();
  await expect(page.getByPlaceholder('Enter your email...')).toBeVisible();
  await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();
  await expect(page.locator('form svg').first()).toBeVisible();
  await expect(page.locator('form svg').nth(1)).toBeVisible();
  await expect(page.getByText('I agree to the Terms')).toBeVisible();
  await expect(page.getByLabel('I agree to the Terms')).toBeVisible();
  await expect(page.getByLabel('sign-up-form-button')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Already have an account?' })).toBeVisible();
  await expect(page.getByRole('img').first()).toBeVisible();
  await expect(page.getByRole('img').first()).toBeVisible();
  await expect(page.getByRole('img').first()).toBeVisible();
});