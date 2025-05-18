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
        self.response_generator = None
        self.nlp_model = None
        self.ready = False
        self.db_initialized = False

app_state = AppState()

# Models
class ChatRequest(BaseModel):
    text: str
    user_id: Optional[str] = "default"
    context: Optional[dict] = None

# Lifespan event
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database
    try:
        from app.database import init_db
        await init_db()
        app_state.db_initialized = True
        logger.info("✅ Database initialized successfully")
    except Exception as e:
        logger.critical(f"🚨 Database initialization failed: {e}")
        raise

    # Initialize NLP components
    try:
        logger.info("🔄 Initializing NLP components...")
        
        # Initialize ChatModel
        from app.models.chat_model import ChatModel
        loop = asyncio.get_running_loop()
        app_state.chat_model = await loop.run_in_executor(None, ChatModel)
        
        if not app_state.chat_model.model_loaded:
            raise RuntimeError("ChatModel failed to initialize")
        
        # Initialize NLP model
        from app.models.nlp_model import NLPModel
        app_state.nlp_model = NLPModel()
        
        # Initialize response generator
        from app.utils.response_generator import AIResponseGenerator
        from app.utils.intent_manager import IntentManager
        
        intent_manager = IntentManager()
        app_state.response_generator = AIResponseGenerator(intent_manager)
        
        logger.info("✅ NLP components initialized successfully")
    except Exception as e:
        logger.critical(f"🚨 Failed to initialize NLP components: {e}")
        raise

    app_state.ready = True
    logger.info("🚀 Application startup complete")
    yield
    logger.info("🛑 Shutting down application...")
    app_state.ready = False

# App init
app = FastAPI(
    title="Mental Health Chatbot API",
    description="API for AI-powered mental health support",
    version="1.1.0",  # Updated version
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
    from app.routes.mood_tracking import router as mood_router

    app.include_router(mood_router)
    app.include_router(users_router)
    app.include_router(auth_router)
    app.include_router(therapist_router)
    app.include_router(resources_router)
    logger.info("✅ All routers included successfully")
except ImportError as e:
    logger.critical(f"🚨 Failed to import routers: {e}")
    raise

# Health check endpoint
@app.get("/api/health", tags=["System"])
async def health_check():
    return {
        "status": "healthy" if app_state.ready else "initializing",
        "components": {
            "database": "connected" if app_state.db_initialized else "disconnected",
            "chat_model": "loaded" if app_state.chat_model and app_state.chat_model.model_loaded else "unavailable",
            "nlp_model": "loaded" if app_state.nlp_model else "unavailable",
            "response_generator": "loaded" if app_state.response_generator else "unavailable"
        },
        "version": "1.1.0"
    }

# Chat endpoint - combined functionality
@app.post("/api/chat", tags=["Chat"])
async def handle_chat(request: ChatRequest):
    if not app_state.ready:
        raise HTTPException(status_code=503, detail="Service initializing")

    try:
        logger.info(f"💬 Incoming message from {request.user_id}: {request.text}")
        
        # Option 1: Use ChatModel if available
        if app_state.chat_model and app_state.chat_model.model_loaded:
            bot_response = await app_state.chat_model.get_response(
                request.text.strip(),
                request.user_id
            )
            return {"message": bot_response, "status": "success"}
        
        # Option 2: Fallback to NLP pipeline if ChatModel not available
        if app_state.nlp_model and app_state.response_generator:
            intent = app_state.nlp_model.predict(request.text)
            response = app_state.response_generator.generate_response(
                message=request.text,
                intent=intent
            )
            return {
                "response": response,
                "intent": intent,
                "context": app_state.response_generator.get_conversation_summary(),
                "status": "success"
            }
        
        raise HTTPException(status_code=503, detail="No chat processing available")
        
    except Exception as e:
        logger.error(f"💥 Chat processing error: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail="Error processing your message. Please try again."
        )

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

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"🔥 Unhandled error: {traceback.format_exc()}")
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred"},
    )

@app.middleware("http")
async def catch_unhandled_exceptions(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception:
        logger.error(f"🔥 Unhandled error in middleware:\n{traceback.format_exc()}")
        return JSONResponse(
            status_code=500,
            content={"detail": "An unexpected error occurred. Please try again later."},
        )