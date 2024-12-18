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

const service = require('../services/services.json');

function attributeEndpointToReactionGithub(name) {
    const nameDict = {
        "create_issue": `https://api.github.com/repos/AdamLesage/area-epitech/issues`,
        "create_milestone": `https://api.github.com/repos/AdamLesage/area-epitech/milestones`,
        "create_pull_request": `https://api.github.com/repos/AdamLesage/area-epitech/pulls`,
    };

    return nameDict[name];
}

function initServices() {
    // Create new services if the do not exist
    service.forEach(async (service) => {
        const { name } = service;
        const existingService = await prisma.service.findUnique({
            where: {
                name,
            },
        });

        if (existingService === null) {
            await prisma.service.create({
                data: {
                    name,
                },
            });
        }
    });

    // Create actions
    service.forEach(async (service) => {
        const { actions, reactions } = service;
        const serviceDB = await prisma.service.findUnique({
            where: {
                name: service.name,
            },
        });

        if (!serviceDB) {
            return;
        }

        actions.forEach(async (action) => {
            // Check if action already exists
            const existingAction = await prisma.action.findUnique({
                where: {
                    name: action.name,
                },
            });

            if (existingAction === null) {
                await prisma.action.create({
                    data: {
                        name: action.name,
                        description: action.description,
                        service: {
                            connect: { id: serviceDB.id },
                        }
                    },
                });
            }
        });

        // Create reactions
        reactions.forEach(async (reaction) => {
            // Check if reaction already exists
            const existingReaction = await prisma.reaction.findUnique({
                where: {
                    name: reaction.name,
                },
            });

            if (existingReaction === null) {
                await prisma.reaction.create({
                    data: {
                        name: reaction.name,
                        description: reaction.description,
                        endpoint: attributeEndpointToReactionGithub(reaction.name),
                        service: {
                            connect: { id: serviceDB.id },
                        }
                    },
                });
            }
        });
    });
}

module.exports = { initServices };