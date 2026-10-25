<template>
  <!-- In #cyberpunkroot, next to the page: the page can bulge and shake without taking this along,
       and the theme colours still apply to the copies in the shards -->
  <Teleport to="#cyberpunkroot">
    <div ref="stage" class="pointer-events-none fixed inset-0 z-[60]" aria-hidden="true" inert>
      <!-- The dead LCD panel behind the glass; isolated, so its lines stay under the shards -->
      <div v-if="lcdShown" class="lcd absolute inset-0 isolate overflow-hidden transition-opacity duration-1000" :class="{ 'opacity-0': lcdFading }">
        <i
          v-for="line in lcdLines"
          :key="line.x"
          class="absolute inset-y-0 z-[2]"
          :style="{ left: `${line.x}px`, width: `${line.w}px`, background: line.color, opacity: line.opacity }"
        />
        <div class="lcd-leak absolute inset-0 z-[1]">
          <span
            v-for="(blot, i) in blots"
            :key="i"
            class="lcd-blot absolute"
            :class="{ leaking }"
            :style="{ left: `${blot.x}px`, top: `${blot.y}px`, '--blot-scale': blot.scale, '--blot-delay': `${i * 0.9}s` }"
          />
        </div>
      </div>
      <div v-if="blackout" class="absolute inset-0 bg-black"/>
      <div ref="shardLayer" class="absolute inset-0"/>
      <canvas ref="canvas" class="absolute inset-0 size-full"/>
    </div>

    <div
      v-if="gaugeShown"
      class="terminal-font fixed left-7 top-20 z-[70] w-[21rem] border border-red-500 bg-black/80 px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-red-400"
      aria-hidden="true"
    >
      {{ isEnglish ? 'Pressure on the panel' : 'Pression sur la dalle' }}
      <b class="float-right tabular-nums text-white">{{ pressureLabel }}</b>
      <span class="relative mt-2 block h-1.5 bg-red-950">
        <span class="block h-full bg-gradient-to-r from-primary to-red-500" :style="{ width: `${(pressure / 9.8) * 100}%` }"/>
        <!-- Breaking point: 7.5 bar -->
        <span class="absolute -inset-y-1 left-[76.5%] w-0.5 bg-white"/>
      </span>
    </div>

    <template v-if="rewinding">
      <div class="scanlines pointer-events-none fixed inset-0 z-[70]"/>
      <p class="terminal-font rewind-label fixed left-8 top-7 z-[70] text-[22px] font-bold tracking-[0.08em] text-white" aria-hidden="true">
        ◀◀ {{ isEnglish ? 'REWIND' : 'REMBOBINAGE' }}
      </p>
    </template>

    <div ref="flash" class="pointer-events-none fixed inset-0 z-[75] bg-white opacity-0" aria-hidden="true"/>

    <button
      v-if="phase !== 'confirm'"
      ref="muteButton"
      type="button"
      class="terminal-font fixed right-7 top-20 z-[80] border border-primary/60 bg-bg/90 px-3 py-2 text-xs uppercase tracking-wider text-primary transition-colors hover:border-primary"
      :aria-pressed="!muted"
      @click="toggleMute"
    >
      {{ muted ? (isEnglish ? 'Sound off' : 'Son coupé') : (isEnglish ? 'Sound on' : 'Son activé') }}
    </button>

    <!-- Confirmation -->
    <div v-if="dialogShown" ref="backdrop" class="fixed inset-0 z-[80] grid place-items-center bg-black/70">
      <div
        ref="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="fracture-title"
        class="w-[37.5rem] max-w-[calc(100vw-2rem)] border-2 border-red-500 bg-black px-9 py-8 text-white shadow-[0_0_40px_rgb(239_68_68/0.3)]"
      >
        <p class="terminal-font text-[13px] font-semibold uppercase tracking-[0.16em] text-red-400">
          {{ isEnglish ? 'Self-destruct protocol' : 'Protocole d\'auto-destruction' }}
        </p>
        <h2 id="fracture-title" class="mb-4 mt-2.5 text-[2rem] font-extrabold uppercase leading-tight tracking-wide text-red-500">
          {{ isEnglish ? 'Overload the panel?' : 'Surcharger la dalle ?' }}
        </h2>
        <ul>
          <li class="terminal-font flex justify-between gap-5 border-b border-neutral-800 py-1.5 text-sm text-neutral-200">
            <span>{{ isEnglish ? 'Glass' : 'Verre' }}</span>
            <span class="font-semibold text-green-400">{{ isEnglish ? 'tempered, 4 mm' : 'trempé, 4 mm' }}</span>
          </li>
          <li class="terminal-font flex justify-between gap-5 border-b border-neutral-800 py-1.5 text-sm text-neutral-200">
            <span>{{ isEnglish ? 'Current pressure' : 'Pression actuelle' }}</span>
            <span class="font-semibold text-green-400">{{ isEnglish ? '1.0 bar' : '1,0 bar' }}</span>
          </li>
          <li class="terminal-font flex justify-between gap-5 border-b border-neutral-800 py-1.5 text-sm text-neutral-200">
            <span>{{ isEnglish ? 'Breaking point' : 'Seuil de rupture' }}</span>
            <span class="font-semibold text-red-500">{{ isEnglish ? '7.5 bar' : '7,5 bar' }}</span>
          </li>
        </ul>
        <p class="mt-4 text-sm text-red-400">
          {{ isEnglish ? '1 white flash when it bursts.' : '1 flash blanc à l\'éclatement.' }}
        </p>
        <div class="mt-6 flex justify-end gap-3.5">
          <button
            ref="cancelButton"
            type="button"
            class="border-2 border-neutral-500 bg-neutral-800 px-5 py-3 font-semibold uppercase tracking-wider text-neutral-300 transition-colors hover:bg-neutral-700"
            :disabled="phase !== 'confirm'"
            @click="cancel"
          >
            {{ isEnglish ? 'Cancel' : 'Annuler' }}
          </button>
          <button
            ref="confirmButton"
            type="button"
            class="border-2 border-red-500 bg-black px-5 py-3 font-semibold uppercase tracking-wider text-red-500 transition-colors hover:bg-red-500/15"
            :disabled="phase !== 'confirm'"
            @click="confirm"
          >
            {{ isEnglish ? 'Overload' : 'Surcharger' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Final screen -->
    <div v-if="phase === 'final'" class="fixed inset-0 z-[80] grid place-items-center">
      <div
        ref="finalWindow"
        role="dialog"
        aria-modal="true"
        aria-labelledby="fracture-final-title"
        class="w-[32.5rem] max-w-[calc(100vw-2rem)] rounded-md border-2 border-primary bg-bg text-text shadow-[0_0_24px_rgb(var(--color-primary)/0.35)]"
      >
        <div class="flex h-11 items-center gap-2.5 border-b border-primary/40 px-3.5 text-primary">
          <span class="size-3 bg-primary" aria-hidden="true"/>
          <h2 id="fracture-final-title" class="text-sm uppercase tracking-[0.06em]">
            {{ isEnglish ? 'Panel out of order' : 'Dalle hors service' }}
          </h2>
        </div>
        <dl class="terminal-font grid grid-cols-[1fr_auto] gap-x-5 gap-y-2.5 px-6 pb-1 pt-5 text-sm">
          <dt class="text-gray-400">{{ isEnglish ? 'Shards' : 'Éclats' }}</dt>
          <dd class="text-right tabular-nums text-primary">{{ shardCount }}</dd>
          <dt class="text-gray-400">{{ isEnglish ? 'Pressure reached' : 'Pression atteinte' }}</dt>
          <dd class="text-right tabular-nums text-primary">{{ isEnglish ? '9.8 bar' : '9,8 bar' }}</dd>
          <dt class="text-gray-400">{{ isEnglish ? 'Dead pixels' : 'Pixels morts' }}</dt>
          <dd class="text-right tabular-nums text-primary">{{ deadPixels }}</dd>
        </dl>
        <button
          ref="rewindButton"
          type="button"
          class="mx-auto mb-6 mt-5 block border-2 border-primary bg-bg px-7 py-3.5 font-semibold uppercase tracking-[0.1em] text-primary transition-colors hover:bg-primary/10"
          @click="rewind"
        >
          {{ isEnglish ? 'Replace the panel' : 'Remplacer la dalle' }}
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import {
  computed, nextTick, onBeforeUnmount, onMounted, ref,
} from 'vue';

import { usePreferencesStore } from '@/stores/preferences';
import {
  createGlass, createShard, crackPath, pointAt, rayPoints, renderShard, screenTemplate, toCrack,
  type Crack, type Glass, type Point, type Shard,
} from '@/utils/fracture';
import { prefersReducedMotion } from '@/utils/motion';
import { findPage, lockScroll } from '@/utils/selfDestructScreen';
import { startClock, type SequenceClock } from '@/utils/sequenceClock';
import {
  createSfx, isMuted, setMuted, type Sfx,
} from '@/utils/sfx';

const emit = defineEmits<{ close: [] }>();

const DURATION = 24;
const RAYS = 10;
const LCD_COLORS = ['#ff00c8', '#00ffd5', '#38ff4a', '#ffffff', '#ffe100'];
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

const preferencesStore = usePreferencesStore();
const isEnglish = computed(() => preferencesStore.isEnglish);

type Phase = 'confirm' | 'run' | 'final' | 'rewind';
const phase = ref<Phase>('confirm');
const dialogShown = ref(true);
const gaugeShown = ref(false);
const pressure = ref(1);
const pressureLabel = computed(() => `${pressure.value.toFixed(1).replace('.', isEnglish.value ? '.' : ',')} bar`);
const muted = ref(isMuted());
const lcdShown = ref(false);
const lcdFading = ref(false);
const lcdLines = ref<{ x: number; w: number; color: string; opacity: number }[]>([]);
const blots = ref<{ x: number; y: number; scale: number }[]>([]);
const leaking = ref(false);
const blackout = ref(false);
const rewinding = ref(false);
const shardCount = ref(0);
const deadPixels = ref('');

const stage = ref<HTMLElement | null>(null);
const shardLayer = ref<HTMLElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
const flash = ref<HTMLElement | null>(null);
const backdrop = ref<HTMLElement | null>(null);
const dialog = ref<HTMLElement | null>(null);
const cancelButton = ref<HTMLButtonElement | null>(null);
const confirmButton = ref<HTMLButtonElement | null>(null);
const muteButton = ref<HTMLButtonElement | null>(null);
const finalWindow = ref<HTMLElement | null>(null);
const rewindButton = ref<HTMLButtonElement | null>(null);

// State of a run, outside Vue's reactivity
let clock: SequenceClock | null = null;
let sfx: Sfx | null = null;
let glass: Glass | null = null;
let page: HTMLElement | null = null;
let shards: Shard[] = [];
let pageFade: Animation | null = null;
let pageStyle = { transform: '', transformOrigin: '', visibility: '' };
let unlockScroll: (() => void) | null = null;
let opener: HTMLElement | null = null;
let reduced = false;

function toggleMute() {
  muted.value = !muted.value;
  setMuted(muted.value);
}

// No flash at all when the system asks for less motion
function flashScreen(duration: number, peak: number) {
  if (reduced) return;
  flash.value?.animate([{ opacity: 0 }, { opacity: peak, offset: 0.15 }, { opacity: 0 }], { duration, easing: 'ease-out' });
}

// The page as it was, without any shard left. Safe to call twice.
function restorePage() {
  shards.forEach((shard) => shard.el.remove());
  shards = [];
  pageFade?.cancel();
  pageFade = null;
  if (page) Object.assign(page.style, pageStyle);
  if (stage.value) stage.value.style.transform = '';
  glass?.clear();
}

function stopAll() {
  clock?.stop();
  clock = null;
  sfx?.close();
  sfx = null;
  restorePage();
  glass = null;
  page = null;
  unlockScroll?.();
  unlockScroll = null;
}

function close() {
  stopAll();
  emit('close');
  // Back to the button or the terminal that opened the sequence, without scrolling to it
  opener?.focus({ preventScroll: true });
}

function cancel() {
  if (phase.value === 'confirm') close();
}

function confirm() {
  if (phase.value !== 'confirm' || !canvas.value || !stage.value || !shardLayer.value) return;
  page = findPage();
  if (!page) {
    close();
    return;
  }
  phase.value = 'run';
  reduced = prefersReducedMotion();
  pageStyle = { transform: page.style.transform, transformOrigin: page.style.transformOrigin, visibility: page.style.visibility };
  unlockScroll = lockScroll();
  sfx = createSfx();
  glass = createGlass(canvas.value);
  clock = startClock();
  run(clock, sfx, glass, page, stage.value, shardLayer.value);
}

function run(time: SequenceClock, fx: Sfx, panel: Glass, target: HTMLElement, scene: HTMLElement, layer: HTMLElement) {
  const W = window.innerWidth;
  const H = window.innerHeight;
  // Distances were tuned on a 1280 × 800 screen: they scale with the diagonal
  const k = Math.hypot(W, H) / 1509;
  const O: Point = [rand(W * 0.39, W * 0.56), rand(H * 0.4, H * 0.55)];
  const RADII = [0, 90 * k, 220 * k, 420 * k, 1800 * k];
  let rays: Crack[] = [];
  const ringMid: Point[][] = [];
  let zoom = 1;
  let tremor = 0;
  let crackAlpha = 1;
  let glow = false;
  let lastTinkle = 0;
  let lastTick = 0;
  const shakes: { amp: number; start: number; dur: number }[] = [];
  const shake = (amp: number, dur: number) => {
    if (!reduced) shakes.push({ amp, start: time.t, dur });
  };
  const tinkle = (f: number, dur: number, gain: number, pan: number) => {
    if (time.t - lastTinkle < 0.06) return;
    lastTinkle = time.t;
    fx.noise({
      type: 'bandpass', f, q: 2, dur, gain, pan,
    });
  };

  // The dialog shrinks away, then the gauge shows the pressure building up
  time.at(0, () => {
    dialog.value?.animate([{ transform: 'none', opacity: 1 }, { transform: 'scale(.6)', opacity: 0 }], { duration: 380, easing: 'cubic-bezier(.6,0,.9,.5)', fill: 'forwards' });
    backdrop.value?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: 'forwards' });
    fx.noise({
      type: 'bandpass', f: 1200, f1: 300, dur: 0.4, gain: 0.08,
    });
  });
  time.at(0.45, () => { dialogShown.value = false; });
  time.at(0.5, () => { gaugeShown.value = true; });

  // 0.5 → 10 s: pressure, a slight bulge of the glass, a rising hum and glass creaks
  const hum = fx.drone({
    freqs: [55, 110], type: 'sawtooth', filter: 'lowpass', f: 300,
  });
  time.at(0.5, () => {
    hum.gain(0.05, 8);
    hum.freq(1.6, 9);
    hum.filter(900, 9);
  });
  time.tick((t) => {
    if (t < 0.5 || t > 10) return;
    const p = clamp((t - 0.5) / 9.5, 0, 1);
    const e = p < 0.5 ? 2 * p * p : 1 - ((-2 * p + 2) ** 2) / 2;
    pressure.value = 1 + 8.8 * e;
    if (!reduced) {
      zoom = 1 + 0.018 * e;
      tremor = e * 1.4;
    }
  });
  for (let t = 1; t < 10; t += rand(0.35, 0.9)) {
    time.at(t, () => {
      const p = (pressure.value - 1) / 8.8;
      fx.tone({
        f: rand(1800, 3800), f1: rand(1400, 4200), dur: rand(0.08, 0.25), gain: 0.015 + 0.03 * p, pan: rand(-0.8, 0.8),
      });
    });
  }

  // 3 → 6 s: stress cracks from the corners of the screen
  ([[0, 0, 0.7], [W, 0, 2.4], [0, H, -0.7], [W, H, -2.4], [W / 2, 0, 1.57]] as const).forEach(([x, y, a], i) => {
    const start = 3 + i * 0.7 + rand(0, 0.3);
    panel.cracks.push(toCrack(crackPath(x, y, a + rand(-0.3, 0.3), rand(150, 260) * k, 0.45), start, 320));
    time.at(start, () => fx.noise({
      type: 'highpass', f: 3500, dur: 0.05, gain: 0.08, pan: (x / W) * 2 - 1,
    }));
  });

  // 6.4 s: a star of cracks from the impact point, then the rings of a spider web
  time.at(6.4, () => {
    const a0 = rand(0, Math.PI * 2);
    rays = Array.from({ length: RAYS }, (_, i) => toCrack(
      crackPath(O[0], O[1], a0 + (i / RAYS) * Math.PI * 2 + rand(-0.12, 0.12), 1600 * k, 0.12, [14, 22]),
      6.4 + rand(0, 0.25),
      rand(700, 1100),
      O,
    ));
    panel.cracks.push(...rays);
    rays.forEach((ray) => {
      for (let b = 0; b < 2; b += 1) {
        const i = Math.min(ray.points.length - 2, 4 + Math.floor(Math.random() * 18));
        const p = ray.points[i];
        const q = ray.points[i + 1];
        if (!p || !q) continue;
        const angle = Math.atan2(q[1] - p[1], q[0] - p[0]) + rand(0.4, 0.8) * (Math.random() < 0.5 ? -1 : 1);
        panel.cracks.push(toCrack(crackPath(p[0], p[1], angle, rand(50, 150) * k, 0.4), ray.start + (ray.radii[i] ?? 0) / ray.speed, 400));
      }
    });
    glow = true;
    fx.noise({
      type: 'highpass', f: 2000, dur: 0.15, gain: 0.3,
    });
    fx.tone({
      f: 4200, f1: 3000, dur: 0.3, gain: 0.04,
    });
    shake(4, 0.3);
  });
  time.at(7.9, () => {
    RADII.slice(1, 4).forEach((radius, j) => {
      const mids: Point[] = [];
      for (let i = 0; i < RAYS; i += 1) {
        const ray = rays[i];
        const next = rays[(i + 1) % RAYS];
        if (!ray || !next) continue;
        const A = pointAt(ray, radius);
        const B = pointAt(next, radius);
        const mid: Point = [O[0] + ((A[0] + B[0]) / 2 - O[0]) * 0.94, O[1] + ((A[1] + B[1]) / 2 - O[1]) * 0.94];
        mids.push(mid);
        panel.cracks.push(toCrack([A, mid, B], 8 + j * 0.45 + rand(0, 0.3), 700));
      }
      ringMid[j + 1] = mids;
      time.at(8 + j * 0.45, () => {
        fx.noise({
          type: 'highpass', f: 2500, dur: 0.1, gain: 0.15,
        });
        shake(2, 0.2);
      });
    });
  });

  // 10 s: the glass bursts. Shards carry copies of the screen as it is now, then the page hides
  // behind the dead panel.
  time.at(10, () => {
    zoom = 1;
    tremor = 0;
    target.style.transform = pageStyle.transform;
    target.style.transformOrigin = pageStyle.transformOrigin;
    scene.style.transform = '';
    flashScreen(300, 0.85);
    shake(14, 0.7);
    hum.gain(0.0001, 0.05);
    fx.noise({
      type: 'highpass', f: 1200, dur: 0.5, gain: 0.5, attack: 0.002,
    });
    fx.noise({
      type: 'bandpass', f: 4000, q: 0.8, dur: 1.2, gain: 0.25,
    });
    fx.tone({
      f: 90, f1: 40, dur: 0.5, gain: 0.35,
    });
    for (let i = 0; i < 26; i += 1) {
      fx.noise({
        type: 'bandpass', f: rand(2500, 9000), q: rand(2, 8), dur: rand(0.04, 0.16), gain: rand(0.04, 0.12), delay: 1.6 * Math.random() ** 1.5, pan: rand(-1, 1),
      });
    }
    crackAlpha = 0;
    glow = false;

    lcdLines.value = Array.from({ length: 7 }, () => ({
      x: Math.floor(rand(40, W - 40)), w: [1, 2, 2, 3, 6][Math.floor(Math.random() * 5)] ?? 2, color: LCD_COLORS[Math.floor(Math.random() * LCD_COLORS.length)] ?? '#fff', opacity: 0.85,
    }));
    const side = Math.random() < 0.5 ? -1 : 1;
    blots.value = [
      { x: O[0], y: O[1], scale: 15 * k },
      { x: O[0] + side * rand(170, 240) * k, y: O[1] + rand(-140, 140) * k, scale: 9 * k },
      { x: O[0] - side * rand(120, 200) * k, y: O[1] + rand(80, 180) * k, scale: 7 * k },
    ];
    lcdShown.value = true;

    if (reduced) {
      pageFade = target.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 600, fill: 'forwards' });
      return;
    }
    const template = screenTemplate(target);
    for (let i = 0; i < RAYS; i += 1) {
      const A = rays[i];
      const B = rays[(i + 1) % RAYS];
      if (!A || !B) continue;
      for (let j = 0; j < RADII.length - 1; j += 1) {
        const r0 = RADII[j] ?? 0;
        const r1 = RADII[j + 1] ?? 0;
        const outer = ringMid[j + 1]?.[i];
        const inner = j > 0 ? ringMid[j]?.[i] : undefined;
        const poly: Point[] = [...rayPoints(A, r0, r1), ...(outer ? [outer] : []), ...rayPoints(B, r0, r1).reverse(), ...(inner ? [inner] : [])];
        const shard = createShard(layer, template, poly, j);
        const dist = Math.hypot(shard.cx - O[0], shard.cy - O[1]) || 1;
        const dx = (shard.cx - O[0]) / dist;
        const dy = (shard.cy - O[1]) / dist;
        const boost = j === 0 ? 2 : 1;
        Object.assign(shard, {
          vx: dx * rand(80, 260) * boost,
          vy: dy * rand(80, 260) - rand(0, 80),
          va: rand(-2.2, 2.2) * boost,
          tumble: rand(1.5, 4.5),
          start: 10 + dist / (1600 * k) + rand(0, 0.12) + (j === RADII.length - 2 ? rand(0.1, 0.5) : 0),
        });
        shards.push(shard);
      }
    }
    // Two shards hang on at the top edge a little longer
    shards.filter((shard) => shard.ring === RADII.length - 2).sort((a, b) => a.cy - b.cy).slice(0, 2)
      .forEach((shard, i) => { shard.start = i ? 16.5 : 14; });
    shardCount.value = shards.length;
    target.style.visibility = 'hidden';
    panel.sparkle(O[0], O[1], 220, [200, 700], 150);
  });

  // The dead panel: an ink leak spreads, coloured lines flicker, an electric buzz
  time.at(11, () => { leaking.value = true; });
  const buzz = fx.drone({
    freqs: [50, 100.5], type: 'sawtooth', filter: 'lowpass', f: 400,
  });
  time.at(11, () => buzz.gain(0.04, 1));
  for (let t = 11.3; t < 20; t += rand(0.15, 0.7)) {
    time.at(t, () => fx.noise({
      type: 'highpass', f: 1500, dur: rand(0.02, 0.05), gain: 0.05, pan: rand(-0.7, 0.7),
    }));
  }
  for (let i = 0; i < 7; i += 1) {
    time.at(18 + i * 0.45, () => {
      lcdLines.value = lcdLines.value.slice(1);
      fx.tone({
        type: 'square', f: 120, dur: 0.04, gain: 0.05,
      });
    });
  }
  time.at(21, () => buzz.gain(0.0001, 0.4));
  time.at(21.5, () => { lcdFading.value = true; });
  time.at(23.2, () => { gaugeShown.value = false; });
  time.at(DURATION, showFinal);

  time.tick((t, dt) => {
    // Shake and bulge: the page and the cracks move together
    if (!reduced) {
      let amp = tremor;
      for (let i = shakes.length - 1; i >= 0; i -= 1) {
        const s = shakes[i];
        if (!s) continue;
        const p = (t - s.start) / s.dur;
        if (p >= 1) shakes.splice(i, 1);
        else amp += s.amp * (1 - p);
      }
      const move = amp < 0.15 ? '' : `translate(${rand(-amp, amp).toFixed(1)}px, ${rand(-amp, amp).toFixed(1)}px)`;
      const bulge = zoom > 1.0005 ? ` scale(${zoom.toFixed(4)})` : '';
      const value = `${move}${bulge}`.trim();
      scene.style.transform = value;
      if (t < 10) {
        target.style.transformOrigin = `50% ${H / 2}px`;
        target.style.transform = value || pageStyle.transform;
      }
    }
    if (t - lastTick > 0.08 && lcdLines.value.length) {
      lastTick = t;
      lcdLines.value = lcdLines.value.map((line) => ({ ...line, opacity: rand(0.35, 1) }));
    }
    for (const s of shards) {
      if (s.off) continue;
      if (!s.active) {
        if (t < s.start) continue;
        s.active = true;
        if (s.ring === 0) panel.sparkle(s.cx, s.cy, 12, [60, 260], 0);
        tinkle(rand(2500, 6000), rand(0.05, 0.14), 0.08, (s.cx / W) * 2 - 1);
      }
      s.vy += 2000 * dt;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      s.a += s.va * dt;
      s.ph += s.tumble * dt;
      if (!s.floored && s.cy + s.y > H) {
        s.floored = true;
        panel.sparkle(s.cx + s.x, H - 2, 8, [80, 320], 120);
        tinkle(rand(3000, 6000), 0.12, 0.05, (s.cx / W) * 2 - 1);
      }
      if (s.cy + s.y > H + 600 * k) {
        s.off = true;
        s.el.style.display = 'none';
        continue;
      }
      renderShard(s);
    }
    panel.frame(t, dt, shards, { cracks: crackAlpha, glow: glow ? O : null });
  });
}

async function showFinal() {
  deadPixels.value = (window.innerWidth * window.innerHeight).toLocaleString(isEnglish.value ? 'en-GB' : 'fr-FR');
  phase.value = 'final';
  await nextTick();
  finalWindow.value?.animate([{ transform: 'scale(.92)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: reduced ? 0 : 350, easing: 'cubic-bezier(.2,.8,.3,1)' });
  rewindButton.value?.focus({ preventScroll: true });
}

// Rewind: the shards fly back up from below and fit together again, then the page takes over
function rewind() {
  if (phase.value !== 'final' || !page) return;
  phase.value = 'rewind';
  clock?.stop();
  sfx?.close();
  sfx = createSfx();
  clock = startClock();
  const time = clock;
  const fx = sfx;
  const target = page;
  glass?.clear();
  lcdShown.value = false;
  lcdFading.value = false;
  leaking.value = false;
  if (reduced || !shards.length) {
    pageFade?.cancel();
    pageFade = null;
    target.style.visibility = pageStyle.visibility;
    target.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 600 });
    time.at(0.8, close);
    return;
  }
  blackout.value = true;
  rewinding.value = true;
  shards.forEach((shard) => {
    Object.assign(shard, {
      x: 0, y: 0, a: 0, ph: 0, off: false,
    });
    shard.el.style.display = '';
    shard.el.style.transform = 'none';
    const delay = (3 - shard.ring) * 0.2 + rand(0, 0.2);
    shard.el.animate([
      { transform: `translate(${rand(-300, 300).toFixed(0)}px, ${rand(600, 1000).toFixed(0)}px) rotate(${rand(-2, 2).toFixed(2)}rad) scale(1, ${rand(-1, 1).toFixed(2)})` },
      { transform: 'none' },
    ], { duration: 1300, delay: delay * 1000, easing: 'cubic-bezier(.1,.6,.3,1)', fill: 'backwards' });
  });
  // A sound played backwards: it swells, then cuts
  fx.noise({
    type: 'bandpass', f: 3500, q: 0.8, dur: 1.95, gain: 0.3, attack: 1.9,
  });
  for (let i = 0; i < 18; i += 1) {
    fx.noise({
      type: 'bandpass', f: rand(2500, 8000), q: 4, dur: 0.05, gain: 0.05, delay: 1.9 * Math.sqrt(Math.random()),
    });
  }
  time.at(2.15, () => {
    flashScreen(180, 0.35);
    shards.forEach((shard) => shard.el.remove());
    shards = [];
    target.style.visibility = pageStyle.visibility;
    blackout.value = false;
    rewinding.value = false;
    fx.tone({ f: 2400, dur: 0.5, gain: 0.06 });
    fx.tone({ f: 3600, dur: 0.4, gain: 0.03 });
  });
  time.at(2.8, close);
}

// Escape cancels the confirmation; Tab stays inside the open dialog
function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && phase.value === 'confirm') {
    event.preventDefault();
    cancel();
    return;
  }
  if (event.key !== 'Tab' || phase.value === 'run' || phase.value === 'rewind') return;
  const buttons = phase.value === 'confirm' ? [cancelButton.value, confirmButton.value] : [rewindButton.value, muteButton.value];
  const focusable = buttons.filter((button): button is HTMLButtonElement => !!button && !button.disabled);
  if (!focusable.length) return;
  const index = focusable.indexOf(document.activeElement as HTMLButtonElement);
  event.preventDefault();
  focusable[(index + (event.shiftKey ? -1 : 1) + focusable.length) % focusable.length]?.focus();
}

onMounted(() => {
  opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  window.addEventListener('keydown', onKeydown);
  confirmButton.value?.focus();
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown);
  stopAll();
});
</script>

<style scoped>
/* The site's fonts have no monospace one: the system's, for the gauge and the labels */
.terminal-font {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
}

/* A dead LCD panel: dark, with its sub-pixel stripes and a faint backlight bleeding at the edges */
.lcd {
  background: #06070b;
}

.lcd::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(90deg, rgb(255 0 0 / 0.07) 0 1px, rgb(0 255 0 / 0.07) 1px 2px, rgb(0 0 255 / 0.07) 2px 3px),
    repeating-linear-gradient(0deg, rgb(0 0 0 / 0.45) 0 1px, transparent 1px 3px);
}

.lcd::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 45% 22% at 50% 100%, rgb(200 220 255 / 0.16), transparent 70%),
    radial-gradient(ellipse 18% 30% at 0% 50%, rgb(200 220 255 / 0.08), transparent 70%);
}

/* Solid black discs merged under one glow, so the leak has a single ragged edge */
.lcd-leak {
  filter: drop-shadow(0 0 10px rgb(120 0 180)) drop-shadow(0 0 24px rgb(80 0 130 / 0.8));
}

.lcd-blot {
  width: 40px;
  height: 40px;
  margin: -20px 0 0 -20px;
  border-radius: 50%;
  background: #000;
  transform: scale(0);
}

.lcd-blot.leaking {
  animation: blot-grow 9s cubic-bezier(0.3, 0, 0.6, 1) var(--blot-delay) both;
}

@keyframes blot-grow {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(var(--blot-scale));
  }
}

.scanlines {
  background: repeating-linear-gradient(0deg, rgb(0 0 0 / 0.35) 0 2px, transparent 2px 4px);
}

.rewind-label {
  text-shadow: 2px 0 rgb(255 0 128 / 0.8), -2px 0 rgb(0 255 255 / 0.8);
}

@media (prefers-reduced-motion: reduce) {
  .lcd-blot.leaking {
    animation-duration: 0.01s;
  }
}
</style>
