// Dylan's Weather App on a phone: the desktop app's two screens (radar, forecast), one above the other.
// The radar animation and recoloring, and the forecast, work the way the desktop pages do
// (Weather Wall's radar.html and forecast.html). Each day's "when to expect rain" line comes from the
// desktop app's own rain.js (copied into desktop\ by the store's build).
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const fmtTime = d => d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const dateKey = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const API = 'https://api.weather.gov';

  // ---- Your place: saved on this phone only. Fort Lauderdale until you pick one. ----
  const HOME = { name: 'Fort Lauderdale', lat: 26.1224, lon: -80.1373 };
  let place = Phone.store.get('weather.place', HOME);
  const p = Phone.params;
  if (p.get('lat') && p.get('lon')) place = { name: p.get('name') || 'Here', lat: +p.get('lat'), lon: +p.get('lon') };
  $('place').textContent = place.name;
  document.title = `${place.name} Weather`;

  // ================================================================ Radar
  const HISTORY_MIN = 60, STEP_MIN = 5, FRAMES_PER_SEC = 2, HOLD_LAST_MS = 2500, REWIND_MS = 700;
  const RADAR_INFO = 'https://mesonet.agron.iastate.edu/data/gis/images/4326/USCOMP/n0q_0.json';
  const RADAR_TILES = 'https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/ridge::USCOMP-N0Q-{stamp}/{z}/{x}/{y}.png';

  // The NWS composite comes as a 256-color image where color #i means i*0.5 - 32.5 dBZ. Each pixel is
  // looked up by color and repainted on a smooth Windy-like ramp.
  const N0Q_PALETTE = '000000,85718f,85728f,86738d,87758b,87768b,887789,897987,897a87,8a7b85,8b7d84,8b7e84,8c7f82,8d8180,8d8280,8e837e,8f847c,8f857c,90877b,918879,918979,928b77,938d75,969153,989457,9b975b,9d9a60,a09d64,a3a068,a5a36d,a8a671,aaa976,adac7a,b0af7e,b2b283,b7b88c,babb90,bdbe94,bfc199,c2c49d,c4c7a2,c7caa6,cacdaa,ccd0af,d2d4b4,cfd2b4,c9ccb4,c6c9b4,c3c7b4,c0c4b4,bdc1b4,b9beb4,b6bbb4,b3b9b4,b0b6b4,adb3b4,aab0b4,a4abb4,a0a8b4,9da5b4,9aa2b4,97a0b4,949db4,919ab4,949bb5,9098b4,8c95b3,8892b2,808cb0,7c89af,7886ae,7483ac,7080ab,6c7daa,6779a9,6376a8,5f73a7,5b70a6,576da4,4f67a2,4b64a1,4761a0,435e9f,415b9e,4361a2,4568a6,486faa,4a76ae,4d7db2,4f84b6,518bbb,5699c3,599fc7,5ba6cb,5eadcf,60b4d4,62bbd8,65c2dc,67c9e0,6ad0e4,6fd6e8,68d6d7,59d6b3,52d6a2,4bd690,43d67e,3cd66d,35d65b,11d518,11d117,10cd17,10c816,10c416,0fbc15,0fb714,0eb314,0eaf13,0eab13,0da612,0da212,0d9e11,0c9911,0c9510,0c9110,0b880f,0b840e,0a800e,0a7c0d,0a770d,09730c,096f0c,096b0b,08660b,08620a,095e09,327308,467d08,5b8807,6f9207,849d06,98a806,adb205,c1bd05,d6c704,ead204,ffe200,ffd800,ffd300,ffce00,ffc900,ffc400,ffc000,ffbb00,ffb600,ffb100,ffac00,ffa700,ffa200,ff9900,ff9400,ff8f00,ff8a00,ff8500,ff8000,ff0000,f80000,f10000,ea0000,e30000,d50000,cd0000,c60000,bf0000,b80000,b10000,aa0000,a30000,9b0000,940000,8d0000,7f0000,780000,710000,ffffff,fff5ff,ffeaff,ffdfff,ffd4ff,ffc9ff,ffbeff,ffb3ff,ff9dff,ff92ff,ff75ff,fc6bfd,f960fa,f656f7,f34bf4,f040f1,ed36ef,ea2bec,e720e9,e10be3,b200ff,ac00fc,a400f7,9b00f4,9300ef,8800ea,8300e8,7900e2,7200dd,6900db';
  // [dBZ, r, g, b, alpha] — purple drizzle through blue, green, yellow, red, magenta. Below ~15 dBZ is
  // mostly ground clutter and bugs at night, so it fades out.
  const RAMP = [
    [14, 110, 80, 180, 0], [18, 110, 80, 180, .5], [23, 70, 110, 215, .75], [28, 45, 165, 225, .85],
    [33, 55, 200, 120, .9], [38, 180, 220, 60, .95], [43, 250, 210, 50, 1], [48, 250, 140, 40, 1],
    [53, 235, 55, 55, 1], [60, 205, 40, 150, 1], [68, 245, 210, 255, 1],
  ];
  function rampColor(dbz) {
    if (dbz <= RAMP[0][0]) return null;
    const last = RAMP[RAMP.length - 1];
    if (dbz >= last[0]) return [last[1], last[2], last[3], Math.round(last[4] * 255)];
    const j = RAMP.findIndex(s => s[0] >= dbz);
    const [d0, ...a] = RAMP[j - 1], [d1, ...b] = RAMP[j];
    const t = (dbz - d0) / (d1 - d0);
    const c = a.map((v, k) => v + (b[k] - v) * t);
    return [Math.round(c[0]), Math.round(c[1]), Math.round(c[2]), Math.round(c[3] * 255)];
  }
  const RECOLOR = new Map();
  N0Q_PALETTE.split(',').forEach((hex, i) => {
    const c = i > 0 && rampColor(i * 0.5 - 32.5);
    if (c && !RECOLOR.has(parseInt(hex, 16))) RECOLOR.set(parseInt(hex, 16), c);
  });
  // The rain colors from drizzle to severe: the radar legend, and the hourly rain curves below.
  const RAIN_COLORS = RAMP.slice(1).map(s => `rgb(${s[1]},${s[2]},${s[3]})`);
  $('ramp').style.background = 'linear-gradient(90deg,' + RAIN_COLORS.join(',') + ')';

  // One layer for the whole animation: each map tile keeps every frame of the loop (recolored, off
  // screen) and is redrawn as a blend of the two frames on either side of the current moment.
  let frames = [];
  function loadFrame(tile, stamp) {
    if (tile.frames.has(stamp)) return;
    tile.frames.set(stamp, null);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = c.height = 256;
      const ctx = c.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0);
      const image = ctx.getImageData(0, 0, 256, 256), px = image.data;
      for (let q = 0; q < px.length; q += 4) {
        if (!px[q + 3]) continue;
        const rgba = RECOLOR.get((px[q] << 16) | (px[q + 1] << 8) | px[q + 2]);
        if (rgba) { px[q] = rgba[0]; px[q + 1] = rgba[1]; px[q + 2] = rgba[2]; px[q + 3] = rgba[3]; } else px[q + 3] = 0;
      }
      ctx.putImageData(image, 0, 0);
      if (tile.frames.has(stamp)) tile.frames.set(stamp, c);
    };
    // The newest scan is often not on the server yet; keep retrying while it's part of the loop.
    img.onerror = () => setTimeout(() => {
      if (tile.frames.get(stamp) === null) { tile.frames.delete(stamp); loadFrame(tile, stamp); }
    }, 20000);
    img.src = L.Util.template(RADAR_TILES, { stamp, ...tile.coords });
  }
  const RadarLayer = L.GridLayer.extend({
    createTile(coords) {
      const tile = document.createElement('canvas');
      tile.width = tile.height = 256;
      tile.coords = coords;
      tile.frames = new Map();
      frames.forEach(f => loadFrame(tile, f.stamp));
      return tile;
    },
    tiles() { return Object.values(this._tiles).map(t => t.el); },
  });

  // The map: you can pan and pinch it on the phone. Near is about 300 miles across; Region about 1,000.
  const ESRI = 'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas';
  const map = L.map('map', { zoomControl: false, zoomSnap: 0.25, fadeAnimation: false, attributionControl: true });
  const view = span => [[place.lat - span, place.lon - span * 1.25], [place.lat + span, place.lon + span * 1.25]];
  const SPANS = { near: 2.2, region: 7 };
  let zoom = 'near';
  const fit = () => { map.invalidateSize(); map.fitBounds(view(SPANS[zoom])); };
  fit();
  addEventListener('resize', () => { clearTimeout(fit.t); fit.t = setTimeout(fit, 200); });
  L.tileLayer(`${ESRI}/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}`, { className: 'basemap', maxNativeZoom: 16, attribution: 'Basemap &copy; Esri' }).addTo(map);
  map.createPane('radar').style.zIndex = 400;
  map.getPane('radar').classList.add('leaflet-radar-pane');
  const radar = new RadarLayer({ pane: 'radar', opacity: 0.9 }).addTo(map);
  map.createPane('labels');
  map.getPane('labels').style.zIndex = 650;
  map.getPane('labels').style.pointerEvents = 'none';
  L.tileLayer(`${ESRI}/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}`, { maxNativeZoom: 16, pane: 'labels' }).addTo(map);
  L.circleMarker([place.lat, place.lon], { radius: 6, color: '#fff', weight: 2.5, fillColor: '#1d2126', fillOpacity: 1, pane: 'labels' }).addTo(map);
  map.attributionControl.setPrefix(false);
  map.attributionControl.addAttribution('Radar: NWS NEXRAD via Iowa Environmental Mesonet');

  $('zoom').addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    zoom = b.dataset.z;
    $('zoom').querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
    map.flyToBounds(view(SPANS[zoom]), { duration: 0.6 });
  });

  const radarTiles = () => radar.tiles();
  function drawBlend(a, b, t) {
    for (const tile of radarTiles()) {
      const ctx = tile.getContext('2d');
      ctx.clearRect(0, 0, 256, 256);
      ctx.globalCompositeOperation = 'lighter';
      const fa = a && tile.frames.get(a.stamp), fb = b && tile.frames.get(b.stamp);
      if (fa && t < 1) { ctx.globalAlpha = 1 - t; ctx.drawImage(fa, 0, 0); }
      if (fb && t > 0) { ctx.globalAlpha = t; ctx.drawImage(fb, 0, 0); }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    }
  }
  const utcStamp = d => d.toISOString().slice(0, 16).replace(/[-T:]/g, '');
  function syncFrames(latest) {
    const wanted = [];
    for (let m = HISTORY_MIN; m >= 0; m -= STEP_MIN) {
      const time = new Date(latest - m * 60000);
      wanted.push({ time, stamp: utcStamp(time) });
    }
    const keep = new Set(wanted.map(f => f.stamp));
    for (const tile of radarTiles()) {
      for (const stamp of tile.frames.keys()) if (!keep.has(stamp)) tile.frames.delete(stamp);
      wanted.forEach(f => loadFrame(tile, f.stamp));
    }
    frames = wanted;
    shownLabel = null;
  }
  // A frame plays once most of the visible tiles have it (a tile scrolled in later catches up).
  const isReady = f => { const t = radarTiles(); return t.length && t.filter(x => x.frames.get(f.stamp)).length >= t.length * 0.8; };
  let pos = 0, phase = 'play', phaseStart = 0, lastTick = 0, shownLabel = null;
  function showLabel(f) {
    if (f === shownLabel) return;
    shownLabel = f;
    const mins = Math.round((frames[frames.length - 1].time - f.time) / 60000);
    $('frameTime').textContent = fmtTime(f.time);
    $('frameAge').textContent = mins ? `${mins} min before latest` : 'Latest scan';
    $('frameAge').className = mins ? '' : 'live';
  }
  function tick(now) {
    requestAnimationFrame(tick);
    if (now - lastTick < 33 || document.hidden) return;
    const dt = lastTick ? Math.min(0.2, (now - lastTick) / 1000) : 0;
    lastTick = now;
    const list = frames.filter(isReady), n = list.length;
    if (n < 2) return;
    const last = n - 1;
    pos = Math.min(pos, last);
    if (phase === 'play') { pos = Math.min(pos + dt * FRAMES_PER_SEC, last); if (pos >= last) { phase = 'hold'; phaseStart = now; } }
    else if (phase === 'hold' && now - phaseStart >= HOLD_LAST_MS) { phase = 'rewind'; phaseStart = now; }
    else if (phase === 'rewind' && now - phaseStart >= REWIND_MS) { phase = 'play'; pos = 0; }
    if (phase === 'rewind') {
      drawBlend(list[last], list[0], (now - phaseStart) / REWIND_MS);
      showLabel(list[0]);
      $('progress').style.width = '0%';
    } else {
      const i = Math.min(Math.floor(pos), last - 1);
      drawBlend(list[i], list[i + 1], pos - i);
      showLabel(list[Math.round(pos)]);
      $('progress').style.width = `${(pos / last) * 100}%`;
    }
  }
  async function refreshRadar() {
    let ok = false;
    try {
      const latest = new Date((await (await fetch(RADAR_INFO, { cache: 'no-store' })).json()).meta.valid);
      syncFrames(latest);
      const old = (Date.now() - latest) / 60000;
      $('status').textContent = old > 30 ? `Radar data is ${Math.round(old)} min old` : '';
      ok = true;
    } catch (e) { $('status').textContent = 'Can’t reach the radar — retrying'; }
    setTimeout(refreshRadar, ok ? 2 * 60e3 : 20e3);
  }
  // New tiles (after panning or zooming) load the frames already in the loop.
  map.on('zoomend moveend', () => radarTiles().forEach(t => frames.forEach(f => loadFrame(t, f.stamp))));

  // ================================================================ Forecast
  function icon(text, isDay) {
    const t = (text || '').toLowerCase();
    if (/hurricane|tropical storm/.test(t)) return '🌀';
    if (/thunder|t-storm/.test(t)) return '⛈️';
    if (/rain|shower|drizzle/.test(t)) return isDay && /chance|slight|isolated|scattered/.test(t) ? '🌦️' : '🌧️';
    if (/snow|flurr|sleet/.test(t)) return '🌨️';
    if (/fog|haze|smoke/.test(t)) return '🌫️';
    if (/mostly cloudy|overcast/.test(t) || /^cloudy/.test(t)) return isDay ? '🌥️' : '☁️';
    if (/partly/.test(t)) return isDay ? '⛅' : '🌙';
    if (/mostly sunny/.test(t)) return '🌤️';
    if (/sunny|clear|fair/.test(t)) return isDay ? '☀️' : '🌙';
    if (/wind|breezy|blustery/.test(t)) return '💨';
    return isDay ? '⛅' : '🌙';
  }
  async function get(url) {
    const r = await fetch(url, { headers: { Accept: 'application/geo+json' }, cache: 'no-store' });
    if (!r.ok) throw new Error(`${r.status} ${url}`);
    return r.json();
  }

  function renderDays(periods, hourly) {
    // A day's rain chance is its highest hourly chance from now on, so the list matches the hourly rows.
    const hourlyMax = new Map();
    for (const q of hourly || []) {
      if (new Date(q.endTime) <= new Date()) continue;
      const key = q.startTime.slice(0, 10), pop = q.probabilityOfPrecipitation?.value ?? 0;
      hourlyMax.set(key, Math.max(hourlyMax.get(key) ?? 0, pop));
    }
    const days = new Map();
    for (const q of periods) {
      const key = q.startTime.slice(0, 10);
      if (!days.has(key)) days.set(key, { key });
      days.get(key)[q.isDaytime ? 'day' : 'night'] = q;
    }
    const today = dateKey(new Date());
    $('days').innerHTML = [...days.values()].slice(0, 7).map(d => {
      const main = d.day || d.night;
      const date = new Date(d.key + 'T12:00:00');
      const name = d.key === today ? (d.day ? 'Today' : 'Tonight') : date.toLocaleDateString([], { weekday: 'short' });
      const pop = hourlyMax.get(d.key) ?? main.probabilityOfPrecipitation?.value ?? 0;
      return `<div class="day">
        <div class="name">${name}<small>${date.toLocaleDateString([], { month: 'short', day: 'numeric' })}</small></div>
        <div class="icon">${icon(main.shortForecast, !!d.day)}</div>
        <div class="desc">${esc(main.shortForecast.replace(/ And /g, ' & '))}${pop ? `<span class="pop">💧 ${pop}%</span>` : ''}</div>
        <div class="temps">${d.day ? `${d.day.temperature}°` : ''}${d.night ? `<span class="lo">${d.night.temperature}°</span>` : ''}</div>
      </div>`;
    }).join('');
    $('todayName').textContent = periods[0].name;
    $('todayText').textContent = periods[0].detailedForecast;
  }

  // Smooth curve through points: monotone cubic, so it never bulges past the data.
  function curvePath(pts) {
    const n = pts.length;
    if (n === 1) return `M${pts[0][0]},${pts[0][1]}`;
    const m = [], t = [];
    for (let i = 0; i < n - 1; i++) m[i] = (pts[i + 1][1] - pts[i][1]) / (pts[i + 1][0] - pts[i][0]);
    t[0] = m[0];
    t[n - 1] = m[n - 2];
    for (let i = 1; i < n - 1; i++) t[i] = m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2;
    for (let i = 0; i < n - 1; i++) {
      if (m[i] === 0) { t[i] = t[i + 1] = 0; continue; }
      const a = t[i] / m[i], b = t[i + 1] / m[i], s = a * a + b * b;
      if (s > 9) { const k = 3 / Math.sqrt(s); t[i] = k * a * m[i]; t[i + 1] = k * b * m[i]; }
    }
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < n - 1; i++) {
      const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], h = (x1 - x0) / 3;
      d += ` C${x0 + h},${y0 + h * t[i]} ${x1 - h},${y1 - h * t[i + 1]} ${x1},${y1}`;
    }
    return d;
  }

  // Three calendar days of hourly rain chance, one smooth curve per day; the label is the day's peak.
  // Above each curve, in small type: when to expect rain that day (rain.js, the same words as the PC).
  function renderHourly(periods) {
    const raw = periods.map(q => q.probabilityOfPrecipitation?.value ?? 0);
    const weights = [1, 2, 3, 2, 1];
    const eased = raw.map((_, i) => {
      let sum = 0, total = 0;
      weights.forEach((w, k) => { const v = raw[i + k - 2]; if (v != null) { sum += v * w; total += w; } });
      return sum / total;
    });
    const byHour = new Map(periods.map((q, i) => [q.startTime.slice(0, 13), { pop: raw[i], eased: eased[i] }]));
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (now.getHours() >= 20 ? 1 : 0));
    const label = h => h === 0 ? '12a' : h < 12 ? `${h}a` : h === 12 ? '12p' : `${h - 12}p`;
    const X = h => h + 0.5, Y = v => 100 - v * 0.8;
    $('rainRows').innerHTML = [0, 1, 2].map(i => {
      const day = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
      const key = dateKey(day);
      const name = key === dateKey(now) ? 'Today' : day.toLocaleDateString([], { weekday: 'short' });
      const hours = [];
      for (let h = 0; h < 24; h++) { const d = byHour.get(`${key}T${String(h).padStart(2, '0')}`); if (d) hours.push({ h, ...d }); }
      let plot = '', note = '';
      if (hours.length) {
        const pts = hours.map(d => [X(d.h), Y(d.eased)]);
        const line = curvePath(pts);
        const area = `${line} L${pts[pts.length - 1][0]},100 L${pts[0][0]},100 Z`;
        const max = Math.max(...hours.map(d => d.pop));
        const first = hours.findIndex(d => d.pop === max);
        let last = first;
        while (last + 1 < hours.length && hours[last + 1].pop === max) last++;
        const peak = hours[Math.round((first + last) / 2)];
        const left = Math.min(92, Math.max(8, X(peak.h) / 24 * 100));
        const nowX = now.getHours() + now.getMinutes() / 60;
        const nowLine = key === dateKey(now) ? `<line class="now" x1="${nowX}" x2="${nowX}" y1="0" y2="100"/>` : '';
        // Colored by height like the radar (RAIN_COLORS): low chances purple and blue, then green, yellow,
        // orange, red, magenta at 100%. The gradient runs from 0% (y 100) to 100% (y 20) whatever the curve's shape.
        const stops = RAIN_COLORS.map((c, k) => `<stop offset="${k / (RAIN_COLORS.length - 1)}" stop-color="${c}"/>`).join('');
        plot = `<svg viewBox="0 0 24 100" preserveAspectRatio="none">
          <defs><linearGradient id="rainRamp${i}" gradientUnits="userSpaceOnUse" x1="0" y1="${Y(0)}" x2="0" y2="${Y(100)}">${stops}</linearGradient></defs>
          <path d="${area}" fill="url(#rainRamp${i})" fill-opacity=".45"/><path class="line" d="${line}" style="stroke:url(#rainRamp${i})"/>${nowLine}</svg>
          <div class="rpeak" style="left:${left}%;top:${Y(peak.eased)}%">${max}%</div>`;
        const from = key === dateKey(now) ? now : day;
        const w = window.Rain && Rain.words(periods, from, new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1), '');
        // On a narrow phone the line can wrap: never between a time and its AM / PM.
        const words = s => esc(s).replace(/(\d)[ \u202f]([AP]M)/g, '$1\u00a0$2');
        if (w) note = `<div class="rnote${w.wet ? ' wet' : ''}">${words(w.line)}<span> · ${words(w.sub)}</span></div>`;
      }
      return `<div class="rrow"><div class="rlabel">${name}<small>${day.toLocaleDateString([], { month: 'short', day: 'numeric' })}</small></div>${note}<div class="rplot">${plot}</div></div>`;
    }).join('');
    $('rainHours').innerHTML = '<div></div><div class="ticks">' +
      [0, 3, 6, 9, 12, 15, 18, 21].map(h => `<span style="left:${X(h) / 24 * 100}%">${label(h)}</span>`).join('') + '</div>';
  }

  function renderNow(obs, hourly) {
    const o = obs?.properties || {};
    const c2f = c => c == null ? null : Math.round(c * 9 / 5 + 32);
    const firstHour = hourly?.[0];
    const temp = c2f(o.temperature?.value) ?? firstHour?.temperature;
    const feels = c2f(o.heatIndex?.value) ?? c2f(o.windChill?.value) ?? temp;
    const desc = o.textDescription || firstHour?.shortForecast || '';
    const isDay = firstHour ? firstHour.isDaytime : true;
    $('nowTemp').textContent = temp != null ? `${temp}°` : '--°';
    $('nowIcon').textContent = icon(desc, isDay);
    $('nowDesc').textContent = desc;
    $('nowFeels').textContent = feels != null ? `${feels}°` : '--';
    $('nowHum').textContent = o.relativeHumidity?.value != null ? `${Math.round(o.relativeHumidity.value)}%` : '--';
    const kmh = o.windSpeed?.value, deg = o.windDirection?.value;
    if (kmh != null) {
      const mph = Math.round(kmh * 0.621371);
      const dir = deg == null ? '' : ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(deg / 45) % 8] + ' ';
      $('nowWind').textContent = mph ? `${dir}${mph} mph` : 'Calm';
    } else if (firstHour) $('nowWind').textContent = `${firstHour.windDirection} ${firstHour.windSpeed}`;
  }

  function renderAlerts(features) {
    const seen = new Set();
    $('alerts').innerHTML = features.filter(f => !seen.has(f.properties.event) && seen.add(f.properties.event)).map(f => {
      const q = f.properties, end = q.ends || q.expires;
      const until = end ? `until ${new Date(end).toLocaleString([], { weekday: 'short', hour: 'numeric', minute: '2-digit' })}` : '';
      const severe = q.severity === 'Severe' || q.severity === 'Extreme';
      return `<div class="alert${severe ? ' severe' : ''}"><b>⚠ ${esc(q.event)}</b> <span>${esc(until)}</span></div>`;
    }).join('');
  }

  let grid = null, station = null, lastOk = null, hourlyCache = null;
  async function load() {
    let ok = false;
    try {
      if (!grid) grid = (await get(`${API}/points/${place.lat.toFixed(4)},${place.lon.toFixed(4)}`)).properties;
      if (!station) station = (await get(grid.observationStations)).features[0].properties.stationIdentifier;
      const [fc, hr, obs, al] = await Promise.allSettled([
        get(grid.forecast), get(grid.forecastHourly),
        get(`${API}/stations/${station}/observations/latest`),
        get(`${API}/alerts/active?point=${place.lat.toFixed(4)},${place.lon.toFixed(4)}`),
      ]);
      if (hr.status === 'fulfilled') { hourlyCache = hr.value.properties.periods; renderHourly(hourlyCache); }
      if (fc.status === 'fulfilled') renderDays(fc.value.properties.periods, hourlyCache);
      if (obs.status === 'fulfilled' || hourlyCache) renderNow(obs.value, hourlyCache);
      if (al.status === 'fulfilled') renderAlerts(al.value.features);
      if (fc.status === 'fulfilled') lastOk = new Date();
      ok = fc.status === 'fulfilled' && hr.status === 'fulfilled';
    } catch (e) {
      if (!grid) { $('updated').textContent = 'No forecast for this place. The National Weather Service covers the US only.'; $('updated').className = 'stale'; return; }
    }
    setTimeout(load, ok ? 10 * 60e3 : 30e3);
    const u = $('updated');
    if (lastOk && Date.now() - lastOk < 45 * 60000) { u.textContent = `Updated ${fmtTime(lastOk)} · National Weather Service`; u.className = ''; }
    else { u.textContent = lastOk ? `Weather service not responding — last update ${fmtTime(lastOk)}` : 'Weather service not responding — retrying'; u.className = 'stale'; }
  }

  function tickClock() {
    const now = new Date();
    $('clockTime').textContent = fmtTime(now);
    $('clockDate').textContent = now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
  }

  // ================================================================ Picking your place
  const sheet = $('sheet');
  const openSheet = () => { sheet.classList.add('open'); sheet.setAttribute('aria-hidden', 'false'); };
  const closeSheet = () => { sheet.classList.remove('open'); sheet.setAttribute('aria-hidden', 'true'); };
  function choose(next) {
    Phone.store.set('weather.place', next);
    location.reload();
  }
  $('place-btn').addEventListener('click', openSheet);
  sheet.querySelector('.sheet-close').addEventListener('click', closeSheet);
  $('here').addEventListener('click', () => {
    if (!navigator.geolocation) return Phone.toast('This phone can’t share its location');
    $('here').textContent = 'Finding you…';
    navigator.geolocation.getCurrentPosition(async pos => {
      const lat = +pos.coords.latitude.toFixed(4), lon = +pos.coords.longitude.toFixed(4);
      let name = 'Where I am';
      try {
        const pt = (await get(`${API}/points/${lat},${lon}`)).properties.relativeLocation.properties;
        name = pt.city;
      } catch (e) { /* outside the US, or offline: keep the plain name */ }
      choose({ name, lat, lon });
    }, () => { $('here').textContent = '📍 Use where I am'; Phone.toast('Location is off for this app'); }, { timeout: 15000 });
  });
  // Town search: Open-Meteo's free place finder, US places only.
  let searchTimer;
  async function search() {
    const q = $('q').value.trim();
    if (q.length < 2) { $('results').innerHTML = ''; return; }
    try {
      const r = await (await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=8&language=en&countryCode=US`)).json();
      const list = (r.results || []);
      $('results').innerHTML = list.length ? list.map((x, i) => `<li data-i="${i}">${esc(x.name)}<small>${esc([x.admin1].filter(Boolean).join(', '))}</small></li>`).join('')
        : '<li class="muted">No US places by that name</li>';
      $('results').onclick = e => {
        const li = e.target.closest('li[data-i]');
        if (li) { const x = list[+li.dataset.i]; choose({ name: x.name, lat: +x.latitude.toFixed(4), lon: +x.longitude.toFixed(4) }); }
      };
    } catch (e) { $('results').innerHTML = '<li class="muted">Can’t search right now</li>'; }
  }
  $('q').addEventListener('input', () => { clearTimeout(searchTimer); searchTimer = setTimeout(search, 300); });
  $('search').addEventListener('submit', e => { e.preventDefault(); search(); $('q').blur(); });

  tickClock();
  setInterval(tickClock, 1000);
  refreshRadar();
  requestAnimationFrame(tick);
  load();
})();
