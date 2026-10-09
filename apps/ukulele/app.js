// Dylan's Baritone Ukulele on a phone: the desktop app's two screens on one page.
// The neck stands up and down like a chord chart: D G B E from left to right, the nut at the top.
// The music (desktop/music.js) and the plucked sound (desktop/sound.js) come straight from the
// desktop app.
(function () {
  'use strict';
  const M = Music;
  const NS = 'http://www.w3.org/2000/svg';
  const $ = id => document.getElementById(id);

  function el(tag, attrs, parent) {
    const node = document.createElementNS(NS, tag);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(node);
    return node;
  }
  function text(parent, x, y, content, attrs = {}) {
    const t = el('text', { x, y, 'text-anchor': 'middle', ...attrs }, parent);
    t.textContent = content;
    return t;
  }
  const capital = t => t[0].toUpperCase() + t.slice(1);

  // ---- What's being played ----
  let frets = [0, 0, 0, 0];   // per string: fret number, 0 = open, null = switched off
  let ghost = null;           // other places a picked note can be played: [{s, f}]
  let showNames = Phone.store.get('uke.names', false);

  // ======================================================================
  // The neck (drawn in its own 360 x 712 units)
  // ======================================================================
  const svg = $('neck');
  const LEFT = 26, RIGHT = 346;                  // the fretboard's edges
  const NUT = 70;                                // where the nut meets the fretboard
  const SCALE = 1240;                            // so the 12th fret lands 620 below the nut
  const fretY = n => NUT + SCALE * (1 - Math.pow(2, -n / 12));
  const stringX = s => 66 + s * 80;              // D (0) on the left, E (3) on the right
  const spotY = f => (fretY(f - 1) + fretY(f)) / 2;
  const LABEL_Y = 30;                            // the string letters, above the nut
  const MID = (LEFT + RIGHT) / 2;
  const INLAYS = [3, 5, 7, 10];
  const STRING_LOOK = [                          // D and G are wound metal, B and E are nylon
    { width: 5.5, color: '#cfc9bf', wound: true },
    { width: 4.6, color: '#d6d0c6', wound: true },
    { width: 3.6, color: '#efe2c4' },
    { width: 3, color: '#f3e8cf' },
  ];

  el('defs', {}, svg).innerHTML = `
    <linearGradient id="wood" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#3a2315"/><stop offset="0.5" stop-color="#4a2d1b"/><stop offset="1" stop-color="#341f12"/>
    </linearGradient>
    <linearGradient id="fret" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#8d8a85"/><stop offset="0.45" stop-color="#f1efe9"/><stop offset="1" stop-color="#7b7873"/>
    </linearGradient>
    <linearGradient id="bone" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#d9cfb8"/><stop offset="0.5" stop-color="#fbf5e6"/><stop offset="1" stop-color="#cfc4ab"/>
    </linearGradient>
    <radialGradient id="pearl" cx="0.4" cy="0.35" r="0.7">
      <stop offset="0" stop-color="#fffdf6"/><stop offset="0.6" stop-color="#e7e0d0"/><stop offset="1" stop-color="#bfb6a3"/>
    </radialGradient>
    <radialGradient id="dot" cx="0.38" cy="0.32" r="0.75">
      <stop offset="0" stop-color="#ff7f80"/><stop offset="0.55" stop-color="#e5383b"/><stop offset="1" stop-color="#a8191c"/>
    </radialGradient>
    <pattern id="winding" width="10" height="2.4" patternUnits="userSpaceOnUse">
      <rect width="10" height="2.4" fill="#e9e4da"/><rect width="10" height="1" fill="#8e877b"/>
    </pattern>
    <filter id="shadow" x="-20%" y="-5%" width="140%" height="110%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000" flood-opacity="0.55"/>
    </filter>`;

  // Fretboard, inlay dots, frets, nut, fret numbers.
  const bottom = fretY(M.FRETS) + 22;
  el('rect', { x: LEFT, y: NUT, width: RIGHT - LEFT, height: bottom - NUT, rx: 4, fill: 'url(#wood)', filter: 'url(#shadow)' }, svg);
  INLAYS.forEach(f => el('circle', { cx: MID, cy: spotY(f), r: 9, fill: 'url(#pearl)', opacity: 0.9 }, svg));
  el('circle', { cx: MID - 80, cy: spotY(12), r: 9, fill: 'url(#pearl)', opacity: 0.9 }, svg);
  el('circle', { cx: MID + 80, cy: spotY(12), r: 9, fill: 'url(#pearl)', opacity: 0.9 }, svg);
  for (let f = 1; f <= M.FRETS; f++) {
    el('rect', { x: LEFT, y: fretY(f) - 2.5, width: RIGHT - LEFT, height: 5, fill: 'url(#fret)' }, svg);
    const marked = INLAYS.includes(f) || f === 12;
    text(svg, 12, spotY(f) + 5, f, { 'font-size': marked ? 14 : 12, 'font-weight': marked ? 700 : 400, fill: marked ? '#f4ebdc' : '#85745f' });
  }
  el('rect', { x: LEFT - 2, y: NUT - 10, width: RIGHT - LEFT + 4, height: 10, rx: 2, fill: 'url(#bone)' }, svg);

  const strings = M.STRINGS.map((_, s) => {
    const x = stringX(s);
    const look = STRING_LOOK[s];
    const g = el('g', { class: 'string' }, svg);
    el('line', { x1: x, y1: NUT - 10, x2: x, y2: bottom, stroke: '#0008', 'stroke-width': look.width + 2, transform: 'translate(2.5 0)' }, g);
    el('line', { x1: x, y1: NUT - 10, x2: x, y2: bottom, stroke: look.wound ? 'url(#winding)' : look.color, 'stroke-width': look.width }, g);
    return g;
  });

  // Tap targets: one per fret per string, and the string letters above the nut.
  for (let s = 0; s < 4; s++) {
    for (let f = 1; f <= M.FRETS; f++) {
      const cell = el('rect', { class: 'cell', x: stringX(s) - 40, y: fretY(f - 1), width: 80, height: fretY(f) - fretY(f - 1), fill: 'transparent' }, svg);
      cell.addEventListener('click', () => press(s, f));
    }
  }
  const layer = el('g', {}, svg);
  layer.style.pointerEvents = 'none';

  function dot(x, y, r, attrs, label, labelColor, size) {
    el('circle', { cx: x, cy: y, r, ...attrs }, layer);
    if (label) text(layer, x, y + size * 0.36, label, { 'font-size': size, 'font-weight': 700, fill: labelColor });
  }

  function drawNeck() {
    layer.innerHTML = '';
    const ghostAt = {};
    (ghost || []).forEach(p => { ghostAt[`${p.s},${p.f}`] = true; });
    for (let s = 0; s < 4; s++) {
      const x = stringX(s);
      const off = frets[s] == null;
      strings[s].style.opacity = off ? 0.3 : 1;

      const g = el('g', { class: 'label' }, layer);
      g.style.pointerEvents = 'visiblePainted';
      g.addEventListener('click', () => toggleString(s));
      el('rect', { x: x - 34, y: 0, width: 68, height: NUT - 12, fill: 'transparent' }, g);
      const ghostOpen = ghostAt[`${s},0`];
      el('circle', { cx: x, cy: LABEL_Y, r: 19, fill: off ? '#2a1f18' : '#f4ebdc', stroke: ghostOpen ? '#f4b740' : off ? '#85745f' : '#b9ad95', 'stroke-width': ghostOpen ? 4 : 2 }, g);
      text(g, x, LABEL_Y + 7, M.STRINGS[s].name, { 'font-size': 20, 'font-weight': 700, fill: off ? '#85745f' : '#241a13' });
      if (off) {
        el('line', { x1: x - 12, y1: LABEL_Y - 12, x2: x + 12, y2: LABEL_Y + 12, stroke: '#e5383b', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, layer);
        el('line', { x1: x - 12, y1: LABEL_Y + 12, x2: x + 12, y2: LABEL_Y - 12, stroke: '#e5383b', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, layer);
      }

      for (let f = 1; f <= M.FRETS; f++) {
        const y = spotY(f);
        const name = M.noteName(M.pitchAt(s, f));
        const small = Math.min(15, (fretY(f) - fretY(f - 1)) / 2 - 2);
        if (frets[s] === f) {
          dot(x, y, 17, { fill: 'url(#dot)', stroke: '#ffd5d5', 'stroke-width': 2 }, name, '#fff', name.length > 1 ? 12 : 14);
        } else if (ghostAt[`${s},${f}`]) {
          dot(x, y, 16, { fill: '#241a13cc', stroke: '#f4b740', 'stroke-width': 3 }, name, '#f4b740', name.length > 1 ? 11 : 13);
        } else if (showNames) {
          dot(x, y, small, { fill: '#17110dcc' }, name, '#d9cbb4', 10);
        }
      }
    }
  }

  // ---- The words above the neck ----
  function showReadout() {
    const midis = M.sounding(frets);
    const notes = midis.filter(m => m != null);
    const info = M.nameChord(midis);
    const names = [...new Set(notes.map(M.noteName))];
    let name, words, feel;
    if (!notes.length) {
      name = '—'; words = 'All the strings are switched off'; feel = 'Tap a string’s letter to switch it back on.';
    } else if (names.length === 1) {
      name = names[0];
      words = notes.length === 1 ? `Just one note: ${M.bothNames(notes[0])}` : `Only ${names[0]} notes, in different octaves`;
      feel = notes.length === 1 ? 'Press more strings to make a chord.' : 'The same note, high and low.';
    } else if (info) {
      name = info.name; words = info.words; feel = capital(info.feel);
      if (info.also.length) feel += ` · also called ${M.listWords(info.also)}`;
    } else {
      name = names.join(' '); words = 'Not one of the usual chords'; feel = 'Just these notes together.';
    }
    const box = $('chord');
    box.querySelector('.name').textContent = name;
    box.querySelector('.name').style.fontSize = name.length > 8 ? '26px' : name.length > 5 ? '32px' : '';
    box.querySelector('.words').textContent = words;
    box.querySelector('.feel').textContent = feel;

    $('strip').innerHTML = frets.map((f, s) => `
      <div class="${f == null ? 'muted' : f > 0 ? 'pressed' : ''}" style="left:${(stringX(s) / 360) * 100}%">
        <div class="note">${f == null ? '✕' : M.noteName(M.pitchAt(s, f))}</div>
        <div class="where">${f == null ? 'off' : f === 0 ? 'open' : `${M.ordinal(f)} fret`}</div>
      </div>`).join('');
  }

  // ---- Tapping the neck ----
  function ring(s) {
    strings[s].classList.remove('ring');
    void strings[s].getBBox();
    strings[s].classList.add('ring');
  }

  function changed() {
    drawNeck();
    showReadout();
    showOnNeck();
  }

  function press(s, f) {
    ghost = null;
    if (frets[s] === f) frets[s] = 0;
    else { frets[s] = f; Sound.play(M.pitchAt(s, f), 0, s); ring(s); }
    changed();
  }

  function toggleString(s) {
    ghost = null;
    if (frets[s] == null) { frets[s] = 0; Sound.play(M.pitchAt(s, 0), 0, s); ring(s); } else frets[s] = null;
    changed();
  }

  function strum() {
    Sound.strum(M.sounding(frets));
    frets.forEach((f, s) => { if (f != null) setTimeout(() => ring(s), 45 * s); });
  }

  $('strum').addEventListener('click', strum);
  $('chord').addEventListener('click', strum);
  $('clear').addEventListener('click', () => { frets = [0, 0, 0, 0]; ghost = null; changed(); });

  const namesButton = $('names');
  function showNamesButton() {
    namesButton.classList.toggle('on', showNames);
    namesButton.textContent = showNames ? 'Hide note names' : 'Show note names';
  }
  namesButton.addEventListener('click', () => {
    showNames = !showNames;
    Phone.store.set('uke.names', showNames);
    showNamesButton();
    drawNeck();
  });

  const soundButton = $('sound');
  function showSound() {
    soundButton.classList.toggle('off', !Sound.isOn());
    soundButton.textContent = Sound.isOn() ? '🔊 Sound on' : '🔇 Sound off';
  }
  soundButton.addEventListener('click', () => { Sound.setOn(!Sound.isOn()); showSound(); });

  // ======================================================================
  // Chords and notes
  // ======================================================================
  const chips = {};
  const chordsBox = $('chords');
  M.CHART.forEach(row => {
    const kind = document.createElement('div');
    kind.className = 'kind';
    kind.innerHTML = `<b>${row.label}</b><span>sounds ${row.feel}</span>`;
    const grid = document.createElement('div');
    grid.className = 'chips';
    chordsBox.append(kind, grid);
    row.chords.forEach(chord => {
      const chip = document.createElement('button');
      chip.className = 'chip';
      chip.innerHTML = `<span class="cname">${chord.name}</span>`;
      chip.appendChild(miniChart(chord.frets));
      chip.addEventListener('click', () => pick({ kind: 'chord', chord }));
      grid.appendChild(chip);
      chips[chord.name] = chip;
    });
  });

  function miniChart(frets) {
    const s = el('svg', { viewBox: '0 0 74 62' });
    for (let i = 0; i < 4; i++) el('line', { x1: 13 + i * 16, x2: 13 + i * 16, y1: 8, y2: 60, stroke: '#bfae96', 'stroke-width': 1.5 }, s);
    for (let k = 0; k <= 4; k++) el('line', { x1: 13, x2: 61, y1: 8 + k * 13, y2: 8 + k * 13, stroke: '#85745f', 'stroke-width': k === 0 ? 4 : 1.5 }, s);
    frets.forEach((f, i) => { if (f) el('circle', { cx: 13 + i * 16, cy: 8 + (f - 0.5) * 13, r: 5.5, fill: '#e5383b' }, s); });
    return s;
  }

  // The staff, in rows of seven notes (four rows: low D up to the highest E).
  const columns = {};
  const HALF = 6;                     // half the gap between staff lines
  const FIRST_X = 66, STEP_X = 44;
  for (let from = M.RANGE[0]; from <= M.RANGE[M.RANGE.length - 1]; from += 7) {
    const notes = M.RANGE.filter(m => m >= from && m < from + 7);
    const steps = notes.map(M.staffStep);
    const above = Math.max(8, ...steps) * HALF + 22;          // room for short lines above the staff
    const below = Math.max(0, -Math.min(0, ...steps)) * HALF;
    const base = above;                                       // y of the bottom line
    const height = base + below + 58;
    const s = el('svg', { viewBox: `0 0 360 ${height}` });
    for (let i = 0; i < 5; i++) el('line', { x1: 8, x2: 352, y1: base - i * 2 * HALF, y2: base - i * 2 * HALF, stroke: '#241a13', 'stroke-width': 1.3 }, s);
    text(s, 30, base + 6, '𝄞', { class: 'clef', 'font-size': 76, fill: '#241a13' });
    notes.forEach((midi, i) => {
      const x = FIRST_X + 20 + i * STEP_X;
      const step = M.staffStep(midi);
      const y = base - step * HALF;
      const g = el('g', { class: 'col' }, s);
      el('rect', { class: 'hit', x: x - STEP_X / 2 + 2, y: 4, width: STEP_X - 4, height: height - 8, rx: 9 }, g);
      for (let k = 10; k <= step; k += 2) el('line', { x1: x - 14, x2: x + 14, y1: base - k * HALF, y2: base - k * HALF, stroke: '#241a13', 'stroke-width': 1.3 }, g);
      for (let k = -2; k >= step; k -= 2) el('line', { x1: x - 14, x2: x + 14, y1: base - k * HALF, y2: base - k * HALF, stroke: '#241a13', 'stroke-width': 1.3 }, g);
      if (M.isSharp(midi)) text(g, x - 18, y + 7, '♯', { 'font-size': 21, fill: '#241a13' });
      el('ellipse', { class: 'head', cx: x, cy: y, rx: 8.4, ry: 6, transform: `rotate(-22 ${x} ${y})` }, g);
      const names = M.bothNames(midi).split(' / ');
      text(g, x, base + below + 30, names[0], { class: 'name', 'font-size': 15, fill: '#241a13' });
      if (names[1]) text(g, x, base + below + 47, names[1], { 'font-size': 12, fill: '#8d7c65' });
      g.addEventListener('click', () => pick({ kind: 'note', midi }));
      columns[midi] = g;
    });
    $('staff').appendChild(s);
  }

  // What's on the neck lights up red among the chords and notes.
  function showOnNeck() {
    const midis = M.sounding(frets).filter(m => m != null);
    Object.entries(columns).forEach(([m, g]) => g.classList.toggle('onneck', midis.includes(+m)));
    const info = M.nameChord(M.sounding(frets));
    Object.entries(chips).forEach(([name, chip]) => chip.classList.toggle('onneck', !!info && info.name === name));
  }

  // ---- Big pictures for the "how to play it" sheet (from the desktop app) ----
  const RED = '#e5383b', INK = '#f4ebdc', DIM = '#85745f';
  const SX = s => 45 + s * 58;

  function chordPicture(cf, fingers) {
    const used = cf.filter(f => f > 0);
    const base = used.length && Math.max(...used) > 5 ? Math.min(...used) : 1;
    const top = 70, ROW = 66;
    const s = el('svg', { viewBox: '0 0 260 500' });
    for (let i = 0; i < 4; i++) el('line', { x1: SX(i), x2: SX(i), y1: top, y2: top + 5 * ROW, stroke: '#cfc4ab', 'stroke-width': 3 }, s);
    for (let k = 0; k <= 5; k++) {
      el('line', { x1: SX(0), x2: SX(3), y1: top + k * ROW, y2: top + k * ROW, stroke: k === 0 && base === 1 ? INK : DIM, 'stroke-width': k === 0 && base === 1 ? 10 : 3 }, s);
    }
    if (base > 1) text(s, 12, top + ROW * 0.5 + 8, `${base}`, { 'font-size': 22, fill: INK, 'text-anchor': 'start' });
    cf.forEach((f, i) => {
      if (f === 0) el('circle', { cx: SX(i), cy: top - 34, r: 13, fill: 'none', stroke: INK, 'stroke-width': 3.5 }, s);
      if (f == null) text(s, SX(i), top - 23, '✕', { 'font-size': 30, fill: RED });
    });
    const done = {};
    cf.forEach((f, i) => {
      if (!f || done[i]) return;
      const y = top + (f - base + 0.5) * ROW;
      const same = cf.map((g, j) => (g === f && fingers[j] === fingers[i] ? j : -1)).filter(j => j >= 0);
      if (same.length > 1) {
        const a = Math.min(...same), b = Math.max(...same);
        el('rect', { x: SX(a) - 23, y: y - 23, width: SX(b) - SX(a) + 46, height: 46, rx: 23, fill: RED }, s);
        text(s, (SX(a) + SX(b)) / 2, y + 9, fingers[i], { 'font-size': 26, 'font-weight': 700, fill: '#fff' });
        same.forEach(j => { done[j] = true; });
      } else {
        el('circle', { cx: SX(i), cy: y, r: 23, fill: RED }, s);
        if (fingers[i]) text(s, SX(i), y + 9, fingers[i], { 'font-size': 26, 'font-weight': 700, fill: '#fff' });
      }
    });
    stringNames(s, top + 5 * ROW, cf);
    return s;
  }

  function notePicture(midi) {
    const top = 52, ROW = 36;
    const spots = M.positions(midi);
    const s = el('svg', { viewBox: `0 0 260 ${top + 12 * ROW + 50}` });
    [3, 5, 7, 10].forEach(f => el('circle', { cx: 132, cy: top + (f - 0.5) * ROW, r: 7, fill: '#46372b' }, s));
    [74, 190].forEach(x => el('circle', { cx: x, cy: top + 11.5 * ROW, r: 7, fill: '#46372b' }, s));
    for (let i = 0; i < 4; i++) el('line', { x1: SX(i), x2: SX(i), y1: top, y2: top + 12 * ROW, stroke: '#cfc4ab', 'stroke-width': 3 }, s);
    for (let k = 0; k <= 12; k++) {
      el('line', { x1: SX(0), x2: SX(3), y1: top + k * ROW, y2: top + k * ROW, stroke: k === 0 ? INK : DIM, 'stroke-width': k === 0 ? 9 : 2 }, s);
    }
    [1, 3, 5, 7, 10, 12].forEach(f => text(s, 14, top + (f - 0.5) * ROW + 7, f, { 'font-size': 18, fill: DIM }));
    const name = M.noteName(midi);
    spots.forEach((p, i) => {
      const y = p.fret === 0 ? top - 26 : top + (p.fret - 0.5) * ROW;
      el('circle', { cx: SX(p.string), cy: y, r: 17, fill: i === 0 ? RED : '#17110d', stroke: RED, 'stroke-width': 4 }, s);
      text(s, SX(p.string), y + 6, name, { 'font-size': name.length > 1 ? 15 : 17, 'font-weight': 700, fill: i === 0 ? '#fff' : '#ff8a8b' });
    });
    stringNames(s, top + 12 * ROW, null);
    return s;
  }

  function stringNames(s, y, cf) {
    M.STRINGS.forEach((str, i) => {
      text(s, SX(i), y + 36, str.name, { 'font-size': 24, 'font-weight': 700, fill: INK });
      if (cf) text(s, SX(i), y + 68, cf[i] == null ? '' : M.noteName(M.pitchAt(i, cf[i])), { 'font-size': 22, fill: '#ff8a8b', 'font-weight': 700 });
    });
  }

  // ---- Picking a chord or a note: hear it, put it on the neck, and show how to play it ----
  const sheet = $('sheet');
  let pinned = null;

  function pick(item) {
    pinned = item;
    if (item.kind === 'chord') {
      frets = item.chord.frets.slice();
      ghost = null;
      Sound.strum(M.sounding(frets));
    } else {
      const spots = M.positions(item.midi);
      frets = [null, null, null, null];
      frets[spots[0].string] = spots[0].fret;
      ghost = spots.slice(1).map(p => ({ s: p.string, f: p.fret }));
      Sound.play(item.midi);
    }
    frets.forEach((f, s) => { if (f != null) setTimeout(() => ring(s), 45 * s); });
    changed();
    Object.values(columns).forEach(g => g.classList.toggle('pinned', item.kind === 'note' && g === columns[item.midi]));
    Object.values(chips).forEach(c => c.classList.toggle('pinned', item.kind === 'chord' && c === chips[item.chord.name]));
    openSheet(item);
  }

  function openSheet(item) {
    let head, picture, html = '';
    if (item.kind === 'note') {
      const midi = item.midi;
      const spots = M.positions(midi);
      const first = spots[0];
      const others = spots.slice(1).map(p => `${M.STRINGS[p.string].name} string, ${M.ordinal(p.fret)} fret`);
      const step = M.staffStep(midi);
      head = { tag: 'Note', big: M.bothNames(midi), words: capital(M.staffWords(midi)), feel: '' };
      picture = notePicture(midi);
      html += first.fret === 0
        ? `<p>Easiest: <b>${M.STRINGS[first.string].name} string, open</b>. No finger needed.</p>`
        : `<p>Easiest: <b>${M.STRINGS[first.string].name} string, ${M.ordinal(first.fret)} fret</b>.</p>`;
      if (others.length) html += `<p>Also here: ${others.join('; ')}.</p>`;
      if (step >= 0 && step <= 8 && step % 2 === 0) html += '<p class="tip">The lines, bottom to top, are E G B D F: “Every Good Boy Does Fine.”</p>';
      if (step >= 1 && step <= 7 && step % 2 === 1) html += '<p class="tip">The spaces, bottom to top, spell F A C E.</p>';
      if (M.isSharp(midi)) {
        const [sharp, flat] = M.bothNames(midi).split(' / ');
        html += `<p class="tip">♯ (sharp) means one fret higher; ♭ (flat) means one fret lower. ${sharp} is one fret above ${sharp[0]}, and ${flat} is one fret below ${flat[0]}: two names for the same note.</p>`;
      }
    } else {
      const c = item.chord;
      head = { tag: 'Chord', big: c.name, words: c.info.words, feel: capital(c.info.feel) };
      picture = chordPicture(c.frets, c.fingers);
      html += `<ol>${M.chordSteps(c.frets, c.fingers).map(t => `<li>${t}</li>`).join('')}</ol>`;
      html += `<p class="tip">Notes in it: ${M.sounding(c.frets).filter(m => m != null).map(M.noteName).join(' ')}</p>`;
    }
    const body = sheet.querySelector('.sheet-body');
    body.innerHTML = `
      <div class="tag">${head.tag} · how to play it</div>
      <div class="big">${head.big}</div>
      <div class="words">${head.words}</div>
      <div class="feel">${head.feel}</div>
      <div class="body"><div class="picture"></div><div class="text">${html}
        <div class="actions"><button class="pill hear">▶ Hear it</button><button class="pill to-neck">See it on the neck ↑</button></div>
      </div></div>`;
    body.querySelector('.picture').appendChild(picture);
    body.querySelector('.hear').addEventListener('click', () => {
      if (item.kind === 'note') Sound.play(item.midi); else Sound.strum(M.sounding(item.chord.frets));
    });
    body.querySelector('.to-neck').addEventListener('click', () => { closeSheet(); $('neck-screen').scrollIntoView({ behavior: 'smooth' }); });
    sheet.classList.add('open');
    sheet.setAttribute('aria-hidden', 'false');
    document.body.classList.add('sheet-open');
  }

  function closeSheet() {
    sheet.classList.remove('open');
    sheet.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('sheet-open');
  }
  sheet.querySelector('.sheet-close').addEventListener('click', closeSheet);

  // Swipe the sheet down to close it.
  let startY = null;
  sheet.addEventListener('touchstart', e => { startY = sheet.scrollTop <= 0 ? e.touches[0].clientY : null; }, { passive: true });
  sheet.addEventListener('touchmove', e => {
    if (startY == null) return;
    const dy = e.touches[0].clientY - startY;
    sheet.style.transition = 'none';
    sheet.style.transform = dy > 0 ? `translateY(${dy}px)` : '';
  }, { passive: true });
  sheet.addEventListener('touchend', e => {
    if (startY == null) return;
    const dy = e.changedTouches[0].clientY - startY;
    sheet.style.transition = '';
    sheet.style.transform = '';
    if (dy > 80) closeSheet();
    startY = null;
  });

  showNamesButton();
  showSound();
  changed();

  // For screenshots and checking: #frets=0,0,0,3 (D G B E, x = off), #chord=G, #note=55
  const test = location.hash.match(/(frets|chord|note)=([^&]+)/);
  if (test) {
    const on = Sound.isOn();
    Sound.setOn(false);
    if (test[1] === 'frets') { frets = test[2].split(',').map(v => (v === 'x' ? null : +v)); changed(); }
    else pick(test[1] === 'note' ? { kind: 'note', midi: +test[2] } : { kind: 'chord', chord: M.findChord(decodeURIComponent(test[2])) });
    Sound.setOn(on);
  }
})();
