<div align="center">

# 🐾 Juno The Choco Lab
### Comprehensive Animal Welfare & NGO Platform

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-animal--welfare--ngo.vercel.app-2d5016?style=for-the-badge)](https://animal-welfare-ngo.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Rashi--Karule-181717?style=for-the-badge&logo=github)](https://github.com/Rashi-Karule/animal-welfare-ngo)
[![Supabase](https://img.shields.io/badge/Backend-Supabase-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com)

*"Every animal deserves to be seen, valued & loved."*

</div>

---

## 🌟 Executive Summary

**Juno The Choco Lab** is a robust, production-ready full-stack web platform built for animal welfare advocacy. Designed with a focus on usability, community engagement, and data-driven management, the platform bridges the gap between stray animals in need and compassionate individuals.

What started as a simple static website has evolved into a dynamic application featuring **user authentication**, **interactive geolocation**, **real-time application tracking**, and a **secure administrative dashboard**. By relying on pure vanilla web technologies combined with a powerful **Supabase Backend-as-a-Service (BaaS)**, the platform achieves blazing fast performance without the overhead of heavy frontend frameworks.

---

## 🚀 Key Objectives

1. **Facilitate Rescues & Reunions:** Provide a real-time, interactive board for reporting missing pets with map integrations to pinpoint exact last-seen locations.
2. **Streamline Adoptions:** Replace disjointed, third-party forms with native, trackable adoption applications integrated directly into user profiles.
3. **Centralize Administration:** Equip the NGO founder with a comprehensive admin dashboard to manage adoptions, review missing pet alerts, and manage incoming volunteers and contacts.
4. **Drive Community Action:** Empower users with one-click social sharing tools and auto-generated printable flyers to maximize exposure for animals in need.

---

## 💻 Tech Stack & Architecture

- **Frontend Core:** HTML5, CSS3 (Custom Variables, Flexbox, CSS Grid), Vanilla JavaScript (ES6+).
- **Backend & Database:** [Supabase](https://supabase.com/) (PostgreSQL).
- **Authentication:** Supabase Auth (Email/Password credentials).
- **Storage:** Supabase Storage buckets (for high-resolution pet photo uploads).
- **Mapping APIs:** [Leaflet.js](https://leafletjs.com/) with OpenStreetMap tiles for interactive geolocation.
- **Hosting & Deployment:** [Vercel](https://vercel.com/) (Frontend) connected to GitHub for CI/CD.

---

## ✨ Comprehensive Feature Breakdown

### 1. Robust User Authentication & Profiles
*   **Secure Sign-Up/Log-In:** Users can securely create accounts and authenticate via Supabase.
*   **Dynamic Navigation:** The UI adapts instantly upon login, replacing the login button with a personalized **Profile** and **Logout** tab.
*   **User Dashboard (`profile.html`):** A dedicated hub where users can:
    *   Track the live status of their adoption applications (e.g., Pending, Approved, Rejected).
    *   Manage missing pet reports they have submitted (with quick links to view them publicly).

### 2. Missing Pet Helpline & Interactive Maps
*   **Geolocation Integration:** When reporting a missing pet, users can drop a precise pin on an interactive **Leaflet Map**.
*   **Dynamic Map Links:** Public missing pet cards automatically generate Google Maps routing links based on the saved latitude and longitude.
*   **Ownership Controls:** Logged-in users who reported a missing pet see exclusive "Edit" and "Delete" buttons on their own posts.
*   **Found Status Toggle:** Users can update their reports by adding `[[FOUND]]` to the description, dynamically changing the UI badge to a green "Found" status.

### 3. Print & Social Sharing Tools
*   **Auto-Generated Printable Flyers:** A built-in "🖨️ Print Flyer" button that extracts the pet's photo, name, and contact details, formats them into a high-contrast missing poster, and natively launches the browser's print dialog.
*   **One-Click Social Sharing:** Pre-formatted deep links allow users to instantly share a pet's profile to **WhatsApp** and **Facebook**, auto-populating the message text and URL to drive immediate community awareness.

### 4. Native Adoption Application Tracking
*   **Direct-on-Site Applications:** Transitioned from external Google Forms to a native modal-based application system. Users click "🐶 Apply to Adopt", filling out their motivations directly on the platform.
*   **Database Linking:** Applications are securely linked via Foreign Keys to both the `auth.users` table (the applicant) and the `active_adoptions` table (the specific dog).

### 5. Secure Admin Dashboard (`admin.html`)
A password-protected hub built for the NGO founder to oversee all operations:
*   **Analytics Overview:** Top-level metric cards displaying counts of active adoptions, pending applications, registered volunteers, and newsletter subscribers.
*   **Tabbed Interface:** Clean, JavaScript-driven UI switching between datasets without page reloads.
*   **Adoption Management:** The admin can upload new rescues (complete with photo uploads to Supabase Storage) and delete adopted pets.
*   **Application Review:** The admin can view incoming adoption requests and click "Approve" or "Reject", immediately updating the status on the applicant's frontend profile dashboard.

---

## 🗄️ Database Schema & Structure

The platform relies on a normalized PostgreSQL database hosted on Supabase:

1.  **`missing_pets`**:
    *   Stores `pet_name`, `species_breed`, `last_seen_location`, `description`, `photo_url`.
    *   *Geospatial fields:* `lat` (FLOAT), `lng` (FLOAT).
    *   *Relational fields:* `owner_id` (UUID references `auth.users`).
2.  **`active_adoptions`**:
    *   Stores `name`, `breed`, `age`, `description`, `status` (Available/Adopted).
3.  **`adoption_applications`**:
    *   *Relational fields:* `user_id` (UUID references `auth.users`), `adoption_id` (UUID references `active_adoptions`).
    *   Stores applicant data (`applicant_name`, `phone`, `why_adopt`) and tracking `status` (Pending/Approved/Rejected).
4.  **`volunteer_signups`**, **`contact_messages`**, **`newsletter_subscribers`**: Dedicated tables for capturing community engagement and CRM data.

---

## 🎨 UI/UX Enhancements

*   **Premium CSS Highlights:** Important navigation actions (Adopt, Missing Pet) utilize pill-shaped highlight outlines for clear visual hierarchy.
*   **Responsive Dropdowns:** A cleanly structured "More ▾" dropdown minimizes navbar clutter while retaining accessibility to secondary pages.
*   **Graceful Degradation:** The platform remains functional even if JavaScript maps fail to load, falling back to text-based location inputs.
*   **Feedback Loops:** Comprehensive success/error notifications using browser alerts and dynamic HTML DOM updates ensure the user always knows the state of their interactions.

---

## 🔮 Future Scope & Expansion Possibilities

*   **Email Notifications Pipeline:** Connecting Supabase Edge Functions with an email provider (like Resend or SendGrid) to automatically notify the admin when a new application is submitted.
*   **Role-Based Access Control (RBAC):** Transitioning the client-side password protection on the Admin Dashboard to true server-side Supabase Row Level Security (RLS) policies based on user roles.
*   **Payment Gateway Integration:** Adding Razorpay/Stripe links for direct, traceable donations for specific rescues.

---

### Author
Designed and Developed for **Malvika Vazalwar**
*A project demonstrating full-stack proficiency, database architecture, and user-centric web design.*
