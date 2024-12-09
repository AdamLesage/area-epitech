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
const reactions = require("../services/reactions");
var Docker = require('dockerode');
var docker = new Docker();

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
 * 
 * @param {string} title the title of the action reaction
 * @param {string} typeAction the type of the action
 * @param {string} typeReaction the type of the reaction
 * @param {object} reactionData the data usefull for the reaction
 * @param {object} actionData the data usefull for the action
 * @exemple POST /api/action/ {
 *       "title": "Sample Action Title",
 *       "typeAction": "dropbox_on_new_file",
 *       "typeReaction": "dropbox_shares_file",
 *       "reactionData": {
 *           "notification": "Action was successful",
 *           "timestamp": "2023-10-01T12:00:00Z"
 *       },
 *       "actionData": {
 *           "details": "User  clicked the button"
 *       }
 *   }
 * @author Romain Chevallier
 */

router.post('/action', async (req, res) => {
    const { title, typeAction, typeReaction, reactionData, actionData } = req.body;
    // check user autentification
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
    // check valide action and reaction type
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
    // create and lunch the worker
    const containerUuid = await actions.get(typeAction)(actionData, uuid);
    try {
        // create the action reaction object
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
                containerUuid: containerUuid,
            },
        });
        res.json(newAction);
    } catch (e) {
        console.error(e);
        res.status(500).send("error on create action");
    }
});

/**
 * @brief delete the action
 * 
 * @param {int} id the id of the action on param
 * @exemple DELETE /api/action/:id
 */

router.delete('/action/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const action = await prisma.actionReaction.findUnique({where: {id: id}});
        if (action == null) {
            res.status(404).send("action not find");
            return;
        }
        docker.getContainer(action.containerUuid).remove({force: true});
        await prisma.actionReaction.delete({
            where: { id: id },
        });
        res.json({ message: "action deleted" });
    } catch (e) {
        console.error(e);
        res.status(500).send("error on delete action");
    }
});

/**
 * @brief delete the action
 * 
 * @param {string} uuid the id of the action
 * @param {boolean} isActive
 * @example PUT /api/action/:uuid {isActive: false}
 */
router.put('/action/set_active/:uuid', async (req, res) => {
    try {
        const uuid = req.params.uuid;
        const { isActive } = req.body;
        const action = await prisma.actionReaction.findUnique({where: {uuid: uuid}});
        if (action == null) {
            res.status(404).send("action not find");
        }
        if (isActive === false && action.isActive === true) {
            docker.getContainer(action.containerUuid).stop();
        } else if (isActive === true && action.isActive === false) {
            docker.getContainer(action.containerUuid).start();
        }
        await prisma.actionReaction.update({
            where: { uuid: uuid },
            data: {
                isActive: isActive,
            }
        });
        res.json({ message: "action update" });
    } catch (e) {
        console.error(e);
        res.status(500).send("error on update action");
    }
});

module.exports = router;