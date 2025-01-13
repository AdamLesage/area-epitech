const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { Dropbox } = require('dropbox');
const { google } = require('googleapis');

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

reactions.set('gmail_send_email', gmail_send_email);
reactions.set('gmail_delete_email', gmail_delete_email);
reactions.set('gmail_add_label', gmail_add_label)
reactions.set('gmail_remove_label', gmail_remove_label)
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
        const auth = new google.auth.OAuth2();
        auth.setCredentials({ access_token: accessToken });
        const gmail = google.gmail({ version: 'v1', auth });

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
        const auth = new google.auth.OAuth2();
        auth.setCredentials({ access_token: accessToken });
        const gmail = google.gmail({ version: 'v1', auth });

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
        const auth = new google.auth.OAuth2();
        auth.setCredentials({ access_token: accessToken });
        const gmail = google.gmail({ version: 'v1', auth });

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
        const auth = new google.auth.OAuth2();
        auth.setCredentials({ access_token: accessToken });
        const gmail = google.gmail({ version: 'v1', auth });

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


module.exports = reactions;
