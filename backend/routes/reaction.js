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
        console.log(uuid);
        const action = await prisma.actionReaction.findUnique({where: {uuid: uuid}});
        if (action == null) {
            return res.status(404).send("unknow action-Reaction");
        }
        if (reactions.get(action.typeReaction) == undefined) {
            return res.status(404).send("unknow Reaction");
        }
        reactions.get(action.typeReaction)(action.reactionData, req.body);
        res.json({ message: "receive reaction", action: action });
    } catch (e) {
        console.error(e);
        res.status(500).send("error on execute reaction");
    }
});

module.exports = router;