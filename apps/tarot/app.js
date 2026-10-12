// Dylan's Tarot on a phone. Everything it says comes from the desktop app's own files (desktop/): the
// 78 cards' meanings, the spreads, the lessons, the famous pairs, and the way a reading is read
// (TarotReading.analyze, the same teacher the right screen uses). This lays it out for a phone:
// the card of the day and a reading on top (the table), the lessons and every card below (the teacher).
(function () {
  'use strict';
  const D = window.TAROT_DATA, S = window.TAROT_SPREADS, LESSONS = window.TAROT_LESSONS, R = window.TarotReading;
  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ALL = D.CARDS.map(c => c.id);
  // The decks (desktop/decks.js), as on the PC's Deck button. The classic deck has its big pictures; the others come
  // as their 280 x 480 copies, to keep the app small. The choice is kept on the phone.
  // The Cyberpunk 2077 deck is the game's art: on Dylan's PC only, never in this public store.
  const DECKS = (window.TAROT_DECKS || []).filter(d => d.id !== 'cyberpunk').concat(window.TAROT_DECKS ? [] : [{ id: 'classic', name: 'Classic', made: 'London, 1909', sample: 'm01' }]);
  let deck = DECKS.find(x => x.id === (Phone.params.get('deck') || Phone.store.get('tarot.deck', 'classic'))) || DECKS[0];
  const img = (id, small, dk = deck) => dk.id === 'classic' ? `desktop/decks/classic/${small ? 'small/' : ''}${id}.jpg`
    : `desktop/decks/${dk.id}/small/${id}.jpg`;
  // What a card looks like in this deck, its name on the card, and a trick for remembering it (as common.js does).
  const ROMAN = ['0', 'I', 'II', 'III', 'IIII', 'V', 'VI', 'VII', 'VIII', 'VIIII', 'X', 'XI', 'XII', 'XIII', 'XIIII', 'XV',
    'XVI', 'XVII', 'XVIII', 'XVIIII', 'XX', 'XXI'];
  const look = {
    pic: c => deck.pics ? (deck.pics[c.id] || deck.pips?.[c.id] || (c.major ? c.pic : c.court ? (deck.court ? deck.court(c) : c.pic) : deck.pip(c))) : c.pic,
    tip: c => {
      if (deck.tipPrefix && c.major) return deck.tipPrefix + c.tip;
      if (!deck.tips || c.major && !deck.tips[c.id]) return c.tip;
      if (c.major) return deck.tips[c.id];
      const f = D.formula(c);
      return `${f.rank} = ${f.rankMeans}, ${f.suit} = ${f.suitMeans}: ${c.keys.join(', ')}.`;
    },
    localName: c => deck.localName ? (c.major ? deck.names?.[c.id] : deck.localName(c)) || '' : '',
  };
  const saved = Phone.store.get('tarot.progress', { lessons: {} });
  const save = () => Phone.store.set('tarot.progress', saved);

  // A card, sized by its box: `w` in pixels, or 'fill' to fill its container's width.
  function cardHTML(id, w, { rev = false, down = false, small = true, attrs = '' } = {}) {
    const size = w === 'fill' ? 'width:100%;aspect-ratio:700/1200' : `width:${w}px;height:${Math.round(w * 1200 / 700)}px`;
    const face = id && id !== 'back' ? `<img src="${img(id, small)}" alt="" draggable="false" loading="lazy">` : '';
    const cls = ['tc', down || !face ? 'down' : '', rev ? 'rev' : ''].filter(Boolean).join(' ');
    return `<div class="${cls}" style="${size}" ${attrs}><div class="tc-in"><div class="tc-front">${face}</div><div class="tc-back"></div></div></div>`;
  }

  // ---------------------------------------------------------------- The sheet (a card, or a lesson)
  const sheet = $('sheet');
  function openSheet(html) {
    $('sheet-body').innerHTML = html;
    sheet.classList.add('open');
    sheet.setAttribute('aria-hidden', 'false');
    sheet.scrollTop = 0;
  }
  function closeSheet() { sheet.classList.remove('open'); sheet.setAttribute('aria-hidden', 'true'); }
  sheet.querySelector('.sheet-close').addEventListener('click', closeSheet);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSheet(); });

  // A card's full meaning, as the desktop app's right screen explains it.
  function showCard(id, rev = false, ctx = '') {
    const c = D.byId[id], f = D.formula(c);
    const eyebrow = c.major ? `Big card · number ${c.n} · ${c.element} · linked to ${c.astro}`
      : `${D.SUITS[c.suit].name} · ${D.SUITS[c.suit].element} · ${c.court ? 'a people card' : 'an everyday card'}`;
    openSheet(`
      <div class="detail-top">
        ${cardHTML(id, 120, { rev, small: false })}
        <div>
          ${ctx ? `<div class="eyebrow" style="color:var(--gold)">${esc(ctx)}</div>` : ''}
          <div class="eyebrow">${esc(eyebrow)}</div>
          <h2>${esc(c.name)}${rev ? '<span class="tag">upside down</span>' : ''}</h2>
          ${look.localName(c) ? `<div class="local">${esc(deck.nameLabel || `In ${deck.lang || 'its own language'}`)}: <i>${esc(look.localName(c))}</i>${c.major && deck.id !== 'classic' ? ` &middot; ${esc((deck.numbers && deck.numbers[c.id]) || ROMAN[c.n])}` : ''}</div>` : ''}
          <div class="keys">${esc((rev ? c.revKeys : c.keys).join(' · '))}</div>
          ${f ? `<div class="formula"><b>${f.rank}</b> = ${esc(f.rankMeans)} + <b>${f.suit}</b> = ${esc(f.suitMeans)}</div>` : ''}
        </div>
      </div>
      <div class="meanings">
        <h3>Right side up</h3><p>${esc(D.RANKS && c.up ? cap(c.up) : '')}.</p>
        <div class="keys">${esc(c.keys.join(' · '))}</div>
        <h3>Upside down</h3><p>${esc(cap(c.rev))}.</p>
        <div class="keys">${esc(c.revKeys.join(' · '))}</div>
        <h3>In the picture${deck.id === 'classic' ? '' : ` <small>(${esc(deck.name)} deck)</small>`}</h3><p>${esc(look.pic(c))}</p>
        <h3>To remember it</h3><p>${esc(look.tip(c))}</p>
        <h3>Try saying</h3><p>“${esc(rev ? `This one came out upside down, and that points to ${c.rev}.` : c.say)}”</p>
      </div>`);
  }
  const cap = s => String(s).charAt(0).toUpperCase() + String(s).slice(1);

  // ---------------------------------------------------------------- Card of the day
  // The same card the desktop app shows today (it's picked from the date).
  function hash(text) {
    let h = 2166136261;
    for (const ch of text) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
    return h >>> 0;
  }
  const d = new Date(), key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`, h = hash(`${key}|Dylan`);
  const cotd = { id: ALL[h % 78], rev: (h >>> 8) % 3 === 0 };
  const turned = saved.cotd === key;
  function drawCotd(open) {
    const c = D.byId[cotd.id];
    $('cotd').innerHTML = `${cardHTML(cotd.id, 112, { rev: cotd.rev, down: !open, attrs: 'id="cotd-card"' })}
      <div class="cotd-text">${open
        ? `<div class="eyebrow">Today's card</div><h2>${esc(c.name)}${cotd.rev ? '<span class="tag">upside down</span>' : ''}</h2>
           <div class="keys">${esc((cotd.rev ? c.revKeys : c.keys).join(' · '))}</div>
           <p>${esc(cotd.rev ? `Upside down, it points to ${c.rev}.` : c.say)}</p>
           <button class="link" id="cotd-more">All about this card ›</button>`
        : `<p class="hint">One card for today. Take a breath, think about the day ahead, then tap the card to turn it over.</p>`}</div>`;
    $('cotd-card').addEventListener('click', () => {
      if (!open) { saved.cotd = key; save(); drawCotd(true); } else showCard(cotd.id, cotd.rev, 'Card of the day');
    });
    $('cotd-more')?.addEventListener('click', () => showCard(cotd.id, cotd.rev, 'Card of the day'));
  }
  drawCotd(turned || Phone.params.has('open'));

  // ---------------------------------------------------------------- A reading
  const SPREADS = ['one', 'ppf', 'sao', 'rel', 'choice', 'cross'];
  const TOPICS = [['', 'Anything'], ['love', 'Love'], ['work', 'Work'], ['money', 'Money'], ['decision', 'A decision']];
  let spread = Phone.params.get('spread') || 'ppf', topic = '', dealt = null;

  function chips(el, items, current, pick) {
    el.innerHTML = items.map(([id, name]) => `<button data-id="${id}" class="${id === current ? 'on' : ''}">${esc(name)}</button>`).join('');
    el.onclick = e => { const b = e.target.closest('button'); if (b) pick(b.dataset.id); };
  }
  function drawChoices() {
    chips($('spreads'), SPREADS.map(id => [id, S.SPREADS[id].short]), spread, id => { spread = id; dealt = null; drawChoices(); drawTable(); });
    chips($('topics'), TOPICS, topic, id => { topic = id; drawChoices(); drawReading(); });
  }

  function deal() {
    const deck = [...ALL];
    for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]; }
    dealt = S.SPREADS[spread].spots.map((_, i) => ({ id: deck[i], rev: Math.random() < 1 / 3, up: false }));
    drawTable();
  }
  $('deal').addEventListener('click', deal);

  function drawTable() {
    if (!dealt) { $('layout').innerHTML = ''; $('reading').innerHTML = ''; $('deal').textContent = 'Shuffle and deal'; return; }
    $('deal').textContent = 'Shuffle and deal again';
    const names = R.spotNames(spread);
    $('layout').innerHTML = dealt.map((c, i) => `<div class="slot">
        ${cardHTML(c.id, 'fill', { rev: c.rev, down: !c.up, attrs: `data-i="${i}"` })}
        <div class="nm"><b>${i + 1}. ${esc(names[i])}</b>${c.up ? esc(D.byId[c.id].name) + (c.rev ? ' (upside down)' : '') : 'tap to turn'}</div>
      </div>`).join('');
    $('layout').onclick = e => {
      const t = e.target.closest('.tc[data-i]');
      if (!t) return;
      const c = dealt[+t.dataset.i];
      if (!c.up) { c.up = true; drawTable(); } else showCard(c.id, c.rev, `${+t.dataset.i + 1}. ${names[+t.dataset.i]}`);
    };
    drawReading();
  }

  // The reading, as the teacher reads it: the whole table, each card in its spot, the story.
  function drawReading() {
    if (!dealt) return;
    const A = R.analyze({ spread, topic: topic || null, cards: dealt.map(c => c.up ? { id: c.id, rev: c.rev } : null) });
    if (!A.count) { $('reading').innerHTML = `<p class="turn-hint">Turn the cards over one at a time, in order.</p>`; return; }
    const pats = A.patterns.length ? A.patterns.map(p => `<p><b>${esc(p.title)}.</b> ${esc(p.text)}</p>`).join('')
      : `<p>${A.spots.length < 3 ? 'With just one card, go straight to the card.' : 'Nothing jumps out, so read each card on its own.'}</p>`;
    const spots = A.spots.filter(s => !s.empty).map(s => `<div class="spot">
        ${cardHTML(s.card.id, 70, { rev: s.rev })}
        <div>
          <div class="eyebrow">Spot ${s.i + 1} · ${esc(s.name)}</div>
          <div class="q">${esc(s.spot.q)}</div>
          <h4>${esc(s.card.name)}${s.rev ? '<span class="tag">upside down</span>' : ''}</h4>
          <div class="keys">${esc(s.keys.join(' · '))}</div>
          <p>Here, it points to ${esc(s.meaning)}.</p>
          ${s.topic ? `<p>${esc(s.topic)}</p>` : ''}
          <p class="q">${esc(s.spot.how)}</p>
          ${s.pairs.map(p => `<p><b>With ${esc(p.other.card.name)}:</b> ${esc(p.text)}</p>`).join('')}
          <p class="say">“${esc(s.say)}”</p>
        </div></div>`).join('');
    $('reading').innerHTML = `
      ${A.complete ? '' : `<p class="turn-hint">${A.spots.length - A.count} more to turn over.</p>`}
      <div class="block"><h3>First, the whole table</h3>${pats}</div>
      ${A.pairs.length ? `<div class="block"><h3>Famous pairs here</h3>${A.pairs.map(p => `<p><b>${esc(p.a.card.name)} + ${esc(p.b.card.name)}:</b> ${esc(p.text)}</p>`).join('')}</div>` : ''}
      <div class="block"><h3>Card by card</h3>${spots}</div>
      ${A.summary ? `<div class="block"><h3>Put it together</h3><p class="summary">${esc(A.summary)}</p></div>` : ''}`;
  }
  drawChoices();
  drawTable();

  // ---------------------------------------------------------------- The deck picker
  function drawDecks() {
    $('decks').innerHTML = DECKS.map(x => `<button class="deck${x.id === deck.id ? ' on' : ''}" data-deck="${x.id}">
        <img src="${img(x.sample || 'm01', true, x)}" alt="" loading="lazy"><b>${esc(x.name)}</b><span>${esc(x.made || '')}</span></button>`).join('');
    const on = $('decks').querySelector('.on');   // keep the chosen deck in view
    if (on) $('decks').scrollLeft = on.offsetLeft - $('decks').offsetLeft - 8;
    $('deck-about').innerHTML = `${esc(deck.about || '')}${deck.by ? ` <span class="by">${esc(deck.by)}</span>` : ''}`;
  }
  $('decks').addEventListener('click', e => {
    const b = e.target.closest('[data-deck]');
    if (!b || b.dataset.deck === deck.id) return;
    deck = DECKS.find(x => x.id === b.dataset.deck) || DECKS[0];
    Phone.store.set('tarot.deck', deck.id);
    drawDecks(); drawCotd(saved.cotd === key || Phone.params.has('open')); drawTable(); drawCards();
  });
  drawDecks();

  // ---------------------------------------------------------------- Lessons
  // The lessons talk about "the left screen" (where the desktop app shows their cards); here the cards
  // are right above the words.
  const here = s => s.replace(/on the left screen/gi, 'above').replace(/the left screen/gi, 'the cards above');
  function bodyHTML(body) {
    return body.map(b => typeof b === 'string' ? `<p>${here(b)}</p>`
      : b.points ? `<ul>${b.points.map(p => `<li>${here(p)}</li>`).join('')}</ul>`
      : b.table ? `<table>${b.table.map(([l, r]) => `<tr><td>${l}</td><td>${r}</td></tr>`).join('')}</table>` : '').join('');
  }
  function stepCards(st) {
    const items = st.spread
      ? st.spread.cards.map((id, i) => ({ id, label: R.spotNames(st.spread.id)[i] }))
      : (st.cards || []).map(id => ({ id }));
    return items.map(({ id, label }) => {
      const [cid, r] = String(id).split(':');
      const name = cid === 'back' ? '' : D.byId[cid]?.name || '';
      return `<div class="c">${cardHTML(cid, 92, { rev: r === 'r', attrs: cid !== 'back' ? `data-card="${cid}" data-rev="${r === 'r' ? 1 : ''}"` : '' })}${esc(label ? `${label}: ${name}` : name)}</div>`;
    }).join('');
  }
  function showLesson(li, si = 0) {
    const L = LESSONS[li], st = L.steps[si], last = si === L.steps.length - 1;
    openSheet(`
      <div class="eyebrow">Lesson ${li + 1} · step ${si + 1} of ${L.steps.length}</div>
      <h1>${esc(st.title)}</h1>
      <div class="lesson-cards">${stepCards(st)}</div>
      <div class="lesson-text">${bodyHTML(st.body || [])}</div>
      <div class="stepper">
        <button class="pill" id="prev" ${si ? '' : 'disabled'}>‹ Back</button>
        <span>${esc(L.title)}</span>
        <button class="pill solid" id="next">${last ? (li < LESSONS.length - 1 ? 'Next lesson ›' : 'Done') : 'Next ›'}</button>
      </div>`);
    $('sheet-body').querySelector('.lesson-cards').onclick = e => {
      const t = e.target.closest('[data-card]');
      if (t) showCard(t.dataset.card, !!t.dataset.rev, L.title);
    };
    $('prev').onclick = () => showLesson(li, si - 1);
    $('next').onclick = () => {
      if (!last) return showLesson(li, si + 1);
      saved.lessons[li] = true; save(); drawLessons();
      if (li < LESSONS.length - 1) showLesson(li + 1, 0); else closeSheet();
    };
  }
  function drawLessons() {
    $('lessons').innerHTML = LESSONS.map((L, i) => `<li data-i="${i}" class="${saved.lessons[i] ? 'done' : ''}">
      <div><div class="t">${esc(L.title)}</div><div class="b">${esc(L.blurb || '')}</div></div><span class="go">›</span></li>`).join('');
  }
  $('lessons').addEventListener('click', e => { const li = e.target.closest('li[data-i]'); if (li) showLesson(+li.dataset.i); });
  drawLessons();

  // ---------------------------------------------------------------- All 78 cards
  const GROUPS = [['major', 'Big cards'], ...Object.entries(D.SUITS).map(([k, s]) => [k, s.name])];
  let group = 'major';
  function drawCards() {
    chips($('suits'), GROUPS, group, g => { group = g; drawCards(); });
    const ids = group === 'major' ? D.MAJORS : D.suitIds(group);
    $('cards').innerHTML = ids.map(id => `<div class="c" data-card="${id}">${cardHTML(id, 'fill')}${esc(D.byId[id].name)}</div>`).join('');
  }
  $('cards').addEventListener('click', e => { const c = e.target.closest('[data-card]'); if (c) showCard(c.dataset.card); });
  drawCards();

  // For the store's screenshots (tools/shots.mjs): ?deal turns a reading over; ?card=m17 opens a card;
  // ?lesson=1 opens a lesson.
  const p = Phone.params;
  if (p.has('deal')) { deal(); dealt.forEach(c => { c.up = true; }); drawTable(); }
  if (p.get('card')) showCard(p.get('card'));
  if (p.get('lesson')) showLesson(+p.get('lesson') - 1);
})();
