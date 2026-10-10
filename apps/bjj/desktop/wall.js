// What both screens share: fitting the page to the monitor, closing with Esc or the ✕ button, the
// Light / Dark switch, saved settings, and the link that lets the two screens talk.
//
// The link: launch.ps1 runs a tiny web server on this PC only (nothing goes on the internet). Each
// screen sends it messages, and it passes them on to the other screen. Opened any other way (say, by
// double-clicking bjj.html), each screen still works on its own.
(function (global) {
  'use strict';

  const me = Math.random().toString(36).slice(2);
  const handlers = {};
  const lastSeq = {};
  let seq = 0;
  const live = location.protocol === 'http:';

  if (live) {
    const events = new EventSource('events');
    events.onmessage = e => {
      let m;
      try { m = JSON.parse(e.data); } catch (err) { return; }
      if (!m || m.from === me) return;
      // Messages can arrive out of order; only the newest of each kind from each screen counts.
      const key = `${m.from}|${m.type}`;
      if (m.seq <= (lastSeq[key] || 0)) return;
      lastSeq[key] = m.seq;
      (handlers[m.type] || []).forEach(h => h(m.data));
    };
  }

  function on(type, handler) { (handlers[type] = handlers[type] || []).push(handler); }

  function send(type, data) {
    if (!live) return;
    fetch('send', { method: 'POST', body: JSON.stringify({ type, data, from: me, seq: ++seq }) }).catch(() => {});
  }

  // Asks launch.ps1 to close both screens. If it isn't running, just close this one.
  function quit() {
    if (live) fetch('quit', { method: 'POST' }).catch(() => {});
    setTimeout(() => global.close(), 600);
  }

  // ---- Settings (Light / Dark, which rules you compete under), shared by both screens ----
  // launch.ps1 keeps them in settings.json in AppData. Without it, they last until the window closes.
  const settings = { theme: 'dark', rules: 'ibjjf-gi', level: 0 };
  const settingsReady = (live ? fetch('settings', { cache: 'no-store' }).then(r => r.json()).catch(() => ({})) : Promise.resolve({}))
    .then(saved => { Object.assign(settings, saved || {}); applyTheme(); return settings; });

  function setSetting(key, value, fromOther) {
    settings[key] = value;
    if (key === 'theme') applyTheme();
    (handlers['setting:' + key] || []).forEach(h => h(value));
    if (!fromOther) {
      send('setting', { key, value });
      if (live) fetch('settings', { method: 'POST', body: JSON.stringify(settings) }).catch(() => {});
    }
  }
  on('setting', d => setSetting(d.key, d.value, true));

  function applyTheme() {
    document.documentElement.dataset.theme = settings.theme === 'light' ? 'light' : 'dark';
    document.querySelectorAll('.theme-switch span').forEach(s => s.classList.toggle('on', s.dataset.theme === settings.theme));
  }

  // The pages are laid out for a 1920 x 1080 monitor; scale to whatever size the window really is.
  function fit() {
    const stage = document.getElementById('stage');
    if (!stage) return;
    const scale = Math.min(innerWidth / 1920, innerHeight / 1080);
    stage.style.transform = `translate(${(innerWidth - 1920 * scale) / 2}px, ${(innerHeight - 1080 * scale) / 2}px) scale(${scale})`;
  }

  // A light film grain over everything, like Co-Star's photos. Made once, on the spot.
  function grain() {
    const c = document.createElement('canvas');
    c.width = c.height = 160;
    const g = c.getContext('2d'), img = g.createImageData(160, 160);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.random() * 255;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 20;
    }
    g.putImageData(img, 0, 0);
    document.documentElement.style.setProperty('--grain', `url(${c.toDataURL()})`);
  }

  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !e.target.matches('input')) quit(); });
  document.addEventListener('contextmenu', e => e.preventDefault());
  // No accidental zooming with Ctrl + mouse wheel.
  document.addEventListener('wheel', e => { if (e.ctrlKey) e.preventDefault(); }, { passive: false });
  addEventListener('resize', fit);
  addEventListener('DOMContentLoaded', () => {
    fit();
    grain();
    applyTheme();
    const close = document.getElementById('close');
    if (close) close.addEventListener('click', quit);
    document.querySelectorAll('.theme-switch span').forEach(s =>
      s.addEventListener('click', () => setSetting('theme', s.dataset.theme)));
  });

  global.Link = { on, send, quit, live, settings, settingsReady, setSetting,
    onSetting: (key, h) => on('setting:' + key, h) };
})(window);
