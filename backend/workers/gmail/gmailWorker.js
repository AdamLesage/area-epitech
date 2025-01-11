const Redis = require('ioredis');
const { google } = require('googleapis');
const redis = new Redis({
    host: 'redis',
    port: 6379
});
actionData = JSON.parse(process.env.DATA)
const ACCESS_TOKEN = actionData.accessToken;
const targetAction = process.env.TARGET_ACTION;
let lastHistoryId = undefined;

/**
 * @brief Sends data to a specified callback URL via a POST request.
 * @param {Object} data2 - The data to send in the request body.
 */
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

/**
 * @brief Retrieves the last history ID for the authenticated Gmail user.
 * @returns {String|undefined} The last history ID or undefined if not found.
 */
async function getLastHistoryId() {
    console.log(ACCESS_TOKEN)
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: ACCESS_TOKEN });
    const gmail = google.gmail({ version: 'v1', auth });

    try {
        const response = await gmail.users.getProfile({ userId: 'me' });

        if (response.data && response.data.historyId) {
            console.log('Last historyId:', response.data.historyId);
            return response.data.historyId;
        } else {
            console.log('No historyId found in the response.');
            return undefined;
        }
    } catch (error) {
        console.error('Error retrieving historyId:', error);
        return undefined
    }
}

/**
 * @brief Handles an event by determining its type and executing the corresponding action.
 * @param {String} eventType - The type of event (e.g., messageAdded, labelsRemoved).
 * @param {Object} message - The message data associated with the event.
 */
function handleEvent(eventType, message) {
    switch (eventType) {
        case 'messageAdded':
            console.log(`New message added: ${message.message.id}`);
            send({ event: 'messageAdded', messageId: message.message.id });
            break;

        case 'messageDeleted':
            console.log(`Message deleted: ${message.message.id}`);
            send({ event: 'messageDeleted', messageId: message.message.id });
            break;
        case 'labelsAdded':
            console.log(`Labels removed from message ${message.message.id}:`, message.labels);
            send({ event: 'labelsAdded', messageId: message.message.id, labels: message.labels });
            break;

        case 'labelsRemoved':
            console.log(`Labels removed from message ${message.message.id}:`, message.labels);
            send({ event: 'labelsRemoved', messageId: message.message.id, labels: message.labels });
            break;

        default:
            console.log(`Unknown event type: ${eventType}`);
            send({ event: 'unknown', message: message });
    }
}

/**
 * @brief Retrieves all labels for the authenticated Gmail user and maps their IDs to names.
 * @param {Object} auth - The authentication object for Gmail API.
 * @returns {Object} A mapping of label IDs to label names.
 */
async function getLabels(auth) {
    const gmail = google.gmail({ version: 'v1', auth });
    const response = await gmail.users.labels.list({ userId: 'me' });
    const labels = response.data.labels;
    if (!labels) {
        console.log('No labels found.');
        return {};
    }
    return labels.reduce((map, label) => {
        map[label.id] = label.name;
        return map;
    }, {});
}

/**
 * @brief Handles a webhook notification by fetching history items and processing events.
 * @param {Object} webhookData - The data from the webhook notification.
 */
async function handleNotification(webhookData) {
    console.log("ACCESS TOKEN: ", ACCESS_TOKEN)
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: ACCESS_TOKEN });
    const gmail = google.gmail({ version: 'v1', auth });

    // Get Gmail history items
    const historyResponse = await gmail.users.history.list({
        userId: 'me',
        startHistoryId: lastHistoryId,
        historyTypes: ['messageAdded', 'messageDeleted', 'labelAdded', 'labelRemoved'],
    });
    const labelMap = await getLabels(auth);

    if (historyResponse.data.history) {
        historyResponse.data.history.forEach(event => {
            if (event.messagesAdded && targetAction === "gmail_on_new_mail") {
                event.messagesAdded.forEach(message => {
                    handleEvent('messageAdded', message);
                });
            }
            if (event.messagesDeleted && targetAction === "gmail_on_deleted_mail") {
                event.messagesDeleted.forEach(message => {
                    handleEvent('messageDeleted', message);
                });
            }
            if (event.labelsAdded && targetAction === "gmail_on_label_added") {
                event.labelsAdded.forEach(message => {
                    const addedLabels = message.labelIds.map(id => labelMap[id] || id);
                    console.log(`Labels added to message ${message.message.id}:`, addedLabels);
                    handleEvent('labelsAdded', { message, labels: addedLabels });
                });
            }
            if (event.labelsRemoved && targetAction === "gmail_on_label_removed") {
                event.labelsRemoved.forEach(message => {
                    const removedLabels = message.labelIds.map(id => labelMap[id] || id);
                    console.log(`Labels removed from message ${message.message.id}:`, removedLabels);
                    handleEvent('labelsRemoved', { message, labels: removedLabels });
                });
            }
        });
    } else {
        send({ "event": 'not know event'})
        console.log('No history items found for this historyId');
    }
    lastHistoryId = webhookData.historyId
}

/**
 * @brief Processes webhook data from a Redis queue in a continuous loop.
 */
async function processWebhook() {
    lastHistoryId = await getLastHistoryId()
    while (true) {
        const data = await redis.rpop(process.env.UUID);
        if (data) {
            console.log(data)
            const webhookData = JSON.parse(data);
            if (lastHistoryId == undefined) {
                lastHistoryId = webhookData.historyId
            }
            console.log('Processing webhook data:', webhookData);
            result = await handleNotification(webhookData);
        } else {
            // Wait for a while before checking the queue again
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}

processWebhook().catch(console.error);