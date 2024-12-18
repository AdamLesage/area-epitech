/*
** EPITECH PROJECT, 2024
** area-epitech
** File description:
** githubService
*/

const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const Redis = require('ioredis');
const redis = new Redis({
    host: 'redis',
    port: 6379
});
let lasteventId = "0"

router.get('/webhook', (req, res) => {
    // Get the 'challenge' parameter from the query string
    console.log("webhook get");
    const challenge = req.query.challenge;

    // Set response headers
    res.set('Content-Type', 'text/plain');
    res.set('X-Content-Type-Options', 'nosniff');

    // Respond with the challenge parameter
    res.send(challenge);
});

router.post('/webhook', async (req, res) => {
    try {
        // Fetch all actionReactions that are active and have the service "dropbox"
        console.log("receive dropbox webhook", req.body)
        // if (lasteventId == req.body.event.id) {
        const activeDropboxActions = await prisma.actionReaction.findMany({
            where: {
                isActive: true,
                action: {
                    service: {
                        name: "dropbox",
                    },
                },
            },
        });

        const promises = activeDropboxActions.map(async (action) => {
            // Push each action to the Redis queue
            console.log("send to worker", action.uuid)
            await redis.lpush(action.uuid, JSON.stringify(req.body));
        });

        await Promise.all(promises);

        // Send a success response
        res.status(200).send('Webhook processed successfully');
    } catch (error) {
        console.error('Error processing webhook:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
