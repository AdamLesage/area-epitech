const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new Map to store reaction handlers
const reactions = new Map();
reactions.set('dropbox_new_file', dropbox_new_file);
reactions.set('dropbox_shares_file', dropbox_shares_file);
reactions.set('create_issue', github_create_issue);
reactions.set('create_milestone', github_create_milestone);
reactions.set('create_pull_request', github_pull_request);

/**
 * Handler function for the 'dropbox_new_file' reaction.
 * 
 * @param {Object} reactionData Data related to the reaction
 * @param {Object} actionResponseData Data sent by the action that triggered this reaction.
 */
async function dropbox_new_file(reactionData, actionResponseData) {
    console.log("reaction new file", reactionData, actionResponseData);
}

/**
 * Handler function for the 'dropbox_shares_file' reaction.
 * 
 * @param {Object} reactionData Data related to the reaction
 * @param {Object} actionResponseData Data sent by the action that triggered this reaction.
 */
async function dropbox_shares_file(reactionData, actionResponseData) {
    console.log("reaction dropbox_shares_file", reactionData, actionResponseData);
}

/**
 * Get the Github access token for a user.
 * @param {string} userUuid The UUID of the user
 * @returns {string} The Github access token
 * @throws {Error} If the user does not have a Github linked account
 * @throws {Error} If the Github linked account does not have an access token
 */
async function getGithubAccessToken(userUuid) {
    let user = await prisma.user.findUnique({
        where: { uuid: userUuid },
        include: { linkedAccounts: true },
    });

    // Find github linked account
    const githubAccount = user.linkedAccounts.find(
        account => account.serviceName === 'github'
    );
    return githubAccount.authToken;
}

/**
 * Handler function for the 'github_create_issue' reaction.
 * 
 * @param {Object} reactionData Data related to the reaction
 * @param {Object} actionResponseData Data sent by the action that triggered this reaction.
*/
async function github_create_issue(reactionData, actionResponseData, userUuid) {
    const repoOwner = reactionData.repoOwner || null;
    const repoName = reactionData.repoName || null;

    if (!repoOwner || !repoName) {
        console.error("Missing repoOwner or repoName in reaction data");
        return;
    }
    if (!userUuid) {
        console.error("Missing userUuid in reaction data");
        return;
    }

    const accessToken = await getGithubAccessToken(userUuid);

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
 */
async function github_create_milestone(reactionData, actionResponseData, userUuid) {
    const repoOwner = reactionData.repoOwner || null;
    const repoName = reactionData.repoName || null;

    if (!repoOwner || !repoName) {
        console.error("Missing repoOwner or repoName in reaction data");
        return;
    }
    if (!userUuid) {
        console.error("Missing userUuid in reaction data");
        return;
    }

    const accessToken = await getGithubAccessToken(userUuid);

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
 */
async function github_pull_request(reactionData, actionResponseData, userUuid) {
    const repoOwner = reactionData.repoOwner || null;
    const repoName = reactionData.repoName || null;

    if (!repoOwner || !repoName) {
        console.error("Missing repoOwner or repoName in reaction data");
        return;
    }
    if (!userUuid) {
        console.error("Missing userUuid in reaction data");
        return;
    }

    const accessToken = await getGithubAccessToken(userUuid);

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

module.exports = reactions;
