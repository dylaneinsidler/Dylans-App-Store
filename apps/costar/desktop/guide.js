// "How to read your chart": the plain-language guide to the right screen. The wall shows it when you
// click "How to read this" (sky.html), and guide.html lays the same words out as a printable page.
window.StarGuide = (() => {
  const { glyph } = StarAstro;
  const key = (id, name, meaning) => `<span class="glyph">${glyph(id)}</span><span class="nm">${name}</span><span>${meaning}</span>`;

  const title = 'How to read your chart';
  const lede = `The wheel is the sky wrapped into a circle, with Earth in the middle. It shows two skies at once:
    the moment you were born, and right now. Astrology looks at how the two line up.`;

  const wheel = `
    <h3>The wheel</h3>
    <dl>
      <dt>The ring of names: the 12 signs</dt>
      <dd>Every planet is always in one of these signs, like a neighborhood it's passing through.</dd>
      <dt>Inside the ring: you, at birth</dt>
      <dd>Where each planet was the moment you were born. These never move. Astrologers call this your <b>natal</b> chart.</dd>
      <dt>Outside the ring: the sky right now</dt>
      <dd>Where the planets are today. They creep around the wheel. The Moon is fastest, about one sign every two and a half days.</dd>
      <dt>The numbered slices: houses</dt>
      <dd>Twelve areas of life. 1 you · 2 money · 3 conversations · 4 home · 5 romance and fun · 6 daily work and health ·
        7 partners · 8 intimacy · 9 big ideas and travel · 10 career · 11 friends · 12 rest and solitude.
        A planet in a slice puts the spotlight on that part of life.</dd>
    </dl>`;

  const highlighted = `
    <h3>What's highlighted</h3>
    <dl>
      <dt>A transit</dt>
      <dd>When a planet today makes a special angle with one of your birth planets. That's what the card at the top right
        is about. Each one lasts a few hours (the Moon) to a few months (the slow planets).</dd>
      <dt>On the wheel</dt>
      <dd>The two planets are circled, a dotted arrow runs from today's planet to yours, and the house it lands in is shaded.</dd>
      <dt>The angles</dt>
      <dd><b>Conjunct</b>, side by side: intense, turned up.<br>
        <b>Sextile</b>, 60° apart: a helpful nudge.<br>
        <b>Square</b>, 90° apart: tension that pushes you to act.<br>
        <b>Trine</b>, 120° apart: easy and flowing.<br>
        <b>Opposite</b>, 180° apart: a tug-of-war.</dd>
      <dt>The lines in the middle</dt>
      <dd>Angles between your own birth planets: patterns you were born with. Dashed lines are easy ones, solid lines tense ones.</dd>
      <dt>The table and the sentence</dt>
      <dd>The same planets, now and when you were born, with their house number. The sentence underneath sums up
        where today's planets bunch up in your chart, next to where yours do.</dd>
    </dl>`;

  const symbols = `
    <h3>The symbols</h3>
    <div class="key">
      ${key('Sun', 'Sun', 'who you are')}
      ${key('Moon', 'Moon', 'feelings and needs')}
      ${key('Mercury', 'Mercury', 'thinking and talking')}
      ${key('Venus', 'Venus', 'love, taste, pleasure')}
      ${key('Mars', 'Mars', 'drive and desire')}
      ${key('Jupiter', 'Jupiter', 'luck and growth')}
      ${key('Saturn', 'Saturn', 'rules and responsibility')}
      ${key('Uranus', 'Uranus', 'change and surprises')}
      ${key('Neptune', 'Neptune', 'dreams and imagination')}
      ${key('Pluto', 'Pluto', 'power and transformation')}
      ${key('Ascendant', 'Rising', 'how you come across')}
      ${key('Midheaven', 'Midheaven', 'career and reputation')}
      ${key('Node', 'Node', "what you're growing toward")}
      <span class="glyph">℞</span><span class="nm">Retrograde</span><span>seems to move backward: slow down, revisit</span>
    </div>`;

  // The version that opens on the wall: three columns.
  const chart = () => `
    <h2>${title}</h2>
    <p class="lede">${lede}</p>
    <div class="help-cols"><section>${wheel}</section><section>${highlighted}</section><section>${symbols}</section></div>`;

  return { title, lede, wheel, highlighted, symbols, chart };
})();
