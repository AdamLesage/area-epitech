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
require('dotenv').config();
const Redis = require('ioredis');
const redis = new Redis({
    host: 'redis',
    port: 6379
});

// ACTION
router.post('/webhook', async (req, res) => {
    try {
        const event = req.headers['x-github-event'];
        const action = req.body['action'];
        const actionName = `${event}.${action}`;

        console.log("receive github webhook", actionName)
        console.log('repository:', req.body.repository.full_name);
        console.log('sender:', req.body.sender.login);

        // get active github area
        let activeGithubActions = await prisma.actionReaction.findMany({
            where: {
                isActive: true,
                action: {
                    service: {
                        name: "github",
                    },
                }
            },
        });

        // remove the github actions where the repository is not the same
        activeGithubActions = activeGithubActions.filter((action) => {
            const actionData = action.actionData;
            const repository = actionData.repository;
            if (repository !== req.body.repository.full_name) {
                return false;
            }
            return true;
        });

        const promises = activeGithubActions.map(async (action) => {
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

module.exports = router;
