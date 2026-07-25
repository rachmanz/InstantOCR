import httpx
from backend.config import settings

async def query_huggingface_ocr(file_bytes: bytes) -> dict:
    """Mengirim byte gambar langsung ke Hugging Face Inference API."""
    headers = {
        "Authorization": f"Bearer {settings.HF_API_TOKEN}",
        "Content-Type": "application/octet-stream"
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            settings.HF_MODEL_URL,
            headers=headers,
            content=file_bytes
        )

    if response.status_code != 200:
        return {"error": f"HF API Error: {response.status_code}", "detail": response.text}

    return response.json()
