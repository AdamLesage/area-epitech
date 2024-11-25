from fastapi import FastAPI

from backend.routers import login
from backend.db.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(login.router)

@app.get("/")
async def root():
    return {"message": "Hello World"}