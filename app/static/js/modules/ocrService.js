export function initOcrService() {
  // Element DOM
  const convertBtn = document.getElementById("convertBtn") || document.querySelector(".convert-btn");
  const fileInput = document.getElementById("imageInput");
  const progressWrapper = document.getElementById("progressWrapper");
  const progressFill = document.getElementById("progressFill");
  const progressText = document.getElementById("progressText");

  // Endpoint FastAPI Backend Engine
  const FASTAPI_URL = "http://127.0.0.1:8001/api/v1/ocr/process";

  if (convertBtn) {
    convertBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      const file = fileInput?.files[0];
      const selectedFormat = document.querySelector('input[name="format"]:checked')?.value || "txt";

      if (!file) {
        alert("Pilih file gambar terlebih dahulu!");
        return;
      }

      // 1. Siapkan Payload FormData
      const formData = new FormData();
      formData.append("file", file);
      formData.append("format", selectedFormat);

      // UI Feedback: Disable button & tampilkan spinner
      convertBtn.disabled = true;
      const originalBtnText = convertBtn.innerHTML;
      convertBtn.innerHTML = `<i class="ri-loader-4-line ri-spin"></i> Memproses & Mengunduh...`;

      if (progressWrapper) progressWrapper.style.display = "block";
      if (progressFill) progressFill.style.width = "0%";
      if (progressText) progressText.textContent = "0%";

      // Simulasi Progress Bar
      let progress = 0;
      const progressInterval = setInterval(() => {
        if (progress < 88) {
          progress += Math.floor(Math.random() * 7) + 3;
          if (progressFill) progressFill.style.width = `${progress}%`;
          if (progressText) progressText.textContent = `${progress}%`;
        }
      }, 180);

      try {
        // 2. Hit ke FastAPI Backend (Bukan Django!)
        const response = await fetch(FASTAPI_URL, {
          method: "POST",
          // Catatan: Header X-CSRFToken tidak diperlukan untuk FastAPI
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || "Gagal memproses file di server FastAPI.");
        }

        // Progress Selesai
        clearInterval(progressInterval);
        if (progressFill) progressFill.style.width = "100%";
        if (progressText) progressText.textContent = "100%";

        // 3. Terima Response JSON dari FastAPI
        const data = await response.json();

        // 4. Trigger Download Otomatis
        // Memakai Blob dari data teks hasil ekstraksi
        const blob = new Blob([data.text || data.extracted_text || ""], { type: "text/plain;charset=utf-8" });
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = `hasil_ocr_${Date.now()}.${selectedFormat}`;
        document.body.appendChild(a);

        a.click();
        a.remove();
        window.URL.revokeObjectURL(downloadUrl);
      } catch (error) {
        clearInterval(progressInterval);
        console.error("Error OCR Service:", error);
        alert(`Terjadi kesalahan: ${error.message}`);
      } finally {
        // Reset UI State
        setTimeout(() => {
          convertBtn.disabled = false;
          convertBtn.innerHTML = originalBtnText;
          if (progressWrapper) progressWrapper.style.display = "none";
          if (progressFill) progressFill.style.width = "0%";
        }, 1200);
      }
    });
  }
}
