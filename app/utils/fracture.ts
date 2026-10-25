// The "fracture" self-destruct sequence: the screen cracks under pressure, then bursts into shards
// that each carry their piece of the real page. Browser-only.

import { screenBlocks } from './corruption';
import { pageBackdrop } from './selfDestructScreen';

export type Point = [number, number];

const rand = (a: number, b: number) => a + Math.random() * (b - a);

/* ---------- Cracks ---------- */

export interface Crack {
  points: Point[];
  length: number;
  drawn: number;
  start: number;
  speed: number;
  // Distance of each point from the impact point, for the rays of the star
  radii: number[];
}

// A jagged line that grows over time from (x, y)
export function crackPath(x: number, y: number, angle: number, length: number, jitter: number, step: [number, number] = [8, 15]): Point[] {
  const points: Point[] = [[x, y]];
  let a = angle;
  let px = x;
  let py = y;
  let total = 0;
  while (total < length) {
    const s = rand(step[0], step[1]);
    a += rand(-jitter, jitter);
    px += Math.cos(a) * s;
    py += Math.sin(a) * s;
    total += s;
    points.push([px, py]);
  }
  return points;
}

export function toCrack(points: Point[], start: number, speed: number, origin?: Point): Crack {
  let length = 0;
  for (let i = 1; i < points.length; i += 1) {
    const p0 = points[i - 1];
    const p1 = points[i];
    if (p0 && p1) length += Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
  }
  return {
    points,
    length,
    drawn: 0,
    start,
    speed,
    radii: origin ? points.map(([x, y]) => Math.hypot(x - origin[0], y - origin[1])) : [],
  };
}

// Point of a ray at a given distance from the impact point
export function pointAt(ray: Crack, radius: number): Point {
  const { points, radii } = ray;
  for (let i = 0; i < points.length; i += 1) {
    const r = radii[i] ?? 0;
    const p = points[i];
    if (!p || r < radius) continue;
    const before = points[i - 1];
    const r0 = radii[i - 1] ?? 0;
    if (!before) return [p[0], p[1]];
    const f = (radius - r0) / (r - r0 || 1);
    return [before[0] + (p[0] - before[0]) * f, before[1] + (p[1] - before[1]) * f];
  }
  const last = points[points.length - 1] ?? [0, 0];
  return [last[0], last[1]];
}

// The part of a ray between two distances from the impact point
export function rayPoints(ray: Crack, r0: number, r1: number): Point[] {
  const inner = ray.points.filter((_, i) => (ray.radii[i] ?? 0) > r0 && (ray.radii[i] ?? 0) < r1);
  return [pointAt(ray, r0), ...inner, pointAt(ray, r1)];
}

/* ---------- Shards ---------- */

export interface Shard {
  el: HTMLElement;
  poly: Point[];
  ring: number;
  cx: number;
  cy: number;
  x: number;
  y: number;
  a: number;
  // Phase of the tumble, faked in 2D by flattening the shard
  ph: number;
  vx: number;
  vy: number;
  va: number;
  tumble: number;
  start: number;
  active: boolean;
  off: boolean;
  floored: boolean;
}

// Canvases are copied empty: their picture is drawn into the copy
export function copyCanvases(from: Element, to: Element) {
  const sources = from.querySelectorAll('canvas');
  to.querySelectorAll('canvas').forEach((canvas, i) => {
    const source = sources[i];
    if (!source) return;
    try {
      canvas.getContext('2d')?.drawImage(source, 0, 0);
    } catch {
      // A canvas that cannot be read stays blank
    }
  });
}

// A copy of what is on screen (header, sections in view), each block at its place, the size of the
// screen. Shards are cut from copies of it.
export function screenTemplate(page: HTMLElement): HTMLElement {
  const screen = document.createElement('div');
  // The page's own background, so the shards are as opaque as the screen was
  Object.assign(screen.style, {
    position: 'absolute', left: '0', top: '0', width: `${window.innerWidth}px`, height: `${window.innerHeight}px`, background: pageBackdrop(page),
  });
  for (const block of screenBlocks(page)) {
    const r = block.getBoundingClientRect();
    const copy = block.cloneNode(true) as HTMLElement;
    copy.removeAttribute('id');
    copy.querySelectorAll('[id]').forEach((node) => node.removeAttribute('id'));
    copy.style.inset = 'auto';
    Object.assign(copy.style, {
      position: 'absolute', left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px`, margin: '0', transform: 'none',
    });
    copyCanvases(block, copy);
    screen.appendChild(copy);
  }
  return screen;
}

// One shard: a copy of the screen, cut by the polygon, in a box no larger than its part of the
// screen, so the browser never keeps dozens of full-screen pictures
export function createShard(container: HTMLElement, template: HTMLElement, poly: Point[], ring: number): Shard {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const xs = poly.map(([x]) => x);
  const ys = poly.map(([, y]) => y);
  const left = Math.max(0, Math.floor(Math.min(...xs)));
  const top = Math.max(0, Math.floor(Math.min(...ys)));
  const width = Math.max(1, Math.min(W, Math.ceil(Math.max(...xs))) - left);
  const height = Math.max(1, Math.min(H, Math.ceil(Math.max(...ys))) - top);
  const cx = xs.reduce((sum, x) => sum + x, 0) / xs.length;
  const cy = ys.reduce((sum, y) => sum + y, 0) / ys.length;
  const el = document.createElement('div');
  Object.assign(el.style, {
    position: 'absolute',
    left: `${left}px`,
    top: `${top}px`,
    width: `${width}px`,
    height: `${height}px`,
    overflow: 'hidden',
    clipPath: `polygon(${poly.map(([x, y]) => `${(x - left).toFixed(1)}px ${(y - top).toFixed(1)}px`).join(',')})`,
    transformOrigin: `${(cx - left).toFixed(1)}px ${(cy - top).toFixed(1)}px`,
    willChange: 'transform',
  });
  const copy = template.cloneNode(true) as HTMLElement;
  copy.style.left = `${-left}px`;
  copy.style.top = `${-top}px`;
  copyCanvases(template, copy);
  el.appendChild(copy);
  container.appendChild(el);
  return {
    el, poly, ring, cx, cy, x: 0, y: 0, a: 0, ph: 0, vx: 0, vy: 0, va: 0, tumble: 0, start: 0, active: false, off: false, floored: false,
  };
}

export function renderShard(shard: Shard) {
  shard.el.style.transform = `translate(${shard.x.toFixed(1)}px, ${shard.y.toFixed(1)}px) rotate(${shard.a.toFixed(3)}rad) scale(1, ${Math.cos(shard.ph).toFixed(3)})`;
}

/* ---------- Drawing: cracks, glow, glass edges, glitter ---------- */

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  age: number;
  color: string;
}

export interface Glass {
  cracks: Crack[];
  sparkle: (x: number, y: number, count: number, speed: [number, number], up: number) => void;
  frame: (t: number, dt: number, shards: Shard[], look: { cracks: number; glow: Point | null }) => void;
  clear: () => void;
}

export function createGlass(canvas: HTMLCanvasElement): Glass {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  const g = canvas.getContext('2d');
  g?.setTransform(dpr, 0, 0, dpr, 0, 0);
  const cracks: Crack[] = [];
  const sparks: Spark[] = [];

  function drawCrack(c: Crack, alpha: number) {
    const [first] = c.points;
    if (!g || !first || c.drawn <= 0) return;
    g.beginPath();
    g.moveTo(first[0], first[1]);
    let done = 0;
    for (let i = 1; i < c.points.length; i += 1) {
      const p0 = c.points[i - 1];
      const p1 = c.points[i];
      if (!p0 || !p1) break;
      const segment = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
      if (done + segment >= c.drawn) {
        const f = (c.drawn - done) / segment;
        g.lineTo(p0[0] + (p1[0] - p0[0]) * f, p0[1] + (p1[1] - p0[1]) * f);
        break;
      }
      g.lineTo(p1[0], p1[1]);
      done += segment;
    }
    g.strokeStyle = `rgba(140,200,255,${0.22 * alpha})`;
    g.lineWidth = 3;
    g.stroke();
    g.strokeStyle = `rgba(255,255,255,${0.85 * alpha})`;
    g.lineWidth = 1.2;
    g.stroke();
  }

  return {
    cracks,
    sparkle(x, y, count, speed, up) {
      for (let i = 0; i < count; i += 1) {
        const a = rand(0, Math.PI * 2);
        const v = rand(speed[0], speed[1]);
        sparks.push({
          x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - up, size: rand(1.5, 3.5), life: rand(1, 2.2), age: 0, color: Math.random() < 0.6 ? '#ffffff' : '#9fe8ff',
        });
      }
    },
    frame(t, dt, shards, look) {
      if (!g) return;
      for (const c of cracks) if (t >= c.start && c.drawn < c.length) c.drawn = Math.min(c.length, c.drawn + c.speed * dt);
      for (let i = sparks.length - 1; i >= 0; i -= 1) {
        const s = sparks[i];
        if (!s) continue;
        s.age += dt;
        if (s.age >= s.life) {
          sparks.splice(i, 1);
          continue;
        }
        s.vy += 1400 * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
      }
      g.clearRect(0, 0, W, H);
      if (look.cracks > 0) cracks.forEach((c) => drawCrack(c, look.cracks));
      if (look.glow) {
        const [ox, oy] = look.glow;
        const glow = g.createRadialGradient(ox, oy, 0, ox, oy, 26);
        glow.addColorStop(0, 'rgba(255,255,255,.75)');
        glow.addColorStop(1, 'rgba(255,255,255,0)');
        g.fillStyle = glow;
        g.fillRect(ox - 30, oy - 30, 60, 60);
      }
      // Glass edges follow each shard's transform: translate, rotate, then the flattening of the tumble
      for (const s of shards) {
        if (s.off) continue;
        const cs = Math.cos(s.a);
        const sn = Math.sin(s.a);
        const sy = Math.cos(s.ph);
        g.beginPath();
        s.poly.forEach(([px, py], i) => {
          const dx = px - s.cx;
          const dy = (py - s.cy) * sy;
          const X = s.cx + s.x + dx * cs - dy * sn;
          const Y = s.cy + s.y + dx * sn + dy * cs;
          if (i) g.lineTo(X, Y);
          else g.moveTo(X, Y);
        });
        g.closePath();
        g.fillStyle = sy < 0 ? 'rgba(150,200,255,.10)' : 'rgba(255,255,255,.04)';
        g.fill();
        g.strokeStyle = 'rgba(255,255,255,.55)';
        g.lineWidth = 1.2;
        g.stroke();
      }
      for (const s of sparks) {
        g.globalAlpha = 1 - s.age / s.life;
        g.fillStyle = s.color;
        g.fillRect(s.x - s.size / 2, s.y - s.size / 2, s.size, s.size);
      }
      g.globalAlpha = 1;
    },
    clear() {
      cracks.length = 0;
      sparks.length = 0;
      g?.clearRect(0, 0, W, H);
    },
  };
}
