// Post-build step: prerender WordPress "casestudy" posts into static HTML.
//
//   WP_API_URL set   → pull every published casestudy from the WordPress REST API (build fails if it can't)
//   WP_API_URL unset → use the seed JSON in content/casestudies/ (local dev, CI previews)
//
// Writes: dist/casestudy/index.html (archive), dist/casestudy/<slug>/index.html,
//         the teaser on dist/index.html, and dist/sitemap.xml.
import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const DIST = join(ROOT, 'dist');
const SITE = (process.env.SITE_URL || 'https://ganeshunnam.com').replace(/\/$/, '');
const WP = process.env.WP_API_URL?.replace(/\/$/, '');
const DEFAULT_PALETTE = ['#c6f432', '#2de2a6'];

const esc = (s = '') =>
  String(s).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
const stripTags = (s = '') =>
  s
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
const isHex = (s) => /^#[0-9a-f]{3,8}$/i.test(s || '');
// Authors are trusted (your own WordPress), but never let script/style/iframe/on* reach the static page.
const sanitize = (html = '') =>
  html
    .replace(/<(script|style|iframe|object|embed)[\s\S]*?<\/\1>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '')
    .replace(/(href|src)\s*=\s*(["'])\s*javascript:[^"']*\2/gi, '$1="#"');

// ---------- sources ----------
async function fromWordPress() {
  const posts = [];
  for (let page = 1, pages = 1; page <= pages; page++) {
    const url = `${WP}/wp/v2/casestudy?per_page=50&page=${page}&_embed=wp:featuredmedia&orderby=date&order=desc`;
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`WordPress responded ${res.status} for ${url}`);
    pages = Number(res.headers.get('x-wp-totalpages') || 1);
    posts.push(...(await res.json()));
  }
  return posts.map((p) => {
    const m = p.meta || {};
    const media = p._embedded?.['wp:featuredmedia']?.[0];
    const palette = [m.cs_palette_primary, m.cs_palette_secondary];
    return {
      slug: p.slug,
      title: stripTags(p.title?.rendered),
      excerpt: stripTags(p.excerpt?.rendered),
      content: sanitize(p.content?.rendered),
      date: p.date,
      modified: p.modified,
      client: m.cs_client,
      year: m.cs_year,
      role: m.cs_role,
      type: m.cs_type,
      stack: (m.cs_stack || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      palette: palette.every(isHex) ? palette : DEFAULT_PALETTE,
      liveUrl: m.cs_live_url,
      metrics: Array.isArray(m.cs_metrics) ? m.cs_metrics : [],
      image: media?.source_url ? { src: media.source_url, alt: media.alt_text || '' } : null,
    };
  });
}

async function fromFixtures() {
  const dir = join(ROOT, 'content/casestudies');
  const files = (await readdir(dir)).filter((f) => f.endsWith('.json'));
  const posts = await Promise.all(files.map(async (f) => JSON.parse(await readFile(join(dir, f), 'utf8'))));
  return posts
    .map((p) => ({
      ...p,
      content: sanitize(p.content),
      palette: p.palette?.every(isHex) ? p.palette : DEFAULT_PALETTE,
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

// ---------- markup ----------
const card = (p, h = 'h3') => `
          <li class="cs-card" style="--c1:${p.palette[0]}">
            <a href="/casestudy/${p.slug}/" data-transition data-cursor="Read">
              <p class="eyebrow">${esc([p.type, p.year].filter(Boolean).join(' · '))}</p>
              <${h}>${esc(p.title)}</${h}>
              <p>${esc(p.excerpt)}</p>
            </a>
          </li>`;
const grid = (posts, h) =>
  posts.length
    ? `<ul class="cs-grid">${posts.map((p) => card(p, h)).join('')}\n        </ul>`
    : `<p class="cs-empty">New case studies are on the way.</p>`;

function article(p, next) {
  const facts = [
    ['Client', p.client],
    ['Year', p.year],
    ['Role', p.role],
    ['Stack', p.stack?.join(', ')],
  ].filter(([, v]) => v);
  const metrics = p.metrics?.length
    ? `<ul class="cs-metrics">${p.metrics.map((m) => `<li><strong>${esc(m.value)}</strong>${esc(m.label)}</li>`).join('')}</ul>`
    : '';
  return `
      <article>
        <header class="cs-hero">
          <p class="eyebrow" data-fade><a href="/casestudy/" data-transition>Case studies</a> / ${esc(p.type || 'Project')}</p>
          <h1 data-split>${esc(p.title)}</h1>
          <p class="cs-hero__lede" data-fade>${esc(p.excerpt)}</p>
          ${p.liveUrl ? `<p data-fade><a class="btn btn--ghost" href="${esc(p.liveUrl)}" rel="noopener" data-magnetic><span>View project ↗</span></a></p>` : ''}
        </header>
        <dl class="cs-facts">${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
        <div class="cs-body">
          ${p.image ? `<img src="${esc(p.image.src)}" alt="${esc(p.image.alt)}" loading="lazy" decoding="async" />` : ''}
          ${metrics}
          ${p.content}
        </div>
        ${next ? `<nav class="cs-next" aria-label="Next case study"><p class="eyebrow">Next case study</p><a href="/casestudy/${next.slug}/" data-transition>${esc(next.title)} →</a></nav>` : ''}
      </article>`;
}

const replaceMain = (tpl, main) => tpl.replace(/<!--CS:MAIN:START-->[\s\S]*<!--CS:MAIN:END-->/, main);

// ---------- build ----------
const posts = WP ? await fromWordPress() : await fromFixtures();
const template = await readFile(join(DIST, 'casestudy/index.html'), 'utf8');

// archive
await writeFile(
  join(DIST, 'casestudy/index.html'),
  template.replace('<!--CS:LIST-->', grid(posts, 'h2')).replace(/<!--CS:(TITLE|DESC|CANONICAL|HEAD)-->/g, ''),
);

// one page per case study
for (const [i, p] of posts.entries()) {
  const url = `${SITE}/casestudy/${p.slug}/`;
  const desc = esc(p.excerpt.slice(0, 160));
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: p.title,
    description: p.excerpt,
    datePublished: p.date,
    dateModified: p.modified || p.date,
    author: { '@type': 'Person', name: 'Ganesh Unnam', url: SITE },
    mainEntityOfPage: url,
    ...(p.image ? { image: p.image.src } : {}),
  }).replace(/</g, '\\u003c');
  const head = `<meta property="og:type" content="article" />
    <meta property="og:title" content="${esc(p.title)}" />
    <meta property="og:description" content="${desc}" />
    <meta property="og:url" content="${url}" />
    ${p.image ? `<meta property="og:image" content="${esc(p.image.src)}" />` : `<meta property="og:image" content="${SITE}/og.png" />`}
    <script type="application/ld+json">${jsonLd}</script>`;

  const next = posts.length > 1 ? posts[(i + 1) % posts.length] : null;
  const html = replaceMain(template, article(p, next))
    .replace(/<!--CS:TITLE-->[^<]*/, `${esc(p.title)} | Ganesh Unnam`)
    .replace(/<!--CS:DESC-->[^"]*/, desc)
    .replace(/<!--CS:CANONICAL-->[^"]*/, url)
    .replace('<!--CS:HEAD-->', head)
    .replace(/data-palette="[^"]*"/, `data-palette="${p.palette.join(',')}"`);
  await mkdir(join(DIST, 'casestudy', p.slug), { recursive: true });
  await writeFile(join(DIST, 'casestudy', p.slug, 'index.html'), html);
}

// home teaser: latest three. Project preview <img>s whose file isn't in the build are dropped, so cards
// fall back to their gradient art instead of requesting a 404 (run `npm run fetch:previews` to add them).
const homePath = join(DIST, 'index.html');
let home = (await readFile(homePath, 'utf8')).replace('<!--CASESTUDY_TEASER-->', grid(posts.slice(0, 3)));
const missing = [];
home = home.replace(/<img\s+class="card__img"[^>]*?src="(\/previews\/[^"]+)"[^>]*>/g, (tag, src) => {
  if (existsSync(join(DIST, src))) return tag;
  missing.push(src);
  return '';
});
if (missing.length) console.warn(`previews missing (cards use gradient art): ${missing.join(', ')}`);
await writeFile(homePath, home);

// sitemap
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
  join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`)
    .join('\n')}\n</urlset>\n`,
);

console.log(`casestudy: ${posts.length} page(s) from ${WP ? 'WordPress' : 'seed fixtures'}`);
