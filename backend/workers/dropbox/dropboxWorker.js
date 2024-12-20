
const { Dropbox } = require('dropbox');
const Redis = require('ioredis');
const redis = new Redis({
    host: 'redis',
    port: 6379
});
actionData = JSON.parse(process.env.DATA)
const ACCESS_TOKEN = actionData.accessToken;
const dbx = new Dropbox({ accessToken: ACCESS_TOKEN });

let fileMetadataStore = {};
let cursorStore = {};
let init_userId;

async function send(data2) {
    console.log("send");
    try {
        const response = await fetch(process.env.CALL_BACK, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data2)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

function trigger_action(entry) {
    switch (entry['.tag']) {
        case 'file':
            const oldMetadata = fileMetadataStore[entry.id];
            // Check if the file has been renamed
            if (oldMetadata && oldMetadata.path_display !== entry) {
                send({ event: 'file-renamed', data: entry });
            }
            // Check if the file is new
            if (!oldMetadata) {
                send({ event: 'file-added', data: entry });
            }
            // Update the metadata storage
            fileMetadataStore[entry.id] = {
                id: entry.id,
                path_display: entry.path_display,
                name: entry.name,
                client_modified: entry.client_modified,
                server_modified: entry.server_modified,
                size: entry.size,
            };
            break;
        case 'folder':
            const oldfolderMetadata = fileMetadataStore[entry.id];
            // Check if the folder has been renamed
            if (oldfolderMetadata && oldfolderMetadata.path_display !== entry.path_display) {
                send({ event: 'folder-renamed', data: entry });
            }

            // Check if the folder is new
            if (!oldfolderMetadata) {
                send({ event: 'folder-added', data: entry });
            }

            // Update the metadata storage for the folder
            fileMetadataStore[entry.id] = {
                id: entry.id,
                path_display: entry.path_display,
                name: entry.name,
            };
            break
        case 'deleted':
            // Update your metadata storage
            send({ event: 'file-deleted', data: entry });
            delete fileMetadataStore[entry.id];
            break;
        default:
            console.log("unknown")
            break;
    }
}
async function process_user_change(webhookData) {
    try {
        const users = webhookData.delta?.users || [];
        for (const userId of users) {
            if (!cursorStore[userId]) {
                await initializeCursor(userId);
            }
            const cursor = cursorStore[userId];
            try {
                const result = await dbx.filesListFolderContinue({ cursor });
                for (const entry of result.result.entries) {
                    trigger_action(entry)
                }
                cursorStore[userId] = result.result.cursor;
            } catch (error) {
                console.error('Error on Dropbox event:', error);
            }
        }
    } catch (error) {
        console.error('Error on select cursor:', error);
    }
}

async function initializeCursor(userId) {
    try {
        cursorStore[userId] = init_userId;
        console.log(`Cursor initialize ${userId}: ${response.result.cursor}`);
    } catch (error) {
        console.error('Error on initialize cursor:', error);
    }
}

async function setMetaData(cursor) {
    const result = await dbx.filesListFolderContinue({ cursor });
    for (const entry of result.result.entries) {
        switch (entry['.tag']) {
            case 'deleted':
                delete fileMetadataStore[entry.id];
                break;
            case 'file':
                fileMetadataStore[entry.id] = {
                    id: entry.id,
                    path_display: entry.path_display,
                    name: entry.name,
                    client_modified: entry.client_modified,
                    server_modified: entry.server_modified,
                    size: entry.size,
                };
                break;
            case 'folder':
                fileMetadataStore[entry.id] = {
                    id: entry.id,
                    path_display: entry.path_display,
                    name: entry.name,
                };
                break;
            default:
                console.log("unknow tag")
                break;
        }
    }
}

async function firstinitializeCursor() {
    try {
        const response = await dbx.filesListFolder({ path: actionData.folderPath || '' });
        await setMetaData(response.result.cursor)
        return response.result.cursor;
    } catch (error) {
        console.error('Error on first initialize cursor:', error);
    }
}

async function processWebhook() {
    init_userId = await firstinitializeCursor()
    while (true) {
        // await new Promise(resolve => setTimeout(resolve, 1000));
        const data = await redis.rpop(process.env.UUID);
        if (data) {
            console.log(data)
            const webhookData = JSON.parse(data);
            console.log('Processing webhook data:', webhookData);
            result = await process_user_change(webhookData);
        } else {
            // Wait for a while before checking the queue again
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}

processWebhook().catch(console.error);