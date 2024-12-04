const express = require('express');
const router = express.Router();
const Prisma = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');
const prisma = new Prisma.PrismaClient;
const actions = require("../services/actions");
const reactions = require("../services/reactions")

/**
 * @brief create a new reaction and return the action
 */
router.post('/reaction', async (req, res) => {
    console.log("reaction");
    res.send("reaction");
});

module.exports = router;  // for use in other files