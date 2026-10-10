// Game Informer on a phone: the same issue as the desktop app on the same day (desktop/games.js, shuffled exactly like
// the desktop's informer.js, without the games in desktop/config.js `played`): the Switch metroidvania cover story, the
// quirky indie of the day, a big PS5 game on the way with its countdown, and the next PS5 release dates.
(function () {
  'use strict';
  const G = window.GAMES || { metroidvania: [], indie: [], ps5: [] }, cfg = window.GAME_CONFIG || {};
  const q = Phone.params, html = document.documentElement, DAY = 864e5;
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  let theme = q.get('theme') || Phone.store.get('games.theme', 'dark');
  function setTheme(t) {
    theme = t === 'light' ? 'light' : 'dark';
    html.dataset.theme = theme;
    Phone.store.set('games.theme', theme);
    document.querySelectorAll('.d-theme button').forEach(b => b.classList.toggle('on', b.dataset.t === theme));
    document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#0d0d10' : '#f3f0ea';
  }

  // ---- The day's games: the desktop's informer.js, step for step ----
  const ymd = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  function today() {
    if (q.get('date')) return ymd(q.get('date'));
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  }
  function shuffled(list, seed) {
    const a = list.slice();
    let s = seed >>> 0;
    const rand = () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  const played = new Set((cfg.played || []).map(n => n.toLowerCase()));
  function ofTheDay(kind, salt, index) {
    const list = G[kind].filter(g => !played.has(g.name.toLowerCase()));
    if (!list.length) return null;
    const n = list.length, round = Math.floor(index / n), k = ((index % n) + n) % n;
    return shuffled(list, round * 7919 + salt)[k];
  }
  const iso = g => /^\d{4}-\d\d-\d\d$/.test(g.date || '');
  function ps5List(day) {
    return G.ps5.filter(g => !iso(g) || (ymd(g.date) - day) / DAY >= -30)
      .map((g, i) => ({ g, key: iso(g) ? ymd(g.date).getTime() : 4e12 + i }))
      .sort((a, b) => a.key - b.key).map(x => x.g);
  }
  function when(g, day) {
    if (!iso(g)) return { date: g.date, count: '' };
    const d = ymd(g.date), n = Math.round((d - day) / DAY);
    return { date: d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      count: n > 1 ? `in ${n} days` : n === 1 ? 'tomorrow' : n === 0 ? 'out today' : 'out now', out: n <= 0 };
  }

  // The phone's pictures are smaller copies in photos/ (tools/phone-photos.py), named like the desktop's images/.
  const photo = g => g.img ? g.img.replace(/^images\//, 'photos/') : '';
  const byline = g => [g.dev, g.year].filter(Boolean).map(esc).join(' &middot; ') + (g.meta ? ` &middot; <span class="meta">${g.meta}</span>` : '');
  const pic = (g, extra = '') => `<div class="d-pic gpic${g.box ? ' boxed' : ''}">${g.img ? `<img src="${esc(photo(g))}" alt="" loading="lazy">` : `<div class="noimg">${esc(g.name)}</div>`}${extra}</div>`;

  function draw() {
    const day = today(), index = Math.round((day - ymd(window.GAMES_START || '2026-10-10')) / DAY);
    const mv = ofTheDay('metroidvania', 1, index), indie = ofTheDay('indie', 2, index), next = ofTheDay('metroidvania', 1, index + 1);
    const up = ps5List(day), ps5 = up[((index % up.length) + up.length) % up.length], w = ps5 ? when(ps5, day) : null;
    const cal = up.filter(g => iso(g) && (ymd(g.date) - day) / DAY >= 0).slice(0, 5);
    document.getElementById('issue').innerHTML = `
      <div class="d-head"><div><div class="k">Dylan’s Game Informer</div>
        <div class="date">Issue ${index + 1} &middot; ${esc(day.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }))}</div></div>
        <div class="d-theme"><button data-t="light">Light</button><button data-t="dark">Dark</button></div></div>
      ${mv ? `<section class="cover">
        ${pic(mv)}
        <div class="d-title"><span class="kick">Switch metroidvania of the day</span><h1 class="mast">${esc(mv.name)}</h1><div class="by">${byline(mv)}</div></div>
        <div class="d-card"><p class="why">${esc(mv.why)}</p>${mv.pitch || mv.about ? `<p class="pitch">${esc(mv.pitch || mv.about)}</p>` : ''}</div>
      </section>` : ''}
      ${indie ? `<section class="indie">
        <div class="d-title"><span class="kick">Quirky indie of the day</span><h2 class="mast">${esc(indie.name)}</h2><div class="by">${byline(indie)}</div></div>
        ${pic(indie)}
        <div class="d-card"><p class="why">${esc(indie.why)}</p>${indie.pitch ? `<p class="pitch">${esc(indie.pitch)}</p>` : ''}</div>
      </section>` : ''}
      ${ps5 ? `<section class="ps5">
        <div class="d-title"><span class="kick ps">${w.out ? 'Just out on PS5' : 'Coming to PS5'}</span><h2 class="mast">${esc(ps5.name)}</h2>
          <div class="by">${esc(w.date)}${ps5.dev ? ` &middot; ${esc(ps5.dev)}` : ''}</div></div>
        ${pic(ps5, w.count ? `<div class="count${w.out ? ' out' : ''}">${esc(w.count)}</div>` : '')}
        ${ps5.about || ps5.pitch ? `<div class="d-card"><p class="pitch">${esc(ps5.about || ps5.pitch)}</p></div>` : ''}
      </section>` : ''}
      <div class="d-card cal"><h2>Coming up on PS5</h2>
        <ol>${cal.map(g => `<li class="${g === ps5 ? 'on' : ''}"><b>${esc(ymd(g.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))}</b><span>${esc(g.name)}</span></li>`).join('')}</ol></div>
      ${next ? `<div class="d-next"><div>Tomorrow’s cover<b>${esc(next.name)}</b></div></div>` : ''}
      <p class="credit-line">Screenshots from Steam; cover art and descriptions from Wikipedia.</p>`;
    document.querySelector('.d-theme').onclick = ev => { const b = ev.target.closest('button'); if (b) setTheme(b.dataset.t); };
    setTheme(theme);
  }
  draw();
  let shown = today().toDateString();
  setInterval(() => { if (today().toDateString() !== shown) { shown = today().toDateString(); draw(); } }, 60e3);
})();
