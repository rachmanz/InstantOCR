export function initFAQ() {
  document.querySelectorAll(".faq-item").forEach((item) => {
    const questionBtn = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    if (questionBtn && answer) {
      questionBtn.addEventListener("click", () => {
        const isOpen = item.classList.contains("active");

        document.querySelectorAll(".faq-item").forEach((otherItem) => {
          otherItem.classList.remove("active");
          const otherAnswer = otherItem.querySelector(".faq-answer");
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        });

        if (!isOpen) {
          item.classList.add("active");
          answer.style.maxHeight = answer.scrollHeight + "px";
        }
      });
    }
  });
}
