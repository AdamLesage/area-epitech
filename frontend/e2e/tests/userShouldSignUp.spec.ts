import { test } from '@playwright/test';
import { utilsTestingFunctions } from './utilsTestingFunctions.js';

test.use({
    viewport: {
        height: 1080,
        width: 1920
    }
});

let code = '';

test('test', async ({ page }) => {
    await utilsTestingFunctions.signIn(page);
    await utilsTestingFunctions.deleteAccount(page);
});
