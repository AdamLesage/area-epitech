import { test, expect } from '@playwright/test';

test.use({
    viewport: {
        height: 1080,
        width: 1920
    }
});

test('test', async ({ page }) => {
    await page.goto('http://localhost:8081/');
    await page.getByRole('navigation').click();
    await expect(page.getByRole('navigation')).toContainText('About us');
    await expect(page.getByRole('navigation')).toContainText('About usHowServicesReviews');
    await expect(page.getByRole('navigation')).toContainText('AREA');
    await expect(page.locator('#about-us')).toContainText('We are a team of 5 developers currently in Tek3 at Epitech, working on an exciting project called AREA (Automated Reactive Event Application). AREA is a web application designed to perform automated actions triggered by user-defined events. Our stack includes Express.js for the backend and Vue.js for the frontend, allowing us to build a dynamic and responsive system. We have a timeline of 9 weeks to bring this project to life and make it a success!');
    await page.locator('#icons rect').first().click();
    await expect(page.locator('#icons')).toContainText('Our Server uses ExpressJs Version:');
    await expect(page.locator('#how-it-works')).toContainText('# HOW IT WORKS');
    await expect(page.locator('#how-it-works')).toContainText('Choose an Action');
    await expect(page.locator('#how-it-works')).toContainText('Select an event from your favorite service. For example, "New song added to Spotify playlist."');
    await expect(page.locator('#how-it-works')).toContainText('Define a Reaction');
    await expect(page.locator('#how-it-works')).toContainText('Set the automated task you want to happen. For example, "Save song details to Dropbox."');
    await expect(page.locator('#how-it-works')).toContainText('Let US Work');
    await expect(page.locator('#how-it-works')).toContainText('Sit back and relax as our app automates your workflows seamlessly.');
    await page.getByLabel('showDetails-How').click();
    await expect(page.locator('#how-it-works')).toContainText('Detailed Explanation');
    await expect(page.locator('#how-it-works')).toContainText('AREA operates by connecting various online services and enabling users to automate workflows effortlessly. Here\'s how you can make the most of it:');
    await expect(page.getByRole('list')).toContainText('Actions: Actions are events like a new file upload, an email receipt, or a new Spotify song.');
    await expect(page.locator('#how-it-works')).toContainText('Explore all the services below for more examples and infos.');
    await expect(page.locator('#services')).toContainText('# SERVICES');
    await page.getByLabel('explore-all-services').click();
    await page.getByLabel('back-button-nav').click();
    await expect(page.getByText('What do you think of our website ?Add a review')).toBeVisible();
    await expect(page.locator('#reviews')).toContainText('# REVIEWS');
    await expect(page.locator('#reviews')).toContainText('"I love AREA! It\'s so easy to use and it makes my life so much easier. I can\'t imagine my life without it now." @anonymous "AREA is a game changer! I\'ve been using it for a few weeks now and I\'m already seeing the benefits. I highly recommend it." @anonymous "AREA is amazing! It\'s so simple to set up and it works like a charm. I\'m so glad I found it." @anonymous');
    await expect(page.getByRole('contentinfo')).toContainText('contact.area.ownspace@gmail.com');
    await expect(page.locator('#about-us')).toContainText('Adam Lesage Scrum MasterEnsures the project stays on track and meets its goals.');
    await expect(page.locator('#about-us')).toContainText('Mathieu Mazeau Front Developer and DesignerCreates and optimizes the front-end experience.');
    await expect(page.locator('#about-us')).toContainText('Romain Chevallier DevOps EngineerHandles backend systems and automation.');
    await expect(page.locator('#about-us')).toContainText('Victor Hritsea Backend DeveloperBuilds and manages the API backend.');
    await expect(page.locator('#about-us')).toContainText('Tugdual de Reviers Front DeveloperCreates and optimizes the front-end experience.');
});
