import gsap from 'gsap';

// Dot cursor that grows into a label over elements with [data-cursor="Label"].
export function initCursor() {
  const el = document.querySelector('.cursor');
  if (!el) return;
  const label = el.querySelector('.cursor__label');
  document.documentElement.classList.add('has-cursor');
  gsap.set(el, { autoAlpha: 0 }); // stays hidden until the pointer first moves, so it never parks at 0,0
  let shown = false;
  const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3' });
  const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3' });

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
    const target = e.target.closest('[data-cursor]');
    el.classList.toggle('is-label', Boolean(target));
    if (target) label.textContent = target.dataset.cursor;
  });
  document.addEventListener('pointerleave', () => gsap.to(el, { autoAlpha: 0, duration: 0.2 }));
  document.addEventListener('pointerenter', () => gsap.to(el, { autoAlpha: 1, duration: 0.2 }));
}
