/*
** EPITECH PROJECT, 2024
** area-epitech
** File description:
** githubService
*/

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

router.post('/webhook', async (req, res) => {
    try {
        const event = req.headers['x-github-event'];
        const action = req.body['action'];
        const eventSender = req.body.sender?.login;

        console.log(`New event: ${event} ${action} received from ${eventSender}`);

        // Check if service exists
        let service = await prisma.service.findUnique({
            where: {
                name: 'Github',
            },
        });

        if (!service) {
            service = await prisma.service.create({
                data: {
                    name: 'Github',
                    logo: './frontend/src/assets/github_logo.png', // Need to put correct path for the asset
                },
            });
        }

        // // Create new reaction
        const reaction = await prisma.reaction.create({
            data: {
                name: `Reaction for ${event} ${action}`,
                description: `Triggered by ${event} event and ${action} action`,
                endpoint: `/api/github/webhook`,
                service: {
                    connect: { id: service.id },
                },
            },
        });

        res.status(200).send('Webhook received and processed successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error: ${error}`);
    }
});

module.exports = router;
