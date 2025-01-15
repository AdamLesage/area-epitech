const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { Dropbox } = require('dropbox');
const { Client,GatewayIntentBits, Partials, ChannelType, PermissionsBitField } = require('discord.js');

// Create a new Map to store reaction handlers
const reactions = new Map();
reactions.set('dropbox_add_file', dropbox_add_file);
reactions.set('dropbox_share_file', dropbox_share_file);
reactions.set('dropbox_unshare_file', dropbox_unshare_file);
reactions.set('dropbox_add_folder', dropbox_add_folder);
reactions.set('dropbox_delete_file', dropbox_delete_file);

reactions.set('create_issue', github_create_issue);
reactions.set('create_milestone', github_create_milestone);
reactions.set('create_pull_request', github_pull_request);

reactions.set('playlist_create', spotify_create_playlist);

reactions.set('discord_send_message_to_a_channel', discord_send_message_to_a_channel);
reactions.set('discord_delete_message_from_a_channel', discord_delete_message_from_a_channel);
reactions.set('discord_create_channel_in_server', discord_create_channel_in_server);
reactions.set('discord_delete_channel_from_server', discord_delete_channel_from_server);
reactions.set('discord_clear_all_messages_from_channel', discord_clear_all_messages_from_channel);
reactions.set('clear_custom_hours_messages_from_a_channel', clear_custom_hours_messages_from_a_channel);
reactions.set('clear_custom_days_messages_from_a_channel', clear_custom_days_messages_from_a_channel);
reactions.set('discord_send_reaction_to_message', discord_send_reaction_to_message);
reactions.set("discord_create_role_in_a_server", discord_create_role_in_a_server);
reactions.set("discord_delete_role_from_server", discord_delete_role_from_server);
reactions.set("discord_edit_role_in_server", discord_edit_role_in_server);
reactions.set("discord_attribute_role_to_a_user", discord_attribute_role_to_a_user);
reactions.set("discord_remove_role_to_a_user", discord_remove_role_to_a_user);
reactions.set("discord_ban_user_from_a_server", discord_ban_user_from_a_server);
reactions.set("discord_unban_user_from_a_server", discord_unban_user_from_a_server);

/**
 * @brief Retrieve the access token for a user's linked service account.
 * 
 * @param {string} userUuid - The UUID of the user.
 * @param {string} serviceName - The name of the linked service (e.g., "github").
 * @returns {string} The access token for the linked service.
 * @throws {Error} If the user or the linked service account does not exist, or if no token is found.
 */
async function getAccessToken(userUuid, serviceName) {
    let user = await prisma.user.findUnique({
        where: { uuid: userUuid },
        include: { linkedAccounts: true },
    });

    // Find github linked account
    const linkedAccount = user.linkedAccounts.find(
        account => account.serviceName === serviceName
    );
    console.log("Linked account:", linkedAccount);
    return linkedAccount.authToken;
}

async function getusername(userUuid, serviceName) {
    let user = await prisma.user.findUnique({
        where: { uuid: userUuid },
        include: { linkedAccounts: true },
    });

    // Find github linked account
    const linkedAccount = user.linkedAccounts.find(
        account => account.serviceName === serviceName
    );
    return linkedAccount.username;
}

/**
 * Handler function for the 'dropbox_new_file' reaction.
 * 
 * @param {Object} reactionData Data related to the reaction
 * @param {Object} actionResponseData Data sent by the action that triggered this reaction.
 * @param {string} userUuid - The UUID of the user performing the reaction.
 */
async function dropbox_add_file(reactionData, actionResponseData, userUuid) {
    try {
        const accessToken = await getAccessToken(userUuid, "dropbox");
        const dbx = new Dropbox({ accessToken: accessToken });
        const response = await dbx.filesUpload({
            path: `${reactionData.fileName}`,
            contents: reactionData.fileContent || '',
            mode: { ".tag": reactionData.mode || "add" }
        });
        console.log("File added successfully:", response);
    } catch (error) {
        console.error("Error adding file to Dropbox:", error);
    }
}

/**
 * Handler function for the 'dropbox_shares_file' reaction.
 * 
 * @param {Object} reactionData Data related to the reaction
 * @param {Object} actionResponseData Data sent by the action that triggered this reaction.
 * @param {string} userUuid - The UUID of the user performing the reaction.
 */
async function dropbox_share_file(reactionData, actionResponseData) {
    try {
        const accessToken = await getAccessToken(userUuid, "dropbox");
        const dbx = new Dropbox({ accessToken: accessToken });
        console.log("Sharing file in Dropbox:", reactionData, actionResponseData);
        const response = await dbx.sharingCreateSharedLinkWithSettings({
            path: reactionData.filePath,
        });
        console.log("File shared successfully:", response);
    } catch (error) {
        console.error("Error sharing file in Dropbox:", error);
    }
}

/**
 * Handler function for the 'dropbox_unshare_file' reaction.
 * 
 * @param {Object} reactionData Data related to the reaction
 * @param {Object} actionResponseData Data sent by the action that triggered this reaction.
 * @param {string} userUuid - The UUID of the user performing the reaction.
 */
async function dropbox_unshare_file(reactionData, actionResponseData, userUuid) {
    try {
        const accessToken = await getAccessToken(userUuid, "dropbox");
        const dbx = new Dropbox({ accessToken: accessToken });
        console.log("Unsharing file in Dropbox:", reactionData, actionResponseData);
        const response = await dbx.sharingRevokeSharedLink({
            url: reactionData.sharedLink,
        });
        console.log("File unshared successfully:", response);
    } catch (error) {
        console.error("Error unsharing file in Dropbox:", error);
    }
}

/**
 * Handler function for the 'dropbox_add_folder' reaction.
 * 
 * @param {Object} reactionData Data related to the reaction
 * @param {Object} actionResponseData Data sent by the action that triggered this reaction.
 * @param {string} userUuid - The UUID of the user performing the reaction.
 */
async function dropbox_add_folder(reactionData, actionResponseData, userUuid) {
    try {
        const accessToken = await getAccessToken(userUuid, "dropbox");
        const dbx = new Dropbox({ accessToken: accessToken });
        console.log("Adding folder to Dropbox:", reactionData, actionResponseData);
        const response = await dbx.filesCreateFolderV2({
            path: `/${reactionData.folderName}`,
        });
        console.log("Folder added successfully:", response);
    } catch (error) {
        console.error("Error adding folder to Dropbox:", error);
    }
}

/**
 * Handler function for the 'dropbox_delete_file' reaction.
 * 
 * @param {Object} reactionData Data related to the reaction
 * @param {Object} actionResponseData Data sent by the action that triggered this reaction.
 * @param {string} userUuid - The UUID of the user performing the reaction.
 */
async function dropbox_delete_file(reactionData, actionResponseData, userUuid) {
    try {
        const accessToken = await getAccessToken(userUuid, "dropbox");
        const dbx = new Dropbox({ accessToken: accessToken });
        console.log("Deleting file in Dropbox:", reactionData, actionResponseData);
        const response = await dbx.filesDeleteV2({
            path: reactionData.filePath,
        });
        console.log("File deleted successfully:", response);
    } catch (error) {
        console.error("Error deleting file in Dropbox:", error);
    }
}

/**
 * Handler function for the 'github_create_issue' reaction.
 * 
 * @param {Object} reactionData Data related to the reaction
 * @param {Object} actionResponseData Data sent by the action that triggered this reaction.
 * @param {string} userUuid - The UUID of the user performing the reaction.
*/
async function github_create_issue(reactionData, actionResponseData, userUuid) {
    const repository = reactionData.repository || null;
    if (!repository) {
        console.error("Missing repository in reaction data");
        return;
    }

    const [repoOwner, repoName] = repository.split('/');

    if (!repoOwner || !repoName) {
        console.error("Missing repoOwner or repoName in reaction data");
        return;
    }
    if (!userUuid) {
        console.error("Missing userUuid in reaction data");
        return;
    }

    const accessToken = await getAccessToken(userUuid, "github");

    if (!accessToken) {
        console.error("No access token found for user");
        return;
    }

    const response = await axios.post(`https://api.github.com/repos/${repoOwner}/${repoName}/issues`,
        {
            "title": reactionData.title || "default title",
            "body": reactionData.body || "enter the body here",
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Accept': 'application/vnd.github+json',
                "X-GitHub-Api-Version": "2022-11-28"
            }
        });
    if (response.status > 299) {
        console.error(`Error calling reaction create_milestone`);
    }
}

/**
 * Handler function for the 'github_create_milestone' reaction.
 * 
 * @param {Object} reactionData Data related to the reaction
 * @param {Object} actionResponseData Data sent by the action that triggered this reaction.
 * @param {string} userUuid - The UUID of the user performing the reaction.
 */
async function github_create_milestone(reactionData, actionResponseData, userUuid) {
    const repository = reactionData.repository || null;
    if (!repository) {
        console.error("Missing repository in reaction data");
        return;
    }

    const [repoOwner, repoName] = repository.split('/');

    if (!repoOwner || !repoName) {
        console.error("Missing repoOwner or repoName in reaction data");
        return;
    }
    if (!userUuid) {
        console.error("Missing userUuid in reaction data");
        return;
    }

    const accessToken = await getAccessToken(userUuid, "github");

    if (!accessToken) {
        console.error("No access token found for user");
        return;
    }

    const response = await axios.post(`https://api.github.com/repos/${repoOwner}/${repoName}/milestones`,
        {
            "title": reactionData.title || "default title",
            "state": reactionData.state || "open",
            "description": reactionData.description || "enter the description here",
            "due_on": reactionData.due_on || new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() 
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Accept': 'application/vnd.github+json',
                "X-GitHub-Api-Version": "2022-11-28"
            }
        });
    if (response.status > 299) {
        console.error(`Error calling reaction create_milestone`);
    }
}

/**
 * Handler function for the 'github_pull_request' reaction.
 * @param {Object} reactionData Data related to the reaction
 * @param {Object} actionResponseData Data sent by the action that triggered this reaction.
 * @param {string} userUuid - The UUID of the user performing the reaction.
 */
async function github_pull_request(reactionData, actionResponseData, userUuid) {
    const repository = reactionData.repository || null;
    if (!repository) {
        console.error("Missing repository in reaction data");
        return;
    }

    const [repoOwner, repoName] = repository.split('/');

    if (!repoOwner || !repoName) {
        console.error("Missing repoOwner or repoName in reaction data");
        return;
    }
    if (!userUuid) {
        console.error("Missing userUuid in reaction data");
        return;
    }

    const accessToken = await getAccessToken(userUuid, "github");

    if (!accessToken) {
        console.error("No access token found for user");
        return;
    }

    const response = await axios.post(`https://api.github.com/repos/${repoOwner}/${repoName}/pulls`,
        {
            "title": reactionData.title || "default title",
            "body": reactionData.body || "enter the body here",
            "base": "master"
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Accept': 'application/vnd.github+json',
                "X-GitHub-Api-Version": "2022-11-28"
            }
        });
    if (response.status > 299) {
        console.error(`Error calling reaction create_milestone`);
    }
}

async function spotify_create_playlist(reactionData, actionResponseData, userUuid) {
    const accessToken = await getAccessToken(userUuid, "spotify");

    if (!accessToken) {
        console.error("No access token found for user");
        return;
    }
    const username = await getusername(userUuid, "spotify");
    console.log("Creating playlist in Spotify:", reactionData, actionResponseData);
    const response = await axios.post(`https://api.spotify.com/v1/users/${username}/playlists`,
        {
            "name": reactionData.name || "default name",
            "description": reactionData.description || "enter the description here",
            "public": reactionData.public || false
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Accept': 'application/json',
                "Content-Type": "application/json"
            }
        });
    if (response.status > 299) {
        console.error(`Error calling reaction create_playlist`);
        return;
    }
    console.log("Playlist created successfully:", response);   
}

// Function to send a message to a specific channel
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
client.login(process.env.DISCORD_BOT_TOKEN); 

async function discord_send_message_to_a_channel(channelId) {
    console.log('Sending message to channel:', channelId);
    const realchannelId = String(channelId.channel).split('/')[1];
    const realmessage = String(channelId.message);
    realmessage
    try {
        const channel = await client.channels.fetch(realchannelId);
        if (channel) {
            await channel.send(realmessage);
            console.log('Message sent successfully');
        } else {
            console.error('Channel not found');
        }
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

async function discord_delete_message_from_a_channel(channelId) {
    console.log('Deleting message:', channelId);
    const realchannelId = String(channelId.channel).split('/')[1];
    const realmessageId = String(channelId.message);
    try {
        const channel = await client.channels.fetch(realchannelId);
        if (channel) {
            const message = await channel.messages.fetch(realmessageId);
            if (message) {
                await message.delete();
                console.log('Message deleted successfully');
            } else {
                console.error('Message not found');
            }
        } else {
            console.error('Channel not found');
        }
    } catch (error) {
        console.error('Error deleting message:', error);
    }
}


// Function to create a channel
async function discord_create_channel_in_server(ChannelId) {
    console.log('Creating channel:', ChannelId.channelName);
    console.log('Server:', ChannelId.channel);
    const realserverId = String(ChannelId.server).split('/')[0];
    const realchannelName = String(ChannelId.channel);
    try {
        const server = await client.guilds.fetch(realserverId);
        if (server) {
            await server.channels.create({
                name: realchannelName,
                type: ChannelType.GuildText // Use ChannelType.GuildText instead of "GUILD_TEXT"
            });
            console.log('Channel created successfully');
        } else {
            console.error('Server not found');
        }
    } catch (error) {
        console.error('Error creating channel:', error);
    }
}


//Function to delete a channel

async function discord_delete_channel_from_server(ChannelId) {
    console.log('Deleting channel:', ChannelId);
    const realserverId = String(ChannelId.server).split('/')[0];
    const realchannelId = String(ChannelId.channel).split('/')[1];
    try {
        const server = await client.guilds.fetch(realserverId);
        if (server) {
            const channel = server.channels.cache.get(realchannelId);
            if (channel) {
                await channel.delete();
                console.log('Channel deleted successfully');
            } else {
                console.error('Channel not found');
            }
        } else {
            console.error('Server not found');
        }
    } catch (error) {
        console.error('Error deleting channel:', error);
    }
}


async function discord_clear_all_messages_from_channel(channelId) {
    console.log('Clearing all messages from channel:', channelId.channel);
    const realchannelId = String(channelId.channel).split('/')[1];
    console.log('realchannelId:', realchannelId);
    try {
        const channel = await client.channels.fetch(realchannelId);
        if (channel) {
            const messages = await channel.messages.fetch();
            messages.forEach(async message => {
                await message.delete();
            });
            console.log('All messages cleared successfully');
        } else {
            console.error('Channel not found');
        }
    } catch (error) {
        console.error('Error clearing all messages:', error);
    }
}


async function clear_custom_hours_messages_from_a_channel(channelId) {
    console.log('Clearing custom hours messages from channel:',channelId);
    const realchannelId = String(channelId.channel).split('/')[1];
    const realhours = String(channelId.hours);
    console.log('realchannelId:', realchannelId);
    console.log('realhours:', realhours);
    try {
        const channel = await client.channels.fetch(realchannelId);
        if (channel) {
            const messages = await channel.messages.fetch();
            const now = new Date();
            messages.forEach(async message => {
                if (now - message.createdAt < realhours * 3600000) {
                    await message.delete();
                }
            });
            console.log('Custom hours messages cleared successfully');
        } else {
            console.error('Channel not found');
        }
    } catch (error) {
        console.error('Error clearing custom hours messages:', error);
    }
}

async function clear_custom_days_messages_from_a_channel(channelId) {
    console.log('Clearing custom days messages from channel:', channelId);
    const realchannelId = String(channelId.channel).split('/')[1];
    const realdays = String(channelId.days);
    console.log('realchannelId:', realchannelId);
    console.log('realdays:', realdays);

    try {
        const channel = await client.channels.fetch(realchannelId);
        if (channel) {
            const messages = await channel.messages.fetch();
            const now = new Date();
            messages.forEach(async message => {
                if (now - message.createdAt < realdays * 86400000) {
                    await message.delete();
                }
            });
            console.log('Custom days messages cleared successfully');
        } else {
            console.error('Channel not found');
        }
    } catch (error) {
        console.error('Error clearing custom days messages:', error);
    }
}


async function discord_send_reaction_to_message(channelId) {
    console.log('Sending reaction to message:', channelId);
    const realchannelId = String(channelId.channel).split('/')[1];
    const realmessageId = String(channelId.message);
    const realemoji = String(channelId.emoji);
    try {
        const channel = await client.channels.fetch(realchannelId);
        if (channel) {
            const message = await channel.messages.fetch(realmessageId);
            if (message) {
                await message.react(realemoji);
                console.log('Reaction sent successfully');
            } else {
                console.error('Message not found');
            }
        } else {
            console.error('Channel not found');
        }
    } catch (error) {
        console.error('Error sending reaction:', error);
    }
}


async function discord_create_role_in_a_server(serverId) {
    console.log('Creating role:', serverId);
    const realserverId = String(serverId.server);
    const realroleName = String(serverId.role);
    const realpermissionType = String(serverId.color.type);
    const realcolor = String(serverId.color.color);
    try {
        const server = await client.guilds.fetch(realserverId);
        if (server) {
            let permissions;
            switch (realpermissionType) {
                case 'usual':
                    permissions = [
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.SendMessages,
                        PermissionsBitField.Flags.ReadMessageHistory
                    ];
                    break;
                case 'explorer':
                    permissions = [
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.SendMessages,
                        PermissionsBitField.Flags.ReadMessageHistory,
                        PermissionsBitField.Flags.ManageMessages,
                        PermissionsBitField.Flags.ManageChannels
                    ];
                    break;
                case 'admin':
                    permissions = [
                        PermissionsBitField.Flags.Administrator
                    ];
                    break;
                default:
                    throw new Error('Invalid permission type');
            }

            await server.roles.create({
                name: realroleName,
                permissions: permissions,
                color: realcolor
            });
            console.log('Role created successfully');
        } else {
            console.error('Server not found');
        }
    } catch (error) {
        console.error('Error creating role:', error);
    }
}

async function discord_delete_role_from_server(serverId) {
    console.log('Deleting role:', serverId);
    const realserverId = String(serverId.role).split('/')[0];
    const realroleid = String(serverId.role).split('/')[1];
    console.log('realserverId:', realserverId);
    console.log('realroleName:', realroleid);
    try {
        const server = await client.guilds.fetch(realserverId);
        if (server) {
            const role = server.roles.cache.get(realroleid);
            if (role) {
                await role.delete();
                console.log('Role deleted successfully');
            } else {
                console.error('Role not found');
            }
        } else {
            console.error('Server not found');
        }
    } catch (error) {
        console.error('Error deleting role:', error);
    }
}
async function discord_edit_role_in_server(serverId) {
    console.log('Editing role:', serverId);
    const realserverId = String(serverId.role).split('/')[0];
    const realroleid = String(serverId.role).split('/')[1];
    const realnewrolename = String(serverId.Newrolename);
    const realnewpermissionType = String(serverId.colorandpermission.type);
    const realnewcolor = String(serverId.colorandpermission.color);
    console.log('realserverId:', realserverId);
    console.log('realroleName:', realroleid);
    console.log('realnewrolename:', realnewrolename);
    console.log('realnewpermissionType:', realnewpermissionType);
    console.log('realnewcolor:', realnewcolor);
    try {
        const server = await client.guilds.fetch(realserverId);
        if (server) {
            const role = server.roles.cache.get(realroleid);
            if (role) {
                let newPermissions;
                switch (realnewpermissionType) {
                    case 'usual':
                        newPermissions = [
                            PermissionsBitField.Flags.ViewChannel,
                            PermissionsBitField.Flags.SendMessages,
                            PermissionsBitField.Flags.ReadMessageHistory
                        ];
                        break;
                    case 'explorer':
                        newPermissions = [
                            PermissionsBitField.Flags.ViewChannel,
                            PermissionsBitField.Flags.SendMessages,
                            PermissionsBitField.Flags.ReadMessageHistory,
                            PermissionsBitField.Flags.ManageMessages,
                            PermissionsBitField.Flags.ManageChannels
                        ];
                        break;
                    case 'admin':
                        newPermissions = [
                            PermissionsBitField.Flags.Administrator
                        ];
                        break;
                    default:
                        throw new Error('Invalid permission type');
                }

                await role.edit({
                    name: realnewrolename,
                    permissions: newPermissions,
                    color: realnewcolor
                });
                console.log('Role edited successfully');
            } else {
                console.error('Role not found');
            }
        } else {
            console.error('Server not found');
        }
    } catch (error) {
        console.error('Error editing role:', error);
    }
}

async function discord_attribute_role_to_a_user(serverId, userId, roleName) {
    console.log('Adding role to user:', serverId);
    const realuserId = String(serverId.user);
    const realserverId = String(serverId.roleserver).split('/')[0];
    const realroleId = String(serverId.roleserver).split('/')[1];
    try {
        const server = await client.guilds.fetch(realserverId);
        if (server) {
            const member = await server.members.fetch(realuserId);
            if (member) {
                const role = server.roles.cache.get(realroleId);
                if (role) {
                    await member.roles.add(role);
                    console.log('Role added to user successfully');
                } else {
                    console.error('Role not found');
                }
            } else {
                console.error('User not found');
            }
        } else {
            console.error('Server not found');
        }
    } catch (error) {
        console.error('Error adding role to user:', error);
    }
}

async function discord_remove_role_to_a_user(serverId, userId, roleName) {
    console.log('Removing role from user:', serverId);
    const realuserId = String(serverId.user);
    const realserverId = String(serverId.roleserver).split('/')[0];
    const realroleId = String(serverId.roleserver).split('/')[1];
    try {
        const server = await client.guilds.fetch(realserverId);
        if (server) {
            const member = await server.members.fetch(realuserId);
            if (member) {
                const role = server.roles.cache.get(realroleId);
                if (role) {
                    await member.roles.remove(role);
                    console.log('Role removed from user successfully');
                } else {
                    console.error('Role not found');
                }
            } else {
                console.error('User not found');
            }
        } else {
            console.error('Server not found');
        }
    } catch (error) {
        console.error('Error removing role from user:', error);
    }
}

async function discord_ban_user_from_a_server(serverId, userId) {
    console.log('Banning user from server:', serverId);
    const realuserId = String(serverId.user);
    const realserverId = String(serverId.server);
    try {
        const server = await client.guilds.fetch(realserverId);
        if (server) {
            const member = await server.members.fetch(realuserId);
            if (member) {
                await member.ban();
                console.log('User banned successfully');
            } else {
                console.error('User not found');
            }
        } else {
            console.error('Server not found');
        }
    } catch (error) {
        console.error('Error banning user:', error);
    }
}

async function discord_unban_user_from_a_server(serverId, userId) {
    console.log('Unbanning user from server:', serverId);
    const realserverId = String(serverId.server);
    const realuserId = String(serverId.user);
    try {
        const server = await client.guilds.fetch(realserverId);
        if (server) {
            await server.members.unban(realuserId);
            console.log('User unbanned successfully');
        } else {
            console.error('Server not found');
        }
    } catch (error) {
        console.error('Error unbanning user:', error);
    }
}

module.exports = reactions;
