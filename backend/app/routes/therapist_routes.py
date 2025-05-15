from fastapi import APIRouter, HTTPException
from typing import List
from app.models.therapist_model import TherapistModel, UpdateTherapistModel, TherapistOutModel
from app.crud.therapist_crud import (
    add_therapist, list_therapists, update_therapist, delete_therapist, get_therapist_by_id
)
from bson import ObjectId

def is_valid_object_id(id: str) -> bool:
    try:
        ObjectId(id)
        return True
    except Exception:
        return False


router = APIRouter(prefix="/api/therapists", tags=["Therapists"])

@router.get("/", response_model=List[TherapistOutModel])
async def get_therapists():
    return await list_therapists()

@router.get("/{id}", response_model=TherapistOutModel)
async def get_therapist(id: str):
    if not is_valid_object_id(id):
        raise HTTPException(status_code=400, detail="Invalid therapist ID")
    
    therapist = await get_therapist_by_id(id)
    if not therapist:
        raise HTTPException(status_code=404, detail="Therapist not found")
    return therapist

@router.post("/", response_model=TherapistOutModel)
async def create_therapist(therapist: TherapistModel):
    return await add_therapist(therapist)

@router.put("/{id}", response_model=TherapistOutModel)
async def edit_therapist(id: str, data: UpdateTherapistModel):
    result = await update_therapist(id, data)
    if not result:
        raise HTTPException(status_code=404, detail="Therapist not found")
    return result

@router.delete("/{id}", response_model=dict)
async def remove_therapist(id: str):
    success = await delete_therapist(id)
    if not success:
        raise HTTPException(status_code=404, detail="Therapist not found")
    return {"status": "deleted"}
