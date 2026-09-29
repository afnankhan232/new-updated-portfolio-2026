// ============================================================
// theme.js — Bulletproof dark/light toggle
// ============================================================
(function () {
  const body   = document.body;
  const stored = localStorage.getItem('ak-theme');

  // If something was stored, apply it; otherwise honour the class in HTML
  if (stored) {
    body.classList.remove('dark-mode', 'light-mode');
    body.classList.add(stored);
  }
  // At this point the class is guaranteed to be one of the two

  function setIcon() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    const isDark = body.classList.contains('dark-mode');
    btn.innerHTML = `<span class="theme-toggle-icon" aria-hidden="true">${isDark ? '☀' : '☾'}</span><span class="theme-toggle-label">${isDark ? 'Light' : 'Dark'}</span>`;
    btn.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} theme`);
    btn.setAttribute('aria-pressed', String(isDark));
    btn.title = `Switch to ${isDark ? 'light' : 'dark'} theme`;
  }

  // Wait for DOM so the button exists
  document.addEventListener('DOMContentLoaded', () => {
    setIcon();
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isDark = body.classList.contains('dark-mode');
      body.classList.replace(
        isDark ? 'dark-mode' : 'light-mode',
        isDark ? 'light-mode' : 'dark-mode'
      );
      localStorage.setItem('ak-theme', body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode');
      setIcon();
    });
  });

  window.addEventListener('storage', (event) => {
    if (event.key !== 'ak-theme' || !event.newValue) return;
    body.classList.remove('dark-mode', 'light-mode');
    body.classList.add(event.newValue);
    setIcon();
  });
})();