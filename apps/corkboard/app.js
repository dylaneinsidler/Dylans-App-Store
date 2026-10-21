// Dylan's Corkboard on a phone. Top board: the desktop app's Local Events (desktop/going.js, taken from
// its events.js by build.mjs), a page per month, with a map from its Census map data (desktop/mapdata.js)
// and the week's farmers markets (desktop/markets.js). Holding an event adds it to the phone's calendar.
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

  // What kind of thing each Local Event is, in the desktop app's inks (KINDS and LEGEND in its board.js,
  // the colors in its board.css; keep them the same). The pins on the map, each event's date and dot, and
  // the key under the map all go by these. (Each month's own color stays on its page: its name and its pin.)
  const CATS = {
    holiday: { name: 'Holidays', ink: '#b8242b', kinds: ['holiday'] },
    jewish: { name: 'Jewish Holidays', ink: '#1f4f97', kinds: ['jewish'] },
    culture: { name: 'Art, Parades & Festivals', ink: '#6b3aa0', kinds: ['art', 'parade', 'festival', 'food', 'wine', 'seafood', 'irish', 'renaissance', 'lights', 'movie', 'fashion', 'museum'] },
    show: { name: 'Big Shows', ink: '#c0571b', kinds: ['boat', 'airshow', 'fireworks', 'concert', 'halloween', 'show', 'comedy'] },
    nightlife: { name: 'Nights Out', ink: '#c2185b', kinds: ['party', 'dj', 'nightlife', 'jazz'] },
    sports: { name: 'Games', ink: '#2b7a3d', kinds: ['hockey', 'football', 'sports', 'game'] },
    jiujitsu: { name: 'Jiu-Jitsu', ink: '#a67c00', kinds: ['jiujitsu', 'grappling', 'judo'] },
    other: { name: 'Other', ink: '#6f6758', kinds: [] },
  };
  const CAT_OF = Object.fromEntries(Object.entries(CATS).flatMap(([c, v]) => v.kinds.map(k => [k, c])));
  const catOf = ev => CAT_OF[ev.kind] || 'other';
  const ink = it => CATS[it.cat || 'other'].ink;

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
  // A Local Event (it.cat) can be held to add it to the calendar (data-ev); a dot in its kind's ink means
  // it has a pin on the map.
  function itemHTML(it, page, { deletable = false } = {}) {
    const ended = it.end < today, cont = it.start < page.first;
    const day = it.tba ? '—' : cont ? '…' : it.start.getDate();
    const dow = it.tba || cont ? '' : DOW[it.start.getDay()];
    const span = it.to ? `through ${fmtShort(it.end)}` : '';
    const extra = [it.tba ? (it.tbaText || 'Date to come') : '', span, it.time, it.where, it.note].filter(Boolean).map(esc).join(' · ');
    const hold = it.cat ? ` data-ev="${esc(it.id)}" style="--kc:${ink(it)}"` : '';
    return `<div class="item${ended ? ' past' : ''}"${hold}>
      <div class="d">${day}<small>${dow}</small></div>
      <div>${deletable ? `<button class="del" data-del="${esc(it.id)}" aria-label="Remove">✕</button>` : ''}
        <div class="w">${it.at ? '<i class="dot"></i>' : ''}${it.tickets
          // Something you need a ticket for: tap its name to buy one (tickets: in the desktop's events.js).
          ? `<a class="tix" href="${esc(it.tickets)}" target="_blank" rel="noopener">${esc(it.what)}</a>`
          : esc(it.what)}${countdown(it.start, it.end)}</div>
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
    return { ...ev, id: ev.id || `${ev.date}-${ev.what}`, cat: catOf(ev), start: s.date, tba: s.tba, tbaText: ev.tba, end };
  }).filter(it => it.end >= new Date(today.getFullYear(), today.getMonth(), 1));
  const goingPages = pages(going, 6);
  $('going').innerHTML = goingPages.map((p, i) => pageHTML(p, i, 'Nothing else this month')).join('');

  // The map: South Florida from Miami to Delray Beach, a pin for each event on the pages below, in the
  // ink of its kind, with its name, and the key to the colors under it (the kinds on the board now).
  // Downtown Fort Lauderdale, where many of them are, gets a close-up under it (the dashed box on the big
  // map), like the desktop's. An event held more than once (the monthly Jazz Brunch) gets one pin, for its
  // next date. (The desktop's Orlando box becomes a line under the map.)
  const MAIN = [[25.68, -80.70], [26.52, -79.59]];
  const FTL = [[26.095, -80.157], [26.130, -80.095]];        // these go on the close-up (about the desktop's box)
  const FTL_VIEW = [[26.093, -80.160], [26.132, -80.092]];   // what the close-up shows: a little more, and the beach
  const CITIES = [['Miami', 25.7743, -80.1937], ['Hollywood', 26.0112, -80.1495], ['Fort Lauderdale', 26.1520, -80.1750],
    ['Pompano Beach', 26.2379, -80.1248], ['Boca Raton', 26.3683, -80.1289], ['Delray Beach', 26.4615, -80.0728]];
  const inBox = ([lat, lon], [[s, w], [n, e]]) => lat >= s && lat <= n && lon >= w && lon <= e;
  const ctx = document.createElement('canvas').getContext('2d');
  const sans = getComputedStyle(document.documentElement).getPropertyValue('--sans') || 'sans-serif';
  const textWidth = (text, font) => { ctx.font = `${font} ${sans}`; return ctx.measureText(text).width; };

  // One map, W wide: its land and water, roads, towns, then a pin for each event and the labels.
  function drawOne(data, box, W, places, { cities = [], waters = [], outline = null } = {}) {
    const [[s, w], [n, e]] = box, cos = Math.cos((s + n) / 2 * Math.PI / 180);
    const k = W / ((e - w) * cos), H = Math.round((n - s) * k), cx = (w + e) / 2, cy = (s + n) / 2;
    const P = ([lon, lat]) => [W / 2 + (lon - cx) * cos * k, H / 2 - (lat - cy) * k];
    const path = (lines, close) => lines.map(l => 'M' + l.map(p => P(p).map(v => v.toFixed(1)).join(' ')).join('L') + (close ? 'Z' : '')).join('');
    let svg = data.land
      ? `<rect class="sea" width="${W}" height="${H}"/><path class="land" d="${path(data.land, true)}"/>`
      : `<rect class="land" width="${W}" height="${H}"/><path class="water" d="${path(data.water, true)}"/>`;
    svg += `<path class="road minor" d="${path(data.roads.minor || [])}"/><path class="road major" d="${path(data.roads.major || [])}"/>`;
    // The room already used (towns, pins, labels), so no label covers another or a pin.
    const taken = [];
    const overlaps = r => taken.some(o => r.x < o.x + o.w && r.x + r.w > o.x && r.y < o.y + o.h && r.y + r.h > o.y);
    const fits = r => r.x >= 2 && r.y >= 2 && r.x + r.w <= W - 2 && r.y + r.h <= H - 2;
    for (const [name, lat, lon] of waters) {
      const [x, y] = P([lon, lat]), tw = textWidth(name, 'italic 10px');
      taken.push({ x: x - tw / 2 - 2, y: y - 9, w: tw + 4, h: 12 });
      svg += `<text class="water-name" x="${x}" y="${y}">${name}</text>`;
    }
    for (const [name, lat, lon] of cities) {
      const [x, y] = P([lon, lat]), tw = textWidth(name, '600 9.5px');
      taken.push({ x: x - 5 - tw, y: y - 6, w: tw + 8, h: 10 });
      svg += `<circle class="city-dot" cx="${x}" cy="${y}" r="2"/><text class="city" x="${x - 5}" y="${y + 3}" text-anchor="end">${name}</text>`;
    }
    if (outline) {
      const [x1, y1] = P([outline[0][1], outline[1][0]]), [x2, y2] = P([outline[1][1], outline[0][0]]);
      svg += `<rect class="close-box" x="${x1.toFixed(1)}" y="${y1.toFixed(1)}" width="${(x2 - x1).toFixed(1)}" height="${(y2 - y1).toFixed(1)}"/>`;
      taken.push({ x: x1 - 2, y: y1 - 2, w: x2 - x1 + 4, h: y2 - y1 + 4 });
    }
    // A pin for each event at a place (one per name), side by side.
    let pins = '', leaders = '', labels = '';
    for (const pl of places.values()) {
      const [x, y] = pl.p = P([pl.at[1], pl.at[0]]), x0 = x - (pl.pins.length - 1) * 4.5;
      pl.pins.forEach(({ it }, i) => {
        pins += `<g class="mpin-g" data-ev="${esc(it.id)}" style="--kc:${ink(it)}"><circle class="hit" cx="${x0 + i * 9}" cy="${y}" r="10"/><circle class="mpin" cx="${x0 + i * 9}" cy="${y}" r="5" fill="${ink(it)}"/></g>`;
      });
      pl.box = { x: x0 - 6, y: y - 6, w: (pl.pins.length - 1) * 9 + 12, h: 12 };
      pl.soonest = Math.min(...pl.pins.map(p => p.it.start));
      taken.push(pl.box);
    }
    // One label per place, soonest events first: right beside its pins where there's room (the ocean side
    // first), or as near as it fits with a thin line out to them, never on top of another name or pin.
    const near = (r, x, y) => Math.hypot(Math.max(r.x - x, 0, x - r.x - r.w), Math.max(r.y - y, 0, y - r.y - r.h));
    for (const pl of [...places.values()].sort((a, b) => a.soonest - b.soonest)) {
      const [x, y] = pl.p, b = pl.box, lines = pl.pins.map(p => p.name);
      const lw = Math.ceil(Math.max(...lines.map(l => textWidth(l, '700 9px')))) + 2, lh = lines.length * 10;
      const beside = [[b.x + b.w + 1, y - lh / 2], [b.x - lw - 1, y - lh / 2], [x - lw / 2, b.y + b.h + 1], [x - lw / 2, b.y - lh - 1]]
        .map(([lx, ly]) => ({ x: lx, y: ly, w: lw, h: lh }));
      let r = beside.find(q => fits(q) && !overlaps(q)), far = false;
      if (!r) {
        let best = null;
        for (let dy = -lh - 70; dy <= 70; dy += 3) for (let dx = -lw - 90; dx <= 90; dx += 3) {
          const q = { x: x + dx, y: y + dy, w: lw, h: lh };
          if (!fits(q) || overlaps(q)) continue;
          const score = near(q, x, y) + (q.x + q.w / 2 < x ? 6 : 0);
          if (!best || score < best.score) best = { ...q, score };
        }
        if (best) { r = best; far = true; }
      }
      if (!r) continue;   // no room anywhere: the pin goes without its name (it's on the list below)
      taken.push(r);
      if (far) {
        const lx = Math.min(Math.max(x, r.x), r.x + r.w), ly = Math.min(Math.max(y, r.y), r.y + r.h);
        leaders += `<line class="leader" x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${lx.toFixed(1)}" y2="${ly.toFixed(1)}"/>`;
      }
      labels += `<text class="mlabel" x="${r.x + 1}" y="${r.y + 7.5}">${lines.map((l, i) => `<tspan x="${r.x + 1}"${i ? ' dy="10"' : ''}>${esc(l)}</tspan>`).join('')}</text>`;
    }
    return `<svg viewBox="0 0 ${W} ${H}">${svg}${leaders}${pins}${labels}</svg>`;
  }

  function drawMap() {
    // Which map each event goes on (one pin per name at a place), or the Orlando line.
    const main = new Map(), ftl = new Map(), orlando = [], shown = new Set();
    for (const page of goingPages) for (const it of page.items) {
      if (!it.at || it.end < today) continue;
      const name = it.short || it.what;
      const places = MAPD.ftl && inBox(it.at, FTL) ? ftl : inBox(it.at, MAIN) ? main : null;
      if (!places) {
        if (it.at[0] > 27.5 && !orlando.some(o => o.name === name)) { orlando.push({ it, name }); shown.add(it.cat); }
        continue;
      }
      const key = it.at.join();
      if (!places.has(key)) places.set(key, { at: it.at, pins: [] });
      const pl = places.get(key);
      if (!pl.pins.some(p => p.name === name)) { pl.pins.push({ name, it }); shown.add(it.cat); }
    }
    $('map').innerHTML = drawOne(MAPD.main, MAIN, 360, main,
      { cities: CITIES, waters: [['Atlantic Ocean', 26.40, -79.86], ['Everglades', 26.06, -80.6]], outline: ftl.size ? FTL_VIEW : null });
    $('map-close').innerHTML = ftl.size ? `<div class="close-name">Downtown Fort Lauderdale, up close</div>${drawOne(MAPD.ftl, FTL_VIEW, 360, ftl)}` : '';
    $('orlando').innerHTML = orlando.length ? `<b>Orlando area</b>, 3 hours north: ${orlando.map(({ it, name }) =>
      `<span class="orl-ev" data-ev="${esc(it.id)}" style="--kc:${ink(it)}"><i class="kdot"></i>${esc(name)}</span>`).join(' · ')}` : '';
    // The key: what each color means, for the kinds on the map and the pages below, in the desktop's order.
    for (const page of goingPages) for (const it of page.items) shown.add(it.cat);
    const key = Object.keys(CATS).filter(c => shown.has(c));
    $('map-key').innerHTML = key.map(c => `<span><i class="kdot" style="--kc:${CATS[c].ink}"></i>${esc(CATS[c].name)}</span>`).join('');
  }
  if (MAPD) drawMap();

  // Farmers markets (the desktop's markets.js): the ones on in the next 7 days, today's first, the way its
  // small Farmers Markets card does it. Out of season ones (several run October to May) don't show.
  function drawMarkets() {
    const list = window.CORKBOARD_MARKETS;
    if (!Array.isArray(list) || !list.length) return;
    const md = d => `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const inSeason = (m, d) => {
      if (!m.season) return true;
      const [a, b] = m.season, x = md(d);
      return a <= b ? x >= a && x <= b : x >= a || x <= b;
    };
    const rows = [];
    for (let k = 0; k < 7; k++) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + k), week = Math.ceil(d.getDate() / 7);
      for (const m of list) {
        if (!(m.days || []).includes(DOW[d.getDay()]) || (m.weeks && !m.weeks.includes(week)) || !inSeason(m, d)) continue;
        rows.push({ m, d, k });
      }
    }
    const label = r => r.k === 0 ? 'Today' : r.k === 1 ? 'Tomorrow' : DOW[r.d.getDay()];
    const SHOW = 6;
    $('markets').innerHTML = `<div class="markets paper"><i class="pin" style="--base:#2b7a3d"></i>
      <h3>Farmers Markets</h3><div class="mk-sub">The next 7 days</div>
      ${rows.map((r, i) => `<div class="mk${r.k === 0 ? ' today' : ''}"${i >= SHOW ? ' hidden' : ''}>
        <span class="mk-d">${label(r)}</span>
        <div><b>${esc(r.m.name)}</b><small>${[r.m.time, r.m.city, r.m.where].filter(Boolean).map(esc).join(' · ')}</small></div></div>`).join('')
        || '<div class="mk none">No markets this week.</div>'}
      ${rows.length > SHOW ? `<button class="mk-more">+ ${rows.length - SHOW} more this week</button>` : ''}</div>`;
    const more = $('markets').querySelector('.mk-more');
    if (more) more.addEventListener('click', () => { $('markets').querySelectorAll('.mk[hidden]').forEach(el => { el.hidden = false; }); more.remove(); });
  }
  drawMarkets();

  // ================================================================ Hold an event: onto your calendar
  // Press and hold a Local Event (or its pin on the map, or its name in the Orlando line): it gets
  // highlighted, and letting go opens its calendar file (desktop/ics/<id>.ics, made by build.mjs), so the
  // iPhone offers "Add to Calendar". A quick tap, or a touch that scrolls, does what it did before.
  const HOLD = 450, SLOP = 10;   // ms to hold (the highlighter in app.css takes as long), and px it may wander
  const byId = new Map(going.map(it => [it.id, it]));
  let hold = null, lastTouch = 0;
  function startHold(el, x, y) {
    cancelHold();
    el.classList.add('pressing');
    hold = { el, x, y, ready: false };
    hold.timer = setTimeout(() => { if (hold && hold.el === el) { hold.ready = true; el.classList.add('held'); } }, HOLD);
  }
  function moveHold(x, y) { if (hold && Math.hypot(x - hold.x, y - hold.y) > SLOP) cancelHold(); }
  function cancelHold() {
    if (!hold) return;
    clearTimeout(hold.timer);
    hold.el.classList.remove('pressing', 'held');
    hold = null;
  }
  // Let go: true if it was held long enough (and is going onto the calendar).
  function release() {
    const h = hold;
    if (!h) return false;
    if (!h.ready) { cancelHold(); return false; }
    clearTimeout(h.timer);
    hold = null;
    addToCalendar(byId.get(h.el.dataset.ev));
    setTimeout(() => h.el.classList.remove('pressing', 'held'), 1200);
    return true;
  }
  function addToCalendar(it) {
    if (!it) return;
    if (it.end < today) { Phone.toast('That one is over'); return; }
    if (!it.ics) { Phone.toast('Its day isn’t set yet'); return; }
    Phone.toast('Adding to your calendar');
    const url = new URL(it.ics, location.href).href;
    // From the Home Screen, the calendar file opens in a Safari sheet; in Safari, right on the page.
    if (Phone.standalone && window.open(url, '_blank')) return;
    location.href = url;
  }
  const holdable = e => e.target.closest && e.target.closest('[data-ev]');
  document.addEventListener('touchstart', e => {
    lastTouch = Date.now();
    const el = holdable(e);
    if (!el || e.touches.length > 1) { cancelHold(); return; }
    startHold(el, e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
  document.addEventListener('touchmove', e => moveHold(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
  document.addEventListener('touchend', e => { lastTouch = Date.now(); if (release()) e.preventDefault(); }, { passive: false });
  document.addEventListener('touchcancel', cancelHold);
  addEventListener('scroll', () => { if (hold && !hold.ready) cancelHold(); }, { passive: true });
  // A mouse (on a computer) works the same way. (A phone also sends mouse events after a tap: skipped.)
  document.addEventListener('mousedown', e => { const el = holdable(e); if (!e.button && el && Date.now() - lastTouch > 800) startHold(el, e.clientX, e.clientY); });
  document.addEventListener('mousemove', e => { if (Date.now() - lastTouch > 800) moveHold(e.clientX, e.clientY); });
  document.addEventListener('mouseup', () => { if (Date.now() - lastTouch > 800) release(); });
  document.addEventListener('contextmenu', e => { if (holdable(e)) e.preventDefault(); });

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
