// Dylan's Split-Flap: a split-flap board, like Oat Foundry's and the old Solari boards in stations.
//
// How it moves (the part that has to look real):
//   Every character is a drum of 50 flaps (DRUM below, in order). A flap is a card hinged across the middle: its front
//   carries the top half of one character, its back the bottom half of the next. When the message changes, the drum
//   turns and lets the flaps go one after another. A released flap falls like a real one: it barely moves as it tips
//   off the catch, then swings faster and faster (a pendulum falling over: gravity pulls harder the further it leans),
//   is seen edge-on as it passes the middle and slaps down onto the stack at full speed. The drum lets the next flap go
//   before the last one has landed, so in a fast spin two flaps are in the air at once, as on a real board, and a fast
//   flap leaves a faint blur. Characters spin through every flap between the old and new character in drum order, so
//   some spin longer than others. The last flap hits the stop and bounces a little before it settles.
//   The flaps are drawn by the graphics card (WebGL): every half-flap is a card in true 3D perspective, foreshortened
//   as it turns, darkening as it turns away from the light and casting a shadow on the half below. The whole board is
//   one drawing per frame, so it stays smooth (60 frames a second) with every character spinning at once. Every drum's
//   motor runs a hair faster or slower than its neighbours, and they start a few milliseconds apart, like a real board.
//
// The sound: each flap that lands makes a clack (filtered noise and a short wooden knock), panned left to right with
// the character's place on the board. When hundreds land at once, a sample of them is played, louder, so it sounds
// like the real clatter without overloading the computer. It starts muted; the Sound button (or M) turns it on, on
// both screens. Inside the Morning and Night Screens it stays quiet.
//
// The frame: a dark cabinet with the flaps set into a recess, about an inch all round on the PC, so nothing touches the
// edge of a screen. Across two monitors it's one board in one frame: the recess runs on across the gap between them.
//
// Two screens: ?side=left shows the left half of the board, ?side=right the right half, ?side=both all of it. Both
// windows work out the same message and the same motion from the clock, so they flip together without talking.
// The up and down arrows change the quote: the window that heard the key tells the launcher (a tiny local server in
// launch.ps1), which passes it to the other window, and both flip at the same moment, a third of a second later.
// ?slow=40 is slow motion (for checking the motion in pictures); ?perf writes how evenly frames came into the title.
(() => {
  const CFG = window.SPLITFLAP;
  const params = new URLSearchParams(location.search);
  const side = ['left', 'right', 'both'].includes(params.get('side')) ? params.get('side') : 'both';
  const inFrame = window.parent !== window;           // inside the Morning or Night Screens (or the App Tester)
  if (inFrame) document.documentElement.classList.add('framed');

  // The drum: the 50 flaps, in the order they come round.
  const DRUM = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,\'!?-:;"()/&';
  const N = DRUM.length;
  // The board's size in characters. Across two monitors: columnsPerScreen on each. On one screen (one monitor, or the
  // iPad): its own size, wider when the screen is sideways, taller when it's upright; turning the iPad re-lays it.
  let COLS, ROWS, firstCol, shownCols;
  function pickGrid() {
    if (side === 'both') {
      [COLS, ROWS] = innerWidth >= innerHeight ? CFG.oneScreen.sideways : CFG.oneScreen.upright;
      firstCol = 0; shownCols = COLS;
    } else {
      COLS = CFG.columnsPerScreen * 2; ROWS = CFG.rows;
      firstCol = side === 'right' ? CFG.columnsPerScreen : 0; shownCols = CFG.columnsPerScreen;
    }
  }
  pickGrid();
  const SLOW = Math.max(1, +params.get('slow') || 1), T0 = performance.now();
  const clock = () => performance.timeOrigin + T0 + (performance.now() - T0) / SLOW;   // the clock both screens share

  // Seeded random numbers, so both screens pick the same jitter for the same character.
  const hash = (...xs) => { let h = 2166136261; for (const x of xs) { h = Math.imul(h ^ (x | 0), 16777619); h ^= h >>> 13; } return ((h >>> 0) % 100000) / 100000; };

  // ---- The text ----
  function clean(s) {
    s = s.normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[‘’`]/g, "'").replace(/[“”]/g, '"').replace(/[—–]/g, '-').replace(/…/g, '...').toUpperCase();
    return [...s].map(c => (DRUM.includes(c) ? c : ' ')).join('');
  }
  function wrap(text, width) {
    const lines = [];
    let line = '';
    for (const word of clean(text).split(/\s+/).filter(Boolean)) {
      if (word.length > width) return null;
      if (!line) line = word;
      else if (line.length + 1 + word.length <= width) line += ' ' + word;
      else { lines.push(line); line = word; }
    }
    if (line) lines.push(line);
    return lines;
  }
  // A quote laid out on the board: centred lines, the author below, right-aligned. Returns ROWS strings of COLS.
  function layout([quote, author]) {
    let lines = wrap(quote, COLS - 2);
    if (!lines || lines.length > ROWS - 1) lines = wrap(quote, COLS);
    if (!lines || lines.length > ROWS - 1) return null;
    let by = clean(`- ${author}`);
    if (by.length > COLS - 1) by = clean(author);                       // a long name: no room for the dash
    if (by.length > COLS) return null;
    const block = !author ? lines.length : lines.length + (lines.length <= ROWS - 2 ? 2 : 1);   // a blank row before the author if there's room
    const top = Math.floor((ROWS - block) / 2);
    const grid = Array.from({ length: ROWS }, () => ' '.repeat(COLS));
    const put = (r, s, start) => { grid[r] = (grid[r].slice(0, start) + s + grid[r].slice(start + s.length)).slice(0, COLS); };
    lines.forEach((l, i) => put(top + i, l, Math.floor((COLS - l.length) / 2)));
    if (author) put(top + block - 1, by, Math.max(0, COLS - 1 - by.length));
    return grid;
  }
  // Which quote is up: from the clock, in a shuffled order (each round of all the quotes a different order).
  // (Laid out again whenever the board changes size.) ?say=SOME WORDS shows those words instead (for trying it out).
  let quotes, said;
  const layOutQuotes = () => {
    quotes = window.QUOTES.map(layout).filter(Boolean);
    said = params.get('say') ? layout([params.get('say'), '']) : null;
  };
  layOutQuotes();
  function messageAt(slot) {
    if (said) return said;
    const round = Math.floor(slot / quotes.length), k = ((slot % quotes.length) + quotes.length) % quotes.length;
    const order = quotes.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(hash(round, i, 77) * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
    return quotes[order[k]];
  }

  // ---- The board's layers: the housings (back), the flaps (WebGL), the hinges and spool caps (front) ----
  const board = document.getElementById('board');
  const back = document.createElement('canvas'), gl_c = document.createElement('canvas'), front = document.createElement('canvas');
  for (const c of [back, gl_c, front]) { c.className = 'layer'; board.appendChild(c); }
  const gl = gl_c.getContext('webgl2', { antialias: true, premultipliedAlpha: true, alpha: true });
  let W, H, dpr, mw, mh, ox, oy, modules = [], shown = null, started = false;

  // The flaps' picture: every character's flap card, once, side by side (the "atlas"), as a texture.
  let tex = null;
  function makeAtlas() {
    const cw = Math.round(mw * dpr), ch = Math.round(mh * dpr);
    const c = document.createElement('canvas');
    c.width = cw * N; c.height = ch;
    const g = c.getContext('2d');
    const padX = cw * 0.055, padY = ch * 0.03, r = cw * 0.06;
    g.font = `350 ${Math.round(ch * 0.68)}px Bahnschrift, "Flap DIN", "Arial Narrow", sans-serif`;   // (Flap DIN: style.css, for the iPad)
    if ('fontStretch' in g) g.fontStretch = 'semi-condensed';
    g.textAlign = 'center';
    g.textBaseline = 'alphabetic';
    const capH = g.measureText('H').actualBoundingBoxAscent;
    for (let i = 0; i < N; i++) {
      const x0 = i * cw;
      // the flap card: charcoal, lit from above, with a faint sheen
      const grad = g.createLinearGradient(0, padY, 0, ch - padY);
      grad.addColorStop(0, '#2d2d2d'); grad.addColorStop(0.47, '#232323'); grad.addColorStop(0.53, '#1e1e1e'); grad.addColorStop(1, '#191919');
      g.fillStyle = grad;
      g.beginPath(); g.roundRect(x0 + padX, padY, cw - 2 * padX, ch - 2 * padY, r); g.fill();
      // the character, printed in off-white, centred on the hinge
      g.fillStyle = '#ecebe6';
      g.fillText(DRUM[i], x0 + cw / 2, ch / 2 + capH / 2);
    }
    if (!tex) tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const aniso = gl.getExtension('EXT_texture_filter_anisotropic');
    if (aniso) gl.texParameterf(gl.TEXTURE_2D, aniso.TEXTURE_MAX_ANISOTROPY_EXT, 8);
  }

  // The drawing program: each vertex comes with its screen position and its depth (w), so the texture is mapped with
  // true perspective; and a brightness, for the shading.
  const VS = `#version 300 es
    in vec3 aPos; in vec2 aUV; in vec2 aShade;
    out vec2 vUV; out vec2 vShade;
    void main() { vUV = aUV; vShade = aShade; gl_Position = vec4(aPos.xy * aPos.z, 0.0, aPos.z); }`;
  const FS = `#version 300 es
    precision mediump float;
    uniform sampler2D uTex; in vec2 vUV; in vec2 vShade; out vec4 o;   // vShade: (brightness, how solid)
    void main() { vec4 c = texture(uTex, vUV); o = vec4(c.rgb * vShade.x, c.a) * vShade.y; }`;
  function compile(type, src) { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; }
  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(prog); gl.useProgram(prog);
  const vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  const STRIDE = 7 * 4;                                // x, y, w, u, v, shade, alpha
  const loc = n => gl.getAttribLocation(prog, n);
  gl.enableVertexAttribArray(loc('aPos')); gl.vertexAttribPointer(loc('aPos'), 3, gl.FLOAT, false, STRIDE, 0);
  gl.enableVertexAttribArray(loc('aUV')); gl.vertexAttribPointer(loc('aUV'), 2, gl.FLOAT, false, STRIDE, 12);
  gl.enableVertexAttribArray(loc('aShade')); gl.vertexAttribPointer(loc('aShade'), 2, gl.FLOAT, false, STRIDE, 20);
  gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  let verts = new Float32Array(0), nv = 0;

  // One half-flap as two triangles. y0..y1: its two edges as distances from the hinge (negative is up); deg: how far
  // it has turned toward you around the hinge; shade0/shade1: brightness at those two edges; alpha: 1 is solid (less
  // for the faint blur behind a fast flap).
  function quad(mod, ch, bottomHalf, y0, y1, deg, shade0, shade1, alpha = 1) {
    const P = mh * 4;                                  // how far away the eye is (the perspective)
    const cx = mod.x + mw / 2, hy = mod.y + mh / 2, r = deg * Math.PI / 180, cs = Math.cos(r), sn = Math.sin(r);
    const u0 = ch / N, u1 = (ch + 1) / N, v0 = bottomHalf ? 0.5 : 0, v1 = bottomHalf ? 1 : 0.5;
    const pt = (x, y, u, v, s) => {
      const z = Math.abs(y) * sn, yy = y * cs, k = P / (P - z);        // turned toward you: nearer, so bigger
      const sx = cx + (x - cx) * k, sy = hy + yy * k;
      const i = nv * 7;
      verts[i] = (sx / W) * 2 - 1; verts[i + 1] = 1 - (sy / H) * 2; verts[i + 2] = 1 / k;
      verts[i + 3] = u; verts[i + 4] = v; verts[i + 5] = s; verts[i + 6] = alpha;
      nv++;
    };
    const xa = mod.x, xb = mod.x + mw;
    pt(xa, y0, u0, v0, shade0); pt(xb, y0, u1, v0, shade0); pt(xa, y1, u0, v1, shade1);
    pt(xb, y0, u1, v0, shade0); pt(xb, y1, u1, v1, shade1); pt(xa, y1, u0, v1, shade1);
  }

  // Gravity: how far a released flap has turned (0 to 180 degrees) a fraction p of the way through its fall. It's a
  // pendulum falling over from nearly upright: angle'' = g sin(angle). It barely moves at first, then whips over and
  // hits the stack at full speed. Worked out once, step by step, then looked up.
  const FALL = 1.65;                                  // a fall takes this many motor steps, so falls overlap
  const LEAN = 14;                                    // degrees the flap already leans when the catch lets it go
  const fallTable = (() => {
    const pts = [];
    let th = LEAN * Math.PI / 180, w = 0, t = 0;
    const dt = 1e-4;
    while (th < Math.PI) { pts.push([t, th]); w += Math.sin(th) * dt; th += w * dt; t += dt; }
    pts.push([t, Math.PI]);
    const n = 256, out = new Float32Array(n + 1);
    for (let i = 0, j = 0; i <= n; i++) {
      const want = (i / n) * t;
      while (j < pts.length - 2 && pts[j + 1][0] < want) j++;
      const [ta, a] = pts[j], [tb, b] = pts[j + 1];
      const th2 = a + (b - a) * (tb > ta ? Math.min(1, Math.max(0, (want - ta) / (tb - ta))) : 0);
      out[i] = (th2 * 180 / Math.PI - LEAN) / (180 - LEAN) * 180;
    }
    return out;
  })();
  const fall = p => {
    if (p <= 0) return 0;
    if (p >= 1) return 180;
    const x = p * 256, i = Math.floor(x);
    return fallTable[i] + (fallTable[i + 1] - fallTable[i]) * (x - i);
  };

  const LIGHT_TOP = [1.0, 0.86], LIGHT_BOTTOM = [0.72, 1.0];   // the bottom half sits slightly in the top one's shadow
  const BLUR = [[7, 0.18], [3.5, 0.32]];              // a fast flap's blur: where it was (ms before) and how faint
  let landed = [];
  // A flap in the air, turned deg degrees: its front (the top half of ch) tipping toward you, or, once past edge-on,
  // its back (the bottom half of the next character) coming down onto the stack.
  function flap(mod, ch, deg, alpha) {
    const hh = mh / 2;
    if (deg < 90) {
      const d = 1 - deg / 90 * 0.62;
      quad(mod, ch, false, -hh, 0, -deg, LIGHT_TOP[0] * d, LIGHT_TOP[1] * d, alpha);
    } else {
      const d = 1 - (180 - deg) / 90 * 0.7;
      quad(mod, (ch + 1) % N, true, 0, hh, 180 - deg, LIGHT_BOTTOM[0] * d, LIGHT_BOTTOM[1] * d, alpha);
    }
  }
  // Everything one character shows at time t.
  function drawModule(mod, t) {
    const hh = mh / 2;
    let a = mod.anim;
    if (a && a.then && t >= a.then.t0) { mod.cur = a.to; a = mod.anim = a.then; }   // the next spin takes over
    if (!a || t < a.t0) {                             // still: the character as it is
      const c = a ? a.from : mod.cur;
      quad(mod, c, false, -hh, 0, 0, LIGHT_TOP[0], LIGHT_TOP[1]);
      quad(mod, c, true, 0, hh, 0, LIGHT_BOTTOM[0], LIGHT_BOTTOM[1]);
      return;
    }
    const e = t - a.t0, F = a.dur * FALL;
    // Flap j (0, 1, 2 ...) is let go j motor steps in, and lands a fall later.
    const released = Math.min(a.n, Math.floor(e / a.dur) + 1);
    const down = e < F ? 0 : Math.min(a.n, Math.floor((e - F) / a.dur) + 1);
    while (a.k < down) { landed.push(mod.pan); a.k++; }
    if (down >= a.n) {
      // The last flap has landed: it bounces off the stop and settles.
      const b = e - ((a.n - 1) * a.dur + F), lift = b > 260 ? 0 : 7 * Math.exp(-b / 55) * Math.abs(Math.sin(b / 26));
      quad(mod, a.to, false, -hh, 0, 0, LIGHT_TOP[0], LIGHT_TOP[1]);
      quad(mod, a.to, true, 0, hh, 0, LIGHT_BOTTOM[0], LIGHT_BOTTOM[1]);
      if (lift > 0.05) quad(mod, a.to, true, 0, hh, lift, LIGHT_BOTTOM[0] * (1 - lift / 90 * 0.7), LIGHT_BOTTOM[1] * (1 - lift / 90 * 0.7));
      if (b > 260 && !a.then) { mod.cur = a.to; mod.anim = null; }
      return;
    }
    // Behind the flaps in the air: the next top (on the flap after the last one let go). Below them: the stack, its
    // top flap showing this bottom half, in the shadow of whatever is falling onto it.
    const angle = j => fall((e - j * a.dur) / F);
    let shadeTop = 1, shadeBottom = 1;
    for (let j = down; j < released; j++) {
      const deg = angle(j), s = Math.sin(deg * Math.PI / 180);
      if (deg < 90) shadeTop = Math.min(shadeTop, 1 - s * 0.16); else shadeBottom = Math.min(shadeBottom, 1 - s * 0.34);
    }
    quad(mod, (a.from + released) % N, false, -hh, 0, 0, LIGHT_TOP[0] * shadeTop, LIGHT_TOP[1] * shadeTop);
    quad(mod, (a.from + down) % N, true, 0, hh, 0, LIGHT_BOTTOM[0] * shadeBottom, LIGHT_BOTTOM[1] * (0.5 + 0.5 * shadeBottom));
    // The flaps in the air, back to front: above the hinge the newest is furthest back; below it, the oldest (it's
    // nearest the stack). A fast one leaves its blur first.
    const order = [];
    for (let j = released - 1; j >= down; j--) if (angle(j) < 90) order.push(j);
    for (let j = down; j < released; j++) if (angle(j) >= 90) order.push(j);
    for (const j of order) {
      const ch = (a.from + j) % N, deg = angle(j);
      for (const [ms, alpha] of BLUR) {
        const was = fall((e - ms - j * a.dur) / F);
        if (deg - was > 6) flap(mod, ch, was, alpha);
      }
      flap(mod, ch, deg, 1);
    }
  }

  // ---- Laying out the board ----
  // The cabinet: satin black all round, and a recess the flaps sit in, with a lit lower edge and a shadow along the top. On
  // two monitors the recess runs right up to the edge between them, so the two halves read as one board.
  function drawCabinet(b) {
    const body = b.createLinearGradient(0, 0, 0, H);
    body.addColorStop(0, '#1c1c1e'); body.addColorStop(0.5, '#151516'); body.addColorStop(1, '#101011');
    b.fillStyle = body; b.fillRect(0, 0, W, H);
    const pad = Math.max(3, Math.round(mw * 0.08));
    const y0 = oy - pad, y1 = oy + mh * ROWS + pad;
    const x0 = side === 'right' ? -4 : ox - pad, x1 = side === 'left' ? W + 4 : ox + mw * shownCols + pad;
    const r = Math.max(3, pad * 0.75);
    const well = () => { b.beginPath(); b.roundRect(x0, y0, x1 - x0, y1 - y0, r); };
    // the lit edge below and the dark edge above: the recess looks cut in
    b.save(); b.translate(0, 1.5); well(); b.fillStyle = 'rgba(255, 255, 255, 0.10)'; b.fill(); b.restore();
    b.save(); b.translate(0, -1.5); well(); b.fillStyle = '#000'; b.fill(); b.restore();
    well(); b.fillStyle = '#050505'; b.fill();
    // a thin line round the outside of the cabinet, set in from the edge of the screen
    const line = Math.max(6, Math.min(oy, side === 'both' ? ox : Math.min(oy, 40)) * 0.28);
    b.strokeStyle = 'rgba(255, 255, 255, 0.05)'; b.lineWidth = 1;
    b.beginPath();
    if (side === 'both') b.roundRect(line + 0.5, line + 0.5, W - 2 * line - 1, H - 2 * line - 1, r);
    else if (side === 'left') { b.moveTo(W, line + 0.5); b.lineTo(line + 0.5, line + 0.5); b.lineTo(line + 0.5, H - line - 0.5); b.lineTo(W, H - line - 0.5); }
    else { b.moveTo(0, line + 0.5); b.lineTo(W - line - 0.5, line + 0.5); b.lineTo(W - line - 0.5, H - line - 0.5); b.lineTo(0, H - line - 0.5); }
    b.stroke();
  }
  function drawBackAndFront() {
    const b = back.getContext('2d'), f = front.getContext('2d');
    for (const c of [b, f]) { c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, W, H); }
    drawCabinet(b);
    for (const mod of modules) {
      // the housing: dark, a little lighter in the middle, with a crisp edge
      const g = b.createRadialGradient(mod.x + mw / 2, mod.y + mh * 0.4, 0, mod.x + mw / 2, mod.y + mh * 0.4, mh * 0.7);
      g.addColorStop(0, '#161616'); g.addColorStop(1, '#0c0c0c');
      b.fillStyle = g; b.fillRect(mod.x, mod.y, mw, mh);
      b.strokeStyle = '#040404'; b.lineWidth = 1; b.strokeRect(mod.x + 0.5, mod.y + 0.5, mw - 1, mh - 1);
      // the hinge: the thin gap between the two halves, across the flap
      f.fillStyle = '#060606';
      f.fillRect(mod.x + mw * 0.055, mod.y + mh / 2 - Math.max(1, mh * 0.006), mw * 0.89, Math.max(2, mh * 0.012));
      // the drum's spool caps, at each end of the hinge
      for (const x of [mod.x + mw * 0.006, mod.x + mw * 0.949]) {
        const pg = f.createLinearGradient(0, mod.y + mh * 0.44, 0, mod.y + mh * 0.56);
        pg.addColorStop(0, '#3c3c3c'); pg.addColorStop(0.6, '#1b1b1b'); pg.addColorStop(1, '#0f0f0f');
        f.fillStyle = pg;
        f.beginPath(); f.roundRect(x, mod.y + mh * 0.44, mw * 0.045, mh * 0.12, 2); f.fill();
      }
    }
  }

  function build() {
    const was = COLS + 'x' + ROWS;
    pickGrid();
    const regrid = was !== COLS + 'x' + ROWS;
    if (regrid) { layOutQuotes(); modules = []; shown = null; }   // a new size: start blank and flip the quote in again
    dpr = window.devicePixelRatio || 1; W = innerWidth; H = innerHeight;
    for (const c of [back, gl_c, front]) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); }
    gl.viewport(0, 0, gl_c.width, gl_c.height);
    // The flaps' shape: about 2 wide to 3 high, like the real ones, as big as fits inside the border.
    const fit = (roomW, roomH) => {
      mh = Math.floor(roomH / ROWS);
      mw = Math.floor(Math.min(roomW / shownCols, mh * 0.67));
      mh = Math.min(mh, Math.floor(mw / 0.66));
    };
    if (side === 'both') {
      // One screen (the iPad, the iPhone, one monitor): the border, inside the notch's and the Home bar's safe areas.
      const css = getComputedStyle(document.documentElement), inset = n => parseFloat(css.getPropertyValue(n)) || 0;
      const t = inset('--safe-t'), r = inset('--safe-r'), bt = inset('--safe-b'), l = inset('--safe-l');
      const edge = Math.max(10, Math.round(Math.min(W, H) * CFG.borderOneScreen));
      fit(W - l - r - 2 * edge, H - t - bt - 2 * edge);
      // The sound switch needs a margin of its own: make one if the flaps fill the screen both ways.
      const BTN = 56, roomV = (H - t - bt - mh * ROWS) / 2, roomH = (W - l - r - mw * shownCols) / 2;
      const hasMouse = matchMedia('(hover: hover)').matches, x = hasMouse ? 16 : 0;
      if (!inFrame && roomV < BTN + x && roomH < BTN + x) {
        if (W >= H) fit(W - l - r - 2 * Math.max(edge, BTN), H - t - bt - 2 * edge);
        else fit(W - l - r - 2 * edge, H - t - bt - 2 * Math.max(edge, BTN));
      }
      ox = Math.floor(l + (W - l - r - mw * shownCols) / 2);
      oy = Math.floor(t + (H - t - bt - mh * ROWS) / 2);
      const btn = document.getElementById('sound');
      if (btn) {
        const below = H - (oy + mh * ROWS), beside = ox;
        const small = 44;
        if (below >= beside && below > small + bt) { btn.style.left = `${Math.max(ox, l + 8)}px`; btn.style.bottom = `${Math.round(bt + (below - bt - small) / 2)}px`; }
        else { btn.style.left = `${Math.round(l + (beside - l - small) / 2)}px`; btn.style.bottom = `${Math.max(bt + 8, H - oy - mh * ROWS)}px`; }
      }
    } else {
      // Two monitors: an inch at the top and bottom and on the outer side. The rest of the width sits at the edge between
      // the monitors, a small gap, so the flaps don't touch it and the board still runs straight across.
      const edge = Math.round(W * CFG.border);
      fit(W - edge - 12, H - 2 * edge);
      ox = side === 'left' ? edge : W - edge - mw * shownCols;
      oy = Math.floor((H - mh * ROWS) / 2);
    }
    const prev = modules;
    modules = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < shownCols; c++) {
        const col = firstCol + c, old = prev.find(p => p.row === r && p.col === col);
        modules.push({
          row: r, col, x: ox + c * mw, y: oy + r * mh, cur: old ? old.cur : 0, anim: old ? old.anim : null,
          pan: (col + 0.5) / COLS * 2 - 1, speed: CFG.flipMs * (0.94 + 0.12 * hash(r, col, 5)),   // this drum's own motor
        });
      }
    }
    verts = new Float32Array(modules.length * 16 * 6 * 7);   // room for 16 half-flaps a character
    makeAtlas();
    drawBackAndFront();
    wake();
    if (regrid && started) tick();
  }

  // ---- Changing the message ----
  // Each drum turns to its new character from wherever it is at startAt: still, waiting to start, or in the middle of
  // a spin (then it just keeps spinning, now toward the new character, with no jump).
  function setMessage(grid, startAt, msgNo) {
    for (const mod of modules) {
      const target = DRUM.indexOf(grid[mod.row][mod.col]);
      // Each drum starts a few milliseconds after the signal, a little differently each time.
      const t0 = startAt + 20 + 150 * hash(mod.row, mod.col, msgNo);
      let a = mod.anim;
      if (a && a.then) { if (startAt < a.then.t0) a.then = null; else { mod.cur = a.to; a = mod.anim = a.then; } }
      if (a && startAt < a.t0) {                       // hadn't started yet: start from where it still is
        const flips = (target - a.from + N) % N;
        if (!flips) mod.cur = a.from;
        mod.anim = flips ? { from: a.from, to: target, n: flips, t0, dur: mod.speed, k: 0 } : null;
        continue;
      }
      if (a && startAt - a.t0 < a.n * a.dur) {        // spinning: keep going, toward the new character
        const released = Math.floor((startAt - a.t0) / a.dur) + 1, at = (a.from + released) % N;
        a.n = released + (target - at + N) % N;
        a.to = target;
        continue;
      }
      const from = a ? a.to : mod.cur;                 // still (or its last flaps still landing): a new spin
      const flips = (target - from + N) % N;
      if (!flips) continue;
      const next = { from, to: target, n: flips, t0, dur: mod.speed, k: 0 };
      if (a) a.then = next; else mod.anim = next;
    }
    wake();
  }

  // ---- Every frame ----
  let running = false;
  function wake() { if (!running) { running = true; requestAnimationFrame(frame); } }
  const perf = params.has('perf') ? { last: 0, gaps: [] } : null;
  function frame(now) {
    if (perf) { if (perf.last) perf.gaps.push(now - perf.last); perf.last = now; }
    const t = clock();
    nv = 0; landed = [];
    let moving = false;
    for (const mod of modules) { drawModule(mod, t); if (mod.anim) moving = true; }
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bufferData(gl.ARRAY_BUFFER, verts.subarray(0, nv * 7), gl.DYNAMIC_DRAW);
    gl.drawArrays(gl.TRIANGLES, 0, nv);
    if (landed.length) Clatter.play(landed);
    if (moving) requestAnimationFrame(frame);
    else {
      running = false;
      if (perf && perf.gaps.length > 30) {
        const g = perf.gaps.slice(2), avg = g.reduce((x, y) => x + y, 0) / g.length, late = g.filter(x => x > 20).length;
        document.title = `perf: ${g.length} frames, avg ${avg.toFixed(1)} ms, worst ${Math.max(...g).toFixed(1)} ms, late ${late}`;
      }
      if (perf) { perf.last = 0; perf.gaps = []; }
    }
  }

  // ---- The sound ----
  const Clatter = (() => {
    let ctx = null, out = null, buffers = [], on = !!CFG.sound && !inFrame;
    function init() {
      if (ctx) return;
      ctx = new AudioContext();
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -16; comp.ratio.value = 6;
      out = ctx.createGain(); out.gain.value = CFG.volume;
      // Dry: just the flaps falling and clacking, no echo. The housing takes the harshest top off.
      const age = ctx.createBiquadFilter(); age.type = 'lowpass'; age.frequency.value = 7500; age.Q.value = 0.5;
      out.connect(age).connect(comp);
      comp.connect(ctx.destination);
      // Twelve slightly different clacks. Each is made the way a real knock sounds: a very short burst of noise (the
      // flap's edge striking the stack) rings the resonances of the stiff plastic card and of the drum and housing
      // behind it, each dying away at its own rate, the highs first. Then a smaller second tap a few milliseconds
      // later, as the flap bounces once and settles: the "tk-k" of a real flap.
      for (let v = 0; v < 12; v++) {
        const rate = ctx.sampleRate, len = Math.round(rate * 0.06), b = ctx.createBuffer(1, len, rate), d = b.getChannelData(0);
        const j = () => 1 + (Math.random() - 0.5) * 0.12;            // every flap and every hit a little different
        // [frequency, how long it rings (s), how loud]
        const modes = [[260 * j(), 0.012, 0.25], [820 * j(), 0.010, 0.8], [1650 * j(), 0.007, 0.85], [2600 * j(), 0.005, 0.65],
          [3800 * j(), 0.0035, 0.45], [5600 * j(), 0.0022, 0.3]];
        const hit = new Float32Array(len);
        const tap = (at, gain, ms) => {                                // a burst of noise: the strike
          const i0 = Math.round(at * rate), n = Math.round(ms / 1000 * rate);
          for (let i = 0; i < n && i0 + i < len; i++) hit[i0 + i] += (Math.random() * 2 - 1) * gain * Math.exp(-i / (n / 3));
        };
        tap(0, 1, 1.2);
        tap(0.004 + Math.random() * 0.004, 0.32, 0.8);                 // the bounce
        for (const [f, ring, g] of modes) {                            // each resonance, rung by the strike
          const r = Math.exp(-1 / (ring * rate)), c = 2 * r * Math.cos(2 * Math.PI * f / rate);
          let y1 = 0, y2 = 0;
          const norm = g * (1 - r) * 4;
          for (let i = 0; i < len; i++) { const y = hit[i] * norm + c * y1 - r * r * y2; y2 = y1; y1 = y; d[i] += y; }
        }
        for (let i = 0; i < len; i++) d[i] += hit[i] * 0.18;           // a little of the strike itself: the click
        let peak = 0;
        for (let i = 0; i < len; i++) peak = Math.max(peak, Math.abs(d[i]));
        for (let i = 0; i < len; i++) d[i] *= 0.9 / peak;
        buffers.push(b);
      }
    }
    function play(pans) {
      if (!on || !ctx || ctx.state !== 'running' || SLOW > 1) return;
      const most = 10, n = pans.length, pick = n <= most ? pans : Array.from({ length: most }, () => pans[Math.floor(Math.random() * n)]);
      const gain = 0.16 * Math.min(1.8, Math.sqrt(n / pick.length));
      for (const pan of pick) {
        const s = ctx.createBufferSource(), g = ctx.createGain(), p = ctx.createStereoPanner();
        s.buffer = buffers[Math.floor(Math.random() * buffers.length)];
        s.playbackRate.value = 0.9 + Math.random() * 0.2;
        g.gain.value = gain * (0.7 + Math.random() * 0.5);
        p.pan.value = Math.max(-1, Math.min(1, pan));
        s.connect(g).connect(p).connect(out);
        s.start(ctx.currentTime + 0.004 + Math.random() * 0.014);   // spread over the frame, as real flaps are
      }
    }
    return {
      init, play,
      resume() { if (ctx && ctx.state !== 'running') ctx.resume(); },
      set(v) { on = !!v; },
      get on() { return on; },
      get waiting() { return !!ctx && ctx.state !== 'running'; },   // (an iPad keeps it silent until a tap)
    };
  })();

  // ---- Running it ----
  // Which quote is up: quote number = clock / period, unless the arrows have moved it; then quote number `base` came
  // up at `at`, and the count goes on from there.
  const period = CFG.secondsPerMessage * 1000;
  const SERVER = 'http://localhost:47270/shift';
  let soundTouched = 0;
  let shift = null;
  const numberAt = now => (shift && now >= shift.at ? shift.base + Math.floor((now - shift.at) / period) : Math.floor(now / period));
  const startOf = (no, now) => (shift && now >= shift.at ? shift.at + (no - shift.base) * period : no * period);
  function tick() {
    const now = clock(), no = numberAt(now);
    if (no !== shown) {
      shown = no;
      const start = startOf(no, now);
      setMessage(messageAt(no), start > now - 1500 ? start : now, no);
    }
  }
  function useShift(s) {
    if (!s || !(s.at > 0) || (shift && shift.at === s.at)) return;
    shift = s;
    setTimeout(tick, Math.max(0, (s.at - clock()) / SLOW) + 1);
  }
  // Ask the launcher, ten times a second, whether an arrow was pressed on the other screen.
  async function listen() {
    try {
      const told = await (await fetch(SERVER, { cache: 'no-store' })).json();
      useShift(told);
      if (typeof told.sound === 'boolean' && told.sound !== Clatter.on && Date.now() - soundTouched > 600) setSound(told.sound, false);
    } catch (e) { /* no launcher: this screen alone */ }
    setTimeout(listen, 100);
  }
  // An arrow: the next quote (up) or the one before (down), on both screens, a third of a second from now.
  function step(by) {
    const at = Math.round(Math.max(clock(), shift ? shift.at : 0) + 330);
    const s = { base: numberAt(at - 1) + by, at };
    useShift(s);
    fetch(SERVER, { method: 'POST', body: JSON.stringify(s) }).catch(() => {});
  }
  let resizeTimer = null;
  window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(build, 300); });

  const soundBtn = document.getElementById('sound');
  const SPEAKER = '<path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4z" fill="currentColor"/>';
  const WAVES = '<path d="M15 9a4.2 4.2 0 0 1 0 6M17.5 6.5a7.8 7.8 0 0 1 0 11" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>';
  const CROSS = '<path d="M15.5 9.5l5 5M20.5 9.5l-5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>';
  const showSound = () => {
    const on = Clatter.on;
    soundBtn.classList.toggle('on', on);
    soundBtn.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${SPEAKER}${on ? WAVES : CROSS}</svg><span>${on ? 'Sound on' : 'Sound off'}</span>`;
    soundBtn.title = on ? 'Turn the sound off (M)' : 'Turn the sound on (M)';
    soundBtn.setAttribute('aria-label', soundBtn.title);
  };
  // On or off, on both screens: the one that heard it tells the launcher, and the other hears it there.
  function setSound(v, tell = true) {
    Clatter.set(v);
    showSound();
    if (tell && side !== 'both' && !inFrame) {
      soundTouched = Date.now();
      fetch(SERVER, { method: 'POST', body: JSON.stringify({ sound: !!v }) }).catch(() => {});
    }
  }
  soundBtn.addEventListener('click', () => { Clatter.resume(); setSound(!Clatter.on); });
  window.addEventListener('keydown', e => {
    if (inFrame) return;                              // inside the Screens the keys belong to the Screens
    if (e.key === 'm' || e.key === 'M') { Clatter.resume(); setSound(!Clatter.on); }
    if (e.key === 'Escape') window.close();
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { e.preventDefault(); if (!e.repeat) step(e.key === 'ArrowUp' ? 1 : -1); }
  });
  for (const ev of ['pointerdown', 'touchend', 'click']) window.addEventListener(ev, () => Clatter.resume());
  // On the iPad: swipe up for the next quote, down for the one before.
  let swipeY = null;
  window.addEventListener('touchstart', e => { swipeY = e.touches.length === 1 ? e.touches[0].clientY : null; }, { passive: true });
  window.addEventListener('touchend', e => {
    if (swipeY === null) return;
    const dy = e.changedTouches[0].clientY - swipeY;
    if (Math.abs(dy) > 50) step(dy < 0 ? 1 : -1);
    swipeY = null;
  }, { passive: true });

  (async () => {
    if (document.fonts) await Promise.all(['350 40px Bahnschrift', '350 40px "Flap DIN"'].map(f => document.fonts.load(f).catch(() => {})));
    build();
    Clatter.init(); showSound();
    // Open on a blank board, then flip in the current quote (both screens open together, so they flip together).
    setTimeout(() => { started = true; tick(); setInterval(tick, 250); }, 900);
    if (side !== 'both' && !inFrame) listen();        // two screens: hear about arrows and the sound on the other one
  })();
})();
