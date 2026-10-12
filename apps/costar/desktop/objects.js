// The object of the day under the insight on the left screen: a different thing each day, drawn in the same grainy
// dots as the planets (StarWall.thing in wall.js draws them), like the stippled pictures in the Co-Star app. Each is a
// 3-D shape made of simple solids (a distance function: how far a point is from its surface), so nothing is downloaded
// and no picture is made by AI. `turn` is the angle it's seen from: [tip toward you, turn around], in degrees.
window.STAR_OBJECTS = (() => {
  const { hypot, abs, max, min, sqrt, sin, cos, atan2, PI } = Math;
  const clamp = (v, a, b) => min(b, max(a, v));
  const sphere = (x, y, z, r) => hypot(x, y, z) - r;
  const ellipsoid = (x, y, z, a, b, c) => { const k0 = hypot(x / a, y / b, z / c), k1 = hypot(x / (a * a), y / (b * b), z / (c * c)); return k0 * (k0 - 1) / k1; };
  const box = (x, y, z, a, b, c, r = 0) => {
    const qx = abs(x) - a + r, qy = abs(y) - b + r, qz = abs(z) - c + r;
    return hypot(max(qx, 0), max(qy, 0), max(qz, 0)) + min(max(qx, qy, qz), 0) - r;
  };
  const torus = (x, y, z, R, r) => hypot(hypot(x, z) - R, y) - r;
  const cyl = (x, y, z, h, r, round = 0) => {   // upright, from -h to h
    const dx = hypot(x, z) - r + round, dy = abs(y) - h + round;
    return min(max(dx, dy), 0) + hypot(max(dx, 0), max(dy, 0)) - round;
  };
  const capsule = (x, y, z, ax, ay, az, bx, by, bz, r) => {
    const px = x - ax, py = y - ay, pz = z - az, dx = bx - ax, dy = by - ay, dz = bz - az;
    const h = clamp((px * dx + py * dy + pz * dz) / (dx * dx + dy * dy + dz * dz), 0, 1);
    return hypot(px - dx * h, py - dy * h, pz - dz * h) - r;
  };
  const octa = (x, y, z, s) => (abs(x) + abs(y) + abs(z) - s) * 0.57735;
  const cone = (x, y, z, h, r) => {   // point up at y = h, base radius r at y = 0
    const q = hypot(x, z), k = r / h;
    return max(-y, (q - (h - y) * k) / sqrt(1 + k * k));
  };
  const smin = (a, b, k) => { const h = clamp(0.5 + 0.5 * (b - a) / k, 0, 1); return b + (a - b) * h - k * h * (1 - h); };
  // A shape turned around the up axis from a 2-D outline (x = distance from the axis, y = height).
  const rev = (x, y, z, f) => f(hypot(x, z), y);
  const seg2 = (px, py, ax, ay, bx, by) => {
    const dx = bx - ax, dy = by - ay, h = clamp(((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy), 0, 1);
    return hypot(px - ax - dx * h, py - ay - dy * h);
  };

  return [
    { name: 'An egg', turn: [20, 0], sdf: (x, y, z) => ellipsoid(x, y + 0.05 * y * y, z, 0.62, 0.84, 0.62) },
    { name: 'A ring', turn: [62, 20], sdf: (x, y, z) => torus(x, y, z, 0.62, 0.24) },
    { name: 'Stacked stones', turn: [12, 25], sdf: (x, y, z) => min(
      ellipsoid(x, y + 0.62, z, 0.78, 0.26, 0.62), ellipsoid(x - 0.06, y - 0.03, z, 0.6, 0.22, 0.48),
      ellipsoid(x + 0.04, y - 0.52, z + 0.03, 0.42, 0.18, 0.36), ellipsoid(x, y - 0.86, z, 0.22, 0.12, 0.2)) },
    { name: 'A crystal', turn: [8, 30], sdf: (x, y, z) => octa(x, y * 0.55, z, 0.62) },
    { name: 'A die', turn: [30, 40], sdf: (x, y, z) => {
      let d = box(x, y, z, 0.62, 0.62, 0.62, 0.1);
      const pip = (a, b, c) => sphere(x - a, y - b, z - c, 0.1);
      d = max(d, -pip(0, 0.66, 0));
      for (const [a, c] of [[-0.3, -0.3], [0.3, 0.3]]) d = max(d, -pip(a, c, 0.66));
      for (const [a, c] of [[-0.3, -0.3], [0, 0], [0.3, 0.3]]) d = max(d, -pip(0.66, a, c));
      return d;
    } },
    { name: 'An apple', turn: [14, 0], sdf: (x, y, z) => {
      const r = hypot(x, z);
      const body = sphere(x, y * 1.05, z, 0.72) + 0.12 * Math.exp(-r * r * 9) * (y > 0 ? 1.6 : 1);
      return min(body * 0.8, capsule(x, y, z, 0, 0.5, 0, 0.06, 0.95, 0, 0.035));
    } },
    { name: 'A mushroom', turn: [18, 0], sdf: (x, y, z) => smin(
      max(ellipsoid(x, y - 0.18, z, 0.86, 0.58, 0.86), -(y - 0.16)),
      rev(x, y, z, (r, h) => cyl(r, h + 0.32, 0, 0.5, 0.2 + 0.06 * (h < -0.6 ? 1 : 0), 0.05)), 0.06) },
    { name: 'A pyramid', turn: [10, 35], sdf: (x, y, z) => max(box(x, y + 0.2, z, 0.8, 0.6, 0.8), (abs(x) + (y + 0.8) * 0.8 - 0.8) * 0.78, (abs(z) + (y + 0.8) * 0.8 - 0.8) * 0.78) },
    { name: 'An hourglass', turn: [10, 20], sdf: (x, y, z) => min(
      rev(x, y, z, (r, h) => max(r - (0.07 + 0.42 * abs(h) / 0.68), abs(h) - 0.68) * 0.9),
      cyl(x, y - 0.76, z, 0.07, 0.6, 0.02), cyl(x, y + 0.76, z, 0.07, 0.6, 0.02),
      ...[0, 1, 2].map(i => capsule(x, y, z, 0.5 * cos(i * 2.1 + 0.5), -0.72, 0.5 * sin(i * 2.1 + 0.5), 0.5 * cos(i * 2.1 + 0.5), 0.72, 0.5 * sin(i * 2.1 + 0.5), 0.035))) },
    { name: 'A crescent', turn: [0, 0], sdf: (x, y, z) => max(sphere(x, y, z, 0.8), -sphere(x - 0.4, y - 0.12, z - 0.42, 0.74)) },
    { name: 'A goblet', turn: [16, 0], sdf: (x, y, z) => rev(x, y, z, (r, h) => min(
      max(abs(hypot(r, h - 0.36) - 0.46) - 0.03, h - 0.62),
      seg2(r, h, 0, -0.1, 0, -0.75) - 0.06, seg2(r, h, 0, -0.8, 0.42, -0.84) - 0.04)) * 1 },
    { name: 'A snowman', turn: [6, 0], sdf: (x, y, z) => min(sphere(x, y + 0.5, z, 0.46), sphere(x, y - 0.18, z, 0.34), sphere(x, y - 0.68, z, 0.24),
      capsule(x, y, z, 0, 0.68, 0.2, 0, 0.66, 0.42, 0.04)) },
    { name: 'A chess pawn', turn: [10, 0], sdf: (x, y, z) => rev(x, y, z, (r, h) => min(
      hypot(r, h - 0.6) - 0.26, cyl(r, h - 0.3, 0, 0.04, 0.28, 0.02),
      seg2(r, h, 0, -0.6, 0, 0.3) - (0.12 + 0.26 * clamp(-(h - 0.3) / 0.9, 0, 1) ** 2),
      cyl(r, h + 0.72, 0, 0.1, 0.5, 0.04))) },
    { name: 'Two cherries', turn: [8, 15], sdf: (x, y, z) => min(sphere(x + 0.36, y + 0.42, z, 0.32), sphere(x - 0.34, y + 0.38, z + 0.1, 0.32),
      capsule(x, y, z, -0.36, -0.1, 0, 0, 0.82, 0, 0.025), capsule(x, y, z, 0.34, -0.06, -0.1, 0, 0.82, 0, 0.025),
      ellipsoid(x - 0.2, y - 0.82, z, 0.24, 0.05, 0.12)) },
    { name: 'A spiral shell', turn: [24, 10], sdf: (x, y, z) => {
      // A cone of rings growing as they wind down, smoothed together.
      let d = 9;
      for (let i = 0; i < 9; i++) {
        const t = i / 8, a = i * 1.9, R = 0.06 + 0.42 * t, cy = 0.78 - 1.25 * t;
        d = smin(d, sphere(x - R * 0.55 * cos(a), y - cy, z - R * 0.55 * sin(a), 0.08 + 0.38 * t), 0.12);
      }
      return d;
    } },
    { name: 'A twisted column', turn: [10, 0], sdf: (x, y, z) => {
      const a = y * 1.6, c = cos(a), s = sin(a);
      return box(c * x - s * z, y, s * x + c * z, 0.36, 0.86, 0.36, 0.05) * 0.7;
    } },
    { name: 'A drop of water', turn: [8, 0], sdf: (x, y, z) => smin(sphere(x, y + 0.3, z, 0.55), cone(x, y + 0.25, z, 1.05, 0.38), 0.25) },
    { name: 'A bell', turn: [14, 0], sdf: (x, y, z) => min(rev(x, y, z, (r, h) => max(
      abs(r - (0.22 + 0.5 * clamp((0.55 - h) / 1.1, 0, 1) ** 1.6 + (h < -0.48 ? 0.1 : 0))) - 0.05, abs(h) - 0.55)),
      sphere(x, y + 0.66, z, 0.1), torus(x, y - 0.66, z, 0.1, 0.035)) },
    { name: 'A pearl in its shell', turn: [40, 0], sdf: (x, y, z) => {
      const a = atan2(x, -z), ridges = 0.02 * cos(a * 18);
      const shell = max(ellipsoid(x, y + 0.2, z, 0.9 + ridges, 0.3, 0.8), y + 0.18);
      return min(shell, sphere(x, y + 0.02, z + 0.05, 0.24));
    } },
    { name: 'A double helix', turn: [8, 0], sdf: (x, y, z) => {
      let d = 9;
      for (let i = -9; i <= 9; i++) {
        const h = i * 0.09, a = h * 5.5;
        d = min(d, sphere(x - 0.38 * cos(a), y - h, z - 0.38 * sin(a), 0.1), sphere(x + 0.38 * cos(a), y - h, z + 0.38 * sin(a), 0.1));
        if (i % 2 === 0) d = min(d, capsule(x, y, z, 0.38 * cos(a), h, 0.38 * sin(a), -0.38 * cos(a), h, -0.38 * sin(a), 0.03));
      }
      return d;
    } },
    { name: 'A candle', turn: [8, 0], glow: true, sdf: (x, y, z) => min(cyl(x, y + 0.25, z, 0.6, 0.26, 0.04),
      smin(sphere(x, y - 0.5, z, 0.09), cone(x, y - 0.48, z, 0.42, 0.09), 0.05)) },
    { name: 'Bubbles', turn: [0, 0], sdf: (x, y, z) => min(sphere(x + 0.2, y + 0.18, z, 0.48), sphere(x - 0.46, y - 0.38, z - 0.1, 0.3),
      sphere(x - 0.5, y + 0.36, z + 0.2, 0.2), sphere(x + 0.3, y - 0.62, z + 0.1, 0.16)) },
    { name: 'A key', turn: [30, 0], sdf: (x, y, z) => min(
      max(torus(x, z, y - 0.5, 0.26, 0.07), -1), capsule(x, y, z, 0, 0.24, 0, 0, -0.78, 0, 0.065),
      box(x - 0.13, y + 0.62, z, 0.11, 0.05, 0.05), box(x - 0.11, y + 0.42, z, 0.09, 0.04, 0.05)) },
    { name: 'A lemon', turn: [10, 30], sdf: (x, y, z) => smin(ellipsoid(x, y, z, 0.86, 0.6, 0.6),
      min(ellipsoid(x - 0.84, y, z, 0.14, 0.1, 0.1), ellipsoid(x + 0.84, y, z, 0.12, 0.09, 0.09)), 0.12) },
    { name: 'An arch', turn: [6, 25], sdf: (x, y, z) => min(max(torus(x, z, y + 0.1, 0.56, 0.16) * 1, -(y + 0.1)),
      box(x - 0.56, y + 0.5, z, 0.17, 0.42, 0.17), box(x + 0.56, y + 0.5, z, 0.17, 0.42, 0.17)) },
    { name: 'A spinning top', turn: [14, 0], sdf: (x, y, z) => min(smin(cone(x, -y + 0.1, z, 0.75, 0.62), ellipsoid(x, y - 0.12, z, 0.64, 0.14, 0.64), 0.05),
      cyl(x, y - 0.42, z, 0.24, 0.06, 0.02)) },
  ];
})();
