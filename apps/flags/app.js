// Flags of the World on a phone: the desktop app's flags, facts, map and money ladder (desktop/flags.js, desktop/common.js,
// desktop/flags/), as one page with five tabs: Today (the flag of the day), All flags (by continent; tap one for its facts
// and map), Quiz (pick the country; it remembers what you know), the 50-flag Millionaire game, and Capitals (every
// country's and US state's capital, to learn or look up; desktop/capitals.js has the states').
(function () {
  'use strict';
  const F = window.Flags, { all, byCode } = F, q = Phone.params, html = document.documentElement;
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const flag = code => `desktop/flags/${code}.svg`;
  // Any flag: a country's, or one of the other kinds (desktop/flag-info.js: states, cities, ship signals, pirates...).
  const src = code => { const it = F.item && F.item(code); return it && it.cat !== 'Countries' ? 'desktop/' + it.img : flag(code); };
  const img = code => `<img src="${src(code)}" alt="">`;
  const nameOf = code => ((F.item && F.item(code)) || byCode.get(code) || {}).name || '';
  // What it means and its history; the flag over the years.
  function meaning(code) {
    const a = F.about ? F.about(code) : {};
    if (!a.meaning && !a.history) return a.describe ? `<div class="d-card"><p class="mean">${esc(a.describe)}</p></div>` : '';
    return `<div class="d-card"><h2>What it means</h2>${a.meaning ? `<p class="mean">${esc(a.meaning)}</p>` : ''}
      ${a.history ? `<h2 style="margin-top:14px">Its history</h2><p class="mean">${esc(a.history)}</p>` : ''}
      ${a.wiki ? `<p class="src">From Wikipedia, &ldquo;${esc(a.wiki)}&rdquo;</p>` : ''}</div>`;
  }
  function past(code) {
    const list = (F.about ? F.about(code) : {}).past || [];
    if (!list.length) return '';
    return `<div class="d-card"><h2>The flag over the years</h2><div class="past">${list.map(x =>
      `<figure><img src="desktop/${esc(x.img)}" alt="" onerror="this.parentNode.remove()"><figcaption>${esc(x.years)}</figcaption></figure>`).join('')}
      <figure class="now"><img src="${flag(code)}" alt=""><figcaption>Today</figcaption></figure></div></div>`;
  }
  const M = window.FLAG_MAP;
  const $ = id => document.getElementById(id);

  let theme = q.get('theme') || Phone.store.get('flags.theme', 'dark');
  function setTheme(t) {
    theme = t === 'light' ? 'light' : 'dark';
    html.dataset.theme = theme;
    Phone.store.set('flags.theme', theme);
    document.querySelectorAll('.d-theme button').forEach(b => b.classList.toggle('on', b.dataset.t === theme));
    document.querySelector('meta[name="theme-color"]').content = tab === 'game' ? '#0b0f45' : theme === 'dark' ? '#0e0f12' : '#f5f3ee';
  }

  // ---- What you know (this phone's own) ----
  const progress = Phone.store.get('flags.progress', {});
  let best = Phone.store.get('flags.best', null);
  if (best && best.right == null) best = null;
  const mark = (code, ok) => { const p = progress[code] = progress[code] || { r: 0, w: 0 }; ok ? p.r++ : p.w++; Phone.store.set('flags.progress', progress); };
  const known = code => { const p = progress[code]; return p && p.r >= 3 && p.r > p.w; };
  const knownCount = () => all.filter(c => known(c.code)).length;

  // ---- A country's facts and its map (zoomed in around it, as on the desktop's right screen) ----
  function map(c) {
    if (!M) return '';
    const shape = c.map && M.shapes[c.map], [x, y] = c.dot;
    const vw = 260, vh = vw / 1.8, vx = Math.max(0, Math.min(M.w - vw, x - vw / 2)), vy = Math.max(0, Math.min(M.h - vh, y - vh / 2));
    return `<svg viewBox="${vx.toFixed(1)} ${vy.toFixed(1)} ${vw} ${vh.toFixed(1)}" preserveAspectRatio="xMidYMid slice">
      <path class="land" d="${M.land}"/>${shape ? `<path class="here" d="${shape}"/>` : `<circle class="here" cx="${x}" cy="${y}" r="1.4"/>`}
      ${!shape || (c.area || 0) < 30000 ? `<circle class="ring" cx="${x}" cy="${y}" r="4"/>` : ''}</svg>`;
  }
  function facts(c) {
    return `<div class="d-card"><div class="d-facts">
        <div>Capital<b>${esc(c.capital || 'none')}</b></div><div>Where<b>${esc(c.subregion || c.region)}</b></div>
        <div>People<b>${esc(F.people(c.population))}</b></div><div>Size<b>${esc(F.sqmi(c.area))}</b></div>
        <div>Language${c.languages.length > 1 ? 's' : ''}<b>${esc(F.list(c.languages.slice(0, 4)))}</b></div><div>Money<b>${esc(F.list(c.currencies.slice(0, 2)))}</b></div>
        <div style="grid-column:span 2">${c.borders.length ? 'Next door' : 'Neighbors'}<b>${c.borders.length ? esc(F.list(c.borders.slice(0, 8))) + (c.borders.length > 8 ? ` and ${c.borders.length - 8} more` : '')
          : c.landlocked ? 'none' : 'none by land: the sea all around'}</b></div></div></div>
      ${meaning(c.code)}${past(c.code)}
      <div class="d-card"><h2>Where it is</h2><div class="d-map fmap">${map(c)}</div></div>`;
  }
  function sheet(code) {
    const c = byCode.get(code);
    if (!c) {       // another kind of flag
      const it = F.item(code);
      $('sheet').innerHTML = `<div class="sheet-in"><button class="x" data-close="1">&times;</button>
        <div class="d-pic flagpic fit">${img(code)}</div>
        <div class="d-title"><div class="k">${esc(it.cat)}</div><h1 class="serif">${esc(it.name)}</h1></div>${meaning(code)}</div>`;
      $('sheet').hidden = false; $('sheet').scrollTop = 0;
      return;
    }
    $('sheet').innerHTML = `<div class="sheet-in"><button class="x" data-close="1">&times;</button>
      <div class="d-pic flagpic">${img(c.code)}</div>
      <div class="d-title"><h1 class="serif">${esc(c.name)}</h1>${c.official !== c.name ? `<div class="sub">${esc(c.official)}</div>` : ''}</div>${facts(c)}</div>`;
    $('sheet').hidden = false;
    $('sheet').scrollTop = 0;
  }
  $('sheet').addEventListener('click', e => { if (e.target === $('sheet') || e.target.closest('[data-close]')) $('sheet').hidden = true; });


  // ---- Capitals: learn every country's and US state's capital, or look them up (as on the desktop's Capitals tab) ----
  const SC = window.STATE_CAPITALS || {};
  const SETS = ['Countries', 'US states', 'Both'];
  const setItems = set => [
    ...(set !== 'US states' ? all.filter(c => c.capital).map(c => ({ code: c.code, name: c.name, capital: c.capital, group: c.region, kind: c.region })) : []),
    ...(set !== 'Countries' && F.inCat ? F.inCat('US states').filter(i => SC[i.code] && i.code !== 'us-washington-dc')
      .map(i => ({ code: i.code, name: i.name, capital: SC[i.code], group: 'US states', kind: 'US state' })) : []),
  ];
  let learned = Phone.store.get('flags.capitals', {});
  const cp = { mode: 'learn', set: 'Countries', find: '', queue: null, q: null, picked: null };
  function newCapQueue() { cp.queue = F.shuffle(setItems(cp.set).filter(i => !learned[i.code]), Math.random); nextCap(); }
  function nextCap() {
    cp.picked = null;
    const it = cp.queue[0];
    if (!it) { cp.q = null; return drawCapitals(); }
    const pool = setItems(cp.set).filter(o => o.code !== it.code && o.capital !== it.capital);
    const near = F.shuffle(pool.filter(o => o.group === it.group), Math.random).slice(0, 2);
    const far = F.shuffle(pool.filter(o => !near.includes(o)), Math.random).slice(0, 3 - near.length);
    cp.q = { it, options: F.shuffle([it, ...near, ...far].map(o => o.capital), Math.random) };
    drawCapitals();
  }
  function drawCapitals() {
    const items = setItems(cp.set), done = items.filter(i => learned[i.code]).length;
    const head = `<div class="chips"><button class="${cp.mode === 'learn' ? 'on' : ''}" data-cmode="learn">Learn them</button>
        <button class="${cp.mode === 'book' ? 'on' : ''}" data-cmode="book">All capitals</button></div>
      <div class="chips">${SETS.map(x => `<button class="${x === cp.set ? 'on' : ''}" data-cset="${x}">${x} ${setItems(x).length}</button>`).join('')}</div>`;
    if (cp.mode === 'book') {
      const fold = F.fold || (x => String(x).toLowerCase());
      const qq = fold(cp.find.trim());
      const list = items.filter(i => !qq || fold(i.name).includes(qq) || fold(i.capital).includes(qq)).sort((a, b) => a.name.localeCompare(b.name));
      $('main').innerHTML = head + `<input class="cap-find" id="cfind" placeholder="Find a place or a capital" value="${esc(cp.find)}" spellcheck="false" autocomplete="off">
        <div class="cap-list">${list.map(i => `<div class="cap-row"><span class="f">${img(i.code)}</span><span class="nm">${esc(i.name)}<small>${esc(i.kind)}</small></span>
          <span class="cc">${esc(i.capital)}</span>${learned[i.code] ? '<i class="k"></i>' : ''}</div>`).join('') || '<p class="muted" style="padding:16px">Nothing matches.</p>'}</div>`;
      const f = $('cfind');
      f.oninput = () => { cp.find = f.value; clearTimeout(drawCapitals.t); drawCapitals.t = setTimeout(() => { drawCapitals(); const g2 = $('cfind'); g2.focus(); g2.setSelectionRange(g2.value.length, g2.value.length); }, 200); };
      return;
    }
    if (!cp.queue) return newCapQueue();
    if (!cp.q) {
      $('main').innerHTML = head + `<div class="qcount">All ${items.length} learned!</div><button class="next" data-creset="1">Start over</button>`;
      return;
    }
    const it = cp.q.it;
    $('main').innerHTML = head + `<div class="qcount">Learned <b>${done}</b> of ${items.length} &middot; misses come back until you get them</div>
      <div class="d-pic flagpic">${img(it.code)}</div>
      <div class="qq serif">What's the capital of ${esc(it.name)}?</div>
      <div class="choices">${cp.q.options.map((c, i) => `<button data-cans="${esc(c)}" ${cp.picked ? 'disabled' : ''} class="${cp.picked ? (c === it.capital ? 'right' : c === cp.picked ? 'wrong' : '') : ''}">
        <span>${'ABCD'[i]}</span>${esc(c)}</button>`).join('')}</div>
      ${cp.picked ? '<button class="next" data-cnext="1">Next</button>' : ''}
      <button class="next ghost" data-creset="1">Start over</button>`;
  }
  $('main').addEventListener('click', e => {
    if (tab !== 'capitals') return;
    const t = e.target.closest('button');
    if (!t) return;
    if (t.dataset.cmode) { cp.mode = t.dataset.cmode; drawCapitals(); }
    else if (t.dataset.cset) { cp.set = t.dataset.cset; cp.queue = null; drawCapitals(); }
    else if (t.dataset.cnext) { nextCap(); scrollTo(0, 0); }
    else if (t.dataset.creset) { setItems(cp.set).forEach(i => delete learned[i.code]); Phone.store.set('flags.capitals', learned); newCapQueue(); }
    else if (t.dataset.cans && cp.q && !cp.picked) {
      const it = cp.q.it, ok = t.dataset.cans === it.capital;
      cp.picked = t.dataset.cans;
      cp.queue.shift();
      if (ok) learned[it.code] = 1;
      else cp.queue.splice(Math.min(4, cp.queue.length), 0, it);
      Phone.store.set('flags.capitals', learned);
      drawCapitals();
    }
  });

  // ---- Tabs ----
  let tab = q.get('tab') || 'today';
  function show(t) {
    tab = t;
    document.querySelectorAll('.tabbar button').forEach(b => b.classList.toggle('on', b.dataset.tab === t));
    html.classList.toggle('in-game', t === 'game');
    ({ today: drawToday, flags: drawFlags, quiz: drawQuiz, game: drawGame, capitals: drawCapitals })[t]();
    setTheme(theme);
    scrollTo(0, 0);
  }
  document.querySelector('.tabbar').onclick = e => { const b = e.target.closest('button'); if (b) show(b.dataset.tab); };

  function drawToday() {
    const c = F.flagOfDay(), k = knownCount();
    $('main').innerHTML = `
      <div class="d-pic flagpic">${img(c.code)}</div>
      <div class="d-title"><h1 class="serif">${esc(c.name)}</h1>${c.official !== c.name ? `<div class="sub">${esc(c.official)}</div>` : ''}</div>
      ${facts(c)}
      <div class="d-card"><h2>You</h2><div class="d-facts"><div>Flags you know<b>${k} of ${all.length}</b></div>
        <div>Your best game<b>${best ? `${best.right} of 50` : 'not played yet'}</b></div></div></div>`;
  }

  const fl = { cat: q.get('cat') || 'Countries', region: 'All', find: '', hide: false };
  // The search box stays put while you type; only the flags under it change. Every word must start a word of the
  // name (or a country's capital, or the kind), ignoring capitals and accents; names that start with it come first.
  const flagList = () => {
    const countries = fl.cat === 'Countries';
    const list = F.inCat(fl.cat).filter(i => (!countries || fl.region === 'All' || i.country.region === fl.region) && F.matches(i, fl.find));
    return fl.find.trim() ? list.map((it, k) => [F.rank(it, fl.find), k, it]).sort((a, b) => a[0] - b[0] || a[1] - b[1]).map(x => x[2]) : list;
  };
  function drawFlags() {
    const countries = fl.cat === 'Countries';
    $('main').innerHTML = `
      <div class="chips cats">${['All kinds', ...(F.CATS || ['Countries'])].map(c => `<button class="${c === fl.cat ? 'on' : ''}" data-fcat="${esc(c)}">${esc(c)}</button>`).join('')}</div>
      <input class="find" id="find" type="search" placeholder="${countries ? 'Find a country or capital' : fl.cat === 'All kinds' ? 'Find any flag' : 'Find one'}" value="${esc(fl.find)}" spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="off">
      <div class="chips">${countries ? ['All', ...F.REGIONS].map(r => `<button class="${r === fl.region ? 'on' : ''}" data-region="${r}">${r}</button>`).join('') : ''}
        <button class="${fl.hide ? 'on' : ''}" data-hide="1">Hide names</button></div>
      <div class="fcount muted" id="fcount"></div>
      <div class="fgrid${fl.hide ? ' hide' : ''}" id="fgrid"></div>`;
    const on = document.querySelector('.chips.cats .on');   // keep the chosen kind in view
    if (on) on.parentNode.scrollLeft = on.offsetLeft - 16;
    drawFlagGrid();
    const f = $('find');
    f.oninput = () => { fl.find = f.value; clearTimeout(drawFlags.t); drawFlags.t = setTimeout(drawFlagGrid, 150); };
  }
  function drawFlagGrid() {
    const list = flagList(), many = fl.cat === 'All kinds';
    $('fcount').textContent = `${list.length} flag${list.length === 1 ? '' : 's'}${fl.find.trim() ? ` matching \u201c${fl.find.trim()}\u201d` : ''}`;
    $('fgrid').innerHTML = list.map(c => `<button data-code="${c.code}" class="${c.country ? '' : 'fit'}"><span class="fi">${img(c.code)}</span><span class="fn">${c.country && known(c.code) ? '<i></i>' : ''}${esc(c.name)}</span>${many ? `<span class="fk">${esc(c.cat)}</span>` : ''}</button>`).join('')
      || `<p class="muted">Nothing matches \u201c${esc(fl.find)}\u201d${many ? '' : ` in ${esc(fl.cat)}. Try All kinds`}.</p>`;
  }

  const qz = { code: null, choices: [], picked: null, last: null };
  function nextQuiz() {
    const weights = all.map(c => { if (c.code === qz.last) return 0; const p = progress[c.code];
      return !p ? 1 + (all.length - c.rank) / all.length : known(c.code) ? 0.15 : 2 + p.w - p.r * 0.4; });
    let r = Math.random() * weights.reduce((a, b) => a + b, 0), i = 0;
    while ((r -= weights[i]) > 0) i++;
    const c = all[Math.min(i, all.length - 1)];
    const near = F.shuffle(all.filter(o => o.code !== c.code && o.region === c.region), Math.random).slice(0, 2);
    const far = F.shuffle(all.filter(o => o.code !== c.code && !near.includes(o)), Math.random).slice(0, 3 - near.length);
    Object.assign(qz, { code: c.code, picked: null, choices: F.shuffle([c, ...near, ...far], Math.random).map(o => o.code) });
    drawQuiz();
  }
  function drawQuiz() {
    if (!qz.code) return nextQuiz();
    const c = byCode.get(qz.code);
    $('main').innerHTML = `
      <div class="qcount">You know <b>${knownCount()}</b> of ${all.length} &middot; a flag counts after 3 right answers</div>
      <div class="d-pic flagpic">${img(c.code)}</div>
      <div class="qq serif">Which country is it?</div>
      <div class="choices">${qz.choices.map((code, i) => `<button data-pick="${code}" ${qz.picked ? 'disabled' : ''} class="${qz.picked ? (code === qz.code ? 'right' : code === qz.picked ? 'wrong' : '') : ''}">
        <span>${'ABCD'[i]}</span>${esc(byCode.get(code).name)}</button>`).join('')}</div>
      ${qz.picked ? `<button class="next" data-next="1">Next flag</button>${facts(c)}` : ''}`;
  }

  // ---- The 50-flag game (the same rules as the desktop's: easy first, lookalikes later, safe at 10, 25 and 40) ----
  let g = null, gcat = 'Countries';
  const gameCats = () => [...(F.CATS || ['Countries']).filter(c => c === 'Countries' || F.inCat(c).length >= 8), 'All kinds'];
  function newGame() {
    if (gcat !== 'Countries') {
      const pool = F.shuffle(F.inCat(gcat), Math.random), n = Math.min(50, pool.length);
      const qs = pool.slice(0, n).map(c => ({ code: c.code,
        options: F.shuffle([c, ...F.shuffle(F.inCat(c.cat).filter(o => o !== c), Math.random).slice(0, 3)], Math.random).map(o => o.code) }));
      g = { qs, n, cat: gcat, i: 0, sel: null, phase: 'playing', marks: [] };
      return drawGame();
    }
    const sorted = all.slice().sort((a, b) => a.rank - b.rank), used = new Set(), qs = [];
    for (let i = 1; i <= 50; i++) {
      const start = Math.floor((i - 1) / 49 * (all.length - 45));
      const pool = sorted.slice(start, start + 45).filter(c => !used.has(c.code));
      const c = pool[Math.floor(Math.random() * pool.length)] || sorted.find(c => !used.has(c.code));
      used.add(c.code);
      const near = i > 35 ? all.filter(o => o.subregion === c.subregion) : i > 15 ? all.filter(o => o.region === c.region) : [];
      let wrong = F.shuffle(near.filter(o => o.code !== c.code), Math.random);
      if (wrong.length < 3) wrong = wrong.concat(F.shuffle(all.filter(o => o.code !== c.code && !wrong.includes(o)), Math.random));
      qs.push({ code: c.code, options: F.shuffle([c, ...wrong.slice(0, 3)], Math.random).map(o => o.code) });
    }
    g = { qs, n: 50, cat: 'Countries', i: 0, sel: null, phase: 'playing', marks: [] };
    drawGame();
  }
  // The rules (as on the desktop): pick A, B, C or D, then Enter. Right is green; wrong is red, with the right one in
  // green. The game always goes on to the next flag, all fifty, and the score comes at the end.
  const right = () => g ? g.marks.filter(Boolean).length : 0;
  function drawGame() {
    if (!g || g.phase === 'over') {
      const n = right();
      $('main').innerHTML = `<div class="mil intro">
        ${g ? `<div class="k">${n === g.n ? 'Every flag right!' : n / g.n >= .8 ? 'Excellent' : n / g.n >= .5 ? 'Well played' : 'Game over'}</div>
          <h1 class="serif">Your score</h1><div class="won">${n} of ${g.n}</div><p>${esc(g.cat)} &middot; ${Math.round(n / g.n * 100)}% right.</p>`
        : `<div class="k">The flag game</div><h1 class="serif">${gcat === 'Countries' ? 'Fifty flags' : esc(gcat)}</h1>
          <p>${gcat === 'Countries' ? 'Easy ones first. Pick the country' : 'Every one, in a random order. Pick the answer'} (A, B, C or D), then press Enter. Right turns green,
            wrong turns red and shows the right one. Either way you go on to the next flag, and your score comes at the end.</p>`}
        <div class="chips gcats">${gameCats().map(c => `<button class="${c === gcat ? 'on' : ''}" data-gcat="${esc(c)}">${esc(c)}</button>`).join('')}</div>
        <button class="go" data-start="1">${g ? 'Play again' : 'Let’s play'}</button>
        <div class="best">${best ? `Your best: ${best.right} of 50` : 'No games played yet'}</div></div>`;
      return;
    }
    const qn = g.qs[g.i], checked = g.phase === 'checked';
    $('main').innerHTML = `<div class="mil">
      <div class="ladderline"><span>Flag <b>${g.i + 1}</b>/${g.n}</span><span><b>${right()}</b> right so far</span></div>
      <div class="flagbox">${img(qn.code)}</div>
      <div class="answers">${qn.options.map((code, k) => {
        const cls = [g.sel === code && !checked ? 'sel' : '', checked && code === qn.code ? 'right' : '',
          checked && code === g.sel && code !== qn.code ? 'wrong' : ''].filter(Boolean).join(' ');
        return `<button class="hex ${cls}" data-ans="${code}" ${checked ? 'disabled' : ''}><span class="l">${'ABCD'[k]}:</span>${esc(nameOf(code))}</button>`;
      }).join('')}</div>
      ${!checked ? `<div class="final"><button data-enter="1" ${g.sel ? '' : 'disabled'}>Enter</button></div>` : ''}
      <div class="marks">${g.qs.map((_, i) => `<i class="${g.marks[i] === true ? 'ok' : g.marks[i] === false ? 'no' : i === g.i ? 'now' : ''}"></i>`).join('')}</div></div>`;
  }
  function answer() {
    const qn = g.qs[g.i], ok = g.sel === qn.code;
    g.phase = 'checked'; g.marks[g.i] = ok; if (g.cat === 'Countries') mark(qn.code, ok);
    drawGame();
    setTimeout(() => {
      if (g.i === g.n - 1) return finish();
      g.i++; g.sel = null; g.phase = 'playing'; drawGame();
    }, ok ? 1300 : 2400);
  }
  function finish() {
    const n = right();
    if (g.cat === 'Countries' && (!best || best.right == null || n > best.right)) { best = { right: n }; Phone.store.set('flags.best', best); }
    g.phase = 'over'; drawGame();
  }

  $('main').addEventListener('click', e => {
    const t = e.target.closest('button');
    if (!t) return;
    if (t.dataset.fcat) { fl.cat = t.dataset.fcat; drawFlags(); }
    else if (t.dataset.gcat) { gcat = t.dataset.gcat; g = null; drawGame(); }
    else if (t.dataset.region) { fl.region = t.dataset.region; drawFlags(); }
    else if (t.dataset.hide) { fl.hide = !fl.hide; drawFlags(); }
    else if (t.dataset.code) sheet(t.dataset.code);
    else if (t.dataset.pick && !qz.picked) { qz.picked = t.dataset.pick; mark(qz.code, qz.picked === qz.code); qz.last = qz.code; drawQuiz(); }
    else if (t.dataset.next) { nextQuiz(); scrollTo(0, 0); }
    else if (t.dataset.start) newGame();
    else if (!g || g.phase !== 'playing') return;
    else if (t.dataset.ans) { g.sel = t.dataset.ans; drawGame(); }
    else if (t.dataset.enter && g.sel) answer();
  });
  $('head').innerHTML = `<div class="d-head"><div><div class="k">Flags of the World</div>
      <div class="date">${esc(F.today().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }))}</div></div>
    <div class="d-theme"><button data-t="light">Light</button><button data-t="dark">Dark</button></div></div>`;
  document.querySelector('.d-theme').onclick = ev => { const b = ev.target.closest('button'); if (b) setTheme(b.dataset.t); };
  show(['today', 'flags', 'quiz', 'game', 'capitals'].includes(tab) ? tab : 'today');
})();
