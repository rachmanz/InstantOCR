/* ============================================================
   INSTANT-OCR - Central JS Engine Pool
============================================================ */

"use strict";

import { initNavbar } from "./modules/navbar.js";
import { initUploadHandler } from "./modules/uploadHandler.js";
import { initFAQ } from "./modules/faq.js";
import { initCounter } from "./modules/counter.js";
import { initAnimations } from "./modules/animations.js";
import { initOcrService } from "./modules/ocrService.js";

document.addEventListener("DOMContentLoaded", () => {
  // Register GSAP Plugin
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Processing Module
  initUploadHandler(); // Jalankan modul upload (preview image & drag-drop)
  initOcrService(); // Jalankan modul OCR (hit ke FastAPI & download)
  initNavbar(); // Navbar init
  initFAQ(); //  FAQ Section
  initCounter(); // Counter Animation
  initAnimations(); // All unit of animation
});
