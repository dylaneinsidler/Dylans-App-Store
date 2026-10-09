// Dylan's Corkboard on a phone. Top board: the desktop app's Local Events (desktop/going.js, taken from
// its events.js by build.mjs), a page per month, with a map from its Census map data (desktop/mapdata.js).
// Bottom board: your own appointments, reminders and birthdays, added here and kept on this phone.
(function () {
  'use strict';
  const G = window.CORKBOARD_GOING, MAPD = window.CORKBOARD_MAP;
  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const color = m => G.monthColors[m % 12];
  const now = new Date(), today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const DAY = 864e5;

  // '2026-10-17' -> a date; '2027-03' (month only, the day to come) -> the 1st, with tba.
  function parse(s) {
    const [y, m, d] = s.split('-').map(Number);
    return { date: new Date(y, m - 1, d || 1), tba: !d };
  }
  const fmtShort = d => `${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}`;
  function countdown(start, end) {
    if (end < today) return '';
    if (start < today) return '<span class="tag today">On now</span>';
    if (start <= today) return '<span class="tag today">Today</span>';
    const n = Math.round((start - today) / DAY);
    if (n > G.countdownDays) return '';
    return `<span class="tag">${n === 1 ? 'Tomorrow' : `In ${n} days`}</span>`;
  }

  // Events -> pages: this month's page always, then the next months that have something, up to `most`.
  // An event over several days sits on its first month's page (and on this month's, if it's still on).
  function pages(list, most, keepEmpty = true) {
    const out = [];
    for (let k = 0; k < 12 && out.length < most; k++) {
      const first = new Date(today.getFullYear(), today.getMonth() + k, 1), next = new Date(first.getFullYear(), first.getMonth() + 1, 1);
      const items = list.filter(it => (it.start >= first && it.start < next) || (k === 0 && it.start < first && it.end >= today))
        .sort((a, b) => a.start - b.start || (a.time || '').localeCompare(b.time || ''));
      if (items.length || (k === 0 && keepEmpty)) out.push({ first, m: first.getMonth(), items, k });
    }
    return out;
  }
  function itemHTML(it, page, { deletable = false } = {}) {
    const ended = it.end < today, cont = it.start < page.first;
    const day = it.tba ? '—' : cont ? '…' : it.start.getDate();
    const dow = it.tba || cont ? '' : DOW[it.start.getDay()];
    const span = it.to ? `through ${fmtShort(it.end)}` : '';
    const extra = [it.tba ? (it.tbaText || 'Date to come') : '', span, it.time, it.where, it.note].filter(Boolean).map(esc).join(' · ');
    return `<div class="item${ended ? ' past' : ''}">
      <div class="d">${day}<small>${dow}</small></div>
      <div>${deletable ? `<button class="del" data-del="${esc(it.id)}" aria-label="Remove">✕</button>` : ''}
        <div class="w">${it.at ? '<i class="dot"></i>' : ''}${esc(it.what)}${countdown(it.start, it.end)}</div>
        ${extra ? `<div class="x">${extra}</div>` : ''}</div>
    </div>`;
  }
  function pageHTML(page, i, empty, opts) {
    return `<div class="month paper${i % 2 ? ' white' : ''}" style="--mc:${color(page.m)}">
      <i class="pin" style="--base:${color(page.m)}"></i>
      <h2>${MONTHS[page.m]} <small>${page.first.getFullYear()}</small>${page.k === 0 ? '<span class="now">THIS MONTH</span>' : ''}</h2>
      ${page.items.length ? page.items.map(it => itemHTML(it, page, opts)).join('') : `<div class="empty-note">${empty}</div>`}
    </div>`;
  }

  // ================================================================ Local Events
  const going = G.goingTo.map(ev => {
    const s = parse(ev.date), end = ev.to ? parse(ev.to).date : s.tba ? new Date(s.date.getFullYear(), s.date.getMonth() + 1, 0) : s.date;
    return { ...ev, start: s.date, tba: s.tba, tbaText: ev.tba, end };
  }).filter(it => it.end >= new Date(today.getFullYear(), today.getMonth(), 1));
  const goingPages = pages(going, 6);
  $('going').innerHTML = goingPages.map((p, i) => pageHTML(p, i, 'Nothing else this month')).join('');

  // The map: South Florida from Miami to Delray Beach, a pin per event on the pages above, in its
  // month's color, with its name. (The desktop's Orlando box becomes a line under the map.)
  const BOUNDS = [[25.68, -80.70], [26.52, -79.59]];
  const CITIES = [['Miami', 25.7743, -80.1937], ['Hollywood', 26.0112, -80.1495], ['Fort Lauderdale', 26.1520, -80.1750],
    ['Pompano Beach', 26.2379, -80.1248], ['Boca Raton', 26.3683, -80.1289], ['Delray Beach', 26.4615, -80.0728]];
  function drawMap() {
    const W = 360, H = 300;
    const [[s, w], [n, e]] = BOUNDS, cos = Math.cos((s + n) / 2 * Math.PI / 180);
    const k = Math.min(H / (n - s), W / ((e - w) * cos)), cx = (w + e) / 2, cy = (s + n) / 2;
    const P = ([lon, lat]) => [W / 2 + (lon - cx) * cos * k, H / 2 - (lat - cy) * k];
    const path = (lines, close) => lines.map(l => 'M' + l.map(p => P(p).map(v => v.toFixed(1)).join(' ')).join('L') + (close ? 'Z' : '')).join('');
    const d = MAPD.main;
    let svg = `<rect class="sea" width="${W}" height="${H}"/><path class="land" d="${path(d.land, true)}"/>
      <path class="road minor" d="${path(d.roads.minor)}"/><path class="road major" d="${path(d.roads.major)}"/>
      <text class="water-name" x="${P([-79.86, 26.40])[0]}" y="${P([-79.86, 26.40])[1]}">Atlantic Ocean</text>
      <text class="water-name" x="${P([-80.6, 26.06])[0]}" y="${P([-80.6, 26.06])[1]}">Everglades</text>`;
    for (const [name, lat, lon] of CITIES) {
      const [x, y] = P([lon, lat]);
      svg += `<circle class="city-dot" cx="${x}" cy="${y}" r="2"/><text class="city" x="${x - 5}" y="${y + 3}" text-anchor="end">${name}</text>`;
    }
    // One label per place, its pins side by side (one per event there, in its month's color).
    const places = new Map(), orlando = [];
    for (const page of goingPages) for (const it of page.items) {
      if (!it.at || it.end < today) continue;
      const [lat, lon] = it.at;
      if (lat < s || lat > n || lon < w || lon > e) { if (lat > 27.5) orlando.push({ it, m: page.m }); continue; }
      const key = it.at.join();
      if (!places.has(key)) places.set(key, { at: it.at, names: [], colors: [] });
      const pl = places.get(key), name = it.short || it.what;
      if (!pl.names.includes(name)) pl.names.push(name);
      pl.colors.push(color(page.m));
    }
    const taken = [];
    for (const pl of places.values()) {
      const [x, y] = P([pl.at[1], pl.at[0]]);
      pl.colors.forEach((c, i) => { svg += `<circle class="mpin" cx="${x + i * 9 - (pl.colors.length - 1) * 4.5}" cy="${y}" r="5" fill="${c}"/>`; });
      // The label to the right of the pins (the ocean side), moved down if it would cover another.
      let ly = y + 3;
      while (taken.some(t => Math.abs(t - ly) < 11)) ly += 11;
      taken.push(ly);
      svg += `<text class="mlabel" x="${x + 9 + (pl.colors.length - 1) * 4.5}" y="${ly}">${esc(pl.names.join(', '))}</text>`;
    }
    $('map').innerHTML = `<svg viewBox="0 0 ${W} ${H}">${svg}</svg>`;
    const seen = new Set();
    const orl = orlando.filter(o => !seen.has(o.it.what) && seen.add(o.it.what));
    $('orlando').innerHTML = orl.length ? `<b>Orlando area</b>, 3 hours north: ${orl.map(o => `<span style="color:${color(o.m)}">●</span> ${esc(o.it.short || o.it.what)}`).join(' · ')}` : '';
  }
  if (MAPD) drawMap();

  // ================================================================ Yours
  const KEY = 'corkboard.mine';
  let mine = Phone.store.get(KEY, { items: [], birthdays: [] });
  const saveMine = () => Phone.store.set(KEY, mine);

  function drawMine() {
    const list = mine.items.map(ev => {
      const st = parse(ev.date);
      return { ...ev, start: st.date, end: ev.to ? parse(ev.to).date : st.date, tba: false };
    }).filter(it => it.end >= new Date(today.getFullYear(), today.getMonth(), 1));
    const pg = pages(list, 6);
    $('mine').innerHTML = pg.map((p, i) => pageHTML(p, i + 1, list.length ? 'Nothing else this month' : 'Nothing yet. Add an appointment or a reminder above.', { deletable: true })).join('');

    // Birthdays in the next two months, soonest first.
    const soon = mine.birthdays.map(b => {
      const [mm, dd] = b.date.split('-').map(Number);
      let next = new Date(today.getFullYear(), mm - 1, dd);
      if (next < today) next = new Date(today.getFullYear() + 1, mm - 1, dd);
      return { ...b, next, days: Math.round((next - today) / DAY), turns: b.year ? next.getFullYear() - b.year : null };
    }).filter(b => b.days <= 62).sort((a, b) => a.days - b.days);
    $('birthdays').innerHTML = mine.birthdays.length ? `<div class="bdays paper"><i class="pin" style="--base:#888"></i><h3>BIRTHDAYS</h3>
      ${soon.length ? soon.map(b => `<div class="bday"><span class="on">${fmtShort(b.next)}</span><span><b>${esc(b.name)}</b>${b.turns ? ` <small>turns ${b.turns}</small>` : ''}</span>
        ${b.days === 0 ? '<span class="tag today">Today</span>' : b.days === 1 ? '<span class="tag">Tomorrow</span>' : b.days <= G.countdownDays ? `<span class="tag">In ${b.days} days</span>` : ''}
        <button class="del" data-bday="${esc(b.id)}" aria-label="Remove">✕</button></div>`).join('')
      : '<div class="empty-note" style="text-align:center">None in the next two months</div>'}</div>` : '';
  }
  document.addEventListener('click', e => {
    const del = e.target.closest('[data-del]'), bd = e.target.closest('[data-bday]');
    if (del) { mine.items = mine.items.filter(x => x.id !== del.dataset.del); saveMine(); drawMine(); }
    if (bd) { mine.birthdays = mine.birthdays.filter(x => x.id !== bd.dataset.bday); saveMine(); drawMine(); }
  });

  const sheet = $('sheet');
  const close = () => { sheet.classList.remove('open'); sheet.setAttribute('aria-hidden', 'true'); };
  sheet.querySelector('.sheet-close').addEventListener('click', close);
  function open(kind) {
    const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    $('form').innerHTML = kind === 'item' ? `<h2>An appointment or reminder</h2>
        <label>What<input name="what" required placeholder="Dentist, car registration…"></label>
        <div class="two"><label>Date<input name="date" type="date" required value="${iso(today)}"></label><label>Time (optional)<input name="time" type="time"></label></div>
        <label>Where (optional)<input name="where"></label>
        <label>Note (optional)<input name="note" placeholder="Bring insurance card"></label>
        <button type="submit">Pin it to the board</button>`
      : `<h2>A birthday</h2>
        <label>Name<input name="name" required></label>
        <div class="two"><label>Birthday<input name="date" type="date" required></label><label>Year born (optional)<input name="year" type="number" min="1900" max="2100" inputmode="numeric"></label></div>
        <button type="submit">Add it</button>`;
    $('form').onsubmit = e => {
      e.preventDefault();
      const f = Object.fromEntries(new FormData($('form')));
      const id = Date.now().toString(36);
      if (kind === 'item') {
        const time = f.time ? new Date(`2000-01-01T${f.time}`).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : '';
        mine.items.push({ id, what: f.what.trim(), date: f.date, time, where: f.where.trim(), note: f.note.trim() });
      } else {
        mine.birthdays.push({ id, name: f.name.trim(), date: f.date.slice(5), year: f.year ? +f.year : null });
      }
      saveMine(); drawMine(); close();
      Phone.toast(kind === 'item' ? 'Pinned' : 'Added');
    };
    sheet.classList.add('open');
    sheet.setAttribute('aria-hidden', 'false');
  }
  $('add-btn').addEventListener('click', () => open('item'));
  $('bday-btn').addEventListener('click', () => open('bday'));

  // For the store's screenshots: ?demo fills "yours" with a few made-up things (not saved).
  if (Phone.params.has('demo')) {
    const at = (days, h) => { const d = new Date(today.getTime() + days * DAY); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
    mine = { items: [
      { id: 'a', what: 'Dentist', date: at(2), time: '9:30 AM', where: 'Smile Dental' },
      { id: 'b', what: 'Oil change', date: at(9) },
      { id: 'c', what: 'Dinner with Sam', date: at(16), time: '7:00 PM', where: 'Las Olas' },
      { id: 'd', what: 'Car registration renewal', date: at(40), note: 'online' },
    ], birthdays: [{ id: 'e', name: 'Mom', date: at(5).slice(5), year: 1962 }, { id: 'f', name: 'Jordan', date: at(20).slice(5) }] };
  }
  drawMine();
})();
