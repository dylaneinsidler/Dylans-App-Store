// Keeps the store and every app working without internet once they've been opened.
//
// With internet, everything comes fresh from the web (so changes show up right away), and a copy is
// kept. Without it (or when it's very slow), the kept copy is used. Pictures rarely change, so they
// come from the kept copy first. Fonts, code libraries and Sefaria's texts are kept the same way.
// Live data (weather, radar) is never kept: old weather shown as new would be wrong.

const CACHE = 'dylans-app-store';
const KEEP_FROM = /(^|\.)(fonts\.googleapis\.com|fonts\.gstatic\.com|cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|unpkg\.com|sefaria\.org)$/;
const SLOW = 4000;   // ms to wait for the internet before using the kept copy

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const ours = url.origin === location.origin && url.pathname.startsWith(new URL('./', location).pathname);
  if (!ours && !KEEP_FROM.test(url.hostname)) return;
  const picture = ours && /\.(jpe?g|png|webp|gif|svg|ico)$/i.test(url.pathname);
  e.respondWith(picture ? keptFirst(req) : freshFirst(req));
});

async function keep(req, res) {
  if (res && (res.ok || res.type === 'opaque')) {
    const cache = await caches.open(CACHE);
    await cache.put(req, res.clone());
  }
  return res;
}

async function keptFirst(req) {
  const kept = await caches.match(req);
  if (kept) return kept;
  return keep(req, await fetch(req));
}

async function freshFirst(req) {
  const fresh = fetch(req).then(res => keep(req, res));
  const kept = await caches.match(req, { ignoreSearch: req.mode === 'navigate' });
  if (!kept) return fresh;
  // Use the kept copy if the internet fails, or takes too long.
  return new Promise(resolve => {
    const timer = setTimeout(() => resolve(kept), SLOW);
    fresh.then(res => { clearTimeout(timer); resolve(res.ok ? res : kept); }, () => { clearTimeout(timer); resolve(kept); });
  });
}
