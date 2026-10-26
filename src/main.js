// Boot: theme, header, smooth scroll, reveals, pinned sections, micro-interactions, then the WebGL field once
// the page is idle. Every page is complete static HTML; this only adds motion and behaviour.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { canFastWebGL, finePointer, isMobile, reducedMotion, saveData } from './modules/env.js';
import { initTheme, currentTheme } from './modules/theme.js';
import { initHeader } from './modules/header.js';
import { initCopyEmail } from './modules/copy-email.js';
import { initLifecycle } from './modules/lifecycle.js';
import { initArchitecture } from './modules/arch.js';
import { initMarquee } from './modules/marquee.js';
import { initCountUp } from './modules/countup.js';
import { initCursor } from './modules/cursor.js';
import { initMagnetic } from './modules/magnetic.js';
import { initCards } from './modules/cards.js';
import { initTransitions } from './modules/transitions.js';

gsap.registerPlugin(ScrollTrigger, SplitText);
const html = document.documentElement;

document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));
initTheme();

// ---------- smooth scroll: Lenis on the GSAP ticker ----------
let lenis = null;
if (!reducedMotion) {
  lenis = new Lenis({ lerp: 0.1, anchors: { offset: -72 }, autoRaf: false });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
initHeader({ lenis });
document.querySelectorAll('[data-top]').forEach((b) =>
  b.addEventListener('click', () => {
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo(0, 0);
    document.getElementById('main')?.focus({ preventScroll: true });
  }),
);

// ---------- lifecycle tabs (work with or without motion) ----------
const lifeListeners = [];
const life = initLifecycle((i, shape) => lifeListeners.forEach((fn) => fn(shape)));
initArchitecture();

let stage = null;
initCards((hue) => stage?.retint(hue));
initCopyEmail((btn) => {
  if (!reducedMotion) gsap.fromTo(btn, { scale: 0.97 }, { scale: 1, duration: 0.6, ease: 'expo.out' });
});

// ---------- motion ----------
if (!reducedMotion) {
  html.classList.add('js-motion');
  setTimeout(() => html.classList.add('motion-ready'), 2500); // never leave text hidden
  document.fonts.ready.then(initMotion);
  initMarquee(gsap.ticker);
  initCountUp();
  if (finePointer) {
    initMagnetic();
    initCursor();
  }
}

function initMotion() {
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

  // body copy fades only (400ms, no movement); cards and rows rise
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

  if (window.innerWidth >= 1024) pinSections();
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
}

// About holds for an extra 50vh (≈150vh) while the shape explodes; How I work holds 300vh and scroll picks the phase.
function pinSections() {
  const pin = (el, extra) =>
    ScrollTrigger.create({
      trigger: el,
      start: () => (el.offsetHeight > window.innerHeight ? 'bottom bottom' : 'top top'),
      end: `+=${extra}`,
      pin: true,
      invalidateOnRefresh: true,
      onUpdate:
        el.matches('[data-life-pin]') && life
          ? (self) => life.go(Math.min(life.count - 1, Math.floor(self.progress * life.count)))
          : undefined,
    });
  const about = document.querySelector('[data-pin]');
  if (about) pin(about, '50%');
  const how = document.querySelector('[data-life-pin]');
  if (how) pin(how, '200%');
}

// ---------- WebGL field: after first paint and idle, only on a hardware GPU ----------
async function bootField() {
  const [{ ParticleField }, { initStage }] = await Promise.all([
    import('./three/particle-field.js'),
    import('./modules/stage.js'),
  ]);
  const field = new ParticleField({ canvas: document.getElementById('gl'), theme: currentTheme() });
  html.classList.add('is-gl');
  stage = initStage(field, { lifecycle: { onChange: (fn) => lifeListeners.push(fn) } });
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

initTransitions();
