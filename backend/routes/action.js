/*
** EPITECH PROJECT, 2024
** area-epitech
** File description:
** Action
*/

const express = require('express');
const router = express.Router();
const Prisma = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');
const prisma = new Prisma.PrismaClient;
const actions = require("../services/actions");
const reactions = require("../services/reactions")

/**
 * @brief return a list of all actions of the user
 */
router.get('/action', async (req, res) => {
    const posts = await prisma.actionReaction.findMany({
        where: { isActive: true },
    })
    res.json(posts)
});

/**
 * @brief create a new action and return the action
 */
router.post('/action', async (req, res) => {
    const { title, typeAction, typeReaction, reactionData, actionData } = req.body;
    const headers = req.headers;
    if (headers.authorization) {
        const user = await prisma.user.findUnique({
            where: {
                authToken: headers.authorization,
            },
        });

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    } else {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    if (actions.get(typeAction) === undefined) {
        res.status(404).send("action not found");
    }
    if (reactions.get(typeReaction) === undefined) {
        res.status(404).send("reaction not found");
    }
    if (typeof actionData !== 'object' || actionData === null) {
        return res.status(400).json({ error: 'Invalid actionData, must be an object' });
    }
    const user = await prisma.user.findUnique({
        where: {
            authToken: headers.authorization,
        },
    });
    const uuid = uuidv4();
    await actions.get(typeAction)(actionData, uuid);
    try {
        const newAction = await prisma.actionReaction.create({
            data: {
                title: title,
                uuid: uuid,
                typeAction: typeAction,
                typeReaction: typeReaction,
                actionData: actionData,
                reactionData: reactionData,
                user: {
                    connect: { id: user.id },
                },
            },
        });
        res.json(newAction)
    } catch (e) {
        console.error(e);
        res.status(500).send("error on create action");
    }
});

/**
 * @brief delete the action
 */
router.delete('/action/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        await prisma.actionReaction.delete({
            where: { id: id },
            })
            res.json({ message: "action deleted" })
    } catch (e) {
        console.error(e);
        res.status(500).send("error on delete action");
    }
});

module.exports = router;