// "Your chart, explained": a plain-English reading of the birth chart, for the printable guide
// (guide.html). It's assembled from your placements, so it stays right if the birth details change.
window.StarExplain = (() => {
  const { glyph, degreeInSign, natalAspects } = StarAstro;
  const ORD = ['', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];

  // What each planet is in you, a short name for it, and whether everyone your age shares its sign.
  const PLANET = {
    Sun: { what: 'Your core self: what makes you feel most like you, and where you want to shine.', short: 'core self' },
    Moon: { what: 'Your emotional side: what you need to feel safe, and how you react before you think.', short: 'emotional side' },
    Mercury: { what: 'How your mind works: how you think, learn, talk, and make sense of things.', short: 'mind' },
    Venus: { what: 'What you love and how you love: your taste, your pleasures, and how you show affection.', short: 'way of loving' },
    Mars: { what: 'Your drive: how you go after what you want, how you handle anger, and how you spend your energy.', short: 'drive' },
    Jupiter: { what: "Where you grow and get lucky: what you're generous with, and where you tend to overdo it.", short: 'optimism' },
    Saturn: { what: 'Where you work hardest and feel the most pressure: your rules, your fears, and your long-term lessons.', short: 'sense of duty' },
    Uranus: { what: 'Where you need freedom and do things your own way.', short: 'need for freedom', slow: true },
    Neptune: { what: 'Where you dream, idealize, and lose track of the edges.', short: 'imagination', slow: true },
    Pluto: { what: 'Where you go deep: power, control, and transformation.', short: 'intensity', slow: true },
    Ascendant: { what: "How you come across: the first impression you make, your style, the way you meet the world.", short: 'first impression' },
    Midheaven: { what: 'Your public direction: your career, your reputation, what you want to be known for.', short: 'public direction' },
  };

  // How each sign colors whatever planet sits in it.
  const SIGN = {
    Aries: { words: 'bold, direct and impatient', how: 'Aries energy is the starting spark: quick, brave and competitive, and allergic to waiting. It acts first and figures things out on the way.' },
    Taurus: { words: 'steady, sensual and stubborn', how: "Taurus energy is slow and solid: it wants comfort, beauty and things that last, and it doesn't like to be rushed." },
    Gemini: { words: 'curious, quick and restless', how: 'Gemini energy is curious and talkative: it wants variety, new information and someone to bounce ideas off. Boredom is its enemy.' },
    Cancer: { words: 'caring, protective and sensitive', how: 'Cancer energy is caring and protective: it wants a safe home base and its people close. Feelings run deep and come and go like the tide.' },
    Leo: { words: 'warm, proud and expressive', how: 'Leo energy is warm and big-hearted: it wants to create, to be seen and to be appreciated for it. Generous, loyal, sometimes dramatic.' },
    Virgo: { words: 'careful, helpful and precise', how: 'Virgo energy is careful and useful: it notices details, fixes what is broken and likes things done properly. It can be its own harshest critic.' },
    Libra: { words: 'fair, social and easygoing', how: 'Libra energy is about balance and other people: it wants fairness, beauty and smooth relationships, and it hates conflict.' },
    Scorpio: { words: 'intense, private and all-in', how: "Scorpio energy is deep and intense: it wants truth, loyalty and real closeness, and it doesn't do anything halfway." },
    Sagittarius: { words: 'adventurous, honest and optimistic', how: 'Sagittarius energy is adventurous and hopeful: it wants freedom, meaning, travel and big ideas, and it says exactly what it thinks.' },
    Capricorn: { words: 'ambitious, disciplined and practical', how: 'Capricorn energy is patient and ambitious: it plans for the long run, respects hard work and wants to build something that lasts.' },
    Aquarius: { words: 'independent, original and a little detached', how: 'Aquarius energy is independent and inventive: it thinks for itself, cares about the bigger picture and needs room to be different.' },
    Pisces: { words: 'dreamy, gentle and intuitive', how: 'Pisces energy is soft and imaginative: it feels everything, picks up on moods and drifts toward art, dreams and escape.' },
  };

  // Where each house puts a planet's energy in your life.
  const HOUSE = [null,
    { where: 'you yourself: your body, your style, how you start things', short: 'how you show up' },
    { where: 'money, possessions and what you value; your sense of security', short: 'money and what you value' },
    { where: 'your everyday mind: conversations, messages, learning, siblings and getting around', short: 'conversations and learning' },
    { where: 'home, family and your private life; your roots', short: 'home and family' },
    { where: 'romance, fun, creativity and play; what you do just because you love it', short: 'romance and creativity' },
    { where: 'daily work, routines and health; the habits that keep life running', short: 'daily work and routines' },
    { where: "partners: close relationships and the people you're one-on-one with", short: 'partners' },
    { where: 'intimacy, trust, shared money and the deep stuff: sex, loss and change', short: 'intimacy and trust' },
    { where: 'big ideas, beliefs, travel and study; what gives life meaning', short: 'big ideas and travel' },
    { where: 'career, reputation and your public life; where you are headed', short: 'career and reputation' },
    { where: 'friends, groups and your hopes for the future', short: 'friends and the future' },
    { where: 'rest, solitude and the hidden parts of you; what happens behind the scenes', short: 'rest and solitude' },
  ];

  const ELEMENT = {
    fire: { signs: ['Aries', 'Leo', 'Sagittarius'], is: 'energy, courage and action' },
    earth: { signs: ['Taurus', 'Virgo', 'Capricorn'], is: 'practical sense, patience and follow-through' },
    air: { signs: ['Gemini', 'Libra', 'Aquarius'], is: 'ideas, talk and other people' },
    water: { signs: ['Cancer', 'Scorpio', 'Pisces'], is: 'feelings, intuition and closeness' },
  };
  const elementOf = sign => Object.keys(ELEMENT).find(e => ELEMENT[e].signs.includes(sign));

  // What each angle between two of your planets is like, in a phrase and a closing thought.
  const BOND = {
    conjunction: ['are fused together', 'They act as one, for better and for worse.'],
    sextile: ['help each other', 'An opening that pays off when you use it.'],
    square: ['push against each other', 'Friction that keeps you moving and pushes you to grow.'],
    trine: ['flow together easily', 'A natural gift, easy to take for granted.'],
    opposition: ['pull in opposite directions', 'A balancing act between two sides of you.'],
  };
  const VERB = { conjunction: 'conjunct', sextile: 'sextile', square: 'square', trine: 'trine', opposition: 'opposite' };
  const name = id => id === 'Ascendant' ? 'Rising' : id;
  const cap = s => s[0].toUpperCase() + s.slice(1);

  // One placement, e.g. "Sun in Aries, 9th house", explained. Pass the same `told` object for each
  // placement in turn, so a sign or house that comes up again gets a short reminder rather than the
  // same paragraph twice.
  function placement(chart, id, told = { signs: {}, houses: {} }) {
    const p = chart.byId[id], pl = PLANET[id], sg = SIGN[p.sign];
    const angle = id === 'Ascendant' || id === 'Midheaven';
    const head = `${glyph(id)} ${name(id)} in ${p.sign}${angle ? '' : `, ${ORD[p.house]} house`}`;
    const parts = [pl.what];
    const before = told.signs[p.sign];
    parts.push(before ? `Like your ${name(before)}, it's in ${p.sign}: ${sg.words}.` : sg.how);
    told.signs[p.sign] = told.signs[p.sign] || id;
    if (!angle) {
      const with_ = told.houses[p.house];
      parts.push(with_
        ? `It shares your ${ORD[p.house]} house with your ${with_}, so it plays out there too: ${HOUSE[p.house].short}.`
        : `It plays out in your ${ORD[p.house]} house: ${HOUSE[p.house].where}.`);
      told.houses[p.house] = told.houses[p.house] || id;
    }
    if (pl.slow) {
      parts.push(told.slow ? 'Another generational one: again, the house is the personal part.'
        : 'Everyone born within a few years of you shares this sign, so the house is the personal part.');
      told.slow = true;
    }
    if (p.retrograde) {
      parts.push(told.retro ? 'It was also retrograde when you were born.'
        : 'It was retrograde when you were born: this side of you tends to work inward first, and you sort it out privately before it shows.');
      told.retro = true;
    }
    const sum = angle
      ? (id === 'Ascendant'
        ? `People meet the ${p.sign} side of you first: ${sg.words}.`
        : `In short: your career path suits a ${p.sign} style: ${sg.words}.`)
      : `In short: your ${pl.short} is ${sg.words}, and it comes out through ${HOUSE[p.house].short}.`;
    return { head, pos: `${degreeInSign(p.lon).text} ${p.sign}`, text: parts.join(' '), sum };
  }

  // Which elements your personal planets (and rising sign) lean toward.
  function balance(chart) {
    const ids = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Ascendant'];
    const count = { fire: 0, earth: 0, air: 0, water: 0 };
    for (const id of ids) count[elementOf(chart.byId[id].sign)]++;
    const order = Object.keys(count).sort((a, b) => count[b] - count[a]);
    const strong = order.filter(e => count[e] === count[order[0]]);
    const weak = order.filter(e => count[e] <= 1);
    const list = es => es.length > 1 ? `${es.slice(0, -1).join(', ')} and ${es[es.length - 1]}` : es[0];
    let text = `Your chart leans ${list(strong)}: ${strong.map(e => ELEMENT[e].is).join('; ')}. That's where you're most at home.`;
    if (weak.length) text += ` There's less ${list(weak)} (${weak.map(e => ELEMENT[e].is).join('; ')}), so that side takes more conscious effort, or comes from the people around you.`;
    return { count, text };
  }

  // Angles between your own planets: the patterns you were born with. The slow outer planets'
  // angles with each other are the same for everyone born around then, so they're listed apart.
  function patterns(chart) {
    const meaning = id => PLANET[id].short;
    return natalAspects(chart).map(a => {
      const slow = PLANET[a.a].slow && PLANET[a.b].slow;
      const [bond, close] = BOND[a.aspect];
      return {
        slow,
        head: `${glyph(a.a)} ${a.a} ${VERB[a.aspect]} ${glyph(a.b)} ${a.b}`,
        text: `Your ${meaning(a.a)} and your ${meaning(a.b)} ${bond}. ${close}`,
      };
    });
  }

  // The houses holding the most planets.
  function gathering(chart) {
    const weight = { Sun: 3, Moon: 3, Mercury: 2, Venus: 2, Mars: 2, Jupiter: 1, Saturn: 1, Uranus: 0.5, Neptune: 0.5, Pluto: 0.5 };
    const per = {};
    for (const p of chart.points) if (weight[p.id]) (per[p.house] = per[p.house] || []).push(p.id);
    const top = Object.keys(per).map(Number)
      .sort((a, b) => per[b].reduce((s, id) => s + weight[id], 0) - per[a].reduce((s, id) => s + weight[id], 0) || a - b).slice(0, 2);
    return top.map(h => ({ head: `${cap(ORD[h])} house: ${per[h].map(id => `${glyph(id)} ${id}`).join(', ')}`,
      text: `So this part of life gets extra weight for you: ${HOUSE[h].where}.` }));
  }

  return { placement, balance, patterns, gathering, SIGN, HOUSE };
})();
