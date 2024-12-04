const reactions = new Map();
reactions.set('dropbox_new_file', dropbox_new_file);
reactions.set('dropbox_shares_file', dropbox_shares_file);

function dropbox_new_file(data) {
    console.log("reaction new file");
}

function dropbox_shares_file(data) {
    console.log("reaction shares file");
}

module.exports = reactions;