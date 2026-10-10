// Flags of the World on a phone: the desktop app's flags, facts, map and money ladder (desktop/flags.js, desktop/common.js,
// desktop/flags/), as one page with four tabs: Today (the flag of the day), All flags (by continent; tap one for its facts
// and map), Quiz (pick the country; it remembers what you know), and the 50-flag Millionaire game.
(function () {
  'use strict';
  const F = window.Flags, { all, byCode } = F, q = Phone.params, html = document.documentElement;
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const flag = code => `desktop/flags/${code}.svg`;
  const img = code => `<img src="${flag(code)}" alt="">`;
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
      <div class="d-card"><h2>Where it is</h2><div class="d-map fmap">${map(c)}</div></div>`;
  }
  function sheet(code) {
    const c = byCode.get(code);
    $('sheet').innerHTML = `<div class="sheet-in"><button class="x" data-close="1">&times;</button>
      <div class="d-pic flagpic">${img(c.code)}</div>
      <div class="d-title"><h1 class="serif">${esc(c.name)}</h1>${c.official !== c.name ? `<div class="sub">${esc(c.official)}</div>` : ''}</div>${facts(c)}</div>`;
    $('sheet').hidden = false;
    $('sheet').scrollTop = 0;
  }
  $('sheet').addEventListener('click', e => { if (e.target === $('sheet') || e.target.closest('[data-close]')) $('sheet').hidden = true; });

  // ---- Tabs ----
  let tab = q.get('tab') || 'today';
  function show(t) {
    tab = t;
    document.querySelectorAll('.tabbar button').forEach(b => b.classList.toggle('on', b.dataset.tab === t));
    html.classList.toggle('in-game', t === 'game');
    ({ today: drawToday, flags: drawFlags, quiz: drawQuiz, game: drawGame })[t]();
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
        <div>Your best game<b>${best ? `question ${best.q}, ${F.money(best.amount)}` : 'not played yet'}</b></div></div></div>`;
  }

  const fl = { region: 'All', find: '', hide: false };
  function drawFlags() {
    const qq = fl.find.trim().toLowerCase();
    const list = all.filter(c => (fl.region === 'All' || c.region === fl.region) && (!qq || c.name.toLowerCase().includes(qq) || (c.capital || '').toLowerCase().includes(qq)));
    $('main').innerHTML = `
      <input class="find" id="find" placeholder="Find a country or capital" value="${esc(fl.find)}" spellcheck="false" autocomplete="off">
      <div class="chips">${['All', ...F.REGIONS].map(r => `<button class="${r === fl.region ? 'on' : ''}" data-region="${r}">${r}</button>`).join('')}
        <button class="${fl.hide ? 'on' : ''}" data-hide="1">Hide names</button></div>
      <div class="fgrid${fl.hide ? ' hide' : ''}">${list.map(c => `<button data-code="${c.code}"><span class="fi">${img(c.code)}</span><span class="fn">${known(c.code) ? '<i></i>' : ''}${esc(c.name)}</span></button>`).join('')
        || '<p class="muted">No country by that name.</p>'}</div>`;
    const f = $('find');
    f.oninput = () => { fl.find = f.value; clearTimeout(drawFlags.t); drawFlags.t = setTimeout(() => { drawFlags(); const g = $('find'); g.focus(); g.setSelectionRange(g.value.length, g.value.length); }, 250); };
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
  let g = null;
  function newGame() {
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
    g = { qs, i: 0, sel: null, phase: 'playing', removed: [], used: {}, audience: null, friend: null, won: 0, result: null };
    drawGame();
  }
  const banked = n => n > 0 ? F.LADDER[n - 1] : 0;
  const safeFor = qn => { const s = F.SAFE.filter(x => x < qn).pop(); return s ? F.LADDER[s - 1] : 0; };
  function drawGame() {
    if (!g || g.phase === 'over') {
      $('main').innerHTML = `<div class="mil intro">
        ${g ? `<div class="k">${g.result === 'million' ? 'A flag millionaire!' : g.result === 'walked' ? 'You walked away' : 'Game over'}</div>
          <h1 class="serif">${g.result === 'million' ? 'All fifty!' : `Question ${g.i + 1}`}</h1><div class="won">${F.money(g.won)}</div>
          <p>${g.result === 'wrong' ? `That flag was ${esc(byCode.get(g.qs[g.i].code).name)}.` : ''}</p>`
        : `<div class="k">Who wants to be a flag millionaire?</div><h1 class="serif">The 50-flag game</h1>
          <p>Fifty flags, easy ones first. Pick the country: A, B, C or D. Climb the ladder to a million dollars; get one wrong and you keep
            the money from your last safe spot (questions 10, 25 and 40). Three lifelines: 50:50, Ask the audience and Phone a friend.</p>`}
        <button class="go" data-start="1">${g ? 'Play again' : 'Let’s play'}</button>
        <div class="best">${best ? `Your best: question ${best.q}, ${F.money(best.amount)}` : 'No games played yet'}</div></div>`;
      return;
    }
    const qn = g.qs[g.i], c = byCode.get(qn.code), locked = g.phase !== 'playing';
    const helper = g.audience ? `<div class="helper"><b>The audience says</b><div class="aud">${g.audience.map(a => `<div style="opacity:${a.gone ? .25 : 1}"><i style="height:${Math.max(3, a.pct)}px"></i>${a.pct}%<span>${a.letter}</span></div>`).join('')}</div></div>`
      : g.friend ? `<div class="helper"><b>&#x260E; Your friend says</b><p>&ldquo;${esc(g.friend)}&rdquo;</p></div>` : '';
    $('main').innerHTML = `<div class="mil">
      <div class="ladderline"><span>Question <b>${g.i + 1}</b>/50</span><span>for <b>${F.money(F.LADDER[g.i])}</b></span><span>safe <b>${F.money(safeFor(g.i + 1))}</b></span></div>
      <div class="flagbox">${img(c.code)}</div>
      <div class="answers">${qn.options.map((code, k) => {
        const cls = [g.removed.includes(code) ? 'gone' : '', g.sel === code ? 'sel' : '', g.phase === 'right' && code === qn.code ? 'right' : '',
          g.phase === 'wrong' && code === qn.code ? 'right' : '', g.phase === 'wrong' && code === g.sel ? 'wrong' : ''].filter(Boolean).join(' ');
        return `<button class="hex ${cls}" data-ans="${code}" ${locked ? 'disabled' : ''}><span class="l">${'ABCD'[k]}:</span>${g.removed.includes(code) ? '' : esc(byCode.get(code).name)}</button>`;
      }).join('')}</div>
      ${g.sel && g.phase === 'playing' ? '<div class="final"><button data-final="1">Final answer</button><button class="cancel" data-cancel="1">Not yet</button></div>' : ''}
      <div class="lifelines"><button data-life="fifty" ${g.used.fifty || locked ? 'disabled' : ''}>50:50</button>
        <button data-life="audience" ${g.used.audience || locked ? 'disabled' : ''}>Audience</button>
        <button data-life="phone" ${g.used.phone || locked ? 'disabled' : ''}>Phone</button>
        <button data-walk="1" ${locked ? 'disabled' : ''}>Walk: ${F.money(banked(g.i))}</button></div>
      ${helper}</div>`;
  }
  function answer() {
    const qn = g.qs[g.i], ok = g.sel === qn.code;
    g.phase = 'thinking'; drawGame();
    setTimeout(() => {
      g.phase = ok ? 'right' : 'wrong'; mark(qn.code, ok);
      if (!ok) { g.won = safeFor(g.i + 1); g.result = 'wrong'; }
      drawGame();
      setTimeout(() => {
        if (!ok || g.i === 49) { if (ok) { g.won = 1000000; g.result = 'million'; } finish(); }
        else { g.i++; g.sel = null; g.removed = []; g.audience = null; g.friend = null; g.phase = 'playing'; drawGame(); }
      }, ok ? 1500 : 2400);
    }, 1300);
  }
  function finish() {
    const reached = g.result === 'million' ? 50 : g.i + 1;
    if (!best || g.won > best.amount || (g.won === best.amount && reached > best.q)) { best = { q: reached, amount: g.won }; Phone.store.set('flags.best', best); }
    g.phase = 'over'; drawGame();
  }
  function lifeline(kind) {
    const qn = g.qs[g.i], n = g.i + 1, left = qn.options.filter(o => !g.removed.includes(o));
    g.used[kind] = true;
    if (kind === 'fifty') { g.removed = F.shuffle(left.filter(o => o !== qn.code), Math.random).slice(0, 2); if (g.removed.includes(g.sel)) g.sel = null; }
    else if (kind === 'audience') {
      const right = Math.max(25, Math.min(92, Math.round(88 - n * 0.9 + (Math.random() - 0.5) * 24)));
      const others = left.filter(o => o !== qn.code), cuts = others.map(() => Math.random()), sum = cuts.reduce((a, b) => a + b, 0) || 1;
      const votes = { [qn.code]: right }; let rest = 100 - right;
      others.forEach((o, k) => { const v = k === others.length - 1 ? rest : Math.round((100 - right) * cuts[k] / sum); votes[o] = v; rest -= v; });
      g.audience = qn.options.map((o, k) => ({ letter: 'ABCD'[k], pct: votes[o] ?? 0, gone: g.removed.includes(o) }));
    } else {
      const sure = Math.random() < Math.max(0.35, 0.97 - n * 0.013);
      const pk = sure ? qn.code : F.shuffle(left.filter(o => o !== qn.code), Math.random)[0] || qn.code;
      const name = byCode.get(pk).name, letter = 'ABCD'[qn.options.indexOf(pk)];
      g.friend = sure && n < 30 ? `Oh, that's easy. It's ${letter}, ${name}. I'm sure.` : sure ? `I'm fairly sure it's ${letter}, ${name}.` : `Hmm. Maybe ${letter}, ${name}... but don't hold me to it.`;
    }
    drawGame();
  }

  $('main').addEventListener('click', e => {
    const t = e.target.closest('button');
    if (!t) return;
    if (t.dataset.region) { fl.region = t.dataset.region; drawFlags(); }
    else if (t.dataset.hide) { fl.hide = !fl.hide; drawFlags(); }
    else if (t.dataset.code) sheet(t.dataset.code);
    else if (t.dataset.pick && !qz.picked) { qz.picked = t.dataset.pick; mark(qz.code, qz.picked === qz.code); qz.last = qz.code; drawQuiz(); }
    else if (t.dataset.next) { nextQuiz(); scrollTo(0, 0); }
    else if (t.dataset.start) newGame();
    else if (!g || g.phase !== 'playing') return;
    else if (t.dataset.ans && !g.removed.includes(t.dataset.ans)) { g.sel = t.dataset.ans; drawGame(); }
    else if (t.dataset.final) answer();
    else if (t.dataset.cancel) { g.sel = null; drawGame(); }
    else if (t.dataset.life && !g.used[t.dataset.life]) lifeline(t.dataset.life);
    else if (t.dataset.walk) { g.won = banked(g.i); g.result = 'walked'; finish(); }
  });
  $('head').innerHTML = `<div class="d-head"><div><div class="k">Flags of the World</div>
      <div class="date">${esc(F.today().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }))}</div></div>
    <div class="d-theme"><button data-t="light">Light</button><button data-t="dark">Dark</button></div></div>`;
  document.querySelector('.d-theme').onclick = ev => { const b = ev.target.closest('button'); if (b) setTheme(b.dataset.t); };
  show(['today', 'flags', 'quiz', 'game'].includes(tab) ? tab : 'today');
})();
