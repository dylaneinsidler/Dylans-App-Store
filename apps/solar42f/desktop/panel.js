// Dylan's Solar 42F: the front panel. Draws the instrument as one picture (SVG), laid out like Elta Music's own
// panel drawing (reference-panel.png), and makes every knob, button, switch, jack, plate and the joystick work.
// Positions are in the drawing's units: 2000 across, 1293 down.
//
// Knobs: drag up or down (Shift for fine), or use the mouse wheel; double-click puts a knob back to where it started.
// Patch cables: drag from a jack to another jack (an output to an input). Drag a cable's plug away from an input to
// move or remove it; click a cable to remove it.

const SVGNS = 'http://www.w3.org/2000/svg';
const COLORS = { blue: '#0d5f7c', green: '#0f5c39', orange: '#ec8b3c', red: '#d5281f', grey: '#d4d4d4', black: '#151515' };
const CABLE_COLORS = ['#d6312a', '#f2b51c', '#2c6fd6', '#2f9e4f', '#8a46c9', '#e86fb0', '#20b6c2'];

const Panel = (() => {
  const values = {}, defaults = {}, controls = {}, jacks = {}, leds = {};
  let cables = [], svg, cableLayer, send = () => {}, sendCables = () => {}, onMic = () => {};

  // ---- Drawing helpers ----
  function el(tag, attrs, parent) {
    const e = document.createElementNS(SVGNS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    (parent || svg).appendChild(e);
    return e;
  }
  function text(x, y, s, o = {}) {
    const t = el('text', { x, y, 'font-size': o.size || 15, 'font-weight': o.weight || 700, fill: o.fill || '#111',
      'text-anchor': o.anchor || 'middle', 'dominant-baseline': 'middle', class: 'lbl', ...(o.attrs || {}) }, o.parent);
    t.textContent = s;
    if (o.rotate) t.setAttribute('transform', `rotate(${o.rotate} ${x} ${y})`);
    return t;
  }
  const box = (x, y, w, h, o = {}) => el('rect', { x, y, width: w, height: h, rx: o.rx ?? 12, fill: o.fill || 'none',
    stroke: o.stroke || '#111', 'stroke-width': o.sw ?? 3 });
  // A black bar with the section's name in white: "LFO A", "DRONE 3", "VCO B"...
  function tag(x, y, w, s, o = {}) {
    el('rect', { x, y, width: w, height: o.h || 22, fill: '#111', rx: o.rx ?? 0 });
    text(x + w / 2, y + (o.h || 22) / 2 + 1, s, { fill: '#fff', size: o.size || 15 });
  }
  function tip(node, s) { const t = el('title', {}, node); t.textContent = s; }
  function arc(cx, cy, r) {              // the thin travel arc around a knob, with a dot at the start and an arrow at the end
    const a0 = (-225) * Math.PI / 180, a1 = 45 * Math.PI / 180;
    const p = a => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    el('path', { d: `M${x0},${y0} A${r},${r} 0 1 1 ${x1},${y1}`, fill: 'none', stroke: '#111', 'stroke-width': 1.8 });
    el('circle', { cx: x0, cy: y0, r: 3.2, fill: '#111' });
    el('path', { d: `M${x1 - 6},${y1 - 3} L${x1 + 3},${y1 + 4} L${x1 - 2},${y1 - 8} Z`, fill: '#111' });
  }
  function ticks(cx, cy, r, n = 11) {    // radial tick marks around the effector's knobs
    for (let i = 0; i < n; i++) {
      const a = (-225 + i * 270 / (n - 1)) * Math.PI / 180;
      el('line', { x1: cx + (r + 3) * Math.cos(a), y1: cy + (r + 3) * Math.sin(a), x2: cx + (r + 11) * Math.cos(a), y2: cy + (r + 11) * Math.sin(a), stroke: '#111', 'stroke-width': 3 });
    }
  }

  // ---- Controls ----
  function setValue(id, v, quiet) {
    values[id] = v;
    const c = controls[id];
    if (c && c.draw) c.draw(v);
    if (id.startsWith('fx.prog')) updateProgramNames();
    if (id.includes('.mute')) showOscStatus();
    if (!quiet) { send({ [id]: v }); save(); }
  }

  // A knob. o: { r, color, style: 'grip' | 'plain', label, ly, arc, ticks, def, steps, tipText }
  function knob(id, x, y, o) {
    const r = o.r || 24;
    defaults[id] = o.def ?? 0.5;
    if (o.arc) arc(x, y, r + 9);
    if (o.ticks) ticks(x, y, r);
    const g = el('g', { class: 'knob', 'data-id': id });
    if (o.style === 'plain') {
      el('circle', { cx: x, cy: y, r, fill: '#111' }, g);
    } else {
      el('circle', { cx: x, cy: y, r, fill: '#2a2a2a' }, g);
      el('circle', { cx: x, cy: y, r: r - 3.5, fill: 'none', stroke: '#4a4a4a', 'stroke-width': 5, 'stroke-dasharray': '3 2.4' }, g);
      el('circle', { cx: x, cy: y, r: r * 0.66, fill: COLORS[o.color] || o.color }, g);
    }
    const dot = el('circle', { cx: x, cy: y - r * (o.style === 'plain' ? 0.62 : 0.48), r: Math.max(2.6, r * 0.12), fill: o.color === 'grey' ? '#111' : '#fff' }, g);
    if (o.label) text(x, o.ly ?? y + r + 18, o.label, { size: o.size || 16 });
    tip(g, o.tipText || o.label || id);
    controls[id] = { draw: v => dot.setAttribute('transform', `rotate(${-135 + 270 * v} ${x} ${y})`) };
    controls[id].draw(values[id] ?? defaults[id]);
    let start = null;
    g.addEventListener('pointerdown', e => { g.setPointerCapture(e.pointerId); start = { y: e.clientY, v: values[id] }; e.preventDefault(); });
    g.addEventListener('pointermove', e => {
      if (!start) return;
      let v = clamp(start.v + (start.y - e.clientY) / (e.shiftKey ? 1600 : 260), 0, 1);
      if (o.steps) v = Math.round(v * (o.steps - 1)) / (o.steps - 1);
      if (v !== values[id]) setValue(id, v);
    });
    g.addEventListener('pointerup', () => { start = null; });
    g.addEventListener('dblclick', () => setValue(id, defaults[id]));
    g.addEventListener('wheel', e => {
      e.preventDefault();
      const step = o.steps ? 1 / (o.steps - 1) : (e.shiftKey ? 0.004 : 0.025);
      setValue(id, clamp((values[id] ?? 0) + (e.deltaY < 0 ? step : -step), 0, 1));
    }, { passive: false });
  }

  // A pushbutton. kind: 'latch' (press on, press off) or 'momentary' (on while held).
  function button(id, x, y, r, kind, o = {}) {
    defaults[id] = o.def ?? 0;
    const g = el('g', { class: 'btn', 'data-id': id });
    const c = el('circle', { cx: x, cy: y, r, fill: o.fill || '#111' }, g);
    const ring = el('circle', { cx: x, cy: y, r: r - 4, fill: 'none', stroke: '#fff', 'stroke-width': 2, opacity: 0 }, g);
    tip(g, o.tipText || id);
    controls[id] = { draw: v => { ring.setAttribute('opacity', v > 0.5 ? 0.85 : 0); c.setAttribute('fill', v > 0.5 ? (o.onFill || '#3a3a3a') : (o.fill || '#111')); } };
    controls[id].draw(values[id] ?? defaults[id]);
    if (kind === 'latch') g.addEventListener('click', () => setValue(id, values[id] > 0.5 ? 0 : 1));
    else {
      g.addEventListener('pointerdown', e => { g.setPointerCapture(e.pointerId); setValue(id, 1); });
      g.addEventListener('pointerup', () => setValue(id, 0));
      g.addEventListener('pointercancel', () => setValue(id, 0));
    }
    return g;
  }

  // A toggle switch: a lever that points up or down (or up, middle, down). Click to flip it.
  function toggle(id, x, y, positions, o = {}) {
    defaults[id] = o.def ?? 0;
    const g = el('g', { class: 'btn', 'data-id': id });
    el('circle', { cx: x, cy: y, r: 11, fill: '#2a2a2a' }, g);
    el('circle', { cx: x, cy: y, r: 7, fill: '#111' }, g);
    const lever = el('rect', { x: x - 5, y: y - 2, width: 10, height: 22, rx: 5, fill: COLORS[o.color] || o.color || COLORS.green }, g);
    tip(g, o.tipText || id);
    // value 0 = lever down (lower label), 1 = up; three-position switches: 0, 0.5, 1
    controls[id] = { draw: v => lever.setAttribute('transform', `rotate(${positions === 3 ? (v > 0.75 ? 180 : v > 0.25 ? 90 : 0) : (v > 0.5 ? 180 : 0)} ${x} ${y})`) };
    controls[id].draw(values[id] ?? defaults[id]);
    g.addEventListener('click', () => {
      const v = values[id] ?? 0;
      setValue(id, positions === 3 ? (v > 0.75 ? 0 : v > 0.25 ? 1 : 0.5) : (v > 0.5 ? 0 : 1));
    });
  }

  function led(id, x, y, color, r = 7) {
    el('circle', { cx: x, cy: y, r, fill: '#2b2b2b' });
    const l = el('circle', { cx: x, cy: y, r, fill: color, opacity: 0.15 });
    leds[id] = l;
    return l;
  }

  // A jack: a hex nut with a hole. Outputs have a small red arrow pointing out of them, inputs a black one.
  function jack(id, x, y, kind, o = {}) {
    const g = el('g', { class: 'jack', 'data-id': id });
    const hex = [...Array(6)].map((_, i) => { const a = Math.PI / 3 * i; return `${x + 17 * Math.cos(a)},${y + 17 * Math.sin(a)}`; }).join(' ');
    el('polygon', { points: hex, fill: '#9a9a9a', stroke: '#444', 'stroke-width': 1.5 }, g);
    el('circle', { cx: x, cy: y, r: 11.5, fill: '#cfcfcf' }, g);
    el('circle', { cx: x, cy: y, r: 7.5, fill: '#0b0b0b' }, g);
    if (o.arrow !== false) {
      const c = kind === 'out' ? '#d5281f' : '#111';
      const ax = o.arrow === 'below' ? x : x - 24, ay = o.arrow === 'below' ? y + 25 : y;
      el('path', { d: o.arrow === 'below' ? `M${ax - 6},${ay + 3} L${ax + 6},${ay + 3} L${ax},${ay - 4} Z`
        : `M${ax - 3},${ay - 6} L${ax + 4},${ay} L${ax - 3},${ay + 6} Z`, fill: c });
    }
    tip(g, `${o.name || id} (${kind === 'out' ? 'output' : 'input'})${o.normal ? `. With nothing plugged in: ${o.normal}` : ''}`);
    jacks[id] = { x, y, kind, g };
    g.addEventListener('pointerdown', e => startCable(e, id));
    return g;
  }

  // ---- Patch cables ----
  let drag = null;
  function cablePath(a, b) {
    const sag = Math.min(160, 40 + Math.hypot(b.x - a.x, b.y - a.y) * 0.25);
    return `M${a.x},${a.y} C${a.x},${a.y + sag} ${b.x},${b.y + sag} ${b.x},${b.y}`;
  }
  function drawCables() {
    cableLayer.innerHTML = '';
    cables.forEach((c, i) => {
      const a = jacks[c[0]], b = jacks[c[1]];
      if (!a || !b) return;
      const color = c[2] || CABLE_COLORS[i % CABLE_COLORS.length];
      const p = el('path', { d: cablePath(a, b), fill: 'none', stroke: color, 'stroke-width': 7, 'stroke-linecap': 'round', opacity: 0.88, class: 'cable' }, cableLayer);
      tip(p, `${c[0]} → ${c[1]} (click to remove)`);
      p.addEventListener('click', () => { cables.splice(i, 1); cablesChanged(); });
      for (const j of [a, b]) el('circle', { cx: j.x, cy: j.y, r: 9, fill: color, stroke: '#111', 'stroke-width': 2, 'pointer-events': 'none' }, cableLayer);
    });
  }
  function cablesChanged() { drawCables(); sendCables(cables.map(c => [c[0], c[1]])); save(); }
  function toSvg(e) { const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()); }
  function startCable(e, id) {
    e.preventDefault();
    let from = id, color;
    // Grabbing an input that already has a cable picks that cable up by its plug.
    if (jacks[id].kind === 'in') {
      const i = cables.findIndex(c => c[1] === id);
      if (i >= 0) { from = cables[i][0]; color = cables[i][2]; cables.splice(i, 1); cablesChanged(); }
    }
    const a = jacks[from];
    color = color || CABLE_COLORS[cables.length % CABLE_COLORS.length];
    const line = el('path', { d: '', fill: 'none', stroke: color, 'stroke-width': 7, 'stroke-linecap': 'round', opacity: 0.75, 'pointer-events': 'none' }, cableLayer);
    drag = { from, line, color };
    const move = ev => { const p = toSvg(ev); line.setAttribute('d', cablePath(a, p)); };
    const up = ev => {
      window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up);
      line.remove();
      const p = toSvg(ev);
      const hit = Object.entries(jacks).find(([, j]) => Math.hypot(j.x - p.x, j.y - p.y) < 20);
      if (hit && hit[0] !== from) {
        let [o, i] = jacks[from].kind === 'out' ? [from, hit[0]] : [hit[0], from];
        if (jacks[o].kind === 'out' && jacks[i].kind === 'in') {
          cables = cables.filter(c => c[1] !== i);              // an input takes one cable
          cables.push([o, i, color]);
        }
      }
      drag = null;
      cablesChanged();
    };
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
    move(e);
  }

  // ---- Saving the panel between sessions ----
  let saveTimer = null;
  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try {
        const keep = {};
        for (const k in values) if (!/\.pad$|^kbd\.note$|^kbd\.press$/.test(k)) keep[k] = values[k];
        localStorage.setItem('solar42f.panel', JSON.stringify({ values: keep, cables }));
      } catch (e) { /* private window or storage blocked: the panel just starts fresh next time */ }
    }, 400);
  }
  function load() {
    try {
      const s = JSON.parse(localStorage.getItem('solar42f.panel') || 'null');
      if (s) { Object.assign(values, s.values || {}); cables = s.cables || []; }
    } catch (e) { /* start fresh */ }
  }

  const clamp = (x, a, b) => (x < a ? a : x > b ? b : x);

  // =================================================================================================================
  //   The panel, section by section
  // =================================================================================================================

  function drawClassicDrone(n, dx) {
    const k = `d${n}.`;
    box(18 + dx, 215, 322, 250);
    // the dotted dividers between the five oscillator columns and the MUTE / TUNE / MOD strip
    el('rect', { x: 18 + dx, y: 215, width: 22, height: 135, fill: '#111' });
    text(29 + dx, 245, 'MUTE', { fill: '#fff', size: 13, rotate: -90 });
    text(29 + dx, 287, 'TUNE', { fill: '#fff', size: 13, rotate: -90 });
    text(29 + dx, 330, 'MOD', { fill: '#fff', size: 13, rotate: -90 });
    const xs = [52, 103, 155, 205, 256].map(x => x + dx);
    xs.forEach((x, i) => {
      text(x, 223, String(i + 1), { size: 14 });
      for (let y = 262; y < 330; y += 4) if (y < 268 || y > 302) el('line', { x1: x - 6, x2: x + 6, y1: y, y2: y, stroke: '#111', 'stroke-width': 1.5 });
      button(k + 'mute' + (i + 1), x, 245, 15, 'latch', { tipText: `MUTE ${i + 1}: switches oscillator ${i + 1} off (its light goes out). Mix and match the five to make chords.` });
      knob(k + 'tune' + (i + 1), x, 287, { r: 18, style: 'plain', def: 0.5, tipText: `TUNE ${i + 1}: oscillator ${i + 1}'s pitch (${i < 2 ? 'low' : i === 2 ? 'middle' : 'high'})` });
      button(k + 'mod' + (i + 1), x, 337, 15, 'latch', { tipText: `MOD ${i + 1}: when on, oscillator ${i + 1}'s pitch follows the light on the photo sensor and the CV input` });
    });
    // OSC STATUS: one red light per oscillator that's playing
    el('rect', { x: 277 + dx, y: 227, width: 58, height: 34, fill: '#111' });
    for (let i = 0; i < 5; i++) leds[`${k}osc${i + 1}`] = el('rect', { x: 281 + dx + i * 10.6, y: 231, width: 8, height: 26, fill: '#e3261d' });
    text(306 + dx, 272, '1 2 3 4 5', { size: 12 });
    knob(k + 'volt', 296 + dx, 318, { r: 24, color: 'blue', def: 0.2, ticks: true, tipText: 'VOLT: transposes all five oscillators down. Past halfway they start modulating each other (an FM-like growl).' });
    text(296 + dx, 353, 'VOLT', { size: 16 });
    // HOLD / GATE strip
    el('path', { d: `M${18 + dx},${355} H${75 + dx} Q${85 + dx},${355} ${85 + dx},${365} V${465} H${18 + dx} Z`, fill: 'none', stroke: '#111', 'stroke-width': 3 });
    el('rect', { x: 18 + dx, y: 355, width: 22, height: 110, fill: '#111' });
    text(29 + dx, 382, 'HOLD', { fill: '#fff', size: 13, rotate: -90 });
    text(29 + dx, 438, 'GATE', { fill: '#fff', size: 13, rotate: -90 });
    button(k + 'hold', 52 + dx, 380, 15, 'latch', { tipText: 'HOLD: keeps the voice sounding (latches its gate on)' });
    led(k + 'holdled', 52 + dx, 406, '#f0b400', 6);
    jack(k + 'gate', 52 + dx, 440, 'in', { arrow: 'below', name: 'GATE', normal: `drone pad ${n}` });
    knob(k + 'att', 101 + dx, 380, { r: 17, style: 'plain', def: 0.35, label: 'ATT', ly: 409, tipText: 'ATT: how slowly the voice fades in' });
    knob(k + 'rls', 153 + dx, 380, { r: 17, style: 'plain', def: 0.5, label: 'RLS', ly: 409, tipText: 'RLS: how slowly the voice fades out' });
    text(95 + dx, 440, 'ʘ', { size: 24 });
    jack(k + 'env', 153 + dx, 440, 'out', { arrow: 'below', name: 'env (this voice\'s envelope)' });
    text(126 + dx, 453, 'env', { size: 13, fill: '#d5281f' });
    el('path', { d: `M${180 + dx},${355} H${228 + dx} V${465}`, fill: 'none', stroke: '#111', 'stroke-width': 3 });
    knob(k + 'cv', 205 + dx, 380, { r: 17, style: 'plain', def: 0.4, label: 'CV', ly: 409, tipText: 'CV: how much the CV input moves the pitch of the oscillators with MOD on' });
    jack(k + 'cvin', 205 + dx, 440, 'in', { arrow: false, name: 'CV', normal: n < 3 ? 'LFO A (through the sensor\'s red light)' : 'LFO B (through the sensor\'s red light)' });
    el('path', { d: `M${199 + dx},${414} L${211 + dx},${414} L${205 + dx},${421} Z`, fill: '#111' });
    // The photo sensor: cover it (press and hold) to darken it, hover for a shadow
    const sensor = el('circle', { cx: 283 + dx, cy: 415, r: 47, fill: '#d9d9d9', class: 'sensor' });
    tip(sensor, 'Photo sensor: the oscillators with MOD on follow the light here. Hover to cast a shadow, press and hold to cover it, scroll to change the room light.');
    defaults[k + 'light'] = 0.5;
    let room = values[k + 'light'] ?? 0.5;
    const shade = v => { sensor.setAttribute('fill', `hsl(0,0%,${55 + v * 35}%)`); setValue(k + 'light', v); };
    sensor.addEventListener('pointerenter', () => shade(room * 0.55));
    sensor.addEventListener('pointerleave', () => shade(room));
    sensor.addEventListener('pointerdown', e => { sensor.setPointerCapture(e.pointerId); shade(0.02); });
    sensor.addEventListener('pointerup', () => shade(room * 0.55));
    sensor.addEventListener('wheel', e => { e.preventDefault(); room = clamp(room + (e.deltaY < 0 ? 0.05 : -0.05), 0, 1); shade(room * 0.55); }, { passive: false });
    el('rect', { x: 315 + dx, y: 444, width: 25, height: 21, fill: '#111' });
    text(327 + dx, 455, String(n), { fill: '#fff', size: 16 });
  }

  function drawSrapaDrone(n, dx) {
    const k = `d${n}.`;
    box(18 + dx, 473, 322, 259);
    tag(262 + dx, 473, 78, `DRONE ${n}`, { h: 21 });
    text(41 + dx, 487, 'LFO', { size: 14 });
    el('path', { d: `M${60 + dx},487 H${94 + dx} V${590}`, fill: 'none', stroke: '#111', 'stroke-width': 1.5, 'stroke-dasharray': '2 3' });
    text(84 + dx, 497, '1', { size: 11 }); text(104 + dx, 497, '10', { size: 11 });
    button(k + 'range', 94 + dx, 512, 12, 'latch', { tipText: 'LFO range: ×1 or ×10 (fast)' });
    el('path', { d: `M${108 + dx},508 Q${130 + dx},488 ${160 + dx},494`, fill: 'none', stroke: '#d5281f', 'stroke-width': 1.8 });
    el('path', { d: `M${108 + dx},512 Q${180 + dx},478 ${240 + dx},494`, fill: 'none', stroke: '#d5281f', 'stroke-width': 1.8 });
    el('path', { d: `M${50 + dx},528 Q${60 + dx},505 ${80 + dx},510`, fill: 'none', stroke: '#d5281f', 'stroke-width': 1.8 });
    text(160 + dx, 496, 'fm', { size: 15 }); text(244 + dx, 496, 'am', { size: 15 });
    button(k + 'fm', 181 + dx, 512, 12, 'latch', { def: 1, tipText: 'fm: the LFO bends the pitch (sirens, birds)' });
    button(k + 'am', 266 + dx, 512, 12, 'latch', { tipText: 'am: the LFO chops the volume (volleys)' });
    knob(k + 'rate', 45 + dx, 543, { r: 24, color: 'blue', arc: true, label: 'rate', ly: 578, def: 0.4, tipText: 'rate: the LFO\'s speed' });
    knob(k + 'mod', 136 + dx, 543, { r: 24, color: 'blue', arc: true, label: 'mod', ly: 577, def: 0.4, tipText: 'mod: how much the LFO modulates the tone' });
    knob(k + 'divider', 222 + dx, 543, { r: 24, color: 'blue', arc: true, label: 'divider', ly: 577, def: 0, tipText: 'divider: mixes in the tone divided down (lower, rougher sub-tones)' });
    knob(k + 'pitch', 307 + dx, 543, { r: 24, color: 'blue', arc: true, label: 'PITCH', ly: 577, def: 0.45, tipText: 'PITCH: the tone\'s pitch' });
    button(k + 'hilo', 266 + dx, 576, 12, 'latch', { tipText: 'hi/low: the tone\'s range' });
    text(270 + dx, 598, 'hi/low', { size: 14 });
    jack(k + 'lfo', 94 + dx, 590, 'out', { arrow: 'below', name: 'LFO out (square wave)' });
    jack(k + 'cvin', 181 + dx, 588, 'in', { arrow: false, name: 'cv (pitch)' });
    el('path', { d: `M${175 + dx},${611} L${187 + dx},${611} L${181 + dx},${604} Z`, fill: '#111' });
    text(181 + dx, 618, 'cv', { size: 14 });
    // HOLD / GATE
    el('path', { d: `M${18 + dx},612 H${75 + dx} Q${85 + dx},612 ${85 + dx},622 V732 H${18 + dx} Z`, fill: 'none', stroke: '#111', 'stroke-width': 3 });
    el('rect', { x: 18 + dx, y: 612, width: 22, height: 120, fill: '#111' });
    text(29 + dx, 637, 'HOLD', { fill: '#fff', size: 13, rotate: -90 });
    text(29 + dx, 700, 'GATE', { fill: '#fff', size: 13, rotate: -90 });
    button(k + 'hold', 52 + dx, 635, 15, 'latch', { tipText: 'HOLD: keeps the voice sounding' });
    led(k + 'holdled', 52 + dx, 661, '#f0b400', 6);
    jack(k + 'gate', 52 + dx, 697, 'in', { arrow: 'below', name: 'GATE', normal: `drone pad ${n}` });
    knob(k + 'att', 102 + dx, 635, { r: 17, style: 'plain', def: 0.3, label: 'ATT', ly: 666 });
    knob(k + 'rls', 153 + dx, 635, { r: 17, style: 'plain', def: 0.5, label: 'RLS', ly: 666 });
    el('rect', { x: 84 + dx, y: 680, width: 37, height: 40, rx: 6, fill: 'none', stroke: '#111', 'stroke-width': 3 });
    text(102 + dx, 701, 'Y', { size: 30, weight: 900 });
    jack(k + 'env', 153 + dx, 697, 'out', { name: 'env out' });
    text(154 + dx, 724, 'env out', { size: 13, fill: '#d5281f' });
    knob(k + 'noise', 231 + dx, 635, { r: 24, color: 'blue', ticks: false, label: 'NOISE', ly: 667, def: 0, tipText: 'NOISE: white noise in place of the tone (surf, wind). All the way up, with mod and divider up too, for clean noise.' });
    // S&H: the scattered dots, one lit by the sample & hold
    [[277, 610, 6], [292, 625, 5], [300, 602, 9], [318, 597, 7], [316, 620, 5], [298, 642, 5], [282, 646, 4], [266, 634, 4]].forEach(([x, y, r]) => el('circle', { cx: x + dx, cy: y, r, fill: '#111' }));
    led(k + 'shled', 307 + dx, 636, '#ff2a1a', 8);
    el('path', { d: `M${268 + dx},620 l4,-14 l4,22 l4,-22 l4,22 l4,-14`, fill: 'none', stroke: '#111', 'stroke-width': 1.6 });
    el('path', { d: `M${185 + dx},676 H${340 + dx} V732 H${185 + dx} Z`, fill: 'none', stroke: '#111', 'stroke-width': 3 });
    tag(290 + dx, 657, 50, 'S&H', { h: 20, size: 14 });
    jack(k + 'shin', 205 + dx, 697, 'in', { arrow: 'below', name: 'S&H in', normal: 'this voice\'s noise' });
    jack(k + 'clock', 257 + dx, 697, 'in', { arrow: false, name: 'S&H clock', normal: 'this voice\'s LFO' });
    text(257 + dx, 723, 'clock', { size: 14 });
    jack(k + 'sh', 306 + dx, 697, 'out', { name: 'S&H out' });
  }

  function drawVCO(x, dx) {
    const k = `vco${x}.`, A = x === 'a';
    box(347 + dx, 473, 321, 259);
    tag(600 + dx, 473, 68, `VCO ${x.toUpperCase()}`, { h: 21 });
    text(508 + dx, 482, 'MORPHING', { size: 13 }); text(508 + dx, 495, 'WAVEFORM', { size: 13 });
    knob(k + 'cvamt', 404 + dx, 543, { r: 26, color: 'green', arc: true, def: 0, tipText: A ? 'cv amt: how much the cv input moves the pitch' : 'cv amt: how much the cv input moves the pitch. With nothing plugged in, VCO A is there: frequency modulation.' });
    text(404 + dx, 499, 'cv amt', { size: 16 });
    text(372 + dx, 568, 'lin', { size: 12 });
    toggle(k + 'linexp', 370 + dx, 594, 2, { color: 'green', def: 1, tipText: 'lin / exp: how the cv input moves the pitch (exp: by octaves, like a keyboard; lin: by hertz, for clean FM)' });
    text(370 + dx, 618, 'exp', { size: 12 });
    text(478 + dx, 522, 'oct+3', { size: 17 });
    toggle(k + 'oct', 478 + dx, 548, 2, { color: 'green', def: 0, tipText: 'oct+3 / low: the low range, or three octaves up' });
    text(478 + dx, 568, 'low', { size: 17 });
    text(540 + dx, 522, '−1 ⊓', { size: 17 });
    toggle(k + 'sub', 540 + dx, 548, 2, { color: 'green', def: 0, tipText: 'sub: adds a square wave one octave down' });
    text(540 + dx, 568, 'sub', { size: 17 });
    knob(k + 'tune', 611 + dx, 543, { r: 26, color: 'green', arc: true, def: 0.0, label: 'tune', ly: 583, tipText: 'tune: the pitch, over one octave' });
    knob(k + 'pwm', 405 + dx, 633, { r: 26, color: 'green', arc: true, def: 0.2, label: 'pwm', ly: 671, tipText: A ? 'pwm: how much the pwm input sweeps the pulse width (LFO A with nothing plugged in)' : 'pwm: how much the pwm input sweeps the pulse width (LFO B with nothing plugged in)' });
    knob(k + 'pw', 611 + dx, 633, { r: 26, color: 'green', arc: true, def: 0.5, label: 'pw', ly: 671, tipText: 'pw: the square wave\'s width, and the morph of the last two waveforms' });
    // the waveform selector, with its six shapes around it
    const cx = 508 + dx, cy = 633;
    const shapes = ['∿', '⋀', '◿', '⊓', '⋈', '∿̸'];
    shapes.forEach((s, i) => {
      const a = (-200 + i * 44) * Math.PI / 180;
      el('line', { x1: cx + 42 * Math.cos(a), y1: cy + 42 * Math.sin(a), x2: cx + 52 * Math.cos(a), y2: cy + 52 * Math.sin(a), stroke: '#111', 'stroke-width': 2 });
      text(cx + 66 * Math.cos(a), cy + 66 * Math.sin(a), s, { size: 18 });
    });
    knob(k + 'morph', cx, cy, { r: 38, color: 'green', def: 0.4, steps: 6, tipText: 'Waveform: sine, triangle, saw, square, saw-to-inverted-saw, sine-to-triangle (pw morphs the last two)' });
    el('path', { d: `M${541 + dx},686 Q${480 + dx},675 ${440 + dx},652`, fill: 'none', stroke: '#d5281f', 'stroke-width': 2 });
    if (A) {
      jack(k + 'voct', 378 + dx, 697, 'in', { name: '1v/oct', normal: 'the touch keyboard' }); text(380 + dx, 723, '1v/oct', { size: 16 });
      jack(k + 'cv', 472 + dx, 697, 'in', { name: 'cv' }); text(472 + dx, 723, 'cv', { size: 16 });
      jack(k + 'pwm', 542 + dx, 697, 'in', { name: 'pwm', normal: 'LFO A' }); text(542 + dx, 723, 'pwm', { size: 16 });
      jack('vcoa.sync', 637 + dx, 697, 'in', { name: 'sync (hard sync: restarts the wave on each rise)' }); text(637 + dx, 723, 'sync', { size: 16 });
    } else {
      jack(k + 'voct', 378 + dx, 697, 'in', { name: '1v/oct', normal: 'the touch keyboard' }); text(380 + dx, 723, '1v/oct', { size: 16 });
      jack(k + 'cv', 472 + dx, 697, 'in', { name: 'cv', normal: 'VCO A (through cv amt)' }); text(472 + dx, 723, 'cv', { size: 16 });
      jack(k + 'pwm', 542 + dx, 697, 'in', { name: 'pwm', normal: 'LFO B' }); text(542 + dx, 723, 'pwm', { size: 16 });
      jack('vcob.osc', 637 + dx, 697, 'out', { name: 'osc (VCO B straight out, before its VCA)' }); text(637 + dx, 723, 'osc', { size: 16, fill: '#d5281f' });
    }
  }

  function drawEnvelope(x, x0) {
    const k = `env${x}.`, A = x === 'a';
    el('path', { d: A ? `M675,597 H945 Q955,597 955,607 V732` : `M1327,597 H1053 Q1043,597 1043,607 V732`, fill: 'none', stroke: '#111', 'stroke-width': 3 });
    text(x0 + 30, 607, 'hold', { size: 15 });
    button(k + 'hold', x0 + 62, 617, 15, 'latch', { tipText: 'hold: keeps the envelope open, as if a key were held' });
    text(x0 + 95, 607, '⋀⋀', { size: 16 });
    button(k + 'loop', x0 + 128, 617, 15, 'latch', { tipText: 'Loop: the envelope repeats by itself like an LFO (self-generation). Off: it follows the gate (attack, decay, sustain, release).' });
    text(x0 + 160, 607, '⋀‾\\', { size: 14 });
    text(x0 + 220, 606, `envelope ${x.toUpperCase()}`, { size: 16 });
    led(k + 'led', x0 + 193, 620, '#f5b400', 8);
    ['a', 'd', 's', 'r'].forEach((p, i) => knob(k + p, x0 + 30 + i * 65.5, 656, { r: 25, color: 'green', arc: true, def: [0.15, 0.4, 0.6, 0.45][i], label: p.toUpperCase(), ly: 690, tipText: ['A: attack time', 'D: decay time', 'S: sustain level', 'R: release time'][i] }));
    if (A) {
      jack('enva.gate', 737, 708, 'in', { name: 'gate', normal: 'the touch keyboard' }); text(706, 722, 'gate', { size: 14 });
      jack('enva.out', 803, 708, 'out', { name: 'env (envelope A)' }); text(778, 722, 'env', { size: 14, fill: '#d5281f' });
      jack('enva.vca', 868, 708, 'in', { name: 'vca cv (opens VCO A\'s VCA)', normal: 'envelope A' }); text(860, 726, 'vca cv', { size: 12 });
      jack('vcoa.out', 934, 708, 'out', { name: 'VCO A (after its VCA)' }); text(918, 728, 'VCO A', { size: 12, fill: '#d5281f' });
    } else {
      jack('vcob.out', 1065, 708, 'out', { name: 'VCO B (after its VCA)' }); text(1040, 723, 'VCO B', { size: 13, fill: '#d5281f' });
      jack('envb.gate', 1131, 708, 'in', { name: 'gate', normal: 'the touch keyboard' }); text(1110, 722, 'gate', { size: 14 });
      jack('envb.out', 1196, 708, 'out', { name: 'env (envelope B)' }); text(1172, 722, 'env', { size: 14, fill: '#d5281f' });
      jack('envb.vca', 1262, 708, 'in', { name: 'vca cv (opens VCO B\'s VCA)', normal: 'envelope B' }); text(1266, 723, 'vca cv', { size: 13 });
    }
  }

  function drawEffectorAndFilters() {
    box(675, 152, 652, 290);
    tag(935, 150, 130, 'DUAL EFFECTOR', { h: 20, size: 14, rx: 4 });
    ['x', 'y', 'z'].forEach((a, i) => {
      const x = 705 + i * 98;
      text(x, 207, `▸ cv ${a}`, { size: 15 });
      jack(`fx.cv${a}`, x, 232, 'in', { arrow: false, name: `cv ${a} (−10 to +10 V moves ${a.toUpperCase()})` });
      knob(`fx.${a}`, x, 297, { r: 24, color: 'orange', ticks: true, def: 0.5, label: a.toUpperCase(), ly: 335, size: 18, tipText: `${a.toUpperCase()}: the effect's ${['first', 'second', 'third'][i]} setting (its name is on the cartridge)` });
    });
    // the cartridge slot
    el('rect', { x: 938, y: 175, width: 124, height: 192, rx: 10, fill: '#fff', stroke: '#111', 'stroke-width': 3 });
    text(1000, 188, 'cartridge slot', { size: 15 });
    const slot = el('g', { class: 'btn' });
    el('rect', { x: 950, y: 199, width: 100, height: 42, fill: '#111' }, slot);
    el('rect', { x: 956, y: 212, width: 88, height: 16, fill: '#a07a2c' }, slot);
    const cartName = text(1000, 220, '', { size: 11, fill: '#111', parent: slot });
    tip(slot, 'The cartridge: click for the next one, right-click for the one before (CATHEDRAL, VIBROTREM, MAGIC, FILTER, TIME, VIBE)');
    defaults['fx.cart'] = 0;
    controls['fx.cart'] = { draw: v => { cartName.textContent = CARTRIDGES[v | 0].name; updateProgramNames(); } };
    slot.addEventListener('click', () => setValue('fx.cart', ((values['fx.cart'] | 0) + 1) % 6));
    slot.addEventListener('contextmenu', e => { e.preventDefault(); setValue('fx.cart', ((values['fx.cart'] | 0) + 5) % 6); });
    text(951, 252, '1', { size: 11 }); text(943, 270, '2', { size: 11 }); text(951, 288, '3', { size: 11 });
    text(1049, 252, '1', { size: 11 }); text(1057, 270, '2', { size: 11 }); text(1049, 288, '3', { size: 11 });
    toggle('fx.progL', 965, 270, 3, { color: 'orange', def: 1, tipText: 'Program for the left channel: 1, 2 or 3' });
    toggle('fx.progR', 1035, 270, 3, { color: 'orange', def: 0.5, tipText: 'Program for the right channel: 1, 2 or 3' });
    button('fx.chan', 1000, 268, 14, 'latch', { fill: COLORS.orange, onFill: '#b55c18', tipText: 'channel: off, each channel takes its own side; on, both take the two sides mixed (mono in)' });
    text(1000, 290, 'channel', { size: 12 });
    progLabel = text(1000, 302, '', { size: 9, fill: '#555' });
    button('fx.resetL', 963, 308, 9, 'momentary', { tipText: 'reset: clears the left channel\'s echoes and reverb' });
    button('fx.resetR', 1035, 308, 9, 'momentary', { tipText: 'reset: clears the right channel\'s echoes and reverb' });
    text(1000, 309, '◂ reset ▸', { size: 11 });
    text(963, 328, 'L', { size: 15 }); text(1035, 328, 'R', { size: 15 });
    button('fx.bypassL', 963, 350, 15, 'latch', { tipText: 'bypass L: the left channel without the effect' });
    button('fx.bypassR', 1035, 350, 15, 'latch', { tipText: 'bypass R: the right channel without the effect' });
    text(1000, 351, 'bypass', { size: 12 });
    text(1097, 228, 'BLEND', { size: 16 });
    knob('fx.blend', 1097, 297, { r: 24, color: 'orange', ticks: true, def: 0.35, tipText: 'BLEND: how much of the effect is heard' });
    text(1193, 226, 'MASTER', { size: 16 }); text(1193, 242, 'VOLUME', { size: 16 });
    knob('fx.master', 1195, 299, { r: 33, color: 'orange', ticks: true, def: 0.55, tipText: 'MASTER VOLUME' });
    text(1294, 194, '🎧', { size: 26 });
    jack('phones', 1294, 232, 'out', { arrow: false, name: 'headphones (the computer\'s sound output)' });
    jacks.phones.kind = 'none';
    el('line', { x1: 1294, y1: 249, x2: 1294, y2: 272, stroke: '#111', 'stroke-width': 3 });
    knob('fx.phones', 1294, 297, { r: 24, color: 'orange', ticks: true, def: 0.8, tipText: 'Headphone level' });
    // Filters
    el('line', { x1: 675, y1: 351, x2: 935, y2: 351, stroke: '#111', 'stroke-width': 1.5, 'stroke-dasharray': '2 4' });
    el('rect', { x: 675, y: 351, width: 20, height: 91, fill: '#111' }); text(685, 397, 'FILTER L', { fill: '#fff', size: 13, rotate: -90 });
    el('rect', { x: 1307, y: 351, width: 20, height: 91, fill: '#111' }); text(1317, 397, 'FILTER R', { fill: '#fff', size: 13, rotate: -90 });
    for (const [side, fx, bx, rx] of [['L', 736, 786, 835], ['R', 1163, 1213, 1262]]) {
      text(bx - 30, 361, 'BP ⌒', { size: 11 }); text(bx + 32, 361, '⌐ LP', { size: 11 });
      knob('flt.freq' + side, fx, 401, { r: 26, color: 'orange', arc: true, def: 0.75, label: 'FREQ', ly: 436, tipText: `FREQ: filter ${side}'s cutoff` });
      button('flt.mode' + side, bx, 377, 14, 'latch', { fill: COLORS.orange, onFill: '#b55c18', tipText: `BP / LP: filter ${side} as band pass (lit) or low pass` });
      knob('flt.res' + side, rx, 401, { r: 26, color: 'orange', arc: true, def: 0.2, label: 'RES', ly: 436, tipText: `RES: filter ${side}'s resonance (it sings near the top, and keeps its low end)` });
    }
    jack('flt.cv', 882, 401, 'in', { arrow: false, name: 'filter CV (moves filter L, and R too with link on)' });
    el('path', { d: 'M876,424 L888,424 L882,417 Z', fill: '#111' }); text(882, 436, 'CV', { size: 16 });
    knob('flt.mod', 930, 401, { r: 24, color: 'orange', def: 0.5, label: 'MOD', ly: 436, tipText: 'MOD: how much the filter CV input moves the cutoff' });
    knob('flt.dist', 998, 401, { r: 24, color: 'orange', ticks: true, def: 0, label: 'DIST', ly: 436, tipText: 'DIST: clean or distorted (stereo distortion after the filters)' });
    knob('flt.gain', 1068, 401, { r: 24, color: 'orange', ticks: true, def: 0.3, label: 'GAIN', ly: 436, tipText: 'GAIN: how hard it distorts' });
    button('flt.link', 1116, 401, 13, 'latch', { tipText: 'link: filter L\'s CV moves filter R too' });
    text(1116, 436, 'link', { size: 15 });
  }

  function drawMixer() {
    box(672, 447, 655, 146);
    const names = ['DRONE 1', 'DRONE 2', 'DRONE 3', 'EXT.AUDIO', 'VCO A', 'VCO B', 'PREAMP', 'DRONE 4', 'DRONE 5', 'DRONE 6'];
    const pans = [0.3, 0.4, 0.5, 0.5, 0.45, 0.55, 0.5, 0.6, 0.7, 0.5];
    names.forEach((nm, i) => {
      const x = 703 + i * 65.8;
      if (i) el('line', { x1: x - 33, y1: 450, x2: x - 33, y2: 510, stroke: '#111', 'stroke-width': 1.5, 'stroke-dasharray': '2 4' });
      text(x - 8, 456, 'PAN', { size: 11 }); el('circle', { cx: x + 12, cy: 455, r: 2.5, fill: '#111' });
      text(x - 27, 497, 'L', { size: 10 }); text(x + 27, 497, 'R', { size: 10 });
      knob('mix.pan' + i, x, 484, { r: 24, color: 'grey', def: pans[i], tipText: `PAN: ${nm} left or right` });
      el('rect', { x: x - 32, y: 509, width: 64, height: 16, fill: '#111' });
      text(x, 518, nm, { fill: '#fff', size: nm.length > 8 ? 10 : 11.5 });
      text(x, 532, 'VOL', { size: 11 });
      knob('mix.vol' + i, x, 563, { r: 26, color: 'black', arc: true, def: i === 3 || i === 6 ? 0 : 0.6, tipText: `VOL: ${nm}'s level` });
    });
    text(997, 603, 'VOICE', { size: 16 }); text(997, 619, 'MIXER', { size: 16 });
  }

  function drawBottomRow() {
    // LFO A and B
    for (const [x, dx] of [['a', 0], ['b', 1739]]) {
      const X = x.toUpperCase();
      box(18 + dx, 740, 226, 118, { rx: 10 });
      knob(`lfo${x}.wave`, 55 + dx, 778, { r: 27, color: 'red', def: x === 'a' ? 0 : 0.5, tipText: 'wave: triangle (left), square (right), a mix in between' });
      text(36 + dx, 812, '^', { size: 16 }); text(55 + dx, 823, 'wave', { size: 15 }); text(76 + dx, 812, '⊓', { size: 13 });
      jack(`lfo${x}.out`, 128 + dx, 777, 'out', { arrow: false, name: `LFO ${X} out (0 to 5 V)` });
      el('path', { d: `M${122 + dx},755 L${134 + dx},755 L${128 + dx},748 Z`, fill: '#d5281f' });
      led(`lfo${x}led`, 128 + dx, 813, '#2a8cff', 7);
      knob(`lfo${x}.rate`, 204 + dx, 778, { r: 27, color: 'red', def: x === 'a' ? 0.4 : 0.3, label: 'rate', ly: 823, tipText: x === 'a' ? 'rate: LFO A is the slow one' : 'rate: LFO B is the fast one' });
      tag(18 + dx, 838, 226, `LFO ${X}`, { h: 20, size: 15 });
    }
    // Joystick offsets and outputs
    box(250, 740, 248, 118, { rx: 10 });
    knob('joy.offx', 293, 778, { r: 27, color: 'red', def: 0.5, label: 'X', ly: 823, tipText: 'offset X: shifts the joystick\'s X voltage' });
    knob('joy.offy', 460, 778, { r: 27, color: 'red', def: 0.5, label: 'Y', ly: 823, tipText: 'offset Y: shifts the joystick\'s Y voltage' });
    jack('joy.x', 372, 757, 'out', { arrow: false, name: 'joystick X (−10 to +10 V)' });
    jack('joy.y', 372, 797, 'out', { arrow: false, name: 'joystick Y (−10 to +10 V)' });
    led('joyxled', 335, 778, '#ff2a1a', 7); led('joyyled', 410, 778, '#ff2a1a', 7);
    el('path', { d: 'M305,812 Q330,800 350,762', fill: 'none', stroke: '#d5281f', 'stroke-width': 1.8 });
    el('path', { d: 'M385,810 Q420,830 445,812', fill: 'none', stroke: '#d5281f', 'stroke-width': 1.8 });
    tag(250, 838, 248, 'JOYSTICK', { h: 20, size: 15 });
    // 5-step sequencer
    box(503, 740, 783, 118, { rx: 10 });
    knob('seq.pulser', 540, 778, { r: 27, color: 'red', def: 0.4, label: 'pulser', ly: 823, tipText: 'pulser: the sequencer\'s own clock speed' });
    jack('seq.pulse', 615, 757, 'out', { arrow: false, name: 'pulser out (the clock)' });
    jack('seq.clock', 615, 797, 'in', { arrow: false, name: 'clock in (an outside clock steps the sequencer instead)', normal: 'the pulser' });
    text(615, 823, 'clock', { size: 15 });
    text(672, 754, '4', { size: 12 }); text(688, 777, '5', { size: 12 }); text(672, 800, '3', { size: 12 });
    toggle('seq.stages', 672, 778, 3, { color: 'red', def: 1, tipText: 'stages: 3, 4 or 5 steps' });
    text(672, 815, 'stages', { size: 15 });
    for (let i = 1; i <= 5; i++) {
      const x = 730 + (i - 1) * 98.8;
      knob('seq.step' + i, x, 778, { r: 27, color: 'red', def: [0.2, 0.45, 0.65, 0.3, 0.8][i - 1], label: 'step ' + i, ly: 815, tipText: `step ${i}: this step's voltage (0 to 5 V)` });
      led('step' + i, x + 50, 757, '#ff2a1a', 6);
      toggle('seq.gate' + i, x + 50, 785, 2, { color: 'red', def: 1, tipText: `gate ${i}: whether step ${i} sends a gate` });
      text(x + 50, 812, 'gate', { size: 10 });
    }
    text(1222, 744, 'cv', { size: 11, fill: '#d5281f' });
    jack('seq.cv', 1238, 757, 'out', { arrow: false, name: 'sequencer cv' });
    jack('seq.gate', 1238, 797, 'out', { arrow: false, name: 'sequencer gate' });
    text(1209, 812, 'gate', { size: 14, fill: '#d5281f' });
    tag(503, 838, 783, '', { h: 20 });
    text(595, 848, '5 STEP SEQ.  VOLTAGE', { fill: '#fff', size: 15 });
    for (let x = 700; x < 1280; x += 6) el('rect', { x, y: 841, width: 3, height: 14, fill: '#fff' });
    // Preamp (contact mic)
    box(1291, 740, 143, 118, { rx: 10 });
    jack('pre.ext', 1312, 777, 'in', { arrow: false, name: 'ext. source (audio in to the preamp)', normal: 'the contact mic (your computer\'s microphone)' });
    text(1312, 812, 'ext.', { size: 14 }); text(1312, 826, 'source', { size: 14 });
    knob('pre.gain', 1370, 778, { r: 27, color: 'red', def: 0.5, label: 'gain', ly: 815, tipText: 'gain: the preamp\'s level' });
    led('preled', 1420, 777, '#2a8cff', 7);
    const mic = el('g', { class: 'btn' });
    el('rect', { x: 1404, y: 795, width: 32, height: 38, fill: 'transparent' }, mic);
    text(1420, 816, '🎤', { size: 20, parent: mic });
    tip(mic, 'Contact mic: click to turn your computer\'s microphone on or off (it plays through the PREAMP channel and drives the envelope follower)');
    defaults['pre.mic'] = 0;
    controls['pre.mic'] = { draw: v => mic.setAttribute('opacity', v > 0.5 ? 1 : 0.45) };
    mic.addEventListener('click', () => { const on = !(values['pre.mic'] > 0.5); setValue('pre.mic', on ? 1 : 0); onMic(on); });
    tag(1291, 838, 143, 'PREAMP', { h: 20, size: 15 });
    // Envelope follower
    box(1440, 740, 311, 118, { rx: 10 });
    knob('ef.att', 1470, 778, { r: 27, color: 'red', def: 0.3, label: 'attack', ly: 823, tipText: 'attack: how fast the follower rises with the sound' });
    text(1519, 818, '〰', { size: 18 });
    knob('ef.rls', 1568, 778, { r: 27, color: 'red', def: 0.4, label: 'release', ly: 823, tipText: 'release: how fast it falls back' });
    led('efled', 1625, 777, '#ff2a1a', 7);
    jack('ef.env', 1655, 777, 'out', { arrow: false, name: 'env (how loud the preamp\'s sound is)' });
    el('path', { d: 'M1649,755 L1661,755 L1655,748 Z', fill: '#d5281f' });
    text(1655, 823, 'env', { size: 15, fill: '#d5281f' });
    led('efgateled', 1686, 777, '#2fbf3a', 7);
    jack('ef.gate', 1717, 777, 'out', { arrow: false, name: 'gate (on while there\'s sound)' });
    el('path', { d: 'M1711,755 L1723,755 L1717,748 Z', fill: '#d5281f' });
    text(1717, 823, 'gate', { size: 15, fill: '#d5281f' });
    tag(1440, 838, 311, 'ENVELOPE FOLLOWER', { h: 20, size: 15 });
  }

  // ---- The touch keyboard, the drone pads and the joystick ----
  const PLATES = [[383, 995, 1220], [482, 965, 1170], [580, 935, 1123], [680, 965, 1170], [777, 995, 1220], [877, 1025, 1245],
    [1123, 1025, 1245], [1220, 995, 1220], [1318, 965, 1170], [1417, 935, 1123], [1515, 965, 1170], [1613, 995, 1220]];
  let plateEls = [], display;
  function drawKeyboard() {
    text(333, 899, 'TOUCH SENSITIVE CONTROLLER', { size: 20, anchor: 'start', weight: 600 });
    text(1668, 899, 'SOLAR 42', { size: 20, anchor: 'end', weight: 600 });
    el('rect', { x: 333, y: 918, width: 1335, height: 325, fill: '#0c0c0c' });
    // the fine grid on the keyboard's black face
    const grid = el('g', { opacity: 0.18, 'pointer-events': 'none' });
    for (let x = 333; x < 1668; x += 10) el('line', { x1: x, y1: 918, x2: x, y2: 1243, stroke: '#fff', 'stroke-width': 0.6 }, grid);
    for (let y = 918; y < 1243; y += 10) el('line', { x1: 333, y1: y, x2: 1668, y2: y, stroke: '#fff', 'stroke-width': 0.6 }, grid);
    const NOTES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
    PLATES.forEach(([x, y0, y1], i) => {
      const g = el('g', { class: 'plate', 'data-n': i });
      const r = el('rect', { x: x - 35, y: y0, width: 70, height: y1 - y0, fill: '#0c0c0c', stroke: '#fff', 'stroke-width': 4 }, g);
      for (let y = y0 + 10; y < y1 - 6; y += 13) el('rect', { x: x - 28, y, width: 56, height: 6, rx: 3, fill: '#fff' }, g);
      tip(g, `Touch plate ${i + 1} (${NOTES[i]}). Press higher up the plate for more pressure. Computer keys: A W S E D F T G Y H U J.`);
      plateEls.push(r);
    });
    el('path', { d: 'M580,1150 L620,1220 L540,1220 Z', fill: 'none', stroke: '#fff', 'stroke-width': 6 });
    el('path', { d: 'M1417,1150 L1457,1220 L1377,1220 Z', fill: 'none', stroke: '#fff', 'stroke-width': 6 });
    // jacks on the keyboard
    jack('kbd.clk', 744, 945, 'in', { arrow: false, name: 'clock in (for the keyboard\'s arpeggiator and sequencer)' }); text(769, 955, '◷', { size: 14, fill: '#fff' });
    jack('kbd.trig', 795, 962, 'out', { arrow: false, name: 'trigger (a short pulse at each new note)' }); text(820, 972, 'ϟ', { size: 14, fill: '#fff' });
    jack('kbd.gate', 845, 972, 'out', { arrow: false, name: 'gate (while a plate is held)' }); text(868, 985, '⊓', { size: 13, fill: '#fff' });
    jack('kbd.gate2', 1153, 972, 'out', { arrow: false, name: 'gate (while a plate is held)' }); text(1128, 985, '⊓', { size: 13, fill: '#fff' });
    jack('kbd.press', 1205, 962, 'out', { arrow: false, name: 'pressure (how hard / how high up the plate you press)' }); text(1180, 972, '↓', { size: 14, fill: '#fff' });
    jack('kbd.voct', 1256, 945, 'out', { arrow: false, name: 'volt per octave (the note played)' }); text(1231, 955, '↩', { size: 14, fill: '#fff' });
    // octave buttons, the encoder and the display
    const octBtn = (x, d, sym) => {
      text(x, 960, sym, { size: 14, fill: '#fff' });
      const g = el('g', { class: 'btn' });
      el('circle', { cx: x, cy: 990, r: 21, fill: '#d04a3d' }, g);
      tip(g, d < 0 ? 'Octave down' : 'Octave up');
      g.addEventListener('click', () => setValue('kbd.oct', clamp((values['kbd.oct'] ?? 1) + d, -2, 5)));
    };
    octBtn(910, -1, '▽'); octBtn(1088, 1, '△');
    el('circle', { cx: 998, cy: 990, r: 36, fill: 'none', stroke: '#fff', 'stroke-width': 4 });
    knob('kbd.enc', 998, 990, { r: 28, color: 'red', def: 0.5, steps: 25, tipText: 'Encoder: transposes the keyboard by semitones (up to an octave either way); double-click for none' });
    el('rect', { x: 955, y: 1037, width: 90, height: 28, fill: '#4250d6' });
    display = text(1000, 1052, '', { size: 14, fill: '#fff', weight: 600, attrs: { 'font-family': 'Consolas, monospace' } });
    defaults['kbd.oct'] = 1;
    controls['kbd.oct'] = { draw: () => showDisplay() };
    // the sun
    const sun = el('g', { 'pointer-events': 'none' });
    for (let i = 0; i < 28; i++) {
      const a = i / 28 * Math.PI * 2, r1 = 50, r2 = 62 + (i % 3) * 9 + (i % 2) * 5;
      el('path', { d: `M${998 + r1 * Math.cos(a - 0.09)},${1160 + r1 * Math.sin(a - 0.09)} L${998 + r2 * Math.cos(a)},${1160 + r2 * Math.sin(a)} L${998 + r1 * Math.cos(a + 0.09)},${1160 + r1 * Math.sin(a + 0.09)} Z`, fill: '#fff' }, sun);
    }
    el('circle', { cx: 998, cy: 1160, r: 52, fill: '#fff' }, sun);
    for (let r = 46; r > 4; r -= 6) el('circle', { cx: 998 + (46 - r) * 0.08, cy: 1160, r, fill: 'none', stroke: '#111', 'stroke-width': 2 }, sun);

    const encDraw = controls['kbd.enc'].draw;
    controls['kbd.enc'].draw = v => { encDraw(v); showDisplay(); };

    // Playing the plates: with the mouse, or with several fingers on a touch screen (each finger is followed on its
    // own; the newest one plays, like the real keyboard). Higher up a plate, or a harder Apple Pencil press, is more pressure.
    defaults['kbd.note'] = -1; defaults['kbd.press'] = 0;
    const plateAt = e => {
      const p = toSvg(e);
      return PLATES.findIndex(([x, y0, y1]) => Math.abs(p.x - x) <= 38 && p.y >= y0 && p.y <= y1);
    };
    const press = (e, i) => {
      const [, y0, y1] = PLATES[i];
      const p = toSvg(e);
      const height = clamp(1 - (p.y - y0) / (y1 - y0), 0, 1);
      setValue('kbd.press', e.pointerType === 'pen' && e.pressure > 0 ? e.pressure : height);
    };
    svg.addEventListener('pointerdown', e => {
      const i = plateAt(e);
      if (i < 0) return;
      e.preventDefault();
      fingers.delete(e.pointerId); fingers.set(e.pointerId, i);
      press(e, i); updatePlates();
    });
    svg.addEventListener('pointermove', e => {
      if (!fingers.has(e.pointerId)) return;
      const i = plateAt(e);
      if (i >= 0) {
        if (i !== fingers.get(e.pointerId)) { fingers.delete(e.pointerId); fingers.set(e.pointerId, i); }
        press(e, i); updatePlates();
      }
    });
    const lift = e => { if (fingers.delete(e.pointerId)) updatePlates(); };
    window.addEventListener('pointerup', lift);
    window.addEventListener('pointercancel', lift);
  }
  function showDisplay() {
    const o = values['kbd.oct'] ?? 1, t = Math.round(((values['kbd.enc'] ?? 0.5) - 0.5) * 24);
    display.textContent = `OCT ${o >= 0 ? '+' : ''}${o}${t ? `  ${t > 0 ? '+' : ''}${t}` : ''}`;
  }
  const fingers = new Map();             // finger (pointer) -> the plate it's on
  function updatePlates() {
    const notes = [...fingers.values()].concat([...keysHeld]);
    plateEls.forEach((r, i) => r.setAttribute('fill', notes.includes(i) ? '#555' : '#0c0c0c'));
    const last = notes.length ? notes[notes.length - 1] : -1;
    setValue('kbd.note', last);
  }

  function drawPads() {
    text(1846, 899, 'DRONE VOICES', { size: 19, weight: 600 });
    [[1, 1805, 970], [4, 1885, 970], [2, 1805, 1080], [5, 1885, 1080], [3, 1805, 1188], [6, 1885, 1188]].forEach(([n, x, y]) => {
      text(x, y - 46, String(n), { size: 17 });
      const g = el('g', { class: 'btn' });
      el('rect', { x: x - 36, y: y - 36, width: 72, height: 72, rx: 4, fill: '#2e2e2e' }, g);
      const top = el('rect', { x: x - 33, y: y - 33, width: 62, height: 62, rx: 4, fill: '#1a1a1a' }, g);
      el('rect', { x: x - 4, y: y - 36, width: 8, height: 10, fill: '#aaa' }, g);
      tip(g, `Drone voice ${n}: plays while held (or press ${n} on the computer keyboard; HOLD on the voice keeps it on)`);
      const id = `d${n}.pad`;
      defaults[id] = 0;
      controls[id] = { draw: v => top.setAttribute('fill', v > 0.5 ? '#4a4a4a' : '#1a1a1a') };
      g.addEventListener('pointerdown', e => { g.setPointerCapture(e.pointerId); setValue(id, 1); });
      g.addEventListener('pointerup', () => setValue(id, 0));
      g.addEventListener('pointercancel', () => setValue(id, 0));
    });
  }

  function drawJoystick() {
    // the little figure that holds the joystick
    el('path', { d: 'M150,905 C95,905 70,960 75,1010 C80,1060 60,1110 70,1180 C78,1240 110,1265 150,1265 C190,1265 222,1240 230,1180 C240,1110 220,1060 225,1010 C230,960 205,905 150,905 Z', fill: 'none', stroke: '#111', 'stroke-width': 4 });
    el('path', { d: 'M150,925 C110,925 95,965 100,1000 C105,1040 90,1090 98,1160 C105,1215 125,1245 150,1245 C175,1245 195,1215 202,1160 C210,1090 195,1040 200,1000 C205,965 190,925 150,925 Z', fill: 'none', stroke: '#111', 'stroke-width': 3 });
    el('ellipse', { cx: 150, cy: 975, rx: 22, ry: 26, fill: 'none', stroke: '#111', 'stroke-width': 3 });
    el('circle', { cx: 142, cy: 970, r: 4, fill: '#111' }); el('circle', { cx: 158, cy: 970, r: 4, fill: '#111' });
    for (const x of [135, 150, 165]) el('path', { d: `M${x},890 L${x},915 M${x - 4},909 L${x},917 L${x + 4},909`, fill: 'none', stroke: '#111', 'stroke-width': 2 });
    el('circle', { cx: 150, cy: 1080, r: 48, fill: '#1c1c1c' });
    const knobG = el('g', { class: 'joy' });
    const cap = el('circle', { cx: 150, cy: 1080, r: 24, fill: '#444', stroke: '#111', 'stroke-width': 3 }, knobG);
    tip(knobG, 'Joystick: drag it; it stays where you leave it (position locking). Double-click to center it. Outputs X and Y in the JOYSTICK section.');
    defaults['joy.x'] = 0; defaults['joy.y'] = 0;
    const place = () => { cap.setAttribute('cx', 150 + (values['joy.x'] || 0) * 30); cap.setAttribute('cy', 1080 - (values['joy.y'] || 0) * 30); };
    controls['joy.x'] = { draw: place }; controls['joy.y'] = { draw: place };
    knobG.addEventListener('pointerdown', e => {
      knobG.setPointerCapture(e.pointerId);
      const mv = ev => {
        const p = toSvg(ev);
        let dx = (p.x - 150) / 30, dy = (1080 - p.y) / 30;
        const m = Math.hypot(dx, dy); if (m > 1) { dx /= m; dy /= m; }
        setValue('joy.x', dx); setValue('joy.y', dy);
      };
      const up = () => { knobG.removeEventListener('pointermove', mv); knobG.removeEventListener('pointerup', up); };
      knobG.addEventListener('pointermove', mv); knobG.addEventListener('pointerup', up);
    });
    knobG.addEventListener('dblclick', () => { setValue('joy.x', 0); setValue('joy.y', 0); });
  }

  function drawHeader() {
    text(70, 37, 'EXT.', { size: 14 }); text(70, 51, 'AUDIO', { size: 14 });
    jack('ext.audio', 70, 77, 'in', { arrow: false, name: 'EXT. AUDIO in (plays through the EXT.AUDIO mixer channel)' });
    text(140, 36, 'R', { size: 14 }); text(228, 36, 'L', { size: 14 });
    el('path', { d: 'M128,44 Q128,52 136,52 H150 M206,52 H220 Q228,52 228,44', fill: 'none', stroke: '#111', 'stroke-width': 1.5 });
    text(178, 54, 'WET OUT', { size: 14 });
    text(1880, 37, 'POWER 12V DC 2A', { size: 13 });
    el('text', { x: 45, y: 198, 'font-size': 118, 'font-weight': 900, 'font-family': '"Arial Black", "Segoe UI Black", sans-serif', fill: '#111', textLength: 400, lengthAdjust: 'spacingAndGlyphs' }).textContent = 'SOLAR';
    el('text', { x: 468, y: 198, 'font-size': 118, 'font-weight': 900, 'font-family': '"Arial Black", "Segoe UI Black", sans-serif', fill: '#d5281f', textLength: 140, lengthAdjust: 'spacingAndGlyphs' }).textContent = '42';
    el('text', { x: 612, y: 146, 'font-size': 46, 'font-weight': 900, 'font-family': '"Arial Black", sans-serif', fill: '#111' }).textContent = 'F';
    // (Elta Music's logo sits here on the real panel. This is an unofficial tribute, so it says so instead.)
    text(1000, 100, "DYLAN'S", { size: 40, weight: 900, attrs: { 'font-family': '"Arial Black", sans-serif' } });
    text(1000, 132, 'an unofficial tribute to the Elta Music SOLAR 42F', { size: 11, weight: 600, fill: '#666' });
    text(1660, 127, 'DRØNE', { size: 46, weight: 500, attrs: { 'letter-spacing': 12 } });
    text(1660, 183, 'ĀMBIĒNT MĀCHINĒ', { size: 46, weight: 500, attrs: { 'letter-spacing': 10 } });
  }

  // Each cartridge's programs and what X, Y and Z do in them (from the 42F manual).
  const CARTRIDGES = [
    { name: 'CATHEDRAL', progs: [['Shimmer', 'Octave up', 'Octave down', 'Decay'], ['Oct up delay', 'Feedback', 'Delay', 'Reverb'], ['Space reverb', 'Feedback', 'Delay', 'Reverb']] },
    { name: 'VIBROTREM', progs: [['Tremolo', 'Depth', 'Rate', 'Reverb'], ['Vibrato', 'Depth', 'Rate', 'Reverb'], ['Chorus', 'Depth', 'Rate', 'Reverb']] },
    { name: 'MAGIC', progs: [['Pitch delay', 'Feedback', 'Delay', 'Pitch'], ['Reverse pitch delay', 'Feedback', 'Delay', 'Pitch'], ['Bell pitch delay', 'Feedback', 'Delay', 'Pitch']] },
    { name: 'FILTER', progs: [['Auto wah', 'Filter amount', 'Envelope', 'Reverb'], ['HP/LP filter', 'HP cutoff', 'LP cutoff', 'Resonance'], ['Notch filter', 'Cut 1', 'Cut 2', 'Resonance']] },
    { name: 'TIME', progs: [['Delay reverb', 'Feedback', 'Delay', 'Reverb'], ['Delay chorus', 'Feedback', 'Delay', 'Mod depth'], ['Delay vibrato', 'Feedback', 'Delay / rate', 'Mod depth']] },
    { name: 'VIBE', progs: [['Phaser', 'Depth', 'Rate', 'Reverb'], ['Flanger', 'Depth', 'Rate', 'Reverb'], ['Resonance flanger', 'Resonance', 'Rate', 'Mod depth']] },
  ];
  let progLabel;
  // The program switches show 1 at the top: value 1 = program 1, 0.5 = program 2, 0 = program 3.
  const progOf = v => (v > 0.75 ? 0 : v > 0.25 ? 1 : 2);
  function updateProgramNames() {
    if (!progLabel) return;
    const c = CARTRIDGES[values['fx.cart'] | 0];
    const l = c.progs[progOf(values['fx.progL'] ?? 1)], r = c.progs[progOf(values['fx.progR'] ?? 0.5)];
    progLabel.textContent = '';
    hint.textContent = `${c.name}   L: ${l[0]} (X ${l[1]}, Y ${l[2]}, Z ${l[3]})   R: ${r[0]} (X ${r[1]}, Y ${r[2]}, Z ${r[3]})`;
  }
  let hint;

  // ---- Computer keyboard ----
  const KEYS = 'awsedftgyhuj';
  const keysHeld = new Set();
  function keyboardInput() {
    window.addEventListener('keydown', e => {
      if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
      const k = e.key.toLowerCase();
      const i = KEYS.indexOf(k);
      if (i >= 0) { keysHeld.delete(i); keysHeld.add(i); setValue('kbd.press', 0.7); updatePlates(); }
      else if ('123456'.includes(k) && k) setValue(`d${k}.pad`, 1);
      else if (k === 'z' || k === '[') setValue('kbd.oct', clamp((values['kbd.oct'] ?? 1) - 1, -2, 5));
      else if (k === 'x' || k === ']') setValue('kbd.oct', clamp((values['kbd.oct'] ?? 1) + 1, -2, 5));
    });
    window.addEventListener('keyup', e => {
      const k = e.key.toLowerCase();
      const i = KEYS.indexOf(k);
      if (i >= 0) { keysHeld.delete(i); updatePlates(); }
      else if ('123456'.includes(k) && k) setValue(`d${k}.pad`, 0);
    });
    window.addEventListener('blur', () => { keysHeld.clear(); updatePlates(); for (let n = 1; n <= 6; n++) setValue(`d${n}.pad`, 0); });
  }

  // ---- Lights from the engine ----
  function showLeds(L) {
    const set = (id, v) => leds[id] && leds[id].setAttribute('opacity', 0.15 + 0.85 * clamp(v, 0, 1));
    set('lfoaled', L.lfoa); set('lfobled', L.lfob); set('joyxled', L.joyx); set('joyyled', L.joyy);
    for (let i = 1; i <= 5; i++) set('step' + i, L.step === i - 1 ? 1 : 0);
    for (const n of [1, 2, 3, 4, 5, 6]) set(`d${n}.holdled`, L['d' + n]);
    set('d3.shled', L.sh3); set('d6.shled', L.sh6);
    set('enva.led', L.enva); set('envb.led', L.envb);
    set('preled', L.pre); set('efled', L.efenv); set('efgateled', L.efgate);
  }
  function showOscStatus() {
    for (const n of [1, 2, 4, 5]) for (let i = 1; i <= 5; i++) {
      const l = leds[`d${n}.osc${i}`];
      if (l) l.setAttribute('fill', values[`d${n}.mute${i}`] > 0.5 ? '#9a9a9a' : '#e3261d');
    }
  }

  // ---- Building it all ----
  function build(container, hooks) {
    send = hooks.send; sendCables = hooks.sendCables; onMic = hooks.onMic;
    load();
    svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('viewBox', '0 0 2000 1293');
    svg.setAttribute('id', 'panel');
    container.appendChild(svg);
    el('rect', { x: 0, y: 0, width: 2000, height: 1293, fill: '#fbfaf6' });
    drawHeader();
    drawClassicDrone(1, 0); drawClassicDrone(2, 328); drawClassicDrone(4, 1314); drawClassicDrone(5, 1642);
    drawEffectorAndFilters();
    drawMixer();
    drawSrapaDrone(3, 0); drawSrapaDrone(6, 1645);
    drawVCO('a', 0); drawVCO('b', 986);
    drawEnvelope('a', 675); drawEnvelope('b', 1068);
    // the little voice-mixer emblem between the envelopes
    el('rect', { x: 960, y: 625, width: 76, height: 100, fill: 'none' });
    for (let i = 0; i < 12; i++) el('rect', { x: 963 + i * 6, y: 640, width: 3, height: 6, fill: '#111' });
    for (let i = 0; i < 12; i++) el('rect', { x: 963 + i * 6, y: 718, width: 3, height: 6, fill: '#111' });
    el('path', { d: 'M1000,655 a26,26 0 1,0 25,30', fill: 'none', stroke: '#111', 'stroke-width': 8, 'stroke-dasharray': '3 2' });
    drawBottomRow();
    drawKeyboard();
    drawPads();
    drawJoystick();
    hint = text(1000, 1275, '', { size: 15, weight: 600, fill: '#555' });
    cableLayer = el('g', { id: 'cables' });
    keyboardInput();
    // Fill in every value (saved ones, or the starting position) and draw it.
    for (const id in defaults) { if (values[id] == null) values[id] = defaults[id]; controls[id] && controls[id].draw(values[id]); }
    for (const id of ['fx.resetL', 'fx.resetR']) values[id] = 0;
    values['kbd.note'] = -1; values['kbd.press'] = 0;
    for (let n = 1; n <= 6; n++) values[`d${n}.pad`] = 0;
    updateProgramNames(); showOscStatus(); drawCables();
  }

  return { build, showLeds, showOscStatus, cables: () => cables.map(c => [c[0], c[1]]), progOf, values,
    resetAll() { for (const id in defaults) setValue(id, defaults[id]); cables = []; cablesChanged(); } };
})();
