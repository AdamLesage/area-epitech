import { test, expect } from '@playwright/test';

test.use({
  viewport: {
    height: 1080,
    width: 1920
  }
});

test('test', async ({ page }) => {
  await page.goto('http://localhost:8081/');
  await expect(page.getByRole('navigation')).toContainText('About usHowServicesReviews');
  await expect(page.getByRole('navigation')).toContainText('AREA');
  await expect(page.locator('#about-us')).toContainText('# ABOUT US');
  await expect(page.locator('#about-us')).toContainText('We are a team of 5 developers currently in Tek3 at Epitech, working on an exciting project called AREA (Automated Reactive Event Application). AREA is a web application designed to perform automated actions triggered by user-defined events. Our stack includes Express.js for the backend and Vue.js for the frontend, allowing us to build a dynamic and responsive system. We have a timeline of 9 weeks to bring this project to life and make it a success!');
  await expect(page.locator('#template')).toContainText('Project EndFinal ProductProject StartM.V.P');
  await expect(page.locator('#about-us')).toContainText('Adam Lesage');
  await expect(page.locator('#about-us')).toContainText('Scrum MasterEnsures the project stays on track and meets its goals.');
  await expect(page.locator('#about-us')).toContainText('Mathieu Mazeau');
  await expect(page.locator('#about-us')).toContainText('Front Developer and DesignerCreates and optimizes the front-end experience.');
  await expect(page.locator('#about-us')).toContainText('Romain Chevallier');
  await expect(page.locator('#about-us')).toContainText('Romain Chevallier DevOps EngineerHandles backend systems and automation.');
  await expect(page.locator('#about-us')).toContainText('Victor Hritsea');
  await expect(page.locator('#about-us')).toContainText('Backend DeveloperBuilds and manages the API backend.');
  await expect(page.locator('#about-us')).toContainText('Tugdual de Reviers Front DeveloperCreates and optimizes the front-end experience.');
  await expect(page.locator('#how-it-works')).toContainText('# HOW IT WORKS');
  await expect(page.locator('#how-it-works')).toContainText('Select an event from your favorite service. For example, "New song added to Spotify playlist."');
  await expect(page.locator('#how-it-works')).toContainText('Choose an Action');
  await expect(page.locator('#how-it-works')).toContainText('Define a Reaction');
  await expect(page.locator('#how-it-works')).toContainText('Set the automated task you want to happen. For example, "Save song details to Dropbox."');
  await expect(page.locator('#how-it-works')).toContainText('Sit back and relax as our app automates your workflows seamlessly.');
  await expect(page.getByLabel('Explore github')).toContainText('githubAutomate tasks with Github effortlessly!4.8 by 250k+ reviews4.8');
  await expect(page.getByLabel('Explore dropbox')).toContainText('dropboxAutomate tasks with Dropbox effortlessly!2.5 by 100+ reviews2.5');
  await expect(page.getByLabel('Explore spotify')).toContainText('spotifyAutomate tasks with Spotify effortlessly!4.8 by 250k+ reviews4.8');
  await expect(page.getByLabel('Explore area')).toContainText('areaAutomate tasks with Area effortlessly!5 by 40k+ reviews5');
  await page.locator('div:nth-child(6) > div > .w-12').first().click();
  await page.locator('div:nth-child(6) > div > .w-12').first().click();
  await page.locator('div:nth-child(6) > div > .w-12').first().click();
  await page.locator('div:nth-child(6) > div > .w-12').first().click();
  await expect(page.getByLabel('Explore gmail')).toContainText('gmailAutomate tasks with Gmail effortlessly!4.5 by 450k+ reviews4.5');
  await expect(page.getByLabel('Explore strava')).toContainText('stravaAutomate tasks with Strava effortlessly!4.8 by 250k+ reviews4.8');
  await expect(page.getByLabel('Explore discord')).toContainText('discordAutomate tasks with Discord effortlessly!4.8 by 250k+ reviews4.8');
  await expect(page.getByLabel('Explore timer')).toContainText('timerAutomate tasks with Timer effortlessly!4.8 by 250k+ reviews4.8');
  await expect(page.getByLabel('explore-all-services')).toContainText('Explore all services');
  await expect(page.locator('#reviews')).toContainText('# REVIEWS');
  await expect(page.locator('#reviews')).toContainText('"I love AREA! It\'s so easy to use and it makes my life so much easier. I can\'t imagine my life without it now." @anonymous "AREA is a game changer! I\'ve been using it for a few weeks now and I\'m already seeing the benefits. I highly recommend it." @anonymous "AREA is amazing! It\'s so simple to set up and it works like a charm. I\'m so glad I found it." @anonymous');
  await expect(page.locator('#reviews')).toContainText('What do you think of our website ?');
  await expect(page.getByRole('contentinfo')).toContainText('contact.area.ownspace@gmail.com');
  await expect(page.getByRole('contentinfo')).toContainText('CONTACT US');
  await expect(page.getByRole('contentinfo')).toContainText('Project made at Epitech');
  await expect(page.getByRole('contentinfo')).toContainText('AREA');
});