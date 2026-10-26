import gsap from 'gsap';

// Page transitions.
// Browsers with cross-document View Transitions get them from CSS (@view-transition in main.css).
// Everything else gets a lime curtain wipe: cover on click, navigate, uncover on the next page.
const KEY = 'gu:curtain';
const supportsCrossDocVT = 'onpagereveal' in window;

export function initTransitions() {
  const curtain = document.querySelector('.curtain');
  if (!curtain) return;

  // uncover if we arrived through a curtain
  let arrived = false;
  try {
    arrived = sessionStorage.getItem(KEY) === '1';
    sessionStorage.removeItem(KEY);
  } catch {
    /* storage blocked: skip the reveal */
  }
  if (arrived) {
    gsap.fromTo(
      curtain,
      { clipPath: 'inset(0% 0 0 0)' },
      { clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'expo.inOut', delay: 0.05 },
    );
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
    gsap.fromTo(
      curtain,
      { clipPath: 'inset(100% 0 0 0)' },
      {
        clipPath: 'inset(0% 0 0 0)',
        duration: 0.7,
        ease: 'expo.inOut',
        onComplete: () => (location.href = url.href),
      },
    );
  });

  // bfcache restore: never come back to a closed curtain
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) gsap.set(curtain, { clipPath: 'inset(100% 0 0 0)' });
  });
}
