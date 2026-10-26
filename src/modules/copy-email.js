// Click-to-copy with a polite live-region toast. Falls back to mailto: where the Clipboard API is blocked.
export function initCopyEmail(onCopied) {
  const toast = document.querySelector('.toast');
  let timer;
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const value = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(value);
        if (toast) toast.textContent = 'Copied. Talk soon.';
        onCopied?.(btn);
      } catch {
        window.location.href = `mailto:${value}`;
        return;
      }
      clearTimeout(timer);
      timer = setTimeout(() => toast && (toast.textContent = ''), 2600);
    });
  });
}
