export function initAnimations() {
  if (typeof gsap !== "undefined") {
    const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

    heroTl
      .from(".badge", { y: 30, opacity: 0, duration: 0.6 })
      .from(".hero-title", { y: 40, opacity: 0, duration: 0.8 }, "-=0.4")
      .from(".hero-description", { y: 25, opacity: 0, duration: 0.6 }, "-=0.5")
      .from(".hero-buttons", { y: 20, opacity: 0, duration: 0.6 }, "-=0.4")
      .from(".mini-stats", { y: 20, opacity: 0, duration: 0.6 }, "-=0.4")
      .from(
        ".upload-card",
        {
          y: 40,
          opacity: 0,
          duration: 0.9,
          clearProps: "transform",
        },
        "-=0.7",
      );

    gsap.to(".blob-one", { x: 40, y: 30, repeat: -1, yoyo: true, duration: 8, ease: "sine.inOut" });
    gsap.to(".blob-two", { x: -40, y: 20, repeat: -1, yoyo: true, duration: 10, ease: "sine.inOut" });
    gsap.to(".blob-three", { y: -35, repeat: -1, yoyo: true, duration: 9, ease: "sine.inOut" });

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
}
