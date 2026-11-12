// Cold fronts coming in, shared by the forecast screen and the phone version in Dylan's App Store (Dylan,
// November 11, 2026: "an indication for when we have cold fronts coming in, when to expect them, and how much the
// temperature will drop").
//
// The Weather Service has no "cold front" in its forecast for a place, but a front shows plainly in it: the wind swings
// round to the northwest and north, and the highs and lows drop for the next day or two. So Front.find(periods, hourly)
// takes the 12-hour forecast (each day's high, each night's low, and their words) and the hourly forecast (wind and
// temperature), and gives { line, sub, at, dayKey, highFrom, highTo, lowFrom, lowTo } for the next front, or null:
//   - a cool-down: a high (or a low) at least DROP degrees below the one before it, that lasts (the next one stays
//     cool too) or comes with the wind turning north; or the forecast's own words saying "cold front";
//   - when: the hour the wind turns north just before it (else the start of the forecast period before it gets cold);
//   - how much: from the last warm high and low before it to the coolest in the three days after.
window.Front = (() => {
  const DROP = 6;           // °F a high or a low has to fall, for a cool-down
  const NORTH = /^(WNW|NW|NNW|N|NNE)$/;
  const SAYS = /cold front|front (will )?(move|push|pass|sweep)|behind (the|a) front/i;

  const dayKey = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  // "Tonight around 10 PM", "Tomorrow around 2 AM", "Thursday afternoon"
  function when(t, exact) {
    const now = new Date(), d = dayKey(t);
    const tomorrow = dayKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1));
    const h = t.getHours(), night = h >= 18 || h < 5;
    const day = d === dayKey(now) ? (night && h >= 18 ? 'tonight' : 'today') : d === tomorrow ? 'tomorrow' : t.toLocaleDateString([], { weekday: 'long' });
    if (exact) return `${day} around ${t.toLocaleTimeString([], { hour: 'numeric' })}`;
    const part = h < 5 ? 'before dawn' : h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'night';
    return day === 'tonight' ? 'tonight' : `${day} ${part}`;
  }

  function find(periods, hourly) {
    const now = new Date();
    const ps = (periods || []).filter(p => new Date(p.endTime) > now && p.temperature != null);
    if (ps.length < 3) return null;
    const hrs = (hourly || []).filter(h => new Date(h.endTime) > now);
    // The first hour the wind is from the north, between two times (it was from somewhere else the hour before).
    const northAt = (from, to) => {
      for (let i = 0; i < hrs.length; i++) {
        const t = new Date(hrs[i].startTime);
        if (t < from || t > to || !NORTH.test(hrs[i].windDirection || '')) continue;
        if (i === 0 || !NORTH.test(hrs[i - 1].windDirection || '')) return t;
      }
      return null;
    };

    // The first cool-down that's a front, comparing each high with the high before it, each low with the low before.
    let cold = -1, said = ps.findIndex(p => SAYS.test(p.detailedForecast || ''));
    for (let i = 2; i < ps.length; i++) {
      const fall = ps[i - 2].temperature - ps[i].temperature;
      if (fall < DROP) continue;
      const lasts = i + 2 >= ps.length || ps[i - 2].temperature - ps[i + 2].temperature >= DROP - 2;
      const windTurns = !!northAt(new Date(ps[i - 2].startTime), new Date(ps[i].endTime));
      if (lasts || windTurns) { cold = i; break; }
    }
    if (cold < 0 && said < 0) return null;

    // When: the wind turning north, in the day before it gets cold (or around the period that says "cold front").
    const first = cold < 0 ? said : said >= 0 ? Math.min(said, cold - 1) : Math.max(0, cold - 1);
    const look = [new Date(ps[Math.max(0, first - 1)].startTime), new Date(ps[cold < 0 ? said : cold].endTime)];
    const turn = northAt(...look);
    const at = turn || new Date(Math.max(now, new Date(ps[first].startTime)));

    // How much: the last warm high and low before it, and the coolest in the three days after.
    const before = ps.filter(p => new Date(p.startTime) < at), after = ps.filter(p => new Date(p.startTime) >= at &&
      new Date(p.startTime) - at < 3 * 864e5);
    const last = (list, day) => list.filter(p => p.isDaytime === day).pop();
    const coolest = (list, day) => list.filter(p => p.isDaytime === day).reduce((a, p) => (!a || p.temperature < a.temperature ? p : a), null);
    const hiFrom = last(before, true) || ps.find(p => p.isDaytime), loFrom = last(before, false) || ps.find(p => !p.isDaytime);
    const hiTo = coolest(after, true), loTo = coolest(after, false);
    const fall = (a, b) => (a && b ? a.temperature - b.temperature : 0);
    const hiFall = fall(hiFrom, hiTo), loFall = fall(loFrom, loTo);
    if (Math.max(hiFall, loFall) < 4 && said < 0) return null;   // the words alone, or a real drop

    const parts = [];
    if (hiFall >= 3) parts.push(`highs ${hiFrom.temperature}° → ${hiTo.temperature}°`);
    if (loFall >= 3) parts.push(`lows ${loFrom.temperature}° → ${loTo.temperature}°`);
    const sub = parts.length ? parts.join(', ').replace(/^h/, 'H').replace(/^l/, 'L') : 'Cooler and drier behind it';
    return {
      line: `Cold front ${when(at, !!turn)}`, sub, at, dayKey: dayKey(at),
      highFrom: hiFrom?.temperature, highTo: hiTo?.temperature, lowFrom: loFrom?.temperature, lowTo: loTo?.temperature,
      drop: Math.max(hiFall, loFall),
    };
  }

  return { find };
})();
