// Draws music staves: bass clef for the low and middle notes, tenor clef for the high ones (the way
// bassoon music is written).

window.Staff = (() => {
  const NS = 'http://www.w3.org/2000/svg';
  const LETTERS = 'CDEFGAB';
  // The bottom line of each staff, counted in letter steps from C0: G2 for bass clef, D3 for tenor clef.
  const BOTTOM = { bass: 2 * 7 + 4, tenor: 3 * 7 + 1 };

  function el(tag, attrs = {}, parent) {
    const e = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) if (v !== undefined) e.setAttribute(k, v);
    if (parent) parent.appendChild(e);
    return e;
  }

  // Bassoon music switches to tenor clef around B♭ above the bass staff.
  function clefFor(midi) { return midi >= 58 ? 'tenor' : 'bass'; }

  // How many half-spaces above the staff's bottom line a note sits (0 = bottom line, 8 = top line).
  function step(midi, clef) {
    const n = Bassoon.noteName(midi);
    return n.octave * 7 + LETTERS.indexOf(n.letter) - BOTTOM[clef];
  }

  // Five lines and the clef. (x, top) is the top line's left end; s is the gap between lines.
  function staff(g, { x, top, width, s, clef }) {
    for (let i = 0; i < 5; i++) el('line', { x1: x, x2: x + width, y1: top + i * s, y2: top + i * s, class: 'staff-line' }, g);
    const k = s / 10;
    if (clef === 'bass') {
      const c = el('g', { transform: `translate(${x + 0.6 * s},${top}) scale(${k})`, class: 'clef' }, g);
      el('path', { d: 'M1.2,8.6 C1.6,2.2 7,-0.9 12,-0.2 C18.2,0.6 21.2,5.8 20.6,11.4 C19.8,19.2 12.2,26.2 0.9,31.2 L0.3,30 C9.6,24.8 15.6,18.6 15.7,11.2 C15.8,5 13,1.5 9.4,1.5 C6,1.5 3.6,4 3.4,7.2 Z' }, c);
      el('circle', { cx: 3.6, cy: 10, r: 3.4 }, c);
      el('circle', { cx: 25, cy: 5, r: 1.7 }, c);
      el('circle', { cx: 25, cy: 15, r: 1.7 }, c);
    } else {
      // A C clef whose middle sits on middle C: the second line from the top in tenor clef.
      const c = el('g', { transform: `translate(${x + 0.6 * s},${top}) scale(${k})`, class: 'clef' }, g);
      el('rect', { x: 0, y: -10, width: 4.4, height: 40 }, c);
      el('rect', { x: 6.4, y: -10, width: 1.6, height: 40 }, c);
      const curl = 'M8,10 C10,7.6 12,4.2 12.6,0 C13.2,-4.2 15,-9.6 19.5,-9.8 C23.8,-10 25.6,-7 25.6,-4.4 C25.6,-1.4 23,0.2 21,0.2 C18.6,0.2 17.4,-1.6 17.5,-3.2 C17.6,-5 19.5,-5.6 19.7,-6.8 C19.8,-7.8 18.6,-8.2 17.6,-7.8 C15,-6.6 14.5,-1 13.8,2 C13,5.5 11,8.5 8,10 Z';
      el('path', { d: curl }, c);
      el('path', { d: curl, transform: 'translate(0,20) scale(1,-1)' }, c);
    }
  }

  // One whole note, with its ledger lines and sharp or flat. Returns the note head.
  function note(g, { midi, x, top, s, clef }) {
    const st = step(midi, clef);
    const bottom = top + 4 * s;
    const y = bottom - st * s / 2;
    for (let k = -2; k >= st; k -= 2) el('line', { x1: x - 1.25 * s, x2: x + 1.25 * s, y1: bottom - k * s / 2, y2: bottom - k * s / 2, class: 'ledger' }, g);
    for (let k = 10; k <= st; k += 2) el('line', { x1: x - 1.25 * s, x2: x + 1.25 * s, y1: bottom - k * s / 2, y2: bottom - k * s / 2, class: 'ledger' }, g);
    const head = el('g', { class: 'notehead' }, g);
    // A whole note: a wide oval with a tilted hole in it
    el('path', {
      d: `M${x - 0.78 * s},${y} a${0.78 * s},${0.52 * s} 0 1,0 ${1.56 * s},0 a${0.78 * s},${0.52 * s} 0 1,0 ${-1.56 * s},0 Z ` +
         `M${x - 0.3 * s},${y - 0.36 * s} a${0.24 * s},${0.42 * s} -55 1,0 ${0.6 * s},${0.72 * s} a${0.24 * s},${0.42 * s} -55 1,0 ${-0.6 * s},${-0.72 * s} Z`,
      'fill-rule': 'evenodd',
    }, head);
    const acc = Bassoon.noteName(midi).acc;
    if (acc) {
      const t = el('text', { x: x - 1.55 * s, y: y + (acc === '♭' ? 0.42 : 0.62) * s, class: 'accidental', 'font-size': 2.1 * s, 'text-anchor': 'middle' }, head);
      t.textContent = acc;
    }
    return { head, y };
  }

  return { clefFor, staff, note, step };
})();
