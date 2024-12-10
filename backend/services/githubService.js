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

router.post('/webhook', async (req, res) => {
    try {
        const event = req.headers['x-github-event'];
        const action = req.body['action'];
        const eventSender = req.body.sender?.login;
        const username = req.body.sender?.login;
        const repoName = req.body.repository?.name;
        const actionName = `${event}.${action}`;

        console.log(`New event: ${event} ${action} received from ${eventSender}`);

        // Check if service exists
        let service = await prisma.service.findUnique({
            where: {
                name: 'Github',
            }
        });

        if (!service) {
            return res.status(404).send('Service not found');
        }

        const actionDB = await prisma.action.findUnique({
            where: {
                name: actionName,
                serviceId: service.id,
            }
        });


        // Create new action
        // const newAction = await prisma.action.create({
        //     data: {
        //         name: `Action for ${event} ${action}`,
        //         description: `Triggered by ${event} event and ${action} action`,
        //         endpoint: `/api/github/webhook`,
        //         service: {
        //             connect: { id: service.id },
        //         },
        //     },
        // });

        // Call repo details action
        // const responseRepoDetails = await axios.get(
        //     `${env("BACKEND_URL")}/github/repo-details`,
        //     {
        //         data: {
        //             user: username,
        //             reponame: repoName,
        //         }
        //     }
        // );

        res.status(200).send(responseRepoDetails.data);
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error: ${error}`);
    }
});

// ACTION


router.get('/repo-details', async (req, res) => {
    try {
        const { user, reponame } = req.body;

        // Validate parameters
        if (!user || !reponame) {
            return res.status(400).send('User and reponame are required');
        }

        // Configure request options
        const linkedAccount = await prisma.linkedAccount.findFirst({
            where: {
                serviceName: 'github',
                username: user,
            },
        });

        if (!linkedAccount) {
            return res.status(404).send('GitHub account not linked');
        }

        // const githubToken = "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";
        const githubToken = linkedAccount?.authToken;

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

        // Retrieve only the necessary data
        const { name, full_name, description, html_url, language, created_at, updated_at, pushed_at, size, stargazers_count, watchers_count, forks_count, open_issues_count, subscribers_count } = response.data;

        // Successful response
        res.status(200).send({
            name,
            full_name,
            description,
            url: html_url,
            language,
            created_at,
            updated_at,
            pushed_at,
            size,
            stargazers_count,
            watchers_count,
            forks_count,
            open_issues_count,
            subscribers_count,
        });
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
