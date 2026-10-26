/*
  Ganesh Unnam · particle shape targets
  Every generator returns a Float32Array of n * 3 positions (x, y, z), y up, roughly inside a unit sphere.
  Deterministic: the same n always gives the same points, so morphs and video renders are repeatable.
  Used by particle-field.js (WebGL) and the ShapeLibrary preview (2D reference).
*/
import { MARK } from './mark-data.js';
const TAU = Math.PI * 2;
export function rng(seed) { let s = seed >>> 0 || 1; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
const gauss = (r) => Math.sqrt(-2 * Math.log(r() + 1e-7)) * Math.cos(TAU * r());
const out = (n) => new Float32Array(n * 3);
const put = (a, i, x, y, z) => { a[i * 3] = x; a[i * 3 + 1] = y; a[i * 3 + 2] = z; };

export function sphere(n) {
  const a = out(n), ga = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) { const y = 1 - 2 * (i + 0.5) / n, r = Math.sqrt(1 - y * y), t = ga * i; put(a, i, Math.cos(t) * r, y, Math.sin(t) * r); }
  return a;
}
export function exploded(n) {
  const a = sphere(n), r = rng(11);
  for (let i = 0; i < n; i++) { const k = 1.25 + Math.pow(r(), 2) * 1.5; for (let j = 0; j < 3; j++) a[i * 3 + j] = a[i * 3 + j] * k + gauss(r) * 0.08; }
  return a;
}
export function torusKnot(n) {
  const a = out(n), r = rng(5), p = 2, q = 3, tube = 0.11;
  for (let i = 0; i < n; i++) {
    const t = TAU * i / n, rr = 0.55 + 0.22 * Math.cos(q * t), cx = rr * Math.cos(p * t), cy = rr * Math.sin(p * t), cz = 0.22 * Math.sin(q * t), ang = r() * TAU;
    put(a, i, cx + Math.cos(ang) * tube * Math.cos(p * t), cy + Math.cos(ang) * tube * Math.sin(p * t), cz + Math.sin(ang) * tube);
  }
  return a;
}
export function ring(n) {
  const a = out(n), r = rng(3);
  for (let i = 0; i < n; i++) { const t = r() * TAU, w = gauss(r) * 0.035; put(a, i, (1 + w) * Math.cos(t), gauss(r) * 0.02, (1 + w) * Math.sin(t)); }
  return a;
}
export function agents(n) {
  const a = out(n), r = rng(21), nodes = [[0, 0, 0, 0.2], [-0.75, 0.35, 0.2, 0.1], [0.7, 0.45, -0.3, 0.1], [0.55, -0.55, 0.35, 0.1], [-0.5, -0.5, -0.4, 0.1]];
  for (let i = 0; i < n; i++) {
    if (i < n * 0.55) {
      const nd = nodes[i % 5], u = r() * 2 - 1, ang = r() * TAU, s = Math.sqrt(1 - u * u);
      put(a, i, nd[0] + nd[3] * s * Math.cos(ang), nd[1] + nd[3] * u, nd[2] + nd[3] * s * Math.sin(ang));
    } else {
      const k = i % 3, t = r() * TAU, rx = [1, 0.8, 0.6][k], tilt = [0.3, -0.6, 1.1][k], x = rx * Math.cos(t), z = rx * 0.9 * Math.sin(t);
      put(a, i, x, z * Math.sin(tilt), z * Math.cos(tilt));
    }
  }
  return a;
}
export function web(n) {
  const a = out(n), side = Math.ceil(Math.sqrt(n * 1.6)), rows = Math.ceil(n / side);
  for (let i = 0; i < n; i++) { const gx = (i % side) / (side - 1) * 2 - 1, gz = Math.floor(i / side) / Math.max(1, rows - 1) * 2 - 1; put(a, i, gx * 1.25, Math.sin(gx * 4 + gz * 2) * 0.14 + Math.cos(gz * 5) * 0.06 - 0.1, gz * 0.8); }
  return a;
}
export function commerce(n) {
  const a = out(n), r = rng(9), cubes = [[-0.5, -0.42, 0, 0.62], [0.42, -0.5, 0.12, 0.5], [-0.04, 0.36, -0.06, 0.56]];
  for (let i = 0; i < n; i++) {
    const c = cubes[i % 3], f = Math.floor(r() * 6), u = r() * 2 - 1, v = r() * 2 - 1;
    const p = f < 2 ? [f ? 1 : -1, u, v] : f < 4 ? [u, f === 2 ? 1 : -1, v] : [u, v, f === 4 ? 1 : -1];
    put(a, i, c[0] + p[0] * c[3] / 2, c[1] + p[1] * c[3] / 2, c[2] + p[2] * c[3] / 2);
  }
  return a;
}
export function seo(n) {
  const a = out(n), r = rng(4);
  for (let i = 0; i < n; i++) {
    const t = i / n;
    if (i % 7 === 0) { const g = Math.floor(r() * 18) / 18, aa = g * TAU * 3.2, s = r() * 2 - 1, rr = 0.22 + g * 0.38; put(a, i, Math.cos(aa) * rr * s, -1 + g * 2, Math.sin(aa) * rr * s); }
    else { const ang = t * TAU * 3.2 + (i % 2 ? Math.PI : 0), rad = 0.22 + t * 0.38; put(a, i, Math.cos(ang) * rad + gauss(r) * 0.015, -1 + t * 2, Math.sin(ang) * rad + gauss(r) * 0.015); }
  }
  return a;
}
export function automation(n) {
  const a = out(n), r = rng(8);
  for (let i = 0; i < n; i++) { const t = r() * TAU, w = (r() - 0.5) * 0.28, s = Math.sin(t), c = Math.cos(t), d = 1 + s * s; put(a, i, 1.3 * c / d, 1.1 * s * c / d + w * Math.cos(t), w * Math.sin(t) + 0.25 * Math.sin(2 * t)); }
  return a;
}
export function cloud(n) {
  const a = out(n), r = rng(13), blobs = [[-0.5, -0.05, 0, 0.6], [0.2, 0.18, 0.1, 0.7], [0.75, -0.1, -0.05, 0.5], [-0.08, -0.3, 0.3, 0.5], [0.3, -0.28, -0.35, 0.45]];
  for (let i = 0; i < n; i++) { const b = blobs[i % 5]; put(a, i, b[0] + gauss(r) * b[3] * 0.45, b[1] + gauss(r) * b[3] * 0.32, b[2] + gauss(r) * b[3] * 0.45); }
  return a;
}
export function notFound(n) {
  const a = sphere(n), r = rng(404);
  for (let i = 0; i < n; i++) {
    const y = a[i * 3 + 1], fall = y < 0.1 ? Math.pow(r(), 1.6) * (1.1 - y) * 0.9 : 0;
    a[i * 3] = a[i * 3] * (1 + fall * 0.25) + gauss(r) * fall * 0.05; a[i * 3 + 1] = y - fall * 1.1; a[i * 3 + 2] *= (1 + fall * 0.25);
  }
  return a;
}
export function constellation(n) {
  const a = out(n), r = rng(31), centers = [];
  for (let c = 0; c < 9; c++) centers.push([r() * 2.4 - 1.2, r() * 1.4 - 0.7, r() * 1.2 - 0.6]);
  for (let i = 0; i < n; i++) {
    if (i % 4 === 0) put(a, i, r() * 2.6 - 1.3, r() * 1.6 - 0.8, r() * 1.4 - 0.7);
    else { const k = centers[i % 9]; put(a, i, k[0] + gauss(r) * 0.06, k[1] + gauss(r) * 0.06, k[2] + gauss(r) * 0.06); }
  }
  return a;
}
/* The "gu." mark as a flat slab of points (for the logo sting). Needs a DOM canvas to rasterise the outline. */
export function mark(n) {
  if (typeof document === 'undefined') return sphere(n);
  const d = MARK.d, bx = MARK.box; // [x, y, w, h] of the viewBox
  const W = 400, H = Math.round(W * bx[3] / bx[2]), cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d'); ctx.scale(W / bx[2], H / bx[3]); ctx.translate(-bx[0], -bx[1]); ctx.fill(new Path2D(d));
  const dot = MARK.dot; if (dot) { ctx.beginPath(); ctx.arc(dot[0], dot[1], dot[2], 0, TAU); ctx.fill(); }
  const img = ctx.getImageData(0, 0, W, H).data, pts = [];
  for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 2) if (img[(y * W + x) * 4 + 3] > 128) pts.push([x, y]);
  const a = out(n), r = rng(17), s = 2.2 / W;
  for (let i = 0; i < n; i++) { const p = pts[Math.floor(r() * pts.length)] || [0, 0]; put(a, i, (p[0] - W / 2) * s + (r() - 0.5) * s, -(p[1] - H / 2) * s + (r() - 0.5) * s, (r() - 0.5) * 0.06); }
  return a;
}
export const SHAPES = { sphere, exploded, torusKnot, ring, agents, web, commerce, seo, automation, cloud, constellation, notFound, mark };
/* Scatter used mid-morph, per target shape (see the 3D section). */
export const SCATTER = { sphere: 0.15, exploded: 0, torusKnot: 0.35, ring: 0.3, agents: 0.45, web: 0.4, commerce: 0.45, seo: 0.35, automation: 0.4, cloud: 0.5, constellation: 0.6, notFound: 0.25, mark: 0.3 };
