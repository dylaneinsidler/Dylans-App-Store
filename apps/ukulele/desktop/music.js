// The music facts both screens share: the strings, note names, the chord chart, and how to name
// whatever is being played. Notes are numbered the way computers do it (60 = middle C, +1 per fret).
// Strings are always listed low to high, D G B E, which is also left to right in a chord chart.
(function (global) {
  'use strict';

  const STRINGS = [
    { name: 'D', open: 50 },
    { name: 'G', open: 55 },
    { name: 'B', open: 59 },
    { name: 'E', open: 64 },
  ];
  const FRETS = 12;

  const SHARP = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
  const FLAT = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'];
  const ROOT = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];   // how chords are usually spelled
  const LETTER = [0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6];   // C D E F G A B, for placing notes on the staff

  const pc = m => ((m % 12) + 12) % 12;
  const noteName = m => SHARP[pc(m)];
  const isSharp = m => SHARP[pc(m)].length > 1;
  const bothNames = m => (isSharp(m) ? `${SHARP[pc(m)]} / ${FLAT[pc(m)]}` : SHARP[pc(m)]);
  const pitchAt = (string, fret) => STRINGS[string].open + fret;
  const ordinal = n => n + (n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] || 'th');
  const fretWords = f => (f === 0 ? 'open' : `${ordinal(f)} fret`);
  const FINGERS = { 1: 'pointer', 2: 'middle', 3: 'ring', 4: 'pinky' };

  // The notes that ring, one per string: frets holds a fret number per string (0 = open),
  // or null for a string that isn't played.
  const sounding = frets => frets.map((f, s) => (f == null ? null : pitchAt(s, f)));

  // Every place on the neck a note can be played, easiest (lowest fret) first.
  function positions(midi) {
    return STRINGS.map((s, i) => ({ string: i, fret: midi - s.open }))
      .filter(p => p.fret >= 0 && p.fret <= FRETS)
      .sort((a, b) => a.fret - b.fret);
  }

  // ---- Naming chords ----
  // Each kind of chord is a pattern of steps (frets) above its main note. With only four strings, a
  // chord sometimes leaves out its middle-ish "fifth" note, so those versions are listed too.
  const KINDS = [
    { steps: [0, 4, 7], suffix: '', words: 'major chord', feel: 'bright and happy' },
    { steps: [0, 3, 7], suffix: 'm', words: 'minor chord', feel: 'sad and dark' },
    { steps: [0, 4, 7, 10], suffix: '7', words: 'seventh chord', feel: 'bluesy, wants to move on' },
    { steps: [0, 4, 10], suffix: '7', words: 'seventh chord', feel: 'bluesy, wants to move on' },
    { steps: [0, 3, 7, 10], suffix: 'm7', words: 'minor seventh chord', feel: 'mellow and jazzy' },
    { steps: [0, 3, 10], suffix: 'm7', words: 'minor seventh chord', feel: 'mellow and jazzy' },
    { steps: [0, 4, 7, 11], suffix: 'maj7', words: 'major seventh chord', feel: 'soft and dreamy' },
    { steps: [0, 4, 11], suffix: 'maj7', words: 'major seventh chord', feel: 'soft and dreamy' },
    { steps: [0, 4, 7, 9], suffix: '6', words: 'sixth chord', feel: 'sweet, old-time sound' },
    { steps: [0, 3, 7, 9], suffix: 'm6', words: 'minor sixth chord', feel: 'moody and mysterious' },
    { steps: [0, 5, 7], suffix: 'sus4', words: 'sus4 chord', feel: 'unfinished, wants to settle' },
    { steps: [0, 2, 7], suffix: 'sus2', words: 'sus2 chord', feel: 'open and floating' },
    { steps: [0, 5, 7, 10], suffix: '7sus4', words: '7sus4 chord', feel: 'waiting, unsettled' },
    { steps: [0, 3, 6], suffix: 'dim', words: 'diminished chord', feel: 'tense and spooky' },
    { steps: [0, 4, 8], suffix: 'aug', words: 'augmented chord', feel: 'strange and dreamy' },
    { steps: [0, 3, 6, 9], suffix: 'dim7', words: 'diminished seventh chord', feel: 'very tense, dramatic' },
    { steps: [0, 3, 6, 10], suffix: 'm7♭5', words: 'half-diminished chord', feel: 'dark and tense' },
    { steps: [0, 2, 4, 7], suffix: 'add9', words: 'add9 chord', feel: 'bright and sparkly' },
    { steps: [0, 2, 3, 7], suffix: 'm(add9)', words: 'minor add9 chord', feel: 'sad but pretty' },
    { steps: [0, 2, 4, 10], suffix: '9', words: 'ninth chord', feel: 'funky and bluesy' },
    { steps: [0, 7], suffix: '5', words: 'power chord (two notes)', feel: 'strong and plain' },
  ];

  // Names the chord in a set of notes, or returns null when it isn't one. When the same notes can be
  // named two ways (the open strings are both Em7 and G6), the one built on the lowest note wins,
  // then the more common kind; the other name comes back as "also".
  function nameChord(midis) {
    const notes = midis.filter(m => m != null);
    const pcs = [...new Set(notes.map(pc))];
    if (pcs.length < 2) return null;
    const bass = pc(Math.min(...notes));
    const found = [];
    for (const root of pcs) {
      const steps = pcs.map(p => pc(p - root)).sort((a, b) => a - b).join(',');
      KINDS.forEach((k, i) => {
        if (k.steps.join(',') === steps) {
          found.push({ root, kind: k, name: ROOT[root] + k.suffix, rank: i + (root === bass ? 0 : 100) });
        }
      });
    }
    if (!found.length) return null;
    found.sort((a, b) => a.rank - b.rank);
    const best = found[0];
    const also = [...new Set(found.slice(1).map(f => f.name))].filter(n => n !== best.name);
    return {
      name: best.name,
      root: ROOT[best.root],
      words: `${ROOT[best.root]} ${best.kind.words}`,
      feel: best.kind.feel,
      also,
    };
  }

  // ---- The chord chart ----
  // [name, frets D G B E, fingers D G B E (1 pointer, 2 middle, 3 ring, 4 pinky, 0 none)]
  // The same finger on one fret across several strings means lay that finger flat (a "barre").
  const CHART = [
    {
      label: 'Major', feel: 'happy', chords: [
        ['C', [2, 0, 1, 0], [2, 0, 1, 0]],
        ['D', [0, 2, 3, 2], [0, 1, 3, 2]],
        ['E', [2, 1, 0, 0], [2, 1, 0, 0]],
        ['F', [3, 2, 1, 1], [3, 2, 1, 1]],
        ['G', [0, 0, 0, 3], [0, 0, 0, 3]],
        ['A', [2, 2, 2, 0], [1, 2, 3, 0]],
        ['B', [4, 4, 4, 2], [2, 3, 4, 1]],
      ],
    },
    {
      label: 'Minor', feel: 'sad', chords: [
        ['Cm', [1, 0, 1, 3], [1, 0, 2, 3]],
        ['Dm', [0, 2, 3, 1], [0, 2, 3, 1]],
        ['Em', [2, 0, 0, 0], [2, 0, 0, 0]],
        ['Fm', [3, 1, 1, 1], [3, 1, 1, 1]],
        ['Gm', [0, 3, 3, 3], [0, 1, 2, 3]],
        ['Am', [2, 2, 1, 0], [2, 3, 1, 0]],
        ['Bm', [4, 4, 3, 2], [3, 4, 2, 1]],
      ],
    },
    {
      label: 'Seventh', feel: 'bluesy', chords: [
        ['C7', [2, 3, 1, 0], [2, 3, 1, 0]],
        ['D7', [0, 2, 1, 2], [0, 2, 1, 3]],
        ['E7', [0, 1, 0, 0], [0, 1, 0, 0]],
        ['F7', [1, 2, 1, 1], [1, 2, 1, 1]],
        ['G7', [0, 0, 0, 1], [0, 0, 0, 1]],
        ['A7', [2, 2, 2, 3], [1, 1, 1, 2]],
        ['B7', [1, 2, 0, 2], [1, 2, 0, 3]],
      ],
    },
  ].map(row => ({
    ...row,
    chords: row.chords.map(([name, frets, fingers]) => ({ name, frets, fingers, info: nameChord(sounding(frets)) })),
  }));

  function findChord(name) {
    for (const row of CHART) for (const c of row.chords) if (c.name === name) return c;
    return null;
  }

  // Plain-English steps for a chord shape, e.g. "Ring finger (3): E string, 3rd fret".
  function chordSteps(frets, fingers) {
    const steps = [];
    const byFinger = {};
    frets.forEach((f, s) => {
      if (f && fingers[s]) (byFinger[fingers[s]] = byFinger[fingers[s]] || []).push(s);
    });
    Object.keys(byFinger).sort().forEach(n => {
      const strings = byFinger[n];
      const who = `${FINGERS[n][0].toUpperCase()}${FINGERS[n].slice(1)} finger (${n})`;
      if (strings.length > 1) {
        steps.push(`${who}: lay it flat across the ${listWords(strings.map(s => STRINGS[s].name))} strings at the ${ordinal(frets[strings[0]])} fret`);
      } else {
        steps.push(`${who}: ${STRINGS[strings[0]].name} string, ${ordinal(frets[strings[0]])} fret`);
      }
    });
    const open = frets.map((f, s) => (f === 0 ? STRINGS[s].name : null)).filter(Boolean);
    if (open.length) steps.push(`Let the ${listWords(open)} string${open.length > 1 ? 's' : ''} ring open (no finger)`);
    const muted = frets.map((f, s) => (f == null ? STRINGS[s].name : null)).filter(Boolean);
    if (muted.length) steps.push(`Don't play the ${listWords(muted)} string${muted.length > 1 ? 's' : ''}`);
    return steps;
  }

  function listWords(items) {
    if (items.length < 2) return items.join('');
    return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
  }

  // ---- The staff ----
  // Ukulele and guitar music is written one octave higher than it sounds, so the open D string sits
  // just under the staff instead of far below it. step 0 = the bottom line (E), 1 = the space above it...
  function staffStep(midi) {
    const written = midi + 12;
    return (Math.floor(written / 12) - 1) * 7 + LETTER[pc(written)] - 30;
  }

  function staffWords(midi) {
    const step = staffStep(midi);
    if (step === -1) return 'in the space just under the staff';
    if (step === 9) return 'in the space just above the staff';
    if (step >= 0 && step <= 8) {
      return step % 2 === 0 ? `on the ${ordinal(step / 2 + 1)} line up from the bottom` : `in the ${ordinal((step + 1) / 2)} space up from the bottom`;
    }
    if (step >= 10) {
      const extra = Math.floor((step - 8) / 2);
      return step % 2 === 0 ? `on the ${ordinal(extra)} short line above the staff` : `just above the ${ordinal(extra)} short line above the staff`;
    }
    const extra = Math.floor(-step / 2);
    return step % 2 === 0 ? `on the ${ordinal(extra)} short line below the staff` : `just below the ${ordinal(extra)} short line below the staff`;
  }

  // All the notes this neck can play, low to high.
  const RANGE = [];
  for (let m = STRINGS[0].open; m <= STRINGS[3].open + FRETS; m++) RANGE.push(m);

  global.Music = {
    STRINGS, FRETS, RANGE, CHART, FINGERS,
    pc, noteName, bothNames, isSharp, pitchAt, sounding, positions, ordinal, fretWords, listWords,
    nameChord, findChord, chordSteps, staffStep, staffWords,
  };
})(typeof window !== 'undefined' ? window : globalThis);
