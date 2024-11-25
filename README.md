Here's the updated README in English, without mentions of testing and deployment:

---

# AREA - Automated Reactive Event Application

AREA (Automated Reactive Event Application) is a web application that triggers automatic actions based on user-defined events. It is built using **FastAPI** for the backend and **React** for the frontend.

## Prerequisites

Before you start, make sure you have installed:
- **Python 3.8+**
- **Node.js** and **npm**
- **PostgreSQL** for database management

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/area.git
   cd area
   ```

2. Install Python dependencies for the backend using `pip`:

   ```bash
   pip install -r requirements.txt
   ```

3. Install JavaScript dependencies for the frontend:

   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. Set up your PostgreSQL database. Create a `.env` file in the `backend` folder with the necessary environment variables:

   ```plaintext
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=area
   DB_HOST=localhost
   ```

## Starting the Application

### 1. Start the Backend

In one terminal, start the FastAPI server by running:

```bash
uvicorn backend.main:app --reload
```

FastAPI will start on [http://localhost:8000](http://localhost:8000).

### 2. Start the Frontend

In another terminal, navigate to the `frontend` folder and start the React application:

```bash
cd frontend
npm start
```

The React frontend will start on [http://localhost:3000](http://localhost:3000).

## Documentation

You can find our documentation inside `documentation` folder:

1. [Technical Comparative Study](documentation/TECHNICAL_COMPARATIVE_STUDY.md) (see doc: `./documentation/technical-and-comparative-study.md`)

### API Documentation

Once the application is running, you can explore the interactive API documentation provided by FastAPI at the following URL:

```
http://localhost:8000/docs
```

This documentation allows you to test the various API endpoints and view request and response schemas.

## Project Structure

```plaintext
area/
├── backend/                    # FastAPI backend
│   ├── main.py                 # Main entry point for FastAPI
│   ├── database.py             # Database configuration
│   ├── models/                 # SQLAlchemy data models
│   ├── routers/                # API routes
│   └── .env                    # Environment variables file (add this)
├── frontend/                   # React frontend
│   ├── public/                 # Public static files
│   ├── src/                    # React source code
│   ├── package.json            # npm configuration file
│   └── .env                    # Environment variables file for frontend (add this)
└── README.md                   # Project documentation
```

## Database Management

The database is automatically created when the application starts for the first time. If you'd like to manually create the database, you can run the `create_database()` function in `database.py` before starting the FastAPI server.

## Development

For live updates, both the FastAPI backend and React frontend reload automatically when they detect changes in their respective source code.

- **Backend**: FastAPI restarts automatically using the `--reload` option in Uvicorn.
- **Frontend**: React uses Webpack to refresh the browser when files are updated.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---
