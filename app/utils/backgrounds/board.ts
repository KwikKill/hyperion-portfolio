// Printed circuit board of the Projects background (scenes.ts, pcbRoute): connectors on the
// edges, chips and passive parts, and traces routed between them on the original 25 px grid.
import {
  clamp, MONO, mix, pick, polyline, rand, rgba, shuffle, TAU, tr,
  type Colors, type Layer, type Point, type SceneState, type Stage,
} from './core';

interface Pin {
  x: number;
  y: number;
  part: Part;
  net: Net | null;
  flash: number;
  // Pin number on its part, and id across the board (1-based: 0 marks a free exit cell)
  n: number;
  id: number;
}
interface PartBase {
  ref: string;
  flash: number;
  pins: Pin[];
}
interface Connector extends PartBase {
  kind: 'conn';
  horiz: boolean;
  x0: number;
  y0: number;
  n: number;
}
interface Chip extends PartBase {
  kind: 'chip';
  x: number;
  y: number;
  w: number;
  h: number;
  name: string;
}
interface Passive extends PartBase {
  kind: 'passive';
  x: number;
  y: number;
  horiz: boolean;
  res: boolean;
}
type Part = Connector | Chip | Passive;

export interface Geometry {
  pts: Point[];
  // Cumulative length at each point, to place the pulses
  cum: number[];
  len: number;
}
export interface Net {
  a: Pin;
  b: Pin;
  cells: number[];
  // Cells reached by the search before it found the target, in order: replayed by the animation
  visited: Int32Array;
  flash: number;
  runs: { layer: number; geo: Geometry }[];
  vias: Point[];
  layer: number;
  geo: Geometry;
  done: boolean;
}
export interface Board {
  G: number;
  cols: number;
  rows: number;
  parts: Part[];
  pins: Pin[];
  nets: Net[];
  X: (x: number) => number;
  Y: (y: number) => number;
}
interface Pulse {
  net: Net;
  rev: boolean;
  d: number;
  v: number;
}

const CHIPS = ['HYP-7000', 'ATH-16', 'MNE-32', 'TAL-8', 'POL-12', 'CEOS-4', 'MET-24', 'AMP-2', 'HER-9', 'OUR-1'];
const DIRS: Point[] = [[1, 0], [0, 1], [-1, 0], [0, -1]];

// A trace as drawn: corners cut at 45°
function traceGeometry(cells: number[], cols: number, G: number, ox: number, oy: number): Geometry {
  const P: Point[] = cells.map((cell) => [ox + (cell % cols) * G, oy + Math.floor(cell / cols) * G]);
  const corners: Point[] = [P[0]];
  for (let i = 1; i < P.length - 1; i += 1) {
    const turn = P[i][0] - P[i - 1][0] !== P[i + 1][0] - P[i][0] || P[i][1] - P[i - 1][1] !== P[i + 1][1] - P[i][1];
    if (turn) corners.push(P[i]);
  }
  corners.push(P[P.length - 1]);
  const pts: Point[] = [corners[0]];
  const cut = G * 0.36;
  for (let i = 1; i < corners.length - 1; i += 1) {
    const [ax, ay] = corners[i - 1];
    const [bx, by] = corners[i];
    const [cx, cy] = corners[i + 1];
    const l1 = Math.hypot(bx - ax, by - ay);
    const l2 = Math.hypot(cx - bx, cy - by);
    const k1 = Math.min(cut, l1 / 2) / l1;
    const k2 = Math.min(cut, l2 / 2) / l2;
    pts.push([bx - (bx - ax) * k1, by - (by - ay) * k1], [bx + (cx - bx) * k2, by + (cy - by) * k2]);
  }
  pts.push(corners[corners.length - 1]);
  const cum = [0];
  for (let i = 1; i < pts.length; i += 1) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  return { pts, cum, len: cum[cum.length - 1] };
}

// The part of a trace between two distances from its start
export function pathSlice(g: Geometry, d0: number, d1: number): Point[] {
  const a = clamp(d0, 0, g.len);
  const b = clamp(d1, 0, g.len);
  const pointAt = (d: number): Point => {
    let i = 1;
    while (i < g.cum.length - 1 && g.cum[i] < d) i += 1;
    const seg = g.cum[i] - g.cum[i - 1] || 1;
    const k = (d - g.cum[i - 1]) / seg;
    return [g.pts[i - 1][0] + (g.pts[i][0] - g.pts[i - 1][0]) * k, g.pts[i - 1][1] + (g.pts[i][1] - g.pts[i - 1][1]) * k];
  };
  const out = [pointAt(a)];
  for (let i = 1; i < g.pts.length - 1; i += 1) if (g.cum[i] > a && g.cum[i] < b) out.push(g.pts[i]);
  out.push(pointAt(b));
  return out;
}

export function makeBoard(w: number, h: number): Board {
  const G = 25;
  const cols = Math.max(10, Math.floor(w / G));
  const rows = Math.max(8, Math.floor(h / G));
  const ox = (w - (cols - 1) * G) / 2;
  const oy = (h - (rows - 1) * G) / 2;
  // 0 free · 1 part · 3 pin · 4 exit cell of a pin (esc holds the pin id)
  const occ = new Uint8Array(cols * rows);
  const at = (x: number, y: number) => y * cols + x;
  const inside = (x: number, y: number) => x >= 0 && y >= 0 && x < cols && y < rows;
  const free = (x: number, y: number, ww: number, hh: number) => {
    for (let j = y; j < y + hh; j += 1) for (let i = x; i < x + ww; i += 1) if (!inside(i, j) || occ[at(i, j)]) return false;
    return true;
  };
  const parts: Part[] = [];
  const pins: Pin[] = [];
  // Each pin keeps an exit cell no other trace may take: without it, a trace running along a
  // row of pins walls them all in.
  const esc = new Int32Array(cols * rows);
  const addPin = (part: Part, x: number, y: number, ex: number, ey: number) => {
    occ[at(x, y)] = 3;
    const pin: Pin = { x, y, part, net: null, flash: 0, n: part.pins.length + 1, id: pins.length + 1 };
    if (inside(ex, ey) && !occ[at(ex, ey)]) { occ[at(ex, ey)] = 4; esc[at(ex, ey)] = pin.id; }
    part.pins.push(pin);
    pins.push(pin);
  };

  // Input/output connectors on the edges: the links cross the screen
  const nv = clamp(rows - 6, 4, 16);
  const nh = clamp(Math.round(cols * 0.3), 6, 18);
  const specs = [
    { horiz: false, x0: 0, y0: Math.floor((rows - nv) / 2), n: nv, pin: 1 },
    { horiz: false, x0: cols - 1, y0: Math.floor((rows - nv) / 2), n: nv, pin: cols - 2 },
  ];
  if (cols >= 40) {
    specs.push({ horiz: true, x0: Math.floor((cols - nh) / 2), y0: 0, n: nh, pin: 1 },
      { horiz: true, x0: Math.floor((cols - nh) / 2), y0: rows - 1, n: nh, pin: rows - 2 });
  }
  specs.forEach((sp, k) => {
    const part: Connector = { kind: 'conn', horiz: sp.horiz, x0: sp.x0, y0: sp.y0, n: sp.n, ref: `J${k + 1}`, flash: 0, pins: [] };
    for (let j = 0; j < sp.n; j += 1) {
      if (sp.horiz) {
        occ[at(sp.x0 + j, sp.y0)] = 1;
        addPin(part, sp.x0 + j, sp.pin, sp.x0 + j, sp.pin + (sp.y0 === 0 ? 1 : -1));
      } else {
        occ[at(sp.x0, sp.y0 + j)] = 1;
        addPin(part, sp.pin, sp.y0 + j, sp.pin + (sp.x0 === 0 ? 1 : -1), sp.y0 + j);
      }
    }
    parts.push(part);
  });

  // Chips, pins on the top and bottom edges
  const nChips = clamp(Math.round((cols * rows) / 170), 2, 14);
  for (let tries = 0, made = 0; made < nChips && tries < 300; tries += 1) {
    const pw = 4 + Math.floor(rand(5));
    const ph = 2 + Math.floor(rand(2));
    const x = 1 + Math.floor(rand(cols - pw - 2));
    const y = 2 + Math.floor(rand(rows - ph - 4));
    if (!free(x - 1, y - 2, pw + 2, ph + 4)) continue;
    for (let j = y; j < y + ph; j += 1) for (let i = x; i < x + pw; i += 1) occ[at(i, j)] = 1;
    const part: Chip = { kind: 'chip', x, y, w: pw, h: ph, ref: `U${made + 1}`, name: pick(CHIPS), flash: 0, pins: [] };
    for (let i = 0; i < pw; i += 1) {
      addPin(part, x + i, y - 1, x + i, y - 2);
      addPin(part, x + i, y + ph, x + i, y + ph + 1);
    }
    parts.push(part);
    made += 1;
  }

  // Resistors and capacitors: a body between two pads
  const nSmall = Math.round((cols * rows) / 70);
  let nr = 1;
  let nc = 1;
  for (let tries = 0, made = 0; made < nSmall && tries < 500; tries += 1) {
    const horiz = Math.random() < 0.6;
    const x = 1 + Math.floor(rand(cols - 4));
    const y = 1 + Math.floor(rand(rows - 4));
    if (!free(x - 1, y - 1, horiz ? 5 : 3, horiz ? 3 : 5)) continue;
    const res = Math.random() < 0.55;
    const part: Passive = { kind: 'passive', x, y, horiz, res, ref: res ? `R${nr++}` : `C${nc++}`, flash: 0, pins: [] };
    occ[horiz ? at(x + 1, y) : at(x, y + 1)] = 1;
    addPin(part, x, y, horiz ? x - 1 : x, horiz ? y : y - 1);
    addPin(part, horiz ? x + 2 : x, horiz ? y : y + 2, horiz ? x + 3 : x, horiz ? y : y + 3);
    parts.push(part);
    made += 1;
  }

  // Two copper layers and vias, like a real board. The Lee search starts from a pin on both
  // layers at once: a trace moves on in its layer, or changes layer through a via (a cell free on
  // both sides, one step more: it only appears when it helps). It notes the free pins it reaches;
  // the target is picked among them, often far away.
  const nets: Net[] = [];
  const maxNets = Math.floor(pins.length / 2);
  const N = cols * rows;
  const layers = [new Uint8Array(N), new Uint8Array(N)];
  const dist = new Int32Array(N * 2);
  const queue = new Int32Array(N * 2);
  const seen = new Uint8Array(pins.length + 1);
  const explored = new Uint8Array(N);
  const foreignExit = (cell: number, a: Pin) => occ[cell] === 4 && esc[cell] !== a.id;
  const explore = (a: Pin) => {
    const start = at(a.x, a.y);
    dist.fill(-1);
    seen.fill(0);
    explored.fill(0);
    let head = 0;
    let tail = 0;
    queue[tail++] = start;
    queue[tail++] = start + N;
    dist[start] = 0;
    dist[start + N] = 0;
    const visited: number[] = [];
    const reached: { b: Pin; state: number; order: number }[] = [];
    while (head < tail) {
      const cur = queue[head++];
      const cell = cur % N;
      const layer = cur >= N ? 1 : 0;
      if (!explored[cell]) { explored[cell] = 1; visited.push(cell); }
      // Exit cell of another pin: noted if that pin is free, and the search stops there
      if (foreignExit(cell, a)) {
        const b = pins[esc[cell] - 1];
        if (!b.net && b.part !== a.part && !seen[b.id]) { seen[b.id] = 1; reached.push({ b, state: cur, order: visited.length }); }
        continue;
      }
      const cx = cell % cols;
      const cy = (cell - cx) / cols;
      for (const [dx, dy] of DIRS) {
        const nx = cx + dx;
        const ny = cy + dy;
        if (!inside(nx, ny)) continue;
        const n = at(nx, ny);
        const state = n + layer * N;
        if (dist[state] !== -1 || layers[layer][n] || (occ[n] !== 0 && occ[n] !== 4)) continue;
        dist[state] = dist[cur] + 1;
        queue[tail++] = state;
      }
      const other = cell + (1 - layer) * N;
      if (dist[other] === -1 && occ[cell] === 0 && !layers[1 - layer][cell]) {
        dist[other] = dist[cur] + 1;
        queue[tail++] = other;
      }
    }
    return { visited, reached };
  };
  // Back from the target's exit: same layer and same direction as long as possible, never
  // through another pin's exit
  const backtrack = (a: Pin, state: number) => {
    const states = [state];
    let p = state;
    let dir = -1;
    while (dist[p] > 0) {
      const cell = p % N;
      const layer = p >= N ? 1 : 0;
      const px = cell % cols;
      const py = (cell - px) / cols;
      let next = -1;
      let ndir = -1;
      for (let k = 0; k < 4; k += 1) {
        const nx = px + DIRS[k][0];
        const ny = py + DIRS[k][1];
        if (!inside(nx, ny)) continue;
        const n = at(nx, ny);
        const st = n + layer * N;
        if (dist[st] === dist[p] - 1 && !foreignExit(n, a) && (next === -1 || k === dir)) { next = st; ndir = k; }
      }
      const via = cell + (1 - layer) * N;
      if (next === -1 && dist[via] === dist[p] - 1) { next = via; ndir = dir; }
      if (next === -1) return null;
      p = next;
      dir = ndir;
      states.push(p);
    }
    return states.reverse();
  };
  for (const a of shuffle(pins)) {
    if (nets.length >= maxNets) break;
    if (a.net) continue;
    const { visited, reached } = explore(a);
    if (!reached.length) continue;
    reached.sort((p, q) => dist[p.state] - dist[q.state]);
    // Three links out of four go far: among the farthest 40 % of the reachable pins
    let target;
    if (Math.random() < 0.75) {
      const k0 = Math.floor(reached.length * 0.6);
      target = reached[k0 + Math.floor(rand(reached.length - k0))];
    } else {
      target = reached[Math.floor(rand(Math.min(4, reached.length)))];
    }
    const path = backtrack(a, target.state);
    if (!path) continue;
    const best = target.b;
    path.push(at(best.x, best.y) + (target.state >= N ? N : 0));
    // Runs per layer (a via belongs to both), occupied cells, vias
    const runs: { layer: number; cells: number[] }[] = [];
    const vias: number[] = [];
    const cells: number[] = [];
    path.forEach((state, k) => {
      const cell = state % N;
      const layer = state >= N ? 1 : 0;
      if (k && path[k - 1] % N === cell) {
        vias.push(cell);
        layers[0][cell] = 1;
        layers[1][cell] = 1;
        runs.push({ layer, cells: [cell] });
        return;
      }
      if (!runs.length || runs[runs.length - 1].layer !== layer) runs.push({ layer, cells: [] });
      runs[runs.length - 1].cells.push(cell);
      cells.push(cell);
      if (occ[cell] === 0) layers[layer][cell] = 1;
    });
    const kept = runs.filter((run) => run.cells.length > 1);
    const longest = kept.reduce((m, run) => (run.cells.length > m.cells.length ? run : m), { layer: 0, cells: [] as number[] });
    const net: Net = {
      a,
      b: best,
      cells,
      visited: Int32Array.from(visited.slice(0, target.order)),
      flash: 0,
      runs: kept.map((run) => ({ layer: run.layer, geo: traceGeometry(run.cells, cols, G, ox, oy) })),
      vias: vias.map((cell): Point => [ox + (cell % cols) * G, oy + Math.floor(cell / cols) * G]),
      layer: longest.layer,
      geo: traceGeometry(cells, cols, G, ox, oy),
      done: false,
    };
    a.net = net;
    best.net = net;
    nets.push(net);
  }
  return { G, cols, rows, parts, pins, nets, X: (x) => ox + x * G, Y: (y) => oy + y * G };
}

const traceColor = (c: Colors, layer: number) => (layer ? rgba(c.s, c.light ? 0.3 : 0.2) : rgba(c.p, c.light ? 0.42 : 0.3));

// Traces: the bottom layer's runs, then the top layer's, then the vias
export function drawNets(x: CanvasRenderingContext2D, c: Colors, nets: Net[]) {
  x.lineCap = 'round';
  x.lineJoin = 'round';
  [1, 0].forEach((layer) => {
    x.strokeStyle = traceColor(c, layer);
    x.lineWidth = layer ? 2 : 2.4;
    x.beginPath();
    nets.forEach((net) => net.runs.forEach((run) => { if (run.layer === layer) polyline(x, run.geo.pts); }));
    x.stroke();
  });
  nets.forEach((net) => net.vias.forEach(([vx, vy]) => {
    x.fillStyle = rgba(mix(c.p, c.s, 0.5), 0.75);
    x.beginPath(); x.arc(vx, vy, 3.6, 0, TAU); x.fill();
    x.fillStyle = rgba(c.b);
    x.beginPath(); x.arc(vx, vy, 1.4, 0, TAU); x.fill();
  }));
}

// The board at rest, drawn once into a layer: background, grid, traces, parts, pads
export function drawBoard(s: Stage, L: Layer, B: Board, nets: Net[]) {
  const x = L.cx;
  const { c } = s;
  const { G } = B;
  x.clearRect(0, 0, L.w, L.h);
  x.fillStyle = rgba(mix(c.b, c.fg, c.light ? 0.04 : 0.067));
  x.fillRect(0, 0, L.w, L.h);
  x.strokeStyle = rgba(c.p, c.light ? 0.08 : 0.06);
  x.lineWidth = 1;
  x.beginPath();
  for (let i = 0; i <= B.cols; i += 1) { const gx = Math.round(B.X(i - 0.5)) + 0.5; x.moveTo(gx, 0); x.lineTo(gx, L.h); }
  for (let j = 0; j <= B.rows; j += 1) { const gy = Math.round(B.Y(j - 0.5)) + 0.5; x.moveTo(0, gy); x.lineTo(L.w, gy); }
  x.stroke();
  drawNets(x, c, nets);
  B.parts.forEach((part) => drawPart(s, x, B, part));
  B.pins.forEach((pin) => drawPad(x, B, c, pin, 0));
}

function drawPart(s: Stage, x: CanvasRenderingContext2D, B: Board, part: Part) {
  const { c } = s;
  const { G } = B;
  x.lineWidth = 1;
  if (part.kind === 'conn') {
    const ax = B.X(part.x0);
    const ay = B.Y(part.y0);
    const bx = part.horiz ? B.X(part.x0 + part.n - 1) : ax;
    const by = part.horiz ? ay : B.Y(part.y0 + part.n - 1);
    const x0 = Math.min(ax, bx) - G * 0.42;
    const y0 = Math.min(ay, by) - G * 0.42;
    const bw = Math.abs(bx - ax) + G * 0.84;
    const bh = Math.abs(by - ay) + G * 0.84;
    x.strokeStyle = rgba(c.mu, 0.55);
    x.beginPath();
    part.pins.forEach((pin) => {
      const px = B.X(pin.x);
      const py = B.Y(pin.y);
      if (part.horiz) { x.moveTo(px, ay); x.lineTo(px, py); } else { x.moveTo(ax, py); x.lineTo(px, py); }
    });
    x.stroke();
    x.fillStyle = rgba(mix(c.b, c.fg, c.light ? 0.1 : 0.13));
    x.fillRect(x0, y0, bw, bh);
    x.strokeStyle = rgba(c.mu, 0.8);
    x.strokeRect(x0 + 0.5, y0 + 0.5, bw - 1, bh - 1);
    x.fillStyle = rgba(c.p, 0.5);
    for (let j = 0; j < part.n; j += 1) {
      x.fillRect((part.horiz ? B.X(part.x0 + j) : ax) - 2.5, (part.horiz ? ay : B.Y(part.y0 + j)) - 2.5, 5, 5);
    }
    x.font = `600 10px ${MONO}`;
    x.fillStyle = rgba(c.fg, 0.75);
    if (part.horiz) x.fillText(`${part.ref} · ${tr(s, 'E/S', 'I/O')}`, x0 + bw + 8, ay + 4);
    else x.fillText(part.ref, part.x0 === 0 ? x0 + 2 : x0 - 4, y0 - 6);
    return;
  }
  if (part.kind === 'chip') {
    const x0 = B.X(part.x) - G * 0.45;
    const y0 = B.Y(part.y) - G * 0.42;
    const pw = (part.w - 1) * G + G * 0.9;
    const ph = (part.h - 1) * G + G * 0.84;
    x.strokeStyle = rgba(c.mu, 0.55);
    x.beginPath();
    part.pins.forEach((pin) => { const px = B.X(pin.x); x.moveTo(px, pin.y < part.y ? y0 : y0 + ph); x.lineTo(px, B.Y(pin.y)); });
    x.stroke();
    x.fillStyle = rgba(mix(c.b, c.fg, c.light ? 0.1 : 0.13));
    x.fillRect(x0, y0, pw, ph);
    x.strokeStyle = rgba(c.mu, 0.8);
    x.strokeRect(x0 + 0.5, y0 + 0.5, pw - 1, ph - 1);
    x.beginPath();
    x.arc(x0 + 7, y0 + 7, 2.2, 0, TAU);
    x.stroke();
    x.font = `600 10px ${MONO}`;
    x.fillStyle = rgba(c.fg, 0.75);
    x.textAlign = 'center';
    x.fillText(part.name, x0 + pw / 2, y0 + ph / 2 + 2);
    x.font = `9px ${MONO}`;
    x.fillStyle = rgba(c.mu, 0.95);
    x.fillText(part.ref, x0 + pw / 2, y0 + ph / 2 + 13);
    x.textAlign = 'start';
    return;
  }
  const ax = B.X(part.pins[0].x);
  const ay = B.Y(part.pins[0].y);
  const bx = B.X(part.pins[1].x);
  const by = B.Y(part.pins[1].y);
  const mx = (ax + bx) / 2;
  const my = (ay + by) / 2;
  x.strokeStyle = rgba(c.mu, 0.6);
  x.beginPath(); x.moveTo(ax, ay); x.lineTo(bx, by); x.stroke();
  const bw = part.horiz ? G * 1.1 : G * 0.5;
  const bh = part.horiz ? G * 0.5 : G * 1.1;
  x.fillStyle = rgba(mix(c.b, c.fg, c.light ? 0.12 : 0.16));
  x.fillRect(mx - bw / 2, my - bh / 2, bw, bh);
  x.strokeStyle = rgba(c.mu, 0.8);
  x.strokeRect(mx - bw / 2 + 0.5, my - bh / 2 + 0.5, bw - 1, bh - 1);
  if (part.res) {
    x.fillStyle = rgba(c.p, 0.45);
    [-0.25, 0, 0.25].forEach((k) => {
      if (part.horiz) x.fillRect(mx + k * bw - 1, my - bh / 2 + 1, 2, bh - 2);
      else x.fillRect(mx - bw / 2 + 1, my + k * bh - 1, bw - 2, 2);
    });
  }
  x.font = `9px ${MONO}`;
  x.fillStyle = rgba(c.mu, 0.95);
  x.fillText(part.ref, part.horiz ? mx - 8 : mx + 8, part.horiz ? my - 10 : my + 3);
}

export function drawPad(x: CanvasRenderingContext2D, B: Board, c: Colors, pin: Pin, glow: number) {
  const px = B.X(pin.x);
  const py = B.Y(pin.y);
  x.fillStyle = rgba(mix(c.s, c.fg, glow * 0.5), (c.light ? 0.75 : 0.55) + glow * 0.45);
  if (pin.part.kind === 'passive') { x.beginPath(); x.arc(px, py, 4.6, 0, TAU); x.fill(); } else x.fillRect(px - 3.5, py - 4.5, 7, 9);
  x.fillStyle = rgba(c.b);
  x.beginPath(); x.arc(px, py, 1.6, 0, TAU); x.fill();
}

// Current pulses along the traces; reaching a chip or a connector often starts another one
export function pcbPulses(s: Stage, st: SceneState, B: Board, dt: number, rate: number) {
  const { ctx, c } = s;
  const launch = (net: Net, fromB: boolean) => {
    if (st.pulses.length > 70) return;
    net.flash = 1;
    st.pulses.push({ net, rev: fromB, d: 0, v: rand(150, 330) * (st.speed || 1) });
  };
  st.spawn -= dt;
  if (st.spawn <= 0 && B.nets.length && rate > 0) {
    st.spawn = rand(0.6, 1.4) / rate;
    launch(pick(B.nets), Math.random() < 0.5);
  }
  const probe: Pin | null = st.probe;
  if (probe && probe.net && Math.random() < dt * 7) launch(probe.net, probe === probe.net.b);
  const arrived: Pulse[] = [];
  st.pulses = (st.pulses as Pulse[]).filter((p) => {
    p.d += p.v * dt;
    if (p.d < p.net.geo.len + 40) return true;
    arrived.push(p);
    return false;
  });
  arrived.forEach((p) => {
    const end = p.rev ? p.net.a : p.net.b;
    end.flash = 1;
    end.part.flash = 1;
    if (end.part.kind !== 'passive' && Math.random() < 0.7) {
      const outs = end.part.pins.filter((pin) => pin.net && pin !== end);
      if (outs.length) {
        const o = pick(outs);
        if (o.net) launch(o.net, o === o.net.b);
      }
    }
  });
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  // Traces just travelled: a little brighter
  B.nets.forEach((net) => {
    net.flash = Math.max(0, net.flash - dt * 0.8);
    if (net.flash < 0.04) return;
    ctx.strokeStyle = rgba(net.layer ? c.s : c.p, 0.4 * net.flash);
    ctx.lineWidth = net.layer ? 2 : 2.4;
    ctx.beginPath(); polyline(ctx, net.geo.pts); ctx.stroke();
  });
  (st.pulses as Pulse[]).forEach((p) => {
    const g = p.net.geo;
    const head = Math.min(p.d, g.len);
    const tailD = Math.max(0, p.d - 70);
    if (tailD >= g.len) return;
    const pts = p.rev ? pathSlice(g, g.len - head, g.len - tailD) : pathSlice(g, tailD, head);
    ctx.strokeStyle = rgba(c.s, 0.22);
    ctx.lineWidth = 7;
    ctx.beginPath(); polyline(ctx, pts); ctx.stroke();
    ctx.strokeStyle = rgba(mix(c.s, c.fg, 0.35), 0.95);
    ctx.lineWidth = 2.2;
    ctx.beginPath(); polyline(ctx, pts); ctx.stroke();
  });
  ctx.lineCap = 'butt';
  B.pins.forEach((pin) => {
    if (pin.flash <= 0) return;
    pin.flash = Math.max(0, pin.flash - dt * 2);
    drawPad(ctx, B, c, pin, pin.flash);
    ctx.strokeStyle = rgba(c.s, pin.flash * 0.6);
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(B.X(pin.x), B.Y(pin.y), 6 + (1 - pin.flash) * 12, 0, TAU); ctx.stroke();
  });
  B.parts.forEach((part) => {
    if (part.kind !== 'chip' || part.flash <= 0) return;
    part.flash = Math.max(0, part.flash - dt * 1.5);
    const x0 = B.X(part.x) - B.G * 0.45;
    const y0 = B.Y(part.y) - B.G * 0.42;
    ctx.strokeStyle = rgba(c.p, 0.9 * part.flash);
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x0 - 1.5, y0 - 1.5, (part.w - 1) * B.G + B.G * 0.9 + 3, (part.h - 1) * B.G + B.G * 0.84 + 3);
    ctx.fillStyle = rgba(c.tm, part.flash);
    ctx.beginPath(); ctx.arc(x0 + (part.w - 1) * B.G + B.G * 0.9 - 7, y0 + 7, 2.4, 0, TAU); ctx.fill();
  });
  ctx.lineWidth = 1;
}

// The probe: the pad nearest to the pointer, which sends current into its trace
export function pcbProbe(s: Stage, st: SceneState, B: Board) {
  st.probe = null;
  if (!s.pin) return;
  const mx = s.px * s.w;
  const my = s.py * s.h;
  let bd = 60;
  B.pins.forEach((pin) => {
    const d = Math.hypot(B.X(pin.x) - mx, B.Y(pin.y) - my);
    if (d < bd && pin.net) { bd = d; st.probe = pin; }
  });
  const probe: Pin | null = st.probe;
  if (!probe) return;
  const { ctx, c, t } = s;
  const px = B.X(probe.x);
  const py = B.Y(probe.y);
  ctx.strokeStyle = rgba(c.a, 0.9);
  ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.arc(px, py, 10 + Math.sin(t * 8) * 1.5, 0, TAU); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(px - 18, py); ctx.lineTo(px - 12, py); ctx.moveTo(px + 12, py); ctx.lineTo(px + 18, py);
  ctx.moveTo(px, py - 18); ctx.lineTo(px, py - 12); ctx.moveTo(px, py + 12); ctx.lineTo(px, py + 18); ctx.stroke();
  ctx.font = `600 10px ${MONO}`;
  ctx.fillStyle = rgba(c.a, 0.95);
  ctx.fillText(`${tr(s, 'SONDE', 'PROBE')} · ${probe.part.ref}.${probe.n} · ${tr(s, '3,3 V', '3.3 V')}`, px + 16, py - 14);
}
