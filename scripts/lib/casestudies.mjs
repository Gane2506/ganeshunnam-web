// Loads case studies for the build.
//   WP_API_URL set   → every published "casestudy" from WordPress (fails loudly if WordPress can't be reached)
//   WP_API_URL unset → the seed JSON in content/casestudies/ (local dev, PR builds)
// Posts may embed design-system blocks with HTML comments, e.g. <!--gu:arch:sarah--> or <!--gu:log:sarah-->.
import { readFile, readdir } from 'node:fs/promises';
import { ArchitectureDiagram, ChangeLog } from '../../src/ui/components.js';
import { BEDROCK_ARCH, SARAH_ARCH, SARAH_LOG } from '../../src/content/lifecycle.js';

const ROOT = new URL('../../', import.meta.url);
const HUES = ['1', '2', '3', '4', '5', '6'];
const ARTS = ['orbit', 'grid', 'stack', 'helix', 'ribbon', 'cloud', 'constellation'];
// each generated drawing has a matching particle-field shape
export const ART_SHAPE = {
  orbit: 'agents',
  grid: 'web',
  stack: 'commerce',
  helix: 'seo',
  ribbon: 'automation',
  cloud: 'cloud',
  constellation: 'constellation',
};
const BLOCKS = {
  'arch:bedrock': () => `<div class="pg-wide">${ArchitectureDiagram(BEDROCK_ARCH)}</div>`,
  'arch:sarah': () => `<div class="pg-wide">${ArchitectureDiagram(SARAH_ARCH)}</div>`,
  'log:sarah': () => ChangeLog({ entries: SARAH_LOG }),
};

const stripTags = (s = '') =>
  s
    .replace(/<[^>]*>/g, '')
    .replace(/&#8217;/g, '’')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
// Authors are trusted (Ganesh's own WordPress), but never let script/style/iframe/on* reach a static page.
const sanitize = (html = '') =>
  html
    .replace(/<(script|style|iframe|object|embed)[\s\S]*?<\/\1>/gi, '')
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/\son\w+\s*=\s*'[^']*'/gi, '')
    .replace(/(href|src)\s*=\s*(["'])\s*javascript:[^"']*\2/gi, '$1="#"');
const expandBlocks = (html) =>
  html.replace(/<!--\s*gu:([a-z]+:[a-z0-9-]+)\s*-->/gi, (m, key) => (BLOCKS[key] ? BLOCKS[key]() : ''));

function normalise(p) {
  const art = ARTS.includes(p.art) ? p.art : 'orbit';
  return {
    ...p,
    hue: HUES.includes(String(p.hue)) ? String(p.hue) : '3',
    art,
    shape: ART_SHAPE[art],
    stack: Array.isArray(p.stack)
      ? p.stack
      : String(p.stack || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
    metrics: Array.isArray(p.metrics) ? p.metrics.filter((m) => m && m.value) : [],
    content: expandBlocks(sanitize(p.content)),
  };
}

async function fromWordPress(base) {
  const posts = [];
  for (let page = 1, pages = 1; page <= pages; page++) {
    const url = `${base}/wp/v2/casestudy?per_page=50&page=${page}&orderby=date&order=desc`;
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`WordPress responded ${res.status} for ${url}`);
    pages = Number(res.headers.get('x-wp-totalpages') || 1);
    posts.push(...(await res.json()));
  }
  return posts.map((p) => {
    const m = p.meta || {};
    return {
      slug: p.slug,
      title: stripTags(p.title?.rendered),
      short: m.cs_short || '',
      excerpt: stripTags(p.excerpt?.rendered),
      content: p.content?.rendered || '',
      date: p.date,
      modified: p.modified,
      client: m.cs_client,
      year: m.cs_year,
      role: m.cs_role,
      type: m.cs_type,
      status: m.cs_status,
      stack: m.cs_stack,
      hue: m.cs_hue,
      art: m.cs_art,
      liveUrl: m.cs_live_url,
      metrics: m.cs_metrics,
    };
  });
}

async function fromFixtures() {
  const dir = new URL('content/casestudies/', ROOT);
  const files = (await readdir(dir)).filter((f) => f.endsWith('.json'));
  const posts = await Promise.all(
    files.map(async (f) => JSON.parse(await readFile(new URL(f, dir), 'utf8'))),
  );
  return posts.sort((a, b) => (a.order ?? 99) - (b.order ?? 99) || new Date(b.date) - new Date(a.date));
}

let cache;
export function loadCaseStudies() {
  const base = process.env.WP_API_URL?.replace(/\/$/, '');
  cache ??= (base ? fromWordPress(base) : fromFixtures()).then((list) => list.map(normalise));
  return cache;
}
export const source = () => (process.env.WP_API_URL ? 'WordPress' : 'seed fixtures');
