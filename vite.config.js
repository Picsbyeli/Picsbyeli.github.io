import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages deployment: base must match the repository subpath
// Repo name assumed: E.vol (user specified). Adjust if repo name changes.
export default defineConfig({
  plugins: [react()],
  base: '/E.vol/',
  build: {
    outDir: 'dist'
  }
});
