// Combos: well-known pairs of cards, how the elements get along, and what each kind of card means
// for a love, work, money or decision question. reading.js puts these together.
window.TAROT_COMBOS = (() => {
  // Famous pairs. Order doesn't matter: The Tower + The Star is the same pair as The Star + The Tower.
  const PAIRS = [
    ['m16', 'm17', 'After the storm, hope. Something falls apart suddenly, and out of the wreckage comes healing and a clearer sense of what really matters.'],
    ['m13', 'm21', 'One big chapter closes completely so a new one can begin. An ending that is also an achievement.'],
    ['m13', 'swords10', 'A definite ending: there’s no going back. Painful, but it’s truly over, which means recovery can start.'],
    ['m06', 'cups02', 'One of the strongest love pairs in the deck: a deep, mutual connection between two people.'],
    ['m06', 'cups10', 'Love that grows into family: commitment, a home together, lasting happiness.'],
    ['swords03', 'cups05', 'Heartbreak and grief: a painful loss that needs time to be mourned.'],
    ['swords03', 'm17', 'Healing after heartbreak. The pain is real, and hope is already on its way.'],
    ['m19', 'cups10', 'Pure happiness at home: joy, family, and everything feeling right.'],
    ['m01', 'wands01', 'A brilliant new idea, plus the skill to make it happen. Start now.'],
    ['m15', 'm06', 'Temptation in love: an intense attraction that may not be healthy. Passion that feels like a trap.'],
    ['m18', 'swords07', 'Something hidden and dishonest: lies, secrets or deception. Trust your gut, and look for the facts.'],
    ['m02', 'm18', 'Strong intuition but cloudy facts. Trust the inner voice, and wait before acting.'],
    ['m10', 'm19', 'Luck turning your way: a lucky break that leads to real success.'],
    ['m10', 'm16', 'A sudden, unexpected turn of events, out of anyone’s control.'],
    ['m12', 'swords04', 'Time to rest and pause. Nothing should be forced right now.'],
    ['m20', 'm21', 'A huge chapter completes, and a calling to a whole new level of life.'],
    ['m11', 'swords14', 'Legal or official matters, decided by logic and facts. A fair outcome.'],
    ['m03', 'pentacles10', 'Abundance and family: a comfortable home and growth, sometimes a big family event.'],
    ['m03', 'cups03', 'A celebration of something new being born. Traditionally linked with a new arrival in the family.'],
    ['m04', 'pentacles04', 'Very controlling about money or security: safe, but rigid.'],
    ['m14', 'pentacles02', 'Finding balance with money and time. Keep juggling, but slowly and carefully.'],
    ['m07', 'wands06', 'Victory through determination. You’ll push through and win.'],
    ['m08', 'wands09', 'Huge inner strength. Tired, but you will make it.'],
    ['m09', 'cups08', 'Walking away to find yourself: a time of searching, alone.'],
    ['m05', 'cups02', 'Commitment and tradition in love: often marriage or a formal partnership.'],
    ['m00', 'wands08', 'A sudden adventure: travel, or a quick, spontaneous fresh start.'],
    ['swords09', 'm18', 'Anxiety fed by imagination: fears that are bigger in your head than in real life.'],
    ['pentacles05', 'pentacles06', 'Hard times, then help: someone steps in, or support becomes available.'],
    ['cups04', 'cups01', 'A new emotional offer that might be getting ignored. Look up!'],
    ['wands10', 'swords04', 'Overworked and in need of rest. Put the load down before you burn out.'],
    ['swords06', 'm17', 'Leaving hard times behind, heading toward a hopeful future.'],
    ['cups07', 'swords02', 'Overwhelmed by choices and avoiding the decision. Get clear, and pick one.'],
    ['pentacles08', 'pentacles03', 'Skill plus teamwork: hard work that gets noticed. Great for a career.'],
    ['wands04', 'cups10', 'A happy home and a celebration: often a wedding or a homecoming.'],
    ['m13', 'm00', 'An ending that opens the door to a brand-new adventure.'],
    ['m15', 'swords08', 'Feeling trapped by a habit, a relationship, or your own fear. The way out is right there.'],
    ['m16', 'swords10', 'A crash to rock bottom: dramatic and painful, but the worst passes quickly.'],
    ['m19', 'm17', 'Very positive: hope that turns into real joy and success.'],
    ['m21', 'wands03', 'Travel abroad, or expanding into the wider world.'],
    ['pentacles09', 'pentacles10', 'Independence with money that grows into lasting wealth.'],
    ['swords05', 'wands05', 'A lot of conflict and arguing. Pick your battles.'],
    ['cups09', 'm19', 'Wishes coming true, very happily.'],
    ['m02', 'cups13', 'Deep intuition and empathy. Trust your feelings; they’re right.'],
    ['m01', 'm15', 'Manipulation: someone using real talent to control or trick others.'],
    ['cups06', 'cups12', 'A romance from the past returning: an old flame.'],
    ['pentacles07', 'm14', 'Patience pays: steady, balanced effort over time brings results.'],
    ['wands02', 'm07', 'Planning a big move, then going for it.'],
    ['swords01', 'm11', 'The truth comes out, and a fair decision follows.'],
    ['m18', 'm19', 'Confusion clearing into clarity. After a time of uncertainty, the truth shines through.'],
    ['m10', 'pentacles01', 'A lucky financial break: a job or money opportunity out of the blue.'],
    ['swords02', 'm06', 'A hard choice in love: torn between two people or two paths.'],
    ['cups05', 'cups06', 'Grieving the past, and missing how things used to be.'],
    ['m12', 'm13', 'Surrendering to an ending: letting go is the way through.'],
    ['wands12', 'cups12', 'An exciting romance, full of passion and charm. Is it built to last?'],
    ['m04', 'm03', 'Structure and nurturing in balance: often parents, or a couple who complete each other.'],
    ['m17', 'cups01', 'Emotional healing and love returning. The heart opens again.'],
    ['m09', 'm02', 'A strong call to go inward: quiet time, and trusting your own wisdom.'],
    ['wands01', 'cups01', 'Passion and new love together: an exciting new romance.'],
    ['pentacles01', 'pentacles03', 'A new job or project that grows through teamwork.'],
    ['swords11', 'swords07', 'Gossip, or someone digging for information. Be careful what you share.'],
  ];

  const key = (a, b) => [a, b].sort().join('+');
  const pairMap = Object.fromEntries(PAIRS.map(([a, b, text]) => [key(a, b), text]));
  const pair = (a, b) => pairMap[key(a, b)] || null;

  // How two elements get along (readers call this "elemental dignities").
  const TRAITS = { Fire: 'energy and drive', Water: 'feelings', Air: 'thoughts and words', Earth: 'practical, real-world matters' };
  function elements(e1, e2) {
    if (e1 === e2) return { kind: 'same', title: `Both ${e1}`,
      text: `Both cards are ${e1}, so they double up: ${TRAITS[e1]} are extra strong here.` };
    const set = [e1, e2].sort().join('+');
    const friends = { 'Air+Fire': 'wind fans a fire', 'Earth+Water': 'rain helps things grow' };
    const clash = { 'Fire+Water': 'water puts out fire', 'Air+Earth': 'head in the clouds versus feet on the ground' };
    if (friends[set]) return { kind: 'friends', title: `${e1} + ${e2}: friends`,
      text: `${e1} and ${e2} get along (${friends[set]}), so these two cards support each other.` };
    if (clash[set]) return { kind: 'clash', title: `${e1} + ${e2}: a clash`,
      text: `${e1} and ${e2} clash (${clash[set]}), so these two cards pull against each other. Expect some tension.` };
    return { kind: 'neutral', title: `${e1} + ${e2}: neutral`,
      text: `${e1} and ${e2} are neutral: they work side by side without much push or pull.` };
  }

  // What a kind of card says about a love, work, money or decision question.
  const TOPIC_NOTES = {
    love: {
      wands: 'Wands in love: passion, attraction and chemistry.',
      cups: 'Cups in love: real feelings. The most romantic suit.',
      swords: 'Swords in love: arguments, mixed signals or overthinking.',
      pentacles: 'Pentacles in love: commitment and building a life together, or money mixed into the relationship.',
      major: 'A big card in a love reading: this relationship is part of a big life lesson.',
      court: 'A people card in a love reading often describes the partner or the love interest.',
    },
    work: {
      wands: 'Wands at work: ambition, new projects and drive.',
      cups: 'Cups at work: how they feel about the job, and the people they work with.',
      swords: 'Swords at work: decisions, office politics, stress or communication.',
      pentacles: 'Pentacles at work: the job itself, pay, skills and steady progress. The most career-minded suit.',
      major: 'A big card about work points to a major career turning point.',
      court: 'A people card at work can be a boss, a coworker or a client.',
    },
    money: {
      wands: 'Wands and money: earning through drive, side projects and taking the initiative.',
      cups: 'Cups and money: feelings about money, like spending to feel better, or generosity.',
      swords: 'Swords and money: money stress, or a tough financial decision.',
      pentacles: 'Pentacles are the money suit: this card speaks directly to their finances.',
      major: 'A big card about money points to a big, life-changing shift in their finances.',
      court: 'A people card about money can be someone who affects their finances: a partner, a boss, a lender.',
    },
    decision: {
      wands: 'Wands in a decision: follow your passion, and act.',
      cups: 'Cups in a decision: notice how each option feels.',
      swords: 'Swords in a decision: use logic, and be honest about the facts.',
      pentacles: 'Pentacles in a decision: think about the practical side, like money, time and security.',
      major: 'A big card here says this decision really matters.',
      court: 'A people card in a decision: someone’s advice or influence may matter here.',
    },
  };

  return { PAIRS, pair, elements, TOPIC_NOTES };
})();
