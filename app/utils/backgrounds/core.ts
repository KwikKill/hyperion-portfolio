// Shared pieces of the animated section backgrounds (components/Cyberpunk/CyberpunkBackground.vue):
// types, maths, colours and a few drawing helpers.

export type RGB = [number, number, number];

// The theme colours, read from the --color-* variables (see engine.ts)
export interface Colors {
  p: RGB;
  s: RGB;
  a: RGB;
  b: RGB;
  fg: RGB;
  mu: RGB;
  tm: RGB;
  light: boolean;
}

// Where a scene centres its subject, as fractions of the canvas. A section can free one side of
// the screen for its background: fw and fh are then the size of that free area.
export interface Focus {
  fx: number;
  fy: number;
  fw?: number;
  fh?: number;
}

// A scene's own state: a free-form bag of fields, different for each scene.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SceneState = Record<string, any>;

export interface Stage {
  el: HTMLElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
  dpr: number;
  c: Colors;
  // Scene clock, in seconds
  t: number;
  st: SceneState;
  // Pointer over the section: eased (mx, my) and raw (px, py) position in the canvas, 0 to 1
  mx: number;
  my: number;
  px: number;
  py: number;
  pin: boolean;
  focus: Focus;
  lang: 'fr' | 'en';
}

export interface Scene {
  init(s: Stage): SceneState;
  frame(s: Stage, dt: number): void;
}

export interface Layer {
  cv: HTMLCanvasElement;
  cx: CanvasRenderingContext2D;
  w: number;
  h: number;
}

export interface Area {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const TAU = Math.PI * 2;
export const DEG = Math.PI / 180;
// Tailwind's font-mono stack, the one the page uses
export const MONO = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

export function rand(a = 1, b?: number): number {
  return b === undefined ? Math.random() * a : a + Math.random() * (b - a);
}
export const pick = <T>(list: readonly T[]): T => list[Math.floor(Math.random() * list.length)];
export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
export const rgba = (c: RGB, a = 1) => `rgba(${c[0]},${c[1]},${c[2]},${clamp(a, 0, 1)})`;
export const mix = (c1: RGB, c2: RGB, k: number): RGB => [
  Math.round(c1[0] + (c2[0] - c1[0]) * k),
  Math.round(c1[1] + (c2[1] - c1[1]) * k),
  Math.round(c1[2] + (c2[2] - c1[2]) * k),
];
export const lum = ([r, g, b]: RGB) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
export const smooth = (x: number) => x * x * (3 - 2 * x);

export function shuffle<T>(list: readonly T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// The theme colours of an element inside #cyberpunkroot, from its --color-* variables
export function readColors(el: HTMLElement): Colors {
  const style = getComputedStyle(el);
  const read = (name: string) => style.getPropertyValue(name).trim().split(/\s+/).map(Number) as RGB;
  const b = read('--color-background');
  return {
    p: read('--color-primary'),
    s: read('--color-secondary'),
    a: read('--color-accent'),
    b,
    fg: read('--color-text'),
    mu: read('--color-gray-500'),
    tm: read('--color-terminal'),
    light: lum(b) > 0.5,
  };
}

// Text of the canvas overlays, in the page language
export const tr = (s: Stage, fr: string, en: string) => (s.lang === 'en' ? en : fr);

// Offscreen canvas at the stage's pixel density, drawn in CSS pixels
export function makeLayer(s: Stage, w: number, h: number): Layer {
  const cv = document.createElement('canvas');
  cv.width = Math.max(1, Math.round(w * s.dpr));
  cv.height = Math.max(1, Math.round(h * s.dpr));
  const cx = cv.getContext('2d') as CanvasRenderingContext2D;
  cx.setTransform(s.dpr, 0, 0, s.dpr, 0, 0);
  return { cv, cx, w, h };
}

// Glitch: horizontal slices of the canvas copied with an offset, a coloured ghost and a few bars
export function glitchSlices(s: Stage, amount: number, area?: Area) {
  const { ctx, canvas, w, h, dpr, c } = s;
  const a = area ?? { x: 0, y: 0, w, h };
  const n = 3 + Math.floor(amount * 7);
  for (let i = 0; i < n; i += 1) {
    const sh = rand(2, 16) * (0.5 + amount);
    const y = rand(a.y, a.y + a.h - sh);
    const dx = rand(-1, 1) * amount * 38;
    ctx.drawImage(canvas, a.x * dpr, y * dpr, a.w * dpr, sh * dpr, a.x + dx, y, a.w, sh);
  }
  ctx.save();
  ctx.globalCompositeOperation = c.light ? 'multiply' : 'lighter';
  ctx.globalAlpha = 0.16 * amount;
  ctx.drawImage(canvas, a.x * dpr, a.y * dpr, a.w * dpr, a.h * dpr, a.x + 5 * amount, a.y, a.w, a.h);
  ctx.restore();
  [c.s, c.a, c.p].forEach((col) => {
    ctx.fillStyle = rgba(col, 0.28 * amount);
    ctx.fillRect(a.x, rand(a.y, a.y + a.h), a.w, rand(1, 5));
  });
}

// Scan lines of the original backgrounds (one line every 4 px), as a pattern cached per colour
export function scanlines(s: Stage, st: SceneState, col: RGB, alpha: number, offset = 0) {
  const key = `${col}|${alpha}`;
  st.scanCache ??= {};
  let pattern: CanvasPattern | null = st.scanCache[key];
  if (!pattern) {
    const cv = document.createElement('canvas');
    cv.width = 1;
    cv.height = 4;
    const x = cv.getContext('2d') as CanvasRenderingContext2D;
    x.fillStyle = rgba(col, alpha);
    x.fillRect(0, 2, 1, 2);
    pattern = s.ctx.createPattern(cv, 'repeat');
    st.scanCache[key] = pattern;
  }
  if (!pattern) return;
  const { ctx } = s;
  ctx.save();
  ctx.translate(0, offset % 4);
  ctx.fillStyle = pattern;
  ctx.fillRect(0, -4, s.w, s.h + 8);
  ctx.restore();
}

// Flat grid (the pattern of the original backgrounds), kept as a Path2D while the size holds
export function gridPath(st: SceneState, w: number, h: number, step: number): Path2D {
  const key = `${w}|${h}|${step}`;
  if (st.gridKey === key) return st.gridP;
  const p = new Path2D();
  for (let x = 0; x <= w; x += step) { p.moveTo(Math.round(x) + 0.5, 0); p.lineTo(Math.round(x) + 0.5, h); }
  for (let y = 0; y <= h; y += step) { p.moveTo(0, Math.round(y) + 0.5); p.lineTo(w, Math.round(y) + 0.5); }
  st.gridP = p;
  st.gridKey = key;
  return p;
}

export type Point = [number, number];

export function polyline(ctx: CanvasRenderingContext2D, pts: readonly Point[]) {
  if (!pts.length) return;
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i += 1) ctx.lineTo(pts[i][0], pts[i][1]);
}
