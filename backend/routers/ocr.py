import os
import uuid
import logging
import aiofiles
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from sqlalchemy.orm import Session

# API Config & Services
from backend.config import settings
from backend.database import get_db
from backend.models import OCRDocument
from backend.services.hf_service import query_huggingface_ocr
from backend.services.ocr_service import process_easyocr

# Log 
logger = logging.getLogger(__name__)

# Router 
router = APIRouter(prefix="/api/v1/ocr", tags=["OCR Engine"])

# Mengarahkan tepat ke folder app/project/uploads sesuai struktur proyekmu
BASE_DIR = Path(__file__).resolve().parent.parent.parent  # Root folder project
UPLOAD_DIR = BASE_DIR / "app" / "project" / "uploads" # Location upload directory => ubah ke S3 bisa nanti

# Buat folder uploads otomatis jika belum ada di dalam app/project/
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Extension yang diperbolehkan masuk
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


@router.post("/process")
async def process_ocr_image(
    file: UploadFile = File(...),
    format: str = Form("txt"),
    db: Session = Depends(get_db)
):
    # Simpan File Gambar Fisik ke app/project/uploads/
    file_ext = os.path.splitext(file.filename)[1].lower()
    unique_filename = f"{uuid.uuid4().hex}{file_ext}"
    
    # Path absolut untuk proses simpan file oleh aiofiles
    full_file_path = str(UPLOAD_DIR / unique_filename)
    
    # Relative path yang disimpan ke DB untuk dibaca oleh Django/Frontend
    relative_path = f"uploads/{unique_filename}"

    # Baca file bytes
    file_bytes = await file.read()
    
    # Tulis file secara fisik ke disk
    async with aiofiles.open(full_file_path, "wb") as out_file:
        await out_file.write(file_bytes)

    extracted_text = ""
    engine_used = "huggingface"

    # Hit Hugging Face Inference API (Fallback ke EasyOCR jika gagal)
    try:
        hf_response = await query_huggingface_ocr(file_bytes)

        if isinstance(hf_response, dict) and "error" in hf_response:
            raise Exception(f"Hugging Face API Error: {hf_response.get('error')}")

        if isinstance(hf_response, list) and len(hf_response) > 0:
            extracted_text = hf_response[0].get("generated_text", "")
        elif isinstance(hf_response, dict):
            extracted_text = hf_response.get("text", str(hf_response))

    except Exception as e:
        logger.warning(f"Hugging Face API gagal ({str(e)}). Mengalihkan ke EasyOCR lokal...")
        engine_used = "easyocr_fallback"

        try:
            # Gunakan full_file_path gambar yang baru disimpan untuk EasyOCR
            extracted_text = await process_easyocr(full_file_path)
        except Exception as ocr_err:
            logger.error(f"EasyOCR Lokal juga gagal: {str(ocr_err)}")
            raise HTTPException(
                status_code=500, 
                detail="Gagal memproses OCR dari semua engine."
            )

    # Simpan Rekam Data ke Database
    db_record = OCRDocument(
        filename=file.filename,
        file_path=relative_path,
        extracted_text=extracted_text,
        export_format=format
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)

    # Kembalikan Response JSON
    return {
        "status": "success",
        "id": db_record.id,
        "filename": file.filename,
        "engine_used": engine_used,
        "format": format,
        "text": extracted_text,
        "file_url": f"/{relative_path}"
    }