// Screenshots and favicons of every live site the portfolio links to, for project cards, the client grid,
// case study heroes and the experience timeline. Runs in .github/workflows/screenshots.yml (needs the open
// internet); writes public/shots/<host>.jpg (1280×800) and public/logos/<host>.png (64×64).
//   node scripts/capture-sites.mjs [host ...]   (no arguments: every site)
/* global window, document, location -- page.evaluate callbacks run in the browser */
import { mkdir, readFile, readdir } from 'node:fs/promises';
import { chromium } from 'playwright';
import { WORK, MORE_WORK, EXPERIENCE } from '../src/content/site.js';

const root = new URL('../', import.meta.url);
const host = (u) => new URL(u).hostname.replace(/^www\./, '');

const urls = new Set([
  ...WORK.map((w) => w.site),
  ...EXPERIENCE.map((e) => e.site),
  ...MORE_WORK.map(([, , u]) => u),
]);
const dir = new URL('content/casestudies/', root);
for (const f of await readdir(dir)) {
  if (f.endsWith('.json')) urls.add(JSON.parse(await readFile(new URL(f, dir), 'utf8')).liveUrl);
}
const only = process.argv.slice(2);
const sites = [...urls].filter(Boolean).filter((u) => !only.length || only.includes(host(u)));

await mkdir(new URL('public/shots/', root), { recursive: true });
await mkdir(new URL('public/logos/', root), { recursive: true });

// hide the usual cookie and chat widgets so the shot shows the site itself
const HIDE = `[id*="cookie" i],[class*="cookie" i],[id*="consent" i],[class*="consent" i],[class*="cc-window"],
  #hubspot-messages-iframe-container,[id*="intercom"],[class*="chat-widget" i],iframe[title*="chat" i]{display:none!important}`;

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 1,
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
});
let ok = 0;
for (const url of sites) {
  const h = host(url);
  const page = await ctx.newPage();
  try {
    await page.goto(url, { waitUntil: 'load', timeout: 45000 });
    await page.addStyleTag({ content: HIDE }).catch(() => {});
    await page.waitForTimeout(3000); // fonts, sliders, lazy hero images
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({
      path: new URL(`public/shots/${h}.jpg`, root).pathname,
      type: 'jpeg',
      quality: 74,
    });

    const icon = await page.evaluate(() => {
      const links = [...document.querySelectorAll('link[rel~="icon"], link[rel="apple-touch-icon"]')];
      const best = links.find((l) => l.rel.includes('apple-touch-icon')) || links.at(-1);
      return best
        ? new URL(best.getAttribute('href'), location.href).href
        : new URL('/favicon.ico', location.href).href;
    });
    const ip = await ctx.newPage();
    await ip.setViewportSize({ width: 64, height: 64 });
    await ip.setContent(
      `<style>html,body{margin:0;background:#fff}img{width:64px;height:64px;object-fit:contain;display:block}</style><img src="${icon}">`,
    );
    await ip.waitForTimeout(1500);
    const loaded = await ip.evaluate(() => document.images[0].naturalWidth > 0);
    if (loaded) await ip.screenshot({ path: new URL(`public/logos/${h}.png`, root).pathname });
    await ip.close();
    ok++;
    console.log(`✓ ${h}${loaded ? '' : ' (no favicon)'}`);
  } catch (err) {
    console.warn(`✗ ${h}: ${err.message.split('\n')[0]}`);
  }
  await page.close();
}
await browser.close();
console.log(`${ok}/${sites.length} sites captured`);
