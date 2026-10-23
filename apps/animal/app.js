// Animal of the Day on a phone: the same animal as the desktop app on the same day (desktop/animals.js: ANIMAL_ORDER,
// one a day from ANIMAL_START), its photo, what it teaches, the facts, and where it lives (desktop/ranges.js).
(function () {
  'use strict';
  const all = window.ANIMALS || [], byN = new Map(all.map(a => [a.n, a])), order = window.ANIMAL_ORDER || all.map(a => a.n);
  const q = Phone.params, html = document.documentElement;
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  let theme = q.get('theme') || Phone.store.get('animal.theme', 'dark');
  function setTheme(t) {
    theme = t === 'light' ? 'light' : 'dark';
    html.dataset.theme = theme;
    Phone.store.set('animal.theme', theme);
    document.querySelectorAll('.d-theme button').forEach(b => b.classList.toggle('on', b.dataset.t === theme));
    document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#0e0f12' : '#f5f3ee';
  }
  function today() {
    const p = q.get('date');
    if (p) { const [y, m, d] = p.split('-').map(Number); return new Date(y, m - 1, d); }
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  }
  function pick(date) {
    const [y, m, d] = (window.ANIMAL_START || '2026-10-09').split('-').map(Number);
    const i = Math.round((date - new Date(y, m - 1, d)) / 86400000);
    return byN.get(order[((i % order.length) + order.length) % order.length]);
  }
  const GROUP_COLOR = { Mammal: '#c98a4b', Bird: '#4f8fd6', Reptile: '#5f9e4a', Amphibian: '#3fae8c', Fish: '#2f86b5',
    Insect: '#d0a12b', Crustacean: '#d0603f', Mollusc: '#a46ad0', Cnidarian: '#d06ab4', 'Micro-animal': '#8a8f99',
    Arachnid: '#6c74d6', Echinoderm: '#cf4a5a', Worm: '#9aae3a', Arthropod: '#7d8fa8' };
  const STATUS = { LC: 'Least concern', NT: 'Near threatened', VU: 'Vulnerable', EN: 'Endangered', CR: 'Critically endangered', EW: 'Extinct in the wild', EX: 'Extinct' };
  const weight = kg => kg == null ? null : kg >= 1000 ? `${(kg / 1000).toFixed(1)} t (${Math.round(kg * 2.20462).toLocaleString()} lb)`
    : kg >= 1 ? `${kg < 10 ? kg.toFixed(1) : Math.round(kg)} kg (${Math.round(kg * 2.20462).toLocaleString()} lb)` : `${Math.round(kg * 1000)} g (${(kg * 35.274).toFixed(1)} oz)`;
  const length = m => m == null ? null : m >= 1 ? `${m.toFixed(1)} m (${Math.round(m * 3.28084)} ft)` : `${Math.round(m * 100)} cm (${(m * 39.3701).toFixed(1)} in)`;
  // Wikimedia keeps the full-size original; a phone only needs a 960-pixel copy (one of the sizes Wikimedia makes itself; 800 is refused).
  const thumb = src => {
    const m = /^https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/(\w)\/(\w\w)\/([^?]+)/.exec(src || '');
    return m ? `https://upload.wikimedia.org/wikipedia/commons/thumb/${m[1]}/${m[2]}/${m[3]}/960px-${m[3]}${/\.svg$/i.test(m[3]) ? '.png' : ''}` : src;
  };
  function rangeMap(a) {
    const M = window.ANIMAL_MAP, r = M && M.ranges && M.ranges[a.name];
    if (!r) return '';
    const inside = new Set(r.countries), c = GROUP_COLOR[a.group] || '#8a8f99';
    const land = Object.entries(M.shapes).map(([n, d]) => `<path d="${d}" fill="${inside.has(n) ? c : 'var(--land)'}" stroke="var(--bg)" stroke-width=".4"/>`).join('');
    const seas = r.seas.map(([x1, y1, x2, y2]) => `<rect x="${x1}" y="${y1}" width="${x2 - x1}" height="${y2 - y1}" fill="${c}" opacity=".25"/>`).join('');
    const areas = r.areas.map(([x, y, rad]) => `<circle cx="${x}" cy="${y}" r="${Math.max(rad, 5)}" fill="${c}" opacity=".8"/>`).join('');
    return `<div class="d-map"><svg viewBox="0 0 ${M.w} ${M.h}">${seas}${land}${areas}</svg></div>`;
  }

  function draw() {
    const day = today(), asked = Number((location.hash.match(/n=(\d+)/) || [])[1]);
    const a = byN.get(asked) || pick(day);
    const c = GROUP_COLOR[a.group] || '#8a8f99';
    const facts = [['Weight', weight(a.mass)], ['Length', length(a.length)], ['Lives', a.life != null ? `${Math.round(a.life)} years` : null],
      ['In the wild', STATUS[a.status] || 'Not assessed']].filter(x => x[1]);
    document.getElementById('animal').innerHTML = `
      <div class="d-head"><div><div class="k">Animal of the day</div>
        <div class="date">${esc(day.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }))}</div></div>
        <div class="d-theme"><button data-t="light">Light</button><button data-t="dark">Dark</button></div></div>
      <div class="d-title"><span class="d-tag" style="background:${c}">${esc(a.group)}</span>
        <h1 class="serif" style="margin-top:10px">${esc(a.name)}</h1><div class="sub">${esc(a.sci || '')}</div></div>
      ${a.photo ? `<div class="d-pic"><img src="${esc(thumb(a.photo.src))}" alt="" loading="lazy"><div class="credit">Photo: ${esc(a.photo.credit || '')}${a.photo.license ? ` &middot; ${esc(a.photo.license)}` : ''} &middot; Wikimedia Commons</div></div>` : ''}
      <div class="d-card"><h2>What it teaches</h2><p class="big">${esc(a.lesson)}</p></div>
      <div class="d-card"><h2>Where it lives</h2>${rangeMap(a)}<p style="margin-top:10px">${esc(a.where)}</p></div>
      <div class="d-card"><h2>What it eats</h2><p>${esc(a.diet)}</p></div>
      <div class="d-card"><h2>About</h2><p>${esc(a.about)}</p></div>
      <div class="d-card"><h2>Fun facts</h2><ol>${(a.facts || []).map(f => `<li>${esc(f)}</li>`).join('')}</ol></div>
      ${facts.length ? `<div class="d-card"><h2>The numbers</h2><div class="d-facts">${facts.map(([k, v]) => `<div>${k}<b>${esc(v)}</b></div>`).join('')}</div></div>` : ''}`;
    // (no "Tomorrow" preview: Dylan took it off, October 19, 2026)
    document.querySelector('.d-theme').onclick = ev => { const b = ev.target.closest('button'); if (b) setTheme(b.dataset.t); };
    setTheme(theme);
  }
  draw();
  addEventListener('hashchange', draw);
  let shown = today().toDateString();
  setInterval(() => { if (today().toDateString() !== shown) { shown = today().toDateString(); draw(); } }, 60e3);
})();
