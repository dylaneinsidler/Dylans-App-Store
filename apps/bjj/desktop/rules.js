// Tournament rules: what's legal, for whom, where. Each technique lists "tags" for anything that some
// rulebook restricts (a heel hook is tagged heelhook, a kneebar kneebar, and so on); a technique with
// no tags is legal everywhere for adults. Checked against the rulebooks in October 2026:
//   IBJJF Rules Book (2024 edition, still current), ADCC Rules & Regulations (Pro, Intermediate, Beginner),
//   NAGA Rules (2023 edition), EBI rules as of September 2026, IJF Refereeing Rules for 2025–2028.
// Rules change, so the app always says "check the event's own rules before you compete".
(function (global) {
  'use strict';

  // y = legal, n = not allowed, ? = depends (see the note)
  const SETS = [
    { id: 'ibjjf-gi', name: 'IBJJF Gi', attire: 'gi', levels: ['White', 'Blue', 'Purple', 'Brown', 'Black'],
      about: 'The big gi tournaments (Worlds, Pans, Europeans). Adult and Masters divisions; kids and teens ban more.' },
    { id: 'ibjjf-nogi', name: 'IBJJF No-Gi', attire: 'nogi', levels: ['White', 'Blue', 'Purple', 'Brown', 'Black'],
      about: 'The same rulebook without the gi. Since 2021 adult brown and black belts may heel hook and reap the knee.' },
    { id: 'adcc', name: 'ADCC', attire: 'nogi', levels: ['Beginner', 'Intermediate', 'Advanced & Pro'],
      about: 'No-gi submission wrestling. Pro and advanced allow almost everything; beginner and intermediate ban the twisting leg locks.' },
    { id: 'naga-nogi', name: 'NAGA No-Gi', attire: 'nogi', levels: ['Novice', 'Intermediate', 'Expert'],
      about: 'Local tournaments all over North America. Adults may use almost everything; heel hooks start at intermediate.' },
    { id: 'naga-gi', name: 'NAGA Gi', attire: 'gi', levels: ['White', 'Blue', 'Purple', 'Brown & Black'],
      about: 'NAGA with the gi on, by belt. Close to the IBJJF table.' },
    { id: 'ebi', name: 'EBI', attire: 'nogi', levels: ['Adult'],
      about: "Eddie Bravo Invitational: submission only, every submission legal for adults (no slams). 10th Planet's home ruleset." },
  ];

  const ALL_YES = { 'ibjjf-gi': 'yyyyy', 'ibjjf-nogi': 'yyyyy', adcc: 'yyy', 'naga-nogi': 'yyy', 'naga-gi': 'yyyy', ebi: 'y' };

  // What each tag means, and the rules for it.
  const TAGS = {
    wristlock: {
      name: 'Wrist lock',
      rules: { 'ibjjf-gi': 'nyyyy', 'ibjjf-nogi': 'nyyyy', 'naga-gi': 'nyyy' },
      note: 'IBJJF bans wrist locks for white belts only.',
    },
    bicepslicer: {
      name: 'Biceps slicer',
      rules: { 'ibjjf-gi': 'nnnyy', 'ibjjf-nogi': 'nnnyy', adcc: 'nyy', 'naga-gi': 'nnny' },
      note: 'A "slicer" crushes a muscle against a bone. IBJJF: brown and black belts only.',
    },
    calfslicer: {
      name: 'Calf slicer',
      rules: { 'ibjjf-gi': 'nnnyy', 'ibjjf-nogi': 'nnnyy', adcc: 'nyy', 'naga-gi': 'nnny' },
      note: 'IBJJF: brown and black belts only. ADCC bans it for beginners.',
    },
    kneebar: {
      name: 'Kneebar',
      rules: { 'ibjjf-gi': 'nnnyy', 'ibjjf-nogi': 'nnnyy', adcc: 'nyy', 'naga-gi': 'nnny' },
      note: 'IBJJF: brown and black belts only. ADCC bans it for beginners.',
    },
    toehold: {
      name: 'Toe hold',
      rules: { 'ibjjf-gi': 'nnnyy', 'ibjjf-nogi': 'nnnyy', adcc: 'nny', 'naga-gi': 'nnny' },
      note: 'IBJJF: brown and black belts only (in the gi, without twisting the foot outward). ADCC: advanced and pro only.',
    },
    heelhook: {
      name: 'Heel hook',
      rules: { 'ibjjf-gi': 'nnnnn', 'ibjjf-nogi': 'nnnyy', adcc: 'nny', 'naga-nogi': 'nyy', 'naga-gi': 'nnnn' },
      note: 'Never in the gi at IBJJF or NAGA. IBJJF No-Gi: adult (18–29) brown and black belts only; Masters (30+) still can\'t. ADCC: advanced and pro only. NAGA No-Gi: intermediate and expert.',
    },
    reap: {
      name: 'Reaping the knee',
      rules: { 'ibjjf-gi': 'nnnnn', 'ibjjf-nogi': 'nnnyy', 'naga-gi': '????' },
      note: 'Reaping means your leg crosses their body from outside in, across the knee line, while you hold their leg. IBJJF: only adult brown and black belts, only in No-Gi. NAGA Gi follows the referee\'s call; ask first.',
    },
    necrank: {
      name: 'Neck crank',
      rules: { 'ibjjf-gi': 'nnnnn', 'ibjjf-nogi': 'nnnnn', adcc: 'nn?', 'naga-gi': 'nnnn' },
      note: 'Pressure on the neck that isn\'t a choke. Banned at every IBJJF belt. ADCC Pro bans cranks that trap both shoulders, the full nelson and the crucifix crank; others are allowed. NAGA No-Gi and EBI allow them for adults.',
    },
    spine: {
      name: 'Spine lock',
      rules: { 'ibjjf-gi': 'nnnnn', 'ibjjf-nogi': 'nnnnn', adcc: 'n?y', 'naga-gi': 'nnnn' },
      note: 'Twisting the spine without choking (the twister). Banned at every IBJJF belt. ADCC bans it for beginners; for intermediates it counts as a neck crank if the pressure goes on the neck. Legal at NAGA No-Gi and EBI.',
    },
    bananasplit: {
      name: 'Banana split',
      rules: { adcc: 'nyy', 'naga-gi': '????' },
      note: 'A hip-splitting stretch. ADCC bans it for beginners; NAGA Gi lists leg-and-groin stretches separately, so ask.',
    },
    legstretch: {
      name: 'Hip stretch (electric chair)',
      rules: { 'naga-gi': '????' },
      note: 'Legal for adults under IBJJF, ADCC and EBI. NAGA Gi treats leg-and-groin stretches by belt; ask the event.',
    },
    scissor: {
      name: 'Flying scissor takedown (kani basami)',
      rules: { 'ibjjf-gi': 'nnnnn', 'ibjjf-nogi': 'nnnnn', adcc: '???', 'naga-nogi': '???', 'naga-gi': 'nnnn', ebi: '?' },
      note: 'Banned at every IBJJF belt and in all judo. NAGA No-Gi allows it only if a hand touches the mat first. ADCC and EBI don\'t list it, so ask the referee.',
    },
    jumpguard: {
      name: 'Jumping to guard',
      rules: { 'ibjjf-gi': 'nyyyy', 'ibjjf-nogi': 'nyyyy', adcc: '???', 'naga-gi': '?yyy' },
      note: 'IBJJF: a serious foul for white belts. ADCC: legal, but pulling guard costs a negative point once scoring starts. NAGA: white belts may only jump for a flying submission.',
    },
    slam: {
      name: 'Slam',
      rules: { 'ibjjf-gi': 'nnnnn', 'ibjjf-nogi': 'nnnnn', adcc: 'nn?', 'naga-nogi': 'nnn', 'naga-gi': 'nnnn', ebi: 'n' },
      note: 'Lifting someone and driving them into the mat. Disqualification almost everywhere; ADCC Pro allows it only to escape a locked-in submission.',
    },
    crossface: {
      name: 'Cross-face crank',
      rules: { adcc: 'nny', 'ibjjf-gi': 'nnnnn', 'ibjjf-nogi': 'nnnnn' },
      note: 'Using the cross-face itself to make them tap counts as a neck crank under IBJJF. ADCC bans cross-face holds for beginners and intermediates.',
    },
  };

  const VERDICT = { y: 'legal', n: 'not allowed', '?': 'depends' };

  // How one technique fares in one ruleset: a letter per level. A gi-only technique has nothing to do in
  // a no-gi ruleset ('-').
  function grid(tech, set) {
    let row = ALL_YES[set.id].split('');
    if (tech.attire === 'gi' && set.attire === 'nogi') return row.map(() => '-');
    for (const tag of tech.tags || []) {
      const t = TAGS[tag];
      const r = t && t.rules[set.id];
      if (!r) continue;
      row = row.map((v, i) => (v === 'n' || r[i] === 'n') ? 'n' : (v === '?' || r[i] === '?') ? '?' : 'y');
    }
    return row;
  }

  // A one-line plain-English summary, e.g. "Legal for every adult belt, everywhere."
  function summary(tech) {
    const tags = (tech.tags || []).filter(t => TAGS[t]);
    if (!tags.length) {
      return tech.attire === 'gi' ? 'Legal for every adult belt in gi tournaments (it needs a gi to grip).' : 'Legal for every adult belt, in every ruleset here.';
    }
    const ibjjf = grid(tech, SETS[tech.attire === 'gi' ? 0 : 1]);
    const first = ibjjf.indexOf('y');
    const lvl = SETS[0].levels;
    let s;
    if (first === -1) s = `Not allowed at any belt under IBJJF${tech.attire === 'gi' ? '' : ' No-Gi'}`;
    else if (first === 0) s = 'IBJJF: legal for every belt';
    else if (first === 4) s = 'IBJJF: black belts only';
    else s = `IBJJF: ${lvl[first].toLowerCase()} belt and up`;
    const ebi = grid(tech, SETS[5])[0];
    const adcc = grid(tech, SETS[2]);
    const parts = [s];
    if (adcc.join('') === 'yyy') parts.push('every ADCC level');
    else if (adcc[2] === 'y' && adcc[0] !== 'y') parts.push(adcc[1] === 'y' ? 'ADCC intermediate and up' : 'ADCC advanced and pro');
    if (ebi === 'y') parts.push('EBI');
    return parts.join(' · ') + '.';
  }

  global.Rules = { SETS, TAGS, VERDICT, grid, summary, asOf: 'October 2026' };
})(window);
