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
const axios = require('axios');
const { assign } = require('nodemailer/lib/shared');

// ACTION

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

        // Create new action
        const newAction = await prisma.action.create({
            data: {
                name: `Action for ${event} ${action}`,
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

// ACTION

router.post('/create-issue', async (req, res) => {
    try {
        const { title, body } = req.body;

        // Validate parameters
        if (!title || !body) {
            return res.status(400).send('Title and body are required');
        }

        // Configure request options
        const githubRepo = 'AdamLesage/area-epitech';
        const githubAssignees = ['AdamLesage'];
        const githubToken = process.env.GITHUB_TOKEN;

        if (!githubToken) {
            return res.status(500).send('GitHub access token is not defined');
        }

        const response = await axios.post(
            `https://api.github.com/repos/${githubRepo}/issues`,
            {
                title: title,
                body: body,
                assignees: githubAssignees,
            },
            {
                headers: {
                    Authorization: `Bearer ${githubToken}`,
                    'X-GitHub-Api-Version': '2022-11-28',
                    'Content-Type': 'application/json',
                },
            }
        );

        // Successful response
        res.status(200).send({
            message: 'Issue created successfully',
            issue_url: response.data.html_url,
        });
    } catch (error) {
        console.error(error);

        // Error handling
        if (error.response) {
            // GitHub API response error
            return res.status(error.response.status).send({
                message: 'Error from GitHub API',
                details: error.response.data,
            });
        }

        res.status(500).send({
            message: 'Internal server error',
            details: error.message,
        });
    }
});

module.exports = router;
