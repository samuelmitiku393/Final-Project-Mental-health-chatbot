from fastapi import APIRouter, HTTPException
from app.models.chat_model import ChatModel
from pydantic import BaseModel

router = APIRouter()
chat_model = ChatModel()

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        response = chat_model.get_response(request.message)
        return {"response": response}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing message: {str(e)}"
        )