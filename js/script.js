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


  // ---------- Contact form ----------


  // ---------- Volunteer form ----------


  // ---------- Missing pet form ----------

})();

// ========== SUPABASE CONFIG ==========
const SUPABASE_URL = 'https://jstvrnpostcpzywpdpve.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_jy_ELTA8Vj5y0UZbPvw2aw_X3AmxVsQ';
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const FOUND_MARKER = '[[FOUND]]';
// Set this to your deployed Supabase Edge Function URL.
const MISSING_PET_NOTIFY_FUNCTION_URL = '';

function isPetFound(record) {
  return (record.other_details || '').includes(FOUND_MARKER);
}

function formatFoundMessage(otherDetails) {
  return (otherDetails || '').replace(FOUND_MARKER, '').trim();
}

async function notifyMissingPetSubscribers(eventType, petData) {
  if (!MISSING_PET_NOTIFY_FUNCTION_URL) return;
  try {
    await fetch(MISSING_PET_NOTIFY_FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType: eventType, pet: petData })
    });
  } catch (error) {
    // Avoid blocking user flow if email system is unavailable.
    console.error('Email notification failed:', error);
  }
}

// ========== VOLUNTEER FORM ==========
const volunteerFormSB = document.getElementById('volunteer-form');
if (volunteerFormSB) {
  volunteerFormSB.addEventListener('submit', async function (e) {
    e.preventDefault();
    const formData = {
      name: document.getElementById('vol-name').value.trim(),
      email: document.getElementById('vol-email').value.trim(),
      phone: document.getElementById('vol-phone').value.trim(),
      city: document.getElementById('vol-city').value.trim(),
      how_to_help: document.getElementById('vol-help').value,
      message: document.getElementById('vol-message') ? document.getElementById('vol-message').value.trim() : ''
    };
    const { error } = await supabaseClient.from('volunteer_signups').insert([formData]);
    if (error) {
      alert('Something went wrong! Please try again.');
      console.error(error);
    } else {
      alert('Thank you for signing up! We will be in touch soon 🐾');
      volunteerFormSB.reset();
    }
  });
}

// ========== CONTACT FORM ==========
const contactFormSB = document.getElementById('contact-form');
if (contactFormSB) {
  contactFormSB.addEventListener('submit', async function (e) {
    e.preventDefault();
    const formData = {
      name: document.getElementById('contact-name').value.trim(),
      email: document.getElementById('contact-email').value.trim(),
      subject: document.getElementById('contact-subject') ? document.getElementById('contact-subject').value.trim() : '',
      message: document.getElementById('contact-message').value.trim()
    };
    const { error } = await supabaseClient.from('contact_messages').insert([formData]);
    if (error) {
      alert('Something went wrong! Please try again.');
      console.error(error);
    } else {
      alert('Thank you! We have received your message 🐾');
      contactFormSB.reset();
    }
  });
}

// ========== NEWSLETTER FORM ==========
const newsletterFormSB = document.getElementById('newsletter-form');
if (newsletterFormSB) {
  newsletterFormSB.addEventListener('submit', async function (e) {
    e.preventDefault();
    const email = newsletterFormSB.querySelector('input[type="email"]').value.trim();
    const { error } = await supabaseClient.from('newsletter_subscribers').insert([{ email }]);
    if (error) {
      alert('Something went wrong! Please try again.');
      console.error(error);
    } else {
      alert('Thank you for subscribing! 🐾');
      newsletterFormSB.reset();
    }
  });
}

// ========== MISSING PET FORM ==========
const missingPetFormSB = document.getElementById('missing-pet-form');
if (missingPetFormSB) {
  missingPetFormSB.addEventListener('submit', async function (e) {
    e.preventDefault();
    document.getElementById('mp-submit-btn').disabled = true;
    document.getElementById('mp-submit-btn').textContent = 'Submitting...';
    document.getElementById('mp-loading').style.display = 'block';

    let photoUrl = null;
    const photoInput = document.getElementById('mp-photo');
    if (photoInput && photoInput.files[0]) {
      const file = photoInput.files[0];
      const fileName = Date.now() + '_' + file.name;
      const { error: uploadError } = await supabaseClient.storage
        .from('pet-photos')
        .upload(fileName, file);
      if (!uploadError) {
        const { data } = supabaseClient.storage.from('pet-photos').getPublicUrl(fileName);
        photoUrl = data.publicUrl;
      }
    }

    const formData = {
      name: document.getElementById('mp-name').value.trim(),
      email: document.getElementById('mp-email').value.trim(),
      phone: document.getElementById('mp-phone').value.trim(),
      pet_name: document.getElementById('mp-pet-name').value.trim(),
      species_breed: document.getElementById('mp-species') ? document.getElementById('mp-species').value.trim() : '',
      description: document.getElementById('mp-description').value.trim(),
      last_seen_location: document.getElementById('mp-last-seen').value.trim(),
      date_last_seen: document.getElementById('mp-date').value,
      other_details: document.getElementById('mp-message') ? document.getElementById('mp-message').value.trim() : '',
      photo_url: photoUrl
    };

    const { error } = await supabaseClient.from('missing_pets').insert([formData]);

    document.getElementById('mp-submit-btn').disabled = false;
    document.getElementById('mp-submit-btn').textContent = 'Submit Report';
    document.getElementById('mp-loading').style.display = 'none';

    if (error) {
      alert('Something went wrong! Please try again.');
      console.error(error);
    } else {
      await notifyMissingPetSubscribers('missing_reported', formData);
      alert('Report submitted! We will contact you soon 🐾');
      missingPetFormSB.reset();
    }
  });
}

// ========== PUBLIC MISSING PET LIST ==========
const publicMissingPetsList = document.getElementById('missing-pets-public-list');
if (publicMissingPetsList) {
  loadPublicMissingPets();
}

async function loadPublicMissingPets() {
  const { data, error } = await supabaseClient
    .from('missing_pets')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    publicMissingPetsList.innerHTML = '<p class="loading-text">Unable to load missing pet reports right now.</p>';
    return;
  }

  if (!data || data.length === 0) {
    publicMissingPetsList.innerHTML = '<p class="loading-text">No missing pet reports yet.</p>';
    return;
  }

  publicMissingPetsList.innerHTML = data.map(function (pet) {
    const found = isPetFound(pet);
    const foundNote = formatFoundMessage(pet.other_details);
    const statusClass = found ? 'missing-pet-status--found' : 'missing-pet-status--missing';
    const statusText = found ? 'Found' : 'Still Missing';
    const lastSeenDate = pet.date_last_seen ? new Date(pet.date_last_seen).toLocaleDateString('en-IN') : '-';

    return `
      <article class="missing-pet-card">
        ${pet.photo_url ? `<img src="${pet.photo_url}" alt="${pet.pet_name || 'Missing pet'}">` : ''}
        <span class="missing-pet-status ${statusClass}">${statusText}</span>
        <h3>${pet.pet_name || 'Unnamed pet'}</h3>
        <p><strong>Breed/Species:</strong> ${pet.species_breed || '-'}</p>
        <p><strong>Last Seen:</strong> ${pet.last_seen_location || '-'}</p>
        <p><strong>Date Last Seen:</strong> ${lastSeenDate}</p>
        <p><strong>Description:</strong> ${pet.description || '-'}</p>
        ${found && foundNote ? `<p><strong>Update:</strong> ${foundNote}</p>` : ''}
      </article>
    `;
  }).join('');
}
