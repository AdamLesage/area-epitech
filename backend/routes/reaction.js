const express = require('express');
const router = express.Router();
const Prisma = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');
const prisma = new Prisma.PrismaClient;
const reactions = require("../services/reactions")

/**
 * @brief create a new reaction and return the reaction
 */
router.post('/reaction/:uuid', async (req, res) => {
    try {
        const uuid = req.params.uuid;
        const action = await prisma.actionReaction.findUnique({where: {uuid: uuid}});
        if (action == null) {
            throw Error("unknow action-Reaction");
        }
        if (reactions.get(action.typeReaction) == undefined) {
            throw Error("unknow unknow Reaction");
        }
        reactions.get(action.typeReaction)(action.reactionData, req.body);
        res.json({ message: "receive reaction", action: action });
    } catch (e) {
        console.error(e);
        res.status(500).send("error on execute reaction");
    }
});

module.exports = router;  // for use in other files