/**
 * Animal Welfare NGO - Main JavaScript
 * Handles: sticky nav, mobile menu, scroll reveal, form validation, impact counter
 */

(function () {
  'use strict';

  // ---------- Sticky header: add shadow on scroll ----------
  var header = document.getElementById('site-header');
  if (header) {
    function updateHeader() {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', updateHeader);
    updateHeader();
  }

  // ---------- Mobile nav toggle ----------
  var navToggle = document.getElementById('nav-toggle');
  var navMenu = document.getElementById('nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      navMenu.classList.toggle('open');
      var expanded = navMenu.classList.contains('open');
      navToggle.setAttribute('aria-expanded', expanded);
    });
    // Close menu when clicking a link (for single-page feel on mobile)
    var navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---------- Scroll reveal: add .revealed when element is in view ----------
  var revealEls = document.querySelectorAll('.reveal');
  function reveal() {
    var winHeight = window.innerHeight;
    var revealPoint = 120;
    revealEls.forEach(function (el) {
      var top = el.getBoundingClientRect().top;
      if (top < winHeight - revealPoint) {
        el.classList.add('revealed');
      }
    });
  }
  window.addEventListener('scroll', reveal);
  window.addEventListener('load', reveal);

  // ---------- Impact statistics counter ----------
  var statNumbers = document.querySelectorAll('.stat-number');
  var counterAnimated = false;

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var duration = 2000;
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var easeOut = 1 - Math.pow(1 - progress, 2);
      var current = Math.floor(easeOut * (target - start) + start);
      el.textContent = current;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }
    window.requestAnimationFrame(step);
  }

  function checkStats() {
    if (counterAnimated || statNumbers.length === 0) return;
    var statsSection = document.querySelector('.stats-section');
    if (!statsSection) return;
    var top = statsSection.getBoundingClientRect().top;
    if (top < window.innerHeight - 100) {
      counterAnimated = true;
      statNumbers.forEach(function (el) {
        animateCounter(el);
      });
    }
  }
  window.addEventListener('scroll', checkStats);
  window.addEventListener('load', checkStats);

  // ---------- Form validation helpers ----------
  function showError(inputId, message) {
    var input = document.getElementById(inputId);
    var errorEl = document.getElementById(inputId + '-error');
    if (input) input.classList.add('error');
    if (errorEl) {
      errorEl.textContent = message || '';
      errorEl.style.display = message ? 'block' : 'none';
    }
  }

  function clearFormErrors(formId) {
    var form = document.getElementById(formId);
    if (!form) return;
    form.querySelectorAll('.form-error').forEach(function (el) {
      el.textContent = '';
      el.style.display = 'none';
    });
    form.querySelectorAll('input, select, textarea').forEach(function (el) {
      el.classList.remove('error');
    });
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone) {
    return /^[\d\s\-+]{8,}$/.test(phone.replace(/\s/g, ''));
  }

  // ---------- Newsletter form ----------
  var newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var emailInput = newsletterForm.querySelector('input[type="email"]');
      var msgEl = document.getElementById('newsletter-message');
      var email = (emailInput && emailInput.value) || '';
      if (!validateEmail(email)) {
        if (msgEl) {
          msgEl.style.display = 'block';
          msgEl.textContent = 'Please enter a valid email address.';
          msgEl.style.color = '#c45c5c';
        }
        return;
      }
      if (msgEl) {
        msgEl.style.display = 'block';
        msgEl.textContent = 'Thank you for subscribing! We\'ll keep you updated.';
        msgEl.style.color = '';
      }
      newsletterForm.reset();
    });
  }

  // ---------- Contact form ----------
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      clearFormErrors('contact-form');
      var name = document.getElementById('contact-name').value.trim();
      var email = document.getElementById('contact-email').value.trim();
      var message = document.getElementById('contact-message').value.trim();
      var valid = true;

      if (!name) {
        showError('contact-name', 'Please enter your name.');
        valid = false;
      }
      if (!email) {
        showError('contact-email', 'Please enter your email.');
        valid = false;
      } else if (!validateEmail(email)) {
        showError('contact-email', 'Please enter a valid email.');
        valid = false;
      }
      if (!message) {
        showError('contact-message', 'Please enter a message.');
        valid = false;
      }

      if (!valid) return;

      var successEl = document.getElementById('contact-success');
      if (successEl) {
        successEl.style.display = 'block';
        successEl.textContent = 'Thank you! We have received your message and will get back to you soon.';
      }
      contactForm.reset();
    });
  }

  // ---------- Volunteer form ----------
  var volunteerForm = document.getElementById('volunteer-form');
  if (volunteerForm) {
    volunteerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      clearFormErrors('volunteer-form');
      var name = document.getElementById('vol-name').value.trim();
      var email = document.getElementById('vol-email').value.trim();
      var phone = document.getElementById('vol-phone').value.trim();
      var city = document.getElementById('vol-city').value.trim();
      var help = document.getElementById('vol-help').value;
      var valid = true;

      if (!name) {
        showError('vol-name', 'Please enter your name.');
        valid = false;
      }
      if (!email) {
        showError('vol-email', 'Please enter your email.');
        valid = false;
      } else if (!validateEmail(email)) {
        showError('vol-email', 'Please enter a valid email.');
        valid = false;
      }
      if (!phone) {
        showError('vol-phone', 'Please enter your phone number.');
        valid = false;
      } else if (!validatePhone(phone)) {
        showError('vol-phone', 'Please enter a valid phone number.');
        valid = false;
      }
      if (!city) {
        showError('vol-city', 'Please enter your city.');
        valid = false;
      }
      if (!help) {
        var helpEl = document.getElementById('vol-help');
        if (helpEl) helpEl.classList.add('error');
        valid = false;
      }

      if (!valid) return;

      var successEl = document.getElementById('volunteer-success');
      if (successEl) {
        successEl.style.display = 'block';
        successEl.textContent = 'Thank you for signing up! We\'ll be in touch soon.';
      }
      volunteerForm.reset();
    });
  }

  // ---------- Missing pet form ----------
  var missingPetForm = document.getElementById('missing-pet-form');
  if (missingPetForm) {
    missingPetForm.addEventListener('submit', function (e) {
      e.preventDefault();
      clearFormErrors('missing-pet-form');
      var name = document.getElementById('mp-name').value.trim();
      var email = document.getElementById('mp-email').value.trim();
      var phone = document.getElementById('mp-phone').value.trim();
      var petName = document.getElementById('mp-pet-name').value.trim();
      var description = document.getElementById('mp-description').value.trim();
      var lastSeen = document.getElementById('mp-last-seen').value.trim();
      var date = document.getElementById('mp-date').value;
      var valid = true;

      if (!name) {
        showError('mp-name', 'Please enter your name.');
        valid = false;
      }
      if (!email) {
        showError('mp-email', 'Please enter your email.');
        valid = false;
      } else if (!validateEmail(email)) {
        showError('mp-email', 'Please enter a valid email.');
        valid = false;
      }
      if (!phone) {
        showError('mp-phone', 'Please enter your phone number.');
        valid = false;
      } else if (!validatePhone(phone)) {
        showError('mp-phone', 'Please enter a valid phone number.');
        valid = false;
      }
      if (!petName) {
        showError('mp-pet-name', 'Please enter pet\'s name.');
        valid = false;
      }
      if (!description) {
        var descEl = document.getElementById('mp-description');
        if (descEl) descEl.classList.add('error');
        valid = false;
      }
      if (!lastSeen) {
        var lastSeenEl = document.getElementById('mp-last-seen');
        if (lastSeenEl) lastSeenEl.classList.add('error');
        valid = false;
      }
      if (!date) {
        var dateEl = document.getElementById('mp-date');
        if (dateEl) dateEl.classList.add('error');
        valid = false;
      }

      if (!valid) return;

      var successEl = document.getElementById('missing-pet-success');
      if (successEl) {
        successEl.style.display = 'block';
        successEl.textContent = 'Your report has been submitted. We will share it with our community and get in touch if we have any leads.';
      }
      missingPetForm.reset();
    });
  }
})();
