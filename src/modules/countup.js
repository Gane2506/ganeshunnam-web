// Stat count-up from 0, once, at 40% visibility, expo out over 1050ms. The HTML already holds the final value.
export function initCountUp() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        const el = en.target;
        const target = Number(el.dataset.count);
        const t0 = performance.now();
        const tick = (now) => {
          const t = Math.min(1, (now - t0) / 1050);
          const e = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
          el.textContent = Math.round(target * e);
          if (t < 1) requestAnimationFrame(tick);
        };
        el.textContent = '0';
        requestAnimationFrame(tick);
      }),
    { threshold: 0.4 },
  );
  els.forEach((el) => io.observe(el));
}
