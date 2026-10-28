// Header states (top → solid → hidden on scroll down) and the full-screen mobile menu.
import { reducedMotion } from './env.js';

export function initHeader({ lenis, signal } = {}) {
  const header = document.querySelector('[data-header]');
  const menu = document.querySelector('[data-menu]');
  const openBtn = document.querySelector('[data-menu-open]');
  if (!header) return;

  let last = window.scrollY;
  let menuOpen = false;
  const update = () => {
    const y = window.scrollY;
    const down = y > last;
    last = y;
    let state = y < 24 ? 'top' : 'solid';
    // never hide while the menu is open or focus is inside the header; reduced motion keeps it solid
    if (!reducedMotion && down && y > 240 && !menuOpen && !header.contains(document.activeElement))
      state = 'hidden';
    if (header.dataset.state !== state) header.dataset.state = state;
  };
  window.addEventListener('scroll', update, { passive: true, signal });
  update();

  if (!menu || !openBtn) return;
  const focusables = () => [...menu.querySelectorAll('a, button')];

  function open() {
    menuOpen = true;
    menu.hidden = false;
    menu.classList.remove('is-closing');
    openBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    lenis?.stop();
    document.dispatchEvent(new CustomEvent('gu:menu', { detail: true }));
    focusables()[1]?.focus();
  }
  function close(returnFocus = true) {
    if (!menuOpen) return;
    menuOpen = false;
    openBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    lenis?.start();
    document.dispatchEvent(new CustomEvent('gu:menu', { detail: false }));
    const done = () => {
      menu.hidden = true;
      menu.classList.remove('is-closing');
    };
    if (reducedMotion) done();
    else {
      menu.classList.add('is-closing');
      menu.addEventListener('animationend', done, { once: true });
    }
    if (returnFocus) openBtn.focus();
  }

  openBtn.addEventListener('click', open);
  menu.querySelector('[data-menu-close]')?.addEventListener('click', () => close());
  menu.querySelectorAll('[data-menu-link]').forEach((a) => a.addEventListener('click', () => close(false)));
  menu.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
    if (e.key !== 'Tab') return;
    const f = focusables();
    const first = f[0];
    const lastEl = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      lastEl.focus();
    } else if (!e.shiftKey && document.activeElement === lastEl) {
      e.preventDefault();
      first.focus();
    }
  });
}
