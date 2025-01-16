actionData = JSON.parse(process.env.DATA)

const cronToIntervalMilliseconds = (cronExpression) => {
    const [minute, hour, dayOfWeek] = cronExpression.split(" ").map((field) => field.trim());

    const minutesToMilliseconds = (minutes) => minutes * 60 * 1000;
    const hoursToMilliseconds = (hours) => hours * 60 * 60 * 1000;
    const daysToMilliseconds = (days) => days * 24 * 60 * 60 * 1000;

    let intervalMs = 0;

    if (minute !== "*") {
        const minuteInterval = parseInt(minute, 10);
        intervalMs += minutesToMilliseconds(minuteInterval);
    }

    if (hour !== "*") {
        const hourInterval = parseInt(hour, 10);
        intervalMs += hoursToMilliseconds(hourInterval);
    }

    if (dayOfWeek !== "*" && dayOfWeek !== "?") {
        const dayInterval = parseInt(dayOfWeek, 10); // 0 (Sunday) to 6 (Saturday)
        intervalMs += daysToMilliseconds(dayInterval);
    }

    // Default to 1 minute if all fields are "*"
    if (intervalMs === 0) {
        intervalMs = minutesToMilliseconds(1); // Default interval: 1 minute
    }

    return intervalMs;
};

async function processWebhook() {
    const now = new Date();

    if ("timer.chronometer" == process.env.TARGET_ACTION) {
        setTimeout(() => {
            send(actionData);
        }, actionData.duration);
    } else if ("timer.alarm" == process.env.TARGET_ACTION) {
        const date = actionData.date;
        const time = actionData.time;
        const [year, month, day] = date.split("-");
        const [hours, minutes] = time.split(":");
        const targetDate = new Date(year, month - 1, day, hours - 1, minutes);
        const timeUntilTarget = targetDate.getTime() - now.getTime();
        if (timeUntilTarget > 0) {
            console.log(`Timer set for: ${actionData.date}`);
            setTimeout(async () => {
                send(actionData);
                console.log("Specific date reached, start_resume triggered.");
            }, timeUntilTarget);
        } else {
            console.log("The specified date is in the past.");
        }
    } else if ("timer.interval" == process.env.TARGET_ACTION) {
        const interval = actionData.interval;
        const intervalMs = cronToIntervalMilliseconds(interval);
        console.log(`Logging every ${intervalMs} milliseconds`);

        setInterval(() => {
            console.log(`Cron-based log executed at ${new Date().toISOString()}`);
            send(actionData);
        }, intervalMs);
    } else {
        // Wait for a while before checking the queue again
        await new Promise(resolve => setTimeout(resolve, 1000));
        processWebhook();
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
