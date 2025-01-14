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
reactions.set('playlist_add_track', spotify_add_to_playlist);
reactions.set('save_track', spotify_save_track);
reactions.set('skip_track', spotify_skip_track);
reactions.set('previous_track', spotify_previous_track);
reactions.set('start_resume', spotify_start_resume);
reactions.set('pause', spotify_pause);
reactions.set('add_track_to_queue', spotify_add_track_to_queue);

reactions.set('fetch_news', fetchNews);

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
    console.log("Skipping track in Spotify402:", reactionData, actionResponseData);
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

module.exports = reactions;
