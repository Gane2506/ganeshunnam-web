// Architecture diagrams: hover or focus a node to light its connections and dim the rest.
// Data pulses (SVG animateMotion) are removed for reduced motion.
import { reducedMotion } from './env.js';

export function initArchitecture() {
  document.querySelectorAll('[data-arch]').forEach((fig) => {
    if (reducedMotion) fig.querySelectorAll('[data-pulse]').forEach((c) => c.remove());
    const edges = [...fig.querySelectorAll('.gu-arch-edge')];
    const nodes = [...fig.querySelectorAll('[data-node]')];
    const set = (id) => {
      nodes.forEach((n) => n.classList.toggle('is-on', n.dataset.node === id));
      edges.forEach((e) => {
        const on = id && (e.dataset.from === id || e.dataset.to === id);
        e.classList.toggle('is-on', Boolean(on));
        e.classList.toggle('is-dim', Boolean(id && !on));
      });
    };
    nodes.forEach((n) => {
      n.addEventListener('mouseenter', () => set(n.dataset.node));
      n.addEventListener('focus', () => set(n.dataset.node));
      n.addEventListener('mouseleave', () => set(null));
      n.addEventListener('blur', () => set(null));
    });
  });
}
