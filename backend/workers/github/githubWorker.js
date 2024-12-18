
const Redis = require('ioredis');
const redis = new Redis({
    host: 'redis',
    port: 6379
});

async function processWebhook() {
    while (true) {
        const data = await redis.rpop(process.env.UUID);
        if (data) {
            const webhookData = JSON.parse(data);
            // Check if the event is the one we are looking for, if so, send the data
            if (webhookData.event == process.env.TARGET_ACTION) {
                send(webhookData)
            }
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
