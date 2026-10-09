// The spreads (the patterns cards are laid out in), and the made-up people who ask questions in Practice.
//
// A spot:  name, the question it answers (q), and a tip for reading a card there (how).
// layout:  where each card's center sits, in card widths (a card is 1 wide and 1.714 tall); a third
//          value of 90 turns that card sideways.
window.TAROT_SPREADS = (() => {
  const SPREADS = {
    one: {
      name: 'One card', short: 'One card',
      spots: [
        { name: 'The message', q: 'What do they most need to know?',
          how: 'With one card, describe the picture, give its meaning, and connect it to their question.' },
      ],
      layout: [[0.5, 0.857]],
    },
    ppf: {
      name: 'Past · Present · Future', short: 'Past, present, future',
      spots: [
        { name: 'Past', q: 'What led to this?',
          how: 'This is the Past spot, so talk about it as something behind them that still shapes things.' },
        { name: 'Present', q: 'Where do things stand now?',
          how: 'This is the Present spot: describe what’s going on right now, and ask if it fits.' },
        { name: 'Future', q: 'Where is it heading?',
          how: 'This is the Future spot: where things are heading if nothing changes. A likely path, not a fixed fate.' },
      ],
      layout: [[0.5, 0.857], [1.75, 0.857], [3, 0.857]],
    },
    sao: {
      name: 'Situation · Action · Outcome', short: 'Situation, action, outcome',
      spots: [
        { name: 'Situation', q: 'What’s really going on?',
          how: 'Describe the situation this card paints, and check it with them.' },
        { name: 'Action', q: 'What should they do?',
          how: 'Read this card as advice. A hard card here is a warning: something to deal with or avoid.' },
        { name: 'Outcome', q: 'Where does that lead?',
          how: 'This is where things go if they follow the advice.' },
      ],
      layout: [[0.5, 0.857], [1.75, 0.857], [3, 0.857]],
    },
    rel: {
      name: 'You · Them · Together', short: 'You, them, together',
      spots: [
        { name: 'You', q: 'What do they bring, and how do they feel?',
          how: 'This card describes the person asking: their feelings and their part in it.' },
        { name: 'Them', q: 'What does the other person bring?',
          how: 'This card describes the other person. Remember, you’re only hearing one side of the story.' },
        { name: 'Together', q: 'What is the relationship itself like?',
          how: 'This card is the relationship as its own thing: the “us”.' },
      ],
      layout: [[0.5, 0.857], [3, 0.857], [1.75, 0.857]],
    },
    choice: {
      name: 'Two choices', short: 'Two choices',
      spots: [
        { name: 'Choice A', q: 'How would the first option go?',
          how: 'Read this card as a picture of how the first option would turn out.' },
        { name: 'Choice B', q: 'How would the second option go?',
          how: 'Read this card as a picture of how the second option would turn out.' },
        { name: 'Advice', q: 'What do they need to know to decide?',
          how: 'This card doesn’t choose for them. It shows what to keep in mind while they decide.' },
      ],
      layout: [[0.5, 0.857], [3, 0.857], [1.75, 0.857]],
    },
    cross: {
      name: 'Celtic Cross', short: 'Celtic Cross (10 cards)',
      spots: [
        { name: 'The heart of it', q: 'What’s the situation, at its core?',
          how: 'The center card: the heart of the matter, right now.' },
        { name: 'What crosses it', q: 'What’s getting in the way?',
          how: 'Lying across the first card: the challenge. Even a happy card here is something to work around.' },
        { name: 'Underneath', q: 'What’s at the root of this?',
          how: 'Below the cross: the foundation or hidden cause, often from further back.' },
        { name: 'Behind', q: 'What just happened?',
          how: 'To the left: the recent past, now moving out of the picture.' },
        { name: 'Above', q: 'What’s the best that can happen?',
          how: 'Above the cross: their goal, or the best possible outcome.' },
        { name: 'Ahead', q: 'What’s coming up next?',
          how: 'To the right: the near future, the next few weeks or months.' },
        { name: 'Yourself', q: 'How are they handling it?',
          how: 'Bottom of the column: their own attitude, and how they see themselves in this.' },
        { name: 'Around them', q: 'What about the people around them?',
          how: 'Their surroundings: friends, family, coworkers, and how others see them.' },
        { name: 'Hopes and fears', q: 'What are they hoping for, or afraid of?',
          how: 'Hopes and fears are often the same thing. Ask them which this feels like.' },
        { name: 'Where it’s heading', q: 'Where is this going?',
          how: 'The likely outcome if things carry on as they are. It pulls the whole reading together.' },
      ],
      layout: [[2.1, 3.57], [2.1, 3.57, 90], [2.1, 5.47], [0.5, 3.57], [2.1, 1.67], [3.7, 3.57],
        [5.1, 6.285], [5.1, 4.475], [5.1, 2.665], [5.1, 0.857]],
    },
  };

  // Practice: made-up people and their questions. "better" is a more open way to ask it (null if it's
  // already a good question); "labels" renames spots for this person (null keeps the spread's own name).
  const CLIENTS = [
    { name: 'Maria', asked: 'Should I take the job offer in Denver?', topic: 'decision', spread: 'choice',
      better: 'What do I need to know to choose between the Denver job and staying here?', labels: ['Taking the Denver job', 'Staying here'] },
    { name: 'Jordan', asked: 'Is my boyfriend ever going to propose?', topic: 'love', spread: 'rel',
      better: 'What do I need to know about where my relationship is heading?', labels: ['Jordan', 'The boyfriend', 'The relationship'] },
    { name: 'Priya', asked: 'Will I ever find love?', topic: 'love', spread: 'sao',
      better: 'What can I do to open myself up to love?' },
    { name: 'Marcus', asked: 'Why do my brother and I keep fighting?', topic: 'general', spread: 'rel',
      better: null, labels: ['Marcus', 'The brother', 'The two of them'] },
    { name: 'Elena', asked: 'Is my bakery idea going to make money?', topic: 'money', spread: 'sao',
      better: 'What do I need to know about starting my bakery?' },
    { name: 'Sam', asked: 'I feel stuck. What should I do?', topic: 'general', spread: 'sao',
      better: 'What’s keeping me stuck, and what’s my next step?' },
    { name: 'Aisha', asked: 'Should I move back home or stay in the city?', topic: 'decision', spread: 'choice',
      better: 'What do I need to know about moving home versus staying in the city?', labels: ['Moving back home', 'Staying in the city'] },
    { name: 'Tom', asked: 'Is my ex coming back?', topic: 'love', spread: 'ppf',
      better: 'What do I need to understand about my last relationship so I can move forward?' },
    { name: 'Lily', asked: 'Will I pass my nursing exam?', topic: 'work', spread: 'sao',
      better: 'What will help me most with my nursing exam?' },
    { name: 'Diego', asked: 'Is my coworker trying to get me fired?', topic: 'work', spread: 'sao',
      better: 'What’s going on at work, and how should I handle it?' },
    { name: 'Grace', asked: 'What does this year have in store for me?', topic: 'general', spread: 'cross', better: null },
    { name: 'Kevin', asked: 'Should I lend my friend $2,000?', topic: 'money', spread: 'choice',
      better: null, labels: ['Lending the money', 'Saying no'] },
    { name: 'Nina', asked: 'Is he the one?', topic: 'love', spread: 'rel',
      better: 'What do I need to know about this relationship?', labels: ['Nina', 'The partner', 'The relationship'] },
    { name: 'Omar', asked: 'Why can’t I ever save money?', topic: 'money', spread: 'sao',
      better: 'What’s getting in the way of saving, and what will help?' },
    { name: 'Hannah', asked: 'Should I go back to school?', topic: 'decision', spread: 'choice',
      better: null, labels: ['Going back to school', 'Staying on my current path'] },
    { name: 'Chris', asked: 'My mom and I aren’t speaking. Will we ever fix it?', topic: 'general', spread: 'rel',
      better: 'What can help heal things between my mom and me?', labels: ['Chris', 'Mom', 'The relationship'] },
    { name: 'Rosa', asked: 'I just got divorced. What now?', topic: 'general', spread: 'cross',
      better: 'What do I need to know as I start this new chapter?' },
    { name: 'Ben', asked: 'Will my band make it big?', topic: 'work', spread: 'ppf',
      better: 'What do I need to know about my music career?' },
    { name: 'Zoe', asked: 'Is it time to quit my job?', topic: 'work', spread: 'sao',
      better: 'What do I need to know about my job right now?' },
    { name: 'Ahmed', asked: 'Am I making a mistake buying a house?', topic: 'money', spread: 'ppf',
      better: 'What do I need to know about buying a house right now?' },
    { name: 'Mia', asked: 'What should I focus on today?', topic: 'general', spread: 'one', better: null },
    { name: 'Sofia', asked: 'Does my crush like me back?', topic: 'love', spread: 'ppf',
      better: 'What do I need to know about my feelings for this person?' },
    { name: 'Jake', asked: 'Will my new restaurant succeed?', topic: 'work', spread: 'cross',
      better: 'What will help my restaurant succeed?' },
    { name: 'Lena', asked: 'How can I feel more confident?', topic: 'general', spread: 'one', better: null },
  ];

  const TOPICS = {
    general: 'General', love: 'Love', work: 'Work', money: 'Money', decision: 'A decision',
  };

  return { SPREADS, CLIENTS, TOPICS };
})();
