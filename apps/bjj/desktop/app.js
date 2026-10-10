// One screen of the app: jiu-jitsu on the left monitor, judo on the right. Both work the same way:
//   Today    the technique of the day, with a week strip to look at the days around it
//   Library  every technique, with filters, search and grouping
//   a technique's own page, opened from the library or from a link
(function (global) {
  'use strict';

  const { Catalog, Rules, Figures, Link } = global;
  const $ = (sel, root = document) => root.querySelector(sel);
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const label = (pairs, id) => (pairs.find(p => p[0] === id) || [id, id])[1];
  const flatPositions = () => Catalog.BJJ.positions.flatMap(([, items]) => items);
  const two = n => String(n).padStart(2, '0');

  let D;          // which discipline this screen shows (the settings below)
  let data;       // { list, byId, families }
  let other;      // the other screen's data, for cross-links
  const state = { view: 'today', day: 0, id: null, back: null, query: '', filters: {}, groupBy: null, scroll: 0 };

  // ================= What differs between the two screens =================
  const DISCIPLINES = {
    bjj: {
      title: 'Jiu-Jitsu',
      otherTitle: 'Judo',
      daily: 'Technique of the day',
      seed: 1979,
      dailyPool: list => list,
      kicker(t) {
        const kind = { submission: 'Submission', sweep: 'Sweep', pass: 'Guard pass', takedown: 'Takedown', backtake: 'Back take',
          escape: 'Escape', transition: 'Control' }[t.kind] || t.kind;
        const target = { choke: 'Choke', elbow: 'Arm lock', shoulder: 'Shoulder lock', wrist: 'Wrist lock', leg: 'Leg lock',
          neck: 'Neck & spine', compression: 'Compression' }[t.target] || '';
        const from = t.from ? 'from ' + label(flatPositions(), t.from).replace(/^(?!X-)(\w)/, c => c.toLowerCase()) : '';
        return [kind, target, from].filter(Boolean).join(' · ');
      },
      chips(t) {
        return [
          label(Catalog.BJJ.attire, t.attire || 'both'),
          label(Catalog.BJJ.styles, t.style),
          'Learn at ' + label(Catalog.BJJ.levels, t.level).replace(' & black belt', '/black').toLowerCase(),
        ];
      },
      facets: [
        { key: 'kind', title: 'Type', options: () => Catalog.BJJ.kinds, get: t => t.kind },
        { key: 'target', title: 'Submission type', options: () => Catalog.BJJ.targets, get: t => t.target, when: f => (f.kind || []).includes('submission') },
        { key: 'from', title: 'Position', groups: () => Catalog.BJJ.positions, get: t => t.from },
        { key: 'style', title: 'Style', options: () => Catalog.BJJ.styles, get: t => t.style },
        { key: 'attire', title: 'Gi or No-Gi', options: () => Catalog.BJJ.attire, get: t => t.attire || 'both' },
        { key: 'level', title: 'Learn at', options: () => Catalog.BJJ.levels, get: t => t.level },
      ],
      groupings: [
        ['from', 'Position', t => t.from, () => flatPositions()],
        ['kind', 'Type', t => t.kind, () => Catalog.BJJ.kinds],
        ['family', 'Family', t => t.family, () => Object.values(data.families).map(f => [f.id, f.name])],
        ['style', 'Style', t => t.style, () => Catalog.BJJ.styles],
        ['az', 'A–Z', t => t.name[0].toUpperCase(), null],
      ],
      legalFilter: true,
    },
    judo: {
      title: 'Judo',
      otherTitle: 'Jiu-Jitsu',
      daily: 'Throw of the day',
      seed: 1882,
      // Only throws, and not the two that are banned everywhere.
      dailyPool: list => list.filter(t => t.cls && t.cls.startsWith('nage') && t.ijf !== 'forbidden'),
      kicker(t) {
        const [top, sub] = (t.cls || '').split('/');
        const cls = Catalog.JUDO.classes.flatMap(([, items]) => items).find(c => c[0] === sub);
        const grp = Catalog.JUDO.groups.find(g => g[0] === t.group);
        return [top === 'nage' ? 'Nage-waza · throw' : 'Katame-waza · grappling', cls && `${cls[1]} · ${cls[2].toLowerCase()}`,
          grp && grp[1]].filter(Boolean).join('  ·  ');
      },
      chips(t) {
        const out = [];
        if (t.kuzushi) out.push('Off-balance ' + label(Catalog.JUDO.kuzushi, t.kuzushi).toLowerCase());
        out.push({ legal: 'Legal in IJF judo', shido: 'Penalty in IJF judo', forbidden: 'Banned in all judo', caution: 'IJF: careful' }[t.ijf || 'legal']);
        if (t.nogi) out.push({ works: 'Works in no-gi', adapt: 'No-gi: needs changes', gi: 'Needs a gi' }[t.nogi]);
        return out;
      },
      facets: [
        { key: 'cls', title: 'Kodokan class', groups: () => Catalog.JUDO.classes.map(([g, items]) => [g, items.map(i => [i[0], `${i[1]} · ${i[2]}`])]), get: t => (t.cls || '').split('/')[1] },
        { key: 'group', title: 'Gokyo group', options: () => Catalog.JUDO.groups.map(g => [g[0], g[1]]), get: t => t.group },
        { key: 'kuzushi', title: 'Off-balance (kuzushi)', options: () => Catalog.JUDO.kuzushi, get: t => t.kuzushi },
        { key: 'ijf', title: 'Competition', options: () => [['legal', 'Legal in IJF'], ['shido', 'Leg grab (penalty)'], ['caution', 'Careful (risky)'], ['forbidden', 'Banned']], get: t => t.ijf || 'legal' },
        { key: 'nogi', title: 'Without a gi', options: () => [['works', 'Works in no-gi'], ['adapt', 'Needs changes'], ['gi', 'Needs a gi']], get: t => t.nogi },
      ],
      groupings: [
        ['cls', 'Class', t => (t.cls || '').split('/')[1], () => Catalog.JUDO.classes.flatMap(([, items]) => items.map(i => [i[0], `${i[1]} · ${i[2]}`]))],
        ['group', 'Gokyo', t => t.group, () => Catalog.JUDO.groups.map(g => [g[0], g[1]])],
        ['az', 'A–Z', t => t.name[0].toUpperCase(), null],
      ],
      legalFilter: false,
    },
  };

  // ================= Header =================
  function header() {
    $('#brand-title').textContent = D.title;
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.classList.toggle('on', tab.dataset.view === state.view || (tab.dataset.view === 'library' && state.view === 'technique'));
      tab.onclick = () => { go(tab.dataset.view === 'today' ? { view: 'today', day: 0 } : { view: 'library' }); };
    });
    const center = $('#center');
    if (state.view === 'today') {
      $('#brand-sub').textContent = D.daily;
      const today = new Date();
      center.innerHTML = `<div class="week">${Array.from({ length: 7 }, (_, i) => {
        const off = i - 3;
        const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + off);
        const name = off === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' });
        return `<div class="day${off === 0 ? ' today' : ''}${off === state.day ? ' on' : ''}" data-off="${off}">
          <div class="d mono">${name}</div><div class="n mono">${d.getDate()}</div></div>`;
      }).join('')}</div>`;
      center.querySelectorAll('.day').forEach(el => el.onclick = () => go({ view: 'today', day: Number(el.dataset.off) }));
    } else {
      $('#brand-sub').textContent = state.view === 'library' ? `Library · ${data.list.length} techniques` : 'Library';
      center.innerHTML = '';
    }
  }

  // ================= A technique's page (also the Today view) =================
  function stepsHTML(t) {
    const n = t.steps.length;
    const gi = t.discipline === 'judo' || t.attire === 'gi';
    const cls = n <= 3 ? 'row3' : n === 4 ? 'row4' : 'grid6';
    return `<div class="steps ${cls}">${t.steps.map((s, i) => `
      <figure class="step">
        <div class="pic">${Figures.render(s.pose, { gi })}</div>
        <figcaption><span class="num mono">${two(i + 1)}</span>${esc(s.text)}</figcaption>
      </figure>`).join('')}</div>`;
  }

  function rulesHTML(t) {
    if (t.discipline === 'judo') return judoRulesHTML(t);
    const mine = Link.settings;
    const rows = Rules.SETS.map(set => {
      const g = Rules.grid(t, set);
      const cells = g.map((v, i) => `<div class="cell v${v === '?' ? 'q' : v === '-' ? 'x' : v}${set.id === mine.rules && i === mine.level ? ' me' : ''}">
          <i></i><span>${esc(abbrev(set.levels[i]))}</span></div>`).join('');
      return `<div class="rrow${set.id === mine.rules ? ' mine' : ''}"><div class="rname mono">${esc(set.name)}</div><div class="cells">${cells}</div></div>`;
    }).join('');
    const notes = (t.tags || []).filter(tag => Rules.TAGS[tag]).map(tag =>
      `<li><b>${esc(Rules.TAGS[tag].name)}.</b> ${esc(Rules.TAGS[tag].note)}</li>`).join('');
    const giNote = t.attire === 'gi' ? '<li><b>Gi only.</b> It grips the gi, so it has no place in no-gi rulesets (shown as –).</li>' : '';
    return `<div class="block rules">
      <h3 class="mono">Rules · who can do it, where</h3>
      <p class="rsum">${esc(Rules.summary(t))}</p>
      <div class="rtable">${rows}</div>
      <div class="legend mono"><span><i class="vy"></i>legal</span><span><i class="vn"></i>not allowed</span><span><i class="vq"></i>depends</span><span class="me-key">your division</span></div>
      ${notes || giNote ? `<ul class="rnotes">${notes}${giNote}</ul>` : ''}
    </div>`;
  }
  const abbrev = l => ({ White: 'W', Blue: 'B', Purple: 'P', Brown: 'Br', Black: 'Bk', 'Brown & Black': 'Br+', Beginner: 'Beg', Intermediate: 'Int',
    'Advanced & Pro': 'Pro', Novice: 'Nov', Expert: 'Exp', Adult: 'Adult' })[l] || l;

  function judoRulesHTML(t) {
    const ijf = {
      legal: ['y', 'Legal. Scores ippon when uke lands with force, speed and control, mostly on the back.'],
      shido: ['n', 'Penalty (shido). Grabbing below the belt is banned in IJF judo; the 2025–2028 rules still forbid gripping the legs.'],
      caution: ['q', 'Legal, but diving in head first or locking the arm during the throw means disqualification (hansoku-make).'],
      forbidden: ['n', 'Banned in all judo competition (kinshi-waza): too many injuries.'],
    }[t.ijf || 'legal'];
    const kids = t.cls === 'katame/shime' ? ['q', 'Kids: chokes usually start around age 13; the age depends on the federation.']
      : t.cls === 'katame/kansetsu' ? ['q', 'Kids: arm locks usually start around age 15–17, depending on the federation. Judo only allows locks on the elbow.']
      : t.cls === 'katame/osaekomi' ? ['y', 'Kids: allowed at every age. 20 seconds is ippon (10 is waza-ari, 5 is yuko).']
      : ['y', 'Kids: allowed, though kids rules often ban some risky throws; ask the event.'];
    const bjj = t.id === 'kani-basami' ? ['n', 'Banned at every belt (IBJJF), and most BJJ events.']
      : t.cls && t.cls.startsWith('katame') ? ['y', 'Legal for adults in BJJ too.']
      : ['y', 'Legal in BJJ (IBJJF). A clean throw scores 2 points; a sacrifice throw counts if you finish on top.'];
    const nogi = { works: ['y', 'Works without a gi: grip the neck, arms or body instead.'], adapt: ['q', 'Needs changing for no-gi (wrist, neck or body grips instead of the sleeve and lapel).'],
      gi: ['n', 'Needs a gi: it depends on gripping the jacket.'] }[t.nogi || 'adapt'];
    const line = ([v, text], name) => `<div class="jrow"><i class="v${v}"></i><div><b class="mono">${name}</b> ${esc(text)}</div></div>`;
    return `<div class="block rules">
      <h3 class="mono">Rules · competition</h3>
      ${line(ijf, 'IJF judo')}${line(kids, 'Kids')}${line(bjj, 'BJJ')}${t.cls && t.cls.startsWith('nage') ? line(nogi, 'No-gi') : ''}
    </div>`;
  }

  function techHTML(t, opts = {}) {
    const crossList = (t.cross || []).map(id => other && other.byId[id]).filter(Boolean);
    const cross = crossList.map(o => `<span class="chip link cross" data-cross="${esc(o.id)}">${esc(D.otherTitle)} · ${esc(o.name)} <em>↗</em></span>`).join('');
    const related = t.related.map(id => data.byId[id]).filter(Boolean);
    const aka = t.aka.length ? `<div class="aka serif"><span class="mono">Also called</span> ${t.aka.map(esc).join('<span class="sep"> · </span>')}</div>` : '';
    const title = t.discipline === 'judo'
      ? `<div class="jtitle"><div><h1 class="name serif">${esc(t.name)}</h1><div class="english serif">${esc(t.english || '')}</div></div>
           ${t.kanji ? `<div class="kanji">${esc(t.kanji)}</div>` : ''}</div>`
      : `<h1 class="name serif">${esc(t.name)}</h1>`;
    const list = items => `<ul>${items.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;
    return `<section class="tech${opts.today ? ' is-today' : ''}">
      <div class="lead">
        ${opts.back ? `<div class="back mono" id="back">← ${esc(opts.back)}</div>` : ''}
        <div class="kicker mono">${esc(D.kicker(t))}</div>
        ${title}
        ${aka}
        <div class="chips mono">${D.chips(t).map(c => `<span class="chip">${esc(c)}</span>`).join('')}${cross}</div>
        <p class="summary serif">${esc(t.summary || '')}</p>
        ${stepsHTML(t)}
      </div>
      <aside class="side">
        <div class="dodont">
          <div><h3 class="mono">Key details</h3>${list(t.dos)}</div>
          <div><h3 class="mono">Common mistakes</h3>${list(t.donts)}</div>
        </div>
        ${t.counters.length ? `<div class="block"><h3 class="mono">${t.discipline === 'judo' ? 'Counters & combinations' : 'How they counter it'}</h3>${list(t.counters)}</div>` : ''}
        ${rulesHTML(t)}
        ${related.length || t.note ? `<div class="block"><h3 class="mono">${t.familyInfo ? esc(t.familyInfo.name) + ' family & related' : 'Related'}</h3>
          ${t.note ? `<p class="note serif">${esc(t.note)}</p>` : ''}
          <div class="chips mono">${related.slice(0, 10).map(r => `<span class="chip link" data-id="${esc(r.id)}">${esc(r.name)}</span>`).join('')}</div></div>` : ''}
      </aside>
    </section>`;
  }

  function wireTech(main) {
    main.querySelectorAll('[data-id]').forEach(el => el.onclick = () => go({ view: 'technique', id: el.dataset.id, back: state.view === 'today' ? 'Today' : 'Library' }));
    main.querySelectorAll('[data-cross]').forEach(el => el.onclick = () => {
      Link.send('open', { discipline: D === DISCIPLINES.bjj ? 'judo' : 'bjj', id: el.dataset.cross });
      el.classList.add('sent');
      setTimeout(() => el.classList.remove('sent'), 1200);
    });
    const back = $('#back', main);
    if (back) back.onclick = () => go(state.back === 'Today' ? { view: 'today' } : { view: 'library', keepScroll: true });
    fitSide(main);
  }

  // A long page could run off the bottom; step the side column's text down until it fits.
  function fitSide(main) {
    const side = $('.side', main), lead = $('.lead', main);
    if (!side) return;
    for (let s = 1; s > 0.7 && side.scrollHeight > side.clientHeight + 2; s -= 0.04) side.style.setProperty('--k', s.toFixed(2));
    for (let s = 1; s > 0.7 && lead.scrollHeight > lead.clientHeight + 2; s -= 0.04) lead.style.setProperty('--k', s.toFixed(2));
  }

  // ================= Library =================
  function passes(t, skipKey) {
    if (state.query && !Catalog.matches(t, state.query)) return false;
    for (const f of D.facets) {
      if (f.key === skipKey) continue;
      const chosen = state.filters[f.key];
      if (chosen && chosen.length && !chosen.includes(f.get(t))) return false;
    }
    if (D.legalFilter && state.filters.legal && skipKey !== 'legal') {
      const set = Rules.SETS.find(s => s.id === Link.settings.rules);
      const v = Rules.grid(t, set)[Link.settings.level];
      if (v !== 'y') return false;
    }
    return true;
  }

  function facetHTML(f) {
    if (f.when && !f.when(state.filters)) return '';
    const counts = {};
    for (const t of data.list) if (passes(t, f.key)) { const v = f.get(t); counts[v] = (counts[v] || 0) + 1; }
    const chosen = state.filters[f.key] || [];
    const row = ([id, name]) => {
      const n = counts[id] || 0;
      if (!n && !chosen.includes(id)) return '';
      return `<li class="${chosen.includes(id) ? 'on' : ''}${n ? '' : ' empty'}" data-k="${f.key}" data-v="${esc(id)}"><span>${esc(name)}</span><b>${n}</b></li>`;
    };
    const body = f.groups
      ? f.groups().map(([g, items]) => { const rows = items.map(row).join(''); return rows ? `<li class="sub mono">${esc(g)}</li>${rows}` : ''; }).join('')
      : f.options().map(row).join('');
    return body ? `<div class="facet"><h4 class="mono">${esc(f.title)}</h4><ul>${body}</ul></div>` : '';
  }

  function legalFacetHTML() {
    if (!D.legalFilter) return '';
    const s = Link.settings;
    const set = Rules.SETS.find(x => x.id === s.rules) || Rules.SETS[0];
    return `<div class="facet legal-facet"><h4 class="mono">Legal for me</h4>
      <div class="pick">${Rules.SETS.map(x => `<span class="${x.id === set.id ? 'on' : ''}" data-rules="${x.id}">${esc(x.name)}</span>`).join('')}</div>
      <div class="pick lv">${set.levels.map((l, i) => `<span class="${i === s.level ? 'on' : ''}" data-level="${i}">${esc(l)}</span>`).join('')}</div>
      <ul><li class="${state.filters.legal ? 'on' : ''}" data-legal="1"><span>Only show what's legal for me</span><b></b></li></ul>
    </div>`;
  }

  function cardHTML(t) {
    const last = t.steps[t.steps.length - 1];
    const gi = t.discipline === 'judo' || t.attire === 'gi';
    let dot = '';
    if (D.legalFilter) {
      const set = Rules.SETS.find(x => x.id === Link.settings.rules);
      const v = Rules.grid(t, set)[Link.settings.level];
      dot = `<i class="ldot v${v === '?' ? 'q' : v === '-' ? 'x' : v}"></i>`;
    }
    const sub = t.discipline === 'judo' ? `${t.kanji ? `<span class="k">${esc(t.kanji)}</span> ` : ''}${esc(t.english || '')}` : esc(D.kicker(t));
    return `<div class="card" data-id="${esc(t.id)}">
      <div class="pic">${last ? Figures.render(last.pose, { gi }) : ''}</div>
      <div class="ctext"><div class="cname serif">${esc(t.name)}${dot}</div><div class="csub">${sub}</div></div>
    </div>`;
  }

  function libraryHTML() {
    const shown = data.list.filter(t => passes(t));
    const g = D.groupings.find(x => x[0] === state.groupBy) || D.groupings[0];
    const [, , keyOf, order] = g;
    const buckets = new Map();
    if (order) for (const [id, name] of order()) buckets.set(id, { name, items: [] });
    for (const t of shown) {
      const k = keyOf(t);
      if (!buckets.has(k)) buckets.set(k, { name: k || 'Other', items: [] });
      buckets.get(k).items.push(t);
    }
    let sections = [...buckets.values()].filter(b => b.items.length);
    if (!order) sections.sort((a, b) => a.name.localeCompare(b.name));
    for (const s of sections) s.items.sort((a, b) => a.name.localeCompare(b.name));
    const anyFilter = state.query || Object.values(state.filters).some(v => v && (v === true || v.length));
    return `<section class="library">
      <aside class="facets">
        <div class="search"><input id="q" class="serif" placeholder="Search names & nicknames" value="${esc(state.query)}" spellcheck="false"></div>
        ${legalFacetHTML()}
        ${D.facets.map(facetHTML).join('')}
      </aside>
      <div class="results">
        <div class="rhead">
          <div class="count serif">${shown.length} of ${data.list.length}${anyFilter ? ' <span class="clear mono" id="clear">Clear filters ✕</span>' : ''}</div>
          <div class="groupby mono"><span class="lab">Group by</span>${D.groupings.map(x => `<span class="${x === g ? 'on' : ''}" data-g="${x[0]}">${esc(x[1])}</span>`).join('')}</div>
        </div>
        <div class="list" id="list">
          ${sections.map(s => `<h2 class="serif">${esc(s.name)} <span class="mono">${s.items.length}</span></h2>
            <div class="cards">${s.items.map(cardHTML).join('')}</div>`).join('') || '<p class="none serif">Nothing matches. Try fewer filters.</p>'}
        </div>
      </div>
    </section>`;
  }

  function wireLibrary(main) {
    const q = $('#q', main);
    q.oninput = () => { state.query = q.value; renderLibraryKeepFocus(); };
    q.onkeydown = e => { if (e.key === 'Escape') { state.query = ''; renderLibraryKeepFocus(); } };
    main.querySelectorAll('.facet li[data-k]').forEach(li => li.onclick = () => {
      const { k, v } = li.dataset;
      const cur = state.filters[k] || [];
      state.filters[k] = cur.includes(v) ? cur.filter(x => x !== v) : [...cur, v];
      if (k === 'kind' && !state.filters.kind.includes('submission')) delete state.filters.target;
      render();
    });
    main.querySelectorAll('[data-rules]').forEach(el => el.onclick = () => {
      Link.setSetting('rules', el.dataset.rules);
      const n = Rules.SETS.find(s => s.id === el.dataset.rules).levels.length;
      if (Link.settings.level >= n) Link.setSetting('level', n - 1);
      render();
    });
    main.querySelectorAll('[data-level]').forEach(el => el.onclick = () => { Link.setSetting('level', Number(el.dataset.level)); render(); });
    main.querySelectorAll('[data-legal]').forEach(el => el.onclick = () => { state.filters.legal = !state.filters.legal; render(); });
    main.querySelectorAll('[data-g]').forEach(el => el.onclick = () => { state.groupBy = el.dataset.g; render(); });
    const clear = $('#clear', main);
    if (clear) clear.onclick = () => { state.query = ''; state.filters = {}; render(); };
    main.querySelectorAll('.card').forEach(c => c.onclick = () => {
      state.scroll = $('#list', main).scrollTop;
      go({ view: 'technique', id: c.dataset.id, back: 'Library' });
    });
  }

  function renderLibraryKeepFocus() {
    const pos = $('#q').selectionStart;
    render();
    const q = $('#q');
    q.focus();
    q.setSelectionRange(pos, pos);
  }

  // ================= Moving between views =================
  function go(to) {
    const keep = to.keepScroll;
    Object.assign(state, { day: 0 }, to);
    delete state.keepScroll;
    render();
    if (state.view === 'library' && keep) $('#list').scrollTop = state.scroll;
  }

  function todays() {
    const now = new Date();
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + state.day);
    return Catalog.ofTheDay(D.dailyPool(data.list), d, D.seed);
  }

  function render() {
    header();
    const main = $('#main');
    main.className = 'main-' + state.view;
    if (state.view === 'library') {
      main.innerHTML = libraryHTML();
      wireLibrary(main);
    } else {
      const t = state.view === 'today' ? todays() : data.byId[state.id];
      if (!t) { go({ view: 'library' }); return; }
      main.innerHTML = techHTML(t, { today: state.view === 'today', back: state.view === 'technique' ? state.back : null });
      wireTech(main);
    }
  }

  // ================= Start =================
  function start(kind, mySource, otherSource) {
    D = DISCIPLINES[kind];
    data = Catalog.build(kind, mySource);
    other = otherSource ? Catalog.build(kind === 'bjj' ? 'judo' : 'bjj', otherSource) : null;
    document.title = D.title;
    // Cross-links from the other screen open here.
    Link.on('open', d => { if (d.discipline === kind && data.byId[d.id]) go({ view: 'technique', id: d.id, back: 'Today' }); });
    Link.onSetting('rules', () => { if (state.view !== 'library') render(); });
    Link.onSetting('level', () => { if (state.view !== 'library') render(); });
    // A quick look at one view for testing: bjj.html#id=armbar-mount, #view=library, #day=2
    const hash = new URLSearchParams(location.hash.slice(1));
    if (hash.get('id')) Object.assign(state, { view: 'technique', id: hash.get('id'), back: 'Library' });
    if (hash.get('view')) state.view = hash.get('view');
    if (hash.get('day')) state.day = Number(hash.get('day'));
    if (hash.get('q')) state.query = hash.get('q');
    Link.settingsReady.then(() => {
      render();
      document.body.classList.add('ready');
    });
    // Past midnight, Today moves on by itself.
    let shownDay = Catalog.dayNumber(new Date());
    setInterval(() => {
      const nowDay = Catalog.dayNumber(new Date());
      if (nowDay !== shownDay) { shownDay = nowDay; if (state.view === 'today') render(); }
    }, 30e3);
  }

  global.App = { start, state, go };
})(window);
