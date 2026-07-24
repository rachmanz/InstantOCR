/**
 * Utility Alert Component Reusable
 * @param {string} message - Pesan yang ingin ditampilkan
 * @param {'warning' | 'error' | 'success' | 'info'} type - Tipe alert
 * @param {number} duration - Durasi tampil (default 4000ms)
 */
export function showAlert(message, type = "warning", duration = 4000) {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  // Preset Style Kontras Tinggi & Icon Remix Icon
  const alertStyles = {
    warning: {
      bg: "bg-amber-950/90 border-amber-500/40 text-amber-200 shadow-amber-950/20",
      icon: `<i class="ri-error-warning-fill text-xl text-amber-400 shrink-0"></i>`,
    },
    error: {
      bg: "bg-red-950/90 border-red-500/40 text-red-200 shadow-red-950/20",
      icon: `<i class="ri-close-circle-fill text-xl text-red-400 shrink-0"></i>`,
    },
    success: {
      bg: "bg-emerald-950/90 border-emerald-500/40 text-emerald-200 shadow-emerald-950/20",
      icon: `<i class="ri-checkbox-circle-fill text-xl text-emerald-400 shrink-0"></i>`,
    },
    info: {
      bg: "bg-slate-900/90 border-indigo-500/40 text-indigo-200 shadow-indigo-950/20",
      icon: `<i class="ri-information-fill text-xl text-indigo-400 shrink-0"></i>`,
    },
  };

  const style = alertStyles[type] || alertStyles.info;

  // 1. Buat Wrapper Toast
  const toast = document.createElement("div");
  toast.className = `pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl border backdrop-blur-md shadow-xl transition-all duration-300 transform -translate-y-2 opacity-0 ${style.bg}`;

  // 2. Isi HTML dengan Remix Icon & Teks Putih Terang
  toast.innerHTML = `
    <div class="flex items-center gap-3">
      ${style.icon}
      <p class="text-sm font-semibold text-white leading-snug">${message}</p>
    </div>
    <button class="close-btn p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center">
      <i class="ri-close-line text-lg"></i>
    </button>
  `;

  // 3. Masukkan ke Container
  container.appendChild(toast);

  // 4. Animasikan Masuk
  requestAnimationFrame(() => {
    toast.classList.remove("-translate-y-2", "opacity-0");
    toast.classList.add("translate-y-0", "opacity-100");
  });

  // 5. Fungsi Dismiss
  const dismissToast = () => {
    toast.classList.remove("translate-y-0", "opacity-100");
    toast.classList.add("-translate-y-2", "opacity-0");
    setTimeout(() => toast.remove(), 300);
  };

  toast.querySelector(".close-btn").addEventListener("click", dismissToast);

  if (duration > 0) {
    setTimeout(dismissToast, duration);
  }
}
