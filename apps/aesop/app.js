// Aesop's Fables on a phone: the same fable as the desktop app on the same day (desktop/fables.js: one a day from start,
// in its order), with Milo Winter's picture from The Aesop for Children (1919), the story, and its moral.
(function () {
  'use strict';
  const D = window.FABLES, q = Phone.params, html = document.documentElement;
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

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
  function fableFor(date) {
    const [y, m, d] = D.start.split('-').map(Number);
    const n = Math.round((date - new Date(y, m - 1, d)) / 864e5);
    const id = D.order[((n % D.order.length) + D.order.length) % D.order.length];
    return { id, ...D.fables[id] };
  }
  function draw() {
    const day = today(), id = q.get('id'), f = id && D.fables[id] ? { id, ...D.fables[id] } : fableFor(day);
    const next = fableFor(new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1));
    const pic = (f.images || [])[0];
    document.getElementById('fable').innerHTML = `
      <div class="d-head"><div><div class="k">The fable of the day</div>
        <div class="date">${esc(day.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }))}</div></div>
        <div class="d-theme"><button data-t="light">Light</button><button data-t="dark">Dark</button></div></div>
      <div class="d-title"><h1 class="serif">${esc(f.title)}</h1><div class="sub">Aesop, about 2,600 years ago</div></div>
      ${pic ? `<div class="d-pic plate"><img src="photos/${esc(pic.replace(/^images\//, '').replace(/\.\w+$/, '.jpg'))}" alt=""></div>
        <div class="plate-credit">Picture by Milo Winter, from <i>The Aesop for Children</i> (1919)</div>` : ''}
      <div class="story serif">${(f.story || []).map(p => `<p>${esc(p)}</p>`).join('')}</div>
      <div class="d-card moral"><h2>The moral</h2><p class="big">${esc(f.moral)}</p></div>
      <div class="d-next"><div>Tomorrow<b>${esc(next.title)}</b></div></div>`;
    document.querySelector('.d-theme').onclick = ev => { const b = ev.target.closest('button'); if (b) setTheme(b.dataset.t); };
    setTheme(theme);
  }
  draw();
  let shown = today().toDateString();
  setInterval(() => { if (today().toDateString() !== shown) { shown = today().toDateString(); draw(); } }, 60e3);
})();
