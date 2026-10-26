import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'es2022',
    // three.js (~130 kB gz) is one lazy chunk loaded after first paint, so the size warning is expected
    chunkSizeWarningLimit: 600,
    cssCodeSplit: true,
    assetsInlineLimit: 2048,
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        casestudy: resolve(import.meta.dirname, 'casestudy/index.html'),
        notfound: resolve(import.meta.dirname, '404.html'),
        privacy: resolve(import.meta.dirname, 'privacy/index.html'),
      },
      output: {
        // three.js lives in its own long-cached chunk, loaded after first paint
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'three';
          if (id.includes('node_modules/gsap') || id.includes('node_modules/lenis')) return 'motion';
        },
      },
    },
  },
});
