// Click-to-copy email: icon swaps to a check, a polite live region and the toast say "Email copied".
// Falls back to mailto: where the Clipboard API is blocked.
const CHECK = '<path d="m4.5 12.5 4.75 4.75L19.5 7"/>';

export function initCopyEmail(onCopied) {
  const toast = document.querySelector('[data-toast]');
  let timer;
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    const icon = btn.querySelector('svg');
    const original = icon?.innerHTML;
    const status = btn.parentElement.querySelector('[data-copy-status]');
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
      } catch {
        window.location.href = `mailto:${btn.dataset.copy}`;
        return;
      }
      if (icon) icon.innerHTML = CHECK;
      if (status) status.textContent = 'Email copied';
      if (toast) toast.hidden = false;
      onCopied?.(btn);
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (icon) icon.innerHTML = original;
        if (status) status.textContent = '';
        if (toast) toast.hidden = true;
      }, 2400);
    });
  });
}
