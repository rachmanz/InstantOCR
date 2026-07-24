import easyocr
import logging

# Logging
logger = logging.getLogger(__name__)

# Load Model EasyOCR sekali saja di memori (biar cepat & hemat RAM)
# 'id' untuk Bahasa Indonesia, 'en' untuk Bahasa Inggris
reader = easyocr.Reader(['id', 'en'], gpu=False) 

async def process_easyocr(file_path: str) -> str:
    """
    Memproses file gambar lokal menggunakan EasyOCR.
    Returns: string hasil ekstraksi teks.
    """
    try:
        # EasyOCR membaca gambar dari file_path
        results = reader.readtext(file_path, detail=0)
        
        # Gabungkan baris-baris teks menjadi satu string utuh dengan newline
        extracted_text = "\n".join(results)
        return extracted_text

    except Exception as e:
        logger.error(f"Error pada EasyOCR processing: {str(e)}")
        raise e