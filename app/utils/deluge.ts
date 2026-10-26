// The "deluge" self-destruct sequence: a liquid made of falling code rises from the bottom of the
// screen, the copies of what is on screen (from collapse.ts) float, roll in the storm, sink, and the
// drain takes everything away. Browser-only.

import type { Body } from './collapse';

const TAU = Math.PI * 2;
const GLYPHS = '01アイウエオカキクケコサシスセソ<>/{}[]=+*#$%';
const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace';
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const glyph = () => GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length));

// Lengths and speeds were tuned on a 1280 × 800 screen: they scale with the diagonal
export const screenScale = () => Math.hypot(window.innerWidth, window.innerHeight) / 1509;

// "r,g,b" mixed toward white (amount 0 → 1)
const lighten = (rgb: string, amount: number) => rgb.split(',').map((v) => Math.round(Number(v) + (255 - Number(v)) * amount)).join(',');
const darken = (rgb: string, amount: number) => rgb.split(',').map((v) => Math.round(Number(v) * amount)).join(',');

/* ---------- The liquid ---------- */

// Surface = level + a computed swell + ripples from a 1D wave equation that bodies and drops disturb
export interface Liquid {
  level: number;
  amp: number;
  phase: number;
  at: (x: number) => number;
  slope: (x: number) => number;
  poke: (x: number, v: number, width: number) => void;
  step: (dt: number) => void;
}

export function createLiquid(): Liquid {
  const W = window.innerWidth;
  const k = screenScale();
  const N = 129;
  const DX = W / (N - 1);
  const hf = new Float32Array(N);
  const hv = new Float32Array(N);
  const liquid: Liquid = {
    level: window.innerHeight + 30,
    amp: 0,
    phase: 0,
    at(x) {
      const u = clamp(x / DX, 0, N - 1.001);
      const i = Math.floor(u);
      const f = u - i;
      const swell = liquid.amp * (Math.sin((x / (520 * k)) * TAU - liquid.phase) + 0.4 * Math.sin((x / (230 * k)) * TAU + liquid.phase * 0.6));
      return liquid.level + swell + (hf[i] ?? 0) * (1 - f) + (hf[i + 1] ?? 0) * f;
    },
    slope: (x) => (liquid.at(x + 6) - liquid.at(x - 6)) / 12,
    poke(x, v, width) {
      const r = Math.max(1, Math.round(width / 2 / DX));
      const c = Math.round(clamp(x / DX, 0, N - 1));
      for (let i = Math.max(1, c - r); i <= Math.min(N - 2, c + r); i += 1) hv[i] = (hv[i] ?? 0) + v * (1 - Math.abs(i - c) / (r + 1));
    },
    step(dt) {
      const sub = 3;
      const h = dt / sub;
      const c2 = ((260 * k) ** 2) / (DX * DX);
      const damp = Math.exp(-1.4 * h);
      for (let s = 0; s < sub; s += 1) {
        for (let i = 1; i < N - 1; i += 1) hv[i] = (hv[i] ?? 0) + c2 * ((hf[i - 1] ?? 0) + (hf[i + 1] ?? 0) - 2 * (hf[i] ?? 0)) * h;
        for (let i = 1; i < N - 1; i += 1) {
          hv[i] = (hv[i] ?? 0) * damp;
          hf[i] = (hf[i] ?? 0) + (hv[i] ?? 0) * h;
        }
        hf[0] = hf[1] ?? 0;
        hf[N - 1] = hf[N - 2] ?? 0;
      }
      // Every drop and splash pushes the surface down: without this, the ripples would add up to a
      // surface sunk well below the level. Removing their mean keeps the volume and the waves.
      let mean = 0;
      for (let i = 0; i < N; i += 1) mean += hf[i] ?? 0;
      mean /= N;
      for (let i = 0; i < N; i += 1) hf[i] = (hf[i] ?? 0) - mean;
    },
  };
  return liquid;
}

/* ---------- Drawing: the liquid, falling drops, splashes, bubbles, drips ---------- */

interface Drop {
  x: number;
  y: number;
  vy: number;
}

export interface Spray {
  kind: 'glyph' | 'bubble' | 'drip';
  x: number;
  y: number;
  // Where a drip started, for its trail
  y0: number;
  vx: number;
  vy: number;
  g: number;
  r: number;
  life: number;
  age: number;
  ch: string;
}

export interface Flood {
  drop: (x: number, y: number, vy: number) => void;
  spray: (p: Partial<Spray> & { x: number; y: number }) => void;
  // landed: a drop reached the surface at x
  frame: (dt: number, liquid: Liquid | null, landed: (x: number) => void) => void;
  clear: () => void;
}

// color: the theme's "terminal" colour, as "r,g,b". still: the code inside the liquid does not
// scroll (less motion).
export function createFlood(canvas: HTMLCanvasElement, color: string, still: boolean): Flood {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  const g = canvas.getContext('2d');
  g?.setTransform(dpr, 0, 0, dpr, 0, 0);
  const light = lighten(color, 0.7);
  const drops: Drop[] = [];
  const sprays: Spray[] = [];
  let scroll = 0;

  // A sheet of falling code, drawn once, then scrolled under the surface
  const sheet = document.createElement('canvas');
  sheet.width = Math.round(W * dpr);
  sheet.height = Math.round(H * dpr);
  const t = sheet.getContext('2d');
  if (t) {
    t.setTransform(dpr, 0, 0, dpr, 0, 0);
    t.font = `600 14px ${MONO}`;
    t.textBaseline = 'top';
    for (let x = 4; x < W; x += 16) {
      let y = -Math.random() * H;
      while (y < H) {
        const length = 6 + Math.floor(Math.random() * 18);
        for (let i = 0; i < length; i += 1) {
          t.fillStyle = i === length - 1 ? `rgba(${light},.95)` : `rgba(${color},${(0.1 + 0.5 * (i / length)).toFixed(2)})`;
          t.fillText(glyph(), x, y + i * 18);
        }
        y += length * 18 + 40 + Math.random() * 160;
      }
    }
  }
  const fill = g?.createLinearGradient(0, 0, 0, H);
  fill?.addColorStop(0, `rgba(${darken(color, 0.28)},.92)`);
  fill?.addColorStop(1, `rgba(${darken(color, 0.08)},.98)`);

  function drawLiquid(liquid: Liquid) {
    if (!g || !fill || liquid.level > H + 40) return;
    g.beginPath();
    g.moveTo(0, H + 20);
    for (let x = 0; x <= W + 8; x += 8) g.lineTo(x, liquid.at(x));
    g.lineTo(W, H + 20);
    g.closePath();
    g.save();
    g.clip();
    g.globalAlpha = 0.62;
    g.fillStyle = fill;
    g.fillRect(0, 0, W, H);
    const y0 = scroll % H;
    g.globalAlpha = 0.53;
    g.drawImage(sheet, 0, y0 - H, W, H);
    g.drawImage(sheet, 0, y0, W, H);
    g.restore();
    g.globalAlpha = 1;
    g.beginPath();
    for (let x = 0; x <= W + 8; x += 8) {
      const y = liquid.at(x);
      if (x) g.lineTo(x, y);
      else g.moveTo(x, y);
    }
    g.strokeStyle = `rgba(${lighten(color, 0.55)},.95)`;
    g.lineWidth = 2;
    g.shadowColor = `rgba(${color},.9)`;
    g.shadowBlur = 10;
    g.stroke();
    g.shadowBlur = 0;
  }

  return {
    drop(x, y, vy) {
      drops.push({ x, y, vy });
    },
    spray(p) {
      sprays.push({
        kind: 'glyph', y0: p.y, vx: 0, vy: 0, g: 0, r: 2, life: 1, age: 0, ch: glyph(), ...p,
      });
    },
    frame(dt, liquid, landed) {
      if (!g) return;
      if (!still) scroll += dt * 70;
      for (let i = drops.length - 1; i >= 0; i -= 1) {
        const d = drops[i];
        if (!d) continue;
        d.vy += 1200 * dt;
        d.y += d.vy * dt;
        const surface = liquid ? liquid.at(d.x) : H + 20;
        if (d.y > surface || d.y > H + 20) {
          if (d.y <= H + 10) landed(d.x);
          drops.splice(i, 1);
        }
      }
      for (let i = sprays.length - 1; i >= 0; i -= 1) {
        const p = sprays[i];
        if (!p) continue;
        p.age += dt;
        // A bubble bursts at the surface
        if (p.kind === 'bubble' && liquid && p.y < liquid.at(p.x)) p.age = p.life;
        if (p.age >= p.life) {
          const last = sprays.pop();
          if (last && i < sprays.length) sprays[i] = last;
          continue;
        }
        p.vy += p.g * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
      }

      g.clearRect(0, 0, W, H);
      g.fillStyle = `rgba(${light},.85)`;
      for (const d of drops) g.fillRect(d.x - 1, d.y - 10, 2, 10);
      if (liquid) drawLiquid(liquid);
      g.font = `600 13px ${MONO}`;
      g.textBaseline = 'middle';
      for (const p of sprays) {
        const a = (1 - p.age / p.life).toFixed(3);
        if (p.kind === 'bubble') {
          g.strokeStyle = `rgba(${light},${a})`;
          g.lineWidth = 1;
          g.beginPath();
          g.arc(p.x, p.y, p.r, 0, TAU);
          g.stroke();
        } else {
          if (p.kind === 'drip') {
            g.strokeStyle = `rgba(${color},${(Number(a) * 0.55).toFixed(3)})`;
            g.lineWidth = 2;
            g.beginPath();
            g.moveTo(p.x, p.y0);
            g.lineTo(p.x, p.y);
            g.stroke();
          }
          g.fillStyle = `rgba(${light},${a})`;
          g.fillText(p.ch, p.kind === 'drip' ? p.x - 4 : p.x, p.y);
        }
      }
    },
    clear() {
      drops.length = 0;
      sprays.length = 0;
      g?.clearRect(0, 0, W, H);
    },
  };
}

/* ---------- Floating ---------- */

export interface Floater {
  body: Body;
  wet: boolean;
  // Buoyancy against gravity: above 1 it floats, below it sinks
  buoy: number;
  sinkTo: number;
  sinkAt: number;
}

export const toFloater = (body: Body): Floater => ({
  body, wet: false, buoy: rand(1.6, 2.1), sinkTo: rand(0.35, 0.6), sinkAt: rand(15.4, 17.5),
});

const halfW = (b: Body) => (b.lying ? b.h0 : b.w0) / 2;
const halfH = (b: Body) => (b.lying ? b.w0 : b.h0) / 2;

export function renderBody(b: Body) {
  b.el.style.transform = `translate(${(b.cx - b.w0 / 2).toFixed(1)}px, ${(b.cy - b.h0 / 2).toFixed(1)}px) rotate(${b.a.toFixed(3)}rad)`;
}

// Buoyancy from the submerged part, drag in the liquid, a rotation that follows the slope of the
// wave, then straight boxes pushing each other apart. entered: a body hit the surface fast.
export function floatStep(floaters: Floater[], liquid: Liquid, t: number, dt: number, entered: (b: Body, speed: number) => void) {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const k = screenScale();
  const G = 1100 * k;
  const sub = 2;
  const h = dt / sub;
  const current = 40 * k * Math.sin(t * 0.7);
  for (let s = 0; s < sub; s += 1) {
    for (const f of floaters) {
      const b = f.body;
      if (!b.active || b.off) continue;
      const bw = halfW(b);
      const bh = halfH(b);
      const surface = liquid.at(b.cx);
      const under = clamp((b.cy + bh - surface) / (2 * bh), 0, 1);
      if (t > f.sinkAt) f.buoy += (f.sinkTo - f.buoy) * Math.min(1, h * 0.9);
      b.vy += G * h - G * f.buoy * under * h;
      b.va *= Math.exp(-1.2 * h);
      const base = b.lying ? Math.PI / 2 : 0;
      if (under > 0) {
        const damp = Math.exp(-2.6 * under * h);
        b.vx *= damp;
        b.vy *= damp;
        const slope = liquid.slope(b.cx);
        b.vx += (current - slope * 900 * k) * under * h;
        // Lean with the wave, but never past about 25°
        const target = base + clamp(Math.atan(slope) * 0.8, -0.45, 0.45) * (under < 0.95 ? 1 : 0.3);
        b.va += ((target - b.a) * 9 - b.va * 2.5) * under * h;
        if (!f.wet) {
          f.wet = true;
          if (b.vy > 120 * k) entered(b, b.vy);
        }
      } else if (f.wet) {
        f.wet = false;
      }
      b.cx += b.vx * h;
      b.cy += b.vy * h;
      b.a = base + clamp(b.a + b.va * h - base, -0.9, 0.9);
      if (b.cx - bw < 0) {
        b.cx = bw;
        b.vx = Math.abs(b.vx) * 0.4;
      }
      if (b.cx + bw > W) {
        b.cx = W - bw;
        b.vx = -Math.abs(b.vx) * 0.4;
      }
      if (b.cy - bh > H + 160) {
        b.off = true;
        b.el.style.display = 'none';
      }
    }
    for (let i = 0; i < floaters.length; i += 1) {
      const a = floaters[i]?.body;
      if (!a || !a.active || a.off) continue;
      for (let j = i + 1; j < floaters.length; j += 1) {
        const b = floaters[j]?.body;
        if (!b || !b.active || b.off) continue;
        const ox = halfW(a) + halfW(b) - Math.abs(a.cx - b.cx);
        if (ox <= 0) continue;
        const oy = halfH(a) + halfH(b) - Math.abs(a.cy - b.cy);
        if (oy <= 0) continue;
        if (oy < ox) {
          const sign = a.cy < b.cy ? -1 : 1;
          a.cy += (sign * oy) / 2;
          b.cy -= (sign * oy) / 2;
          const m = (a.vy + b.vy) / 2;
          a.vy = m + (a.vy - m) * 0.2;
          b.vy = m + (b.vy - m) * 0.2;
        } else {
          const sign = a.cx < b.cx ? -1 : 1;
          a.cx += (sign * ox) / 2;
          b.cx -= (sign * ox) / 2;
          const m = (a.vx + b.vx) / 2;
          a.vx = m + (a.vx - m) * 0.2;
          b.vx = m + (b.vx - m) * 0.2;
        }
      }
    }
  }
}
