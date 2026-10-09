// Dylan's Daily Torah: what both screens share. The calendar (this week's portion, today's section of it, the
// Hebrew date, Shabbat times), texts from Sefaria and tidying them for the screen, shrinking text to
// fit, the header, click-to-close, and reloading when the day changes.
(function () {
  const cfg = window.TORAH_WALL;
  const TORAH = window.TORAH;
  const { HDate, Location, Zmanim, getSedra, months, gematriya } = hebcal;

  // For trying out other days: week.html?date=2026-12-05 (and &time=21:00) shows that day.
  const params = new URLSearchParams(location.search);

  // Light (the usual sepia) or dark: ?theme= on the address (Dylan's Morning and Night Screens use it), else
  // the last choice made with the switch in the header (theme.js, saved by launch.ps1), else config.js.
  const askedTheme = params.get('theme');
  let theme = (askedTheme || window.TORAH_THEME || cfg.theme) === 'dark' ? 'dark' : 'light';
  const baseTitle = document.title;
  // The window title carries the choice, e.g. "Today (dark)": launch.ps1 reads it and tells the other screen.
  function setTheme(t) {
    theme = t;
    document.documentElement.dataset.theme = t;
    document.title = `${baseTitle} (${t})`;
    document.querySelectorAll('.theme-switch span').forEach(s => s.classList.toggle('on', s.dataset.pick === t));
  }
  setTheme(theme);
  // The other screen's switch reaches this one through theme.js, checked every second (not when the address
  // sets the theme).
  if (!askedTheme) {
    let saved = window.TORAH_THEME;
    setInterval(() => {
      const s = document.createElement('script');
      s.src = `theme.js?${Date.now()}`;
      s.onload = () => {
        s.remove();
        const t = window.TORAH_THEME;
        if (t && t !== saved) { saved = t; if (t !== theme) setTheme(t); }
      };
      s.onerror = () => s.remove();
      document.head.append(s);
    }, 1000);
  }

  function now() {
    const d = new Date();
    if (!params.get('date')) return d;
    const [y, m, day] = params.get('date').split('-').map(Number);
    const [h, min] = (params.get('time') || `${d.getHours()}:${d.getMinutes()}`).split(':').map(Number);
    return new Date(y, m - 1, day, h, min);
  }
  const dayStart = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  const place = new Location(cfg.lat, cfg.lon, cfg.israel, cfg.timeZone, cfg.place);

  // ---- References like "Genesis 2:4-2:19" ----

  function parseRef(ref) {
    const m = /^(.+?) (\d+):(\d+)(?:\s*[-–]\s*(?:(\d+):)?(\d+))?$/.exec(ref.trim());
    if (!m) return null;
    const c1 = +m[2], v1 = +m[3];
    return { book: m[1], c1, v1, c2: m[4] ? +m[4] : c1, v2: m[5] ? +m[5] : v1 };
  }
  const bookOf = name => TORAH.books.find(b => b.name === name);
  // How many verses come before this one in the whole Torah.
  function verseIndex(book, c, v) {
    let n = 0;
    for (const b of TORAH.books) {
      if (b.name === book) {
        for (let i = 0; i < c - 1; i++) n += b.chapters[i];
        return n + v - 1;
      }
      n += b.chapters.reduce((a, x) => a + x, 0);
    }
  }
  const totalVerses = TORAH.books.reduce((a, b) => a + b.chapters.reduce((x, y) => x + y, 0), 0);
  function verseCount(ref) {
    const r = parseRef(ref);
    return verseIndex(r.book, r.c2, r.v2) - verseIndex(r.book, r.c1, r.v1) + 1;
  }
  // "Genesis 2:4–19", "Genesis 1:1–6:8"
  function showRef(ref, withBook = true) {
    const r = parseRef(ref);
    if (!r) return ref;
    let s = `${r.c1}:${r.v1}`;
    if (r.c2 !== r.c1) s += `–${r.c2}:${r.v2}`;
    else if (r.v2 !== r.v1) s += `–${r.v2}`;
    return withBook ? `${r.book} ${s}` : s;
  }
  // "בראשית ב׳:ד׳–י״ט"
  function showRefHe(ref) {
    const r = parseRef(ref);
    if (!r) return '';
    const g = n => gematriya(n);
    let s = `${g(r.c1)}:${g(r.v1)}`;
    if (r.c2 !== r.c1) s += `–${g(r.c2)}:${g(r.v2)}`;
    else if (r.v2 !== r.v1) s += `–${g(r.v2)}`;
    return `${bookOf(r.book).he} ${s}`;
  }
  // Every single verse in a range, as "Genesis 2:4", "Genesis 2:5", ...
  function versesIn(ref) {
    const r = parseRef(ref), out = [], b = bookOf(r.book);
    for (let c = r.c1, v = r.v1; c < r.c2 || (c === r.c2 && v <= r.v2);) {
      out.push(`${r.book} ${c}:${v}`);
      if (++v > b.chapters[c - 1]) { c++; v = 1; }
    }
    return out;
  }

  // ---- This week's portion and today's section ----

  // This week's portion is the one read this coming Shabbat (today, on Shabbat). When a holiday has its
  // own reading that Shabbat, it's the next regular one, and the holiday is noted. From the day after
  // Yom Kippur through Simchat Torah it's the last portion, V'Zot HaBerachah, read on Simchat Torah.
  function week(date = now()) {
    const today = new HDate(date);
    const simchatTorah = cfg.israel ? 22 : 23;
    if (today.getMonth() === months.TISHREI && today.getDate() > 10 && today.getDate() <= simchatTorah) {
      return {
        parshiyot: [TORAH.parshiyot[53]],
        readOn: new HDate(simchatTorah, months.TISHREI, today.getFullYear()).greg(),
        readOnName: 'Simchat Torah',
      };
    }
    let sat = addDays(dayStart(date), 6 - date.getDay());
    let holiday = null;
    for (let i = 0; i < 8; i++) {
      const hd = new HDate(sat);
      const r = getSedra(hd.getFullYear(), cfg.israel).lookup(hd);
      if (!r.chag) {
        return { parshiyot: [].concat(r.num).map(n => TORAH.parshiyot[n - 1]), readOn: sat, readOnName: 'Shabbat', holiday };
      }
      holiday = holiday || { name: r.parsha.join(' '), date: sat };
      sat = addDays(sat, 7);
    }
  }

  const ALIYOT = ['Rishon', 'Sheni', 'Shlishi', "Revi'i", 'Chamishi', 'Shishi', "Shvi'i"];
  const ALIYOT_HE = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שביעי'];
  const ORDINALS = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh'];
  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Shabbat'];

  // The week's study plan: each day has its own section (aliyah), Sunday the first through Shabbat the
  // seventh. In a week with two portions, the first one runs Sunday to Wednesday (sections 1, 3, 5, 7)
  // and the second Thursday to Shabbat (sections 1, 4, 7).
  function plan(w) {
    const [a, b] = w.parshiyot;
    const steps = b ? [[a, 0], [a, 2], [a, 4], [a, 6], [b, 0], [b, 3], [b, 6]] : ALIYOT.map((_, i) => [a, i]);
    return steps.map(([p, i], day) => ({
      day, dayName: DAYS[day], parsha: p, aliyah: i,
      name: ALIYOT[i], he: ALIYOT_HE[i], ordinal: ORDINALS[i],
      ref: p.aliyot[i].replace(/–/g, '-'),
      insight: lessons(p)?.days?.[i] || null,
    }));
  }
  const lessons = p => (window.TORAH_LESSONS || {})[p.name] || null;

  // ---- Dates ----

  const stripVowels = s => s.replace(/[֑-ׇ]/g, '');
  function hebrewDate(date = now()) {
    const hd = new HDate(date);
    const sunset = new Zmanim(place, date, false).sunset();
    const tonight = date >= sunset ? hd.next() : null;
    return {
      hd, sunset, tonight,
      en: showHebrewDate(hd),                             // "24 Tishrei 5787"
      he: stripVowels(hd.renderGematriya()),              // "כ״ד תשרי תשפ״ז"
    };
  }
  const showHebrewDate = (hd, year = true) => `${hd.getDate()} ${hd.getMonthName()}${year ? ' ' + hd.getFullYear() : ''}`;

  const shortDate = d => d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  // ---- Texts from Sefaria ----

  // Answers are kept (in this window's own browser profile) so a text shows at once next time, and
  // still shows if the internet is down. Entries not used for 30 days are cleared out.
  const CACHE = 'sefaria:';
  function pruneCache() {
    try {
      const old = Date.now() - 30 * 864e5;
      for (const k of Object.keys(localStorage)) {
        if (k.startsWith(CACHE) && (JSON.parse(localStorage.getItem(k)).t || 0) < old) localStorage.removeItem(k);
      }
    } catch { /* storage unavailable: nothing to prune */ }
  }
  async function sefaria(path, { keep = true } = {}) {
    const key = CACHE + path;
    try {
      const hit = keep && localStorage.getItem(key);
      if (hit) {
        const entry = JSON.parse(hit);
        entry.t = Date.now();
        localStorage.setItem(key, JSON.stringify(entry));
        return entry.data;
      }
    } catch { /* no cache: fetch it */ }
    const r = await fetch('https://www.sefaria.org' + path);
    if (!r.ok) throw new Error(`Sefaria ${r.status} for ${path}`);
    const data = await r.json();
    try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), data })); } catch { /* full: skip */ }
    return data;
  }

  const flat = t => Array.isArray(t) ? t.flatMap(flat) : (t ? [t] : []);
  // Hebrew with its vowels but without the cantillation marks, the paseq line, or markup.
  function cleanHe(s) {
    return s
      .replace(/&thinsp;|&nbsp;/g, ' ')
      .replace(/<[^>]+>/g, '')
      .replace(/\{[פס]\}/g, '')
      .replace(/[֑-ֽ֯]/g, '')
      .replace(/׀/g, '')
      .replace(/\s+/g, ' ').trim();
  }
  // English keeping only bold and italics.
  function cleanEn(s) {
    return s
      .replace(/<sup[^>]*>.*?<\/sup>\s*<i class="footnote">.*?<\/i>/g, '')
      .replace(/<br\s*\/?>/g, ' ')
      .replace(/<(?!\/?(b|i|em|strong)>)[^>]+>/g, '')
      .replace(/&nbsp;|&thinsp;/g, ' ')
      .replace(/\s+/g, ' ').trim();
  }

  // A text in Hebrew and English: { ref, heRef, he: [...], en: [...] }, one entry per verse or comment.
  async function text(ref, english = 'english') {
    const path = r => `/api/v3/texts/${encodeURIComponent(r.replace(/ /g, '_'))}?version=hebrew&version=${encodeURIComponent(english)}&return_format=strip_only_footnotes`;
    let data = await sefaria(path(ref));
    let en = data.versions.find(v => v.language === 'en');
    if (!en && english !== 'english') {   // that translation isn't there; take Sefaria's usual one
      data = await sefaria(`/api/v3/texts/${encodeURIComponent(ref.replace(/ /g, '_'))}?version=hebrew&version=english&return_format=strip_only_footnotes`);
      en = data.versions.find(v => v.language === 'en');
    }
    const he = data.versions.find(v => v.language === 'he');
    return {
      ref: data.ref, heRef: data.heRef,
      he: flat(he?.text).map(cleanHe),
      en: flat(en?.text).map(cleanEn),
      enVersion: en?.versionTitle || '',
    };
  }
  const torahText = ref => text(ref, `english|${cfg.translation}`);

  // Sefaria's daily learning schedules (Daf Yomi and so on) for a date.
  function calendar(date = now()) {
    return sefaria(`/api/calendars?diaspora=${cfg.israel ? 0 : 1}&year=${date.getFullYear()}&month=${date.getMonth() + 1}&day=${date.getDate()}`);
  }

  // ---- On screen ----

  // Shrink an element's text until it fits its box (starting again from its full size each time).
  function fit(el, min = 12) {
    el.style.fontSize = '';
    let size = parseFloat(getComputedStyle(el).fontSize);
    while ((el.scrollHeight > el.clientHeight + 1) && size > min) {
      size -= 0.5;
      el.style.fontSize = size + 'px';
    }
  }
  // Run a page's fitting now, again in a few seconds, and whenever the window changes size (it opens
  // small and then goes full screen).
  function keepFitted(fitAll) {
    let timer;
    fitAll();
    setTimeout(fitAll, 3000);
    window.addEventListener('resize', () => { clearTimeout(timer); timer = setTimeout(fitAll, 150); });
  }
  // The fonts load when first used, and text measured before then comes out the wrong size. So load
  // them all up front.
  function fontsReady() {
    return Promise.all([
      '400 22px "EB Garamond"', 'italic 400 22px "EB Garamond"', '500 22px "EB Garamond"',
      '400 22px "Frank Ruhl Libre"', '500 22px "Frank Ruhl Libre"',
      '400 16px "Roboto"', '500 16px "Roboto"', '400 16px "Heebo"',
    ].map(f => document.fonts.load(f, 'Abc אבג'))).catch(() => {}).then(() => document.fonts.ready);
  }

  const SCROLL = `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <rect x="5" y="9" width="7" height="22" rx="3.5"/><rect x="28" y="9" width="7" height="22" rx="3.5"/>
    <path d="M8.5 4.5v4.5M8.5 31v4.5M31.5 4.5v4.5M31.5 31v4.5M12 12h16M12 28h16"/>
    <path d="M16 17h8M16 21h8M16 25h5" stroke-width="1.7"/></svg>`;
  function header(screenName) {
    const d = now(), h = hebrewDate(d);
    const tonight = h.tonight ? `<span class="sep">·</span><span>From sunset: ${showHebrewDate(h.tonight, false)}</span>` : '';
    return `<header class="bar">
      <div class="wordmark">${SCROLL}<span class="name">${cfg.appName}</span><span class="screen">${screenName}</span></div>
      <div class="date"><span>${d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
        <span class="sep">·</span><span>${h.en}</span>${tonight}<span class="he">${h.he}</span>
        <span class="theme-switch"><span data-pick="light"${theme === 'light' ? ' class="on"' : ''}>Light</span><span data-pick="dark"${theme === 'dark' ? ' class="on"' : ''}>Dark</span></span>
        <span class="close-x" title="Close">✕</span></div>
    </header>`;
  }

  // ---- Details: the full text of a section, in a window over the screen ----
  // details(title, html) opens it. Clicking anywhere (or Esc) closes it; it also closes itself after 3 minutes.
  let detailsTimer = null;
  const detailsBox = () => document.querySelector('.details');
  function closeDetails() { detailsBox()?.remove(); clearTimeout(detailsTimer); }
  function details(title, html) {
    closeDetails();
    const el = document.createElement('div');
    el.className = 'details';
    el.innerHTML = `<div class="details-card"><div class="details-head"><div class="label">${title}</div><span class="details-x">Close ✕</span></div>
      <div class="details-body">${html}</div></div>`;
    document.body.append(el);
    detailsTimer = setTimeout(closeDetails, 180e3);
  }

  // Click anywhere (or Esc) closes this window; the launcher then closes the other screen too. Except: the
  // Light / Dark switch, a "Full text" button, and an open details window, which do their own thing.
  document.addEventListener('click', e => {
    const pick = e.target.closest('.theme-switch span');
    if (pick) { setTheme(pick.dataset.pick); return; }
    const more = e.target.closest('[data-details]');
    if (more) { more.dispatchEvent(new CustomEvent('details', { bubbles: true })); return; }
    if (detailsBox()) { closeDetails(); return; }
    window.close();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { if (detailsBox()) closeDetails(); else window.close(); }
  });

  // Reload when the day changes, and at sunset, when the Hebrew date does.
  if (!params.get('date')) {
    const key = () => { const d = new Date(); return d.toDateString() + (hebrewDate(d).tonight ? '+' : ''); };
    const at = key();
    setInterval(() => { if (key() !== at) location.reload(); }, 60e3);
  }
  pruneCache();

  window.TW = {
    cfg, TORAH, now, addDays, dayStart, parseRef, showRef, showRefHe, versesIn, verseIndex, verseCount, totalVerses,
    week, plan, lessons, hebrewDate, showHebrewDate, shortDate,
    sefaria, text, torahText, calendar, cleanHe, cleanEn, fit, keepFitted, fontsReady, header, stripVowels, DAYS, details,
  };
})();
