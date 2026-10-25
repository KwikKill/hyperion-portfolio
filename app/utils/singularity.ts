// The "singularity" self-destruct sequence: a micro black hole opens in the middle of the screen and
// swallows the copies of what is on screen along tightening orbits, then evaporates. The copies come
// from collapse.ts, so the page itself is never moved piece by piece. Browser-only.

import type { Body } from './collapse';

const TAU = Math.PI * 2;
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

// Distances and speeds were tuned on a 1280 × 800 screen: they scale with the diagonal
export const screenScale = () => Math.hypot(window.innerWidth, window.innerHeight) / 1509;

/* ---------- Orbits ---------- */

export interface Orbiter {
  body: Body;
  // 1 for the first screen, 2 for the one that rises after it
  wave: number;
  // Boxes and the header: they go once what they hold is gone, and fall faster
  big: boolean;
  // Area in 1280 × 800 units, for the order of release
  area: number;
  // How much the hole grows when it swallows this one
  weight: number;
  growth: number;
  // Centre of the hole, and the scale of the screen, read once: reading the window size on every
  // frame, after the copies have moved, would force a layout each time
  hx: number;
  hy: number;
  k: number;
  r0: number;
  r: number;
  th0: number;
  th: number;
  release: number;
  inside: Orbiter[];
  active: boolean;
  gone: boolean;
  red: boolean;
}

export function toOrbiters(bodies: Body[], wave: number): Orbiter[] {
  const k = screenScale();
  const hx = window.innerWidth / 2;
  const hy = window.innerHeight / 2;
  return bodies.map((body) => {
    const big = body.kind !== 'leaf';
    const area = (body.w0 * body.h0) / (k * k);
    const th0 = Math.atan2(body.cy - hy, body.cx - hx);
    const r0 = Math.max(1, Math.hypot(body.cx - hx, body.cy - hy));
    return {
      body, wave, big, area, weight: big ? 6 : 0.55 + Math.sqrt(area) / 140, growth: 0, hx, hy, k, r0, r: r0, th0, th: th0,
      release: Infinity, inside: [], active: false, gone: false, red: false,
    };
  });
}

// Small pieces go first, faster and faster; boxes once what they hold is gone, the largest last
export function schedule(orbiters: Orbiter[], start: number, end: number) {
  const span = end - start;
  const leaves = orbiters.filter((o) => !o.big);
  const keys = new Map(leaves.map((o) => [o, o.area * rand(0.5, 1.5)]));
  leaves.sort((a, b) => (keys.get(a) ?? 0) - (keys.get(b) ?? 0));
  leaves.forEach((o, i) => { o.release = start + span * 0.78 * (i / leaves.length) ** 0.8; });
  const boxes = orbiters.filter((o) => o.big).sort((a, b) => a.area - b.area);
  boxes.forEach((o, i) => {
    o.release = start + span * (0.72 + 0.28 * (boxes.length > 1 ? i / (boxes.length - 1) : 1));
    const { src } = o.body;
    o.inside = src ? orbiters.filter((other) => other !== o && !!other.body.src && src.contains(other.body.src)) : [];
  });
}

// One step along a tightening orbit: Kepler-like angular speed (r^-1.5), faster fall near the
// hole. True once the orbiter crosses the horizon.
export function moveOrbiter(o: Orbiter, t: number, dt: number, rh: number, pull: number): boolean {
  const { k } = o;
  const ease = clamp((t - o.release) / 0.6, 0, 1);
  o.r -= (60 + 40000 / (o.r / k + 40)) * k * (o.big ? 1.6 : 1) * pull * ease * dt;
  o.th += clamp(2.2 * (180 / Math.max(o.r / k, 15)) ** 1.5, 0, 16) * ease * dt;
  return o.r <= rh * 1.15 + 2;
}

// Close to the horizon the light shifts to red
const REDSHIFT = 'sepia(1) saturate(5) hue-rotate(-40deg) brightness(1.15)';

// Stretched toward the hole on the way in, shrunk, then reddened near the horizon. At rest (r = r0,
// th = th0) this is the copy's place on screen.
export function renderOrbiter(o: Orbiter) {
  const { body } = o;
  const f = clamp(o.r / o.r0, 0, 1);
  const s = clamp(f ** 0.7, 0.05, 1);
  const stretch = 1.6 * (1 - f) ** 2;
  const x = o.hx + o.r * Math.cos(o.th) - body.w0 / 2;
  const y = o.hy + o.r * Math.sin(o.th) - body.h0 / 2;
  body.el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${o.th.toFixed(3)}rad) scale(${(1 + stretch).toFixed(3)}, ${(1 / (1 + stretch * 0.5)).toFixed(3)}) rotate(${(-o.th0).toFixed(3)}rad) scale(${s.toFixed(3)})`;
  if (!o.red && f < 0.45) {
    o.red = true;
    body.el.style.filter = REDSHIFT;
  }
}

/* ---------- Drawing: bent grid, accretion disk, horizon, jets, sparks ---------- */

interface DiskParticle {
  r: number;
  th: number;
  size: number;
  color: string;
  a: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  drag: number;
  size: number;
  life: number;
  age: number;
  color: string;
}

export interface HoleLook {
  // Radius of the horizon, in pixels
  rh: number;
  grid: number;
  jets: number;
  collapse: boolean;
}

export interface Hole {
  // New matter for the disk, from what was just swallowed
  feed: (count: number, rh: number) => void;
  ring: () => void;
  burst: (count: number, speed: [number, number], life: [number, number], drag: number) => void;
  wave: (t: number) => void;
  // The glow of the Big Bang
  flare: (t: number) => void;
  frame: (t: number, dt: number, look: HoleLook) => void;
  clear: () => void;
}

// colors: "r, g, b" strings, the disk's from the theme, the grid's
export function createHole(canvas: HTMLCanvasElement, colors: { disk: string[]; grid: string }, reduced: boolean): Hole {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const X = W / 2;
  const Y = H / 2;
  const k = screenScale();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  const g = canvas.getContext('2d');
  g?.setTransform(dpr, 0, 0, dpr, 0, 0);
  const disk: DiskParticle[] = [];
  const sparks: Spark[] = [];
  const rings: number[] = [];
  let waveAt = -1;
  let flareAt = -1;
  const pick = () => colors.disk[Math.floor(Math.random() * colors.disk.length)] ?? '255, 255, 255';

  // The fabric of space: a grid whose points are pulled toward the hole
  function drawGrid(alpha: number, rh: number) {
    if (!g || alpha <= 0.005) return;
    const pull = (x: number, y: number): [number, number] => {
      const dx = x - X;
      const dy = y - Y;
      const d = Math.hypot(dx, dy) || 1;
      const p = Math.min(d * 0.92, (rh * 900) / (d / k + 80));
      return [x - (dx / d) * p, y - (dy / d) * p];
    };
    g.strokeStyle = `rgba(${colors.grid},${alpha.toFixed(3)})`;
    g.lineWidth = 1;
    g.beginPath();
    for (let y = 16; y <= H; y += 64) {
      for (let x = -16; x <= W + 16; x += 16) {
        const [px, py] = pull(x, y);
        if (x === -16) g.moveTo(px, py);
        else g.lineTo(px, py);
      }
    }
    for (let x = 0; x <= W; x += 64) {
      for (let y = -16; y <= H + 16; y += 16) {
        const [px, py] = pull(x, y);
        if (y === -16) g.moveTo(px, py);
        else g.lineTo(px, py);
      }
    }
    g.stroke();
  }

  // The disk is tilted: its back half passes behind the hole, its front half in front
  function drawDisk(front: boolean) {
    if (!g) return;
    for (const p of disk) {
      const sn = Math.sin(p.th);
      if ((sn >= 0) !== front) continue;
      g.fillStyle = `rgba(${p.color},${p.a})`;
      g.fillRect(X + p.r * Math.cos(p.th), Y + p.r * sn * 0.3, p.size, p.size);
    }
  }

  return {
    feed(count, rh) {
      for (let i = 0; i < count && disk.length < 1400; i += 1) {
        disk.push({
          r: rh * rand(1.8, 3.5) + rand(10, 50) * k, th: rand(0, TAU), size: rand(1.2, 2.6), color: Math.random() < 0.25 ? '255, 255, 255' : pick(), a: rand(0.5, 0.95),
        });
      }
    },
    ring() {
      rings.push(0);
    },
    burst(count, speed, life, drag) {
      for (let i = 0; i < count; i += 1) {
        const a = rand(0, TAU);
        const v = rand(speed[0], speed[1]) * k;
        sparks.push({
          x: X, y: Y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, drag, size: rand(1.5, 3), life: rand(life[0], life[1]), age: 0, color: pick(),
        });
      }
    },
    wave(t) {
      waveAt = t;
    },
    flare(t) {
      flareAt = t;
    },
    frame(t, dt, look) {
      if (!g) return;
      const { rh } = look;
      // Disk: Kepler-like speeds, a slow drift inward, a fast fall during the collapse
      for (let i = disk.length - 1; i >= 0; i -= 1) {
        const p = disk[i];
        if (!p) continue;
        p.th += clamp(1.8 * (120 / Math.max(p.r / k, rh / k + 2)) ** 1.5, 0, 12) * dt;
        p.r -= (4 + 300 / (p.r / k + 10)) * k * dt * (look.collapse ? 16 : 1);
        if (p.r >= rh * 1.05 && p.r >= 1) continue;
        if (look.collapse) {
          const last = disk.pop();
          if (last && i < disk.length) disk[i] = last;
        } else {
          p.r = rh * rand(2, 5) + rand(20, 80) * k;
        }
      }
      for (let i = sparks.length - 1; i >= 0; i -= 1) {
        const s = sparks[i];
        if (!s) continue;
        s.age += dt;
        if (s.age >= s.life) {
          const last = sparks.pop();
          if (last && i < sparks.length) sparks[i] = last;
          continue;
        }
        const drag = Math.exp(-s.drag * dt);
        s.vx *= drag;
        s.vy *= drag;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
      }
      for (let i = 0; i < rings.length; i += 1) rings[i] = (rings[i] ?? 0) + dt;
      while ((rings[0] ?? 0) > 0.5) rings.shift();

      g.clearRect(0, 0, W, H);
      drawGrid(look.grid, rh);
      g.globalCompositeOperation = 'lighter';
      drawDisk(false);
      if (rh > 0.5) {
        const glow = g.createRadialGradient(X, Y, rh, X, Y, rh * 4 + 20);
        glow.addColorStop(0, 'rgba(255,200,90,.22)');
        glow.addColorStop(1, 'rgba(255,200,90,0)');
        g.fillStyle = glow;
        g.fillRect(X - rh * 4 - 20, Y - rh * 4 - 20, rh * 8 + 40, rh * 8 + 40);
      }
      g.globalCompositeOperation = 'source-over';
      if (rh > 0.5) {
        g.fillStyle = '#000';
        g.beginPath();
        g.arc(X, Y, rh, 0, TAU);
        g.fill();
        // The photon ring
        g.strokeStyle = 'rgba(255,240,200,.9)';
        g.lineWidth = 2;
        g.shadowColor = 'rgba(255,220,120,1)';
        g.shadowBlur = 14;
        g.beginPath();
        g.arc(X, Y, rh * 1.1, 0, TAU);
        g.stroke();
        g.shadowBlur = 0;
      }
      g.globalCompositeOperation = 'lighter';
      drawDisk(true);
      if (look.jets > 0) {
        const length = 420 * k * look.jets;
        const width = reduced ? 6 : rand(4, 9);
        for (const dir of [-1, 1]) {
          const beam = g.createLinearGradient(X, Y, X, Y + dir * length);
          beam.addColorStop(0, `rgba(255,255,255,${0.9 * look.jets})`);
          beam.addColorStop(0.4, `rgba(${colors.grid},${0.5 * look.jets})`);
          beam.addColorStop(1, `rgba(${colors.grid},0)`);
          g.fillStyle = beam;
          g.fillRect(X - width / 2, dir < 0 ? Y - length : Y, width, length);
        }
      }
      g.lineWidth = 1.5;
      for (const age of rings) {
        g.strokeStyle = `rgba(255,255,255,${(0.6 * (1 - age / 0.5)).toFixed(3)})`;
        g.beginPath();
        g.arc(X, Y, rh * 1.15 + age * 60 * k, 0, TAU);
        g.stroke();
      }
      if (waveAt >= 0 && t >= waveAt && t - waveAt < 1.4) {
        const p = (t - waveAt) / 1.4;
        g.strokeStyle = `rgba(255,250,230,${(1 - p).toFixed(3)})`;
        g.lineWidth = 6 * (1 - p) + 1;
        g.beginPath();
        g.arc(X, Y, p * 1.4 * 1100 * k, 0, TAU);
        g.stroke();
      }
      if (flareAt >= 0 && t >= flareAt && t - flareAt < 0.5) {
        const p = (t - flareAt) / 0.5;
        const radius = (20 + p * 260) * k;
        const light = g.createRadialGradient(X, Y, 0, X, Y, radius);
        light.addColorStop(0, `rgba(255,255,255,${(0.9 * (1 - p)).toFixed(3)})`);
        light.addColorStop(1, 'rgba(255,255,255,0)');
        g.fillStyle = light;
        g.fillRect(X - radius, Y - radius, radius * 2, radius * 2);
      }
      for (const s of sparks) {
        g.fillStyle = `rgba(${s.color},${(1 - s.age / s.life).toFixed(3)})`;
        g.fillRect(s.x - s.size / 2, s.y - s.size / 2, s.size, s.size);
      }
      g.globalCompositeOperation = 'source-over';
    },
    clear() {
      disk.length = 0;
      sparks.length = 0;
      rings.length = 0;
      waveAt = -1;
      flareAt = -1;
      g?.clearRect(0, 0, W, H);
    },
  };
}
