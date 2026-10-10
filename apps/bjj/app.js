// Dylan's Jiu-Jitsu & Judo on a phone: the desktop app's own code (desktop/app.js and the rest of desktop/), one
// discipline at a time with a switch at the top (?d=judo for judo). On the PC, the two screens share their settings
// and cross-links through a little server; here the settings (Light / Dark, your rulebook and level) are kept on the
// phone, and a link to the other discipline opens it.
(function () {
  'use strict';
  const d = Phone.params.get('d') === 'judo' ? 'judo' : 'bjj';
  const KEY = 'jj.settings';

  Object.assign(Link.settings, Phone.store.get(KEY, {}));
  const save = () => Phone.store.set(KEY, { theme: Link.settings.theme, rules: Link.settings.rules, level: Link.settings.level });
  ['theme', 'rules', 'level'].forEach(k => Link.onSetting(k, save));

  // "Judo · O-soto-gari ↗" on a jiu-jitsu technique (and the other way round) opens it on the other side.
  Link.send = (type, data) => {
    if (type === 'open' && data) location.href = `?d=${data.discipline}#id=${encodeURIComponent(data.id)}`;
  };

  document.querySelectorAll('[data-d]').forEach(b => {
    b.classList.toggle('on', b.dataset.d === d);
    b.addEventListener('click', () => { if (b.dataset.d !== d) location.href = `?d=${b.dataset.d}`; });
  });

  // The Library's filters are tucked away behind a button (they'd fill the phone otherwise).
  document.getElementById('filters-btn').addEventListener('click', () => document.body.classList.toggle('filters'));

  App.start(d, d === 'bjj' ? BJJ_DATA : JUDO_DATA, d === 'bjj' ? JUDO_DATA : BJJ_DATA);

  // Each change of view starts at the top of the page.
  new MutationObserver(() => { if (!document.activeElement || !document.activeElement.matches('#q')) scrollTo(0, 0); })
    .observe(document.getElementById('main'), { childList: true });
})();
