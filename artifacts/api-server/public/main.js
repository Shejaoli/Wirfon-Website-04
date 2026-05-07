(function () {
  // Mobile nav toggle
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        if (window.innerWidth <= 880) {
          nav.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
        }
      });
    });
  }

  // Hero auto-slider
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".hero-dots .dot");
  if (slides.length > 1) {
    let current = 0;
    let timer = null;

    const goTo = (idx) => {
      current = (idx + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle("active", i === current));
      dots.forEach((d, i) => d.classList.toggle("active", i === current));
    };
    const start = () => {
      timer = setInterval(() => goTo(current + 1), 5000);
    };
    const stop = () => {
      if (timer) clearInterval(timer);
    };

    dots.forEach((d) => {
      d.addEventListener("click", () => {
        const idx = parseInt(d.dataset.index || "0", 10);
        goTo(idx);
        stop();
        start();
      });
    });
    start();
  }

  // Video carousels
  document.querySelectorAll(".video-carousel").forEach((carousel) => {
    const slides = carousel.querySelectorAll(".carousel-slide");
    const prev = carousel.querySelector(".carousel-arrow.prev");
    const next = carousel.querySelector(".carousel-arrow.next");
    if (!slides.length) return;
    let idx = 0;
    const show = (i) => {
      idx = (i + slides.length) % slides.length;
      slides.forEach((s, j) => s.classList.toggle("active", j === idx));
    };
    if (prev) prev.addEventListener("click", () => show(idx - 1));
    if (next) next.addEventListener("click", () => show(idx + 1));
  });

  // Accordion
  document.querySelectorAll(".accordion-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const item = trigger.closest(".accordion-item");
      if (!item) return;
      const isOpen = item.classList.toggle("open");
      trigger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  });

  // Anchor scroll handler with offset for fixed navbar
  function scrollToHash(hash) {
    if (!hash) return;
    const el = document.querySelector(hash);
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  // On load, scroll to URL hash with offset
  if (window.location.hash) {
    setTimeout(() => scrollToHash(window.location.hash), 80);
  }

  // Intercept same-page anchor clicks for smooth scroll
  document.querySelectorAll('a[href*="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href") || "";
      if (!href.includes("#")) return;
      const url = new URL(href, window.location.href);
      if (url.pathname === window.location.pathname && url.hash) {
        e.preventDefault();
        history.pushState(null, "", url.hash);
        scrollToHash(url.hash);
      }
    });
  });
})();
