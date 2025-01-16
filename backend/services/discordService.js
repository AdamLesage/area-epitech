/*
** EPITECH PROJECT, 2024
** area-epitech
** File description:
** discordService
*/

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();
const { discordClient } = require('../discord/app');
require('dotenv').config();
const Redis = require('ioredis');
const axios = require('axios');
const redis = new Redis({
    host: 'redis',
    port: 6379
});

const guildTokens = new Map();

// ACTION
router.post('/webhook', async (req, res) => {
    try {
        console.log("receive discord webhook");

        console.log("Headers:", req.headers);
        console.log("Body:", req.body);

        // Fetch all actionReactions that are active and have the service "discord"
        const targetuser = await prisma.user.findFirst({
            where: {
                linkedAccounts: {
                    some: {
                        serviceName: "discord",
                        uuid: req.body.guild_id
                    }
                },
            }
        });

        const activeDiscordActions = await prisma.actionReaction.findMany({
            where: {
                isActive: true,
                action: {
                    service: {
                        name: "discord",
                    },
                },
                userUuid: targetuser.uuid,
            },
        });

        const promises = activeDiscordActions.map(async (action) => {
            // Push each action to the Redis queue
            console.log("send to worker", action.uuid);
            await redis.lpush(action.uuid, JSON.stringify(req.body));
        });

        await Promise.all(promises);

        // Send a success response
        res.status(200).send('Webhook processed successfully');
    } catch (error) {
        console.error('Error processing webhook:', error);
        res.status(500).send(`Error receiving webhook: ${error.message}`);
    }
});

router.get('/redirect', async (req, res) => {
    const code = req.query.code;
    const guildId = req.query.guild_id;

    console.log(req.query);

    if (!code || !guildId) {
        return res.status(400).send('Invalid request');
    }

    try {
        const token = await exchangeCodeForToken(code)

        // Store the token in the Map with the guild ID as the key
        guildTokens.set(guildId, token);

        console.log('Stored token for guild:', token);
    } catch (error) {
        console.error(error);
    }

    return res.redirect(`${process.env.FRONTEND_URL}/#/discord-end-of-process`);
});

async function exchangeCodeForToken(code) {
    try {
        const response = await axios.post('https://discord.com/api/v10/oauth2/token', new URLSearchParams({
            client_id: process.env.DISCORD_CLIENT_ID,
            client_secret: process.env.DISCORD_CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: 'http://localhost:8080/discord/redirect',
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        console.log('Access Token Response:', response.data);
        return response.data; // Contains access_token, refresh_token, expires_in, etc.
    } catch (error) {
        console.error('Error exchanging code for token:', error);
        throw error;
    }
}

router.get('/channels', async (req, res) => {
    const guildId = req.query.guild_id;

    console.log(req.query);

    try {
        const response = await axios.get(`https://discord.com/api/guilds/${guildId}/channels`, {
            headers: {
                Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
            },
        });

        console.log('Channels fetched:', response.data);
        return res.json(response.data);
    } catch (error) {
        console.error('Error fetching channels:', error);
        return res.status(500).send('Error whilst fetching channels');
    }
});

router.get('/roles', async (req, res) => {
    const guildId = req.query.guild_id;
    console.log("gvhjklmù");

    console.log(req.query);

    try {
        const response = await axios.get(`https://discord.com/api/guilds/${guildId}/roles`, {
            headers: {
                Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
            },
        });

        console.log('Roles fetched:', response.data);
        return res.json(response.data);
    } catch (error) {
        console.error('Error fetching roles:', error);
        return res.status(500).send('Error whilst fetching roles');
    }
});

router.get('/users', async (req, res) => {
    const guildId = req.query.guild_id;

    console.log(req.query);

    try {
        const response = await axios.get(`https://discord.com/api/guilds/${guildId}/members`, {
            headers: {
                Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
            },
        });

        console.log('Users fetched:', response.data);
        return res.json(response.data);
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).send('Error whilst fetching users');
    }
});

router

module.exports = router;
