<template>
  <!-- In #cyberpunkroot, next to the page, so the theme colours apply -->
  <Teleport to="#cyberpunkroot">
    <!-- Without WebGL, or with less motion: the glow of the heat over the page -->
    <div
      v-if="glowShown"
      class="heat-glow pointer-events-none fixed inset-x-0 bottom-0 z-[61] mix-blend-screen transition-opacity duration-[3000ms]"
      :class="{ 'opacity-0': glowFading }"
      :style="{ height: `${glowHeight}%` }"
      aria-hidden="true"
    />

    <div class="pointer-events-none fixed inset-0 z-[60]" aria-hidden="true" inert>
      <!-- The screen in the heat, then melting in strips over molten metal, drawn in WebGL -->
      <canvas v-show="sceneShown" ref="sceneCanvas" class="absolute inset-0 size-full"/>
      <!-- Without WebGL, or with less motion: molten metal, and the screen wiped away over it -->
      <div
        v-if="lavaShown"
        class="lava absolute inset-0 transition-opacity duration-[4500ms] ease-in"
        :class="{ 'opacity-0': lavaFading }"
      />
      <div ref="wipeBox" class="absolute inset-0"/>
      <!-- Drops, molten edges, embers, ash -->
      <canvas ref="canvas" class="absolute inset-0 size-full"/>
    </div>

    <div
      v-if="thermoShown"
      class="terminal-font fixed left-7 top-20 z-[70] w-[21rem] border bg-black/80 px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] transition-opacity duration-700"
      :class="[sensorDead ? 'border-neutral-600 text-neutral-400' : 'border-red-500 text-red-400', { 'opacity-0': thermoFading }]"
      aria-hidden="true"
    >
      <template v-if="sensorDead">
        {{ isEnglish ? 'Sensor out of order' : 'Capteur hors service' }}
        <b class="float-right tabular-nums text-white">--- °C</b>
      </template>
      <template v-else>
        {{ isEnglish ? 'Temperature' : 'Température' }}
        <b class="float-right tabular-nums text-white">{{ Math.round(temperature) }} °C</b>
      </template>
      <span class="relative mt-2 block h-1.5 bg-[#1a0d0a]">
        <span class="thermo-fill block h-full" :style="{ width: sensorDead ? '0' : `${(temperature / 150) * 100}%` }"/>
        <!-- Critical threshold: 95 °C -->
        <span v-if="!sensorDead" class="absolute -inset-y-1 left-[63.3%] w-0.5 bg-white"/>
      </span>
    </div>

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

    <!-- Confirmation: the fans spin down, then it sags and melts away -->
    <div v-if="dialogShown" ref="backdrop" class="fixed inset-0 z-[80] grid place-items-center bg-black/70">
      <div
        ref="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="overheat-title"
        class="w-[37.5rem] max-w-[calc(100vw-2rem)] origin-top border-2 border-red-500 bg-black px-9 py-8 text-white shadow-[0_0_40px_rgb(239_68_68/0.3)]"
      >
        <p class="terminal-font text-[13px] font-semibold uppercase tracking-[0.16em] text-red-400">
          {{ isEnglish ? 'Self-destruct protocol' : 'Protocole d\'auto-destruction' }}
        </p>
        <h2 id="overheat-title" class="mb-4 mt-2.5 text-[2rem] font-extrabold uppercase leading-tight tracking-wide text-red-500">
          {{ isEnglish ? 'Cut the cooling?' : 'Couper le refroidissement ?' }}
        </h2>
        <ul>
          <li class="terminal-font flex justify-between gap-5 border-b border-neutral-800 py-1.5 text-sm text-neutral-200">
            <span>{{ isEnglish ? 'Fans' : 'Ventilateurs' }}</span>
            <span class="font-semibold tabular-nums" :class="fanSpeed ? 'text-green-400' : 'text-red-500'">{{ fanLabel }}</span>
          </li>
          <li class="terminal-font flex justify-between gap-5 border-b border-neutral-800 py-1.5 text-sm text-neutral-200">
            <span>{{ isEnglish ? 'Temperature' : 'Température' }}</span>
            <span class="font-semibold text-green-400">42 °C</span>
          </li>
          <li class="terminal-font flex justify-between gap-5 border-b border-neutral-800 py-1.5 text-sm text-neutral-200">
            <span>{{ isEnglish ? 'Critical threshold' : 'Seuil critique' }}</span>
            <span class="font-semibold text-red-500">95 °C</span>
          </li>
        </ul>
        <p class="mt-4 text-sm text-red-400">
          {{ isEnglish ? 'Heat distortion, no flash.' : 'Distorsion de chaleur, aucun flash.' }}
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
            data-umami-event="overheat-animation"
            @click="confirm"
          >
            {{ isEnglish ? 'Cut' : 'Couper' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Final screen -->
    <div v-if="finalShown" class="fixed inset-0 z-[80] grid place-items-center">
      <div
        ref="finalWindow"
        role="dialog"
        aria-modal="true"
        aria-labelledby="overheat-final-title"
        class="w-[32.5rem] max-w-[calc(100vw-2rem)] origin-top rounded-md border-2 border-primary bg-bg text-text shadow-[0_0_24px_rgb(var(--color-primary)/0.35)]"
      >
        <div class="flex h-11 items-center gap-2.5 border-b border-primary/40 px-3.5 text-primary">
          <span class="size-3 bg-primary" aria-hidden="true"/>
          <h2 id="overheat-final-title" class="text-sm uppercase tracking-[0.06em]">
            {{ isEnglish ? 'System melted' : 'Système fondu' }}
          </h2>
        </div>
        <dl class="terminal-font grid grid-cols-[1fr_auto] gap-x-5 gap-y-2.5 px-6 pb-1 pt-5 text-sm">
          <dt class="text-gray-400">{{ isEnglish ? 'Peak temperature' : 'Température maximale' }}</dt>
          <dd class="text-right tabular-nums text-primary">{{ PEAK }} °C</dd>
          <template v-if="meltedColumns > 1">
            <dt class="text-gray-400">{{ isEnglish ? 'Columns melted' : 'Colonnes fondues' }}</dt>
            <dd class="text-right tabular-nums text-primary">{{ meltedColumns }}</dd>
          </template>
          <dt class="text-gray-400">{{ isEnglish ? 'Fans' : 'Ventilateurs' }}</dt>
          <dd class="text-right tabular-nums text-primary">{{ isEnglish ? '0 rpm' : '0 tr/min' }}</dd>
        </dl>
        <button
          ref="coolButton"
          type="button"
          class="mx-auto mb-6 mt-5 block border-2 border-primary bg-bg px-7 py-3.5 font-semibold uppercase tracking-[0.1em] text-primary transition-colors hover:bg-primary/10"
          :disabled="phase !== 'final'"
          @click="coolDown"
        >
          {{ isEnglish ? 'Cool down and restart' : 'Refroidir et relancer' }}
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
import { screenBlocks } from '@/utils/corruption';
import { screenTemplate } from '@/utils/fracture';
import { prefersReducedMotion } from '@/utils/motion';
import {
  COLD_FILTER, COLD_GRADE, createHeat, cutStrips, dropSources, edgeAt, PEAK, slideStrip, temperatureAt, wanderingDelays, warmFilter, warmGrade,
  type DropSource, type Heat, type Strip,
} from '@/utils/overheat';
import { createMeltScene, MAX_STRIPS, type MeltScene, type SceneLook } from '@/utils/overheatScene';
import { findPage, lockScroll } from '@/utils/selfDestructScreen';
import { startClock, type SequenceClock } from '@/utils/sequenceClock';
import {
  createSfx, isMuted, setMuted, type Sfx,
} from '@/utils/sfx';

const emit = defineEmits<{ close: [] }>();

const DURATION = 25;
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

const preferencesStore = usePreferencesStore();
const isEnglish = computed(() => preferencesStore.isEnglish);

type Phase = 'confirm' | 'run' | 'final' | 'cool';
const phase = ref<Phase>('confirm');
const dialogShown = ref(true);
const fanSpeed = ref(2400);
const fanLabel = computed(() => `${fanSpeed.value.toLocaleString(isEnglish.value ? 'en-GB' : 'fr-FR')} ${isEnglish.value ? 'rpm' : 'tr/min'}`);
const thermoShown = ref(false);
const thermoFading = ref(false);
const temperature = ref(42);
const sensorDead = ref(false);
const sceneShown = ref(false);
const glowShown = ref(false);
const glowFading = ref(false);
const glowHeight = ref(0);
const lavaShown = ref(false);
const lavaFading = ref(false);
const finalShown = ref(false);
const meltedColumns = ref(0);
const muted = ref(isMuted());

const sceneCanvas = ref<HTMLCanvasElement | null>(null);
const wipeBox = ref<HTMLElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
const backdrop = ref<HTMLElement | null>(null);
const dialog = ref<HTMLElement | null>(null);
const cancelButton = ref<HTMLButtonElement | null>(null);
const confirmButton = ref<HTMLButtonElement | null>(null);
const muteButton = ref<HTMLButtonElement | null>(null);
const finalWindow = ref<HTMLElement | null>(null);
const coolButton = ref<HTMLButtonElement | null>(null);

// State of a run, outside Vue's reactivity
let clock: SequenceClock | null = null;
let sfx: Sfx | null = null;
let heatFx: Heat | null = null;
let scene: MeltScene | null = null;
let strips: Strip[] = [];
let page: HTMLElement | null = null;
// Without the WebGL scene: filters set on the page, with the value each element had before
let filtered = new Map<HTMLElement, string>();
let animations: Animation[] = [];
let pageVisibility = '';
let unlockScroll: (() => void) | null = null;
let opener: HTMLElement | null = null;
let reduced = false;

function toggleMute() {
  muted.value = !muted.value;
  setMuted(muted.value);
}

function setFilter(el: HTMLElement, value: string) {
  if (!filtered.has(el)) filtered.set(el, el.style.filter);
  el.style.filter = value;
}

function clearFilters() {
  filtered.forEach((value, el) => { el.style.filter = value; });
  filtered = new Map();
}

// The page as it was, with no scene and no copy left. Safe to call twice.
function restorePage() {
  clearFilters();
  animations.forEach((animation) => animation.cancel());
  animations = [];
  scene?.dispose();
  scene = null;
  strips = [];
  sceneShown.value = false;
  if (wipeBox.value) {
    wipeBox.value.replaceChildren();
    wipeBox.value.style.filter = '';
  }
  if (page) page.style.visibility = pageVisibility;
  glowShown.value = false;
  glowFading.value = false;
  lavaShown.value = false;
  heatFx?.clear();
}

function stopAll() {
  clock?.stop();
  clock = null;
  sfx?.close();
  sfx = null;
  restorePage();
  heatFx = null;
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
  if (phase.value !== 'confirm' || !canvas.value || !sceneCanvas.value || !wipeBox.value) return;
  page = findPage();
  if (!page) {
    close();
    return;
  }
  phase.value = 'run';
  reduced = prefersReducedMotion();
  pageVisibility = page.style.visibility;
  unlockScroll = lockScroll();
  sfx = createSfx();
  heatFx = createHeat(canvas.value);
  clock = startClock();
  run(clock, sfx, heatFx, page, sceneCanvas.value, wipeBox.value);
}

function run(time: SequenceClock, fx: Sfx, drawing: Heat, site: HTMLElement, glCanvas: HTMLCanvasElement, wipe: HTMLElement) {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const k = Math.hypot(W, H) / 1509;
  let heat = 0;
  let lastHeat = 0;
  let lastDrip = 0;
  let melting = -1;
  let sources: DropSource[] = [];
  let delays: number[] = [];

  // How the WebGL scene looks at a given time: the heat colours and shimmer from 1.6 s, rising with
  // the temperature through the melt, dying down with the glow and the molten metal once the sensor
  // has given up
  const look = (t: number): SceneLook => {
    const grade = warmGrade(heat);
    const heating = t >= 1.6 ? 1 : 0;
    const lava = clamp((t - 17) / 4.5, 0, 1);
    const shimmer = heating * heat * 26 * k * (1 - clamp((t - 17) / 4, 0, 1));
    return {
      grade: grade.matrix,
      bright: grade.bright,
      // The content alone before the melt, the whole melt with its molten metal afterwards
      shimmerContent: melting < 0 ? shimmer : 0,
      shimmerAll: melting < 0 ? 0 : shimmer,
      glow: heat * 0.7,
      glowA: heating * (1 - clamp((t - 17) / 3, 0, 1)),
      lava: melting < 0 ? 0 : 1 - lava * lava,
      ragged: melting < 0 ? 0 : 1,
    };
  };

  // 0 → 0.9 s: the fans spin down in the dialog
  time.tween(0, 0.9, (p) => { fanSpeed.value = Math.round(2400 * (1 - p)); });
  fx.noise({
    type: 'bandpass', f: 1200, f1: 120, q: 2, dur: 1.2, gain: 0.12,
  });
  time.at(0.9, () => fx.tone({
    type: 'square', f: 140, dur: 0.05, gain: 0.06,
  }));
  // 1 s: the dialog sags and melts away
  time.at(1, () => {
    dialog.value?.animate(
      reduced ? [{ opacity: 1 }, { opacity: 0 }] : [
        { transform: 'none', opacity: 1, filter: 'blur(0)' },
        { transform: 'translateY(160px) scaleY(1.7) scaleX(.92)', opacity: 0, filter: 'blur(4px)' },
      ],
      { duration: 700, easing: 'cubic-bezier(.5,0,.9,.5)', fill: 'forwards' },
    );
    backdrop.value?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 700, fill: 'forwards' });
  });
  time.at(1.75, () => { dialogShown.value = false; });

  // 0.15 s, behind the dialog: the screen becomes a WebGL scene, without anything visibly changing.
  // What drips is read now, while the page still shows.
  time.at(0.15, () => {
    if (reduced) return;
    sources = dropSources(site);
    strips = cutStrips(Math.round(clamp(W / 40, 8, MAX_STRIPS)));
    try {
      scene = createMeltScene(glCanvas, site, strips);
    } catch (error) {
      // The sequence goes on without the scene: say why, or a silent fallback is never noticed
      // eslint-disable-next-line no-console
      console.warn('Overheat: WebGL scene unavailable, simple fallback used.', error);
      scene = null;
    }
    if (!scene) {
      strips = [];
      return;
    }
    scene.draw(time.t, strips, look(time.t));
    sceneShown.value = true;
    site.style.visibility = 'hidden';
  });

  // 1.6 s: the heat starts to show (without the scene: warm colours on the page and the glow)
  const blocks = screenBlocks(site);
  time.at(1.6, () => {
    thermoShown.value = true;
    if (!scene) glowShown.value = true;
  });

  // Sound bed: a hum that rises with the temperature, sizzling later, the clicks of the expanding
  // metal
  const hum = fx.drone({
    freqs: [60, 120.5], type: 'sawtooth', filter: 'lowpass', f: 200,
  });
  const sizzle = fx.drone({ filter: 'highpass', f: 4000 });
  time.at(1.2, () => {
    hum.gain(0.05, 4);
    hum.filter(1400, 15);
    hum.freq(1.3, 15);
  });
  time.at(6, () => sizzle.gain(0.035, 5));
  for (let t = 2; t < 11; t += rand(0.25, 0.8)) {
    time.at(t, () => {
      fx.noise({
        type: 'highpass', f: 2500, dur: 0.02, gain: 0.07, pan: rand(-0.8, 0.8),
      });
      fx.tone({ f: rand(1200, 2200), dur: 0.03, gain: 0.02 });
    });
  }

  // Temperature; without the scene, the warm colours as CSS filters, about 11 changes a second
  time.tick((t) => {
    if (t < 1.2) return;
    if (!sensorDead.value) {
      temperature.value = temperatureAt(t);
      heat = clamp((temperature.value - 42) / (PEAK - 42), 0, 1);
    }
    if (scene || t < 1.6 || t - lastHeat < 0.09) return;
    lastHeat = t;
    glowHeight.value = heat * 70;
    const warm = warmFilter(heat);
    if (melting < 0) blocks.forEach((block) => setFilter(block, warm));
    else wipe.style.filter = warm;
  });

  // 11 s: the screen melts in strips over molten metal, still in the heat. Without the scene, it is
  // wiped away downward over the molten metal instead.
  time.at(11, () => {
    melting = time.t;
    delays = wanderingDelays(strips.length, 1.4);
    meltedColumns.value = scene ? strips.length : 1;
    if (!scene) {
      clearFilters();
      wipe.style.filter = warmFilter(heat);
      lavaShown.value = true;
      wipe.appendChild(screenTemplate(site));
      site.style.visibility = 'hidden';
      animations.push(wipe.animate([{ clipPath: 'inset(0 0 0 0)' }, { clipPath: 'inset(100% 0 0 0)' }], { duration: 2400, easing: 'ease-in', fill: 'forwards' }));
    }
    sizzle.gain(0.06, 1);
    fx.noise({
      type: 'lowpass', f: 900, f1: 90, dur: 4.5, gain: 0.25, attack: 0.4,
    });
    for (let i = 0; i < 6; i += 1) {
      fx.tone({
        f: rand(160, 240), f1: rand(40, 60), dur: rand(1.5, 2.5), gain: 0.05, attack: 0.2, delay: i * 0.7, pan: rand(-0.7, 0.7),
      });
    }
  });

  // The temperature sensor gives up
  time.at(16.4, () => {
    [0, 0.25, 0.5].forEach((delay) => fx.tone({
      type: 'square', f: 1800, dur: 0.12, gain: 0.05, delay,
    }));
  });
  time.at(17.1, () => {
    sensorDead.value = true;
    hum.gain(0.0001, 1.5);
    sizzle.gain(0.015, 2);
  });

  // The molten metal cools down with the glow above it, embers die out, ash falls
  time.at(17, () => {
    lavaFading.value = true;
    glowFading.value = true;
  });
  const wind = fx.drone({ filter: 'bandpass', f: 400, q: 0.8 });
  time.at(20.5, () => {
    wind.gain(0.04, 2);
    sizzle.gain(0.0001, 2);
  });
  for (let t = 17.5; t < 21; t += rand(0.1, 0.4)) {
    time.at(t, () => fx.noise({
      type: 'highpass', f: 1800, dur: rand(0.01, 0.03), gain: 0.05, pan: rand(-0.8, 0.8),
    }));
  }
  time.at(23.5, () => { thermoFading.value = true; });
  time.at(DURATION, showFinal);

  // A drop from an element of the screen, or, once the melt has begun, from the molten top edge of a
  // sliding strip, running down its face
  function drip() {
    const sliding = strips.filter((c) => !c.gone && c.y > 2 && c.y < H * 0.75);
    if (sliding.length && Math.random() < 0.6) {
      const c = sliding[Math.floor(Math.random() * sliding.length)];
      const point = c?.top[Math.floor(Math.random() * c.top.length)];
      if (!c || !point) return;
      // Just under the edge, on the face of the strip
      const [x, y] = edgeAt(c, point);
      drawing.drip(x, y + rand(4, 10) * (H / 800), '255,190,80', c.v, 0);
      return;
    }
    const source = sources[Math.floor(Math.random() * sources.length)];
    if (!source) return;
    const x = source.x + rand(4, Math.max(5, source.w - 4));
    // An element whose strip has started to slide no longer drips from where it was
    if (strips.some((c) => c.y > 0 && x >= c.x && x < c.x + c.w)) return;
    drawing.drip(x, source.y + source.h, source.color);
  }

  time.tick((t, dt) => {
    // Drops, faster as it gets hotter, until the metal has cooled
    if (sources.length && t > 6 && t < 16.5 && Math.random() < dt * (6 + heat * 30)) {
      drip();
      if (t - lastDrip > 0.06) {
        lastDrip = t;
        fx.noise({
          type: 'bandpass', f: rand(3000, 6000), q: 3, dur: 0.06, gain: 0.03,
        });
      }
    }
    // Strips slide down with a steady acceleration, each from its own start, stretching, leaning and
    // wobbling as they go
    if (melting >= 0) {
      strips.forEach((c, i) => {
        if (!c.gone) slideStrip(c, Math.max(0, t - melting - (delays[i] ?? 0)), t);
      });
    }
    if (!reduced) {
      // Embers rise during the melt and after it; ash falls at the end
      const rate = melting < 0 ? (t > 8 ? 8 : 0) : t < 17 ? 70 : t < 20 ? 25 : 0;
      if (Math.random() < dt * rate || (rate > 30 && Math.random() < 0.5)) {
        drawing.particle({
          x: rand(0, W), y: H + 5, vx: rand(-20, 20), vy: rand(-160, -60) * (H / 800), sway: 30, size: rand(1.5, 3.2), life: rand(2.5, 4.5), color: Math.random() < 0.5 ? '255,170,50' : '255,90,20', glow: true,
        });
      }
      if (t > 19.5 && t < 24.5 && Math.random() < dt * 30 * (W / 1280)) {
        drawing.particle({
          x: rand(0, W), y: -5, vx: rand(-10, 10), vy: rand(25, 60), sway: 25, size: rand(1.5, 3), life: rand(4, 7), color: '150,145,140',
        });
      }
    }
    scene?.draw(t, strips, look(t));
    drawing.frame(t, dt, {
      drops: clamp(1 - (t - 17) / 1, 0, 1),
      edges: scene && melting >= 0 && t < 18 ? strips : [],
    });
  });
}

async function showFinal() {
  phase.value = 'final';
  thermoShown.value = false;
  finalShown.value = true;
  await nextTick();
  finalWindow.value?.animate([{ transform: 'scale(.92)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: reduced ? 0 : 400, easing: 'cubic-bezier(.2,.8,.3,1)' });
  coolButton.value?.focus({ preventScroll: true });
}

// Cooling down: the fans start again, the strips rise back into place through a cold blue, then
// the page takes over and its colours come back
function coolDown() {
  if (phase.value !== 'final' || !page || !heatFx) return;
  phase.value = 'cool';
  clock?.stop();
  sfx?.close();
  sfx = createSfx();
  clock = startClock();
  const time = clock;
  const fx = sfx;
  const site = page;
  const drawing = heatFx;
  const melt = scene;
  const W = window.innerWidth;
  const H = window.innerHeight;
  finalWindow.value?.animate(
    reduced ? [{ opacity: 1 }, { opacity: 0 }] : [{ transform: 'none', opacity: 1 }, { transform: 'translateY(120px) scaleY(1.5)', opacity: 0 }],
    { duration: 400, easing: 'cubic-bezier(.5,0,.9,.5)', fill: 'forwards' },
  );
  fx.noise({
    type: 'bandpass', f: 140, f1: 1400, q: 2, dur: 2.2, gain: 0.12, attack: 0.4,
  });
  fx.tone({
    type: 'sawtooth', f: 40, f1: 160, dur: 2.2, gain: 0.03, attack: 0.5,
  });

  // The page comes back in a cold blue that warms up to its own colours
  function showPage() {
    sceneShown.value = false;
    wipeBox.value?.replaceChildren();
    site.style.visibility = pageVisibility;
    screenBlocks(site).forEach((block) => {
      animations.push(block.animate(
        reduced ? [{ opacity: 0, filter: COLD_FILTER }, { opacity: 1, filter: 'none' }] : [{ filter: COLD_FILTER }, { filter: 'none' }],
        { duration: 900, easing: 'ease-out' },
      ));
    });
    [659.3, 987.8].forEach((f, i) => fx.tone({
      f, dur: 0.9, gain: 0.04, attack: 0.01, delay: i * 0.08,
    }));
  }

  time.at(0.4, () => {
    finalShown.value = false;
    lavaShown.value = false;
    drawing.clear();
    if (!melt) {
      showPage();
      return;
    }
    for (let i = 0; i < 120; i += 1) {
      drawing.particle({
        x: rand(0, W), y: rand(0, H), vx: rand(-15, 15), vy: rand(-30, 10), size: rand(1.5, 3), life: rand(1, 2.2), color: '170,230,255', glow: true,
      });
    }
  });
  if (melt) {
    // Each strip rises back from below the screen, stretched, and settles in place
    const starts = wanderingDelays(strips.length, 0.7);
    time.tick((t) => {
      strips.forEach((c, i) => {
        const p = clamp((t - 0.4 - (starts[i] ?? 0)) / 1.2, 0, 1);
        c.gone = false;
        c.y = (H + 20) * (1 - p) ** 3;
        c.dx = 0;
        c.settle = 0;
      });
      melt.draw(t, strips, {
        grade: COLD_GRADE.matrix, bright: COLD_GRADE.bright, shimmerContent: 0, shimmerAll: 0, glow: 0, glowA: 0, lava: 0, ragged: 1 - clamp((t - 1.7) / 0.6, 0, 1),
      });
    });
    time.at(2.5, showPage);
  }
  time.tick((t, dt) => drawing.frame(t, dt, { drops: 0, edges: [] }));
  time.at(melt ? 3.6 : 1.4, close);
}

// Escape cancels the confirmation; Tab stays inside the open dialog
function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && phase.value === 'confirm') {
    event.preventDefault();
    cancel();
    return;
  }
  if (event.key !== 'Tab' || phase.value === 'run' || phase.value === 'cool') return;
  const buttons = phase.value === 'confirm' ? [cancelButton.value, confirmButton.value] : [coolButton.value, muteButton.value];
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
/* The site's fonts have no monospace one: the system's, for the thermometer and the labels */
.terminal-font {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
}

/* Blue when cold, yellow, orange, then red: the colours stay put while the bar grows */
.thermo-fill {
  background: linear-gradient(90deg, #38bdf8, rgb(254 238 59) 45%, #f97316 70%, #ef4444);
  background-size: 19.5rem 100%;
}

.heat-glow {
  background: linear-gradient(rgb(255 70 0 / 0), rgb(255 70 0 / 0.32) 70%, rgb(255 140 30 / 0.45));
}

/* Molten metal, slowly churning */
.lava {
  background: radial-gradient(ellipse 80% 60% at 50% 115%, #ff7a1a 0%, #c2300c 28%, #4a0904 60%, #0b0101 100%);
}

.lava::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 30% 20% at 30% 90%, rgb(255 180 60 / 0.35), transparent 70%),
    radial-gradient(ellipse 25% 18% at 72% 95%, rgb(255 150 40 / 0.3), transparent 70%);
  animation: lava-churn 3s ease-in-out infinite alternate;
}

@keyframes lava-churn {
  to {
    transform: translateX(30px) scaleY(1.1);
    opacity: 0.7;
  }
}

@media (prefers-reduced-motion: reduce) {
  .lava::after {
    animation: none;
  }
}
</style>
