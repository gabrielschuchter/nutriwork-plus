import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vike from 'vike/plugin';
import { newsContentPlugin } from './build/news-content-plugin';

export default defineConfig({
  plugins: [react(), newsContentPlugin(), vike({ prerender: true })],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: false
  }
});

