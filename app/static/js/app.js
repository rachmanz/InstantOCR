/* ============================================================
   OCR Vision - SaaS Landing Page Interactive Engine
   Stack: GSAP, ScrollTrigger, Native Vanilla JS
============================================================ */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // Register GSAP Plugin
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* =====================================================
     1. SELECTORS & GLOBALS
  ===================================================== */
  const navbar = document.querySelector(".navbar");
  const mobileBtn = document.querySelector(".mobile-menu");
  const mobileNav = document.querySelector(".mobile-nav");
  const navLinks = document.querySelectorAll("a[href^='#']");

  const uploadArea = document.getElementById("uploadArea") || document.querySelector(".upload-area");
  const fileInput = document.getElementById("imageInput");
  const previewImage = document.getElementById("previewImage");
  const uploadPlaceholder = document.getElementById("uploadPlaceholder") || document.querySelector(".upload-placeholder");
  const fileInfo = document.getElementById("fileInfo");
  const fileName = document.getElementById("fileName");
  const fileSize = document.getElementById("fileSize");
  const removeFileBtn = document.getElementById("removeFileBtn"); // Tombol X

  const progressWrapper = document.getElementById("progressWrapper");
  const progressFill = document.getElementById("progressFill");
  const progressText = document.getElementById("progressText");
  const convertBtn = document.getElementById("convertBtn") || document.querySelector(".convert-btn");

  let currentBlobUrl = null; // Ref objek preview untuk mencegah memory-leak

  /* =====================================================
     2. NAVBAR & MOBILE NAVIGATION
  ===================================================== */
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      navbar?.classList.add("navbar-scroll");
    } else {
      navbar?.classList.remove("navbar-scroll");
    }
  });

  if (mobileBtn && mobileNav) {
    mobileBtn.addEventListener("click", () => {
      mobileNav.classList.toggle("active");
      const icon = mobileBtn.querySelector("i");
      if (icon) {
        icon.classList.toggle("ri-menu-4-line");
        icon.classList.toggle("ri-close-line");
      }
    });
  }

  // Smooth Scroll & Auto Close Mobile Nav
  navLinks.forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetID = this.getAttribute("href");
      if (targetID && targetID.startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(targetID);

        if (mobileNav?.classList.contains("active")) {
          mobileNav.classList.remove("active");
          const icon = mobileBtn?.querySelector("i");
          if (icon) {
            icon.classList.add("ri-menu-4-line");
            icon.classList.remove("ri-close-line");
          }
        }

        if (target) {
          window.scrollTo({
            top: target.offsetTop - 90,
            behavior: "smooth",
          });
        }
      }
    });
  });

  /* =====================================================
     3. FILE UPLOAD, DRAG-DROP, PREVIEW & REMOVE HANDLER
  ===================================================== */
  if (uploadArea && fileInput) {
    // Click area to upload (Cegah trigger jika yang diklik adalah tombol X)
    uploadArea.addEventListener("click", (e) => {
      if (e.target !== fileInput && !e.target.closest("#removeFileBtn")) {
        fileInput.click();
      }
    });

    // Drag & Drop visual feedback
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

  // Event Listener untuk Tombol Hapus (X)
  if (removeFileBtn) {
    removeFileBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // Mencegah event click tembus ke uploadArea
      resetUploadState();
    });
  }

  function handleFileSelection(file) {
    // Validasi Tipe File (Gambar / PDF)
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      alert("Format file tidak didukung! Harap unggah gambar (JPG, PNG, WEBP) atau PDF.");
      return;
    }

    // Validasi Ukuran File (Maksimal 10MB)
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

    // Jika file gambar, tampilkan preview & sembunyikan placeholder
    if (file.type.startsWith("image/") && previewImage) {
      if (currentBlobUrl) URL.revokeObjectURL(currentBlobUrl);
      currentBlobUrl = URL.createObjectURL(file);
      previewImage.src = currentBlobUrl;
      previewImage.hidden = false;

      // Sembunyikan elemen placeholder tanpa merusak struktur flex
      if (uploadPlaceholder) {
        uploadPlaceholder.hidden = true;
      }
    }

    // Tampilkan tombol Hapus (X)
    if (removeFileBtn) {
      removeFileBtn.hidden = false;
    }

    if (progressFill) progressFill.style.width = "0%";
    if (progressText) progressText.textContent = "0%";
  }

  // Fungsi untuk Mereset Upload Area ke Tampilan Awal
  function resetUploadState() {
    if (fileInput) fileInput.value = "";

    if (currentBlobUrl) {
      URL.revokeObjectURL(currentBlobUrl);
      currentBlobUrl = null;
    }

    if (previewImage) {
      previewImage.src = "";
      previewImage.hidden = true;
    }

    // Kembalikan placeholder ke bentuk asal
    if (uploadPlaceholder) {
      uploadPlaceholder.hidden = false;
      uploadPlaceholder.style.removeProperty("display");
    }

    if (fileInfo) fileInfo.hidden = true;
    if (fileName) fileName.innerText = "";
    if (fileSize) fileSize.innerText = "";

    // Sembunyikan tombol X
    if (removeFileBtn) {
      removeFileBtn.hidden = true;
    }

    if (progressWrapper) progressWrapper.style.display = "none";
    if (progressFill) progressFill.style.width = "0%";
    if (progressText) progressText.textContent = "0%";
  }

  /* =====================================================
     4. FAQ ACCORDION (SMOOTH SLIDE)
  ===================================================== */
  document.querySelectorAll(".faq-item").forEach((item) => {
    const questionBtn = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    if (questionBtn && answer) {
      questionBtn.addEventListener("click", () => {
        const isOpen = item.classList.contains("active");

        // Close all other active accordion items
        document.querySelectorAll(".faq-item").forEach((otherItem) => {
          otherItem.classList.remove("active");
          const otherAnswer = otherItem.querySelector(".faq-answer");
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        });

        // Toggle current item
        if (!isOpen) {
          item.classList.add("active");
          answer.style.maxHeight = answer.scrollHeight + "px";
        }
      });
    }
  });

  /* =====================================================
     5. COUNTER ANIMATION (STATS)
  ===================================================== */
  if (typeof ScrollTrigger !== "undefined") {
    document.querySelectorAll(".counter").forEach((counter) => {
      const target = Number(counter.dataset.target) || 0;

      ScrollTrigger.create({
        trigger: counter,
        once: true,
        start: "top 85%",
        onEnter: () => {
          let current = 0;
          const duration = 2000; // 2 Detik
          const stepTime = 20;
          const steps = duration / stepTime;
          const increment = target / steps;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }

            if (target >= 1000000) {
              counter.innerText = (current / 1000000).toFixed(1) + "M+";
            } else {
              counter.innerText = Math.floor(current).toLocaleString("id-ID") + "+";
            }
          }, stepTime);
        },
      });
    });
  }

  /* =====================================================
     6. GSAP ANIMATIONS (HERO, BLOBS & SCROLL)
  ===================================================== */
  if (typeof gsap !== "undefined") {
    // Hero Section Timeline
    const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

    heroTl
      .from(".badge", { y: 30, opacity: 0, duration: 0.6 })
      .from(".hero-title", { y: 40, opacity: 0, duration: 0.8 }, "-=0.4")
      .from(".hero-description", { y: 25, opacity: 0, duration: 0.6 }, "-=0.5")
      .from(".hero-buttons", { y: 20, opacity: 0, duration: 0.6 }, "-=0.4")
      .from(".mini-stats", { y: 20, opacity: 0, duration: 0.6 }, "-=0.4")
      .from(".upload-card", { x: 50, opacity: 0, duration: 0.9 }, "-=0.7");

    // Floating Background Blobs Animation
    gsap.to(".blob-one", { x: 40, y: 30, repeat: -1, yoyo: true, duration: 8, ease: "sine.inOut" });
    gsap.to(".blob-two", { x: -40, y: 20, repeat: -1, yoyo: true, duration: 10, ease: "sine.inOut" });
    gsap.to(".blob-three", { y: -35, repeat: -1, yoyo: true, duration: 9, ease: "sine.inOut" });

    // Scroll Reveal for Cards & Headings
    gsap.utils.toArray(".feature-card, .step, .stat-card").forEach((card) => {
      gsap.from(card, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: card, start: "top 88%" },
      });
    });

    gsap.utils.toArray(".section-heading").forEach((heading) => {
      gsap.from(heading, {
        y: 30,
        opacity: 0,
        duration: 0.7,
        scrollTrigger: { trigger: heading, start: "top 88%" },
      });
    });
  }

  /* =====================================================
     7. PROCESS OCR VIA DJANGO API WITH PROGRESS & DOWNLOAD
  ===================================================== */
  if (convertBtn) {
    convertBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      const file = fileInput?.files[0];
      const selectedFormat = document.querySelector('input[name="format"]:checked')?.value || "txt";

      if (!file) {
        alert("Pilih file gambar terlebih dahulu!");
        return;
      }

      // Update Loading State Tombol
      convertBtn.disabled = true;
      const originalBtnText = convertBtn.innerHTML;
      convertBtn.innerHTML = `<i class="ri-loader-4-line ri-spin"></i> Memproses & Mengunduh...`;

      // Tampilkan Progress Bar
      if (progressWrapper) progressWrapper.style.display = "block";
      if (progressFill) progressFill.style.width = "0%";
      if (progressText) progressText.textContent = "0%";

      // Simulasi pergerakan Progress Bar saat proses OCR di backend berlangsung
      let progress = 0;
      const progressInterval = setInterval(() => {
        if (progress < 88) {
          progress += Math.floor(Math.random() * 7) + 3;
          if (progressFill) progressFill.style.width = `${progress}%`;
          if (progressText) progressText.textContent = `${progress}%`;
        }
      }, 180);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("format", selectedFormat);

      try {
        const response = await fetch("/api/process-ocr/", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Gagal memproses file di server.");
        }

        // Selesaikan Progress ke 100%
        clearInterval(progressInterval);
        if (progressFill) progressFill.style.width = "100%";
        if (progressText) progressText.textContent = "100%";

        // 1. Ambil data response sebagai Blob (File Binary)
        const blob = await response.blob();

        // 2. Buat URL sementara di browser untuk mengunduh
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = `hasil_ocr.${selectedFormat}`;
        document.body.appendChild(a);

        // 3. Trigger download otomatis
        a.click();

        // Cleanup
        a.remove();
        window.URL.revokeObjectURL(downloadUrl);
      } catch (error) {
        clearInterval(progressInterval);
        console.error("Download error:", error);
        alert("Terjadi kesalahan saat memproses atau mengunduh file.");
      } finally {
        // Reset State UI setelah selesai
        setTimeout(() => {
          convertBtn.disabled = false;
          convertBtn.innerHTML = originalBtnText;
          if (progressWrapper) progressWrapper.style.display = "none";
          if (progressFill) progressFill.style.width = "0%";
        }, 1200);
      }
    });
  }
});
