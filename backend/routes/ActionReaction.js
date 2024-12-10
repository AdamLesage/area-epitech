/*
** EPITECH PROJECT, 2024
** area-epitech
** File description:
** ActionReaction
*/

const express = require('express');
const router = express.Router();
const service = require('../services/services.json');
const servicesInfo = require('../services/services-info.json');

/**
 * @brief create a new Area
 *
 * @return {json} Area
 *
 * @autor Adam Lesage
 */
router.post('/action-reaction', async (req, res) => {
    const { title, userUuid, description, actionName, reactionName, reactionData, actionData } = req.body;

    const authToken = req.headers?.authorization?.split(' ')[1];

    if (!authToken) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                authToken: authToken,
            },
        });

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const action = await prisma.action.findUnique({
            where: {
                name: actionName,
            },
        });

        if (!action) {
            return res.status(400).json({ message: 'Action not found' });
        }

        const reaction = await prisma.reaction.findUnique({
            where: {
                name: reactionName,
            },
        });

        if (!reaction) {
            return res.status(400).json({ message: 'Reaction not found' });
        }

        const newArea = await prisma.actionReaction.create({
            data: {
                title: title,
                description: description,
                userUuid: userUuid,
                actionUuid: action.uuid,
                reactionUuid: reaction.uuid,
                reactionData: reactionData,
                actionData: actionData,
            },
        });

        if (!newArea) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        return res.status(201).json(newArea);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
