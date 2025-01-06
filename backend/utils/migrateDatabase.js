const { exec } = require("child_process");

function migrateDatabase() {
    return new Promise((resolve, reject) => {
        exec("npx prisma migrate deploy && npx prisma generate", (error, stdout, stderr) => {
            if (error) {
                console.error(`Error during Prisma setup: ${stderr || error.message}`);
                return reject(error);
            }
            console.log(stdout);
            resolve();
        });
    });
}

module.exports = { migrateDatabase };

