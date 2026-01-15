# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website for Rob LeGood, hosted on Cloudflare Pages. It consists of static HTML files with shared CSS styling.

## Architecture

- **Static site**: Pure HTML/CSS with no build process or dependencies
- **Pages**: `index.html` (home/landing page), `about.html` (detailed bio and contact)
- **Styling**: `styles.css` contains all styles shared across pages
- **Scripts**: `scripts/` folder contains JavaScript files, each with a single purpose
  - `weather.js`: Fetches and displays current weather from Open-Meteo API
- **Hosting**: Cloudflare Pages (deploy by pushing to main branch)

## Development

No build commands required. Open HTML files directly in a browser for local preview.

## Design System

The site uses CSS custom properties in `styles.css` for consistent theming:
- `--bg-primary`, `--bg-secondary`, `--bg-tertiary`: Background colors (dark slate palette)
- `--text-primary`, `--text-secondary`: Text colors
- `--accent`, `--accent-hover`: Amber accent color for CTAs and highlights

## Style Guidelines

- All styles belong in `styles.css` - do not use inline `<style>` blocks in HTML files
- New pages should link to the shared stylesheet: `<link rel="stylesheet" href="styles.css">`

## JavaScript Guidelines

- Each script file should have a single, well-defined purpose
- All scripts belong in `scripts/` - do not use inline `<script>` blocks in HTML files
- Scripts are loaded at the end of HTML files before `</body>`
- Use IIFEs to avoid polluting the global namespace
