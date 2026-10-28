// The design system's lime curtain, used for page swaps where View Transitions aren't available: it rises
// from the bottom (450ms), the page swaps underneath, then it clears toward the top (450ms).
export function curtain() {
  const el = document.querySelector('.gu-curtain');
  const play = (cls) =>
    new Promise((done) => {
      if (!el) return done();
      el.classList.remove('is-in', 'is-out');
      void el.offsetWidth; // restart the animation
      el.classList.add(cls);
      el.addEventListener('animationend', done, { once: true });
      setTimeout(done, 700); // never wait on a missed event
    });
  return {
    cover: () => play('is-in'),
    reveal: () => play('is-out').then(() => el?.classList.remove('is-out')),
  };
}
