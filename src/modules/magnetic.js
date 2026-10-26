// Magnetic buttons: within the box, move toward the pointer by 0.3 × offset (data-magnetic="0.4" for icon
// buttons), capped at 12px, 180ms; on leave, spring back over 600ms (the system's only overshoot).
export function initMagnetic(root = document) {
  root.querySelectorAll('[data-magnetic]').forEach((el) => {
    const s = Number(el.dataset.magnetic) || 0.3;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const clamp = (v) => Math.max(-12, Math.min(12, v));
      el.style.transition = 'transform 180ms var(--ease-ui)';
      el.style.transform = `translate(${clamp((e.clientX - (r.left + r.width / 2)) * s)}px,${clamp((e.clientY - (r.top + r.height / 2)) * s)}px)`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.transition = 'transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1)';
      el.style.transform = '';
    });
  });
}
