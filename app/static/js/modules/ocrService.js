export function initOcrService() {
  const convertBtn = document.getElementById("convertBtn") || document.querySelector(".convert-btn");
  const fileInput = document.getElementById("imageInput");
  const progressWrapper = document.getElementById("progressWrapper");
  const progressFill = document.getElementById("progressFill");
  const progressText = document.getElementById("progressText");

  if (convertBtn) {
    convertBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      const file = fileInput?.files[0];
      const selectedFormat = document.querySelector('input[name="format"]:checked')?.value || "txt";

      if (!file) {
        alert("Pilih file gambar terlebih dahulu!");
        return;
      }

      // 1. BUAT FORMDATA DI SINI (Sebelum dipakai fetch!)
      const formData = new FormData();
      formData.append("file", file);
      formData.append("format", selectedFormat);

      // Ambil CSRF Token dari meta tag HTML
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");

      convertBtn.disabled = true;
      const originalBtnText = convertBtn.innerHTML;
      convertBtn.innerHTML = `<i class="ri-loader-4-line ri-spin"></i> Memproses & Mengunduh...`;

      if (progressWrapper) progressWrapper.style.display = "block";
      if (progressFill) progressFill.style.width = "0%";
      if (progressText) progressText.textContent = "0%";

      let progress = 0;
      const progressInterval = setInterval(() => {
        if (progress < 88) {
          progress += Math.floor(Math.random() * 7) + 3;
          if (progressFill) progressFill.style.width = `${progress}%`;
          if (progressText) progressText.textContent = `${progress}%`;
        }
      }, 180);

      try {
        const response = await fetch("/api/process-ocr/", {
          method: "POST",
          headers: {
            "X-CSRFToken": csrfToken, // Penting untuk Django POST request
          },
          body: formData, // <-- formData dipakai di sini
        });

        if (!response.ok) {
          throw new Error("Gagal memproses file di server.");
        }

        clearInterval(progressInterval);
        if (progressFill) progressFill.style.width = "100%";
        if (progressText) progressText.textContent = "100%";

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = `hasil_ocr.${selectedFormat}`;
        document.body.appendChild(a);

        a.click();
        a.remove();
        window.URL.revokeObjectURL(downloadUrl);
      } catch (error) {
        clearInterval(progressInterval);
        console.error("Download error:", error);
        alert("Terjadi kesalahan saat memproses atau mengunduh file.");
      } finally {
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
