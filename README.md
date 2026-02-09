# Prashant Ahirwar — Portfolio

A playful, animated single-page portfolio built with **vanilla HTML/CSS/JS**.
It includes scroll-based motion, interactive “playground” sections, and a **secure contact flow** that sends emails through a small Node/Express backend so secrets stay off the frontend.

## What’s inside ✨

### Sections
- **Hero**: animated name + CTA
- **About**: narrative + timeline
- **Skills**: chessboard-style skills grid + interactive floating icon playground
- **Projects**: responsive project cards
- **Playground**: particle text canvas that reacts to pointer/touch
- **Contact**: validated form that sends messages via backend

### Interaction highlights
- **Anime.js** micro-interactions and scroll reveals
- **particles.js** background configured via `particlejs-config.json`
- **Skills floating icons** playground (physics, scattering/repulsion, mobile/touch support)
- **Particle name canvas** (“PRASHANT”) that scatters dots on hover/touch and reforms on idle

## Tech stack

### Frontend
- HTML5 / CSS3 / Vanilla JS (ES modules)
- [Anime.js](https://animejs.com/) for animations
- [particles.js](https://vincentgarreau.com/particles.js/) for background particles

### Email backend (optional but recommended)
- Node.js + Express
- `cors`, `dotenv`
- `@emailjs/nodejs` (EmailJS server SDK)

## Project structure

```
.
├─ index.html
├─ particlejs-config.json
├─ assets/
│  ├─ images/
│  └─ svg/
├─ css/
│  ├─ reset.css
│  ├─ variables.css
│  ├─ global.css
│  ├─ layout.css
│  ├─ navbar.css
│  ├─ hero.css
│  ├─ about.css
│  ├─ skills.css
│  ├─ projects.css
│  ├─ fun.css
│  └─ contact.css
├─ js/
│  ├─ main.js          # bootstraps all modules on DOMContentLoaded
│  ├─ animations.js    # Anime.js animation helpers
│  ├─ scroll.js        # scroll reveal logic
│  ├─ nav.js           # mobile drawer navigation logic
│  ├─ skills.js        # skills floating icons playground
│  ├─ particles.js     # particles.js bg + PRASHANT particle canvas
│  ├─ form.js          # contact form submit + UX
│  ├─ dom.js           # small DOM helpers
│  └─ utils.js         # utilities
└─ email-backend/
	 ├─ server.js        # POST /send-email
	 ├─ package.json
	 ├─ .env             # local only (do not commit)
	 ├─ package-lock.json
	 └─ node_modules/
```

## Run locally (frontend)

This is a static site. Use a local server so ES modules + fetch behave correctly.

### Option A: Python

```powershell
cd "c:\Users\prash\OneDrive\Desktop\pf"
python -m http.server 5500
```

Open:
- `http://localhost:5500/`

### Option B: VS Code Live Server

If you have the Live Server extension installed, right-click `index.html` → **Open with Live Server**.

## Run locally (email backend)

The frontend is configured to send the contact form to the endpoint stored in:

- `index.html` → `#contactForm[data-backend-url]`

Default local value in this repo:

- `http://localhost:5000/send-email`

### 1) Install backend dependencies

```powershell
cd "c:\Users\prash\OneDrive\Desktop\pf\email-backend"
npm install
```

### 2) Configure environment variables

Create/update `email-backend/.env`:

```env
PORT=5000
FRONTEND_ORIGIN=http://localhost:5500

EMAILJS_SERVICE_ID=your_service_id
EMAILJS_TEMPLATE_ID=your_template_id
EMAILJS_PUBLIC_KEY=your_public_key
EMAILJS_PRIVATE_KEY=your_private_key
```

Notes:
- `FRONTEND_ORIGIN` can be a comma-separated list. Use `*` to allow all origins (not recommended for production).
- Keep `.env` private (it contains the EmailJS private key).

### 3) Start the backend

```powershell
npm start
```

Health check:
- `GET http://localhost:5000/health`

## Contact form API

### `POST /send-email`

**Request JSON**

```json
{
	"name": "Your Name",
	"email": "you@example.com",
	"message": "Hello!"
}
```

**Response JSON**

- Success:
	- `{ "success": true }`
- Failure:
	- `{ "success": false, "error": "..." }`

## Deployment

### Frontend (static)
- Works great on Vercel / Netlify / GitHub Pages.

### Backend options

1) **Deploy `email-backend/` as a small Node service** (Render/Railway/Fly/etc.)
	 - Set env vars on the host.
	 - Update `data-backend-url` in `index.html` to your production endpoint.
	 - Set `FRONTEND_ORIGIN` to your deployed frontend URL.

2) **Convert to serverless** (e.g., Vercel Functions)
	 - Move the send logic into `/api/send-email`.
	 - Keep keys only in Vercel environment variables.

## Customization

### Update particle text
- File: `js/particles.js`
- Look for: `config.text = 'PRASHANT'`

### Update tech icons
- Skills grid icons and floating icons are in `index.html` inside `#skills`.
- SVG icons live in `assets/svg/`.

### Update particle background
- Config file: `particlejs-config.json`

### Playground doesn’t react on mobile
- Ensure you’re serving via HTTP (not opening `index.html` directly from disk).
- Touch interaction depends on pointer/touch events; a local server avoids some browser restrictions.

## Security notes

- Do **not** put EmailJS private keys in the browser.
- Keep `email-backend/.env` out of git.
- In production, restrict CORS to your real frontend domain.
