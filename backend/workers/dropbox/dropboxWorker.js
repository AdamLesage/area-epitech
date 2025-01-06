
const { Dropbox } = require('dropbox');
const Redis = require('ioredis');
const redis = new Redis({
    host: 'redis',
    port: 6379
});
actionData = JSON.parse(process.env.DATA)
const ACCESS_TOKEN = actionData.accessToken;
const dbx = new Dropbox({ accessToken: ACCESS_TOKEN });
const targetAction = process.env.TARGET_ACTION;

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

async function getFilecontent(entry) {
    try {
        // Ensure the filesDownload method returns a promise
        const downloadResponse = await dbx.filesDownload({ path: entry.path_lower });
        
        // The file content will be in the fileBlob of the response
        const fileBlob = downloadResponse.fileBlob;

        return fileBlob
    } catch (error) {
        console.error("Error downloading file from Dropbox:", error);
        return "fail"
    }
}

function trigger_action(entry) {
    switch (entry['.tag']) {
        case 'file':
            const oldMetadata = fileMetadataStore[entry.id];
            // Check if the file is new
            if (!oldMetadata) {
                if (targetAction == "dropbox_on_new_file") {
                        entry.fileContent = getFilecontent(entry);
                        send(entry);
                }
            } else if (oldMetadata && oldMetadata.path_display !== entry.path_display) {
                // Check if the file has been renamed
                if (targetAction == "dropbox_on_file_renamed") {
                    const downloadResponse = dbx.filesDownload({ path: entry.path_lower });
                    const fileBlob = downloadResponse.fileBlob
                    entry.fileContent = fileBlob
                    send(entry);
                }
            } else if (oldMetadata.client_modified !== entry.client_modified) {
                // Check if the file has been modified
                if (targetAction == "dropbox_on_file_modified") {
                    const downloadResponse = dbx.filesDownload({ path: entry.path_lower });
                    const fileBlob = downloadResponse.fileBlob
                    entry.fileContent = fileBlob
                    send(entry);
                }
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
            // Check if the folder is new
            if (!oldfolderMetadata) {
                if (targetAction == "dropbox_on_new_folder")
                    send(entry);
            } else if (oldfolderMetadata && oldfolderMetadata.path_display !== entry.path_display) {
                // Check if the folder has been renamed
                if (targetAction == "dropbox_on_folder_renamed")
                    send(entry);
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
            if (targetAction == "dropbox_on_deleted")
                send({ event: 'file-deleted', data: entry });
            delete fileMetadataStore[entry.id];
            break;
        default:
            console.log("unknown")
            console.log(entry)
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