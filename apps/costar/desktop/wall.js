// Shared by both screens: fitting the 1920×1080 stage to the monitor, the perspective grid behind it,
// click-to-close, the Light / Dark switch, the "How to read this" guide, daily reloads, planet symbols, date formats, and the grainy
// black-and-white planet pictures, which are drawn here dot by dot rather than loaded from image files.
window.StarWall = (() => {
  const cfg = window.STAR_WALL;
  const NS = 'http://www.w3.org/2000/svg';

  // Light or dark: ?theme= in the address (screenshots.ps1 uses it), else the last choice made with the
  // switch (theme.js, saved by launch.ps1), else config.js.
  const askedTheme = new URLSearchParams(location.search).get('theme');
  let theme = (askedTheme || window.STAR_WALL_THEME || cfg.theme) === 'light' ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;

  const glyph = StarAstro.glyph;

  const fmtTime = d => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const fmtDay = d => d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  const fmtWeekday = d => d.toLocaleDateString('en-US', { weekday: 'long' });
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // ---- Stage and background ----

  let scale = 1;
  const scaleListeners = [];
  function fit() {
    // The phone version (Dylan's App Store) lays the screens out itself, at full size: <html class="flow">.
    if (document.documentElement.classList.contains('flow')) { scale = 1; return; }
    scale = Math.min(innerWidth / 1920, innerHeight / 1080);
    document.getElementById('stage').style.transform = `translate(-50%, -50%) scale(${scale})`;
    drawGrid();
    scaleListeners.forEach(f => f(scale));
  }

  // Faint lines receding toward the middle of the screen, like the Co-Star site's backdrop.
  function drawGrid() {
    let svg = document.getElementById('grid');
    if (!svg) {
      svg = document.createElementNS(NS, 'svg');
      svg.id = 'grid';
      document.body.prepend(svg);
    }
    const W = innerWidth, H = innerHeight, cx = W / 2, cy = H / 2, far = 7;
    const parts = [1, 1.4, 2, 3, 4.6, far].map(z =>
      `<rect x="${cx - W / 2 / z}" y="${cy - H / 2 / z}" width="${W / z}" height="${H / z}"/>`);
    const toward = (x, y) => `<line x1="${x}" y1="${y}" x2="${cx + (x - cx) / far}" y2="${cy + (y - cy) / far}"/>`;
    for (let i = 0; i <= 8; i++) {
      parts.push(toward(W * i / 8, 0), toward(W * i / 8, H));
      if (i > 0 && i < 8) parts.push(toward(0, H * i / 8), toward(W, H * i / 8));
    }
    svg.innerHTML = parts.join('');
  }

  function start() {
    addEventListener('resize', fit);
    fit();
    addThemeSwitch();
    // An X in the window's top right corner closes both screens (as a click anywhere does).
    const x = document.createElement('div');
    x.className = 'close-x';
    x.title = 'Close';
    x.textContent = '✕';
    document.body.append(x);
    // Show everything once the fonts are in, so nothing jumps.
    document.fonts.ready.then(() => requestAnimationFrame(() => document.body.classList.add('ready')));
  }

  // ---- Light / Dark ----

  const painters = [];   // redraws for the planet pictures, whose dots depend on the theme
  const baseTitle = document.title;

  function setTheme(t) {
    theme = t;
    document.documentElement.dataset.theme = t;
    // launch.ps1 watches the window title and passes the change to the other screen.
    document.title = `${baseTitle} (${t})`;
    document.querySelectorAll('.theme-switch span').forEach(s => s.classList.toggle('on', s.dataset.pick === t));
    painters.forEach(draw => draw());
  }

  function addThemeSwitch() {
    const el = document.createElement('div');
    el.className = 'theme-switch';
    el.innerHTML = '<span data-pick="light">Light</span><span data-pick="dark">Dark</span>';
    el.addEventListener('click', e => {
      e.stopPropagation();   // this click switches the theme; it doesn't close the screen
      setTheme(e.target.dataset.pick || (theme === 'dark' ? 'light' : 'dark'));
    });
    document.getElementById('stage').append(el);
    setTheme(theme);
  }

  // The other screen's switch reaches this one through theme.js, checked every second. (Only on the PC,
  // where the pages are files; the phone version has no other screen to hear from.)
  let savedTheme = window.STAR_WALL_THEME;
  if (location.protocol === 'file:') setInterval(() => {
    const s = document.createElement('script');
    s.src = `theme.js?${Date.now()}`;
    s.onload = () => {
      s.remove();
      const t = window.STAR_WALL_THEME;
      if (t && t !== savedTheme) {
        savedTheme = t;
        if (t !== theme) setTheme(t);
      }
    };
    s.onerror = () => s.remove();
    document.head.append(s);
  }, 1000);

  // ---- How to read this ----
  // A button beside the Light / Dark switch opens a plain-language guide to the screen. Clicking
  // anywhere (or Esc) closes the guide rather than the screen, and it closes itself after 3 minutes.

  let helpOverlay = null, helpTimer = null;
  const closeHelp = () => { helpOverlay?.classList.remove('open'); clearTimeout(helpTimer); };

  function addHelp(html) {
    const button = document.createElement('div');
    button.className = 'help-button';
    button.innerHTML = '<i>i</i>How to read this';
    helpOverlay = document.createElement('div');
    helpOverlay.className = 'help';
    helpOverlay.innerHTML = `<div class="help-card">${html}<div class="help-close">Click anywhere to close this guide</div></div>`;
    document.getElementById('stage').append(button, helpOverlay);
    button.addEventListener('click', e => {
      e.stopPropagation();
      helpOverlay.classList.add('open');
      clearTimeout(helpTimer);
      helpTimer = setTimeout(closeHelp, 180e3);
    });
    helpOverlay.addEventListener('click', e => { e.stopPropagation(); closeHelp(); });
    if (location.hash === '#help') button.click();   // open it straight away, for previewing
  }

  // Click or Esc closes this window; the launcher then closes the other screen too. T flips the theme.
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (helpOverlay?.classList.contains('open')) closeHelp(); else window.close();
    }
    if (e.key === 't' || e.key === 'T') setTheme(theme === 'dark' ? 'light' : 'dark');
  });
  document.addEventListener('click', () => window.close());

  // A new day brings a new reading, so reload just after midnight.
  const today = new Date().toDateString();
  setInterval(() => { if (new Date().toDateString() !== today) location.reload(); }, 60e3);

  // ---- Grainy planets ----
  // Each body gets a made-up surface (bands for Jupiter, seas for the Moon, continents and clouds for
  // Earth), lit from one side, then drawn as scattered dots. On paper, dark ink dots gather where the
  // surface is dark; in the dark theme, light dots gather where it's bright, so it never looks like a
  // photo negative. The dot pattern stays put while the planet turns, like a halftone screen.

  function hash3(x, y, z) {
    let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(z, 1442695041);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }
  // Smooth 3-D noise, so surfaces wrap around the sphere without a seam.
  function noise3(x, y, z) {
    const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
    const s = t => t * t * (3 - 2 * t);
    const u = s(x - xi), v = s(y - yi), w = s(z - zi);
    const L = (a, b, t) => a + (b - a) * t;
    const c = (i, j, k) => hash3(xi + i, yi + j, zi + k);
    return L(L(L(c(0, 0, 0), c(1, 0, 0), u), L(c(0, 1, 0), c(1, 1, 0), u), v),
             L(L(c(0, 0, 1), c(1, 0, 1), u), L(c(0, 1, 1), c(1, 1, 1), u), v), w);
  }
  function fbm(x, y, z, octaves) {
    let sum = 0, amp = 0.5, total = 0;
    for (let i = 0; i < octaves; i++) { sum += amp * noise3(x, y, z); total += amp; x *= 2; y *= 2; z *= 2; amp /= 2; }
    return sum / total;
  }
  const ramp = (x, a, b) => Math.min(1, Math.max(0, (x - a) / (b - a)));

  // Brightness (0 black to 1 white) at a point (x, y, z) on the unit sphere; y is the north pole.
  const SURFACE = {
    Sun: (x, y, z) => 0.98 - 0.08 * fbm(x * 9, y * 9, z * 9, 3),
    Moon: (x, y, z) => 0.86 - 0.32 * ramp(fbm(x * 1.7 + 3, y * 1.7, z * 1.7, 4), 0.5, 0.62) - 0.2 * fbm(x * 11, y * 11, z * 11, 3),
    Mercury: (x, y, z) => 0.82 - 0.45 * fbm(x * 8, y * 8, z * 8, 4),
    Venus: (x, y, z) => 0.9 - 0.18 * fbm(x * 2 + y * 3, y * 6, z * 2, 3),
    Earth: (x, y, z) => {
      const land = fbm(x * 1.8 + 7, y * 1.8, z * 1.8, 5), cloud = fbm(x * 3, y * 7, z * 3 + 11, 4);
      let a = land > 0.52 ? 0.55 + 0.25 * fbm(x * 9, y * 9, z * 9, 2) : 0.3;
      if (Math.abs(y) > 0.9) a = 0.95;
      return Math.max(a, ramp(cloud, 0.5, 0.62));
    },
    Mars: (x, y, z) => y > 0.88 ? 0.95 : 0.66 - 0.36 * fbm(x * 2.5, y * 2.5, z * 2.5 + 5, 4),
    Jupiter: (x, y, z) => {
      const t = y * 9 + 0.7 * fbm(x * 3, y * 3, z * 3, 3);
      let a = 0.66 + 0.2 * Math.sin(t * 1.3) + 0.08 * Math.sin(t * 3.1);
      const sx = x - 0.5, sy = y + 0.33;
      if (z > 0 && sx * sx / 0.03 + sy * sy / 0.008 < 1) a -= 0.3;   // the Great Red Spot
      return a;
    },
    Saturn: (x, y, z) => 0.8 + 0.1 * Math.sin(y * 14 + fbm(x * 2, y * 2, z * 2, 2)),
    Uranus: (x, y, z) => 0.82 + 0.06 * y,
    Neptune: (x, y, z) => 0.55 + 0.06 * Math.sin(y * 10) + 0.14 * fbm(x * 3, y * 6, z * 3, 2),
    Pluto: (x, y, z) => 0.5 + 0.35 * ramp(fbm(x * 2 + 1, y * 2, z * 2, 4), 0.5, 0.58) - 0.15 * fbm(x * 6, y * 6, z * 6, 2),
  };

  // Each surface baked once into a longitude × latitude map.
  const TW = 512, TH = 256, textures = {};
  function texture(body) {
    if (textures[body]) return textures[body];
    const t = new Float32Array(TW * TH), f = SURFACE[body];
    for (let j = 0; j < TH; j++) {
      const lat = Math.PI / 2 - (j + 0.5) / TH * Math.PI, cl = Math.cos(lat), y = Math.sin(lat);
      for (let i = 0; i < TW; i++) {
        const lon = (i + 0.5) / TW * 2 * Math.PI - Math.PI;
        t[j * TW + i] = f(cl * Math.sin(lon), y, cl * Math.cos(lon));
      }
    }
    return (textures[body] = t);
  }

  function inkColor() {
    const hex = getComputedStyle(document.documentElement).getPropertyValue('--ink').trim().replace('#', '');
    return [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16));
  }

  const normalize = ([x, y, z]) => { const l = Math.hypot(x, y, z); return [x / l, y / l, z / l]; };
  const UPPER_LEFT = normalize([-0.6, 0.5, 0.65]);

  // Draws `body` into `canvas`, which is `size` stage pixels square. Options:
  //   light: direction of the sun in screen space ([x right, y up, z toward you]); null for the Sun itself
  //   tilt:  axis tilt on screen, in degrees; spin: how far it has turned, in degrees
  //   turn:  degrees per second to keep it slowly turning (0 for a still picture)
  function planet(canvas, body, size, { light = UPPER_LEFT, tilt = 0, spin = 0, turn = 0 } = {}) {
    const rings = body === 'Saturn';
    let px, R, threshold, image, timer;

    function setup() {
      px = Math.max(8, Math.round(size * scale * (devicePixelRatio || 1)));
      canvas.width = canvas.height = px;
      canvas.style.width = canvas.style.height = size + 'px';
      R = px / 2 * (rings ? 0.44 : 1);
      threshold = new Float32Array(px * px);
      for (let i = 0; i < threshold.length; i++) threshold[i] = Math.random();
      image = canvas.getContext('2d').createImageData(px, px);
    }

    function draw() {
      const tex = texture(body), [ir, ig, ib] = inkColor(), data = image.data;
      const c = px / 2, ct = Math.cos(tilt * Math.PI / 180), st = Math.sin(tilt * Math.PI / 180);
      const cs = Math.cos(spin * Math.PI / 180), ss = Math.sin(spin * Math.PI / 180);
      const L = light && normalize(light);
      const lightDots = document.documentElement.dataset.theme === 'dark';
      data.fill(0);
      for (let j = 0; j < px; j++) {
        for (let i = 0; i < px; i++) {
          // Screen position, in planet radii, turned so the planet's axis is vertical.
          const sx = (i + 0.5 - c) / R, sy = (c - j - 0.5) / R;
          const u = sx * ct + sy * st, v = -sx * st + sy * ct;
          const r2 = u * u + v * v;
          let b = -1;
          if (rings) {
            const rho = Math.hypot(u, v / 0.26);   // the rings, seen from a little above
            const inRing = rho > 1.25 && rho < 2.25 && (rho < 1.92 || rho > 2.0);
            if (inRing && (r2 > 1 || v < 0)) b = 0.72 + 0.12 * Math.sin(rho * 40);
          }
          if (b < 0 && r2 <= 1) {
            const nz = Math.sqrt(1 - r2);
            // Into the planet's own frame, turned by `spin`, to look up its surface.
            const bx = u * cs + nz * ss, bz = -u * ss + nz * cs;
            const lon = Math.atan2(bx, bz), lat = Math.asin(Math.max(-1, Math.min(1, v)));
            const ti = Math.min(TW - 1, Math.floor((lon + Math.PI) / (2 * Math.PI) * TW));
            const tj = Math.min(TH - 1, Math.floor((Math.PI / 2 - lat) / Math.PI * TH));
            const albedo = tex[tj * TW + ti];
            if (!L) b = albedo * (0.5 + 0.5 * nz);   // the Sun glows, a little darker toward its edge
            else {
              const nx = sx, ny = sy;   // lighting is in screen space, so use the untilted normal
              // Lifted midtones, so the lit side reads as light rather than gray.
              b = Math.pow(albedo * Math.max(0, nx * L[0] + ny * L[1] + nz * L[2]), 0.7) + 0.02;
            }
          }
          if (b < 0) continue;
          const k = j * px + i;
          if (lightDots ? b > threshold[k] : b < threshold[k]) {
            data[k * 4] = ir; data[k * 4 + 1] = ig; data[k * 4 + 2] = ib; data[k * 4 + 3] = 255;
          }
        }
      }
      canvas.getContext('2d').putImageData(image, 0, 0);
    }

    setup();
    draw();
    scaleListeners.push(() => { setup(); draw(); });
    painters.push(draw);
    if (turn) {
      let last = performance.now();
      timer = setInterval(() => {
        const now = performance.now();
        spin = (spin + turn * (now - last) / 1000) % 360;
        last = now;
        draw();
      }, 100);
    }
    return {
      set(opts) {
        if ('light' in opts) light = opts.light;
        if ('tilt' in opts) tilt = opts.tilt;
        if ('spin' in opts) spin = opts.spin;
        draw();
      },
      stop() { clearInterval(timer); },
    };
  }

  // ---- The object of the day (objects.js), in the same grainy dots ----
  // Each pixel sends a ray into the scene until it meets the object's surface, which is then lit from the upper left;
  // the brightness becomes dots exactly as for the planets. Drawn once (and again when the theme or size changes).
  function thing(canvas, obj, size) {
    let px, threshold, image;
    const rad = d => d * Math.PI / 180;
    const [pitch, yaw] = (obj.turn || [0, 0]).map(rad);
    const cp = Math.cos(pitch), sp = Math.sin(pitch), cy = Math.cos(yaw), sy = Math.sin(yaw);
    // From the view (x right, y up, z toward you) into the object's own frame.
    const f = (x, y, z) => {
      const y1 = y * cp + z * sp, z1 = -y * sp + z * cp;
      return obj.sdf(x * cy - z1 * sy, y1, x * sy + z1 * cy);
    };
    function setup() {
      px = Math.max(8, Math.round(size * scale * (devicePixelRatio || 1)));
      canvas.width = canvas.height = px;
      canvas.style.width = canvas.style.height = size + 'px';
      threshold = new Float32Array(px * px);
      for (let i = 0; i < threshold.length; i++) threshold[i] = Math.random();
      image = canvas.getContext('2d').createImageData(px, px);
    }
    function draw() {
      const [ir, ig, ib] = inkColor(), data = image.data, L = UPPER_LEFT, e = 0.002;
      const lightDots = document.documentElement.dataset.theme === 'dark';
      const half = px / 2, span = 1.12;
      data.fill(0);
      for (let j = 0; j < px; j++) {
        const y = (half - j - 0.5) / half * span;
        for (let i = 0; i < px; i++) {
          const x = (i + 0.5 - half) / half * span;
          let t = 0, hit = false;
          for (let s = 0; s < 96 && t < 5; s++) {
            const d = f(x, y, 2.4 - t);
            if (d < 0.0015) { hit = true; break; }
            t += d * 0.85;
          }
          if (!hit) continue;
          const z = 2.4 - t;
          let nx = f(x + e, y, z) - f(x - e, y, z), ny = f(x, y + e, z) - f(x, y - e, z), nz = f(x, y, z + e) - f(x, y, z - e);
          const nl = Math.hypot(nx, ny, nz) || 1;
          nx /= nl; ny /= nl; nz /= nl;
          const diff = Math.max(0, nx * L[0] + ny * L[1] + nz * L[2]);
          let b = Math.pow(0.9 * diff + 0.05 * Math.max(0, nz), 0.72) + 0.03;
          if (obj.glow && y > 0.22) b = lightDots ? 1 : 0.62;   // a candle's flame gives its own light
          const k = j * px + i;
          if (lightDots ? b > threshold[k] : b < threshold[k]) {
            data[k * 4] = ir; data[k * 4 + 1] = ig; data[k * 4 + 2] = ib; data[k * 4 + 3] = 255;
          }
        }
      }
      canvas.getContext('2d').putImageData(image, 0, 0);
    }
    setup();
    draw();
    scaleListeners.push(() => { setup(); draw(); });
    painters.push(draw);
  }
  // Today's object: a different one each day, in a fixed shuffled order, so it doesn't repeat for weeks.
  function objectOfDay(date = new Date()) {
    const list = window.STAR_OBJECTS || [];
    const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 864e5);
    const n = list.length, step = [7, 11, 5, 3].find(s => n % s) || 1;   // a step that visits every one
    return list[(day * step) % n];
  }

  return { cfg, NS, glyph, help: addHelp, fmtTime, fmtDay, fmtWeekday, esc, start, planet, thing, objectOfDay, get scale() { return scale; } };
})();
