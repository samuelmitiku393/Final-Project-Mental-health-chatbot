from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel
from bson import ObjectId
from ..database import Database, get_db
from .auth import get_current_user

router = APIRouter(
    prefix="/api/mood",
    tags=["Mood Tracking"],
    responses={404: {"description": "Not found"}},
)

# Models
class MoodEntry(BaseModel):
    value: int  # 1-5 scale
    notes: Optional[str] = None
    timestamp: Optional[datetime] = None

class MoodStats(BaseModel):
    average: float
    highest: int
    lowest: int
    count: int
    trend: str  # "improving", "declining", "stable"

class MoodChartData(BaseModel):
    labels: List[str]
    values: List[int]

# Helper functions
async def get_mood_collection():
    db = await Database.get_instance()
    return db.get_collection("mood_entries")

async def validate_mood_value(value: int):
    if value < 1 or value > 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mood value must be between 1 and 5"
        )

# Routes
@router.post("/log", status_code=status.HTTP_201_CREATED)
async def log_mood(
    entry: MoodEntry,
    user_id: str = Depends(get_current_user),
    db=Depends(get_db)
):
    await validate_mood_value(entry.value)
    
    mood_collection = await get_mood_collection()
    entry_data = {
        "user_id": user_id,
        "value": entry.value,
        "notes": entry.notes,
        "timestamp": entry.timestamp or datetime.utcnow()
    }
    
    try:
        result = await mood_collection.insert_one(entry_data)
        return {"id": str(result.inserted_id), "status": "success"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to log mood entry"
        )

@router.get("/entries", response_model=List[MoodEntry])
async def get_mood_entries(
    days: Optional[int] = 7,
    user_id: str = Depends(get_current_user),
    db=Depends(get_db)
):
    mood_collection = await get_mood_collection()
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    
    entries = await mood_collection.find({
        "user_id": user_id,
        "timestamp": {"$gte": cutoff_date}
    }).sort("timestamp", -1).to_list(None)
    
    return entries

@router.get("/stats", response_model=MoodStats)
async def get_mood_stats(
    days: Optional[int] = 7,
    user_id: str = Depends(get_current_user),
    db=Depends(get_db)
):
    mood_collection = await get_mood_collection()
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    
    pipeline = [
        {"$match": {
            "user_id": user_id,
            "timestamp": {"$gte": cutoff_date}
        }},
        {"$group": {
            "_id": None,
            "average": {"$avg": "$value"},
            "highest": {"$max": "$value"},
            "lowest": {"$min": "$value"},
            "count": {"$sum": 1}
        }}
    ]
    
    result = await mood_collection.aggregate(pipeline).to_list(1)
    
    if not result:
        return {
            "average": 0,
            "highest": 0,
            "lowest": 0,
            "count": 0,
            "trend": "stable"
        }
    
    stats = result[0]
    
    # Simple trend analysis (compare first and last week if we have enough data)
    trend = "stable"
    if stats["count"] > 7:
        first_week = await mood_collection.aggregate([
            {"$match": {
                "user_id": user_id,
                "timestamp": {"$gte": cutoff_date, "$lt": cutoff_date + timedelta(days=3)}
            }},
            {"$group": {"_id": None, "avg": {"$avg": "$value"}}}
        ]).to_list(1)
        
        last_week = await mood_collection.aggregate([
            {"$match": {
                "user_id": user_id,
                "timestamp": {"$gte": cutoff_date + timedelta(days=4)}
            }},
            {"$group": {"_id": None, "avg": {"$avg": "$value"}}}
        ]).to_list(1)
        
        if first_week and last_week:
            if last_week[0]["avg"] > first_week[0]["avg"] + 0.5:
                trend = "improving"
            elif last_week[0]["avg"] < first_week[0]["avg"] - 0.5:
                trend = "declining"
    
    return {
        "average": round(stats.get("average", 0), 1),
        "highest": stats.get("highest", 0),
        "lowest": stats.get("lowest", 0),
        "count": stats.get("count", 0),
        "trend": trend
    }

@router.get("/chart", response_model=MoodChartData)
async def get_mood_chart_data(
    days: Optional[int] = 7,
    user_id: str = Depends(get_current_user),
    db=Depends(get_db)
):
    mood_collection = await get_mood_collection()
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    
    # Group by day
    pipeline = [
        {"$match": {
            "user_id": user_id,
            "timestamp": {"$gte": cutoff_date}
        }},
        {"$group": {
            "_id": {"$dateToString": {"format": "%Y-%m-%d", "date": "$timestamp"}},
            "average": {"$avg": "$value"},
            "count": {"$sum": 1}
        }},
        {"$sort": {"_id": 1}}
    ]
    
    results = await mood_collection.aggregate(pipeline).to_list(None)
    
    # Fill in missing days with 0 values
    date_range = [cutoff_date + timedelta(days=i) for i in range(days)]
    date_str_range = [d.strftime("%Y-%m-%d") for d in date_range]
    
    data_map = {r["_id"]: round(r["average"]) for r in results}
    
    values = [data_map.get(date, 0) for date in date_str_range]  # Changed None to 0
    
    return {
        "labels": date_str_range,
        "values": values
    }