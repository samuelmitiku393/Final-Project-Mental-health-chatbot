from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from app.models.user_models import UserModel, UpdateUserModel, UserOutModel, UserCreate
from app.crud.user_crud import (
    add_user, list_users, update_user, delete_user, get_user_by_id
)
from bson import ObjectId
from app.database import get_db
from motor.motor_asyncio import AsyncIOMotorCollection

router = APIRouter(prefix="/api/users", tags=["Users"])

@router.get("/", response_model=List[UserOutModel])
async def get_users(db: AsyncIOMotorCollection = Depends(get_db)):
    try:
        return await list_users()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/{id}", response_model=UserOutModel)
async def get_user(id: str, db: AsyncIOMotorCollection = Depends(get_db)):
    try:
        if not ObjectId.is_valid(id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid user ID"
            )
        return await get_user_by_id(id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/", response_model=UserOutModel, status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate, db: AsyncIOMotorCollection = Depends(get_db)):
    try:
        return await add_user(user)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.put("/{id}", response_model=UserOutModel)
async def update_user_route(id: str, data: UpdateUserModel, db: AsyncIOMotorCollection = Depends(get_db)):
    try:
        return await update_user(id, data)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.delete("/{id}", response_model=dict)
async def delete_user_endpoint(id: str, db: AsyncIOMotorCollection = Depends(get_db)):
    if not id or id == "undefined" or not ObjectId.is_valid(id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID format"
        )

    try:
        success = await delete_user(id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        return {"status": "deleted"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
