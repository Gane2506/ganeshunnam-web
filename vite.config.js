import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { defineConfig } from 'vite';

// Runs before any stylesheet so the page never flashes the wrong theme. Its sha256 goes in the CSP
// (deploy/nginx/ganeshunnam.conf); `npm run build` prints it, so update the CSP if this line changes.
export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('theme');if(!t)t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;
export const THEME_SCRIPT_HASH = `sha256-${createHash('sha256').update(THEME_SCRIPT).digest('base64')}`;

const COMMON_HEAD = `<meta name="theme-color" content="#0B0B0F" media="(prefers-color-scheme: dark)" />
    <meta name="theme-color" content="#F3EEE4" media="(prefers-color-scheme: light)" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Ganesh Unnam" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="icon" href="/favicon.ico" sizes="32x32" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <link rel="preload" href="/fonts/space-grotesk.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/fonts/inter-tight.woff2" as="font" type="font/woff2" crossorigin />`;

// Shared, page-independent layers: the WebGL stage (poster first), the curtain and the cursor.
const CHROME = `<div class="stage" aria-hidden="true"><div class="gu-mesh"></div><canvas id="gl"></canvas><div class="gu-grain"></div></div>
    <div class="gu-curtain" aria-hidden="true"><span class="gu-logo"><svg viewBox="4.6 47.4 138.8 71.0"><path fill="currentColor" d="M4.6 73.8V72.2Q4.6 64.4 7.7 58.9Q10.8 53.3 16 50.4Q21.1 47.4 27.2 47.4Q34 47.4 37.5 49.8Q41 52.2 42.6 54.8H44.4V48.8H56.8V107.2Q56.8 112.3 53.8 115.4Q50.8 118.4 45.8 118.4H12.6V107.4H41.4Q44.2 107.4 44.2 104.4V91.5H42.4Q41.4 93.1 39.6 94.8Q37.8 96.4 34.8 97.5Q31.8 98.6 27.2 98.6Q21.1 98.6 16 95.7Q10.8 92.7 7.7 87.2Q4.6 81.6 4.6 73.8ZM30.8 87.6Q36.6 87.6 40.5 83.9Q44.4 80.2 44.4 73.5V72.5Q44.4 65.7 40.6 62.1Q36.7 58.4 30.8 58.4Q25 58.4 21.1 62.1Q17.2 65.7 17.2 72.5V73.5Q17.2 80.2 21.1 83.9Q25 87.6 30.8 87.6Z M85.7 99.2Q79.9 99.2 75.6 96.6Q71.2 93.9 68.8 89.2Q66.4 84.5 66.4 78.4V48.8H79V77.4Q79 83 81.8 85.8Q84.5 88.6 89.6 88.6Q95.4 88.6 98.6 84.8Q101.8 80.9 101.8 74V48.8H114.4V98.4H102V91.9H100.2Q99 94.4 95.7 96.8Q92.4 99.2 85.7 99.2Z"/><circle class="gu-logo-dot" cx="134.4" cy="89.4" r="9"/></svg></span></div>
    <div class="gu-cursor" aria-hidden="true"><span class="gu-cursor-dot"></span><span class="gu-cursor-bubble" hidden></span></div>`;

// Renders src/pages into the HTML shells. In dev, modules load through Vite so edits show on refresh.
function pages() {
  let server;
  const load = (path) =>
    server
      ? server.ssrLoadModule(path)
      : import(pathToFileURL(resolve(import.meta.dirname, '.' + path)).href);
  return {
    name: 'gu-pages',
    configureServer(s) {
      server = s;
      // generated art on demand in dev
      s.middlewares.use('/art/', async (req, res, next) => {
        const { genArtSvg } = await s.ssrLoadModule('/src/ui/components.js');
        const svg = genArtSvg(req.url.slice(1));
        if (!svg) return next();
        res.setHeader('Content-Type', 'image/svg+xml');
        res.end(svg);
      });
    },
    transformIndexHtml: {
      order: 'pre',
      async handler(html) {
        const pagesMod = await load('/src/pages/index.js');
        const { loadCaseStudies } = await load('/scripts/lib/casestudies.mjs');
        const caseStudies = await loadCaseStudies();
        return html
          .replace('<!--head:theme-->', `<script>${THEME_SCRIPT}</script>`)
          .replace('<!--head:common-->', COMMON_HEAD)
          .replace('<!--chrome-->', CHROME)
          .replace(/<!--page:(home|archive|notfound|privacy)-->/, (m, name) => {
            const fn = { home: 'home', archive: 'archive', notfound: 'notFound', privacy: 'privacy' }[name];
            return pagesMod[fn]({ caseStudies });
          });
      },
    },
    async generateBundle() {
      // every drawing the pages used, as static files under /art/
      const { usedArt, genArtSvg } = await load('/src/ui/components.js');
      for (const file of usedArt)
        this.emitFile({ type: 'asset', fileName: `art/${file}`, source: genArtSvg(file) });
      this.info(`theme script CSP hash: '${THEME_SCRIPT_HASH}'`);
    },
  };
}

export default defineConfig({
  plugins: [pages()],
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
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'three';
          if (id.includes('node_modules/gsap') || id.includes('node_modules/lenis')) return 'motion';
        },
      },
    },
  },
});
