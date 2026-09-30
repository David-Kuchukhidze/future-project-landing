/**
 * NeuroFlow — Next-Gen Autonomous Intelligence Platform
 * Vanilla JavaScript Implementation
 * Features:
 *  - Sticky navbar with blur on scroll
 *  - Responsive mobile drawer navigation with accessibility (ARIA)
 *  - Active section scroll spy
 *  - Animated counter numbers triggered on viewport entry
 *  - 3D interactive tilt & dynamic radial glow on feature cards
 *  - Client-side form validation with accessible feedback & simulated async submission
 *  - Smooth back-to-top handler
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Elements Initialization
  // --------------------------------------------------------------------------
  const header = document.getElementById('site-header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mainNav = document.getElementById('main-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTopBtn = document.getElementById('back-to-top-btn');
  const currentYearEl = document.getElementById('current-year');
  const contactForm = document.getElementById('contact-form');
  const successBanner = document.getElementById('form-success-banner');
  const formFieldsWrap = document.getElementById('form-fields-wrap');
  const submitBtn = document.getElementById('contact-submit-btn');
  const resetFormBtn = document.getElementById('reset-form-btn');
  const featureCards = document.querySelectorAll('.feature-card[data-tilt="true"]');
  const counters = document.querySelectorAll('.counter');

  // Dynamic Year in footer
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  // --------------------------------------------------------------------------
  // 2. Sticky Header & Scroll Spy
  // --------------------------------------------------------------------------
  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // Scroll Spy using IntersectionObserver
  const sections = document.querySelectorAll('section[id]');
  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach((sec) => sectionObserver.observe(sec));
  }

  // --------------------------------------------------------------------------
  // 3. Mobile Navigation Drawer
  // --------------------------------------------------------------------------
  const toggleMobileNav = () => {
    const isOpen = mainNav.classList.toggle('open');
    mobileToggle.classList.toggle('active', isOpen);
    mobileToggle.setAttribute('aria-expanded', isOpen.toString());
  };

  const closeMobileNav = () => {
    if (mainNav.classList.contains('open')) {
      mainNav.classList.remove('open');
      mobileToggle.classList.remove('active');
      mobileToggle.setAttribute('aria-expanded', 'false');
    }
  };

  if (mobileToggle) {
    mobileToggle.addEventListener('click', toggleMobileNav);
  }

  // Close mobile nav when clicking any nav item
  navLinks.forEach((link) => {
    link.addEventListener('click', closeMobileNav);
  });

  // Close mobile nav on escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainNav.classList.contains('open')) {
      closeMobileNav();
      mobileToggle.focus();
    }
  });

  // Close on window resize if viewport becomes desktop width
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && mainNav.classList.contains('open')) {
      closeMobileNav();
    }
  });

  // --------------------------------------------------------------------------
  // 4. Animated Numerical Counters (About Section)
  // --------------------------------------------------------------------------
  let animatedCounters = false;

  const animateCounter = (el) => {
    const target = parseFloat(el.getAttribute('data-target'));
    const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    const duration = 1800; // ms
    const startTime = performance.now();

    const updateValue = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = easeProgress * target;

      el.textContent = currentVal.toFixed(decimals);

      if (progress < 1) {
        requestAnimationFrame(updateValue);
      } else {
        el.textContent = target.toFixed(decimals);
      }
    };

    requestAnimationFrame(updateValue);
  };

  const metricsSection = document.getElementById('about-metrics');
  if (metricsSection && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animatedCounters) {
          animatedCounters = true;
          counters.forEach((counter) => animateCounter(counter));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counterObserver.observe(metricsSection);
  }

  // --------------------------------------------------------------------------
  // 5. 3D Interactive Tilt on Feature Cards
  // --------------------------------------------------------------------------
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    featureCards.forEach((card) => {
      const cardGlow = card.querySelector('.card-glow');

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within card
        const y = e.clientY - rect.top;  // y position within card

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;

        // Subtle tilt: max 7 degrees
        const rotateX = -deltaY * 7;
        const rotateY = deltaX * 7;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;

        // Adjust glow light center towards mouse pointer
        if (cardGlow) {
          cardGlow.style.top = `${y - 125}px`;
          cardGlow.style.left = `${x - 125}px`;
        }
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        if (cardGlow) {
          cardGlow.style.top = '-60px';
          cardGlow.style.left = 'auto';
          cardGlow.style.right = '-60px';
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 6. Interactive Contact Form Validation & Simulated Submission
  // --------------------------------------------------------------------------
  if (contactForm) {
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const subjectSelect = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');
    const spinner = document.getElementById('btn-spinner');
    const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;

    // Helper: validate email address pattern
    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    // Helper: toggle error state on input group
    const setFieldError = (input, hasError) => {
      const group = input.closest('.form-group');
      if (!group) return;

      if (hasError) {
        group.classList.add('has-error');
        input.classList.add('is-invalid');
      } else {
        group.classList.remove('has-error');
        input.classList.remove('is-invalid');
      }
    };

    // Real-time error clearing when user edits field
    [nameInput, emailInput, subjectSelect, messageInput].forEach((field) => {
      if (!field) return;
      field.addEventListener('input', () => {
        if (field.classList.contains('is-invalid')) {
          setFieldError(field, false);
        }
      });
      field.addEventListener('change', () => {
        if (field.classList.contains('is-invalid')) {
          setFieldError(field, false);
        }
      });
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let hasErrors = false;

      // 1. Validate Name
      if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        setFieldError(nameInput, true);
        hasErrors = true;
      } else {
        setFieldError(nameInput, false);
      }

      // 2. Validate Email
      if (!emailInput.value.trim() || !isValidEmail(emailInput.value.trim())) {
        setFieldError(emailInput, true);
        hasErrors = true;
      } else {
        setFieldError(emailInput, false);
      }

      // 3. Validate Subject
      if (!subjectSelect.value) {
        setFieldError(subjectSelect, true);
        hasErrors = true;
      } else {
        setFieldError(subjectSelect, false);
      }

      // 4. Validate Message
      if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
        setFieldError(messageInput, true);
        hasErrors = true;
      } else {
        setFieldError(messageInput, false);
      }

      if (hasErrors) {
        // Focus first invalid input
        const firstInvalid = contactForm.querySelector('.is-invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Simulate network request submission
      submitBtn.disabled = true;
      if (spinner) spinner.style.display = 'inline-block';
      if (btnText) btnText.textContent = 'Transmitting...';

      setTimeout(() => {
        // Success state
        submitBtn.disabled = false;
        if (spinner) spinner.style.display = 'none';
        if (btnText) btnText.textContent = 'Transmit Message';

        // Hide form inputs and reveal success banner
        formFieldsWrap.style.display = 'none';
        successBanner.removeAttribute('hidden');
        successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 1200);
    });

    // Reset button inside success banner
    if (resetFormBtn) {
      resetFormBtn.addEventListener('click', () => {
        contactForm.reset();
        successBanner.setAttribute('hidden', 'true');
        formFieldsWrap.style.display = 'flex';
        nameInput.focus();
      });
    }
  }

  // --------------------------------------------------------------------------
  // 7. Back-to-Top Button Handler
  // --------------------------------------------------------------------------
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
