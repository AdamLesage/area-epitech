from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
import psycopg2  # Importer psycopg2 pour la gestion de la base de données

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env'))

DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_NAME = os.getenv('DB_NAME')
DB_HOST = os.getenv('DB_HOST', 'localhost')

SQLALCHEMY_DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"

def create_database():
    """Create database if it doesn't exist"""
    connection = psycopg2.connect(
        dbname="postgres",
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST
    )
    connection.autocommit = True
    cursor = connection.cursor()

    # Check if database exists
    cursor.execute(f"SELECT 1 FROM pg_database WHERE datname = '{DB_NAME}'")
    exists = cursor.fetchone()

    if not exists: # Create database if it doesn't exist
        cursor.execute(f'CREATE DATABASE {DB_NAME}')
        print(f"Database {DB_NAME} created")

    cursor.close()
    connection.close()

create_database()

# Create engine and session
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """Get database session"""
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()
