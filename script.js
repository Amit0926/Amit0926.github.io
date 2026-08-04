document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Preloader ---------------- */
  const preloader = document.getElementById("preloader");
  const preloaderFill = document.getElementById("preloaderFill");
  requestAnimationFrame(() => { preloaderFill.style.width = "100%"; });
  window.addEventListener("load", () => {
    setTimeout(() => preloader.classList.add("done"), 500);
  });
  // Fallback in case 'load' already fired
  setTimeout(() => preloader.classList.add("done"), 2200);

  /* ---------------- Custom cursor ---------------- */
  const cursor = document.querySelector(".custom-cursor");
  const cursorDot = document.querySelector(".custom-cursor-dot");
  let cx = 0, cy = 0, dx = 0, dy = 0;
  window.addEventListener("mousemove", (e) => {
    dx = e.clientX; dy = e.clientY;
    cursorDot.style.left = dx + "px";
    cursorDot.style.top = dy + "px";
  });
  (function loop() {
    cx += (dx - cx) * 0.18;
    cy += (dy - cy) * 0.18;
    cursor.style.left = cx + "px";
    cursor.style.top = cy + "px";
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll("a, button, .chip, .project-card, input, textarea").forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("hovering"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("hovering"));
  });

  /* ---------------- Navbar scroll state + active link ---------------- */
  const navbar = document.getElementById("navbar");
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-links a, #sideMenu nav a");

  function onScroll() {
    navbar.classList.toggle("scrolled", window.scrollY > 30);

    const backToTop = document.getElementById("backToTop");
    backToTop.classList.toggle("visible", window.scrollY > 500);

    let current = sections[0]?.id;
    sections.forEach((sec) => {
      if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === "#" + current);
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------------- Back to top ---------------- */
  document.getElementById("backToTop").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });

  /* ---------------- Side menu ---------------- */
  const sideMenu = document.getElementById("sideMenu");
  const sideOverlay = document.getElementById("sideMenuOverlay");
  function openMenu() { sideMenu.classList.add("open"); sideOverlay.classList.add("open"); }
  function closeMenu() { sideMenu.classList.remove("open"); sideOverlay.classList.remove("open"); }
  document.getElementById("openSideMenu").addEventListener("click", openMenu);
  document.getElementById("closeSideMenu").addEventListener("click", closeMenu);
  sideOverlay.addEventListener("click", closeMenu);
  document.querySelectorAll("#sideMenu nav a").forEach((a) => a.addEventListener("click", closeMenu));

  /* ---------------- Theme toggle ---------------- */
  const themeToggle = document.getElementById("themeToggle");
  const root = document.documentElement;
  const savedTheme = window.__amitTheme || null;
  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    themeToggle.textContent = theme === "dark" ? "🌙" : "☀️";
  }
  applyTheme(savedTheme || "dark");
  themeToggle.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    window.__amitTheme = next;
  });

  /* ---------------- Scroll reveal ---------------- */
  const revealEls = document.querySelectorAll(".reveal-up");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------------- Animated counters ---------------- */
  const counters = document.querySelectorAll(".stat-value[data-count]");
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const prefix = el.dataset.prefix || "";
        const suffix = el.dataset.suffix || "";
        const duration = prefersReducedMotion ? 0 : 1400;
        const start = performance.now();

        function tick(now) {
          const progress = duration === 0 ? 1 : Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = Math.round(target * eased);
          el.textContent = prefix + value.toLocaleString("en-IN") + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((el) => counterObserver.observe(el));

  /* ---------------- Timeline fill ---------------- */
  const timelineFill = document.getElementById("timelineFill");
  if (timelineFill) {
    const timelineObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            timelineFill.style.height = "100%";
            timelineObserver.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    timelineObserver.observe(document.querySelector(".timeline"));
  }

  /* ---------------- Portfolio filter + search ---------------- */
  const catButtons = document.querySelectorAll(".cat-btn");
  const projectCards = document.querySelectorAll(".project-card");
  const searchInput = document.getElementById("portfolioSearch");
  let activeCategory = "all";

  function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();
    projectCards.forEach((card) => {
      const matchesCategory = activeCategory === "all" || card.dataset.category === activeCategory;
      const matchesSearch = card.dataset.title.toLowerCase().includes(query);
      card.classList.toggle("hidden", !(matchesCategory && matchesSearch));
    });
  }
  catButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      catButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeCategory = btn.dataset.category;
      applyFilters();
    });
  });
  searchInput.addEventListener("input", applyFilters);

  /* ---------------- Project modal ---------------- */
  const projectData = {
    "ops-dashboard": {
      title: "High-Volume Order Operations",
      body: "Owning the full order-to-delivery pipeline at giftsbyrashi.com — from order capture through personalization, packaging quality checks, and dispatch. Processed 200+ orders a day and 5,00,000+ orders overall, leading a team of 10–15 across the floor.",
      tags: ["200+ orders/day", "5,00,000+ processed", "Team of 10–15", "Improved dispatch TAT"],
    },
    luxehampers: {
      title: "luxehampers.com",
      body: "Conceptualized, built, and launched luxehampers.com — a gifting brand website — from the ground up, covering structure, content, and go-live.",
      tags: ["Web Development", "Brand Launch", "Content Structure"],
    },
    "ai-bot": {
      title: "AI Automation for Order Queries",
      body: "Set up AI-assisted workflows to handle routine order-status and support questions automatically, cutting response time and freeing the team to focus on exceptions that need a human.",
      tags: ["AI Automation", "Customer Support", "Workflow Design"],
    },
    vendor: {
      title: "Vendor & Logistics Negotiation",
      body: "Worked directly with sourcing and courier vendors — negotiating pricing, closing deals, and coordinating with logistics partners including Blue Dart, Xpressbees, and Delhivery for reliable, cost-effective delivery.",
      tags: ["Vendor Negotiation", "Sourcing", "Blue Dart", "Xpressbees", "Delhivery"],
    },
  };

  const modalOverlay = document.getElementById("modalOverlay");
  const modalBody = document.getElementById("modalBody");

  function openModal(key) {
    const data = projectData[key];
    if (!data) return;
    modalBody.innerHTML = `
      <h3>${data.title}</h3>
      <p>${data.body}</p>
      <div class="modal-tags">${data.tags.map((t) => `<span>${t}</span>`).join("")}</div>
    `;
    modalOverlay.classList.add("open");
    modalOverlay.setAttribute("aria-hidden", "false");
  }
  function closeModal() {
    modalOverlay.classList.remove("open");
    modalOverlay.setAttribute("aria-hidden", "true");
  }
  document.querySelectorAll(".project-details").forEach((btn) => {
    btn.addEventListener("click", () => openModal(btn.dataset.project));
  });
  document.getElementById("modalClose").addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (e) => { if (e.target === modalOverlay) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  /* ---------------- Contact form ---------------- */
  const contactForm = document.getElementById("contactForm");
  const formNote = document.getElementById("formNote");
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    formNote.textContent = "Thanks — your message is ready to send. Connect via LinkedIn or email above for a direct reply.";
    contactForm.reset();
  });

  /* ---------------- Chatbot ---------------- */
  const chatbot = document.getElementById("chatbot");
  const chatbotToggle = document.getElementById("chatbotToggle");
  const chatbotClose = document.getElementById("chatbotClose");
  const chatbotForm = document.getElementById("chatbotForm");
  const chatbotInput = document.getElementById("chatbotInput");
  const chatbotMessages = document.getElementById("chatbotMessages");
  const chatbotSuggestions = document.getElementById("chatbotSuggestions");

  chatbotToggle.addEventListener("click", () => chatbot.classList.toggle("open"));
  chatbotClose.addEventListener("click", () => chatbot.classList.remove("open"));

  const answers = [
    { keys: ["order", "volume", "how many orders", "processed"], reply: "Amit has processed 5,00,000+ orders end-to-end, handling 200+ orders a day at giftsbyrashi.com." },
    { keys: ["team", "manage", "lead", "how big"], reply: "He leads a team of 10–15 members across order processing, personalization, and dispatch." },
    { keys: ["site", "website", "build", "luxehampers"], reply: "He conceptualized and built luxehampers.com from scratch, alongside running operations for giftsbyrashi.com." },
    { keys: ["vendor", "negotiat", "logistics", "courier"], reply: "Amit negotiates directly with sourcing and courier vendors — including Blue Dart, Xpressbees, and Delhivery — for better pricing." },
    { keys: ["tat", "turnaround", "dispatch"], reply: "He's improved dispatch turnaround time (TAT) through process and workflow optimization." },
    { keys: ["skill", "tech", "stack", "tool"], reply: "His stack spans operations tools (Excel, OMS, Jibble) plus HTML, CSS, JavaScript, Shopify, WordPress, and AI automation." },
    { keys: ["contact", "email", "phone", "reach"], reply: "You can reach Amit at amitchouhan9522@gmail.com or connect on LinkedIn — links are in the Contact section." },
    { keys: ["experience", "years", "long"], reply: "Amit has 4+ years of e-commerce operations experience at Giftsvilla Private Limited (giftsbyrashi.com)." },
  ];

  function addMessage(text, from) {
    const div = document.createElement("div");
    div.className = "msg " + from;
    div.textContent = text;
    chatbotMessages.appendChild(div);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  function respondTo(question) {
    const q = question.toLowerCase();
    const match = answers.find((a) => a.keys.some((k) => q.includes(k)));
    const reply = match
      ? match.reply
      : "Good question — for specifics beyond this, the best move is to reach out directly via the Contact section.";
    setTimeout(() => addMessage(reply, "bot"), 450);
  }

  chatbotForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = chatbotInput.value.trim();
    if (!value) return;
    addMessage(value, "user");
    respondTo(value);
    chatbotInput.value = "";
  });

  chatbotSuggestions.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      addMessage(btn.textContent, "user");
      respondTo(btn.textContent);
    });
  });

  /* ---------------- Footer year ---------------- */
  document.getElementById("year").textContent = new Date().getFullYear();
});
