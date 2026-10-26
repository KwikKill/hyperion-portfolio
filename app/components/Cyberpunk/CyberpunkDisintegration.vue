<template>
  <!-- In #cyberpunkroot, next to the page, so the theme colours apply -->
  <Teleport to="#cyberpunkroot">
    <div class="pointer-events-none fixed inset-0 z-[60]" aria-hidden="true" inert>
      <canvas v-show="mode === 'dust'" ref="glCanvas" class="absolute inset-0 size-full"/>
      <!-- Without WebGL, or with less motion: the screen fades in ever larger pixels -->
      <canvas v-show="mode === 'fade'" ref="fadeCanvas" class="absolute inset-0 size-full"/>
    </div>

    <div
      v-if="meterShown"
      class="terminal-font fixed left-7 top-20 z-[70] w-80 border border-cyan-400/60 bg-black/70 px-3 py-2 text-xs font-semibold uppercase leading-[1.9] tracking-[0.12em] text-cyan-200 transition-opacity duration-700"
      :class="{ 'opacity-0': meterFading }"
      aria-hidden="true"
    >
      {{ isEnglish ? 'Pixel integrity' : 'Intégrité des pixels' }}
      <b class="float-right tabular-nums text-white">{{ integrity }} %</b>
      <template v-if="particles">
        <br>
        {{ isEnglish ? 'Particles' : 'Particules' }}
        <b class="float-right tabular-nums text-white">{{ particlesLabel }}</b>
      </template>
      <span class="mt-1.5 block h-1.5 bg-[#062226]">
        <span class="block h-full bg-gradient-to-r from-cyan-400 to-primary" :style="{ width: `${integrity}%` }"/>
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

    <!-- Confirmation: it blurs away as the page turns into particles -->
    <div v-if="dialogShown" ref="backdrop" class="fixed inset-0 z-[80] grid place-items-center bg-black/70">
      <div
        ref="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="disintegration-title"
        class="w-[37.5rem] max-w-[calc(100vw-2rem)] border-2 border-red-500 bg-black px-9 py-8 text-white shadow-[0_0_40px_rgb(239_68_68/0.3)]"
      >
        <p class="terminal-font text-[13px] font-semibold uppercase tracking-[0.16em] text-red-400">
          {{ isEnglish ? 'Self-destruct protocol' : 'Protocole d\'auto-destruction' }}
        </p>
        <h2 id="disintegration-title" class="mb-4 mt-2.5 text-[2rem] font-extrabold uppercase leading-tight tracking-wide text-red-500">
          {{ isEnglish ? 'Disintegrate the page?' : 'Désintégrer la page ?' }}
        </h2>
        <ul>
          <li class="terminal-font flex justify-between gap-5 border-b border-neutral-800 py-1.5 text-sm text-neutral-200">
            <span>{{ isEnglish ? 'Resolution' : 'Résolution' }}</span>
            <span class="font-semibold tabular-nums text-green-400">{{ resolution }}</span>
          </li>
          <li class="terminal-font flex justify-between gap-5 border-b border-neutral-800 py-1.5 text-sm text-neutral-200">
            <span>{{ isEnglish ? 'Pixel cohesion' : 'Cohésion des pixels' }}</span>
            <span class="font-semibold text-green-400">100 %</span>
          </li>
          <li class="terminal-font flex justify-between gap-5 border-b border-neutral-800 py-1.5 text-sm text-neutral-200">
            <span>{{ isEnglish ? 'Undo' : 'Retour en arrière' }}</span>
            <span class="font-semibold text-red-500">impossible</span>
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
            data-umami-event="disintegration-animation"
            @click="confirm"
          >
            {{ isEnglish ? 'Disintegrate' : 'Désintégrer' }}
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
        aria-labelledby="disintegration-final-title"
        class="w-[32.5rem] max-w-[calc(100vw-2rem)] rounded-md border-2 border-primary bg-bg text-text shadow-[0_0_24px_rgb(var(--color-primary)/0.35)]"
      >
        <div class="flex h-11 items-center gap-2.5 border-b border-primary/40 px-3.5 text-primary">
          <span class="size-3 bg-primary" aria-hidden="true"/>
          <h2 id="disintegration-final-title" class="text-sm uppercase tracking-[0.06em]">
            {{ isEnglish ? 'Site disintegrated' : 'Site désintégré' }}
          </h2>
        </div>
        <dl class="terminal-font grid grid-cols-[1fr_auto] gap-x-5 gap-y-2.5 px-6 pb-1 pt-5 text-sm">
          <template v-if="particles">
            <dt class="text-gray-400">{{ isEnglish ? 'Particles' : 'Particules' }}</dt>
            <dd class="text-right tabular-nums text-primary">{{ particlesLabel }}</dd>
          </template>
          <dt class="text-gray-400">{{ isEnglish ? 'Integrity' : 'Intégrité' }}</dt>
          <dd class="text-right tabular-nums text-primary">0 %</dd>
          <dt class="text-gray-400">{{ isEnglish ? 'Flashes' : 'Flashs' }}</dt>
          <dd class="text-right tabular-nums text-primary">0</dd>
        </dl>
        <button
          ref="rebuildButton"
          type="button"
          class="mx-auto mb-6 mt-5 block border-2 border-primary bg-bg px-7 py-3.5 font-semibold uppercase tracking-[0.1em] text-primary transition-colors hover:bg-primary/10"
          :disabled="phase !== 'final'"
          @click="reassemble"
        >
          {{ isEnglish ? 'Reassemble' : 'Réassembler' }}
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
  cameraAt, createDust, createPixelFade, DIST, span,
  type Dust,
} from '@/utils/disintegration';
import { paintScreen } from '@/utils/megapolis';
import { prefersReducedMotion } from '@/utils/motion';
import { findPage, lockScroll } from '@/utils/selfDestructScreen';
import { startClock, type SequenceClock } from '@/utils/sequenceClock';
import {
  createSfx, isMuted, setMuted, type Sfx,
} from '@/utils/sfx';

const emit = defineEmits<{ close: [] }>();

const DURATION = 25;
// Without the particles the sequence is a short fade
const SHORT_DURATION = 10;
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

const preferencesStore = usePreferencesStore();
const isEnglish = computed(() => preferencesStore.isEnglish);

type Phase = 'confirm' | 'run' | 'final' | 'rebuild';
const phase = ref<Phase>('confirm');
// What replaces the page: the WebGL particles, or the pixel fade
const mode = ref<'none' | 'dust' | 'fade'>('none');
const dialogShown = ref(true);
const meterShown = ref(false);
const meterFading = ref(false);
const integrity = ref(100);
const particles = ref(0);
const particlesLabel = computed(() => particles.value.toLocaleString(isEnglish.value ? 'en-GB' : 'fr-FR'));
const finalShown = ref(false);
const muted = ref(isMuted());
const resolution = ref('');

const glCanvas = ref<HTMLCanvasElement | null>(null);
const fadeCanvas = ref<HTMLCanvasElement | null>(null);
const backdrop = ref<HTMLElement | null>(null);
const dialog = ref<HTMLElement | null>(null);
const cancelButton = ref<HTMLButtonElement | null>(null);
const confirmButton = ref<HTMLButtonElement | null>(null);
const muteButton = ref<HTMLButtonElement | null>(null);
const finalWindow = ref<HTMLElement | null>(null);
const rebuildButton = ref<HTMLButtonElement | null>(null);

// State of a run, outside Vue's reactivity
let clock: SequenceClock | null = null;
let sfx: Sfx | null = null;
let dust: Dust | null = null;
let fade: ((progress: number) => void) | null = null;
let page: HTMLElement | null = null;
let pageVisibility = '';
let unlockScroll: (() => void) | null = null;
let opener: HTMLElement | null = null;
let reduced = false;

function toggleMute() {
  muted.value = !muted.value;
  setMuted(muted.value);
}

// Back to the real page. Safe to call twice.
function stopAll() {
  clock?.stop();
  clock = null;
  sfx?.close();
  sfx = null;
  dust?.dispose();
  dust = null;
  fade = null;
  mode.value = 'none';
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
  if (phase.value !== 'confirm' || !glCanvas.value || !fadeCanvas.value) return;
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
  run(clock, sfx, page, glCanvas.value, fadeCanvas.value);
}

function run(time: SequenceClock, fx: Sfx, site: HTMLElement, gl: HTMLCanvasElement, flat: HTMLCanvasElement) {
  time.at(0, () => {
    dialog.value?.animate([{ opacity: 1, filter: 'blur(0)' }, { opacity: 0, filter: 'blur(6px)' }], { duration: 700, fill: 'forwards' });
    backdrop.value?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 700, fill: 'forwards' });
    fx.noise({
      type: 'bandpass', f: 2400, f1: 600, q: 1, dur: 0.8, gain: 0.08,
    });
  });
  time.at(0.75, () => { dialogShown.value = false; });

  // 0.15 s: the page becomes particles while the dialog fades, without anything visibly moving
  time.at(0.15, () => {
    const screen = paintScreen(site);
    if (!reduced) {
      try {
        dust = createDust(gl, screen);
      } catch {
        dust = null;
      }
    }
    if (dust) {
      particles.value = dust.count;
      dust.draw(time.t, 0, cameraAt(time.t));
      mode.value = 'dust';
      site.style.visibility = 'hidden';
      runDust(time, fx, dust);
    } else {
      fade = createPixelFade(flat, screen);
      fade(0);
      mode.value = 'fade';
      site.style.visibility = 'hidden';
      runFade(time, fx, fade);
    }
  });
}

function runDust(time: SequenceClock, fx: Sfx, scene: Dust) {
  let lastFizz = 0;
  time.at(0.9, () => { meterShown.value = true; });

  // Sound: a hum as the page lifts, the wind, the fizz of particles, a swirling breath, a long tail
  const hum = fx.drone({ freqs: [55, 82.5, 110], filter: 'lowpass', f: 300 });
  const wind = fx.drone({ filter: 'bandpass', f: 300, q: 0.8 });
  const pad = fx.drone({ freqs: [220, 329.6, 440, 554.4], filter: 'lowpass', f: 2200 });
  time.at(1, () => {
    hum.gain(0.08, 2);
    hum.filter(900, 2);
  });
  time.at(3, () => {
    wind.gain(0.12, 3);
    wind.filter(1400, 8);
    hum.gain(0.05, 3);
  });
  time.at(11, () => {
    wind.gain(0.18, 2);
    pad.gain(0.03, 3);
    pad.freq(1.12, 7);
  });
  for (let t = 11.4; t < 18; t += 0.5) {
    time.at(t, () => fx.noise({
      type: 'bandpass', f: 700, f1: 1500, q: 0.6, dur: 0.5, gain: 0.07, attack: 0.2, pan: Math.sin(t * 3.1),
    }));
  }
  time.at(18, () => {
    wind.gain(0.0001, 4);
    hum.gain(0.0001, 3);
    pad.gain(0.0001, 5);
    fx.noise({
      type: 'lowpass', f: 2600, f1: 120, dur: 5, gain: 0.12, attack: 0.3,
    });
  });
  time.at(21, () => { meterFading.value = true; });
  time.at(DURATION, showFinal);

  time.tick((t) => {
    // The fizz of particles leaving, denser as the wind front advances
    const front = clamp((t - 3) / 7.5, 0, 1);
    if (t > 3 && t < 12 && Math.random() < 0.2 + front * 0.6 && t - lastFizz > 0.025) {
      lastFizz = t;
      fx.tone({
        f: rand(2500, 6500), dur: 0.02, gain: 0.012 + front * 0.015, pan: rand(-1, 1),
      });
    }
    integrity.value = Math.round(100 * (1 - front));
    scene.draw(t, 0, cameraAt(t));
  });
}

// Without the particles: the screen dissolves into ever larger pixels as it fades
function runFade(time: SequenceClock, fx: Sfx, draw: (progress: number) => void) {
  time.at(0.9, () => { meterShown.value = true; });
  const hum = fx.drone({ freqs: [55, 82.5, 110], filter: 'lowpass', f: 300 });
  time.at(1, () => hum.gain(0.06, 2));
  time.at(6.5, () => hum.gain(0.0001, 2));
  time.tick((t) => {
    const p = clamp((t - 1) / 7, 0, 1);
    integrity.value = Math.round(100 * (1 - p));
    draw(p);
  });
  time.at(9, () => { meterFading.value = true; });
  time.at(SHORT_DURATION, showFinal);
}

async function showFinal() {
  phase.value = 'final';
  meterShown.value = false;
  finalShown.value = true;
  await nextTick();
  finalWindow.value?.animate([{ transform: 'scale(.94)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: reduced ? 0 : 500, easing: 'cubic-bezier(.2,.8,.3,1)' });
  rebuildButton.value?.focus({ preventScroll: true });
}

// Reassembly: the particles come back from the far field and land on their own place while the
// camera comes back to face the page, which then takes over
function reassemble() {
  if (phase.value !== 'final') return;
  phase.value = 'rebuild';
  clock?.stop();
  sfx?.close();
  sfx = createSfx();
  clock = startClock();
  const time = clock;
  const fx = sfx;
  const scene = dust;
  const draw = fade;
  finalWindow.value?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' });
  time.at(0.3, () => { finalShown.value = false; });
  if (scene) {
    const from = cameraAt(DURATION);
    // Back to face the page by the shortest turn
    from.ry %= 2 * Math.PI;
    if (from.ry > Math.PI) from.ry -= 2 * Math.PI;
    fx.noise({
      type: 'bandpass', f: 200, f1: 2600, q: 0.6, dur: 2.6, gain: 0.12, attack: 1.8,
    });
    time.at(2.7, () => [523.3, 659.3, 784, 1046.5].forEach((f, i) => fx.tone({
      f, dur: 1.2, gain: 0.035, attack: 0.02, delay: i * 0.06,
    })));
    time.tick((t) => {
      const e = span(t, 0, 2.6);
      scene.draw(t, 1, { rx: from.rx * (1 - e), ry: from.ry * (1 - e), dist: from.dist + (DIST - from.dist) * e });
    });
    // Back to the real page once every pixel has landed
    time.at(3.1, close);
    return;
  }
  [523.3, 659.3, 784, 1046.5].forEach((f, i) => fx.tone({
    f, dur: 1.2, gain: 0.035, attack: 0.02, delay: 0.8 + i * 0.06,
  }));
  time.tick((t) => draw?.(1 - clamp(t / 1.2, 0, 1)));
  time.at(1.4, close);
}

// Escape cancels the confirmation; Tab stays inside the open dialog
function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && phase.value === 'confirm') {
    event.preventDefault();
    cancel();
    return;
  }
  if (event.key !== 'Tab' || phase.value === 'run' || phase.value === 'rebuild') return;
  const buttons = phase.value === 'confirm' ? [cancelButton.value, confirmButton.value] : [rebuildButton.value, muteButton.value];
  const focusable = buttons.filter((button): button is HTMLButtonElement => !!button && !button.disabled);
  if (!focusable.length) return;
  const index = focusable.indexOf(document.activeElement as HTMLButtonElement);
  event.preventDefault();
  focusable[(index + (event.shiftKey ? -1 : 1) + focusable.length) % focusable.length]?.focus();
}

onMounted(() => {
  opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  resolution.value = `${window.innerWidth} × ${window.innerHeight}`;
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
