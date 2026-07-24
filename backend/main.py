from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routers import ocr
from api.database import engine, Base

# Lakukan pembuatan database secara otomatis ketika tidak ditemukan databasenya
Base.metadata.create_all(bind=engine)

# Description in Swagger UI
app = FastAPI(
    title="Instant-OCR Engine API",
    version="1.0.0",
    description="AI-Powered OCR Service powered by FastAPI & Hugging Face"
)

# Konfigurasi CORS agar Django frontend / Fetch API bisa hit endpoint
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:8000", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Router
app.include_router(ocr.router)

@app.get("/")
def root():
    return {"status": "online", "message": "Instant-OCR API Service Running"}