# Animal Welfare NGO Website

A fully functional, responsive website for an animal welfare NGO community. Built with **HTML**, **CSS**, and **JavaScript**—no heavy frameworks. Design is warm, nature-inspired (green, beige, white), with smooth scroll animations and accessible, mobile-friendly layout.

---

## Folder structure

```
animal-welfare-ngo/
├── index.html          # Home
├── about.html          # About the NGO & Founder
├── adopt.html          # Adopt (Indie dogs, process, form link)
├── community.html      # Community (news, jobs, advocacy, blog)
├── missing-pet.html    # Missing Pet Helpline (report form + alerts)
├── blog.html           # Advocacy & Blog (videos + articles)
├── volunteer.html      # Volunteer sign-up form
├── contact.html        # Contact form, email, map placeholder
├── css/
│   └── styles.css      # All styles (variables, layout, components)
├── js/
│   └── script.js       # Nav, scroll reveal, forms, stats counter
├── images/             # (Optional) Add your own images here
└── README.md           # This file
```

---

## Features

- **Sticky navigation** with scroll shadow and mobile hamburger menu  
- **Smooth scrolling** (CSS `scroll-behavior: smooth`)  
- **Scroll reveal** animations on sections  
- **Impact statistics** counter (animates when section is in view)  
- **Form validation** on Contact, Volunteer, Missing Pet, and Newsletter forms  
- **Embedded YouTube videos** on Blog (opinion piece + Hindi care tip)  
- **Placeholder images** via placehold.co (replace with your own in `/images`)  
- **Newsletter signup** and **CTA** buttons (Adopt, Volunteer, Donate)  
- **Responsive** layout using Flexbox and CSS Grid  

---

## Running locally

1. **Option A — Open directly in browser**  
   - Double-click `index.html`, or  
   - Right-click → Open with → your browser  

2. **Option B — Local server (recommended, e.g. for correct paths)**  
   - **Python 3:**  
     ```bash
     cd animal-welfare-ngo
     python3 -m http.server 8000
     ```  
     Then open: **http://localhost:8000**  

   - **Node (npx):**  
     ```bash
     cd animal-welfare-ngo
     npx serve
     ```  
     Then open the URL shown (e.g. http://localhost:3000).  

   - **VS Code Live Server:**  
     Right-click `index.html` → “Open with Live Server”.  

No build step or install is required; the site is static HTML/CSS/JS.

---

## Deploying

### Netlify

1. Sign up / log in at [netlify.com](https://www.netlify.com).  
2. **Drag & drop:**  
   - Go to [app.netlify.com/drop](https://app.netlify.com/drop).  
   - Drag the **animal-welfare-ngo** folder.  
   - Netlify will give you a live URL.  

3. **Deploy from Git (optional):**  
   - Push the project to a GitHub/GitLab/Bitbucket repo.  
   - In Netlify: **Add new site → Import an existing project** → connect the repo.  
   - **Build settings:**  
     - Build command: *(leave empty)*  
     - Publish directory: `.` (or the folder that contains `index.html`)  
   - Deploy.  

No build command is needed; Netlify will serve the static files.

### GitHub Pages

1. Create a GitHub repository and push the **animal-welfare-ngo** contents (so that `index.html` is at the **root** of the repo, or inside a folder you will set as the source).  

2. In the repo: **Settings → Pages**.  
   - **Source:** Deploy from a branch.  
   - **Branch:** `main` (or your default branch), folder **/ (root)**.  
   - Save.  

3. After a minute or two, the site will be at:  
   `https://<username>.github.io/<repo-name>/`  
   If you put the site in a subfolder (e.g. `docs/`), set “Source” to that folder and the URL will include it.

---

## Customisation

- **Placeholder images:** Replace `https://placehold.co/...` URLs in the HTML with your own images (e.g. in an `images/` folder).  
- **Adoption form:** Update the “Open Adoption Interest Form” link in `adopt.html` to your real Google Form (or other form) URL.  
- **Contact email:** Replace `contact@animalwelfarengo.org` in `contact.html` and footer with your email.  
- **Google Maps:** Replace the map placeholder in `contact.html` with an iframe embed from Google Maps.  
- **Social links:** Update the `href` values in the footer (and contact page) to your real Facebook, Instagram, Twitter, YouTube, etc.  

---

## Browser support

Modern browsers (Chrome, Firefox, Safari, Edge). Uses standard HTML5, CSS3 (variables, Grid, Flexbox), and vanilla JavaScript (ES5-style for broad compatibility).

---

## Licence

Use and modify as needed for your NGO. No warranty. Built with compassion for animals.
