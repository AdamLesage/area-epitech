# AREA - Automated Reactive Event Application

AREA (Automated Reactive Event Application) is a web application that triggers automatic actions based on user-defined events. It is built using **Express.js** for the backend and **Vue.js** for the frontend.

## Prerequisites

Before you start, make sure you have installed:
- **Node.js** and **npm**
- **PostgreSQL** for database management

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/area.git
   cd area
   ```


2. Set up your project. Create a `.env` file in the `root` folder with the necessary environment variables:

   ```plaintext
   DATABASE_URL=postgresql://<POSTGRES_USER>:<POSTGRES_PASSWORD>@<DB_HOST>:<DB_PORT>/<POSTGRES_DB>

   POSTGRES_USER=<POSTGRES_USER>
   POSTGRES_PASSWORD=<POSTGRES_PASSWORD>
   POSTGRES_DB=<POSTGRES_DB>

   GOOGLE_CLIENT_ID=<GOOGLE_CLIENT_ID>
   GOOGLE_CLIENT_SECRET=<GOOGLE_CLIENT_SECRET>

   GITHUB_CLIENT_ID=<GITHUB_CLIENT_ID>
   GITHUB_CLIENT_SECRET=<GITHUB_CLIENT_SECRET>

   SPOTIFY_CLIENT_ID=<SPOTIFY_CLIENT_ID>
   SPOTIFY_CLIENT_SECRET=<SPOTIFY_CLIENT_SECRET>

   DROPBOX_APP_KEY=<DROPBOX_APP_KEY>
   DROPBOX_APP_SECRET=<DROPBOX_APP_SECRET>

   DISCORD_CLIENT_ID=<DISCORD_CLIENT_ID>
   DISCORD_CLIENT_SECRET=<DISCORD_CLIENT_SECRET>
   DISCORD_BOT_TOKEN=<DISCORD_BOT_TOKEN>

   EMAIL_USER=<EMAIL_USER>
   EMAIL_PASSWORD=<EMAIL_PASSWORD>

   GITHUB_ACCESS_TOKEN=<GITHUB_ACCESS_TOKEN>

   BACKEND_URL=<BACKEND_URL>

   STRAVA_CLIENT_ID=<STRAVA_CLIENT_ID>
   STRAVA_CLIENT_SECRET=<STRAVA_CLIENT_SECRET>
   ```
### Ensure to replace the placeholders with your actual credentials or environment-specific values.

3. Launch the server, the web app and the database:

   ```bash
   sudo docker-compose up --build -d
   ```

The Vue.js frontend will start on [http://localhost:8081](http://localhost:8081).

The Express.js backend will start on [http://localhost:8080](http://localhost:8080).

The Swagger documentation will start on [http://localhost:8080/docs](http://localhost:8080/docs)

The PostgreSQL database will start on [http://localhost:5432](http://localhost:5432).

The Redis service will start on port 6379

If any error is encountered, make sure port 5432, 6379, 8080, 8081 are free on your computer

## Documentation

You can find our documentation inside the `documentation` folder:

1. [Technical Comparative Study](documentation/technical-and-comparative-study.md) (see doc: `./documentation/technical-and-comparative-study.md`)
2. [Database Comparative Study](documentation/database-comparative.md) (see doc: `./documentation/database-comparative.md`)
3. [Testing Policy](documentation/testing-policy.md) (see doc: `./documentation/testing-policy.md`)
4. [Libraries and Frameworks](documentation/useful-libraries-for-development.md) (see doc: `./documentation/useful-libraries-for-development.md`)
5. [Models of the Database](documentation/MODELS.md) (see doc: `./documentation/MODELS.md`)
6. [Route of the Database](documentation/ROUTES.md) (see doc: `./documentation/ROUTES.md`)
7. [Route of the Front](documentation/ROUTES_FRONT.md) (see doc: `./documentation/ROUTES_FRONT.md`)
8. [Backend Worker architecture](documentation/backend-arch.md) (see doc: `./documentation/backend-arch.md`)

### API Documentation

The API documentation for the backend can be accessed at [http://localhost:8000/docs](http://localhost:8000/docs).

## Project Structure

   ```plaintext
   area/
   ├── backend/                    # Express.js backend
   │   ├── index.js                # Main entry point for Express.js
   │   ├── database.js             # Database configuration
   │   ├── models/                 # Sequelize or custom data models
   │   ├── routes/                 # API routes
   │   ├── Dockerfile              # Dockerfile for the backend
   │   └── .env                    # Environment variables file (add this)
   ├── frontend/                   # Vue.js frontend
   │   ├── android/                # Android project
   │   ├── ios/                    # Ios project
   │   ├── public/                 # Public static files
   │   ├── src/                    # Vue source code
   │   ├── package.json            # npm configuration file
   │   ├── vue.config.js           # Vue.js configuration file
   │   ├── Dockerfile              # Dockerfile for the frontend
   │   └── .env                    # Environment variables file for frontend (add this)
   ├── mobile/                     # Mobile folder
   │   └── Dockerfile              # Dockerfile for the mobile
   ├── README.md                   # Project documentation
   ├── .env                        # Environment variables file for docker-compose
   └── docker-compose.yml          # Docker compose file
   ```

## Database Management

The database is automatically created when the application starts for the first time if Sequelize or a similar ORM is used. If you'd like to manually create the database, ensure your database setup script in `database.js` is executed before running the backend server.

## Development

For live updates, both the Express.js backend and Vue.js frontend reload automatically when they detect changes in their respective source code.

- **Backend**: Use tools like **nodemon** for automatic restart when code changes.
  - Install nodemon globally if not already installed: `npm install -g nodemon`.
  - Start the backend using: `nodemon index.js`.
- **Frontend**: Vue's development server automatically refreshes the browser when files are updated. Start it with `npm run dev`.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
