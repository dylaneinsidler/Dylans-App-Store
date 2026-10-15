// Unlocks Dylan's private apps on a phone.
//
// The private apps go online only as scrambled files (.bin), locked with Dylan's password by
// tools/build.mjs. Here the password he types is stretched into the same key (PBKDF2, 600,000
// rounds, with the salt in lock.json), and the key unscrambles them (AES-256-GCM). The phone keeps
// the key, not the password, so it only has to be typed once on each phone (and once in each app
// added to the Home Screen, since every Home Screen app keeps its own things).
//
// On a private app's page (<script src="../lock.js" data-name="..." data-file="app.bin">) it shows a
// lock screen until the app is unlocked, then puts the unlocked app on the page. The private store
// (private/index.html) calls Lock.form() for its list.
(function () {
  'use strict';
  const script = document.currentScript;
  const base = new URL('./', script.src);
  const KEY = 'store.private.key';
  const enc = new TextEncoder();
  const fromB64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
  const toB64 = bytes => btoa(String.fromCharCode(...bytes));
  const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const LOCK = '<svg viewBox="0 0 16 20" width="15" height="18" aria-hidden="true"><rect x="1.5" y="8.5" width="13" height="10" rx="2.5" fill="currentColor"/><path d="M4.5 8.5V6a3.5 3.5 0 0 1 7 0v2.5" fill="none" stroke="currentColor" stroke-width="2"/></svg>';

  function saved() { try { const s = localStorage.getItem(KEY); return s ? fromB64(s) : null; } catch (e) { return null; } }
  function save(raw) { try { localStorage.setItem(KEY, toB64(raw)); } catch (e) { /* private window: ask again next time */ } }
  function forget() { try { localStorage.removeItem(KEY); } catch (e) { /* nothing saved */ } }

  async function derive(password) {
    const lock = await (await fetch(new URL('lock.json', base), { cache: 'no-cache' })).json();
    const material = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: fromB64(lock.salt), iterations: lock.iterations }, material, 256);
    return new Uint8Array(bits);
  }

  async function unscramble(raw, data) {
    const key = await crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['decrypt']);
    const bytes = new Uint8Array(data);
    return crypto.subtle.decrypt({ name: 'AES-GCM', iv: bytes.slice(0, 12) }, key, bytes.slice(12));
  }

  // Shows the password box in `box` (or nothing, if this phone already has the key), then calls
  // onOpen with the unlocked contents of `file`.
  async function form(box, { title, text, file, onOpen }) {
    let data;
    try {
      const res = await fetch(file, { cache: 'no-cache' });
      if (!res.ok) throw new Error(res.status);
      data = await res.arrayBuffer();
    } catch (e) {
      box.innerHTML = `<div class="unlock"><h3>${LOCK} Can’t reach your private apps</h3><p>The first time, this needs the internet. Check the connection and try again.</p></div>`;
      return;
    }
    const raw = saved();
    if (raw) {
      try { return onOpen(await unscramble(raw, data)); } catch (e) { forget(); }   // the password was changed
    }
    box.innerHTML = `<div class="unlock">
      <h3>${LOCK} ${esc(title)}</h3>
      <p>${esc(text)}</p>
      <form><input type="password" autocomplete="current-password" placeholder="Password" aria-label="Password" required>
        <button>Unlock</button></form>
      <p class="err" aria-live="polite"></p>
    </div>`;
    const input = box.querySelector('input');
    const err = box.querySelector('.err');
    const button = box.querySelector('button');
    box.querySelector('form').addEventListener('submit', async e => {
      e.preventDefault();
      button.disabled = true;
      button.textContent = 'Checking…';
      err.textContent = '';
      try {
        const key = await derive(input.value);
        const opened = await unscramble(key, data);
        save(key);
        onOpen(opened);
      } catch (e2) {
        err.textContent = 'That’s not the password. Try again.';
        input.select();
        button.disabled = false;
        button.textContent = 'Unlock';
      }
    });
    if (!matchMedia('(pointer: coarse)').matches) input.focus();
  }

  // A private app's page: lock screen first, then the app itself.
  if (script.dataset.file) {
    const icon = document.querySelector('link[rel="apple-touch-icon"]');
    document.body.innerHTML = `<main class="lockpage">
      ${icon ? `<img src="${esc(icon.href)}" alt="">` : ''}
      <h1>${esc(script.dataset.name || document.title)}</h1>
      <div id="lock-box"><p class="wait">Opening…</p></div>
    </main>`;
    form(document.getElementById('lock-box'), {
      title: 'Locked',
      text: 'This app is just for Dylan. Type your password once, and this phone remembers it.',
      file: new URL(script.dataset.file, location.href).href,
      onOpen: data => {
        const html = new TextDecoder().decode(data);
        document.open();
        document.write(html);
        document.close();
      },
    });
  }

  window.Lock = { form, forget };
})();

// No zooming in and out (Dylan, October 14, 2026). iPhone Safari ignores the page's user-scalable=no, so pinches are
// stopped here too; touch-action in the CSS stops double-tap zoom.
['gesturestart', 'gesturechange', 'gestureend'].forEach(ev => document.addEventListener(ev, e => e.preventDefault(), { passive: false }));
document.addEventListener('touchmove', e => { if (e.touches.length > 1) e.preventDefault(); }, { passive: false });
