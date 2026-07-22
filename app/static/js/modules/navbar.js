export function initNavbar() {
  const navbar = document.querySelector(".navbar");
  const mobileBtn = document.querySelector(".mobile-menu");
  const mobileNav = document.querySelector(".mobile-nav");

  // Sticky Navbar Effect
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      navbar?.classList.add("navbar-scroll");
    } else {
      navbar?.classList.remove("navbar-scroll");
    }
  });

  // Mobile Menu Toggle
  if (mobileBtn && mobileNav) {
    mobileBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isActive = mobileNav.classList.toggle("active");
      const icon = mobileBtn.querySelector("i");
      if (icon) {
        icon.className = isActive ? "ri-close-line" : "ri-menu-4-line";
      }
    });

    // Close Mobile Nav saat klik di luar
    document.addEventListener("click", (e) => {
      if (!mobileNav.contains(e.target) && !mobileBtn.contains(e.target)) {
        if (mobileNav.classList.contains("active")) {
          mobileNav.classList.remove("active");
          const icon = mobileBtn.querySelector("i");
          if (icon) icon.className = "ri-menu-4-line";
        }
      }
    });
  }

  // Smooth Scroll
  const allNavAnchors = document.querySelectorAll("a[href^='#']");
  allNavAnchors.forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetID = this.getAttribute("href");

      if (targetID && targetID.startsWith("#") && targetID.length > 1) {
        e.preventDefault();
        const target = document.querySelector(targetID);

        if (mobileNav?.classList.contains("active")) {
          mobileNav.classList.remove("active");
          const icon = mobileBtn?.querySelector("i");
          if (icon) icon.className = "ri-menu-4-line";
        }

        if (target) {
          const navHeight = navbar ? navbar.offsetHeight : 80;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      }
    });
  });
}
