##
## EPITECH PROJECT, 2024
## AREA
## File description:
## login
##

from fastapi import APIRouter

router = APIRouter()

@router.post("/login")
async def login():
    return {"message": "Need to implement login"}
