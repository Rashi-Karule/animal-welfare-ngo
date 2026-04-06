<div align="center">

# 🐾 Juno The Choco Lab
### Animal Welfare NGO — Full Stack Website

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-animal--welfare--ngo.vercel.app-2d5016?style=for-the-badge)](https://animal-welfare-ngo.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Rashi--Karule-181717?style=for-the-badge&logo=github)](https://github.com/Rashi-Karule/animal-welfare-ngo)
[![Supabase](https://img.shields.io/badge/Backend-Supabase-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com)

*"Every animal deserves to be seen, valued & loved."*

</div>

---

## 🌟 Overview

**Juno The Choco Lab** is a fully functional, production-deployed website for an animal welfare NGO based in India. Built for **Malvika Vazalwar**, founder and animal welfare advocate, the platform enables community-driven rescue, adoption, and advocacy — connecting animals in need with compassionate humans.

The site features a complete **Supabase backend**, password-protected **admin dashboard**, live **missing pet helpline**, and seamless volunteer management — all built with zero frameworks, pure vanilla web technologies.

---

## ✨ Features

### 🐕 Public Pages (8 pages)
- **Home** — Mission statement, impact statistics with animated counters, YouTube advocacy content
- **About** — Founder's story, team, and NGO philosophy
- **Adopt** — Adoption listings and process guide
- **Community** — Events, community stories, and updates
- **Missing Pet Helpline** — Report missing pets with photo upload
- **Blog** — Advocacy articles and animal welfare content
- **Volunteer** — Sign-up form with role-based options
- **Contact** — Contact form + newsletter subscription

### 🗄️ Backend (Supabase)
- **4 relational tables** — `volunteer_signups`, `missing_pets`, `contact_messages`, `newsletter_subscribers`
- **Supabase Storage** — Photo uploads for missing pet reports (`pet-photos` bucket)
- **REST API integration** — Real-time form submissions via Supabase JS SDK
- **Custom RLS policies** — Storage security for file uploads

### 🔐 Admin Dashboard (`/admin.html`)
- Password-protected login screen
- Live stats — total volunteers, missing pet reports, messages, subscribers
- 4-tab data view with sortable tables
- Photo preview links for missing pet reports
- No external CMS needed — built entirely in vanilla JS

### 🎨 Frontend
- Fully **mobile-responsive** design
- **Scroll reveal animations** — elements animate as you scroll
- **Animated impact counters** — numbers count up on scroll
- Sticky navigation with scroll shadow
- Mobile hamburger menu

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Supabase (PostgreSQL) |
| Storage | Supabase Storage |
| Auth | Custom password-based admin login |
| Deployment | Vercel |
| Version Control | Git + GitHub |

---

## 📁 Project Structure

```
animal-welfare-ngo/
├── index.html          # Home page
├── about.html          # About page
├── adopt.html          # Adoption page
├── community.html      # Community page
├── missing-pet.html    # Missing pet helpline
├── blog.html           # Blog page
├── volunteer.html      # Volunteer sign-up
├── contact.html        # Contact + newsletter
├── admin.html          # 🔐 Admin dashboard
├── css/
│   └── styles.css      # All styling
├── js/
│   └── script.js       # All JS + Supabase integration
└── images/             # Site images
```

---

## 🗃️ Database Schema

```sql
-- Volunteer sign-ups
volunteer_signups (id, name, email, phone, city, how_to_help, message, created_at)

-- Missing pet reports
missing_pets (id, name, email, phone, pet_name, species_breed,
              description, last_seen_location, date_last_seen,
              other_details, photo_url, created_at)

-- Contact messages
contact_messages (id, name, email, subject, message, created_at)

-- Newsletter subscribers
newsletter_subscribers (id, email, created_at)
```

---

## 🚀 Getting Started

### Prerequisites
- A browser + Live Server (VS Code extension) for local development
- Supabase account (for backend)
- Vercel account (for deployment)

### Run Locally
```bash
# Clone the repo
git clone https://github.com/Rashi-Karule/animal-welfare-ngo.git

# Open in VS Code
cd animal-welfare-ngo

# Run with Live Server
# Right click index.html → Open with Live Server
```

> ⚠️ Must use Live Server (`http://`) — Supabase does not work on `file://` protocol
---

## 🔐 Admin Access

The admin dashboard is accessible at:
```
https://animal-welfare-ngo.vercel.app/admin.html
```
Password-protected — contact the project owner for credentials.

---

## 👩‍💻 Developer

Built with 💚 by **Rashi Karule**

[![GitHub](https://img.shields.io/badge/GitHub-Rashi--Karule-181717?style=flat&logo=github)](https://github.com/Rashi-Karule)

---

## 💛 Built For

Built for **Malvika Vazalwar** — Animal welfare advocate, Founder of Juno The Choco Lab, and the human behind Juno 🐶

> *"Their treatment reflects the consciousness of our society."*

---

<div align="center">
🐾 <i>Every commit made here helped an animal find a home.</i> 🐾
</div>
