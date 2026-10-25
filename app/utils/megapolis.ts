// The "megapolis" self-destruct sequence: the page tilts into the ground of a neon city, each element
// of the screen grows into a building carrying its real pixels on its roof, a generated city spreads
// to the horizon around it, then it dematerialises and powers down. Plain WebGL. Browser-only.
//
// World units: the screen is always 800 units high, so the camera path and the city keep the same
// proportions on every screen; x runs to the right, y up, z out of the ground.

import { scanScreen } from './collapse';
import { pageBackdrop } from './selfDestructScreen';

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const smooth = (p: number) => p * p * (3 - 2 * p);
export const span = (t: number, t0: number, t1: number) => smooth(clamp((t - t0) / (t1 - t0), 0, 1));

type RGB = [number, number, number];

const FOV = (50 * Math.PI) / 180;
// Camera distance at which the screen exactly fills the 50° vertical field of view
export const DIST = 400 / Math.tan(FOV / 2);
export const DISTRICTS = 5;
const CARS = 600;

/* ---------- An image of the screen, redrawn from the computed styles ---------- */

const SKIP = 'script, style, template, noscript, .sr-only';

// Only a zero alpha counts: rgb(0, 0, 0) is an opaque black
const transparent = (color: string) => !color || color === 'transparent' || /^rgba\((?:[^,]*,){3}\s*0(?:\.0*)?\s*\)$/.test(color) || /\/\s*0(?:\.0*)?\s*\)$/.test(color);

// Colour and blur of the first shadow of a box-shadow or text-shadow
function shadowOf(value: string): { color: string; blur: number } | null {
  if (!value || value === 'none') return null;
  const m = value.match(/(rgba?\([^)]*\))\s+(-?[\d.]+)px\s+(-?[\d.]+)px\s+([\d.]+)px/);
  return m?.[1] ? { color: m[1], blur: parseFloat(m[4] ?? '0') } : null;
}

function transformText(text: string, transform: string): string {
  if (transform === 'uppercase') return text.toUpperCase();
  if (transform === 'lowercase') return text.toLowerCase();
  if (transform === 'capitalize') return text.replace(/(^|\s)(\S)/g, (_, space: string, ch: string) => space + ch.toUpperCase());
  return text;
}

// Gradient text paints nothing once out of its element: the theme colour instead
function inkOf(cs: CSSStyleDeclaration): string {
  return transparent(cs.color) || transparent(cs.getPropertyValue('-webkit-text-fill-color')) ? 'rgb(var(--color-primary))' : cs.color;
}

// What is on screen, drawn into a canvas: backgrounds, borders, glows, canvases, images and text.
// Gradients and inline icons are left out. Used as the ground of the city and the roofs of the
// site's buildings.
export function paintScreen(page: HTMLElement): HTMLCanvasElement {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const scale = Math.min(window.devicePixelRatio || 1, 2, 4096 / W);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(W * scale);
  canvas.height = Math.round(H * scale);
  const p = canvas.getContext('2d');
  if (!p) return canvas;
  p.setTransform(scale, 0, 0, scale, 0, 0);
  p.fillStyle = pageBackdrop(page);
  p.fillRect(0, 0, W, H);
  p.textBaseline = 'middle';
  const range = document.createRange();
  const theme = document.getElementById('cyberpunkroot');
  const primary = theme ? `rgb(${getComputedStyle(theme).getPropertyValue('--color-primary').trim().split(/\s+/).join(', ')})` : '#fe3';

  function paintBox(cs: CSSStyleDeclaration, r: DOMRect) {
    if (!p) return;
    const radius = cs.borderTopLeftRadius.endsWith('%')
      ? (Math.min(r.width, r.height) * parseFloat(cs.borderTopLeftRadius)) / 100
      : parseFloat(cs.borderTopLeftRadius) || 0;
    const shape = (inset = 0) => {
      p.beginPath();
      const w = r.width - inset * 2;
      const h = r.height - inset * 2;
      if (p.roundRect) p.roundRect(r.left + inset, r.top + inset, w, h, Math.max(0, Math.min(radius - inset, w / 2, h / 2)));
      else p.rect(r.left + inset, r.top + inset, w, h);
    };
    const filled = !transparent(cs.backgroundColor);
    const glow = shadowOf(cs.boxShadow);
    if (glow && filled) {
      p.save();
      p.shadowColor = glow.color;
      p.shadowBlur = glow.blur;
      p.fillStyle = cs.backgroundColor;
      shape();
      p.fill();
      p.restore();
    } else if (filled) {
      p.fillStyle = cs.backgroundColor;
      shape();
      p.fill();
    }
    const sides = (['Top', 'Right', 'Bottom', 'Left'] as const).map((side) => ({
      side,
      width: cs.getPropertyValue(`border-${side.toLowerCase()}-style`) === 'none' ? 0 : parseFloat(cs.getPropertyValue(`border-${side.toLowerCase()}-width`)) || 0,
      color: cs.getPropertyValue(`border-${side.toLowerCase()}-color`),
    })).filter((s) => s.width > 0 && !transparent(s.color));
    if (!sides.length) return;
    // The same border all around follows the rounded corners; otherwise each side is a bar
    const [first] = sides;
    if (first && sides.length === 4 && sides.every((s) => s.width === first.width && s.color === first.color)) {
      p.strokeStyle = first.color;
      p.lineWidth = first.width;
      shape(first.width / 2);
      p.stroke();
      return;
    }
    for (const { side, width, color } of sides) {
      p.fillStyle = color;
      if (side === 'Top') p.fillRect(r.left, r.top, r.width, width);
      else if (side === 'Bottom') p.fillRect(r.left, r.bottom - width, r.width, width);
      else if (side === 'Left') p.fillRect(r.left, r.top, width, r.height);
      else p.fillRect(r.right - width, r.top, width, r.height);
    }
  }

  // Text line by line, from the boxes of its words
  function paintText(node: Text, cs: CSSStyleDeclaration) {
    const raw = node.nodeValue ?? '';
    if (!p || !raw.trim()) return;
    const ink = inkOf(cs);
    p.fillStyle = ink === 'rgb(var(--color-primary))' ? primary : ink;
    p.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    if ('letterSpacing' in p) p.letterSpacing = cs.letterSpacing === 'normal' ? '0px' : cs.letterSpacing;
    const glow = shadowOf(cs.textShadow);
    p.shadowColor = glow ? glow.color : 'transparent';
    p.shadowBlur = glow ? glow.blur : 0;
    let line: { start: number; end: number; left: number; top: number; bottom: number } | null = null;
    const flush = () => {
      if (!line || line.bottom <= 0 || line.top >= H) return;
      const text = transformText(raw.slice(line.start, line.end).replace(/\s+/g, ' '), cs.textTransform);
      p.fillText(text, line.left, (line.top + line.bottom) / 2);
    };
    for (const m of raw.matchAll(/\S+/g)) {
      const start = m.index ?? 0;
      const end = start + m[0].length;
      range.setStart(node, start);
      range.setEnd(node, end);
      const r = range.getClientRects()[0];
      if (!r || (!r.width && !r.height)) continue;
      if (line && Math.abs(r.top - line.top) <= r.height / 2) {
        line.end = end;
        line.bottom = Math.max(line.bottom, r.bottom);
      } else {
        flush();
        line = {
          start, end, left: r.left, top: r.top, bottom: r.bottom,
        };
      }
    }
    flush();
    p.shadowBlur = 0;
  }

  function paintImage(img: HTMLImageElement, r: DOMRect) {
    if (!p || !img.complete || !img.naturalWidth) return;
    // A picture from another origin would lock the canvas: WebGL could not use it
    const source = img.currentSrc || img.src;
    if (!source.startsWith('data:') && new URL(source, window.location.href).origin !== window.location.origin) return;
    try {
      p.drawImage(img, r.left, r.top, r.width, r.height);
    } catch {
      // An image that cannot be drawn is left out
    }
  }

  // Fixed and sticky elements raised above the page (the header) are painted last; the sticky
  // backgrounds of the sections, which have no z-index, stay in their place
  const above: [Element, number][] = [];

  function walk(el: Element, alpha: number, deferred = false) {
    if (!p || el.matches(SKIP)) return;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return;
    if (!deferred && (cs.position === 'fixed' || cs.position === 'sticky') && parseInt(cs.zIndex, 10) > 0) {
      above.push([el, alpha]);
      return;
    }
    const a = alpha * (parseFloat(cs.opacity) || 0);
    if (a < 0.02) return;
    const r = el.getBoundingClientRect();
    const contents = cs.display === 'contents';
    if (!contents && (r.bottom <= 0 || r.top >= H || r.right <= 0 || r.left >= W || r.width < 0.5 || r.height < 0.5)) return;
    p.globalAlpha = a;
    if (el instanceof HTMLCanvasElement) {
      try {
        p.drawImage(el, r.left, r.top, r.width, r.height);
      } catch {
        // A canvas that cannot be read is left out
      }
      return;
    }
    if (el instanceof HTMLImageElement) {
      paintImage(el, r);
      return;
    }
    if (!contents) paintBox(cs, r);
    const clip = !contents && cs.overflow !== 'visible';
    if (clip) {
      p.save();
      p.beginPath();
      p.rect(r.left, r.top, r.width, r.height);
      p.clip();
    }
    for (const child of el.childNodes) {
      if (child instanceof Text) {
        p.globalAlpha = a;
        paintText(child, cs);
      } else if (child instanceof HTMLElement) {
        walk(child, a);
      }
    }
    if (clip) p.restore();
  }
  walk(page, 1);
  above.forEach(([el, alpha]) => walk(el, alpha, true));
  p.globalAlpha = 1;
  return canvas;
}

/* ---------- Footprints of the site's buildings ---------- */

export interface Footprint {
  x: number;
  y: number;
  w: number;
  h: number;
  color: RGB;
  // A letter of a large title: the tallest towers of the site
  letter: boolean;
}

function rgbOf(color: string): RGB | null {
  const m = color.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+))?/);
  if (!m) return null;
  if (m[4] !== undefined && parseFloat(m[4]) < 0.3) return null;
  return [Number(m[1]) / 255, Number(m[2]) / 255, Number(m[3]) / 255];
}

const MEDIA = 'img, canvas, svg, video, input, select, textarea';

// One footprint per element on screen: boxes, buttons and media whole, text line by line, large
// titles letter by letter. Each has the colour of its element, so the city takes the theme's.
export function footprints(page: HTMLElement): Footprint[] {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const theme = document.getElementById('cyberpunkroot');
  const primary = rgbOf(theme ? `rgb(${getComputedStyle(theme).getPropertyValue('--color-primary').trim().split(/\s+/).join(', ')})` : '') ?? [1, 0.93, 0.23];
  const list: Footprint[] = [];
  const range = document.createRange();
  const add = (r: { left: number; top: number; right: number; bottom: number }, color: RGB, letter: boolean) => {
    const x = clamp(r.left, 0, W);
    const y = clamp(r.top, 0, H);
    const w = clamp(r.right, 0, W) - x;
    const h = clamp(r.bottom, 0, H) - y;
    if (w >= 2 && h >= 2) {
      list.push({
        x, y, w, h, color, letter,
      });
    }
  };
  for (const el of scanScreen(page).leaves) {
    const cs = getComputedStyle(el);
    const fill = rgbOf(cs.backgroundColor);
    const border = parseFloat(cs.borderTopWidth) > 0 && cs.borderTopStyle !== 'none' ? rgbOf(cs.borderTopColor) : null;
    if (fill || border || el.matches(MEDIA) || el.querySelector(MEDIA)) {
      add(el.getBoundingClientRect(), fill ?? border ?? rgbOf(inkOf(cs)) ?? primary, false);
      continue;
    }
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const text = node.nodeValue ?? '';
      const parent = node.parentElement;
      if (!text.trim() || !parent) continue;
      const style = getComputedStyle(parent);
      const color = rgbOf(inkOf(style)) ?? primary;
      const letters = parseFloat(style.fontSize) >= 36;
      let line: { left: number; top: number; right: number; bottom: number } | null = null;
      for (const m of text.matchAll(letters ? /\S/g : /\S+/g)) {
        range.setStart(node, m.index ?? 0);
        range.setEnd(node, (m.index ?? 0) + m[0].length);
        const r = range.getClientRects()[0];
        if (!r || (!r.width && !r.height)) continue;
        if (!letters && line && Math.abs(r.top - line.top) <= r.height / 2) {
          line.right = Math.max(line.right, r.right);
          line.bottom = Math.max(line.bottom, r.bottom);
          continue;
        }
        if (line) add(line, color, letters);
        line = {
          left: r.left, top: r.top, right: r.right, bottom: r.bottom,
        };
      }
      if (line) add(line, color, letters);
    }
  }
  return list;
}

/* ---------- Shaders ---------- */

const HASH = 'float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }';
// Night haze: far things sink into a dark violet fog
const FOG = 'uniform vec3 uFog; vec3 fogged(vec3 c, float depth) { return mix(c, uFog, 1.0 - exp(-max(depth - 700.0, 0.0) / 2600.0)); }';
// Where a point of the ground falls on the image of the screen (uPageSize: width and height of the
// screen in world units)
const PAGE_UV = 'uniform vec2 uPageSize; vec2 pageUV(vec2 w) { return vec2(w.x / uPageSize.x + 0.5, 0.5 - w.y / uPageSize.y); }';

const SKY_VS = 'attribute vec2 aP; varying float vY; void main() { vY = aP.y; gl_Position = vec4(aP, 0.999, 1.0); }';
const SKY_FS = `
precision mediump float; varying float vY;
void main() { gl_FragColor = vec4(mix(vec3(0.17, 0.04, 0.21), vec3(0.0, 0.0, 0.012), smoothstep(-0.6, 0.9, vY)), 1.0); }`;

const GROUND_VS = `
attribute vec2 aPos; uniform mat4 uMVP; varying vec2 vW; varying float vDepth;
void main() { vW = aPos; vec4 c = uMVP * vec4(aPos, 0.0, 1.0); vDepth = c.w; gl_Position = c; }`;
const GROUND_FS = `
precision highp float;
uniform sampler2D uPage; uniform float uPageA; uniform float uGridA; uniform float uScan; uniform float uScanA;
uniform vec3 uGridCol; uniform vec3 uStreetCol; uniform vec3 uWireCol;
varying vec2 vW; varying float vDepth;
${FOG}
${PAGE_UV}
void main() {
  vec2 pc = pageUV(vW);
  vec3 col = vec3(0.0);
  if (pc.x >= 0.0 && pc.x <= 1.0 && pc.y >= 0.0 && pc.y <= 1.0) col = texture2D(uPage, pc).rgb * uPageA;
  float fade = 1.0 - smoothstep(1800.0, 3600.0, length(vW));
  // The grid of the floor, stretched to the horizon
  vec2 g = abs(mod(vW + 32.0, 64.0) - 32.0);
  col += uGridCol * max(smoothstep(1.4, 0.0, g.x), smoothstep(1.4, 0.0, g.y)) * 0.16 * fade * uGridA;
  // A line down the middle of every street around the screen
  vec2 s = mod(vW, 150.0);
  float street = max(smoothstep(2.0, 0.0, min(s.x, 150.0 - s.x)), smoothstep(2.0, 0.0, min(s.y, 150.0 - s.y)));
  col += uStreetCol * street * 0.4 * fade * uGridA * step(1.0, max(abs(vW.x) - uPageSize.x * 0.5 - 60.0, abs(vW.y) - uPageSize.y * 0.5 - 60.0));
  // The dematerialising scan: a bright band on the ground
  col += uWireCol * smoothstep(50.0, 0.0, abs(vW.x - uScan)) * uScanA;
  gl_FragColor = vec4(fogged(col, vDepth), 1.0);
}`;

const CITY_VS = `
attribute vec3 aPos; attribute vec2 aUV; attribute vec2 aSize; attribute vec3 aNorm; attribute vec4 aB; attribute vec3 aC; attribute vec2 aE;
uniform mat4 uMVP; uniform float uT; uniform float uMode; uniform float uScan;
varying vec3 vW; varying vec2 vUV; varying vec2 vSize; varying vec3 vNorm; varying vec3 vCol; varying float vRoof; varying float vWire; varying float vOff; varying float vSeed; varying float vTall; varying float vFill; varying float vDepth; varying float vGrow;
float backOut(float x) { float c = 1.6; return 1.0 + (c + 1.0) * pow(x - 1.0, 3.0) + c * pow(x - 1.0, 2.0); }
void main() {
  float g, wire, off;
  // Rings power down from the horizon inwards; the site itself (ring 4) goes last
  float os = 21.0 + aB.z * 0.8 + aB.w * 0.35;
  if (uMode < 0.5) {
    g = backOut(clamp((uT - 4.0 - aB.y) / 1.6, 0.0, 1.0));
    wire = 1.0 - smoothstep(uScan - 70.0, uScan, aPos.x);
    float flick = step(0.6, fract(sin(floor(uT * 18.0) + aB.w * 91.0) * 437.5)) * step(os - 0.35, uT) * step(uT, os);
    off = clamp(smoothstep(os, os + 0.7, uT) + flick * 0.6, 0.0, 1.0);
  } else {
    // Relight: lights on, faces back, then the towers sink into the ground
    off = 1.0 - smoothstep(0.0, 0.7, uT - aB.w * 0.5);
    wire = 1.0 - smoothstep(0.7, 1.3, uT);
    g = 1.0 - smoothstep(0.0, 1.0, clamp((uT - 1.3 - aB.y * 0.15) / 0.9, 0.0, 1.0));
  }
  g = max(g, 0.0);
  vGrow = g;
  float hNow = aB.x * g;
  // aE.x: the height this box stands on (setback tiers, spires)
  vec3 p = vec3(aPos.xy, aE.x * g + aPos.z * hNow + 0.08);
  vW = p;
  vRoof = step(0.5, aSize.y);
  vUV = vRoof > 0.5 ? aUV : vec2(aUV.x, aUV.y * hNow);
  vSize = vRoof > 0.5 ? aSize : vec2(aSize.x, hNow);
  vNorm = aNorm; vCol = aC; vWire = wire; vOff = off; vSeed = aB.w; vFill = aE.y;
  vTall = step(220.0, aB.x + aE.x);
  vec4 clip = uMVP * vec4(p, 1.0);
  vDepth = clip.w;
  gl_Position = clip;
}`;
const CITY_FS = `
precision highp float;
uniform sampler2D uPage; uniform float uT; uniform vec3 uWireCol;
varying vec3 vW; varying vec2 vUV; varying vec2 vSize; varying vec3 vNorm; varying vec3 vCol; varying float vRoof; varying float vWire; varying float vOff; varying float vSeed; varying float vTall; varying float vFill; varying float vDepth; varying float vGrow;
${HASH}
${FOG}
${PAGE_UV}
void main() {
  // Not grown yet (or sunk back): the ground shows the page untouched
  if (vOff > 0.995 || vGrow < 0.002) discard;
  float edge = min(min(vUV.x, vSize.x - vUV.x), min(vUV.y, vSize.y - vUV.y));
  vec3 col;
  if (vRoof > 0.5) {
    if (vFill > 0.5) {
      // Generated buildings: a dark roof with a few lights
      col = vec3(0.03, 0.03, 0.05) + vCol * 0.05 + vCol * step(0.93, hash(floor(vUV / 7.0) + vSeed * 7.0)) * 0.6;
    } else {
      // The site's buildings carry the real pixels of the screen
      col = texture2D(uPage, pageUV(vW.xy)).rgb * 1.1 + vCol * 0.06;
    }
    float d = length(vUV - vSize * 0.5);
    col = mix(col, vec3(1.0, 0.15, 0.1), vTall * smoothstep(3.5, 1.5, d) * step(0.5, fract(uT * 0.8 + vSeed)));
  } else {
    float light = 0.35 + 0.65 * abs(dot(vNorm, normalize(vec3(0.45, -0.55, 0.7))));
    vec2 q = vec2(vUV.x / 9.0, vUV.y / 11.0);
    vec2 cell = floor(q), f = fract(q);
    float win = step(0.22, f.x) * step(f.x, 0.78) * step(0.28, f.y) * step(f.y, 0.82);
    float lit = step(mix(0.42, 0.56, vFill), hash(cell + vSeed * 13.0 + floor(uT * 0.5 + hash(cell) * 7.0) * step(0.9, hash(cell.yx + 3.0))));
    col = vec3(0.025, 0.03, 0.05) * light + vCol * win * lit * (0.55 + 0.45 * light);
    col += vCol * smoothstep(3.0, 0.0, vSize.y - vUV.y) * 0.9;
    // Spires are too thin for windows: they glow like antennas
    if (vSize.x < 6.0) col = vCol * 0.75;
  }
  col += vCol * smoothstep(1.4, 0.0, edge) * 0.3;
  if (vWire > 0.0) {
    vec3 wire = uWireCol * smoothstep(1.7, 0.3, edge) * 1.3;
    col = mix(col, wire, vWire);
    if (vWire > 0.55 && edge > 1.7) discard;
  }
  col *= 1.0 - vOff;
  gl_FragColor = vec4(fogged(col, vDepth), 1.0);
}`;

const CAR_VS = `
attribute vec4 aLane; attribute vec4 aC;
uniform mat4 uMVP; uniform float uT; uniform float uOn; uniform float uDist;
varying vec3 vCol;
void main() {
  // aC.a: 0 for a lane along x, 1 for a lane along y
  float s = mod(aLane.w + uT * aLane.z, 5200.0) - 2600.0;
  vec3 p = aC.a < 0.5 ? vec3(s, aLane.x, aLane.y) : vec3(aLane.x, s, aLane.y);
  vec4 clip = uMVP * vec4(p, 1.0);
  gl_Position = clip;
  gl_PointSize = min(5.0 * uDist / max(clip.w, 1.0), 10.0) * uOn;
  vCol = aC.rgb * uOn * exp(-max(clip.w - 700.0, 0.0) / 3000.0);
}`;
const CAR_FS = `
precision mediump float; varying vec3 vCol;
void main() { float r = length(gl_PointCoord - 0.5); float a = 1.0 - smoothstep(0.1, 0.5, r); if (a < 0.02) discard; gl_FragColor = vec4(vCol * a, 1.0); }`;

const FOG_COLOR = [0.035, 0.018, 0.06];
const CAR_LIGHTS: RGB[] = [[1, 0.95, 0.8], [1, 0.3, 0.25], [0.3, 1, 1], [1, 0.9, 0.3], [1, 0.4, 0.9]];

/* ---------- Camera ---------- */

export interface Camera {
  rx: number;
  rz: number;
  dist: number;
  tx: number;
  ty: number;
}

export interface CityLook {
  pageA: number;
  gridA: number;
  scan: number;
  scanA: number;
  cars: number;
}

// Tilt the page into a ground, pull back while the city spreads to the horizon, fly low over the
// site, rise high to watch the scan cross the whole city, then drift while it powers down
export function cameraAt(t: number): Camera {
  const fly = span(t, 9, 17);
  return {
    rx: -0.95 * span(t, 1.2, 4) - 0.1 * span(t, 4, 9) - 0.1 * span(t, 9, 13) + 0.4 * span(t, 17, 21),
    rz: 0.25 * span(t, 1.2, 4) + 0.35 * span(t, 4, 9) + 1.35 * fly + 0.45 * span(t, 17, 21) + 0.3 * span(t, 21, 26),
    dist: DIST * (1 + 0.35 * span(t, 1.2, 4) + 0.15 * span(t, 4, 9) - 0.72 * span(t, 9, 13) + 1.8 * span(t, 17, 21) + 0.3 * span(t, 21, 26)),
    tx: -220 * span(t, 9, 11) + 440 * fly - 220 * span(t, 17, 20),
    ty: 120 * span(t, 9, 11) - 240 * fly + 120 * span(t, 17, 20),
  };
}

export function lookAt(t: number): CityLook {
  return {
    pageA: 1 - 0.85 * span(t, 17, 20.5) - 0.15 * span(t, 23, 25),
    // The grid of the ground appears as the page tilts, so the switch to the 3D scene shows nothing
    gridA: span(t, 1.2, 3) + 0.6 * span(t, 17, 18) - 1.6 * span(t, 23.5, 25.5),
    scan: -2700 + 5400 * clamp((t - 17) / 3.5, 0, 1),
    scanA: span(t, 16.8, 17.3) * (1 - span(t, 20.2, 20.8)),
    cars: span(t, 8.5, 10) * (1 - span(t, 16.5, 17.5)),
  };
}

// Column-major matrices
type Mat = number[];
function mul(a: Mat, b: Mat): Mat {
  const o: Mat = new Array(16).fill(0);
  for (let c = 0; c < 4; c += 1) {
    for (let r = 0; r < 4; r += 1) {
      let s = 0;
      for (let i = 0; i < 4; i += 1) s += (a[i * 4 + r] ?? 0) * (b[c * 4 + i] ?? 0);
      o[c * 4 + r] = s;
    }
  }
  return o;
}
const rotX = (a: number): Mat => [1, 0, 0, 0, 0, Math.cos(a), Math.sin(a), 0, 0, -Math.sin(a), Math.cos(a), 0, 0, 0, 0, 1];
const rotZ = (a: number): Mat => [Math.cos(a), Math.sin(a), 0, 0, -Math.sin(a), Math.cos(a), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
const translate = (x: number, y: number, z: number): Mat => [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1];
function perspective(aspect: number): Mat {
  const f = 1 / Math.tan(FOV / 2);
  const near = 5;
  const far = 20000;
  return [f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) / (near - far), -1, 0, 0, (2 * far * near) / (near - far), 0];
}

/* ---------- The city ---------- */

export interface City {
  buildings: number;
  // In world units, which are about pixels: half of it reads as metres
  tallest: number;
  // Sorted start of growth of every building, from 4 s
  growDelays: number[];
  draw: (t: number, mode: 0 | 1, cam: Camera, look: CityLook) => void;
  dispose: () => void;
}

interface Program {
  pr: WebGLProgram;
  a: Record<string, number>;
  u: Record<string, WebGLUniformLocation | null>;
}

// palette: neon tints of the generated city, from the theme; grid, street and wire colours too.
// Null when WebGL is missing or fails.
export function createCity(canvas: HTMLCanvasElement, screen: HTMLCanvasElement, sites: Footprint[], colors: { palette: RGB[]; grid: RGB; street: RGB; wire: RGB }): City | null {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const u = 800 / H;
  const PW = W * u;
  const gl = canvas.getContext('webgl', { antialias: true, alpha: false });
  if (!gl) return null;

  function compile(type: number, source: string): WebGLShader {
    const shader = gl?.createShader(type);
    if (!gl || !shader) throw new Error('shader');
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) ?? 'shader');
    return shader;
  }
  function program(vs: string, fs: string, attributes: string[], uniforms: string[]): Program {
    const pr = gl?.createProgram();
    if (!gl || !pr) throw new Error('program');
    gl.attachShader(pr, compile(gl.VERTEX_SHADER, vs));
    gl.attachShader(pr, compile(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(pr) ?? 'program');
    const out: Program = { pr, a: {}, u: {} };
    attributes.forEach((name) => { out.a[name] = gl.getAttribLocation(pr, name); });
    uniforms.forEach((name) => { out.u[name] = gl.getUniformLocation(pr, name); });
    return out;
  }

  let P: Record<'sky' | 'ground' | 'city' | 'car', Program>;
  try {
    P = {
      sky: program(SKY_VS, SKY_FS, ['aP'], []),
      ground: program(GROUND_VS, GROUND_FS, ['aPos'], ['uMVP', 'uPage', 'uPageA', 'uGridA', 'uScan', 'uScanA', 'uFog', 'uPageSize', 'uGridCol', 'uStreetCol', 'uWireCol']),
      city: program(CITY_VS, CITY_FS, ['aPos', 'aUV', 'aSize', 'aNorm', 'aB', 'aC', 'aE'], ['uMVP', 'uT', 'uMode', 'uScan', 'uPage', 'uFog', 'uPageSize', 'uWireCol']),
      car: program(CAR_VS, CAR_FS, ['aLane', 'aC'], ['uMVP', 'uT', 'uOn', 'uDist']),
    };
  } catch {
    return null;
  }

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  try {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, screen);
  } catch {
    return null;
  }
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  // 19 floats per vertex: position 3, uv 2, size 2, normal 3, B 4 (height, delay, ring, seed),
  // colour 3, E 2 (height it stands on, generated or not)
  const v: number[] = [];
  const push = (...values: number[]) => { for (const value of values) v.push(value); };
  const quad = (pts: number[][], uvs: number[][], size: number[], norm: number[], B: number[], col: RGB, E: number[]) => {
    [0, 1, 2, 0, 2, 3].forEach((i) => push(...(pts[i] ?? []), ...(uvs[i] ?? []), ...size, ...norm, ...B, ...col, ...E));
  };
  // A box: roof and four walls, standing on height z0
  function addBox(x0: number, y0: number, x1: number, y1: number, z0: number, B: number[], col: RGB, filler: boolean) {
    const w = x1 - x0;
    const d = y1 - y0;
    const E = [z0, filler ? 1 : 0];
    quad([[x0, y0, 1], [x1, y0, 1], [x1, y1, 1], [x0, y1, 1]], [[0, d], [w, d], [w, 0], [0, 0]], [w, d], [0, 0, 1], B, col, E);
    quad([[x0, y0, 0], [x1, y0, 0], [x1, y0, 1], [x0, y0, 1]], [[0, 0], [w, 0], [w, 1], [0, 1]], [w, 0], [0, -1, 0], B, col, E);
    quad([[x1, y1, 0], [x0, y1, 0], [x0, y1, 1], [x1, y1, 1]], [[0, 0], [w, 0], [w, 1], [0, 1]], [w, 0], [0, 1, 0], B, col, E);
    quad([[x0, y1, 0], [x0, y0, 0], [x0, y0, 1], [x0, y1, 1]], [[0, 0], [d, 0], [d, 1], [0, 1]], [d, 0], [-1, 0, 0], B, col, E);
    quad([[x1, y0, 0], [x1, y1, 0], [x1, y1, 1], [x1, y0, 1]], [[0, 0], [d, 0], [d, 1], [0, 1]], [d, 0], [1, 0, 0], B, col, E);
  }
  const dimColor = (): RGB => {
    const c = colors.palette[Math.floor(Math.random() * colors.palette.length)] ?? [0, 1, 1];
    const k = rand(0.45, 0.85);
    return [c[0] * k, c[1] * k, c[2] * k];
  };
  let tallest = 0;
  let buildings = 0;
  const growDelays: number[] = [];

  // 1. The site: one building per footprint, in page units (ring 4: the last to power down)
  const taken = sites.map((f) => ({
    x: f.x * u, y: f.y * u, w: f.w * u, h: f.h * u,
  }));
  sites.forEach((f, i) => {
    const b = taken[i];
    if (!b) return;
    const x0 = b.x - PW / 2;
    const y1 = 400 - b.y;
    // Height grows with the element's size; the letters of a title make the tallest towers
    let height = clamp(14 + Math.sqrt(b.w * b.h) * rand(0.7, 1.6), 24, 240);
    if (f.letter) height = Math.min(340, height * 1.9);
    tallest = Math.max(tallest, height);
    const delay = (Math.hypot(b.x + b.w / 2 - PW / 2, b.y + b.h / 2 - 400) / 900) * 2.4 + rand(0, 0.5);
    addBox(x0, y1 - b.h, x0 + b.w, y1, 0, [height, delay, 4, Math.random()], f.color, false);
    buildings += 1;
    growDelays.push(delay);
  });

  // 2. Low-rise fill in the empty parts of the screen, never over an element
  const free = (x: number, y: number, w: number, h: number) => !taken.some((b) => x < b.x + b.w + 8 && x + w > b.x - 8 && y < b.y + b.h + 8 && y + h > b.y - 8);
  for (let y = 70; y < 800 - 34; y += 34) {
    for (let x = 22; x < PW - 34; x += 34) {
      if (Math.random() < 0.3) continue;
      const w = rand(16, 28);
      const h = rand(16, 28);
      const px = x + rand(0, 6);
      const py = y + rand(0, 6);
      if (!free(px, py, w, h)) continue;
      const x0 = px - PW / 2;
      const y1 = 400 - py;
      const delay = 0.6 + (Math.hypot(px - PW / 2, py - 400) / 900) * 2.4 + rand(0, 0.6);
      addBox(x0, y1 - h, x0 + w, y1, 0, [rand(8, 44), delay, 3, Math.random()], dimColor(), true);
      buildings += 1;
      growDelays.push(delay);
    }
  }

  // 3. The city around the screen, block by block: low next to the site, skyscrapers further out,
  // lower again toward the horizon
  const PITCH = 150;
  const extX = PW / 2 + 1910;
  const extY = 1800;
  for (let gx = -Math.ceil(extX / PITCH) * PITCH; gx < extX; gx += PITCH) {
    for (let gy = -Math.ceil(extY / PITCH) * PITCH; gy < extY; gy += PITCH) {
      const bx0 = gx + 15;
      const by0 = gy + 15;
      const bx1 = gx + PITCH - 15;
      const by1 = gy + PITCH - 15;
      if (bx1 > -PW / 2 - 60 && bx0 < PW / 2 + 60 && by1 > -460 && by0 < 460) continue;
      const cx = (bx0 + bx1) / 2;
      const cy = (by0 + by1) / 2;
      const de = Math.hypot(Math.max(0, Math.abs(cx) - PW / 2), Math.max(0, Math.abs(cy) - 400));
      const ring = de > 1500 ? 0 : de > 900 ? 1 : de > 400 ? 2 : 3;
      const r = Math.random();
      let lots: number[][];
      if (r < 0.3) lots = [[bx0, by0, bx1, by1]];
      else if (r < 0.5) lots = [[bx0, by0, cx - 3, by1], [cx + 3, by0, bx1, by1]];
      else if (r < 0.7) lots = [[bx0, by0, bx1, cy - 3], [bx0, cy + 3, bx1, by1]];
      else lots = [[bx0, by0, cx - 3, cy - 3], [cx + 3, by0, bx1, cy - 3], [bx0, cy + 3, cx - 3, by1], [cx + 3, cy + 3, bx1, by1]];
      for (const [lx0 = 0, ly0 = 0, lx1 = 0, ly1 = 0] of lots) {
        const ins = rand(3, 9);
        let x0 = lx0 + ins;
        let y0 = ly0 + ins;
        let x1 = lx1 - ins;
        let y1 = ly1 - ins;
        let height: number;
        if (de < 260) height = rand(26, 100);
        else if (de < 1150) height = rand(60, 250) * (Math.random() < 0.14 ? 2.1 : 1);
        else height = rand(30, 170) * (1 - Math.min(0.65, (de - 1150) / 2600));
        const delay = 0.8 + (Math.hypot(cx, cy) / 2600) * 4.2 + rand(0, 0.6);
        const col = dimColor();
        const seed = Math.random();
        addBox(x0, y0, x1, y1, 0, [height, delay, ring, seed], col, true);
        buildings += 1;
        growDelays.push(delay);
        // Setbacks: narrower tiers on the tall ones, and a spire on the tallest
        let z = height;
        for (let tier = 0; tier < 2 && z > 150 && Math.random() < 0.6; tier += 1) {
          const sx = (x1 - x0) * rand(0.14, 0.26);
          const sy = (y1 - y0) * rand(0.14, 0.26);
          x0 += sx;
          x1 -= sx;
          y0 += sy;
          y1 -= sy;
          const th = z * rand(0.25, 0.6);
          addBox(x0, y0, x1, y1, z, [th, delay + 0.25 * (tier + 1), ring, seed], col, true);
          z += th;
        }
        if (z > 300) {
          const sx = (x0 + x1) / 2;
          const sy = (y0 + y1) / 2;
          const sh = rand(30, 80);
          addBox(sx - 2, sy - 2, sx + 2, sy + 2, z, [sh, delay + 0.6, ring, seed], [1, 0.35, 0.3], true);
          z += sh;
        }
        tallest = Math.max(tallest, z);
      }
    }
  }
  growDelays.sort((a, b) => a - b);
  const cityCount = v.length / 19;

  const buffers = {
    sky: gl.createBuffer(), ground: gl.createBuffer(), city: gl.createBuffer(), car: gl.createBuffer(),
  };
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.sky);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.city);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v), gl.STATIC_DRAW);
  const s = 4200;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.ground);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-s, -s, s, -s, s, s, -s, -s, s, s, -s, s]), gl.STATIC_DRAW);
  // Flying cars on lanes in both directions, at several altitudes
  const cars: number[] = [];
  for (let i = 0; i < CARS; i += 1) {
    const axis = Math.random() < 0.5 ? 0 : 1;
    const light = CAR_LIGHTS[Math.floor(Math.random() * CAR_LIGHTS.length)] ?? [1, 1, 1];
    cars.push(axis ? rand(-extX + 50, extX - 50) : rand(-1700, 1700), rand(60, 420), (Math.random() < 0.5 ? -1 : 1) * rand(120, 300), rand(0, 5200), ...light, axis);
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.car);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cars), gl.STATIC_DRAW);

  // Drawing buffer: the screen at the device's resolution, within what a GPU handles easily
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.max(1, Math.round(Math.min(W * dpr, 2560)));
  canvas.height = Math.round((canvas.width * H) / W);
  const projection = perspective(W / H);

  function attrib(location: number | undefined, size: number, stride: number, offset: number) {
    if (!gl || location === undefined || location < 0) return;
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, stride, offset);
  }
  function detach(prog: Program) {
    Object.values(prog.a).forEach((location) => { if (location >= 0) gl?.disableVertexAttribArray(location); });
  }

  return {
    buildings,
    tallest,
    growDelays,
    draw(t, mode, cam, look) {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      // Perspective · distance · tilt · turn around the city's vertical axis · look-at point
      const M = new Float32Array(mul(projection, mul(translate(0, 0, -cam.dist), mul(rotX(cam.rx), mul(rotZ(cam.rz), translate(-cam.tx, -cam.ty, 0))))));
      gl.disable(gl.BLEND);
      gl.disable(gl.CULL_FACE);
      // Sky behind everything
      gl.disable(gl.DEPTH_TEST);
      gl.depthMask(false);
      gl.useProgram(P.sky.pr);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.sky);
      attrib(P.sky.a.aP, 2, 8, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      detach(P.sky);
      gl.enable(gl.DEPTH_TEST);
      gl.depthMask(true);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      // Ground
      const G = P.ground;
      gl.useProgram(G.pr);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.ground);
      attrib(G.a.aPos, 2, 8, 0);
      gl.uniformMatrix4fv(G.u.uMVP ?? null, false, M);
      gl.uniform1i(G.u.uPage ?? null, 0);
      gl.uniform3fv(G.u.uFog ?? null, FOG_COLOR);
      gl.uniform2f(G.u.uPageSize ?? null, PW, 800);
      gl.uniform3fv(G.u.uGridCol ?? null, colors.grid);
      gl.uniform3fv(G.u.uStreetCol ?? null, colors.street);
      gl.uniform3fv(G.u.uWireCol ?? null, colors.wire);
      gl.uniform1f(G.u.uPageA ?? null, look.pageA);
      gl.uniform1f(G.u.uGridA ?? null, look.gridA);
      gl.uniform1f(G.u.uScan ?? null, look.scan);
      gl.uniform1f(G.u.uScanA ?? null, look.scanA);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      detach(G);
      // Buildings
      const C = P.city;
      gl.useProgram(C.pr);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.city);
      attrib(C.a.aPos, 3, 76, 0);
      attrib(C.a.aUV, 2, 76, 12);
      attrib(C.a.aSize, 2, 76, 20);
      attrib(C.a.aNorm, 3, 76, 28);
      attrib(C.a.aB, 4, 76, 40);
      attrib(C.a.aC, 3, 76, 56);
      attrib(C.a.aE, 2, 76, 68);
      gl.uniformMatrix4fv(C.u.uMVP ?? null, false, M);
      gl.uniform1i(C.u.uPage ?? null, 0);
      gl.uniform3fv(C.u.uFog ?? null, FOG_COLOR);
      gl.uniform2f(C.u.uPageSize ?? null, PW, 800);
      gl.uniform3fv(C.u.uWireCol ?? null, colors.wire);
      gl.uniform1f(C.u.uT ?? null, t);
      gl.uniform1f(C.u.uMode ?? null, mode);
      gl.uniform1f(C.u.uScan ?? null, look.scan);
      gl.drawArrays(gl.TRIANGLES, 0, cityCount);
      detach(C);
      // Flying cars, glowing on top
      if (look.cars > 0.01) {
        const K = P.car;
        gl.useProgram(K.pr);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE);
        gl.depthMask(false);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.car);
        attrib(K.a.aLane, 4, 32, 0);
        attrib(K.a.aC, 4, 32, 16);
        gl.uniformMatrix4fv(K.u.uMVP ?? null, false, M);
        gl.uniform1f(K.u.uT ?? null, t);
        gl.uniform1f(K.u.uOn ?? null, look.cars);
        gl.uniform1f(K.u.uDist ?? null, DIST);
        gl.drawArrays(gl.POINTS, 0, CARS);
        detach(K);
        gl.depthMask(true);
      }
    },
    dispose() {
      Object.values(buffers).forEach((buffer) => gl.deleteBuffer(buffer));
      gl.deleteTexture(texture);
      Object.values(P).forEach((prog) => gl.deleteProgram(prog.pr));
      // Frees the GPU now rather than whenever the canvas is collected
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
}
