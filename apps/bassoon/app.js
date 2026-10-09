// Dylan's Bassoon on a phone: the desktop app's two screens, one above the other.
// The keys (top): tap keys and holes to press them; the box at the top says which note that plays.
// Pick a note (below): tap a note on the staves and a sheet slides up with how to finger it.
// The bassoon picture, the fingerings and the staves are the desktop app's own (desktop/).
(function () {
  'use strict';
  const { KEYS, NOTES, noteName, identify, describe } = Bassoon;
  const $ = id => document.getElementById(id);
  const NS = 'http://www.w3.org/2000/svg';

  // ---------------------------------------------------------------- The keys
  let state = {};

  // Tapping a key presses it or lets it go. The first finger hole goes covered -> half-hole -> open.
  function toggled(s, k) {
    const next = { ...s };
    if (k === 'L1') next.L1 = !s.L1 ? 1 : s.L1 === 1 ? 'h' : undefined;
    else next[k] = s[k] ? undefined : 1;
    if (!next[k]) delete next[k];
    return next;
  }

  const holder = document.createElement('div');
  $('panels').appendChild(holder);
  const diagram = Bassoon.diagram(holder, { interactive: true, onPress: press });

  // A phone has no hover, so the line under the box says what the last tap was.
  function press(k) {
    const was = state[k];
    state = toggled(state, k);
    const key = KEYS[k];
    const now = state[k];
    const did = k === 'L1' ? (!now ? 'let go of' : now === 1 ? 'covered' : 'half-holed') : now ? 'pressed' : 'let go of';
    $('r-last').innerHTML = `You ${did} <b>${key.name}</b> (${key.where.toLowerCase()}).` + (key.tip && !was ? ` ${key.tip}` : '');
    diagram.svg.querySelectorAll('.key.tapped').forEach(g => g.classList.remove('tapped'));
    diagram.svg.querySelector(`.key[data-key="${k}"]`)?.classList.add('tapped');
    render();
  }

  function nameHTML(midi) {
    const n = noteName(midi);
    return `${n.letter}${n.acc ? `<span class="acc">${n.acc}</span>` : ''}<span class="oct">${n.octave}</span>`;
  }

  function changeWords(diff) {
    const parts = [];
    if (diff.press.length) parts.push('press ' + diff.press.map(Bassoon.keyLabel).join(' and '));
    if (diff.release.length) parts.push('let go of ' + diff.release.map(Bassoon.keyLabel).join(' and '));
    if (diff.half.length) parts.push(diff.half[0] === 'half' ? 'make the first hole a half-hole' : 'cover the first hole all the way');
    const s = parts.join(', and ');
    return s.charAt(0).toUpperCase() + s.slice(1) + '.';
  }

  function drawStaff(svg, midi, { x = 6, width = 288, top = 44, s = 12, at = 170 } = {}) {
    svg.innerHTML = '';
    svg.style.display = midi == null ? 'none' : '';
    if (midi == null) return;
    const clef = Staff.clefFor(midi);
    Staff.staff(svg, { x, top, width, s, clef });
    Staff.note(svg, { midi, x: at, top, s, clef });
  }

  function words(el, s, optional) {
    el.innerHTML = describe(s, optional).map(([part, text]) =>
      `<dt>${part}</dt><dd class="${text === '—' || text === 'all open' ? 'none' : ''}">${text}</dd>`).join('');
  }

  function render() {
    diagram.set(state);
    const name = $('r-name');
    const pressed = Object.keys(state).length;
    const { matches, near } = identify(state);
    $('r-near').innerHTML = '';
    $('r-alt').textContent = '';
    name.className = '';

    if (!pressed) {
      $('r-label').textContent = 'Start here';
      name.className = 'off';
      name.textContent = 'Tap a key or cover a hole';
      $('r-sub').textContent = '';
      $('r-tip').innerHTML = 'Try just the <b>whisper key</b> (left hand · back, at the bottom). That alone plays F. Then add the left first finger hole for E.';
      drawStaff($('r-staff'), null);
    } else if (matches.length) {
      const { note, fingering, main } = matches[0];
      const n = noteName(note.midi);
      $('r-label').textContent = 'That plays';
      name.innerHTML = nameHTML(note.midi);
      $('r-sub').textContent = [n.nickname, n.other && `also called ${n.other}`, n.range].filter(Boolean).join(' · ');
      $('r-tip').textContent = note.tip || '';
      if (!main) $('r-alt').textContent = `Not the main fingering, but another common way to play it. ${fingering.label}.`;
      drawStaff($('r-staff'), note.midi, { x: 4, width: 120, top: 14, s: 9, at: 84 });
    } else {
      $('r-label').textContent = 'Not a standard fingering';
      name.className = 'off none';
      name.textContent = 'No note';
      $('r-sub').textContent = near.length ? 'Closest notes below' : 'Nothing close. Try letting go of some keys.';
      $('r-tip').textContent = '';
      const seen = new Set();
      $('r-near').innerHTML = near.filter(n => !seen.has(n.note.midi) && seen.add(n.note.midi)).map(n =>
        `<li><b>${noteName(n.note.midi).text}</b><span>${changeWords(n.diff)}</span></li>`).join('');
      drawStaff($('r-staff'), null);
    }
    words($('words'), state);
  }

  $('clear').addEventListener('click', () => { state = {}; $('r-last').textContent = ''; render(); });

  // ---------------------------------------------------------------- Pick a note
  // Two rows of notes on the phone's width would be too small, so each clef is split into rows of 7.
  const PER_ROW = 7, S = 14, START = 70, GAP = 44, W = START + PER_ROW * GAP;
  const groups = [
    { clef: 'bass', label: 'Bass clef', notes: NOTES.filter(n => n.midi <= 57) },
    { clef: 'tenor', label: 'Tenor clef · the high notes', notes: NOTES.filter(n => n.midi >= 58) },
  ];
  const cols = {};
  let pinned = null;

  function svgEl(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    if (parent) parent.appendChild(e);
    return e;
  }

  for (const group of groups) {
    for (let r = 0; r * PER_ROW < group.notes.length; r++) {
      const notes = group.notes.slice(r * PER_ROW, (r + 1) * PER_ROW);
      // Room above the staff for the row's highest note, and below it for its lowest (and the names).
      const steps = notes.map(n => Staff.step(n.midi, group.clef));
      const above = Math.max(0, (Math.max(...steps) - 8) * S / 2) + S, below = Math.max(0, -Math.min(...steps) * S / 2) + S;
      const top = (r === 0 ? 22 : 6) + above, H = top + 4 * S + below + 26;
      const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}` });
      Staff.staff(svg, { x: 0, top, width: W, s: S, clef: group.clef });
      if (r === 0) svgEl('text', { x: 0, y: 14, class: 'clef-name' }, svg).textContent = group.label;
      notes.forEach((note, i) => {
        const x = START + i * GAP + GAP / 2 - 8;
        const g = svgEl('g', { class: 'col' }, svg);
        svgEl('rect', { x: x - GAP / 2, y: r === 0 ? 20 : 2, width: GAP, height: H - (r === 0 ? 20 : 2), rx: 8, class: 'hit' }, g);
        Staff.note(g, { midi: note.midi, x, top, s: S, clef: group.clef });
        svgEl('text', { x, y: H - 6, class: 'name' }, g).textContent = noteName(note.midi).text;
        g.addEventListener('click', () => open(note.midi));
        cols[note.midi] = g;
      });
      $('staves').appendChild(svg);
    }
  }

  // ---------------------------------------------------------------- The "how to play it" sheet
  const sheet = $('sheet');
  const picture = Bassoon.diagram($('picture'));

  function open(midi) {
    if (pinned != null) cols[pinned].classList.remove('pinned');
    pinned = midi;
    cols[midi].classList.add('pinned');
    const note = NOTES.find(n => n.midi === midi);
    const n = noteName(midi);
    const [main, ...alts] = note.fingerings;
    picture.set(main.state);
    $('n-name').innerHTML = nameHTML(midi);
    $('n-sub').textContent = [n.nickname, n.other && `also called ${n.other}`, n.range].filter(Boolean).join(' · ');
    words($('n-words'), main.state, main.optional);
    $('n-tip').textContent = note.tip || '';
    $('o-label').textContent = alts.length ? 'Other ways to play it' : '';
    $('o-alts').innerHTML = '';
    for (const alt of alts) {
      const fig = document.createElement('figure');
      const box = document.createElement('div');
      const cap = document.createElement('figcaption');
      cap.textContent = alt.label + '.';
      fig.append(box, cap);
      $('o-alts').appendChild(fig);
      Bassoon.diagram(box, { titles: false }).set(alt.state);
    }
    const i = NOTES.indexOf(note);
    $('lower').disabled = i === 0;
    $('higher').disabled = i === NOTES.length - 1;
    sheet.classList.add('open');
    sheet.setAttribute('aria-hidden', 'false');
    document.body.classList.add('sheet-open');
    sheet.scrollTop = 0;
  }

  function close() {
    sheet.classList.remove('open');
    sheet.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('sheet-open');
    if (pinned != null) cols[pinned].classList.remove('pinned');
    pinned = null;
  }

  function step(d) {
    const i = NOTES.findIndex(n => n.midi === pinned);
    const next = NOTES[Math.max(0, Math.min(NOTES.length - 1, i + d))];
    if (next) open(next.midi);
  }

  sheet.querySelector('.sheet-close').addEventListener('click', close);
  $('lower').addEventListener('click', () => step(-1));
  $('higher').addEventListener('click', () => step(1));
  // "Try it on the keys": press that fingering on the keys above, and scroll up to them.
  $('try').addEventListener('click', () => {
    const note = NOTES.find(n => n.midi === pinned);
    if (!note) return;
    state = { ...note.fingerings[0].state };
    $('r-last').innerHTML = `The fingering for <b>${noteName(note.midi).text}</b>. Tap keys to change it.`;
    close();
    render();
    $('keys-screen').scrollIntoView({ behavior: 'smooth' });
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
    if (pinned != null && e.key === 'ArrowLeft') step(-1);
    if (pinned != null && e.key === 'ArrowRight') step(1);
  });

  // For screenshots (tools/shots.mjs): ?note=55 opens that note; ?keys=W,L1 presses those keys.
  const p = Phone.params;
  if (p.get('keys')) state = Bassoon.parse(p.get('keys').replace(/,/g, ' '));
  render();
  if (p.get('note') && cols[+p.get('note')]) open(+p.get('note'));
})();
