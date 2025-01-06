const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
var Docker = require('dockerode');
var docker = new Docker();

async function stopWorkingWorkers() {
    try {
        const areas = await prisma.actionReaction.findMany({
            where: { isActive: true },
        });

        const stopPromises = areas.map(async (area) => {
            try {
                const container = docker.getContainer(area.containerUuid);
                await container.stop();
                console.log(`Container ${area.containerUuid} stopped successfully.`);
            } catch (err) {
                console.error(`Failed to stop container ${area.containerUuid}:`, err);
            }
        });

        await Promise.all(stopPromises);
    } catch (err) {
        console.error('Error fetching areas:', err);
    }
}

module.exports = { stopWorkingWorkers };