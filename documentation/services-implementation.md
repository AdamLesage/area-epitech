# 📚 Documentation Services Creation

This document provides a comprehensive guide for setting up, managing, and understanding the **Services Creation** process, including authentication, actions, and reactions.

---

## 🔐 Authentification

### 🛠 Passport Setup
1. **Find a authentification strategy on the passport doc** : [https://www.passportjs.org/packages/](https://www.passportjs.org/packages/)
2. **Install the chosen strategy** : `npm install passport-service`
3. **Init the passport strategie**
```javascript
const GitHubStrategy = require('passport-github2').Strategy;
```
```javascript
passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: `${process.env.BACKEND_URL}/auth/github/redirect`,
            scope: ['user:email'],
        },
        async (accessToken, refreshToken, profile, done) => {
            const email = profile.emails?.[0]?.value || null;
            done(null, { ...profile, accessToken, email });
        }
    )
);
```
### 🔄 Passport Callback
- Create a get and a post route for the authentification [exemple](../backend/routes/authentication.js) and create the user and the link account

---

## Services
#### [`backend/services/about.json`](../backend/services/about.json)
- **Add your service description on the list.**
```json
{
    "name":"{name Service}",
    "actions": [
      // Define actions here
    ],
    "reactions": [
      // Define reactions here
    ]
}
```
#### [`backend/services/services-info.json`](../backend/services/services-info.json)
- **Add your service details on the list.**
```json
    {
      "name":"{name Service}",
      "color":"{color service}",
      "icon":"{icon service}",
      "reviews": {
        "rate": 4.2,
        "count": 10000
      },
      "saves": 100000,
      "categories": [ // action category
        {
          "name": "pull_request", // category name
          "display_name": "Pull Request", // category display name
          "actions": [
            // Define actions here
          ],
          "reactions": [
            // Define reactions here
          ]
        }
      ],
    },
```

## ⚡ Actions

### ⚙️ Setup Configuration
#### [`backend/services/about.json`](../backend/services/about.json)
- **Add your action info on the action list of your services.**
  ```json
  "actions": [
      {
        "name":"{name action}",
        "description":"{action description}"
      },
  ]
  ```

#### [`backend/services/services-info.json`](../backend/services/services-info.json)

- **Add your action details on the action list of your service.**
    ```json
    {
    "actions": [
        {
          "name":"pull_request_review.submitted", // action name
          "display_name": "Pull Request Review Submitted", // action display name
          "description":"A pull request review is submitted", // action description
          "icon":"mdi:git-pull-request", // action icon
          "release_date": "2024-12-18",
          "updated_date": "2024-12-20",
          "version": "1.0.0",
          "options": [ // action options
            {
              "name": "repository_name", // option name
              "display_name": "Repository Name", // option display name
              "description": "The owner of the repository", // option description
              "type": "text", // option type see option choice at the end of the file
              "required": true , // option required
            },
          ]
        },
      ]
    },
    ```

### 🛠 Worker Creation
#### [`backend/services/actions.js`](../backend/services/actions.js)
- **Add the action on the actions map with your action name and the creation worker function.**
```javascript
actions.set('{name action}', create_{nameService}_workers);
```
- **Add the creation worker function, by changing the {nameService} by your service name.**
```javascript
  async function create_{nameService}_workers(data, uuid, targetAction) {
      var onNewFileImage = path.resolve(__dirname, '../workers/{nameService}'); // Path to your Dockerfile
      var image_name = "{nameService}-worker"; // Name of the Docker image
      var workerFileName = "main.js" // Name of the entry point of the worker
      try {
          await ensureImageExists(image_name, onNewFileImage, workerFileName); // create the image
          const container = await create_container(data, uuid, image_name, workerFileName, targetAction); // create the container
          await container.start(); // Start the container
          return container.id; // Return the container ID
      } catch (e) {
          console.log(e);
          return ""; // return empty id
      }
  }
```

#### [`backend/workers/{nameService}/`](../backend/workers/dropbox/Dockerfile)
- **Create a file .js with the worker logic** [exemple](../backend/workers/dropbox/dropboxWorker.js)
- **Create a new Dockerfile in the worker directory.**
    ```dockerfile
    FROM node:16
    WORKDIR /app
    COPY . .
    RUN npm install
    CMD ["node", "worker.js"]
    ```
### Worker operation

- Environement variables
  - `DATA`: the data set in the action option and the access token of the services
  - `UUID`: the unique identifier of the worker
  - `TARGET_ACTION`: the action to be performed on the worker
  - `CALL_BACK`: the callback function to be called when the target action is find

## 🎯 Reactions
### ⚙️ Setup Configuration
#### [`backend/services/about.json`](../backend/services/about.json)
  - **Add your action info on the reaction list of your services.**
  ```json
  "reaction": [
      {
        "name":"{name reaction}",
        "description":"{reaction description}"
      },
  ]
  ```

#### [`backend/services/services-info.json`](../backend/services/services-info.json)

- **Add your reaction details on the action list of your service.**
    ```json
    {
    "reactions": [
          {
            "name": "create_issue",
            "display_name": "Create a new issue",
            "description": "Create a new issue",
            "version": "1.0.0",
            "release_date": "2024-12-18",
            "updated_date": "2024-12-20",
            "icon": "mdi:git-issue",
            "options": [
              {
                "name": "repository_name",
                "display_name": "Repository Name",
                "description": "The name of the repository",
                "type": "text",
                "required": true
              },
              {
                "name": "repository_owner",
                "display_name": "Repository Owner",
                "description": "The owner of the repository",
                "type": "text",
                "required": true
              },
              {
                "name": "title",
                "display_name": "Title",
                "description": "The title of the issue",
                "type": "text",
                "required": true
              },
              {
                "name": "body",
                "display_name": "Body",
                "description": "The body of the issue",
                "type": "textarea",
                "required": true
              }
            ]
          }
        ]
    },
    ```

### 🔄 Execute Reactions
#### [`backend/services/reactions.js`](../backend/services/reactions.js)
- **Add the reaction on the reactions map with your reaction name and the function that execute the reaction**
```javascript
/**
 * Handler function for the 'github_create_milestone' reaction.
 * 
 * @param {Object} reactionData Data related to the reaction
 * @param {Object} actionResponseData Data sent by the action that triggered this reaction.
 * @param {string} userUuuid the user uuid that give you the access to the access token
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
```

## Option Type

| **Input Type**        | **Description**                                                                 |
|-----------------------|---------------------------------------------------------------------------------|
| `text`                | A standard single-line text input.                                              |
| `date`                | Input for selecting a date.                                                     |
| `time`                | Input for selecting a specific time.                                            |
| `select`              | A dropdown menu to choose one option from a list.                               |
| `checkbox`            | A box that can be checked or unchecked for binary choices.                      |
| `radio`               | A circular input to select one option from a group.                             |
| `number`              | Input for numeric values.                                                       |
| `file`                | Input for uploading files.                                                      |
| `switch`              | A toggle switch for on/off or true/false states.                                |
| `phone number`        | Input specifically for phone number formatting.                                 |
| `email`               | Input for email addresses with validation.                                      |
| `textarea`            | A multi-line text input for longer content.                                     |
| `password`            | Input for passwords, with masked characters for security.                       |
| `range`               | A slider input for selecting a value within a range.                            |
| `inputnumber`         | A number input with stepper buttons to increase or decrease values.             |
| `week`                | Input for selecting a specific week of the year.                                |
| `month`               | Input for selecting a specific month.                                           |
| `color`               | Input for picking a color using a color picker tool.                            |
| `custom input`        | A customizable input field for specialized use cases.                           |