// When to expect rain, in words, shared by both screens: the right screen's top corner and its three day
// rows, and the Long Island map on the left screen.
//
// Rain.words(hourly, from, until, when) takes the Weather Service's hourly forecast periods and a stretch of
// time, and gives { line, sub, wet } (or null with no hours to go on). Hours at 30% or more make a rain
// window; the strongest window is the line: "Rain likely 2 – 5 PM" at 50% or more, "Chance of rain 2 – 5 PM"
// at 30–49%. Below 30% throughout: "No rain expected today" (noting a slight chance of 20% or more).
// when: 'today', 'tonight', or '' (for the day rows, which say it more briefly).
window.Rain = (() => {
  const hourName = d => d.toLocaleTimeString([], { hour: 'numeric' });

  function span(a, b) {   // a: first hour's start, b: last hour's end
    const [ta, tb] = [hourName(a), hourName(b)];
    const sameHalf = ta.slice(-2) === tb.slice(-2);
    return b - a <= 60 * 60e3 ? `around ${ta}` : `${sameHalf ? ta.replace(/\s?[AP]M$/, '') : ta} – ${tb}`;
  }

  function words(hourly, from, until, when) {
    const now = new Date();
    const hours = hourly.map(p => ({ start: new Date(p.startTime), end: new Date(p.endTime), pop: p.probabilityOfPrecipitation?.value ?? 0 }))
      .filter(h => h.end > from && h.start < until);
    if (!hours.length) return null;

    const windows = [];
    for (const h of hours) {
      const last = windows[windows.length - 1];
      if (h.pop < 30) continue;
      if (last && h.start - last.end < 1000) { last.end = h.end; if (h.pop > last.peak.pop) last.peak = h; }
      else windows.push({ start: h.start, end: h.end, peak: h });
    }
    const top = hours.reduce((a, b) => (b.pop > a.pop ? b : a));
    if (!windows.length) {
      return {
        line: `No rain expected${when ? ' ' + when : ''}`, wet: false,
        sub: top.pop >= 20 ? `Slight chance (${top.pop}%) around ${hourName(top.start)}` : `Highest chance ${top.pop}%`,
      };
    }
    const best = windows.reduce((a, b) => (b.peak.pop > a.peak.pop ? b : a));
    const range = w => (w.start <= now ? `now until ${hourName(w.end)}` : span(w.start, w.end));
    const others = windows.filter(w => w !== best).map(range);
    return {
      line: `${best.peak.pop >= 50 ? 'Rain likely' : 'Chance of rain'} ${range(best)}`, wet: best.peak.pop >= 50,
      sub: `Best chance ${best.peak.pop}% at ${hourName(best.peak.start)}` + (others.length ? ` · also ${others.join(', ')}` : ''),
    };
  }

  // The rest of today, or after 8 PM the night until 6 AM, with its 'today' / 'tonight' wording.
  function restOfDay(hourly) {
    const now = new Date();
    const late = now.getHours() >= 20;
    const until = new Date(now);
    if (late) { until.setDate(until.getDate() + 1); until.setHours(6, 0, 0, 0); } else { until.setHours(24, 0, 0, 0); }
    return words(hourly, now, until, late ? 'tonight' : 'today');
  }

  return { words, restOfDay };
})();
