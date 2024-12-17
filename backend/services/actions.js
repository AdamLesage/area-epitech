const fs = require('fs');
const tar = require('tar-fs');
const path = require('path');
// Import the Dockerode library to interact with Docker
var Docker = require('dockerode');
const Dockerode = require('dockerode');
var docker = new Docker();

// Create a map to hold creation of action worker
const actions = new Map();
actions.set('dropbox_on_new_file', create_dropbox_on_new_file_workers);
actions.set('dropbox_on_new_shares_file', create_dropbox_on_new_shares_file_workers);
actions.set('github_on_issue_assigned', create_github_on_issue_assigned_workers)
actions.set('github_on_issue_closed', create_github_on_issue_closed_workers)

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
        await docker.getImage(imageName).remove({ force: true });
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
        entries: ['Dockerfile', workerFileName],
    });

    // Build the Docker image using the tar stream
    const stream = await docker.buildImage(tarStream, { t: imageName });

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
async function create_container(data, uuid, image_name, workerFileName) {
    return await docker.createContainer({
        Image: image_name, // Specify the image to use for the container
        AttachStdin: false,
        AttachStdout: false,
        AttachStderr: false,
        Tty: true,
        Env: [
            `UUID=${uuid}`, // Set the UUID environment variable
            `DATA=${typeof data === 'object' && data !== null ? JSON.stringify(data) : '{}'}`, // Set the DATA environment variable
            `CALL_BACK_REACTION=http://127.0.0.1:8080/api/reaction/${uuid}` // Set the callback URL
        ],
        HostConfig: {
            NetworkMode: "host"
        },
        Cmd: ['node', workerFileName],
        OpenStdin: false,
        StdinOnce: false,
    });
}


// Generic function for workers

/**
 * @brief Creates and starts a worker container based on given parameters.
 *
 * @param data The data to be processed by the worker.
 * @param uuid The unique identifier for the operation.
 * @param workerPath Path to the worker's Dockerfile directory.
 * @param imageName Name of the Docker image to create.
 * @param workerFileName Name of the worker file to execute.
 * @return The ID of the started container or an empty string on failure.
 * @author Romain Chevallier && Adam Lesage
 */
async function create_worker_container(data, uuid, workerPath, imageName, workerFileName) {
    try {
        const workerDockerfilePath = path.resolve(__dirname, workerPath); // Path to the Dockerfile
        await ensureImageExists(imageName, workerDockerfilePath, workerFileName);
        const container = await create_container(data, uuid, imageName, workerFileName);
        console.log("run container");
        await container.start(); // Start the container
        return container.id; // Return the container ID
    } catch (e) {
        console.log(e);
        return "";
    }
}


// DropBox

/**
 * @brief Creates and starts a worker for new Dropbox files.
 * This function ensures the Docker image exists, creates a container,
 * and starts it to process new files.
 * @param data The data to be processed by the worker.
 * @param uuid The unique identifier for the operation.
 * @return The ID of the started container or an empty string on failure.
 */
async function create_dropbox_on_new_file_workers(data, uuid) {
    return await create_worker_container(
        data,
        uuid,
        '../workers/dropbox/onNewFile',
        'on-new-file',
        'dropBoxWorkerOnNewFile.js'
    );
}


/**
 * @brief Creates and starts a worker for new shared Dropbox files.
 * This function ensures the Docker image exists, creates a container,
 * and starts it to process new shared files.
 * @param data The data to be processed by the worker.
 * @param uuid The unique identifier for the operation.
 * @return The ID of the started container or an empty string on failure.
 */
async function create_dropbox_on_new_shares_file_workers(data, uuid) {
    return await create_worker_container(
        data,
        uuid,
        '../workers/dropbox/onNewSharesFile',
        'on-new-shares-file',
        'dropBoxWorkerOnNewSharesFile.js'
    );
}


// Github


/**
 * @brief Creates and starts a worker for new issue assigned.
 *
 * @param data The data to be processed by the worker.
 * @param uuid The unique identifier for the operation.
 * @return The ID of the started container or an empty string on failure.
 * @author Adam LESAGE
 */
async function create_github_on_issue_closed_workers(data, uuid) {
    return await create_worker_container(
        data,
        uuid,
        '../workers/github/onIssueClosed',
        'on-issue-closed-file',
        'githubWorkerOnIssueClosed.js'
    );
}


/**
 * @brief Creates and starts a worker for issue closed.
 *
 * @param data The data to be processed by the worker.
 * @param uuid The unique identifier for the operation.
 * @return The ID of the started container or an empty string on failure.
 * @author Adam LESAGE
 */
async function create_github_on_issue_closed_workers(data, uuid) {
    return await create_worker_container(
        data,
        uuid,
        '../workers/github/onIssueClosed',
        'on-issue-closed-file',
        'githubWorkerOnIssueClosed.js'
    );
}


module.exports = actions;
