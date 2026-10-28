// Seamless navigation. Internal links swap the page in place instead of reloading, so the particle field,
// smooth scroll and cursor carry on: the field morphs from this page's shape into the next page's, the clicked
// card's drawing grows into the case study hero (View Transitions), and the rest of the page sweeps out and in.
// Without View Transitions the lime curtain covers the swap. Every page is still complete static HTML, so a
// failed fetch, a modifier-click or a hard reload simply loads the page normally.
import { curtain } from './transitions.js';

const SHARED = 'gu-shared-art';
const KEEP = '.stage, .gu-curtain, .gu-cursor, script';
const HEAD =
  'meta[name="description"], link[rel="canonical"], meta[property^="og:"], meta[name^="twitter:"], script[type="application/ld+json"]';
const cache = new Map();
const parser = new DOMParser();
// the built bundle this tab runs; a fetched page pointing at a different one means a new deploy
const bundle = () => document.querySelector('script[type="module"][src]')?.getAttribute('src');
const BUNDLE = bundle();

const pageUrl = (a) => {
  if (!a || !a.href || a.target === '_blank' || a.hasAttribute('download') || a.dataset.reload !== undefined)
    return null;
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin || !/^https?:$/.test(url.protocol)) return null;
  if (/\.[a-z0-9]{2,5}$/i.test(url.pathname) && !url.pathname.endsWith('.html')) return null; // files, feeds, images
  return url;
};
const samePage = (url) => url.pathname === location.pathname && url.search === location.search;

// The cache holds each page's HTML text, never a parsed document: swapping moves the parsed nodes into this page,
// so a cached document would be empty the second time it is shown (the blank-page bug). Parse fresh every time.
function fetchHtml(url) {
  const key = url.pathname + url.search;
  if (!cache.has(key)) {
    const p = fetch(key, { headers: { Accept: 'text/html' }, credentials: 'same-origin' }).then((r) => {
      // 404 is our own designed page; anything else not OK (rate limits, bot checks, errors) loads normally
      if (
        (!r.ok && r.status !== 404) ||
        r.redirected ||
        !r.headers.get('content-type')?.includes('text/html')
      )
        throw new Error(`unusable response ${r.status}`);
      return r.text();
    });
    p.catch(() => cache.delete(key));
    cache.set(key, p);
  }
  return cache.get(key);
}

async function load(url) {
  const doc = parser.parseFromString(await fetchHtml(url), 'text/html');
  // only swap in real pages of this site: header, main content and the same build as this tab
  const real = doc.body?.dataset.page && doc.querySelector('[data-header]') && doc.getElementById('main');
  const sameBuild = doc.querySelector('script[type="module"][src]')?.getAttribute('src') === BUNDLE;
  if (!real || !sameBuild) {
    cache.delete(url.pathname + url.search);
    throw new Error(real ? 'new deploy' : 'not a site page');
  }
  return doc;
}

const visible = (el) => {
  const r = el?.getBoundingClientRect();
  return r && r.width > 0 && r.bottom > 0 && r.top < window.innerHeight;
};

// The drawing that travels: card → its case study hero, hero → the next hero, or hero → its card going back.
function sharedPair(trigger, next) {
  const from =
    trigger?.closest('.gu-pcard, .gu-cscard')?.querySelector('.gu-media') ||
    document.querySelector('.gu-cshero-media .gu-media');
  let to = next.querySelector('.gu-cshero-media .gu-media');
  if (!to && document.body.dataset.page === 'casestudy') {
    const card = [...next.querySelectorAll('.gu-pcard, .gu-cscard')].find(
      (c) => new URL(c.getAttribute('href'), location.href).pathname === location.pathname,
    );
    to = card?.querySelector('.gu-media');
  }
  return from && to && visible(from) ? [from, to] : null;
}

function swap(next) {
  document.title = next.title;
  document.head.querySelectorAll(HEAD).forEach((n) => n.remove());
  next.head.querySelectorAll(HEAD).forEach((n) => document.head.append(n.cloneNode(true)));
  for (const k of Object.keys(document.body.dataset)) delete document.body.dataset[k];
  Object.assign(document.body.dataset, next.body.dataset);
  [...document.body.children].forEach((n) => !n.matches(KEEP) && n.remove());
  const frag = document.createDocumentFragment();
  [...next.body.children].forEach((n) => !n.matches(KEEP) && frag.append(document.adoptNode(n)));
  document.body.append(frag);
}

export function initRouter({ unmount, mount, scrollTo }) {
  if (!('fetch' in window) || !history.pushState) return;
  history.scrollRestoration = 'manual';
  history.replaceState({ ...history.state, gu: true, y: window.scrollY }, '');
  const html = document.documentElement;
  const cover = curtain();
  let busy = false;
  let queued = null; // back/forward pressed mid-transition: replayed when it ends
  let current = location.pathname + location.search;
  const hard = (url) => {
    location.href = url.href;
  };

  async function go(url, { push = true, trigger = null, y = 0 } = {}) {
    if (busy) {
      if (!push) queued = { y };
      return;
    }
    busy = true;
    let next;
    try {
      next = await load(url);
    } catch {
      hard(url); // let the browser load it normally
      return;
    }
    history.replaceState({ ...history.state, gu: true, y: window.scrollY }, '');
    const pair = sharedPair(trigger, next);

    const update = () => {
      unmount();
      swap(next);
      if (push) history.pushState({ gu: true, y: 0 }, '', url.href);
      current = url.pathname + url.search;
      scrollTo(0);
      mount();
      const target = url.hash && document.getElementById(decodeURIComponent(url.hash.slice(1)));
      scrollTo(target || (push ? 0 : y));
      // only morph into a drawing the visitor can see; otherwise the clicked one zooms forward and dissolves
      if (pair && !visible(pair[1])) pair[1].style.removeProperty('view-transition-name');
      if (push && !target) document.getElementById('main')?.focus({ preventScroll: true });
    };

    let failed = false;
    const safeUpdate = () => {
      try {
        update();
      } catch (err) {
        failed = true;
        console.warn('Page swap failed, loading normally:', err);
      }
    };

    try {
      if (document.startViewTransition && document.visibilityState === 'visible') {
        if (pair) {
          pair[0].style.viewTransitionName = SHARED;
          pair[1].style.viewTransitionName = SHARED;
        }
        html.classList.add('is-swapping');
        const vt = document.startViewTransition(safeUpdate);
        const guard = setTimeout(() => vt.skipTransition(), 2500); // never leave the overlay up
        await vt.finished.catch(() => {});
        clearTimeout(guard);
        html.classList.remove('is-swapping');
        document.querySelectorAll('.gu-media').forEach((a) => a.style.removeProperty('view-transition-name'));
      } else {
        await cover.cover();
        safeUpdate();
        await cover.reveal();
      }
    } catch {
      failed = true;
    } finally {
      html.classList.remove('is-swapping');
      busy = false;
    }
    // last line of defence: a swap that left no page behind becomes a normal load
    if (failed || !document.getElementById('main') || !document.querySelector('[data-header]')) {
      cache.clear();
      location.reload();
      return;
    }
    if (queued) {
      const q = queued;
      queued = null;
      const here = new URL(location.href);
      if (here.pathname + here.search !== current) go(here, { push: false, y: q.y });
    }
  }

  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest('a[href]');
    const url = pageUrl(a);
    if (!url) return;
    if (samePage(url)) {
      if (url.hash) return; // in-page anchors: Lenis scrolls
      e.preventDefault();
      scrollTo(0);
      return;
    }
    e.preventDefault();
    go(url, { trigger: a });
  });

  // warm the next page once intent is clear (a 90ms hover, a touch, a press or keyboard focus), a few at a time,
  // so most swaps start without waiting on the network and sweeping the pointer never bursts requests
  let hoverTimer;
  const warmNow = (a) => {
    const url = pageUrl(a);
    if (!url || samePage(url) || cache.has(url.pathname + url.search) || cache.size > 24) return;
    fetchHtml(url).catch(() => {});
  };
  document.addEventListener(
    'pointerover',
    (e) => {
      clearTimeout(hoverTimer);
      const a = e.target.closest?.('a[href]');
      if (a) hoverTimer = setTimeout(() => warmNow(a), 90);
    },
    { passive: true },
  );
  document.addEventListener('pointerout', () => clearTimeout(hoverTimer), { passive: true });
  const warmTarget = (e) => warmNow(e.target.closest?.('a[href]'));
  document.addEventListener('pointerdown', warmTarget, { passive: true });
  document.addEventListener('touchstart', warmTarget, { passive: true });
  document.addEventListener('focusin', warmTarget);

  window.addEventListener('popstate', (e) => {
    const url = new URL(location.href);
    if (url.pathname + url.search === current) return; // hash-only change on this page
    go(url, { push: false, y: e.state?.y || 0 });
  });
}
