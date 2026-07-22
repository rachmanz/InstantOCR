from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from .models import UploadedImage
from django.views.decorators.csrf import csrf_exempt 
from converter.utils import extract_text_from_image
from converter.helpers import generate_docx, generate_pdf, generate_txt

# Upload file status 
def upload_image(request):
    if request.method == 'POST':
        img = request.FILES['image']
        obj = UploadedImage.objects.create(image=img)
        return JsonResponse({"status": "success", "id": obj.id})
    return render(request, 'upload.html')

# Index View Request 
def index(request):
    """Menampilkan halaman HTML utama"""
    return render(request, 'upload.html')

# OCR Process
@csrf_exempt
def process_ocr(request):
    """API Endpoint untuk memproses OCR & menghasilkan file download"""
    if request.method == 'POST' and request.FILES.get('file'):
        uploaded_file = request.FILES['file']
        output_format = request.POST.get('format', 'txt').lower()

        # Ekstrak teks
        extracted_text = extract_text_from_image(uploaded_file)

        if not extracted_text:
            return JsonResponse({'success': False, 'message': 'Gagal membaca teks dari gambar.'}, status=400)

        # Hasilkan file berdasarkan format yang dipilih
        if output_format == 'docx':
            file_buffer = generate_docx(extracted_text)
            content_type = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            filename = 'hasil_ocr.docx'
        elif output_format == 'pdf':
            file_buffer = generate_pdf(extracted_text)
            content_type = 'application/pdf'
            filename = 'hasil_ocr.pdf'
        else: # Default TXT
            file_buffer = generate_txt(extracted_text)
            content_type = 'text/plain'
            filename = 'hasil_ocr.txt'

        # Kirim sebagai File Response langsung untuk diunduh
        response = HttpResponse(file_buffer.getvalue(), content_type=content_type)
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        response['Access-Control-Expose-Headers'] = 'Content-Disposition'
        return response

    return JsonResponse({'success': False, 'message': 'File tidak ditemukan atau metode salah.'}, status=400)