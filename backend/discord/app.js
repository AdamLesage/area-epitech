// Require the necessary discord.js classes and axios for HTTP requests
const { Client, Events, GatewayIntentBits, Partials, ChannelType, PermissionsBitField } = require('discord.js');
const axios = require('axios');
const https = require('https');
const reactions = require('../services/reactions');

// Create an HTTPS agent that allows self-signed certificates
const agent = new https.Agent({  
    rejectUnauthorized: false
});

// Create a new client instance with the necessary intents and partials
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.GuildMessageReactions,  
        GatewayIntentBits.MessageContent,
    ],
    partials: [
        Partials.Message, 
        Partials.Channel, 
        Partials.Reaction,
        Partials.User,
    ]
});

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
            await axios.post(`${process.env.BACKEND_URL}/discord/webhook`, {
                data: messageData,
                group: 0,
                Event: "message_create",
            }, { httpsAgent: agent });
            await axios.post(`${process.env.BACKEND_URL}/discord/webhook`, {
                data: messageData,
                group: 2,
                Event: "message_create_channel",
            }, { httpsAgent: agent });
            await axios.post(`${process.env.BACKEND_URL}/discord/webhook`, {
                data: messageData,
                group: 1,
                Event: "message_create_server",
            }, { httpsAgent: agent });
            await axios.post(`${process.env.BACKEND_URL}/discord/webhook`, {
                data: messageData,
                group: 3,
                Event: "message_create_user",
            }, { httpsAgent: agent });
            await axios.post(`${process.env.BACKEND_URL}/discord/webhook`, {
                data: messageData,
                group: 4,
                Event: "message_create_server_user",
            }, { httpsAgent: agent });
            await axios.post(`${process.env.BACKEND_URL}/discord/webhook`, {
                data: messageData,
                group: 5,
                Event: "message_create_channel_user",
            }, { httpsAgent: agent });
            console.log('Message data sent to webhook successfully');
        } catch (error) {
            console.error('Error sending message data to webhook:', error);
        }
    }
});

// Listen for message delete Events
client.on(Events.MessageDelete, async (message) => {
    const messageData = {
        content: message.content, // Add message content
        channel: message.channel.name, // Add channel name
        timestamp: message.createdAt, // Add timestamp
        deletedAt: new Date(), // Add deletion timestamp
        serverId: message.guild.id,  // Add server ID
        channelId: message.channel.id,  // Add channel ID
        userId: message.author.id,  // Add user ID
        messageId: message.id,  // Add message ID
    };

    try {
        // Send a POST request to your webhook route with the deleted message data
        await axios.post(`${process.env.BACKEND_URL}/discord/webhook`, {
            data: messageData,
            group: 0,
            Event: "message_delete",
        }, { httpsAgent: agent });
        await axios.post(`${process.env.BACKEND_URL}/discord/webhook`, {
            data: messageData,
            group: 1,
            Event: "message_delete_server",
        }, { httpsAgent: agent });
        await axios.post(`${process.env.BACKEND_URL}/discord/webhook`, {
            data: messageData,
            group: 2,
            Event: "message_delete_channel",
        }, { httpsAgent: agent });
        await axios.post(`${process.env.BACKEND_URL}/discord/webhook`, {
            data: messageData,
            group: 3,
            Event: "message_delete_user",
        }, { httpsAgent: agent });
        await axios.post(`${process.env.BACKEND_URL}/discord/webhook`, {
            data: messageData,
            group: 4,
            Event: "message_delete_server_user",
        }, { httpsAgent: agent });
        await axios.post(`${process.env.BACKEND_URL}/discord/webhook`, {
            data: messageData,
            group: 5,
            Event: "message_delete_channel_user",
        }, { httpsAgent: agent });
        await axios.post(`${process.env.BACKEND_URL}/discord/webhook`, {
            data: messageData,
            group: 6,
            Event: "message_delete_message_id",
        }, { httpsAgent: agent });
        console.log('Deleted message data sent to webhook successfully');
    } catch (error) {
        console.error('Error sending deleted message data to webhook:', error);
    }
});

// Listen for message update events
client.on(Events.MessageUpdate, async (oldMessage, newMessage) => {
    if (oldMessage && oldMessage.author && !oldMessage.author.bot) {  // Ignore bot messages
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
            await axios.post(`${process.env.BACKEND_URL}/discord/webhook`, {
                data: messageData,
                group: 0,
                Event: "message_update",
            }, { httpsAgent: agent });
            await axios.post(`${process.env.BACKEND_URL}/discord/webhook`, {
                data: messageData,
                group: 1,
                Event: "message_update_server",
            }, { httpsAgent: agent });
            await axios.post(`${process.env.BACKEND_URL}/discord/webhook`, {
                data: messageData,
                group: 2,
                Event: "message_update_channel",
            }, { httpsAgent: agent });
            await axios.post(`${process.env.BACKEND_URL}/discord/webhook`, {
                data: messageData,
                group: 3,
                Event: "message_update_user",
            }, { httpsAgent: agent });
            await axios.post(`${process.env.BACKEND_URL}/discord/webhook`, {
                data: messageData,
                group: 4,
                Event: "message_update_server_user",
            }, { httpsAgent: agent });
            await axios.post(`${process.env.BACKEND_URL}/discord/webhook`, {
                data: messageData,
                group: 5,
                Event: "message_update_channel_user",
            }, { httpsAgent: agent });
            await axios.post(`${process.env.BACKEND_URL}/discord/webhook`, {
                data: messageData,
                group: 6,
                Event: "message_update_message_id",
            }, { httpsAgent: agent });
            console.log('Updated message data sent to webhook successfully');
        } catch (error) {
            console.error('Error sending updated message data to webhook:', error);
        }
    } else {
        console.log('Bot message ignored');
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
        await axios.post(`${process.env.BACKEND_URL}/discord/webhook`, {
            data: channelData,
            group: 0,
            Event: "channel_create",
        }, { httpsAgent: agent });
        await axios.post(`${process.env.BACKEND_URL}/discord/webhook`, {
            data: channelData,
            group: 1,
            Event: "channel_create_server",
        }, { httpsAgent: agent });
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
        await axios.post(`${process.env.BACKEND_URL}/discord/webhook`, {
            data: channelData,
            group: 0,
            Event: "channel_delete",
        }, { httpsAgent: agent });
        await axios.post(`${process.env.BACKEND_URL}/discord/webhook`, {
            data: channelData,
            group: 1,
            Event: "channel_delete_server",
        }, { httpsAgent: agent });
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
        await axios.post(`${process.env.BACKEND_URL}/discord/webhook`, {
            data: channelData,
            group: 0,
            Event: "channel_update",
        }, { httpsAgent: agent });
        await axios.post(`${process.env.BACKEND_URL}/discord/webhook`, {
            data: channelData,
            group: 1,
            Event: "channel_update_server",
        }, { httpsAgent: agent });
        console.log('Updated channel data sent to webhook successfully');
    } catch (error) {
        console.error('Error sending updated channel data to webhook:', error);
    }
});

// Listen for thread create events
client.on(Events.ThreadCreate, async (thread) => {
    const threadData = {
        threadId: thread.id,  // Add thread ID
        threadName: thread.name,  // Add thread name
        threadType: thread.type,  // Add thread type
        serverId: thread.guild.id,  // Add server ID
        channelId: thread.parentId,  // Add parent channel ID
        createdAt: thread.createdAt,  // Add creation timestamp
        Event: "thread_create",
    };

    try {
        // Send a POST request to your webhook route with the thread data
        await axios.post(`${process.env.BACKEND_URL}/discord/webhook`, {
            data: threadData,
            group: 0,
            Event: "thread_create",
        }, { httpsAgent: agent });
        console.log('Thread data sent to webhook successfully');
    } catch (error) {
        console.error('Error sending thread data to webhook:', error);
    }
});

// Listen for thread delete events
client.on(Events.ThreadDelete, async (thread) => {
    const threadData = {
        threadId: thread.id,  // Add thread ID
        threadName: thread.name,  // Add thread name
        threadType: thread.type,  // Add thread type
        serverId: thread.guild.id,  // Add server ID
        channelId: thread.parentId,  // Add parent channel ID
        deletedAt: new Date(),  // Add deletion timestamp
        Event: "thread_delete",
    };

    try {
        // Send a POST request to your webhook route with the deleted thread data
        await axios.post(`${process.env.BACKEND_URL}/discord/webhook`, {
            data: threadData,
            group: 0,
            Event: "thread_delete",
        }, { httpsAgent: agent });
        console.log('Deleted thread data sent to webhook successfully');
    } catch (error) {
        console.error('Error sending deleted thread data to webhook:', error);
    }
});

// Listen for thread update events
client.on(Events.ThreadUpdate, async (oldThread, newThread) => {
    const threadData = {
        oldThreadName: oldThread.name,  // Add old thread name
        newThreadName: newThread.name,  // Add new thread name
        oldThreadType: oldThread.type,  // Add old thread type
        newThreadType: newThread.type,  // Add new thread type
        serverId: oldThread.guild.id,  // Add server ID
        threadId: oldThread.id,  // Add thread ID
        updatedAt: new Date(),  // Add update timestamp
        Event: "thread_update",
    };

    try {
        // Send a POST request to your webhook route with the updated thread data
        await axios.post(`${process.env.BACKEND_URL}/discord/webhook`, {
            data: threadData,
            group: 0,
            Event: "thread_update",
        }, { httpsAgent: agent });
        console.log('Updated thread data sent to webhook successfully');
    } catch (error) {
        console.error('Error sending updated thread data to webhook:', error);
    }
});

// Listen for message reaction add events
client.on(Events.MessageReactionAdd, async (reaction, user) => {
    console.log('Reaction added:', reaction.emoji.name);
    if (!user.bot) {  // Ignore bot reactions
        const reactionData = {
            messageId: reaction.message.id,  // Add message ID
            channelId: reaction.message.channel.id,  // Add channel ID
            serverId: reaction.message.guild.id,  // Add server ID
            userId: user.id,  // Add user ID
            emoji: reaction.emoji.name,  // Add emoji name
            addedAt: new Date(),  // Add reaction timestamp
            Event: "message_reaction_add",
        };

        try {
            // Send a POST request to your webhook route with the reaction data
            await axios.post(`${process.env.BACKEND_URL}/discord/webhook`, {
                data: reactionData,
                group: 0,
                Event: "message_reaction_add",
            }, { httpsAgent: agent });
            console.log('Reaction data sent to webhook successfully');
        } catch (error) {
            console.error('Error sending reaction data to webhook:', error);
        }
    }
});

// Listen for message reaction remove events
client.on(Events.MessageReactionRemove, async (reaction, user) => {
    console.log('Reaction removed:', reaction.emoji.name);
    if (!user.bot) {  // Ignore bot reactions
        const reactionData = {
            messageId: reaction.message.id,  // Add message ID
            channelId: reaction.message.channel.id,  // Add channel ID
            serverId: reaction.message.guild.id,  // Add server ID
            userId: user.id,  // Add user ID
            emoji: reaction.emoji.name,  // Add emoji name
            removedAt: new Date(),  // Add reaction removal timestamp
            Event: "message_reaction_remove",
        };

        try {
            // Send a POST request to your webhook route with the reaction removal data
            await axios.post(`${process.env.BACKEND_URL}/discord/webhook`, {
                data: reactionData,
                group: 0,
                Event: "message_reaction_remove",
            }, { httpsAgent: agent });
            console.log('Reaction removal data sent to webhook successfully');
        } catch (error) {
            console.error('Error sending reaction removal data to webhook:', error);
        }
    }
});

// Listen for message reaction remove emoji events
client.on(Events.MessageReactionRemoveEmoji, async (reaction) => {
    console.log('Emoji removed from reactions:', reaction.emoji.name);
    const reactionData = {
        messageId: reaction.message.id,  // Add message ID
        channelId: reaction.message.channel.id,  // Add channel ID
        serverId: reaction.message.guild.id,  // Add server ID
        emoji: reaction.emoji.name,  // Add emoji name
        removedAt: new Date(),  // Add emoji removal timestamp
        Event: "message_reaction_remove_emoji",
    };

    try {
        // Send a POST request to your webhook route with the emoji removal data
        await axios.post(`${process.env.BACKEND_URL}/discord/webhook`, {
            data: reactionData,
            group: 0,
            Event: "message_reaction_remove_emoji",
        }, { httpsAgent: agent });
    } catch (error) {
        console.error('Error sending emoji removal data to webhook:', error);
    }
});

// Listen for message reaction remove all events
client.on(Events.MessageReactionRemoveAll, async (message) => {
    const reactionData = {
        messageId: message.id,  // Add message ID
        channelId: message.channel.id,  // Add channel ID
        serverId: message.guild.id,  // Add server ID
        removedAt: new Date(),  // Add reaction removal timestamp
        Event: "message_reaction_remove_all",
    };

    try {
        // Send a POST request to your webhook route with the reaction removal data
        await axios.post(`${process.env.BACKEND_URL}/discord/webhook`, {
            data: reactionData,
            group: 0,
            Event: "message_reaction_remove_all",
        }, { httpsAgent: agent });
        console.log('All reactions removed data sent to webhook successfully');
    } catch (error) {
        console.error('Error sending all reactions removed data to webhook:', error);
    }
});


client.on(Events.GuildRoleCreate, async (role) => {
    const roleData = {
        roleId: role.id,  // Add role ID
        roleName: role.name,  // Add role name
        serverId: role.guild.id,  // Add server ID
        createdAt: role.createdAt,  // Add creation timestamp
        Event: "role_create",
    };

    try {
        // Send a POST request to your webhook route with the role data
        await axios.post(`${process.env.BACKEND_URL}/discord/webhook`, {
            data: roleData,
            group: 0,
            Event: "role_create",
        }, { httpsAgent: agent });
        console.log('Role data sent to webhook successfully');
    } catch (error) {
        console.error('Error sending role data to webhook:', error);
    }
}
);

client.on(Events.GuildRoleDelete, async (role) => {
    const roleData = {
        roleId: role.id,  // Add role ID
        roleName: role.name,  // Add role name
        serverId: role.guild.id,  // Add server ID
        deletedAt: new Date(),  // Add deletion timestamp
        Event: "role_delete",
    };

    try {
        // Send a POST request to your webhook route with the deleted role data
        await axios.post(`${process.env.BACKEND_URL}/discord/webhook`, {
            data: roleData,
            group: 0,
            Event: "role_delete",
        }, { httpsAgent: agent });
        console.log('Deleted role data sent to webhook successfully');
    } catch (error) {
        console.error('Error sending deleted role data to webhook:', error);
    }
}
);

client.on(Events.GuildRoleUpdate, async (oldRole, newRole) => {
    const roleData = {
        oldRoleName: oldRole.name,  // Add old role name
        newRoleName: newRole.name,  // Add new role name
        serverId: oldRole.guild.id,  // Add server ID
        roleId: oldRole.id,  // Add role ID
        updatedAt: new Date(),  // Add update timestamp
        Event: "role_update",
    };

    try {
        // Send a POST request to your webhook route with the updated role data
        await axios.post(`${process.env.BACKEND_URL}/discord/webhook`, {
            data: roleData,
            group: 0,
            Event: "role_update",
        }, { httpsAgent: agent });
        console.log('Updated role data sent to webhook successfully');
    } catch (error) {
        console.error('Error sending updated role data to webhook:', error);
    }
}
);

module.exports = { discordClient: client };
