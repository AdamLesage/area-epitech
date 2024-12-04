var Docker = require('dockerode');
var docker = new Docker();
const fs = require('fs');
const tar = require('tar-fs');

const actions = new Map();
actions.set('dropbox_on_new_file', create_dropbox_on_new_file_workers);
actions.set('dropbox_on_new_shares_file', create_dropbox_on_new_shares_file_workers);

const path = require('path');

async function ensureImageExists(imageName, dockerfilePath) {
    try {
        // Check if the image exists
        const image = docker.getImage(imageName);
        await image.inspect(); // Will throw an error if image does not exist
        console.log(`Image '${imageName}' already exists.`);
        // Delete the Image if allready exists
        await docker.getImage(imageName).remove({force: true});
        console.log(`Image '${imageName}' deleted successfully.`);
    } catch (err) {
        if (err.statusCode === 404) {
        console.log(`Image '${imageName}' not found. Building it...`);

        // Ensure Dockerfile and other required files exist
        } else {
        console.error('Error inspecting image:', err);
        throw err;
        }
    }
    const dockerfileExists = fs.existsSync(path.join(dockerfilePath, 'Dockerfile'));
    if (!dockerfileExists) {
        throw new Error(`Dockerfile not found in ${dockerfilePath}`);
    }
    // Create tar stream for the context directory
    const tarStream = tar.pack(dockerfilePath, {
        entries: ['Dockerfile', 'dropBoxWorkerOnNewFile.js'],
    });

    // Build the image
    const stream = await docker.buildImage(tarStream, { t: imageName });

    return new Promise((resolve, reject) => {
        docker.modem.followProgress(stream, (err, res) => {
            if (err) {
                console.error('Error building image:', err);
                reject(err);
            } else {
                console.log(`Image '${imageName}' built successfully.`);
                resolve(res);
            }
        });
    });
}

async function create_dropbox_on_new_file_workers(data, uuid) {
    var auxContainer;
    var onNewFileImage = path.resolve(__dirname, '../workers/dropbox');
    var image_name = "on-new-file";
    await ensureImageExists(image_name, onNewFileImage);

    docker.createContainer({
        Image: image_name,
        AttachStdin: false,
        AttachStdout: false,
        AttachStderr: false,
        Tty: true,
        Env:[   
                `UUID=${uuid}`,
                `DATA=${typeof data.Json === 'object' && data.Json !== null ? JSON.stringify(data.Json) : '{}'}`,
                `CALL_BACK=http://127.0.0.1:8080/api/reaction/`
            ],
        HostConfig: {
            NetworkMode: "host"
        },
        Cmd: ['node', "dropBoxWorkerOnNewFile.js"],
        OpenStdin: false,
        StdinOnce: false,
        }).then(function(container) {
            auxContainer = container;
            sourceFile = auxContainer.id
            console.log("run container");
            auxContainer.start()
            return auxContainer.id
        }).catch((e) => {
            console.log(e);
    })
    return "";
}

async function create_dropbox_on_new_shares_file_workers(data, uuid) {
}

module.exports = actions;