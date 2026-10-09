// Lifted from Star Wall's sky.html by build.mjs; edit it there.
(function () {
const { cfg, NS, esc, glyph, fmtTime } = StarWall;
  const { norm, diff, degreeInSign } = StarAstro;
  const $ = id => document.getElementById(id);

  const chart = StarAstro.natalChart(cfg.birth, cfg.houseSystem);
  const today = new Date();
  const noon = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12);
  const reading = StarReading.build(chart, StarAstro.transits(chart, noon), noon);

  // ---- The wheel ----
  // Ascendant on the left, the zodiac running counterclockwise, as in a printed chart. Radii, outside in:
  // today's planets, the black band of signs, your birth planets, then the houses.
  const R = { outer: 494, sky: 462, bandOut: 422, bandIn: 388, natal: 345, disc: 310, house: 290, arc: 246, earth: 80 };
  const angle = lon => (180 + lon - chart.asc) * Math.PI / 180;
  const at = (lon, r) => [r * Math.cos(angle(lon)), -r * Math.sin(angle(lon))];
  const f = n => n.toFixed(1);
  const wheel = $('wheel');

  function svg(tag, attrs, text) {
    const el = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    if (text != null) el.textContent = text;
    return el;
  }
  const line = (lon1, r1, lon2, r2, cls) => { const [x1, y1] = at(lon1, r1), [x2, y2] = at(lon2, r2); return svg('line', { x1: f(x1), y1: f(y1), x2: f(x2), y2: f(y2), class: cls }); };

  // Text that runs along the circle, flipped where it would otherwise read upside down.
  function along(lon, r, text, cls) {
    const [x, y] = at(lon, r);
    let rot = 90 - angle(lon) * 180 / Math.PI;
    rot = norm(rot + 180) - 180;
    if (Math.abs(rot) > 90) rot += 180;
    return svg('text', { transform: `translate(${f(x)} ${f(y)}) rotate(${f(rot)})`, 'text-anchor': 'middle', 'dominant-baseline': 'central', class: cls }, text);
  }

  // Wedge between two longitudes, from radius r1 to r2, drawn counterclockwise from lon1 to lon2.
  function wedge(lon1, lon2, r1, r2) {
    const span = norm(lon2 - lon1), large = span > 180 ? 1 : 0;
    const [a, b] = [at(lon1, r2), at(lon2, r2)], [c, d] = [at(lon2, r1), at(lon1, r1)];
    return `M${f(a[0])} ${f(a[1])} A${r2} ${r2} 0 ${large} 0 ${f(b[0])} ${f(b[1])} L${f(c[0])} ${f(c[1])} A${r1} ${r1} 0 ${large} 1 ${f(d[0])} ${f(d[1])}Z`;
  }

  // Nudge apart symbols that would overlap, keeping their order around the circle.
  function spread(items, gap) {
    const list = items.map(p => ({ p, a: norm(p.lon - chart.asc) })).sort((x, y) => x.a - y.a);
    for (let pass = 0; pass < 100 && list.length > 1; pass++) {
      let moved = false;
      for (let i = 0; i < list.length; i++) {
        const a = list[i], b = list[(i + 1) % list.length], g = norm(b.a - a.a);
        if (g < gap) { a.a -= (gap - g) / 2; b.a += (gap - g) / 2; moved = true; }
      }
      if (!moved) break;
    }
    for (const x of list) x.p.shown = norm(x.a + chart.asc);
  }

  function drawStatic() {
    wheel.append(
      svg('circle', { r: R.outer, class: 'ring' }),
      svg('circle', { r: R.bandIn, fill: 'var(--paper)' }),
      svg('circle', { r: R.disc, fill: 'var(--disc)', stroke: 'var(--line)' }),
      svg('circle', { r: (R.bandIn + R.bandOut) / 2, fill: 'none', stroke: 'var(--band)', 'stroke-width': R.bandOut - R.bandIn }),
    );
    for (let i = 0; i < 12; i++) {
      wheel.append(line(i * 30, R.bandIn, i * 30, R.bandOut, 'cusp'));
      wheel.lastChild.setAttribute('style', 'stroke: var(--band-text); opacity: .35');
      wheel.append(along(i * 30 + 15, (R.bandIn + R.bandOut) / 2, StarAstro.SIGNS[i], 'sign'));
    }

    const shade = svg('g', { id: 'shade' });
    wheel.append(shade);

    // Houses: cusp lines, with the horizon and meridian a shade darker, and their numbers.
    chart.cusps.forEach((c, i) => {
      wheel.append(line(c, R.earth + 14, c, R.disc, i % 3 === 0 ? 'axis' : 'cusp'));
      const next = chart.cusps[(i + 1) % 12];
      const [x, y] = at(c + norm(next - c) / 2, R.house);
      wheel.append(svg('text', { x: f(x), y: f(y), 'text-anchor': 'middle', 'dominant-baseline': 'central', class: 'house' }, i + 1));
    });

    // Aspects between your birth planets.
    for (const a of StarAstro.natalAspects(chart)) {
      if (a.aspect === 'conjunction') continue;
      const p = chart.byId[a.a], q = chart.byId[a.b];
      const [x1, y1] = at(p.lon, R.disc - 34), [x2, y2] = at(q.lon, R.disc - 34);
      wheel.append(svg('line', { x1: f(x1), y1: f(y1), x2: f(x2), y2: f(y2), class: `asp${a.aspect === 'trine' || a.aspect === 'sextile' ? ' soft' : ''}` }));
    }

    // Your birth planets, just inside the band.
    const natal = chart.points.map(p => ({ ...p }));
    spread(natal, 7);
    for (const p of natal) {
      wheel.append(line(p.lon, R.bandIn, p.lon, R.bandIn - 9, 'tick'));
      if (Math.abs(diff(p.shown, p.lon)) > 1.5) wheel.append(line(p.lon, R.bandIn - 9, p.shown, R.natal + 17, 'leader'));
      const [x, y] = at(p.shown, R.natal);
      const word = p.id === 'Midheaven';
      wheel.append(svg('text', { x: f(x), y: f(y), 'text-anchor': 'middle', 'dominant-baseline': 'central', class: `g${word ? ' word' : ''}`,
        'font-size': word ? 13 : 27, id: `n-${p.id}` }, glyph(p.id)));
    }
  }

  // Today's planets, outside the band. Redrawn every minute; the Moon moves about half a degree an hour.
  const skyLayer = svg('g', {});
  function drawSky(now) {
    const planets = StarAstro.sky(now, chart);
    spread(planets, 5.5);
    skyLayer.replaceChildren();
    for (const p of planets) {
      skyLayer.append(line(p.lon, R.bandOut, p.lon, R.bandOut + 9, 'tick'));
      if (Math.abs(diff(p.shown, p.lon)) > 1.2) skyLayer.append(line(p.lon, R.bandOut + 9, p.shown, R.sky - 16, 'leader'));
      const [x, y] = at(p.shown, R.sky);
      skyLayer.append(svg('text', { x: f(x), y: f(y), 'text-anchor': 'middle', 'dominant-baseline': 'central', class: 'g', 'font-size': 25, id: `t-${p.id}` }, glyph(p.id)));
    }
    return planets;
  }

  // The transit in focus: shade the house it lands in, and run a dashed arc from the moving planet to
  // the birth planet it's aspecting.
  const hl = svg('g', { id: 'highlight' });
  function highlight(t) {
    hl.replaceChildren();
    const shade = $('shade');
    shade.replaceChildren();
    if (!t) return;
    const h = chart.byId[t.target].house - 1;
    shade.append(svg('path', { d: wedge(chart.cusps[h], chart.cusps[(h + 1) % 12], R.earth + 14, R.disc), class: 'hl-shade' }));

    const from = t.bodyLon, to = t.targetLon, d = diff(to, from);
    if (Math.abs(d) > 0.5) {
      const steps = Math.max(2, Math.ceil(Math.abs(d)));
      const pts = Array.from({ length: steps + 1 }, (_, i) => at(from + d * i / steps, R.arc).map(f).join(' '));
      hl.append(svg('path', { d: 'M' + pts.join(' L'), class: 'hl-arc' }));
      // Arrowhead at the birth planet's end, pointing along the arc.
      const [ex, ey] = at(to, R.arc), [bx, by] = at(to - Math.sign(d) * 2.5, R.arc);
      const ux = ex - bx, uy = ey - by, len = Math.hypot(ux, uy), nx = ux / len, ny = uy / len;
      hl.append(svg('path', { d: `M${f(ex)} ${f(ey)} L${f(ex - nx * 11 - ny * 5)} ${f(ey - ny * 11 + nx * 5)} L${f(ex - nx * 11 + ny * 5)} ${f(ey - ny * 11 - nx * 5)}Z`, class: 'arrow' }));
    }
    hl.append(line(from, R.arc, from, R.bandIn - 2, 'hl-spoke'));
    hl.append(line(to, R.arc, to, R.bandIn - 12, 'hl-spoke'));
    const feel = { conjunction: 'together', sextile: 'helpful', square: 'tense', trine: 'easy', opposition: 'opposed' }[t.aspect];
    hl.append(along(from + d / 2, R.arc - 26, `${t.aspect} · ${feel}`.toUpperCase(), 'hl-label'));

    // Ring the two planets involved.
    for (const id of [`t-${t.body}`, `n-${t.target}`]) {
      const el = document.getElementById(id);
      if (!el) continue;
      hl.append(svg('circle', { cx: el.getAttribute('x'), cy: el.getAttribute('y'), r: 21, class: 'hl-ring' }));
    }
  }

  drawStatic();
  wheel.append(skyLayer, hl);

  // Earth in the middle, lit from wherever the Sun sits on the wheel.
  function earthLight(planets) {
    const a = angle(planets.find(p => p.id === 'Sun').lon);
    return [Math.cos(a), Math.sin(a), 0.45];
  }
  const earthCanvas = $('earth');
  earthCanvas.style.left = `${540 - R.earth}px`;
  earthCanvas.style.top = `${540 - R.earth}px`;
  let planetsNow = drawSky(new Date());
  const earth = StarWall.planet(earthCanvas, 'Earth', R.earth * 2, { light: earthLight(planetsNow), tilt: 23.4, turn: 4 });

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

  // Size the right side to fill its space exactly: as large as fits, never running over the bottom.
  function fitAside() {
    const aside = document.querySelector('aside');
    const moon = document.querySelector('.moon');
    const fits = s => {
      aside.style.setProperty('--s', s);
      moon.style.marginTop = '0';                       // measure without the moon pushed to the bottom
      const ok = aside.scrollHeight <= aside.clientHeight + 1;
      moon.style.marginTop = '';
      return ok;
    };
    let lo = 0.6, hi = 1.3;
    for (let i = 0; i < 10; i++) { const mid = (lo + hi) / 2; if (fits(mid)) lo = mid; else hi = mid; }
    aside.style.setProperty('--s', lo.toFixed(3));
  }

  function update() {
    const now = new Date();
    planetsNow = drawSky(now);
    drawList(planetsNow, now);
    drawMoon(now);
    earth.set({ light: earthLight(planetsNow) });
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
