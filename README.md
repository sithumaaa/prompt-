# PromptVault — Curated AI Image Prompt Library

PromptVault is a highly polished, responsive, and blazing fast curated repository for viral AI visual prompt systems (such as Midjourney v6, DALL-E 3, Stable Diffusion XL, and Adobe Firefly). Built with **React 19**, **Vite**, **TypeScript**, and styled with **Tailwind CSS**, it implements a beautiful and professional design theme.

---

## 🚀 Instant Deployment (Netlify, Vercel, etc.)

This repository comes pre-configured with a `netlify.toml` production configuration file. 

To host the site live:
1. **GitHub integration:** Just import this project repository into **Netlify** or **Vercel**.
2. **Auto-detection:** The systems will automatically detect the build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
3. **Done!** Your site will build and deploy instantly with robust SPA redirection support on route refresh.

---

## 💻 Local Development

Follow these simple steps to run and view the application locally on your machine:

### 1. Prerequisite
Ensure you have **Node.js** (v18 or higher recommended) installed. You can download it from [nodejs.org](https://nodejs.org/).

### 2. Live Server Instructions
1. **Extract the Downloaded ZIP** into a folder of your choice.
2. Open your terminal inside that folder.
3. **Install Dependencies:**
   ```bash
   npm install
   ```
4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
5. Click the link in the terminal (usually `http://localhost:3000`) to open and run the app.

---

## 📦 Production compilation & Standalone offline use

To generate static, self-contained assets that can be distributed or opened anywhere:

1. Compile the production bundle:
   ```bash
   npm run build
   ```
2. This creates a folder named `dist/` in your root directory.
3. 🎉 **Relative Paths Enabled:** We have specifically pre-configured the build runner (`vite.config.ts`) with a relative asset root (`base: './'`). This means your built site inside `dist/` can be run straight out of any subfolder or subdirectory without absolute path/routing issues!

To serve the `dist/` folder locally, you can use any standard static server like Python's built-in tool or VS Code's Live Server:
```bash
# Serves the compiled site on http://localhost:8000
python3 -m http.server --directory dist
```

---

## 🛠 Project Architecture

- `/public/data/prompts.json` — **The Master Data File**. Add, modify, or update prompt items inside this file to dynamically reflect across the dashboard without touching code!
- `/src/App.tsx` — Main router and application wrapper.
- `/src/components/` — Modular, highly styled page views (Header, Hero, PromptCard, CategoryPage, PromptDetail, TrendingRow).
- `/src/index.css` — Modern styling configuration containing Tailwind CSS theme definitions and custom design system attributes.
