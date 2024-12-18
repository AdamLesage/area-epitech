/*
** EPITECH PROJECT, 2024
** area-epitech
** File description:
** githubService
*/

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();
const axios = require('axios');
require('dotenv').config();
const Redis = require('ioredis');
const redis = new Redis({
    host: 'redis',
    port: 6379
});

// ACTION

function attributeDataToReactionGithub(name) {
    const nameDict = {
        "https://api.github.com/repos/AdamLesage/area-epitech/issues": { "title": "New issue", "body": "New issue created" },
        "https://api.github.com/repos/AdamLesage/area-epitech/pulls": { "title": "Amazing new feature", "body": "Please pull these awesome changes in!", "base": "master"},
        "https://api.github.com/repos/AdamLesage/area-epitech/milestones": { "title": `area-v1.${uuidv4()}`, "state": "open", "description": "Tracking milestone for version 1.0", "due_on": new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() },
    };

    return nameDict[name];
}

router.post('/webhook', async (req, res) => {
    try {
        const event = req.headers['x-github-event'];
        const action = req.body['action'];
        const actionName = `${event}.${action}`;

        console.log("receive github webhook", actionName)
        // get active github area
        const activeGithubActions = await prisma.actionReaction.findMany({
            where: {
                isActive: true,
                action: {
                    service: {
                        name: "github",
                    },
                },
            },
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
