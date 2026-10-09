// Daily Torah on a phone. The two screens are the desktop app's own (desktop/today.js, desktop/week.js,
// desktop/wall.js); this only keeps the Light / Dark choice on this phone, and the page's address and
// colors in step with it.
(function () {
  'use strict';
  const html = document.documentElement;
  const meta = document.querySelector('meta[name="theme-color"]');
  const apply = () => {
    const t = html.dataset.theme === 'dark' ? 'dark' : 'light';
    Phone.store.set('torah.theme', t);
    const q = new URLSearchParams(location.search);
    if (q.get('theme') !== t) { q.set('theme', t); history.replaceState(null, '', '?' + q + location.hash); }
    meta.content = getComputedStyle(document.body).backgroundColor;
  };
  new MutationObserver(apply).observe(html, { attributes: true, attributeFilter: ['data-theme'] });
  apply();
})();
