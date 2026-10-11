// Game Informer on a phone: the same issue as the desktop app on the same day (desktop/games.js, picked exactly like
// the desktop's informer.js, without the games in desktop/config.js `played`): the Switch metroidvania cover story and
// the quirky indie of the day (both out in the last three months), a big PS5 game (new, or on the way with its
// countdown), and what's coming up on PS5 and Switch, big games and indies.
(function () {
  'use strict';
  const G = window.GAMES || { metroidvania: [], indie: [], ps5: [], coming: [] }, cfg = window.GAME_CONFIG || {};
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
  const iso = g => /^\d{4}-\d\d-\d\d$/.test(g.date || '');
  const daysTo = (s, d) => Math.round((ymd(s) - d) / DAY);   // from day d to the date s (below 0: already past)
  const RECENT = 90, SOON = 183, FEW = 3;
  const start = ymd(window.GAMES_START || '2026-10-10');
  const dayAt = i => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);

  // The games a day can pick from. The cover and the indie: out in the 90 days up to that day (never ones still to
  // come). The PS5 feature: out in those 90 days, or coming in the next six months. If fewer than three are left, the
  // newest ones (for PS5, the next ones coming) fill in.
  function pool(kind, d) {
    const all = (G[kind] || []).filter(g => !played.has(g.name.toLowerCase()));
    const out = all.filter(g => iso(g) && daysTo(g.date, d) <= 0);
    const newest = out.slice().sort((a, b) => b.date.localeCompare(a.date));
    let list;
    if (kind === 'ps5') {
      const next = all.filter(g => (iso(g) ? daysTo(g.date, d) : g.until ? daysTo(g.until, d) : 1e9) > 0)
        .sort((a, b) => (a.sort || '').localeCompare(b.sort || ''));
      list = all.filter(g => iso(g) ? daysTo(g.date, d) > -RECENT && daysTo(g.date, d) <= SOON
        : !!g.until && daysTo(g.until, d) > 0 && daysTo(g.until, d) <= SOON);
      for (const g of next.concat(newest)) if (list.length < FEW && !list.includes(g)) list.push(g);
    } else {
      list = out.filter(g => daysTo(g.date, d) > -RECENT);
      if (list.length < FEW) list = newest.slice(0, FEW);
      if (!list.length) list = all.slice(0, FEW);
    }
    return list;
  }
  const pickFrom = (list, salt, i) => {
    const n = list.length, round = Math.floor(i / n), k = ((i % n) + n) % n;
    return { list: shuffled(list, round * 7919 + salt), k };
  };
  function ofTheDay(kind, salt, index) {
    const list = pool(kind, dayAt(index));
    if (!list.length) return null;
    const { list: order, k } = pickFrom(list, salt, index);
    // A new round, or a game turning three months old, reshuffles the list: never the same game two days running.
    const before = pool(kind, dayAt(index - 1)), y = before.length && pickFrom(before, salt, index - 1);
    return y && order.length > 1 && y.list[y.k] === order[k] ? order[(k + 1) % order.length] : order[k];
  }
  function when(g, day) {
    if (!iso(g)) return { date: g.date, count: '' };
    const d = ymd(g.date), n = Math.round((d - day) / DAY);
    return { date: d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      count: n > 1 ? `in ${n} days` : n === 1 ? 'tomorrow' : n === 0 ? 'out today' : 'out now', out: n <= 0 };
  }
  // What's coming to PS5 and Switch (big games and indies), soonest first.
  const comingUp = (day, n) => (G.coming || []).filter(g => iso(g) ? daysTo(g.date, day) >= 0 : !g.until || daysTo(g.until, day) >= 0).slice(0, n);
  const shortDate = (g, day) => !iso(g) ? g.date : daysTo(g.date, day) === 0 ? 'Today'
    : ymd(g.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  // The phone's pictures are smaller copies in photos/ (tools/phone-photos.py), named like the desktop's images/.
  const photo = g => g.img ? g.img.replace(/^images\//, 'photos/') : '';
  const outOn = g => iso(g) ? 'Out ' + ymd(g.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : g.year;
  const byline = g => [g.dev, outOn(g), (g.platforms || []).join(', ')].filter(Boolean).map(esc).join(' &middot; ') + (g.meta ? ` &middot; <span class="meta">${g.meta}</span>` : '');
  const tags = g => (g.platforms || []).map(p => `<i class="tag ${p === 'PS5' ? 'tag-ps' : 'tag-sw'}">${esc(p)}</i>`).join('') +
    (g.kind === 'indie' ? '<i class="tag tag-indie">Indie</i>' : '');
  const pic = (g, extra = '') => `<div class="d-pic gpic${g.box ? ' boxed' : ''}">${g.img ? `<img src="${esc(photo(g))}" alt="" loading="lazy">` : `<div class="noimg">${esc(g.name)}</div>`}${extra}</div>`;

  function draw() {
    const day = today(), index = Math.round((day - start) / DAY);
    const mv = ofTheDay('metroidvania', 1, index), indie = ofTheDay('indie', 2, index), next = ofTheDay('metroidvania', 1, index + 1);
    const ps5 = ofTheDay('ps5', 3, index), w = ps5 ? when(ps5, day) : null;
    const cal = comingUp(day, 12);
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
        <div class="d-title"><span class="kick ps">${w.out ? 'New on PS5' : 'Coming to PS5'}</span><h2 class="mast">${esc(ps5.name)}</h2>
          <div class="by">${esc(w.date)}${ps5.dev ? ` &middot; ${esc(ps5.dev)}` : ''}</div></div>
        ${pic(ps5, w.count ? `<div class="count${w.out ? ' out' : ''}">${esc(w.count)}</div>` : '')}
        ${ps5.why || ps5.about || ps5.pitch ? `<div class="d-card">${ps5.why ? `<p class="why">${esc(ps5.why)}</p>` : ''}${ps5.about || ps5.pitch ? `<p class="pitch">${esc(ps5.about || ps5.pitch)}</p>` : ''}</div>` : ''}
      </section>` : ''}
      <div class="d-card cal"><h2>Coming up on PS5 and Switch</h2><p class="sub">Big games and indies, soonest first</p>
        <ol>${cal.map(g => `<li class="${ps5 && g.slug === ps5.slug ? 'on' : ''}"><b>${esc(shortDate(g, day))}</b><span class="n">${esc(g.name)}</span><span class="tags">${tags(g)}</span></li>`).join('')}</ol></div>
      ${next ? `<div class="d-next"><div>Tomorrow’s cover<b>${esc(next.name)}</b></div></div>` : ''}
      <p class="credit-line">Screenshots from Steam; cover art and descriptions from Wikipedia.</p>`;
    document.querySelector('.d-theme').onclick = ev => { const b = ev.target.closest('button'); if (b) setTheme(b.dataset.t); };
    setTheme(theme);
  }
  draw();
  let shown = today().toDateString();
  setInterval(() => { if (today().toDateString() !== shown) { shown = today().toDateString(); draw(); } }, 60e3);
})();
