// Require the necessary discord.js classes and axios for HTTP requests
const { Client, Events, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const https = require('https');
const { channel } = require('diagnostics_channel');

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
            author: message.author.username, // Add author username
            content: message.content, // Add message content
            channel: message.channel.name, // Add channel name
            timestamp: message.createdAt, // Add timestamp
            serverId: message.guild.id,  // Add server ID
            channelId: message.channel.id,  // Add channel ID
            userId: message.author.id,  // Add user ID
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

// Listen for message delete events
client.on(Events.MessageDelete, async (message) => {
    const messageData = {
        content: message.content, // Add message content
        channel: message.channel.name, // Add channel name
        timestamp: message.createdAt, // Add timestamp
        deletedAt: new Date(), // Add deletion timestamp
        serverId: message.guild.id,  // Add server ID
        channelId: message.channel.id,  // Add channel ID
        messageId: message.id,  // Add message ID
    };

    try {
        // Send a POST request to your webhook route with the deleted message data
        await axios.post(`${process.env.BACKEND_URL}/discord/webhook`, messageData, { httpsAgent: agent });
        console.log('Deleted message data sent to webhook successfully');
    } catch (error) {
        console.error('Error sending deleted message data to webhook:', error);
    }
});


// Listen for message update events
client.on(Events.MessageUpdate, async (oldMessage, newMessage) => {
    if (!oldMessage.author.bot) {  // Ignore bot messages
        const messageData = {
            oldContent: oldMessage.content, // Add old message content
            newContent: newMessage.content, // Add new message content
            channel: oldMessage.channel.name, // Add channel name
            timestamp: oldMessage.createdAt, // Add timestamp
            editedAt: newMessage.editedAt, // Add edit timestamp
            serverId: oldMessage.guild.id,  // Add server ID
            channelId: oldMessage.channel.id,  // Add channel ID
            messageId: oldMessage.id,  // Add message ID
            userId: oldMessage.author.id,  // Add user ID
        };

        try {
            // Send a POST request to your webhook route with the updated message data
            await axios.post(`${process.env.BACKEND_URL}/discord/webhook`, messageData, { httpsAgent: agent });
            console.log('Updated message data sent to webhook successfully');
        } catch (error) {
            console.error('Error sending updated message data to webhook:', error);
        }
    }
});


// Listen for channel create events
client.on(Events.ChannelCreate, async (channel) => {
    const channelData = {
        channelId: channel.id,  // Add channel ID
        channelName: channel.name,  // Add channel name
        channelType: channel.type,  // Add channel type
        serverId: channel.guild.id,  // Add server ID
        createdAt: channel.createdAt,  // Add creation timestamp
    };

    try {
        // Send a POST request to your webhook route with the channel data
        await axios.post(`${process.env.BACKEND_URL}/discord/webhook`, channelData, { httpsAgent: agent });
        console.log('Channel data sent to webhook successfully');
    } catch (error) {
        console.error('Error sending channel data to webhook:', error);
    }
});


// Listen for channel delete events
client.on(Events.ChannelDelete, async (channel) => {
    const channelData = {
        channelId: channel.id,  // Add channel ID
        channelName: channel.name,  // Add channel name
        channelType: channel.type,  // Add channel type
        serverId: channel.guild.id,  // Add server ID
        deletedAt: new Date(),  // Add deletion timestamp
    };

    try {
        // Send a POST request to your webhook route with the deleted channel data
        await axios.post(`${process.env.BACKEND_URL}/discord/webhook`, channelData, { httpsAgent: agent });
        console.log('Deleted channel data sent to webhook successfully');
    } catch (error) {
        console.error('Error sending deleted channel data to webhook:', error);
    }
});


// Listen for channel update events
client.on(Events.ChannelUpdate, async (oldChannel, newChannel) => {
    const channelData = {
        oldChannelName: oldChannel.name,  // Add old channel name
        newChannelName: newChannel.name,  // Add new channel name
        oldChannelType: oldChannel.type,  // Add old channel type
        newChannelType: newChannel.type,  // Add new channel type
        serverId: oldChannel.guild.id,  // Add server ID
        channelId: oldChannel.id,  // Add channel ID
        updatedAt: new Date(),  // Add update timestamp
    };

    try {
        // Send a POST request to your webhook route with the updated channel data
        await axios.post(`${process.env.BACKEND_URL}/discord/webhook`, channelData, { httpsAgent: agent });
        console.log('Updated channel data sent to webhook successfully');
    } catch (error) {
        console.error('Error sending updated channel data to webhook:', error);
    }
});

module.exports = { discordClient: client };
