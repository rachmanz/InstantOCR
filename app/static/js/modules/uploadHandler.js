let currentBlobUrl = null;

export function initUploadHandler() {
  const uploadArea = document.getElementById("uploadArea") || document.querySelector(".upload-area");
  const fileInput = document.getElementById("imageInput");
  const removeFileBtn = document.getElementById("removeFileBtn");

  if (uploadArea && fileInput) {
    uploadArea.addEventListener("click", (e) => {
      if (e.target !== fileInput && !e.target.closest("#removeFileBtn")) {
        fileInput.click();
      }
    });

    ["dragenter", "dragover"].forEach((eventName) => {
      uploadArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.add("drag-active", "drag");
      });
    });

    ["dragleave", "drop"].forEach((eventName) => {
      uploadArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.remove("drag-active", "drag");
      });
    });

    uploadArea.addEventListener("drop", (e) => {
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        fileInput.files = files;
        handleFileSelection(files[0]);
      }
    });

    fileInput.addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        handleFileSelection(e.target.files[0]);
      }
    });
  }

  if (removeFileBtn) {
    removeFileBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      resetUploadState();
    });
  }
}

function handleFileSelection(file) {
  const previewImage = document.getElementById("previewImage");
  const uploadPlaceholder = document.getElementById("uploadPlaceholder") || document.querySelector(".upload-placeholder");
  const fileInfo = document.getElementById("fileInfo");
  const fileName = document.getElementById("fileName");
  const fileSize = document.getElementById("fileSize");
  const removeFileBtn = document.getElementById("removeFileBtn");
  const progressFill = document.getElementById("progressFill");
  const progressText = document.getElementById("progressText");

  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg", "application/pdf"];
  if (!validTypes.includes(file.type)) {
    alert("Format file tidak didukung! Harap unggah gambar (JPG, PNG, WEBP) atau PDF.");
    return;
  }

  const maxSizeMB = 10;
  if (file.size > maxSizeMB * 1024 * 1024) {
    alert(`Ukuran file terlalu besar! Maksimal ${maxSizeMB}MB.`);
    return;
  }

  const calculatedSize = (file.size / (1024 * 1024)).toFixed(2) + " MB";

  if (fileName) fileName.innerText = file.name;
  if (fileSize) fileSize.innerText = calculatedSize;

  if (fileInfo) {
    fileInfo.textContent = `${file.name} (${calculatedSize})`;
    fileInfo.hidden = false;
  }

  if (file.type.startsWith("image/") && previewImage) {
    if (currentBlobUrl) URL.revokeObjectURL(currentBlobUrl);
    currentBlobUrl = URL.createObjectURL(file);
    previewImage.src = currentBlobUrl;
    previewImage.hidden = false;

    if (uploadPlaceholder) {
      uploadPlaceholder.hidden = true;
    }
  }

  if (removeFileBtn) removeFileBtn.hidden = false;
  if (progressFill) progressFill.style.width = "0%";
  if (progressText) progressText.textContent = "0%";
}

export function resetUploadState() {
  const fileInput = document.getElementById("imageInput");
  const previewImage = document.getElementById("previewImage");
  const uploadPlaceholder = document.getElementById("uploadPlaceholder") || document.querySelector(".upload-placeholder");
  const fileInfo = document.getElementById("fileInfo");
  const fileName = document.getElementById("fileName");
  const fileSize = document.getElementById("fileSize");
  const removeFileBtn = document.getElementById("removeFileBtn");
  const progressWrapper = document.getElementById("progressWrapper");
  const progressFill = document.getElementById("progressFill");
  const progressText = document.getElementById("progressText");

  if (fileInput) fileInput.value = "";

  if (currentBlobUrl) {
    URL.revokeObjectURL(currentBlobUrl);
    currentBlobUrl = null;
  }

  if (previewImage) {
    previewImage.src = "";
    previewImage.hidden = true;
  }

  if (uploadPlaceholder) {
    uploadPlaceholder.hidden = false;
    uploadPlaceholder.style.removeProperty("display");
  }

  if (fileInfo) fileInfo.hidden = true;
  if (fileName) fileName.innerText = "";
  if (fileSize) fileSize.innerText = "";

  if (removeFileBtn) removeFileBtn.hidden = true;
  if (progressWrapper) progressWrapper.style.display = "none";
  if (progressFill) progressFill.style.width = "0%";
  if (progressText) progressText.textContent = "0%";
}
