// Require the necessary discord.js classes and axios for HTTP requests
const { Client, Events, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const https = require('https');

// Create an HTTPS agent that allows self-signed certificates
const agent = new https.Agent({  
    rejectUnauthorized: false
});

// Create a new client instance with the necessary intents
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// When the client is ready, run this code (only once).
client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Listen for message events
client.on(Events.MessageCreate, async (message) => {
    if (!message.author.bot) {  // Ignore bot messages
        const messageData = {
            author: message.author.username,
            content: message.content,
            channel: message.channel.name,
            timestamp: message.createdAt,
        };

        try {
            // Send a POST request to your webhook route with the message data
            await axios.post(`${process.env.BACKEND_URL}/discord/webhook`, messageData, { httpsAgent: agent });
            console.log('Message data sent to webhook successfully');
        } catch (error) {
            console.error('Error sending message data to webhook:', error);
        }
    }
});

module.exports = { discordClient: client };
