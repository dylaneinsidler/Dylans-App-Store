// Lifted from Star Wall's today.html by build.mjs; edit it there.
(function () {
const { cfg, esc, glyph, fmtTime, fmtWeekday, fmtDay } = StarWall;
  const $ = id => document.getElementById(id);

  const chart = StarAstro.natalChart(cfg.birth, cfg.houseSystem);
  const now = new Date();
  // The reading is for the whole day, so measure it at midday.
  const noon = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12);
  const reading = StarReading.build(chart, StarAstro.transits(chart, noon), noon);

  $('name').textContent = cfg.name;
  $('wordmark').textContent = cfg.wordmark || '';
  $('big3').innerHTML = [['Sun', 'Sun'], ['Moon', 'Moon'], ['Ascendant', 'Ascendant']]
    .map(([id]) => `<span><span class="glyph">${glyph(id)}</span>${esc(chart.byId[id].sign)}</span>`).join('');

  function tick() {
    const t = new Date();
    $('time').textContent = fmtTime(t);
    $('date').textContent = `${fmtWeekday(t)}, ${fmtDay(t)}`;
  }
  tick();
  setInterval(tick, 10e3);

  // ---- Left: at a glance ----

  $('headline').textContent = reading.headline;
  $('deck').textContent = reading.deck;

  const lines = [['🌱', 'Power in', reading.glance.power], ['🔥', 'Pressure in', reading.glance.pressure], ['🚫', 'Trouble with', reading.glance.trouble]];
  $('pp').innerHTML = lines.filter(([, , areas]) => areas.length).map(([emoji, lead, areas]) =>
    `<li><span class="e">${emoji}</span><span>${lead} ${areas.map(a => `<u>${esc(a)}</u>`).join(' and ')}</span></li>`).join('');

  // A grainy picture of today's object (objects.js), a different thing each day, like the Co-Star app's pictures.
  // ?object=3 shows a given one. The caption is today's biggest transit.
  const lead = reading.top;
  const pick = new URLSearchParams(location.search).get('object');
  const obj = (pick != null && window.STAR_OBJECTS[+pick]) || StarWall.objectOfDay(now);
  StarWall.thing($('portrait'), obj, 250);
  $('portrait').title = obj.name;
  $('caption').textContent = StarReading.card(lead, noon).title;

  function greet(weather) {
    const h = now.getHours();
    const part = h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening';
    let text = `Good ${part}, ${cfg.name}.`;
    if (weather?.temp != null) {
      const desc = (weather.desc || '').toLowerCase();
      const joiner = /rain|drizzle|snow|thunder|storm|fog|mist|haze|shower|smoke/.test(desc) ? 'with' : 'and';
      text += desc ? ` It’s ${weather.temp}° ${joiner} ${desc} in ${cfg.weather.place}.` : ` It’s ${weather.temp}° in ${cfg.weather.place}.`;
    }
    $('greet').innerHTML = `${esc(text)}<br>Today at a glance:`;
  }
  greet(null);

  // Current weather from the nearest National Weather Service station.
  async function loadWeather() {
    if (!cfg.weather) return;
    const get = async url => {
      const r = await fetch(url, { headers: { Accept: 'application/geo+json' }, cache: 'no-store' });
      if (!r.ok) throw new Error(r.status);
      return r.json();
    };
    try {
      const point = (await get(`https://api.weather.gov/points/${cfg.weather.lat},${cfg.weather.lon}`)).properties;
      const station = (await get(point.observationStations)).features[0].properties.stationIdentifier;
      const obs = (await get(`https://api.weather.gov/stations/${station}/observations/latest`)).properties;
      let temp = obs.temperature?.value, desc = obs.textDescription;
      if (temp == null) {
        const hour = (await get(point.forecastHourly)).properties.periods[0];
        temp = hour.temperature; desc = desc || hour.shortForecast;
      } else temp = Math.round(temp * 9 / 5 + 32);
      greet({ temp, desc });
      setTimeout(loadWeather, 15 * 60e3);
    } catch (e) {
      setTimeout(loadWeather, 60e3);   // the PC may have just woken up; try again soon
    }
  }
  loadWeather();

  // ---- Right: the details ----

  $('week').innerHTML = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i - 3);
    const label = i === 3 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' });
    return `<div class="${i === 3 ? 'today' : ''}"><div class="d mono">${label}</div><div class="n mono">${d.getDate()}</div></div>`;
  }).join('');

  $('through').textContent = reading.through;
  $('para').textContent = reading.paragraph;
  $('dos').innerHTML = reading.dos.map(x => `<li>${esc(x)}</li>`).join('');
  $('donts').innerHTML = reading.donts.map(x => `<li>${esc(x)}</li>`).join('');
  $('cards').innerHTML = reading.cards.map(c => `<div class="card">
      <div class="dates mono">${esc(c.dates)}</div>
      <h2>${esc(c.title)}</h2>
      <div class="plain">${esc(c.plain)}</div>
      <p>${esc(c.text)}</p>
    </div>`).join('');

  // ---- How to read this ----

  StarWall.help(`
    <h2>How to read your day</h2>
    <p class="lede">Everything here comes from comparing today's sky with the sky when you were born. When a planet today
      lines up with one of yours in a meaningful way, that's a <b>transit</b>, and it colors your day. The right screen shows the chart itself.</p>
    <div class="help-cols">
      <section>
        <h3>At a glance</h3>
        <dl>
          <dt>Your big three (top left)</dt>
          <dd><b>${glyph('Sun')} Sun sign</b>: your core self. <b>${glyph('Moon')} Moon sign</b>: your feelings.
            <b>↑ Rising sign</b>: how you come across at first.</dd>
          <dt>The headline</dt>
          <dd>Today's mood in one line, from the strongest transit happening to you.</dd>
          <dt>The planet picture</dt>
          <dd>The planet behind that transit, with the transit's name underneath.</dd>
        </dl>
      </section>
      <section>
        <h3>Power, Pressure, Trouble</h3>
        <dl>
          <dt>🌱 Power in</dt>
          <dd>Parts of life getting an easy boost today. Good places to put your effort.</dd>
          <dt>🔥 Pressure in</dt>
          <dd>Parts of life turned up high. Use the energy on purpose.</dd>
          <dt>🚫 Trouble with</dt>
          <dd>Parts of life with some friction. Go gently there.</dd>
          <dt>Where these come from</dt>
          <dd>The houses, the numbered slices of your chart: each one stands for an area of life, like money, home, or friends.</dd>
        </dl>
      </section>
      <section>
        <h3>The rest</h3>
        <dl>
          <dt>Today through …</dt>
          <dd>How long today's main transit lasts, and what to make of it.</dd>
          <dt>Do and Don't</dt>
          <dd>Playful suggestions for the day. Take them lightly.</dd>
          <dt>Your transits</dt>
          <dd>The bigger influences of the coming weeks or months, with their dates, a plain-English line, and what to expect.
            "Trine", "square" and the rest are angles between planets: the guide on the right screen explains them.</dd>
        </dl>
      </section>
    </div>`);

  StarWall.start();

  // A long reading at the larger size could push the transit cards off the bottom; if so, step the
  // reading's text down until everything fits.
  document.fonts.ready.then(() => {
    const detail = document.querySelector('.detail'), para = $('para');
    for (let size = 31; size > 23 && detail.scrollHeight > detail.clientHeight; size--) para.style.fontSize = `${size - 1}px`;
  });
})();
