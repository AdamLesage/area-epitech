const axios = require('axios');

async function areaNotify(event, notifyData) {
    axios.post(`${process.env.BACKEND_URL}/area/webhook/`, {event: event, data: notifyData})
        .then(() => {
            console.log("notify success");
        }).catch((error) => {
            console.error(error);
        });
}

module.exports = { areaNotify };