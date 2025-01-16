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

// Verify the webhook
router.post('/webhook', async (req, res) => {
    try {
        const actionName = `${req.body.object_type}.${req.body.aspect_type}`;
        // const actionName = `${req.body.aspect_type}.${req.body.object_type}`;

        console.log("receive strava webhook", actionName)
        // get active strava area
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
            // Push each action to the Redis queue
            console.log("send to worker", action.uuid)
            await redis.lpush(action.uuid, JSON.stringify({event: actionName, data: req.body}));
        });

        await Promise.all(promises);

        // Send a success response
        return res.status(200).send('Webhook processed successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error receiving webhook: ${error.message}`);
    }
});

// Adds support for GET requests to our webhook
router.get('/webhook', (req, res) => {
    // Your verify token. Should be a random string.
    const VERIFY_TOKEN = "STRAVA";
    // Parses the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
    // Debug print
    console.log("Received GET webhook request:", req.query);
    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
        console.log('mode:', mode, 'token:', token);
        // Verifies that the mode and token sent are valid
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.json({ "hub.challenge": challenge });
        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            console.log('WEBHOOK_VERIFICATION_FAILED');
            res.sendStatus(403);
        }
    } else {
        console.log('INVALID_REQUEST');
        res.json({ "Message": "Invalid Request" });
    }
});



module.exports = router;
