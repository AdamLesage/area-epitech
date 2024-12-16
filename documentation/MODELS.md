# Prisma Model Documentation

## `User` Model

The `User` model represents a user in the system.

| Field            | Type     | Description                                               |
|------------------|----------|-----------------------------------------------------------|
| `id`             | `Int`    | Unique identifier of the user (primary key)               |
| `uuid`           | `String` | Universal unique identifier for the user                  |
| `name`           | `String` | Last name of the user                                    |
| `surname`        | `String` | First name of the user                                     |
| `bio`            | `String?`| Biography of the user (optional)                          |
| `birthDate`      | `DateTime?`| Birthdate of the user (optional)                         |
| `email`          | `String` | Email address of the user (must be unique)                |
| `phoneNumber`    | `String?`| User's phone number (optional)                            |
| `hashedPassword` | `String` | The hashed password of the user                           |
| `authToken`      | `String?`| Unique authentication token (optional)                    |
| `profilePicture` | `ProfilePicture?`| Profile picture of the user (optional)                |
| `linkedAccounts` | `LinkedAccount[]` | Linked external accounts for the user                   |

## `ProfilePicture` Model

The `ProfilePicture` model represents the user's profile image.

| Field      | Type    | Description                                        |
|------------|---------|----------------------------------------------------|
| `id`       | `Int`   | Unique identifier for the profile picture (primary key) |
| `uuid`     | `String`| Unique identifier for the image                    |
| `picture`  | `String`| URL of the profile picture                         |
| `userId`   | `Int`   | Identifier of the user (foreign key to `User`)     |
| `user`     | `User`  | Relation to the associated user                    |

## `LinkedAccount` Model

The `LinkedAccount` model represents an external account linked to a user.

| Field        | Type     | Description                                          |
|--------------|----------|------------------------------------------------------|
| `id`         | `Int`    | Unique identifier for the linked account (primary key) |
| `uuid`       | `String` | Unique identifier for the external account           |
| `serviceName`| `String` | Name of the external service (e.g., Google, Facebook) |
| `username`   | `String` | Username on the external service                     |
| `authToken`  | `String` | Authentication token for the linked account          |
| `userId`     | `Int`    | Identifier of the associated user (foreign key to `User`) |
| `user`       | `User`   | Relation to the associated user                      |

## `Service` Model

The `Service` model represents an external service integrated into the application.

| Field       | Type    | Description                                      |
|-------------|---------|--------------------------------------------------|
| `id`        | `Int`   | Unique identifier for the service (primary key) |
| `name`      | `String`| Name of the service (must be unique)            |
| `reactions` | `Reaction[]`| List of reactions available for this service    |
| `actions`   | `Action[]`  | List of actions available for this service      |

## `Action` Model

The `Action` model represents an action that a user can perform on a service.

| Field         | Type     | Description                                          |
|---------------|----------|------------------------------------------------------|
| `id`          | `Int`    | Unique identifier for the action (primary key)      |
| `name`        | `String` | Name of the action                                  |
| `description` | `String?`| Optional description of the action                  |
| `serviceId`   | `Int`    | Identifier of the associated service (foreign key to `Service`) |
| `service`     | `Service`| Relation to the associated service                   |
| `actionReactions` | `ActionReaction[]`| List of reactions linked to this action |

## `Reaction` Model

The `Reaction` model represents a reaction to an action performed on a service.

| Field         | Type     | Description                                          |
|---------------|----------|------------------------------------------------------|
| `id`          | `Int`    | Unique identifier for the reaction (primary key)     |
| `name`        | `String` | Name of the reaction                                 |
| `description` | `String?`| Optional description of the reaction                 |
| `endpoint`    | `String` | Endpoint associated with the reaction (URL for the API call) |
| `serviceId`   | `Int`    | Identifier of the associated service (foreign key to `Service`) |
| `service`     | `Service`| Relation to the associated service                   |
| `actionReactions` | `ActionReaction[]`| List of action reactions associated with this reaction |

## `ActionReaction` Model

The `ActionReaction` model represents the execution of a reaction triggered by an action within a service.

| Field         | Type     | Description                                           |
|---------------|----------|-------------------------------------------------------|
| `id`          | `Int`    | Unique identifier for the action reaction (primary key) |
| `uuid`        | `String` | Unique identifier for the action reaction            |
| `title`       | `String` | Title of the action reaction                         |
| `reactionData`| `Json`   | Data specific to the reaction (JSON format)           |
| `actionData`  | `Json`   | Data specific to the action (JSON format)             |
| `userUuid`    | `String` | Unique identifier of the user who performed the action |
| `description` | `String?`| Optional description of the action reaction          |
| `creationDate`| `DateTime`| Date when the action reaction was created             |
| `isActive`    | `Boolean`| Status of the action reaction (active or inactive)   |
| `containerUuid` | `String` | UUID of the container where the action reaction is executed |
| `actionId`    | `Int`    | Identifier of the associated action (foreign key to `Action`) |
| `action`      | `Action` | Relation to the associated action                     |
| `reactionId`  | `Int`    | Identifier of the associated reaction (foreign key to `Reaction`) |
| `reaction`    | `Reaction`| Relation to the associated reaction                   |

---

This documentation covers the primary models used in the application. If you need more details or adjustments, feel free to let me know!
