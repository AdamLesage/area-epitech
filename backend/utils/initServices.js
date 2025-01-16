/*
** EPITECH PROJECT, 2024
** area-epitech
** File description:
** initServices
*/

require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

// Connect to db
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const services = require('../services/about.json');

function attributeEndpointToReactionGithub(name) {
    const nameDict = {
        "create_issue": `https://api.github.com/repos/AdamLesage/area-epitech/issues`,
        "create_milestone": `https://api.github.com/repos/AdamLesage/area-epitech/milestones`,
        "create_pull_request": `https://api.github.com/repos/AdamLesage/area-epitech/pulls`,
        "dropbox_shares_file": ``,
    };

    return nameDict[name];
}

async function initServices() {
    // Create new services if they do not exist
    for (const service of services) {
        const { name } = service;
        const existingService = await prisma.service.findUnique({
            where: {
                name,
            },
        });

        if (!existingService) {
            await prisma.service.create({
                data: {
                    name,
                },
            });
        }
    }

    // Create actions and reactions
    for (const service of services) {
        const { actions, reactions } = service;
        const serviceDB = await prisma.service.findUnique({
            where: {
                name: service.name,
            },
        });

        if (!serviceDB) {
            continue;
        }

        for (const action of actions) {
            const existingAction = await prisma.action.findFirst({
                where: {
                    name: action.name,
                },
            });

            if (!existingAction) {
                await prisma.action.create({
                    data: {
                        name: action.name,
                        description: action.description,
                        service: {
                            connect: { id: serviceDB.id },
                        },
                    },
                });
            }
        }

        for (const reaction of reactions) {
            const existingReaction = await prisma.action.findFirst({
                where: {
                    name: reaction.name,
                },
            });

            if (!existingReaction) {
                await prisma.reaction.create({
                    data: {
                        name: reaction.name,
                        description: reaction.description,
                        endpoint: attributeEndpointToReactionGithub(reaction.name) || '',
                        service: {
                            connect: { id: serviceDB.id },
                        },
                    },
                });
            }
        }
    }
}


module.exports = { initServices };