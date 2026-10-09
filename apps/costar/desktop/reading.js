// Star Wall's daily reading. Turns the day's transits into a headline, the Power / Pressure / Trouble
// lines, a short paragraph, a Do / Don't list and transit cards.
//
// The strongest transit sets the subject (which part of your chart it touches) and the tone (easy or
// hard). Choices within that are seeded by the date, so the reading holds all day and changes tomorrow.
// A transit card's text is seeded by the transit itself, so it reads the same for as long as it lasts.
window.StarReading = (() => {
  // ---- Writing ----

  // Headlines, by the part of you a transit touches, then by tone. Each is the headline itself and two
  // sentences under it that say what it means and what to do about it: something to think about, not a slogan.
  const HEADLINES = {
    self: {
      soft: [
        ['The person you are when nobody needs anything is worth meeting.', "Today leaves a gap in the usual demands. Notice what you reach for unprompted: that's a truer self-portrait than any description you'd give."],
        ['Confidence is mostly the absence of a running commentary.', "You'll do better today acting first and reviewing later. The second-guessing you're used to isn't protecting you from anything right now."],
        ['Be legible.', 'People can only meet the version of you that you let them see. Say plainly what you think and what you want, and let them respond to the real thing.'],
        ['Ease is not the same as laziness.', "When something comes naturally it can feel like it doesn't count. It does. Let today's easy wins be wins."],
      ],
      hard: [
        ["You can't edit yourself into someone easier to love.", 'The urge to sand down your edges for someone else is strong today. The people worth keeping were never asking for that.'],
        ['Not every reaction to you is about you.', "Someone's mood may land on you today. Before you take it personally, ask what else they're carrying: usually far more than you."],
        ['Being right is a lonely place to stand.', 'You could win the point today and lose the room. Decide in advance which one you actually care about.'],
        ["Stop auditioning for people who've already decided.", "Some approval isn't available, however well you perform. Notice where you're still trying, and spend that on people who are paying attention."],
      ],
    },
    feelings: {
      soft: [
        ['Let a feeling finish its sentence before you answer it.', 'Emotions come through clearly today, which makes it tempting to act on the first one. Wait a minute: the second feeling is usually the more honest one.'],
        ["Rest isn't a reward you earn. It's maintenance.", "You'll get more from a quiet hour today than from pushing through. Treat it as upkeep, not indulgence."],
        ["Home is a feeling before it's a place.", "Notice where you relax without meaning to: a room, a person, a routine. That's information about what to protect."],
        ['Someone remembers you more warmly than you think.', "Old connections are easy to reach today. A short message to someone you've drifted from will land better than you expect."],
      ],
      hard: [
        ['Your mood is weather, not a forecast.', "Something will feel heavier than it is today. Note it, but don't build on it: the conclusions this mood suggests won't survive tomorrow."],
        ["The thing you're avoiding is smaller than the avoiding.", 'The dread around an unfinished task usually outweighs the task. Give it twenty minutes and see how much of the weight was the waiting.'],
        ["You're not too much. You may be in the wrong room.", "If you feel you're asking for more than people can give, the problem may be the match, not the need. Notice who never makes you feel that way."],
        ['Not every feeling needs an audience.', "Some of what comes up today is better worked through than shared. Write it down first; decide later whether anyone needs to hear it."],
      ],
    },
    mind: {
      soft: [
        ['Say the obvious thing out loud.', "The point everyone is circling is clearer to you than you assume. Saying it simply will save the room an hour."],
        ['Curiosity gets you further than certainty.', 'Ask one more question than feels polite today. The useful part of most conversations comes after the second answer.'],
        ["Your best idea arrives while you're doing something else.", "Don't sit and wait for it. Walk, cook, drive, and keep something nearby to write it down before it fades back into a feeling."],
        ['Write it down before it turns into a story.', "Your thinking is sharp, but memory edits fast. Get the actual words, numbers and decisions on paper while they're still accurate."],
      ],
      hard: [
        ["You've already had this argument in your head, and you lost.", "Rehearsing a conversation makes it worse than it will be. Have the real version, briefly, or let it go."],
        ['Read it again before you send it.', 'Tone is easy to misread today, in both directions. A pause before replying costs nothing and saves a lot.'],
        ['Overthinking is worry with a bigger vocabulary.', "More analysis won't settle this. Pick the option you'd defend to a friend, and move."],
        ['Silence is also an answer.', "Not every message needs a reply today, and not every comment needs correcting. Notice how much lighter the day feels when you let some of it go."],
      ],
    },
    love: {
      soft: [
        ["Affection only counts once it's said out loud.", "Something you value about someone is clear to you today. Tell them, and be specific: the detail, not the summary, is what they'll keep."],
        ["Pleasure doesn't need a justification.", 'Taste, beauty and comfort are well supported today. Spend a little on something that makes ordinary life better, not on proving anything.'],
        ['Attention is the most romantic thing you can give.', 'Put the phone away and listen properly to someone today. It will be noticed, and remembered.'],
        ['Let yourself be charmed.', "You're more open than usual to people and things you'd normally dismiss. Say yes to one invitation you'd usually decline."],
      ],
      hard: [
        ["Wanting someone isn't the same as liking them.", "Desire and compatibility are pulling different ways today. Before you act on the first, check that you'd still choose the second."],
        ["You can't negotiate someone into caring.", "If you're working hard to be valued, notice it. The effort that matters is the kind that comes back without being argued for."],
        ['Jealousy is a map of what you want.', "If someone else's life stings today, look at exactly which part. That's the thing to work toward, not the person to resent."],
        ["What you value and what you crave aren't the same list.", 'A comfort purchase or an easy reassurance will look tempting. Ask whether it serves the life you want or just the evening.'],
      ],
    },
    drive: {
      soft: [
        ['Start before you feel ready.', "You have more energy than patience right now, and that's useful. Begin the thing you've been preparing for; readiness comes in the doing."],
        ['Spend your energy on purpose.', "There's real momentum today. Point it at one thing that matters, not ten errands that only feel productive."],
        ['Do the hard part first.', "Your stamina is highest early. Get the task you're dreading out of the way, and the rest of the day gets easy."],
        ['Your body has an opinion. Ask it.', "If you're stuck, move: a walk, a workout, a long stretch. Some decisions are clearer once your heart rate is up."],
      ],
      hard: [
        ['Anger is information, not instructions.', "Something will irritate you today. Find out what it's pointing at before you decide what to do about it."],
        ['Not every fight is yours to win.', "Pick the one disagreement that actually matters and let the rest pass. You'll have more force where it counts."],
        ['Urgency is not the same as importance.', 'Pressure today will make small things feel like emergencies. Ask what would really happen if this waited a day.'],
        ['Impatience is often tiredness in disguise.', "If everything feels too slow, check how you've slept and eaten before you blame the people around you."],
      ],
    },
    luck: {
      soft: [
        ['Ask for a little more than feels comfortable.', "Openings are wider than usual today. The worst likely answer is no, and the best is better than you'd have settled for."],
        ['Luck finds people who are already moving.', "Send the application, make the call, show up. Fortune can't reward what you didn't try."],
        ['Generosity comes back around.', "Something you give freely today, whether time, a recommendation or credit, comes back later in a form you won't expect."],
        ['Think bigger than this week.', "You're seeing the long view more clearly than usual. Write down where you'd like to be in a year while it feels possible."],
      ],
      hard: [
        ['More is not the same as better.', 'The temptation today is to add: one more plan, one more purchase, one more yes. Taking something away would help more.'],
        ['Optimism is not a plan.', 'Your confidence is running ahead of the details. Keep the enthusiasm, then check the numbers.'],
        ["You can't fit everything in. Choose.", 'Saying yes to everything means doing all of it a little worse. Pick the two that matter and decline the rest kindly.'],
        ["A promise you can't keep costs more than a no.", "You'll be inclined to commit generously today. Only offer what you'd still be glad to deliver next week."],
      ],
    },
    limits: {
      soft: [
        ['Discipline is a form of self-respect.', 'Structure feels supportive today rather than confining. Use it to set up a routine your future self will thank you for.'],
        ['The boring answer is usually the right one.', 'Steady, unglamorous effort pays off now. Do the maintenance: the budget, the appointment, the follow-up.'],
        ['Build something that will still be standing next year.', 'Work done today has staying power. Spend it on foundations rather than decoration.'],
        ['A boundary is a kindness to both sides.', "Saying clearly what you will and won't do is easier today, and it spares everyone the guesswork."],
      ],
      hard: [
        ["You can't skip this lesson. You can only repeat it.", "Something familiar is showing up again. Instead of fighting it, ask what it keeps trying to teach you."],
        ["The rules feel personal today. They aren't.", 'Delays and limits will land harder than they should. Treat them as conditions to work with, not judgments about you.'],
        ["Responsibility is heavy because it's real.", "You may feel weighed down by what you've taken on. The weight is a sign it matters, and a reason to share some of it."],
        ["You're harder on yourself than anyone else is.", 'If you feel behind or disappointing, check the evidence. Most of the pressure is coming from inside.'],
      ],
    },
    change: {
      soft: [
        ["Try the option you'd normally rule out.", "You're more open to the unfamiliar than usual. A small experiment today could become a better habit."],
        ["You're allowed to change your mind out loud.", "An opinion you've held a long time may not fit anymore. Saying so is a sign of thinking, not weakness."],
        ['A small disruption can open a better door.', "If plans shift today, follow the detour for a while before steering back. Some of the best things aren't on the schedule."],
        ['Freedom is mostly fewer obligations.', 'Cancel one thing you only agreed to out of habit. Notice how much room it leaves.'],
      ],
      hard: [
        ['Plans are suggestions today.', 'Something you counted on may shift at short notice. Keep the day loose, and leave margin around anything important.'],
        ["Restlessness isn't always a sign to leave.", "You'll want to break out of something today. Before you do, make sure it's the cage and not just the boredom."],
        ['Chaos is only fun when you chose it.', "Unexpected changes are likely. Decide which ones you'll go along with and which you'll firmly decline."],
        ['The ground is moving. Bend your knees.', 'Resisting the change will cost more than adapting to it. Stay flexible and keep decisions small until things settle.'],
      ],
    },
    dream: {
      soft: [
        ['Make something nobody asked for.', 'Your imagination is unusually open today. Write, draw, cook, play: the point is the making, not the result.'],
        ['Daydreaming is a kind of planning.', 'Let your mind wander on purpose for a while. Some of what turns up there is worth keeping.'],
        ['Your intuition is ahead of your reasoning.', 'If something feels off, or right, before you can explain why, take it seriously. The explanation usually catches up.'],
        ['Let the edges of the day stay soft.', 'Not everything needs a schedule. Leave an open hour and see what fills it.'],
      ],
      hard: [
        ['Not everything you feel is true.', 'Your sense of things is vivid but unreliable today. Check the facts before you act on an impression.'],
        ['Read the fine print on your fantasies.', "What you're hoping for may be dressed up better than it is. Enjoy the idea, then look at the details."],
        ['Escaping is fine. Know the way back.', 'You may want to disappear into a screen, a book or sleep. Take the break, but set a time to come back.'],
        ["Don't sign anything until the fog lifts.", 'Agreements and big decisions are easy to misjudge today. If it can wait, let it.'],
      ],
    },
    power: {
      soft: [
        ["You're allowed to outgrow people.", "A relationship or habit that used to fit may feel small now. That's growth, not betrayal."],
        ['Let something end without a fight.', 'Something has run its course. Closing it cleanly leaves room for what comes next.'],
        ['Intensity is a gift when it has a direction.', 'You can go deep today, into a project, a conversation or a problem. Pick one and give it your full attention.'],
        ['The most real change is the quiet kind.', "Something is shifting in how you see yourself. You don't need to announce it; you'll see it in your choices."],
      ],
      hard: [
        ['Control is a story you tell yourself at night.', "You'll want to manage outcomes that aren't yours to manage. Do your part, and leave the rest."],
        ["Let go before it's taken from you.", "Holding on to something that's ending will cost more than releasing it. Choose the timing yourself."],
        ['Obsession is attention without an exit.', 'If one thought keeps looping, give it a set time to be thought through, then close it.'],
        ['A power struggle is still a struggle.', "Winning a standoff today may cost you a relationship. Ask whether you'd rather be right or close."],
      ],
    },
    work: {
      soft: [
        ['Your reputation is doing some of the work.', "People are more receptive to you than usual. It's a good day to pitch, ask, or put your name to something."],
        ['Ask for it, then ask for a little more.', "Requests at work land well today. Be specific about what you want and why it's earned."],
        ['Someone important is paying attention.', 'Your effort is more visible than you think. Do the visible parts well.'],
        ["Your work is better than you're letting yourself see.", "Look at what you've finished rather than what's left. The record is stronger than your worry."],
      ],
      hard: [
        ['Busy is not the same as important.', 'A full calendar can hide a lack of progress. Find the one task that would actually move things, and protect time for it.'],
        ["You don't owe your job your whole personality.", 'Work will try to take more than its share today. Leave something for the rest of your life.'],
        ['Success that costs your sleep is overpriced.', "If the pace can't be kept up, neither can the results. Pull back where you can."],
        ['Your title is not your identity.', "A setback or criticism at work may sting today. It's about the work, not about who you are."],
      ],
    },
  };

  // What the moving planet is doing, by tone.
  const BODY_LINES = {
    Sun: {
      soft: ["You're seeing yourself clearly today, and it's a better view than you expected.", 'You have more presence than usual. People notice when you walk in.'],
      hard: ['There is a glare on everything today, and some of it is coming from you.', 'Your ego and your goals want different things right now.'],
    },
    Moon: {
      soft: ['Your emotions are easy to read today, even for you.', "You're more comfortable in your own skin than usual."],
      hard: ['Your mood is changing faster than you can name it.', "Small things feel big today. That's the point of noticing them."],
    },
    Mercury: {
      soft: ['Conversations land where you aim them.', 'Your thinking is quick and your words are cooperating.'],
      hard: ['Words are slippery today. Something you say may be heard wrong.', 'You may be thinking in circles. The exit is to say it plainly.'],
    },
    Venus: {
      soft: ["Pleasure is easy to find if you stop pretending you don't want it.", "You're easier to like right now, including by yourself."],
      hard: ["What you want and what you value aren't on speaking terms.", 'You may want comfort more than you want the truth.'],
    },
    Mars: {
      soft: ["You have more energy than patience, and for once that's useful.", 'You can get a lot done if you pick one direction.'],
      hard: ['Irritation is close to the surface, looking for a target.', "You want to push. Make sure you're pushing the right door."],
    },
    Jupiter: {
      soft: ["There's room to grow, and the room is bigger than you think.", "Luck isn't random right now. It's following you around."],
      hard: ["Everything feels possible, which isn't the same as everything being a good idea.", "You're tempted to overdo it. Then do it again."],
    },
    Saturn: {
      soft: ['Structure feels supportive today instead of suffocating.', 'Effort you put in now will still be there years from now.'],
      hard: ["Something you've been putting off is asking to be dealt with.", 'You may feel tested, slowed down, or simply tired.'],
    },
    Uranus: {
      soft: ["A small disruption opens a door you didn't know was there.", "You're ready to try something you'd normally talk yourself out of."],
      hard: ["You're restless, and anything that feels like a cage will get kicked.", 'Something unexpected may knock your plans sideways.'],
    },
    Neptune: {
      soft: ['Your intuition is sharp, even if it speaks in riddles.', 'Your imagination is wide open. Let something in.'],
      hard: ["The line between what you hope and what's real is blurry.", "You may want to disappear a little. Notice what you're escaping."],
    },
    Pluto: {
      soft: ["You're ready to let go of something you've outgrown.", 'There is power in going deeper than small talk today.'],
      hard: ["Something you've buried is asking to be looked at.", "You may feel a pull to control what can't be controlled."],
    },
  };

  // What it touches in you.
  const THEME_LINES = {
    self: ['This is about who you are when nobody needs anything from you.', "Notice what you do when you're not performing.", 'Your sense of self is up for review.'],
    feelings: ['It reaches the part of you that keeps score in private.', 'Pay attention to what you need, not what you think you should need.', 'Home, family, and comfort are all in the frame.'],
    mind: ["It's in how you think, talk, and decide.", 'Your mind wants new material. Feed it.', 'Notice which of your opinions you actually chose.'],
    love: ["It's in what you want, and who you want it from.", 'Taste, pleasure, and money all count as love today.', "Notice who you're dressing for."],
    drive: ["It's in your drive, your desire, and your temper.", 'Your body is a good place to start.', "It's about what you want badly enough to chase."],
    luck: ["It's about what you believe will work out.", 'Your sense of meaning is shifting, slightly.', 'Generosity, including toward yourself, is part of it.'],
    limits: ['It presses on your rules, your fears, and your sense of duty.', 'Your commitments are being tested for structural integrity.', 'Time is the main character here.'],
    change: ["It's about where you crave freedom.", 'The part of you that hates being predictable is awake.', 'Something stuck is getting shaken loose.'],
    dream: ["It's about your imagination and what you escape into.", 'Your sensitivity is a receiver. Be careful what you tune into.', 'Art, spirit, and confusion all live at the same address.'],
    power: ["It's about control, intimacy, and what you can't let go of.", 'This goes deeper than it looks.', "What you're afraid of is also where your power is."],
    work: ["It's about your public life and where you're headed.", 'Your reputation is part of the story.', "It's about the difference between ambition and approval."],
  };

  const CLOSERS = {
    soft: ['Lean in.', 'Say yes to the small invitation.', 'Take the easy win. It still counts.', "Share it with someone who'll be happy for you.",
      'Make the plan while it feels possible.', 'Let it be simple.', 'Follow the thing that feels light.', "You don't have to earn a good day.",
      "Notice what's working and do more of it.", 'Trust the momentum.'],
    hard: ["Don't make permanent decisions about temporary feelings.", 'Name it, then let it go.', 'Wait a day before you reply.',
      'Pick one battle, not five.', "You don't have to fix it today. Just see it.", 'Drink some water. Seriously.',
      'Leave room for the other person to be wrong.', 'Do less, better.', 'Nobody needs your hot take right now.', "Feel it, but don't let it drive."],
  };

  const DOS = ['Linen', 'Saying it first', 'Fresh sheets', 'Voice memos', 'Long walks', 'Asking twice', 'Leftovers', 'Window seats',
    'Handwritten lists', 'Early nights', 'Old playlists', 'Cold water', 'Group dinners', 'Unsubscribing', 'Second drafts', 'Thrift stores',
    'A clean desk', 'Reading the room', 'Calling your mom', 'Hot sauce', 'Sunscreen', 'Wild guesses', 'Stretching', 'Library books',
    'Slow mornings', 'Saying no', 'Houseplants', 'Taking the stairs', 'Honest answers', 'Small talk', 'Overtipping', 'Bad movies',
    'Night swims', 'Postcards', 'Real plates', 'Naps', 'Bold lipstick', 'Patience', 'Splurging a little', 'Crosswords', 'Sunsets',
    'Silence', 'Compliments', 'The long way home', 'Iced coffee', 'Museums', 'Deep breaths', 'Leaving early', 'Big sweaters', 'Polaroids',
    'Fresh flowers', 'Texting first', 'Open windows', 'Good posture', 'Bad puns', 'Dancing alone', 'Phone on silent', 'Asking for help',
    'Taking credit', 'Thank-you notes', 'Something new', 'Morning light', 'Mismatched socks', 'Eye contact', 'Cooking for two',
    'Lighting a candle', 'Being early', 'Going analog', 'Ocean air', 'Clean shoes'];

  const DONTS = ['Doomscrolling', 'Group chats', 'Reply-all', 'Exes', 'A third coffee', 'Online shopping', 'Hot takes', 'Comparing',
    'Overexplaining', 'Leaving on read', 'Late fees', 'Gossip', 'Perfectionism', 'Mixed signals', 'Rushing', "Pretending you're fine",
    'The snooze button', 'Scorekeeping', 'Martyrdom', 'Shortcuts', 'Impulse haircuts', 'Arguing online', 'Ghosting', 'Vague plans',
    'Fake laughs', 'Last minute anything', 'Self-diagnosis', 'Energy drinks', 'Apologizing for nothing', 'Skipping meals', 'Forty open tabs',
    'Grudges', 'Big promises', 'Second-guessing', 'Mind reading', 'Overcommitting', 'Passive aggression', 'Rereading old texts', 'Shoulds',
    'Envy', 'Cutting your own bangs', 'Bad lighting', 'People pleasing', 'Sarcasm', 'Reality TV', 'Running late', 'Assumptions', 'Drama',
    'Spite', 'Lists of lists', 'Revenge bedtime', 'Checking their story', 'Fine print', 'Sulking', 'Borrowed opinions', 'Overdressing',
    'Drafts you never send', 'Waiting to be asked', 'Seconds', 'Comment sections', 'Your inner critic', 'Overplanning',
    'Being the bigger person', 'Retail therapy', 'Monologues', 'Stale bread', 'Fake deadlines', 'Brutal honesty'];

  // ---- How transits map onto all that ----

  const THEME = { Sun: 'self', Ascendant: 'self', Moon: 'feelings', Mercury: 'mind', Venus: 'love', Mars: 'drive', Jupiter: 'luck',
    Saturn: 'limits', Uranus: 'change', Neptune: 'dream', Pluto: 'power', Midheaven: 'work' };

  // Life areas, by house.
  const AREAS = [null, 'self', 'money', 'thinking & creativity', 'home', 'sex & love', 'routine', 'relationships', 'intimacy',
    'spirituality', 'work', 'social life', 'solitude'];

  const SOFT = ['sextile', 'trine'], HARD = ['square', 'opposition'];
  const GENTLE_BODIES = ['Sun', 'Moon', 'Mercury', 'Venus', 'Jupiter'];
  const toneOf = t => SOFT.includes(t.aspect) ? 'soft' : HARD.includes(t.aspect) ? 'hard' : GENTLE_BODIES.includes(t.body) ? 'soft' : 'hard';
  const kindOf = t => SOFT.includes(t.aspect) ? 'power' : HARD.includes(t.aspect) ? 'trouble' : 'pressure';
  const VERB = { conjunction: 'conjunct', sextile: 'sextile', square: 'square', trine: 'trine', opposition: 'opposite' };

  // For the line under each transit's title, in plain words: what each planet stands for, and what
  // each angle between them is like.
  const STANDS_FOR = { Sun: 'identity', Moon: 'emotions', Mercury: 'thinking', Venus: 'love & pleasure', Mars: 'drive',
    Jupiter: 'luck & growth', Saturn: 'responsibility', Uranus: 'change', Neptune: 'imagination', Pluto: 'power',
    Ascendant: 'first impressions', Midheaven: 'career' };
  const ANGLE_IS = { conjunction: 'is right on top of', sextile: 'gives an easy opening to', square: 'is clashing with',
    trine: 'is flowing easily with', opposition: 'is pulling against' };

  // How much a transit matters today: faster planets and your core points count most, and so does a
  // transit close to exact.
  const BODY_W = { Sun: 1.2, Moon: 1, Mercury: 1.1, Venus: 1.1, Mars: 1.2, Jupiter: 1, Saturn: 1, Uranus: 0.8, Neptune: 0.8, Pluto: 0.8 };
  const TARGET_W = { Sun: 1.3, Moon: 1.3, Ascendant: 1.2, Mercury: 1, Venus: 1, Mars: 1, Midheaven: 0.9, Jupiter: 0.8, Saturn: 0.8, Uranus: 0.5, Neptune: 0.5, Pluto: 0.5 };
  const ASPECT_W = { conjunction: 1.2, opposition: 1, square: 1, trine: 0.9, sextile: 0.7 };
  const score = t => BODY_W[t.body] * TARGET_W[t.target] * ASPECT_W[t.aspect] * (0.4 + 0.6 * (1 - t.orb / t.limit));
  // For the longer-running cards, slow planets shape the season more than the day.
  const SLOW = { Jupiter: 1.4, Saturn: 1.5, Uranus: 1.6, Neptune: 1.6, Pluto: 1.6 };
  const seasonScore = t => score(t) * (SLOW[t.body] || 1);

  // ---- Seeded choices ----

  function seeded(text) {
    let a = 2166136261;
    for (const ch of text) a = Math.imul(a ^ ch.charCodeAt(0), 16777619);
    return () => {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const pick = (rand, list) => list[Math.floor(rand() * list.length)];
  function pickSome(rand, list, n) {
    const pool = [...list], out = [];
    while (out.length < n && pool.length) out.push(pool.splice(Math.floor(rand() * pool.length), 1)[0]);
    return out;
  }

  // ---- Dates ----

  const dayKey = d => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  const startOfDay = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const daysBetween = (a, b) => Math.round((startOfDay(b) - startOfDay(a)) / 86400e3);
  const monthDay = d => d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  const hour = d => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).replace(':00', '');

  // "Today", "Today through Sunday", "Today through November 7"
  function through(end, today) {
    const days = daysBetween(today, end);
    if (days <= 0) return 'Today';
    if (days <= 6) return `Today through ${end.toLocaleDateString('en-US', { weekday: 'long' })}`;
    return `Today through ${monthDay(end)}`;
  }

  // "October 23—November 7"; for the Moon, hours: "October 2, 9 AM—3 PM"
  function rangeText(t, today) {
    if (t.body === 'Moon') {
      const same = dayKey(t.start) === dayKey(t.end);
      return `${monthDay(t.start)}, ${hour(t.start)}—${same ? '' : monthDay(t.end) + ', '}${hour(t.end)}`;
    }
    const withYear = d => d.getFullYear() === today.getFullYear() ? monthDay(d) : `${monthDay(d)}, ${d.getFullYear()}`;
    return `${withYear(t.start)}—${withYear(t.end)}`;
  }

  // ---- Building it ----

  function describe(t) {
    return { ...t, id: `${t.body}-${t.aspect}-${t.target}`, score: score(t), tone: toneOf(t), kind: kindOf(t), theme: THEME[t.target] };
  }

  function card(t, today) {
    const rand = seeded(`${t.id}-${dayKey(t.start)}`);
    const target = t.target === 'Ascendant' || t.target === 'Midheaven' ? t.target : `natal ${t.target}`;
    return {
      transit: t,
      dates: rangeText(t, today),
      title: `${t.body} ${VERB[t.aspect]} ${target}`,
      // "Today's Mars (drive) is flowing easily with your birth Venus (love & pleasure)"
      plain: `Today's ${t.body} (${STANDS_FOR[t.body]}) ${ANGLE_IS[t.aspect]} your birth ${t.target === 'Ascendant' ? 'rising sign' : t.target} (${STANDS_FOR[t.target]})`,
      text: `${pick(rand, BODY_LINES[t.body][t.tone])} ${pick(rand, THEME_LINES[t.theme])}`,
    };
  }

  // transits: from StarAstro.transits(chart, date). today: the date the reading is for.
  function build(chart, transits, today) {
    const rand = seeded(dayKey(today));
    const ranked = transits.map(describe).sort((a, b) => b.score - a.score);

    // On the rare day nothing is in orb, the Moon still sets the mood.
    const top = ranked[0] || describe({ body: 'Moon', target: 'Moon', aspect: 'conjunction', orb: 0, limit: 1, start: today, end: today });
    const second = ranked.find(t => t !== top && t.body !== top.body);

    // Power / Pressure / Trouble: the areas of life (houses) the day's transits land in.
    const glance = { power: [], pressure: [], trouble: [] }, used = new Set();
    for (const t of ranked) {
      const area = AREAS[chart.byId[t.target].house];
      if (used.has(area) || glance[t.kind].length >= 2) continue;
      glance[t.kind].push(area);
      used.add(area);
    }
    if (!used.size) glance[top.kind].push(AREAS[chart.byId[top.target].house]);

    const paragraph = [pick(rand, BODY_LINES[top.body][top.tone]), pick(rand, THEME_LINES[top.theme])];
    if (second) paragraph.push(pick(rand, BODY_LINES[second.body][second.tone]));
    paragraph.push(pick(rand, CLOSERS[top.tone]));

    const season = ranked.filter(t => t.body !== 'Moon').sort((a, b) => seasonScore(b) - seasonScore(a));
    return {
      top,
      ...(([headline, deck]) => ({ headline, deck }))(pick(rand, HEADLINES[top.theme][top.tone])),
      glance,
      through: through(top.end, today),
      paragraph: paragraph.join(' '),
      dos: pickSome(rand, DOS, 3),
      donts: pickSome(rand, DONTS, 3),
      cards: season.slice(0, 2).map(t => card(t, today)),
      all: ranked.map(t => card(t, today)),
    };
  }

  // ---- Your sky and today's, compared ----
  // Where the planets sit in your houses at birth (what you're built for) and right now (where the
  // day pulls you), boiled down to one line.

  const PLACES = [null, 'yourself', 'money', 'conversations', 'home', 'romance and play', 'daily work', 'partners',
    'intimacy', 'big ideas', 'career', 'friends', 'solitude'];
  // The Sun and Moon say the most about where your attention goes; the slow outer planets the least.
  const HOUSE_W = { Sun: 3, Moon: 3, Mercury: 2, Venus: 2, Mars: 2, Jupiter: 1, Saturn: 1, Uranus: 0.5, Neptune: 0.5, Pluto: 0.5 };

  function busiestHouses(planets) {
    const weight = {};
    for (const p of planets) if (HOUSE_W[p.id]) weight[p.house] = (weight[p.house] || 0) + HOUSE_W[p.id];
    return Object.keys(weight).map(Number).sort((a, b) => weight[b] - weight[a] || a - b).slice(0, 2);
  }

  // sky: StarAstro.sky(now, chart)
  function compare(chart, sky) {
    const born = busiestHouses(chart.points), now = busiestHouses(sky);
    const words = hs => hs.map(h => PLACES[h]).join(' and ');
    const shared = now.filter(h => born.includes(h));
    if (shared.length === 2) return `Today's sky lands right where you live, on ${words(now)}. Lean into what comes naturally.`;
    if (shared.length === 1) {
      const extra = now.find(h => h !== shared[0]);
      return `You're built for ${words(born)}; today doubles down on ${PLACES[shared[0]]} and adds ${PLACES[extra]}.`;
    }
    return `You're built for ${words(born)}; today the sky pulls you toward ${words(now)}.`;
  }

  return { build, card, describe, compare, PLACES };
})();
