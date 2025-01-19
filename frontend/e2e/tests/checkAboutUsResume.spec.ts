import { test, expect } from '@playwright/test';

test.use({
    viewport: {
        height: 1080,
        width: 1920
    }
});

test('test', async ({ page }) => {
    await page.goto('http://localhost:8081/');
    await expect(page.locator('#about-us')).toContainText('# ABOUT US');
    await expect(page.locator('#about-us')).toContainText('We are a team of 5 developers currently in Tek3 at Epitech, working on an exciting project called AREA (Automated Reactive Event Application). AREA is a web application designed to perform automated actions triggered by user-defined events. Our stack includes Express.js for the backend and Vue.js for the frontend, allowing us to build a dynamic and responsive system. We have a timeline of 9 weeks to bring this project to life and make it a success!');
});