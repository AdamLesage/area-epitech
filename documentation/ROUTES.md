# API Routes Documentation

# about.js

## 1. `GET /about.json`
### Description
This route returns a summary of the server's actions and reactions, as well as some basic client and server information. It includes the client's host IP address and the current server time.

### Response
- **client**: Contains information about the client making the request.
  - `host`: The IP address of the client making the request.
- **server**: Contains information about the server.
  - `current_time`: The current time on the server in Unix timestamp format.
  - `service`: A list of actions and reactions available on the server.

### Status Codes
- **200 OK**: If the request is successful.

## 2. `GET /services-info.json`
### Description
This route provides detailed information about the services available on the server.

### Response
- **services**: An object containing details about each available service, such as descriptions or configurations.

### Status Codes
- **200 OK**: If the request is successful.

## 3. `GET /services-areas.json`
### Description
This route returns a list of service areas that the server supports.

### Response
- **services**: A list of service areas, detailing the scope and availability of the services.

### Status Codes
- **200 OK**: If the request is successful.


# action.js

## 1. `GET /action`
### Description
This route retrieves a list of all active actions associated with the user. It returns all action-reaction pairs that are marked as active in the system.

### Response
- **Array**: A list of active action-reaction objects, each containing details such as title, action type, reaction type, and associated data.

### Status Codes
- **200 OK**: If the request is successful.
- **500 Internal Server Error**: If there's an error fetching the actions.

## 2. `POST /action`
### Description
This route creates a new action-reaction pair and returns the created object. The action-reaction pair consists of an action, a reaction, and associated data.

### Request Body
- **title**: The title of the action-reaction pair.
- **typeAction**: The type of action to be performed (must exist in the predefined actions).
- **typeReaction**: The type of reaction to be triggered (must exist in the predefined reactions).
- **reactionData**: Data relevant to the reaction, passed as an object.
- **actionData**: Data relevant to the action, passed as an object.

### Response
- **newAction**: The created action-reaction object, including all provided data and any generated UUID.

### Status Codes
- **200 OK**: If the action-reaction pair is created successfully.
- **400 Bad Request**: If the actionData is invalid.
- **401 Unauthorized**: If the user is not authenticated.
- **404 Not Found**: If the specified action or reaction type is not found.
- **500 Internal Server Error**: If there’s an error creating the action.

## 3. `DELETE /action/:id`
### Description
This route deletes an existing action-reaction pair based on the provided ID. It also stops and removes the associated Docker container.

### Request Parameters
- **id**: The ID of the action-reaction pair to be deleted.

### Response
- **message**: A confirmation message indicating that the action has been deleted.

### Status Codes
- **200 OK**: If the action is successfully deleted.
- **404 Not Found**: If no action with the provided ID is found.
- **500 Internal Server Error**: If there’s an error deleting the action.

## 4. `PUT /action/set_active/:uuid`
### Description
This route updates the active state of a specific action. It can either activate or deactivate the action. If deactivated, the associated Docker container is stopped; if activated, the container is started.

### Request Parameters
- **uuid**: The UUID of the action to be updated.

### Request Body
- **isActive**: A boolean indicating the desired state of the action (true for active, false for inactive).

### Response
- **updatedActionReaction**: The updated action-reaction object with the new state.

### Status Codes
- **200 OK**: If the action is successfully updated.
- **404 Not Found**: If no action with the provided UUID is found.
- **500 Internal Server Error**: If there’s an error updating the action.

# ActionReaction.js

## `POST /action-reaction`
### Description
This route creates a new action-reaction pair, where an action is associated with a reaction. The action and reaction are defined by their respective names, and the route will return the newly created action-reaction object.

### Request Body
- **title**: The title of the action-reaction pair.
- **userUuid**: The UUID of the user creating the action-reaction pair.
- **description**: A brief description of the action-reaction pair.
- **actionName**: The name of the action to be performed (must exist in the predefined actions).
- **reactionName**: The name of the reaction to be triggered (must exist in the predefined reactions).
- **reactionData**: Data relevant to the reaction, passed as an object.
- **actionData**: Data relevant to the action, passed as an object.

### Response
- **newArea**: The created action-reaction object, including all provided data and associated UUIDs for the action and reaction.

### Status Codes
- **201 Created**: If the action-reaction pair is successfully created.
- **400 Bad Request**: If the action or reaction specified by `actionName` or `reactionName` cannot be found.
- **401 Unauthorized**: If the user is not authenticated or the authorization token is invalid.
- **500 Internal Server Error**: If there’s an error during the creation process.

### Error Handling
- If the `actionName` or `reactionName` does not match an existing action or reaction, a **400 Bad Request** response with a message stating "Action not found" or "Reaction not found" will be returned.
- If the `authToken` is missing or invalid, a **401 Unauthorized** response will be returned.
- If an error occurs in creating the action-reaction pair, a **500 Internal Server Error** will be returned.

# authentication.js

## User Authentication

### 1. `POST /login`
#### Description
This route allows users to log in by providing their email and password.

#### Request Body
- **email**: User's email (required).
- **password**: User's password (required).

#### Response
- **200 OK**: User logged in successfully.
- **400 Bad Request**: Missing parameters.
- **404 Not Found**: User not found.
- **401 Unauthorized**: Invalid password.

### 2. `POST /register`
#### Description
This route allows users to register by providing their email, password, and optional personal details.

#### Request Body
- **email**: User's email (required).
- **password**: User's password (required).
- **name**: User's name (optional).
- **surname**: User's surname (optional).
- **bio**: User's bio (optional).
- **birthDate**: User's birth date (optional).
- **phoneNumber**: User's phone number (optional).
- **profilePicture**: User's profile picture (optional).

#### Response
- **201 Created**: User created successfully.
- **400 Bad Request**: Missing required parameters.
- **500 Internal Server Error**: Database error.

### 3. `GET /logout`
#### Description
This route logs the user out by invalidating their session based on the provided authorization token.

#### Request Headers
- **Authorization**: The auth token of the user (required).

#### Response
- **200 OK**: User logged out successfully.
- **400 Bad Request**: Missing authorization header.
- **404 Not Found**: User not found.
- **500 Internal Server Error**: Database error.

### 4. `POST /reset-password`
#### Description
This route allows users to request a password reset link by providing their email.

#### Request Body
- **email**: User's email (required).

#### Response
- **200 OK**: Email sent with reset link.
- **400 Bad Request**: Missing required parameters.
- **401 Unauthorized**: Invalid auth token.
- **404 Not Found**: User not found.
- **500 Internal Server Error**: Email sending error.

### 5. `GET /reset-password/:uuid`
#### Description
This route allows users to reset their password after receiving a valid reset link. They need to provide the new password.

#### Request Parameters
- **uuid**: The user's unique identifier (required).

#### Request Body
- **newPassword**: New password (required).

#### Response
- **200 OK**: Password updated successfully.
- **400 Bad Request**: Missing required parameters.
- **404 Not Found**: User not found.
- **500 Internal Server Error**: Database error.

## OAuth Integration

### 1. Google OAuth

#### `GET /google`
##### Description
This route initiates Google Authentication and redirects the user to the Google login page.

##### Response
- Redirects to Google OAuth login.

#### `GET /google/redirect`
##### Description
This route handles the redirect after successful Google authentication. It links the user's Google account with the existing account.

##### Response
- **200 OK**: User authenticated and linked to Google.
- **404 Not Found**: User not found.
- **500 Internal Server Error**: Database error.

### 2. GitHub OAuth

#### `GET /github`
##### Description
This route initiates GitHub Authentication and redirects the user to the GitHub login page.

##### Response
- Redirects to GitHub OAuth login.

#### `GET /github/redirect`
##### Description
This route handles the redirect after successful GitHub authentication. It links the user's GitHub account with the existing account.

##### Response
- **200 OK**: User authenticated and linked to GitHub.
- **404 Not Found**: User not found.
- **500 Internal Server Error**: Database error.

# reaction.js

## `POST /reaction/:uuid`
### Description
This route handles the creation of a new reaction for a given action-reaction pair. The reaction data is sent by the client and processed based on the type of reaction associated with the action.

### Request Parameters
- **uuid**: The UUID of the action-reaction pair (path parameter).

### Request Body
- **userId**: The UUID of the user performing the reaction (required).
- **reaction**: The type of reaction being sent (required).

### Response
- **message**: A confirmation message stating that the reaction has been received.
- **action**: The action-reaction object that is associated with the reaction, including all relevant data.

### Status Codes
- **200 OK**: If the reaction is successfully processed and received.
- **404 Not Found**: If the action-reaction pair or the reaction type is not found.
- **500 Internal Server Error**: If an error occurs while executing the reaction.

# user.js

## 1. `GET /users`
### Description
Retrieve a list of users filtered by UUIDs and/or email addresses. The request requires a valid authorization token.

### Query Parameters
- **uuids**: A comma-separated list of user UUIDs (optional).
- **emails**: A comma-separated list of email addresses (optional).

### Headers
- **Authorization**: Bearer token of the authenticated user (required).

### Response
- **200 OK**: Returns the list of users matching the criteria.
- **401 Unauthorized**: If the authorization token is missing or invalid.
- **500 Internal Server Error**: If an error occurs on the server.

## 2. `GET /user/:uuid`
### Description
Retrieve a user by their UUID. Requires a valid authorization token.

### Path Parameters
- **uuid**: The UUID of the user (required).

### Headers
- **Authorization**: Bearer token of the authenticated user (required).

### Response
- **200 OK**: Returns the user object if found.
- **401 Unauthorized**: If the authorization token is missing or invalid.
- **404 Not Found**: If no user is found with the given UUID.
- **500 Internal Server Error**: If an error occurs on the server.

## 3. `GET /user`
### Description
Retrieve a user by their email address. Requires a valid authorization token.

### Query Parameters
- **email**: The email address of the user (required).

### Headers
- **Authorization**: Bearer token of the authenticated user (required).

### Response
- **200 OK**: Returns the user object if found.
- **400 Bad Request**: If the email parameter is missing or invalid.
- **401 Unauthorized**: If the authorization token is missing or invalid.
- **404 Not Found**: If no user is found with the given email.
- **500 Internal Server Error**: If an error occurs on the server.

## 4. `POST /user`
### Description
Create a new user. The password is hashed before saving, and an authorization token is generated for the user.

### Request Body
- **name**: The first name of the user (required).
- **surname**: The surname of the user (required).
- **bio**: A short biography of the user (required).
- **birthDate**: The birth date of the user (required).
- **email**: The email address of the user (required).
- **phoneNumber**: The phone number of the user (required).
- **password**: The password for the user account (required).

### Response
- **201 Created**: Returns the created user object.
- **400 Bad Request**: If required fields are missing.
- **500 Internal Server Error**: If an error occurs on the server.


### 5. `DELETE /user/:uuid`

### Description:
Deletes a user by their UUID.

### Request Parameters
- `uuid` (string): The UUID of the user to delete.

### Headers:
- `Authorization` (string): Bearer token for user authentication.

### Response:  
- **200 OK**: Confirmation message indicating the user has been deleted.  
- **401 Unauthorized**: If the provided authorization token is invalid or missing.  
- **500 Internal Server Error**: If there was an error while processing the request.

---

### 6. `PUT /user/:uuid`

### Description:
Updates a user's information by their UUID.

### Parameters:
- `uuid` (string): The UUID of the user to update.

### Headers:
- `Authorization` (string): Bearer token for user authentication.

### Request Body:
- `email` (string): The new email for the user.  
- `password` (string): The new password (will be hashed).  
- `name` (string): The updated name of the user.  
- `surname` (string): The updated surname of the user.  
- `bio` (string): A short biography of the user.  
- `birthDate` (string): The user's birth date.  
- `phoneNumber` (string): The user's phone number.

### Response:
- **200 OK**: The updated user object.  
- **401 Unauthorized**: If the provided authorization token is invalid or missing.  
- **500 Internal Server Error**: If there was an error while processing the request.
