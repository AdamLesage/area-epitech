const express = require('express');
const router = express.Router();
const Prisma = require('@prisma/client');
const prisma = new Prisma.PrismaClient;
const reactions = require("../services/reactions")

/**
 * @brief create a new reaction and return the reaction
 * @param uuid the uuid of the action reaction
 * @param req.body the data send by the action
 * @example POST /reaction/:uuid
 *   {
 *       "userId": "user-123",
 *       "reaction": "like"
 *   }
 */
router.post('/reaction/:uuid', async (req, res) => {
    try {
        const uuid = req.params.uuid;
        // console.log(uuid);
        const area = await prisma.actionReaction.findUnique({where: {uuid: uuid}});
        if (area == null) {
            return res.status(404).send("unknow action-Reaction");
        }
        const reaction = await prisma.reaction.findUnique({ where: { id: area.reactionId } });
        if (reaction == null || reactions.get(reaction.name) == undefined) {
            return res.status(404).send("unknow Reaction");
        }
        // console.log("receive reaction", "service", reaction.name);
        await reactions.get(reaction.name)(area.reactionData, req.body, area.userUuid);
        res.json({ message: "receive reaction" });
    } catch (e) {
        console.error("Error on receive reaction", e);
        res.status(500).send("error on execute reaction");
    }
});

module.exports = router;
