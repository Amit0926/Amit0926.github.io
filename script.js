document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const musicToggle = document.getElementById("musicToggle");
  const bgMusic = document.getElementById("bg-music");
  const backToTop = document.getElementById("backToTop");
  const preloader = document.getElementById("preloader");
  const yearSpan = document.getElementById("year");
  const sideMenu = document.getElementById("sideMenu");
  const openSideMenu = document.getElementById("openSideMenu");
  const closeSideMenu = document.getElementById("closeSideMenu");
  const navLinks = document.querySelectorAll("header nav a, #sideMenu nav a");
  const cursor = document.querySelector(".custom-cursor");
  const heroOverlay = document.querySelector(".hero-overlay");
  const portfolioSearch = document.getElementById("portfolioSearch");
  const catButtons = document.querySelectorAll(".cat-btn");
  const projectCards = document.querySelectorAll(".project-card");
  const modalOverlay = document.getElementById("modalOverlay");
  const modalBody = document.getElementById("modalBody");
  const modalClose = document.getElementById("modalClose");

  const chatbot = document.getElementById("chatbot");
  const chatbotToggle = document.getElementById("chatbotToggle");
  const chatbotClose = document.getElementById("chatbotClose");
  const chatbotWindow = chatbot.querySelector(".chatbot-window");
  const chatbotMessages = document.getElementById("chatbotMessages");
  const chatbotForm = document.getElementById("chatbotForm");
  const chatbotInput = document.getElementById("chatbotInput");

  // Year
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Theme
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme === "light") {
    root.setAttribute("data-theme", "light");
    if (themeToggle) themeToggle.textContent = "☀️";
  }

  themeToggle?.addEventListener("click", () => {
    const isLight = root.getAttribute("data-theme") === "light";
    const next = isLight ? "dark" : "light";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    themeToggle.textContent = next === "light" ? "☀️" : "🌙";
  });

  // Music toggle
  let isMusicPlaying = false;
  musicToggle?.addEventListener("click", async () => {
    try {
      if (!isMusicPlaying) {
        await bgMusic.play();
        isMusicPlaying = true;
        musicToggle.textContent = "⏸";
      } else {
        bgMusic.pause();
        isMusicPlaying = false;
        musicToggle.textContent = "🎵";
      }
    } catch (e) {
      console.warn("Music play blocked by browser until user interaction", e);
    }
  });

  // Preloader
  window.addEventListener("load", () => {
    if (preloader) {
      preloader.style.opacity = "0";
      preloader.style.pointerEvents = "none";
      setTimeout(() => preloader.remove(), 400);
    }
  });

  // Back to top
  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }

    // Parallax
    if (heroOverlay) {
      const offset = window.scrollY * 0.2;
      heroOverlay.style.transform = `translateY(${offset}px)`;
    }
  });

  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Side menu
  openSideMenu?.addEventListener("click", () => {
    sideMenu?.classList.add("open");
  });

  closeSideMenu?.addEventListener("click", () => {
    sideMenu?.classList.remove("open");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      sideMenu?.classList.remove("open");
    });
  });

  // Custom cursor
  window.addEventListener("mousemove", (e) => {
    if (!cursor) return;
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  });

  // Portfolio search & filter
  function applyFilters() {
    const query = portfolioSearch.value.trim().toLowerCase();
    const activeCatBtn = document.querySelector(".cat-btn.active");
    const activeCat = activeCatBtn ? activeCatBtn.dataset.category : "all";

    projectCards.forEach((card) => {
      const title = card.dataset.title.toLowerCase();
      const cat = card.dataset.category;
      const matchesSearch = title.includes(query);
      const matchesCat = activeCat === "all" || cat === activeCat;

      if (matchesSearch && matchesCat) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
    });
  }

  portfolioSearch?.addEventListener("input", applyFilters);

  catButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      catButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      applyFilters();
    });
  });

  // Project detail modal content
  const projectDetails = {
    "ops-dashboard": {
      title: "High-Volume Order Operations Dashboard",
      role: "Operations Manager | Gifts by Rashi",
      summary:
        "Built and optimized an internal workflow to manage tens of thousands of personalized orders with clear visibility over every stage.",
      bullets: [
        "Centralized tracking for order status, personalization, packaging, and dispatch.",
        "Integrated courier tracking links and escalation flows.",
        "Improved SLA adherence and reduced manual follow-ups."
      ]
    },
    "web-ui": {
      title: "Marketing Landing Pages & Web UI",
      role: "Operations & CX Partner",
      summary:
        "Collaborated with marketing and tech teams to refine landing pages for better conversion and smoother post-order journey.",
      bullets: [
        "Provided operations feedback that directly impacted UX and messaging.",
        "Ensured order forms captured correct data for seamless fulfillment.",
        "Helped test flows before campaigns went live."
      ]
    },
    "ai-bot": {
      title: "AI Automation for Order Queries",
      role: "Operations & Automation Specialist",
      summary:
        "Set up AI-based assistants and workflows to answer common customer questions and reduce manual support load.",
      bullets: [
        "Automated responses around order status, dispatch timings, and basic FAQs.",
        "Created structured flows to escalate complex issues to human agents.",
        "Helped free up operations time during peak seasons."
      ]
    },
    ads: {
      title: "Google Ads & Campaign Coordination",
      role: "Operations & Marketing Support",
      summary:
        "Supported Google Ads and marketing campaigns with on-ground operational insights.",
      bullets: [
        "Aligned campaign promises with operational capabilities and dispatch times.",
        "Ensured product SKUs, inventory, and personalization options were correctly set.",
        "Contributed to more consistent customer experiences post-click."
      ]
    }
  };

  function openModal(key) {
    const data = projectDetails[key];
    if (!data) return;
    modalBody.innerHTML = `
      <h3>${data.title}</h3>
      <p><strong>Role:</strong> ${data.role}</p>
      <p>${data.summary}</p>
      <h4>Key outcomes</h4>
      <ul>
        ${data.bullets.map((b) => `<li>${b}</li>`).join("")}
      </ul>
    `;
    modalOverlay.classList.add("active");
    modalOverlay.setAttribute("aria-hidden", "false");
  }

  document.querySelectorAll(".project-details").forEach((btn) => {
    btn.addEventListener("click", () => {
      openModal(btn.dataset.project);
    });
  });

  function closeModal() {
    modalOverlay.classList.remove("active");
    modalOverlay.setAttribute("aria-hidden", "true");
  }

  modalClose?.addEventListener("click", closeModal);
  modalOverlay?.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // Sliders
  document.querySelectorAll("[data-slider]").forEach((slider) => {
    const slides = slider.querySelectorAll(".slide");
    const prev = slider.querySelector(".slider-btn.prev");
    const next = slider.querySelector(".slider-btn.next");
    let index = 0;

    function showSlide(i) {
      slides.forEach((s, idx) => {
        s.classList.toggle("active", idx === i);
      });
    }

    prev?.addEventListener("click", (e) => {
      e.stopPropagation();
      index = (index - 1 + slides.length) % slides.length;
      showSlide(index);
    });

    next?.addEventListener("click", (e) => {
      e.stopPropagation();
      index = (index + 1) % slides.length;
      showSlide(index);
    });

    // auto rotate
    setInterval(() => {
      index = (index + 1) % slides.length;
      showSlide(index);
    }, 3500);
  });

  // Chatbot
  function appendMessage(text, type = "bot") {
    const div = document.createElement("div");
    div.className = `msg ${type}`;
    div.textContent = text;
    chatbotMessages.appendChild(div);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  function generateBotReply(message) {
    const msg = message.toLowerCase();
    if (msg.includes("experience") || msg.includes("year")) {
      return "Amit has 4+ years of hands-on experience managing end-to-end ecommerce operations at Gifts by Rashi.";
    }
    if (msg.includes("skill") || msg.includes("skills")) {
      return "Amit combines operations skills (order management, dispatch, CX, inventory) with tech skills (HTML, CSS, JS, basic app dev, AI automation, Google Workspace, Excel).";
    }
    if (msg.includes("automation") || msg.includes("ai")) {
      return "Amit focuses on using AI and automation to reduce repetitive work in order tracking, customer queries, and internal workflows.";
    }
    if (msg.includes("contact")) {
      return "You can reach Amit via the contact form on this page or connect with him on LinkedIn.";
    }
    return "Amit helps ecommerce brands run smooth operations from order to delivery, using both process and technology. Ask about his experience, skills, or automation work!";
  }

  chatbotToggle?.addEventListener("click", () => {
    chatbotWindow.classList.toggle("open");
  });

  chatbotClose?.addEventListener("click", () => {
    chatbotWindow.classList.remove("open");
  });

  chatbotForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = chatbotInput.value.trim();
    if (!text) return;
    appendMessage(text, "user");
    chatbotInput.value = "";
    setTimeout(() => {
      appendMessage(generateBotReply(text), "bot");
    }, 400);
  });
});
