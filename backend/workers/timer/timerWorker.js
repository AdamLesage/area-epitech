// function startTimer(duration) {
//     setTimeout(() => {
//         send("done");
//     }, duration);
// }

// function startAtSpecificDate(targetDate) {
//     const now = new Date();
//     const timeUntilTarget = targetDate.getTime() - now.getTime();

//     if (timeUntilTarget > 0) {
//         console.log(`Timer set for: ${targetDate}`);
//         setTimeout(async () => {
//             send("done");
//             console.log("Specific date reached, start_resume triggered.");
//         }, timeUntilTarget);
//     } else {
//         console.log("The specified date is in the past.");
//     }
// };

actionData = JSON.parse(process.env.DATA)

async function processWebhook() {
    while (true) {
        const now = new Date();
        const timeUntilTarget = actionData.target_date.getTime() - now.getTime();

        if ("timer.chronometer" == process.env.TARGET_ACTION) {
            setTimeout(() => {
                send("done");
            }, actionData.duration);
        } else if ("timer.alarm" == process.env.TARGET_ACTION) {
            if (timeUntilTarget > 0) {
                console.log(`Timer set for: ${actionData.target_date}`);
                setTimeout(async () => {
                    send("done");
                    console.log("Specific date reached, start_resume triggered.");
                }, timeUntilTarget);
            } else {
                console.log("The specified date is in the past.");
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
