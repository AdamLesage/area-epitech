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
// const Octokit = require('@octokit/re st');

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


router.get('/repo-details', async (req, res) => {
    try {
        const { user, reponame, email } = req.body;

        // Validate parameters
        if (!user || !reponame || !email) {
            return res.status(400).send('User, reponame and email are required');
        }

        // Configure request options
        const linkedAccount = await prisma.linkedAccount.findFirst({
            where: {
                serviceName: 'github',
                user: {
                    email: email,
                },
            },
        });

        if (!linkedAccount) {
            return res.status(404).send('GitHub account not linked');
        }

        // const githubToken = "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";
        const githubToken = linkedAccount?.authToken;
        console.log(githubToken);

        if (!githubToken) {
            return res.status(500).send('GitHub access token is not defined');
        }

        const response = await axios.get(
            `https://api.github.com/repos/${user}/${reponame}`,
            {
                headers: {
                    Authorization: `Bearer ${githubToken}`,
                    'Content-Type': 'application/json',
                },
                auth: {
                    username: user,
                    password: githubToken,
                },
            }
        );

        // Successful response
        res.status(200).send(response.data);
    } catch (error) {
        // console.error(error);

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

router.get('/list-repos', async (req, res) => {
    try {
        const { email } = req.body;

        // Validate parameters
        if (!email) {
            return res.status(400).send('Email is required');
        }

        // Configure request options
        const linkedAccount = await prisma.linkedAccount.findFirst({
            where: {
                serviceName: 'github',
                user: {
                    email: email,
                },
            },
        });

        if (!linkedAccount) {
            return res.status(404).send('GitHub account not linked');
        }

        const githubToken = linkedAccount?.authToken;

        if (!githubToken) {
            return res.status(500).send('GitHub access token is not defined');
        }
        const response = await axios.get(`https://api.github.com/user/repos`, {
            headers: {
            Authorization: `Bearer ${githubToken}`,
            'Accept': 'application/vnd.github.+json',
            }
        });

        const repoNames = response.data.map(repo => repo.name);
        res.status(200).send(repoNames);
    } catch (error) {

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

router.get('/user-info', async (req, res) => {
    try {
        const { email } = req.body;

        // Validate parameters
        if (!email) {
            return res.status(400).send('Email is required');
        }

        // Configure request options
        const linkedAccount = await prisma.linkedAccount.findFirst({
            where: {
                serviceName: 'github',
                user: {
                    email: email,
                },
            },
        });

        if (!linkedAccount) {
            return res.status(404).send('GitHub account not linked');
        }

        const githubToken = linkedAccount?.authToken;

        if (!githubToken) {
            return res.status(500).send('GitHub access token is not defined');
        }

        const response = await axios.get(`https://api.github.com/user`, {
            headers: {
                Authorization: `Bearer ${githubToken}`,
                'Accept': 'application/vnd.github.+json',
            },
        });

        // Get username, avatar_url, html_url, bio
        const { login, avatar_url, html_url, bio } = response.data;

        res.status(200).send({
            username: login,
            avatar: avatar_url,
            profile: html_url,
            bio: bio,
        });
    } catch (error) {
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
