// The "collapse" self-destruct sequence: what is on screen becomes a set of bodies that fall,
// stack at the bottom of the screen, then drop through the floor. Each body is a copy of a real
// element, laid exactly over it in a fixed layer, so the page itself never moves. Browser-only.

const rand = (a: number, b: number) => a + Math.random() * (b - a);

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export type BodyKind = 'leaf' | 'frame' | 'header' | 'bar';

export interface Body {
  kind: BodyKind;
  // The copy in the debris layer
  el: HTMLElement;
  // The real element (for a bar: the frame it came from)
  src: Element | null;
  w0: number;
  h0: number;
  // Top-left corner at rest, on screen
  homeX: number;
  homeY: number;
  cx: number;
  cy: number;
  // Centre at rest; relative to the pivot while the body swings
  x0: number;
  y0: number;
  lying: boolean;
  vx: number;
  vy: number;
  a: number;
  va: number;
  active: boolean;
  off: boolean;
  floorless: boolean;
  sup: boolean;
  wob: number;
  relAt: number;
  pivot: { a: number; w: number; x: number; y: number } | null;
  // Visible borders of a frame, which become bars when it breaks
  sides: (Rect & { color: string; dx: number })[];
}

/* ---------- Reading the page ---------- */

// Section backgrounds fall with the page at the end, not as bodies
const SKIP = '.section-background, script, style, template, noscript, .sr-only';
const MEDIA = new Set(['IMG', 'CANVAS', 'VIDEO', 'PICTURE', 'INPUT', 'SELECT', 'TEXTAREA']);
const INTERACTIVE = 'a, button, [role="button"], summary, label';
const SIDES = ['top', 'right', 'bottom', 'left'] as const;

function alpha(color: string): number {
  if (!color || color === 'transparent') return 0;
  const inner = color.match(/\(([^)]*)\)/)?.[1];
  if (!inner) return 1;
  if (inner.includes('/')) return parseFloat(inner.split('/')[1] ?? '1');
  const parts = inner.split(',');
  return parts.length === 4 ? parseFloat(parts[3] ?? '1') : 1;
}

function visibleSides(cs: CSSStyleDeclaration) {
  return SIDES.filter((side) => parseFloat(cs.getPropertyValue(`border-${side}-width`)) > 0
    && cs.getPropertyValue(`border-${side}-style`) !== 'none'
    && alpha(cs.getPropertyValue(`border-${side}-color`)) > 0.05);
}

const hasBox = (cs: CSSStyleDeclaration) => alpha(cs.backgroundColor) > 0.05 || cs.backgroundImage !== 'none'
  || cs.boxShadow !== 'none' || visibleSides(cs).length > 0;

const hasDirectText = (el: Element) => [...el.childNodes]
  .some((node) => node.nodeType === Node.TEXT_NODE && node.nodeValue?.trim());

const isMedia = (el: Element) => el instanceof SVGElement || MEDIA.has(el.tagName);

export interface Scan {
  header: HTMLElement | null;
  // Smallest visual units: text blocks, media, small boxes
  leaves: Element[];
  // Boxes holding leaves (windows, cards, badges)
  frames: Element[];
}

// Everything on screen that will fall, from the elements in view only
export function scanScreen(page: HTMLElement): Scan {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const screen = W * H;
  const header = page.querySelector('header');
  const leaves: Element[] = [];
  const frames: Element[] = [];

  function walk(el: Element) {
    if (el.matches(SKIP)) return;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') return;
    if (cs.display === 'contents') {
      [...el.children].forEach(walk);
      return;
    }
    const r = el.getBoundingClientRect();
    if (r.width <= 1 || r.height <= 1 || r.bottom <= 0 || r.top >= H || r.right <= 0 || r.left >= W) return;
    const area = (r.width * r.height) / screen;
    const box = hasBox(cs);
    if (isMedia(el)
      || (hasDirectText(el) && area < 0.35)
      || (box && area < 0.04 && (el.matches(INTERACTIVE) || !el.children.length))) {
      leaves.push(el);
      return;
    }
    if (el !== header && box && area < 0.7) frames.push(el);
    [...el.children].forEach(walk);
  }
  [...page.children].forEach(walk);
  const shown = header && header.getBoundingClientRect().bottom > 0 && getComputedStyle(header).display !== 'none';
  return { header: shown ? header : null, leaves, frames };
}

// Where the cracks start: the corners of the largest boxes on screen, and along the header
export function crackSeeds(scan: Scan): [number, number, number][] {
  const seeds: [number, number, number][] = [];
  const panels = scan.frames
    .map((el) => el.getBoundingClientRect())
    .filter((r) => r.width * r.height > window.innerWidth * window.innerHeight * 0.02)
    .sort((a, b) => b.width * b.height - a.width * a.height)
    .slice(0, 2);
  panels.forEach((r) => {
    seeds.push([r.left, r.bottom, 2.3], [r.right, r.bottom, 0.8], [r.left, r.top, -2.4], [r.left + r.width * 0.6, r.bottom, 1.6]);
  });
  if (scan.header) {
    const bottom = scan.header.getBoundingClientRect().bottom;
    [[0.25, 1.4], [0.6, 1.7], [0.85, 1.2]].forEach(([x = 0, a = 0]) => seeds.push([window.innerWidth * x, bottom, a]));
  }
  return seeds;
}

/* ---------- Copies of the page ---------- */

// Text properties a copy needs: it no longer inherits them from the page
const TEXT_STYLE = ['color', 'font-family', 'font-size', 'font-weight', 'font-style', 'letter-spacing', 'word-spacing',
  'text-transform', 'text-shadow', 'font-variant-numeric'] as const;
const BLOCK_STYLE = ['line-height', 'white-space', 'text-align'] as const;

function copyText(to: HTMLElement, cs: CSSStyleDeclaration, block: boolean) {
  for (const property of TEXT_STYLE) to.style.setProperty(property, cs.getPropertyValue(property));
  if (block) for (const property of BLOCK_STYLE) to.style.setProperty(property, cs.getPropertyValue(property));
  // Gradient text paints nothing once out of its element: fall back to the theme colour
  if (alpha(cs.color) === 0 || alpha(cs.getPropertyValue('-webkit-text-fill-color')) === 0) to.style.color = 'rgb(var(--color-primary))';
}

function place(el: HTMLElement, r: Rect) {
  Object.assign(el.style, {
    position: 'absolute',
    left: '0',
    top: '0',
    margin: '0',
    width: `${r.w}px`,
    height: `${r.h}px`,
    boxSizing: 'border-box',
    transformOrigin: '50% 50%',
    willChange: 'transform',
  });
}

function createBody(layer: HTMLElement, kind: BodyKind, el: HTMLElement, src: Element | null, r: Rect): Body {
  layer.appendChild(el);
  const cx = r.x + r.w / 2;
  const cy = r.y + r.h / 2;
  return {
    kind, el, src, w0: r.w, h0: r.h, homeX: r.x, homeY: r.y, cx, cy, x0: cx, y0: cy, lying: false, vx: 0, vy: 0, a: 0, va: 0,
    active: false, off: false, floorless: false, sup: false, wob: 0, relAt: 0, pivot: null, sides: [],
  };
}

const toRect = (r: DOMRect): Rect => ({
  x: r.left, y: r.top, w: r.width, h: r.height,
});

// A copy of a whole element (deep) or of its box only (shallow), in a wrapper the size of the original
function boxBody(layer: HTMLElement, kind: BodyKind, src: Element, deep: boolean): Body {
  const cs = getComputedStyle(src);
  const r = toRect(src.getBoundingClientRect());
  const wrap = document.createElement('div');
  copyText(wrap, cs, true);
  const copy = src.cloneNode(deep) as HTMLElement | SVGElement;
  copy.removeAttribute('id');
  copy.querySelectorAll('[id]').forEach((node) => node.removeAttribute('id'));
  if (src instanceof HTMLCanvasElement && copy instanceof HTMLCanvasElement) {
    try {
      copy.getContext('2d')?.drawImage(src, 0, 0);
    } catch {
      // A canvas that cannot be read stays blank
    }
  }
  const { display } = cs;
  Object.assign(copy.style, {
    margin: '0',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    position: 'relative',
    inset: 'auto',
    transform: 'none',
    translate: 'none',
    rotate: 'none',
    scale: 'none',
    maxWidth: 'none',
    maxHeight: 'none',
    minWidth: '0',
    minHeight: '0',
    flex: 'none',
    visibility: 'visible',
    display: ['inline', 'inline-block', 'list-item'].includes(display) ? 'block'
      : { 'inline-flex': 'flex', 'inline-grid': 'grid' }[display] ?? display,
  });
  wrap.appendChild(copy);
  place(wrap, r);
  const body = createBody(layer, kind, wrap, src, r);
  if (kind === 'frame') {
    body.sides = visibleSides(cs).map((side) => {
      const t = Math.max(2, parseFloat(cs.getPropertyValue(`border-${side}-width`)));
      const color = cs.getPropertyValue(`border-${side}-color`);
      if (side === 'top') return { x: r.x, y: r.y, w: r.w, h: t, color, dx: 0 };
      if (side === 'bottom') return { x: r.x, y: r.y + r.h - t, w: r.w, h: t, color, dx: 0 };
      if (side === 'left') return { x: r.x, y: r.y, w: t, h: r.h, color, dx: -1 };
      return { x: r.x + r.w - t, y: r.y, w: t, h: r.h, color, dx: 1 };
    });
  }
  return body;
}

// Plain text falls line by line, one piece per style run; large titles fall letter by letter
function textBodies(layer: HTMLElement, el: Element): Body[] {
  const H = window.innerHeight;
  const bodies: Body[] = [];
  const range = document.createRange();
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.nodeValue ?? '';
    const parent = node.parentElement;
    if (!text.trim() || !parent) continue;
    const cs = getComputedStyle(parent);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const letters = parseFloat(cs.fontSize) >= 36;
    let run: { start: number; end: number; left: number; top: number; right: number; bottom: number } | null = null;
    const flush = () => {
      if (!run) return;
      const piece = document.createElement('span');
      piece.textContent = text.slice(run.start, run.end);
      copyText(piece, cs, false);
      const r = {
        x: run.left, y: run.top, w: run.right - run.left, h: run.bottom - run.top,
      };
      place(piece, r);
      Object.assign(piece.style, { display: 'block', whiteSpace: 'pre', lineHeight: `${r.h}px` });
      bodies.push(createBody(layer, 'leaf', piece, parent, r));
      run = null;
    };
    for (let i = 0; i < text.length; i += 1) {
      if (!text[i]?.trim()) {
        if (letters) flush();
        continue;
      }
      range.setStart(node, i);
      range.setEnd(node, i + 1);
      const c = range.getBoundingClientRect();
      if ((c.width === 0 && c.height === 0) || c.bottom <= 0 || c.top >= H) continue;
      // A new line (or a new letter) starts a new piece
      if (run && (letters || Math.abs(c.top - run.top) > c.height / 2)) flush();
      if (!run) {
        run = {
          start: i, end: i + 1, left: c.left, top: c.top, right: c.right, bottom: c.bottom,
        };
      } else {
        run.end = i + 1;
        run.left = Math.min(run.left, c.left);
        run.right = Math.max(run.right, c.right);
        run.top = Math.min(run.top, c.top);
        run.bottom = Math.max(run.bottom, c.bottom);
      }
    }
    flush();
  }
  return bodies;
}

function leafBodies(layer: HTMLElement, el: Element): Body[] {
  // Boxes, media and text mixed with icons fall whole
  if (isMedia(el) || hasBox(getComputedStyle(el)) || el.querySelector('svg, img, canvas, video, input')) {
    return [boxBody(layer, 'leaf', el, true)];
  }
  return textBodies(layer, el);
}

export interface Capture {
  bodies: Body[];
  header: Body | null;
  // Shows the real elements again and removes the copies
  restore: () => void;
}

// A frame comes apart into its visible sides, each a body of its own, in the order of frame.sides
export function barsOf(layer: HTMLElement, frame: Body): Body[] {
  frame.off = true;
  frame.el.style.display = 'none';
  return frame.sides.map((side) => {
    const el = document.createElement('div');
    place(el, side);
    Object.assign(el.style, { background: side.color, borderRadius: '1px', boxShadow: `0 0 8px ${side.color}` });
    return createBody(layer, 'bar', el, frame.src, side);
  });
}

// Copies everything on screen into the layer, then hides the originals in the same task, so no frame
// ever shows the page twice or not at all
export function captureScreen(page: HTMLElement, layer: HTMLElement): Capture {
  const scan = scanScreen(page);
  const header = scan.header ? boxBody(layer, 'header', scan.header, false) : null;
  const bodies: Body[] = header ? [header] : [];
  scan.frames.forEach((el) => bodies.push(boxBody(layer, 'frame', el, false)));
  scan.leaves.forEach((el) => bodies.push(...leafBodies(layer, el)));

  const hidden: [HTMLElement | SVGElement, string][] = [];
  [scan.header, ...scan.frames, ...scan.leaves].forEach((el) => {
    if (!(el instanceof HTMLElement || el instanceof SVGElement)) return;
    hidden.push([el, el.style.visibility]);
    el.style.visibility = 'hidden';
  });
  return {
    bodies,
    header,
    restore() {
      hidden.forEach(([el, visibility]) => { el.style.visibility = visibility; });
      layer.replaceChildren();
    },
  };
}

/* ---------- Physics ---------- */

export interface World {
  bodies: Body[];
  release: (body: Body) => boolean;
  startSwing: (body: Body) => void;
  letGo: (body: Body) => boolean;
  dropThrough: (body: Body) => void;
  frame: (t: number, dt: number) => void;
  render: (body: Body) => void;
}

// Gravity, floor, walls, then stacking with axis-aligned boxes. With reduced motion, released
// bodies fade out where they are instead of falling.
export function createWorld(layer: HTMLElement, bodies: Body[], options: { reduced: boolean; impact: (body: Body, speed: number) => void }): World {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const hw = (b: Body) => (b.lying ? b.h0 : b.w0) / 2;
  const hh = (b: Body) => (b.lying ? b.w0 : b.h0) / 2;

  function render(b: Body) {
    b.el.style.transform = `translate(${(b.cx - b.w0 / 2).toFixed(1)}px, ${(b.cy - b.h0 / 2).toFixed(1)}px) rotate(${b.a.toFixed(3)}rad)`;
  }

  // A frame comes apart into its visible sides
  function breakFrame(b: Body) {
    barsOf(layer, b).forEach((bar, i) => {
      const side = b.sides[i];
      if (!side) return;
      Object.assign(bar, {
        active: true, vx: side.dx * 90 + rand(-30, 30), vy: side.dx ? -30 : (side.y === b.homeY ? -60 : 0), va: rand(-0.6, 0.6),
      });
      bodies.push(bar);
    });
  }

  function release(b: Body): boolean {
    if (b.active || b.off) return false;
    b.wob = 0;
    if (options.reduced) {
      b.off = true;
      b.el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 600, fill: 'forwards' });
      return true;
    }
    if (b.kind === 'frame' && b.sides.length) {
      breakFrame(b);
      return true;
    }
    b.active = true;
    b.pivot = null;
    b.vx = rand(-140, 140) * (b.w0 < 200 ? 1.6 : 1);
    b.vy = rand(-80, 0);
    b.va = rand(-2, 2) * Math.min(1, 90 / Math.max(b.w0, 30));
    return true;
  }

  // The header swings on its top-left corner before letting go
  function startSwing(b: Body) {
    if (options.reduced) return;
    b.pivot = {
      a: 0, w: 0, x: b.homeX, y: b.homeY,
    };
    b.x0 = b.cx - b.homeX;
    b.y0 = b.cy - b.homeY;
  }
  function swing(b: Body, dt: number) {
    const P = b.pivot;
    if (!P) return;
    P.w += (-38 * (P.a - 0.2) - 2.4 * P.w) * dt;
    P.a += P.w * dt;
    const cs = Math.cos(P.a);
    const sn = Math.sin(P.a);
    b.cx = P.x + b.x0 * cs - b.y0 * sn;
    b.cy = P.y + b.x0 * sn + b.y0 * cs;
    b.a = P.a;
  }
  function letGo(b: Body): boolean {
    const P = b.pivot;
    if (!P) return release(b);
    b.pivot = null;
    b.active = true;
    b.va = P.w * 0.6 + 0.3;
    b.vy = 160;
    return true;
  }

  function dropThrough(b: Body) {
    if (b.off) return;
    b.floorless = true;
    b.active = true;
    b.pivot = null;
  }

  function step(dt: number) {
    const n = 3;
    const h = dt / n;
    for (let s = 0; s < n; s += 1) {
      for (const b of bodies) {
        if (!b.active || b.off || b.pivot) continue;
        b.vy += 2600 * h;
        b.cx += b.vx * h;
        b.cy += b.vy * h;
        b.a += b.va * h;
        b.sup = false;
        const bw = hw(b);
        const bh = hh(b);
        if (!b.floorless && b.cy + bh > H) {
          b.cy = H - bh;
          if (b.vy > 0) {
            if (b.vy > 280) options.impact(b, b.vy);
            b.vy = b.vy > 120 ? -b.vy * 0.2 : 0;
            b.vx *= 0.75;
            b.va *= 0.5;
          }
          b.sup = true;
        }
        if (b.cx - bw < 0) { b.cx = bw; b.vx = Math.abs(b.vx) * 0.3; }
        if (b.cx + bw > W) { b.cx = W - bw; b.vx = -Math.abs(b.vx) * 0.3; }
        if (b.cy - bh > H + 300) { b.off = true; b.el.style.display = 'none'; }
      }
      for (let i = 0; i < bodies.length; i += 1) {
        const a = bodies[i];
        if (!a || !a.active || a.off || a.floorless || a.pivot) continue;
        for (let j = i + 1; j < bodies.length; j += 1) {
          const b = bodies[j];
          if (!b || !b.active || b.off || b.floorless || b.pivot) continue;
          const ox = hw(a) + hw(b) - Math.abs(a.cx - b.cx);
          if (ox <= 0) continue;
          const oy = hh(a) + hh(b) - Math.abs(a.cy - b.cy);
          if (oy <= 0) continue;
          if (oy <= ox) {
            const top = a.cy < b.cy ? a : b;
            const bottom = top === a ? b : a;
            top.cy -= oy;
            top.sup = true;
            if (top.vy > bottom.vy) {
              const rel = top.vy - bottom.vy;
              if (rel > 320) options.impact(top, rel * 0.6);
              top.vy = bottom.vy - (rel > 150 ? rel * 0.12 : 0);
              top.vx = top.vx * 0.85 + bottom.vx * 0.15;
              top.va *= 0.6;
              // A landing glances off sideways, so piles spread instead of growing into towers
              if (rel > 150) top.vx += rand(-120, 120) + Math.sign(top.cx - bottom.cx || rand(-1, 1)) * 60;
            }
            // Badly seated: it tips over and slides off
            if (Math.abs(top.cx - bottom.cx) > hw(bottom) * 0.55) top.vx += Math.sign(top.cx - bottom.cx) * 2000 * h;
          } else {
            const left = a.cx < b.cx ? a : b;
            const right = left === a ? b : a;
            left.cx -= ox / 2;
            right.cx += ox / 2;
            if (left.vx > right.vx) {
              const mean = (left.vx + right.vx) / 2;
              left.vx = mean - 10;
              right.vx = mean + 10;
            }
          }
        }
      }
      // Once resting, a body lies flat, longest side down (upright or upside down)
      for (const b of bodies) {
        if (!b.active || !b.sup || b.off) continue;
        if (!b.lying && b.h0 > b.w0 * 1.15) {
          const before = hh(b);
          b.lying = true;
          b.cy += before - hh(b);
        }
        const base = b.lying ? Math.PI / 2 : 0;
        const target = base + Math.round((b.a - base) / Math.PI) * Math.PI;
        b.a += (target - b.a) * Math.min(1, 12 * h);
        b.va *= 0.9;
      }
    }
  }

  function frame(t: number, dt: number) {
    for (const b of bodies) {
      if (b.pivot) swing(b, dt);
      else if (!b.active && b.wob) {
        // A body about to go shakes in place for a split second
        const k = t - b.wob;
        b.a = Math.sin(k * 45) * 0.035;
        b.cx = b.x0 + Math.sin(k * 70) * 1.2;
      }
    }
    if (!options.reduced) step(dt);
    for (const b of bodies) if (!b.off) render(b);
  }

  return {
    bodies, release, startSwing, letGo, dropThrough, frame, render,
  };
}

/* ---------- Cracks, dust and the floor ---------- */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  g: number;
  drag: number;
  size: number;
  life: number;
  age: number;
  color: string;
  circle: boolean;
}

interface Crack {
  points: [number, number][];
  length: number;
  drawn: number;
  start: number;
}

export interface Effects {
  crack: (x: number, y: number, angle: number, length: number, start: number) => void;
  dust: (particle: Partial<Particle> & { x: number; y: number }) => void;
  breakFloor: (t: number) => void;
  frame: (t: number, dt: number, fadeCracks: boolean) => void;
  clear: () => void;
}

// primary: the theme colour as "r, g, b"
export function createEffects(canvas: HTMLCanvasElement, primary: string): Effects {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  const g = canvas.getContext('2d');
  g?.setTransform(dpr, 0, 0, dpr, 0, 0);
  const cracks: Crack[] = [];
  const particles: Particle[] = [];
  const floor = Array.from({ length: Math.ceil(W / 20) + 1 }, (_, i): [number, number] => [i * 20, H - 3 - Math.random() * 7]);
  let crackAlpha = 1;
  let floorBreak = -1;

  function drawCrack(c: Crack) {
    if (!g || c.drawn <= 0) return;
    const [first] = c.points;
    if (!first) return;
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
    g.strokeStyle = `rgba(0,0,0,${0.8 * crackAlpha})`;
    g.lineWidth = 3.2;
    g.stroke();
    g.strokeStyle = `rgba(255,255,255,${0.75 * crackAlpha})`;
    g.lineWidth = 1.2;
    g.stroke();
  }

  return {
    crack(x, y, angle, length, start) {
      const points: [number, number][] = [[x, y]];
      let a = angle;
      let px = x;
      let py = y;
      let total = 0;
      while (total < length) {
        const s = rand(8, 15);
        a += rand(-0.45, 0.45);
        px += Math.cos(a) * s;
        py += Math.sin(a) * s;
        total += s;
        points.push([px, py]);
      }
      cracks.push({
        points, length: total, drawn: 0, start,
      });
    },
    dust(p) {
      particles.push({
        vx: 0, vy: 0, g: 0, drag: 0, size: 2, life: 1, age: 0, color: '#fff', circle: false, ...p,
      });
    },
    breakFloor(t) {
      floorBreak = t;
    },
    frame(t, dt, fadeCracks) {
      if (!g) return;
      for (const c of cracks) if (t >= c.start && c.drawn < c.length) c.drawn = Math.min(c.length, c.drawn + 280 * dt);
      if (fadeCracks && crackAlpha > 0) crackAlpha = Math.max(0, crackAlpha - dt * 1.2);
      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const p = particles[i];
        if (!p) continue;
        p.age += dt;
        if (p.age >= p.life) {
          particles.splice(i, 1);
          continue;
        }
        p.vy += p.g * dt;
        const k = Math.exp(-p.drag * dt);
        p.vx *= k;
        p.vy *= k;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
      }
      g.clearRect(0, 0, W, H);
      if (crackAlpha > 0) cracks.forEach(drawCrack);
      // The floor gives way from the middle: a glowing line running out to both edges
      if (floorBreak >= 0) {
        const k = t - floorBreak;
        const reach = Math.min(W / 2 + 20, k * 1500);
        const fade = Math.max(0, Math.min(1, 1 - (k - 1.2) / 1.5));
        if (fade > 0) {
          g.beginPath();
          let started = false;
          for (const [x, y] of floor) {
            if (Math.abs(x - W / 2) > reach) continue;
            if (started) g.lineTo(x, y);
            else g.moveTo(x, y);
            started = true;
          }
          g.strokeStyle = `rgba(${primary},${fade})`;
          g.lineWidth = 3;
          g.shadowColor = `rgba(${primary},0.9)`;
          g.shadowBlur = 12;
          g.stroke();
          g.shadowBlur = 0;
        }
      }
      for (const p of particles) {
        g.globalAlpha = 1 - p.age / p.life;
        g.fillStyle = p.color;
        if (p.circle) {
          g.beginPath();
          g.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          g.fill();
        } else {
          g.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        }
      }
      g.globalAlpha = 1;
    },
    clear() {
      cracks.length = 0;
      particles.length = 0;
      floorBreak = -1;
      g?.clearRect(0, 0, W, H);
    },
  };
}
