// Dylan's Athletics on a phone (Dylan's Open Mats until October 15, 2026). First, from the desktop app's athletics.js: run
// clubs (every weekly run, today's first), archery and pickleball around Fort Lauderdale; tap a place for Apple Maps.
// Then the open mats, from the desktop app's mats.js and mapdata.js (copied into desktop/ by the
// store's build). Top: the title, the key, and a map in four stretches of coast (a phone is too narrow for the whole
// coast at once), a numbered pin per gym. Below: the Saturday and Sunday papers, and every academy north to south.
// Tap any gym (its number on the map, its line on a paper, or its row in the list) and it's highlighted everywhere,
// with a sheet: its times, a big Call button, driving directions in Apple Maps, and its Instagram.
(function () {
  'use strict';
  const D = window.OPEN_MATS || { gyms: [] }, MAPD = window.OPENMATS_MAP;
  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  // Each gym's number is its place north to south, the same as on the desktop.
  const gyms = D.gyms.map((g, i) => ({ ...g, n: i + 1, days: (g.sat?.length ? 1 : 0) + (g.sun?.length ? 2 : 0) }));
  // A gym whose weekend times aren't known yet gets a gray pin, as on the desktop.
  const dayColor = g => g.days === 3 ? 'var(--wknd)' : g.days === 1 ? 'var(--sat)' : g.days === 2 ? 'var(--sun)' : 'var(--unknown)';
  const tel = p => 'tel:+1' + String(p).replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '');

  // ?demo (the store's pictures) pretends it's Saturday at 11:15 AM, so a paper shows what's over and what's on.
  const now = Phone.params.has('demo') ? (() => { const d = new Date(); d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7)); d.setHours(11, 15, 0, 0); return d; })() : new Date();

  // The gym that was tapped last: highlighted on the map, the papers and the list (0 = none).
  let sel = 0;

  // ================================================================ The map
  // Four stretches, north to south; each map fits its gyms (and the coast), so the pins have room.
  const AREAS = [
    { name: 'Palm Beach', from: 26.56, to: 27.1 },
    { name: 'Boynton to Boca', from: 26.30, to: 26.56 },
    { name: 'Broward', from: 25.96, to: 26.30 },
    { name: 'Miami', from: 25.0, to: 25.96 },
  ].map(a => ({ ...a, gyms: gyms.filter(g => g.at[0] >= a.from && g.at[0] < a.to) })).filter(a => a.gyms.length);
  const areaOf = g => Math.max(0, AREAS.findIndex(a => a.gyms.includes(g)));
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
    // The tapped gym is drawn last, so it sits on top of its neighbors.
    lab.sort((a, b) => (a.g.n === sel) - (b.g.n === sel));
    for (const { px, py, x, y } of lab) svg += `<line class="mline" x1="${px}" y1="${py}" x2="${x}" y2="${y}"/>`;
    for (const { g, px, py } of lab) {
      if (g.n === sel) svg += `<circle class="mring" cx="${px}" cy="${py}" r="13" style="stroke:${dayColor(g)}"/>`;
      svg += `<circle class="mpin" cx="${px}" cy="${py}" r="7" style="fill:${dayColor(g)}"/>`;
    }
    for (const { g, x, y } of lab) {
      const on = g.n === sel, wd = (g.n > 9 ? 22 : 17) + (on ? 8 : 0), h = on ? 22 : 16;
      // A bigger invisible circle around each number makes it easy to hit with a thumb.
      svg += `<g class="mnum${on ? ' sel' : ''}" data-gym="${g.n}" role="button" aria-label="${esc(g.name)}">
        <circle class="hit" cx="${x}" cy="${y}" r="16"/>
        <rect x="${x - wd / 2}" y="${y - h / 2}" width="${wd}" height="${h}" rx="${h / 2}" style="stroke:${dayColor(g)}${on ? ';fill:' + dayColor(g) : ''}"/>
        <text x="${x}" y="${y + (on ? 4.5 : 4)}">${g.n}</text></g>`;
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
        return `<button class="mat ${gi} ${st}${m.g.n === sel ? ' sel' : ''}" data-gym="${m.g.n}">
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
    $('source').innerHTML = `${gyms.length} gyms, from Let's Roll (letsroll.co), checked ${checked}; phone numbers from the gyms' own websites. Times and prices change: call or check the gym's Instagram before you drive over.`;
  }

  // ================================================================ Every academy, north to south
  function drawAll() {
    // Its weekend days; a gym whose weekend times aren't listed says so.
    const days = g => (g.sat?.length ? '<i class="d sat">Sat</i>' : '') + (g.sun?.length ? '<i class="d sun">Sun</i>' : '') || '<i class="d none">Not listed</i>';
    $('all').innerHTML = `<div class="dir paper"><i class="pin" style="--base:#6b3aa0"></i>
      <h2>All academies <span class="count">${gyms.length} gyms</span></h2>
      <p class="dir-sub">North to south. Tap one to call or drive there.</p>
      ${AREAS.map(a => `<h3>${a.name}</h3>${a.gyms.map(g => `<button class="row${g.n === sel ? ' sel' : ''}" data-gym="${g.n}">
          <span class="n" style="background:${dayColor(g)}">${g.n}</span>
          <span class="g">${esc(g.name)}<small>${esc(g.city)}${g.phone ? ` &middot; ${esc(g.phone)}` : ''}</small></span>
          <span class="days">${days(g)}</span><span class="chev" aria-hidden="true">&rsaquo;</span></button>`).join('')}`).join('')}
    </div>`;
  }

  // Highlights gym n everywhere: its number on the map (switching to its stretch of coast), its paper lines, its row.
  function select(n) {
    sel = n;
    document.querySelectorAll('.mat[data-gym], .row[data-gym]').forEach(el => el.classList.toggle('sel', +el.dataset.gym === n));
    const g = gyms[n - 1];
    if (g) area = areaOf(g);
    drawMap();
  }

  // ================================================================ A gym, tapped
  const sheet = $('sheet'), scrim = $('scrim');
  const close = () => {
    sheet.classList.remove('open'); scrim.classList.remove('open');
    sheet.setAttribute('aria-hidden', 'true');
  };
  sheet.querySelector('.sheet-close').addEventListener('click', close);
  scrim.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  const GI = { gi: 'Gi', nogi: 'No-gi', both: 'Gi and no-gi' };
  const ICON = {
    call: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" fill="currentColor"/></svg>',
    go: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.7 11.3l-9-9a1 1 0 0 0-1.4 0l-9 9a1 1 0 0 0 0 1.4l9 9a1 1 0 0 0 1.4 0l9-9a1 1 0 0 0 0-1.4zM14 14.5V12h-4v3H8v-4a1 1 0 0 1 1-1h5V7.5l3.5 3.5z" fill="currentColor"/></svg>',
    ig: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.3" cy="6.7" r="1.2" fill="currentColor"/></svg>',
  };
  function openGym(n) {
    const g = gyms[n - 1];
    if (!g) return;
    select(n);
    const when = (day, label) => (g[day] || []).map(m => `<div class="when"><b>${label}</b> ${fmt(m.from)}&ndash;${fmt(m.to)}${ampm(m.to)}${(m.gi || g.gi) ? ` &middot; <span class="${m.gi || g.gi}">${GI[m.gi || g.gi]}</span>` : ''}</div>`).join('');
    const price = g.price === 'free' ? '<span class="p free">Free</span>' : g.price ? esc(g.price) : 'Price not listed';
    // Apple Maps, ready to drive to the gym's spot.
    const drive = `https://maps.apple.com/?daddr=${g.at[0]},${g.at[1]}&dirflg=d`;
    $('gym').innerHTML = `<div class="gym-n" style="background:${dayColor(g)}">${g.n}</div>
      <h2>${esc(g.name)}</h2>
      <p class="addr">${esc(g.street)}, ${esc(g.city)}</p>
      ${when('sat', 'Saturday')}${when('sun', 'Sunday')}
      ${g.days ? `<p class="price">${price}</p>` : ''}
      ${g.note ? `<p class="gnote">${esc(g.note)}</p>` : ''}
      <div class="acts${g.phone ? '' : ' one'}">
        ${g.phone ? `<a class="act call" href="${tel(g.phone)}">${ICON.call}<span>Call<small>${esc(g.phone)}</small></span></a>` : ''}
        <a class="act go" href="${drive}">${ICON.go}<span>Directions<small>Apple Maps, driving</small></span></a>
      </div>
      ${g.ig ? `<a class="act ig" href="https://instagram.com/${esc(g.ig)}">${ICON.ig}<span>@${esc(g.ig)}</span></a>` : ''}`;
    sheet.scrollTop = 0;
    sheet.classList.add('open'); scrim.classList.add('open');
    sheet.setAttribute('aria-hidden', 'false');
  }

  document.addEventListener('click', e => {
    const t = e.target.closest('[data-area]'), gym = e.target.closest('[data-gym]'), jump = e.target.closest('[data-jump]');
    if (t) { area = +t.dataset.area; drawMap(); }
    else if (gym) openGym(+gym.dataset.gym);
    else if (jump) { e.preventDefault(); $(jump.dataset.jump).scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });

  // ================================================================ Run clubs, archery and pickleball
  function drawAthletics() {
    const A = window.ATHLETICS || { places: [], runs: [] };
    const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], today = now.getDay();
    const k = r => (DOW.indexOf(r.day) - today + 7) % 7;
    const mins = t => { const [, h, m, ap] = t.match(/(\d+):(\d+) (AM|PM)/); return (+h % 12 + (ap === 'PM' ? 12 : 0)) * 60 + +m; };
    const byId = Object.fromEntries(A.places.map(p => [p.id, p]));
    const drive = p => `https://maps.apple.com/?daddr=${p.at[0]},${p.at[1]}&dirflg=d`;
    // Today's runs, as on the desktop: on now (its first hour) has its time in red, then it's crossed off.
    const nowMins = now.getHours() * 60 + now.getMinutes();
    const state = r => k(r) !== 0 ? '' : nowMins >= mins(r.time) + 60 ? ' past' : nowMins >= mins(r.time) ? ' now' : '';
    const runs = [...A.runs].sort((a, b) => k(a) - k(b) || mins(a.time) - mins(b.time)).map(r => {
      const p = byId[r.place], day = k(r) === 0 ? 'Today' : k(r) === 1 ? 'Tmrw' : r.day;
      const inner = `<span class="ad${k(r) === 0 ? ' today' : ''}">${day}</span><span class="at">${esc(r.time.replace(':00', '').replace(' AM', 'a').replace(' PM', 'p'))}</span>
        <span class="g">${esc(r.club)}${r.what ? ` <i>${esc(r.what)}</i>` : ''}<small>${esc(p ? p.name : r.where || '')}</small></span>`;
      return p ? `<a class="arow${state(r)}" href="${drive(p)}">${inner}<span class="chev">&rsaquo;</span></a>` : `<div class="arow${state(r)}">${inner}<span></span></div>`;
    }).join('');
    const placeList = kind => A.places.filter(p => p.kind === kind).map(p => `<a class="prow" href="${drive(p)}">
        <span class="g">${esc(p.name)}${p.cost === 'free' ? ' <span class="stamp">Free</span>' : ''}
        <small>${esc(p.what || '')}</small><small>${esc(p.when || '')}${p.cost && p.cost !== 'free' ? ` &middot; ${esc(p.cost)}` : ''}</small>
        <small>${esc(p.where || '')}</small></span><span class="chev">&rsaquo;</span></a>`).join('');
    $('ath').innerHTML = `
      <div class="dir paper"><i class="pin" style="--base:#e0632a"></i><h2>Run clubs <span class="count">every week</span></h2>
        <p class="dir-sub">Today's first. Tap one to drive to the meeting spot.</p>${runs}</div>
      <div class="dir paper"><i class="pin" style="--base:#2f8a55"></i><h2>Archery</h2>${placeList('archery')}</div>
      <div class="dir paper"><i class="pin" style="--base:#2f6fd1"></i><h2>Pickleball <span class="count">The Fort &amp; free courts</span></h2>${placeList('pickle')}</div>`;
  }
  drawAthletics();

  $('jump').textContent = `All ${gyms.length} academies`;
  if (!gyms.some(g => !g.days)) $('key-unknown').remove();
  drawMap();
  drawDays();
  drawAll();
  setInterval(drawDays, 5 * 60e3);   // crossing off what's over, on the day
})();
