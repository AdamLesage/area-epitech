/*
** EPITECH PROJECT, 2025
** area-epitech
** File description:
** areaService
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

router.post('/webhook', async (req, res) => {
    try {
        // Fetch all actionReactions that are active and have the service "area"
        console.log("receive webhook", req.body);
        const activeAreaActions = await prisma.actionReaction.findMany({
            where: {
                isActive: true,
                action: {
                    service: {
                        name: "area",
                    },
                },
            },
        });

        const promises = activeAreaActions.map(async (action) => {
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

