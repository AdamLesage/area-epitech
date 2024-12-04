async function send() {
    console.log("send");
    try {
        const response = await fetch(`http://127.0.0.1:8080/api/reaction`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "id": 78912 })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

const sleepNow = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

async function repeatedGreetingsLoop() {
  while (1) {
    await sleepNow(1000)
    await send();
  }
}

repeatedGreetingsLoop()
