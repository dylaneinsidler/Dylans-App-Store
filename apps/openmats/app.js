// Dylan's Open Mats on a phone, from the desktop app's mats.js and mapdata.js (copied into desktop/ by the
// store's build). Top: the title, the key, and a map in four stretches of coast (a phone is too narrow for the whole
// coast at once), a numbered pin per gym. Below: the Saturday and Sunday papers. Tap a gym for its details.
(function () {
  'use strict';
  const D = window.OPEN_MATS || { gyms: [] }, MAPD = window.OPENMATS_MAP;
  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  // Each gym's number is its place north to south, the same as on the desktop.
  const gyms = D.gyms.map((g, i) => ({ ...g, n: i + 1, days: (g.sat?.length ? 1 : 0) + (g.sun?.length ? 2 : 0) }));
  const dayColor = g => g.days === 3 ? 'var(--wknd)' : g.days === 1 ? 'var(--sat)' : 'var(--sun)';

  // ?demo (the store's pictures) pretends it's Saturday at 11:15 AM, so a paper shows what's over and what's on.
  const now = Phone.params.has('demo') ? (() => { const d = new Date(); d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7)); d.setHours(11, 15, 0, 0); return d; })() : new Date();

  // ================================================================ The map
  // Four stretches, north to south; each map fits its gyms (and the coast), so the pins have room.
  const AREAS = [
    { name: 'Palm Beach', from: 26.56, to: 27.1 },
    { name: 'Boynton to Boca', from: 26.30, to: 26.56 },
    { name: 'Broward', from: 25.96, to: 26.30 },
    { name: 'Miami', from: 25.0, to: 25.96 },
  ].map(a => ({ ...a, gyms: gyms.filter(g => g.at[0] >= a.from && g.at[0] < a.to) })).filter(a => a.gyms.length);
  const CITIES = [['Jupiter', 26.934, -80.094], ['West Palm Beach', 26.715, -80.054], ['Wellington', 26.658, -80.24],
    ['Boynton Beach', 26.525, -80.07], ['Delray Beach', 26.461, -80.073], ['Boca Raton', 26.368, -80.11],
    ['Coral Springs', 26.271, -80.27], ['Pompano Beach', 26.238, -80.125], ['Fort Lauderdale', 26.122, -80.137],
    ['Weston', 26.1, -80.4], ['Hollywood', 26.011, -80.149], ['Hialeah', 25.858, -80.278], ['Miami', 25.762, -80.192],
    ['Kendall', 25.679, -80.317], ['Doral', 25.819, -80.355]];
  const BIG = /I- 95|Tpke|I- 75|I- 595|Sawgrass/;
  let area = 0;

  function drawMap() {
    const A = AREAS[area], W = 360;
    // The box: the area's gyms with room around them, out to the sea on the right.
    let s = Math.min(...A.gyms.map(g => g.at[0])) - 0.035, n = Math.max(...A.gyms.map(g => g.at[0])) + 0.035;
    let w = Math.min(...A.gyms.map(g => g.at[1])) - 0.05, e = Math.max(-80.0, Math.max(...A.gyms.map(g => g.at[1])) + 0.05);
    const cos = Math.cos((s + n) / 2 * Math.PI / 180);
    // Not too tall or too wide for a phone: widen whichever side is short.
    const ratio = (n - s) / ((e - w) * cos);
    if (ratio > 1.35) { const extra = ((n - s) / 1.35 / cos - (e - w)) / 2; w -= extra * 1.6; e += extra * 0.4; }
    if (ratio < 0.8) { const extra = ((e - w) * cos * 0.8 - (n - s)) / 2; s -= extra; n += extra; }
    const k = W / ((e - w) * cos), H = Math.round((n - s) * k);
    const P = ([lat, lon]) => [(lon - w) * cos * k, (n - lat) * k];
    const path = (pts, close) => pts.map((p, i) => { const [x, y] = P([p[1], p[0]]); return (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1); }).join('') + (close ? 'Z' : '');
    let svg = `<rect class="sea" width="${W}" height="${H}"/>`;
    if (MAPD) {
      svg += MAPD.land.map(r => `<path class="land" d="${path(r, true)}"/>`).join('');
      svg += MAPD.roads.map(r => `<path class="road${BIG.test(r.name) ? ' major' : ''}" d="${path(r.line)}"/>`).join('');
    }
    for (const [name, lat, lon] of CITIES) {
      if (lat < s + 0.01 || lat > n - 0.01 || lon < w || lon > e) continue;
      const [x, y] = P([lat, lon]);
      svg += `<circle class="city-dot" cx="${x}" cy="${y}" r="2"/><text class="city" x="${x - 5}" y="${y + 3}" text-anchor="end">${name}</text>`;
    }
    svg += `<text class="water-name" x="${W - 14}" y="${H * 0.5}" transform="rotate(90 ${W - 14} ${H * 0.5})">Atlantic Ocean</text>`;
    // Numbers beside their pins, nudged apart where they'd overlap, with a thin line back to the pin.
    const lab = A.gyms.map(g => { const [x, y] = P(g.at); return { g, px: x, py: y, x: x + 13, y: y - 11 }; });
    for (let it = 0; it < 200; it++) {
      for (const a of lab) for (const b of lab) {
        if (a === b) continue;
        const dx = a.x - b.x, dy = a.y - b.y;
        if (Math.abs(dx) < 24 && Math.abs(dy) < 17) { a.y += (dy === 0 ? 1 : Math.sign(dy)) * 1; a.x += Math.sign(dx || 1) * 0.5; }
      }
      for (const a of lab) { a.x += (a.px + 13 - a.x) * 0.02; a.y += (a.py - 11 - a.y) * 0.02; a.x = Math.max(12, Math.min(W - 12, a.x)); a.y = Math.max(10, Math.min(H - 10, a.y)); }
    }
    for (const { px, py, x, y } of lab) svg += `<line class="mline" x1="${px}" y1="${py}" x2="${x}" y2="${y}"/>`;
    for (const { g, px, py } of lab) svg += `<circle class="mpin" cx="${px}" cy="${py}" r="7" style="fill:${dayColor(g)}"/>`;
    for (const { g, x, y } of lab) {
      const wd = g.n > 9 ? 22 : 17;
      svg += `<g class="mnum" data-gym="${g.n}"><rect x="${x - wd / 2}" y="${y - 8}" width="${wd}" height="16" rx="8" style="stroke:${dayColor(g)}"/><text x="${x}" y="${y + 4}">${g.n}</text></g>`;
    }
    $('map').innerHTML = `<svg viewBox="0 0 ${W} ${H}">${svg}</svg>`;
    $('tabs').innerHTML = AREAS.map((a, i) => `<button class="${i === area ? 'on' : ''}" data-area="${i}">${a.name}</button>`).join('');
  }

  // ================================================================ The papers
  const fmt = t => { const [h, m] = t.split(':').map(Number); return `${(h % 12) || 12}${m ? ':' + String(m).padStart(2, '0') : ''}`; };
  const ampm = t => +t.split(':')[0] < 12 ? 'am' : 'pm';
  const mins = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
  function state(day, m) {
    const dow = now.getDay();
    if (!((day === 'sat' && dow === 6) || (day === 'sun' && dow === 0))) return '';
    const t = now.getHours() * 60 + now.getMinutes();
    return t >= mins(m.to) ? 'past' : t >= mins(m.from) ? 'now' : '';
  }
  function paper(day, title) {
    const list = [];
    for (const g of gyms) for (const m of g[day] || []) list.push({ g, ...m });
    list.sort((a, b) => a.from.localeCompare(b.from) || a.g.n - b.g.n);
    const date = new Date(now); date.setDate(date.getDate() + (((day === 'sat' ? 6 : 0) - date.getDay() + 7) % 7));
    return `<div class="day paper ${day}"><i class="pin" style="--base:${day === 'sat' ? '#d97a1c' : '#1b7f86'}"></i>
      <h2>${title} <small>${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</small><span class="count">${list.length} open mats</span></h2>
      ${list.map(m => {
        const gi = m.gi || m.g.gi || '', price = m.price || m.g.price, st = state(day, m);
        const tag = price === 'free' ? '<span class="p free">Free</span>' : price ? `<span class="p paid">${esc(price)}</span>` : '';
        return `<button class="mat ${gi} ${st}" data-gym="${m.g.n}">
          <span class="n" style="background:${dayColor(m.g)}">${m.g.n}</span>
          <span class="t">${fmt(m.from)}&ndash;${fmt(m.to)}${ampm(m.to)}${st === 'now' ? '<em>on now</em>' : ''}</span>
          <span class="g">${esc(m.g.name)}<small>${esc(m.g.city)}</small></span>${tag}</button>`;
      }).join('')}
    </div>`;
  }
  function drawDays() {
    $('sat').innerHTML = paper('sat', 'Saturday');
    $('sun').innerHTML = paper('sun', 'Sunday');
    const checked = new Date(D.checked + 'T12:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    $('source').innerHTML = `${gyms.length} gyms, from Let's Roll (letsroll.co), checked ${checked}. Times and prices change: check the gym's Instagram before you drive over.`;
  }

  // ================================================================ A gym, tapped
  const sheet = $('sheet');
  const close = () => { sheet.classList.remove('open'); sheet.setAttribute('aria-hidden', 'true'); };
  sheet.querySelector('.sheet-close').addEventListener('click', close);
  const GI = { gi: 'Gi', nogi: 'No-gi', both: 'Gi and no-gi' };
  function openGym(n) {
    const g = gyms[n - 1];
    if (!g) return;
    const when = (day, label) => (g[day] || []).map(m => `<div class="when"><b>${label}</b> ${fmt(m.from)}&ndash;${fmt(m.to)}${ampm(m.to)}${(m.gi || g.gi) ? ` &middot; <span class="${m.gi || g.gi}">${GI[m.gi || g.gi]}</span>` : ''}</div>`).join('');
    const price = g.price === 'free' ? '<span class="p free">Free</span>' : g.price ? esc(g.price) : 'Price not listed';
    const q = encodeURIComponent(`${g.name}, ${g.street}, ${g.city}, FL`);
    $('gym').innerHTML = `<div class="gym-n" style="background:${dayColor(g)}">${g.n}</div>
      <h2>${esc(g.name)}</h2>
      <p class="addr">${esc(g.street)}, ${esc(g.city)}</p>
      ${when('sat', 'Saturday')}${when('sun', 'Sunday')}
      <p class="price">${price}</p>
      ${g.note ? `<p class="gnote">${esc(g.note)}</p>` : ''}
      <div class="links"><a class="go" href="https://maps.apple.com/?q=${q}&ll=${g.at[0]},${g.at[1]}">Directions</a>
        ${g.ig ? `<a href="https://instagram.com/${esc(g.ig)}">@${esc(g.ig)}</a>` : ''}</div>`;
    sheet.classList.add('open');
    sheet.setAttribute('aria-hidden', 'false');
  }

  document.addEventListener('click', e => {
    const t = e.target.closest('[data-area]'), gym = e.target.closest('[data-gym]');
    if (t) { area = +t.dataset.area; drawMap(); }
    else if (gym) openGym(+gym.dataset.gym);
  });

  drawMap();
  drawDays();
  setInterval(drawDays, 5 * 60e3);   // crossing off what's over, on the day
})();
