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

const pageUrl = (a) => {
  if (!a || !a.href || a.target === '_blank' || a.hasAttribute('download') || a.dataset.reload !== undefined)
    return null;
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin || !/^https?:$/.test(url.protocol)) return null;
  if (/\.[a-z0-9]{2,5}$/i.test(url.pathname) && !url.pathname.endsWith('.html')) return null; // files, feeds, images
  return url;
};
const samePage = (url) => url.pathname === location.pathname && url.search === location.search;

function load(url) {
  const key = url.pathname + url.search;
  if (!cache.has(key)) {
    const p = fetch(key, { headers: { Accept: 'text/html' } })
      .then((r) => {
        if (!r.headers.get('content-type')?.includes('text/html')) throw new Error('not html');
        return r.text();
      })
      .then((html) => parser.parseFromString(html, 'text/html'));
    p.catch(() => cache.delete(key));
    cache.set(key, p);
  }
  return cache.get(key);
}

const visible = (el) => {
  const r = el?.getBoundingClientRect();
  return r && r.width > 0 && r.bottom > 0 && r.top < window.innerHeight;
};

// The drawing that travels: card → its case study hero, hero → the next hero, or hero → its card going back.
function sharedPair(trigger, next) {
  const from =
    trigger?.closest('.gu-pcard, .gu-cscard')?.querySelector('.gu-art') ||
    document.querySelector('.gu-cshero-media .gu-art');
  let to = next.querySelector('.gu-cshero-media .gu-art');
  if (!to && document.body.dataset.page === 'casestudy') {
    const card = [...next.querySelectorAll('.gu-pcard, .gu-cscard')].find(
      (c) => new URL(c.getAttribute('href'), location.href).pathname === location.pathname,
    );
    to = card?.querySelector('.gu-art');
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
  let current = location.pathname + location.search;

  async function go(url, { push = true, trigger = null, y = 0 } = {}) {
    if (busy) return;
    busy = true;
    let next;
    try {
      next = await load(url);
    } catch {
      location.href = url.href; // let the browser handle it
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

    try {
      if (document.startViewTransition) {
        if (pair) {
          pair[0].style.viewTransitionName = SHARED;
          pair[1].style.viewTransitionName = SHARED;
        }
        html.classList.add('is-swapping');
        const vt = document.startViewTransition(update);
        await vt.finished.catch(() => {});
        html.classList.remove('is-swapping');
        document.querySelectorAll('.gu-art').forEach((a) => a.style.removeProperty('view-transition-name'));
      } else {
        await cover.cover();
        update();
        await cover.reveal();
      }
    } catch {
      location.href = url.href;
    } finally {
      busy = false;
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

  // warm the next page the moment intent shows, so most swaps start without waiting on the network
  const warm = (e) => {
    const url = pageUrl(e.target.closest?.('a[href]'));
    if (url && !samePage(url)) load(url).catch(() => {});
  };
  document.addEventListener('pointerover', warm, { passive: true });
  document.addEventListener('touchstart', warm, { passive: true });
  document.addEventListener('focusin', warm);

  window.addEventListener('popstate', (e) => {
    const url = new URL(location.href);
    if (url.pathname + url.search === current) return; // hash-only change on this page
    go(url, { push: false, y: e.state?.y || 0 });
  });
}
