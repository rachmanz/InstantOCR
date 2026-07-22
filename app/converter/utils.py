import easyocr
import numpy as np
from PIL import Image

# Inisalisasi Reader EasyOCR
reader = easyocr.Reader(['en', 'id'], gpu=False)

def extract_text_from_image(image_file):
    try:
        # Buka file yang diupload
        img = Image.open(image_file)

        # Ketika warna RGB / Transparan / Grey
        if img.mode != 'RGB':
            img = img.convert('RGB')
            
        # Ubah file gambar -> np.array (agar bisa terlihat polanya oleh komputer)
        img_np = np.array(img)
        # Machine dari reader EasyOCR digunakan untuk membaca gambar yang sudah dalam bentuk np.array
        results = reader.readtext(img_np, detail=0)
        # Semua hasil dari text yang di extract akan digabungkan perbaris
        extracted_text = "\n".join(results)
        # Kalau ini sih rapihin aja ya, buat hilangin spasi yang berlebih
        return extracted_text.strip()

    # Jika Error akan mengeluarkan error ini
    except Exception as e:
        print(f"Error Easy OCR: {e}")
        return None
