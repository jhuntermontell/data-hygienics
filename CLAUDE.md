# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server at http://localhost:3000
npm run build    # Build for production
npm run start    # Run production build
npm run lint     # Run ESLint
```

There are no tests in this project.

## Architecture

This is a **Next.js 15 App Router** website for "Data Hygienics" — an IT consulting business. It uses React 19, Tailwind CSS v4, and JavaScript (no TypeScript).

**Routing**: All pages live under `app/` using Next.js file-based routing. Each route is a directory with a `page.js` file.

**Navbar**: `app/components/Navbar.jsx` is a shared fixed-position navbar. It must be manually imported and rendered at the top of each page — there is no global layout that includes it. New pages should follow the same pattern.

**Client vs Server components**: Pages are Server Components by default. The contact page uses `"use client"` because it needs React state for form handling.

**Contact form**: Submits to Formspree (`https://formspree.io/f/mdkeovqy`) via `fetch` — no backend API routes exist.

**Styling**: Tailwind utility classes inline in JSX. Dark theme throughout (gray-900/800/700 backgrounds, blue-400/300 accents, white text). The `public/output.css` is a compiled Tailwind output file.
