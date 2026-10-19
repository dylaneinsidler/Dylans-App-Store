// Lifted from Daily Torah's week.html by build.mjs; edit it there.
(async function () {
  const { HDate, HebrewCalendar, months, gematriya } = hebcal;
  const today = TW.now();
  document.getElementById('header').outerHTML = TW.header('This week');

  // ---- This week's portion ----
  const w = TW.week(today);
  const [a, b] = w.parshiyot;
  const L = w.parshiyot.map(p => TW.lessons(p) || {});
  const name = w.parshiyot.map(p => p.name).join('–');
  const ref = b ? `${a.ref.split('-')[0]}-${TW.parseRef(b.ref).c2}:${TW.parseRef(b.ref).v2}` : a.ref;
  const verses = w.parshiyot.reduce((n, p) => n + TW.verseCount(p.ref), 0);

  const isToday = TW.dayStart(w.readOn).getTime() === TW.dayStart(today).getTime();
  document.getElementById('when').textContent =
    `This week's Torah portion · ${isToday ? 'read today' : 'read ' + w.readOnName + ', ' + w.readOn.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`;
  document.getElementById('name').textContent = name;
  document.getElementById('he-name').textContent = w.parshiyot.map(p => p.he).join('–');
  const meaning = L.map(l => l.meaning ? `“${l.meaning}”` : l.who).filter(Boolean).join(' & ');
  document.getElementById('meaning').innerHTML =
    (meaning ? `<span class="q">${meaning}</span><span class="dot">·</span>` : '') +
    `${TW.showRef(ref)}<span class="dot">·</span>${verses} verses`;
  if (w.holiday) {
    document.getElementById('holiday').textContent =
      `${TW.shortDate(w.holiday.date)} is ${w.holiday.name.replace(/Shabbat Chol ha-Moed/, '(Shabbat of the holiday week)')}, which has its own reading, so this portion comes the Shabbat after.`;
  }
  if (b) document.getElementById('holiday').textContent = `A double portion this year: both are read together on the same Shabbat.`;

  const summary = document.getElementById('summary');
  summary.innerHTML = L.map(l => l.summary).filter(Boolean).join(' ');
  // Its picture (the first portion's, in a double week): old public-domain art, with what it shows and who made it.
  const pic = (window.TORAH_PICTURES || {})[a.name];
  if (pic) document.getElementById('pic').innerHTML = `<img src="${pic.file}" alt="">
    <figcaption>${pic.shows}${pic.artist ? ` · ${pic.artist.replace(/\s*\(.*$/, '').split(/[,;]/)[0]}` : ''}</figcaption>`;

  // Two lessons from each portion in a double week, otherwise the first four.
  const lessons = b ? [...(L[0].lessons || []).slice(0, 2), ...(L[1].lessons || []).slice(0, 2)] : (L[0].lessons || []).slice(0, 4);
  document.getElementById('lessons').innerHTML = lessons.map((l, i) => `
    <div class="lesson">
      <div class="lhead"><div class="num">${b ? w.parshiyot[i < 2 ? 0 : 1].name + ' · ' : ''}Lesson ${i + 1}</div><h3>${l.title}</h3></div>
      <div class="body">${l.text}<span class="src">${l.source || ''}</span></div>
    </div>`).join('');

  // Where this portion falls in the whole Torah.
  const start = TW.parseRef(a.ref);
  const before = TW.verseIndex(start.book, start.c1, start.v1);
  const idx = TORAH.parshiyot.indexOf(a);
  document.getElementById('bar').style.width = `${(before + verses) / TW.totalVerses * 100}%`;
  document.getElementById('progress-text').innerHTML =
    `Portion <b>${idx + 1}${b ? '–' + (idx + 2) : ''}</b> of 54 · verse ${before + 1} of ${TW.totalVerses.toLocaleString()}`;
  document.getElementById('books').innerHTML = TORAH.books.map(bk => `
    <div class="book">
      <div class="bname">${bk.name}<span class="he">${bk.he}</span></div>
      <div class="bline"></div>
      ${TORAH.parshiyot.filter(p => p.book === bk.name).map(p => {
        const i = TORAH.parshiyot.indexOf(p);
        const cls = w.parshiyot.includes(p) ? 'now' : i < idx ? 'past' : '';
        return `<div class="p ${cls}"><span class="pe">${p.name}</span><span class="he-sans">${p.he}</span></div>`;
      }).join('')}
    </div>`).join('');

  // ---- The year ----
  const hd = new HDate(today);
  const year = hd.getFullYear();
  const rh = new HDate(1, months.TISHREI, year);
  const nextRh = new HDate(1, months.TISHREI, year + 1);
  const daysInYear = nextRh.abs() - rh.abs();
  const dayOfYear = hd.abs() - rh.abs();   // 0-based
  document.getElementById('year-he').textContent = `שנת ${TW.stripVowels(gematriya(year))}`;

  // Holidays, in plain English. (Dates from Hebcal; events that start the evening before say so.)
  const HOLIDAYS = [
    [/^Rosh Hashana \d/, 'Rosh Hashanah', 'ראש השנה', 'The Jewish New Year'],
    [/^Yom Kippur$/, 'Yom Kippur', 'יום כיפור', 'The Day of Atonement, a fast day'],
    [/^Sukkot I$/, 'Sukkot', 'סוכות', 'Seven days in the sukkah, the harvest booth'],
    [/^Shmini Atzeret$/, 'Shemini Atzeret', 'שמיני עצרת', 'The festival day that closes Sukkot'],
    [/^Simchat Torah$/, 'Simchat Torah', 'שמחת תורה', 'The Torah reading ends and starts again'],
    [/^Chanukah: 1 Candle$/, 'Chanukah', 'חנוכה', 'Eight nights of lights, from that evening'],
    [/^Tu BiShvat$/, 'Tu BiShvat', 'ט״ו בשבט', 'The new year for trees'],
    [/^Purim$/, 'Purim', 'פורים', 'The story of Esther, read from the Megillah'],
    [/^Pesach I$/, 'Passover', 'פסח', 'The Exodus from Egypt; seder the night before'],
    [/^Lag BaOmer$/, 'Lag BaOmer', 'ל״ג בעומר', 'A happy day in the 49-day Omer count'],
    [/^Shavuot I$/, 'Shavuot', 'שבועות', 'The giving of the Torah at Sinai'],
    [/^Tish'a B'Av$/, "Tisha B'Av", 'תשעה באב', 'Mourning the destroyed Temples, a fast day'],
  ];
  const events = HebrewCalendar.calendar({ start: rh, end: new HDate(29, months.ELUL, year + 1), il: TW.cfg.israel, noMinorFast: true, noModern: true, noRoshChodesh: true, noSpecialShabbat: true })
    .map(e => { const h = HOLIDAYS.find(([re]) => re.test(e.getDesc())); return h && { name: h[1], he: h[2], what: h[3], hd: e.getDate() }; })
    .filter(Boolean);

  const coming = events.filter(e => e.hd.abs() >= hd.abs()).slice(0, 4);
  document.getElementById('holidays').innerHTML = coming.map(e => {
    const days = e.hd.abs() - hd.abs();
    const inText = days === 0 ? 'today' : days === 1 ? 'tomorrow' : days < 60 ? `in ${days} days` : `in ${Math.round(days / 7)} weeks`;
    return `<div class="hol"><div class="top"><span class="n">${e.name}<span class="he">${e.he}</span></span><span class="in">${inText}</span></div>
      <div class="what">${TW.shortDate(e.hd.greg())} · ${TW.showHebrewDate(e.hd, false)} · ${e.what}</div></div>`;
  }).join('');

  drawWheel();

  // The year as a wheel, Rosh Hashanah at the top, going clockwise: a band for each month, a dot for
  // each holiday, and a hand at today. In the middle, the moon and today's date, Hebrew and ordinary (each Hebrew month
  // starts at the new moon, so the day of the month tells you the moon's phase).
  function drawWheel() {
    const svg = document.getElementById('wheel');
    const C = 165, R1 = 158, R0 = 116, RM = (R0 + R1) / 2;
    const ang = day => (day / daysInYear) * 2 * Math.PI - Math.PI / 2;
    const pt = (r, a) => [C + r * Math.cos(a), C + r * Math.sin(a)];
    const arc = (r, a0, a1, sweep = 1) => {
      const [x0, y0] = pt(r, a0), [x1, y1] = pt(r, a1);
      return `M${x0},${y0} A${r},${r} 0 ${Math.abs(a1 - a0) > Math.PI ? 1 : 0} ${sweep} ${x1},${y1}`;
    };
    let s = '<defs>';
    let body = '';
    // Months, from Tishrei on.
    const order = [7, 8, 9, 10, 11, 12, ...(HDate.isLeapYear(year) ? [13] : []), 1, 2, 3, 4, 5, 6];
    let d0 = 0;
    order.forEach((m, i) => {
      const len = HDate.daysInMonth(m, year);   // the Hebrew year runs Tishrei to Elul, so it's one number
      const a0 = ang(d0), a1 = ang(d0 + len);
      const isNow = dayOfYear >= d0 && dayOfYear < d0 + len;
      const [p0, p1] = [pt(R1, a0), pt(R1, a1)], [q0, q1] = [pt(R0, a1), pt(R0, a0)];
      body += `<path d="M${p0} A${R1},${R1} 0 0 1 ${p1} L${q0} A${R0},${R0} 0 0 0 ${q1}Z"
        fill="${isNow ? 'var(--mark)' : i % 2 ? 'var(--wheel-a)' : 'var(--wheel-b)'}" stroke="var(--panel)" stroke-width="2"/>`;
      // The month's name follows the band; in the bottom half it's drawn the other way so it reads upright.
      const mid = (a0 + a1) / 2, bottom = Math.sin(mid) > 0.15;
      s += `<path id="m${i}" d="${bottom ? arc(RM - 5, a1, a0, 0) : arc(RM - 5, a0, a1, 1)}"/>`;
      const label = HDate.getMonthName(m, year).replace("Sh'vat", 'Shvat').replace('Iyyar', 'Iyar');
      body += `<text font-size="12.5" fill="var(--ink)" font-weight="${isNow ? 700 : 400}">
        <textPath href="#m${i}" startOffset="50%" text-anchor="middle">${label}</textPath></text>`;
      d0 += len;
    });
    s += '</defs>';
    // Holidays.
    for (const e of events) {
      const day = e.hd.abs() - rh.abs();
      if (day < 0 || day >= daysInYear) continue;
      const [x, y] = pt(R1 + 0.5, ang(day + 0.5));
      body += `<circle cx="${x}" cy="${y}" r="3.6" fill="${day < dayOfYear ? 'var(--sepia-3)' : 'var(--sepia)'}" stroke="var(--panel)" stroke-width="1.5"/>`;
    }
    // Today: a pointer just inside the ring, so it doesn't cover the month's name.
    const at = ang(dayOfYear + 0.5);
    const [tx, ty] = pt(R0 - 4, at), [bx, by] = pt(R0 - 26, at);
    const [lx, ly] = pt(R0 - 22, at - 0.07), [rx, ry] = pt(R0 - 22, at + 0.07);
    body += `<path d="M${tx},${ty} L${lx},${ly} L${rx},${ry} Z" fill="var(--sepia)"/>`;
    body += `<line x1="${tx}" y1="${ty}" x2="${bx}" y2="${by}" stroke="var(--sepia)" stroke-width="2.5" stroke-linecap="round"/>`;
    // The middle: the moon, today's Hebrew date (in Hebrew, then in English) and today's ordinary date.
    const f = ((hd.getDate() - 1) % 29.53) / 29.53;
    body += moon(C, C - 66, 15, f);
    body += `<text x="${C}" y="${C - 22}" text-anchor="middle" font-size="27" fill="var(--ink)" style="font-family:var(--hebrew)" font-weight="500" direction="rtl">${TW.stripVowels(hd.renderGematriya())}</text>`;
    body += `<text x="${C}" y="${C + 6}" text-anchor="middle" font-size="18" fill="var(--ink)" style="font-family:var(--serif)">${TW.showHebrewDate(hd)}</text>`;
    body += `<line x1="${C - 46}" y1="${C + 19}" x2="${C + 46}" y2="${C + 19}" stroke="var(--sepia-3)" stroke-width="1"/>`;
    body += `<text x="${C}" y="${C + 40}" text-anchor="middle" font-size="16" fill="var(--ink)" font-weight="600">${today.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</text>`;
    body += `<text x="${C}" y="${C + 59}" text-anchor="middle" font-size="13" fill="var(--ink)">${today.getFullYear()} &middot; day ${dayOfYear + 1} of ${daysInYear}</text>`;
    svg.innerHTML = s + body;
  }

  function moon(cx, cy, r, f) {
    const k = Math.cos(2 * Math.PI * f), rx = Math.abs(k) * r, waxing = f < 0.5;
    const lit = `M${cx},${cy - r} A${r},${r} 0 0 ${waxing ? 1 : 0} ${cx},${cy + r} A${rx},${r} 0 0 ${(k > 0) === waxing ? 0 : 1} ${cx},${cy - r}Z`;
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="var(--moon-dark)"/><path d="${lit}" fill="var(--moon-lit)" stroke="var(--moon-edge)" stroke-width="0.8"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--moon-edge)" stroke-width="1"/>`;
  }

  // The haftarah (the reading from the Prophets that goes with it), from Sefaria's calendar.
  const foot = document.getElementById('foot');
  try {
    const cal = await TW.calendar(w.readOn);
    const parsha = cal.calendar_items.find(i => i.title.en === 'Parashat Hashavua');
    const haftarah = cal.calendar_items.find(i => i.title.en === 'Haftarah');
    if (parsha && haftarah && parsha.displayValue.en.split('-')[0] === a.name) {
      foot.innerHTML = `<span>Haftarah, from the Prophets: <b>${haftarah.displayValue.en}</b></span><span class="he-sans">${haftarah.displayValue.he}</span>`;
    }
    if (!summary.textContent && parsha?.description?.en && parsha.displayValue.en.split('-')[0] === a.name) {
      summary.textContent = parsha.description.en;
      TW.fit(summary, 18);
    }
  } catch (e) { console.warn(e); }

  const fitAll = () => {
    TW.fit(summary, 18);
    document.querySelectorAll('.lesson .body').forEach(el => TW.fit(el, 15));
    document.querySelectorAll('.lesson .lhead').forEach(el => TW.fit(el, 22));
  };
  await TW.fontsReady();
  TW.keepFitted(fitAll);
})();
