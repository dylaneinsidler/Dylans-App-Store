// Daily Poetry on a phone: the same poem as the desktop app on the same day (desktop/poems.js: one a day from start, in
// its order), the whole poem, then what it says, why it has lasted, a line to keep, old words, the poet, where it was
// written (desktop/mapdata.js), and the week's poems. (The photo of the day stays on the wall: it's fetched by the PC.)
(function () {
  'use strict';
  const D = window.POEMS, q = Phone.params, html = document.documentElement;
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  let theme = q.get('theme') || Phone.store.get('poetry.theme', 'dark');
  function setTheme(t) {
    theme = t === 'light' ? 'light' : 'dark';
    html.dataset.theme = theme;
    Phone.store.set('poetry.theme', theme);
    document.querySelectorAll('.d-theme button').forEach(b => b.classList.toggle('on', b.dataset.t === theme));
    document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#0e0f12' : '#f5f3ee';
  }
  function today() {
    const p = q.get('date');
    if (p) { const [y, m, d] = p.split('-').map(Number); return new Date(y, m - 1, d); }
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  }
  function poemFor(date) {
    const [y, m, d] = D.start.split('-').map(Number);
    const n = Math.round((date - new Date(y, m - 1, d)) / 864e5);
    const id = D.order[((n % D.order.length) + D.order.length) % D.order.length];
    return { id, ...D.poems[id] };
  }
  // Where it was written: the land around the spot, as on the desktop's map card.
  function mapSvg(p, w, h) {
    const M = window.POETRY_MAP;
    if (!M || p.lat == null) return '';
    const cos = Math.cos(p.lat * Math.PI / 180), spanLon = 16, k = w / (spanLon * cos);
    const P = ([lon, lat]) => [w / 2 + (lon - p.lon) * cos * k, h / 2 - (lat - p.lat) * k];
    const near = ring => ring.some(([lon, lat]) => Math.abs(lon - p.lon) < spanLon && Math.abs(lat - p.lat) < spanLon * 0.8);
    const d = rings => rings.filter(near).map(r => 'M' + r.map(pt => P(pt).map(v => v.toFixed(1)).join(' ')).join('L') + 'Z').join('');
    const [x, y] = P([p.lon, p.lat]), inUS = p.lon < -60 && p.lat > 24;
    return `<svg viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="var(--sea)"/>
      <path d="${d(M.countries)}" fill="var(--land)" stroke="var(--edge)" stroke-width=".6"/>
      ${inUS ? `<path d="${d(M.states)}" fill="none" stroke="var(--edge)" stroke-width=".5"/>` : ''}
      <circle cx="${x}" cy="${y}" r="20" fill="none" stroke="var(--accent)" stroke-width="2"/><circle cx="${x}" cy="${y}" r="7" fill="var(--accent)"/></svg>`;
  }

  function draw() {
    const day = today(), id = q.get('id'), p = id && D.poems[id] ? { id, ...D.poems[id] } : poemFor(day);
    const stanzas = [];
    let cur = [];
    for (const l of p.lines) { if (l.trim() === '') { if (cur.length) stanzas.push(cur); cur = []; } else cur.push(l); }
    if (cur.length) stanzas.push(cur);
    const week = [-3, -2, -1, 0, 1, 2, 3].map(off => { const d = new Date(day.getFullYear(), day.getMonth(), day.getDate() + off); return { d, off, q: poemFor(d) }; });
    document.getElementById('poem').innerHTML = `
      <div class="d-head"><div><div class="k">Poem of the day</div>
        <div class="date">${esc(day.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }))}</div></div>
        <div class="d-theme"><button data-t="light">Light</button><button data-t="dark">Dark</button></div></div>
      <div class="d-title"><h1 class="serif">${esc(p.title)}</h1><div class="sub">${esc(p.author)}</div>
        <div class="where">${esc(p.place)}${p.year ? ` &middot; ${esc(p.year)}` : ''}</div></div>
      <div class="poem serif">${stanzas.map(s => `<p>${s.map(esc).join('<br>')}</p>`).join('')}</div>
      <div class="d-card"><h2>In a sentence</h2><p class="big">${esc(p.sentence)}</p></div>
      <div class="d-card"><h2>Why it has lasted</h2><p>${esc(p.why)}</p></div>
      ${p.keep ? `<div class="d-card"><h2>A line to keep</h2><p class="big keep">&ldquo;${esc(p.keep)}&rdquo;</p></div>` : ''}
      ${p.words && p.words.length ? `<div class="d-card"><h2>Old words</h2><div class="words">${p.words.map(([w, m]) => `<div><b class="serif">${esc(w)}</b><span>${esc(m)}</span></div>`).join('')}</div></div>` : ''}
      <div class="d-card"><h2>The poet</h2><p>${esc(p.poet)}</p></div>
      <div class="d-card"><h2>Where it was written</h2><div class="d-map">${mapSvg(p, 600, 340)}</div><p style="margin-top:8px">${esc(p.place)}</p></div>
      <div class="d-card"><h2>This week</h2><div class="week">${week.map(w => `<div class="${w.off === 0 ? 'now' : ''}"><span>${w.off === 0 ? 'Today' : esc(w.d.toLocaleDateString('en-US', { weekday: 'short' }))}</span>
        <b class="serif">${esc(w.q.title)}</b><small>${esc(w.q.author)}</small></div>`).join('')}</div></div>`;
    document.querySelector('.d-theme').onclick = ev => { const b = ev.target.closest('button'); if (b) setTheme(b.dataset.t); };
    setTheme(theme);
  }
  draw();
  let shown = today().toDateString();
  setInterval(() => { if (today().toDateString() !== shown) { shown = today().toDateString(); draw(); } }, 60e3);
})();
