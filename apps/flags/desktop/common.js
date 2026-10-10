// What both screens share: the countries (flags.js), the flag of the day, how numbers are written, the money ladder,
// and Light / Dark. table.html (left) is where you click; teacher.html (right) explains it.
window.Flags = (() => {
  const all = window.FLAGS || [];
  const byCode = new Map(all.map(c => [c.code, c]));
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const flag = code => `flags/${code}.svg`;
  const params = new URLSearchParams(location.search);
  const REGIONS = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  // ---- The day, and its flag: a shuffled order (seeded), every flag once before any repeats ----
  function today() {
    const p = params.get('date');
    if (p) { const [y, m, d] = p.split('-').map(Number); return new Date(y, m - 1, d); }
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  }
  const START = new Date(2026, 9, 10);
  const random = seed => () => {   // mulberry32: a small, steady random number maker
    seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
  function shuffle(list, next) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(next() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  function flagOfDay(date = today()) {
    const day = Math.round((date - START) / 864e5), n = all.length, r = Math.floor(day / n);
    const order = shuffle(all.map(c => c.code), random(4241 * r + 77));
    return byCode.get(order[((day % n) + n) % n]);
  }

  // ---- Numbers in words people use ----
  const people = n => n == null ? 'not counted' : n >= 1e9 ? `${(n / 1e9).toFixed(n >= 1e10 ? 0 : 2)} billion` : n >= 1e6 ? `${(n / 1e6).toFixed(n >= 1e8 ? 0 : 1)} million`
    : n >= 1e4 ? `${Math.round(n / 1e3)} thousand` : n.toLocaleString('en-US');
  const sqmi = km => km == null ? '' : `${Math.round(km * 0.386102).toLocaleString('en-US')} sq mi`;
  const list = xs => xs.length < 2 ? (xs[0] || '') : xs.length === 2 ? xs.join(' and ') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`;
  const money = n => '$' + n.toLocaleString('en-US');

  // ---- The 50-flag game's money ladder: $100 up to $1 million, in round amounts; safe at 10, 25 and 40 ----
  // 50 rungs need more than the usual round numbers, so these come in finer steps; each rung is the round amount nearest
  // a smooth climb from $100 to $1,000,000, always more than the one before.
  const NICE = [1, 1.1, 1.25, 1.4, 1.5, 1.75, 2, 2.25, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 7.5, 8, 9];
  const ROUND = [2, 3, 4, 5].flatMap(e => NICE.map(v => Math.round(v * Math.pow(10, e)))).concat(1000000);
  const LADDER = (() => {
    const out = [];
    for (let i = 0; i < 50; i++) {
      const target = 100 * Math.pow(10000, i / 49), prev = out[out.length - 1] || 0;
      const left = ROUND.filter(v => v > prev);
      out.push(i === 49 ? 1000000 : left.reduce((a, b) => Math.abs(b - target) < Math.abs(a - target) ? b : a));
    }
    return out;
  })();
  const SAFE = [10, 25, 40];   // question numbers (1-50) whose money you keep

  // ---- Light / Dark, the same on both screens (each remembers it; a change goes to the other through Link) ----
  const asked = params.get('theme');
  let theme = 'dark';
  try { theme = asked || localStorage.getItem('flags-theme') || 'dark'; } catch (e) { /* default */ }
  function setTheme(t, tell = true) {
    theme = t === 'light' ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('flags-theme', theme); } catch (e) { /* fine */ }
    document.querySelectorAll('.theme-switch span').forEach(s => s.classList.toggle('on', s.dataset.pick === theme));
    if (tell && window.Link) Link.send('theme', { theme });
  }
  function themeSwitch() {
    document.getElementById('stage').insertAdjacentHTML('beforeend',
      '<div class="theme-switch"><span data-pick="light">Light</span><span data-pick="dark">Dark</span></div>');
    document.querySelector('.theme-switch').onclick = e => setTheme(e.target.dataset.pick || (theme === 'dark' ? 'light' : 'dark'));
    setTheme(theme, false);
    if (window.Link) Link.on('theme', d => setTheme(d.theme, false));
  }

  return { all, byCode, esc, flag, params, REGIONS, today, flagOfDay, random, shuffle, people, sqmi, list, money, LADDER, SAFE, setTheme, themeSwitch, get theme() { return theme; } };
})();
