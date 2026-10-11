// Element of the Day on a phone: the same element as the desktop app on the same day (the same shuffle, from
// desktop/elements.js): its tile, the periodic table (tap any element), then its photo, where you meet it, what it is
// and its facts. All 118 can be browsed: Previous / Next (or swipe), a search by name, symbol or number, and
// "Back to today". #n=26 opens one.
(function () {
  'use strict';
  const D = window.ELEMENTS, q = Phone.params, html = document.documentElement;
  const byN = Object.fromEntries(D.elements.map(e => [e.number, e]));
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // ---- Light / Dark (dark first, like the desktop app) ----
  let theme = q.get('theme') || Phone.store.get('element.theme', 'dark');
  function setTheme(t) {
    theme = t === 'light' ? 'light' : 'dark';
    html.dataset.theme = theme;
    Phone.store.set('element.theme', theme);
    document.querySelectorAll('.d-theme button').forEach(b => b.classList.toggle('on', b.dataset.t === theme));
    document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#0e0f12' : '#f5f3ee';
  }

  // ---- The day: the same shuffled rounds of 118 as the desktop's element.js ----
  function today() {
    const p = q.get('date');
    if (p) { const [y, m, d] = p.split('-').map(Number); return new Date(y, m - 1, d); }
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  }
  const dayIndex = date => { const [y, m, d] = D.start.split('-').map(Number); return Math.round((date - new Date(y, m - 1, d)) / 864e5); };
  const random = seed => () => {
    seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
  const shuffled = r => {
    const order = D.elements.map(e => e.number), next = random(7919 * r + 1000);
    for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(next() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
    return order;
  };
  const rounds = new Map();
  const roundOrder = r => {
    if (!rounds.has(r)) {
      const order = shuffled(r), before = shuffled(r - 1);
      if (order[0] === before[before.length - 1]) [order[0], order[1]] = [order[1], order[0]];
      rounds.set(r, order);
    }
    return rounds.get(r);
  };
  const place = date => { const i = dayIndex(date), r = Math.floor(i / 118); return { r, k: i - r * 118, order: roundOrder(r) }; };
  const numberFor = date => { const p = place(date); return p.order[p.k]; };
  const addDays = (date, n) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + n);

  // ---- The families' pastel colors (as on the desktop) ----
  const FAMILIES = [
    ['alkali metal', 'Alkali metals', '#f4a7a0'], ['alkaline earth metal', 'Alkaline earth metals', '#f6c79e'],
    ['transition metal', 'Transition metals', '#efdf9a'], ['post-transition metal', 'Other metals', '#b5e0bf'],
    ['metalloid', 'Metalloids', '#a3ddd5'], ['nonmetal', 'Nonmetals', '#a8c8f2'], ['noble gas', 'Noble gases', '#cbb9f2'],
    ['lanthanide', 'Lanthanides', '#f3b6d3'], ['actinide', 'Actinides', '#dcc3a6'],
  ];
  const family = e => { const c = (e.category || '').replace(/^unknown, (probably|predicted to be) /, '').replace(/^(diatomic|polyatomic) /, '');
    return FAMILIES.find(f => f[0] === c) || FAMILIES[2]; };
  const F = k => k == null ? '–' : `${Math.round((k - 273.15) * 9 / 5 + 32).toLocaleString('en-US')}°F`;
  const kind = e => e.category.replace(/^unknown, (probably|predicted to be) /, 'probably ').replace(/\b\w/, c => c.toUpperCase());

  // A long name like Praseodymium shrinks until it fits on one line beside the tile.
  function fitName() {
    const h = document.querySelector('.el-hero h1');
    if (!h) return;
    let size = 38;
    h.style.fontSize = size + 'px';
    while (h.scrollWidth > h.clientWidth && size > 20) h.style.fontSize = --size + 'px';
  }
  addEventListener('resize', fitName);
  if (document.fonts) document.fonts.ready.then(fitName);
  const picked = () => +((location.hash.match(/n=(\d+)/) || [])[1] || q.get('n') || 0);
  function draw() {
    const day = today(), todays = byN[numberFor(day)], e = byN[picked()] || todays, browsing = e !== todays;
    const prev = byN[numberFor(addDays(day, -1))], next = byN[numberFor(addDays(day, 1))];
    const fam = family(e);
    const photo = e.image && !/no image/i.test(e.imageTitle || '') ? `photos/${e.image.replace(/^images\//, '').replace(/\.\w+$/, '.jpg')}` : '';
    document.getElementById('element').innerHTML = `
      ${browsing ? '<a class="back-today" href="#">&larr; Back to today\'s element</a>' : ''}
      <div class="d-head"><div><div class="k">${browsing ? 'Every element' : 'Element of the day'}</div>
        <div class="date">${esc(day.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }))}</div></div>
        <div class="d-theme"><button data-t="light">Light</button><button data-t="dark">Dark</button></div></div>
      <div class="el-hero">
        <div class="tile" style="--fam:${fam[2]}"><span class="n">${e.number}</span><span class="m">${e.mass.toFixed(e.mass < 100 ? 3 : 2)}</span>
          <span class="s serif">${esc(e.symbol)}</span><span class="w">${esc(e.name)}</span></div>
        <div class="d-title"><h1 class="serif">${esc(e.name)}</h1><div class="sub"><i class="fam" style="--fam:${fam[2]}"></i>${esc(kind(e))} &middot; number ${e.number}</div></div>
      </div>
      <div class="d-card"><h2>The periodic table</h2>
        <div class="ptable">${D.elements.map(el => `<a class="c${el.number === e.number ? ' today' : ''}" href="#n=${el.number}" style="grid-column:${el.x};grid-row:${el.y + (el.y >= 8 ? 1 : 0)};--fam:${family(el)[2]}" title="${esc(el.name)}">${esc(el.symbol)}</a>`).join('')}<div class="gap"></div></div>
        <div class="keys">${FAMILIES.map(f => `<span><i style="--fam:${f[2]}"></i>${f[1]}</span>`).join('')}</div>
      </div>
      <div class="browse">
        <a class="pill" href="#n=${e.number === 1 ? 118 : e.number - 1}">&lsaquo; ${esc(byN[e.number === 1 ? 118 : e.number - 1].name)}</a>
        <input class="find" placeholder="Find: name, symbol or number" spellcheck="false" autocomplete="off">
        <a class="pill" href="#n=${e.number === 118 ? 1 : e.number + 1}">${esc(byN[e.number === 118 ? 1 : e.number + 1].name)} &rsaquo;</a>
      </div>
      ${photo ? `<div class="d-pic"><img src="${photo}" alt="" loading="lazy"><div class="credit">${esc(e.imageTitle || '')}${e.imageCredit ? ` &middot; ${esc(e.imageCredit)}` : ''}</div></div>` : ''}
      ${e.uses ? `<div class="d-card"><h2>Where you meet it</h2><p class="big">${esc(e.uses)}</p></div>` : ''}
      <div class="d-card"><h2>What it is</h2><p>${esc(e.summary)}</p></div>
      <div class="d-card"><h2>The facts</h2><div class="d-facts">
        <div>Melts at<b>${F(e.melt)}</b></div><div>Boils at<b>${F(e.boil)}</b></div>
        <div>At room temperature<b>${esc((e.phase || '').toLowerCase() === 'gas' ? 'a gas' : (e.phase || '').toLowerCase() === 'liquid' ? 'a liquid' : 'a solid')}</b></div>
        <div>Weighs<b>${e.density != null ? `${e.density} g per cm³` : '–'}</b></div>
        <div>${/^\d|BC|AD|ancient|prehistor/i.test(e.discovered || '') ? 'Found' : 'Found by'}<b>${esc(e.discovered || '–')}</b></div><div>Electrons<b>${esc((e.shells || []).join(' · '))}</b></div>
        ${e.appearance ? `<div style="grid-column:span 2">Looks like<b>${esc(e.appearance.charAt(0).toUpperCase() + e.appearance.slice(1))}</b></div>` : ''}
      </div></div>
      ${browsing ? '' : `<div class="d-next"><div>Yesterday<b>${esc(prev.name)}</b></div><div style="text-align:right">Tomorrow<b>${esc(next.name)}</b></div></div>`}`;
    document.getElementById('table').innerHTML = '';
    const find = document.querySelector('.find');
    find.onkeydown = ev => {
      if (ev.key !== 'Enter') return;
      const s = find.value.trim().toLowerCase();
      const hit = D.elements.find(x => String(x.number) === s || x.symbol.toLowerCase() === s || x.name.toLowerCase() === s)
        || D.elements.find(x => x.name.toLowerCase().startsWith(s));
      if (hit) location.hash = 'n=' + hit.number; else Phone.toast('No element by that name');
    };
    document.querySelector('.d-theme').onclick = ev => { const b = ev.target.closest('button'); if (b) setTheme(b.dataset.t); };
    setTheme(theme);
    fitName();
  }
  draw();
  addEventListener('hashchange', () => { draw(); scrollTo(0, 0); });
  // Swipe left or right on the element to go to the next or previous one.
  let sx = null, sy = null;
  addEventListener('touchstart', ev => { sx = ev.touches[0].clientX; sy = ev.touches[0].clientY; }, { passive: true });
  addEventListener('touchend', ev => {
    if (sx == null || ev.target.closest('.ptable, input')) return;
    const dx = ev.changedTouches[0].clientX - sx, dy = ev.changedTouches[0].clientY - sy;
    sx = null;
    if (Math.abs(dx) < 70 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    const n = (byN[picked()] || byN[numberFor(today())]).number;
    location.hash = 'n=' + (dx < 0 ? (n === 118 ? 1 : n + 1) : (n === 1 ? 118 : n - 1));
  });
  // A new day while it's open (a phone keeps a page around): show the new element.
  let shown = today().toDateString();
  setInterval(() => { if (today().toDateString() !== shown) { shown = today().toDateString(); draw(); } }, 60e3);
})();
