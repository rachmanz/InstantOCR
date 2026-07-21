from django.shortcuts import render
from django.http import JsonResponse
from .models import UploadedImage

def upload_image(request):
    if request.method == 'POST':
        img = request.FILES['image']
        obj = UploadedImage.objects.create(image=img)
        return JsonResponse({"status": "success", "id": obj.id})
    return render(request, 'upload.html')
