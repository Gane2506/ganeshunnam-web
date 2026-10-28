// Light/dark theme. The inline head script already set data-theme before first paint; this keeps every
// toggle in sync, follows the OS until the visitor picks, and cross-fades with a View Transition.
import { reducedMotion } from './env.js';

const root = document.documentElement;
const listeners = new Set();
export const currentTheme = () => (root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
export const onThemeChange = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

export function syncTheme() {
  const light = currentTheme() === 'light';
  document
    .querySelectorAll('[data-theme-toggle]')
    .forEach((b) => b.setAttribute('aria-checked', String(light)));
}

function apply(next, save) {
  const go = () => {
    root.setAttribute('data-theme', next);
    if (save) {
      try {
        localStorage.setItem('theme', next);
      } catch {
        /* storage blocked: the choice lasts for this page only */
      }
    }
    syncTheme();
    listeners.forEach((fn) => fn(next));
  };
  if (document.startViewTransition && !reducedMotion) document.startViewTransition(go);
  else go();
}

export function initTheme() {
  syncTheme();
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-theme-toggle]')) apply(currentTheme() === 'dark' ? 'light' : 'dark', true);
  });
  const mq = matchMedia('(prefers-color-scheme: light)');
  mq.addEventListener('change', (e) => {
    let saved = null;
    try {
      saved = localStorage.getItem('theme');
    } catch {
      /* ignore */
    }
    if (!saved) apply(e.matches ? 'light' : 'dark', false);
  });
}
