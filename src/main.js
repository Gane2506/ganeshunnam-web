// Boot: smooth scroll, text reveals, scroll choreography, parallax, micro-interactions,
// then the WebGL stage once the page is idle. Content never depends on JS to be readable.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { canFastWebGL, finePointer, isMobile, reducedMotion, saveData } from './modules/env.js';
import { initMagnetic } from './modules/magnetic.js';
import { initCursor } from './modules/cursor.js';
import { initCopyEmail } from './modules/copy-email.js';
import { initTransitions } from './modules/transitions.js';

gsap.registerPlugin(ScrollTrigger, SplitText);

const html = document.documentElement;
const isHome = Boolean(document.querySelector('.hero'));
// inner pages (case studies) can set their own particle colours: <body data-palette="#hex,#hex">
const DEFAULT_PALETTE = (document.body.dataset.palette || '#c6f432,#2de2a6').split(',');

// Shared with the WebGL module. Timelines can tween it before three.js has even loaded.
const stage = isHome
  ? { explode: 1, morph: 0, ring: 0, x: 0, y: 0, scale: 0.6, rotX: 0.2, camZ: 7, opacity: isMobile ? 0.5 : 1 }
  : { explode: 1, morph: 0, ring: 1, x: 0, y: 0, scale: 1, rotX: 1.1, camZ: 7, opacity: 0.5 };
let scene = null;
let lenis = null;

document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));

// ---------- smooth scroll: Lenis on the GSAP ticker (one RAF for scroll, tweens and WebGL) ----------
if (!reducedMotion) {
  lenis = new Lenis({ lerp: 0.1, anchors: { offset: -40 }, autoRaf: false });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

// ---------- nav: solid after the hero, hides on scroll down ----------
const nav = document.querySelector('[data-nav]');
ScrollTrigger.create({
  start: 80,
  end: 'max',
  onUpdate(self) {
    nav.classList.add('is-scrolled');
    nav.classList.toggle('is-hidden', self.direction === 1 && self.scroll() > window.innerHeight * 0.8);
  },
  onLeaveBack: () => nav.classList.remove('is-scrolled', 'is-hidden'),
});

// ---------- palette: card colours drive both CSS and the particles ----------
function applyPalette([a, b]) {
  if (!scene) return;
  scene.setPalette(a, b).forEach(([from, to]) => {
    gsap.to(from, { r: to.r, g: to.g, b: to.b, duration: 0.9, ease: 'power2.out', overwrite: 'auto' });
  });
}

document.querySelectorAll('[data-palette]').forEach((card) => {
  const palette = card.dataset.palette.split(',');
  card.style.setProperty('--c1', palette[0]);
  card.style.setProperty('--c2', palette[1]);
  const link = card.querySelector('a');
  const enter = () => applyPalette(palette);
  link.addEventListener('pointerenter', enter);
  link.addEventListener('focus', enter);
  link.addEventListener('pointermove', (e) => {
    const r = link.getBoundingClientRect();
    link.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
    link.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
  });
});
document.querySelector('.bento')?.addEventListener('pointerleave', () => applyPalette(DEFAULT_PALETTE));

// ---------- motion (skipped entirely for reduced motion) ----------
if (!reducedMotion) {
  html.classList.add('js-motion');
  // safety net: never leave text hidden if something below throws
  setTimeout(() => html.classList.add('motion-ready'), 2500);
  document.fonts.ready.then(initMotion);
} else {
  Object.assign(stage, { explode: 0, scale: 1 });
}

function initMotion() {
  // headlines: masked line reveal
  document.querySelectorAll('[data-split]').forEach((el) => {
    const inHero = el.closest('.cs-hero, .page');
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      onSplit(self) {
        return gsap.from(self.lines, {
          yPercent: 110,
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.09,
          delay: inHero ? 0.25 : 0,
          scrollTrigger: inHero ? undefined : { trigger: el, start: 'top 85%', once: true },
        });
      },
    });
  });
  html.classList.add('motion-ready');

  // intro: copy fades up while the particles condense out of a cloud (the home hero animates in CSS)
  const fades = document.querySelectorAll('[data-fade]');
  if (fades.length)
    gsap.from(fades, { y: 24, autoAlpha: 0, duration: 1, ease: 'power3.out', stagger: 0.1, delay: 0.3 });
  gsap.to(stage, { explode: isHome ? 0 : 0.25, scale: 1, duration: 2.4, ease: 'expo.out', delay: 0.1 });

  // paragraph / list reveals
  ScrollTrigger.batch('[data-rise]', {
    start: 'top 88%',
    once: true,
    onEnter: (els) =>
      gsap.from(els, {
        y: 40,
        autoAlpha: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.08,
        overwrite: true,
      }),
  });

  if (isHome) homeChoreography();
  else
    gsap.to(stage, {
      opacity: 0.2,
      explode: 0.6,
      ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: 1.2 },
    });
  parallax();
  marquee();

  if (finePointer) {
    initMagnetic();
    initCursor();
  }

  // late layout shifts (images) move trigger points; refresh once they settle
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
}

function homeChoreography() {
  // hero copy drifts slower than the page: a cheap depth cue
  gsap.to('.hero__title', {
    yPercent: -18,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });

  // about: hold the content for an extra 50vh (≈150vh section) while the shape explodes behind it.
  // If the content is taller than the viewport, pin once its bottom is reached so nothing is cut off.
  const aboutPin = document.querySelector('.about__pin');
  ScrollTrigger.create({
    trigger: aboutPin,
    start: () => (aboutPin.offsetHeight > window.innerHeight ? 'bottom bottom' : 'top top'),
    end: '+=50%',
    pin: true,
    invalidateOnRefresh: true,
  });

  // ---------- scene choreography, one scrubbed timeline per transition ----------
  const scrub = (trigger, start, end, vars) =>
    gsap.to(stage, { ...vars, ease: 'none', scrollTrigger: { trigger, start, end, scrub: 1.2 } });

  scrub('.about', 'top bottom', 'bottom bottom', {
    explode: 1,
    scale: 1.25,
    x: isMobile ? 0 : 1.6,
    rotX: 0.6,
  });
  scrub('.work', 'top bottom', 'top 20%', {
    explode: 0,
    morph: 1,
    scale: 0.95,
    x: 0,
    rotX: 0.2,
    opacity: 0.6,
  });
  scrub('.exp', 'top bottom', 'top 30%', { explode: 0.35, opacity: 0.35, camZ: 9 });
  scrub('.contact', 'top bottom', 'top 10%', {
    explode: 0,
    morph: 0,
    ring: 1,
    rotX: 1.15,
    x: isMobile ? 0 : 1.5,
    y: -0.4,
    camZ: 7,
    opacity: isMobile ? 0.5 : 0.95,
  });
}

function parallax() {
  // ---------- parallax ----------
  // Cards drift a little at their own [data-speed] (<1 lags, >1 leads); the artwork inside moves further,
  // so depth reads clearly without cards ever crossing the grid gap.
  if (isMobile) return;
  document.querySelectorAll('[data-speed]').forEach((el) => {
    const speed = Number(el.dataset.speed);
    const range = () => (1 - speed) * window.innerHeight * 0.18;
    const st = {
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      invalidateOnRefresh: true,
    };
    gsap.fromTo(el, { y: () => -range() }, { y: range, ease: 'none', scrollTrigger: st });
    const art = el.querySelector('.card__img, .card__art');
    if (art) gsap.fromTo(art, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { ...st } });
  });
}

function marquee() {
  // ---------- kinetic marquee: constant drift, sped up and skewed by scroll velocity ----------
  const track = document.querySelector('.marquee__track');
  if (track) {
    const loop = gsap.to(track, { xPercent: -50, duration: 24, ease: 'none', repeat: -1 });
    const skewTo = gsap.quickTo(track, 'skewX', { duration: 0.5, ease: 'power3' });
    ScrollTrigger.create({
      trigger: track.closest('section') || track,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate(self) {
        const v = self.getVelocity();
        loop.timeScale(1 + Math.min(Math.abs(v) / 400, 4) * Math.sign(v || 1));
        skewTo(gsap.utils.clamp(-8, 8, v / -300));
      },
      onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
    });
  }
}

initCopyEmail((btn) => {
  if (!reducedMotion)
    gsap.fromTo(btn, { scale: 0.96 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
  if (scene) gsap.fromTo(stage, { explode: 0.5 }, { explode: 0, duration: 1.6, ease: 'expo.out' });
});

// ---------- WebGL stage: loaded after first paint, only where it will run well ----------
async function bootScene() {
  const canvas = document.getElementById('gl');
  const { createScene } = await import('./scene.js');
  const lowPower = (navigator.hardwareConcurrency || 4) <= 4;
  scene = createScene(canvas, {
    particles: isMobile ? 14000 : lowPower ? 24000 : 42000,
    state: stage,
  });
  html.classList.add('is-gl');
  if (!isHome) applyPalette(DEFAULT_PALETTE);
  gsap.ticker.add((time) => scene?.render(time));

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => scene?.resize(), 120);
  });
  if (finePointer) {
    window.addEventListener(
      'pointermove',
      (e) => scene?.setPointer((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1),
      { passive: true },
    );
  }
}

function teardown() {
  scene?.dispose();
  scene = null;
  lenis?.destroy();
}

if (!reducedMotion && !saveData && canFastWebGL()) {
  const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 200));
  const start = () => idle(() => bootScene().catch((err) => console.warn('WebGL stage disabled:', err)));
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
}

// free the GPU context when the page is really going away (not when it enters the bfcache)
window.addEventListener('pagehide', (e) => {
  if (!e.persisted) teardown();
});

initTransitions();
