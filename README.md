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
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_Google_client_secret
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET= your_github_client_secret
   ```

3. Lunch the server, the web app and the database:

   ```bash
   sudo docker-compose up --build -d
   ```

The Vue.js frontend will start on [http://localhost:8081](http://localhost:8081).

The Express.js backend will start on [http://localhost:8080](http://localhost:8080).

The PostgreSQL database will start on [http://localhost:5432](http://localhost:5432).

## Documentation

You can find our documentation inside the `documentation` folder:

1. [Technical Comparative Study](documentation/technical-and-comparative-study.md) (see doc: `./documentation/technical-and-comparative-study.md`)
2. [Database Comparative Study](documentation/database-comparative.md) (see doc: `./documentation/database-comparative.md`)
3. [Testing Policy](documentation/testing-policy.md) (see doc: `./documentation/testing-policy.md`)
4. [Libraries and Frameworks](documentation/useful-libraries-for-development.md) (see doc: `./documentation/useful-libraries-for-development.md`)

### API Documentation

The API documentation for the backend can be accessed at [http://localhost:8000/api-docs](http://localhost:8000/api-docs), provided you have integrated a tool like Swagger or Postman collections for exploring the endpoints.

## Project Structure

```plaintext
area/
├── backend/                    # Express.js backend
│   ├── index.js                # Main entry point for Express.js
│   ├── database.js             # Database configuration
│   ├── models/                 # Sequelize or custom data models
│   ├── routes/                 # API routes
│   └── .env                    # Environment variables file (add this)
├── frontend/                   # Vue.js frontend
│   ├── public/                 # Public static files
│   ├── src/                    # Vue source code
│   ├── package.json            # npm configuration file
│   ├── vue.config.js           # Vue.js configuration file
│   └── .env                    # Environment variables file for frontend (add this)
└── README.md                   # Project documentation
```

## Database Management

The database is automatically created when the application starts for the first time if Sequelize or a similar ORM is used. If you'd like to manually create the database, ensure your database setup script in `database.js` is executed before running the backend server.

## Development

For live updates, both the Express.js backend and Vue.js frontend reload automatically when they detect changes in their respective source code.

- **Backend**: Use tools like **nodemon** for automatic restart when code changes.
  - Install nodemon globally if not already installed: `npm install -g nodemon`.
  - Start the backend using: `nodemon index.js`.
- **Frontend**: Vue's development server automatically refreshes the browser when files are updated. Start it with `npm run serve`.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
