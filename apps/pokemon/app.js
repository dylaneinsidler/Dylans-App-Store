// Pokemon of the Day on a phone: the same Pokemon as the desktop app on the same day (desktop/pokemon.js:
// POKEMON_ORDER, one a day from POKEMON_START; the type matchups from desktop/pokedex.js), its Pokedex entry, and the
// whole Pokedex below: every Pokemon by region, as the games' pixel sprites. Tap one to see its entry (#n=25).
(function () {
  'use strict';
  const all = window.POKEMON || [], byN = new Map(all.map(p => [p.n, p])), order = window.POKEMON_ORDER || all.map(p => p.n);
  const q = Phone.params, html = document.documentElement;
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const art = n => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${n}.png`;
  const sprite = n => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${n}.png`;
  const TYPE = {
    normal: '#9fa19f', fire: '#e62829', water: '#2980ef', electric: '#f5bd00', grass: '#3fa129', ice: '#3dcef3',
    fighting: '#ff8000', poison: '#9141cb', ground: '#915121', flying: '#81b9ef', psychic: '#ef4179', bug: '#91a119',
    rock: '#afa981', ghost: '#704170', dragon: '#5060e1', dark: '#624d4e', steel: '#60a1b8', fairy: '#ef70ef',
  };
  const REGIONS = ['Kanto', 'Johto', 'Hoenn', 'Sinnoh', 'Unova', 'Kalos', 'Alola', 'Galar', 'Paldea'];
  const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const chip = t => `<span class="type" style="--t:${TYPE[t] || '#888'}">${cap(t)}</span>`;

  let theme = q.get('theme') || Phone.store.get('pokemon.theme', 'dark');
  function setTheme(t) {
    theme = t === 'light' ? 'light' : 'dark';
    html.dataset.theme = theme;
    Phone.store.set('pokemon.theme', theme);
    document.querySelectorAll('.d-theme button').forEach(b => b.classList.toggle('on', b.dataset.t === theme));
    document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#0e0f12' : '#f5f3ee';
  }
  function today() {
    const p = q.get('date');
    if (p) { const [y, m, d] = p.split('-').map(Number); return new Date(y, m - 1, d); }
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  }
  function pick(date) {
    const [y, m, d] = (window.POKEMON_START || '2026-10-09').split('-').map(Number);
    const i = Math.round((date - new Date(y, m - 1, d)) / 86400000);
    return byN.get(order[((i % order.length) + order.length) % order.length]);
  }

  function entry() {
    const day = today(), todays = pick(day), asked = Number((location.hash.match(/n=(\d+)/) || [])[1]);
    const p = byN.get(asked) || todays, browsing = p !== todays;
    const next = pick(new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1));
    const m = window.Dex ? Dex.matchups(p.types) : {};
    const group = (test, x) => { const ts = Object.keys(m).filter(t => test(m[t])); return ts.length ? `<div class="mrow"><span>${x}</span><div>${ts.map(chip).join('')}</div></div>` : ''; };
    const names = ['HP', 'Attack', 'Defense', 'Sp. Atk', 'Sp. Def', 'Speed'];
    const fam = (p.family || []).length > 1 ? p.family.map((stage, i) => `${i ? '<span class="arrow">&rarr;</span>' : ''}<div class="stage">${stage.map(x =>
      `<a class="fm${x.n === p.n ? ' me' : ''}" href="#n=${x.n}"><img src="${sprite(x.n)}" alt=""><span>${esc(x.name)}</span>${i && x.how ? `<small>${esc(x.how)}</small>` : ''}</a>`).join('')}</div>`).join('')
      : `<p>${esc(p.name)} doesn&rsquo;t evolve.</p>`;
    const c = TYPE[p.types[0]] || '#888';
    const lesson = (window.POKEMON_LESSONS || {})[p.n];   // a lesson from this Pokemon (desktop/lessons.js)
    document.getElementById('entry').innerHTML = `
      <div class="d-head"><div><div class="k">${browsing ? 'The Pok&eacute;dex' : 'Pok&eacute;mon of the day'}</div>
        <div class="date">${esc(day.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }))}</div></div>
        <div class="d-theme"><button data-t="light">Light</button><button data-t="dark">Dark</button></div></div>
      ${browsing ? `<a class="back" href="#"><img src="${sprite(todays.n)}" alt="">Back to today&rsquo;s Pok&eacute;mon</a>` : ''}
      <div class="hero" style="--c:${c}"><img src="${art(p.n)}" alt=""><span class="num">${String(p.n).padStart(4, '0')}</span></div>
      <div class="d-title"><div class="meta">No. ${String(p.n).padStart(4, '0')} &middot; Generation ${ROMAN[p.gen] || p.gen} &middot; ${esc(p.region || '')}</div>
        <h1 class="serif">${esc(p.name)}</h1><div class="sub">${esc(p.genus || '')}${p.jp ? ` &middot; ${esc(p.jp)}` : ''}</div>
        <div class="types">${p.types.map(chip).join('')}</div></div>
      ${lesson ? `<div class="d-card lesson"><h2>${browsing ? `${esc(p.name)}&rsquo;s lesson` : 'Today&rsquo;s lesson'}</h2><p class="lt serif">${esc(lesson.title)}</p>
        <p>${esc(lesson.lesson)}</p><p class="try"><b>Try today</b> ${esc(lesson.try)}</p></div>` : ''}
      ${(p.dex || []).length ? `<div class="d-card"><h2>The Pok&eacute;dex says</h2>${p.dex.slice(0, 3).map(d => `<p class="dex">&ldquo;${esc(d.text)}&rdquo;<small>Pok&eacute;mon ${esc(d.game)}</small></p>`).join('')}</div>` : ''}
      <div class="d-card"><h2>Base stats &middot; total ${p.stats.reduce((a, b) => a + b, 0)}</h2>${p.stats.map((v, i) =>
        `<div class="stat"><span>${names[i]}</span><b>${v}</b><i><em style="width:${Math.min(100, v / 1.8)}%;background:${c}"></em></i></div>`).join('')}</div>
      <div class="d-card"><h2>Matchups</h2>${group(v => v >= 2, 'Weak to')}${group(v => v > 0 && v < 1, 'Resists')}${group(v => v === 0, 'Not hurt by')}</div>
      <div class="d-card"><h2>Family</h2><div class="family">${fam}</div></div>
      <div class="d-card"><h2>Body</h2><div class="d-facts">
        <div>Height<b>${p.height} m (${Math.floor(p.height * 3.28084)}&prime;${Math.round((p.height * 3.28084 % 1) * 12)}&Prime;)</b></div>
        <div>Weight<b>${p.weight} kg (${Math.round(p.weight * 2.20462)} lb)</b></div>
        ${p.habitat ? `<div>Lives in<b>${esc(p.habitat)}</b></div>` : ''}<div>Color<b>${esc(cap(p.color || ''))}</b></div>
        <div style="grid-column:span 2">Abilities<b>${esc((p.abilities || []).join(', '))}</b></div></div></div>
`;
    document.querySelector('.d-theme').onclick = ev => { const b = ev.target.closest('button'); if (b) setTheme(b.dataset.t); };
    setTheme(theme);
  }

  // ---- The Pokedex: a region at a time (or a search), the sprites to tap ----
  const dx = { region: (byN.get(pick(today()).n) || {}).region || 'Kanto', find: '' };
  function dex() {
    const qq = dx.find.trim().toLowerCase(), todayN = pick(today()).n;
    const list = all.filter(p => qq ? (p.name.toLowerCase().includes(qq) || String(p.n) === qq.replace(/^0+/, '')) : (p.region || 'Galar') === dx.region);
    document.getElementById('dex').innerHTML = `
      <div class="screen-name">The Pok&eacute;dex &middot; all ${all.length.toLocaleString()}</div>
      <input class="find" id="dex-find" placeholder="Find by name or number" value="${esc(dx.find)}" spellcheck="false" autocomplete="off">
      <div class="regions">${REGIONS.map((r, i) => `<button class="${!qq && r === dx.region ? 'on' : ''}" data-region="${r}">${r}<small>Gen ${ROMAN[i + 1]}</small></button>`).join('')}</div>
      <div class="grid">${list.map(p => `<a class="mon${p.n === todayN ? ' today' : ''}" href="#n=${p.n}" style="--c:${TYPE[p.types[0]] || '#888'}"><img src="${sprite(p.n)}" alt="" loading="lazy"><span>${esc(p.name)}</span></a>`).join('')
        || '<p class="muted">No Pok&eacute;mon by that name.</p>'}</div>`;
    const f = document.getElementById('dex-find');
    f.oninput = () => { dx.find = f.value; clearTimeout(dex.t); dex.t = setTimeout(() => { dex(); const g = document.getElementById('dex-find'); g.focus(); g.setSelectionRange(g.value.length, g.value.length); }, 300); };
  }
  document.getElementById('dex').addEventListener('click', e => { const b = e.target.closest('[data-region]'); if (b) { dx.region = b.dataset.region; dx.find = ''; dex(); } });
  addEventListener('hashchange', () => { entry(); scrollTo({ top: 0, behavior: 'smooth' }); });
  entry();
  dex();
  let shown = today().toDateString();
  setInterval(() => { if (today().toDateString() !== shown) { shown = today().toDateString(); entry(); } }, 60e3);
})();
