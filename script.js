/* ============================================================
   PRABHAT BHURTEL — PREMIUM PORTFOLIO
   script.js
   ============================================================ */

'use strict';

/* ---- GLOBALS ---- */
let lenis;
let isLoaded = false;

/* ============================================================
   1. LOADER
   ============================================================ */
(function initLoader() {
  const loader   = document.getElementById('loader');
  const bar      = document.getElementById('loaderBar');
  let progress   = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 18 + 4;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      bar.style.width = '100%';

      setTimeout(() => {
        gsap.to(loader, {
          y: '-100%',
          duration: 1.1,
          ease: 'power3.inOut',
          onComplete: () => {
            loader.style.display = 'none';
            isLoaded = true;
            initSite();
          }
        });
      }, 400);
    }
    bar.style.width = Math.min(progress, 100) + '%';
  }, 80);
})();

/* ============================================================
   2. SITE INIT (runs after loader completes)
   ============================================================ */
function initSite() {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  initLenis();
  initCursor();
  initNav();
  initHero();
  initRevealAnimations();
  initParallax();
  initMagneticButtons();
  initProjectsScroll();
  initNavSmoothing();
}

/* ============================================================
   3. LENIS SMOOTH SCROLL
   ============================================================ */
function initLenis() {
  lenis = new Lenis({
    duration: 1.35,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    smooth: true,
    smoothTouch: false,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
}

/* ============================================================
   4. CUSTOM CURSOR
   ============================================================ */
function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');

  if (!cursor || !follower) return;

  // Only on true pointer devices
  if (window.matchMedia('(hover: none)').matches) return;

  let curX = 0, curY = 0;
  let folX = 0, folY = 0;

  document.addEventListener('mousemove', (e) => {
    curX = e.clientX;
    curY = e.clientY;
    gsap.to(cursor, {
      x: curX, y: curY,
      duration: 0.12,
      ease: 'power2.out'
    });
  });

  // Follower with RAF smoothing
  (function animateFollower() {
    folX += (curX - folX) * 0.11;
    folY += (curY - folY) * 0.11;
    gsap.set(follower, { x: folX, y: folY });
    requestAnimationFrame(animateFollower);
  })();

  // Hover states
  const interactives = document.querySelectorAll('a, button, .project-card, .skill-card, .testimonial-card, .discipline-block');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => follower.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => follower.classList.remove('is-hover'));
  });

  // Hide when leaving window
  document.addEventListener('mouseleave', () => {
    gsap.to([cursor, follower], { opacity: 0, duration: 0.3 });
  });
  document.addEventListener('mouseenter', () => {
    gsap.to([cursor, follower], { opacity: 1, duration: 0.3 });
  });
}

/* ============================================================
   5. NAV — shrink on scroll + mobile toggle
   ============================================================ */
function initNav() {
  const nav       = document.getElementById('nav');
  const toggle    = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  // Shrink on scroll
  ScrollTrigger.create({
    start: 'top -80',
    onEnter: () => nav.classList.add('scrolled'),
    onLeaveBack: () => nav.classList.remove('scrolled')
  });

  // Mobile toggle
  toggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('open');
    toggle.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = isOpen ? '' : 'hidden';
  });

  // Close on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ============================================================
   6. HERO ENTRANCE ANIMATION
   ============================================================ */
function initHero() {
  const tl = gsap.timeline({ delay: 0.1 });

  // Title mask reveals
  const titleLines = document.querySelectorAll('.hero-title-line');
  titleLines.forEach(line => {
    const text = line.textContent;
    line.innerHTML = `<span class="line-inner">${text}</span>`;
  });

  const lineInners = document.querySelectorAll('.hero-title .line-inner');

  tl.to(lineInners, {
    y: '0%',
    duration: 1.1,
    ease: 'power3.out',
    stagger: 0.12
  })
  .to('.hero-eyebrow', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out'
  }, '-=0.6')
  .to('.hero-sub', {
    opacity: 1,
    y: 0,
    duration: 0.7,
    ease: 'power3.out'
  }, '-=0.5')
  .to('.hero-actions', {
    opacity: 1,
    y: 0,
    duration: 0.7,
    ease: 'power3.out'
  }, '-=0.45')
  .to('.hero-frame', {
    opacity: 1,
    scale: 1,
    duration: 1.0,
    ease: 'power3.out'
  }, '-=0.8')
  .to('.hero-scroll-hint', {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: 'power3.out'
  }, '-=0.4');
}

/* ============================================================
   7. SCROLL REVEAL ANIMATIONS
   ============================================================ */
function initRevealAnimations() {
  // Generic reveal-up elements
  gsap.utils.toArray('.reveal-up').forEach(el => {
    const delay = parseFloat(el.dataset.delay) || 0;
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      delay: delay,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true
      }
    });
  });

  // Generic reveal-scale elements
  gsap.utils.toArray('.reveal-scale').forEach(el => {
    gsap.to(el, {
      opacity: 1,
      scale: 1,
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        once: true
      }
    });
  });

  // Section headings with split line animation
  gsap.utils.toArray('.section-heading').forEach(el => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 82%',
        once: true
      }
    });
  });

  // About section specifics
  const aboutHeading = document.querySelector('.about-heading');
  if (aboutHeading) {
    gsap.to(aboutHeading, {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: aboutHeading, start: 'top 82%', once: true }
    });
  }

  const aboutBio = document.querySelector('.about-bio');
  if (aboutBio) {
    gsap.to(aboutBio, {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: aboutBio, start: 'top 85%', once: true }
    });
  }

  const aboutStats = document.querySelector('.about-stats');
  if (aboutStats) {
    gsap.to(aboutStats, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: aboutStats, start: 'top 87%', once: true }
    });

    // Stagger stat numbers
    gsap.utils.toArray('.stat-number').forEach((num, i) => {
      const target = num.textContent;
      let numVal = parseFloat(target.replace(/[^0-9.]/g, ''));

      if (!isNaN(numVal) && target !== '∞') {
        gsap.from(num, {
          textContent: 0,
          duration: 1.6,
          ease: 'power2.out',
          snap: { textContent: 1 },
          delay: i * 0.15,
          scrollTrigger: { trigger: aboutStats, start: 'top 87%', once: true },
          onUpdate: function() {
            const suffix = target.replace(/[0-9.]/g, '');
            num.textContent = Math.round(this.targets()[0].textContent).toLocaleString() + suffix;
          }
        });
      }
    });
  }

  const aboutTags = document.querySelector('.about-tags');
  if (aboutTags) {
    gsap.to(aboutTags, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: aboutTags, start: 'top 88%', once: true }
    });
  }

  // Brand section
  const brandHeading = document.querySelector('.brand-heading');
  if (brandHeading) {
    gsap.to(brandHeading, {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: brandHeading, start: 'top 82%', once: true }
    });
  }

  const brandTagline = document.querySelector('.brand-tagline');
  if (brandTagline) {
    gsap.to(brandTagline, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: brandTagline, start: 'top 85%', once: true }
    });
  }

  const brandDesc = document.querySelector('.brand-desc');
  if (brandDesc) {
    gsap.to(brandDesc, {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: brandDesc, start: 'top 84%', once: true }
    });
  }

  const brandPillars = document.querySelector('.brand-pillars');
  if (brandPillars) {
    gsap.to(brandPillars, {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: brandPillars, start: 'top 84%', once: true }
    });
  }

  // Contact heading
  const contactHeading = document.querySelector('.contact-heading');
  if (contactHeading) {
    gsap.to(contactHeading, {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: contactHeading, start: 'top 80%', once: true }
    });
  }

  const contactSub = document.querySelector('.contact-sub');
  if (contactSub) {
    gsap.to(contactSub, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: contactSub, start: 'top 85%', once: true }
    });
  }

  const contactLinks = document.querySelector('.contact-links');
  if (contactLinks) {
    gsap.to(contactLinks, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: contactLinks, start: 'top 85%', once: true }
    });
  }

  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    gsap.to(contactForm, {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: contactForm, start: 'top 84%', once: true }
    });
  }
}

/* ============================================================
   8. PARALLAX EFFECTS
   ============================================================ */
function initParallax() {
  // Hero orbs subtle parallax
  const orb1 = document.querySelector('.orb-1');
  const orb2 = document.querySelector('.orb-2');

  if (orb1 && orb2) {
    gsap.to(orb1, {
      y: -80,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5
      }
    });

    gsap.to(orb2, {
      y: 60,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5
      }
    });
  }

  // Hero visual parallax
  const heroFrame = document.querySelector('.hero-frame');
  if (heroFrame) {
    gsap.to(heroFrame, {
      y: 50,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2
      }
    });
  }

  // About image subtle parallax
  const aboutImgWrap = document.querySelector('.about-img-wrap');
  if (aboutImgWrap) {
    gsap.to(aboutImgWrap, {
      y: -30,
      ease: 'none',
      scrollTrigger: {
        trigger: '.about',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    });
  }

  // Section backgrounds
  const brandSection = document.querySelector('.brand');
  if (brandSection) {
    gsap.from('.brand-inner', {
      y: 30,
      ease: 'none',
      scrollTrigger: {
        trigger: brandSection,
        start: 'top bottom',
        end: 'center center',
        scrub: 1
      }
    });
  }
}

/* ============================================================
   9. MAGNETIC BUTTONS
   ============================================================ */
function initMagneticButtons() {
  if (window.matchMedia('(hover: none)').matches) return;

  const magnetics = document.querySelectorAll('[data-magnetic]');

  magnetics.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect   = el.getBoundingClientRect();
      const centerX = rect.left + rect.width  / 2;
      const centerY = rect.top  + rect.height / 2;
      const deltaX  = (e.clientX - centerX) * 0.28;
      const deltaY  = (e.clientY - centerY) * 0.28;

      gsap.to(el, {
        x: deltaX,
        y: deltaY,
        duration: 0.45,
        ease: 'power2.out'
      });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        x: 0, y: 0,
        duration: 0.55,
        ease: 'elastic.out(1, 0.5)'
      });
    });
  });
}

/* ============================================================
   10. PROJECTS HORIZONTAL SCROLL
   ============================================================ */
function initProjectsScroll() {
  const container  = document.getElementById('projectsScroll');
  const progressBar = document.getElementById('projectProgress');

  if (!container || !progressBar) return;

  // Update scroll progress bar
  container.addEventListener('scroll', () => {
    const scrollLeft  = container.scrollLeft;
    const maxScroll   = container.scrollWidth - container.clientWidth;
    const progress    = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
    progressBar.style.width = progress + '%';
  });

  // Drag to scroll
  let isDown   = false;
  let startX;
  let scrollLeft;
  let velocity = 0;
  let lastX    = 0;
  let rafId;

  container.addEventListener('mousedown', (e) => {
    isDown = true;
    container.style.cursor = 'grabbing';
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
    lastX = e.pageX;
    velocity = 0;
    cancelAnimationFrame(rafId);
  });

  container.addEventListener('mouseleave', () => {
    if (isDown) {
      isDown = false;
      container.style.cursor = 'grab';
      startInertia();
    }
  });

  container.addEventListener('mouseup', () => {
    isDown = false;
    container.style.cursor = 'grab';
    startInertia();
  });

  container.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x    = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 1.4;
    velocity = e.pageX - lastX;
    lastX = e.pageX;
    container.scrollLeft = scrollLeft - walk;
  });

  function startInertia() {
    cancelAnimationFrame(rafId);
    function loop() {
      if (Math.abs(velocity) < 0.5) return;
      container.scrollLeft -= velocity;
      velocity *= 0.92;
      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);
  }

  // Touch support
  let touchStartX = 0;
  let touchScrollLeft = 0;

  container.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].pageX;
    touchScrollLeft = container.scrollLeft;
  }, { passive: true });

  container.addEventListener('touchmove', (e) => {
    const dx = touchStartX - e.touches[0].pageX;
    container.scrollLeft = touchScrollLeft + dx;
  }, { passive: true });
}

/* ============================================================
   11. NAV SMOOTH SCROLL
   ============================================================ */
function initNavSmoothing() {
  document.querySelectorAll('[data-nav], .mobile-link, .hero-actions a, .nav-cta').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target && lenis) {
          lenis.scrollTo(target, { offset: -80, duration: 1.8 });
        }
      }
    });
  });
}

/* ============================================================
   12. HERO TITLE SUBTLE FLOAT
   ============================================================ */
(function heroFloat() {
  const heroGeos = document.querySelectorAll('.hero-geo');
  heroGeos.forEach((geo, i) => {
    gsap.to(geo, {
      y: `${(i + 1) * 12}px`,
      x: `${(i % 2 === 0 ? 1 : -1) * 8}px`,
      duration: 4 + i * 0.8,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: i * 0.6
    });
  });
})();

/* ============================================================
   13. CONTACT FORM HANDLER
   ============================================================ */
function handleForm(e) {
  e.preventDefault();
  const btn    = e.target.querySelector('.form-submit');
  const btnText = btn.querySelector('.btn-text');

  btnText.textContent = 'Sending...';
  btn.disabled = true;

  // Simulate submission
  setTimeout(() => {
    btnText.textContent = 'Message Sent ✓';
    btn.style.background = '#4E6272';

    setTimeout(() => {
      btnText.textContent = 'Send Message';
      btn.style.background = '';
      btn.disabled = false;
      e.target.reset();
    }, 3000);
  }, 1200);
}

/* ============================================================
   14. SKILLS CARD STAGGER (per-card)
   ============================================================ */
(function initSkillCards() {
  document.addEventListener('DOMContentLoaded', () => {});
  // Handled by reveal-up data-delay attributes on the cards
})();

/* ============================================================
   15. SECTION TRANSITION LINES
   ============================================================ */
(function initSectionLines() {
  // Animate the label lines on section entry
  gsap.utils.toArray('.section-label').forEach(label => {
    const line = label.querySelector('::after');
    gsap.fromTo(label, 
      { scaleX: 0 },
      {
        scaleX: 1,
        transformOrigin: 'left',
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: label,
          start: 'top 85%',
          once: true
        }
      }
    );
  });
})();

/* ============================================================
   16. PROJECT CARDS — cinematic hover depth
   ============================================================ */
(function initProjectHover() {
  if (window.matchMedia('(hover: none)').matches) return;

  const cards = document.querySelectorAll('.project-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect    = card.getBoundingClientRect();
      const x       = e.clientX - rect.left;
      const y       = e.clientY - rect.top;
      const centerX = rect.width  / 2;
      const centerY = rect.height / 2;
      const rotateY = ((x - centerX) / centerX) * 3.5;
      const rotateX = -((y - centerY) / centerY) * 2.5;

      gsap.to(card, {
        rotateX, rotateY,
        transformPerspective: 1000,
        duration: 0.45,
        ease: 'power2.out'
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0, rotateY: 0,
        duration: 0.65,
        ease: 'elastic.out(1, 0.6)'
      });
    });
  });
})();

/* ============================================================
   17. TESTIMONIAL CARDS STAGGER
   ============================================================ */
(function initTestimonials() {
  const cards = document.querySelectorAll('.testimonial-card');
  cards.forEach((card, i) => {
    gsap.to(card, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      delay: i * 0.12,
      scrollTrigger: {
        trigger: card,
        start: 'top 86%',
        once: true
      }
    });
  });
})();

/* ============================================================
   18. FOOTER — slow fade in
   ============================================================ */
(function initFooter() {
  const footer = document.querySelector('.footer');
  if (!footer) return;
  gsap.from(footer, {
    opacity: 0,
    y: 20,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: footer,
      start: 'top 92%',
      once: true
    }
  });
})();

/* ============================================================
   19. MARQUEE PAUSE ON HOVER
   ============================================================ */
(function initMarqueePause() {
  const tracks = document.querySelectorAll('.marquee-track, .skills-marquee-track');
  tracks.forEach(track => {
    track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
    track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
  });
})();

/* ============================================================
   20. RESIZE HANDLER — refresh ScrollTrigger
   ============================================================ */
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    ScrollTrigger.refresh();
  }, 250);
});
