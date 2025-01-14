const Redis = require('ioredis');
const redis = new Redis({
    host: 'redis',
    port: 6379
});
actionData = JSON.parse(process.env.DATA)
const ACCESS_TOKEN = actionData.accessToken;
const targetAction = process.env.TARGET_ACTION;

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

async function selecteData(webhookData) {
    if (webhookData.event === targetAction) {
        if (webhookData.data.uuid != process.env.UUID) {
            send(webhookData.data)
        }
    }
}

async function processWebhook() {
    while (true) {
        // await new Promise(resolve => setTimeout(resolve, 1000));
        const data = await redis.rpop(process.env.UUID);
        if (data) {
            console.log(data)
            const webhookData = JSON.parse(data);
            console.log('Processing webhook data:', webhookData);
            result = await selecteData(webhookData);
        } else {
            // Wait for a while before checking the queue again
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}

processWebhook().catch(console.error);