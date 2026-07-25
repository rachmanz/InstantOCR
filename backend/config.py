import os
from pathlib import Path
from pydantic_settings import BaseSettings

# Parent Folder
ROOT_DIR = Path(__file__).resolve().parent.parent

# Data Validation and Settings
class Settings(BaseSettings):
    PROJECT_NAME: str = "InstantOCR Engine" # Project Name
    HF_API_TOKEN: str = os.getenv("HF_API_TOKEN", "") # API Key
    HF_MODEL_URL: str = os.getenv("HF_MODEL", "") # Model 
    UPLOAD_DIR: str = "../app/project/uploads" #  Stored Temp Database (for file uploaded)

    # Config file
    class Config:
        env_file = str(ROOT_DIR / ".env")
        env_file_encoding = "utf-8"

# Object of Settings Imported
settings = Settings()