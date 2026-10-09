// Lifted from Daily Torah's today.html by build.mjs; edit it there.
(async function () {
  const today = TW.now();
  document.getElementById('header').outerHTML = TW.header('Today');
  const $ = id => document.getElementById(id);

  // ---- Which section is today's ----
  const w = TW.week(today);
  const plan = TW.plan(w);
  const todayIdx = today.getDay();
  const t = plan[todayIdx];
  const verses = TW.versesIn(t.ref);
  const verse = t.insight?.verse && verses.includes(t.insight.verse) ? t.insight.verse
    : verses.find(v => TALMUD_LINKS[v]) || verses[0];

  // ---- The insight ----
  $('insight-label').textContent = `Today's insight · ${t.parsha.name}, day ${todayIdx + 1} of 7`;
  if (t.insight) {
    $('headline').textContent = t.insight.headline;
    $('thought').innerHTML = t.insight.text;
    $('try-text').innerHTML = t.insight.try;
  } else {
    $('headline').textContent = `${t.parsha.name}, the ${t.ordinal} section`;
    $('thought').textContent = TW.lessons(t.parsha)?.summary || '';
    $('try').style.display = 'none';
  }
  $('days').innerHTML = plan.map((d, i) => `
    <div class="day ${i === todayIdx ? 'now' : i < todayIdx ? 'past' : ''}">
      <span class="dn">${d.dayName}</span><span class="an">${d.name}<span class="he-sans">${d.he}</span></span><span>${w.parshiyot.length > 1 ? d.parsha.name + ' ' : ''}${TW.showRef(d.ref, w.parshiyot.length === 1 ? true : false)}</span><span class="he-sans rh">${TW.showRefHe(d.ref)}</span>
    </div>`).join('');

  // ---- Today's reading ----
  $('reading-label').textContent = `Today's reading · ${t.name}, the ${t.ordinal} of seven sections of ${t.parsha.name}`;
  $('reading-ref').textContent = TW.showRef(t.ref);
  $('reading-he').textContent = TW.showRefHe(t.ref);
  $('verse-label').textContent = `Verse of the day · ${TW.showRef(verse)}`;
  $('verse-he-ref').textContent = TW.showRefHe(verse);

  const show = id => $(id).classList.remove('waiting');
  // The start of a text, up to about n letters: to the end of a sentence if there's one past halfway,
  // otherwise to a word, then "…". (Markup like bold is dropped; the full text keeps it.)
  const brief = (s, n) => {
    s = s.replace(/<[^>]+>/g, '');
    if (s.length <= n) return s;
    const part = s.slice(0, n);
    const end = Math.max(...['. ', '; ', ': ', '? ', '! ', '.” ', '." '].map(p => part.lastIndexOf(p)));
    return end > n / 2 ? part.slice(0, end + 1) + ' …' : part.slice(0, part.lastIndexOf(' ')) + ' …';
  };
  const offline = (id, what) => { $(id).innerHTML = `<span class="offline">${what} will appear when the internet is back.</span>`; show(id); };

  const jobs = [];

  // The verse, in Hebrew and English.
  jobs.push(TW.torahText(verse).then(v => {
    $('verse-he').textContent = v.he.join(' ');
    $('verse-en').innerHTML = v.en.join(' ');
    show('verse-box');
  }).catch(e => { console.warn(e); offline('verse-box', 'The verse'); }));

  // Rashi on that verse (or, where Rashi says nothing about it, another classic commentator).
  const COMMENTATORS = [
    ['Rashi', 'רש״י', 'Rabbi Shlomo Yitzchaki · France, 1040–1105'],
    ['Ramban', 'רמב״ן', 'Rabbi Moshe ben Nachman · Spain, 1194–1270'],
    ['Sforno', 'ספורנו', 'Rabbi Ovadia Sforno · Italy, 1475–1550'],
  ];
  jobs.push((async () => {
    for (const [who, he, about] of COMMENTATORS) {
      const c = await TW.text(`${who} on ${verse}`).catch(() => null);
      const en = (c?.en || []).filter(Boolean);
      if (!en.length) continue;
      $('comm-label').innerHTML = `${who} on ${TW.showRef(verse, false)} <span class="he-sans">${he}</span>`;
      $('comm-about').textContent = about;
      // Rashi's English (Rosenbaum & Silbermann) opens with the Hebrew words he's explaining, then the
      // same words in capitals. Drop the Hebrew and set the capitals apart.
      const tidy = s => {
        s = s.replace(/^[֐-׿\s"'״׳.,:;־()\-]+(?=[A-Z])/, '');
        const words = s.split(' ');
        let n = 0;
        while (n < words.length && !/[a-z]/.test(words[n])) n++;
        return n ? `<span class="lemma">${words.slice(0, n).join(' ')}</span> ${words.slice(n).join(' ')}` : s;
      };
      // On screen, brief: the start of the first comment, in English and the original Hebrew. "Full text"
      // opens every comment on the verse, each in English and Hebrew.
      const heList = (c.he || []).filter(Boolean);
      $('comm').innerHTML = tidy(brief(en[0], 260)) + (heList[0] ? `<div class="he">${brief(heList[0], 110)}</div>` : '');
      show('comm');
      const full = en.map((s, i) => `<div class="en">${tidy(s)}</div>${heList[i] ? `<div class="he">${heList[i]}</div>` : ''}`).join('');
      $('comm-more').hidden = false;
      $('comm-more').addEventListener('details', () =>
        TW.details(`${who} on ${TW.showRef(verse)} <span class="he-sans">${he}</span> · ${about}`, full));
      return;
    }
    $('comm').innerHTML = '<span class="offline">No commentary on this verse.</span>';
    show('comm');
  })().catch(e => { console.warn(e); offline('comm', 'The commentary'); }));

  // A passage of the Talmud that discusses today's verse, or the nearest verse in today's section that
  // the Talmud discusses. Which passage changes daily.
  jobs.push((async () => {
    const i0 = verses.indexOf(verse);
    const near = verses.map((v, i) => [Math.abs(i - i0), v]).sort((x, y) => x[0] - y[0]).map(x => x[1]);
    const v = near.find(x => TALMUD_LINKS[x]?.length);
    if (!v) { $('talmud').innerHTML = '<span class="offline">The Talmud doesn\'t quote this section.</span>'; show('talmud'); return; }
    const refs = TALMUD_LINKS[v];
    const dayNum = Math.floor(TW.dayStart(today).getTime() / 864e5);
    const ref = refs[dayNum % refs.length];
    let passage = await TW.text(ref);
    // A short passage reads better with the line after it.
    const m = /^(.*):(\d+)$/.exec(ref);
    if (m && passage.en.join(' ').replace(/<[^>]+>/g, '').length < 300) {
      const longer = await TW.text(`${m[1]}:${m[2]}-${+m[2] + 1}`).catch(() => null);
      if (longer?.en?.length > 1) passage = longer;
    }
    const [tractate, daf] = [ref.replace(/ \d+[ab]:.*$/, ''), ref.replace(/^.* (\d+[ab]):.*$/, '$1')];
    $('talmud-label').innerHTML = `From the Talmud · ${tractate} ${daf} <span class="he-sans">${passage.heRef.replace(/:.*$/, '')}</span>`;
    $('talmud-verse').textContent = `Discussing ${TW.showRef(v)}${v === verse ? ', the verse of the day' : ''}`;
    // On screen, brief: the start of the passage in English and Hebrew. "Full passage" opens all of it.
    const en = passage.en.join(' '), he = passage.he.join(' ');
    $('talmud-en').innerHTML = brief(en, 420);
    $('talmud-he').textContent = brief(he, 200);
    show('talmud');
    $('talmud-more').hidden = false;
    $('talmud-more').addEventListener('details', () =>
      TW.details(`From the Talmud · ${tractate} ${daf} <span class="he-sans">${passage.heRef.replace(/:.*$/, '')}</span> · ${$('talmud-verse').textContent}`,
        `<div class="en">${en}</div><div class="he">${he}</div>`));
  })().catch(e => { console.warn(e); offline('talmud', 'The Talmud passage'); }));

  // Short days (no Rashi on the verse, no Talmud passage, a one-line verse) would leave the bottom of the
  // reading column empty. Grow its type instead (--k, up to 1.8 times) until the column is full: measured
  // with the Talmud at its natural height, and nothing cut off. Long days stay at 1, and fit() shrinks them.
  function growReading() {
    const col = document.querySelector('.reading'), tal = document.querySelector('.talmud'), talBody = $('talmud');
    const boxes = [$('verse-box'), $('comm')];
    boxes.concat(talBody).forEach(el => { el.style.fontSize = ''; });
    tal.style.flex = talBody.style.flex = 'none';
    const fits = k => {
      col.style.setProperty('--k', k);
      return col.scrollHeight <= col.clientHeight + 1 && boxes.every(el => el.scrollHeight <= el.clientHeight + 1);
    };
    let lo = 1, hi = 1.8;
    if (fits(lo)) for (let i = 0; i < 8; i++) { const mid = (lo + hi) / 2; if (fits(mid)) lo = mid; else hi = mid; }
    col.style.setProperty('--k', lo);
    tal.style.flex = talBody.style.flex = '';
  }

  const fitAll = () => {
    growReading();
    TW.fit($('insight-top'), 18);
    TW.fit($('verse-box'), 16);
    TW.fit($('comm'), 16);
    TW.fit($('talmud'), 16);
  };
  await TW.fontsReady();
  fitAll();
  await Promise.all(jobs);
  await TW.fontsReady();
  TW.keepFitted(fitAll);
})();
