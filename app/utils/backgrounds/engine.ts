// Runs the animated section backgrounds (CyberpunkBackground.vue). Each one draws on a canvas the
// size of the screen; a single animation loop draws the backgrounds on screen, and pauses when
// the tab is hidden. Colours come from the theme variables and follow theme changes. With reduced
// motion, a background shows one still image. Browser-only.
import { prefersReducedMotion } from '../motion';
import { type Focus, readColors, type Stage } from './core';
import { SCENES, type SceneName } from './scenes';

interface Running extends Stage {
  scene: (typeof SCENES)[SceneName];
  playing: boolean;
  visible: boolean;
  // The scene is set up the first time its section comes near the screen
  ready: boolean;
  target: HTMLElement;
  resizeObserver: ResizeObserver;
  onMove: (event: PointerEvent) => void;
  onLeave: () => void;
}

export interface BackgroundOptions {
  scene: SceneName;
  focus: Focus;
  lang: 'fr' | 'en';
  // Element that follows the pointer: the section, as the content covers the canvas
  pointer: HTMLElement;
}

export interface Background {
  setFocus(focus: Focus): void;
  setLang(lang: 'fr' | 'en'): void;
  destroy(): void;
}

// Frames drawn ahead when a still scene starts (reduced motion), so that its one image has
// some life in it. A playing scene only draws its first frame.
const STILL_PRIMING_FRAMES = 40;
// How far from the screen a scene gets set up and starts playing
const NEAR = '300px 0px';

const running: Running[] = [];
let frame = 0;
let last = 0;
let visibility: IntersectionObserver | null = null;
let themeWatch: MutationObserver | null = null;

// New size: the canvas follows its box and the scene starts again for it
function resize(s: Running) {
  const box = s.el.getBoundingClientRect();
  if (!box.width || !box.height) return;
  s.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  s.w = box.width;
  s.h = box.height;
  s.canvas.width = Math.round(box.width * s.dpr);
  s.canvas.height = Math.round(box.height * s.dpr);
  s.ctx.setTransform(s.dpr, 0, 0, s.dpr, 0, 0);
  s.c = readColors(s.el);
  s.st = s.scene.init(s);
  s.ready = true;
  for (let i = 0; i < (s.playing ? 1 : STILL_PRIMING_FRAMES); i += 1) {
    s.t += 1 / 30;
    s.scene.frame(s, 1 / 30);
  }
}

// New theme: new colours, and a few frames so that a still background shows them too
function refresh(s: Running) {
  if (!s.ready) return;
  s.c = readColors(s.el);
  for (let i = 0; i < (s.playing ? 1 : 14); i += 1) s.scene.frame(s, 1 / 30);
}

function loop(now: number) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  if (!document.hidden) {
    running.forEach((s) => {
      if (!s.visible || !s.playing || !s.ready) return;
      const ease = 1 - Math.exp(-dt * 4);
      s.mx += ((s.pin ? s.px : 0.5) - s.mx) * ease;
      s.my += ((s.pin ? s.py : 0.5) - s.my) * ease;
      s.t += dt;
      s.scene.frame(s, dt);
    });
  }
  frame = requestAnimationFrame(loop);
}

export function mountBackground(el: HTMLElement, canvas: HTMLCanvasElement, options: BackgroundOptions): Background {
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  // Near the screen: the scene plays, and is set up the first time. The sections further down
  // cost nothing until the visitor scrolls to them.
  visibility ??= new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const s = running.find((item) => item.el === entry.target);
      if (!s) return;
      s.visible = entry.isIntersecting;
      if (s.visible && !s.ready) resize(s);
    });
  }, { rootMargin: NEAR });
  themeWatch ??= new MutationObserver(() => requestAnimationFrame(() => running.forEach(refresh)));
  if (!running.length) themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  const s = {
    el, canvas, ctx, w: 0, h: 0, dpr: 1, t: Math.random() * 4 + 2, st: {},
    mx: 0.5, my: 0.5, px: 0.5, py: 0.5, pin: false,
    focus: options.focus, lang: options.lang,
    scene: SCENES[options.scene],
    playing: !prefersReducedMotion(),
    visible: false,
    ready: false,
    target: options.pointer,
  } as Running;
  s.c = readColors(el);
  s.onMove = (event: PointerEvent) => {
    const box = el.getBoundingClientRect();
    s.px = (event.clientX - box.left) / box.width;
    s.py = (event.clientY - box.top) / box.height;
    s.pin = true;
  };
  s.onLeave = () => { s.pin = false; };
  s.target.addEventListener('pointermove', s.onMove);
  s.target.addEventListener('pointerleave', s.onLeave);
  // Only a real change of size starts the scene again (not the observer's first report)
  s.resizeObserver = new ResizeObserver(() => {
    if (!s.ready) return;
    const box = el.getBoundingClientRect();
    if (box.width !== s.w || box.height !== s.h) resize(s);
  });
  s.resizeObserver.observe(el);
  visibility.observe(el);
  running.push(s);
  if (!frame) {
    last = performance.now();
    frame = requestAnimationFrame(loop);
  }

  return {
    setFocus(focus) {
      s.focus = focus;
      if (s.ready) resize(s);
    },
    setLang(lang) {
      s.lang = lang;
      if (!s.playing) refresh(s);
    },
    destroy() {
      const index = running.indexOf(s);
      if (index >= 0) running.splice(index, 1);
      visibility?.unobserve(el);
      s.resizeObserver.disconnect();
      s.target.removeEventListener('pointermove', s.onMove);
      s.target.removeEventListener('pointerleave', s.onLeave);
      if (!running.length) {
        cancelAnimationFrame(frame);
        frame = 0;
        themeWatch?.disconnect();
      }
    },
  };
}
