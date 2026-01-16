# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website for Rob LeGood, hosted on Cloudflare Pages. It consists of static HTML files with modular CSS styling.

## Architecture

- **Static site**: Pure HTML/CSS with no build process or dependencies
- **Pages**: `index.html` (home/landing page), `about.html` (career timeline), `boardgames.html`, `blog.html`
- **Styling**: `styles/` folder contains modular CSS files
- **Scripts**: `scripts/` folder contains JavaScript files, each with a single purpose
  - `weather.js`: Fetches and displays current weather from Open-Meteo API
  - `random-title.js`: Displays random job titles in the navbar
  - `timeline.js`: Handles career timeline animations and navigation
  - `blog.js`: Fetches and renders blog posts from Contentful
  - `boardgames.js`: Renders boardgame cards from JSON data
  - `geocities.js`: Easter egg that toggles 90s nostalgia mode
- **Hosting**: Cloudflare Pages (deploy by pushing to main branch)

## Development

No build commands required. Open HTML files directly in a browser for local preview.

## Design System

The site uses CSS custom properties in `styles/styles.css` for consistent theming:
- `--bg-primary`, `--bg-secondary`, `--bg-tertiary`: Background colors (dark slate palette)
- `--text-primary`, `--text-secondary`: Text colors
- `--accent`, `--accent-hover`: Amber accent color for CTAs and highlights

## CSS Guidelines

- All CSS files belong in `styles/` folder
- Common styles go in `styles/styles.css`
- Page-specific styles go in their own file (e.g., `styles/blog.css`)
- Refactor page-specific CSS to common if used in more than one location
- **All site-specific classes must use "rl-" prefix** to prevent naming clashes
- Do not use inline `<style>` blocks in HTML files
- New pages should link to common stylesheet plus page-specific:
  ```html
  <link rel="stylesheet" href="styles/styles.css">
  <link rel="stylesheet" href="styles/[page].css">
  ```

### CSS File Structure
```
styles/
  styles.css      - Common styles (nav, footer, buttons, typography)
  index.css       - Hero section, highlights, weather widget
  about.css       - Timeline components, contact section
  boardgames.css  - Game card layouts
  blog.css        - Blog layout, sidebar, post styling
  geocities.css   - Easter egg 90s mode styling
```

## JavaScript Guidelines

- Each script file should have a single, well-defined purpose
- All scripts belong in `scripts/` - do not use inline `<script>` blocks in HTML files
- Scripts are loaded at the end of HTML files before `</body>`
- Use IIFEs to avoid polluting the global namespace
- Use "rl-" prefix when referencing CSS classes in JavaScript
