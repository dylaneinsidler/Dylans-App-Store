// Shared by every app in Dylan's App Store. Each app's page loads it with
//   <script src="../../shared/phone.js" data-name="Dylan's Bassoon"></script>
// (add data-sound to an app that makes sound, data-footer="off" to leave out the footer).
//
// It works out whether the app was opened from the Home Screen, offers to put it there when it
// wasn't, keeps it working offline, lets sound play with the ringer off, and adds the footer that
// links back to the store. Opening a page with ?shot (tools/shots.mjs) leaves out the install offer.
(function () {
  'use strict';
  const script = document.currentScript;
  const name = script.dataset.name || document.title;
  const root = new URL('../', script.src);   // the store's top folder
  const html = document.documentElement;
  const params = new URLSearchParams(location.search);
  const shot = params.has('shot');
  const standalone = navigator.standalone === true ||
    matchMedia('(display-mode: standalone), (display-mode: fullscreen)').matches;
  const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const touch = matchMedia('(pointer: coarse)').matches;
  html.classList.toggle('standalone', standalone);
  html.classList.toggle('ios', ios);
  html.classList.toggle('touch', touch);
  html.classList.toggle('shot', shot);

  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem(key); return v == null ? fallback : JSON.parse(v); } catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* private window: not saved */ }
    },
  };

  // Offline: the store's service worker keeps a copy of everything that's been opened.
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    navigator.serviceWorker.register(new URL('sw.js', root), { scope: root.pathname }).catch(() => {});
  }

  // An instrument should play even when the phone's ringer switch is on silent (Safari 17 and later).
  if ('sound' in script.dataset && navigator.audioSession) {
    try { navigator.audioSession.type = 'playback'; } catch (e) { /* older Safari */ }
  }

  // Keeps the screen from going dark while the app is open (for apps meant to be left on show).
  let lock = null;
  async function keepAwake() {
    if (!navigator.wakeLock || document.hidden || lock) return;
    try {
      lock = await navigator.wakeLock.request('screen');
      lock.addEventListener('release', () => { lock = null; });
    } catch (e) { /* not allowed right now */ }
  }
  function stayAwake() {
    keepAwake();
    document.addEventListener('visibilitychange', keepAwake);
    document.addEventListener('pointerdown', keepAwake, { once: true });
  }

  // Shares a link with the phone's share sheet (Messages, Mail...), or copies it.
  async function share(title, url, text) {
    if (navigator.share) {
      try { await navigator.share({ title, text, url }); return 'shared'; } catch (e) { if (e.name === 'AbortError') return 'cancelled'; }
    }
    try { await navigator.clipboard.writeText(url); toast('Link copied'); return 'copied'; } catch (e) { prompt('Copy this link:', url); return 'shown'; }
  }

  function toast(text) {
    const t = document.createElement('div');
    t.className = 'phone-toast';
    t.textContent = text;
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 1800);
  }

  const SHARE_ICON = '<svg viewBox="0 0 20 24" aria-hidden="true"><path d="M10 15V2M5.5 6.5 10 2l4.5 4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 10H4.5A1.5 1.5 0 0 0 3 11.5v9A1.5 1.5 0 0 0 4.5 22h11a1.5 1.5 0 0 0 1.5-1.5v-9a1.5 1.5 0 0 0-1.5-1.5H13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

  // In Safari (not from the Home Screen), a card at the top explains how to add the app there.
  function installCard() {
    if (standalone || shot || !touch) return;
    const key = 'store.hint.' + location.pathname;
    if (store.get(key, false)) return;
    const card = document.createElement('aside');
    card.className = 'phone-install';
    const icon = document.querySelector('link[rel="apple-touch-icon"]');
    card.innerHTML = `
      ${icon ? `<img src="${icon.href}" alt="">` : ''}
      <div><b>Put ${name} on your Home Screen</b>
      <span>Tap Share <i>${SHARE_ICON}</i>${ios ? ' (on newer iPhones it’s in the <b>•••</b> menu)' : ''}, then <b>Add to Home Screen</b>.</span></div>
      <button aria-label="Hide">✕</button>`;
    card.querySelector('button').addEventListener('click', () => { store.set(key, true); card.remove(); });
    document.body.prepend(card);
  }

  // The footer: more apps, and sharing this one.
  function footer() {
    if (script.dataset.footer === 'off') return;
    const f = document.createElement('footer');
    f.className = 'phone-footer';
    f.innerHTML = `
      <a class="phone-store" href="${root.href}"><img src="${new URL('icons/icon-180.png', root).href}" alt=""><span>More apps in<br><b>Dylan's App Store</b></span></a>
      <button class="phone-share">${SHARE_ICON} Share this app</button>`;
    f.querySelector('.phone-share').addEventListener('click', () =>
      share(name, location.origin + location.pathname, `${name}, from Dylan's App Store`));
    (document.querySelector('main') || document.body).appendChild(f);
  }

  function start() { installCard(); footer(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();

  window.Phone = { root, standalone, ios, touch, shot, params, store, share, toast, stayAwake, SHARE_ICON };
})();
