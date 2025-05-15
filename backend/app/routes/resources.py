from fastapi import APIRouter, HTTPException, Query, Depends
from typing import Optional, List
from app.models.resource import (
    Resource,
    ResourceCreate,
    create_resource,
    get_resources,
    get_resource,
    update_resource,
    delete_resource,
    get_resource_categories
)
from .auth import get_current_user

router = APIRouter(
    prefix="/api/resources",
    tags=["Resources"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=Resource)
async def create_new_resource(
    resource: ResourceCreate,
    current_user: dict = Depends(get_current_user)
):
    try:
        created_resource = await create_resource(resource)
        if created_resource:
            return created_resource
        raise HTTPException(status_code=400, detail="Resource creation failed")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[Resource])
async def read_resources(
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    limit: int = Query(100, ge=1, le=1000),
    skip: int = Query(0, ge=0)
):
    try:
        return await get_resources(search, category, limit, skip)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/categories")
async def read_resource_categories():
    try:
        return {"categories": await get_resource_categories()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{resource_id}", response_model=Resource)
async def read_resource(resource_id: str):
    resource = await get_resource(resource_id)
    if resource:
        return resource
    raise HTTPException(status_code=404, detail="Resource not found")

@router.put("/{resource_id}", response_model=Resource)
async def update_existing_resource(
    resource_id: str, 
    resource: ResourceCreate,
    current_user: dict = Depends(get_current_user)
):
    updated_resource = await update_resource(resource_id, resource)
    if updated_resource:
        return updated_resource
    raise HTTPException(status_code=404, detail="Resource not found")

@router.delete("/{resource_id}")
async def remove_resource(
    resource_id: str,
    current_user: dict = Depends(get_current_user)
):
    success = await delete_resource(resource_id)
    if success:
        return {"message": "Resource deleted successfully"}
    raise HTTPException(status_code=404, detail="Resource not found")