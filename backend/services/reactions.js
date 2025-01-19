const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { Dropbox } = require('dropbox');
const { initializeGmailClient } = require('../utils/initGmailClient');
const { Client,GatewayIntentBits, Partials, ChannelType, PermissionsBitField } = require('discord.js');
const { google } = require('googleapis');

// Create a new Map to store reaction handlers
const reactions = new Map();

// Dropbox Reactions
reactions.set('dropbox_add_file', dropbox_add_file);
reactions.set('dropbox_share_file', dropbox_share_file);
reactions.set('dropbox_unshare_file', dropbox_unshare_file);
reactions.set('dropbox_add_folder', dropbox_add_folder);
reactions.set('dropbox_delete_file', dropbox_delete_file);

// Github Reactions
reactions.set('create_issue', github_create_issue);
reactions.set('create_milestone', github_create_milestone);
reactions.set('create_pull_request', github_pull_request);
reactions.set('create_label', github_create_label);
reactions.set('delete_label', github_delete_label);
reactions.set('edit_label', github_edit_label);
reactions.set('lock_issue', github_lock_issue);
reactions.set('unlock_issue', github_unlock_issue);
reactions.set('update_issue', github_update_issue);
reactions.set('update_issue_state', github_update_issue_state);
reactions.set('add_label_to_issue', github_add_label_to_issue);
reactions.set('remove_label_from_issue', github_remove_label_from_issue);
reactions.set('remove_all_labels_from_issue', github_remove_all_labels_from_issue);
reactions.set('create_issue_comment', github_create_issue_comment);
reactions.set('update_issue_comment', github_update_issue_comment);
reactions.set('delete_issue_comment', github_delete_issue_comment);
reactions.set('add_assignee_to_issue', github_add_assignee_to_issue);
reactions.set('remove_assignee_from_issue', github_remove_assignee_from_issue);
reactions.set('update_milestone', github_update_milestone);
reactions.set('delete_milestone', github_delete_milestone);
reactions.set('add_milestone_to_issue', github_add_milestone_to_issue);
reactions.set('remove_milestone_from_issue', github_remove_milestone_from_issue);
reactions.set('update_pull_request', github_update_pull_request);
reactions.set('update_pull_request_state', github_update_pull_request_state);
reactions.set('create_reaction_for_issue', github_create_reaction_for_issue);

// Spotify Reactions
reactions.set('playlist_create', spotify_create_playlist);
reactions.set('playlist_add_track', spotify_add_to_playlist);
reactions.set('save_track', spotify_save_track);
reactions.set('skip_track', spotify_skip_track);
reactions.set('previous_track', spotify_previous_track);
reactions.set('start_resume', spotify_start_resume);
reactions.set('pause', spotify_pause);
reactions.set('add_track_to_queue', spotify_add_track_to_queue);

// Discord Reactions
reactions.set('discord_send_message_to_a_channel', discord_send_message_to_a_channel);
reactions.set('discord_delete_message_from_a_channel', discord_delete_message_from_a_channel);
reactions.set('discord_create_channel_in_server', discord_create_channel_in_server);
reactions.set('discord_delete_channel_from_server', discord_delete_channel_from_server);
reactions.set('discord_clear_all_messages_from_channel', discord_clear_all_messages_from_channel);
reactions.set('clear_custom_hours_messages_from_a_channel', clear_custom_hours_messages_from_a_channel);
reactions.set('clear_custom_days_messages_from_a_channel', clear_custom_days_messages_from_a_channel);
reactions.set('discord_send_reaction_to_message', discord_send_reaction_to_message);
reactions.set('discord_create_role_in_a_server', discord_create_role_in_a_server);
reactions.set('discord_delete_role_from_server', discord_delete_role_from_server);
reactions.set('discord_edit_role_in_server', discord_edit_role_in_server);
reactions.set('discord_attribute_role_to_a_user', discord_attribute_role_to_a_user);
reactions.set('discord_remove_role_to_a_user', discord_remove_role_to_a_user);
reactions.set('discord_ban_user_from_a_server', discord_ban_user_from_a_server);
reactions.set('discord_unban_user_from_a_server', discord_unban_user_from_a_server);

// Strava Reactions
reactions.set('update_athlete', strava_update_athlete);
reactions.set('create_activity', strava_create_activity);
reactions.set('update_activity', strava_update_activity);

// News Reactions
reactions.set('fetch_news', fetchNews);

// Area Reactions
reactions.set('area_delete', area_delete);
reactions.set('area_start', area_start);
reactions.set('area_stop', area_stop);

// Gmail Reactions
reactions.set('gmail_send_email', gmail_send_email);
reactions.set('gmail_delete_email', gmail_delete_email);
reactions.set('gmail_add_label', gmail_add_label);
reactions.set('gmail_remove_label', gmail_remove_label);
reactions.set('gmail_reply_to_email', gmail_reply_to_email);
reactions.set('gmail_forward_email', gmail_forward_email);
reactions.set('gmail_create_draft', gmail_create_draft);

/**
 * @brief Retrieve the access token for a user's linked service account.
 * 
 * @param {string} userUuid - The UUID of the user.
 * @param {string} serviceName - The name of the linked service (e.g., 'github').
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
    console.log('Linked account:', linkedAccount);
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

async function github_create_label(reactionData, actionResponseData, userUuid) {
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

    const response = await axios.post(`https://api.github.com/repos/${repoOwner}/${repoName}/labels`,
        {
            "name": reactionData.name || "default name",
            "color": reactionData.color || "ffffff"
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Accept': 'application/vnd.github+json',
            }
        });
    if (response.status > 299) {
        console.error(`Error calling reaction create_label`);
    }
}

async function github_delete_label(reactionData, actionResponseData, userUuid) {
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

    const response = await axios.delete(`https://api.github.com/repos/${repoOwner}/${repoName}/labels/${reactionData.name}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Accept': 'application/vnd.github+json',
            }
        });
    if (response.status > 299) {
        console.error(`Error calling reaction delete_label`);
    }
}

async function github_edit_label(reactionData, actionResponseData, userUuid) {
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

    const response = await axios.patch(`https://api.github.com/repos/${repoOwner}/${repoName}/labels/${reactionData.name}`,
        {
            "name": reactionData.new_name || "default name",
            "color": reactionData.color || "ffffff"
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Accept': 'application/vnd.github+json',
            }
        });
    if (response.status > 299) {
        console.error(`Error calling reaction edit_label`);
    }
}

async function github_lock_issue(reactionData, actionResponseData, userUuid) {
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

    const response = await axios.put(`https://api.github.com/repos/${repoOwner}/${repoName}/issues/${reactionData.issue_number}/lock`,
        {
            "lock_reason": reactionData.lock_reason || "off-topic"
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Accept': 'application/vnd.github+json',
            }
        });
    if (response.status > 299) {
        console.error(`Error calling reaction lock_issue`);
    }
}

async function github_unlock_issue(reactionData, actionResponseData, userUuid) {
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

    const response = await axios.delete(`https://api.github.com/repos/${repoOwner}/${repoName}/issues/${reactionData.issue_number}/lock`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Accept': 'application/vnd.github+json',
            }
        });
    if (response.status > 299) {
        console.error(`Error calling reaction unlock_issue`);
    }
}

async function github_update_issue(reactionData, actionResponseData, userUuid) {
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

    const response = await axios.patch(`https://api.github.com/repos/${repoOwner}/${repoName}/issues/${reactionData.issue_number}`,
        {
            "title": reactionData.title || "default title",
            "body": reactionData.body || "enter the body here",
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Accept': 'application/vnd.github+json',
            }
        });
    if (response.status > 299) {
        console.error(`Error calling reaction update_issue`);
    }
}

async function github_update_issue_state(reactionData, actionResponseData, userUuid) {
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

    const response = await axios.patch(`https://api.github.com/repos/${repoOwner}/${repoName}/issues/${reactionData.issue_number}`,
        {
            "state": reactionData.state || "open",
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Accept': 'application/vnd.github+json',
            }
        });
    if (response.status > 299) {
        console.error(`Error calling reaction update_issue_state`);
    }
}

async function github_add_label_to_issue(reactionData, actionResponseData, userUuid) {
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

    const response = await axios.post(`https://api.github.com/repos/${repoOwner}/${repoName}/issues/${reactionData.issue_number}/labels`,
        {
            "labels": [reactionData.label],
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Accept': 'application/vnd.github+json',
            }
        });
    if (response.status > 299) {
        console.error(`Error calling reaction add_label_to_issue`);
    }
}

async function github_remove_label_from_issue(reactionData, actionResponseData, userUuid) {
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

    const response = await axios.delete(`https://api.github.com/repos/${repoOwner}/${repoName}/issues/${reactionData.issue_number}/labels/${reactionData.label}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Accept': 'application/vnd.github+json',
            }
        });
    if (response.status > 299) {
        console.error(`Error calling reaction remove_label_from_issue`);
    }
}

async function github_remove_all_labels_from_issue(reactionData, actionResponseData, userUuid) {
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

    const response = await axios.delete(`https://api.github.com/repos/${repoOwner}/${repoName}/issues/${reactionData.issue_number}/labels`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Accept': 'application/vnd.github+json',
            }
        });
    if (response.status > 299) {
        console.error(`Error calling reaction remove_all_labels_from_issue`);
    }
}

async function github_create_issue_comment(reactionData, actionResponseData, userUuid) {
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

    const response = await axios.post(`https://api.github.com/repos/${repoOwner}/${repoName}/issues/${reactionData.issue_number}/comments`,
        {
            "body": reactionData.body || "enter the body here",
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Accept': 'application/vnd.github+json',
            }
        });
    if (response.status > 299) {
        console.error(`Error calling reaction create_issue_comment`);
    }
}

async function github_update_issue_comment(reactionData, actionResponseData, userUuid) {
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

    const response = await axios.patch(`https://api.github.com/repos/${repoOwner}/${repoName}/issues/comments/${reactionData.comment_id}`,
        {
            "body": reactionData.body || "enter the body here",
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Accept': 'application/vnd.github+json',
            }
        });
    if (response.status > 299) {
        console.error(`Error calling reaction update_issue_comment`);
    }
}

async function github_delete_issue_comment(reactionData, actionResponseData, userUuid) {
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

    const response = await axios.delete(`https://api.github.com/repos/${repoOwner}/${repoName}/issues/comments/${reactionData.comment_id}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Accept': 'application/vnd.github+json',
            }
        });
    if (response.status > 299) {
        console.error(`Error calling reaction delete_issue_comment`);
    }
}

async function github_add_assignee_to_issue(reactionData, actionResponseData, userUuid) {
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

    const response = await axios.post(`https://api.github.com/repos/${repoOwner}/${repoName}/issues/${reactionData.issue_number}/assignees`,
        {
            "assignees": [reactionData.assignee],
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Accept': 'application/vnd.github+json',
            }
        });
    if (response.status > 299) {
        console.error(`Error calling reaction add_assignee_to_issue`);
    }
}

async function github_remove_assignee_from_issue(reactionData, actionResponseData, userUuid) {
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

    const response = await axios.delete(`https://api.github.com/repos/${repoOwner}/${repoName}/issues/${reactionData.issue_number}/assignees`,
        {
            "assignees": [reactionData.assignee],
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Accept': 'application/vnd.github+json',
            }
        });
    if (response.status > 299) {
        console.error(`Error calling reaction remove_assignee_from_issue`);
    }
}

async function github_update_milestone(reactionData, actionResponseData, userUuid) {
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
    if (!reactionData.milestone_number) {
        console.error("Missing milestone_number in reaction data");
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

    const milestone_number = reactionData.milestone_number;

    const response = await axios.patch(`https://api.github.com/repos/${repoOwner}/${repoName}/milestones/${milestone_number}`,
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
            }
        });
    if (response.status > 299) {
        console.error(`Error calling reaction update_milestone`);
    }
}

async function github_delete_milestone(reactionData, actionResponseData, userUuid) {
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

    if (!reactionData.milestone_number) {
        console.error("Missing milestone_number in reaction data");
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

    const milestone_number = reactionData.milestone_number;

    const response = await axios.delete(`https://api.github.com/repos/${repoOwner}/${repoName}/milestones/${milestone_number}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Accept': 'application/vnd.github+json',
            }
        });
    if (response.status > 299) {
        console.error(`Error calling reaction delete_milestone`);
    }
}

async function github_add_milestone_to_issue(reactionData, actionResponseData, userUuid) {
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

    if (!reactionData.milestone_number) {
        console.error("Missing milestone_number in reaction data");
        return;
    }

    if (!reactionData.issue_number) {
        console.error("Missing issue_number in reaction data");
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

    const milestone_number = reactionData.milestone_number;
    const issue_number = reactionData.issue_number;

    const response = await axios.patch(`https://api.github.com/repos/${repoOwner}/${repoName}/issues/${issue_number}`,
        {
            "milestone": milestone_number,
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Accept': 'application/vnd.github+json',
            }
        });
    if (response.status > 299) {
        console.error(`Error calling reaction add_milestone_to_issue`);
    }
}

async function github_remove_milestone_from_issue(reactionData, actionResponseData, userUuid) {
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

    if (!reactionData.issue_number) {
        console.error("Missing issue_number in reaction data");
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

    const issue_number = reactionData.issue_number;

    const response = await axios.patch(`https://api.github.com/repos/${repoOwner}/${repoName}/issues/${issue_number}`,
        {
            "milestone": null,
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Accept': 'application/vnd.github+json',
            }
        });
    if (response.status > 299) {
        console.error(`Error calling reaction remove_milestone_from_issue`);
    }
}

async function github_update_pull_request(reactionData, actionResponseData, userUuid) {
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

    if (!reactionData.pull_request_number) {
        console.error("Missing pull_request_number in reaction data");
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

    const pull_request_number = reactionData.pull_request_number;

    const response = await axios.patch(`https://api.github.com/repos/${repoOwner}/${repoName}/pulls/${pull_request_number}`,
        {
            "title": reactionData.title || "default title",
            "body": reactionData.body || "enter the body here"
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Accept': 'application/vnd.github+json',
            }
        });
    if (response.status > 299) {
        console.error(`Error calling reaction update_pull_request`);
    }
}

async function github_update_pull_request_state(reactionData, actionResponseData, userUuid) {
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

    if (!reactionData.pull_request_number) {
        console.error("Missing pull_request_number in reaction data");
        return;
    }

    if (!reactionData.state) {
        console.error("Missing state in reaction data");
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

    const pull_request_number = reactionData.pull_request_number;

    const response = await axios.patch(`https://api.github.com/repos/${repoOwner}/${repoName}/pulls/${pull_request_number}`,
        {
            "state": reactionData.state || "open"
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Accept': 'application/vnd.github+json',
            }
        });
    if (response.status > 299) {
        console.error(`Error calling reaction update_pull_request_state`);
    }
}

async function github_create_reaction_for_issue(reactionData, actionResponseData, userUuid) {
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

    if (!reactionData.issue_number) {
        console.error("Missing issue_number in reaction data");
        return;
    }

    if (!reactionData.reaction) {
        console.error("Missing reaction in reaction data");
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

    const issue_number = reactionData.issue_number;

    const response = await axios.post(`https://api.github.com/repos/${repoOwner}/${repoName}/issues/${issue_number}/reactions`,
        {
            "content": reactionData.reaction
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Accept': 'application/vnd.github+json',
            }
        });
    if (response.status > 299) {
        console.error(`Error calling reaction update_pull_request_state`);
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
    
    async function spotify_add_to_playlist(reactionData, actionResponseData, userUuid) {
        const accessToken = await getAccessToken(userUuid, "spotify");
    
        if (!accessToken) {
            console.error("No access token found for user");
            return;
        }
        const username = await getusername(userUuid, "spotify");
        console.log("Adding track to playlist in Spotify:", reactionData, actionResponseData);
        const response = await axios.post(`https://api.spotify.com/v1/playlists/${reactionData.playlist_uri}/tracks`,
            {
                "uris": [reactionData.music_uri]
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Accept': 'application/json',
                    "Content-Type": "application/json"
                }
            });
        if (response.status > 299) {
            console.error(`Error calling reaction add_to_playlist`);
            return;
        }
        console.log("Track added to playlist successfully:", response);
    }
    
    async function spotify_save_track(reactionData, actionResponseData, userUuid) {
        const accessToken = await getAccessToken(userUuid, "spotify");
    
        if (!accessToken) {
            console.error("No access token found for user");
            return;
        }
        console.log("Saving track in Spotify:", reactionData, actionResponseData);
        const response = await axios.put(`https://api.spotify.com/v1/me/tracks`,
            {
                "ids": [reactionData.music_id]
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Accept': 'application/json',
                    "Content-Type": "application/json"
                }
            });
        if (response.status > 299) {
            console.error(`Error calling reaction save_track`);
            return;
        }
        console.log("Track saved successfully:", response);
    }
    
    async function spotify_skip_track(reactionData, actionResponseData, userUuid) {
        const accessToken = await getAccessToken(userUuid, "spotify");
    
        if (!accessToken) {
            console.error("No access token found for user");
            return;
        }
        console.log("Skipping track in Spotify:", reactionData, actionResponseData);
        const response = await axios.post(`https://api.spotify.com/v1/me/player/next`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Accept': 'application/json',
                    "Content-Type": "application/json"
                }
            });
        if (response.status > 299) {
            console.error(`Error calling reaction skip_track`);
            return;
        }
        console.log("Track skipped successfully:", response);
    }
    
    async function spotify_previous_track(reactionData, actionResponseData, userUuid) {
        const accessToken = await getAccessToken(userUuid, "spotify");
    
        if (!accessToken) {
            console.error("No access token found for user");
            return;
        }
        console.log("Playing previous track in Spotify:", reactionData, actionResponseData);
        const response = await axios.post(`https://api.spotify.com/v1/me/player/previous`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Accept': 'application/json',
                    "Content-Type": "application/json"
                }
            });
        if (response.status > 299) {
            console.error(`Error calling reaction previous_track`);
            return;
        }
        console.log("Previous track played successfully:", response);
    }
       
    async function spotify_start_resume(reactionData, actionResponseData, userUuid) {
        const accessToken = await getAccessToken(userUuid, "spotify");
    
        if (!accessToken) {
            console.error("No access token found for user");
            return;
        }
        console.log("Starting or resuming playback in Spotify:", reactionData, actionResponseData);
        const response = await axios.put(`https://api.spotify.com/v1/me/player/play`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Accept': 'application/json',
                    "Content-Type": "application/json"
                }
            });
        if (response.status > 299) {
            console.error(`Error calling reaction start_resume`);
            return;
        }
        console.log("Playback started or resumed successfully:", response);
    }
    
    async function spotify_pause(reactionData, actionResponseData, userUuid) {
        const accessToken = await getAccessToken(userUuid, "spotify");
    
        if (!accessToken) {
            console.error("No access token found for user");
            return;
        }
        console.log("Pausing playback in Spotify:", reactionData, actionResponseData);
        const response = await axios.put(`https://api.spotify.com/v1/me/player/pause`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Accept': 'application/json',
                    "Content-Type": "application/json"
                }
            });
        if (response.status > 299) {
            console.error(`Error calling reaction pause`);
            return;
        }
        console.log("Playback paused successfully:", response);
    }
    
    async function spotify_add_track_to_queue(reactionData, actionResponseData, userUuid) {
        const accessToken = await getAccessToken(userUuid, "spotify");
    
        if (!accessToken) {
            console.error("No access token found for user");
            return;
        }
        console.log("Adding track to queue in Spotify:", reactionData, actionResponseData);
        const response = await axios.post(`https://api.spotify.com/v1/me/player/queue`,
            {
                "uri": reactionData.trackUri
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Accept': 'application/json',
                    "Content-Type": "application/json"
                }
            });
        if (response.status > 299) {
            console.error(`Error calling reaction add_track_to_queue`);
            return;
        }
        console.log("Track added to queue successfully:", response);
    }
/**
 * Handler function for the 'gmail_send_email' reaction.
 * 
 * @param {Object} reactionData Data related to the reaction.
 * @param {Object} actionResponseData Data sent by the action that triggered this reaction.
 * @param {string} userUuid - The UUID of the user performing the reaction.
*/
async function gmail_send_email(reactionData, actionResponseData, userUuid) {
    try {
        const accessToken = await getAccessToken(userUuid, "gmail");
        const gmail = await initializeGmailClient(accessToken)
        
        if (!(reactionData.from && reactionData.to && reactionData.subject && reactionData.body)) {
            throw new Error("Missing required email data");
        }
        const emailContent = [
        `From: ${reactionData.from}`,
        `To: ${reactionData.to}`,
        `Subject: ${reactionData.subject}`,
        '',
        reactionData.body || ''
        ].join('\n');

        // Encode email content to base64
        const rawMessage = Buffer.from(emailContent)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        // Send the email using the Gmail API
        const response = await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: rawMessage
            }
        });
        console.log("Email sent successfully:", response.data);
    } catch (error) {
        console.error("Error sending email via Gmail:", error);
    }
}

/**
 * Handler function for the 'gmail_delete_email' reaction.
 * 
 * @param {Object} reactionData Data related to the reaction.
 * @param {Object} actionResponseData Data sent by the action that triggered this reaction.
 * @param {string} userUuid - The UUID of the user performing the reaction.
 */
async function gmail_delete_email(reactionData, actionResponseData, userUuid) {
    try {
        const accessToken = await getAccessToken(userUuid, "gmail");
        const gmail = await initializeGmailClient(accessToken)

        if (!(reactionData.mail_id)) {
            throw new Error("Missing required email data");
        }

        // Send the email using the Gmail API
        const response = await gmail.users.messages.delete({
            userId: 'me',
            id: reactionData.mail_id
        });
        console.log("Email delete successfully:", response.data);
    } catch (error) {
        console.error("Error sending email via Gmail:", error);
    }
}

/**
 * Handler function for adding a label to a Gmail email.
 * 
 * @param {Object} reactionData Data related to the reaction.
 * @param {Object} actionResponseData Data sent by the action that triggered this reaction.
 * @param {string} userUuid - The UUID of the user performing the reaction.
 */
async function gmail_add_label(reactionData, actionResponseData, userUuid) {
    try {
        const accessToken = await getAccessToken(userUuid, "gmail");
        const gmail = await initializeGmailClient(accessToken)

        if (!(reactionData.mail_id) || !(reactionData.label_id)) {
            throw new Error("Missing required email or label data");
        }

        const response = await gmail.users.messages.modify({
            userId: 'me',
            id: reactionData.mail_id,
            requestBody: {
                addLabelIds: [reactionData.label_id]
            }
        });

        console.log("Label added successfully to email:", response.data);
    } catch (error) {
        console.error("Error adding label via Gmail:", error);
    }
}

/**
 * Handler function for removing a label from a Gmail email.
 * 
 * @param {Object} reactionData Data related to the reaction.
 * @param {Object} actionResponseData Data sent by the action that triggered this reaction.
 * @param {string} userUuid - The UUID of the user performing the reaction.
 */
async function gmail_remove_label(reactionData, actionResponseData, userUuid) {
    try {
        const accessToken = await getAccessToken(userUuid, "gmail");
        const gmail = await initializeGmailClient(accessToken)

        if (!(reactionData.mail_id) || !(reactionData.label_id)) {
            throw new Error("Missing required email or label data");
        }

        const response = await gmail.users.messages.modify({
            userId: 'me',
            id: reactionData.mail_id,
            requestBody: {
                removeLabelIds: [reactionData.label_id]
            }
        });

        console.log("Label removed successfully from email:", response.data);
    } catch (error) {
        console.error("Error removing label via Gmail:", error);
    }
}

/**
 * Handler function for removing a label from a Gmail email.
 * 
 * @param {Object} reactionData Data related to the reaction.
 * @param {Object} actionResponseData Data sent by the action that triggered this reaction.
 * @param {string} userUuid - The UUID of the user performing the reaction.
 */
async function gmail_remove_label(reactionData, actionResponseData, userUuid) {
    try {
        const accessToken = await getAccessToken(userUuid, "gmail");
        const gmail = await initializeGmailClient(accessToken)

        if (!(reactionData.mail_id) || !(reactionData.label_id)) {
            throw new Error("Missing required email or label data");
        }

        const response = await gmail.users.messages.modify({
            userId: 'me',
            id: reactionData.mail_id,
            requestBody: {
                removeLabelIds: [reactionData.label_id]
            }
        });

        console.log("Label removed successfully from email:", response.data);
    } catch (error) {
        console.error("Error removing label via Gmail:", error);
    }
}

/**
 * Handler function for replying to a Gmail email.
 * 
 * @param {Object} reactionData Data related to the reaction.
 * @param {Object} actionResponseData Data sent by the action that triggered this reaction.
 * @param {string} userUuid - The UUID of the user performing the reaction.
 */
async function gmail_reply_to_email(reactionData, actionResponseData, userUuid) {
    try {
        const accessToken = await getAccessToken(userUuid, "gmail");
        const gmail = await initializeGmailClient(accessToken)

        if (!(reactionData.mail_id) || !(reactionData.reply_body)) {
            throw new Error("Missing required email or reply data");
        }

        const originalMessage = await gmail.users.messages.get({
            userId: 'me',
            id: reactionData.mail_id,
            format: 'full',
        });

        const threadId = originalMessage.data.threadId;
        const headers = originalMessage.data.payload.headers;
        const originalSubject = headers.find(h => h.name === "Subject")?.value || "No Subject";
        const originalFrom = headers.find(h => h.name === "From")?.value || "";

        const emailMatch = originalFrom.match(/<(.+?)>/);
        const recipientEmail = emailMatch ? emailMatch[1] : originalFrom;

        if (!recipientEmail) {
            throw new Error("Failed to extract recipient email address");
        }

        const rawMessage = [
            `From: me`,
            `To: ${recipientEmail}`,
            `Subject: ${originalSubject}`,
            `In-Reply-To: ${reactionData.mail_id}`,
            `References: ${reactionData.mail_id}`,
            ``,
            `${reactionData.reply_body}`
        ].join('\n');

        const encodedMessage = Buffer.from(rawMessage).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');

        const response = await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encodedMessage,
                threadId: threadId,
            }
        });

        console.log("Reply sent successfully:", response.data);
    } catch (error) {
        console.error("Error replying to email via Gmail:", error);
    }
}

/**
 * Handler function for forwarding a Gmail email.
 * 
 * @param {Object} reactionData Data related to the reaction.
 * @param {Object} actionResponseData Data sent by the action that triggered this reaction.
 * @param {string} userUuid - The UUID of the user performing the reaction.
 */
async function gmail_forward_email(reactionData, actionResponseData, userUuid) {
    try {
        const accessToken = await getAccessToken(userUuid, "gmail");
        const gmail = await initializeGmailClient(accessToken)

        if (!reactionData.mail_id || !reactionData.forward_to) {
            throw new Error("Missing required email or forwarding address data");
        }

        // Retrieve the original email
        const originalMessage = await gmail.users.messages.get({
            userId: 'me',
            id: reactionData.mail_id,
            format: 'full',
        });

        const headers = originalMessage.data.payload.headers;
        const essentialHeaders = ['From', 'To', 'Subject', 'Date'];
        const simplifiedHeaders = headers
            .filter(header => essentialHeaders.includes(header.name))
            .map(header => `${header.name}: ${header.value}`)
            .join("\n");

        let body = "";
        const parts = originalMessage.data.payload.parts;
        if (parts) {
            const textPart = parts.find(part => part.mimeType === "text/plain");
            if (textPart && textPart.body.data) {
                body = Buffer.from(textPart.body.data, "base64").toString("utf8");
            }
        } else if (originalMessage.data.payload.body && originalMessage.data.payload.body.data) {
            body = Buffer.from(originalMessage.data.payload.body.data, "base64").toString("utf8");
        }

        const forwardMessage = [
            `To: ${reactionData.forward_to}`,
            `Subject: Fwd: ${simplifiedHeaders.match(/Subject: (.+)/)?.[1] || "No Subject"}`,
            `\n---------- Forwarded message ----------`,
            `${simplifiedHeaders}\n`,
            body.trim()
        ].join("\r\n");

        const encodedMessage = Buffer.from(forwardMessage)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        const response = await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encodedMessage,
            },
        });

        console.log('Email forwarded successfully:', response.data);
    } catch (error) {
        console.error('Error forwarding email via Gmail:', error);
    }
}

/**
 * Handler function for create a draft on Gmail.
 * 
 * @param {Object} reactionData Data related to the reaction.
 * @param {Object} actionResponseData Data sent by the action that triggered this reaction.
 * @param {string} userUuid - The UUID of the user performing the reaction.
 */
async function gmail_create_draft(reactionData, actionResponseData, userUuid) {
    try {
        const accessToken = await getAccessToken(userUuid, "gmail");
        const gmail = await initializeGmailClient(accessToken)

        if (!reactionData.to || !reactionData.subject || !reactionData.body) {
            throw new Error("Missing required fields: 'to', 'subject', or 'body'.");
        }

        const emailContent = [
            `To: ${reactionData.to}`,
            `Subject: ${reactionData.subject}`,
            `Content-Type: text/plain; charset=utf-8`,
            ``,
            `${reactionData.body}`
        ].join("\r\n");

        const encodedEmail = Buffer.from(emailContent)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        const response = await gmail.users.drafts.create({
            userId: 'me',
            requestBody: {
                message: {
                    raw: encodedEmail,
                },
            },
        });

        console.log('Draft created successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating draft:', error);
    }
}

async function fetchNews(domain, query) {
    try {
        const response = await axios.get(`https://newsapi.org/v2/everything`, {
        params: {
            domains: domain,
            q: query,
            language: 'en',
            sortBy: 'publishedAt',
            apiKey: '6b140d55899b499ca9c96e9d932b3cf2',
        },
        });
        return response.data.articles;
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        return [];
    }
};

/**
 * Handler function for the 'area_delete' reaction.
 * @param {Object} reactionData Data related to the reaction
 * @param {Object} actionResponseData Data sent by the action that triggered this reaction.
 * @param {string} userUuid - The UUID of the user performing the reaction.
 * 
 * @author Romain Chevallier
 */
async function area_delete(reactionData, actionResponseData, userUuid) {
    try {
        if (!reactionData.areaId) {
           throw new Error("Area UUID is required");
        }
        area = await prisma.actionReaction.findUnique ({
            where: {
                uuid: reactionData.areaUuid
            }
        });
        const response = await axios.delete(`${process.env.BACKEND_URL}/api/action/${area.id}`);
        if (response.status > 299) {
            throw new Error(`Error calling area_delete`);
            return;
        } else {
            console.log("Area deleted successfully:", response);
        }
    } catch (e) {
        console.error(e)
        return;
    }
}

/**
 * Handler function for the 'area_start' reaction.
 * @param {Object} reactionData Data related to the reaction
 * @param {Object} actionResponseData Data sent by the action that triggered this reaction.
 * @param {string} userUuid - The UUID of the user performing the reaction.
 * 
 * @author Romain Chevallier
 */
async function area_start(reactionData, actionResponseData, userUuid) {
    try {
        if (!reactionData.areaUuid) {
           throw new Error("Area UUID is required");
        }
        const response = await axios.put(`${process.env.BACKEND_URL}/api/action/set_active/${reactionData.areaUuid}`, {
            isActive: true
        });
        if (response.status > 299) {
            throw new Error(`Error calling area_start`);
            return;
        } else {
            console.log("Area started successfully:", response);
        }
    } catch (e) {
        console.error(e)
        return;
    }
}

/**
 * Handler function for the 'area_stop' reaction.
 * @param {Object} reactionData Data related to the reaction
 * @param {Object} actionResponseData Data sent by the action that triggered this reaction.
 * @param {string} userUuid - The UUID of the user performing the reaction.
 * 
 * @author Romain Chevallier
 */
async function area_stop(reactionData, actionResponseData, userUuid) {
    try {
        if (!reactionData.areaUuid) {
           throw new Error("Area UUID is required");
        }
        const response = await axios.put(`${process.env.BACKEND_URL}/api/action/set_active/${reactionData.areaUuid}`, {
            isActive: false
        });
        if (response.status > 299) {
            throw new Error(`Error calling area_stop`);
            return;
        } else {
            console.log("Area stopped successfully:", response);
        }
    } catch (e) {
        console.error(e)
        return;
    }
}
async function strava_update_athlete(reactionData, actionResponseData, userUuid) {
    const accessToken = await getAccessToken(userUuid, "strava");

    if (!accessToken) {
        console.error("No access token found for user");
        return;
    }
    console.log("Updating athlete in Strava:", reactionData, actionResponseData);

    const response = await axios.put(`https://www.strava.com/api/v3/athlete`,
        {
            "weight": reactionData.weight || 0,
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Accept': 'application/json',
                "Content-Type": "application/json"
            }
        });

    if (response.status > 299) {
        console.error(`Error calling reaction update_athlete`);
        return;
    }
    console.log("Athlete updated successfully:", response);
}

async function strava_create_activity(reactionData, actionResponseData, userUuid) {
    console.log("Creating activity in Strava:", reactionData, actionResponseData);
    const accessToken = await getAccessToken(userUuid, "strava");

    if (!accessToken) {
        console.error("No access token found for user");
        return;
    }

    const response = await axios.post(`https://www.strava.com/api/v3/activities`,
        {
            "name": reactionData.name || "default name",
            "type": reactionData.type || "Run",
            "start_date_local": reactionData.start_date_local || new Date().toISOString(),
            "elapsed_time": reactionData.elapsed_time || 0,
            "description": reactionData.description || "enter the description here",
            "distance": reactionData.distance || 0,
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Accept': 'application/json',
                "Content-Type": "application/json"
            }
        });

    if (response.status > 299) {
        console.error(`Error calling reaction create_activity`);
        return;
    }
    console.log("Activity created successfully:", response);
}

async function strava_update_activity(reactionData, actionResponseData, userUuid) {
    console.log("Updating activity in Strava:", reactionData, actionResponseData);
    const accessToken = await getAccessToken(userUuid, "strava");

    if (!accessToken) {
        console.error("No access token found for user");
        return;
    }

    const response = await axios.put(`https://www.strava.com/api/v3/activities/${reactionData.activity_id}`,
        {
            "name": reactionData.name || "default name",
            "type": reactionData.type || "Run",
            "start_date_local": reactionData.start_date_local || new Date().toISOString(),
            "elapsed_time": reactionData.elapsed_time || 0,
            "description": reactionData.description || "enter the description here",
            "distance": reactionData.distance || 0,
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Accept': 'application/json',
                "Content-Type": "application/json"
            }
        });

    if (response.status > 299) {
        console.error(`Error calling reaction update_activity`);
        return;
    }
    console.log("Activity updated successfully:", response);
}

async function spotify_add_to_playlist(reactionData, actionResponseData, userUuid) {
    const accessToken = await getAccessToken(userUuid, "spotify");

    if (!accessToken) {
        console.error("No access token found for user");
        return;
    }
    const username = await getusername(userUuid, "spotify");
    console.log("Adding track to playlist in Spotify:", reactionData, actionResponseData);
    const response = await axios.post(`https://api.spotify.com/v1/playlists/${reactionData.playlistId}/tracks`,
        {
            "uris": [reactionData.trackUri]
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Accept': 'application/json',
                "Content-Type": "application/json"
            }
        });
    if (response.status > 299) {
        console.error(`Error calling reaction add_to_playlist`);
        return;
    }
    console.log("Track added to playlist successfully:", response);
}

async function spotify_save_track(reactionData, actionResponseData, userUuid) {
    const accessToken = await getAccessToken(userUuid, "spotify");

    if (!accessToken) {
        console.error("No access token found for user");
        return;
    }
    console.log("Saving track in Spotify:", reactionData, actionResponseData);
    const response = await axios.put(`https://api.spotify.com/v1/me/tracks`,
        {
            "ids": [reactionData.trackId]
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Accept': 'application/json',
                "Content-Type": "application/json"
            }
        });
    if (response.status > 299) {
        console.error(`Error calling reaction save_track`);
        return;
    }
    console.log("Track saved successfully:", response);
}

async function spotify_skip_track(reactionData, actionResponseData, userUuid) {
    const accessToken = await getAccessToken(userUuid, "spotify");

    if (!accessToken) {
        console.error("No access token found for user");
        return;
    }
    console.log("Skipping track in Spotify:", reactionData, actionResponseData);
    const response = await axios.post(`https://api.spotify.com/v1/me/player/next`,
        {},
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Accept': 'application/json',
                "Content-Type": "application/json"
            }
        });
    if (response.status > 299) {
        console.error(`Error calling reaction skip_track`);
        return;
    }
    console.log("Track skipped successfully:", response);
}

async function spotify_previous_track(reactionData, actionResponseData, userUuid) {
    const accessToken = await getAccessToken(userUuid, "spotify");

    if (!accessToken) {
        console.error("No access token found for user");
        return;
    }
    console.log("Playing previous track in Spotify:", reactionData, actionResponseData);
    const response = await axios.post(`https://api.spotify.com/v1/me/player/previous`,
        {},
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Accept': 'application/json',
                "Content-Type": "application/json"
            }
        });
    if (response.status > 299) {
        console.error(`Error calling reaction previous_track`);
        return;
    }
    console.log("Previous track played successfully:", response);
}
   
async function spotify_start_resume(reactionData, actionResponseData, userUuid) {
    const accessToken = await getAccessToken(userUuid, "spotify");

    if (!accessToken) {
        console.error("No access token found for user");
        return;
    }
    console.log("Starting or resuming playback in Spotify:", reactionData, actionResponseData);
    const response = await axios.put(`https://api.spotify.com/v1/me/player/play`,
        {},
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Accept': 'application/json',
                "Content-Type": "application/json"
            }
        });
    if (response.status > 299) {
        console.error(`Error calling reaction start_resume`);
        return;
    }
    console.log("Playback started or resumed successfully:", response);
}

async function spotify_pause(reactionData, actionResponseData, userUuid) {
    const accessToken = await getAccessToken(userUuid, "spotify");

    if (!accessToken) {
        console.error("No access token found for user");
        return;
    }
    console.log("Pausing playback in Spotify:", reactionData, actionResponseData);
    const response = await axios.put(`https://api.spotify.com/v1/me/player/pause`,
        {},
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Accept': 'application/json',
                "Content-Type": "application/json"
            }
        });
    if (response.status > 299) {
        console.error(`Error calling reaction pause`);
        return;
    }
    console.log("Playback paused successfully:", response);
}

async function spotify_add_track_to_queue(reactionData, actionResponseData, userUuid) {
    const accessToken = await getAccessToken(userUuid, "spotify");

    if (!accessToken) {
        console.error("No access token found for user");
        return;
    }
    console.log("Adding track to queue in Spotify:", reactionData, actionResponseData);
    const response = await axios.post(`https://api.spotify.com/v1/me/player/queue`,
        {
            "uri": reactionData.trackUri
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Accept': 'application/json',
                "Content-Type": "application/json"
            }
        });
    if (response.status > 299) {
        console.error(`Error calling reaction add_track_to_queue`);
        return;
    }
    console.log("Track added to queue successfully:", response);
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
