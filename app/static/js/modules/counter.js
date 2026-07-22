export function initCounter() {
  if (typeof ScrollTrigger !== "undefined") {
    document.querySelectorAll(".counter").forEach((counter) => {
      const target = Number(counter.dataset.target) || 0;

      ScrollTrigger.create({
        trigger: counter,
        once: true,
        start: "top 85%",
        onEnter: () => {
          let current = 0;
          const duration = 2000;
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
}
