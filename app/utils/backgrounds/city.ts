// Skyline of the Experience background (scenes.ts, cityCanyon): buildings, windows and antennas
// drawn once into a layer, then only the windows that switch on or off are repainted.
import {
  pick, rand, rgba, TAU, type Layer, type RGB,
} from './core';

export interface CitySpec {
  W: number;
  H: number;
  // 1: buildings rise from the bottom up to y in [t0, t1] (fractions of H);
  // -1: they hang from the top down to y in [t0, t1] (the mirrored half of the original background)
  dir: 1 | -1;
  t0: number;
  t1: number;
  fill: RGB;
  capCol: RGB;
  capA: number;
  winCol: RGB;
  warmCol: RGB;
  winA: number;
  // Share of the windows lit
  lit: number;
  // Window width and height, horizontal and vertical step
  cell: [number, number, number, number];
  wMin: number;
  wMax: number;
  scale: number;
  // Share of the buildings with an antenna
  antenna: number;
  gap: [number, number];
}

export interface Building {
  x: number;
  w: number;
  y0: number;
  y1: number;
  dir: 1 | -1;
}
interface CityWindow {
  x: number;
  y: number;
  w: number;
  h: number;
  lit: boolean;
  warm: boolean;
  a: number;
}
export interface Beacon {
  x: number;
  y: number;
  ph: number;
  v: number;
}
export interface City {
  buildings: Building[];
  windows: CityWindow[];
  beacons: Beacon[];
}

function drawWindow(x: CanvasRenderingContext2D, spec: CitySpec, win: CityWindow) {
  x.fillStyle = rgba(spec.fill);
  x.fillRect(win.x - 0.5, win.y - 0.5, win.w + 1, win.h + 1);
  if (!win.lit) {
    x.fillStyle = rgba(spec.winCol, spec.winA * 0.12);
    x.fillRect(win.x, win.y, win.w, win.h);
    return;
  }
  x.fillStyle = rgba(win.warm ? spec.warmCol : spec.winCol, spec.winA * win.a);
  x.fillRect(win.x, win.y, win.w, win.h);
}

export function buildCity(L: Layer, spec: CitySpec): City {
  const x = L.cx;
  const { W, H } = spec;
  const buildings: Building[] = [];
  const windows: CityWindow[] = [];
  const beacons: Beacon[] = [];
  const [cw, ch, sx, sy] = spec.cell;
  let px = rand(0, 12);
  while (px < W - 20) {
    const bw = Math.max(sx * 2 + 6, Math.round(rand(spec.wMin, spec.wMax) / sx) * sx + 6);
    if (px + bw > W - 4) break;
    const edge = H * rand(spec.t0, spec.t1);
    const y0 = spec.dir > 0 ? edge : 0;
    const y1 = spec.dir > 0 ? H : edge;
    buildings.push({ x: px, w: bw, y0, y1, dir: spec.dir });
    x.fillStyle = rgba(spec.fill);
    x.fillRect(px, y0, bw, y1 - y0);
    // Light cornice, like the cyan edge of the original buildings
    x.fillStyle = rgba(spec.capCol, spec.capA);
    x.fillRect(px, spec.dir > 0 ? y0 : y1 - 2, bw, 2);
    // Windows in a grid, some of them dark
    for (let wy = y0 + 6; wy + ch < y1 - 4; wy += sy) {
      for (let wx = px + 4; wx + cw <= px + bw - 3; wx += sx) {
        const win = { x: wx, y: wy, w: cw, h: ch, lit: Math.random() < spec.lit, warm: Math.random() < 0.12, a: rand(0.45, 1) };
        windows.push(win);
        drawWindow(x, spec, win);
      }
    }
    // Antennas with a beacon on some of the buildings
    if (Math.random() < spec.antenna) {
      const ax = px + bw * rand(0.3, 0.7);
      const len = rand(10, 26) * spec.scale;
      const ay = spec.dir > 0 ? y0 - len : y1 + len;
      x.strokeStyle = rgba(spec.capCol, spec.capA * 1.2);
      x.lineWidth = 1;
      x.beginPath(); x.moveTo(ax, spec.dir > 0 ? y0 : y1); x.lineTo(ax, ay); x.stroke();
      beacons.push({ x: ax, y: ay, ph: rand(TAU), v: rand(1.5, 3) });
    }
    px += bw + rand(spec.gap[0], spec.gap[1]);
  }
  return { buildings, windows, beacons };
}

// A few windows switch on or off: the layer is repainted in place, not redrawn
export function flickerWindows(L: Layer, spec: CitySpec, city: City, rate: number, dt: number) {
  let n = rate * dt;
  while (n > 0) {
    if (Math.random() < n && city.windows.length) {
      const win = pick(city.windows);
      win.lit = !win.lit;
      drawWindow(L.cx, spec, win);
    }
    n -= 1;
  }
}
