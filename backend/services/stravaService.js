/*
** EPITECH PROJECT, 2025
** area-epitech
** File description:
** stravaService
*/

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();
require('dotenv').config();
const Redis = require('ioredis');
const redis = new Redis({
    host: 'redis',
    port: 6379
});

// ACTION
router.post('/strava', async (req, res) => {
    try {
        const { aspect_type, object_type, object_id, updates } = req.body;

        console.log("Received Strava webhook event", { aspect_type, object_type, object_id });

        // Get active actions for Strava
        const activeStravaActions = await prisma.actionReaction.findMany({
            where: {
                isActive: true,
                action: {
                    service: {
                        name: "strava",
                    },
                },
            },
        });

        const promises = activeStravaActions.map(async (action) => {
            // Add each action to the Redis queue
            console.log("Send to worker", action.uuid);
            await redis.lpush(action.uuid, JSON.stringify({
                event: {
                    aspect_type,
                    object_type,
                    object_id,
                    updates
                },
                data: req.body
            }));
        });

        await Promise.all(promises);

        // Respond with success
        return res.status(200).send('Webhook processed successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error receiving webhook: ${error.message}`);
    }
});

// Strava webhook validation
router.get('/strava', (req, res) => {
    const { 'hub.challenge': challenge } = req.query;
    console.log(challenge);

    if (challenge) {
        console.log("Validating Strava webhook challenge", challenge);
        return res.status(200).json({ 'hub.challenge': challenge });
    }

    return res.status(400).send('Missing challenge parameter');
});

module.exports = router;
