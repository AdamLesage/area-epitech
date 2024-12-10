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

// ACTION

function attributeDataToReactionGithub(name) {
    const nameDict = {
        "https://api.github.com/repos/AdamLesage/area-epitech/issues": { "title": "New issue", "body": "New issue created" },
        "https://api.github.com/repos/AdamLesage/area-epitech/milestones": { "title": "v1.0", "state": "open", "description": "Tracking milestone for version 1.0", "due_on": new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() }, // 5 days from now
        "https://api.github.com/repos/AdamLesage/area-epitech/pulls": { "title": "Amazing new feature", "body": "Please pull these awesome changes in!", "base": "master"}
    };

    return nameDict[name];
}

router.post('/webhook', async (req, res) => {
    try {
        const event = req.headers['x-github-event'];
        const action = req.body['action'];
        const actionName = `${event}.${action}`;

        // Check if service exists
        let service = await prisma.service.findUnique({
            where: {
                name: 'github',
            }
        });

        if (!service) {
            return res.status(404).send('Service not found');
        }

        const actionDB = await prisma.action.findFirst({
            where: {
                name: actionName,
                serviceId: service.id,
            }
        });
        console.log(actionDB);

        // Todo: create a webhook for each action, actions will have an endpoint
        // Retrieve all Area where actionId == actionDB.id
        const areas = await prisma.actionReaction.findMany({
            where: {
                actionId: actionDB.id,
            }
        });

        areas.forEach(async (area) => {
            const reaction = await prisma.reaction.findUnique({
                where: {
                    id: area.reactionId,
                }
            });

            if (!reaction) {
                return;
            }

            const data = attributeDataToReactionGithub(reaction.endpoint);
            const headers = {
                Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
                'Accept': 'application/vnd.github+json',
                "X-GitHub-Api-Version": "2022-11-28"
            }
            console.log(`Creating POST request at endpoint: ${reaction.endpoint}`);
            console.log(`Data: ${JSON.stringify(data)}`);

            // TODO: Add the necessary data to the data object
            // TODO: Adapt HTTP method (GET, POST, PUT, DELETE) for now it's only POST
            const response = await axios.post(reaction.endpoint, data,
            {
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
                    'Accept': 'application/vnd.github+json',
                    "X-GitHub-Api-Version": "2022-11-28"
                }
            });

            if (response.status > 299) {
                console.error(`Error calling reaction ${reaction.name}`);
            }

            // console.log(`response: ${response.data}`);
        });

        // res.status(200).send(responseRepoDetails.data);
        res.status(200).send('Webhook received');
    } catch (error) {
        // console.error(error);
        // res.status(500).send(`Error receiving webhook: ${error.message}`);
    }
});

module.exports = router;
