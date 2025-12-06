document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".section");
  const navLinks = document.querySelectorAll(".nav-link");
  const yearSpan = document.getElementById("yearSpan");
  const themeToggle = document.getElementById("themeToggle");
  const skillBeltTrack = document.getElementById("skillBeltTrack");

  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Section switching
  navLinks.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.target;
      if (!targetId) return;

      sections.forEach((sec) => sec.classList.remove("active"));
      navLinks.forEach((b) => b.classList.remove("active"));

      const targetSection = document.getElementById(targetId);
      if (targetSection) targetSection.classList.add("active");
      btn.classList.add("active");
    });
  });

  // Theme toggle
  const storedTheme = window.localStorage.getItem("amit-theme");
  if (storedTheme === "light") {
    document.body.classList.add("light");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("light");
      const mode = document.body.classList.contains("light") ? "light" : "dark";
      window.localStorage.setItem("amit-theme", mode);
    });
  }

  // Skill belt data
  const skills = [
    "E-commerce Operations",
    "Customer Service",
    "Customer Experience",
    "Team Management",
    "Team Leadership",
    "Business Development",
    "Analytical Skills",
    "Google Ads",
    "Google Workspace",
    "Microsoft Excel",
    "Operations Management",
    "Inventory Handling",
    "Bulk Data Handling",
    "Project Management",
    "Skilled Multi-tasker",
    "HTML",
    "CSS",
    "JavaScript",
    "C++",
    "Web Development",
    "Artificial Intelligence",
    "Laser Tools",
    "Shopify",
    "WooCommerce",
    "Soft Skills",
    "Process Ownership"
  ];

  // Duplicate the skills so belt can loop smoothly
  const beltSkills = [...skills, ...skills, ...skills];

  if (skillBeltTrack) {
    beltSkills.forEach((skill) => {
      const chip = document.createElement("span");
      chip.className = "skill-chip";
      chip.textContent = skill;
      skillBeltTrack.appendChild(chip);
    });
  }
});
