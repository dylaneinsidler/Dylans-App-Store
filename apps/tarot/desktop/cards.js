// All 78 cards, in plain English: what each one means right side up and upside down, what's in the
// picture, a trick for remembering it, and something you could say about it in a reading.
// Also the four suits, the ranks (Ace to King), and which element each big card belongs to.
//
// Each card:  c(id, name, keywords, meaning, upside-down keywords, upside-down meaning, picture, memory trick, "say it")
// Meanings are written to follow "it means ..." or "points to ...", so the reading screens can build sentences with them.
window.TAROT_DATA = (() => {
  const SUITS = {
    wands: {
      name: 'Wands', element: 'Fire', short: 'energy', symbol: '🜂',
      about: 'energy, passion, ambition and action',
    },
    cups: {
      name: 'Cups', element: 'Water', short: 'feelings', symbol: '🜄',
      about: 'feelings, love, friendship and intuition',
    },
    swords: {
      name: 'Swords', element: 'Air', short: 'thoughts', symbol: '🜁',
      about: 'thoughts, words, decisions, conflict and truth',
    },
    pentacles: {
      name: 'Pentacles', element: 'Earth', short: 'money & work', symbol: '🜃',
      about: 'money, work, home, health and the body',
    },
  };

  // Index 1 to 14: Ace to Ten, then Page, Knight, Queen, King.
  const RANKS = [null,
    { name: 'Ace', short: 'a start', long: 'a beginning: a seed, a new chance' },
    { name: 'Two', short: 'a choice or a pair', long: 'a choice, a balance, or a partnership' },
    { name: 'Three', short: 'growth', long: 'growth: the first results, often with other people' },
    { name: 'Four', short: 'stability', long: 'stability: things settle down (sometimes too much)' },
    { name: 'Five', short: 'trouble', long: 'trouble: conflict, loss or a challenge' },
    { name: 'Six', short: 'recovery', long: 'recovery: harmony comes back, things get easier' },
    { name: 'Seven', short: 'a test', long: 'a test: time to stop and think, choose, or stand firm' },
    { name: 'Eight', short: 'movement', long: 'movement: progress, change or mastery' },
    { name: 'Nine', short: 'almost there', long: 'almost there: nearly complete, the peak' },
    { name: 'Ten', short: 'the end of a cycle', long: 'the end of a cycle: complete, or more than enough' },
    { name: 'Page', short: 'a learner', long: 'a learner: curious, young at heart, or a message' },
    { name: 'Knight', short: 'charging ahead', long: 'charging ahead: action and movement, sometimes too much' },
    { name: 'Queen', short: 'caring mastery', long: 'mastery on the inside: caring, wise, understanding' },
    { name: 'King', short: 'in charge', long: 'mastery on the outside: leading, in control' },
  ];

  // The big cards' elements (for combos) and star links, from the traditional Golden Dawn pairings.
  const MAJOR_INFO = {
    m00: ['Air', 'Uranus'], m01: ['Air', 'Mercury'], m02: ['Water', 'the Moon'], m03: ['Earth', 'Venus'],
    m04: ['Fire', 'Aries'], m05: ['Earth', 'Taurus'], m06: ['Air', 'Gemini'], m07: ['Water', 'Cancer'],
    m08: ['Fire', 'Leo'], m09: ['Earth', 'Virgo'], m10: ['Fire', 'Jupiter'], m11: ['Air', 'Libra'],
    m12: ['Water', 'Neptune'], m13: ['Water', 'Scorpio'], m14: ['Fire', 'Sagittarius'], m15: ['Earth', 'Capricorn'],
    m16: ['Fire', 'Mars'], m17: ['Air', 'Aquarius'], m18: ['Water', 'Pisces'], m19: ['Fire', 'the Sun'],
    m20: ['Fire', 'Pluto'], m21: ['Earth', 'Saturn'],
  };

  const CARDS = [];
  function c(id, name, keys, up, revKeys, rev, pic, tip, say) {
    const card = { id, keys, up, revKeys, rev, pic, tip, say };
    if (id[0] === 'm' && /^m\d\d$/.test(id)) {
      card.major = true;
      card.n = Number(id.slice(1));
      card.name = name;
      [card.element, card.astro] = MAJOR_INFO[id];
    } else {
      card.major = false;
      card.suit = id.replace(/\d+$/, '');
      card.rank = Number(id.match(/\d+$/)[0]);
      card.name = `${RANKS[card.rank].name} of ${SUITS[card.suit].name}`;
      card.element = SUITS[card.suit].element;
      card.court = card.rank > 10;
    }
    CARDS.push(card);
  }

  // ---------------- The big cards (Major Arcana) ----------------

  c('m00', 'The Fool', ['new beginnings', 'a leap of faith', 'freedom'],
    'a brand-new start: jumping in with an open heart, trusting it will work out even without a plan',
    ['recklessness', 'holding back', 'naivety'],
    'being reckless, or being so scared of the leap that you never take it',
    'A young traveler steps toward the edge of a cliff, gazing at the sky, holding a white rose and a small bag, while a little dog jumps at his heels.',
    'The Fool is about to step off a cliff and doesn’t care: pure beginner’s courage.',
    'You’re at the start of something new. It might feel like jumping without a parachute, but this card says take the leap.');

  c('m01', 'The Magician', ['willpower', 'skill', 'making it happen'],
    'having everything you need to make something happen, and the focus to do it',
    ['manipulation', 'wasted talent', 'scattered'],
    'tricks and manipulation, or real talent that’s being wasted',
    'A man points one hand to the sky and one to the ground. On his table: a cup, a wand, a sword and a pentacle, one of each suit.',
    'All four suits are on his table: he has every tool he needs, and he’s using them.',
    'You have the skills and resources you need right now. This is a time to act, not wait.');

  c('m02', 'The High Priestess', ['intuition', 'secrets', 'inner knowing'],
    'trusting your gut and the quiet voice inside, and something hidden that will come out in time',
    ['ignored intuition', 'secrets', 'disconnection'],
    'ignoring your gut, or secrets and hidden agendas getting in the way',
    'A calm woman sits between a black pillar and a white pillar, holding a scroll half-hidden in her robe. A curtain behind her hides what lies beyond.',
    'She keeps the scroll half-hidden: she knows things she isn’t saying out loud.',
    'You already know more than you’re admitting. Get quiet and listen to your gut.');

  c('m03', 'The Empress', ['nurturing', 'abundance', 'creativity'],
    'growth, comfort and plenty: caring for others, creating something, or a time when things bloom',
    ['neglect', 'smothering', 'creative block'],
    'smothering others or neglecting yourself, or a creative block',
    'A relaxed woman sits on cushions in a lush field of wheat beside a forest and a waterfall, with a heart-shaped shield at her side.',
    'She’s Mother Nature: everything around her is growing.',
    'This is a time for growth. Something you’re nurturing (a project, a relationship, yourself) is about to bloom.');

  c('m04', 'The Emperor', ['structure', 'authority', 'stability'],
    'order, rules and leadership: taking charge, setting boundaries, or a strong father-like figure',
    ['control', 'rigidity', 'chaos'],
    'being too controlling or rigid, or a lack of discipline',
    'A stern king in armor sits on a stone throne carved with rams’ heads, with bare red mountains behind him.',
    'Stone throne, armor, mountains: nothing about him moves. He is the rules.',
    'This situation needs structure. Make a plan, set some boundaries, and take charge.');

  c('m05', 'The Hierophant', ['tradition', 'teachers', 'belonging'],
    'doing things the traditional way: a teacher or mentor, an institution, shared beliefs, sometimes marriage',
    ['rebellion', 'new ways', 'questioning'],
    'breaking with tradition, rebelling, or questioning the rules',
    'A religious leader raises his hand in blessing over two followers kneeling before him. Two crossed keys lie at his feet.',
    'He’s the teacher at the front of the room, handing down the rules.',
    'There’s wisdom in doing this the established way, or in asking someone who’s done it before.');

  c('m06', 'The Lovers', ['love', 'connection', 'choices'],
    'a deep connection or relationship, and choices made from the heart that match your values',
    ['disharmony', 'misalignment', 'temptation'],
    'disconnection, imbalance in a relationship, or a choice that goes against your values',
    'A naked man and woman stand beneath an angel in the sky. Behind her is a tree with a snake; behind him, a tree of flames.',
    'Two people and a choice, blessed from above: love, and choosing what matters.',
    'This is about a real connection, and choosing with your heart. What matters most to you here?');

  c('m07', 'The Chariot', ['drive', 'willpower', 'victory'],
    'pushing forward with determination, and winning through focus and self-control',
    ['no direction', 'aggression', 'stalled'],
    'losing direction, being pulled two ways at once, or trying to force things',
    'A warrior stands in a chariot pulled by a black sphinx and a white sphinx. He holds no reins: he steers by willpower alone.',
    'Two sphinxes pulling different ways, and he still drives forward: that’s willpower.',
    'You can win this if you stay focused. Keep your eyes on where you’re going.');

  c('m08', 'Strength', ['courage', 'patience', 'gentle strength'],
    'inner strength: courage, patience and compassion, handling something wild with a calm, gentle hand',
    ['self-doubt', 'low energy', 'losing your temper'],
    'self-doubt and low energy, or letting fear or anger take over',
    'A woman calmly closes a lion’s mouth with her bare hands. An infinity sign floats above her head.',
    'She tames a lion by being gentle, not by fighting it.',
    'You’re stronger than you think. Stay calm and kind, and you’ll handle this.');

  c('m09', 'The Hermit', ['soul-searching', 'solitude', 'inner guidance'],
    'stepping back to be alone and think, looking inward for answers, or finding a wise guide',
    ['isolation', 'loneliness', 'withdrawal'],
    'cutting yourself off too much, loneliness, or avoiding the inner work',
    'An old man in a gray cloak stands alone on a snowy mountaintop, holding up a lantern with a star inside it.',
    'Alone on a mountain with a lantern: he’s searching for his own light.',
    'You need some quiet time on your own to figure out what you really want.');

  c('m10', 'Wheel of Fortune', ['change', 'cycles', 'luck'],
    'a turning point: luck, fate and life’s ups and downs. Things are changing, often for the better',
    ['bad luck', 'resisting change', 'repeating patterns'],
    'a run of bad luck, fighting change, or feeling stuck in the same cycle',
    'A great wheel turns in the sky, carrying a snake, a sphinx and a jackal-headed figure. Four winged creatures read books in the corners.',
    'A wheel always turns: what’s down comes up, and what’s up comes down.',
    'Things are shifting. A turning point is coming, so be ready to roll with it.');

  c('m11', 'Justice', ['fairness', 'truth', 'cause and effect'],
    'fairness, honesty and consequences: the truth comes out, decisions are made fairly, or legal matters',
    ['unfairness', 'dishonesty', 'avoiding blame'],
    'unfairness or dishonesty, or dodging responsibility',
    'A judge sits between two pillars, holding a double-edged sword upright in one hand and balanced scales in the other.',
    'Scales and a sword: weigh it fairly, then cut cleanly.',
    'What goes around comes around here. Be honest and fair, and it will work out fairly.');

  c('m12', 'The Hanged Man', ['pause', 'letting go', 'new perspective'],
    'a pause: letting go, waiting, and seeing things from a new angle',
    ['stalling', 'resistance', 'indecision'],
    'stalling, or fighting a pause you really need',
    'A man hangs upside down by one foot from a living tree, hands behind his back. He looks calm, and a glowing halo surrounds his head.',
    'He’s hanging upside down on purpose, and his halo glows: a new point of view brings insight.',
    'Don’t force this right now. Pause, let go a little, and look at it from another angle.');

  c('m13', 'Death', ['endings', 'transformation', 'transition'],
    'an ending that makes room for something new: a chapter closing, a big change (almost never actual death)',
    ['resisting change', 'stuck', 'fear of endings'],
    'resisting an ending that needs to happen, or being stuck and afraid to let go',
    'A skeleton in black armor rides a white horse, carrying a flag with a white rose. A king has fallen before him; in the distance, the sun rises between two towers.',
    'Behind the skeleton, the sun is rising: an ending clears the way for a new day.',
    'This card is about an ending, not a death. Something is finishing so something new can begin.');

  c('m14', 'Temperance', ['balance', 'moderation', 'patience'],
    'balance and moderation: blending things together, patience, finding the middle way',
    ['imbalance', 'excess', 'impatience'],
    'imbalance and excess, going to extremes, or rushing',
    'An angel stands with one foot on land and one in the water, pouring water between two cups. A path leads to a sunrise in the distance.',
    'One foot on land, one in water, pouring between two cups: the art of balance.',
    'Slow down and find a middle path. A little patience and balance will get you there.');

  c('m15', 'The Devil', ['temptation', 'addiction', 'feeling trapped'],
    'being stuck in something unhealthy: a bad habit, an addiction, a toxic tie, or chasing money and things',
    ['breaking free', 'release', 'taking back control'],
    'breaking free: dropping a bad habit and taking your power back',
    'A horned devil sits on a block. A naked man and woman stand chained to it, but the chains are loose enough to slip off.',
    'Look at the chains: they’re loose. They could leave if they chose to.',
    'Something here has a hold on you. The good news is you’re freer than you think: you can walk away.');

  c('m16', 'The Tower', ['sudden change', 'shock', 'revelation'],
    'a sudden shake-up: something built on shaky ground falls apart, and the truth comes out',
    ['disaster avoided', 'fear of change', 'delaying the inevitable'],
    'narrowly avoiding a disaster, or putting off a change that has to come',
    'Lightning strikes a tall tower on a rocky peak and knocks off its crown. Flames burst from the windows and two people fall headfirst.',
    'Lightning, fire, people falling: the most dramatic card in the deck. Sudden change.',
    'Something may get shaken up suddenly. It can feel scary, but whatever falls wasn’t built to last.');

  c('m17', 'The Star', ['hope', 'healing', 'renewal'],
    'hope and healing after a hard time: faith in the future, calm, and inspiration',
    ['despair', 'discouragement', 'disconnection'],
    'losing hope, feeling discouraged, or feeling cut off',
    'A naked woman kneels by a pool under one big star and seven smaller ones, pouring water onto the land and into the pool.',
    'After the Tower comes the Star: a clear night sky and calm water. Hope.',
    'Better days are coming. This is a card of healing; trust that things are getting better.');

  c('m18', 'The Moon', ['illusion', 'uncertainty', 'fears'],
    'confusion and uncertainty: things aren’t what they seem, and fears, dreams and intuition run strong',
    ['clarity returning', 'fear released', 'truth revealed'],
    'confusion lifting: the truth comes out, and fears lose their grip',
    'A moon with a face shines over a path between two towers. A dog and a wolf howl at it, and a crayfish crawls out of a pool.',
    'By moonlight, nothing looks quite like it does in the day.',
    'Things aren’t clear yet. Don’t make big decisions out of fear or guesswork; wait for more light.');

  c('m19', 'The Sun', ['joy', 'success', 'positivity'],
    'joy, success and warmth: everything is bright, clear and going well',
    ['temporary clouds', 'overconfidence', 'delays'],
    'happiness behind a passing cloud: a temporary dip, too much optimism, or struggling to feel happy',
    'A smiling child rides a white horse under a huge shining sun, with sunflowers growing over a wall behind.',
    'A happy kid on a horse in the sunshine: the happiest card in the deck.',
    'This is one of the best cards you can get. Happiness and success are shining on you.');

  c('m20', 'Judgement', ['awakening', 'reckoning', 'a calling'],
    'a wake-up call: looking back honestly, forgiving, and answering a calling into a new chapter',
    ['self-judgment', 'doubt', 'ignoring the call'],
    'being too hard on yourself, self-doubt, or ignoring a calling',
    'An angel blows a trumpet from the clouds, and people rise from coffins below with their arms open wide.',
    'A trumpet blast that wakes everyone up: time to rise and answer the call.',
    'You’re being called to wake up to something. Take stock, forgive the past, and step into your next chapter.');

  c('m21', 'The World', ['completion', 'wholeness', 'achievement'],
    'completion and success: a chapter finishes, a goal is reached, everything comes together',
    ['unfinished business', 'delays', 'no closure'],
    'unfinished business, delays, or needing closure before you can move on',
    'A dancer floats inside a large wreath, holding two wands. An angel, an eagle, a bull and a lion watch from the corners.',
    'The dancer is inside a victory wreath: the end of the Fool’s journey.',
    'You’ve come full circle. Something is complete, and you’ve earned that feeling of success.');

  // ---------------- Wands: energy (Fire) ----------------

  c('wands01', null, ['inspiration', 'new energy', 'a spark'],
    'a spark of inspiration: a new idea, a burst of energy, or the start of a passion or project',
    ['delays', 'no spark', 'blocked energy'],
    'delays, no motivation, or an idea that hasn’t caught fire yet',
    'A hand reaches out of a cloud holding a sprouting wand, with a castle on a hill in the distance.',
    'Ace = a start, Wands = energy: a brand-new spark.',
    'There’s a new spark here: an idea or a passion that’s ready to go. Run with it.');

  c('wands02', null, ['planning', 'future plans', 'deciding'],
    'planning the next step: looking out at the world and deciding where to go',
    ['fear of change', 'playing it safe', 'bad planning'],
    'fear of the unknown, playing it too safe, or poor planning',
    'A man stands on castle walls holding a small globe, looking out to sea, with one wand in his hand and another fixed to the wall.',
    'Two = a choice: he’s holding the whole world, deciding where to go.',
    'You’re in the planning stage. Think big about where you want this to go next.');

  c('wands03', null, ['expansion', 'progress', 'looking ahead'],
    'plans underway: progress, growth, and waiting for your ships to come in',
    ['delays', 'obstacles', 'frustration'],
    'delays and setbacks, or plans that haven’t paid off yet',
    'A man stands on a cliff with his back to us, watching ships sail across the sea below.',
    'Three = growth: his ships are already out at sea.',
    'You’ve put things in motion, and it’s starting to grow. Keep looking ahead.');

  c('wands04', null, ['celebration', 'home', 'milestones'],
    'celebration and happiness: a milestone, a homecoming, a wedding or a party, feeling at home',
    ['tension at home', 'cancelled plans', 'instability'],
    'tension at home, or a celebration that gets put off',
    'Four wands hold up a garland of flowers. Behind them, two people raise bouquets, and a crowd celebrates in front of a castle.',
    'Four = stability, and with Wands’ energy that becomes a joyful celebration.',
    'There’s something to celebrate here: a milestone, a happy home, a reason to get together.');

  c('wands05', null, ['competition', 'conflict', 'disagreement'],
    'competition and friction: lots of people pushing their own way, squabbles or rivalry',
    ['avoiding conflict', 'common ground', 'inner conflict'],
    'avoiding a fight, or finally finding common ground',
    'Five young men wave wooden staffs at each other. It looks more like a scuffle than a real fight.',
    'Five = trouble, and with Wands that’s everyone’s energy clashing at once.',
    'There’s some friction or competition going on. It’s more noise than real danger.');

  c('wands06', null, ['victory', 'recognition', 'success'],
    'success and recognition: a win, praise, and being proud of yourself',
    ['no recognition', 'ego', 'self-doubt'],
    'not getting the credit you deserve, letting success go to your head, or self-doubt',
    'A rider on a white horse wears a victory wreath and carries a wand with another wreath on it, surrounded by a cheering crowd.',
    'Six = things go right again: here, a victory parade.',
    'This is a win. People will notice what you’ve done, so enjoy the recognition.');

  c('wands07', null, ['standing your ground', 'defending', 'perseverance'],
    'standing up for yourself: defending your position against challenges',
    ['overwhelmed', 'giving up', 'worn out'],
    'feeling overwhelmed, giving up, or worn out from fighting',
    'A man on a hilltop fights off six wands thrust up at him from below. He’s even wearing two different shoes.',
    'Seven = a test: he’s holding the high ground against everyone.',
    'You may have to defend your position. Stand your ground; you have the advantage.');

  c('wands08', null, ['speed', 'movement', 'quick news'],
    'fast movement: things speed up, news arrives, travel, quick progress',
    ['delays', 'frustration', 'rushing'],
    'delays and frustration, or rushing ahead too fast',
    'Eight wands fly through a clear sky over a river and green hills. There are no people at all.',
    'Eight = movement, and Wands are fire, so it’s fast. Things are flying.',
    'Things are about to move quickly. Expect news or progress soon.');

  c('wands09', null, ['resilience', 'persistence', 'last stand'],
    'tired but not done: resilience, guarding what you’ve built, almost at the finish line',
    ['exhaustion', 'defensiveness', 'about to give up'],
    'exhaustion and defensiveness, or being right on the edge of giving up',
    'A bandaged, weary man leans on a wand and glances over his shoulder, with eight more wands standing behind him like a fence.',
    'Nine = almost there: he’s battered, but still standing guard.',
    'You’re tired, but you’re almost there. Don’t give up now.');

  c('wands10', null, ['burden', 'overload', 'responsibility'],
    'carrying too much: overwork, burdens, and taking on everyone else’s load',
    ['burnout', 'putting it down', 'delegating'],
    'burning out, or finally putting some of the load down and sharing it',
    'A man struggles toward a town carrying a bundle of ten heavy wands, so many he can’t see where he’s going.',
    'Ten = the end of a cycle: all that energy has turned into a heavy load.',
    'You’re carrying too much on your own. What can you put down, or hand to someone else?');

  c('wands11', null, ['enthusiasm', 'curiosity', 'exploring'],
    'an excited beginner: curiosity, new ideas, adventurous energy, or a free-spirited young person',
    ['no direction', 'impatience', 'all talk'],
    'big ideas that go nowhere, impatience, or no clear direction',
    'A young man in a tunic covered in salamanders gazes up at the top of his sprouting wand, in the desert.',
    'Page = a learner, Wands = passion: an eager beginner with big ideas.',
    'There’s a fresh, excited energy here. Explore it like a curious beginner.');

  c('wands12', null, ['action', 'adventure', 'impulsiveness'],
    'charging ahead: passion, adventure and bold action, sometimes too fast',
    ['recklessness', 'impatience', 'scattered energy'],
    'recklessness and haste, or frustrating delays',
    'A knight on a rearing horse charges across the desert with his wand raised, his tunic covered in salamanders.',
    'Knight = charging ahead, Wands = fire: the most impulsive rider in the deck.',
    'There’s bold, passionate energy here. Just be careful not to rush in without thinking.');

  c('wands13', null, ['confidence', 'warmth', 'determination'],
    'someone confident, warm and magnetic: sure of herself, social and passionate',
    ['insecurity', 'jealousy', 'demanding'],
    'insecurity or jealousy, or being demanding',
    'A queen sits on a throne decorated with lions, holding a sunflower and a wand, with a black cat at her feet.',
    'Queen = caring mastery, Wands = fire: confident, warm, and a little bold (see the black cat).',
    'Step into your confidence. Be bold, warm and unapologetically yourself.');

  c('wands14', null, ['leadership', 'vision', 'boldness'],
    'a natural leader with a vision: someone who inspires others and makes big things happen',
    ['arrogance', 'impulsiveness', 'bossiness'],
    'being bossy or arrogant, or expecting too much of others',
    'A king sits on a throne carved with lions and salamanders, holding a flowering wand, leaning forward as if ready to act.',
    'King = in charge, Wands = vision: the leader with the big idea.',
    'This calls for big-picture leadership. Take charge, and inspire others to follow.');

  // ---------------- Cups: feelings (Water) ----------------

  c('cups01', null, ['new love', 'an open heart', 'compassion'],
    'a fresh start in your feelings: new love, a new friendship, or an open, overflowing heart',
    ['blocked feelings', 'emptiness', 'self-love needed'],
    'bottled-up feelings, emptiness, or love that isn’t flowing',
    'A hand from a cloud holds a cup overflowing with five streams of water, while a dove drops a wafer into it. Water lilies float below.',
    'Ace = a start, Cups = feelings: a heart overflowing.',
    'Your heart is opening to something new. This could be new love, or simply a lot of love coming your way.');

  c('cups02', null, ['partnership', 'attraction', 'mutual respect'],
    'a connection between two people: a partnership, mutual attraction, or a deep friendship',
    ['breakup', 'imbalance', 'tension'],
    'a breakup, a one-sided relationship, or a falling-out',
    'A man and a woman face each other and exchange cups. Above them floats a winged lion’s head over two snakes.',
    'Two = a pair, and with Cups it’s two people sharing their hearts.',
    'There’s a real, two-way connection here. It’s equal and mutual.');

  c('cups03', null, ['friendship', 'celebration', 'community'],
    'celebrating with friends: community, good times, reunions and support',
    ['overindulgence', 'gossip', 'feeling left out'],
    'too much partying, gossip, or feeling left out',
    'Three women dance in a circle, raising their cups in a toast, surrounded by fruit and flowers from the harvest.',
    'Three = growth: feelings shared among friends grow into a party.',
    'This is about your people. Lean on your friends, and celebrate together.');

  c('cups04', null, ['boredom', 'apathy', 'missed chances'],
    'feeling bored or unhappy with what you have, and missing a new offer right in front of you',
    ['waking up', 'new chances', 'moving on'],
    'snapping out of a rut and noticing new chances',
    'A young man sits under a tree with his arms crossed, staring at three cups and ignoring a fourth cup offered by a hand from a cloud.',
    'Four = standing still: his feelings have gone flat, and he doesn’t see the cup being offered.',
    'You might be so stuck in what’s bothering you that you’re missing a good offer right in front of you.');

  c('cups05', null, ['grief', 'regret', 'disappointment'],
    'loss and disappointment: focusing on what went wrong instead of what’s left',
    ['acceptance', 'moving on', 'forgiveness'],
    'accepting a loss, forgiving, and moving on',
    'A figure in a black cloak mourns over three spilled cups, not seeing the two cups still standing behind him.',
    'Five = trouble: feelings spilled, but two cups are still standing.',
    'You’ve had a loss or a disappointment, and it’s real. But not everything is gone; there’s still something left to build on.');

  c('cups06', null, ['nostalgia', 'childhood', 'kindness'],
    'nostalgia and sweet memories: the past, childhood, old friends, simple kindness',
    ['living in the past', 'moving forward', 'rose-tinted memories'],
    'being stuck in the past, or finally moving on from it',
    'In an old village square, a boy hands a younger girl a cup filled with white flowers.',
    'Six = recovery: feelings soothed by sweet memories.',
    'Something from the past is coming up: happy memories, an old friend, or the comfort of home.');

  c('cups07', null, ['choices', 'fantasy', 'wishful thinking'],
    'lots of choices and daydreams, not all of them real: wishful thinking',
    ['clarity', 'deciding', 'reality check'],
    'getting clear, making a choice, or seeing through a fantasy',
    'A man faces seven cups floating in the clouds, each holding something different: a castle, jewels, a wreath, a dragon, a snake, a veiled figure and a head.',
    'Seven = a test: feelings and fantasies pulling in seven directions.',
    'You have a lot of options, but some are just fantasies. Get clear on what’s actually real.');

  c('cups08', null, ['walking away', 'leaving behind', 'searching'],
    'walking away from something that no longer fulfills you, to look for something deeper',
    ['fear of leaving', 'drifting', 'staying too long'],
    'being afraid to leave, drifting aimlessly, or staying when you should go',
    'Under the moon, a man with a walking stick walks away from eight neatly stacked cups, toward the mountains.',
    'Eight = movement: he’s walking away from where his feelings used to live.',
    'It may be time to walk away from something that isn’t feeding your heart anymore.');

  c('cups09', null, ['wishes come true', 'contentment', 'satisfaction'],
    'the “wish card”: satisfaction, contentment and getting what you want',
    ['unfulfilled wishes', 'smugness', 'overindulgence'],
    'wishes that don’t come true, smugness, or wanting more than you need',
    'A satisfied man sits on a bench with his arms crossed, smiling, with nine cups lined up proudly behind him.',
    'Nine = almost there: his feelings are full. It’s called the wish card.',
    'This is the wish card. What you’re hoping for is very possible.');

  c('cups10', null, ['happiness', 'family', 'harmony'],
    'lasting happiness: a loving family, emotional fulfillment, a happy home',
    ['family tension', 'disconnection', 'broken dreams'],
    'tension in the family, or a dream of home that hasn’t worked out',
    'A couple raise their arms to a rainbow of ten cups while two children dance beside them, with a cozy house in the distance.',
    'Ten = the full cycle: feelings complete, a happy family under a rainbow.',
    'This is the happily-ever-after card: love, family, and a real sense of home.');

  c('cups11', null, ['sweet surprises', 'creativity', 'sensitivity'],
    'a gentle surprise: a sweet message, a creative idea, or a sensitive young person',
    ['immaturity', 'creative block', 'hurt feelings'],
    'emotional immaturity, a creative block, or hurt feelings',
    'A young man in a flowered tunic looks at a cup from which a fish pokes its head out.',
    'Page = a learner, Cups = feelings: a dreamy young heart, surprised by a fish in his cup.',
    'Something sweet or surprising may pop up: a message, an invitation, or a creative idea.');

  c('cups12', null, ['romance', 'charm', 'following your heart'],
    'the romantic: an offer, an invitation or a proposal, following your heart',
    ['moodiness', 'empty promises', 'unrealistic'],
    'moodiness, unrealistic romance, or promises that don’t hold up',
    'A knight on a calm white horse rides slowly forward, holding out a cup as if offering it.',
    'Knight = charging ahead, Cups = feelings: here comes the romantic with an offer.',
    'Someone or something is coming with an offer, maybe romance. Follow your heart, but keep your eyes open.');

  c('cups13', null, ['compassion', 'empathy', 'emotional support'],
    'someone caring, intuitive and emotionally wise, who listens and makes others feel safe',
    ['giving too much', 'oversensitive', 'self-neglect'],
    'giving too much, being overly sensitive, or forgetting your own needs',
    'A queen sits on a throne at the water’s edge, gazing at an ornate, closed cup.',
    'Queen = caring mastery, Cups = feelings: the kindest listener in the deck.',
    'This calls for compassion, for others and for yourself. Lead with your heart.');

  c('cups14', null, ['emotional balance', 'calm', 'diplomacy'],
    'staying calm and kind under pressure: emotional maturity, diplomacy and balance',
    ['moodiness', 'manipulation', 'bottling it up'],
    'moodiness or manipulation, or bottling everything up',
    'A king sits on a throne floating on a rough sea, calmly holding a cup, while a ship sails by and a fish leaps nearby.',
    'King = in charge, Cups = feelings: calm on a stormy sea.',
    'Stay calm and steady here. Lead with both your head and your heart.');

  // ---------------- Swords: thoughts (Air) ----------------

  c('swords01', null, ['clarity', 'truth', 'breakthrough'],
    'a breakthrough: a clear new idea, the truth cutting through, a sharp decision',
    ['confusion', 'mixed messages', 'harsh words'],
    'confusion, mixed messages, or harsh words',
    'A hand from a cloud holds up a sword topped with a golden crown and draped with an olive branch and a palm leaf, above the mountains.',
    'Ace = a start, Swords = thoughts: a clear new idea that cuts through the fog.',
    'Clarity is coming. You’re about to see this situation clearly and know what to do.');

  c('swords02', null, ['stalemate', 'a hard choice', 'avoidance'],
    'a hard choice you’re avoiding: a stalemate, being stuck between two options',
    ['information overload', 'finally choosing', 'torn'],
    'being torn apart by indecision, or finally making the call',
    'A blindfolded woman sits by the sea under a crescent moon, arms crossed over her chest, holding two swords.',
    'Two = a choice: she’s blindfolded, holding two swords, refusing to pick.',
    'You’re stuck between two choices and avoiding the decision. Take off the blindfold and look at it honestly.');

  c('swords03', null, ['heartbreak', 'sorrow', 'painful truth'],
    'heartbreak and painful truths: grief, rejection, or hurtful words',
    ['healing', 'forgiveness', 'letting go of pain'],
    'healing from heartbreak, forgiving, and letting the pain go',
    'Three swords pierce a red heart against a gray, rainy sky.',
    'Three swords through a heart in the rain: it’s exactly what it looks like.',
    'There’s been hurt here, and it’s okay to feel it. Feeling it is how it heals.');

  c('swords04', null, ['rest', 'recovery', 'retreat'],
    'rest and recovery: taking a break, recharging, quiet time to heal',
    ['restlessness', 'burnout', 'rushing back'],
    'restlessness and burnout, or rushing back too soon',
    'A knight lies still on a tomb in a church, hands together in prayer. Three swords hang on the wall and one lies beneath him.',
    'Four = stillness: the busy mind finally rests.',
    'You need rest. Take a real break before you take on anything else.');

  c('swords05', null, ['conflict', 'winning at all costs', 'sore losers'],
    'a conflict where winning costs too much: arguments, sore losers, empty victories',
    ['making peace', 'apologizing', 'walking away'],
    'making peace, apologizing, or walking away from the fight',
    'A smirking man gathers up swords while two beaten people walk away toward the sea.',
    'Five = trouble, and with Swords it’s a nasty argument where even the winner loses.',
    'Is this fight worth it? Sometimes winning an argument costs more than it gains.');

  c('swords06', null, ['moving on', 'transition', 'calmer waters'],
    'leaving trouble behind: moving on to calmer times, a transition, a journey',
    ['unfinished business', 'stuck', 'baggage'],
    'unfinished business, or feeling unable to move on',
    'A ferryman poles a boat toward a distant shore. A woman and a child huddle inside, with six swords standing upright in the boat.',
    'Six = recovery: the boat carries them from rough water to calm.',
    'You’re moving away from a hard time toward something calmer. It may be sad, but it’s healing.');

  c('swords07', null, ['deception', 'sneakiness', 'strategy'],
    'sneakiness or strategy: someone isn’t being honest, or is trying to get away with something',
    ['coming clean', 'getting caught', 'conscience'],
    'coming clean, confessing, or getting caught',
    'A man tiptoes away from a camp carrying five swords, glancing back with a sly grin. He left two swords behind.',
    'Seven = a test, and this mind fails it by sneaking off with the swords.',
    'Something sneaky may be going on. Be careful who you trust, and be honest yourself.');

  c('swords08', null, ['feeling trapped', 'self-limiting', 'helplessness'],
    'feeling trapped or powerless, mostly by your own fears and thoughts',
    ['breaking free', 'new perspective', 'releasing fear'],
    'breaking free: a new way of seeing things, and letting go of fear',
    'A blindfolded, loosely tied woman stands surrounded by eight swords, but there’s a gap in them, and nobody is guarding her.',
    'Eight = movement, but her own thoughts have boxed her in. She could walk out.',
    'You feel stuck, but the walls are mostly in your head. You have more options than you think.');

  c('swords09', null, ['anxiety', 'worry', 'sleepless nights'],
    'anxiety and worry: sleepless nights, fear, guilt, thinking the worst',
    ['hope', 'reaching out', 'worry easing'],
    'the worry easing, hope coming back, or reaching out for help',
    'A woman sits up in bed with her head in her hands, nine swords hanging on the dark wall behind her.',
    'Nine = the peak, and for Swords that’s the peak of worry, in the middle of the night.',
    'You’ve been worrying a lot. It’s probably worse in your head than it is in real life.');

  c('swords10', null, ['rock bottom', 'painful ending', 'it’s over'],
    'a painful ending: rock bottom, betrayal, the worst point, which means it’s over now',
    ['recovery', 'rising again', 'refusing to let go'],
    'recovering and rising again, or refusing to let something die',
    'A man lies face down with ten swords in his back, but on the horizon the dark sky is turning gold with the dawn.',
    'Ten = the end: it can’t get any worse, and the sun is already rising.',
    'This is the bottom, and that means the only way from here is up.');

  c('swords11', null, ['curiosity', 'new ideas', 'news'],
    'a curious, sharp mind: asking questions, new ideas, news or messages',
    ['gossip', 'all talk', 'defensiveness'],
    'gossip, all talk and no action, or being defensive',
    'A young man stands on a windy hill holding his sword up, looking over his shoulder, on alert.',
    'Page = a learner, Swords = the mind: the curious student with lots of questions.',
    'Ask questions and keep learning here. Stay alert, and watch what you say.');

  c('swords12', null, ['ambition', 'haste', 'bluntness'],
    'charging ahead with ideas and opinions: fast, driven and blunt, sometimes without thinking it through',
    ['reckless words', 'burnout', 'no plan'],
    'reckless words, or rushing in without a plan',
    'A knight charges at full gallop with his sword raised, while storm clouds race and the wind bends the trees.',
    'Knight = charging ahead, Swords = words: he’s arguing before you’ve finished your sentence.',
    'There’s a lot of speed and strong opinions here. Act fast if you need to, but watch your words.');

  c('swords13', null, ['honesty', 'independence', 'clear thinking'],
    'someone sharp, honest and fair, who speaks the truth, sets boundaries and sees clearly',
    ['coldness', 'bitterness', 'harsh criticism'],
    'being cold, bitter or harshly critical',
    'A queen sits on a throne up in the clouds, holding her sword upright and reaching out one open hand.',
    'Queen = caring mastery, Swords = the mind: she tells you the truth, kindly or not.',
    'This calls for honesty and clear boundaries. Say what you mean.');

  c('swords14', null, ['authority', 'truth', 'logic'],
    'clear thinking and authority: logic and fairness, a decision made with the head, a professional or adviser',
    ['abuse of power', 'manipulation', 'cold logic'],
    'abusing power, manipulation, or cold logic with no heart',
    'A king sits facing straight ahead on a throne decorated with butterflies, holding his sword slightly tilted.',
    'King = in charge, Swords = the mind: the judge who decides with logic.',
    'Use your head here. Look at the facts, think it through, and decide.');

  // ---------------- Pentacles: money and work (Earth) ----------------

  c('pentacles01', null, ['new opportunity', 'prosperity', 'a solid start'],
    'a new opportunity with money, work or something practical: a solid start that can grow',
    ['missed opportunity', 'poor planning', 'money worries'],
    'a missed opportunity, poor planning, or money worries',
    'A hand from a cloud holds out a gold coin over a lush garden, with an archway leading out to the mountains.',
    'Ace = a start, Pentacles = money: a seed that can grow into real wealth.',
    'A real, solid opportunity is coming: a job, money, or something you can build on.');

  c('pentacles02', null, ['balancing', 'juggling', 'adaptability'],
    'juggling priorities: balancing money, time or responsibilities and keeping it all in the air',
    ['overwhelmed', 'dropping the ball', 'disorganized'],
    'being overwhelmed and dropping the ball',
    'A young man dances while juggling two coins inside a loop shaped like an infinity sign. Ships ride big waves behind him.',
    'Two = a balance: he’s juggling two coins while the sea goes up and down.',
    'You’re juggling a lot. Stay flexible, and don’t take on anything more.');

  c('pentacles03', null, ['teamwork', 'skill', 'learning'],
    'teamwork and skill: working with others, learning a craft, getting recognized for good work',
    ['poor teamwork', 'sloppy work', 'not listening'],
    'poor teamwork, sloppy work, or not listening to each other',
    'A stonemason works in a cathedral while a monk and an architect hold up the plans and talk with him.',
    'Three = growth: good work grows when people build together.',
    'This goes better as a team. Your skills are getting noticed, so keep building.');

  c('pentacles04', null, ['saving', 'security', 'holding on'],
    'holding on tight: saving money and wanting security, maybe being too controlling or stingy',
    ['letting go', 'overspending', 'loosening up'],
    'letting go and loosening control, or overspending',
    'A man sits outside a city clutching one coin to his chest, with another on his head and his feet on two more.',
    'Four = stability, and with money that becomes holding on very tight.',
    'You’re holding on tight to keep things safe. Just make sure you’re not so careful that nothing can grow.');

  c('pentacles05', null, ['hardship', 'loss', 'feeling left out'],
    'hard times: money trouble, illness, or feeling left out in the cold',
    ['recovery', 'help arriving', 'things looking up'],
    'recovering from hard times and accepting help',
    'Two poor, injured people trudge through the snow past a glowing church window, not noticing the help inside.',
    'Five = trouble, Pentacles = money: out in the cold, walking right past the help.',
    'Things have been hard, especially in practical ways. Don’t be too proud to ask for help; it’s closer than you think.');

  c('pentacles06', null, ['generosity', 'giving and receiving', 'sharing'],
    'giving and receiving: generosity, help, sharing what you have, fairness with money',
    ['strings attached', 'debt', 'one-sided giving'],
    'help with strings attached, debt, or giving that only goes one way',
    'A wealthy merchant holds balanced scales while handing coins to one of two people kneeling before him.',
    'Six = recovery: money flows back to where it’s needed.',
    'This is about give and take. Help is available, or you’re in a position to help someone else.');

  c('pentacles07', null, ['patience', 'long-term investment', 'taking stock'],
    'patience and slow growth: stepping back to look at the results of your hard work',
    ['impatience', 'little reward', 'bad investment'],
    'impatience, or not much reward for all your effort',
    'A farmer leans on his hoe and gazes at seven coins growing on a leafy bush.',
    'Seven = a test, and the test here is patience: waiting for the harvest.',
    'You’ve put in the work, and it’s growing. Be patient; the payoff takes time.');

  c('pentacles08', null, ['hard work', 'practice', 'mastery'],
    'hard work and practice: putting in the hours, learning a skill, doing it well',
    ['perfectionism', 'boredom', 'cutting corners'],
    'perfectionism or boredom, or cutting corners',
    'A craftsman sits at his bench carefully carving coins, with six finished ones on display.',
    'Eight = movement toward mastery: one coin at a time, over and over.',
    'Keep practicing. The steady effort you’re putting in is building real skill.');

  c('pentacles09', null, ['independence', 'luxury', 'self-reliance'],
    'enjoying what you’ve earned: independence, comfort, and treating yourself',
    ['overspending', 'dependence', 'all work, no joy'],
    'overspending, or leaning too much on other people',
    'An elegant woman stands in a rich vineyard with a hooded falcon on her gloved hand.',
    'Nine = almost there: she earned her beautiful garden on her own.',
    'You’ve worked for this, so enjoy it. You can stand on your own two feet.');

  c('pentacles10', null, ['wealth', 'family', 'legacy'],
    'lasting wealth and security: family, home, inheritance and long-term success',
    ['money troubles', 'family disputes', 'instability'],
    'family money troubles, losing stability, or short-term thinking',
    'An old man with two dogs sits under a castle archway, while a couple and a child stand nearby. Ten coins hang over the scene.',
    'Ten = the full cycle: money that lasts across generations.',
    'This points to lasting security: family, home, and something built to last.');

  c('pentacles11', null, ['a new skill', 'ambition', 'studying'],
    'a hardworking beginner: studying, a new job or money idea, someone eager to learn',
    ['procrastination', 'no progress', 'poor planning'],
    'putting things off, not making progress, or poor planning',
    'A young man stands in a green field, holding up a coin and gazing at it closely.',
    'Page = a learner, Pentacles = money: the student studying the coin.',
    'This is a great time to learn something practical: a skill, a course, a new job.');

  c('pentacles12', null, ['hard work', 'routine', 'reliability'],
    'slow and steady: reliable, patient and hardworking, sticking to the routine',
    ['boredom', 'stuck in a rut', 'laziness'],
    'boredom, being stuck in a rut, or laziness',
    'A knight sits still on a heavy black horse in a plowed field, holding a coin and studying it carefully.',
    'Knights charge ahead, but on a Pentacles horse he doesn’t move: slow and steady.',
    'Slow and steady wins this one. Keep doing the work, one step at a time.');

  c('pentacles13', null, ['nurturing', 'practical', 'down to earth'],
    'practical care: making a warm home, being sensible with money, looking after others',
    ['self-neglect', 'work-home imbalance', 'smothering'],
    'neglecting yourself, work and home out of balance, or smothering',
    'A queen sits in a blooming garden with a coin in her lap and a rabbit at her feet.',
    'Queen = caring mastery, Pentacles = home: she takes care of everyone, practically.',
    'Look after the practical things: your home, your money, your body. Take care of yourself too.');

  c('pentacles14', null, ['wealth', 'success', 'security'],
    'success and security: wealth, a head for business, a reliable provider',
    ['greed', 'stubbornness', 'obsessed with money'],
    'greed and stubbornness, or obsessing over money and status',
    'A king sits on a throne covered in grapevines and bulls, in rich robes, holding a coin and a scepter, with a castle behind him.',
    'King = in charge, Pentacles = money: the successful businessman.',
    'This points to success and security. Make smart, steady choices, and it will pay off.');

  const byId = Object.fromEntries(CARDS.map(card => [card.id, card]));
  const MAJORS = CARDS.filter(card => card.major).map(card => card.id);
  const suitIds = suit => CARDS.filter(card => card.suit === suit).map(card => card.id);

  // "5 = trouble + Cups = feelings": the pattern behind an everyday card's meaning.
  function formula(card) {
    if (card.major) return null;
    const r = RANKS[card.rank], s = SUITS[card.suit];
    const rank = card.court ? r.name : card.rank === 1 ? 'Ace' : String(card.rank);
    return { rank, rankMeans: r.short, suit: s.name, suitMeans: s.short };
  }

  return { SUITS, RANKS, CARDS, byId, MAJORS, suitIds, formula };
})();
