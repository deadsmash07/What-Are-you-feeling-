# Momentary Journal

**[Live Demo](https://whatareyoufeeling.vercel.app)**

A simple, private, and ephemeral journaling app designed for guided self-reflection. Your thoughts are yours alone—nothing is ever saved or stored.

![Momentary Journal Screenshot](image.png)

---

## ✨ Key Features

*   **Privacy First**: Your answers remain completely private. The app is 100% client-side, and no data is ever sent to a server or stored in any database.
*   **Guided Prompts**: Explore dozens of thoughtfully designed categories, each with focused questions inspired by established psychological principles (CBT, Positive Psychology, etc.).
*   **Emotional Categorization**: Quickly find relevant prompts by browsing high-level classes like *Emotional Well-being*, *Personal Growth*, and *Relationships*.
*   **Beautiful & Minimalist UI**: A clean, calming interface with subtle animations to help you focus on your thoughts.
*   **Frictionless Experience**: No login, no signup. Just open the page and start reflecting.
*   **Instant & Ephemeral**: Designed for in-the-moment reflection. Once you complete a session, your answers are gone, encouraging you to focus on the process, not the record.

## 🛠️ Tech Stack

*   **Frontend**: HTML5, CSS3, JavaScript (ES6+)
*   **Framework**: [Alpine.js](https://alpinejs.dev/) for lightweight reactivity.
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) (via CDN) for utility-first styling.
*   **Animations**: Custom CSS animations and [Canvas-Confetti](https://github.com/catdad/canvas-confetti) for a little celebration.

## 🚀 Getting Started (Local Preview)

This is a pure static site. No build step required.

1. **Clone the repository**
    ```bash
    git clone https://github.com/deadsmash07/What-Are-you-feeling-.git
    cd What-Are-you-feeling-
    ```
2. **(Option A) Open `index.html` directly** – double‑click it (some features like fetch may require a server in certain browsers).
3. **(Option B, recommended) Use a tiny local server** so `fetch('questions.json')` always works:
    ```bash
    # Python 3
    python3 -m http.server 5173
    # or Node (if installed)
    npx serve -p 5173
    ```
    Then visit: http://localhost:5173/
4. Edit files (e.g. `index.html`, `js/app.js`) and refresh.

### Deploying (Vercel)
Push changes to `main` (or create a PR) and Vercel will auto‑deploy. Check the Vercel dashboard for build & analytics.

## 📈 SEO & Analytics

Implemented enhancements:
* Meta: title, description, canonical, robots, theme-color
* Open Graph + Twitter Card
* JSON-LD (SoftwareApplication + ItemList)
* `robots.txt` + `sitemap.xml` + `manifest.json`
* Accessible landmarks & skip link

### Google Analytics (GA4)
1. Create GA4 property at https://analytics.google.com
2. Web Data Stream → copy Measurement ID (looks like `G-XXXXXXXXXX`).
3. In `index.html`, replace both instances of `G-XXXXXXXXXX`.
4. Deploy. Verify real‑time traffic in GA.

### Google Search Console
1. Go to https://search.google.com/search-console
2. Add property (Domain or URL prefix). If URL prefix, uncomment the `google-site-verification` meta tag in `<head>` and redeploy.
3. Submit `https://whatareyoufeeling.vercel.app/sitemap.xml`.
4. Use URL Inspection → Request Indexing for homepage.

### Performance Ideas (Future)
* Generate a production Tailwind build to reduce CSS.
* Add hash-based deep links to categories (e.g. `#c=anxiety`).
* Local persistence (optional toggle) using `localStorage` (currently intentionally ephemeral).

## 💡 Project Philosophy

The core idea behind Momentary Journal is to provide a safe, private space for reflection without the pressure of creating a permanent archive. It's about the *act* of thinking and writing, not the artifact. By being ephemeral, it encourages honest, in-the-moment introspection.

## ❤️ Author

This project was created with ❤️ by **deadsmash07**.

*   **GitHub**: [@deadsmash07](https://github.com/deadsmash07)

## 🤝 Contributing
Small improvements (typos, accessibility, new prompt categories) welcome. Open an issue first for larger changes.

## 🛡️ Privacy Note
All logic runs client‑side; no databases, cookies (beyond GA if enabled), or external POST requests. Disable GA by removing its script block if you prefer full anonymity.

Reflect today for a better tomorrow.

