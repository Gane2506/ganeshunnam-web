// Page transitions. Cross-document View Transitions where supported (CSS in site.css); otherwise the design
// system's curtain: lime panel rises from the bottom (450ms), navigate, then clears toward the top (450ms).
import { reducedMotion } from './env.js';

const KEY = 'gu:curtain';
const supportsCrossDocVT = 'onpagereveal' in window;

export function initTransitions() {
  const curtain = document.querySelector('.gu-curtain');
  if (!curtain || reducedMotion) return;

  let arrived = false;
  try {
    arrived = sessionStorage.getItem(KEY) === '1';
    sessionStorage.removeItem(KEY);
  } catch {
    /* storage blocked: no reveal */
  }
  if (arrived) {
    curtain.style.transform = 'scaleY(1)';
    requestAnimationFrame(() => {
      curtain.style.transform = '';
      curtain.classList.add('is-out');
      curtain.addEventListener('animationend', () => curtain.classList.remove('is-out'), { once: true });
    });
  }
  if (supportsCrossDocVT) return;

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-transition]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0 || a.target === '_blank') return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || (url.pathname === location.pathname && url.hash)) return;
    e.preventDefault();
    try {
      sessionStorage.setItem(KEY, '1');
    } catch {
      /* ignore */
    }
    curtain.classList.add('is-in');
    curtain.addEventListener('animationend', () => (location.href = url.href), { once: true });
  });
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) curtain.classList.remove('is-in', 'is-out');
  });
}
