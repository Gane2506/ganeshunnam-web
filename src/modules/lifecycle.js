// Lifecycle tabs. Keyboard: arrows move between phases (roving tabindex). onChange morphs the field.
export function initLifecycle(onChange) {
  const root = document.querySelector('[data-lifecycle]');
  if (!root) return null;
  const tabs = [...root.querySelectorAll('[role="tab"]')];
  const panels = [...root.querySelectorAll('[role="tabpanel"]')];
  const bar = root.querySelector('.gu-life-bar i');
  let cur = 0;

  function go(i, { focus = false } = {}) {
    if (i === cur && !focus) return;
    cur = i;
    tabs.forEach((t, k) => {
      t.setAttribute('aria-selected', String(k === i));
      t.tabIndex = k === i ? 0 : -1;
      t.classList.toggle('is-done', k < i);
    });
    panels.forEach((p, k) => (p.hidden = k !== i));
    if (bar) bar.style.transform = `scaleY(${(i + 1) / tabs.length})`;
    if (focus) tabs[i].focus();
    onChange?.(i, tabs[i].dataset.shape);
  }

  tabs.forEach((t, i) => t.addEventListener('click', () => go(i)));
  root.querySelector('[role="tablist"]').addEventListener('keydown', (e) => {
    const n = tabs.length;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      go((cur + 1) % n, { focus: true });
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      go((cur - 1 + n) % n, { focus: true });
    }
  });
  return { go, count: tabs.length, current: () => cur };
}
