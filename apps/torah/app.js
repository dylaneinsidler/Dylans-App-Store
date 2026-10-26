// Daily Torah on a phone. The page is the desktop app's two screens (desktop/week.js, desktop/today.js,
// desktop/wall.js) in the order they're read on a phone: this week's portion, today's section of it
// (the verse and Rashi), the Talmud on today's verse, and last where we are in the Torah and the year.
// This adds what only the phone has:
//   - the Talmud on today's verse: one Mishnah and one passage of the Gemara, each in the original, in
//     English, and in plain English (texts from Sefaria, kept on the phone like the rest);
//   - a "Read it on Sefaria" link under every text;
//   - the Light / Dark choice kept on this phone;
//   - a bar at the bottom to go a day back or forward, or back to today (or swipe left and right), the way the
//     desktop's ‹ › buttons do: the whole page then shows that day (desktop/wall.js, TW.goTo).
(function () {
  'use strict';
  const $ = id => document.getElementById(id);

  // ---- Light or dark: kept on this phone, and the page's address and colors in step with it ----
  const html = document.documentElement;
  const meta = document.querySelector('meta[name="theme-color"]');
  const apply = () => {
    const t = html.dataset.theme === 'dark' ? 'dark' : 'light';
    Phone.store.set('torah.theme', t);
    const q = new URLSearchParams(location.search);
    if (q.get('theme') !== t) { q.set('theme', t); history.replaceState(null, '', '?' + q + location.hash); }
    meta.content = getComputedStyle(document.body).backgroundColor;
  };
  new MutationObserver(apply).observe(html, { attributes: true, attributeFilter: ['data-theme'] });
  apply();

  // ---- A tap never closes the page ----
  // On the desktop a click on an empty part of the screen closes the app (wall.js); a phone page stays.
  window.DylanClose = window.DylanClose || { isControl: () => true };
  window.close = function () {};

  // Another day picked goes back to today by itself after 10 minutes of the phone left alone (or on coming
  // back to the app after that long). The desktop waits 3, and so does the iPad's Morning and Night cycler
  // (where this page sits in a frame), so each of its turns starts on today.
  TW.idleMinutes = document.documentElement.classList.contains('framed') ? 3 : 10;

  // ---- The day shown: the same section and verse as the desktop's Today screen (desktop/today.js). Worked out
  //      again for each day picked (draw(), at the end) ----
  let today, w, a, b, t, verses, verse, dayNum, near;
  function theDay() {
    today = TW.now();
    w = TW.week(today);
    [a, b] = w.parshiyot;
    t = TW.plan(w)[today.getDay()];
    verses = TW.versesIn(t.ref);
    verse = t.insight?.verse && verses.includes(t.insight.verse) ? t.insight.verse
      : verses.find(v => TALMUD_LINKS[v]) || verses[0];
    dayNum = Math.floor(TW.dayStart(today).getTime() / 864e5);   // which passage: a different one each day
    // The verses of the day's section, nearest the verse of the day first.
    const i0 = verses.indexOf(verse);
    near = verses.map((v, i) => [Math.abs(i - i0), v]).sort((x, y) => x[0] - y[0]).map(x => x[1]);
  }
  // "today's" or "Thursday's"
  const days = () => (TW.isToday() ? "today's" : TW.dayWord());

  // ---- Links to Sefaria: https://www.sefaria.org/Genesis.6.9?lang=bi (Hebrew and English side by side) ----
  const sefariaUrl = (ref, both = true) =>
    'https://www.sefaria.org/' + encodeURI(ref.trim().replace(/ /g, '_').replace(/:/g, '.')) + (both ? '?lang=bi' : '');
  const link = (href, text = 'Read it on Sefaria') =>
    `<a class="sefaria" href="${href}" target="_blank" rel="noopener">${text}<span class="arrow" aria-hidden="true">↗</span></a>`;
  // (marked day-links: the day's own, made again for each day)
  const linksAfter = (el, inner) => {
    const d = document.createElement('div');
    d.className = 'links day-links';
    d.innerHTML = inner;
    el.after(d);
    return d;
  };

  let drawn = 0;
  function drawLinks(live) {
    document.querySelectorAll('.day-links').forEach(el => el.remove());
    // The whole portion (and its haftarah, when the week screen shows it).
    const portionRef = b ? `${a.ref.split('-')[0]}-${TW.parseRef(b.ref).c2}:${TW.parseRef(b.ref).v2}` : a.ref;
    const portionLinks = linksAfter($('foot'), link(sefariaUrl(portionRef), `${b ? 'Both portions' : 'The whole portion'} on Sefaria`));
    const name = a.name;
    TW.calendar(w.readOn).then(cal => {
      if (!live()) return;
      const parsha = cal.calendar_items.find(i => i.title.en === 'Parashat Hashavua');
      const haftarah = cal.calendar_items.find(i => i.title.en === 'Haftarah');
      if (parsha && haftarah?.url && parsha.displayValue.en.split('-')[0] === name) {
        portionLinks.insertAdjacentHTML('beforeend', link(`https://www.sefaria.org/${encodeURI(haftarah.url)}?lang=bi`, 'The haftarah on Sefaria'));
      }
    }).catch(() => {});

    // The day's section, the verse of the day, and the commentary on it (Rashi, or Ramban or Sforno).
    linksAfter(document.querySelector('.reading-head .title'), link(sefariaUrl(t.ref), `${TW.dayWord()} section on Sefaria`));
    linksAfter($('verse-box'), link(sefariaUrl(verse)));
    commRow.querySelectorAll('a.sefaria').forEach(el => el.remove());
    addCommLink();
  }
  // (beside its "Full text" button, once today.js knows whose comment it is: each time its text arrives)
  const commRow = $('comm-more').parentElement;
  commRow.classList.add('links');
  const addCommLink = () => {
    if ($('comm').classList.contains('waiting')) return;
    const who = /^(Rashi|Ramban|Sforno) on /.exec($('comm-label').textContent);
    const href = who && sefariaUrl(`${who[1]} on ${verse}`);
    const old = commRow.querySelector('a.sefaria');
    if (old && old.getAttribute('href') === href) return;
    old?.remove();
    if (who) commRow.insertAdjacentHTML('beforeend', link(href));
  };
  new MutationObserver(addCommLink).observe($('comm'), { attributes: true, attributeFilter: ['class'] });

  // ---- The Talmud on today's verse ----
  const plain = s => s.replace(/<[^>]+>/g, '');
  // One paragraph per verse or comment (with the space some texts leave out after a sentence: "shave?For").
  const paras = (list, cls = '') => list.filter(Boolean)
    .map(s => `<p${cls ? ` class="${cls}"` : ''}>${s.replace(/([a-z\]’”][.?!;:])([A-Z“])/g, '$1 $2')}</p>`).join('');
  const showBody = id => $(id).classList.remove('waiting');
  const offline = (id, what) => {
    $(id).innerHTML = `<span class="offline">${what}</span>`;
    showBody(id);
  };

  // Which Mishnah passages Sefaria links to a text (a verse, a section, a page of the Gemara). Sefaria
  // sends every link (hundreds of thousands of letters), so only the Mishnah ones are kept on the phone,
  // the way wall.js keeps texts (cleared out after 30 days unused).
  async function mishnahLinks(ref) {
    const key = 'sefaria:mishnah-links:' + ref;
    try {
      const hit = localStorage.getItem(key);
      if (hit) {
        const entry = JSON.parse(hit);
        entry.t = Date.now();
        localStorage.setItem(key, JSON.stringify(entry));
        return entry.data;
      }
    } catch (e) { /* no copy: fetch it */ }
    const r = await fetch(`https://www.sefaria.org/api/links/${encodeURIComponent(ref.replace(/ /g, '_'))}?with_text=0`);
    if (!r.ok) throw new Error(`Sefaria ${r.status} for links of ${ref}`);
    const all = await r.json();
    const data = (Array.isArray(all) ? all : []).filter(l => l.category === 'Mishnah' && /\d+:\d+/.test(l.ref || ''))
      .map(l => ({ ref: l.ref.replace(/^(.* \d+:\d+)[-–].*$/, '$1'), anchor: l.anchorRef || '', type: l.type || '' }));
    try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), data })); } catch (e) { /* full: skip */ }
    return data;
  }
  const uniq = list => [...new Set(list)];
  // A link about one verse or a few (not a long stretch, which is about reading customs), and its verses.
  const versesOf = anchor => {
    try { const vs = TW.versesIn(anchor); return vs.length <= 3 ? vs : []; } catch (e) { return []; }
  };
  // Where a passage of the Gemara is, as a number to compare: "Sanhedrin 107b:18" -> page 107, side b, line 18.
  const place = ref => {
    const m = /(\d+)([ab])(?::(\d+))?/.exec(ref.split('-')[0]);
    return m ? (+m[1] * 2 + (m[2] === 'b' ? 1 : 0)) * 1000 + (+m[3] || 0) : 0;
  };
  const previousSide = page => {
    const m = /^(.*) (\d+)([ab])$/.exec(page);
    if (!m) return null;
    return m[3] === 'b' ? `${m[1]} ${m[2]}a` : +m[2] > 2 ? `${m[1]} ${+m[2] - 1}b` : null;
  };

  // The Gemara: the same passage the desktop's Today screen shows (talmud.js: the passages Sefaria links
  // to the verse of the day, or the nearest verse in the day's section that the Talmud discusses).
  let gVerse, gRef;
  const onVerse = v => `${TW.showRef(v)}${v === verse ? ', the verse of the day' : `, in ${days()} section`}`;

  // The Mishnah: one Sefaria links to the verse of the day; or else the Mishnah that the day's Gemara
  // passage belongs to (the Gemara is the discussion of the Mishnah before it); or else one linked to
  // the nearest verse of today's section; or else a saying from Pirkei Avot, the Ethics of the Fathers.
  async function findMishnah() {
    const atVerse = uniq((await mishnahLinks(verse).catch(() => [])).filter(l => versesOf(l.anchor).includes(verse)).map(l => l.ref));
    if (atVerse.length) return { ref: atVerse[dayNum % atVerse.length], why: `Discussing ${onVerse(verse)}` };

    if (gRef) {
      let page = gRef.replace(/:.*$/, '');
      const at = place(gRef);
      for (let k = 0; k < 6 && page; k++, page = previousSide(page)) {
        const here = (await mishnahLinks(page).catch(() => [])).filter(l => l.type === 'mishnah in talmud' && (k > 0 || place(l.anchor) <= at));
        if (here.length) {
          const last = here.reduce((x, y) => place(y.anchor) > place(x.anchor) ? y : x);
          return { ref: last.ref, why: 'The Gemara passage below comes from the rabbis’ discussion of this Mishnah' };
        }
      }
    }

    const inSection = (await mishnahLinks(t.ref).catch(() => [])).filter(l => versesOf(l.anchor).length);
    for (const v of near) {
      const here = uniq(inSection.filter(l => versesOf(l.anchor).includes(v)).map(l => l.ref));
      if (here.length) return { ref: here[dayNum % here.length], why: `Discussing ${onVerse(v)}` };
    }
    return { ref: `Pirkei Avot 1:${dayNum % 18 + 1}`, why: `The Mishnah doesn’t discuss ${days()} section, so here is a saying from Pirkei Avot, the Ethics of the Fathers` };
  }

  // Each part of a source is shown whole if it's short; a long one shows its start and "Show all".
  function shorten(el, lines) {
    const lh = parseFloat(getComputedStyle(el).lineHeight) || 26;
    if (el.scrollHeight <= lh * (lines + 2)) return;
    const closed = `${Math.round(lh * lines)}px`;
    el.classList.add('clamped');
    el.style.maxHeight = closed;
    const btn = document.createElement('button');
    btn.className = 'show-all';
    btn.type = 'button';
    btn.textContent = 'Show all';
    btn.addEventListener('click', () => {
      const open = el.classList.toggle('open');
      el.style.maxHeight = open ? 'none' : closed;
      btn.textContent = open ? 'Show less' : 'Show all';
    });
    el.after(btn);
  }
  const shortenAll = async (ids, lines, live = () => true) => {
    await TW.fontsReady();
    if (live()) ids.forEach((id, i) => shorten($(id), lines[i]));
  };

  // The Mishnah, in Hebrew, in Dr. Joshua Kulp's English (Mishnah Yomit), and in plain English: Kulp's
  // "English Explanation of Mishnah". Each part of his explanation starts with the words it explains in
  // bold (his English, shown above), so only the explanation after them is shown here.
  const drawMishnah = live => (async () => {
    const m = await findMishnah();
    if (!live()) return;
    const name = m.ref.replace(/^Mishnah /, '');
    $('mishnah-label').textContent = `Mishnah · ${name}`;
    $('mishnah-why').textContent = m.why;
    const text = await TW.text(m.ref, 'english|Mishnah Yomit by Dr. Joshua Kulp');
    if (!live()) return;
    $('mishnah-he-ref').textContent = text.heRef || '';
    $('mishnah-he').innerHTML = paras(text.he);
    $('mishnah-en').innerHTML = paras(text.en.map(s => s.replace(/<\/?b>/g, '')));
    const ex = await TW.text(`English Explanation of ${m.ref}`).catch(() => null);
    if (!live()) return;
    const explained = (ex?.en || [])
      .map(s => s.replace(/^\s*(?:<b>[\s\S]*?<\/b>[\s.,;:()[\]]*)+/, '').trim())
      .filter(s => plain(s).trim());
    $('mishnah-plain').innerHTML = explained.length ? paras(explained)
      : '<p class="offline">Sefaria has no plain-English explanation of this one yet.</p>';
    const by = [text.enVersion && `English: ${text.enVersion}`, explained.length && ex.enVersion && ex.enVersion !== text.enVersion && `explanation: ${ex.enVersion}`].filter(Boolean);
    $('mishnah-credit').textContent = text.enVersion && ex?.enVersion === text.enVersion ? `English and explanation: ${text.enVersion}` : by.join('; ');
    $('mishnah-links').innerHTML = link(sefariaUrl(m.ref)) + (explained.length ? link(sefariaUrl(`English Explanation of ${m.ref}`, false), 'The explanation on Sefaria') : '');
    showBody('mishnah-body');
    await shortenAll(['mishnah-he', 'mishnah-en', 'mishnah-plain'], [6, 8, 12], live);
  })().catch(e => { console.warn(e); if (live()) offline('mishnah-body', 'The Mishnah will appear when the internet is back.'); });

  // The Gemara, in Aramaic and Hebrew, and in the William Davidson Talmud's English (Koren, with Rabbi Adin
  // Steinsaltz), whose bold words are the word-for-word translation and the rest explains them: the bold
  // words alone are "word for word", and all of it, read straight through, is "in plain English".
  const WDE = 'William Davidson Edition - English';
  const drawGemara = live => (async () => {
    if (!gRef) {
      $('gemara-label').textContent = 'Gemara';
      offline('gemara-body', `The Talmud doesn’t quote ${days()} section.`);
      return;
    }
    const get = async r => {
      const p = await TW.text(r);   // Sefaria's usual English for the Talmud is this one; ask for it by name if not
      return p.enVersion === WDE ? p : TW.text(r, `english|${WDE}`);
    };
    const g = gRef, gv = gVerse;
    let ref = g, p = await get(g);
    // A short passage reads better with the line after it (as on the desktop).
    const m = /^(.*):(\d+)$/.exec(g);
    if (m && plain(p.en.join(' ')).length < 300) {
      const longer = await get(`${m[1]}:${m[2]}-${+m[2] + 1}`).catch(() => null);
      if (longer?.en?.length > 1) { p = longer; ref = `${m[1]}:${m[2]}-${+m[2] + 1}`; }
    }
    if (!live()) return;
    const page = ref.replace(/:.*$/, '');
    $('gemara-label').textContent = `Gemara · ${page}`;
    $('gemara-he-ref').textContent = (p.heRef || '').replace(/:.*$/, '');
    $('gemara-why').textContent = `Discussing ${onVerse(gv)}`;
    $('gemara-he').innerHTML = paras(p.he);
    const tidy = s => s.replace(/^§\s*/, '').replace(/\s+([,.;:?!’”)\]])/g, '$1').replace(/([(\[“‘])\s+/g, '$1').replace(/\s+/g, ' ').trim();
    // The bold words, read as a sentence: each quotation closed where its bold words end (the rest of
    // the verse is in the explanation), a capital to start, and a full stop.
    const count = (s, c) => s.split(c).length - 1;
    const quoted = s => count(s, '“') > count(s, '”') ? s + '”' : count(s, '”') > count(s, '“') ? '“' + s : s;
    const sentence = s => {
      if (!plain(s).trim()) return '';
      s = s.replace(/^((?:<[^>]+>|[\s“‘"(\[])*)([a-z])/, (x, pre, c) => pre + c.toUpperCase()).replace(/[\s,;:]+$/, '');
      return /[.?!][’”)\]]*$/.test(plain(s)) ? s : s + '.';
    };
    const literal = p.en.map(s => sentence(tidy([...s.matchAll(/<b>([\s\S]*?)<\/b>/g)].map(x => quoted(x[1].trim())).join(' '))));
    const isWDE = p.enVersion === WDE && literal.some(Boolean);
    $('gemara-en').innerHTML = isWDE ? paras(literal) : paras(p.en.map(tidy));
    $('gemara-plain').innerHTML = isWDE ? paras(p.en.map(s => tidy(s.replace(/<\/?b>/g, ''))))
      : '<p class="offline">The plain-English explanation isn’t on Sefaria for this passage.</p>';
    $('gemara-credit').textContent = isWDE ? 'English: The William Davidson Talmud (Koren, with Rabbi Adin Steinsaltz)' : (p.enVersion ? `English: ${p.enVersion}` : '');
    $('gemara-links').innerHTML = link(sefariaUrl(ref));
    showBody('gemara-body');
    await shortenAll(['gemara-he', 'gemara-en', 'gemara-plain'], [6, 8, 12], live);
  })().catch(e => { console.warn(e); if (live()) offline('gemara-body', 'The Gemara will appear when the internet is back.'); });

  // ---- Drawing a day: today when it opens, then each day picked (TW.onDay, after the desktop screens) ----
  const blank = { mishnah: $('mishnah-body').innerHTML, gemara: $('gemara-body').innerHTML };
  const ttLabel = document.querySelector('.tt-head .label');
  function draw() {
    const me = ++drawn, live = () => me === drawn;
    theDay();
    gVerse = near.find(v => TALMUD_LINKS[v]?.length);
    gRef = gVerse ? TALMUD_LINKS[gVerse][dayNum % TALMUD_LINKS[gVerse].length] : null;
    ttLabel.innerHTML = `The Talmud on ${days()} verse <span class="he-sans">תלמוד</span>`;
    for (const k of ['mishnah', 'gemara']) {
      $(`${k}-body`).innerHTML = blank[k];
      $(`${k}-body`).classList.add('waiting');
      $(`${k}-label`).textContent = k === 'mishnah' ? 'Mishnah' : 'Gemara';
      $(`${k}-he-ref`).textContent = $(`${k}-why`).textContent = $(`${k}-links`).innerHTML = '';
    }
    drawLinks(live);
    drawMishnah(live);
    drawGemara(live);
    bar();
  }

  // ---- The bar at the bottom: ‹ the day before, the day shown, Today, › the day after ----
  // Its buttons are the desktop's (data-step and nav-today: desktop/wall.js does the rest).
  const ARROW = d => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;
  const dayBar = document.createElement('nav');
  dayBar.className = 'day-bar';
  dayBar.setAttribute('aria-label', 'Go to another day');
  dayBar.innerHTML = `<button type="button" class="db-step" data-step="-1" aria-label="The day before">${ARROW('M14.5 5.5L8 12l6.5 6.5')}</button>
    <div class="db-day"><b class="db-date"></b><span class="db-ago"></span></div>
    <button type="button" class="nav-today">Today</button>
    <button type="button" class="db-step" data-step="1" aria-label="The day after">${ARROW('M9.5 5.5L16 12l-6.5 6.5')}</button>`;
  document.body.append(dayBar);
  function bar() {
    dayBar.classList.toggle('away', !TW.isToday());
    dayBar.querySelector('.db-date').textContent = today.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    dayBar.querySelector('.db-ago').textContent = TW.agoText();
  }

  // Swipe left for the next day, right for the day before (not from the very edges, where the phone has
  // its own swipes, and not over the full text).
  let swipe = null;
  document.addEventListener('touchstart', e => {
    const p = e.touches[0];
    swipe = e.touches.length === 1 && !document.querySelector('.details') && p.clientX > 24 && p.clientX < innerWidth - 24
      ? { x: p.clientX, y: p.clientY, at: Date.now() } : null;
  }, { passive: true });
  document.addEventListener('touchend', e => {
    if (!swipe) return;
    const p = e.changedTouches[0], dx = p.clientX - swipe.x, dy = p.clientY - swipe.y, quick = Date.now() - swipe.at < 700;
    swipe = null;
    if (quick && Math.abs(dx) > 70 && Math.abs(dy) < Math.abs(dx) * 0.5) TW.step(dx < 0 ? 1 : -1);
  }, { passive: true });

  // A new day keeps your place: whichever part of the page you're in (the portion, the day, or the year)
  // stays where it was on the screen, even when the week's portion above it is longer or shorter.
  // (Where you are is noted each time you scroll, since the screens above have already changed by the time
  // this hears about the new day.) The day's texts come in from Sefaria over the next few seconds and change
  // the heights above too, so the place is held while they do: until you touch or scroll, or for 10 seconds.
  // (Safari doesn't do this by itself the way Chrome does.)
  const parts = ['week-screen', 'today-screen', 'where-screen'].map($).filter(Boolean);
  const where = () => {
    const top = parts.filter(el => el.getBoundingClientRect().top <= 1).pop();
    return top ? { el: top, y: top.getBoundingClientRect().top } : null;
  };
  let spot = null, hold = null, heldAt = 0;
  addEventListener('scroll', () => {
    if (hold && Math.abs(scrollY - heldAt) > 2) hold = null;   // scrolled by you (or a tap on the phone's top edge)
    if (!hold) spot = where();
  }, { passive: true });
  const fix = () => {
    const dy = hold.el.getBoundingClientRect().top - hold.y;
    if (Math.abs(dy) > 1) scrollBy(0, dy);
    heldAt = scrollY;
  };
  // (Put right once more before letting go: a tap can come before the last change has been put right.)
  const letGo = () => { if (hold) { fix(); hold = null; spot = where(); } };
  ['touchstart', 'pointerdown', 'wheel', 'keydown'].forEach(ev => addEventListener(ev, letGo, { passive: true, capture: true }));
  const keep = () => {
    if (!hold) return;
    if (Date.now() > hold.until) letGo(); else fix();
  };
  if (window.ResizeObserver) new ResizeObserver(keep).observe(document.querySelector('main') || document.body);
  TW.onDay(() => {
    const k = hold || spot;
    draw();
    if (k) { hold = { el: k.el, y: k.y, until: Date.now() + 10e3 }; keep(); }
  });
  draw();
})();
