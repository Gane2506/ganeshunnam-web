// Kinetic marquee: 60px/s base; scroll velocity adds speed and skews up to ±8°, decaying 0.9 per frame.
export function initMarquee(ticker, { signal } = {}) {
  const el = document.querySelector('[data-marquee]');
  if (!el) return;
  let x = 0;
  let v = 0;
  let lastY = window.scrollY;
  let visible = false;
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
  io.observe(el);
  window.addEventListener(
    'scroll',
    () => {
      const y = window.scrollY;
      v += (y - lastY) * 0.6;
      lastY = y;
    },
    { passive: true, signal },
  );
  const tick = (time, deltaMs) => {
    if (!visible) return;
    const dt = Math.min(0.05, deltaMs / 1000);
    v *= 0.9;
    x -= (60 + Math.abs(v) * 6) * dt;
    const half = el.scrollWidth / 2;
    if (-x >= half) x += half;
    const skew = Math.max(-8, Math.min(8, v * 0.4));
    el.style.transform = `translate3d(${x.toFixed(2)}px,0,0) skewX(${(-skew).toFixed(2)}deg)`;
  };
  ticker.add(tick);
  signal?.addEventListener('abort', () => {
    ticker.remove(tick);
    io.disconnect();
  });
}
