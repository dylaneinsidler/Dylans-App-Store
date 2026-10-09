// The course: 12 short lessons, each a few steps long. The right screen shows a step's words; the left
// screen shows its cards (or a spread), and clicking a card there opens its full meaning.
//
// A step:  { title, cards: [...] or spread: { id, cards: [...] }, body: [...] }
//   cards:  card ids ('cups05'), 'cups05:r' for one shown upside down, or 'back' for a face-down card
//   body:   paragraphs, plus { points: [...] } for a list and { table: [[left, right], ...] } for a table
window.TAROT_LESSONS = (() => {
  const run = (suit, from, to) => Array.from({ length: to - from + 1 }, (_, i) => `${suit}${String(from + i).padStart(2, '0')}`);
  const majors = Array.from({ length: 22 }, (_, i) => `m${String(i).padStart(2, '0')}`);

  return [
    {
      title: 'What tarot is',
      blurb: 'The deck, the pictures, and how a reading works.',
      steps: [
        {
          title: 'Welcome to tarot',
          cards: ['m00'],
          body: [
            'Tarot is a deck of 78 picture cards. Reading tarot means shuffling them, laying a few out, and telling a story from the pictures.',
            'You don’t need to be psychic. A good reader is a good storyteller and a good listener. The cards give you something to talk about, and help the person see their life from a new angle.',
            'The card on the left screen is <b>The Fool</b>: a traveler about to step off a cliff without a care in the world. He’s the beginner setting out on a journey. That’s you, right now.',
          ],
        },
        {
          title: 'Two kinds of cards',
          cards: ['m13', 'm06', 'm19', 'cups05', 'wands08', 'pentacles03'],
          body: [
            'The deck has two parts.',
            '<b>22 big cards</b> are about big life themes: love, change, endings, hope. Each has a name, like Death, The Lovers and The Sun. Their official name is the <b>Major Arcana</b> (“arcana” just means secrets).',
            '<b>56 everyday cards</b> are about day-to-day life. Like playing cards, they come in four suits, numbered Ace to Ten, plus four “people” cards in each suit. Their official name is the <b>Minor Arcana</b>.',
            'On the left screen: three big cards, then three everyday cards.',
          ],
        },
        {
          title: 'How a reading works',
          spread: { id: 'ppf', cards: ['cups05', 'm14', 'm17'] },
          body: [
            'Every reading follows the same steps:',
            { points: [
              'The person asks a question.',
              'They shuffle the cards while thinking about it.',
              'You lay a few cards out in a pattern called a <b>spread</b>. Each spot in the spread has a job, like “the past” or “the future”.',
              'You read each card in its spot.',
              'You connect the cards into one story, and finish with advice.',
            ] },
            'The three cards on the left screen are a simple spread: Past, Present and Future.',
          ],
        },
        {
          title: 'The secret to learning fast',
          cards: ['cups05'],
          body: [
            'You don’t need to memorize 78 separate meanings. Most of the cards follow a simple pattern:',
            { points: [
              'The <b>suit</b> tells you what part of life a card is about.',
              'The <b>number</b> tells you where you are in the story.',
            ] },
            'Take the <b>Five of Cups</b>. Cups are about feelings. Fives are about trouble. Trouble with feelings? Disappointment and grief. And look at the picture: someone in black, mourning over spilled cups.',
            'The next three lessons teach you the pattern. Then come the big cards, one small group at a time.',
          ],
        },
      ],
    },

    {
      title: 'The four suits',
      blurb: 'Wands, Cups, Swords and Pentacles: four parts of life.',
      steps: [
        {
          title: 'Four suits, four parts of life',
          cards: ['wands01', 'cups01', 'swords01', 'pentacles01'],
          body: [
            'Each suit is about one part of life, and each one goes with one of the four elements: fire, water, air and earth.',
            { table: [
              ['Wands · Fire', 'Energy: passion, ambition, creativity, action'],
              ['Cups · Water', 'Feelings: love, friendship, relationships'],
              ['Swords · Air', 'Thoughts: words, decisions, arguments, stress'],
              ['Pentacles · Earth', 'Things you can touch: money, work, home, health'],
            ] },
            'Knowing the suit alone gets you halfway to the meaning of any everyday card.',
          ],
        },
        {
          title: 'Wands: energy',
          cards: run('wands', 1, 10),
          body: [
            'Wands are wooden staffs with leaves sprouting from them: living, growing things. Their element is <b>fire</b>.',
            'They’re about energy: passion, ambition, creativity, adventure, getting things moving. Like fire, Wands are exciting and fast, and they can burn out.',
            'Look along the suit: a spark (Ace), making plans (Two, Three), a celebration (Four), a squabble (Five), a victory parade (Six), and at the end, a man struggling under ten heavy wands (Ten).',
          ],
        },
        {
          title: 'Cups: feelings',
          cards: run('cups', 1, 10),
          body: [
            'Cups hold water, and water is the element of <b>feelings</b>: love, friendship, family, intuition and dreams.',
            'When Cups show up, the question is really about how someone feels.',
            'Notice how many Cups pictures are about people together: a couple (Two), friends dancing (Three), a family under a rainbow (Ten).',
          ],
        },
        {
          title: 'Swords: thoughts',
          cards: run('swords', 1, 10),
          body: [
            'Swords cut, the way a sharp mind does. Their element is <b>air</b>: thoughts, words, decisions, truth and conflict.',
            'Many Swords pictures look painful: a heart pierced by swords, a woman awake at night. That’s because thoughts can hurt: worry, arguments, harsh words. But Swords also bring clarity and honesty.',
            'Tip: when a reading is full of Swords, a lot of the trouble is in the person’s head.',
          ],
        },
        {
          title: 'Pentacles: money and the real world',
          cards: run('pentacles', 1, 10),
          body: [
            'Pentacles are gold coins with a star on them. Their element is <b>earth</b>: anything you can touch. Money, work, home, health, your body, the stuff of everyday life.',
            'Pentacles are slow and steady. The pictures show people working, building, saving and growing: a stonemason (Three), a farmer waiting for his harvest (Seven), a family in a rich home (Ten).',
          ],
        },
        {
          title: 'Same number, four suits',
          cards: ['wands05', 'cups05', 'swords05', 'pentacles05'],
          body: [
            'Here’s the trick in action. All four Fives are about <b>trouble</b>. The suit tells you what kind:',
            { table: [
              ['Five of Wands', 'Trouble with energy: everyone pushing, squabbling'],
              ['Five of Cups', 'Trouble with feelings: grief and disappointment'],
              ['Five of Swords', 'Trouble with words: a nasty argument'],
              ['Five of Pentacles', 'Trouble with money: hard times, out in the cold'],
            ] },
            'Click any card on the left screen to see its full meaning.',
          ],
        },
      ],
    },

    {
      title: 'Numbers: Ace to Ten',
      blurb: 'Every suit tells the same story, from start to finish.',
      steps: [
        {
          title: 'Every suit tells a story',
          cards: run('cups', 1, 10),
          body: [
            'Each suit runs from Ace to Ten, and the numbers tell the same story every time: something starts, grows, hits trouble, recovers, and comes to an end.',
            { table: [
              ['Ace', 'A beginning: a seed, a new chance'],
              ['Two', 'A choice, a balance, or a partnership'],
              ['Three', 'Growth: the first results, often with others'],
              ['Four', 'Stability: things settle (sometimes too much)'],
              ['Five', 'Trouble: conflict, loss or a challenge'],
              ['Six', 'Recovery: harmony comes back'],
              ['Seven', 'A test: stop and think, choose, or stand firm'],
              ['Eight', 'Movement: progress, change or mastery'],
              ['Nine', 'Almost there: nearly complete, the peak'],
              ['Ten', 'The end of a cycle: complete, or too much'],
            ] },
          ],
        },
        {
          title: 'The beginning: Ace, Two, Three',
          cards: ['wands01', 'wands02', 'wands03', 'pentacles01', 'pentacles02', 'pentacles03'],
          body: [
            '<b>Aces</b> are seeds: a brand-new start. Every Ace shows a hand coming out of a cloud, offering a gift.',
            '<b>Twos</b> are a choice, a balance, or a pair: two options, or two people.',
            '<b>Threes</b> are the first growth: the plan starts working, often with other people.',
            'In Wands: a spark, then making plans, then watching your ships sail. In Pentacles: a new opportunity, then juggling, then teamwork.',
          ],
        },
        {
          title: 'The middle: Four, Five, Six',
          cards: ['pentacles04', 'pentacles05', 'pentacles06', 'cups04', 'cups05', 'cups06'],
          body: [
            '<b>Fours</b> are stability. Things settle, which is good, but it can turn into being stuck. The man in the Four of Pentacles holds his coins so tight he can’t move.',
            '<b>Fives</b> are trouble: conflict, loss, a setback. They’re usually the hardest cards in their suit.',
            '<b>Sixes</b> are recovery: after the trouble, things get easier and harmony comes back.',
            'In Pentacles: holding on tight, losing everything, then generosity. In Cups: boredom, grief, then sweet memories.',
          ],
        },
        {
          title: 'The end: Seven to Ten',
          cards: ['cups07', 'cups08', 'cups09', 'cups10', 'swords07', 'swords08', 'swords09', 'swords10'],
          body: [
            '<b>Sevens</b> are a test: you have to stop and think, choose, or stand your ground.',
            '<b>Eights</b> are movement: walking on, making progress, or getting really good at something.',
            '<b>Nines</b> are almost there: the peak of the suit, for better or worse.',
            '<b>Tens</b> are the end of a cycle: complete, or simply too much.',
            'In Cups the ending is happy: a wish come true (Nine), a happy family (Ten). In Swords the mind goes to dark places: the worst night of worry (Nine), then rock bottom, with the sun rising behind it (Ten).',
          ],
        },
        {
          title: 'Try it yourself',
          cards: ['wands09', 'swords04', 'cups06', 'pentacles08'],
          body: [
            'Before you click anything, guess what each of these cards means from its number and its suit:',
            { points: ['Nine of Wands', 'Four of Swords', 'Six of Cups', 'Eight of Pentacles'] },
            'Say your guesses out loud, then click each card on the left screen to check.',
            'This trick works for 40 of the 78 cards.',
          ],
        },
      ],
    },

    {
      title: 'The people cards',
      blurb: 'Pages, Knights, Queens and Kings.',
      steps: [
        {
          title: 'Sixteen people',
          cards: ['wands11', 'cups12', 'swords13', 'pentacles14'],
          body: [
            'Each suit has four “court cards”: a Page, a Knight, a Queen and a King. They stand for people, or for ways of acting.',
            { table: [
              ['Page', 'A learner: curious, eager, young at heart. Can also mean a message or news.'],
              ['Knight', 'Charging ahead: action and movement, sometimes too much.'],
              ['Queen', 'Mastery on the inside: caring, understanding, emotionally mature.'],
              ['King', 'Mastery on the outside: in charge, leading, in control.'],
            ] },
          ],
        },
        {
          title: 'Rank + suit = personality',
          cards: run('cups', 11, 14),
          body: [
            'Put the rank and the suit together and you get a personality. Here’s the Cups family, where everything is about feelings:',
            { table: [
              ['Page of Cups', 'A dreamy, sensitive beginner: a sweet surprise'],
              ['Knight of Cups', 'The romantic, arriving with an offer'],
              ['Queen of Cups', 'The kind, caring listener'],
              ['King of Cups', 'Calm and kind, even when things get rough'],
            ] },
          ],
        },
        {
          title: 'The four Queens',
          cards: ['wands13', 'cups13', 'swords13', 'pentacles13'],
          body: [
            'Same rank, different suits. All four Queens are mature and wise, each in her own way:',
            { table: [
              ['Queen of Wands', 'Confident, warm and bold'],
              ['Queen of Cups', 'Caring and intuitive'],
              ['Queen of Swords', 'Honest and sharp'],
              ['Queen of Pentacles', 'Practical and nurturing'],
            ] },
          ],
        },
        {
          title: 'Who is this card?',
          cards: ['swords13', 'pentacles12', 'wands14'],
          body: [
            'When a court card shows up, it can be one of three things:',
            { points: [
              '<b>The person you’re reading for</b>: how they’re acting, or how they need to act.',
              '<b>Someone in their life</b>: a partner, a boss, a friend.',
              '<b>An energy to bring in</b>: “be more like the Queen of Swords here: honest and clear.”',
            ] },
            'How do you know which? Ask: “Does this sound like anyone you know?” And don’t worry about age or gender: a King can be a woman, and a Page can be sixty.',
          ],
        },
      ],
    },

    {
      title: 'Big cards 1: Setting out',
      blurb: 'The Fool through the Chariot (0 to 7).',
      steps: [
        {
          title: 'The Fool’s journey',
          cards: majors,
          body: [
            'The 22 big cards tell one story, called <b>the Fool’s journey</b>. The Fool (card 0) sets out into life and meets each of the other cards as a teacher, ending with The World (card 21).',
            'Learning them as one story is much easier than learning 22 separate meanings. We’ll walk through it in three parts:',
            { points: [
              '<b>0 to 7</b>: growing up, learning from the world around you',
              '<b>8 to 14</b>: looking inward, life’s tests',
              '<b>15 to 21</b>: the big shake-up, and the light after it',
            ] },
          ],
        },
        {
          title: 'The beginner and two teachers',
          cards: ['m00', 'm01', 'm02'],
          body: [
            '<b>0 · The Fool</b>: a beginner jumping into life with no plan, full of trust.',
            '<b>1 · The Magician</b> has one of each suit on his table. He shows the Fool how to <i>make things happen</i>.',
            '<b>2 · The High Priestess</b> sits quietly between two pillars, holding a hidden scroll. She teaches the opposite: <i>listen to your gut</i>.',
            'Doing and knowing, action and intuition: the Fool needs both.',
          ],
        },
        {
          title: 'Mother, father, teacher',
          cards: ['m03', 'm04', 'm05'],
          body: [
            '<b>3 · The Empress</b> is the mother: nature, comfort, growth and creativity. Everything around her is blooming.',
            '<b>4 · The Emperor</b> is the father: rules, structure and protection. His throne is solid stone.',
            '<b>5 · The Hierophant</b> is the teacher: traditions, school, religion, the way things are done.',
            'Together they’re the family and society that raise the Fool.',
          ],
        },
        {
          title: 'Love and willpower',
          cards: ['m06', 'm07'],
          body: [
            '<b>6 · The Lovers</b>: the Fool’s first big choice from the heart. It’s about love, and also about choosing what you truly value.',
            '<b>7 · The Chariot</b>: with that choice made, the Fool drives out into the world. Two sphinxes pull in different directions, and he steers with willpower alone.',
            'That’s the end of part one: the Fool has grown up and set off into the world.',
          ],
        },
      ],
    },

    {
      title: 'Big cards 2: Looking inward',
      blurb: 'Strength through Temperance (8 to 14).',
      steps: [
        {
          title: 'Strength and solitude',
          cards: ['m08', 'm09'],
          body: [
            '<b>8 · Strength</b>: a woman calmly closes a lion’s mouth. Real strength is patience and kindness, not force.',
            '<b>9 · The Hermit</b>: alone on a mountain with a lantern. Time to step back and look for answers inside.',
            'Out in the world, the Fool learned to act. Now the lessons turn inward.',
          ],
        },
        {
          title: 'Luck and fairness',
          cards: ['m10', 'm11'],
          body: [
            '<b>10 · The Wheel of Fortune</b>: life goes up and down. Luck changes, and what’s down comes back up. A turning point.',
            '<b>11 · Justice</b>: scales and a sword. Fairness, truth and consequences: what you put out comes back to you.',
            'One is about what you can’t control (luck). The other is about what you can (your choices).',
          ],
        },
        {
          title: 'Let go, end, rebalance',
          cards: ['m12', 'm13', 'm14'],
          body: [
            '<b>12 · The Hanged Man</b>: hanging upside down, calm, with a glowing halo. Pause, let go, and see things from a new angle.',
            '<b>13 · Death</b>: the most feared card, and it almost never means actual death. It means an ending: one chapter closes so a new one can start. Look for the sun rising in the background.',
            '<b>14 · Temperance</b>: an angel pouring water between two cups. After the ending comes balance and healing, taking things slowly.',
          ],
        },
      ],
    },

    {
      title: 'Big cards 3: The shake-up and the light',
      blurb: 'The Devil through The World (15 to 21).',
      steps: [
        {
          title: 'The darkest part of the night',
          cards: ['m15', 'm16'],
          body: [
            '<b>15 · The Devil</b>: two people chained to a devil, but the chains are loose. Bad habits, addiction, feeling trapped by something you could actually walk away from.',
            '<b>16 · The Tower</b>: lightning strikes and the tower falls. Sudden, shocking change, but it only knocks down what was built on shaky ground.',
          ],
        },
        {
          title: 'Lights in the sky',
          cards: ['m17', 'm18', 'm19'],
          body: [
            'After the Tower, the sky opens up, and the next three cards are its lights.',
            '<b>17 · The Star</b>: hope and healing. Calm after the storm.',
            '<b>18 · The Moon</b>: confusion. By moonlight, things aren’t what they seem: fears, dreams and imagination.',
            '<b>19 · The Sun</b>: pure joy and success. One of the best cards in the deck.',
          ],
        },
        {
          title: 'Waking up, and coming full circle',
          cards: ['m20', 'm21', 'm00'],
          body: [
            '<b>20 · Judgement</b>: an angel’s trumpet wakes everyone up. A calling, a reckoning, a fresh start.',
            '<b>21 · The World</b>: completion. The journey is done and the goal is reached.',
            'And then? The Fool sets out on a new journey. Life goes in cycles, and so does the deck.',
          ],
        },
        {
          title: 'Scary cards aren’t that scary',
          cards: ['m13', 'm16', 'm15', 'swords10', 'swords03'],
          body: [
            'Some cards look frightening, and the person you’re reading for may gasp when one turns up. Stay calm, and explain what it really means:',
            { table: [
              ['Death', 'An ending that makes room for something new'],
              ['The Tower', 'A sudden shake-up that clears out what wasn’t working'],
              ['The Devil', 'Something has a hold on you, and you’re freer than you think'],
              ['Ten of Swords', 'Rock bottom, so the only way from here is up'],
              ['Three of Swords', 'Hurt that needs to be felt so it can heal'],
            ] },
            'Every one of these cards has a hopeful side. Find it, and say it.',
          ],
        },
      ],
    },

    {
      title: 'Upside-down cards',
      blurb: 'What it means when a card comes out reversed.',
      steps: [
        {
          title: 'When a card comes out upside down',
          cards: ['m19', 'm19:r'],
          body: [
            'When you lay out the cards, some land upside down. Many readers give these <b>reversed</b> cards a meaning of their own.',
            'The simple rule: an upside-down card’s energy is <b>blocked, delayed, turned inward, or too much or too little</b>.',
            'The Sun right side up is joy. Upside down, the joy is still there, but behind a cloud: a passing dip, or trouble feeling happy.',
          ],
        },
        {
          title: 'Hard cards often get easier',
          cards: ['m15:r', 'swords09:r', 'pentacles05:r'],
          body: [
            'For the hard cards, upside down often means the hard part is ending:',
            { table: [
              ['The Devil, upside down', 'Breaking free from what had a hold on you'],
              ['Nine of Swords, upside down', 'The worry is easing; hope is coming back'],
              ['Five of Pentacles, upside down', 'Recovering from hard times; help is arriving'],
            ] },
          ],
        },
        {
          title: 'It’s your choice',
          cards: ['cups01', 'cups01:r'],
          body: [
            'You don’t have to use upside-down cards. Plenty of good readers don’t; they simply turn every card the right way up.',
            'Our advice: learn the cards right side up first. When you feel comfortable, switch on <b>Upside-down cards</b> at the top right of the left screen. Flashcards, practice readings and the card of the day will then include them.',
          ],
        },
      ],
    },

    {
      title: 'Spreads',
      blurb: 'Why where a card lands changes what it means.',
      steps: [
        {
          title: 'Where a card lands matters',
          cards: ['cups02'],
          body: [
            'A <b>spread</b> is the pattern you lay the cards out in. Each spot has a job, and the same card reads differently depending on where it lands.',
            'The Two of Cups is a loving partnership. In the <b>Past</b> spot, that’s a relationship behind you. In the <b>Future</b> spot, it’s one on its way.',
          ],
        },
        {
          title: 'One card',
          spread: { id: 'one', cards: ['m17'] },
          body: [
            'The simplest reading is one card. It’s great for a quick question, or a <b>card of the day</b> each morning.',
            'Describe the picture, give its meaning, and connect it to the question. The Star, for “What do I need to know today?”: be hopeful; healing is happening.',
            'Tip: turn over the card of the day on the Home screen every day. It’s the easiest way to learn the deck.',
          ],
        },
        {
          title: 'Three cards: Past, Present, Future',
          spread: { id: 'ppf', cards: ['swords03', 'm14', 'm17'] },
          body: [
            'The most popular spread. Read it left to right, like a sentence.',
            'Here: <b>Three of Swords</b> (past: heartbreak), <b>Temperance</b> (present: finding balance, healing slowly), <b>The Star</b> (future: hope).',
            'The story: “You’ve been hurt. Right now you’re healing by taking things slowly, and better days are coming.”',
          ],
        },
        {
          title: 'More three-card spreads',
          spread: { id: 'sao', cards: ['swords02', 'm09', 'm21'] },
          body: [
            'Three cards can answer different kinds of questions, depending on the job you give each spot:',
            { table: [
              ['Situation · Action · Outcome', 'What’s going on, what to do, where it leads'],
              ['You · Them · Together', 'For a relationship: each person, and the relationship itself'],
              ['Two choices', 'For a decision: one card for each option, and one card of advice'],
            ] },
            'All of these are in Practice and Read for someone. Pick the one that fits the question.',
          ],
        },
        {
          title: 'The Celtic Cross',
          spread: { id: 'cross', cards: ['m07', 'swords05', 'pentacles04', 'wands06', 'm21', 'cups03', 'wands13', 'pentacles03', 'cups09', 'm10'] },
          body: [
            'The classic ten-card spread, for big questions. The cross on the left is the situation; the column on the right is the person and where it’s all going.',
            { table: [
              ['1 · The heart of it', 'The situation right now'],
              ['2 · What crosses it', 'The challenge in the way'],
              ['3 · Underneath', 'The root of it all'],
              ['4 · Behind', 'The recent past'],
              ['5 · Above', 'The best that can happen'],
              ['6 · Ahead', 'The near future'],
              ['7 · Yourself', 'Their own attitude'],
              ['8 · Around them', 'Other people'],
              ['9 · Hopes and fears', 'What they hope for, or fear'],
              ['10 · Where it’s heading', 'The likely outcome'],
            ] },
          ],
        },
      ],
    },

    {
      title: 'Reading cards together',
      blurb: 'Combos: how cards change each other.',
      steps: [
        {
          title: 'Look at the whole table first',
          spread: { id: 'cross', cards: ['cups05', 'swords09', 'cups08', 'swords03', 'm17', 'cups06', 'swords04', 'cups13', 'm18', 'cups02'] },
          body: [
            'Before reading any single card, look at all of them together and notice:',
            { points: [
              '<b>How many big cards?</b> Lots: a major life chapter. None: everyday matters, in the person’s own hands.',
              '<b>Which suit shows up most?</b> Mostly Cups: it’s about feelings. Mostly Swords: stress and overthinking. Mostly Pentacles: money and work. Mostly Wands: action.',
              '<b>Any repeated numbers?</b> Two or three Fives: conflict is a theme. Several Aces: new beginnings everywhere.',
              '<b>Lots of people cards?</b> Several people are involved.',
              '<b>Lots of upside-down cards?</b> Things are stuck or delayed.',
            ] },
            'On the left: mostly Cups and Swords, so this is about feelings and worry. Probably heartbreak, with hope (the Star) on the way.',
          ],
        },
        {
          title: 'Suits that get along',
          cards: ['wands01', 'swords01', 'cups01', 'pentacles01'],
          body: [
            'The suits’ elements get along with some suits and clash with others. Readers call this <b>elemental dignities</b>.',
            { table: [
              ['Fire + Air (Wands + Swords)', 'Friends: wind fans a fire. They boost each other.'],
              ['Water + Earth (Cups + Pentacles)', 'Friends: rain helps things grow. They support each other.'],
              ['Fire + Water (Wands + Cups)', 'Clash: water puts out fire. Tension between them.'],
              ['Air + Earth (Swords + Pentacles)', 'Clash: head in the clouds, feet on the ground.'],
              ['Same element', 'Doubled up: that energy is extra strong.'],
            ] },
            'The big cards have elements too. The Combos tab shows them for any pair.',
          ],
        },
        {
          title: 'Famous pairs',
          cards: ['m16', 'm17', 'm13', 'swords10', 'm06', 'cups02'],
          body: [
            'Some pairs have well-known meanings. A few favorites:',
            { table: [
              ['The Tower + The Star', 'Things fall apart, then hope'],
              ['Death + Ten of Swords', 'A definite ending: it’s really over'],
              ['The Lovers + Two of Cups', 'Deep, mutual love'],
            ] },
            'The Combos tab has dozens of these, and explains any pair you pick.',
          ],
        },
        {
          title: 'Read pairs like a sentence',
          cards: ['wands08', 'cups01'],
          body: [
            'When two cards sit side by side, read them as one sentence: the first card is what happens, the second describes it.',
            '<b>Eight of Wands + Ace of Cups</b>: something moving fast + new love = “a new love that arrives quickly.”',
            'There’s no single right answer. Go with the story that feels right, and check it with the person.',
          ],
        },
      ],
    },

    {
      title: 'Reading for someone else',
      blurb: 'Good questions, the conversation, and being kind.',
      steps: [
        {
          title: 'Help them ask a good question',
          cards: ['m02'],
          body: [
            'How someone asks matters. Yes-or-no questions, and questions about what someone else is thinking, don’t give the cards much room. Help them turn it into an open question about <b>themselves</b>:',
            { table: [
              ['“Will he come back?”', '“What do I need to know about my last relationship?”'],
              ['“Will I get the job?”', '“What will help me most with this job search?”'],
              ['“Is she cheating?”', '“What’s really going on in my relationship?”'],
              ['“Will I be rich?”', '“How can I improve my finances?”'],
            ] },
            'Each person in Practice shows how their question could be asked better.',
          ],
        },
        {
          title: 'Setting up',
          cards: ['back', 'back', 'back'],
          body: [
            'Let them shuffle while they think about their question. That makes it their reading.',
            'Many readers then ask them to cut the deck into three piles with their left hand, and stack it back together any way they like. Then you deal the cards face down into the spread.',
            'Turn the cards over one at a time, in order. Take a moment to look before you talk.',
          ],
        },
        {
          title: 'Look, then talk',
          cards: ['cups08'],
          body: [
            'Start by describing what you see: “There’s a man walking away from his cups, at night, toward the mountains.” People often connect the picture to their own life before you even explain it.',
            'Then give the meaning, and ask a question: “This card is about walking away from something that isn’t fulfilling you anymore. Does that ring a bell?”',
            'It’s a conversation, not a performance. Their answers help you read the next card.',
          ],
        },
        {
          title: 'Tell the story',
          spread: { id: 'ppf', cards: ['pentacles05', 'pentacles06', 'pentacles10'] },
          body: [
            'Once every card is turned over, put them together into one story, from start to finish:',
            '“You’ve been through a hard time with money (Five of Pentacles). Help is there right now, if you’ll accept it (Six of Pentacles). And it leads to real, lasting security (Ten of Pentacles).”',
            'Always finish with something they can do. The future in tarot is a likely path, not a fixed fate.',
          ],
        },
        {
          title: 'Be kind and responsible',
          cards: ['m11'],
          body: [
            { points: [
              'Never predict death, illness or pregnancy. That isn’t what the cards are for, and it can really frighten people.',
              'Don’t stand in for a doctor, lawyer or financial adviser. Encourage people to get real help with real problems.',
              'Soften the hard cards: name what’s hard, then find the hopeful side.',
              'Respect free will. The cards show possibilities; the person makes the choices.',
              'Keep what they tell you private.',
            ] },
            'A good reading leaves someone feeling clearer and more in charge of their life, not scared.',
          ],
        },
      ],
    },

    {
      title: 'Your first readings',
      blurb: 'How to keep practicing from here.',
      steps: [
        {
          title: 'How to practice',
          cards: ['m01'],
          body: [
            'You’ve learned the whole system. Now it’s practice:',
            { points: [
              '<b>Flashcards</b>, a few minutes a day. The app keeps showing you the cards you don’t know yet.',
              '<b>Card of the day</b>, on the Home screen. Read it in the morning, and notice how it fits your day.',
              '<b>Practice</b>: a made-up person asks a question. Read their cards out loud, then see how the app reads them.',
              '<b>Combos</b>: pick any two cards and see how they work together.',
              '<b>Read for someone</b>: when you read for a real person with a real deck, put in the cards you drew, and the right screen helps you.',
            ] },
            'Every reader started exactly where you are. Have fun with it.',
          ],
        },
      ],
    },
  ];
})();
