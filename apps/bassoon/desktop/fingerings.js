// Every key and hole on the bassoon, and the fingering for every note from low B♭ to high D.
//
// The fingerings are for a normal German-system (Heckel) bassoon. They come from the Woodwind
// Fingering Guide's basic chart (wfg.woodwind.org/bassoon), checked note by note against Terry Ewell's
// "Standard German System Bassoon Fingerings" from the International Double Reed Society.
//
// A fingering is a list of key names (see `keys` below), separated by spaces. The left first finger
// hole has a "half-hole": L1q covers a little of it, L1h about half, L1t most of it.
// `optional` keys can be pressed or not (the flick keys, mostly); the note is the same either way.

window.BASSOON = {
  keys: {
    // Left thumb: the four low keys on the long joint
    lBb: { name: 'Low B♭ key', short: 'B♭', where: 'Left thumb', tip: 'On the long joint (the tall piece). Only used for the very lowest note, low B♭.' },
    lB:  { name: 'Low B key',  short: 'B',  where: 'Left thumb', tip: 'On the long joint. Used for low B and low B♭.' },
    lC:  { name: 'Low C key',  short: 'C',  where: 'Left thumb', tip: 'On the long joint. Used for the lowest notes, low C♯ and below.' },
    lD:  { name: 'Low D key',  short: 'D',  where: 'Left thumb', tip: 'On the long joint. Used for the lowest notes, and for C♯ in the middle.' },
    // Left thumb: on the wing joint
    W:   { name: 'Whisper key', short: 'W', where: 'Left thumb', tip: 'Hold it down for most notes in the low and middle range. It stops them from jumping up an octave.' },
    lCs: { name: 'C♯ key', short: 'C♯', where: 'Left thumb', tip: 'For C♯ in the middle, and a few high notes.' },
    fA:  { name: 'High A key (flick key)', short: 'A', where: 'Left thumb', tip: 'Tap it (a "flick") as you slur up to A or B♭ in the middle so the note starts cleanly. Held down for high A and B♭.' },
    fC:  { name: 'High C key (flick key)', short: 'C', where: 'Left thumb', tip: 'Flick it for B and C in the middle. Held down for high B and C.' },
    fD:  { name: 'High D key (flick key)', short: 'D', where: 'Left thumb', tip: 'Flick it for D in the middle. Held down for high C♯ and D.' },
    // Left fingers and little finger
    L1:  { name: 'First finger hole', short: '1', where: 'Left index finger', tip: 'Click once to cover it. Click again for a half-hole (roll your finger down so the top of the hole is open). Click a third time to let go.' },
    L2:  { name: 'Second finger hole', short: '2', where: 'Left middle finger', tip: '' },
    L3:  { name: 'Third finger key', short: '3', where: 'Left ring finger', tip: 'A ring key: your finger covers the hole and presses the ring around it.' },
    pEb: { name: 'E♭ key', short: 'E♭', where: 'Left little finger', tip: 'For low E♭ and most of the high notes.' },
    pCs: { name: 'C♯ key', short: 'C♯', where: 'Left little finger', tip: 'For low C♯.' },
    // Right thumb
    rBb: { name: 'B♭ key', short: 'B♭', where: 'Right thumb', tip: 'For B♭, and some notes up high.' },
    rE:  { name: 'E key ("pancake" key)', short: 'E', where: 'Right thumb', tip: 'The big round key. Held down for low E and every note below it.' },
    rFs: { name: 'F♯ key', short: 'F♯', where: 'Right thumb', tip: 'For F♯ in the low and middle range.' },
    rAb: { name: 'G♯ (A♭) key', short: 'G♯', where: 'Right thumb', tip: 'Another way to play G♯ (instead of the little finger key).' },
    // Right fingers and little finger
    R1:  { name: 'First finger hole', short: '1', where: 'Right index finger', tip: '' },
    R2:  { name: 'Second finger hole', short: '2', where: 'Right middle finger', tip: '' },
    R3:  { name: 'Third finger hole', short: '3', where: 'Right ring finger', tip: '' },
    pF:  { name: 'F key', short: 'F', where: 'Right little finger', tip: 'Held down for low F and every note below it, and some high notes.' },
    pFs: { name: 'F♯ key', short: 'F♯', where: 'Right little finger', tip: 'Another way to play F♯ (instead of the thumb key).' },
    pAb: { name: 'G♯ (A♭) key', short: 'G♯', where: 'Right little finger', tip: 'For G♯ in the low and middle range.' },
  },

  // midi: the note's number (60 is middle C). The first fingering is the main one; any others are
  // other common ways to play the same note.
  notes: [
    { midi: 34, fingerings: [{ keys: 'lBb lB lC lD L1 L2 L3 rE R1 R2 R3 pF' }],
      tip: 'The lowest note on the bassoon. Your left thumb holds all four low keys down at once.' },
    { midi: 35, fingerings: [{ keys: 'lB lC lD L1 L2 L3 rE R1 R2 R3 pF' }] },
    { midi: 36, fingerings: [{ keys: 'lC lD L1 L2 L3 rE R1 R2 R3 pF' }] },
    { midi: 37, fingerings: [{ keys: 'lC lD L1 L2 L3 pCs rE R1 R2 R3 pF' }],
      tip: 'Like low C, plus the C♯ key under your left little finger.' },
    { midi: 38, fingerings: [{ keys: 'lD L1 L2 L3 rE R1 R2 R3 pF' }] },
    { midi: 39, fingerings: [{ keys: 'lD L1 L2 L3 pEb rE R1 R2 R3 pF' }],
      tip: 'Like low D, plus the E♭ key under your left little finger.' },
    { midi: 40, fingerings: [{ keys: 'W L1 L2 L3 rE R1 R2 R3 pF' }],
      tip: 'From here up to the G♯ in the middle, your left thumb holds the whisper key.' },
    { midi: 41, fingerings: [{ keys: 'W L1 L2 L3 R1 R2 R3 pF' }] },
    { midi: 42, fingerings: [
      { keys: 'W L1 L2 L3 rFs R1 R2 R3 pF' },
      { keys: 'W L1 L2 L3 R1 R2 R3 pFs', label: 'With the little finger F♯ key instead' } ] },
    { midi: 43, fingerings: [{ keys: 'W L1 L2 L3 R1 R2 R3' }],
      tip: 'Every hole covered, no extra keys.' },
    { midi: 44, fingerings: [
      { keys: 'W L1 L2 L3 R1 R2 R3 pAb' },
      { keys: 'W L1 L2 L3 rAb R1 R2 R3', label: 'With the thumb G♯ key instead' } ] },
    { midi: 45, fingerings: [{ keys: 'W L1 L2 L3 R1 R2' }] },
    { midi: 46, fingerings: [{ keys: 'W L1 L2 L3 rBb R1 R2' }] },
    { midi: 47, fingerings: [{ keys: 'W L1 L2 L3 R1' }] },
    { midi: 48, fingerings: [{ keys: 'W L1 L2 L3' }] },
    { midi: 49, fingerings: [{ keys: 'lD lCs W L1 L2 L3' }],
      tip: 'Your left thumb holds three keys at once: low D, C♯ and the whisper key.' },
    { midi: 50, fingerings: [{ keys: 'W L1 L2' }] },
    { midi: 51, fingerings: [
      { keys: 'W L1 L3' },
      { keys: 'W L1 L3 rBb R2', label: 'Often used for longer, held notes' } ] },
    { midi: 52, fingerings: [{ keys: 'W L1' }] },
    { midi: 53, fingerings: [{ keys: 'W' }],
      tip: 'Only the whisper key. Every hole is open.' },
    { midi: 54, fingerings: [
      { keys: 'W L1q L2 L3 rFs R1 R2 R3 pF' },
      { keys: 'W L1q L2 L3 R1 R2 R3 pFs', label: 'With the little finger F♯ key instead' } ],
      tip: 'Half-hole: leave most of the first hole open (cover just a little of it).' },
    { midi: 55, fingerings: [{ keys: 'W L1h L2 L3 pEb R1 R2 R3' }],
      tip: 'Half-hole: roll your left first finger down so about half of the hole is open.' },
    { midi: 56, fingerings: [
      { keys: 'W L1t L2 L3 R1 R2 R3 pAb' },
      { keys: 'W L1t L2 L3 rAb R1 R2 R3', label: 'With the thumb G♯ key instead' } ],
      tip: 'Half-hole: cover a bit more than half of the first hole.' },
    { midi: 57, fingerings: [{ keys: 'L1 L2 L3 R1 R2', optional: 'fA' }],
      tip: 'No whisper key from here up. Flick the high A key as you slur up to this note.' },
    { midi: 58, fingerings: [{ keys: 'L1 L2 L3 rBb R1 R2', optional: 'fA fC' }],
      tip: 'Flick the high A key (or the high C key) as you slur up to this note.' },
    { midi: 59, fingerings: [{ keys: 'L1 L2 L3 R1', optional: 'fC' }],
      tip: 'Flick the high C key as you slur up to this note.' },
    { midi: 60, fingerings: [{ keys: 'L1 L2 L3', optional: 'fC' }],
      tip: 'Middle C. Flick the high C key as you slur up to it.' },
    { midi: 61, fingerings: [
      { keys: 'lD lCs L1 L2 L3' },
      { keys: 'lCs L1 L2 L3 R2 R3 pF', label: 'The main one is easier in fast passages' } ] },
    { midi: 62, fingerings: [{ keys: 'L1 L2', optional: 'fD fC' }],
      tip: 'Flick the high D key (or the high C key) as you slur up to this note.' },
    { midi: 63, fingerings: [{ keys: 'L1 L2 R1 R2 R3', optional: 'R1' }],
      tip: 'Your right first finger is optional on this one.' },
    { midi: 64, fingerings: [{ keys: 'L1 L3 pEb R1 R2 R3' }] },
    { midi: 65, fingerings: [{ keys: 'L1 L3 pEb R1 R2' }] },
    { midi: 66, fingerings: [
      { keys: 'L2 L3 pEb rBb R1 R2' },
      { keys: 'L2 L3 pEb R1 R2 pF', label: 'With the F key instead of the thumb B♭ key' } ] },
    { midi: 67, fingerings: [{ keys: 'W L1h L2 L3 pEb R1 pF' }],
      tip: 'Half-hole again, about half open, and the whisper key comes back.' },
    { midi: 68, fingerings: [{ keys: 'W L1t L2 L3 pEb R3' }],
      tip: 'Half-hole: cover a bit more than half of the first hole.' },
    { midi: 69, fingerings: [{ keys: 'fA lCs L1 L2 L3 pEb R3' }],
      tip: 'Hold the high A key down the whole time. Here it\'s part of the fingering, not a flick.' },
    { midi: 70, fingerings: [{ keys: 'fA lCs L1 L2 L3 pEb R1 R2 pF' }],
      tip: 'Hold the high A key down the whole time.' },
    { midi: 71, fingerings: [{ keys: 'fC L1 L2 pEb rBb R1 R2 pF' }],
      tip: 'Hold the high C key down the whole time.' },
    { midi: 72, fingerings: [{ keys: 'fC L1 pEb rBb R1 R2 pF' }],
      tip: 'Hold the high C key down the whole time.' },
    { midi: 73, fingerings: [{ keys: 'fD fC L1 L3 pEb R1 R3', optional: 'fC' }],
      tip: 'Hold the high D key down. The high C key is optional.' },
    { midi: 74, fingerings: [
      { keys: 'fD L3 pEb rBb R3 pAb' },
      { keys: 'fD L2 L3 pEb rBb R3 pAb', label: 'With the left second finger down too' } ],
      tip: 'Hold the high D key down the whole time.' },
  ],
};
