// The "overheat" self-destruct sequence: the site heats up and drips, then the screen melts down in
// strips over molten metal and ends in ashes. The screen itself is drawn in WebGL (overheatScene.ts);
// here: the temperature, the colours, the shape and motion of the strips, and the canvas of drops,
// embers and ash over it all. Browser-only.

import { scanScreen } from './collapse';

const TAU = Math.PI * 2;
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

/* ---------- Temperature and colours ---------- */

export const PEAK = 147;
// Temperature over time: [seconds, °C]
const CURVE: [number, number][] = [[0, 42], [1.2, 42], [6, 80], [11, 110], [16.4, PEAK]];

export function temperatureAt(t: number): number {
  for (let i = 1; i < CURVE.length; i += 1) {
    const [t0, v0] = CURVE[i - 1] ?? [0, 0];
    const [t1, v1] = CURVE[i] ?? [0, 0];
    if (t <= t1) return v0 + (v1 - v0) * clamp((t - t0) / (t1 - t0), 0, 1);
  }
  return PEAK;
}

// Colours warming up with the heat, from 0 (42 °C) to 1 (the peak): whatever the theme, they turn
// orange
export const warmFilter = (heat: number) => `sepia(${(heat * 0.9).toFixed(2)}) saturate(${(1 + heat * 2.2).toFixed(2)}) hue-rotate(${(-heat * 25).toFixed(1)}deg) brightness(${(1 + heat * 0.2).toFixed(2)})`;
export const COLD_FILTER = 'hue-rotate(170deg) saturate(.6) brightness(1.25)';

// The same filters as colour matrices for the WebGL scene, from the Filter Effects specification:
// rows of a 3 × 3 matrix, multiplied in the order the CSS functions apply
type Matrix = number[];
const multiply = (a: Matrix, b: Matrix): Matrix => Array.from({ length: 9 }, (_, i) => {
  const r = Math.floor(i / 3);
  const c = i % 3;
  return (a[r * 3] ?? 0) * (b[c] ?? 0) + (a[r * 3 + 1] ?? 0) * (b[3 + c] ?? 0) + (a[r * 3 + 2] ?? 0) * (b[6 + c] ?? 0);
});
const sepia = (a: number): Matrix => {
  const n = 1 - a;
  return [0.393 + 0.607 * n, 0.769 - 0.769 * n, 0.189 - 0.189 * n, 0.349 - 0.349 * n, 0.686 + 0.314 * n, 0.168 - 0.168 * n, 0.272 - 0.272 * n, 0.534 - 0.534 * n, 0.131 + 0.869 * n];
};
const saturate = (s: number): Matrix => [0.213 + 0.787 * s, 0.715 - 0.715 * s, 0.072 - 0.072 * s, 0.213 - 0.213 * s, 0.715 + 0.285 * s, 0.072 - 0.072 * s, 0.213 - 0.213 * s, 0.715 - 0.715 * s, 0.072 + 0.928 * s];
const hueRotate = (degrees: number): Matrix => {
  const c = Math.cos((degrees * Math.PI) / 180);
  const s = Math.sin((degrees * Math.PI) / 180);
  return [
    0.213 + c * 0.787 - s * 0.213, 0.715 - c * 0.715 - s * 0.715, 0.072 - c * 0.072 + s * 0.928,
    0.213 - c * 0.213 + s * 0.143, 0.715 + c * 0.285 + s * 0.14, 0.072 - c * 0.072 - s * 0.283,
    0.213 - c * 0.213 - s * 0.787, 0.715 - c * 0.715 + s * 0.715, 0.072 + c * 0.928 + s * 0.072,
  ];
};
// Column-major, as WebGL takes it
const columnMajor = (m: Matrix): Matrix => [0, 3, 6, 1, 4, 7, 2, 5, 8].map((i) => m[i] ?? 0);

export interface Grade {
  matrix: Matrix;
  bright: number;
}

export const warmGrade = (heat: number): Grade => ({
  matrix: columnMajor(multiply(hueRotate(-heat * 25), multiply(saturate(1 + heat * 2.2), sepia(heat * 0.9)))),
  bright: 1 + heat * 0.2,
});
export const COLD_GRADE: Grade = { matrix: columnMajor(multiply(saturate(0.6), hueRotate(170))), bright: 1.25 };

/* ---------- Drops ---------- */

export interface DropSource {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
}

// "r,g,b" of a CSS colour, or null when it is (nearly) transparent
function rgbOf(color: string): string | null {
  const m = color.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+))?/);
  if (!m) return null;
  if (m[4] !== undefined && parseFloat(m[4]) < 0.5) return null;
  return [m[1], m[2], m[3]].map((v) => Number(v)).join(',');
}

// Molten metal: the element's own colour, pulled toward orange
const ORANGE = [255, 150, 40];
function molten(rgb: string): string {
  return rgb.split(',').map((v, i) => Math.round(Number(v) * 0.65 + (ORANGE[i] ?? 0) * 0.35)).join(',');
}

// What drips: the text, buttons and boxes on screen, each in its own colour (a filled button
// drips its fill, text its ink)
export function dropSources(page: HTMLElement): DropSource[] {
  return scanScreen(page).leaves.flatMap((el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 10) return [];
    const cs = getComputedStyle(el);
    const color = rgbOf(cs.backgroundColor) ?? rgbOf(cs.color) ?? '255,235,215';
    return [{
      x: r.left, y: r.top, w: r.width, h: r.height, color: molten(color),
    }];
  });
}

/* ---------- Strips ---------- */

type Point = [number, number];

export interface Strip {
  // The shape at rest, in screen coordinates: rows down the screen, the wavy cut on each side at
  // every row, and the torn top edge (x, how far it dips)
  rows: number[];
  left: number[];
  right: number[];
  top: Point[];
  // Bounding box at rest
  x: number;
  w: number;
  // How far it has slid, and how fast it goes
  y: number;
  v: number;
  accel: number;
  // It stretches by y / stretch as it slides
  stretch: number;
  // Lean (degrees) and side-to-side wobble (pixels) it takes on as it goes, 0 → 1 as it sets off
  lean: number;
  wobble: number;
  phase: number;
  settle: number;
  // Side shift of the wobble right now
  dx: number;
  gone: boolean;
}

// The screen cut into strips: uneven widths, wavy cuts (each shared by its two neighbours, so the
// strips fit together exactly before they slide) and a torn top edge
export function cutStrips(count: number): Strip[] {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const k = H / 800;
  const weights = Array.from({ length: count }, () => rand(0.45, 1.6));
  const sum = weights.reduce((a, b) => a + b, 0);
  const widths = weights.map((weight) => (weight / sum) * W);
  const bases = [0];
  widths.forEach((w, i) => bases.push((bases[i] ?? 0) + w));
  const step = 30 * k;
  const rows: number[] = [];
  for (let y = 0; y < H; y += step) rows.push(y);
  rows.push(H);
  const cuts = bases.map((base, i) => {
    if (i === 0) return rows.map(() => -2);
    if (i === count) return rows.map(() => W + 2);
    // Two waves and some noise, never more than 30 % of the narrower neighbour, so cuts never cross
    const room = Math.min(widths[i - 1] ?? 0, widths[i] ?? 0) * 0.3;
    const a1 = room * rand(0.3, 0.7);
    const a2 = room * rand(0.1, 0.3);
    const l1 = rand(140, 320) * k;
    const l2 = rand(50, 110) * k;
    const p1 = rand(0, TAU);
    const p2 = rand(0, TAU);
    return rows.map((y) => base + a1 * Math.sin((y / l1) * TAU + p1) + a2 * Math.sin((y / l2) * TAU + p2) + rand(-1, 1) * k);
  });
  return widths.map((_, i) => {
    const left = cuts[i] ?? [];
    const right = cuts[i + 1] ?? [];
    const x0 = left[0] ?? 0;
    const x1 = right[0] ?? W;
    // A torn top edge: a random walk that wanders a few pixels down, never twice the same
    const top: Point[] = [];
    const steps = Math.max(2, Math.round((x1 - x0) / (7 * k)));
    let dip = rand(0, 8) * k;
    for (let s = 0; s <= steps; s += 1) {
      dip = clamp(dip + rand(-3.5, 3.5) * k, 0, 12 * k);
      top.push([x0 + ((x1 - x0) * s) / steps, dip]);
    }
    const xs = [...left, ...right];
    const x = Math.min(...xs);
    return {
      rows,
      left,
      right,
      top,
      x,
      w: Math.max(...xs) - x,
      y: 0,
      v: 0,
      accel: rand(150, 230) * k,
      stretch: rand(1300, 2600) * k,
      lean: rand(-2.5, 2.5),
      wobble: rand(1.5, 5) * k,
      phase: rand(0, TAU),
      settle: 0,
      dx: 0,
      gone: false,
    };
  });
}

// One strip s seconds after it started sliding: a steady acceleration, a slow lean and wobble
export function slideStrip(c: Strip, s: number, t: number) {
  c.y = 0.5 * c.accel * s * s + 12 * s;
  c.v = c.accel * s + 12;
  if (c.y > window.innerHeight + 40) {
    c.gone = true;
    return;
  }
  c.settle = Math.min(1, s);
  c.dx = Math.sin(t * 2.3 + c.phase) * c.wobble * c.settle;
}

// Where the top edge of a strip is now, at a point of its edge
export function edgeAt(c: Strip, [x, y]: Point): Point {
  return [x + c.dx, c.y + y * (1 + c.y / c.stretch)];
}

// Start delays that wander from one strip to the next, so the melt has ragged but coherent edges
export function wanderingDelays(count: number, max: number): number[] {
  const delays: number[] = [];
  let d = rand(0, max);
  for (let i = 0; i < count; i += 1) {
    d = clamp(d + rand(-0.16, 0.16), 0, max);
    delays.push(d);
  }
  return delays;
}


/* ---------- Drawing: drops, molten edges, embers, ash, frost ---------- */

interface Drop {
  x: number;
  y0: number;
  y: number;
  r: number;
  v: number;
  vmax: number;
  // Longest trail it leaves behind
  trail: number;
  age: number;
  hold: number;
  color: string;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  g: number;
  drag: number;
  // Side-to-side drift, in pixels per second
  sway: number;
  size: number;
  life: number;
  age: number;
  color: string;
  // Flickers, like an ember
  glow: boolean;
}

export interface HeatLook {
  // Opacity of the drops
  drops: number;
  // Strips whose top edge glows
  edges: Strip[];
}

export interface Heat {
  // A drop from (x, y): it swells for a while, then runs down. From a sliding column it leaves at
  // once, at the speed of the column.
  drip: (x: number, y: number, color: string, v?: number, hold?: number) => void;
  particle: (p: Partial<Particle> & { x: number; y: number }) => void;
  frame: (t: number, dt: number, look: HeatLook) => void;
  clear: () => void;
}

export function createHeat(canvas: HTMLCanvasElement): Heat {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  const g = canvas.getContext('2d');
  g?.setTransform(dpr, 0, 0, dpr, 0, 0);
  const drops: Drop[] = [];
  const particles: Particle[] = [];

  return {
    drip(x, y, color, v = 0, hold = rand(0.3, 0.9)) {
      const k = H / 800;
      drops.push({
        // From a sliding column, a bead with no trail: a trail would stick out above its edge
        x, y0: y, y, r: hold ? 0.5 : rand(1.6, 3), v, vmax: Math.max(240, v + 300), trail: hold ? rand(60, 140) * k : 0, age: 0, hold, color,
      });
    },
    particle(p) {
      particles.push({
        vx: 0, vy: 0, g: 0, drag: 0, sway: 0, size: 2, life: 1, age: 0, color: '255,140,40', glow: false, ...p,
      });
    },
    frame(t, dt, look) {
      if (!g) return;
      // A bead swells under the element, then runs down
      for (let i = drops.length - 1; i >= 0; i -= 1) {
        const d = drops[i];
        if (!d) continue;
        d.age += dt;
        if (d.age < d.hold) {
          d.r = Math.min(3.4, d.r + dt * 5);
        } else {
          d.v = Math.min(d.vmax, d.v + 320 * dt);
          d.y += d.v * dt;
        }
        if (d.y > H + 10) drops.splice(i, 1);
      }
      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const p = particles[i];
        if (!p) continue;
        p.age += dt;
        if (p.age >= p.life) {
          const last = particles.pop();
          if (last && i < particles.length) particles[i] = last;
          continue;
        }
        p.vy += p.g * dt;
        const drag = Math.exp(-p.drag * dt);
        p.vx *= drag;
        p.vy *= drag;
        p.x += (p.vx + Math.sin(t * 2 + p.age * 3 + p.size) * p.sway) * dt;
        p.y += p.vy * dt;
      }

      g.clearRect(0, 0, W, H);
      // Each drop leaves a short trail behind it, which breaks off as it falls
      if (look.drops > 0) {
        g.lineCap = 'round';
        for (const d of drops) {
          g.strokeStyle = `rgba(${d.color},${(0.55 * look.drops).toFixed(3)})`;
          g.lineWidth = d.r * 0.9;
          g.beginPath();
          g.moveTo(d.x, Math.max(d.y0, d.y - d.trail));
          g.lineTo(d.x, d.y);
          g.stroke();
          g.fillStyle = `rgba(${d.color},${(0.95 * look.drops).toFixed(3)})`;
          g.beginPath();
          g.arc(d.x, d.y, d.r, 0, TAU);
          g.fill();
        }
      }
      // Molten edge along the top of each sliding column, all in one path. The glow is a wide faint
      // stroke under a thin bright one: a shadow blur would be computed over the whole screen.
      if (look.edges.length) {
        g.beginPath();
        for (const c of look.edges) {
          if (c.gone || c.y < 2) continue;
          c.top.forEach((point, i) => {
            const [x, y] = edgeAt(c, point);
            if (i) g.lineTo(x, y);
            else g.moveTo(x, y);
          });
        }
        g.lineJoin = 'round';
        g.strokeStyle = 'rgba(255,150,40,.28)';
        g.lineWidth = 7;
        g.stroke();
        g.strokeStyle = 'rgba(255,190,80,.9)';
        g.lineWidth = 2;
        g.stroke();
      }
      g.globalCompositeOperation = 'lighter';
      for (const p of particles) {
        const a = (1 - p.age / p.life) * (p.glow ? 0.6 + 0.4 * Math.random() : 1);
        g.fillStyle = `rgba(${p.color},${a.toFixed(3)})`;
        g.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      }
      g.globalCompositeOperation = 'source-over';
    },
    clear() {
      drops.length = 0;
      particles.length = 0;
      g?.clearRect(0, 0, W, H);
    },
  };
}
