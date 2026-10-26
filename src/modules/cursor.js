// Design-system cursor: a 10px dot that becomes a lime pill with a label over [data-cursor]. Fine pointers only;
// the native cursor stays visible.
import gsap from 'gsap';

export function initCursor() {
  const el = document.querySelector('.gu-cursor');
  if (!el) return;
  const dot = el.querySelector('.gu-cursor-dot');
  const bubble = el.querySelector('.gu-cursor-bubble');
  document.documentElement.classList.add('has-cursor');
  gsap.set(el, { autoAlpha: 0 });
  const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3' });
  const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3' });
  let shown = false;
  window.addEventListener(
    'pointermove',
    (e) => {
      if (!shown) {
        shown = true;
        gsap.set(el, { x: e.clientX, y: e.clientY });
        gsap.to(el, { autoAlpha: 1, duration: 0.2 });
      }
      xTo(e.clientX);
      yTo(e.clientY);
    },
    { passive: true },
  );
  document.addEventListener('pointerover', (e) => {
    const t = e.target.closest('[data-cursor]');
    if (t) bubble.textContent = t.dataset.cursor;
    bubble.hidden = !t;
    dot.hidden = Boolean(t);
  });
  document.addEventListener('pointerleave', () => gsap.to(el, { autoAlpha: 0, duration: 0.2 }));
  document.addEventListener('pointerenter', () => shown && gsap.to(el, { autoAlpha: 1, duration: 0.2 }));
}
