// The card decks to pick from (the Deck button at the top of the left screen). Each deck's pictures are in decks\<id>\:
// the 78 cards named like the classic deck's (m00 to m21, cups01 to cups14, ...), plus 280 x 480 copies in small\.
// cards.js describes the classic deck's pictures. The older decks below describe their own: `pics` for the big cards and
// the people cards, and the number cards by suit (old decks show just the suit signs on those, with no scene).
window.TAROT_DECKS = (() => {
  // ---- Shared by the old French and Italian decks (the "Marseille" family, from the 1600s on) ----
  const OLD_NAMES = {
    m00: 'Le Mat (the Fool)', m01: 'Le Bateleur (the street magician)', m02: 'La Papesse (the Popess)', m03: 'L’Impératrice',
    m04: 'L’Empereur', m05: 'Le Pape (the Pope)', m06: 'L’Amoureux (the Lover)', m07: 'Le Chariot', m08: 'La Force',
    m09: 'L’Hermite', m10: 'La Roue de Fortune', m11: 'La Justice', m12: 'Le Pendu (the Hanged One)', m13: 'No name, just XIII',
    m14: 'Tempérance', m15: 'Le Diable', m16: 'La Maison Dieu (the House of God)', m17: 'L’Étoile', m18: 'La Lune',
    m19: 'Le Soleil', m20: 'Le Jugement', m21: 'Le Monde',
  };
  // In these decks Justice is VIII and Strength XI (the classic deck swapped them in 1909).
  const OLD_NUMBERS = { m08: 'XI', m11: 'VIII' };
  const OLD_PICS = {
    m00: 'A wanderer in a jester’s cap walks off with a stick and a bundle on a pole, while an animal tugs at his trousers from behind.',
    m01: 'A young street magician in a wide hat stands at a table of cups, coins and a knife, holding up a little wand.',
    m02: 'A seated woman in a papal crown and robes holds an open book in her lap.',
    m03: 'A crowned empress sits facing you with a scepter and a shield with an eagle on it.',
    m04: 'The emperor sits sideways in a tall crown, holding a scepter, with his eagle shield at his feet.',
    m05: 'The Pope sits between two pillars, raising a hand in blessing over two small kneeling figures.',
    m06: 'A young man stands between two women as if choosing, while Cupid aims an arrow from above.',
    m07: 'A crowned prince rides in a canopied chariot pulled by two horses.',
    m08: 'A woman in a wide hat calmly opens a lion’s jaws with her hands.',
    m09: 'An old man in a long hooded robe holds up a lantern and leans on a staff.',
    m10: 'A wheel with a crowned creature on top, while two animals ride its rim, one going up and one going down.',
    m11: 'A crowned woman sits on a throne holding a sword upright and a set of scales.',
    m12: 'A young man hangs upside down by one foot from a bar between two trees, his hands behind his back.',
    m13: 'A skeleton swings a scythe across ground scattered with heads, hands and feet. The card has no name.',
    m14: 'A winged angel pours water from one jug into another.',
    m15: 'A winged, horned devil holding a torch stands on a pedestal, with two small horned figures tied to it below.',
    m16: 'A blast of fire from the sky knocks the top off a tower, and a man falls headfirst, under a rain of colored balls.',
    m17: 'A naked woman kneels by a stream pouring water from two jugs, under one big star and seven small ones.',
    m18: 'A moon with a face drips drops onto two dogs howling between two towers, while a crayfish climbs out of a pond.',
    m19: 'A big sun with a face shines drops down on two children holding each other in front of a low wall.',
    m20: 'An angel in the clouds blows a trumpet with a flag, and people rise from a grave with their hands joined.',
    m21: 'A dancing woman inside an oval wreath, with an angel, an eagle, a lion and a bull in the four corners.',
  };
  // A trick for remembering each big card that works in any of the old decks.
  const OLD_TIPS = {
    m00: 'He has no number (or zero) and he’s off with his bundle: pure beginner’s freedom, wherever the road goes.',
    m01: 'Everything he needs is on his table: a beginner with every tool, about to start.',
    m02: 'Her book is open but she isn’t reading it to you: she knows more than she says.',
    m03: 'She faces you openly, full of life: Mother Nature on a throne.',
    m04: 'Seated sideways like a profile on a coin: the man in charge, the rules, the structure.',
    m05: 'He teaches the two small figures below him: tradition, and what’s handed down.',
    m06: 'Torn between two people, with Cupid about to decide: love, and a choice of the heart.',
    m07: 'Two horses and one driver keeping them together: willpower that moves forward.',
    m08: 'She opens a lion’s jaws with her bare hands, gently: strength that doesn’t need to fight.',
    m09: 'Alone with his lantern, he looks for his own light: time to step back and think.',
    m10: 'One animal rises while the other falls: luck goes round and round.',
    m11: 'Scales to weigh it fairly, a sword to decide it cleanly: fairness and truth.',
    m12: 'Hanging upside down, he sees everything differently: a pause, and a new point of view.',
    m13: 'The card with no name cuts away the old so something new can grow: an ending, not death.',
    m14: 'Pouring just the right amount from jug to jug: balance and patience.',
    m15: 'The two below are tied loosely: they could slip free if they wanted to.',
    m16: 'The top of the tower is blown off in a flash: a sudden shake-up.',
    m17: 'After the tower falls, a calm night of stars and water: hope.',
    m18: 'Dogs howl at a strange moon: nothing is quite what it seems at night.',
    m19: 'Two kids together in the sunshine: joy, warmth and success.',
    m20: 'The trumpet calls and everyone rises: wake up, answer the call.',
    m21: 'The dancer in her wreath, with the whole world in the four corners: completion.',
  };
  const PEOPLE = { 11: 'Valet', 12: 'Cavalier', 13: 'Reine', 14: 'Roi' };
  const SUIT_FR = { wands: 'Bâton', cups: 'Coupe', swords: 'Épée', pentacles: 'Deniers' };
  const NUM = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
  const plural = { wands: 'staffs', cups: 'cups', swords: 'swords', pentacles: 'coins' };
  // The number cards of the old decks: the suit signs in a pattern, with leaves and flowers.
  function oldPip(c) {
    const n = c.rank, odd = n % 2 === 1;
    if (n === 1) return {
      wands: 'A hand comes out of a cloud holding up one big club, with little flames falling around it.',
      cups: 'One big, ornate golden cup, like a little castle or church.',
      swords: 'A hand comes out of a cloud holding up a sword whose tip goes through a crown with leafy branches.',
      pentacles: 'One big golden coin with a flower in its center, framed by leafy vines.',
    }[c.suit];
    const word = NUM[n][0].toUpperCase() + NUM[n].slice(1);
    return {
      wands: `${word} long staffs crossed in a woven X, with leaves and flowers growing between them${odd ? ', and one more standing straight up the middle' : ''}.`,
      cups: `${word} golden cups set in rows among leafy stems and flowers.`,
      swords: `${word} curved blades woven into an oval, with flowers at the corners${odd ? ', and one straight sword down the middle' : ''}.`,
      pentacles: `${word} golden coins with flowers in their centers, set in a pattern and linked by vines.`,
    }[c.suit] + ' There’s no scene: read it from its suit and its number.';
  }
  // People cards a deck doesn't describe one by one: who's on it, and their suit sign.
  function oldCourt(c) {
    const sign = { wands: 'a big club', cups: 'a cup', swords: 'a sword', pentacles: 'a coin' }[c.suit];
    return { 11: `A young page stands in a field holding ${sign}.`, 12: `A rider on horseback holds up ${sign}.`,
      13: `A crowned queen sits holding ${sign}.`, 14: `A crowned king sits on his throne holding ${sign}.` }[c.rank];
  }
  function oldName(c) {
    if (c.major) return OLD_NAMES[c.id];
    const s = SUIT_FR[c.suit], of = /^[ÉA-Z]/.test(s) && /^[ÉAEIOU]/.test(s) ? 'd’' : 'de ';
    return `${c.rank > 10 ? PEOPLE[c.rank] : c.rank === 1 ? 'As' : c.rank} ${of}${s}`;
  }
  // The Italian decks' names.
  const IT_NAMES = {
    m00: 'Il Matto (the Fool)', m01: 'Il Bagatto (the juggler)', m02: 'La Papessa', m03: 'L’Imperatrice', m04: 'L’Imperatore',
    m05: 'Il Papa', m06: 'Gli Amanti', m07: 'Il Carro', m08: 'La Forza', m09: 'L’Eremita', m10: 'La Ruota della Fortuna',
    m11: 'La Giustizia', m12: 'L’Appeso', m13: 'La Morte', m14: 'La Temperanza', m15: 'Il Diavolo', m16: 'La Torre',
    m17: 'Le Stelle', m18: 'La Luna', m19: 'Il Sole', m20: 'Il Giudizio', m21: 'Il Mondo',
  };
  const IT_PEOPLE = { 11: 'Fante', 12: 'Cavallo', 13: 'Regina', 14: 'Re' };
  const IT_SUIT = { wands: 'Bastoni', cups: 'Coppe', swords: 'Spade', pentacles: 'Denari' };
  const itName = c => c.major ? IT_NAMES[c.id] : `${c.rank > 10 ? IT_PEOPLE[c.rank] : c.rank === 1 ? 'Asso' : c.rank} di ${IT_SUIT[c.suit]}`;

  const old = extra => ({ names: OLD_NAMES, numbers: OLD_NUMBERS, pics: OLD_PICS, tips: OLD_TIPS, pip: oldPip, court: oldCourt, localName: oldName, ...extra });

  return [
    {
      id: 'classic', name: 'Classic', made: 'London, 1909', sample: 'm01',
      by: 'Pamela Colman Smith, for A. E. Waite (the Rider-Waite-Smith deck)',
      about: 'The deck most people learn on, and the one this app’s lessons describe: every card, even the number cards, has a scene to read.',
    },
    old({
      id: 'marseille', name: 'French', made: 'Paris, about 1890', sample: 'm01', lang: 'French',
      by: 'Lequart, Paris, after the Arnoult tarot of 1748. Scanned by the Bibliothèque nationale de France.',
      about: 'A hand-colored French tarot of the old "Marseille" kind, the deck tarot readers used for centuries before the classic one. Its number cards have no scenes, just the suit signs, so you read them from their suit and number. Like other decks from eastern France, card II is Juno instead of the Popess, and card V is Jupiter instead of the Pope.',
      names: { ...OLD_NAMES, m02: 'Junon (Juno)', m05: 'Jupiter' },
      tips: {
        ...OLD_TIPS,
        m02: 'Juno, queen of the gods, points up to the heavens: she knows what lies above, and keeps it to herself.',
        m05: 'Jupiter, king of the gods, rules from the clouds: the higher authority whose rules come down to us.',
      },
      pics: {
        ...OLD_PICS,
        m02: 'Juno, queen of the Roman gods, points up to the sky with a long scarf billowing behind her, and her peacock at her feet. (Most old decks put the Popess here.)',
        m03: 'A crowned empress with wings sits facing you, holding a scepter, with a shield with an eagle on it.',
        m05: 'Jupiter, king of the Roman gods, stands on an eagle above the clouds holding thunderbolts, a long scarf wrapped around him. (Most old decks put the Pope here.)',
        m06: 'A young man stands between two women as if choosing, while Cupid aims his arrow from a blazing sun above.',
        m07: 'A crowned prince rides in a canopied chariot pulled by two horses, one red and one white.',
        m10: 'A wheel with a crowned sphinx holding a sword on top, while two animals ride its rim, one going up and one going down.',
        m17: 'A naked woman kneels by a stream pouring water from two jugs, under one big star and seven small ones, with a bird in a tree behind her.',
        wands11: 'A young man in a big hat stands in a field, both hands on a tall green club planted beside him.',
        wands12: 'A rider in a wide hat on a cream horse holds up a green club.',
        wands13: 'A crowned queen sits holding a big green club against her shoulder.',
        wands14: 'A king in a hat-crown and armor sits on his throne holding a long green club.',
        cups11: 'A young man in a flower crown walks along holding a cup in one hand and its lid in the other.',
        cups12: 'A rider on a white horse holds a golden cup out in front of him.',
        cups13: 'A crowned queen holds up a tall covered cup in one hand and a sword in the other.',
        cups14: 'A bearded king in a big hat-crown sits holding a golden cup.',
        swords11: 'A young man in a big hat and long cloak stands in a field holding a sword.',
        swords12: 'An armored rider on a gray horse holds his sword up high.',
        swords13: 'A crowned queen sits holding a sword upright, her other hand across her middle.',
        swords14: 'A king in armor and a big hat-crown sits on his throne holding a sword upright.',
        pentacles11: 'A young man in a wide hat stands holding up one coin, with another on the ground at his feet.',
        pentacles12: 'A rider with a long club over his shoulder, with a coin floating in the air ahead of him.',
        pentacles13: 'A queen in a tall hat stands in profile holding up a coin and a scepter.',
        pentacles14: 'A bearded king in a wide hat sits sideways on a bench, holding a coin.',
      },
      pips: { cups02: 'Two cups below a tall flowering stem with two dolphins at the top, and a royal shield with lilies at the bottom. There’s no scene: read it from its suit and its number.',
        pentacles02: 'Two coins linked by a long ribbon shaped like an S, with the maker’s name (Arnoult) and the year 1748 on it. There’s no scene: read it from its suit and its number.' },
    }),
    old({
      id: 'miniature', name: 'Miniature', made: 'Paris, late 1800s, painted by hand', sample: 'm01', lang: 'French',
      by: 'A small tarot drawn in ink and painted with watercolors by an unknown hand in Paris, copying the Arnoult tarot of 1748. Scanned by the Bibliothèque nationale de France.',
      about: 'Not printed at all: someone drew and painted all 78 cards by hand, copying the same 1748 Arnoult tarot the French deck was printed from, so it has Juno and Jupiter too, in softer watercolor. Its number cards show just the suit signs, so you read them from their suit and number.',
      names: { ...OLD_NAMES, m02: 'Junon (Juno)', m05: 'Jupiter' },
      tips: {
        ...OLD_TIPS,
        m02: 'Juno, queen of the gods, points up to the heavens: she knows what lies above, and keeps it to herself.',
        m05: 'Jupiter, king of the gods, rules from the clouds: the higher authority whose rules come down to us.',
      },
      pics: {
        ...OLD_PICS,
        m02: 'Juno, queen of the Roman gods, points up to the sky with a scarf billowing behind her and her peacock at her feet. (Most old decks put the Popess here.)',
        m05: 'Jupiter, king of the Roman gods, stands on an eagle above the clouds holding thunderbolts. (Most old decks put the Pope here.)',
        m06: 'A young man stands between two women as if choosing, while Cupid aims his arrow from a blazing sun above.',
        m17: 'A naked woman kneels by a stream pouring water from two jugs, under one big star and seven small ones, with a bird in a tree behind her.',
      },
      pips: {
        cups02: 'Two cups below a flowering stem with two dolphins at the top, and a royal shield with lilies at the bottom. There’s no scene: read it from its suit and its number.',
        pentacles02: 'Two coins linked by a long ribbon shaped like an S, with the name Arnoult and the year 1748 on it. There’s no scene: read it from its suit and its number.',
        pentacles04: 'Four coins around a shield with three lilies. There’s no scene: read it from its suit and its number.',
      },
    }),
    old({
      id: 'conver', name: 'Marseille', made: 'France, 1890s, after Conver (1760)', sample: 'm01', lang: 'French',
      by: 'Printed in the 1890s from Nicolas Conver’s Marseille design of 1760, and once owned by Paul Marteau, the great tarot collector. Scanned by the Bibliothèque nationale de France.',
      about: 'The Tarot de Marseille itself: Nicolas Conver’s 1760 design, the one most French readers still use today, hand-colored in red, blue, yellow and green. A past owner penciled Hebrew letters and French words on the big cards (Force, mort, Synthèse), the way occult tarot students marked their decks around 1900. Its number cards show just the suit signs, so you read them from their suit and number.',
      pics: {
        ...OLD_PICS,
        m06: 'A young man stands between two women as if choosing, while Cupid aims his arrow from a blazing sun above.',
        m10: 'A wheel with a crowned sphinx holding a sword on top, while two animals ride its rim, one going up and one going down.',
        m17: 'A naked woman kneels by a stream pouring water from two jugs, under one big star and seven small ones, with a bird in a tree behind her.',
      },
      pips: {
        cups02: 'Two cups below a tall flowering stem with two dolphins at the top, and a royal shield with lilies at the bottom. There’s no scene: read it from its suit and its number.',
        pentacles02: 'Two coins linked by a long ribbon shaped like an S, with the maker’s name and the year 1760 on it. There’s no scene: read it from its suit and its number.',
      },
    }),
    old({
      id: 'vieville', name: 'Viéville', made: 'Paris, about 1650', sample: 'm19', lang: 'French',
      by: 'Jacques Viéville, card maker in Paris. One of the oldest complete tarots in the world, scanned by the Bibliothèque nationale de France.',
      about: 'One of the oldest complete tarots there is, and one of the strangest. Its pictures are mirror images of the usual ones. Justice is card VII and the Chariot VIII. The Tower is a tree struck by lightning, the Star an old astronomer, the Moon a woman spinning thread, and the Sun a child on a white horse with a banner. Its number cards show just the suit signs.',
      names: {}, localName: null,
      numbers: { m11: 'VII', m07: 'VIII', m08: 'IX', m09: 'XI' },
      tips: {
        ...OLD_TIPS,
        m09: 'An old man in his hooded robe, alone with his thoughts: time to step back and think.',
        m15: 'A wild green devil: temptation, and whatever has a hold on you.',
        m16: 'Lightning strikes the tree out of nowhere: a sudden shake-up.',
        m17: 'An old astronomer looks up at his star: hope, and a sense of where you’re headed.',
        m18: 'A woman spins thread by moonlight: quiet hours when things aren’t clear yet.',
        m19: 'A child rides out under the sun with a banner: joy and success, out in the open.',
      },
      pics: {
        ...OLD_PICS,
        m00: 'A wanderer walks off with a stick and a bundle over his shoulder, a dog at his heels.',
        m03: 'A crowned empress with wings sits holding a scepter and a shield with an eagle on it.',
        m04: 'The emperor in a big hat sits sideways holding a scepter, with his eagle shield at his feet.',
        m06: 'Cupid aims down from a blazing sun at a young man standing between two women.',
        m07: 'A crowned driver stands in a canopied chariot, with the two horses’ heads peeking out below. (Card VIII in this deck.)',
        m08: 'A woman in a wide hat calmly holds a lion’s jaws. (Card IX in this deck.)',
        m09: 'An old bearded man in a long robe and hood: the Hermit. (Card XI in this deck.)',
        m11: 'A winged woman in a crown sits holding a sword upright and a set of scales. (Card VII in this deck.)',
        m12: 'The Hanged Man, printed the other way up: the bar between the two trees is at the bottom, so he seems to stand on one leg.',
        m13: 'A skeleton with a scythe, with plants growing at its feet.',
        m14: 'A crowned woman pours water from a jug into a vase and holds a tall staff, with a banner floating beside her.',
        m15: 'A green devil with bat wings, horns and a long tail.',
        m16: 'Lightning from the sky strikes a tree instead of a tower, and a man below throws up his arms, under a rain of drops.',
        m17: 'An old bearded man in a chair points up at one huge star, with smaller stars and a city behind him.',
        m18: 'A moon with a face drips drops over a woman spinning thread with a distaff, beside a tree.',
        m19: 'A child rides a white horse under a big sun with a face, carrying a long red banner.',
        m20: 'An angel blows a trumpet from the clouds as people rise from their graves.',
        m21: 'A figure stands inside an oval wreath, with an angel, an eagle, a lion and a bull around it.',
      },
      pips: {
        pentacles01: 'One big golden coin with a flower in its center, between two French verses printed above and below it. There’s no scene: read it from its suit and its number.',
        pentacles02: 'Two coins linked by an S-shaped ribbon with the maker’s name: Iaques Vieville a Paris. There’s no scene: read it from its suit and its number.',
        cups02: 'Two cups under a flowering stem with two dolphins, above a little French verse. There’s no scene: read it from its suit and its number.',
      },
    }),
    old({
      id: 'piedmont', name: 'Italian', made: 'Genoa, 1865', sample: 'm01', lang: 'Italian',
      by: 'F. F. Solesio, Genoa: a tarot of the Piedmont kind, stenciled by hand in red, blue, green and yellow.',
      about: 'An Italian tarot from the 1800s, close cousin of the old French decks, with every card’s name printed in Italian. Like them, its number cards show just the suit signs: read them from their suit and number.',
      names: { ...IT_NAMES, m07: 'La Carossa (the carriage)', m13: 'No name, just XIII' },
      localName: itName,
      pics: {
        ...OLD_PICS,
        m07: 'A crowned prince rides in a canopied carriage pulled by two horses. (This deck calls it La Carossa, the carriage.)',
        m16: 'A blast of fire from the sky knocks the crown-shaped top off a tower, and a man falls out headfirst.',
        m17: 'A naked woman kneels by the water pouring from two jugs, under one big star and seven small ones.',
      },
      pips: {
        cups02: 'Two cups under a tall flowering stem with two dragon heads at the top, and the maker’s name: F. F. Solesio, Genova. There’s no scene: read it from its suit and its number.',
        pentacles02: 'Two big golden coins with flowers in their centers, one above the other. There’s no scene: read it from its suit and its number.',
      },
    }),
    {
      id: 'solabusca', name: 'Sola Busca', made: 'Italy, about 1491', sample: 'swords03', nameLabel: 'On the card',
      by: 'Engraved and hand-colored in Ferrara or Venice in the 1490s. This copy is in the Pinacoteca di Brera, Milan.',
      about: 'The oldest complete tarot deck in the world, and the first where every number card has a picture. Four hundred years later, Pamela Colman Smith saw it in London and borrowed from it for the classic deck: its Three of Swords is the same heart pierced by three swords. Its big cards are different, though: heroes of ancient Rome and the Bible instead of the Fool, the Magician and the rest, so read them by their number.',
      names: { m00: 'Mato', m01: 'Panfilio', m02: 'Postumio', m03: 'Lenpio', m04: 'Mario', m05: 'Catulo', m06: 'Sesto',
        m07: 'Deo Tauro', m08: 'Nerone', m09: 'Falco', m10: 'Venturio', m11: 'Tulio', m12: 'Carbone', m13: 'Catone',
        m14: 'Bocho', m15: 'Metelo', m16: 'Olivo', m17: 'Ipeo', m18: 'Lentulo', m19: 'Sabino', m20: 'Nenbroto',
        m21: 'Nabuchodenasor' },
      localName: () => '',
      tips: {}, tipPrefix: 'In the classic deck: ',
      pics: Object.fromEntries([...Array(22)].map((_, i) => [`m${String(i).padStart(2, '0')}`, i === 0
        ? 'Mato, the fool: a ragged man with feathers in his hair, playing the bagpipes.'
        : 'One of this deck’s heroes from ancient Rome or the Bible, named at the top of the card, in place of the usual figure. Read it by its number and its meaning.'])),
      pips: { swords03: 'A big heart pierced by three swords: the picture the classic deck copied for its Three of Swords.' },
      pip: c => {
        const n = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'][c.rank];
        const sign = (c.rank === 1 ? { wands: 'staff', cups: 'cup', swords: 'sword', pentacles: 'coin' }
          : { wands: 'staffs', cups: 'cups', swords: 'swords', pentacles: 'coins' })[c.suit];
        return `${n} ${sign} in a little scene: the first deck ever to give every number card a picture.`;
      },
      court: c => `${{ 11: 'A page', 12: 'A knight on horseback', 13: 'A queen', 14: 'A king' }[c.rank]} from ancient history, named at the top of the card, with ${{ wands: 'a staff', cups: 'a cup', swords: 'a sword', pentacles: 'a coin' }[c.suit]}.`,
    },
  ];
})();
