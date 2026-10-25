// The "overheat" self-destruct sequence: the site heats up and drips, then the screen melts down in
// columns over molten metal and ends in ashes. The columns are copies of the screen, so the page
// itself only gets filters. Browser-only.

import { scanScreen } from './collapse';
import { copyCanvases } from './fracture';

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

/* ---------- Columns ---------- */

export interface Column {
  el: HTMLElement;
  x: number;
  w: number;
  y: number;
  accel: number;
  gone: boolean;
}

// Strips of the screen, each a copy of the template in a box its own width, so the browser never
// keeps dozens of full-screen pictures
export function createColumns(container: HTMLElement, template: HTMLElement, count: number): Column[] {
  const W = window.innerWidth;
  const H = window.innerHeight;
  return Array.from({ length: count }, (_, i) => {
    const left = Math.floor((i * W) / count);
    const width = Math.ceil(((i + 1) * W) / count) - left;
    const el = document.createElement('div');
    Object.assign(el.style, {
      position: 'absolute', left: `${left}px`, top: '0', width: `${width}px`, height: `${H}px`, overflow: 'hidden', transformOrigin: '50% 0', willChange: 'transform',
    });
    const copy = template.cloneNode(true) as HTMLElement;
    copy.style.left = `${-left}px`;
    copyCanvases(template, copy);
    el.appendChild(copy);
    container.appendChild(el);
    return {
      el, x: left, w: width, y: 0, accel: rand(150, 230) * (H / 800), gone: false,
    };
  });
}

// Start delays that wander from one column to the next, so the melt has ragged but coherent edges
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
  // Columns whose top edge glows
  edges: Column[];
}

export interface Heat {
  drip: (source: DropSource) => void;
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
    drip(s) {
      const x = s.x + rand(4, Math.max(5, s.w - 4));
      drops.push({
        x, y0: s.y + s.h, y: s.y + s.h, r: 0.5, v: 0, age: 0, hold: rand(0.3, 0.9), color: s.color,
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
          d.v = Math.min(240, d.v + 320 * dt);
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
      // Each drop leaves a thinning trail behind it
      if (look.drops > 0) {
        g.lineCap = 'round';
        for (const d of drops) {
          g.strokeStyle = `rgba(${d.color},${(0.55 * look.drops).toFixed(3)})`;
          g.lineWidth = d.r * 0.9;
          g.beginPath();
          g.moveTo(d.x, d.y0);
          g.lineTo(d.x, d.y);
          g.stroke();
          g.fillStyle = `rgba(${d.color},${(0.95 * look.drops).toFixed(3)})`;
          g.beginPath();
          g.arc(d.x, d.y, d.r, 0, TAU);
          g.fill();
        }
      }
      // Molten edge on top of each sliding column
      if (look.edges.length) {
        g.shadowColor = 'rgba(255,150,40,1)';
        g.shadowBlur = 12;
        g.fillStyle = 'rgba(255,190,80,.9)';
        for (const c of look.edges) {
          if (!c.gone && c.y >= 2) g.fillRect(c.x, c.y - 2, c.w, 3);
        }
        g.shadowBlur = 0;
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
