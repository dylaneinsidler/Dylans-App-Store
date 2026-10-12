// Aesop's Fables on a phone: the same fable as the desktop app on the same day (desktop/fables.js: one a day from start,
// in its order), with Milo Winter's picture from The Aesop for Children (1919), the story, and its moral. Below it, all
// the fables (desktop/all-fables.js: every fable of the 1919 book and of Townsend's translation, once each, numbered),
// to search and tap: #n=42 opens No. 42, with a way back to today's. thumbs/ are the list's small pictures
// (python tools/phone-photos.py "<desktop app>/images" site/apps/aesop/thumbs 160).
(function () {
  'use strict';
  const D = window.FABLES, A = window.ALL_FABLES || { count: 0, fables: [] }, q = Phone.params, html = document.documentElement;
  const all = A.fables, byN = new Map(all.map(f => [f.n, f])), byId = new Map(all.map(f => [f.id, f]));
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const file = (dir, img) => `${dir}/${esc(img.replace(/^images\//, '').replace(/\.\w+$/, '.jpg'))}`;
  const BOOK = {
    children: 'Told in <i>The Aesop for Children</i> (1919)',
    townsend: 'Translated from the Greek by George Fyler Townsend',
  };

  let theme = q.get('theme') || Phone.store.get('aesop.theme', 'dark');
  function setTheme(t) {
    theme = t === 'light' ? 'light' : 'dark';
    html.dataset.theme = theme;
    Phone.store.set('aesop.theme', theme);
    document.querySelectorAll('.d-theme button').forEach(b => b.classList.toggle('on', b.dataset.t === theme));
    document.querySelector('meta[name="theme-color"]').content = getComputedStyle(document.body).backgroundColor;
  }
  function today() {
    const p = q.get('date');
    if (p) { const [y, m, d] = p.split('-').map(Number); return new Date(y, m - 1, d); }
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  }
  // Today's fable (or ?id=), from the daily list, with its number in the whole collection.
  function todays() {
    let id = q.get('id');
    if (!(id && D.fables[id])) {
      const [y, m, d] = D.start.split('-').map(Number);
      const n = Math.round((today() - new Date(y, m - 1, d)) / 864e5);
      id = D.order[((n % D.order.length) + D.order.length) % D.order.length];
    }
    return { id, ...D.fables[id], n: (byId.get(id) || {}).n, from: 'children' };
  }
  const asked = () => byN.get(Number((location.hash.match(/n=(\d+)/) || [])[1]));

  // ---- The fable: today's, or the one tapped in the list ----
  function draw() {
    const t = todays(), picked = asked(), f = picked && picked.id !== t.id ? picked : t, browsing = f !== t;
    const pic = (f.images || [])[0], prev = byN.get(f.n - 1), next = byN.get(f.n + 1);
    document.getElementById('fable').innerHTML = `
      <div class="d-head"><div><div class="k">${browsing ? 'All the fables' : 'The fable of the day'}</div>
        <div class="date">${esc(today().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }))}</div>
        <button class="to-all" type="button">All ${A.count} fables &darr;</button></div>
        <div class="d-theme"><button data-t="light">Light</button><button data-t="dark">Dark</button></div></div>
      ${browsing ? `<a class="back" href="#"><span>&larr; Back to today&rsquo;s fable</span><b>${esc(t.title)}</b></a>` : ''}
      <div class="d-title">${f.n ? `<div class="num">No. ${f.n} of ${A.count}</div>` : ''}<h1 class="serif${f.title.length > 40 ? ' longer' : f.title.length > 26 ? ' long' : ''}">${esc(f.title)}</h1>
        <div class="sub">Aesop, about 2,600 years ago</div></div>
      ${pic ? `<div class="d-pic plate"><img src="${file('photos', pic)}" alt=""></div>
        <div class="plate-credit">Picture by Milo Winter, from <i>The Aesop for Children</i> (1919)</div>` : ''}
      <div class="story serif">${(f.story || []).map(p => `<p>${esc(p)}</p>`).join('')}</div>
      ${f.moral ? `<div class="d-card moral"><h2>The moral</h2><p class="big">${esc(f.moral)}</p></div>` : ''}
      <div class="book">${BOOK[f.from] || BOOK.children}</div>
      ${f.n ? `<div class="steps">${prev ? `<a href="#n=${prev.n}"><small>&larr; No. ${prev.n}</small>${esc(prev.title)}</a>` : '<span></span>'}
        ${next ? `<a class="r" href="#n=${next.n}"><small>No. ${next.n} &rarr;</small>${esc(next.title)}</a>` : ''}</div>` : ''}`;
    document.querySelector('.d-theme').onclick = ev => { const b = ev.target.closest('button'); if (b) setTheme(b.dataset.t); };
    document.querySelector('.to-all').onclick = () => document.getElementById('all').scrollIntoView({ behavior: 'smooth' });
    setTheme(theme);
    list();
  }

  // ---- All the fables: numbered, with a search of the titles, morals and stories ----
  // A word is found in any of its forms ("wolf" finds "wolves", "fox" finds "foxes"), and as it's typed ("gra" finds "grapes").
  const fold = s => String(s).toLowerCase().replace(/æ/g, 'ae').replace(/œ/g, 'oe').normalize('NFD')
    .replace(/[̀-ͯ]/g, '').replace(/[’‘]/g, "'");
  const ONE = { wolves: 'wolf', mice: 'mouse', geese: 'goose', oxen: 'ox', men: 'man', women: 'woman', children: 'child',
    calves: 'calf', thieves: 'thief', leaves: 'leaf', halves: 'half', knives: 'knife', lives: 'life', feet: 'foot', teeth: 'tooth' };
  function stem(w) {
    w = w.replace(/^'+|'+$/g, '').replace(/'s$/, '');
    if (ONE[w]) return ONE[w];
    if (w.length > 4 && w.endsWith('ies')) return w.slice(0, -3) + 'y';
    if (/(ss|x|ch|sh)es$/.test(w)) return w.slice(0, -2);
    return w.length > 3 && w.endsWith('s') && !w.endsWith('ss') ? w.slice(0, -1) : w;
  }
  const WORD = /[A-Za-z0-9À-ɏ’']+/g;
  const index = s => ' ' + (fold(s).match(/[a-z0-9']+/g) || []).map(stem).join(' ');
  const indexes = all.map(f => index([f.title, f.moral, ...(f.story || [])].join(' ')));
  const has = (ix, terms) => terms.every(t => ix.includes(' ' + t));
  const hit = (word, terms) => terms.some(t => stem(fold(word)).startsWith(t));
  function mark(s, terms) {
    if (!terms.length) return esc(s);
    return s.split(/([A-Za-z0-9À-ɏ’']+)/).map((p, i) => i % 2 && hit(p, terms) ? `<mark>${esc(p)}</mark>` : esc(p)).join('');
  }
  // The line under a title: its moral (or how it begins); in a search, where the words are.
  function under(f, terms) {
    const title = index(f.title), need = terms.filter(t => !title.includes(' ' + t));
    if (!need.length || (f.moral && has(index(f.moral), need))) return mark(f.moral || (f.story || [''])[0], terms);
    const text = (f.story || []).join(' ');
    let at = -1;
    for (const m of text.matchAll(WORD)) if (hit(m[0], need)) { at = m.index; break; }
    if (at < 0) return mark(f.moral || text, terms);
    const from = at > 40 ? text.lastIndexOf(' ', at - 40) + 1 : 0;
    return (from ? '&hellip;' : '') + mark(text.slice(from, from + 160), terms) + '&hellip;';
  }
  let find = '';
  function list() {
    const t = todays(), open = asked(), number = /^\s*(no\.?\s*)?\d+\s*$/i.test(find) ? Number(find.replace(/\D/g, '')) : 0;
    const terms = number ? [] : (fold(find).match(/[a-z0-9']+/g) || []).map(stem).filter(Boolean);
    const hits = number ? all.filter(f => f.n === number) : all.filter((f, i) => has(indexes[i], terms));
    document.getElementById('found').textContent = !find.trim() ? `Numbered 1 to ${A.count}. Tap one to read it.`
      : hits.length ? `${hits.length} fable${hits.length === 1 ? '' : 's'}` : 'No fable has that. Try another word.';
    document.getElementById('rows').innerHTML = hits.map(f => {
      const img = (f.images || [])[0], isToday = f.id === t.id;
      return `<a class="row${isToday ? ' today' : ''}${open && open.n === f.n && !isToday ? ' open' : ''}" href="#n=${f.n}">
        <span class="no">${f.n}</span><span class="what"><b>${mark(f.title, terms)}</b>${isToday ? '<em>Today</em>' : ''}
        <small>${under(f, terms)}</small></span>${img ? `<img src="${file('thumbs', img)}" alt="" loading="lazy">` : '<i></i>'}</a>`;
    }).join('');
  }
  document.getElementById('all').innerHTML = `
    <div class="screen-name">All the fables &middot; ${A.count}</div>
    <input class="find" id="find" type="search" placeholder="Search titles, morals and words" spellcheck="false"
      autocomplete="off" enterkeyhint="search">
    <div class="found" id="found"></div>
    <div class="rows" id="rows"></div>
    <p class="books">Every fable from two public-domain books, each one once. Numbers 1&ndash;147 are <i>The Aesop for
      Children</i> (1919), with Milo Winter&rsquo;s pictures; the rest are from George Fyler Townsend&rsquo;s translation,
      <i>Three Hundred &AElig;sop&rsquo;s Fables</i>.</p>`;
  const box = document.getElementById('find');
  box.oninput = () => { find = box.value; clearTimeout(list.t); list.t = setTimeout(list, 120); };
  box.onkeydown = e => { if (e.key === 'Enter') box.blur(); };
  if (q.get('find')) find = box.value = q.get('find');

  addEventListener('hashchange', () => { draw(); scrollTo({ top: 0, behavior: 'smooth' }); });
  draw();
  if (q.get('list') != null) document.getElementById('all').scrollIntoView();
  let shown = today().toDateString();
  setInterval(() => { if (today().toDateString() !== shown) { shown = today().toDateString(); draw(); } }, 60e3);
})();
