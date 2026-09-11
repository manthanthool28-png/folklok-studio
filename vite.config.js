import { copyFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * GitHub Pages serves static files only — it has no rewrite rule, so a deep
 * link like /folklok-studio/shows hits a file that doesn't exist and 404s,
 * even though the app can render that route client-side. Pages does serve
 * 404.html for any miss, so shipping a copy of index.html under that name
 * makes every URL boot the app, which then routes correctly.
 *
 * This matters more than it sounds: every link shared to Instagram or WhatsApp
 * is a deep link, and without this each one lands on a 404.
 */
function githubPagesSpaFallback() {
  return {
    name: 'gh-pages-spa-fallback',
    closeBundle() {
      const dist = resolve(__dirname, 'dist');
      copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'));
    },
  };
}

// Served from https://manthanthool28-png.github.io/folklok-studio/, so assets
// resolve under that subpath rather than the domain root. If a custom domain
// is added later, this goes back to '/' (BASENAME in App.jsx follows it).
export default defineConfig({
  base: '/folklok-studio/',
  plugins: [react(), tailwindcss(), githubPagesSpaFallback()],
  server: { port: 3000 },
  preview: { port: 4173, strictPort: true },
});
