from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from app.database import Database  
from app.models.therapist_model import TherapistModel, UpdateTherapistModel

def therapist_helper(therapist) -> dict:
    return {
        "id": str(therapist["_id"]),
        "name": therapist["name"],
        "credentials": therapist["credentials"],
        "specialties": therapist["specialties"],
        "location": therapist["location"],
        "languages": therapist["languages"],
        "insurance": therapist["insurance"],
        "telehealth": therapist["telehealth"],
        "photo": therapist["photo"],
        "bio": therapist["bio"],
        "phone_number": therapist.get("phone_number"),
        "website": therapist.get("website"),
        "social_links": therapist.get("social_links"),
        "years_of_experience": therapist.get("years_of_experience"),
        "availability": therapist.get("availability"),
    }


#Utility to get the therapist collection
async def get_therapist_collection():
    db = await Database.get_instance()  
    return db.get_collection("therapists")  

def is_valid_object_id(id: str) -> bool:
    """Utility function to validate ObjectId."""
    return ObjectId.is_valid(id)

async def get_therapist_by_id(id: str):
    if not is_valid_object_id(id):
        raise ValueError(f"Invalid therapist ID: {id}")
    
    collection = await get_therapist_collection()
    therapist = await collection.find_one({"_id": ObjectId(id)})
    if therapist:
        return therapist_helper(therapist)
    return None

# CREATE
async def add_therapist(data: TherapistModel):
    collection = await get_therapist_collection()
    therapist = await collection.insert_one(data.dict())
    new_therapist = await collection.find_one({"_id": therapist.inserted_id})
    return therapist_helper(new_therapist)

# READ
async def list_therapists():
    collection = await get_therapist_collection()
    therapists = []
    async for therapist in collection.find():
        therapists.append(therapist_helper(therapist))
    return therapists

# UPDATE
async def update_therapist(id: str, data: UpdateTherapistModel):
    if not is_valid_object_id(id):
        raise ValueError(f"Invalid therapist ID: {id}")
    
    collection = await get_therapist_collection()
    updated_data = {k: v for k, v in data.dict().items() if v is not None}
    if updated_data:
        await collection.update_one({"_id": ObjectId(id)}, {"$set": updated_data})
        therapist = await collection.find_one({"_id": ObjectId(id)})
        return therapist_helper(therapist)
    return None

# DELETE
async def delete_therapist(id: str):
    if not is_valid_object_id(id):
        raise ValueError(f"Invalid therapist ID: {id}")
    
    collection = await get_therapist_collection()
    result = await collection.delete_one({"_id": ObjectId(id)})
    return result.deleted_count > 0
