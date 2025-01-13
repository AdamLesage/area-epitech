const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { Dropbox } = require('dropbox');

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

reactions.set('send_message', discord_send_message_to_a_channel);
reactions.set('delete_message', discord_delete_message_from_a_channel);
reactions.set('create_channel', discord_create_channel_in_server);
reactions.set('delete_channel', discord_delete_channel_from_server);
reactions.set('clear_all_messages_from_channel', discord_delete_all_messages_from_a_channel);
reactions.set('Clear_custom_hours_messages_from_channel', discord_delete_custom_hours_messages_from_a_channel);
reactions.set('Clear_custom_days_messages_from_channel', discord_delete_custom_days_messages_from_a_channel);
reactions.set('send_reaction', discord_send_reaction_to_message);
reactions.set("create_role", discord_create_role_in_server);
reactions.set("delete_role", discord_delete_role_from_server);
reactions.set("edit_role", discord_edit_role_in_server);
reactions.set("add_role_to_user", discord_add_role_to_user);
reactions.set("remove_role_from_user", discord_remove_role_from_user);
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
async function discord_send_message_to_a_channel(channelId, messageContent) {
    console.log('Sending message content:', messageContent);
    try {
        const channel = await client.channels.fetch(channelId);
        if (channel) {
            await channel.send(messageContent);
            console.log('Message sent successfully');
        } else {
            console.error('Channel not found');
        }
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

async function discord_delete_message_from_a_channel(channelId, messageId) {
    console.log('Deleting message:', messageId);
    try {
        const channel = await client.channels.fetch(channelId);
        if (channel) {
            const message = await channel.messages.fetch(messageId);
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
async function discord_create_channel_in_server(serverId, channelName, channelType) {
    console.log('Creating channel:', channelName);
    try {
        const server = await client.guilds.fetch(serverId);
        if (server) {
            await server.channels.create({
                name: channelName,
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

async function discord_delete_channel_from_server(serverId, channelName) {
    console.log('Deleting channel:', channelName);
    try {
        const server = await client.guilds.fetch(serverId);
        if (server) {
            const channel = server.channels.cache.find(channel => channel.name === channelName);
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


async function discord_delete_all_messages_from_a_channel(channelId) {
    console.log('Clearing all messages from channel:', channelId);
    try {
        const channel = await client.channels.fetch(channelId);
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


async function discord_delete_custom_hours_messages_from_a_channel(channelId, hours) {
    console.log('Clearing custom hours messages from channel:', channelId);
    try {
        const channel = await client.channels.fetch(channelId);
        if (channel) {
            const messages = await channel.messages.fetch();
            const now = new Date();
            messages.forEach(async message => {
                if (now - message.createdAt < hours * 3600000) {
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

async function discord_delete_custom_days_messages_from_a_channel(channelId, days) {
    console.log('Clearing custom days messages from channel:', channelId);
    try {
        const channel = await client.channels.fetch(channelId);
        if (channel) {
            const messages = await channel.messages.fetch();
            const now = new Date();
            messages.forEach(async message => {
                if (now - message.createdAt < days * 86400000) {
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


async function discord_send_reaction_to_message(channelId, messageId, emoji) {
    console.log('Sending reaction to message:', messageId);
    try {
        const channel = await client.channels.fetch(channelId);
        if (channel) {
            const message = await channel.messages.fetch(messageId);
            if (message) {
                await message.react(emoji);
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


async function discord_create_role_in_server(serverId, roleName, permissionType, color) {
    console.log('Creating role:', roleName);
    try {
        const server = await client.guilds.fetch(serverId);
        if (server) {
            let permissions;
            switch (permissionType) {
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
                name: roleName,
                permissions: permissions,
                color: color
            });
            console.log('Role created successfully');
        } else {
            console.error('Server not found');
        }
    } catch (error) {
        console.error('Error creating role:', error);
    }
}


async function discord_delete_role_from_server(serverId, roleName) {
    console.log('Deleting role:', roleName);
    try {
        const server = await client.guilds.fetch(serverId);
        if (server) {
            const role = server.roles.cache.find(role => role.name === roleName);
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

async function discord_edit_role_in_server(serverId, roleName, newRoleName, newPermissions, newColor) {
    console.log('Editing role:', roleName);
    try {
        const server = await client.guilds.fetch(serverId);
        if (server) {
            const role = server.roles.cache.find(role => role.name === roleName);
            if (role) {
                await role.edit({
                    name: newRoleName,
                    permissions: newPermissions,
                    color: newColor
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

async function discord_add_role_to_user(serverId, userId, roleName) {
    console.log('Adding role to user:', roleName);
    try {
        const server = await client.guilds.fetch(serverId);
        if (server) {
            const member = await server.members.fetch(userId);
            if (member) {
                const role = server.roles.cache.find(role => role.name === roleName);
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

async function discord_remove_role_from_user(serverId, userId, roleName) {
    console.log('Removing role from user:', roleName);
    try {
        const server = await client.guilds.fetch(serverId);
        if (server) {
            const member = await server.members.fetch(userId);
            if (member) {
                const role = server.roles.cache.find(role => role.name === roleName);
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

module.exports = reactions;
