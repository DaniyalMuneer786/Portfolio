// Resolve image paths from the script URL so assets work on GitHub Pages project sites
// (e.g. https://user.github.io/repo-name/) and match Linux case-sensitive filenames.
function getScriptBaseHref() {
  const el = document.querySelector('script[src*="script.js"]')
  if (!el?.src) return null
  try {
    return new URL(".", el.src).href
  } catch {
    return null
  }
}

function resolveAsset(relativePath) {
  const path = relativePath.replace(/^\//, "")
  const base = getScriptBaseHref()
  if (!base) return path
  try {
    return new URL(path, base).href
  } catch {
    return path
  }
}

// Navigation and Mobile Menu
document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("nav-toggle")
  const navMobile = document.getElementById("nav-mobile")
  const navLinks = document.querySelectorAll(".nav-link, .internal-scroll")
  const header = document.getElementById("header")

  const profileImg = document.querySelector(".profile-image")
  if (profileImg) {
    const attrSrc = profileImg.getAttribute("src")
    if (attrSrc && !/^[a-z][a-z0-9+.-]*:/i.test(attrSrc.trim())) {
      profileImg.src = resolveAsset(attrSrc.trim())
    }
  }

  // Initialize 3D effects
  init3DEffects()
  initParticleSystem()
  initTiltEffects()

  const cvDownloadBtn = document.getElementById("cv-download-btn")
  if (cvDownloadBtn) {
    const cvUrl = cvDownloadBtn.getAttribute("href")
    const cvFilename = cvDownloadBtn.getAttribute("download") || "Daniyal-Muneer-CV.pdf"
    cvDownloadBtn.addEventListener("click", async (e) => {
      if (!cvUrl) return
      e.preventDefault()
      try {
        const res = await fetch(cvUrl, { mode: "cors", cache: "no-store" })
        if (!res.ok) throw new Error("CV fetch failed")
        const blob = await res.blob()
        const blobUrl = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = blobUrl
        a.download = cvFilename
        a.rel = "noopener"
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(blobUrl)
      } catch {
        window.open(cvUrl, "_blank", "noopener,noreferrer")
      }
    })
  }

  // Mobile menu toggle
  if (navToggle) {
    navToggle.addEventListener("click", function () {
      navMobile.classList.toggle("active")
      // Animate hamburger
      const lines = this.querySelectorAll(".hamburger-line")
      lines.forEach((line, index) => {
        if (navMobile.classList.contains("active")) {
          if (index === 0) line.style.transform = "rotate(45deg) translate(5px, 5px)"
          if (index === 1) line.style.opacity = "0"
          if (index === 2) line.style.transform = "rotate(-45deg) translate(7px, -6px)"
        } else {
          line.style.transform = "none"
          line.style.opacity = "1"
        }
      })
    })
  }

  // Close mobile menu when clicking on nav links
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMobile.classList.remove("active")
      // Reset hamburger
      const lines = navToggle.querySelectorAll(".hamburger-line")
      lines.forEach((line) => {
        line.style.transform = "none"
        line.style.opacity = "1"
      })
    })
  })

  // Smooth scrolling for navigation links
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href").substring(1)
      const targetSection = document.getElementById(targetId)

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Enhanced header background on scroll
  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY
    if (scrolled > 100) {
      header.style.background = "rgba(255, 255, 255, 0.15)"
      header.style.backdropFilter = "blur(25px)"
    } else {
      header.style.background = "rgba(255, 255, 255, 0.1)"
      header.style.backdropFilter = "blur(20px)"
    }

    // Parallax effect for floating shapes
    const shapes = document.querySelectorAll(".shape")
    shapes.forEach((shape, index) => {
      const speed = (index + 1) * 0.1
      shape.style.transform = `translateY(${scrolled * speed}px)`
    })
  })

  // Enhanced progress bars animation
  const progressBars = document.querySelectorAll(".progress-fill-3d")
  const observerOptions = {
    threshold: 0.5,
    rootMargin: "0px 0px -100px 0px",
  }

  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const progressBar = entry.target
        const width = progressBar.getAttribute("data-width")

        // Animate with delay for stagger effect
        setTimeout(() => {
          progressBar.style.width = width + "%"
          progressBar.style.transition = "width 1.5s cubic-bezier(0.4, 0, 0.2, 1)"
        }, Math.random() * 500)
      }
    })
  }, observerOptions)

  progressBars.forEach((bar) => {
    progressObserver.observe(bar)
  })

  // Enhanced projects data and rendering
  const projects = [
    {
      id: 1,
      title: "Fake News Detection",
      description:
        "Machine learning model to classify and detect fake news articles using natural language processing techniques and advanced text analysis algorithms.",
      image: "Images/Fake News Detection.jpg",
      technologies: ["Python", "NLP", "Scikit-learn", "NLTK", "Flask"],
      githubUrl: "https://github.com/DaniyalMuneer786/Fake-News-Detection",
      featured: true,
    },
    {
      id: 2,
      title: "YouTube Sentiment Analysis",
      description:
        "Comprehensive sentiment analysis system for YouTube comments using NLP to analyze public opinion and emotional responses on video content.",
      image: "Images/Youtube Sentiment Analysis.jpg",
      technologies: ["Python", "NLP", "TextBlob", "YouTube API", "Flask"],
      githubUrl: "https://github.com/DaniyalMuneer786/Sentiment-Analysis",
      featured: true,
    },
    {
      id: 3,
      title: "Spam Email Detection",
      description:
        "Intelligent email classification system using machine learning algorithms to accurately identify and filter spam emails with high precision.",
      image: "Images/Spam Email Detection.jpg",
      technologies: ["Python", "Machine Learning", "Pandas", "Scikit-learn"],
      githubUrl: "https://github.com/DaniyalMuneer786/Spam-Email-Detection",
      featured: true,
    },
    {
      id: 4,
      title: "Handwritten Digit Recognition",
      description:
        "Deep learning web application that recognizes handwritten digits using a convolutional neural network and provides real-time predictions.",
      image: "Images/Hand Written Digits Recognition.jpg",
      technologies: ["Python", "Computer Vision", "OpenCV", "TensorFlow"],
      githubUrl: "https://github.com/DaniyalMuneer786/Hand-Written-Digits-Recognition",
      featured: true,
    },
    {
      id: 5,
      title: "Credit Card Fraud Detection",
      description:
        "Advanced machine learning system to identify fraudulent credit card transactions using anomaly detection and classification algorithms.",
      image: "Images/Credit Card Fraud Detection.jpg",
      technologies: ["Python", "Machine Learning", "Anomaly Detection", "Pandas"],
      githubUrl: "https://github.com/DaniyalMuneer786/Credit-Card-Fraud-Detection",
      featured: true,
    },
    {
      id: 6,
      title: "E-commerce Analytics",
      description:
        "Machine learning system that analyzes e-commerce sales data and predicts order status using data analysis and classification algorithms.",
      image: "Images/E-Commerce Analytics.heif",
      technologies: ["Python", "Data Analysis", "Matplotlib", "Seaborn", "Pandas"],
      githubUrl: "https://github.com/DaniyalMuneer786/E-Commerce-Analytics",
      featured: true,
    },
    {
      id: 7,
      title: "Potato Leaf Disease Prediction",
      description:
        "Computer vision model for early detection and classification of potato leaf diseases using deep learning model and all image processing techniques.",
      image: "Images/Potato Leaf Disease Prediction.jpg",
      technologies: ["Python", "Computer Vision", "TensorFlow", "Image Processing"],
      githubUrl: "https://github.com/DaniyalMuneer786/Potato-Leaf-Disease-Prediction",
      featured: true,
    },
    {
      id: 8,
      title: "Graph Recommendation System",
      description:
        "Intelligent system that analyzes uploaded CSV files and automatically recommends the most suitable graph types and visualizations for the data.",
      image: "Images/Graph-Recommendation-System.jpg",
      technologies: ["Python", "Data Visualization", "Machine Learning", "Flask"],
      githubUrl: "https://github.com/DaniyalMuneer786/Graph-Recommendation-System",
      featured: true,
    },
    {
      id: 9,
      title: "Salient Object Detection (FYP)",
      description:
        "Final year project focused on advanced computer vision techniques to identify and highlight the most prominent objects in digital images using deep learning.",
      image: "Images/Salient Object Detection.png",
      technologies: ["Python", "Deep Learning", "Computer Vision", "PyTorch"],
      githubUrl: "https://github.com/DaniyalMuneer786/Salient-Object-Detection",
      featured: true,
    },
  ]

  // Enhanced project rendering with 3D effects
  function renderProjects() {
    const projectsGrid = document.getElementById("projects-grid")
    if (!projectsGrid) return

    const projectsHTML = projects
      .map(
        (project, index) => `
            <div class="project-card card-3d fade-in" data-tilt style="animation-delay: ${index * 0.1}s">
                <div class="project-image-container">
                    <img src="${resolveAsset(project.image)}" alt="${project.title}" class="project-image">
                    <div class="project-overlay">
                        <div class="project-icon">🚀</div>
                        <h4>${project.title}</h4>
                        <p>Click to view code</p>
                    </div>
                </div>
                <div class="project-content">
                    ${project.featured ? '<div class="featured-badge">⭐ Featured</div>' : ""}
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-technologies">
                        ${project.technologies.map((tech) => `<span class="tech-tag skill-tag-3d">${tech}</span>`).join("")}
                    </div>
                    <div class="project-actions">
                        <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="project-link github-link btn-3d">
                            <div class="icon-github"></div>
                            <span>View Code in GitHub</span>
                            <div class="btn-glow"></div>
                        </a>
                    </div>
                </div>
                <div class="card-shine"></div>
            </div>
        `,
      )
      .join("")

    projectsGrid.innerHTML = projectsHTML

    // Re-initialize tilt effects for new elements
    initTiltEffects()
  }

  renderProjects()

  // Enhanced contact form handling
  const contactForm = document.getElementById("contact-form")
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault()

      const submitBtn = this.querySelector('button[type="submit"]')
      const btnText = submitBtn.querySelector(".btn-text")
      const btnLoading = submitBtn.querySelector(".btn-loading")

      // Show loading state with animation
      btnText.classList.add("hidden")
      btnLoading.classList.remove("hidden")
      submitBtn.disabled = true
      submitBtn.style.transform = "scale(0.95)"

      // Simulate form submission
      setTimeout(() => {
        // Success animation
        submitBtn.style.background = "linear-gradient(135deg, #06d6a0, #10b981)"
        btnLoading.textContent = "Sent! ✓"

        setTimeout(() => {
          alert("Thank you for your message! I'll get back to you soon.")

          // Reset form
          this.reset()

          // Reset button state
          btnText.classList.remove("hidden")
          btnLoading.classList.add("hidden")
          btnLoading.textContent = "Sending..."
          submitBtn.disabled = false
          submitBtn.style.transform = "scale(1)"
          submitBtn.style.background = ""
        }, 1000)
      }, 2000)
    })
  }

  // Enhanced fade in animation for sections
  const sections = document.querySelectorAll("section")
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in")

          // Animate child elements with stagger
          const children = entry.target.querySelectorAll(".card-3d, .stat-card, .contact-method-3d")
          children.forEach((child, index) => {
            setTimeout(() => {
              child.style.animation = `fadeInUp 0.8s ease-out forwards`
              child.style.animationDelay = `${index * 0.1}s`
            }, 100)
          })
        }
      })
    },
    {
      threshold: 0.1,
    },
  )

  sections.forEach((section) => {
    sectionObserver.observe(section)
  })

  // Initialize 3D Effects
  function init3DEffects() {
    // Add mouse move parallax effect
    document.addEventListener("mousemove", (e) => {
      const mouseX = e.clientX / window.innerWidth
      const mouseY = e.clientY / window.innerHeight

      // Move floating shapes based on mouse position
      const shapes = document.querySelectorAll(".shape")
      shapes.forEach((shape, index) => {
        const speed = (index + 1) * 10
        const x = (mouseX - 0.5) * speed
        const y = (mouseY - 0.5) * speed
        shape.style.transform = `translate(${x}px, ${y}px)`
      })

      // Move profile rings
      const rings = document.querySelectorAll(".profile-ring")
      rings.forEach((ring, index) => {
        const speed = (index + 1) * 5
        const x = (mouseX - 0.5) * speed
        const y = (mouseY - 0.5) * speed
        ring.style.transform = `translate(${x}px, ${y}px) rotate(${ring.style.transform.match(/rotate$$([^)]+)$$/)?.[1] || "0deg"})`
      })
    })
  }

  // Initialize Particle System
  function initParticleSystem() {
    const particleContainer = document.getElementById("particles")
    if (!particleContainer) return

    for (let i = 0; i < 50; i++) {
      const particle = document.createElement("div")
      particle.className = "particle"
      particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: particleFloat ${5 + Math.random() * 10}s infinite linear;
                animation-delay: ${Math.random() * 5}s;
            `
      particleContainer.appendChild(particle)
    }

    // Add particle animation keyframes
    const style = document.createElement("style")
    style.textContent = `
            @keyframes particleFloat {
                0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
            }
        `
    document.head.appendChild(style)
  }

  // Initialize Tilt Effects
  function initTiltEffects() {
    const tiltElements = document.querySelectorAll("[data-tilt]")

    tiltElements.forEach((element) => {
      element.addEventListener("mouseenter", function () {
        this.style.transition = "transform 0.1s ease"
      })

      element.addEventListener("mousemove", function (e) {
        const rect = this.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const centerX = rect.width / 2
        const centerY = rect.height / 2

        const rotateX = ((y - centerY) / centerY) * -10
        const rotateY = ((x - centerX) / centerX) * 10

        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`
      })

      element.addEventListener("mouseleave", function () {
        this.style.transition = "transform 0.3s ease"
        this.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)"
      })
    })
  }

  // Add typing effect to hero title
  function initTypingEffect() {
    const titleElement = document.querySelector(".hero-title .text-gradient-3d")
    if (!titleElement) return

    const text = titleElement.textContent
    titleElement.textContent = ""

    let i = 0
    const typeWriter = () => {
      if (i < text.length) {
        titleElement.textContent += text.charAt(i)
        i++
        setTimeout(typeWriter, 100)
      }
    }

    setTimeout(typeWriter, 1000)
  }

  // Initialize typing effect
  initTypingEffect()

  // Add scroll-triggered animations
  const animateOnScroll = () => {
    const elements = document.querySelectorAll(".fade-in")
    elements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top
      const elementVisible = 150

      if (elementTop < window.innerHeight - elementVisible) {
        element.classList.add("animate")
      }
    })
  }

  window.addEventListener("scroll", animateOnScroll)
  animateOnScroll() // Run once on load
})
