const express = require('express');
const router = express.Router();
const Prisma = require('@prisma/client');
const prisma = new Prisma.PrismaClient;
const reactions = require("../services/reactions")
const { areaNotify } = require("../utils/areaNotify");

/**
 * @brief Replace placeholders in reaction data with values from returnAction.
 * 
 * This function replaces placeholders like `${key}` in `reactionData` with corresponding values 
 * from the `returnAction` object. Unmatched placeholders remain unchanged.
 * 
 * @param {Object} returnAction - Object containing replacement values.
 * @param {Object} reactionData - Object with placeholders to replace.
 * @returns {Object} - Updated reaction data.
 * 
 * @example
 * useActionReturn({ name: "John" }, { message: "Hello, ${name}!" });
 * // Output: { message: "Hello, John!" }
 * @author Romain Chevallier
 */
function useActionReturn(returnAction, reactionData) {
    for (let key in reactionData) {
        if (reactionData.hasOwnProperty(key)) {
            // Replace occurrences of ${name} with the corresponding property value in returnAction
            if (typeof reactionData[key] === 'string') {
                reactionData[key] = reactionData[key].replace(/\$\{(\w+)\}/g, (match, p1) => {
                    return returnAction[p1] !== undefined ? returnAction[p1] : match;
                });
            }
        }
    }
    return reactionData;
}

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
        console.log("Called reaction");
        const uuid = req.params.uuid;
        const area = await prisma.actionReaction.findUnique({where: {uuid: uuid}});
        if (area == null) {
            return res.status(404).send("unknow action-Reaction");
        }
        console.log("Called area", area);
        const reaction = await prisma.reaction.findUnique({ where: { id: area.reactionId } });
        if (reaction == null || reactions.get(reaction.name) == undefined) {
            return res.status(404).send("unknow Reaction");
        }
        console.log(area.reactionData, req.body)
        area.reactionData = useActionReturn(req.body, area.reactionData);
        await reactions.get(reaction.name)(area.reactionData, req.body, area.userUuid);
        areaNotify("on_area_activate", area)
        res.json({ message: "receive reaction" });
    } catch (e) {
        console.error("Error on receive reaction", e);
        res.status(500).send("error on execute reaction");
    }
});

module.exports = router;
