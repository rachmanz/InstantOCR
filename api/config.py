import os
from pydantic_settings import BaseSettings

# Data Validation and Settings
class Settings(BaseSettings):
    PROJECT_NAME: str = "InstantOCR Engine"
    HF_API_TOKEN: str = os.getenv("HF_API_TOKEN", "")
    HF_MODEL_URL: str = "https://api-inference.huggingface.co/models/microsoft/trocr-base-printed"
    UPLOAD_DIR: str = "../app/project/uploads" #  Stored Temp Database (for file uploaded)

    # Config file
    class Config:
        env_file = ".env"

# Object of Settings Imported
settings = Settings()