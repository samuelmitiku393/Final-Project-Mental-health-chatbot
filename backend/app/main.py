from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.gzip import GZipMiddleware
from pydantic import BaseModel
from typing import Optional
import logging
import traceback
import asyncio
from contextlib import asynccontextmanager

# Logging config
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

# App state
class AppState:
    def __init__(self):
        self.chat_model = None
        self.ready = False

app_state = AppState()

# Lifespan event
@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        from app.database import init_db
        await init_db()
    except Exception as e:
        logger.critical(f"🚨 Database initialization failed: {e}")
        raise

    try:
        logger.info("🔄 Initializing ChatModel...")
        from app.models.chat_model import ChatModel

        loop = asyncio.get_running_loop()
        chat_model_instance = await loop.run_in_executor(None, ChatModel)

        if not chat_model_instance.model_loaded:
            raise RuntimeError("ChatModel failed to initialize")

        app_state.chat_model = chat_model_instance
        logger.info("✅ ChatModel initialized successfully")
    except Exception as e:
        logger.critical(f"🚨 Failed to initialize ChatModel: {e}")
        app_state.chat_model = None

    app_state.ready = True
    logger.info("🚀 Application startup complete")
    yield
    logger.info("🛑 Shutting down application...")
    app_state.ready = False

# App init
app = FastAPI(
    title="Mental Health Chatbot API",
    description="API for AI-powered mental health support",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan
)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Routers
try:
    from app.routes.auth import router as auth_router
    from app.routes.therapist_routes import router as therapist_router
    from app.routes.resources import router as resources_router
    from app.routes.users import router as users_router
   # Add this import near your other router imports
    from app.routes.mood_tracking import router as mood_router

# Add this with your other router includes
    app.include_router(mood_router)
    app.include_router(users_router)
    app.include_router(auth_router)
    app.include_router(therapist_router)
    app.include_router(resources_router)
    logger.info("✅ All routers included successfully")
except ImportError as e:
    logger.critical(f"🚨 Failed to import routers: {e}")
    raise

# Chat request model
class ChatRequest(BaseModel):
    text: str
    user_id: Optional[str] = "default"

# Routes
@app.get("/api/health", tags=["System"])
async def health_check():
    return {
        "status": "healthy",
        "model_status": "active" if app_state.ready and app_state.chat_model and app_state.chat_model.model_loaded else "inactive",
        "version": "1.0.0"
    }

@app.post("/api/chat", tags=["Chat"])
async def handle_chat_message(request: ChatRequest):
    # Check if the service is ready
    if not app_state.ready or not app_state.chat_model:
        logger.warning("🔒 HTTP 503: Service initializing")
        raise HTTPException(status_code=503, detail="Service initializing")

    try:
        logger.info(f"💬 Incoming message: {request.text} from user: {request.user_id}")
        
        # Attempt to get a response from the chat model
        bot_response = await app_state.chat_model.get_response(
            request.text.strip(),
            request.user_id
        )
        logger.info(f"💬 Chat response: {bot_response}")
        return {"message": bot_response, "status": "success"}

    except Exception as e:
        # Detailed logging for any errors during chat processing
        logger.error(f"💬 Error processing chat message: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail="Error processing your message")

# Error handlers
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.warning(f"⚠️ Validation error: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "body": exc.body},
    )

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    logger.warning(f"🔒 HTTP {exc.status_code}: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

@app.middleware("http")
async def catch_unhandled_exceptions(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception:
        logger.error(f"🔥 Unhandled error:\n{traceback.format_exc()}")
        return JSONResponse(
            status_code=500,
            content={"detail": "An unexpected error occurred. Please try again later."},
        )