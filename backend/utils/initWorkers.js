const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
var Docker = require('dockerode');
var docker = new Docker();

async function initWorkers() {
    try {
        const areas = await prisma.actionReaction.findMany({
            where: { isActive: true },
        });

        for (const area of areas) {
            try {
                const container = docker.getContainer(area.containerUuid);
                await container.start();
                console.log(`Container ${area.containerUuid} started successfully.`);
            } catch (err) {
                console.error(`Failed to start container ${area.containerUuid}:`, err);
            }
        }
    } catch (err) {
        console.error('Error fetching areas:', err);
    }
}

module.exports = { initWorkers };