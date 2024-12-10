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
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { v4: uuidv4 } = require('uuid');

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

        const action = await prisma.action.findFirst({
            where: {
                name: actionName,
            },
        });

        if (!action) {
            return res.status(400).json({ message: 'Action not found' });
        }

        const reaction = await prisma.reaction.findFirst({
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
                reactionData: reactionData,
                actionData: actionData,
                uuid: uuidv4(),
                containerUuid: uuidv4(),
                isActive: true,
                action: {
                    connect: {
                        id: action.id,
                    },
                },
                reaction: {
                    connect: {
                        id: reaction.id,
                    },
                },
            },
        });

        if (!newArea) {
            throw('Error while creating new Area');
        }

        return res.status(201).json(newArea);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
