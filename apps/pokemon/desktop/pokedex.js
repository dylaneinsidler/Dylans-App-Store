// Dylan's Pokémon of the Day: both screens, from pokemon.js. art.html (left): today's Pokémon, big, in its picture.
// entry.html (right): its Pokédex entry. Today's Pokémon comes from POKEMON_ORDER, one a day from POKEMON_START.
//
// The right screen also has the whole Pokédex: every Pokémon by region, as pixel-art sprites to click.
// For a look at any day or Pokémon:  art.html?date=2026-12-25   entry.html#n=150   entry.html#dex=Johto   ?theme=light
window.Dex = (() => {
  const W = 1920, H = 1080;
  const cfg = window.POKEMON_CONFIG || {};
  const all = window.POKEMON || [];
  const byN = new Map(all.map(p => [p.n, p]));
  const order = window.POKEMON_ORDER || all.map(p => p.n);
  const params = new URLSearchParams(location.search);
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // ---- Who's today ----
  function today() {
    const d = params.get('date');
    if (d) { const [y, m, dd] = d.split('-').map(Number); return new Date(y, m - 1, dd); }
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), t.getDate());
  }
  function pick(date) {
    const [y, m, d] = (window.POKEMON_START || '2026-10-09').split('-').map(Number);
    const i = Math.round((date - new Date(y, m - 1, d)) / 86400000);
    return byN.get(order[((i % order.length) + order.length) % order.length]);
  }
  const day = today();
  const asked = Number((location.hash.match(/n=(\d+)/) || [])[1]);
  const todays = byN.get(asked) || pick(day);
  let mon = todays;
  const next = pick(new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1));

  // ---- Types: their colors, and what hits them hard ----
  const TYPE = {
    normal: '#9fa19f', fire: '#e62829', water: '#2980ef', electric: '#f5bd00', grass: '#3fa129', ice: '#3dcef3',
    fighting: '#ff8000', poison: '#9141cb', ground: '#915121', flying: '#81b9ef', psychic: '#ef4179', bug: '#91a119',
    rock: '#afa981', ghost: '#704170', dragon: '#5060e1', dark: '#624d4e', steel: '#60a1b8', fairy: '#ef70ef',
  };
  // Each attacking type: [hits these twice as hard, half as hard, not at all].
  const CHART = {
    normal: ['', 'rock steel', 'ghost'],
    fire: ['grass ice bug steel', 'fire water rock dragon', ''],
    water: ['fire ground rock', 'water grass dragon', ''],
    electric: ['water flying', 'electric grass dragon', 'ground'],
    grass: ['water ground rock', 'fire grass poison flying bug dragon steel', ''],
    ice: ['grass ground flying dragon', 'fire water ice steel', ''],
    fighting: ['normal ice rock dark steel', 'poison flying psychic bug fairy', 'ghost'],
    poison: ['grass fairy', 'poison ground rock ghost', 'steel'],
    ground: ['fire electric poison rock steel', 'grass bug', 'flying'],
    flying: ['grass fighting bug', 'electric rock steel', ''],
    psychic: ['fighting poison', 'psychic steel', 'dark'],
    bug: ['grass psychic dark', 'fire fighting poison flying ghost steel fairy', ''],
    rock: ['fire ice flying bug', 'fighting ground steel', ''],
    ghost: ['psychic ghost', 'dark', 'normal'],
    dragon: ['dragon', 'steel', 'fairy'],
    dark: ['psychic ghost', 'fighting dark fairy', ''],
    steel: ['ice rock fairy', 'fire water electric steel', ''],
    fairy: ['fighting dragon dark', 'fire poison steel', ''],
  };
  function matchups(types) {
    const out = {};
    for (const [att, [two, half, zero]] of Object.entries(CHART)) {
      let m = 1;
      for (const t of types) {
        if (zero.split(' ').includes(t)) m = 0;
        else if (two.split(' ').includes(t)) m *= 2;
        else if (half.split(' ').includes(t)) m *= 0.5;
      }
      out[att] = m;
    }
    return out;
  }
  const typeChip = t => `<span class="type" style="--t:${TYPE[t] || '#888'}">${esc(t[0].toUpperCase() + t.slice(1))}</span>`;
  const color = p => TYPE[p.types[0]] || '#888';

  // ---- Pictures ----
  const official = n => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${n}.png`;
  const sprite = n => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${n}.png`;   // the games' pixel art
  const painting = n => `images/${n}.jpg`;
  const cry = n => `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${n}.ogg`;

  // ---- Words ----
  const no = n => 'No. ' + String(n).padStart(4, '0');
  const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
  function height(m) {
    const inches = Math.round(m * 39.3701);
    return `${m.toFixed(1)} m <small>${Math.floor(inches / 12)}′${inches % 12}″</small>`;
  }
  const weight = kg => `${kg.toFixed(1)} kg <small>${Math.round(kg * 2.20462).toLocaleString()} lb</small>`;
  // PokéAPI's habitat names, as you'd say them.
  const HABITAT = { 'Rare': 'Hardly ever seen', 'Waters Edge': 'Water’s edge', 'Rough Terrain': 'Rough terrain' };
  const dateLine = d => d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  function kind(p) {
    if (p.mythical) return 'Mythical';
    if (p.legendary) return 'Legendary';
    if (p.baby) return 'Baby';
    return '';
  }

  // ---- Light / Dark, shared by both screens (the launcher passes a change on through theme.js) ----
  const askedTheme = params.get('theme');
  let theme = (askedTheme || window.POKEMON_THEME || cfg.theme || 'dark') === 'light' ? 'light' : 'dark';
  function setTheme(t) {
    theme = t;
    document.documentElement.dataset.theme = t;
    document.querySelectorAll('.theme-switch span').forEach(s => s.classList.toggle('on', s.dataset.pick === t));
    document.title = `${document.title.replace(/ \((light|dark)\)$/, '')} (${t})`;
  }

  // The X, the switch, fitting the page to the monitor, and a new Pokémon at midnight.
  function frame() {
    document.body.insertAdjacentHTML('beforeend', `<button class="close-x" title="Close">&times;</button>
      <div class="theme-switch"><span data-pick="light">Light</span><span data-pick="dark">Dark</span></div>`);
    document.querySelector('.close-x').onclick = () => window.close();
    document.addEventListener('keydown', e => { if (e.key === 'Escape') window.close(); });
    document.querySelector('.theme-switch').onclick = e => setTheme(e.target.dataset.pick || (theme === 'dark' ? 'light' : 'dark'));
    setTheme(theme);
    let saved = window.POKEMON_THEME;
    if (location.protocol === 'file:' && !askedTheme) setInterval(() => {
      const s = document.createElement('script');
      s.src = `theme.js?${Date.now()}`;
      s.onload = () => { s.remove(); const t = window.POKEMON_THEME; if (t && t !== saved) { saved = t; if (t !== theme) setTheme(t); } };
      s.onerror = () => s.remove();
      document.head.append(s);
    }, 1000);
    const fit = () => {
      const st = document.getElementById('stage'), k = Math.min(innerWidth / W, innerHeight / H);
      st.style.transform = `scale(${k})`;
      st.style.left = (innerWidth - W * k) / 2 + 'px';
      st.style.top = (innerHeight - H * k) / 2 + 'px';
    };
    addEventListener('resize', fit);
    fit();
    if (!params.get('date') && !asked) setInterval(() => { if (today().getTime() !== day.getTime()) location.reload(); }, 60000);
  }

  // ---- Left screen: the picture ----
  function art() {
    const p = mon, k = kind(p);
    document.getElementById('stage').innerHTML = `
      <div class="glow" style="--c:${color(p)}"></div>
      <div class="bignum">${String(p.n).padStart(4, '0')}</div>
      <img class="official" alt="" src="${official(p.n)}">
      <img class="painting" alt="">
      <div class="shade"></div>
      <div class="top"><span class="kicker">Pokémon of the Day</span><span class="date">${esc(dateLine(day))}</span></div>
      <div class="title">
        <div class="no">${no(p.n)}${k ? ` <span class="kind">${k}</span>` : ''}</div>
        <h1>${esc(p.name)}</h1>
        <div class="sub">${p.jp ? `<span class="jp">${esc(p.jp)}</span>` : ''}<span>${esc(p.genus)}</span></div>
        <div class="types">${p.types.map(typeChip).join('')}</div>
      </div>
      <div class="credit">Official artwork &copy; The Pok&eacute;mon Company</div>`;
    frame();

    // The painted picture, once there is one (make-image.ps1 may still be making today's: keep looking for a while).
    const img = document.querySelector('.painting');
    let tries = 0;
    const look = () => { img.src = `${painting(p.n)}?${Date.now()}`; };
    img.onload = () => {
      document.getElementById('stage').classList.add('painted');
      document.querySelector('.credit').textContent = 'Painted for this app';
    };
    img.onerror = () => { if (++tries < 40) setTimeout(look, 15000); };
    look();
  }

  // ---- Right screen: the Pokédex entry ----
  let framed = false;
  function entry(n) {
    if (n && byN.get(n)) mon = byN.get(n);
    const p = mon, k = kind(p), browsing = p !== todays;
    const names = ['HP', 'Attack', 'Defense', 'Sp. Atk', 'Sp. Def', 'Speed'];
    const total = p.stats.reduce((a, b) => a + b, 0);
    const stats = p.stats.map((v, i) => `<div class="stat"><span class="sn">${names[i]}</span><b>${v}</b>
      <span class="bar"><i style="width:${Math.min(100, v / 2.0)}%"></i></span></div>`).join('');

    const m = matchups(p.types);
    const group = (label, test, mark) => {
      const ts = Object.keys(m).filter(t => test(m[t]));
      return ts.length ? `<div class="mu"><span class="ml">${label}</span><span class="mt">${ts.map(t =>
        typeChip(t).replace('</span>', mark(m[t]) + '</span>')).join('')}</span></div>` : '';
    };
    const matchHtml = group('Weak to', v => v > 1, v => v >= 4 ? ' <em>×4</em>' : '')
      + group('Resists', v => v > 0 && v < 1, v => v <= 0.25 ? ' <em>×¼</em>' : '')
      + group('Not hurt by', v => v === 0, () => '');

    const fam = p.family.length > 1 ? p.family.map((stage, i) => `${i ? '<span class="arrow">→</span>' : ''}<div class="stage">${
      stage.map(x => `<div class="fm${x.n === p.n ? ' me' : ''}" data-n="${x.n}"><img alt="" src="${official(x.n)}"><span class="fn">${esc(x.name)}</span>${
        i && x.how ? `<span class="fh">${esc(x.how)}</span>` : ''}</div>`).join('')}</div>`).join('')
      : `<p class="none">${esc(p.name)} doesn’t evolve.</p>`;

    const dex = p.dex.slice(0, 3).map(d => `<blockquote>“${esc(d.text)}”<cite>Pokémon ${esc(d.game)}</cite></blockquote>`).join('')
      || '<p class="none">No Pokédex entry yet.</p>';

    document.getElementById('stage').innerHTML = `
      <div class="glow small" style="--c:${color(p)}"></div>
      <header>
        <div class="no">${no(p.n)} &middot; Generation ${ROMAN[p.gen] || p.gen}${p.region ? ` &middot; ${esc(p.region)}` : ''}${k ? ` <span class="kind">${k}</span>` : ''}</div>
        <h1>${esc(p.name)}</h1>
        <div class="genus">${esc(p.genus)}</div>
        <div class="types">${p.types.map(typeChip).join('')}
          <button class="cry" title="Play its cry">&#9654;&nbsp; Hear its cry</button></div>
      </header>
      <section class="col c1">
        <h2>The Pokédex says</h2>${dex}
        <h2>Body</h2>
        <div class="facts">
          <div><span>Height</span><b>${height(p.height)}</b></div>
          <div><span>Weight</span><b>${weight(p.weight)}</b></div>
          ${p.habitat ? `<div><span>Lives in</span><b>${esc(HABITAT[p.habitat] || p.habitat)}</b></div>` : ''}
          <div><span>Color</span><b>${esc(p.color[0].toUpperCase() + p.color.slice(1))}</b></div>
        </div>
        <h2>Abilities</h2><div class="abilities">${p.abilities.map(a => `<span>${esc(a)}</span>`).join('')}</div>
      </section>
      <section class="col c2">
        <h2>Base stats <small>total ${total}</small></h2><div class="stats" style="--c:${color(p)}">${stats}</div>
        <h2>Matchups</h2>${matchHtml}
        <h2>Family</h2><div class="family">${fam}</div>
      </section>
      <footer>${browsing
        ? `<button class="back-today"><img alt="" src="${sprite(todays.n)}"><span><small>Back to</small>Today’s Pokémon</span></button>`
        : `<div class="tomorrow"><img alt="" src="${official(next.n)}"><div><span>Tomorrow</span><b>Who’s that Pokémon?</b></div></div>`}
      </footer>`;
    if (!framed) { frame(); framed = true; addDexButton(); }
    const audio = new Audio(cry(p.n));
    document.querySelector('.cry').onclick = () => { audio.currentTime = 0; audio.play().catch(() => {}); };
    document.querySelectorAll('.fm[data-n]').forEach(el => el.onclick = () => entry(+el.dataset.n));
    const back = document.querySelector('.back-today');
    if (back) back.onclick = () => entry(todays.n);
  }

  // ---- The Pokédex: every Pokémon, region by region, as the games' pixel-art sprites ----
  const REGIONS = ['Kanto', 'Johto', 'Hoenn', 'Sinnoh', 'Unova', 'Kalos', 'Alola', 'Galar', 'Paldea'];
  const dexState = { region: 'Kanto', type: '', find: '' };
  function addDexButton() {
    document.body.insertAdjacentHTML('beforeend', '<button class="dex-open" title="Every Pokémon">Pokédex</button>');
    document.querySelector('.dex-open').onclick = () => openDex(mon.region || 'Kanto');
    const want = (location.hash.match(/dex=(\w+)/) || [])[1];
    if (want) openDex(REGIONS.includes(want) ? want : 'Kanto');
  }
  function openDex(region) {
    if (region) dexState.region = region;
    let el = document.getElementById('dex');
    if (!el) {
      el = document.createElement('div');
      el.id = 'dex';
      document.getElementById('stage').append(el);
    }
    const s = dexState, q = s.find.trim().toLowerCase();
    const list = all.filter(p => (q ? (p.name.toLowerCase().includes(q) || String(p.n) === q.replace(/^0+/, '')) : (p.region || 'Galar') === s.region)
      && (!s.type || p.types.includes(s.type)));
    const count = r => all.filter(p => (p.region || 'Galar') === r).length;
    el.innerHTML = `
      <div class="dex-head">
        <h1>Pokédex <small>${all.length.toLocaleString()} Pokémon</small></h1>
        <input class="dex-find" placeholder="Find by name or number" value="${esc(s.find)}" spellcheck="false">
        <button class="dex-close">Close</button>
      </div>
      <div class="dex-regions">${REGIONS.map((r, i) => `<button class="${!q && r === s.region ? 'on' : ''}" data-region="${r}">
        <b>${r}</b><span>Gen ${ROMAN[i + 1]} &middot; ${count(r)}</span></button>`).join('')}</div>
      <div class="dex-types"><button class="${s.type ? '' : 'on'}" data-type="">All types</button>${Object.keys(TYPE).map(t =>
        `<button class="${s.type === t ? 'on' : ''}" data-type="${t}" style="--t:${TYPE[t]}">${t[0].toUpperCase() + t.slice(1)}</button>`).join('')}</div>
      <div class="dex-grid">${list.map(p => `<button class="dex-mon${p.n === todays.n ? ' today' : ''}" data-n="${p.n}" style="--c:${color(p)}">
        <img alt="" loading="lazy" src="${sprite(p.n)}"><span class="dn">${String(p.n).padStart(4, '0')}</span><span class="dm">${esc(p.name)}</span></button>`).join('')
        || '<p class="dex-none">No Pokémon by that name.</p>'}</div>`;
    el.querySelector('.dex-close').onclick = () => el.remove();
    el.querySelectorAll('[data-region]').forEach(b => b.onclick = () => { s.find = ''; openDex(b.dataset.region); });
    el.querySelectorAll('[data-type]').forEach(b => b.onclick = () => { s.type = b.dataset.type; openDex(); });
    el.querySelectorAll('.dex-mon').forEach(b => b.onclick = () => { el.remove(); entry(+b.dataset.n); });
    const find = el.querySelector('.dex-find');
    find.oninput = () => { s.find = find.value; clearTimeout(openDex.t); openDex.t = setTimeout(() => { openDex(); const f = document.querySelector('.dex-find'); f.focus(); f.setSelectionRange(f.value.length, f.value.length); }, 250); };
  }

  return { art, entry, openDex, get mon() { return mon; }, day, next, matchups };
})();
