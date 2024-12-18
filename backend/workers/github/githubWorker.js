
const Redis = require('ioredis');
const redis = new Redis({
    host: 'redis',
    port: 6379
});

async function processWebhook() {
    while (true) {
        // await new Promise(resolve => setTimeout(resolve, 1000));
        const data = await redis.rpop(process.env.UUID);
        if (data) {
            console.log(data)
            const webhookData = JSON.parse(data);
            if (webhookData.event == process.env.TARGET_ACTION) {
                send(webhookData)
            }
            // Process the webhook data here
            console.log('Processing webhook data:', webhookData);
            // Call the appropriate reaction or action based on the webhook data
        } else {
            // Wait for a while before checking the queue again
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}

processWebhook().catch(console.error);
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
        // const data = await response.json();
        // console.log(data);
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

// const sleepNow = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

// async function repeatedGreetingsLoop() {
//   while (1) {
//     await sleepNow(1000)
//     await send();
//   }
// }

// repeatedGreetingsLoop()
