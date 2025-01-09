/*
** EPITECH PROJECT, 2025
** area-epitech
** File description:
** stravaService
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

// Verify the webhook
router.post('/webhook', (req, res) => {
    console.log("webhook event received!", req.query, req.body);
    res.status(200).send('EVENT_RECEIVED');
});

// Adds support for GET requests to our webhook
router.get('/webhook', (req, res) => {
    // Your verify token. Should be a random string.
    const VERIFY_TOKEN = "STRAVA";
    // Parses the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
    // Debug print
    console.log("Received GET webhook request:", req.query);
    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
        console.log('mode:', mode, 'token:', token);
        // Verifies that the mode and token sent are valid
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.json({ "hub.challenge": challenge });
        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            console.log('WEBHOOK_VERIFICATION_FAILED');
            res.sendStatus(403);
        }
    } else {
        console.log('INVALID_REQUEST');
        res.json({ "Message": "Invalid Request" });
    }
});



module.exports = router;
