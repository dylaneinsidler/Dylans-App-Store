// Dylan's App Store. Shows the apps in catalog.json (written by tools/build.mjs), a page for each
// app (#/app/<id>), and explains how to put an app on the Home Screen: on an iPhone there's no
// "install" button a web page can press, so the store shows the two taps it takes in Safari.
//
// The private store (private/index.html) uses this same file with data-private: after Dylan's
// password unlocks private/catalog.bin (see private/lock.js), his private apps join the list.
(function () {
  'use strict';
  const script = document.currentScript;
  const root = new URL('./', script.src);            // the store's top folder
  const PRIVATE = 'private' in script.dataset;
  const ua = navigator.userAgent;
  const ios = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const ipad = /iPad/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const android = /Android/.test(ua);
  const standalone = navigator.standalone === true || matchMedia('(display-mode: standalone)').matches;
  const home = document.getElementById('home');
  const detail = document.getElementById('detail');
  let catalog = { apps: [], categories: [] };
  let privateApps = [];

  const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const SHARE = '<svg viewBox="0 0 20 24" aria-hidden="true"><path d="M10 15V2M5.5 6.5 10 2l4.5 4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 10H4.5A1.5 1.5 0 0 0 3 11.5v9A1.5 1.5 0 0 0 4.5 22h11a1.5 1.5 0 0 0 1.5-1.5v-9a1.5 1.5 0 0 0-1.5-1.5H13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  const BACK = '<svg viewBox="0 0 12 20" aria-hidden="true"><path d="M10 2 2 10l8 8" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const LOCK = '<svg viewBox="0 0 16 20" width="11" height="13" aria-hidden="true"><rect x="1.5" y="8.5" width="13" height="10" rx="2.5" fill="currentColor"/><path d="M4.5 8.5V6a3.5 3.5 0 0 1 7 0v2.5" fill="none" stroke="currentColor" stroke-width="2"/></svg>';

  // Links people share always point at the store on the web, even when trying it on this PC.
  const publicRoot = () => new URL(catalog.url || root.href);
  const appLink = app => new URL(app.url, app.private ? root : publicRoot()).href;
  const openLink = app => new URL(app.url, root).href;
  const allApps = () => [...privateApps, ...catalog.apps];
  const find = id => allApps().find(a => a.id === id);
  const img = (src, cls, alt = '', lazy = false) =>
    `<img class="${cls}" src="${esc(new URL(src, root).href)}" alt="${esc(alt)}"${lazy ? ' loading="lazy"' : ''}>`;

  // ------------------------------------------------------------------ the front page
  function renderHome() {
    const today = new Date();
    const dateWords = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    const pick = catalog.apps.filter(a => a.shots.length >= 2 && !a.external);
    const day = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 864e5);
    const star = pick.length ? pick[day % pick.length] : null;

    let html = `<div class="wrap">
      <header class="hero">
        <div class="hero-top"><span class="date">${esc(dateWords)}</span>
          <button class="round" data-share-store>${SHARE} Share</button></div>
        <h1>${PRIVATE ? 'Dylan’s Private Apps' : esc(catalog.name || 'Dylan’s App Store')}</h1>
        <p>${PRIVATE ? 'Just for you: your own apps, plus everything in the store.' : 'Free apps for iPhone and iPad, made by Dylan.'}</p>
      </header>`;

    if (PRIVATE) html += '<section id="private-box"></section>';

    if (star) {
      html += `<a class="featured" href="#/app/${esc(star.id)}" style="--fc:${esc(star.color || '#333')}">
        ${img(star.shots[1], 'shot two')}${img(star.shots[0], 'shot')}
        <div class="text"><div class="label">App of the day</div><h2>${esc(star.short)}</h2><div class="sub">${esc(star.subtitle)}</div></div>
        <div class="bar">${img(star.icon, 'icon', '')}<div><b>${esc(star.name)}</b><span>${esc(star.category)}</span></div>
          <button class="get" data-get="${esc(star.id)}">GET</button></div>
      </a>`;
    }

    const cats = [...new Set([...(catalog.categories || []), ...catalog.apps.map(a => a.category)])];
    for (const cat of cats) {
      const list = catalog.apps.filter(a => a.category === cat);
      if (!list.length) continue;
      html += `<section class="group"><h3>${esc(cat)}</h3><ul class="list">${list.map(row).join('')}</ul></section>`;
    }

    html += `<section class="how">
        <h3>How to get an app</h3>
        <ol>
          <li><b>Tap GET</b> on any app, then <b>Open</b>.</li>
          <li>In Safari, tap <b>Share</b> <i>${SHARE}</i> (on newer iPhones it’s in the <b>•••</b> menu), then <b>Add to Home Screen</b>.</li>
          <li>That’s it: it’s on your Home Screen like any app, with its own icon, full screen. Most of them work without internet too.</li>
        </ol>
      </section>
      <footer class="foot">
        <button class="round" data-share-store>${SHARE} Share ${PRIVATE ? 'the public store' : 'this store'} with a friend</button><br>
        Free, with no ads and no sign-ups. These are web apps: nothing comes from Apple’s App Store.<br>
        ${catalog.updated ? `Updated ${esc(new Date(catalog.updated + 'T12:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }))}` : ''}
      </footer>
    </div>`;
    home.innerHTML = html;
    if (PRIVATE) privateBox();
  }

  function row(app) {
    return `<li><a class="row" href="#/app/${esc(app.id)}">
      ${img(app.icon, 'icon')}
      <span class="meta"><span class="words"><div class="name">${esc(app.name)}</div><div class="sub">${esc(app.subtitle)}</div>
        ${app.private ? `<span class="lock-badge">${LOCK} Only you</span>` : ''}</span>
        <button class="get" data-get="${esc(app.id)}">${app.private ? 'OPEN' : 'GET'}</button></span>
    </a></li>`;
  }

  // ------------------------------------------------------------------ the private store's lock
  function privateBox() {
    const box = document.getElementById('private-box');
    if (!box) return;
    if (privateApps.length) {
      box.innerHTML = `<section class="group"><h3>Just for you</h3><p class="note">Locked with your password. Nobody else can open these.</p>
        <ul class="list">${privateApps.map(row).join('')}</ul></section>`;
      return;
    }
    Lock.form(box, {
      title: 'Your private apps are locked',
      text: 'Type your password once, and this phone remembers it.',
      file: new URL('private/catalog.bin', root).href,
      onOpen: data => { privateApps = JSON.parse(new TextDecoder().decode(data)).apps.map(a => ({ ...a, private: true })); privateBox(); route(); },
    });
  }

  // ------------------------------------------------------------------ one app's page
  function renderDetail(app) {
    const facts = [
      ['Category', app.category, ''],
      ['Internet', app.internet === 'Not needed' ? 'None' : 'Needed', app.internet === 'Not needed' ? 'works offline' : app.internet || ''],
      ['Works on', 'iPhone', '& iPad'],
      ['Made by', 'Dylan', app.private ? 'just for you' : 'free'],
    ];
    detail.innerHTML = `<div class="wrap">
      <nav class="nav"><button class="back" data-back>${BACK} ${PRIVATE ? 'Apps' : 'Store'}</button>
        ${app.private ? '' : `<button class="share-icon" data-share-app="${esc(app.id)}" aria-label="Share">${SHARE}</button>`}</nav>
      <div class="head">${img(app.icon, 'icon')}
        <div class="words"><h1>${esc(app.name)}</h1><div class="sub">${esc(app.subtitle)}</div>
          <div class="actions"><button class="get big" data-get="${esc(app.id)}">${app.private ? 'OPEN' : 'GET'}</button>
          <span class="note">${app.private ? `${LOCK} Only you` : 'Free'}</span></div></div></div>
      <div class="facts">${facts.map(([k, v, s]) => `<div class="fact"><div class="k">${esc(k)}</div><div class="v">${esc(v)}</div><div class="s">${esc(s)}</div></div>`).join('')}</div>
      ${app.shots.length ? `<div class="shots">${app.shots.map(s => img(s, '', `${app.short} screenshot`, true)).join('')}</div>` : ''}
      <div class="about">${(app.description || []).map(p => `<p>${esc(p)}</p>`).join('')}
        ${app.features.length ? `<h2>What it does</h2><ul>${app.features.map(f => `<li>${esc(f)}</li>`).join('')}</ul>` : ''}</div>
      <div class="info"><h2>Information</h2><dl>
        <dt>Made by</dt><dd>Dylan</dd>
        <dt>Category</dt><dd>${esc(app.category)}</dd>
        <dt>Works on</dt><dd>iPhone and iPad (and computers)</dd>
        <dt>Internet</dt><dd>${esc(app.internet || 'Needed')}</dd>
        <dt>Version</dt><dd>${esc(app.version)}</dd>
        <dt>Price</dt><dd>Free</dd></dl></div>
      <footer class="foot"></footer>
    </div>`;
    detail.hidden = false;
    detail.scrollTop = 0;
    document.body.classList.add('locked');
  }

  function route() {
    const m = location.hash.match(/^#\/app\/([\w-]+)/);
    const app = m && find(m[1]);
    if (app) renderDetail(app);
    else { detail.hidden = true; detail.innerHTML = ''; document.body.classList.remove('locked'); }
  }

  // ------------------------------------------------------------------ sheets
  function sheet(html) {
    const backdrop = document.createElement('div');
    backdrop.className = 'backdrop';
    const box = document.createElement('div');
    box.className = 'sheet';
    box.setAttribute('role', 'dialog');
    box.innerHTML = `<div class="grab"></div><button class="x" aria-label="Close">✕</button>${html}`;
    document.body.append(backdrop, box);
    requestAnimationFrame(() => { backdrop.classList.add('show'); box.classList.add('show'); });
    const close = () => {
      backdrop.classList.remove('show'); box.classList.remove('show');
      setTimeout(() => { backdrop.remove(); box.remove(); }, 320);
    };
    backdrop.addEventListener('click', close);
    box.querySelector('.x').addEventListener('click', close);
    // Swipe down to close.
    let y0 = null;
    box.addEventListener('touchstart', e => { y0 = box.scrollTop <= 0 ? e.touches[0].clientY : null; }, { passive: true });
    box.addEventListener('touchmove', e => { if (y0 != null) { const dy = Math.max(0, e.touches[0].clientY - y0); box.style.transition = 'none'; box.style.transform = `translateY(${dy}px)`; } }, { passive: true });
    box.addEventListener('touchend', e => {
      if (y0 == null) return;
      box.style.transition = ''; box.style.transform = '';
      if (e.changedTouches[0].clientY - y0 > 90) close();
      y0 = null;
    });
    return { box, close };
  }

  function getSheet(app) {
    const link = appLink(app);
    const who = `<div class="who">${img(app.icon, 'icon')}<div><b>${esc(app.name)}</b><span>${esc(app.subtitle)}</span></div></div>`;
    let body;
    if (ios && !standalone) {
      body = `<h2>Put it on your Home Screen</h2>
        <ol class="steps">
          <li><span class="n">1</span><span>Tap <b>Open</b> below.<small>${esc(app.short)} opens in Safari, ready to use.</small></span></li>
          <li><span class="n">2</span><span>Tap <b>Share</b> <i>${SHARE}</i><small>${ipad ? 'At the top of Safari.' : 'At the bottom of Safari. On newer iPhones, tap <span class="key">•••</span> first.'}</small></span></li>
          <li><span class="n">3</span><span>Tap <b>Add to Home Screen</b>, then <b>Add</b>.<small>Scroll down the list if you don’t see it.</small></span></li>
        </ol>
        <a class="wide" href="${esc(openLink(app))}">Open ${esc(app.short)}</a>
        <p class="small-print">Then open it from your Home Screen. It opens full screen like any app${app.internet === 'Not needed' ? ', and works without internet' : ''}.</p>`;
    } else if (ios && standalone) {
      body = `<h2>Put it on your Home Screen</h2>
        <p class="lead">Only Safari can add apps to the Home Screen. Copy the link, open <b>Safari</b>, paste it in the address bar, then tap <b>Share</b> <i>${SHARE}</i> → <b>Add to Home Screen</b>.</p>
        <button class="wide" data-copy="${esc(link)}">Copy the link</button>
        <a class="wide plain" href="${esc(openLink(app))}">Just open it here</a>`;
    } else if (android) {
      body = `<h2>Put it on your Home Screen</h2>
        <ol class="steps">
          <li><span class="n">1</span><span>Tap <b>Open</b> below.</span></li>
          <li><span class="n">2</span><span>In Chrome’s <span class="key">⋮</span> menu, tap <b>Add to Home screen</b> or <b>Install app</b>.</span></li>
        </ol>
        <a class="wide" href="${esc(openLink(app))}">Open ${esc(app.short)}</a>`;
    } else {
      body = `<h2>Made for iPhone and iPad</h2>
        <p class="lead">Point your iPhone’s camera at this code to open it there, then add it to your Home Screen. It works on this computer too.</p>
        <div class="qr">${qr(link)}</div>
        <a class="wide" href="${esc(openLink(app))}"${app.external ? ' target="_blank" rel="noopener"' : ''}>Open it here</a>`;
    }
    if (app.private) body += `<p class="small-print">${LOCK} The first time, it asks for your password.</p>`;
    sheet(who + body);
  }

  function shareSheet() {
    const link = publicRoot().href;
    const { box } = sheet(`<h2>Share Dylan’s App Store</h2>
      <p class="lead">Friends can point their iPhone’s camera at this code, or you can send them the link.${PRIVATE ? ' (This shares the public store. Your private apps stay private.)' : ''}</p>
      <div class="qr">${qr(link)}</div>
      <div class="link-box">${esc(link)}</div>
      ${navigator.share ? `<button class="wide" data-send="${esc(link)}">${SHARE} Send the link…</button>` : ''}
      <button class="wide ${navigator.share ? 'plain' : ''}" data-copy="${esc(link)}">Copy the link</button>`);
    return box;
  }

  function qr(text) {
    if (!window.qrcode) return '';
    const code = qrcode(0, 'M');
    code.addData(text);
    code.make();
    return code.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
  }

  function toast(text) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = text;
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 1800);
  }

  async function copy(text) {
    try { await navigator.clipboard.writeText(text); toast('Link copied'); } catch (e) { prompt('Copy this link:', text); }
  }

  async function send(title, url, text) {
    try { await navigator.share({ title, text, url }); } catch (e) { if (e.name !== 'AbortError') copy(url); }
  }

  // ------------------------------------------------------------------ taps
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-get],[data-share-store],[data-share-app],[data-copy],[data-send],[data-back]');
    if (!t) {
      const a = e.target.closest('a[href^="#/app/"]');
      if (a) { e.preventDefault(); history.pushState({ fromHome: true }, '', a.getAttribute('href')); route(); }
      return;
    }
    e.preventDefault();
    if (t.dataset.get) getSheet(find(t.dataset.get));
    else if ('shareStore' in t.dataset) shareSheet();
    else if (t.dataset.shareApp) {
      const app = find(t.dataset.shareApp);
      if (navigator.share) send(app.name, appLink(app), `${app.name}, from Dylan’s App Store`); else copy(appLink(app));
    } else if (t.dataset.copy) copy(t.dataset.copy);
    else if (t.dataset.send) send('Dylan’s App Store', t.dataset.send, 'Free apps for iPhone and iPad, made by Dylan.');
    else if ('back' in t.dataset) { if (history.length > 1 && history.state?.fromHome) history.back(); else location.hash = ''; }
  });
  addEventListener('popstate', route);
  addEventListener('hashchange', route);

  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    navigator.serviceWorker.register(new URL('sw.js', root), { scope: root.pathname }).catch(() => {});
  }

  fetch(new URL('catalog.json', root), { cache: 'no-cache' })
    .then(r => r.json())
    .then(data => { catalog = data; renderHome(); route(); })
    .catch(() => { home.innerHTML = '<div class="wrap"><header class="hero"><h1>Dylan’s App Store</h1><p>Couldn’t load the apps. Check the internet and try again.</p></header></div>'; });

  window.Store = { refresh: () => { renderHome(); route(); } };
})();
