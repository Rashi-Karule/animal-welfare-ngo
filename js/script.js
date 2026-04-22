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

let currentUser = null;

// ========== AUTHENTICATION ==========
async function checkAuthSession() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  currentUser = session ? session.user : null;
  updateAuthUI();

  // Listen for auth changes
  supabaseClient.auth.onAuthStateChange((_event, session) => {
    currentUser = session ? session.user : null;
    updateAuthUI();
  });
}

function updateAuthUI() {
  const authMenuItems = document.querySelectorAll('.auth-menu-item');
  authMenuItems.forEach(item => {
    if (currentUser) {
      item.innerHTML = `
        <div style="display:flex; gap:10px; align-items:center;">
          <a href="profile.html" style="background:var(--color-beige); color:var(--color-primary); padding:0.25rem 0.75rem; border-radius:var(--radius-sm); font-weight:bold;">Profile</a>
          <a href="#" id="nav-logout" style="color:#c45c5c; font-weight:bold;">Logout</a>
        </div>
      `;
      setTimeout(() => {
        const logoutBtn = item.querySelector('#nav-logout');
        if (logoutBtn) {
          logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await supabaseClient.auth.signOut();
            window.location.reload();
          });
        }
      }, 100);
    } else {
      item.innerHTML = `<a href="login.html">Login</a>`;
    }
  });

  // If on missing pets page, reload the list to show edit/delete buttons
  if (publicMissingPetsList) {
    loadPublicMissingPets();
  }
}

// Call on load
checkAuthSession();

const signupForm = document.getElementById('signup-form');
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const errorEl = document.getElementById('signup-error');
    
    errorEl.style.display = 'none';
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
    });

    if (error) {
      errorEl.textContent = error.message;
      errorEl.style.display = 'block';
    } else {
      document.getElementById('signup-success').textContent = "Account created! You are now logged in.";
      document.getElementById('signup-success').style.display = 'block';
      signupForm.reset();
      setTimeout(() => window.location.href = 'index.html', 2000);
    }
  });
}

const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');
    
    errorEl.style.display = 'none';
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      errorEl.textContent = error.message;
      errorEl.style.display = 'block';
    } else {
      window.location.href = 'index.html';
    }
  });
}

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

// ========== MISSING PET FORM & MAP ==========
let missingPetMap = null;
let mapMarker = null;

if (document.getElementById('missing-pet-map')) {
  // Default to central India (Nagpur approx)
  missingPetMap = L.map('missing-pet-map').setView([21.1458, 79.0882], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(missingPetMap);

  missingPetMap.on('click', function(e) {
    if (mapMarker) missingPetMap.removeLayer(mapMarker);
    mapMarker = L.marker(e.latlng).addTo(missingPetMap);
    document.getElementById('mp-lat').value = e.latlng.lat;
    document.getElementById('mp-lng').value = e.latlng.lng;
  });
}

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
      photo_url: photoUrl,
      owner_id: currentUser ? currentUser.id : null,
      lat: document.getElementById('mp-lat') ? document.getElementById('mp-lat').value : null,
      lng: document.getElementById('mp-lng') ? document.getElementById('mp-lng').value : null
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
    
    let actionButtons = '';
    if (currentUser && pet.owner_id === currentUser.id) {
      actionButtons = `
        <div class="action-buttons" style="margin-top: 1rem;">
          <button class="btn-small btn-edit" onclick='openEditModal(${JSON.stringify(pet).replace(/'/g, "&apos;")})'>Edit</button>
          <button class="btn-small btn-delete" onclick="deleteMissingPet('${pet.id}')">Delete</button>
        </div>
      `;
    }

    const shareUrl = encodeURIComponent(window.location.href);
    const shareText = encodeURIComponent(`Missing Pet: ${pet.pet_name} (${pet.species_breed}). Last seen at ${pet.last_seen_location}. Please help!`);
    const whatsappLink = `https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`;
    const fbLink = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${shareText}`;
    
    let mapLink = '';
    if (pet.lat && pet.lng) {
      mapLink = `<p><strong>Location:</strong> <a href="https://www.google.com/maps?q=${pet.lat},${pet.lng}" target="_blank">📍 View on Map</a></p>`;
    }

    return `
      <article class="missing-pet-card" id="pet-${pet.id}">
        ${pet.photo_url ? `<img src="${pet.photo_url}" alt="${pet.pet_name || 'Missing pet'}">` : ''}
        <span class="missing-pet-status ${statusClass}">${statusText}</span>
        <h3>${pet.pet_name || 'Unnamed pet'}</h3>
        <p><strong>Breed/Species:</strong> ${pet.species_breed || '-'}</p>
        <p><strong>Last Seen:</strong> ${pet.last_seen_location || '-'}</p>
        <p><strong>Date Last Seen:</strong> ${lastSeenDate}</p>
        ${mapLink}
        <p><strong>Description:</strong> ${pet.description || '-'}</p>
        ${found && foundNote ? `<p><strong>Update:</strong> ${foundNote}</p>` : ''}
        
        <div class="share-buttons" style="margin-top: 1rem; border-top: 1px solid #eee; padding-top: 1rem;">
          <a href="${whatsappLink}" target="_blank" class="btn-small" style="background:#25D366; color:white; text-decoration:none;">📱 WhatsApp</a>
          <a href="${fbLink}" target="_blank" class="btn-small" style="background:#1877F2; color:white; text-decoration:none;">📘 Facebook</a>
          <button class="btn-small" onclick='printFlyer(${JSON.stringify(pet).replace(/'/g, "&apos;")})' style="background:#444; color:white;">🖨️ Print Flyer</button>
        </div>
        ${actionButtons}
      </article>
    `;
  }).join('');
}

function printFlyer(pet) {
  const printWindow = window.open('', '_blank');
  const dateStr = pet.date_last_seen ? new Date(pet.date_last_seen).toLocaleDateString('en-IN') : '-';
  printWindow.document.write(`
    <html>
      <head>
        <title>Missing Pet - ${pet.pet_name}</title>
        <style>
          body { font-family: 'Arial', sans-serif; text-align: center; padding: 40px; color: #000; }
          h1 { font-size: 80px; color: #d93025; margin: 0; text-transform: uppercase; letter-spacing: 5px; }
          .photo { max-width: 100%; height: 400px; object-fit: cover; border: 10px solid #000; margin: 20px 0; }
          h2 { font-size: 50px; margin: 10px 0; }
          p { font-size: 24px; line-height: 1.5; margin: 10px 0; }
          .details { border: 3px dashed #000; padding: 20px; margin-top: 30px; text-align: left; }
          .contact { margin-top: 40px; font-size: 30px; font-weight: bold; background: #000; color: #fff; padding: 20px; }
        </style>
      </head>
      <body>
        <h1>MISSING PET</h1>
        ${pet.photo_url ? `<img src="${pet.photo_url}" class="photo">` : ''}
        <h2>${pet.pet_name.toUpperCase()}</h2>
        <div class="details">
          <p><strong>Species/Breed:</strong> ${pet.species_breed}</p>
          <p><strong>Last Seen:</strong> ${pet.last_seen_location}</p>
          <p><strong>Date Missing:</strong> ${dateStr}</p>
          <p><strong>Description:</strong> ${pet.description}</p>
        </div>
        <div class="contact">
          IF FOUND, PLEASE CALL: ${pet.phone}
        </div>
        <script>
          window.onload = function() { window.print(); window.close(); }
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

// ========== MISSING PET EDIT & DELETE ==========
async function deleteMissingPet(id) {
  if (confirm("Are you sure you want to delete this report?")) {
    const { error } = await supabaseClient.from('missing_pets').delete().eq('id', id);
    if (error) {
      alert("Failed to delete. " + error.message);
    } else {
      loadPublicMissingPets();
    }
  }
}

function openEditModal(pet) {
  const modal = document.getElementById('edit-pet-modal');
  if (!modal) return;
  
  document.getElementById('edit-mp-id').value = pet.id;
  document.getElementById('edit-mp-pet-name').value = pet.pet_name || '';
  document.getElementById('edit-mp-species').value = pet.species_breed || '';
  document.getElementById('edit-mp-description').value = pet.description || '';
  document.getElementById('edit-mp-last-seen').value = pet.last_seen_location || '';
  document.getElementById('edit-mp-date').value = pet.date_last_seen || '';
  document.getElementById('edit-mp-message').value = formatFoundMessage(pet.other_details);
  
  modal.classList.add('active');
}

function closeEditModal() {
  const modal = document.getElementById('edit-pet-modal');
  if (modal) modal.classList.remove('active');
}

const editPetForm = document.getElementById('edit-pet-form');
if (editPetForm) {
  editPetForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-mp-id').value;
    
    // Find if it was marked as found to retain the marker
    const { data: petData } = await supabaseClient.from('missing_pets').select('other_details').eq('id', id).single();
    const currentlyFound = petData && isPetFound(petData);
    
    let baseMessage = document.getElementById('edit-mp-message').value.trim();
    let finalOtherDetails = currentlyFound ? `${FOUND_MARKER} ${baseMessage}`.trim() : baseMessage;

    const updates = {
      pet_name: document.getElementById('edit-mp-pet-name').value.trim(),
      species_breed: document.getElementById('edit-mp-species').value.trim(),
      description: document.getElementById('edit-mp-description').value.trim(),
      last_seen_location: document.getElementById('edit-mp-last-seen').value.trim(),
      date_last_seen: document.getElementById('edit-mp-date').value,
      other_details: finalOtherDetails
    };

    const { error } = await supabaseClient.from('missing_pets').update(updates).eq('id', id);
    if (error) {
      alert("Failed to update report. " + error.message);
    } else {
      closeEditModal();
      loadPublicMissingPets();
    }
  });
}

// ========== ACTIVE ADOPTIONS ==========
const activeAdoptionsList = document.getElementById('active-adoptions-list');
if (activeAdoptionsList) {
  loadActiveAdoptions();
}

async function loadActiveAdoptions() {
  const { data, error } = await supabaseClient
    .from('active_adoptions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    activeAdoptionsList.innerHTML = '<p class="loading-text">Unable to load adoptions right now.</p>';
    return;
  }

  if (!data || data.length === 0) {
    activeAdoptionsList.innerHTML = '<p class="loading-text">No active adoptions at the moment. Please check back later!</p>';
    return;
  }

  activeAdoptionsList.innerHTML = data.map(function (pet) {
    const isAdopted = pet.status === 'Adopted';
    const statusClass = isAdopted ? 'adoption-status--adopted' : 'adoption-status--available';
    
    const shareUrl = encodeURIComponent(window.location.href);
    const shareText = encodeURIComponent(`Adopt ${pet.name} (${pet.breed}). Look at this beautiful rescue!`);
    const whatsappLink = `https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`;
    const fbLink = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${shareText}`;

    return `
      <article class="card">
        ${pet.photo_url ? `<img src="${pet.photo_url}" alt="${pet.name}" class="card-image" style="height:250px;">` : ''}
        <div class="card-body">
          <span class="adoption-status ${statusClass}">${pet.status}</span>
          <h3>${pet.name}</h3>
          <p><strong>Breed:</strong> ${pet.breed || '-'}</p>
          <p><strong>Age:</strong> ${pet.age || '-'}</p>
          <p style="margin-top:0.5rem; margin-bottom: 1rem;">${pet.description}</p>
          <div class="share-buttons" style="border-top: 1px solid #eee; padding-top: 0.75rem;">
            <button class="btn-small" onclick="openApplyModal('${pet.id}')" style="background:#2d5016; color:white; margin-right:5px; border:none; cursor:pointer;">🐶 Apply to Adopt</button>
            <a href="${whatsappLink}" target="_blank" class="btn-small" style="background:#25D366; color:white; text-decoration:none; display:inline-block; margin-right:5px;">📱 WhatsApp</a>
            <a href="${fbLink}" target="_blank" class="btn-small" style="background:#1877F2; color:white; text-decoration:none; display:inline-block;">📘 Facebook</a>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// ========== ADOPTION APPLICATION ==========
function openApplyModal(petId = null) {
  if (!currentUser) {
    alert("Please log in to submit a trackable application!");
    window.location.href = "login.html";
    return;
  }
  const modal = document.getElementById('apply-modal');
  if (modal) {
    document.getElementById('apply-pet-id').value = petId || '';
    modal.classList.add('active');
  }
}

function closeApplyModal() {
  const modal = document.getElementById('apply-modal');
  if (modal) modal.classList.remove('active');
}

const applyForm = document.getElementById('apply-form');
if (applyForm) {
  applyForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    const petId = document.getElementById('apply-pet-id').value || null;
    const payload = {
      user_id: currentUser.id,
      adoption_id: petId,
      applicant_name: document.getElementById('apply-name').value.trim(),
      applicant_email: document.getElementById('apply-email').value.trim(),
      applicant_phone: document.getElementById('apply-phone').value.trim(),
      why_adopt: document.getElementById('apply-why').value.trim(),
      status: 'Pending'
    };

    const { error } = await supabaseClient.from('adoption_applications').insert([payload]);
    if (error) {
      alert("Failed to submit application: " + error.message);
    } else {
      alert("Application submitted successfully! You can track it in your Profile.");
      applyForm.reset();
      closeApplyModal();
      window.location.href = "profile.html";
    }
  });
}
