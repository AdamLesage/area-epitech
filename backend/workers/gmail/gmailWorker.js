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

function getBodyFromPayload(payload) {
    let body = '';
    if (payload.parts) {
        for (const part of payload.parts) {
            if (part.mimeType === 'text/plain' && part.body.data) {
                body += Buffer.from(part.body.data, 'base64').toString('utf-8');
            }
        }
    } else if (payload.body && payload.body.data) {
        body += Buffer.from(payload.body.data, 'base64').toString('utf-8');
    }
    return body;
}

async function messageInfo(gmail, messageId, labelMap) {
    response = await gmail.users.messages.get({
        userId: 'me',
        id: messageId
    })
    const message = response.data;
    console.log(message);
    const headers = message.payload.headers;
    const mailInfo = {
        id: messageId,
        threadId: message.threadId,
        snippet: message.snippet,
        labels: message.labelIds.map(labelId => labelMap[labelId] || labelId),
        subject: headers.find(header => header.name === 'Subject')?.value || '',
        from: headers.find(header => header.name === 'From')?.value || '',
        to: headers.find(header => header.name === 'To')?.value || '',
        date: headers.find(header => header.name === 'Date')?.value || '',
        body: getBodyFromPayload(message.payload)
    };
    return mailInfo;
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

    console.log(historyResponse.data)
    if (historyResponse.data.history) {
        for (const event of historyResponse.data.history) {
            if (event.messagesAdded && (targetAction === "gmail_on_new_mail" || targetAction === "gmail_on_mail_send" || targetAction === "gmail_on_draft_create")) {
                for (const message of event.messagesAdded) {
                    const mailInfo = await messageInfo(gmail, message.message.id, labelMap);
                    if (mailInfo.labels.includes('DRAFT') && targetAction === "gmail_on_draft_create") {
                        send(mailInfo);
                    } else if (mailInfo.labels.includes('SENT') && targetAction === "gmail_on_mail_send") {
                        send(mailInfo);
                    } else if (targetAction === "gmail_on_new_mail") {
                        send(mailInfo);
                    }
                }
            }
            if (event.messagesDeleted && targetAction === "gmail_on_deleted_mail") {
                for (const message of event.messagesDeleted) {
                    mailInfo = await messageInfo(gmail, message.message.id, labelMap);
                    send(mailInfo);
                };
            }
            if (event.labelsAdded && targetAction === "gmail_on_label_added") {
                for (const message of event.labelsAdded) {
                    const addedLabels = message.labelIds.map(id => labelMap[id] || id);
                    if (actionData.type_label === undefined || actionData.type_label === null || addedLabels.includes(actionData.type_label)) {
                        console.log("messageId", message.message.id)
                        mailInfo = await messageInfo(gmail, message.message.id, labelMap);
                        send(mailInfo);
                    }
                };
            }
            if (event.labelsRemoved && targetAction === "gmail_on_label_removed") {
                for (const message of event.labelsRemoved) {
                    const removedLabels = message.labelIds.map(id => labelMap[id] || id);
                    console.log(`Labels removed from message ${message.message.id}:`, removedLabels);
                    if (actionData.type_label === undefined || actionData.type_label === null || removedLabels.includes(actionData.type_label)) {
                        mailInfo = await messageInfo(gmail, message.message.id, labelMap);
                        send(mailInfo);
                    }
                };
            }
        };
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