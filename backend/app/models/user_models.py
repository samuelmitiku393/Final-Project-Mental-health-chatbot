from pydantic import BaseModel, EmailStr, Field, ConfigDict, model_validator
from typing import Optional
from bson import ObjectId
from pydantic_core import core_schema

class PyObjectId(str):
    @classmethod
    def __get_pydantic_core_schema__(cls, _source_type, _handler):
        return core_schema.no_info_after_validator_function(
            cls.validate,
            core_schema.str_schema(),
            serialization=core_schema.to_string_ser_schema(),
        )

    @classmethod
    def validate(cls, v):
        if isinstance(v, ObjectId):
            return str(v)
        if isinstance(v, str) and ObjectId.is_valid(v):
            return v
        raise ValueError("Invalid ObjectId")

class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str
    confirm_password: str
    role: str = "client"
    status: str = "Active"
    @model_validator(mode="after")
    def check_passwords_match(self):
        if self.password != self.confirm_password:
            raise ValueError("Passwords do not match")
        return self

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserModel(UserBase):
    status: str = "Active"
    role: str = "client"

    model_config = ConfigDict(
        arbitrary_types_allowed=True,
    )

class UpdateUserModel(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    status: Optional[str] = None
    role: Optional[str] = None

class UserOutModel(UserModel):
    id: PyObjectId = Field(alias="_id")

    model_config = ConfigDict(
        populate_by_name=True,
        json_encoders={ObjectId: str},
    )

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

def user_helper(user: dict) -> dict:
    return {
        "_id": str(user.get("_id")),
        "name": user.get("name", ""),
        "email": user.get("email", ""),
        "status": user.get("status", "Active"),
        "role": user.get("role", "client"),
    }
