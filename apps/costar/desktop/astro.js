// Star Wall astronomy: where the planets are, your birth chart, and how today's sky lines up with it.
// Planet positions come from Astronomy Engine (loaded by each page), which is accurate to well under a
// minute of arc. Longitudes are tropical, measured along the ecliptic of date, as in Western astrology.
window.StarAstro = (() => {
  const A = window.Astronomy;
  const DEG = Math.PI / 180;
  const DAY = 86400e3, HOUR = 3600e3;

  const norm = x => ((x % 360) + 360) % 360;
  const diff = (a, b) => { const d = norm(a - b); return d > 180 ? d - 360 : d; };   // a − b, in (−180, 180]
  const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));

  const PLANETS = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
  const SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  // Planet symbols. U+FE0E asks for the plain-text form of a symbol rather than the color emoji.
  const GLYPH = { Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂', Jupiter: '♃',
    Saturn: '♄', Uranus: '♅', Neptune: '♆', Pluto: '♇', Node: '☊' };
  const glyph = id => id === 'Ascendant' ? '↑' : id === 'Midheaven' ? 'MC' : GLYPH[id] + '\uFE0E';

  const ASPECTS = [
    { name: 'conjunction', angle: 0 },
    { name: 'sextile', angle: 60 },
    { name: 'square', angle: 90 },
    { name: 'trine', angle: 120 },
    { name: 'opposition', angle: 180 },
  ];

  function longitude(body, date) {
    if (body === 'Sun') return A.SunPosition(date).elon;
    if (body === 'Moon') return A.EclipticGeoMoon(date).lon;
    return A.Ecliptic(A.GeoVector(body, date, true)).elon;
  }

  // Degrees per day; negative means retrograde.
  const speed = (body, date) => diff(longitude(body, new Date(+date + DAY / 2)), longitude(body, new Date(+date - DAY / 2)));

  // Mean lunar node (Meeus, Astronomical Algorithms, 47.7).
  function meanNode(date) {
    const T = A.MakeTime(date).tt / 36525;
    return norm(125.0445479 - 1934.1362891 * T + 0.0020754 * T * T + T * T * T / 467441);
  }

  // Mean obliquity of the ecliptic (IAU 2006).
  const obliquity = date => { const T = A.MakeTime(date).tt / 36525; return 23.439279444 - 0.0130102136 * T - 5.086e-8 * T * T; };

  // Ascendant and Midheaven for a time and place.
  function angles(date, lat, lon) {
    const ramc = norm((A.SiderealTime(date) + lon / 15) * 15);
    const e = obliquity(date) * DEG, r = ramc * DEG, f = lat * DEG;
    const mc = norm(Math.atan2(Math.sin(r), Math.cos(r) * Math.cos(e)) / DEG);
    const asc = norm(Math.atan2(Math.cos(r), -(Math.sin(r) * Math.cos(e) + Math.tan(f) * Math.sin(e))) / DEG);
    return { ramc, asc, mc, eps: e / DEG };
  }

  // Placidus house cusps: each cusp is the point of the ecliptic that has covered a third (or two thirds)
  // of its own arc above or below the horizon. Solved by iterating on the cusp's declination.
  function placidus({ ramc, asc, mc, eps }, lat) {
    const e = eps * DEG, f = lat * DEG;
    const lonFromRa = ra => norm(Math.atan2(Math.sin(ra * DEG), Math.cos(ra * DEG) * Math.cos(e)) / DEG);
    const cusp = (frac, below) => {
      let lam = lonFromRa(below ? ramc + 180 - frac * 90 : ramc + frac * 90);
      for (let i = 0; i < 50; i++) {
        const dec = Math.asin(Math.sin(e) * Math.sin(lam * DEG));
        const ad = Math.asin(clamp(Math.tan(f) * Math.tan(dec), -1, 1)) / DEG;   // ascensional difference
        const next = lonFromRa(below ? ramc + 180 - frac * (90 - ad) : ramc + frac * (90 + ad));
        const done = Math.abs(diff(next, lam)) < 1e-7;
        lam = next;
        if (done) break;
      }
      return lam;
    };
    const c11 = cusp(1 / 3, false), c12 = cusp(2 / 3, false), c2 = cusp(2 / 3, true), c3 = cusp(1 / 3, true);
    return [asc, c2, c3, mc + 180, c11 + 180, c12 + 180, asc + 180, c2 + 180, c3 + 180, mc, c11, c12].map(norm);
  }

  const wholeSign = ({ asc }) => Array.from({ length: 12 }, (_, i) => Math.floor(asc / 30) * 30 + i * 30).map(norm);

  // 1–12
  function houseOf(lon, cusps) {
    for (let i = 0; i < 12; i++) {
      if (norm(lon - cusps[i]) < norm(cusps[(i + 1) % 12] - cusps[i])) return i + 1;
    }
    return 1;
  }

  const signOf = lon => SIGNS[Math.floor(norm(lon) / 30)];

  // 0°00′ within the sign
  function degreeInSign(lon) {
    const d = norm(lon) % 30;
    let deg = Math.floor(d), min = Math.round((d - deg) * 60);
    if (min === 60) { deg += 1; min = 0; }
    return { deg, min, text: `${deg}°${String(min).padStart(2, '0')}′` };
  }

  // A wall-clock time in some time zone, as a real moment. ("1993-04-15", "14:00", "America/New_York")
  function zonedToUtc(dateText, timeText, timeZone) {
    const [y, m, d] = dateText.split('-').map(Number), [hh, mm] = timeText.split(':').map(Number);
    const wall = Date.UTC(y, m - 1, d, hh, mm);
    const fmt = new Intl.DateTimeFormat('en-US', {
      timeZone, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric',
    });
    const offset = t => {
      const p = Object.fromEntries(fmt.formatToParts(t).map(x => [x.type, x.value]));
      return Date.UTC(+p.year, p.month - 1, +p.day, +p.hour, +p.minute, +p.second) - t;
    };
    let t = wall - offset(wall);
    t = wall - offset(t);
    return new Date(t);
  }

  function natalChart(birth, houseSystem) {
    const date = zonedToUtc(birth.date, birth.time, birth.timeZone);
    const ang = angles(date, birth.lat, birth.lon);
    const cusps = houseSystem === 'whole-sign' ? wholeSign(ang) : placidus(ang, birth.lat);
    const points = PLANETS.map(id => ({ id, lon: longitude(id, date), speed: speed(id, date) }));
    points.push({ id: 'Node', lon: meanNode(date) }, { id: 'Ascendant', lon: ang.asc }, { id: 'Midheaven', lon: ang.mc });
    for (const p of points) {
      p.sign = signOf(p.lon);
      p.house = houseOf(p.lon, cusps);
      p.retrograde = p.speed < 0;
    }
    const byId = Object.fromEntries(points.map(p => [p.id, p]));
    return { date, asc: ang.asc, mc: ang.mc, cusps, points, byId };
  }

  // Aspects between the planets in the birth chart, for the lines inside the wheel.
  function natalAspects(chart) {
    const orbs = { conjunction: 8, opposition: 8, square: 7, trine: 7, sextile: 5 };
    const ps = chart.points.filter(p => PLANETS.includes(p.id));
    const out = [];
    for (let i = 0; i < ps.length; i++) {
      for (let j = i + 1; j < ps.length; j++) {
        const sep = Math.abs(diff(ps[i].lon, ps[j].lon));
        for (const a of ASPECTS) {
          if (Math.abs(sep - a.angle) <= orbs[a.name]) out.push({ a: ps[i].id, b: ps[j].id, aspect: a.name });
        }
      }
    }
    return out;
  }

  // The sky at a moment, placed in your houses.
  function sky(date, chart) {
    return PLANETS.map(id => {
      const lon = longitude(id, date), sp = speed(id, date);
      return { id, lon, speed: sp, retrograde: sp < 0, sign: signOf(lon), house: chart ? houseOf(lon, chart.cusps) : null };
    });
  }

  // How far a transiting planet can be from an exact aspect and still count.
  const ORB = { Sun: 2, Moon: 2.5, Mercury: 2, Venus: 2, Mars: 2, Jupiter: 1.5, Saturn: 1.5, Uranus: 1, Neptune: 1, Pluto: 1 };
  const SCAN = { Sun: 60, Moon: 72, Mercury: 90, Venus: 90, Mars: 150, Jupiter: 500, Saturn: 700, Uranus: 900, Neptune: 900, Pluto: 900 };
  const TARGETS = [...PLANETS, 'Ascendant', 'Midheaven'];

  const aspectOrb = (tLon, nLon, angle) => Math.abs(Math.abs(diff(tLon, nLon)) - angle);
  const maxOrb = (body, aspect) => ORB[body] * (aspect === 'sextile' ? 0.75 : 1);

  // When this transit started and when it ends: the stretch around `date` that it stays within orb.
  // Moon transits are measured in hours, everything else in days.
  function activeRange(body, target, angle, orb, date) {
    const step = body === 'Moon' ? HOUR : DAY;
    const inOrb = t => aspectOrb(longitude(body, t), target, angle) <= orb;
    let start = date, end = date;
    for (let i = 1; i <= SCAN[body]; i++) { const t = new Date(+date - i * step); if (!inOrb(t)) break; start = t; }
    for (let i = 1; i <= SCAN[body]; i++) { const t = new Date(+date + i * step); if (!inOrb(t)) break; end = t; }
    return { start, end };
  }

  // Every transit to your birth chart that's in effect at `date`. quick: skip working out when each one starts and
  // ends (much faster; used to look back over past days for the daily message).
  function transits(chart, date, quick = false) {
    const out = [];
    for (const body of PLANETS) {
      const lon = longitude(body, date), later = quick ? lon : longitude(body, new Date(+date + HOUR));
      for (const targetId of TARGETS) {
        const target = chart.byId[targetId];
        for (const a of ASPECTS) {
          const orb = aspectOrb(lon, target.lon, a.angle), limit = maxOrb(body, a.name);
          if (orb > limit) continue;
          const range = quick ? { start: date, end: date } : activeRange(body, target.lon, a.angle, limit, date);
          out.push({
            body, target: targetId, aspect: a.name, angle: a.angle, orb, limit,
            applying: aspectOrb(later, target.lon, a.angle) < orb,
            bodyLon: lon, targetLon: target.lon, targetHouse: target.house,
            start: range.start, end: range.end,
          });
        }
      }
    }
    return out;
  }

  const PHASES = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'];

  // The moon tonight: its phase, how much of it is lit, and the next new and full moons.
  function moon(date) {
    const angle = A.MoonPhase(date);   // 0 new, 90 first quarter, 180 full, 270 last quarter
    const lit = A.Illumination('Moon', date).phase_fraction;
    const next = target => A.SearchMoonPhase(target, date, 40)?.date;
    return { angle, lit, phase: PHASES[Math.round(angle / 45) % 8], nextNew: next(0), nextFull: next(180) };
  }

  // When a body next changes sign, to the minute (searched up to `hours` ahead).
  function nextIngress(body, date, hours) {
    const sign = Math.floor(longitude(body, date) / 30);
    let lo = +date, hi = null;
    for (let h = 1; h <= hours; h++) {
      const t = +date + h * HOUR;
      if (Math.floor(longitude(body, new Date(t)) / 30) !== sign) { hi = t; break; }
      lo = t;
    }
    if (hi == null) return null;
    while (hi - lo > 60e3) {
      const mid = (lo + hi) / 2;
      if (Math.floor(longitude(body, new Date(mid)) / 30) !== sign) hi = mid; else lo = mid;
    }
    const at = new Date(hi);
    return { at, sign: signOf(longitude(body, at)) };
  }

  return {
    PLANETS, SIGNS, ASPECTS, glyph, norm, diff, longitude, speed, angles, natalChart, natalAspects, sky, transits,
    moon, nextIngress, houseOf, signOf, degreeInSign, zonedToUtc, obliquity,
  };
})();
