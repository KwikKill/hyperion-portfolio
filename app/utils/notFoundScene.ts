// The 404 page (components/Cyberpunk/CyberpunkNotFound.vue): the neon grid of the home page seen
// from above, broken open where the requested address should have been. Tiles break off the rim of
// the breach and fall into the void, and the status code floats above it as a hologram of particles
// that the pointer scatters. repair() seals the breach tile by tile and turns the code into a 200.
// Canvas 2D, browser-only.
import {
  clamp, glitchSlices, mix, MONO, rand, readColors, rgba, scanlines, smooth, TAU,
  type Point, type RGB, type SceneState, type Stage,
} from './backgrounds/core';

export type SceneEvent = 'crack' | 'fall' | 'glitch' | 'burst' | 'seal' | 'emerge' | 'change';

// Where the hologram and the breach go, in CSS pixels of the screen
export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface NotFoundOptions {
  // Element inside #cyberpunkroot: the scene takes its theme colours
  root: HTMLElement;
  // Status code shown by the hologram
  code: string;
  // Shapes the first breach: the same address always breaks the grid the same way
  seed: number;
  // CSS font family of the hologram
  font: string;
  lang: 'fr' | 'en';
  // One still image, redrawn on resize and theme change
  reduced: boolean;
  onEvent?: (event: SceneEvent) => void;
}

// The cells around the breach, far rows first: 0 intact, 1 lost, 2 breaking, 3 being sealed
export interface SectorMap {
  cols: number;
  rows: number;
  cells: number[];
  lost: number;
  integrity: number;
}

export interface NotFoundScene {
  setBox(box: Box): void;
  setFont(font: string): void;
  // A click: the hologram scatters, and a cell next to the breach gives way under it
  burst(x: number, y: number): void;
  repair(): Promise<void>;
  sector(): SectorMap;
  destroy(): void;
}

type Mode = 'hidden' | 'emerge' | 'form' | 'gather' | 'dive';

// Stiffness and damping of the spring pulling each particle to its target: loose while emerging
// (the particles overshoot and settle), tight while diving into the breach
const SPRINGS: Record<Mode, [number, number]> = {
  hidden: [90, 8], form: [90, 8], emerge: [38, 4.5], gather: [70, 9], dive: [140, 5],
};

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  // Home in the label, from its centre, and a little depth for the rotation
  hx: number;
  hy: number;
  hz: number;
  // 0: main colour, 1: secondary, 2: accent
  col: number;
  size: number;
  ph: number;
  hidden: boolean;
}

interface Cell {
  i: number;
  // Row, from the row of the breach centre: positive is farther
  dj: number;
}

interface Crack extends Cell {
  start: number;
  dur: number;
  heard: boolean;
}

interface Tile extends Cell {
  depth: number;
  vy: number;
  ax: number;
  az: number;
  vax: number;
  vaz: number;
  // Repair: the tile rises from the pit and lands in place at start + SEAL_RISE
  rise: { start: number; ax: number; az: number } | null;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  col: RGB;
}

interface Stream {
  x: number;
  dz: number;
  y: number;
  speed: number;
  len: number;
}

interface Ring {
  r: number;
  speed: number;
  max: number;
  strong: boolean;
}

interface Layout {
  cx: number;
  textCy: number;
  textW: number;
  textH: number;
  hor: number;
  f: number;
  cam: number;
  // Row of the breach centre, and the nearest depth on screen
  J: number;
  zNear: number;
  target: number;
}

interface Label {
  pts: Point[];
  width: number;
  height: number;
}

// Cells of the sector the integrity is measured on
const NOMINAL = 400;
const MAX_LOST = 34;
const CRACK_TIME = 0.7;
// Depth of the pit drawn under the breach, in cells
const PIT = 7;
const Z_FAR = 34;
const SEAL_RISE = 0.55;
const ALT_LABELS = ['NULL', 'VOID', '????'];
// Distance of the hologram's rotation centre, for the perspective of its particles
const HOLO_DEPTH = 900;
const SKYLINE_BLEED = 24;
// Streaks of data falling into the pit
const STREAMS = 36;

const keyOf = (i: number, dj: number) => `${i},${dj}`;
const easeOut = (p: number) => 1 - (1 - p) ** 3;
// Most particles take the main colour, a few the secondary and the accent
const colourOf = (roll: number) => {
  if (roll < 0.9) return 0;
  return roll < 0.97 ? 1 : 2;
};
const sizeOf = (step: number | null, ph: number) => clamp((step ?? 3) * 0.55, 1.1, 2.6) * (0.8 + (ph / TAU) * 0.4);

// Small random generator with a seed (no bitwise operators: all the products stay below 2^53)
function seeded(seed: number) {
  let a = Math.abs(Math.floor(seed)) % 4294967296;
  return () => {
    a = (a * 1664525 + 1013904223) % 4294967296;
    return a / 4294967296;
  };
}

// The points of a label drawn in the hologram's font, every `step` pixels, from its centre
function sampleText(text: string, font: string, maxW: number, maxH: number, target: number, step: number | null) {
  const w = Math.max(8, Math.ceil(maxW));
  const h = Math.max(8, Math.ceil(maxH));
  const cv = document.createElement('canvas');
  cv.width = w;
  cv.height = h;
  const x = cv.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
  x.font = `100px ${font}`;
  const m = x.measureText(text);
  const mw = m.width || 1;
  const mh = (m.actualBoundingBoxAscent + m.actualBoundingBoxDescent) || 72;
  const k = Math.min(w / mw, h / mh) * 0.96;
  x.font = `${100 * k}px ${font}`;
  x.textAlign = 'center';
  x.textBaseline = 'alphabetic';
  x.fillStyle = '#fff';
  x.fillText(text, w / 2, h / 2 + ((m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) * k) / 2);
  const data = x.getImageData(0, 0, w, h).data;
  let s = step;
  if (!s) {
    // One pixel in four is enough to estimate how much of the box the label fills
    let filled = 0;
    for (let i = 3; i < data.length; i += 16) if ((data[i] ?? 0) > 128) filled += 4;
    s = clamp(Math.sqrt(filled / target), 2, 9);
  }
  const pts: Point[] = [];
  for (let y = s / 2; y < h; y += s) {
    for (let px = s / 2; px < w; px += s) {
      if ((data[(Math.floor(y) * w + Math.floor(px)) * 4 + 3] ?? 0) > 128) {
        pts.push([px - w / 2 + rand(-0.35, 0.35) * s, y - h / 2 + rand(-0.35, 0.35) * s]);
      }
    }
  }
  return { label: { pts, width: mw * k, height: mh * k }, step: s };
}

function computeLayout(W: number, H: number, box: Box): Layout {
  const narrow = W < 768;
  const hor = box.y + box.h * 0.5;
  const dy = Math.max(60, box.y + box.h * 0.86 - hor);
  // Width of a cell at the breach: the breach is about five cells wide
  const cw = clamp(Math.min(W, box.w * 1.6) * 0.065, 26, 70);
  // A focal length close to the drop from the horizon: about 35° looking down, into the pit
  const f = dy * 1.4;
  const cam = dy / cw;
  return {
    cx: box.x + box.w / 2,
    textCy: box.y + box.h * (narrow ? 0.27 : 0.3),
    textW: narrow ? box.w * 0.86 : Math.min(W * 0.4, Math.max(box.w * 1.1, 300)),
    textH: box.h * (narrow ? 0.34 : 0.3),
    hor,
    f,
    cam,
    J: Math.round(f / cw),
    zNear: Math.max(0.6, (cam * f) / (H - hor + 40)),
    target: clamp((W * H) / 480, 900, 3200),
  };
}

export function mountNotFoundScene(canvas: HTMLCanvasElement, options: NotFoundOptions): NotFoundScene {
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  const st: SceneState = {};
  const stage: Stage = {
    el: options.root,
    canvas,
    ctx,
    w: 0,
    h: 0,
    dpr: 1,
    c: readColors(options.root),
    t: 0,
    st,
    mx: 0.5,
    my: 0.5,
    px: 0.5,
    py: 0.5,
    pin: false,
    focus: { fx: 0.5, fy: 0.5 },
    lang: options.lang,
  };
  const tr = (fr: string, en: string) => (options.lang === 'en' ? en : fr);
  const { reduced } = options;
  const emit = (event: SceneEvent) => options.onEvent?.(event);

  let font = options.font;
  let box: Box | null = null;
  let L = computeLayout(1, 1, { x: 0, y: 0, w: 1, h: 1 });
  let t = 0;
  let raf = 0;
  let last = 0;
  let destroyed = false;
  // The breach changed this frame: told once the frame is done, so the map reads a settled state
  let dirty = false;

  // Grid and breach
  const hole = new Map<string, Cell>();
  let cracks: Crack[] = [];
  let tiles: Tile[] = [];
  let rim: [number, number, number, number][] = [];
  let center = { x: 0, dz: 0.5 };
  let rings: Ring[] = [];
  let streams: Stream[] = [];
  let sparks: Spark[] = [];
  let motes: { u: number; v: number; speed: number }[] = [];
  let gridIn = reduced ? 1 : 0;
  let nextGrowth = 6;
  let nextRing = 1.6;
  let nextSpark = 0;

  // Hologram
  let particles: Particle[] = [];
  let mode: Mode = reduced ? 'form' : 'hidden';
  let modeStart = 0;
  let label = options.code;
  let labels = new Map<string, Label>();
  let step: number | null = null;
  let ok = false;
  let coneK = reduced ? 1 : 0;
  let glitchLeft = 0;
  let nextGlitch = 5;
  let altUntil = 0;

  // Timeline of the intro and the repair
  let timers: { at: number; fn: () => void }[] = [];
  const at = (time: number, fn: () => void) => {
    timers.push({ at: time, fn });
    timers.sort((a, b) => a.at - b.at);
  };
  let repairing = false;
  let repairDone: (() => void) | null = null;

  let skyline: HTMLCanvasElement | null = null;
  let skylineH = 0;
  let bloom: HTMLCanvasElement | null = null;
  let bloomCtx: CanvasRenderingContext2D | null = null;
  const BLOOM = 4;

  // Projection of the floor's world (x right, y up, z away), with the camera's parallax
  let VX = 0;
  let HY = 0;
  const P = (x: number, y: number, z: number): Point => [VX + (x / z) * L.f, HY + ((L.cam - y) / z) * L.f];
  const zOf = (dz: number) => L.J + dz;

  // ---------- The breach ----------

  function refreshRim() {
    rim = [];
    let sx = 0;
    let sz = 0;
    hole.forEach(({ i, dj }) => {
      sx += i + 0.5;
      sz += dj + 0.5;
      if (!hole.has(keyOf(i, dj - 1))) rim.push([i, dj, i + 1, dj]);
      if (!hole.has(keyOf(i, dj + 1))) rim.push([i, dj + 1, i + 1, dj + 1]);
      if (!hole.has(keyOf(i - 1, dj))) rim.push([i, dj, i, dj + 1]);
      if (!hole.has(keyOf(i + 1, dj))) rim.push([i + 1, dj, i + 1, dj + 1]);
    });
    if (hole.size) center = { x: sx / hole.size, dz: sz / hole.size };
    dirty = true;
  }

  // Cells next to the breach that can still give way, near the middle of the screen
  function candidates(): Cell[] {
    const busy = new Set(cracks.map((c) => keyOf(c.i, c.dj)));
    const found = new Map<string, Cell>();
    hole.forEach(({ i, dj }) => {
      [[i - 1, dj], [i + 1, dj], [i, dj - 1], [i, dj + 1]].forEach(([ni = 0, nj = 0]) => {
        const k = keyOf(ni, nj);
        if (hole.has(k) || busy.has(k) || Math.abs(ni + 0.5) > 6 || nj < -3 || nj > 4) return;
        if (zOf(nj) < L.zNear + 0.6) return;
        found.set(k, { i: ni, dj: nj });
      });
    });
    return [...found.values()];
  }

  function crack(cell: Cell, start: number, dur: number) {
    cracks.push({
      ...cell, start, dur, heard: false,
    });
    dirty = true;
  }

  function fall({ i, dj }: Cell) {
    const cell = { i, dj };
    hole.set(keyOf(i, dj), cell);
    tiles.push({
      ...cell,
      depth: 0,
      vy: rand(0.4, 1.2),
      ax: 0,
      az: 0,
      vax: rand(-2.4, 2.4),
      vaz: rand(-2.4, 2.4),
      rise: null,
    });
    const [x, y] = P(cell.i + 0.5, 0, zOf(cell.dj + 0.5));
    for (let n = 0; n < 14; n += 1) spark(x + rand(-12, 12), y, stage.c.a, 1);
    refreshRim();
    emit('fall');
  }

  // The first breach: a blob of 8 to 11 cells grown from the middle, the same for the same seed
  function firstBreach(): Cell[] {
    const rnd = seeded(options.seed);
    const cells: Cell[] = [{ i: -1, dj: 0 }, { i: 0, dj: 0 }];
    const has = (i: number, dj: number) => cells.some((c) => c.i === i && c.dj === dj);
    const size = 8 + Math.floor(rnd() * 4);
    for (let guard = 0; cells.length < size && guard < 400; guard += 1) {
      const from = cells[Math.floor(rnd() * cells.length)] ?? { i: 0, dj: 0 };
      const [di = 0, dj = 0] = [[1, 0], [-1, 0], [0, 1], [0, -1]][Math.floor(rnd() * 4)] ?? [];
      const next = { i: from.i + di, dj: from.dj + dj };
      if (Math.abs(next.i + 0.5) <= 3 && Math.abs(next.dj) <= 1 && !has(next.i, next.dj)) cells.push(next);
    }
    return cells;
  }

  // ---------- The hologram ----------

  function labelFor(text: string): Label {
    let found = labels.get(text);
    if (!found) {
      const sampled = sampleText(text, font, L.textW, L.textH, L.target, step);
      step = sampled.step;
      found = sampled.label;
      labels.set(text, found);
    }
    return found;
  }

  // Particles take the points of a label in order, so the shapes flow into each other
  function setLabel(text: string) {
    label = text;
    const { pts } = labelFor(text);
    if (!pts.length) return;
    if (!particles.length) {
      particles = pts.map(([hx, hy]) => {
        const ph = rand(0, TAU);
        return {
          x: L.cx + hx,
          y: L.textCy + hy,
          vx: 0,
          vy: 0,
          hx,
          hy,
          hz: rand(-14, 14),
          col: colourOf(Math.random()),
          size: sizeOf(step, ph),
          ph,
          hidden: mode === 'hidden',
        };
      });
      return;
    }
    const n = particles.length;
    particles.forEach((p, index) => {
      const [hx = 0, hy = 0] = pts[Math.floor((index * pts.length) / n)] ?? [];
      p.hx = hx + rand(-0.6, 0.6);
      p.hy = hy + rand(-0.6, 0.6);
      p.size = sizeOf(step, p.ph);
    });
  }

  // Particles burst out of the breach and assemble into the label
  function erupt() {
    const [x, y] = P(center.x, 0, zOf(center.dz));
    particles.forEach((p) => {
      p.x = x + rand(-20, 20);
      p.y = y + rand(-6, 6);
      p.vx = rand(-380, 380);
      p.vy = rand(-1100, -380);
      p.hidden = false;
    });
    mode = 'emerge';
    modeStart = t;
    rings.push({
      r: 0, speed: 9, max: 26, strong: true,
    });
    emit('emerge');
  }

  // ---------- Effects ----------

  function spark(x: number, y: number, col: RGB, power: number) {
    sparks.push({
      x,
      y,
      vx: rand(-90, 90) * power,
      vy: rand(-260, -60) * power,
      life: 0,
      max: rand(0.35, 0.9),
      col,
    });
  }

  function newStream(): Stream {
    const cells = [...hole.values()];
    const cell = cells[Math.floor(Math.random() * cells.length)] ?? { i: 0, dj: 0 };
    return {
      x: cell.i + rand(0.1, 0.9),
      dz: cell.dj + rand(0.1, 0.9),
      y: -rand(0, PIT),
      speed: rand(1.4, 4.2),
      len: rand(0.8, 2.2),
    };
  }

  // ---------- Size and colours ----------

  function buildSkyline() {
    const { c } = stage;
    const W = stage.w;
    skylineH = Math.max(30, Math.min(L.hor * 0.42, stage.h * 0.17));
    // SKYLINE_BLEED on each side: the parallax shifts it a little
    const cv = document.createElement('canvas');
    cv.width = Math.round((W + SKYLINE_BLEED * 2) * stage.dpr);
    cv.height = Math.round((skylineH + 2) * stage.dpr);
    const x = cv.getContext('2d') as CanvasRenderingContext2D;
    x.setTransform(stage.dpr, 0, 0, stage.dpr, 0, 0);
    x.translate(SKYLINE_BLEED, 0);
    const body = rgba(mix(c.b, c.s, c.light ? 0.1 : 0.07));
    for (let left = -SKYLINE_BLEED; left < W + SKYLINE_BLEED;) {
      const bw = rand(12, 48);
      // Lower towers behind the hologram, so the code stands out against the sky
      const away = Math.min(1, Math.abs(left + bw / 2 - L.cx) / (W * 0.28));
      const bh = (rand(0.12, 1) ** 1.6) * skylineH * (0.35 + 0.65 * away);
      const top = skylineH + 2 - bh;
      x.fillStyle = body;
      x.fillRect(left, top, bw, bh);
      x.fillStyle = rgba(c.s, c.light ? 0.35 : 0.28);
      x.fillRect(left, top, bw, 1);
      for (let wy = top + 4; wy < skylineH - 2; wy += 5) {
        for (let wx = left + 3; wx < left + bw - 2; wx += 4) {
          if (Math.random() < 0.09) {
            x.fillStyle = rgba(Math.random() < 0.7 ? c.p : c.s, rand(0.3, 0.75));
            x.fillRect(wx, wy, 1.4, 1.4);
          }
        }
      }
      left += bw + rand(0, 5);
    }
    skyline = cv;
  }

  function resize() {
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    if (!W || !H) return;
    stage.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    stage.w = W;
    stage.h = H;
    canvas.width = Math.round(W * stage.dpr);
    canvas.height = Math.round(H * stage.dpr);
    ctx.setTransform(stage.dpr, 0, 0, stage.dpr, 0, 0);
    L = computeLayout(W, H, box ?? {
      x: 0, y: 0, w: W, h: H,
    });
    VX = L.cx;
    HY = L.hor;
    labels = new Map();
    step = null;
    setLabel(label);
    buildSkyline();
    bloom = document.createElement('canvas');
    bloom.width = Math.ceil(W / BLOOM);
    bloom.height = Math.ceil(H / BLOOM);
    bloomCtx = bloom.getContext('2d');
    refreshRim();
    streams = Array.from({ length: STREAMS }, newStream);
    if (reduced) {
      particles.forEach((p) => {
        p.x = L.cx + p.hx;
        p.y = L.textCy + p.hy;
      });
      draw();
    }
  }

  function refreshColors() {
    stage.c = readColors(options.root);
    st.scanCache = {};
    buildSkyline();
    if (reduced) draw();
  }

  // ---------- Update ----------

  function updateBreach(dt: number) {
    if (!reduced) gridIn = smooth(clamp(t / 0.7, 0, 1));
    cracks = cracks.filter((c) => {
      if (t < c.start) return true;
      if (!c.heard) {
        c.heard = true;
        emit('crack');
      }
      if (t < c.start + c.dur) return true;
      fall(c);
      return false;
    });
    if (!repairing && mode === 'form' && t > nextGrowth) {
      nextGrowth = t + rand(3.5, 7);
      const choices = candidates();
      const cell = choices[Math.floor(Math.random() * choices.length)];
      if (cell && hole.size + cracks.length < MAX_LOST) crack(cell, t, CRACK_TIME);
    }
    tiles = tiles.filter((tile) => {
      if (tile.rise) {
        const p = clamp((t - tile.rise.start) / SEAL_RISE, 0, 1);
        const e = easeOut(p);
        tile.depth = PIT * (1 - e);
        tile.ax = tile.rise.ax * (1 - e);
        tile.az = tile.rise.az * (1 - e);
        if (p < 1) return true;
        hole.delete(keyOf(tile.i, tile.dj));
        const [x, y] = P(tile.i + 0.5, 0, zOf(tile.dj + 0.5));
        for (let n = 0; n < 10; n += 1) spark(x + rand(-14, 14), y, stage.c.tm, 0.8);
        refreshRim();
        emit('seal');
        return false;
      }
      tile.vy += 7 * dt;
      tile.depth += tile.vy * dt;
      tile.ax += tile.vax * dt;
      tile.az += tile.vaz * dt;
      return tile.depth < PIT + 1;
    });
    if (t > nextRing) {
      nextRing = t + rand(2.6, 3.8);
      rings.push({
        r: 0, speed: 6, max: 20, strong: false,
      });
    }
    rings = rings.filter((ring) => {
      ring.r += ring.speed * dt;
      return ring.r < ring.max;
    });
    streams.forEach((s, index) => {
      s.y -= s.speed * dt;
      if (s.y - s.len < -PIT) streams[index] = { ...newStream(), y: 0 };
    });
    if (t > nextSpark && rim.length) {
      nextSpark = t + rand(0.04, 0.12);
      const [x0, z0, x1, z1] = rim[Math.floor(Math.random() * rim.length)] ?? [0, 0, 0, 0];
      const k = Math.random();
      const [x, y] = P(x0 + (x1 - x0) * k, 0, zOf(z0 + (z1 - z0) * k));
      spark(x, y, Math.random() < 0.7 ? stage.c.a : stage.c.p, 0.6);
    }
    sparks = sparks.filter((s) => {
      s.life += dt;
      s.vy += 520 * dt;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      return s.life < s.max;
    });
  }

  function updateHologram(dt: number) {
    if (mode === 'emerge' && t - modeStart > 1.6) mode = 'form';
    if (!repairing && label !== options.code && t > altUntil) setLabel(options.code);
    if (!repairing && mode === 'form' && t > nextGlitch) {
      nextGlitch = t + rand(4.5, 8.5);
      glitchLeft = 0.34;
      emit('glitch');
      if (Math.random() < 0.55) {
        setLabel(ALT_LABELS[Math.floor(Math.random() * ALT_LABELS.length)] ?? 'NULL');
        altUntil = t + 0.9;
      }
    }
    glitchLeft = Math.max(0, glitchLeft - dt);
    // The beam is off until the code climbs out, and flares while the repair gathers it
    let beam = repairing && mode === 'gather' ? 2 : 1;
    if (mode === 'hidden') beam = 0;
    coneK += (beam - coneK) * (1 - Math.exp(-dt * 3));
    motes = motes.filter((m) => {
      m.v += m.speed * dt;
      return m.v < 1;
    });
    if (coneK > 0.2 && Math.random() < dt * 30) motes.push({ u: rand(-1, 1), v: 0, speed: rand(0.35, 0.8) });

    const theta = Math.sin(t * 0.35) * 0.22 + (stage.mx - 0.5) * 0.55;
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);
    const cx = L.cx + (VX - L.cx) * 0.6;
    const cy = L.textCy + Math.sin(t * 0.8) * 4;
    const [holeX, holeY] = P(center.x, 0, zOf(center.dz));
    const pointerX = stage.px * stage.w;
    const pointerY = stage.py * stage.h;
    const reach = clamp(stage.w * 0.06, 50, 95);
    const [stiff, damp] = SPRINGS[mode];
    const decay = Math.exp(-damp * dt);
    particles.forEach((p) => {
      if (p.hidden) return;
      let tx: number;
      let ty: number;
      if (mode === 'gather') {
        tx = cx + p.hx * 0.05;
        ty = cy + p.hy * 0.05;
      } else if (mode === 'dive') {
        tx = holeX;
        ty = holeY;
      } else {
        const x1 = p.hx * cos + p.hz * sin;
        const z1 = -p.hx * sin + p.hz * cos;
        const k = HOLO_DEPTH / (HOLO_DEPTH + z1);
        tx = cx + x1 * k;
        ty = cy + p.hy * k;
      }
      let ax = (tx - p.x) * stiff;
      let ay = (ty - p.y) * stiff;
      if (stage.pin && (mode === 'form' || mode === 'emerge')) {
        const dx = p.x - pointerX;
        const dy = p.y - pointerY;
        const d = Math.hypot(dx, dy);
        if (d < reach && d > 0.01) {
          const push = (1 - d / reach) * 5200;
          ax += (dx / d) * push;
          ay += (dy / d) * push;
        }
      }
      p.vx = (p.vx + ax * dt) * decay;
      p.vy = (p.vy + ay * dt) * decay;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (mode === 'dive' && Math.hypot(p.x - holeX, p.y - holeY) < 16) p.hidden = true;
    });
  }

  // ---------- Drawing ----------

  function drawSky() {
    const { c } = stage;
    const W = stage.w;
    const H = stage.h;
    ctx.fillStyle = rgba(c.b);
    ctx.fillRect(0, 0, W, H);
    const sky = ctx.createLinearGradient(0, 0, 0, HY);
    sky.addColorStop(0, rgba(c.b, 0));
    sky.addColorStop(1, rgba(c.a, c.light ? 0.05 : 0.09));
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, HY);
    if (skyline) {
      ctx.globalAlpha = gridIn;
      const shift = clamp((VX - L.cx) * 0.35, -SKYLINE_BLEED, SKYLINE_BLEED);
      ctx.drawImage(skyline, shift - SKYLINE_BLEED, HY - skylineH - 2, W + SKYLINE_BLEED * 2, skylineH + 2);
      ctx.globalAlpha = 1;
    }
    const haze = c.light ? 0.04 : 0.07;
    const glow = ctx.createLinearGradient(0, HY - 120, 0, HY + 40);
    glow.addColorStop(0, rgba(c.s, 0));
    glow.addColorStop(0.75, rgba(c.s, (c.light ? 0.12 : 0.18) * gridIn));
    glow.addColorStop(1, rgba(c.s, haze));
    ctx.fillStyle = glow;
    ctx.fillRect(0, HY - 120, W, 160);
    ctx.fillStyle = rgba(mix(c.b, c.s, c.light ? 0.03 : 0.045));
    ctx.fillRect(0, HY + 40, W, H - HY - 40);
  }

  function drawGrid() {
    const { c } = stage;
    const W = stage.w;
    const H = stage.h;
    const reachX = (z: number) => ((W / 2 + Math.abs(VX - W / 2)) / L.f) * z + 1;
    // Lines across, from the horizon to the viewer
    for (let z = Math.ceil(L.zNear); z <= Z_FAR; z += 1) {
      const fade = (1 - (z - L.zNear) / (Z_FAR - L.zNear)) ** 1.4;
      const xr = reachX(z);
      const [ax, ay] = P(-xr, 0, z);
      const [bx] = P(xr, 0, z);
      ctx.strokeStyle = rgba(c.p, ((c.light ? 0.12 : 0.06) + 0.48 * fade) * gridIn);
      ctx.beginPath();
      ctx.moveTo(ax, ay + 0.5);
      ctx.lineTo(bx, ay + 0.5);
      ctx.stroke();
    }
    // Lines towards the horizon: one gradient fades them all with depth
    const fadeOut = ctx.createLinearGradient(0, HY, 0, H);
    fadeOut.addColorStop(0, rgba(c.p, (c.light ? 0.1 : 0.04) * gridIn));
    fadeOut.addColorStop(1, rgba(c.p, 0.55 * gridIn));
    ctx.strokeStyle = fadeOut;
    ctx.beginPath();
    const xr = Math.ceil(reachX(Z_FAR));
    for (let x = -xr; x <= xr; x += 1) {
      const [ax, ay] = P(x, 0, Z_FAR);
      const [bx, by] = P(x, 0, L.zNear);
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
    }
    ctx.stroke();
    // Sonar rings out of the breach, on the floor
    ctx.lineWidth = 1.5;
    rings.forEach((ring) => {
      const k = 1 - ring.r / ring.max;
      ctx.strokeStyle = rgba(ring.strong ? c.p : c.s, (ring.strong ? 0.75 : 0.42) * k * gridIn);
      ctx.beginPath();
      // The part of the ring behind the viewer is left out
      let pen = false;
      for (let a = 0; a <= 72; a += 1) {
        const angle = (a / 72) * TAU;
        const z = zOf(center.dz) + Math.sin(angle) * ring.r;
        if (z < L.zNear) {
          pen = false;
        } else {
          const [x, y] = P(center.x + Math.cos(angle) * ring.r, 0, z);
          if (pen) ctx.lineTo(x, y);
          else ctx.moveTo(x, y);
          pen = true;
        }
      }
      ctx.stroke();
    });
    ctx.lineWidth = 1;
  }

  function cellQuad(i: number, dj: number, y = 0): Point[] {
    const z0 = zOf(dj);
    return [P(i, y, z0), P(i + 1, y, z0), P(i + 1, y, z0 + 1), P(i, y, z0 + 1)];
  }

  function outline(points: Point[], path: CanvasRenderingContext2D | Path2D) {
    points.forEach(([x, y], index) => {
      if (index) path.lineTo(x, y);
      else path.moveTo(x, y);
    });
    path.closePath();
  }

  function drawCracks() {
    const { c } = stage;
    cracks.forEach((cr) => {
      if (t < cr.start) return;
      const p = (t - cr.start) / cr.dur;
      const flicker = Math.sin(t * 46 + cr.i) > 0 ? 1 : 0.35;
      const jitter = p * 2.5;
      const quad = cellQuad(cr.i, cr.dj).map(([x, y]): Point => [x + rand(-jitter, jitter), y + rand(-jitter, jitter)]);
      ctx.fillStyle = rgba(c.a, 0.22 * flicker * (0.5 + p));
      ctx.strokeStyle = rgba(c.a, 0.9 * flicker);
      ctx.beginPath();
      outline(quad, ctx);
      ctx.fill();
      ctx.stroke();
    });
  }

  function tileCorners(tile: Tile): Point[] {
    const ca = Math.cos(tile.ax);
    const sa = Math.sin(tile.ax);
    const cb = Math.cos(tile.az);
    const sb = Math.sin(tile.az);
    const cx = tile.i + 0.5;
    const cz = zOf(tile.dj + 0.5);
    return ([[-0.5, -0.5], [0.5, -0.5], [0.5, 0.5], [-0.5, 0.5]] as const).map(([lx, lz]) => {
      // Tilt around the x axis, then around the z axis
      const y1 = -lz * sa;
      const z1 = lz * ca;
      const x2 = lx * cb - y1 * sb;
      const y2 = lx * sb + y1 * cb;
      return P(cx + x2, y2 - tile.depth, Math.max(0.2, cz + z1));
    });
  }

  function drawPit() {
    if (!hole.size) return;
    const { c } = stage;
    const opening = new Path2D();
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    hole.forEach(({ i, dj }) => {
      const quad = cellQuad(i, dj);
      outline(quad, opening);
      quad.forEach(([x, y]) => {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      });
    });
    ctx.save();
    ctx.clip(opening);
    // The void, lit from far below
    ctx.fillStyle = rgba(c.light ? mix(c.fg, c.b, 0.15) : mix(c.b, [0, 0, 0], 0.7));
    ctx.fillRect(minX - 2, minY - 2, maxX - minX + 4, maxY - minY + 4);
    const [gx, gy] = P(center.x, -PIT * 0.35, zOf(center.dz));
    const core = ctx.createRadialGradient(gx, gy, 0, gx, gy, (maxX - minX) * 0.6);
    core.addColorStop(0, rgba(c.s, 0.32 * (0.85 + 0.15 * Math.sin(t * 2.2))));
    core.addColorStop(1, rgba(c.s, 0));
    ctx.fillStyle = core;
    ctx.fillRect(minX - 2, minY - 2, maxX - minX + 4, maxY - minY + 4);
    ctx.globalCompositeOperation = c.light ? 'source-over' : 'lighter';
    // The walls: the rim copied deeper and deeper, joined by the corners
    for (let k = 1; k <= 12; k += 1) {
      const d0 = ((k - 1) / 12) * PIT;
      const d1 = (k / 12) * PIT;
      ctx.strokeStyle = rgba(c.s, 0.8 * (1 - k / 13) ** 1.4);
      ctx.beginPath();
      rim.forEach(([x0, z0, x1, z1]) => {
        const [ax, ay] = P(x0, -d1, zOf(z0));
        const [bx, by] = P(x1, -d1, zOf(z1));
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        const [ux, uy] = P(x0, -d0, zOf(z0));
        ctx.moveTo(ux, uy);
        ctx.lineTo(ax, ay);
      });
      ctx.stroke();
    }
    // Data falling into the void
    streams.forEach((s) => {
      const fade = 1 - Math.min(1, -s.y / PIT);
      const [ax, ay] = P(s.x, s.y, zOf(s.dz));
      const [bx, by] = P(s.x, s.y - s.len, zOf(s.dz));
      ctx.strokeStyle = rgba(c.p, 0.9 * fade);
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.stroke();
    });
    // Falling tiles, and the ones rising back during the repair
    tiles.forEach((tile) => {
      const fade = 1 - Math.min(1, tile.depth / (PIT + 1));
      const col = tile.rise ? c.tm : c.p;
      ctx.fillStyle = rgba(col, 0.16 * fade);
      ctx.strokeStyle = rgba(col, 0.95 * fade);
      ctx.beginPath();
      outline(tileCorners(tile), ctx);
      ctx.fill();
      ctx.stroke();
    });
    ctx.restore();

    // The rim, glowing
    const flicker = 0.75 + 0.25 * Math.sin(t * 13) * Math.sin(t * 5.3);
    ctx.save();
    ctx.lineJoin = 'round';
    ctx.shadowColor = rgba(c.a, 0.9);
    ctx.shadowBlur = 14;
    ctx.strokeStyle = rgba(c.a, 0.95 * flicker);
    ctx.lineWidth = 2;
    ctx.beginPath();
    rim.forEach(([x0, z0, x1, z1]) => {
      const [ax, ay] = P(x0, 0, zOf(z0));
      const [bx, by] = P(x1, 0, zOf(z1));
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
    });
    ctx.stroke();
    ctx.restore();
    st.hole = {
      minX, maxX, minY, maxY,
    };
  }

  // The light the breach projects up to the hologram, with motes climbing it
  function drawCone(textW: number, textH: number, cx: number, cy: number) {
    const { c } = stage;
    const area = st.hole as { minX: number; maxX: number; minY: number; maxY: number } | undefined;
    const [hx, hy] = P(center.x, 0, zOf(center.dz));
    const bottomW = area && hole.size ? (area.maxX - area.minX) * 0.36 : 12;
    const bottomY = area && hole.size ? (area.minY + area.maxY) / 2 : hy;
    const topW = textW * 0.58;
    const topY = cy - textH * 0.55;
    const k = clamp(coneK, 0, 2);
    if (k < 0.01) return;
    ctx.save();
    ctx.globalCompositeOperation = c.light ? 'source-over' : 'lighter';
    const flicker = 0.88 + 0.12 * Math.sin(t * 17) * Math.sin(t * 3.1);
    const beam = ctx.createLinearGradient(0, bottomY, 0, topY);
    beam.addColorStop(0, rgba(c.s, 0.24 * k * flicker));
    beam.addColorStop(0.6, rgba(c.s, 0.07 * k * flicker));
    beam.addColorStop(1, rgba(c.s, 0));
    ctx.fillStyle = beam;
    ctx.beginPath();
    ctx.moveTo(hx - bottomW, bottomY);
    ctx.lineTo(cx - topW, topY);
    ctx.lineTo(cx + topW, topY);
    ctx.lineTo(hx + bottomW, bottomY);
    ctx.closePath();
    ctx.fill();
    // The edges of the beam, like the wireframe of a projector
    const edge = ctx.createLinearGradient(0, bottomY, 0, topY);
    edge.addColorStop(0, rgba(c.s, 0.55 * Math.min(1, k) * flicker));
    edge.addColorStop(1, rgba(c.s, 0));
    ctx.strokeStyle = edge;
    ctx.beginPath();
    ctx.moveTo(hx - bottomW, bottomY);
    ctx.lineTo(cx - topW, topY);
    ctx.moveTo(hx + bottomW, bottomY);
    ctx.lineTo(cx + topW, topY);
    ctx.stroke();
    motes.forEach((m) => {
      const x = hx + m.u * bottomW + (cx + m.u * topW - (hx + m.u * bottomW)) * m.v;
      const y = bottomY + (topY - bottomY) * m.v;
      ctx.fillStyle = rgba(c.s, 0.8 * k * (1 - m.v));
      ctx.fillRect(x - 0.8, y - 0.8, 1.6, 1.6);
    });
    ctx.restore();
  }

  function drawHologram() {
    const { c } = stage;
    const shown = particles.filter((p) => !p.hidden);
    const current = labels.get(label);
    const textW = current?.width ?? L.textW;
    const textH = current?.height ?? L.textH;
    const cx = L.cx + (VX - L.cx) * 0.6;
    const cy = L.textCy;
    drawCone(textW, textH, cx, cy);
    if (!shown.length) return;
    const palette: [RGB, RGB, RGB] = ok ? [c.tm, c.s, c.tm] : [c.p, c.s, c.a];
    const lighter = c.light ? 'source-over' : 'lighter';
    const scanY = cy - textH / 2 + ((t * 0.42) % 1) * textH * 1.3;
    const glitch = glitchLeft > 0 ? glitchLeft / 0.34 : 0;

    ctx.save();
    ctx.globalCompositeOperation = lighter;
    // Colour fringes while the signal glitches
    const fringe = (col: RGB, dx: number) => {
      ctx.fillStyle = rgba(col, 0.5 * glitch);
      shown.forEach((p) => ctx.fillRect(p.x + dx - p.size / 2, p.y - p.size / 2, p.size, p.size));
    };
    if (glitch > 0) {
      fringe(c.s, -4 - 8 * glitch);
      fringe(c.a, 4 + 8 * glitch);
    }
    // Three brightness levels per colour: a handful of fill styles instead of one per particle
    // The band of the scan line is at full brightness and shifted, the rest flickers
    const levelOf = (p: Particle) => {
      const wave = Math.sin(t * 3 + p.ph);
      if (Math.abs(p.y - scanY) < 7 || wave > 0.6) return 2;
      return wave > -0.5 ? 1 : 0;
    };
    // On a light background nothing glows: denser, larger particles keep the code readable
    const levels = c.light ? [0.7, 0.88, 1] : [0.45, 0.75, 1];
    const grow = c.light ? 1.4 : 1;
    for (let col = 0; col < 3; col += 1) {
      for (let lv = 0; lv < 3; lv += 1) {
        ctx.fillStyle = rgba(palette[col] ?? c.p, levels[lv] ?? 1);
        shown.forEach((p) => {
          if (p.col !== col || levelOf(p) !== lv) return;
          const shift = Math.abs(p.y - scanY) < 7 ? 2 : 0;
          const size = p.size * grow;
          ctx.fillRect(p.x + shift - size / 2, p.y - size / 2, size, size);
        });
      }
    }
    ctx.restore();

    // Bloom: the particles on a quarter-size canvas, scaled back up, blur into a glow
    if (bloom && bloomCtx && !c.light) {
      const b = bloomCtx;
      b.clearRect(0, 0, bloom.width, bloom.height);
      b.fillStyle = rgba(palette[0], 0.85);
      shown.forEach((p) => b.fillRect(p.x / BLOOM - 0.5, p.y / BLOOM - 0.5, 1.2, 1.2));
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.75;
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(bloom, 0, 0, bloom.width * BLOOM, bloom.height * BLOOM);
      ctx.restore();
    }
    if (glitch > 0) {
      glitchSlices(stage, glitch * 0.8, {
        x: cx - textW * 0.7, y: cy - textH * 0.7, w: textW * 1.4, h: textH * 1.4,
      });
    }

    // Viewfinder corners around the hologram, and its signal label
    const fx = textW * 0.53 + 12;
    const fy = textH * 0.62 + 10;
    const arm = 18;
    ctx.strokeStyle = rgba(c.s, 0.65 * Math.min(1, coneK));
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ([[-1, -1], [1, -1], [1, 1], [-1, 1]] as const).forEach(([sx, sy]) => {
      ctx.moveTo(cx + sx * fx, cy + sy * fy - sy * arm);
      ctx.lineTo(cx + sx * fx, cy + sy * fy);
      ctx.lineTo(cx + sx * fx - sx * arm, cy + sy * fy);
    });
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.font = `600 10px ${MONO}`;
    ctx.fillStyle = rgba(ok ? c.tm : c.s, 0.9 * Math.min(1, coneK));
    const signal = ok ? 'SIG 200 · OK' : `SIG ${options.code} · ${tr('NON RÉSOLU', 'UNRESOLVED')}`;
    ctx.fillText(signal, cx - fx, cy - fy - 8);
  }

  function drawSparks() {
    if (!sparks.length) return;
    ctx.save();
    ctx.globalCompositeOperation = stage.c.light ? 'source-over' : 'lighter';
    sparks.forEach((s) => {
      ctx.fillStyle = rgba(s.col, 1 - s.life / s.max);
      ctx.fillRect(s.x - 1, s.y - 1, 2, 2);
    });
    ctx.restore();
  }

  // Annotation of the breach, beside its rim
  function drawNotes() {
    const area = st.hole as { minX: number; maxX: number; minY: number; maxY: number } | undefined;
    if (!area || !hole.size || gridIn < 1) return;
    const { c } = stage;
    // On the right of the breach, else on its left, else (a narrow phone) not at all
    const right = area.maxX + 230 < stage.w - 8;
    if (!right && area.minX - 230 < 8) return;
    const ax = right ? area.maxX : area.minX;
    const ay = (area.minY + area.maxY) / 2;
    const bx = ax + (right ? 46 : -46);
    const by = ay - 44;
    const end = bx + (right ? 170 : -170);
    ctx.strokeStyle = rgba(c.a, 0.8);
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.lineTo(end, by);
    ctx.stroke();
    ctx.fillStyle = rgba(c.a, 0.95);
    ctx.beginPath();
    ctx.arc(ax, ay, 2.6, 0, TAU);
    ctx.fill();
    ctx.font = `600 10px ${MONO}`;
    ctx.textAlign = right ? 'left' : 'right';
    const text = `${tr('BRÈCHE', 'BREACH')} · ${hole.size} ${tr('CELLULES', 'CELLS')}`;
    ctx.fillText(text, bx + (right ? 4 : -4), by - 6);
    ctx.fillStyle = rgba(c.mu, 0.95);
    ctx.fillText(tr('PROFONDEUR : INCONNUE', 'DEPTH: UNKNOWN'), bx + (right ? 4 : -4), by + 14);
    ctx.textAlign = 'start';
  }

  function drawFinish() {
    const { c } = stage;
    scanlines(stage, st, c.b, c.light ? 0.08 : 0.24, t * 14);
    const W = stage.w;
    const H = stage.h;
    const vignette = ctx.createRadialGradient(W / 2, H * 0.45, Math.min(W, H) * 0.35, W / 2, H * 0.45, Math.max(W, H) * 0.75);
    vignette.addColorStop(0, rgba(c.b, 0));
    vignette.addColorStop(1, rgba(c.b, c.light ? 0.5 : 0.78));
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, W, H);
  }

  function draw() {
    if (!stage.w) return;
    VX = L.cx + (stage.mx - 0.5) * -stage.w * 0.035;
    HY = L.hor + (stage.my - 0.5) * -stage.h * 0.02;
    drawSky();
    drawGrid();
    drawCracks();
    drawPit();
    drawHologram();
    drawSparks();
    drawNotes();
    drawFinish();
  }

  // ---------- Loop ----------

  function runTimers() {
    while (timers.length && (timers[0]?.at ?? Infinity) <= t) timers.shift()?.fn();
  }

  function loop(now: number) {
    if (destroyed) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!document.hidden && stage.w) {
      t += dt;
      stage.t = t;
      const ease = 1 - Math.exp(-dt * 4);
      stage.mx += ((stage.pin ? stage.px : 0.5) - stage.mx) * ease;
      stage.my += ((stage.pin ? stage.py : 0.5) - stage.my) * ease;
      runTimers();
      updateBreach(dt);
      updateHologram(dt);
      if (dirty) {
        dirty = false;
        emit('change');
      }
      draw();
    }
    raf = requestAnimationFrame(loop);
  }

  // The canvas scrolls with the page: the pointer is measured from its corner
  function onPointerMove(event: PointerEvent) {
    if (!stage.w) return;
    const origin = canvas.getBoundingClientRect();
    stage.px = (event.clientX - origin.left) / stage.w;
    stage.py = (event.clientY - origin.top) / stage.h;
    stage.pin = true;
  }
  // A finger lifted, or the mouse out of the window: the hologram stops dodging that spot
  function onPointerUp(event: PointerEvent) {
    if (event.pointerType !== 'mouse') stage.pin = false;
  }
  function onPointerOut(event: PointerEvent) {
    if (!event.relatedTarget) stage.pin = false;
  }

  const resizeObserver = new ResizeObserver(() => {
    if (canvas.clientWidth !== stage.w || canvas.clientHeight !== stage.h) resize();
  });
  const themeWatch = new MutationObserver(() => requestAnimationFrame(refreshColors));

  // ---------- Start ----------

  resize();
  const first = firstBreach();
  if (reduced) {
    first.forEach((cell) => hole.set(keyOf(cell.i, cell.dj), cell));
    refreshRim();
    streams = Array.from({ length: STREAMS }, newStream);
    particles.forEach((p) => {
      p.hidden = false;
      p.x = L.cx + p.hx;
      p.y = L.textCy + p.hy;
    });
    draw();
  } else {
    // The grid lights up, the breach gives way cell by cell, then the code climbs out of it
    first.forEach((cell, index) => crack(cell, 0.55 + index * 0.07, 0.35));
    at(0.55 + first.length * 0.07 + 0.5, erupt);
    last = performance.now();
    raf = requestAnimationFrame(loop);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    window.addEventListener('pointerout', onPointerOut);
  }
  resizeObserver.observe(canvas);
  themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  return {
    setBox(next) {
      box = next;
      resize();
    },
    setFont(next) {
      font = next;
      labels = new Map();
      step = null;
      setLabel(label);
      if (reduced) {
        particles.forEach((p) => {
          p.x = L.cx + p.hx;
          p.y = L.textCy + p.hy;
        });
        draw();
      }
    },
    burst(x, y) {
      if (reduced || mode === 'hidden') return;
      emit('burst');
      particles.forEach((p) => {
        const dx = p.x - x;
        const dy = p.y - y;
        const d = Math.hypot(dx, dy) || 1;
        if (d > 300) return;
        const kick = (1 - d / 300) * 1300;
        p.vx += (dx / d) * kick + rand(-120, 120);
        p.vy += (dy / d) * kick + rand(-120, 120);
      });
      for (let n = 0; n < 16; n += 1) spark(x, y, stage.c.p, 1.3);
      // On the floor near the breach, the cell under the pointer gives way
      if (repairing || y <= HY + 4 || hole.size + cracks.length >= MAX_LOST) return;
      const z = (L.cam * L.f) / (y - HY);
      const wx = ((x - VX) * z) / L.f;
      const near = candidates()
        .map((cell) => ({ cell, d: Math.hypot(cell.i + 0.5 - wx, zOf(cell.dj + 0.5) - z) }))
        .sort((a, b) => a.d - b.d)[0];
      if (near && near.d < 1.6) crack(near.cell, t, CRACK_TIME * 0.6);
    },
    repair() {
      if (repairing) return Promise.resolve();
      repairing = true;
      if (reduced) return Promise.resolve();
      return new Promise<void>((resolve) => {
        repairDone = resolve;
        // Cells still breaking stay where they are
        cracks = [];
        dirty = true;
        mode = 'gather';
        modeStart = t;
        const t0 = t;
        at(t0 + 0.6, () => {
          mode = 'dive';
          emit('burst');
        });
        // Sealed from the rim inwards
        const cells = [...hole.values()].sort((a, b) => Math.hypot(b.i + 0.5 - center.x, b.dj + 0.5 - center.dz)
          - Math.hypot(a.i + 0.5 - center.x, a.dj + 0.5 - center.dz));
        const stagger = Math.min(0.08, 1.6 / Math.max(1, cells.length));
        const sealStart = t0 + 1.05;
        cells.forEach((cell, index) => {
          tiles.push({
            ...cell,
            depth: PIT,
            vy: 0,
            ax: 0,
            az: 0,
            vax: 0,
            vaz: 0,
            rise: { start: sealStart + index * stagger, ax: rand(-3, 3), az: rand(-3, 3) },
          });
        });
        dirty = true;
        const sealEnd = sealStart + (cells.length - 1) * stagger + SEAL_RISE;
        at(sealEnd + 0.15, () => {
          ok = true;
          setLabel('200');
          particles.forEach((p) => { p.hidden = false; });
          erupt();
        });
        at(sealEnd + 1.75, () => {
          repairDone?.();
          repairDone = null;
        });
      });
    },
    sector() {
      const cols = 17;
      const rows = 11;
      const rising = new Set(tiles.filter((tile) => tile.rise).map((tile) => keyOf(tile.i, tile.dj)));
      const breaking = new Set(cracks.filter((cr) => t >= cr.start).map((cr) => keyOf(cr.i, cr.dj)));
      const cells: number[] = [];
      const stateOf = (k: string) => {
        if (rising.has(k)) return 3;
        if (hole.has(k)) return 1;
        return breaking.has(k) ? 2 : 0;
      };
      for (let r = 0; r < rows; r += 1) {
        for (let q = 0; q < cols; q += 1) cells.push(stateOf(keyOf(q - 8, 5 - r)));
      }
      return {
        cols, rows, cells, lost: hole.size, integrity: 1 - hole.size / NOMINAL,
      };
    },
    destroy() {
      destroyed = true;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      themeWatch.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      window.removeEventListener('pointerout', onPointerOut);
      // A repair under way never resolves: nothing must navigate once the page is gone
      timers = [];
      repairDone = null;
    },
  };
}
