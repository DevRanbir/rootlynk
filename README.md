# Personal Timeline Website

A beautiful, responsive personal timeline website built with React, Vite, Tailwind CSS, and Shadcn UI.

## Features

- **Interactive Timeline**: Scroll-triggered animations using Framer Motion.
- **Dark/Light Mode**: Toggle between themes.
- **Responsive**: Optimized for mobile and desktop.
- **Customizable**: Easy to update content via `src/data.tsx`.

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## Customization

- **Content**: Edit `src/data.tsx` to update your bio, timeline entries, social links, and projects.
- **Styling**: Tailwind CSS is used for styling. You can customize the theme in `tailwind.config.js` and `src/index.css`.

## Deployment

This project is configured for deployment to GitHub Pages.

1. Update `vite.config.ts` `base` property if your repository name is different or if you are deploying to a custom domain.
2. Run:
   ```bash
   npm run deploy
   ```
