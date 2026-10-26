<template>
  <!-- In #cyberpunkroot, next to the page, so the theme colours apply -->
  <Teleport to="#cyberpunkroot">
    <div class="pointer-events-none fixed inset-0 z-[60]" aria-hidden="true" inert>
      <canvas v-show="cityShown" ref="canvas" class="absolute inset-0 size-full"/>
      <!-- Without the city (no WebGL, or less motion): the screen dims, then powers down -->
      <div class="absolute inset-0 bg-black transition-opacity duration-700" :style="{ opacity: dim }"/>
    </div>

    <div
      v-if="meter"
      class="terminal-font fixed left-7 top-20 z-[70] min-w-[19rem] border border-cyan-400/60 bg-black/70 px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-200 transition-opacity duration-500"
      :class="{ 'opacity-0': meterFading }"
      aria-hidden="true"
    >
      {{ isEnglish ? meter.label[1] : meter.label[0] }}
      <b class="float-right ml-4 tabular-nums text-white">{{ typeof meter.value === 'string' ? meter.value : meter.value[isEnglish ? 1 : 0] }}</b>
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

    <!-- Confirmation: it tilts away as the page becomes a 3D scene -->
    <div v-if="dialogShown" ref="backdrop" class="fixed inset-0 z-[80] grid place-items-center bg-black/70">
      <div
        ref="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="megapolis-title"
        class="w-[37.5rem] max-w-[calc(100vw-2rem)] border-2 border-red-500 bg-black px-9 py-8 text-white shadow-[0_0_40px_rgb(239_68_68/0.3)]"
      >
        <p class="terminal-font text-[13px] font-semibold uppercase tracking-[0.16em] text-red-400">
          {{ isEnglish ? 'Self-destruct protocol' : 'Protocole d\'auto-destruction' }}
        </p>
        <h2 id="megapolis-title" class="mb-4 mt-2.5 text-[2rem] font-extrabold uppercase leading-tight tracking-wide text-red-500">
          {{ isEnglish ? 'Switch to city mode?' : 'Passer en mode ville ?' }}
        </h2>
        <ul>
          <li class="terminal-font flex justify-between gap-5 border-b border-neutral-800 py-1.5 text-sm text-neutral-200">
            <span>Plan</span>
            <span class="font-semibold tabular-nums text-green-400">{{ planSize }}</span>
          </li>
          <li class="terminal-font flex justify-between gap-5 border-b border-neutral-800 py-1.5 text-sm text-neutral-200">
            <span>{{ isEnglish ? 'Lighting' : 'Éclairage' }}</span>
            <span class="font-semibold text-green-400">{{ isEnglish ? 'neon' : 'néon' }}</span>
          </li>
          <li class="terminal-font flex justify-between gap-5 border-b border-neutral-800 py-1.5 text-sm text-neutral-200">
            <span>{{ isEnglish ? 'Power supply' : 'Alimentation' }}</span>
            <span class="font-semibold text-red-500">{{ isEnglish ? 'temporary' : 'temporaire' }}</span>
          </li>
        </ul>
        <p class="mt-4 text-sm text-red-400">
          {{ isEnglish ? 'No flash. Wide camera movements.' : 'Aucun flash. Mouvements de caméra amples.' }}
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
            {{ isEnglish ? 'Build' : 'Construire' }}
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
        aria-labelledby="megapolis-final-title"
        class="w-[32.5rem] max-w-[calc(100vw-2rem)] rounded-md border-2 border-primary bg-bg text-text shadow-[0_0_24px_rgb(var(--color-primary)/0.35)]"
      >
        <div class="flex h-11 items-center gap-2.5 border-b border-primary/40 px-3.5 text-primary">
          <span class="size-3 bg-primary" aria-hidden="true"/>
          <h2 id="megapolis-final-title" class="text-sm uppercase tracking-[0.06em]">
            {{ isEnglish ? 'City powered down' : 'Ville éteinte' }}
          </h2>
        </div>
        <dl class="terminal-font grid grid-cols-[1fr_auto] gap-x-5 gap-y-2.5 px-6 pb-1 pt-5 text-sm">
          <template v-if="stats.buildings">
            <dt class="text-gray-400">{{ isEnglish ? 'Buildings' : 'Immeubles' }}</dt>
            <dd class="text-right tabular-nums text-primary">{{ stats.buildings.toLocaleString(isEnglish ? 'en-GB' : 'fr-FR') }}</dd>
            <dt class="text-gray-400">{{ isEnglish ? 'Tallest tower' : 'Plus haute tour' }}</dt>
            <dd class="text-right tabular-nums text-primary">{{ stats.tallest }} m</dd>
          </template>
          <dt class="text-gray-400">{{ isEnglish ? 'Districts down' : 'Quartiers éteints' }}</dt>
          <dd class="text-right tabular-nums text-primary">{{ DISTRICTS }} / {{ DISTRICTS }}</dd>
        </dl>
        <button
          ref="relightButton"
          type="button"
          class="mx-auto mb-6 mt-5 block border-2 border-primary bg-bg px-7 py-3.5 font-semibold uppercase tracking-[0.1em] text-primary transition-colors hover:bg-primary/10"
          :disabled="phase !== 'final'"
          @click="relight"
        >
          {{ isEnglish ? 'Power back on' : 'Rallumer' }}
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import {
  computed, nextTick, onBeforeUnmount, onMounted, reactive, ref,
} from 'vue';

import { usePreferencesStore } from '@/stores/preferences';
import {
  cameraAt, createCity, DIST, DISTRICTS, lookAt, span,
  type City,
} from '@/utils/megapolis';
import { prefersReducedMotion } from '@/utils/motion';
import { findPage, lockScroll, themeColor } from '@/utils/selfDestructScreen';
import { startClock, type SequenceClock } from '@/utils/sequenceClock';
import {
  createSfx, isMuted, setMuted, type Sfx,
} from '@/utils/sfx';

const emit = defineEmits<{ close: [] }>();

const DURATION = 30;
// Without the city the sequence is a short power-down
const SHORT_DURATION = 10;
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

const preferencesStore = usePreferencesStore();
const isEnglish = computed(() => preferencesStore.isEnglish);

type Phase = 'confirm' | 'run' | 'final' | 'relight';
// Label and value, in French then English
type Pair = [string, string];
const phase = ref<Phase>('confirm');
const dialogShown = ref(true);
const cityShown = ref(false);
const dim = ref(0);
const meter = ref<{ label: Pair; value: string | Pair } | null>(null);
const meterFading = ref(false);
const finalShown = ref(false);
const stats = reactive({ buildings: 0, tallest: 0 });
const muted = ref(isMuted());
const planSize = ref('');

const canvas = ref<HTMLCanvasElement | null>(null);
const backdrop = ref<HTMLElement | null>(null);
const dialog = ref<HTMLElement | null>(null);
const cancelButton = ref<HTMLButtonElement | null>(null);
const confirmButton = ref<HTMLButtonElement | null>(null);
const muteButton = ref<HTMLButtonElement | null>(null);
const finalWindow = ref<HTMLElement | null>(null);
const relightButton = ref<HTMLButtonElement | null>(null);

// State of a run, outside Vue's reactivity
let clock: SequenceClock | null = null;
let sfx: Sfx | null = null;
let city: City | null = null;
let page: HTMLElement | null = null;
let pageVisibility = '';
let unlockScroll: (() => void) | null = null;
let opener: HTMLElement | null = null;
let reduced = false;

function toggleMute() {
  muted.value = !muted.value;
  setMuted(muted.value);
}

const setMeter = (label: Pair, value: string | Pair) => { meter.value = { label, value }; };

// The theme as WebGL colours (0 → 1)
function rgb(name: string, fallback: string): [number, number, number] {
  const [r = 0, g = 0, b = 0] = themeColor(name, fallback).split(/,\s*/).map((v) => Number(v) / 255);
  return [r, g, b];
}

// Back to the real page. Safe to call twice.
function stopAll() {
  clock?.stop();
  clock = null;
  sfx?.close();
  sfx = null;
  city?.dispose();
  city = null;
  cityShown.value = false;
  dim.value = 0;
  if (page) page.style.visibility = pageVisibility;
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
  if (phase.value !== 'confirm' || !canvas.value) return;
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
  clock = startClock();
  run(clock, sfx, page, canvas.value);
}

function run(time: SequenceClock, fx: Sfx, site: HTMLElement, glCanvas: HTMLCanvasElement) {
  // 0 s: the dialog tilts away
  time.at(0, () => {
    dialog.value?.animate(
      reduced ? [{ opacity: 1 }, { opacity: 0 }] : [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'perspective(800px) rotateX(50deg) translateY(60px)' }],
      { duration: 800, easing: 'cubic-bezier(.5,0,.9,.5)', fill: 'forwards' },
    );
    backdrop.value?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 800, fill: 'forwards' });
  });
  time.at(0.85, () => { dialogShown.value = false; });

  // 0.15 s: the page becomes a 3D scene while the dialog fades, without anything visibly moving
  time.at(0.15, () => {
    if (!reduced) {
      try {
        const primary = rgb('primary', '254, 238, 59');
        const secondary = rgb('secondary', '0, 255, 255');
        const accent = rgb('accent', '255, 0, 128');
        city = createCity(glCanvas, site, {
          palette: [secondary, accent, primary, [0.85, 0.88, 1]],
          grid: [secondary[0] * 0.85, secondary[1] * 0.85, secondary[2] * 0.85],
          street: [accent[0] * 0.95, accent[1] * 0.95, accent[2] * 0.95],
          wire: secondary,
        });
      } catch {
        city = null;
      }
    }
    if (city) {
      city.draw(time.t, 0, cameraAt(time.t, city.length), lookAt(time.t, city.extent));
      cityShown.value = true;
      site.style.visibility = 'hidden';
      runCity(time, fx, city);
    } else {
      powerDown(time, fx);
    }
  });
}

function runCity(time: SequenceClock, fx: Sfx, scene: City) {
  let grown = 0;
  let lastTone = 0;
  stats.buildings = scene.buildings;
  stats.tallest = Math.round(scene.tallest / 2);
  time.at(1, () => setMeter(['Mode ville', 'City mode'], ['en cours', 'starting']));

  // Sound: the tilt, a tone per tower, the night pad, the wind of the flight and the cars passing,
  // the scan, a low cut per district
  const pad = fx.drone({
    freqs: [110, 164.8, 220.5], type: 'sawtooth', filter: 'lowpass', f: 400,
  });
  const rumble = fx.drone({ filter: 'lowpass', f: 160 });
  const flight = fx.drone({ filter: 'bandpass', f: 500, q: 0.8 });
  time.at(1.2, () => {
    fx.noise({
      type: 'bandpass', f: 200, f1: 900, q: 0.7, dur: 2.6, gain: 0.12, attack: 1,
    });
    rumble.gain(0.08, 2);
  });
  time.at(4, () => {
    rumble.gain(0.14, 2);
    pad.gain(0.03, 3);
    pad.filter(1200, 6);
  });
  time.at(9.5, () => {
    rumble.gain(0.04, 2);
    pad.gain(0.045, 2);
    flight.gain(0.05, 2);
    flight.filter(900, 4);
  });
  for (let t = 10; t < 20.5; t += rand(0.7, 1.4)) {
    time.at(t, () => fx.noise({
      type: 'bandpass', f: 900, f1: 300, q: 1.5, dur: 1.1, gain: 0.06, attack: 0.4, pan: rand(-1, 1),
    }));
  }
  time.at(20.5, () => {
    flight.filter(400, 3);
    flight.gain(0.0001, 3);
  });
  time.at(21.8, () => {
    fx.tone({
      f: 200, f1: 1800, dur: 3.2, gain: 0.04, attack: 1.5,
    });
    pad.filter(500, 3);
  });
  for (let t = 22; t < 24.8; t += 0.09) {
    time.at(t, () => {
      if (Math.random() < 0.5) {
        fx.noise({
          type: 'highpass', f: 4000, dur: 0.02, gain: 0.03, pan: rand(-1, 1),
        });
      }
    });
  }
  for (let d = 0; d < DISTRICTS; d += 1) {
    time.at(25.2 + d * 0.8, () => {
      fx.tone({
        f: 320, f1: 45, dur: 0.6, gain: 0.16, attack: 0.005,
      });
      fx.noise({
        type: 'bandpass', f: 1800, q: 2, dur: 0.25, gain: 0.06,
      });
      setMeter(['Quartiers éteints', 'Districts down'], `${d + 1} / ${DISTRICTS}`);
    });
  }
  time.at(25, () => {
    pad.gain(0.0001, 4);
    rumble.gain(0.0001, 2);
  });
  time.at(29, () => { meterFading.value = true; });
  time.at(DURATION, showFinal);

  time.tick((t) => {
    if (t > 4 && t < 14) {
      // Buildings that have started to grow, from their sorted start; a rising tone as they go
      let now = grown;
      while (now < scene.growDelays.length && (scene.growDelays[now] ?? 0) < t - 4) now += 1;
      if (now > grown) {
        if (t - lastTone > 0.035) {
          lastTone = t;
          fx.tone({
            f: rand(220, 440), f1: rand(600, 1100), dur: 0.25, gain: 0.03, pan: rand(-0.8, 0.8),
          });
        }
        grown = now;
        setMeter(['Immeubles', 'Buildings'], grown.toLocaleString(isEnglish.value ? 'en-GB' : 'fr-FR'));
      }
    }
    if (t >= 14 && t < 21.8 && meter.value?.label[0] !== 'Ville') setMeter(['Ville', 'City'], ['en ligne', 'online']);
    if (t > 21.8 && t < 24.8) setMeter(['Dématérialisation', 'Dematerialising'], `${Math.round(clamp((t - 21.8) / 3, 0, 1) * 100)} %`);
    scene.draw(t, 0, cameraAt(t, scene.length), lookAt(t, scene.extent));
  });
}

// Without the city: the screen dims, then powers down district by district
function powerDown(time: SequenceClock, fx: Sfx) {
  time.at(1, () => setMeter(['Quartiers éteints', 'Districts down'], `0 / ${DISTRICTS}`));
  time.at(1.2, () => { dim.value = 0.5; });
  for (let d = 0; d < DISTRICTS; d += 1) {
    time.at(4.5 + d * 0.8, () => {
      dim.value = 0.6 + d * 0.1;
      fx.tone({
        f: 320, f1: 45, dur: 0.6, gain: 0.16, attack: 0.005,
      });
      setMeter(['Quartiers éteints', 'Districts down'], `${d + 1} / ${DISTRICTS}`);
    });
  }
  time.at(9, () => { meterFading.value = true; });
  time.at(SHORT_DURATION, showFinal);
}

async function showFinal() {
  phase.value = 'final';
  meter.value = null;
  finalShown.value = true;
  await nextTick();
  finalWindow.value?.animate([{ transform: 'scale(.94)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: reduced ? 0 : 500, easing: 'cubic-bezier(.2,.8,.3,1)' });
  relightButton.value?.focus({ preventScroll: true });
}

// Relight: districts light up again, the faces come back, the towers sink into the ground and the
// camera comes back to face the page, which then takes over
function relight() {
  if (phase.value !== 'final') return;
  phase.value = 'relight';
  clock?.stop();
  sfx?.close();
  sfx = createSfx();
  clock = startClock();
  const time = clock;
  const fx = sfx;
  const scene = city;
  finalWindow.value?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' });
  time.at(0.3, () => { finalShown.value = false; });
  [523.3, 587.3, 659.3, 784, 880].forEach((f, i) => time.at(0.1 + i * 0.14, () => fx.tone({
    f, dur: 0.7, gain: 0.04, attack: 0.01,
  })));
  if (!scene) {
    time.at(0.3, () => { dim.value = 0; });
    time.at(1.2, close);
    return;
  }
  time.at(1.3, () => fx.noise({
    type: 'lowpass', f: 900, f1: 120, dur: 1.4, gain: 0.12, attack: 0.2,
  }));
  const from = cameraAt(DURATION, scene.length);
  // Back to face the page by the shortest turn
  from.rz = ((((from.rz + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) - Math.PI;
  time.tick((t) => {
    const e = span(t, 0.8, 3.8);
    scene.draw(t, 1, {
      rx: from.rx * (1 - e), rz: from.rz * (1 - e), dist: from.dist + (DIST - from.dist) * e, tx: from.tx * (1 - e), ty: from.ty * (1 - e),
    }, {
      // The grid goes again as the camera faces the page, so the real page takes over seamlessly
      pageA: span(t, 0.4, 1.6), gridA: span(t, 0, 1) * (1 - span(t, 3, 3.9)), scan: -5000, scanA: 0, cars: 0,
    });
  });
  // Back to the real page once the towers are down and the camera faces it again
  time.at(4.1, close);
}

// Escape cancels the confirmation; Tab stays inside the open dialog
function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && phase.value === 'confirm') {
    event.preventDefault();
    cancel();
    return;
  }
  if (event.key !== 'Tab' || phase.value === 'run' || phase.value === 'relight') return;
  const buttons = phase.value === 'confirm' ? [cancelButton.value, confirmButton.value] : [relightButton.value, muteButton.value];
  const focusable = buttons.filter((button): button is HTMLButtonElement => !!button && !button.disabled);
  if (!focusable.length) return;
  const index = focusable.indexOf(document.activeElement as HTMLButtonElement);
  event.preventDefault();
  focusable[(index + (event.shiftKey ? -1 : 1) + focusable.length) % focusable.length]?.focus();
}

onMounted(() => {
  opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  // The plan of the city is the whole page
  planSize.value = `${window.innerWidth} × ${Math.max(window.innerHeight, Math.ceil(findPage()?.scrollHeight ?? 0))}`;
  window.addEventListener('keydown', onKeydown);
  confirmButton.value?.focus();
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown);
  stopAll();
});
</script>

<style scoped>
/* The site's fonts have no monospace one: the system's, for the meter and the labels */
.terminal-font {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
}
</style>
