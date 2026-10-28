// Boot: theme, smooth scroll, cursor and the WebGL field once per visit; reveals, pinned sections and
// micro-interactions once per page. Every page is complete static HTML; this only adds motion and behaviour.
// With motion allowed, internal links swap pages in place (router.js), so mountPage() runs again for each
// page and the cleanup it returns undoes everything it set up.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { canFastWebGL, finePointer, isMobile, reducedMotion, saveData } from './modules/env.js';
import { initTheme, syncTheme, currentTheme } from './modules/theme.js';
import { initHeader } from './modules/header.js';
import { initCopyEmail } from './modules/copy-email.js';
import { initLifecycle } from './modules/lifecycle.js';
import { initArchitecture } from './modules/arch.js';
import { initMarquee } from './modules/marquee.js';
import { initCountUp } from './modules/countup.js';
import { initCursor } from './modules/cursor.js';
import { initMagnetic } from './modules/magnetic.js';
import { initCards } from './modules/cards.js';
import { initRouter } from './modules/router.js';

gsap.registerPlugin(ScrollTrigger, SplitText);
const html = document.documentElement;
initTheme();

// ---------- smooth scroll: Lenis on the GSAP ticker ----------
let lenis = null;
if (!reducedMotion) {
  lenis = new Lenis({ lerp: 0.1, anchors: { offset: -72 }, autoRaf: false });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
const scrollTo = (target) => {
  if (lenis)
    lenis.scrollTo(target, { immediate: true, force: true, offset: typeof target === 'number' ? 0 : -72 });
  else if (typeof target === 'number') window.scrollTo(0, target);
  else target.scrollIntoView();
};
document.addEventListener('click', (e) => {
  if (!e.target.closest('[data-top]')) return;
  if (lenis) lenis.scrollTo(0);
  else window.scrollTo(0, 0);
  document.getElementById('main')?.focus({ preventScroll: true });
});

if (!reducedMotion) {
  html.classList.add('js-motion');
  setTimeout(() => html.classList.add('motion-ready'), 2500); // never leave text hidden
  if (finePointer) initCursor();
}

// ---------- per page ----------
let field = null;
let stage = null;
let stageInit = null;
let page = null; // { ctx, ac, lifeListeners, life }

function mountPage() {
  const ac = new AbortController();
  const { signal } = ac;
  const lifeListeners = [];
  const p = { ac, lifeListeners, life: null };
  document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));
  syncTheme();
  p.ctx = gsap.context(() => {
    initHeader({ lenis, signal });
    p.life = initLifecycle((i, shape) => lifeListeners.forEach((fn) => fn(shape)));
    initArchitecture();
    initCards((hue) => stage?.retint(hue));
    initCopyEmail((btn) => {
      if (!reducedMotion) gsap.fromTo(btn, { scale: 0.97 }, { scale: 1, duration: 0.6, ease: 'expo.out' });
    });
    if (!reducedMotion) {
      initMarquee(gsap.ticker, { signal });
      initCountUp({ signal });
      if (finePointer) initMagnetic();
    }
  });
  page = p;
  if (!reducedMotion) {
    if (document.fonts.status === 'loaded') p.ctx.add(() => initMotion(p));
    else document.fonts.ready.then(() => page === p && p.ctx.add(() => initMotion(p)));
  }
  if (field) p.ctx.add(() => (stage = stageInit(field, { lifecycle: lifeHooks(p), signal })));
}

function unmountPage() {
  if (!page) return;
  page.ac.abort();
  page.ctx.revert();
  stage = null;
  page = null;
  document.querySelector('.gu-cursor-bubble')?.setAttribute('hidden', '');
  document.querySelector('.gu-cursor-dot')?.removeAttribute('hidden');
}

const lifeHooks = (p) => ({ onChange: (fn) => p.lifeListeners.push(fn) });

function initMotion(p) {
  // masked line reveal: yPercent 105 → 0, 1050ms expo out, 60ms stagger, once at 15% into the viewport
  document.querySelectorAll('[data-split]').forEach((el) => {
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 105,
          duration: 1.05,
          ease: 'expo.out',
          stagger: 0.06,
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        }),
    });
  });
  html.classList.add('motion-ready');

  // body copy fades only (400ms, no movement); cards and rows rise.
  // An element must be in only one of these batches: two "from" tweens on it would end it at opacity 0.
  ScrollTrigger.batch('[data-rise]', {
    start: 'top 85%',
    once: true,
    onEnter: (els) =>
      gsap.from(els, {
        autoAlpha: 0,
        y: 24,
        duration: 1.05,
        ease: 'expo.out',
        stagger: 0.06,
        overwrite: true,
      }),
  });
  ScrollTrigger.batch('.gu-pcard, .gu-cscard, .gu-cap, .gu-eng, .gu-stat', {
    start: 'top 88%',
    once: true,
    onEnter: (els) =>
      gsap.from(els, {
        autoAlpha: 0,
        y: 32,
        duration: 1.05,
        ease: 'expo.out',
        stagger: 0.06,
        overwrite: true,
      }),
  });

  // parallax: bento cards drift at their own [data-speed]; cards never cross the grid gap
  if (!isMobile) {
    document.querySelectorAll('[data-speed]').forEach((el) => {
      const range = () => (1 - Number(el.dataset.speed)) * window.innerHeight * 0.18;
      const st = {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        invalidateOnRefresh: true,
      };
      gsap.fromTo(el, { y: () => -range() }, { y: range, ease: 'none', scrollTrigger: st });
    });
  }

  if (window.innerWidth >= 1024) pinSections(p);
  if (document.readyState === 'complete') requestAnimationFrame(() => ScrollTrigger.refresh());
  else window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
}

// About holds for an extra 50vh (≈150vh) while the shape explodes; How I work holds 300vh and scroll picks the phase.
function pinSections(p) {
  const pin = (el, extra) =>
    ScrollTrigger.create({
      trigger: el,
      start: () => (el.offsetHeight > window.innerHeight ? 'bottom bottom' : 'top top'),
      end: `+=${extra}`,
      pin: true,
      invalidateOnRefresh: true,
      onUpdate:
        el.matches('[data-life-pin]') && p.life
          ? (self) => p.life.go(Math.min(p.life.count - 1, Math.floor(self.progress * p.life.count)))
          : undefined,
    });
  const about = document.querySelector('[data-pin]');
  if (about) pin(about, '50%');
  const how = document.querySelector('[data-life-pin]');
  if (how) pin(how, '200%');
}

mountPage();

// ---------- WebGL field: after first paint and idle, only on a hardware GPU; lives across page swaps ----------
async function bootField() {
  const [{ ParticleField }, { initStage }] = await Promise.all([
    import('./three/particle-field.js'),
    import('./modules/stage.js'),
  ]);
  field = new ParticleField({ canvas: document.getElementById('gl'), theme: currentTheme() });
  stageInit = initStage;
  html.classList.add('is-gl');
  if (page)
    page.ctx.add(() => (stage = initStage(field, { lifecycle: lifeHooks(page), signal: page.ac.signal })));
  // free the GPU context when the page really goes away (not on bfcache entry)
  window.addEventListener('pagehide', (e) => !e.persisted && field.dispose());
}

if (!reducedMotion && !saveData && canFastWebGL()) {
  const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 200));
  const start = () =>
    idle(() => bootField().catch((err) => console.warn('WebGL field disabled:', err)), { timeout: 1500 });
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
}

// ---------- page swaps (motion only; reduced motion keeps plain, instant page loads) ----------
if (!reducedMotion) {
  initRouter({
    unmount: unmountPage,
    mount: () => {
      mountPage();
      lenis?.resize();
      ScrollTrigger.refresh(); // pins and section triggers measured before any scroll restore
    },
    scrollTo,
  });
}
