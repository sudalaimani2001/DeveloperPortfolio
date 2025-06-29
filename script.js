// Global variable to store portfolio data
let portfolioData = null;

// Fetch portfolio data
async function fetchPortfolioData() {
  try {
    const response = await fetch('data.json');
    if (!response.ok) {
      throw new Error('Failed to fetch portfolio data');
    }
    portfolioData = await response.json();
  } catch (error) {
    console.error('Error loading portfolio data:', error);
    // You might want to show an error message to the user here
  }
}

// DOM Elements
const themeToggle = document.getElementById("theme-toggle")
const themeIcon = document.getElementById("theme-icon")
const hamburger = document.getElementById("hamburger")
const navMenu = document.getElementById("nav-menu")

// Theme Management
function initializeTheme() {
  const savedTheme = localStorage.getItem("theme") || "light"
  document.documentElement.setAttribute("data-theme", savedTheme)
  updateThemeIcon(savedTheme)
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme")
  const newTheme = currentTheme === "dark" ? "light" : "dark"

  document.documentElement.setAttribute("data-theme", newTheme)
  localStorage.setItem("theme", newTheme)
  updateThemeIcon(newTheme)
}

function updateThemeIcon(theme) {
  themeIcon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon"
}

// Mobile Navigation
function toggleMobileMenu() {
  navMenu.classList.toggle("active")

  // Animate hamburger
  const bars = hamburger.querySelectorAll(".bar")
  bars.forEach((bar, index) => {
    if (navMenu.classList.contains("active")) {
      if (index === 0) bar.style.transform = "rotate(-45deg) translate(-5px, 6px)"
      if (index === 1) bar.style.opacity = "0"
      if (index === 2) bar.style.transform = "rotate(45deg) translate(-5px, -6px)"
    } else {
      bar.style.transform = "none"
      bar.style.opacity = "1"
    }
  })
}

// Smooth Scrolling
function initializeSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })

        // Close mobile menu if open
        if (navMenu.classList.contains("active")) {
          toggleMobileMenu()
        }
      }
    })
  })
}

// Dynamic Content Population
function populateAboutSection() {
  const { personal } = portfolioData;

  document.querySelector(".about-title").textContent = personal.name;
  document.querySelector(".about-description").textContent = personal.bio;
}

function populateSkillsSection() {
  const skillsGrid = document.getElementById("skills-grid")

  portfolioData.skills.forEach((skill, index) => {
    const skillCard = document.createElement("div")
    skillCard.className = "skill-card animate-fade-in"
    skillCard.style.animationDelay = `${index * 0.1}s`

    const techIconsHtml = skill.techIcons
      .map(tech => `
        <div class="tech-icon-container" title="${tech.name}">
          <i class="${tech.icon}"></i>
          <span class="tech-name">${tech.name}</span>
        </div>
      `).join('')

    skillCard.innerHTML = `
      <div class="skill-icon">
        <i class="${skill.icon}"></i>
      </div>
      <h3 class="skill-name">${skill.name}</h3>
      <p class="skill-description">${skill.description}</p>
      <div class="tech-icons-grid">
        ${techIconsHtml}
      </div>
    `

    skillsGrid.appendChild(skillCard)
  })
}

function populateProjectsSection() {
  const projectsGrid = document.getElementById("projects-grid")

  portfolioData.projects.forEach((project, index) => {
    const projectCard = document.createElement("div")
    projectCard.className = "project-card animate-fade-in"
    projectCard.style.animationDelay = `${index * 0.2}s`

    const techTags = project.technologies.map((tech) => `<span class="tech-tag">${tech}</span>`).join("")

    projectCard.innerHTML = `
      <div class="project-image">
        <i class="${project.icon}"></i>
      </div>
      <div class="project-content">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-description">${project.description}</p>
        <div class="project-tech">${techTags}</div>
        <div class="project-links">
          <a href="${project.links.github}" class="project-link" target="_blank" rel="noopener noreferrer">
            <i class="fab fa-github"></i> Code
          </a>
          <a href="${project.links.live}" class="project-link" target="_blank" rel="noopener noreferrer">
            <i class="fas fa-external-link-alt"></i> Live Demo
          </a>
        </div>
      </div>
    `

    projectsGrid.appendChild(projectCard)
  })
}

function populateContactSection() {
  const contactLinks = document.getElementById("contact-links")
  const { contact } = portfolioData

  const contacts = [
    {
      type: "Email",
      icon: "fas fa-envelope",
      link: `mailto:${contact.email}`,
      text: "Email",
    },
    {
      type: "LinkedIn",
      icon: "fab fa-linkedin",
      link: contact.linkedin,
      text: "LinkedIn",
    },
    {
      type: "GitHub",
      icon: "fab fa-github",
      link: contact.github,
      text: "GitHub",
    },
  ]

  contacts.forEach((contact, index) => {
    const contactLink = document.createElement("a")
    contactLink.href = contact.link
    contactLink.className = "contact-link animate-fade-in"
    contactLink.target = "_blank"
    contactLink.rel = "noopener noreferrer"
    contactLink.style.animationDelay = `${index * 0.1}s`

    contactLink.innerHTML = `
      <div class="contact-icon">
        <i class="${contact.icon}"></i>
      </div>
      <span class="contact-text">${contact.text}</span>
    `

    contactLinks.appendChild(contactLink)
  })
}

// Intersection Observer for Animation Triggers
function initializeAnimationObserver() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = "running"
      }
    })
  }, observerOptions)

  // Observe all animated elements
  document.querySelectorAll(".animate-fade-in").forEach((el) => {
    el.style.animationPlayState = "paused"
    observer.observe(el)
  })
}

// Initialize Application
async function initializeApp() {
  // First fetch the data
  await fetchPortfolioData();
  
  if (!portfolioData) {
    console.error('Could not initialize app: Portfolio data not loaded');
    return;
  }

  // Set up theme
  initializeTheme()

  // Populate content
  populateAboutSection()
  populateSkillsSection()
  populateProjectsSection()
  populateContactSection()

  // Initialize interactions
  initializeSmoothScrolling()
  initializeAnimationObserver()

  // Event listeners
  themeToggle.addEventListener("click", toggleTheme)
  hamburger.addEventListener("click", toggleMobileMenu)

  // Close mobile menu when clicking on nav links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (navMenu.classList.contains("active")) {
        toggleMobileMenu()
      }
    })
  })

  // Handle navbar background on scroll
  window.addEventListener("scroll", () => {
    const navbar = document.getElementById("navbar")
    if (window.scrollY > 50) {
      navbar.style.background = "var(--nav-bg)"
      navbar.style.backdropFilter = "blur(10px)"
    } else {
      navbar.style.background = "var(--nav-bg)"
    }
  })
}

// Start the application when DOM is loaded
document.addEventListener("DOMContentLoaded", initializeApp)

// Handle external link clicks
document.addEventListener("click", (e) => {
  if (e.target.matches('a[href^="http"]')) {
    e.target.setAttribute("target", "_blank")
    e.target.setAttribute("rel", "noopener noreferrer")
  }
})
