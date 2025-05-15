import os
import logging
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ServerSelectionTimeoutError, ConnectionFailure

logger = logging.getLogger(__name__)

# Load from environment or fallback to defaults
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "mental_health_db")


class Database:
    _instance = None

    def __init__(self):
        if Database._instance is not None:
            raise Exception("This class is a singleton!")
        self.client = None
        self.db = None
        Database._instance = self

    @classmethod
    async def get_instance(cls):
        if cls._instance is None:
            cls._instance = Database()
            await cls._instance.connect()
        return cls._instance

    async def connect(self):
        try:
            logger.info("🔌 Connecting to MongoDB...")
            self.client = AsyncIOMotorClient(
                MONGO_URI,
                serverSelectionTimeoutMS=5000
            )
            # Trigger a real connection check
            await self.client.admin.command("ping")
            self.db = self.client[DB_NAME]
            logger.info("✅ MongoDB connection established")
        except (ServerSelectionTimeoutError, ConnectionFailure) as e:
            logger.critical(f"❌ MongoDB connection failed: {e}")
            raise

    async def close(self):
        if self.client:
            self.client.close()
            logger.info("🔌 MongoDB connection closed")

    def get_collection(self, name: str):
        return self.db[name]

    # Specific collection getters
    def get_users_collection(self):
        return self.get_collection("users")

    def get_messages_collection(self):
        return self.get_collection("messages")

    def get_therapists_collection(self):
        return self.get_collection("therapists")

    def get_resources_collection(self):
        return self.get_collection("resources")


async def init_db():
    """Initialize the database connection and indexes"""
    try:
        db = await Database.get_instance()
        
        # Create indexes for all collections
        await db.get_users_collection().create_index("email", unique=True)
        await db.get_messages_collection().create_index("user_id")
        await db.get_therapists_collection().create_index("specialization")
        
        # Create indexes for resources
        await db.get_resources_collection().create_index([("title", "text"), ("description", "text")])
        await db.get_resources_collection().create_index("category")
        
        logger.info("✅ Database initialized successfully with indexes")
        return True
    except Exception as e:
        logger.critical(f"❌ Database initialization failed: {e}")
        raise

# Add this method to your Database class
def get_mood_collection(self):
    return self.get_collection("mood_entries")
async def check_db_connection():
    """Check if database is responsive"""
    try:
        instance = await Database.get_instance()
        await instance.client.admin.command("ping")
        logger.info("✅ Database connection verified")
        return True
    except Exception as e:
        logger.error(f"❌ Database connection check failed: {e}")
        raise

async def get_db():
    db_instance = await Database.get_instance()
    return db_instance.get_users_collection()    