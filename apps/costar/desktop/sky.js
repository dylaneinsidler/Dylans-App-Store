// Lifted from Star Wall's sky.html by build.mjs; edit it there.
(function () {
const { cfg, NS, esc, glyph, fmtTime } = StarWall;
  const { norm, diff, degreeInSign } = StarAstro;
  const $ = id => document.getElementById(id);

  const chart = StarAstro.natalChart(cfg.birth, cfg.houseSystem);
  const today = new Date();
  const noon = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12);
  const reading = StarReading.build(chart, StarAstro.transits(chart, noon), noon);

  // ---- The wheel (wheel.js) ----
  // Its place on the screen: the bottom half, first of its three pieces (wheel, planets, moon), which are spaced
  // evenly across the screen (Dylan, October 15); fitAside() moves it once the others are measured. Clear of the
  // Light / Dark buttons.
  const WHEEL = { left: 250, top: 560, size: 460 };
  const chartWheel = StarWheel($('wheel'), $('earth'), chart);
  const placeWheel = () => chartWheel.place(WHEEL.left, WHEEL.top, WHEEL.size);
  const highlight = t => chartWheel.highlight(t);
  placeWheel();
  let planetsNow = chartWheel.planets();

  // When the left screen shows the wheel (config.js: leftScreenRight), the day's details move here in its place:
  // the week, today's reading, and Do and Don't. (The transit cards are already across the top.)
  const SWAP = cfg.leftScreenRight !== 'details';
  if (SWAP) {
    $('wheel').style.display = $('earth').style.display = 'none';
    $('details').removeAttribute('hidden');
    $('week').innerHTML = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i - 3);
      const label = i === 3 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' });
      return `<div class="${i === 3 ? 'today' : ''}"><div class="d">${label}</div><div class="n">${d.getDate()}</div></div>`;
    }).join('');
    $('through').textContent = reading.through;
    $('para').textContent = reading.paragraph;
    $('dos').innerHTML = reading.dos.map(x => `<li>${esc(x)}</li>`).join('');
    $('donts').innerHTML = reading.donts.map(x => `<li>${esc(x)}</li>`).join('');
    WHEEL.size = 620;   // the details' width, in the wheel's slot
  }

  // ---- The two skies and the moon ----

  const SHORT = ['', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];
  const born = cfg.birth.date.split('-').map(Number);
  const bornLabel = new Date(born[0], born[1] - 1, born[2]).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const position = p => `${degreeInSign(p.lon).text} ${p.sign}${p.retrograde ? '<span class="rx">℞</span>' : ''}<span class="h">${SHORT[p.house]}</span>`;

  function drawList(planets, now) {
    $('planets').innerHTML = `<div class="p head"><span></span><span></span>
        <span><b>The sky now</b><small>${esc(fmtTime(now))}</small></span>
        <span><b>When you were born</b><small>${esc(bornLabel)}</small></span></div>` +
      planets.map(p => `<div class="p">
        <span class="glyph">${glyph(p.id)}</span>
        <span class="nm">${p.id}</span>
        <span class="pos">${position(p)}</span>
        <span class="pos birth">${position(chart.byId[p.id])}</span>
      </div>`).join('');
    $('compare').textContent = StarReading.compare(chart, planets);
  }

  const moonCanvas = $('moon');
  let moonPainter = null;
  function drawMoon(now) {
    const m = StarAstro.moon(now);
    const a = m.angle * Math.PI / 180, light = [Math.sin(a), 0, -Math.cos(a)];
    if (moonPainter) moonPainter.set({ light });
    else moonPainter = StarWall.planet(moonCanvas, 'Moon', 120, { light });
    $('phase').textContent = m.phase;
    const day = d => d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const nextMain = m.nextNew < m.nextFull ? ['New moon', m.nextNew] : ['Full moon', m.nextFull];
    const ingress = StarAstro.nextIngress('Moon', now, 72);
    const facts = [`${Math.round(m.lit * 100)}% lit · Moon in ${StarAstro.signOf(StarAstro.longitude('Moon', now))}`, `${nextMain[0]} ${day(nextMain[1])}`];
    if (ingress) facts.push(`Enters ${ingress.sign} ${ingress.at.toLocaleDateString('en-US', { weekday: 'short' })} ${fmtTime(ingress.at)}`);
    $('moonFacts').innerHTML = facts.map(esc).join('<br>');
  }

  // ---- Every transit today, all at once ----
  // The wheel shows one at a time (its card outlined), taking each in turn; point at a card to see that one.

  const featured = reading.all.slice(0, 6);
  $('transits').style.setProperty('--cols', featured.length > 4 ? 3 : 2);
  $('count').textContent = featured.length === 1 ? '1 today' : `${featured.length} today`;
  $('transits').innerHTML = featured.length
    ? featured.map((c, i) => `<div class="card" data-i="${i}"><div class="dates mono">${esc(c.dates)}</div><h2>${esc(c.title)}</h2>
        <div class="plain">${esc(c.plain)}</div><p>${esc(c.text)}</p></div>`).join('')
    : `<div class="card"><div class="dates mono">Today</div><h2>A quiet sky</h2><p>Nothing is pressing on your chart right now. Enjoy the room to breathe.</p></div>`;
  let shown = 0;
  function showOnWheel(i) {
    shown = i;
    [...$('transits').children].forEach((c, j) => c.classList.toggle('on', featured.length > 1 && j === i));
    highlight(featured[i]?.transit);
  }
  showOnWheel(0);
  // The wheel takes each transit in turn (its card outlined), quickly enough to show them all within a minute,
  // before the Morning and Night Screens move on. Pointing at a card holds it there.
  let hovering = false;
  if (featured.length > 1) {
    const every = Math.min(15e3, 55e3 / featured.length);
    setInterval(() => { if (!hovering) showOnWheel((shown + 1) % featured.length); }, every);
  }
  $('transits').addEventListener('mouseover', e => {
    const c = e.target.closest('[data-i]');
    hovering = !!c;
    if (c && +c.dataset.i !== shown) showOnWheel(+c.dataset.i);
  });
  $('transits').addEventListener('mouseleave', () => { hovering = false; });

  // Size each part to fill its space exactly: as large as fits, never running over.
  function fitBox(box, hi) {
    const fits = s => {
      box.style.setProperty('--s', s);
      return box.scrollHeight <= box.clientHeight + 1 && box.scrollWidth <= box.clientWidth + 1;
    };
    let lo = 0.6;
    for (let i = 0; i < 12; i++) { const mid = (lo + hi) / 2; if (fits(mid)) lo = mid; else hi = mid; }
    box.style.setProperty('--s', lo.toFixed(3));
  }
  function fitAside() {
    fitBox(document.querySelector('aside.top'), 2.4);
    // The bottom half: size the planets and the moon in the room beside the wheel, then space all three evenly.
    const low = document.querySelector('aside.low'), EDGE = 64, SCREEN = 1920;
    Object.assign(low.style, { left: (EDGE + WHEEL.size + 80) + 'px', right: EDGE + 'px', width: '', columnGap: '' });
    fitBox(low, 1.5);
    const list = low.querySelector('.left').offsetWidth, moonW = low.querySelector('.moon').offsetWidth;
    const gap = Math.max(24, (SCREEN - 2 * EDGE - WHEEL.size - list - moonW) / 4);
    WHEEL.left = Math.round(EDGE + gap);
    placeWheel();
    if (SWAP) {
      const d = $('details');
      Object.assign(d.style, { left: WHEEL.left + 'px', width: WHEEL.size + 'px' });
      fitBox(d, 1.4);
    }
    Object.assign(low.style, { left: Math.round(EDGE + 2 * gap + WHEEL.size) + 'px', right: 'auto', width: Math.ceil(list + gap + moonW) + 'px', columnGap: gap + 'px' });
  }

  function update() {
    const now = new Date();
    planetsNow = chartWheel.update(now);
    drawList(planetsNow, now);
    drawMoon(now);
    highlight(featured[shown]?.transit);
  }
  update();
  // Once the fonts are in (they change the text's size), and again after the page goes full screen.
  document.fonts.ready.then(fitAside);
  setTimeout(fitAside, 2500);
  window.addEventListener('resize', () => setTimeout(fitAside, 200));
  setInterval(update, 60e3);

  // ---- How to read this ----

  StarWall.help(StarGuide.chart());

  StarWall.start();
})();
