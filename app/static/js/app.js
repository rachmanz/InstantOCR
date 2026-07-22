/* ============================================================
   OCR Vision - SaaS Landing Page Interactive Engine
   Stack: GSAP, ScrollTrigger, Native Vanilla JS
============================================================ */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // Register GSAP Plugin
  gsap.registerPlugin(ScrollTrigger);

  /* =====================================================
     1. SELECTORS & GLOBALS
  ===================================================== */
  const navbar = document.querySelector(".navbar");
  const mobileBtn = document.querySelector(".mobile-menu");
  const mobileNav = document.querySelector(".mobile-nav");
  const navLinks = document.querySelectorAll("a[href^='#']");

  const uploadArea = document.querySelector(".upload-area");
  const fileInput = document.getElementById("imageInput");
  const previewImage = document.getElementById("previewImage");
  const placeholder = document.querySelector(".upload-placeholder");
  const fileInfo = document.getElementById("fileInfo");
  const fileName = document.getElementById("fileName");
  const fileSize = document.getElementById("fileSize");
  const progressFill = document.getElementById("progressFill");
  const convertBtn = document.querySelector(".convert-btn");

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
     3. FILE UPLOAD, DRAG-DROP & PREVIEW HANDLER
  ===================================================== */
  if (uploadArea && fileInput) {
    // Click to upload
    uploadArea.addEventListener("click", (e) => {
      if (e.target !== fileInput) {
        fileInput.click();
      }
    });

    // Drag & Drop visual feedback
    ["dragenter", "dragover"].forEach((eventName) => {
      uploadArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.add("drag-active");
      });
    });

    ["dragleave", "drop"].forEach((eventName) => {
      uploadArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.remove("drag-active");
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

  function handleFileSelection(file) {
    // Validasi Tipe File (Gambar / PDF)
    const validTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
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

    // Update File Meta Info
    if (fileName) fileName.innerText = file.name;
    if (fileSize) fileSize.innerText = (file.size / (1024 * 1024)).toFixed(2) + " MB";

    // Preview Image Handling
    if (file.type.startsWith("image/") && previewImage) {
      previewImage.src = URL.createObjectURL(file);
      previewImage.hidden = false;
      if (placeholder) placeholder.hidden = true;
    }

    if (fileInfo) fileInfo.hidden = false;

    // Simulate Fake Progress Bar
    simulateUploadProgress();
  }

  function simulateUploadProgress() {
    if (!progressFill) return;
    let width = 0;
    progressFill.style.width = "0%";
    const interval = setInterval(() => {
      width += 5;
      progressFill.style.width = width + "%";
      if (width >= 100) {
        clearInterval(interval);
      }
    }, 20);
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
  document.querySelectorAll(".counter").forEach((counter) => {
    const target = Number(counter.dataset.target) || 0;

    ScrollTrigger.create({
      trigger: counter,
      once: true,
      start: "top 85%",
      onEnter: () => {
        let current = 0;
        const duration = 2000; // 2 Seconds
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

  /* =====================================================
     6. GSAP ANIMATIONS (HERO, BLOBS & SCROLL)
  ===================================================== */
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
  gsap.to(".blob-one", {
    x: 40,
    y: 30,
    repeat: -1,
    yoyo: true,
    duration: 8,
    ease: "sine.inOut",
  });

  gsap.to(".blob-two", {
    x: -40,
    y: 20,
    repeat: -1,
    yoyo: true,
    duration: 10,
    ease: "sine.inOut",
  });

  gsap.to(".blob-three", {
    y: -35,
    repeat: -1,
    yoyo: true,
    duration: 9,
    ease: "sine.inOut",
  });

  // Scroll Reveal for Cards & Headings
  gsap.utils.toArray(".feature-card, .step, .stat-card").forEach((card) => {
    gsap.from(card, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: card,
        start: "top 88%",
      },
    });
  });

  gsap.utils.toArray(".section-heading").forEach((heading) => {
    gsap.from(heading, {
      y: 30,
      opacity: 0,
      duration: 0.7,
      scrollTrigger: {
        trigger: heading,
        start: "top 88%",
      },
    });
  });
});
