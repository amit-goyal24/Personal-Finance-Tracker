# Deployment Guide for Personal Finance Tracker

This project is built with **Vanilla HTML/CSS/JS** using ES6 Modules. It can be hosted for free on any static site provider.

## Option 1: Netlify (Recommended - Easiest)
1.  **Sign Up** at [Netlify.com](https://www.netlify.com/).
2.  **Drag & Drop**:
    - Locate your project folder `Personal-finance-tracker` on your computer.
    - Drag the **entire folder** into the "Sites" area on the Netlify dashboard.
3.  **Done!** Netlify will give you a live URL (e.g., `https://finance-tracker-amit.netlify.app`).

## Option 2: GitHub Pages
1.  **Create a Repo**: Go to GitHub and create a new repository called `personal-finance-tracker`.
2.  **Push Code**:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/personal-finance-tracker.git
    git push -u origin main
    ```
3.  **Activate Pages**:
    - Go to Repo **Settings** > **Pages**.
    - Select **Source** as `Deploy from a branch`.
    - Select `main` branch and `/ (root)` folder.
    - Click **Save**.
4.  **Wait**: In a minute, your site will be live at `https://YOUR_USERNAME.github.io/personal-finance-tracker/`.

## Troubleshooting
- **Modules Error?**: If you open `index.html` directly on your desktop, it might not work because of browser security (CORS). Hosting it (Netlify/GitHub) fixes this automatically.
- **Data Missing?**: `localStorage` is saved to your specific browser/device. Users visiting your live link will see their own empty data initially.
