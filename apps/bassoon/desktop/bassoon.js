// Draws the bassoon's keys and holes (left hand and right hand, front and back), and works out which
// note a set of pressed keys plays. Used by both screens. The fingerings themselves are in fingerings.js.

window.Bassoon = (() => {
  const NS = 'http://www.w3.org/2000/svg';
  const { keys: KEYS, notes: NOTES } = window.BASSOON;

  // ---- Notes ----

  const SPELL = [['C', ''], ['C', '♯'], ['D', ''], ['E', '♭'], ['E', ''], ['F', ''], ['F', '♯'], ['G', ''], ['G', '♯'], ['A', ''], ['B', '♭'], ['B', '']];
  const OTHER = { 1: ['D', '♭'], 3: ['D', '♯'], 6: ['G', '♭'], 8: ['A', '♭'], 10: ['A', '♯'] };

  function noteName(midi) {
    const octave = Math.floor(midi / 12) - 1;
    const [letter, acc] = SPELL[midi % 12];
    const other = OTHER[midi % 12];
    return {
      letter, acc, octave,
      text: letter + acc + octave,
      other: other ? other[0] + other[1] + octave : '',
      range: midi <= 53 ? 'Low range' : midi <= 65 ? 'Middle range' : 'High range',
      nickname: midi === 60 ? 'Middle C' : midi === 34 ? 'The lowest note' : '',
    };
  }

  // ---- Fingerings ----

  // 'W L1h L2' -> { W: 1, L1: 'h', L2: 1 }. The left first finger hole is 1 (covered) or 'q' / 'h' / 't'
  // (a little / half / most of it covered: a half-hole).
  function parse(text) {
    const state = {};
    for (const t of (text || '').split(/\s+/).filter(Boolean)) {
      const m = t.match(/^L1([qht])$/);
      if (m) state.L1 = m[1]; else state[t] = 1;
    }
    return state;
  }

  // What matters for telling notes apart: which keys are down, and whether the half-hole is half-covered
  // (a little, half or most all count as "half-hole" here).
  function signature(state, optional = {}) {
    return Object.keys(state).filter(k => state[k] && !optional[k])
      .map(k => (k === 'L1' && state.L1 !== 1 ? 'L1h' : k)).sort().join(' ');
  }

  const FINGERINGS = [];
  for (const note of NOTES) {
    note.fingerings.forEach((f, i) => {
      f.state = parse(f.keys);
      f.optional = parse(f.optional);
      f.sig = signature(f.state, f.optional);
      FINGERINGS.push({ note, fingering: f, main: i === 0 });
    });
  }

  // The note(s) a set of pressed keys plays, or the closest fingerings if it isn't a standard one.
  function identify(state) {
    const matches = [], near = [];
    for (const entry of FINGERINGS) {
      const sig = signature(state, entry.fingering.optional);
      if (sig === entry.fingering.sig) { matches.push(entry); continue; }
      const diff = difference(state, entry.fingering);
      near.push({ ...entry, diff, distance: diff.press.length + diff.release.length + diff.half.length });
    }
    near.sort((a, b) => a.distance - b.distance || !a.main - !b.main);
    return { matches, near: near.filter(n => n.distance <= 2).slice(0, 3) };
  }

  // What to change to get from the pressed keys to a fingering.
  function difference(state, fingering) {
    const press = [], release = [], half = [];
    const want = fingering.state, opt = fingering.optional;
    for (const k of Object.keys(KEYS)) {
      if (opt[k]) continue;
      const has = state[k], needs = want[k];
      if (k === 'L1' && has && needs && (has === 1) !== (needs === 1)) half.push(needs === 1 ? 'cover' : 'half');
      else if (needs && !has) press.push(k);
      else if (has && !needs) release.push(k);
    }
    return { press, release, half };
  }

  // In plain words, a row per hand part: [['Left thumb', 'Whisper key'], ['Left fingers', '1, 2, 3'], ...]
  const PARTS = [
    ['Left thumb', ['lBb', 'lB', 'lC', 'lD', 'lCs', 'fA', 'fC', 'fD', 'W']],
    ['Left fingers', ['L1', 'L2', 'L3']],
    ['Left little finger', ['pEb', 'pCs']],
    ['Right thumb', ['rBb', 'rE', 'rFs', 'rAb']],
    ['Right fingers', ['R1', 'R2', 'R3']],
    ['Right little finger', ['pF', 'pFs', 'pAb']],
  ];
  const HALF_WORDS = { q: 'a little covered', h: 'half-hole', t: 'mostly covered' };

  function describe(state, optional = {}) {
    return PARTS.map(([part, ids]) => {
      const fingers = part.endsWith('fingers');
      const down = ids.filter(k => state[k]).map(k => {
        let word = fingers ? KEYS[k].short : KEYS[k].name.replace(/ \(.*\)$/, '');
        if (k === 'L1' && state.L1 !== 1) word += ` (${HALF_WORDS[state.L1]})`;
        if (optional[k]) word += ' (optional)';
        return word;
      });
      const flicks = ids.filter(k => optional[k] && !state[k]).map(k => KEYS[k].name.replace(/ \(.*\)$/, ''));
      let text = fingers ? (down.length ? down.join(', ') + ' down' : 'all open') : down.join(' + ') || '—';
      if (flicks.length) text = (text === '—' ? '' : text + '; ') + flicks.join(' or ') + ' to flick';
      return [part, text];
    });
  }

  function keyLabel(k) { return `${KEYS[k].name} (${KEYS[k].where.toLowerCase()})`; }

  // ---- Drawing ----

  // Four panels, 440 x 460 each, in a 920 x 960 picture: left hand on top (front, back), right hand below.
  const PANELS = [
    { x: 0, y: 0, title: 'Left hand · front', sub: 'fingers' },
    { x: 480, y: 0, title: 'Left hand · back', sub: 'thumb' },
    { x: 0, y: 500, title: 'Right hand · front', sub: 'fingers' },
    { x: 480, y: 500, title: 'Right hand · back', sub: 'thumb' },
  ];
  // Wooden tubes per panel, and captions under them.
  const TUBES = [
    [{ x: 168, y: 52, w: 100, h: 378, caption: 'wing joint' }],
    [{ x: 88, y: 52, w: 104, h: 378, caption: 'long joint', bell: true }, { x: 252, y: 92, w: 88, h: 338, caption: 'wing joint' }],
    [{ x: 162, y: 52, w: 112, h: 378, caption: 'boot joint' }],
    [{ x: 162, y: 52, w: 112, h: 378, caption: 'boot joint' }],
  ];
  // Each key or hole: which panel, and its shape. hole = a finger hole; ring = a hole with a ring key
  // around it; pad = a metal key (rounded box w x h, turned by `rot` degrees); round = a round metal key.
  const SHAPES = {
    L1: { p: 0, type: 'hole', cx: 218, cy: 130, r: 25, plate: true },
    L2: { p: 0, type: 'hole', cx: 218, cy: 232, r: 23 },
    L3: { p: 0, type: 'hole', cx: 218, cy: 330, r: 23, ring: true },
    pEb: { p: 0, type: 'pad', cx: 324, cy: 362, w: 76, h: 32, rot: -16, label: 'E♭' },
    pCs: { p: 0, type: 'pad', cx: 334, cy: 410, w: 70, h: 30, rot: -16, label: 'C♯' },

    lBb: { p: 1, type: 'pad', cx: 140, cy: 110, w: 70, h: 44, label: 'lo B♭' },
    lB: { p: 1, type: 'pad', cx: 140, cy: 168, w: 70, h: 44, label: 'lo B' },
    lC: { p: 1, type: 'pad', cx: 140, cy: 226, w: 70, h: 44, label: 'lo C' },
    lD: { p: 1, type: 'pad', cx: 140, cy: 312, w: 70, h: 92, label: 'lo D' },
    fD: { p: 1, type: 'pad', cx: 296, cy: 140, w: 72, h: 38, pill: true, label: 'hi D' },
    fC: { p: 1, type: 'pad', cx: 296, cy: 190, w: 72, h: 38, pill: true, label: 'hi C' },
    fA: { p: 1, type: 'pad', cx: 296, cy: 240, w: 72, h: 38, pill: true, label: 'hi A' },
    lCs: { p: 1, type: 'pad', cx: 296, cy: 300, w: 66, h: 44, label: 'C♯' },
    W: { p: 1, type: 'pad', cx: 296, cy: 372, w: 76, h: 54, pill: true, label: 'whisper', small: true },

    R1: { p: 2, type: 'hole', cx: 218, cy: 120, r: 24 },
    R2: { p: 2, type: 'hole', cx: 218, cy: 214, r: 24 },
    R3: { p: 2, type: 'hole', cx: 218, cy: 308, r: 24 },
    pFs: { p: 2, type: 'pad', cx: 326, cy: 320, w: 68, h: 30, rot: -14, label: 'F♯' },
    pF: { p: 2, type: 'pad', cx: 342, cy: 366, w: 84, h: 34, rot: -14, label: 'F' },
    pAb: { p: 2, type: 'pad', cx: 330, cy: 412, w: 68, h: 30, rot: -14, label: 'G♯' },

    rBb: { p: 3, type: 'pad', cx: 218, cy: 108, w: 88, h: 40, pill: true, label: 'B♭' },
    rE: { p: 3, type: 'round', cx: 218, cy: 200, r: 44, label: 'E' },
    rFs: { p: 3, type: 'pad', cx: 218, cy: 290, w: 74, h: 38, pill: true, label: 'F♯' },
    rAb: { p: 3, type: 'pad', cx: 218, cy: 346, w: 74, h: 38, pill: true, label: 'G♯' },
  };
  const COVER = { q: 0.3, h: 0.5, t: 0.72 };   // how much of the half-hole the finger covers

  let uid = 0;
  function el(tag, attrs = {}, parent) {
    const e = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) if (v !== undefined) e.setAttribute(k, v);
    if (parent) parent.appendChild(e);
    return e;
  }
  function text(parent, x, y, str, cls) {
    const t = el('text', { x, y, class: cls }, parent);
    t.textContent = str;
    return t;
  }

  // Make a diagram inside `container`. Returns { svg, set(state) }. With `interactive`, keys can be
  // hovered and clicked: onPress(keyId) and onHover(keyId or null, event).
  function diagram(container, { interactive = false, onPress, onHover, titles = true } = {}) {
    const id = 'bsn' + (++uid);
    const svg = el('svg', { viewBox: '0 0 920 960', class: 'bassoon' + (interactive ? ' interactive' : '') });
    const defs = el('defs', {}, svg);
    // Wood: darker at the edges, like a rounded tube. Metal: brushed silver.
    const wood = el('linearGradient', { id: id + 'wood', x1: 0, x2: 1, y1: 0, y2: 0 }, defs);
    [['0', 'var(--wood-edge)'], ['.35', 'var(--wood-lit)'], ['.6', 'var(--wood)'], ['1', 'var(--wood-edge)']]
      .forEach(([o, c]) => el('stop', { offset: o, 'stop-color': c }, wood));
    const metal = el('linearGradient', { id: id + 'metal', x1: 0, x2: 0, y1: 0, y2: 1 }, defs);
    [['0', 'var(--metal-lit)'], ['1', 'var(--metal)']].forEach(([o, c]) => el('stop', { offset: o, 'stop-color': c }, metal));
    const red = el('linearGradient', { id: id + 'red', x1: 0, x2: 0, y1: 0, y2: 1 }, defs);
    [['0', 'var(--press-lit)'], ['1', 'var(--press)']].forEach(([o, c]) => el('stop', { offset: o, 'stop-color': c }, red));

    const parts = {};
    PANELS.forEach((panel, p) => {
      const g = el('g', { transform: `translate(${panel.x},${panel.y})` }, svg);
      el('rect', { x: 0, y: 0, width: 440, height: 460, rx: 22, class: 'panel' }, g);
      if (titles) {
        text(g, 22, 34, panel.title, 'panel-title');
        text(g, 418, 34, panel.sub, 'panel-sub').setAttribute('text-anchor', 'end');
      }
      for (const tube of TUBES[p]) {
        el('rect', { x: tube.x, y: tube.y, width: tube.w, height: tube.h, rx: tube.w / 2, fill: `url(#${id}wood)`, class: 'tube' }, g);
        // Metal bands at the ends of each joint
        el('rect', { x: tube.x - 2, y: tube.y + (tube.bell ? 0 : 6), width: tube.w + 4, height: tube.bell ? 16 : 9, rx: 4, fill: `url(#${id}metal)`, class: 'band' }, g);
        el('rect', { x: tube.x - 2, y: tube.y + tube.h - 15, width: tube.w + 4, height: 9, rx: 4, fill: `url(#${id}metal)`, class: 'band' }, g);
        text(g, tube.x + tube.w / 2, 452, tube.caption, 'caption').setAttribute('text-anchor', 'middle');
      }
      if (p === 0 || p === 2) text(g, 22, 64, '↑ reed end', 'caption');
      parts[p] = g;
    });

    const nodes = {};
    for (const [k, s] of Object.entries(SHAPES)) {
      const g = el('g', { class: 'key ' + s.type, 'data-key': k }, parts[s.p]);
      if (s.type === 'hole') {
        if (s.ring || s.plate) el('circle', { cx: s.cx, cy: s.cy, r: s.r + 8, fill: 'none', stroke: `url(#${id}metal)`, 'stroke-width': s.plate ? 9 : 7, class: 'rim' }, g);
        el('circle', { cx: s.cx, cy: s.cy, r: s.r, class: 'hole-bg' }, g);
        // The finger: a red disc, clipped from the bottom up for a half-hole
        const clip = el('clipPath', { id: `${id}clip${k}` }, defs);
        const clipRect = el('rect', { x: s.cx - s.r - 2, width: 2 * s.r + 4 }, clip);
        el('circle', { cx: s.cx, cy: s.cy, r: s.r, fill: `url(#${id}red)`, 'clip-path': `url(#${id}clip${k})`, class: 'cover' }, g);
        el('circle', { cx: s.cx, cy: s.cy, r: s.r, class: 'outline' }, g);
        text(g, s.cx, s.cy + 7, KEYS[k].short, 'hole-label');
        nodes[k] = { g, clipRect, s };
      } else if (s.type === 'round') {
        el('circle', { cx: s.cx, cy: s.cy, r: s.r, class: 'metal', fill: `url(#${id}metal)` }, g);
        el('circle', { cx: s.cx, cy: s.cy, r: s.r, class: 'press', fill: `url(#${id}red)` }, g);
        text(g, s.cx, s.cy + 8, s.label, 'key-label');
        nodes[k] = { g, s };
      } else {
        const inner = el('g', { transform: `rotate(${s.rot || 0} ${s.cx} ${s.cy})` }, g);
        const r = s.pill ? s.h / 2 : 12;
        const box = { x: s.cx - s.w / 2, y: s.cy - s.h / 2, width: s.w, height: s.h, rx: r };
        el('rect', { ...box, class: 'metal', fill: `url(#${id}metal)` }, inner);
        el('rect', { ...box, class: 'press', fill: `url(#${id}red)` }, inner);
        text(inner, s.cx, s.cy + (s.small ? 6 : 7), s.label, 'key-label' + (s.small ? ' small' : ''));
        nodes[k] = { g, s };
      }
      if (interactive) {
        g.addEventListener('click', e => { e.stopPropagation(); onPress && onPress(k); });
        g.addEventListener('mousemove', e => onHover && onHover(k, e));
        g.addEventListener('mouseleave', e => onHover && onHover(null, e));
      }
    }

    function set(state) {
      for (const [k, n] of Object.entries(nodes)) {
        const v = state[k];
        n.g.classList.toggle('on', !!v);
        n.g.classList.toggle('half', k === 'L1' && !!v && v !== 1);
        if (n.clipRect) {
          const cover = v === 1 ? 1 : COVER[v] || 0;
          const h = (2 * n.s.r + 4) * cover;
          n.clipRect.setAttribute('y', n.s.cy + n.s.r + 2 - h);
          n.clipRect.setAttribute('height', h);
        }
      }
    }
    set({});
    container.appendChild(svg);
    return { svg, set };
  }

  return { KEYS, NOTES, noteName, parse, identify, describe, keyLabel, diagram };
})();
