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
        // console.log("receive discord webhook");

        // console.log("Headers:", req.headers);
        // console.log("Body:", req.body);

        // Fetch all actionReactions that are active and have the service "discord"

        const actionName = req.body.Event;

        const activeDiscordActions = await prisma.actionReaction.findMany({
            where: {
                isActive: true,
                action: {
                    service: {
                        name: "discord",
                    },
                    name: actionName,
                },
            },
        });

        if (activeDiscordActions.length === 0) {
            return res.status(200).send('No active actions found for this event');
        }

        let filteredActions = [];

        console.log("DATA", req.body);
        const group = req.body.group;
        const channel_id = req.body.data.channelId;
        const server_id = req.body.data.serverId;
        const user_id = req.body.data.userId;

        switch (group) {
            case 0:

                filteredActions = activeDiscordActions;
                break;
            case 1:
                if (server_id) {
                    filteredActions.push(activeDiscordActions.filter((action) => action.actionData.server_id == server_id));
                }
                break;
            case 2:
                if (channel_id && server_id)
                    filteredActions.push(activeDiscordActions.filter((action) => action.actionData.channel_id == channel_id && action.actionData.server_id == server_id));
                break;
            case 3:
                if (user_id)
                    filteredActions.push(activeDiscordActions.filter((action) => action.actionData.user_id == user_id));
                break;
            case 4:
                if (server_id && user_id)
                    filteredActions.push(activeDiscordActions.filter((action) => action.actionData.server_id == server_id && action.actionData.user_id == user_id));
                break;
            case 5:
                if (server_id && channel_id && user_id)
                    filteredActions.push(activeDiscordActions.filter((action) => action.actionData.server_id == server_id && action.actionData.channel_id == channel_id && action.actionData.user_id == user_id));
                break;
        }

        // for (let i = 0; i < filteredActions.length; i++) {
        //     console.log(filteredActions[i]);
        // }

        const promises = filteredActions.flat().map(async (action) => {
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

    return res.redirect(`${process.env.FRONTEND_URL}/discord-end-of-process`);
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
