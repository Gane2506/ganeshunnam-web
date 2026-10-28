/* global document, localStorage */
// Runs before any CSS paints: dark unless the visitor picked light with the toggle. Loaded as a same-origin
// file (not inline) so the CSP needs no hash when this changes.
try {
  document.documentElement.setAttribute(
    'data-theme',
    localStorage.getItem('theme') === 'light' ? 'light' : 'dark',
  );
} catch {
  document.documentElement.setAttribute('data-theme', 'dark');
}
