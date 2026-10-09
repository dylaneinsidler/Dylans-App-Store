// Reads a spread the way a teacher would: each card in its spot, what stands out across the whole
// table (big cards, a suit that dominates, repeated numbers), famous pairs, and the story put together.
// Also explains any two cards for the Combos tab.
window.TarotReading = (() => {
  const D = window.TAROT_DATA, S = window.TAROT_SPREADS, X = window.TAROT_COMBOS;
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const PLURAL = ['', 'Aces', 'Twos', 'Threes', 'Fours', 'Fives', 'Sixes', 'Sevens', 'Eights', 'Nines', 'Tens',
    'Pages', 'Knights', 'Queens', 'Kings'];
  const COUNT = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];

  const MOSTLY = {
    wands: 'This is about energy and action: passion, ambition, projects. Things are moving.',
    cups: 'This is about feelings: love, relationships, and how they feel about it all.',
    swords: 'A lot of this is in their head: thoughts, worry, arguments and decisions. Stress is a theme.',
    pentacles: 'This is about practical things: money, work, home and health.',
  };
  const MISSING = {
    wands: 'Energy or motivation may be missing.',
    cups: 'Feelings may be getting left out.',
    swords: 'Not much overthinking here: this is more about doing and feeling.',
    pentacles: 'Money and practical matters aren’t really the issue.',
  };

  const keyOf = (card, rev) => (rev ? card.revKeys : card.keys)[0];
  const meaningOf = (card, rev) => rev ? card.rev : card.up;
  const sayOf = (card, rev) => rev
    ? `This one came out upside down, and that points to ${card.rev}.`
    : card.say;

  function topicNote(card, topic) {
    const notes = X.TOPIC_NOTES[topic];
    if (!notes) return null;
    return card.major ? notes.major : card.court ? notes.court : notes[card.suit];
  }

  function spotNames(spreadId, labels) {
    return S.SPREADS[spreadId].spots.map((spot, i) => (labels && labels[i]) || spot.name);
  }

  // What stands out when you look at the whole table at once.
  function patterns(items) {
    const n = items.length, out = [];
    if (n < 3) return out;
    const majors = items.filter(it => it.card.major).length;
    if (majors >= Math.ceil(n / 2)) {
      out.push({ title: `Lots of big cards (${majors} of ${n})`,
        text: 'This is a major chapter in their life. Big forces are at work, some of it bigger than their day-to-day choices.' });
    } else if (majors === 0) {
      out.push({ title: 'No big cards', text: 'This is about everyday life, and it’s very much in their own hands.' });
    }

    const counts = { wands: 0, cups: 0, swords: 0, pentacles: 0 };
    items.forEach(it => { if (!it.card.major) counts[it.card.suit]++; });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    if (sorted[0][1] >= 2 && sorted[0][1] > sorted[1][1] && sorted[0][1] / n >= 0.4) {
      out.push({ title: `Mostly ${D.SUITS[sorted[0][0]].name}`, text: MOSTLY[sorted[0][0]] });
    }
    if (n >= 7) {
      for (const [suit, count] of Object.entries(counts)) {
        if (!count) out.push({ title: `No ${D.SUITS[suit].name} at all`, text: MISSING[suit] });
      }
    }

    const ranks = {};
    items.forEach(it => { if (!it.card.major) (ranks[it.card.rank] ||= []).push(it.card); });
    let courtsSaid = false;
    for (const [rank, list] of Object.entries(ranks)) {
      if (list.length < 2) continue;
      const r = D.RANKS[rank];
      if (rank > 10) courtsSaid = true;
      out.push({ title: `${COUNT[list.length]} ${PLURAL[rank]}`,
        text: `${PLURAL[rank]} are about ${r.long}. Seeing more than one makes it a theme.` });
    }
    const courts = items.filter(it => it.card.court).length;
    if (courts >= 2 && !courtsSaid) {
      out.push({ title: `${COUNT[courts]} people cards`,
        text: 'Several people are involved, or the person is playing several roles at once.' });
    }
    const revs = items.filter(it => it.rev).length;
    if (revs >= 2 && revs >= Math.ceil(n / 2)) {
      out.push({ title: `Lots of upside-down cards (${revs})`,
        text: 'Things feel stuck, delayed or turned inward. They may be holding something back.' });
    }
    return out;
  }

  // Cards that sit together and whose elements get along, or clash: one after the other in a
  // three-card story, You and Them in a relationship, and the heart of a Celtic Cross with what crosses it.
  const TOGETHER = { ppf: [[0, 1], [1, 2]], sao: [[0, 1], [1, 2]], rel: [[0, 1]], cross: [[0, 1]] };
  function neighbors(spots, spread) {
    const out = [];
    for (const [i, j] of TOGETHER[spread] || []) {
      const a = spots[i], b = spots[j];
      if (a.empty || b.empty) continue;
      const el = X.elements(a.card.element, b.card.element);
      if (el.kind === 'friends' || el.kind === 'clash') {
        out.push({ title: `${a.name} and ${b.name}: ${el.kind === 'clash' ? 'a clash' : 'friends'}`,
          text: `${a.card.name} is ${a.card.element}, ${b.card.name} is ${b.card.element}. ${el.text}` });
      }
    }
    return out;
  }

  const SUMMARY = {
    one: k => `The message: ${k[0]}.`,
    ppf: k => `They’re coming from ${k[0]}. Right now it’s about ${k[1]}. And it’s heading toward ${k[2]}.`,
    sao: k => `The situation is about ${k[0]}. The advice: ${k[1]}. If they follow it, it leads to ${k[2]}.`,
    rel: (k, n) => `On one side, ${k[0]} (${n[0]}). On the other, ${k[1]} (${n[1]}). Together, it’s about ${k[2]}.`,
    choice: (k, n) => `${n[0]} looks like ${k[0]}. ${n[1]} looks like ${k[1]}. To decide, keep this in mind: ${k[2]}.`,
    cross: k => `At the heart of it is ${k[0]}, crossed by ${k[1]}. Underneath it all: ${k[2]}. Recently: ${k[3]}. ` +
      `The best that can happen: ${k[4]}. Coming up next: ${k[5]}. And where it’s heading: ${k[9]}.`,
  };

  // cards: one { id, rev } per spot, or null for a spot not filled in (or not turned over) yet.
  function analyze({ spread, cards, topic, labels }) {
    const sp = S.SPREADS[spread], names = spotNames(spread, labels);
    const spots = sp.spots.map((spot, i) => {
      const c = cards && cards[i];
      if (!c || !c.id) return { i, name: names[i], spot, empty: true };
      const card = D.byId[c.id], rev = !!c.rev;
      return {
        i, name: names[i], spot, card, rev,
        key: keyOf(card, rev), keys: rev ? card.revKeys : card.keys, meaning: meaningOf(card, rev),
        topic: topicNote(card, topic), say: sayOf(card, rev), pairs: [],
      };
    });
    const filled = spots.filter(s => !s.empty);
    const pairs = [];
    for (let a = 0; a < filled.length; a++) {
      for (let b = a + 1; b < filled.length; b++) {
        const text = X.pair(filled[a].card.id, filled[b].card.id);
        if (!text) continue;
        pairs.push({ a: filled[a], b: filled[b], text });
        filled[a].pairs.push({ other: filled[b], text });
        filled[b].pairs.push({ other: filled[a], text });
      }
    }
    const complete = filled.length === spots.length;
    return {
      spots, names, pairs, complete, count: filled.length,
      patterns: [...patterns(filled), ...neighbors(spots, spread)],
      summary: complete ? SUMMARY[spread](spots.map(s => s.key), names) : null,
    };
  }

  // Any two cards, for the Combos tab.
  function combo(aId, bId) {
    const A = D.byId[aId], B = D.byId[bId], notes = [];
    notes.push(X.elements(A.element, B.element));
    if (A.major && B.major) {
      notes.push({ title: 'Two big cards', text: 'This is a major life theme, bigger than everyday choices.' });
    } else if (A.major || B.major) {
      const big = A.major ? A : B, small = A.major ? B : A;
      notes.push({ title: 'A big card with an everyday card',
        text: `${big.name} is the big life lesson; the ${small.name} shows how it plays out day to day.` });
    } else {
      if (A.suit === B.suit) notes.push({ title: `Both ${D.SUITS[A.suit].name}`,
        text: `Same suit, so this is all about ${D.SUITS[A.suit].about}.` });
      if (A.rank === B.rank) notes.push({ title: `Two ${PLURAL[A.rank]}`,
        text: `Same rank: ${D.RANKS[A.rank].long}, in two parts of life at once.` });
    }
    if (A.court && B.court) {
      notes.push({ title: 'Two people cards', text: 'Two people meeting, or two sides of the same person.' });
    } else if (A.court || B.court) {
      const court = A.court ? A : B, other = A.court ? B : A;
      notes.push({ title: 'A person', text: `The ${court.name} may be someone in their life, bringing the energy of ${other.major ? '' : 'the '}${other.name}.` });
    }
    return { A, B, famous: X.pair(aId, bId), notes, sentence: `first ${A.keys[0]}, then ${B.keys[0]}` };
  }

  return { analyze, combo, spotNames, keyOf, cap };
})();
