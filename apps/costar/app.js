// Co-Star on a phone. The two screens are the desktop app's own (desktop/today.js, desktop/sky.js and the
// rest of desktop/); this supplies what the desktop app's config.js would: the person's birth details,
// typed in here the first time and kept on this phone only. Then it loads the desktop code.
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const KEY = 'costar.me';
  // For the store's screenshots (?demo): a made-up person, so nobody's real birth details are pictured.
  const DEMO = { name: 'Alex', date: '1990-06-15', time: '09:30', place: 'New York, New York', lat: 40.7143, lon: -74.006, timeZone: 'America/New_York' };
  const me = Phone.params.has('demo') ? DEMO : Phone.store.get(KEY, null);

  // ---------------------------------------------------------------- Your birth details
  let picked = null;
  function showSetup(editing) {
    $('setup').hidden = false;
    $('stage').hidden = true;
    $('f-cancel').hidden = !editing;
    if (editing && me) {
      $('f-name').value = me.name; $('f-date').value = me.date; $('f-time').value = me.unknownTime ? '' : me.time;
      $('f-place').value = me.place; picked = me;
    }
  }
  // Birthplaces anywhere in the world, from Open-Meteo's free place finder (it also gives the time zone,
  // which the chart needs to turn the birth time into the planets' positions).
  // Each place is a real button: on an iPhone a tap on a plain list line doesn't count as a click, so a place
  // could never be picked there. If none is tapped, the form takes the top match for what's typed.
  let timer, found = [];
  const asPlace = x => ({ place: [x.name, x.admin1 || x.country].filter(Boolean).join(', '), lat: +x.latitude.toFixed(4), lon: +x.longitude.toFixed(4), timeZone: x.timezone });
  async function search(q) {
    // "Brooklyn, NY": the finder wants just the town; the rest helps pick between towns of that name.
    const [town, ...rest] = q.split(',').map(s => s.trim());
    const r = await (await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(town)}&count=10&language=en`)).json();
    const hint = rest.join(' ').toLowerCase();
    const list = r.results || [];
    const fits = x => hint && [x.admin1, x.country, x.country_code].some(v => v && (v.toLowerCase().startsWith(hint) || hint.startsWith(v.toLowerCase())));
    return list.filter(fits).concat(list.filter(x => !fits(x))).slice(0, 6);
  }
  $('f-place').addEventListener('input', () => {
    picked = null;
    clearTimeout(timer);
    timer = setTimeout(async () => {
      const q = $('f-place').value.trim();
      if (q.length < 2) { $('f-results').innerHTML = ''; found = []; return; }
      try {
        found = await search(q);
        $('f-results').innerHTML = found.map((x, i) => `<li><button type="button" data-i="${i}">${esc(x.name)}<small>${esc([x.admin1, x.country].filter(Boolean).join(', '))}</small></button></li>`).join('')
          || '<li class="none">No place by that name</li>';
      } catch (e) { $('f-results').innerHTML = '<li class="none">Can’t search right now</li>'; }
    }, 300);
  });
  $('f-results').addEventListener('click', e => {
    const b = e.target.closest('button[data-i]');
    if (!b) return;
    picked = asPlace(found[+b.dataset.i]);
    $('f-place').value = picked.place;
    $('f-results').innerHTML = '';
  });
  $('me-form').addEventListener('submit', async e => {
    e.preventDefault();
    if (!picked) {
      const q = $('f-place').value.trim();
      try { const top = q.length >= 2 && (await search(q))[0]; if (top) picked = asPlace(top); } catch (err) { /* offline */ }
    }
    if (!picked) { Phone.toast('Type the town where you were born, then tap it in the list'); $('f-place').focus(); return; }
    const time = $('f-time').value;
    Phone.store.set(KEY, { name: $('f-name').value.trim(), date: $('f-date').value, time: time || '12:00', unknownTime: !time,
      place: picked.place, lat: picked.lat, lon: picked.lon, timeZone: picked.timeZone });
    location.reload();
  });
  $('f-cancel').addEventListener('click', () => { $('setup').hidden = true; $('stage').hidden = false; });
  $('me-btn').addEventListener('click', () => showSetup(true));

  if (!me) { showSetup(false); return; }

  // ---------------------------------------------------------------- The desktop app, with these details
  window.STAR_WALL = {
    appName: "Dylan's Co-Star",
    name: me.name,
    birth: { date: me.date, time: me.time, place: me.place, lat: me.lat, lon: me.lon, timeZone: me.timeZone },
    // The weather in the greeting: the place picked in Dylan's Weather App on this phone, if any (US only).
    weather: Phone.store.get('weather.place', null),
    houseSystem: 'placidus',
    wordmark: '',
    // The phone shows each thing once: the day's details under Your day, and the circle chart under Your chart.
    leftScreenRight: 'details',
    theme: 'dark',
  };
  window.STAR_WALL_THEME = Phone.store.get('costar.theme', null);
  $('stage').hidden = false;
  // The desktop's left screen can show the circle chart too, and its right screen the day's details (Co-Star 1.12):
  // their spare copies go, so the chart is drawn in Your chart and the details are filled in once, under Your day.
  document.querySelectorAll('#today-screen .chart-side, #today-screen #wheel, #today-screen #earth, #sky-screen #details')
    .forEach(el => el.remove());

  // The chart and the Earth in its middle share one square box, so the Earth stays centered at any size.
  const box = document.createElement('div');
  box.className = 'chart-box';
  $('wheel').before(box);
  box.append($('wheel'), $('earth'));

  const load = src => new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src; s.onload = resolve; s.onerror = () => reject(new Error(src));
    document.body.appendChild(s);
  });
  // The object of the day under Your day (StarWall.thing in wall.js) is worked out dot by dot. On an iPhone's sharp
  // screen that's over half a million dots, and with both screens on one page it was drawn three times (once, then
  // again by each screen's Light / Dark switch) before anything showed: about 25 seconds of black in a test iPhone.
  // So it's drawn once, after the page has faded in, and at most twice as fine as the screen's points (the same grain).
  // Meanwhile its square keeps its place (an empty 1x1 canvas at full size), so nothing below moves when it comes.
  function drawThingLater() {
    const thing = StarWall.thing;
    StarWall.thing = (canvas, obj, size) => {
      canvas.width = canvas.height = 1;
      canvas.style.width = canvas.style.height = size + 'px';
      return document.fonts.ready.then(() => requestAnimationFrame(() => setTimeout(() => {
        thing(canvas, obj, size * Math.min(1, 2 / (devicePixelRatio || 1)));
        canvas.style.width = canvas.style.height = size + 'px';
      }, 1300)));
    };
  }
  (async () => {
    try {
      await load('https://cdn.jsdelivr.net/npm/astronomy-engine@2.1.19/astronomy.browser.min.js');
      // wheel.js draws the circle chart (both screens use it since Co-Star 1.12); messages.js and schedule.js are the
      // day's messages and which one each day gets (Co-Star 1.15).
      for (const f of ['astro', 'messages', 'schedule', 'reading', 'objects', 'explain', 'wall', 'wheel', 'guide', 'today', 'sky']) {
        await load(`desktop/${f}.js`);
        if (f === 'wall') drawThingLater();
      }
    } catch (e) {
      $('stage').innerHTML = '<p class="offline">Co-Star needs the internet the first time it opens. Try again when you’re online.</p>';
      return;
    }
    // The Light / Dark switch and the guide button go at the top; the switch is remembered on this phone.
    // Each screen added a switch (one will do) and its own guide (keep both: the day, and the chart).
    document.querySelectorAll('#stage > .theme-switch').forEach((el, i) => i ? el.remove() : $('switches').appendChild(el));
    document.querySelectorAll('#stage > .help-button').forEach((el, i) => {
      el.innerHTML = `<i>i</i>${i ? 'The chart' : 'Your day'}`;
      $('switches').appendChild(el);
    });
    new MutationObserver(() => Phone.store.set('costar.theme', document.documentElement.dataset.theme))
      .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  })();
})();
