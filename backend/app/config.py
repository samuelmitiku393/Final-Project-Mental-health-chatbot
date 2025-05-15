import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from a .env file

class Settings:
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    SECRET_KEY = os.getenv("SECRET_KEY", "supersecret")

settings = Settings()
