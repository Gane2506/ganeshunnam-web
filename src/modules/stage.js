// Scene map: drives the single persistent particle field per page and per section, following the design
// system's "Per-page scene map" (3D and background section). The object always sits beside copy, never under it;
// on phones it drops to canvas-quiet behind text.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { currentTheme, onThemeChange } from './theme.js';
import { isMobile } from './env.js';

const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
const QUIET = 0.35;

// x, y: object centre as a fraction of the viewport; scale: object size; distance/tilt: camera
const HOME = {
  hero: { shape: 'sphere', x: 0.72, y: 0.42, scale: 0.78, opacity: 1, tint: '--particle-tint' },
  about: {
    shape: 'exploded',
    scrub: true,
    x: 0.76,
    y: 0.46,
    scale: 0.6,
    opacity: 0.7,
    tint: '--particle-tint',
  },
  how: { shape: 'constellation', x: 0.8, y: 0.3, scale: 0.42, opacity: 0.9, tint: '--particle-tint' },
  featured: { x: 0.82, y: 0.3, scale: 0.42, opacity: 0.2 },
  work: { shape: 'torusKnot', x: 0.84, y: 0.22, scale: 0.5, opacity: 0.6, tilt: 0.35, tint: '--hue-3' },
  capabilities: { shape: 'agents', x: 0.86, y: 0.3, scale: 0.36, opacity: 0.35, tint: '--particle-tint' },
  search: { shape: 'seo', x: 0.88, y: 0.28, scale: 0.34, opacity: 0.35, tint: '--hue-3' },
  builds: { shape: 'automation', x: 0.88, y: 0.3, scale: 0.34, opacity: 0.35, tint: '--hue-2' },
  toolkit: { shape: 'cloud', x: 0.84, y: 0.5, scale: 0.45, opacity: 0.35, tint: '--particle-tint' },
  experience: {
    shape: 'torusKnot',
    x: 0.86,
    y: 0.5,
    scale: 0.38,
    opacity: 0.35,
    tilt: 0.35,
    tint: '--secondary',
  },
  'case-studies': { shape: 'constellation', x: 0.74, y: 0.5, scale: 0.6, opacity: 0.5, tint: '--hue-3' },
  engage: { shape: 'constellation', x: 0.74, y: 0.5, scale: 0.6, opacity: 0.3, tint: '--particle-tint' },
  contact: {
    shape: 'ring',
    x: 0.875,
    y: 0.49,
    scale: 0.3,
    opacity: 0.85,
    tilt: 1.05,
    tint: '--particle-tint',
  },
};

function pageScenes() {
  const page = document.body.dataset.page;
  const hue = document.body.dataset.hue || '3';
  if (page === 'home') return HOME;
  if (page === 'archive')
    return {
      archive: { shape: 'constellation', x: 0.84, y: 0.32, scale: 0.42, opacity: 0.5, tint: '--hue-3' },
    };
  if (page === 'casestudy') {
    const shape = document.body.dataset.shape || 'sphere';
    return {
      'cs-hero': { shape, x: 0.78, y: 0.4, scale: 0.5, opacity: 1, tint: `--hue-${hue}`, basePull: 0.6 },
      'cs-body': { shape, x: 0.88, y: 0.4, scale: 0.4, opacity: 0.2, tint: `--hue-${hue}`, basePull: 0.6 },
    };
  }
  if (page === 'notfound')
    return {
      notfound: {
        shape: 'notFound',
        x: 0.5,
        y: 0.28,
        scale: 0.5,
        opacity: 1,
        tint: '--hue-1',
        basePull: 0.3,
      },
    };
  return { legal: { shape: 'sphere', x: 0.86, y: 0.2, scale: 0.3, opacity: 0.2 } };
}

// phones: centred near the top, quiet behind text (the hero keeps a little more presence)
const forViewport = (s, id) => {
  if (!isMobile) return s;
  if (id === 'hero') return { ...s, x: 0.62, y: 0.135, scale: 0.21, opacity: 1 }; // its own band above the name (site.css)
  return { ...s, x: 0.5, y: 0.3, scale: (s.scale || 0.6) * 0.75, opacity: Math.min(s.opacity ?? 1, 0.12) }; // behind body text: barely there
};

export function initStage(field, { lifecycle, signal } = {}) {
  const scenes = pageScenes();
  const layout = { ...field.layout };
  let active = null;
  let base = { tint: '--particle-tint', pull: 0 };

  const paintBase = () => {
    // base colour pulled toward the tint (case studies, 404), recomputed whenever theme or scene changes
    if (!base.pull) return;
    const tint = field.uniforms.uTint.value.clone().set(css(base.tint));
    field.uniforms.uBase.value.lerp(tint, base.pull);
  };

  function apply(id) {
    const s = scenes[id] && forViewport(scenes[id], id);
    if (!s || id === active) return;
    active = id;
    if (s.shape && !s.scrub && s.shape !== field.shape) field.setShape(s.shape);
    if (s.scrub) field.setShape(s.shape, { scrub: true });
    if (s.tint) {
      field.setTint(css(s.tint));
      base = { tint: s.tint, pull: s.basePull || 0 };
      paintBase();
    }
    field.setLayout({ opacity: s.opacity ?? 1 });
    gsap.to(layout, {
      x: s.x ?? 0.5,
      y: s.y ?? 0.5,
      scale: s.scale ?? 1,
      tilt: s.tilt ?? 0,
      distance: s.distance ?? 4.2,
      duration: 1.2,
      ease: 'expo.out',
      overwrite: true,
      onUpdate: () => {
        Object.assign(field.layout, layout);
        field.resize();
      },
    });
  }

  for (const id of Object.keys(scenes)) {
    const el = document.querySelector(`[data-section="${id}"]`);
    if (!el) continue;
    ScrollTrigger.create({
      trigger: el,
      start: 'top 60%',
      end: 'bottom 60%',
      onToggle: (self) => self.isActive && apply(id),
      onUpdate: (self) => {
        if (scenes[id].scrub && active === id) field.setProgress(self.progress);
      },
    });
  }
  apply(Object.keys(scenes)[0]);

  // section-level interactions that retarget the field
  lifecycle?.onChange((shape) => active === 'how' && field.setShape(shape));
  const caps = document.querySelector('[data-caps]');
  if (caps) {
    let back;
    caps.querySelectorAll('[data-shape]').forEach((row) => {
      const go = () => {
        clearTimeout(back);
        if (active === 'capabilities' && field.shape !== row.dataset.shape) field.setShape(row.dataset.shape);
      };
      row.addEventListener('pointerenter', go);
      row.addEventListener('focus', go);
    });
    caps.addEventListener('pointerleave', () => {
      back = setTimeout(() => active === 'capabilities' && field.setShape(scenes.capabilities.shape), 400);
    });
  }

  const offTheme = onThemeChange((theme) => {
    const s = scenes[active];
    field.setTheme(theme, s?.tint ? css(s.tint) : undefined);
    setTimeout(paintBase, 220); // after the fade-out swaps the palette
  });
  // dim while the mobile menu is open
  document.addEventListener(
    'gu:menu',
    (e) =>
      field.setLayout({
        opacity: e.detail ? QUIET : (forViewport(scenes[active] || {}, active).opacity ?? 1),
      }),
    { signal },
  );
  signal?.addEventListener('abort', offTheme);

  return {
    retint: (hue) => active === 'work' && field.setTint(css(`--hue-${hue}`)),
    theme: currentTheme,
  };
}
