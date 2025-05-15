from bson import ObjectId
from typing import List
from app.database import Database
from app.models.user_models import UserModel, UpdateUserModel, UserOutModel, UserCreate, user_helper
from fastapi import HTTPException, status

async def add_user(user: UserCreate) -> UserOutModel:
    db = await Database.get_instance()
    users_collection = db.get_users_collection()
    
    if await users_collection.find_one({"email": user.email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    user_dict = user.model_dump(exclude={"confirm_password"})
    result = await users_collection.insert_one(user_dict)
    
    created_user = await users_collection.find_one({"_id": result.inserted_id})
    return UserOutModel(**user_helper(created_user))

async def list_users() -> List[UserOutModel]:
    db = await Database.get_instance()
    users_collection = db.get_users_collection()
    
    users = []
    async for user in users_collection.find():
        users.append(UserOutModel(**user_helper(user)))
    return users

async def get_user_by_id(id: str) -> UserOutModel:
    if not ObjectId.is_valid(id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID"
        )
    
    db = await Database.get_instance()
    users_collection = db.get_users_collection()
    
    user = await users_collection.find_one({"_id": ObjectId(id)})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserOutModel(**user_helper(user))

async def update_user(id: str, data: UpdateUserModel) -> UserOutModel:
    if not ObjectId.is_valid(id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID"
        )
    
    db = await Database.get_instance()
    users_collection = db.get_users_collection()
    
    existing_user = await users_collection.find_one({"_id": ObjectId(id)})
    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    update_data = data.model_dump(exclude_unset=True)
    if "email" in update_data:
        user_with_email = await users_collection.find_one({"email": update_data["email"]})
        if user_with_email and str(user_with_email["_id"]) != id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
    
    await users_collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": update_data}
    )
    
    updated_user = await users_collection.find_one({"_id": ObjectId(id)})
    return UserOutModel(**user_helper(updated_user))

async def delete_user(id: str) -> bool:
    if not ObjectId.is_valid(id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID"
        )
    
    db = await Database.get_instance()
    users_collection = db.get_users_collection()
    
    result = await users_collection.delete_one({"_id": ObjectId(id)})
    return result.deleted_count > 0