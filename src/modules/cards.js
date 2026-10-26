// Project and case study cards: the radial wash follows the pointer (--mx/--my, as the design system expects).
export function initCards(onEnter) {
  document.querySelectorAll('.gu-pcard, .gu-cscard').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
    const enter = () => onEnter?.(card.dataset.tint);
    card.addEventListener('pointerenter', enter);
    card.addEventListener('focus', enter);
  });
}
