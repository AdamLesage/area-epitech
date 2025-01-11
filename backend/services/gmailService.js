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

/**
 * @brief Processes webhook notifications for Dropbox and triggers corresponding actions.
 * This function retrieves active Dropbox-related actions for a target user,
 * based on the provided webhook data. It pushes these actions to a Redis queue
 * for further processing by a worker.
 * @param req The HTTP request containing the webhook payload.
 * @param res The HTTP response to indicate success or failure.
 * @return A 200 status code on success or a 500 status code on failure.
 * 
 * @author Romain Chevallier
 */
router.post('/webhook', async (req, res) => {
    try {
        const message = req.body.message;
        const messageData = Buffer.from(message.data, 'base64').toString('utf8');
        const notification = JSON.parse(messageData);

        const activeGmailActions = await prisma.actionReaction.findMany({
            where: {
                isActive: true,
                action: {
                    service: {
                        name: "gmail",
                    },
                },
            },
        });

        const promises = activeGmailActions.map(async (action) => {
            // Push each action to the Redis queue
            console.log("send to worker", action.uuid)
            await redis.lpush(action.uuid, JSON.stringify(notification));
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