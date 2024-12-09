const express = require('express');
const router = express.Router();
const Prisma = require('@prisma/client');
const prisma = new Prisma.PrismaClient;

router.post('/webhook', async (req, res) => {
    try {
        const event = req.headers['x-github-event'];
        const action = req.body['action'];
        const eventSender = req.body.sender?.login;

        console.log(`New event: ${event} ${action} received from ${eventSender}`);

        // Check if service exists
        let service = await prismaClient.service.findUnique({
            where: { name: 'Github' },
        });

        if (!service) {
            service = await prismaClient.service.create({
                data: {
                    name: 'Github',
                    logo: './frontend/src/assets/github_logo.png', // Need to put correct path for the asset
                },
            });
        }

        // Create new reaction
        const reaction = await prismaClient.reaction.create({
            data: {
                name: `Reaction for ${event} ${action}`,
                description: `Triggered by ${event} event and ${action} action`,
                endpoint: `/api/reactions/github/${event}/${action}`,
                service: {
                    connect: { id: service.id },
                },
            },
        });

        console.log('New reaction created :', reaction);

        res.status(200).send('Webhook received and processed successfully');
    } catch (error) {
        res.status(500).send('Internal server error');
    }
});

module.exports = router;
