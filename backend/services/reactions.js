const axios = require('axios');
// Create a new Map to store reaction handlers
const reactions = new Map();
reactions.set('dropbox_new_file', dropbox_new_file);
reactions.set('dropbox_share_file', dropbox_shares_file);
reactions.set('create_issue', github_create_issue);
reactions.set('create_milestone', github_create_milestone);
reactions.set('create_pull_request', github_pull_request);

/**
 * Handler function for the 'dropbox_new_file' reaction.
 * 
 * @param {Object} reactionData Data related to the reaction
 * @param {Object} actionResponceData Data sent by the action that triggered this reaction.
 */
async function dropbox_new_file(reactionData, actionResponceData) {
    console.log("reaction new file", reactionData, actionResponceData);
}

/**
 * Handler function for the 'dropbox_shares_file' reaction.
 * 
 * @param {Object} reactionData Data related to the reaction
 * @param {Object} actionResponceData Data sent by the action that triggered this reaction.
 */
async function dropbox_shares_file(reactionData, actionResponceData) {
    console.log("reaction dropbox_shares_file", reactionData, actionResponceData);
}

/**
 * Handler function for the 'github_create_issue' reaction.
 * 
 * @param {Object} reactionData Data related to the reaction
 * @param {Object} actionResponceData Data sent by the action that triggered this reaction.
 */
async function github_create_issue(reactionData, actionResponceData) {
    const response = await axios.post('https://api.github.com/repos/AdamLesage/area-epitech/issues',
        {
            "title": reactionData.title || "default title",
            "body": reactionData.body || "enter the body here",
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
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
 * @param {Object} actionResponceData Data sent by the action that triggered this reaction.
 */
async function github_create_milestone(reactionData, actionResponceData) {
    const response = await axios.post('https://api.github.com/repos/AdamLesage/area-epitech/milestones',
        {
            "title": reactionData.title || "default title",
            "state": reactionData.state || "open",
            "description": reactionData.description || "enter the description here",
            "due_on": reactionData.due_on || new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() 
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
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
 * @param {Object} actionResponceData Data sent by the action that triggered this reaction.
 */
async function github_pull_request(reactionData, actionResponceData) {
    const response = await axios.post('https://api.github.com/repos/AdamLesage/area-epitech/pulls',
        {
            "title": reactionData.title || "default title",
            "body": reactionData.body || "enter the body here",
            "base": "master"
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
                'Accept': 'application/vnd.github+json',
                "X-GitHub-Api-Version": "2022-11-28"
            }
        });
    if (response.status > 299) {
        console.error(`Error calling reaction create_milestone`);
    }
}

module.exports = reactions;