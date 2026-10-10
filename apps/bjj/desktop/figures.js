// The step illustrations: two jointed figures, drawn from a pose. "You" are solid, your partner is an
// outline. Poses live in poses.js; this file turns one into an SVG drawing.
//
// A figure is written as a short line of settings, e.g.  '120,114 t-80 a1:35,-3 a2:@B.e1/-1 l1:75,95 l2:108,98'
//   x,y        where the hips are
//   t / h      which way the torso points (hips to neck) and the head points, in degrees:
//              0 = right, 90 = down, 180 = left, -90 = up
//   w          0 = seen from the side (both arms come from one shoulder), 1 = seen from the front or above
//   f          which way the body faces: 1 = its front is 90 degrees clockwise of the torso, -1 = the other way
//   tl         torso length (1 = normal; less when it points toward or away from the viewer)
//   a1 a2      arms: the upper arm's direction and the forearm's (a1 is the near or upper-on-screen one)
//   l1 l2      legs: the thigh's direction and the shin's; two more numbers shorten them (0.6 = 60%)
//              Either can instead reach for a point: a1:@B.neck+4-6/-1 (the /-1 picks which way it bends)
//   ft1 ft2    which way a foot points, if the guess is wrong
(function (global) {
  'use strict';

  const LEN = { torso: 60, neck: 7, head: 12, upper: 34, fore: 30, thigh: 50, shin: 47, foot: 13 };
  const RAD = { hip: 13.5, chest: 16.5, neck: 6, head: 12.5, upper: 8, elbow: 6.4, fore: 5.8, hand: 6.2,
    thigh: 11.5, knee: 8.2, shin: 7, foot: 4.8 };
  const SHOULDER = 14, HIPW = 8.5;   // half the distance between the shoulders / hips, seen from the front
  const VIEW = [340, 220];           // every drawing is this size, so steps match in scale

  const rad = d => d * Math.PI / 180;
  const deg = r => r * 180 / Math.PI;
  const go = (p, ang, len) => [p[0] + Math.cos(rad(ang)) * len, p[1] + Math.sin(rad(ang)) * len];
  const dist = (p, q) => Math.hypot(q[0] - p[0], q[1] - p[1]);
  const dir = (p, q) => deg(Math.atan2(q[1] - p[1], q[0] - p[0]));
  const r1 = n => Math.round(n * 10) / 10;

  // ---- Reading a figure's settings ----

  function parseFigure(text) {
    const tokens = text.trim().split(/\s+/);
    const [x, y] = tokens.shift().split(',').map(Number);
    const fig = { at: [x, y], t: -90, h: null, w: 0, face: 1, tl: 1, limbs: {}, feet: {} };
    for (const tok of tokens) {
      let m;
      if ((m = tok.match(/^(a1|a2|l1|l2):(.+)$/))) {
        const [, limb, val] = m;
        if (val[0] === '@') {
          const [target, bend] = val.slice(1).split('/');
          fig.limbs[limb] = { reach: target, bend: bend === undefined ? 1 : Number(bend) };
        } else {
          const [p, q, sp = 1, sq = 1] = val.split(',').map(Number);
          fig.limbs[limb] = { angles: [p, q], scale: [sp, sq] };
        }
      } else if ((m = tok.match(/^ft([12]):(-?[\d.]+)$/))) fig.feet[m[1]] = Number(m[2]);
      else if ((m = tok.match(/^tl(-?[\d.]+)$/))) fig.tl = Number(m[1]);
      else if ((m = tok.match(/^t(-?[\d.]+)$/))) fig.t = Number(m[1]);
      else if ((m = tok.match(/^h(-?[\d.]+)$/))) fig.h = Number(m[1]);
      else if ((m = tok.match(/^w(-?[\d.]+)$/))) fig.w = Number(m[1]);
      else if ((m = tok.match(/^f(-?1)$/))) fig.face = Number(m[1]);
      else throw new Error(`Can't read "${tok}" in figure "${text}"`);
    }
    return fig;
  }

  // ---- Working out where every joint is ----

  // The body without its arms and legs.
  function core(fig) {
    const j = {};
    const t = fig.t, w = fig.w;
    j.hip = fig.at.slice();
    j.neck = go(j.hip, t, LEN.torso * fig.tl);
    j.head = go(j.neck, fig.h === null ? t : fig.h, LEN.neck + LEN.head);
    j.chest = go(j.hip, t, LEN.torso * fig.tl * 0.62);
    j.belly = go(j.hip, t, LEN.torso * fig.tl * 0.3);
    const shoulder = go(j.neck, t + 180, 7 * fig.tl);
    j.s1 = go(shoulder, t + 90, SHOULDER * w);
    j.s2 = go(shoulder, t - 90, SHOULDER * w);
    j.hp1 = go(j.hip, t + 90, HIPW * w);
    j.hp2 = go(j.hip, t - 90, HIPW * w);
    // The front and back of the body (handy targets for hands and feet).
    const front = t + 90 * fig.face;
    j.front = go(j.chest, front, RAD.chest);
    j.back = go(j.chest, front + 180, RAD.chest);
    j.waist = go(j.belly, front + 180, RAD.hip);   // the small of the back
    j.tummy = go(j.belly, front, RAD.hip);
    j.butt = go(j.hip, front + 180, RAD.hip);
    j.chin = go(j.head, front, RAD.head);
    j.nape = go(j.head, front + 180, RAD.head * 0.9);
    return j;
  }

  const LIMB = {
    a1: { root: 's1', mid: 'e1', end: 'h1', lens: [LEN.upper, LEN.fore] },
    a2: { root: 's2', mid: 'e2', end: 'h2', lens: [LEN.upper, LEN.fore] },
    l1: { root: 'hp1', mid: 'k1', end: 'an1', lens: [LEN.thigh, LEN.shin] },
    l2: { root: 'hp2', mid: 'k2', end: 'an2', lens: [LEN.thigh, LEN.shin] },
  };

  // Points like "B.neck", "A.h1+4-6" (4 right, 6 down from A's hand) or "120,80".
  function point(ref, joints) {
    const m = ref.match(/^([AB])\.([a-z]+\d?)([+-][\d.]+)?([+-][\d.]+)?$/);
    if (!m) {
      const [x, y] = ref.split(',').map(Number);
      if (Number.isNaN(x) || Number.isNaN(y)) throw new Error(`Unknown point "${ref}"`);
      return [x, y];
    }
    const p = joints[m[1]][m[2]];
    if (!p) throw new Error(`No joint "${m[2]}" on ${m[1]} (or it isn't placed yet)`);
    return [p[0] + Number(m[3] || 0), p[1] + Number(m[4] || 0)];
  }

  function placeLimb(fig, name, j, all) {
    const spec = fig.limbs[name];
    if (!spec) return;
    const { root, mid, end, lens } = LIMB[name];
    const s = j[root];
    let a, b, l1 = lens[0], l2 = lens[1];
    if (spec.angles) {
      [a, b] = spec.angles;
      l1 *= spec.scale[0];
      l2 *= spec.scale[1];
    } else {
      // Two-bone reach: bend at the elbow or knee to put the hand or foot on the target.
      const target = point(spec.reach, all);
      const d = Math.min(Math.max(dist(s, target), Math.abs(l1 - l2) + 0.5), l1 + l2 - 0.01);
      const toward = dir(s, target);
      const cos = (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d);
      a = toward + spec.bend * deg(Math.acos(Math.max(-1, Math.min(1, cos))));
      const elbow = go(s, a, l1);
      b = dir(elbow, target);
    }
    j[mid] = go(s, a, l1);
    j[end] = go(j[mid], b, l2);
    j[name + 'dir'] = [a, b];
    if (name[0] === 'l') {
      const n = name[1];
      const footAngle = fig.feet[n] !== undefined ? fig.feet[n] : (fig.w < 0.5 ? b - 90 * fig.face : b);
      j['ft' + n] = go(j[end], footAngle, fig.w < 0.5 ? LEN.foot : LEN.foot * 0.55);
    }
  }

  function solve(pose) {
    const figs = { A: parseFigure(pose.A), B: parseFigure(pose.B) };
    const all = { A: core(figs.A), B: core(figs.B) };
    // Limbs with set angles first, then the ones reaching for something. A reach whose target is another
    // reaching limb waits until that one is placed.
    let pending = [];
    for (const who of ['A', 'B']) {
      for (const name of ['a1', 'a2', 'l1', 'l2']) {
        const spec = figs[who].limbs[name];
        if (!spec) continue;
        if (spec.reach) pending.push([who, name]);
        else placeLimb(figs[who], name, all[who], all);
      }
    }
    for (let round = 0; round < 4 && pending.length; round++) {
      const waiting = [];
      for (const [who, name] of pending) {
        try { placeLimb(figs[who], name, all[who], all); } catch (e) {
          if (round === 3 || !/isn't placed/.test(e.message)) throw e;
          waiting.push([who, name]);
        }
      }
      pending = waiting;
    }
    return { figs, joints: all };
  }

  // ---- Drawing ----

  // A tube between two circles of different sizes: every bone is one of these.
  function tube(p, q, ra, rb) {
    const dx = q[0] - p[0], dy = q[1] - p[1], d = Math.hypot(dx, dy) || 0.01;
    const ux = dx / d, uy = dy / d, nx = -uy, ny = ux;
    const s = Math.max(-0.95, Math.min(0.95, (ra - rb) / d)), c = Math.sqrt(1 - s * s);
    const mx = nx * c + ux * s, my = ny * c + uy * s, kx = -nx * c + ux * s, ky = -ny * c + uy * s;
    const P = (x, y) => `${r1(x)},${r1(y)}`;
    return `M${P(p[0] + mx * ra, p[1] + my * ra)}L${P(q[0] + mx * rb, q[1] + my * rb)}` +
      `A${r1(rb)},${r1(rb)} 0 ${s < 0 ? 1 : 0} 0 ${P(q[0] + kx * rb, q[1] + ky * rb)}` +
      `L${P(p[0] + kx * ra, p[1] + ky * ra)}A${r1(ra)},${r1(ra)} 0 ${s > 0 ? 1 : 0} 0 ${P(p[0] + mx * ra, p[1] + my * ra)}Z`;
  }
  const circle = (p, r) => `M${r1(p[0] - r)},${r1(p[1])}a${r},${r} 0 1 0 ${r * 2},0a${r},${r} 0 1 0 ${-r * 2},0Z`;

  function partPaths(fig, j, part) {
    const w = fig.w;
    if (part === 't') {
      return [
        tube(j.neck, j.head, RAD.neck, RAD.neck),
        tube(j.hip, j.neck, RAD.hip + 4 * w, RAD.chest + 5 * w),
        circle(j.head, RAD.head),
      ];
    }
    const n = part[1];
    if (!j[(part[0] === 'a' ? 'h' : 'an') + n]) return [];
    if (part[0] === 'a') {
      return [tube(j['s' + n], j['e' + n], RAD.upper, RAD.elbow), tube(j['e' + n], j['h' + n], RAD.elbow, RAD.fore),
        circle(j['h' + n], RAD.hand)];
    }
    return [tube(j['hp' + n], j['k' + n], RAD.thigh + 2 * w, RAD.knee), tube(j['k' + n], j['an' + n], RAD.knee, RAD.shin),
      tube(j['an' + n], j['ft' + n], RAD.shin * 0.75, RAD.foot)];
  }

  // A belt around the waist, for gi techniques.
  function belt(fig, j) {
    const at = go(j.hip, fig.t, LEN.torso * fig.tl * 0.2);
    const half = RAD.hip + 2 + 4 * fig.w;
    const a = go(at, fig.t + 90, half), b = go(at, fig.t - 90, half);
    const knot = go(at, fig.t + 90 * fig.face, fig.w < 0.5 ? half - 2 : 0);
    const tail = go(knot, fig.t + 180 - 25 * fig.face, 9);
    return `M${r1(a[0])},${r1(a[1])}L${r1(b[0])},${r1(b[1])}M${r1(knot[0])},${r1(knot[1])}L${r1(tail[0])},${r1(tail[1])}`;
  }

  // "~" mirrors a pose left to right, "!" swaps who is solid. E.g. 'mount !' is the same picture with you underneath.
  function parseRef(ref) {
    const [id, ...flags] = ref.trim().split(/\s+/);
    return { id, mirror: flags.includes('~'), swap: flags.includes('!') };
  }

  const DEFAULT_ORDER = 'Ba2 Bl2 Aa2 Al2 Bt Bl1 Ba1 At Al1 Aa1';

  function render(ref, opts = {}) {
    const { id, mirror, swap } = parseRef(ref);
    const pose = global.Figures.poses[id];
    if (!pose) return `<svg class="fig missing" viewBox="0 0 ${VIEW[0]} ${VIEW[1]}"></svg>`;
    let solved;
    try { solved = solve(pose); } catch (e) {
      console.error(`pose ${id}:`, e.message);
      return `<svg class="fig missing" viewBox="0 0 ${VIEW[0]} ${VIEW[1]}"><text x="10" y="20">${id}: ${e.message}</text></svg>`;
    }
    const { figs, joints } = solved;
    const you = swap ? 'B' : 'A';

    const parts = [];
    for (const tok of (pose.z || DEFAULT_ORDER).split(/\s+/)) {
      const who = tok[0], part = tok.slice(1);
      const fig = figs[who], j = joints[who];
      const far = part !== 't' && part[1] === '2' && fig.w < 0.5;
      const cls = `${who === you ? 'you' : 'them'}${far ? ' far' : ''}`;
      parts.push(`<g class="${cls}">${partPaths(fig, j, part).map(d => `<path d="${d}"/>`).join('')}` +
        (part === 't' && opts.gi ? `<path class="belt" d="${belt(fig, j)}"/>` : '') + '</g>');
    }

    // Frame: the middle of everything drawn, at a fixed scale (bigger only if it wouldn't fit).
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const who of ['A', 'B']) {
      for (const [k, p] of Object.entries(joints[who])) {
        if (!Array.isArray(p) || k.endsWith('dir') || typeof p[0] !== 'number') continue;
        const pad = k === 'head' ? RAD.head : k.startsWith('hip') || k === 'chest' ? RAD.chest : 6;
        minX = Math.min(minX, p[0] - pad); maxX = Math.max(maxX, p[0] + pad);
        minY = Math.min(minY, p[1] - pad); maxY = Math.max(maxY, p[1] + pad);
      }
    }
    const side = (pose.view || 'side') === 'side';
    const groundY = side ? (pose.ground !== undefined ? pose.ground : maxY - 1.5) : null;
    const margin = 14;
    let vw = VIEW[0], vh = VIEW[1];
    const needW = maxX - minX + margin * 2, needH = maxY - minY + margin * 2 + (side ? 10 : 0);
    const grow = Math.max(1, needW / vw, needH / vh);
    vw *= grow; vh *= grow;
    const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2 + (side ? 0 : 0);
    let vx = cx - vw / 2, vy = cy - vh / 2;
    if (side) vy = Math.min(vy, groundY + 22 - vh);   // keep the floor near the bottom

    // Arrows and rings show the movement and the grips.
    const extras = [];
    for (const a of pose.arrows || []) {
      try {
        const m = a.match(/^(\S+)\s*>\s*(\S+)(?:\s+~(-?[\d.]+))?$/);
        const p = point(m[1], joints), q = point(m[2], joints), bend = Number(m[3] || 0.25);
        const mid = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
        const d = dist(p, q), ang = dir(p, q);
        const c = go(mid, ang - 90, d * bend);
        const end = dir(c, q);
        const back = go(q, end + 180, 2);
        const h1 = go(q, end + 150, 9), h2 = go(q, end - 150, 9);
        extras.push(`<path class="arrow" d="M${r1(p[0])},${r1(p[1])}Q${r1(c[0])},${r1(c[1])} ${r1(back[0])},${r1(back[1])}"/>` +
          `<path class="arrowhead" d="M${r1(q[0])},${r1(q[1])}L${r1(h1[0])},${r1(h1[1])}L${r1(h2[0])},${r1(h2[1])}Z"/>`);
      } catch (e) { console.error(`pose ${id} arrow "${a}":`, e.message); }
    }
    for (const g of pose.grips || []) {
      try {
        const p = point(g, joints);
        extras.push(`<circle class="grip" cx="${r1(p[0])}" cy="${r1(p[1])}" r="9"/>`);
      } catch (e) { console.error(`pose ${id} grip "${g}":`, e.message); }
    }

    // Side views stand on a floor line; views from above get the seams of a mat behind them, so they
    // read as looking down at the floor.
    let floor = '';
    if (side) {
      floor = `<line class="floor" x1="${r1(vx)}" x2="${r1(vx + vw)}" y1="${r1(groundY)}" y2="${r1(groundY)}"/>`;
    } else {
      const seams = [];
      for (let x = Math.floor(vx / 110) * 110; x < vx + vw; x += 110) seams.push(`M${x},${r1(vy)}V${r1(vy + vh)}`);
      for (let y = Math.floor(vy / 110) * 110 + 55; y < vy + vh; y += 110) seams.push(`M${r1(vx)},${y}H${r1(vx + vw)}`);
      floor = `<path class="mat" d="${seams.join('')}"/>`;
    }
    const flip = mirror ? ` transform="translate(${r1(2 * cx)},0) scale(-1,1)"` : '';
    return `<svg class="fig${side ? '' : ' top'}" viewBox="${r1(vx)} ${r1(vy)} ${r1(vw)} ${r1(vh)}" ` +
      `preserveAspectRatio="xMidYMid meet" aria-hidden="true"><g${flip}>${floor}${parts.join('')}${extras.join('')}</g></svg>`;
  }

  global.Figures = { poses: {}, render, solve, VIEW };
})(window);
