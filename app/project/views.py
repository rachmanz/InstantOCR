from django.shortcuts import render

# Index View Request 
def index(request):
    """Menampilkan halaman HTML utama"""
    return render(request, 'index.html')