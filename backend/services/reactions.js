// Create a new Map to store reaction handlers
const reactions = new Map();
reactions.set('dropbox_new_file', dropbox_new_file);
reactions.set('dropbox_shares_file', dropbox_shares_file);

/**
 * Handler function for the 'dropbox_new_file' reaction.
 * 
 * @param {Object} reactionData Data related to the reaction
 * @param {Object} actionResponceData Data sent by the action that triggered this reaction.
 */
function dropbox_new_file(reactionData, actionResponceData) {
    console.log("reaction new file", reactionData, actionResponceData);
}

/**
 * Handler function for the 'dropbox_shares_file' reaction.
 * 
 * @param {Object} reactionData Data related to the reaction
 * @param {Object} actionResponceData Data sent by the action that triggered this reaction.
 */
function dropbox_shares_file(reactionData, actionResponceData) {
    console.log("reaction shares file", reactionData, actionResponceData);
}

module.exports = reactions;