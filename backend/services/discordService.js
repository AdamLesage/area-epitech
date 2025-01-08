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
require('dotenv').config();
const Redis = require('ioredis');
const redis = new Redis({
    host: 'redis',
    port: 6379
});

// ACTION
router.post('/webhook', async (req, res) => {
    try {
        console.log("receive discord webhook")

        console.log("Headers:", req.headers);
        console.log("Body:", req.body);

        // Send a success response
        return res.status(200).send('Webhook processed successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error receiving webhook: ${error.message}`);
    }
});

module.exports = router;
