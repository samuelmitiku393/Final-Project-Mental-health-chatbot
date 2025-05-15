from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime
from bson import ObjectId
from app.database import Database
from pydantic_core import core_schema

class PyObjectId(str):
    @classmethod
    def __get_pydantic_core_schema__(cls, _source_type, _handler):
        def validate(value):
            if not ObjectId.is_valid(value):
                raise ValueError("Invalid ObjectId")
            return str(value)
        return core_schema.no_info_plain_validator_function(validate)

class ResourceBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    type: str = Field(..., min_length=1, max_length=50)
    category: str = Field(..., min_length=1, max_length=50)
    source: str = Field(..., min_length=1, max_length=100)
    url: str = Field(..., min_length=1, max_length=500)
    description: str = Field(..., min_length=1, max_length=1000)

class ResourceCreate(ResourceBase):
    pass

class Resource(ResourceBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = ConfigDict(
        populate_by_name=True,
        json_schema_extra={
            "example": {
                "title": "Understanding Anxiety Disorders",
                "type": "article",
                "category": "articles",
                "source": "National Institute of Mental Health",
                "url": "https://www.nimh.nih.gov/health/topics/anxiety-disorders",
                "description": "Comprehensive guide about anxiety disorders",
                "created_at": "2023-01-01T00:00:00",
                "updated_at": "2023-01-01T00:00:00"
            }
        }
    )

async def create_resource(resource: ResourceCreate):
    db = await Database.get_instance()
    resource_data = resource.model_dump()
    resource_data["created_at"] = resource_data["updated_at"] = datetime.utcnow()
    
    result = await db.get_resources_collection().insert_one(resource_data)
    created_resource = await db.get_resources_collection().find_one({"_id": ObjectId(result.inserted_id)})
    return Resource(**created_resource) if created_resource else None

async def get_resources(search: str = None, category: str = None, limit: int = 100, skip: int = 0):
    db = await Database.get_instance()
    query = {}
    
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    
    if category and category.lower() != "all":
        query["category"] = category.lower()
    
    resources = []
    async for resource in db.get_resources_collection().find(query).sort("created_at", -1).skip(skip).limit(limit):
        resources.append(Resource(**resource))
    return resources

async def get_resource_categories():
    db = await Database.get_instance()
    pipeline = [
        {"$group": {"_id": "$category"}},
        {"$project": {"category": "$_id", "_id": 0}}
    ]
    
    categories = ["all"]
    async for category in db.get_resources_collection().aggregate(pipeline):
        categories.append(category["category"])
    
    return sorted(categories)

async def get_resource(resource_id: str):
    db = await Database.get_instance()
    try:
        resource = await db.get_resources_collection().find_one({"_id": ObjectId(resource_id)})
        return Resource(**resource) if resource else None
    except:
        return None

async def update_resource(resource_id: str, resource: ResourceCreate):
    db = await Database.get_instance()
    resource_data = resource.model_dump()
    resource_data["updated_at"] = datetime.utcnow()
    
    result = await db.get_resources_collection().update_one(
        {"_id": ObjectId(resource_id)},
        {"$set": resource_data}
    )
    if result.modified_count == 1:
        updated_resource = await db.get_resources_collection().find_one({"_id": ObjectId(resource_id)})
        return Resource(**updated_resource)
    return None

async def delete_resource(resource_id: str):
    db = await Database.get_instance()
    result = await db.get_resources_collection().delete_one({"_id": ObjectId(resource_id)})
    return result.deleted_count == 1