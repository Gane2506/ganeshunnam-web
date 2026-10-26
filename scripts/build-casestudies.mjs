// Post-build step (after `vite build`):
//   dist/casestudy/<slug>/index.html  one static page per case study, from the archive page's shell
//   dist/og/<slug>.png                its 1200 × 630 social image (design system template, rendered with resvg)
//   dist/sitemap.xml
// Case studies come from WordPress when WP_API_URL is set, otherwise from content/casestudies/ (see lib/casestudies.mjs).
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { Resvg } from '@resvg/resvg-js';
import { loadCaseStudies, source } from './lib/casestudies.mjs';
import { caseStudy } from '../src/pages/index.js';
import { esc, usedArt, genArtSvg } from '../src/ui/components.js';

const root = new URL('../', import.meta.url);
const dist = new URL('dist/', root);
const SITE = (process.env.SITE_URL || 'https://ganeshunnam.com').replace(/\/$/, '');

// Dark-theme hue values from design/tokens.json (social images are always dark)
const tokens = JSON.parse(await readFile(new URL('design/tokens.json', root), 'utf8'));
const color = Object.fromEntries(
  tokens.color.tokens.map((t) => [t.name, typeof t.value === 'object' ? t.value.dark : t.value]),
);

// ---------- social image: mono meta line, title wrapped at 22 characters (max 3 lines), constellation in the hue ----------
function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0), s / 4294967296);
}
function ogSvg(p) {
  const lines = p.title
    .split(' ')
    .reduce(
      (a, w) => {
        const l = a[a.length - 1];
        (l + ' ' + w).trim().length <= 22 ? (a[a.length - 1] = (l + ' ' + w).trim()) : a.push(w);
        return a;
      },
      [''],
    )
    .slice(0, 3);
  const hue = color[`hue-${p.hue}`];
  const wash = color[`hue-${p.hue}-wash`];
  const R = rng([...p.slug].reduce((s, c) => s + c.charCodeAt(0), 0));
  const pts = Array.from({ length: 90 }, () => [744 + R() * 392, 64 + R() * 502]);
  const links = pts
    .slice(0, 14)
    .map(
      (q, i) =>
        `<line x1="${q[0].toFixed(1)}" y1="${q[1].toFixed(1)}" x2="${pts[i + 1][0].toFixed(1)}" y2="${pts[i + 1][1].toFixed(1)}" stroke="${hue}" stroke-opacity=".35"/>`,
    );
  const dots = pts.map(
    (q) =>
      `<circle cx="${q[0].toFixed(1)}" cy="${q[1].toFixed(1)}" r="${(1.2 + R() * 2.4).toFixed(2)}" fill="${hue}" fill-opacity="${(0.4 + R() * 0.6).toFixed(2)}"/>`,
  );
  const top = 315 - (lines.length * 62) / 2 + 46;
  const meta = `CASE STUDY · ${(p.type || 'Project').split('·')[0].trim()} · ${p.year || ''}`.toUpperCase();
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${color.bg}"/>
  <text x="64" y="94" font-family="JetBrains Mono" font-weight="500" font-size="16" letter-spacing="1.6" fill="${color['text-mute']}">${esc(meta)}</text>
  ${lines.map((l, i) => `<text x="64" y="${top + i * 62}" font-family="Space Grotesk" font-weight="600" font-size="56" letter-spacing="-2.2" fill="${color.text}">${esc(l)}</text>`).join('\n  ')}
  <text x="64" y="566" font-family="JetBrains Mono" font-weight="500" font-size="16" letter-spacing="1.6" fill="${color['text-mute']}">GANESHUNNAM.COM</text>
  <clipPath id="c"><rect x="744" y="64" width="392" height="502" rx="18"/></clipPath>
  <rect x="744" y="64" width="392" height="502" rx="18" fill="${wash}"/>
  <g clip-path="url(#c)">${links.join('')}${dots.join('')}</g>
</svg>`;
}
const ogFonts = [
  new URL('scripts/og-fonts/SpaceGrotesk-SemiBold.ttf', root),
  new URL('scripts/og-fonts/JetBrainsMono-Medium.ttf', root),
].map((u) => u.pathname);
const renderOg = (p) =>
  new Resvg(ogSvg(p), {
    font: { fontFiles: ogFonts, loadSystemFonts: false, defaultFontFamily: 'Space Grotesk' },
  })
    .render()
    .asPng();

// ---------- pages ----------
const posts = await loadCaseStudies();
const shell = await readFile(new URL('casestudy/index.html', dist), 'utf8');
await mkdir(new URL('og/', dist), { recursive: true });

for (const [i, p] of posts.entries()) {
  const url = `${SITE}/casestudy/${p.slug}/`;
  const image = `${SITE}/og/${p.slug}.png`;
  const desc = esc(p.excerpt.slice(0, 160));
  const next = posts.length > 1 ? posts[(i + 1) % posts.length] : null;
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: p.title,
    description: p.excerpt,
    datePublished: p.date,
    dateModified: p.modified || p.date,
    image,
    author: { '@type': 'Person', name: 'Ganesh Unnam', url: SITE },
    mainEntityOfPage: url,
  }).replace(/</g, '\\u003c');
  const meta = `<title>${esc(p.title)} · Ganesh Unnam</title>
    <meta name="description" content="${desc}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:title" content="${esc(p.title)}" />
    <meta property="og:description" content="${desc}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:alt" content="${esc(p.title)}, a case study by Ganesh Unnam" />
    <script type="application/ld+json">${jsonLd}</script>`;
  const html = shell
    .replace(/<!--meta:start-->[\s\S]*?<!--meta:end-->/, meta)
    .replace(/<!--page:start-->[\s\S]*?<!--page:end-->/, caseStudy(p, next))
    .replace(
      '<body data-page="archive">',
      `<body data-page="casestudy" data-hue="${p.hue}" data-shape="${p.shape}">`,
    );
  await mkdir(new URL(`casestudy/${p.slug}/`, dist), { recursive: true });
  await writeFile(new URL(`casestudy/${p.slug}/index.html`, dist), html);
  await writeFile(new URL(`og/${p.slug}.png`, dist), renderOg(p));
}

// drawings used by the case study pages (the Vite build already wrote the ones the other pages use)
await mkdir(new URL('art/', dist), { recursive: true });
for (const file of usedArt) await writeFile(new URL(`art/${file}`, dist), genArtSvg(file));

// ---------- sitemap ----------
const urls = [
  { loc: `${SITE}/` },
  { loc: `${SITE}/casestudy/` },
  { loc: `${SITE}/privacy/` },
  ...posts.map((p) => ({
    loc: `${SITE}/casestudy/${p.slug}/`,
    lastmod: (p.modified || p.date)?.slice(0, 10),
  })),
];
await writeFile(
  new URL('sitemap.xml', dist),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`)
    .join('\n')}\n</urlset>\n`,
);
console.log(`casestudy: ${posts.length} page(s) + social images from ${source()}`);
