// ============================================
// GitHub Social Network - Interactive Features
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  initHeroEffects();
  initCounters();
  initScrollAnimations();
  initContributionGraph();
  initNetworkVisualization();
  initNavbarScroll();
  initSmoothScroll();
  initInteractiveCards();
  initParticleSystem();
  initHorizontalScroll();
});

// ============================================
// Hero Section Effects
// ============================================

function initHeroEffects() {
  const hero = document.querySelector(".hero-github");
  const glow = document.querySelector(".github-glow");

  if (!hero || !glow) return;

  // Mouse tracking glow effect
  hero.addEventListener("mousemove", (e) => {
    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    glow.style.left = x + "px";
    glow.style.top = y + "px";
    glow.style.opacity = "0.6";
  });

  hero.addEventListener("mouseleave", () => {
    glow.style.opacity = "0.3";
  });

  // Floating icons animation
  const floatIcons = document.querySelectorAll(".float-icon");
  floatIcons.forEach((icon, index) => {
    icon.style.animationDelay = `${index * 2}s`;
  });
}

// ============================================
// Counter Animations
// ============================================

function initCounters() {
  const counters = document.querySelectorAll(".stat-number");
  
  const observerOptions = {
    threshold: 0.5,
    rootMargin: "0px"
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains("counted")) {
        animateCounter(entry.target);
        entry.target.classList.add("counted");
        counterObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  counters.forEach(counter => {
    counterObserver.observe(counter);
  });
}

function animateCounter(element) {
  const target = element.getAttribute("data-target");
  let targetNum;
  
  // Handle different formats (50M, 200M, 1B)
  if (target.includes("M")) {
    targetNum = parseFloat(target) * 1000000;
  } else if (target.includes("B")) {
    targetNum = parseFloat(target) * 1000000000;
  } else {
    targetNum = parseInt(target);
  }

  const duration = 2000;
  const steps = 60;
  const increment = targetNum / steps;
  let current = 0;
  let step = 0;

  const timer = setInterval(() => {
    step++;
    current += increment;
    
    if (step >= steps) {
      current = targetNum;
      clearInterval(timer);
    }

    // Format the number
    let displayValue;
    if (targetNum >= 1000000000) {
      displayValue = (current / 1000000000).toFixed(1) + "B";
    } else if (targetNum >= 1000000) {
      displayValue = (current / 1000000).toFixed(0) + "M";
    } else {
      displayValue = Math.floor(current).toLocaleString();
    }

    element.textContent = displayValue;
  }, duration / steps);
}

// ============================================
// Scroll Animations
// ============================================

function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    ".profile-card, .repo-card, .activity-item"
  );

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }, index * 100);
        scrollObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(element => {
    element.style.opacity = "0";
    element.style.transform = "translateY(30px)";
    element.style.transition = "all 0.6s ease";
    scrollObserver.observe(element);
  });
}

// ============================================
// Contribution Graph
// ============================================

function initContributionGraph() {
  const graphContainer = document.getElementById("contributionGraph");
  if (!graphContainer) return;

  // Generate 371 days (53 weeks * 7 days)
  const days = 371;
  const weeks = 53;

  // Create week labels
  const weekLabels = ["Mon", "Wed", "Fri"];
  const weekLabelContainer = document.createElement("div");
  weekLabelContainer.style.cssText = "display: grid; grid-template-columns: auto repeat(53, 1fr); gap: 4px; margin-bottom: 8px;";
  
  weekLabels.forEach((label, i) => {
    const labelEl = document.createElement("div");
    labelEl.textContent = label;
    labelEl.style.cssText = "font-size: 11px; color: var(--github-text-muted); text-align: right; padding-right: 8px;";
    if (i === 0) {
      weekLabelContainer.appendChild(labelEl);
    }
  });

  // Create month labels row
  const monthRow = document.createElement("div");
  monthRow.style.cssText = "display: grid; grid-template-columns: auto repeat(53, 1fr); gap: 4px; margin-bottom: 4px;";
  
  const monthLabel = document.createElement("div");
  monthLabel.style.cssText = "font-size: 11px; color: var(--github-text-muted);";
  monthRow.appendChild(monthLabel);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let monthIndex = 0;
  
  for (let week = 0; week < weeks; week++) {
    const monthEl = document.createElement("div");
    if (week % 4 === 0 && monthIndex < months.length) {
      monthEl.textContent = months[monthIndex];
      monthEl.style.cssText = "font-size: 11px; color: var(--github-text-muted);";
      monthIndex++;
    }
    monthRow.appendChild(monthEl);
  }

  graphContainer.appendChild(monthRow);
  graphContainer.appendChild(weekLabelContainer);

  // Create grid for contribution days
  const gridContainer = document.createElement("div");
  gridContainer.style.cssText = "display: grid; grid-template-columns: auto repeat(53, 1fr); gap: 4px;";

  // Add day labels
  const dayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];
  dayLabels.forEach((label, i) => {
    const labelEl = document.createElement("div");
    labelEl.textContent = label;
    labelEl.style.cssText = "font-size: 11px; color: var(--github-text-muted); text-align: right; padding-right: 8px; height: 12px;";
    if (i === 0) {
      gridContainer.appendChild(labelEl);
    }
  });

  // Generate contribution days
  for (let day = 0; day < days; day++) {
    const dayEl = document.createElement("div");
    dayEl.className = "contribution-day";
    
    // Random contribution level (0-4)
    const level = Math.floor(Math.random() * 5);
    if (level > 0) {
      dayEl.classList.add(`level-${level}`);
    }

    // Add tooltip
    const contributions = level * 3 + Math.floor(Math.random() * 5);
    dayEl.setAttribute("data-contributions", contributions);
    dayEl.setAttribute("title", `${contributions} contributions`);

    // Hover effect
    dayEl.addEventListener("mouseenter", function() {
      this.style.transform = "scale(1.3)";
      this.style.zIndex = "10";
    });

    dayEl.addEventListener("mouseleave", function() {
      this.style.transform = "scale(1)";
      this.style.zIndex = "1";
    });

    gridContainer.appendChild(dayEl);
  }

  graphContainer.appendChild(gridContainer);
}

// ============================================
// Network Visualization
// ============================================

function initNetworkVisualization() {
  const networkNodes = document.querySelectorAll(".network-node:not(.center-node)");
  
  networkNodes.forEach((node, index) => {
    // Animate nodes appearing
    node.style.opacity = "0";
    node.style.transform = "scale(0)";
    
    setTimeout(() => {
      node.style.transition = "all 0.6s ease";
      node.style.opacity = "1";
      node.style.transform = "scale(1)";
    }, index * 200);

    // Add hover effect
    node.addEventListener("mouseenter", function() {
      this.style.transform = "scale(1.2)";
      this.querySelector(".node-avatar").style.boxShadow = "0 0 30px rgba(88, 166, 255, 1)";
    });

    node.addEventListener("mouseleave", function() {
      this.style.transform = "scale(1)";
      this.querySelector(".node-avatar").style.boxShadow = "0 0 20px rgba(88, 166, 255, 0.5)";
    });
  });

  // Animate connection lines
  const connectionLines = document.querySelectorAll(".connection-line");
  connectionLines.forEach((line, index) => {
    line.style.opacity = "0";
    setTimeout(() => {
      line.style.transition = "opacity 1s ease";
      line.style.opacity = "0.6";
    }, 1000 + index * 200);
  });
}

// ============================================
// Navbar Scroll Effect
// ============================================

function initNavbarScroll() {
  const navbar = document.querySelector(".navbar");
  
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.style.background = "rgba(13, 17, 23, 0.95)";
      navbar.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.3)";
    } else {
      navbar.style.background = "rgba(13, 17, 23, 0.8)";
      navbar.style.boxShadow = "none";
    }
  });
}

// ============================================
// Smooth Scroll
// ============================================

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const offsetTop = target.offsetTop - 70;
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth"
        });
      }
    });
  });
}

// ============================================
// Interactive Cards
// ============================================

function initInteractiveCards() {
  // Profile cards
  const profileCards = document.querySelectorAll(".profile-card");
  profileCards.forEach(card => {
    card.addEventListener("mouseenter", function() {
      this.style.transform = "translateY(-12px) scale(1.02)";
    });

    card.addEventListener("mouseleave", function() {
      this.style.transform = "translateY(0) scale(1)";
    });
  });

  // Repository cards
  const repoCards = document.querySelectorAll(".repo-card");
  repoCards.forEach(card => {
    card.addEventListener("mouseenter", function() {
      this.style.transform = "translateY(-8px)";
    });

    card.addEventListener("mouseleave", function() {
      this.style.transform = "translateY(0)";
    });
  });

  // Star button interactions
  const starButtons = document.querySelectorAll(".star-btn");
  starButtons.forEach(btn => {
    btn.addEventListener("click", function(e) {
      e.stopPropagation();
      const icon = this.querySelector("i");
      const span = this.querySelector("span");
      
      if (icon.classList.contains("fas")) {
        icon.classList.remove("fas");
        icon.classList.add("far");
        let count = parseInt(span.textContent.replace("k", "000").replace(".", ""));
        count--;
        span.textContent = (count / 1000).toFixed(1) + "k";
        this.style.background = "rgba(88, 166, 255, 0.1)";
      } else {
        icon.classList.remove("far");
        icon.classList.add("fas");
        let count = parseInt(span.textContent.replace("k", "000").replace(".", ""));
        count++;
        span.textContent = (count / 1000).toFixed(1) + "k";
        this.style.background = "rgba(88, 166, 255, 0.2)";
      }

      // Animation
      this.style.transform = "scale(1.2)";
      setTimeout(() => {
        this.style.transform = "scale(1)";
      }, 200);
    });
  });

  // Follow button interactions
  const followButtons = document.querySelectorAll(".follow-btn");
  followButtons.forEach(btn => {
    btn.addEventListener("click", function() {
      const icon = this.querySelector("i");
      const text = this.querySelector("span") || this;
      
      if (icon.classList.contains("fa-user-plus")) {
        icon.classList.remove("fa-user-plus");
        icon.classList.add("fa-user-check");
        if (text.textContent) {
          text.textContent = "Following";
        }
        this.style.background = "var(--github-success)";
      } else {
        icon.classList.remove("fa-user-check");
        icon.classList.add("fa-user-plus");
        if (text.textContent) {
          text.textContent = "Follow";
        }
        this.style.background = "var(--github-accent)";
      }

      // Animation
      this.style.transform = "scale(0.95)";
      setTimeout(() => {
        this.style.transform = "scale(1)";
      }, 150);
    });
  });
}

// ============================================
// Particle System
// ============================================

function initParticleSystem() {
  const hero = document.querySelector(".hero-github");
  if (!hero) return;

  // Create additional particles
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.cssText = `
      position: absolute;
      width: 3px;
      height: 3px;
      background: var(--github-accent);
      border-radius: 50%;
      pointer-events: none;
      opacity: 0.4;
    `;
    
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    particle.style.left = x + "%";
    particle.style.top = y + "%";
    
    const duration = 10 + Math.random() * 10;
    const delay = Math.random() * 5;
    
    particle.style.animation = `particleFloat ${duration}s ${delay}s infinite ease-in-out`;
    
    hero.appendChild(particle);
  }
}

// Add particle animation to CSS dynamically
const style = document.createElement("style");
style.textContent = `
  @keyframes particleFloat {
    0%, 100% {
      transform: translate(0, 0) scale(1);
      opacity: 0.3;
    }
    25% {
      transform: translate(20px, -30px) scale(1.2);
      opacity: 0.6;
    }
    50% {
      transform: translate(-20px, -60px) scale(0.8);
      opacity: 0.8;
    }
    75% {
      transform: translate(30px, -30px) scale(1.1);
      opacity: 0.5;
    }
  }
`;
document.head.appendChild(style);

// ============================================
// Active Navigation Link
// ============================================

window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-left a");
  
  let current = "";
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.scrollY >= sectionTop - 100) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

// ============================================
// Activity Feed Real-time Updates
// ============================================

function addActivityItem(user, action, repo, time) {
  const activityFeed = document.querySelector(".activity-feed");
  if (!activityFeed) return;

  const activityItem = document.createElement("div");
  activityItem.className = "activity-item";
  activityItem.style.opacity = "0";
  activityItem.style.transform = "translateX(-30px)";
  
  const iconMap = {
    "starred": "fa-star",
    "forked": "fa-code-branch",
    "created": "fa-plus",
    "pushed": "fa-code-branch"
  };

  activityItem.innerHTML = `
    <div class="activity-avatar">
      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${user}" alt="${user}">
    </div>
    <div class="activity-content">
      <div class="activity-header">
        <strong>${user}</strong> ${action} <strong>${repo}</strong>
        <span class="activity-time">${time}</span>
      </div>
      <div class="activity-repo">
        <i class="fab fa-github"></i>
        <span>${repo}</span>
      </div>
    </div>
    <div class="activity-action">
      <i class="fas ${iconMap[action] || "fa-circle"}"></i>
    </div>
  `;

  activityFeed.insertBefore(activityItem, activityFeed.firstChild);

  setTimeout(() => {
    activityItem.style.transition = "all 0.5s ease";
    activityItem.style.opacity = "1";
    activityItem.style.transform = "translateX(0)";
  }, 100);

  // Remove old items if too many
  const items = activityFeed.querySelectorAll(".activity-item");
  if (items.length > 10) {
    items[items.length - 1].style.transition = "all 0.5s ease";
    items[items.length - 1].style.opacity = "0";
    items[items.length - 1].style.transform = "translateX(30px)";
    setTimeout(() => {
      items[items.length - 1].remove();
    }, 500);
  }
}

// Simulate real-time activity (for demo)
setTimeout(() => {
  const activities = [
    { user: "New Developer", action: "starred", repo: "awesome-project", time: "Just now" },
    { user: "Code Master", action: "forked", repo: "react-framework", time: "5 min ago" }
  ];
  
  activities.forEach((activity, index) => {
    setTimeout(() => {
      addActivityItem(activity.user, activity.action, activity.repo, activity.time);
    }, index * 3000);
  });
}, 5000);

// ============================================
// Performance Optimization
// ============================================

// Throttle scroll events
function throttle(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Apply throttling to scroll handlers
window.addEventListener("scroll", throttle(() => {
  // Scroll-based animations can be added here
}, 100));

// ============================================
// Horizontal Scroll Functionality
// ============================================

function initHorizontalScroll() {
  const scrollLeftBtn = document.getElementById("scrollLeft");
  const scrollRightBtn = document.getElementById("scrollRight");
  const scrollIndicator = document.getElementById("scrollIndicator");

  if (!scrollLeftBtn || !scrollRightBtn || !scrollIndicator) return;

  // Scroll left function
  scrollLeftBtn.addEventListener("click", () => {
    const scrollAmount = window.innerWidth * 0.8;
    window.scrollBy({
      left: -scrollAmount,
      behavior: "smooth"
    });
  });

  // Scroll right function
  scrollRightBtn.addEventListener("click", () => {
    const scrollAmount = window.innerWidth * 0.8;
    window.scrollBy({
      left: scrollAmount,
      behavior: "smooth"
    });
  });

  // Keyboard navigation for horizontal scrolling
  document.addEventListener("keydown", (e) => {
    // Shift + Arrow Left/Right for horizontal scrolling
    if (e.shiftKey) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        window.scrollBy({
          left: -window.innerWidth * 0.8,
          behavior: "smooth"
        });
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        window.scrollBy({
          left: window.innerWidth * 0.8,
          behavior: "smooth"
        });
      }
    }
  });

  // Show/hide scroll indicator based on scroll position
  function updateScrollIndicator() {
    const maxScrollLeft = document.documentElement.scrollWidth - window.innerWidth;
    const currentScrollLeft = window.scrollX;

    // Show indicator if there's horizontal scroll available
    if (maxScrollLeft > 10) {
      scrollIndicator.style.display = "flex";
      
      // Disable left button if at the start
      if (currentScrollLeft <= 10) {
        scrollLeftBtn.style.opacity = "0.5";
        scrollLeftBtn.style.cursor = "not-allowed";
      } else {
        scrollLeftBtn.style.opacity = "1";
        scrollLeftBtn.style.cursor = "pointer";
      }

      // Disable right button if at the end
      if (currentScrollLeft >= maxScrollLeft - 10) {
        scrollRightBtn.style.opacity = "0.5";
        scrollRightBtn.style.cursor = "not-allowed";
      } else {
        scrollRightBtn.style.opacity = "1";
        scrollRightBtn.style.cursor = "pointer";
      }
    } else {
      scrollIndicator.style.display = "none";
    }
  }

  // Update on scroll and resize
  window.addEventListener("scroll", updateScrollIndicator);
  window.addEventListener("resize", updateScrollIndicator);
  
  // Initial check
  updateScrollIndicator();

  // Smooth horizontal scrolling for grid sections
  const scrollableGrids = document.querySelectorAll(".profiles-grid, .repos-grid");
  scrollableGrids.forEach(grid => {
    let isDown = false;
    let startX;
    let scrollLeft;

    grid.addEventListener("mousedown", (e) => {
      isDown = true;
      grid.style.cursor = "grabbing";
      startX = e.pageX - grid.offsetLeft;
      scrollLeft = grid.scrollLeft;
    });

    grid.addEventListener("mouseleave", () => {
      isDown = false;
      grid.style.cursor = "grab";
    });

    grid.addEventListener("mouseup", () => {
      isDown = false;
      grid.style.cursor = "grab";
    });

    grid.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - grid.offsetLeft;
      const walk = (x - startX) * 2;
      grid.scrollLeft = scrollLeft - walk;
    });

    // Add grab cursor style
    grid.style.cursor = "grab";
  });
}
