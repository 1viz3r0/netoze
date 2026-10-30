/**
 * NET0ZE theme toggle. Dark is the default; the visitor's choice is
 * persisted in localStorage and re-applied before first paint by an
 * inline snippet in each page's <head>, so there is no wrong-theme flash.
 */
(() => {
  'use strict';

  const STORAGE_KEY = 'netoze-theme';
  const root = document.documentElement;
  const toggles = document.querySelectorAll('[data-theme-toggle]');

  const themeColor = document.querySelector('meta[name="theme-color"]');
  const apply = (theme) => {
    root.dataset.theme = theme;
    toggles.forEach((button) => {
      button.setAttribute('aria-pressed', String(theme === 'light'));
      button.setAttribute('title', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
    });
    if (themeColor) {
      themeColor.setAttribute('content', theme === 'light' ? '#f4f3ee' : '#050505');
    }
  };

  apply(root.dataset.theme === 'light' ? 'light' : 'dark');

  toggles.forEach((button) => button.addEventListener('click', () => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    apply(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* Private browsing: the choice just won't persist. */
    }
  }));

  /* Keep other open tabs in sync. */
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY && (event.newValue === 'light' || event.newValue === 'dark')) {
      apply(event.newValue);
    }
  });
})();
