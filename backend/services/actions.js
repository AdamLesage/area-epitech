const fs = require('fs');
const tar = require('tar-fs');
const path = require('path');
// Import the Dockerode library to interact with Docker
var Docker = require('dockerode');
var docker = new Docker();

// Create a map to hold creation of action worker
const actions = new Map();
actions.set('dropbox_on_new_file', create_dropbox_workers);
actions.set('dropbox_on_file_renamed', create_dropbox_workers);
actions.set('dropbox_on_file_modified', create_dropbox_workers);
actions.set('dropbox_on_new_folder', create_dropbox_workers);
actions.set('dropbox_on_folder_renamed', create_dropbox_workers);
actions.set('dropbox_on_deleted', create_dropbox_workers);

actions.set('pull_request_review.submitted', create_github_workers);
actions.set('pull_request.labeled', create_github_workers);
actions.set('pull_request.unlabeled', create_github_workers);
actions.set('issues.labeled', create_github_workers);
actions.set('issues.unlabeled', create_github_workers);
actions.set('issues.assigned', create_github_workers);
actions.set('issues.unassigned', create_github_workers);
actions.set('pull_request.assigned', create_github_workers);
actions.set('pull_request.unassigned', create_github_workers);
actions.set('issues.opened', create_github_workers);
actions.set('issues.closed', create_github_workers);
actions.set('pull_request.opened', create_github_workers);
actions.set('pull_request.closed', create_github_workers);
// Gmail Action
actions.set('gmail_on_new_mail', create_gmail_workers);
actions.set('gmail_on_mail_deleted', create_gmail_workers);
actions.set('gmail_on_label_added', create_gmail_workers);
actions.set('gmail_on_label_removed', create_gmail_workers);
actions.set('gmail_on_mail_send', create_gmail_workers);
actions.set('gmail_on_draft_create', create_gmail_workers);

actions.set('on_area_deleted', create_area_workers);
actions.set('on_area_start', create_area_workers);
actions.set('on_area_stop', create_area_workers);
actions.set('on_area_created', create_area_workers);
actions.set('on_area_activate', create_area_workers);
actions.set('activity.create', create_strava_workers);
actions.set('activity.update', create_strava_workers);
actions.set('activity.delete', create_strava_workers);
actions.set('athlete.updated', create_strava_workers);

actions.set('message_create', create_discord_workers);
actions.set('message_delete', create_discord_workers);
actions.set('message_update', create_discord_workers);
actions.set('channel_create', create_discord_workers);
actions.set('channel_delete', create_discord_workers);
actions.set('channel_update', create_discord_workers);
actions.set('thread_create', create_discord_workers);
actions.set('thread_delete', create_discord_workers);
actions.set('thread_update', create_discord_workers);
actions.set('message_reaction_add', create_discord_workers);
actions.set('message_reaction_remove', create_discord_workers);
actions.set('message_reaction_remove_emoji', create_discord_workers);
actions.set('message_reaction_remove_all', create_discord_workers);
actions.set('role_create', create_discord_workers);
actions.set('role_delete', create_discord_workers);
actions.set('role_update', create_discord_workers);

/**
 * @brief Ensures that a Docker image exists.
 * If the image exists, it is deleted and rebuilt.
 * @param imageName The name of the Docker image.
 * @param dockerfilePath The path to the directory containing the Dockerfile.
 * @param workerFileName The name of the worker file
 * @return A promise that resolves when the image is built successfully.
 */
async function ensureImageExists(imageName, dockerfilePath, workerFileName) {
    try {
        // Check if the image exists
        const image = docker.getImage(imageName);
        await image.inspect(); // Will throw an error if the image does not exist
        console.log(`Image '${imageName}' already exists.`);
        
        // Delete the image if it already exists
        await docker.getImage(imageName).remove({force: true});
        console.log(`Image '${imageName}' deleted successfully.`);
    } catch (err) {
        if (err.statusCode === 404) {
            // If the image is not found, log and proceed to build it
            console.log(`Image '${imageName}' not found. Building it...`);
        } else {
            // Log any other errors that occur while inspecting the image
            console.error('Error inspecting image:', err);
            throw err; // Rethrow the error for further handling
        }
    }

    // Check if the Dockerfile exists in the specified path
    const dockerfileExists = fs.existsSync(path.join(dockerfilePath, 'Dockerfile'));
    if (!dockerfileExists) {
        throw new Error(`Dockerfile not found in ${dockerfilePath}`);
    }

    const tarStream = tar.pack(dockerfilePath, {
        entries: ['Dockerfile', workerFileName, "package.json"],
    });

    // Build the Docker image using the tar stream
    const stream = await docker.buildImage(tarStream, { t: `${imageName}:areaWorker` });

    // Return a promise that resolves when the image build process is complete
    return new Promise((resolve, reject) => {
        docker.modem.followProgress(stream, (err, res) => {
            if (err) {
                console.error('Error building image:', err); // Log any errors during the build process
                reject(err); // Reject the promise with the error
            } else {
                console.log(`Image '${imageName}' built successfully.`); // Log success message
                resolve(res); // Resolve the promise with the result
            }
        });
    });
}

/**
 * @brief Creates a Docker container with the specified parameters.
 * @param data The data to be passed to the container.
 * @param uuid The unique identifier for the operation.
 * @param image_name The name of the Docker image to use.
 * @param workerFileName The name of the worker file
 * @return the docker container created
 */
async function create_container(data, uuid, image_name, workerFileName, targetAction) {
    return await docker.createContainer({
        Image: `${image_name}:areaWorker`, // Specify the image to use for the container
        AttachStdin: false,
        AttachStdout: false,
        AttachStderr: false,
        Tty: true,
        Env: [   
            `UUID=${uuid}`, // Set the UUID environment variable
            `DATA=${typeof data === 'object' && data !== null ? JSON.stringify(data) : '{}'}`, // Set the DATA environment variable
            `CALL_BACK=http://server:8080/api/reaction/${uuid}`, // Set the callback URL
            `TARGET_ACTION=${targetAction}`
        ],
        HostConfig: {
            NetworkMode: "area-epitech_db"
        },
        Cmd: ['node', workerFileName],
        OpenStdin: false,
        StdinOnce: false,
    });
}

/**
 * @brief Creates and starts a worker for Dropbox.
 * This function ensures the Docker image exists, creates a container,
 * and starts it to process new files.
 * @param data The data to be processed by the worker.
 * @param uuid The unique identifier for the operation.
 * @return The ID of the started container or an empty string on failure.
 */
async function create_dropbox_workers(data, uuid, targetAction) {
    var onNewFileImage = path.resolve(__dirname, '../workers/dropbox'); // Path to the Dockerfile
    var image_name = "dropbox-worker"; // Name of the Docker image
    var workerFileName = "dropboxWorker.js" // Name of the worker file
    try {
        await ensureImageExists(image_name, onNewFileImage, workerFileName);
        const container = await create_container(data, uuid, image_name, workerFileName, targetAction);
        await container.start(); // Start the container
        return container.id; // Return the container ID
    } catch (e) {
        console.log(e);
        return "";
    }
}

/**
 * @brief Creates and starts a worker for Dropbox.
 * This function ensures the Docker image exists, creates a container,
 * and starts it to process github action.
 * @param data The data to be processed by the worker.
 * @param uuid The unique identifier for the operation.
 * @return The ID of the started container or an empty string on failure.
 */
async function create_github_workers(data, uuid, targetAction) {
    var onNewFileImage = path.resolve(__dirname, '../workers/github'); // Path to the Dockerfile
    var image_name = "github-worker"; // Name of the Docker image
    var workerFileName = "githubWorker.js" // Name of the worker file
    try {
        await ensureImageExists(image_name, onNewFileImage, workerFileName);
        const container = await create_container(data, uuid, image_name, workerFileName, targetAction);
        await container.start(); // Start the container
        return container.id; // Return the container ID
    } catch (e) {
        console.log(e);
        return "";
    }
}

/**
 * @brief Creates and starts a worker for area.
 * This function ensures the Docker image exists, creates a container,
 * and starts it to process area action.
 * @param data The data to be processed by the worker.
 * @param uuid The unique identifier for the operation.
 * @return The ID of the started container or an empty string on failure.
 */
async function create_area_workers(data, uuid, targetAction) {
    var onNewFileImage = path.resolve(__dirname, '../workers/area'); // Path to the Dockerfile
    var image_name = "area-worker"; // Name of the Docker image
    var workerFileName = "areaWorker.js" // Name of the worker file
    try {
        await ensureImageExists(image_name, onNewFileImage, workerFileName);
        const container = await create_container(data, uuid, image_name, workerFileName, targetAction);
        await container.start(); // Start the container
        return container.id; // Return the container ID
    } catch (e) {
        console.log(e);
        return "";
    }
}
/**
 * @brief Creates and starts a worker for gmail.
 * This function ensures the Docker image exists, creates a container,
 * and starts it to process gmail action.
 * @param data The data to be processed by the worker.
 * @param uuid The unique identifier for the operation.
 * @return The ID of the started container or an empty string on failure.
 * 
 * @author Romain Chevallier
 */

async function create_gmail_workers(data, uuid, targetAction) {
    var onNewFileImage = path.resolve(__dirname, '../workers/gmail'); // Path to the Dockerfile
    var image_name = "gmail-worker"; // Name of the Docker image
    var workerFileName = "gmailWorker.js" // Name of the worker file
    try {
        await ensureImageExists(image_name, onNewFileImage, workerFileName);
        const container = await create_container(data, uuid, image_name, workerFileName, targetAction);
        await container.start(); // Start the container
        return container.id; // Return the container ID
    } catch (e) {
        console.log(e);
        return "";
    }
}

async function create_discord_workers(data, uuid, targetAction) {
    console.log("create_discord_workers");
    var onNewFileImage = path.resolve(__dirname, '../workers/discord'); // Path to the Dockerfile
    var image_name = "discord-worker"; // Name of the Docker image
    var workerFileName = "discordWorker.js" // Name of the worker file
    try {
        await ensureImageExists(image_name, onNewFileImage, workerFileName);
        const container = await create_container(data, uuid, image_name, workerFileName, targetAction);
        await container.start(); // Start the container
        return container.id; // Return the container ID
    } catch (e) {
        console.log(e);
        return "";
    }
}

/**
 * @brief Creates and starts a worker for Strava.
 * This function ensures the Docker image exists, creates a container,
 * and starts it to process Strava actions.
 * @param data The data to be processed by the worker.
 * @param uuid The unique identifier for the operation.
 * @param targetAction The target action to be performed by the worker.
 * @return The ID of the started container or an empty string on failure.
 * @author Adam Lesage
 */
async function create_strava_workers(data, uuid, targetAction) {
    var onNewFileImage = path.resolve(__dirname, '../workers/strava'); // Path to the Dockerfile
    var image_name = "strava-worker"; // Name of the Docker image
    var workerFileName = "stravaWorker.js" // Name of the worker file
    try {
        await ensureImageExists(image_name, onNewFileImage, workerFileName);
        const container = await create_container(data, uuid, image_name, workerFileName, targetAction);
        await container.start(); // Start the container
        return container.id; // Return the container ID
    } catch (e) {
        console.log(e);
        return "";
    }
}

module.exports = actions;