<template>
  <!-- In #cyberpunkroot, next to the page: the page can turn and be pulled in without taking this
       along, and the theme colours still apply to the copies -->
  <Teleport to="#cyberpunkroot">
    <div class="pointer-events-none fixed inset-0 z-[60]" aria-hidden="true" inert>
      <!-- The void left once the page is gone -->
      <div class="absolute inset-0 bg-black transition-opacity duration-700" :class="voidShown ? 'opacity-100' : 'opacity-0'"/>
      <!-- Copies of what is on screen, which orbit the hole -->
      <div ref="layer" class="absolute inset-0"/>
      <canvas ref="canvas" class="absolute inset-0 size-full"/>
    </div>

    <div
      v-if="meterShown"
      class="terminal-font fixed left-7 top-20 z-[70] w-[21rem] border border-red-500 bg-black/80 px-3 py-2 text-xs font-semibold uppercase leading-[1.9] tracking-[0.12em] text-red-400 transition-opacity duration-500"
      :class="{ 'opacity-0': meterFading }"
      aria-hidden="true"
    >
      {{ isEnglish ? 'Objects absorbed' : 'Objets absorbés' }}
      <b class="float-right tabular-nums text-white">{{ absorbed }}</b>
      <br>
      {{ isEnglish ? 'Event horizon radius' : 'Rayon de l\'horizon' }}
      <b class="float-right tabular-nums text-white">{{ horizon }} px</b>
    </div>

    <div ref="flash" class="singularity-flash pointer-events-none fixed inset-0 z-[75] opacity-0" aria-hidden="true"/>

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

    <!-- Confirmation: once confirmed, it is the first thing pulled into the hole -->
    <div v-if="dialogShown" ref="backdrop" class="fixed inset-0 z-[80] grid place-items-center bg-black/70">
      <div
        ref="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="singularity-title"
        class="w-[37.5rem] max-w-[calc(100vw-2rem)] border-2 border-red-500 bg-black px-9 py-8 text-white shadow-[0_0_40px_rgb(239_68_68/0.3)]"
      >
        <p class="terminal-font text-[13px] font-semibold uppercase tracking-[0.16em] text-red-400">
          {{ isEnglish ? 'Self-destruct protocol' : 'Protocole d\'auto-destruction' }}
        </p>
        <h2 id="singularity-title" class="mb-4 mt-2.5 text-[2rem] font-extrabold uppercase leading-tight tracking-wide text-red-500">
          {{ isEnglish ? 'Open a singularity?' : 'Ouvrir une singularité ?' }}
        </h2>
        <ul>
          <li class="terminal-font flex justify-between gap-5 border-b border-neutral-800 py-1.5 text-sm text-neutral-200">
            <span>{{ isEnglish ? 'Mass' : 'Masse' }}</span>
            <span class="text-right font-semibold text-green-400">{{ isEnglish ? '2.2 × 10⁻⁸ kg (Planck mass)' : '2,2 × 10⁻⁸ kg (masse de Planck)' }}</span>
          </li>
          <li class="terminal-font flex justify-between gap-5 border-b border-neutral-800 py-1.5 text-sm text-neutral-200">
            <span>{{ isEnglish ? 'Expected horizon' : 'Horizon prévu' }}</span>
            <span class="font-semibold text-green-400">&lt; 1 px</span>
          </li>
          <li class="terminal-font flex justify-between gap-5 border-b border-neutral-800 py-1.5 text-sm text-neutral-200">
            <span>{{ isEnglish ? 'Stabiliser' : 'Stabilisateur' }}</span>
            <span class="font-semibold text-red-500">{{ isEnglish ? 'disabled' : 'désactivé' }}</span>
          </li>
        </ul>
        <p class="mt-4 text-sm text-red-400">
          {{ isEnglish ? '1 white flash when it evaporates.' : '1 flash blanc à l\'évaporation.' }}
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
            data-umami-event="singularity-animation"
            @click="confirm"
          >
            {{ isEnglish ? 'Open' : 'Ouvrir' }}
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
        aria-labelledby="singularity-final-title"
        class="w-[32.5rem] max-w-[calc(100vw-2rem)] rounded-md border-2 border-primary bg-bg text-text shadow-[0_0_24px_rgb(var(--color-primary)/0.35)]"
      >
        <div class="flex h-11 items-center gap-2.5 border-b border-primary/40 px-3.5 text-primary">
          <span class="size-3 bg-primary" aria-hidden="true"/>
          <h2 id="singularity-final-title" class="text-sm uppercase tracking-[0.06em]">
            {{ isEnglish ? 'Singularity evaporated' : 'Singularité évaporée' }}
          </h2>
        </div>
        <dl class="terminal-font grid grid-cols-[1fr_auto] gap-x-5 gap-y-2.5 px-6 pb-1 pt-5 text-sm">
          <dt class="text-gray-400">{{ isEnglish ? 'Objects absorbed' : 'Objets absorbés' }}</dt>
          <dd class="text-right tabular-nums text-primary">{{ absorbed }}</dd>
          <dt class="text-gray-400">{{ isEnglish ? 'Largest horizon' : 'Horizon maximal' }}</dt>
          <dd class="text-right tabular-nums text-primary">{{ maxHorizon }} px</dd>
          <dt class="text-gray-400">{{ isEnglish ? 'Evaporation' : 'Évaporation' }}</dt>
          <dd class="text-right tabular-nums text-primary">{{ evaporation }}</dd>
        </dl>
        <button
          ref="bangButton"
          type="button"
          class="mx-auto mb-6 mt-5 block border-2 border-primary bg-bg px-7 py-3.5 font-semibold uppercase tracking-[0.1em] text-primary transition-colors hover:bg-primary/10"
          :disabled="phase !== 'final'"
          @click="bigBang"
        >
          Big Bang
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
import { captureScreen, type Capture } from '@/utils/collapse';
import { prefersReducedMotion } from '@/utils/motion';
import { findPage, lockScroll, themeColor } from '@/utils/selfDestructScreen';
import { startClock, type SequenceClock } from '@/utils/sequenceClock';
import {
  createSfx, isMuted, setMuted, type Sfx,
} from '@/utils/sfx';
import {
  createHole, moveOrbiter, renderOrbiter, schedule, screenScale, toOrbiters,
  type Hole, type Orbiter,
} from '@/utils/singularity';

const emit = defineEmits<{ close: [] }>();

const DURATION = 27;
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

const preferencesStore = usePreferencesStore();
const isEnglish = computed(() => preferencesStore.isEnglish);

type Phase = 'confirm' | 'run' | 'final' | 'bang';
const phase = ref<Phase>('confirm');
const dialogShown = ref(true);
const meterShown = ref(false);
const meterFading = ref(false);
const voidShown = ref(false);
const finalShown = ref(false);
const absorbed = ref(0);
const horizon = ref(0);
const maxHorizon = ref(0);
const evaporation = ref('');
const muted = ref(isMuted());

const layer = ref<HTMLElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
const flash = ref<HTMLElement | null>(null);
const backdrop = ref<HTMLElement | null>(null);
const dialog = ref<HTMLElement | null>(null);
const cancelButton = ref<HTMLButtonElement | null>(null);
const confirmButton = ref<HTMLButtonElement | null>(null);
const muteButton = ref<HTMLButtonElement | null>(null);
const finalWindow = ref<HTMLElement | null>(null);
const bangButton = ref<HTMLButtonElement | null>(null);

// State of a run, outside Vue's reactivity
let clock: SequenceClock | null = null;
let sfx: Sfx | null = null;
let hole: Hole | null = null;
let page: HTMLElement | null = null;
let captures: Capture[] = [];
let orbiters: Orbiter[] = [];
let pageAnimation: Animation | null = null;
let pageStyle = { transform: '', transformOrigin: '', visibility: '', willChange: '' };
let unlockScroll: (() => void) | null = null;
let opener: HTMLElement | null = null;
let reduced = false;

function toggleMute() {
  muted.value = !muted.value;
  setMuted(muted.value);
}

// The page as it was, without any copy left. Safe to call twice.
function restorePage() {
  captures.forEach((capture) => capture.restore());
  captures = [];
  orbiters = [];
  if (layer.value) {
    layer.value.replaceChildren();
    layer.value.style.transform = '';
  }
  pageAnimation?.cancel();
  pageAnimation = null;
  if (page) Object.assign(page.style, pageStyle);
  voidShown.value = false;
  hole?.clear();
}

function stopAll() {
  clock?.stop();
  clock = null;
  sfx?.close();
  sfx = null;
  restorePage();
  hole = null;
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
  if (phase.value !== 'confirm' || !canvas.value || !layer.value) return;
  page = findPage();
  if (!page) {
    close();
    return;
  }
  phase.value = 'run';
  reduced = prefersReducedMotion();
  pageStyle = {
    transform: page.style.transform, transformOrigin: page.style.transformOrigin, visibility: page.style.visibility, willChange: page.style.willChange,
  };
  // The page turns and shrinks on every frame: drawn once, then only moved
  if (!reduced) page.style.willChange = 'transform';
  unlockScroll = lockScroll();
  sfx = createSfx();
  const primary = themeColor('primary', '254, 238, 59');
  const secondary = themeColor('secondary', '0, 255, 255');
  hole = createHole(canvas.value, { disk: [primary, secondary, themeColor('accent', '255, 0, 128'), primary], grid: secondary }, reduced);
  clock = startClock();
  run(clock, sfx, hole, page, layer.value);
}

function run(time: SequenceClock, fx: Sfx, singularity: Hole, site: HTMLElement, debris: HTMLElement) {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const X = W / 2;
  const Y = H / 2;
  const k = screenScale();
  // Once the first screen is eaten, the next one rises into view to be eaten in turn
  const rises = !reduced && site.scrollHeight > H * 1.5;
  let rh = 0;
  let maxRh = 0;
  let goal = 0;
  let swirl = 0;
  let shift = 0;
  let pullIn = -1;
  let collapse = false;
  let collapseAt = 0;
  let evaporatedAt = 0;
  let lastWhoosh = 0;
  let lastPlop = 0;

  // The page turns around the hole, scaled so the corners never show; the copies turn with it
  function turn(angle: number, scale: number) {
    const a = (angle * Math.PI) / 180;
    const cover = Math.cos(a) + Math.max(W / H, H / W) * Math.abs(Math.sin(a));
    const around = `translate(${X}px, ${Y}px) rotate(${angle.toFixed(2)}deg) scale(${(scale * cover).toFixed(4)}) translate(${-X}px, ${-Y}px)`;
    site.style.transformOrigin = '0 0';
    site.style.transform = shift ? `${around} translateY(${(-shift).toFixed(1)}px)` : around;
    debris.style.transform = around;
  }

  // Copies of what is on screen, measured without the turn of the page
  function capture(wave: number, start: number, end: number) {
    site.style.transform = shift ? `translateY(${-shift}px)` : pageStyle.transform;
    site.style.transformOrigin = '0 0';
    const sub = document.createElement('div');
    Object.assign(sub.style, { position: 'absolute', inset: '0' });
    debris.appendChild(sub);
    const shot = captureScreen(site, sub);
    captures.push(shot);
    // Copies replay the entrance animations of their originals (blocks rising into view): skip them
    sub.getAnimations({ subtree: true }).forEach((animation) => {
      if (animation.effect?.getTiming().iterations !== Infinity) animation.finish();
    });
    const list = toOrbiters(shot.bodies, wave);
    schedule(list, start, end);
    // Each screen makes the hole grow by the same amount, whatever it holds
    const weight = list.reduce((sum, o) => sum + o.weight, 0);
    list.forEach((o) => {
      o.growth = weight ? (59 * k * (rises ? 0.5 : 1) * o.weight) / weight : 0;
      renderOrbiter(o);
    });
    orbiters.push(...list);
    if (swirl) turn(swirl, 1);
  }

  function release(o: Orbiter) {
    o.active = true;
    o.release = time.t;
    if (time.t - lastWhoosh > 0.11) {
      lastWhoosh = time.t;
      fx.noise({
        type: 'bandpass', f: 1800, f1: 220, q: 1.5, dur: 1.6, gain: 0.045, attack: 0.3, pan: (o.body.cx - X) / X,
      });
    }
    // Less motion: the piece fades out where it is instead of spiralling in
    if (reduced) {
      o.body.el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 600, fill: 'forwards' });
      time.after(0.6, () => { if (!o.gone) swallow(o, false); });
    }
  }

  // Sound bed: a deep drone that rises with the mass, a wind, and later the shimmer of the disk
  const drone = fx.drone({ freqs: [38, 41, 76], filter: 'lowpass', f: 400 });
  const wind = fx.drone({ filter: 'lowpass', f: 300 });
  const shimmer = fx.drone({ freqs: [440, 554.4, 659.3], filter: 'lowpass', f: 3000 });
  const jetHiss = fx.drone({ filter: 'highpass', f: 3000 });

  function swallow(o: Orbiter, quiet: boolean) {
    o.gone = true;
    o.active = false;
    o.body.el.style.display = 'none';
    absorbed.value += 1;
    goal = Math.min(72 * k, goal + o.growth);
    singularity.feed(o.big ? 60 : 14, rh);
    singularity.ring();
    if (quiet) return;
    if (time.t - lastPlop > 0.05) {
      lastPlop = time.t;
      fx.tone({
        f: 300, f1: 70, dur: 0.09, gain: 0.04, pan: (o.body.cx - X) / X,
      });
    }
    const progress = clamp((time.t - 3) / 16, 0, 1);
    drone.freq(1 + 0.55 * progress, 1);
    wind.filter(300 + 1500 * progress, 1);
    wind.gain(0.05 + 0.07 * progress, 1);
  }

  // 0 → 1.2 s: the dialog is pulled into the centre
  time.at(0, () => {
    dialog.value?.animate(
      reduced ? [{ opacity: 1 }, { opacity: 0 }] : [{ transform: 'none', opacity: 1 }, { transform: 'scale(.05) rotate(220deg)', opacity: 0 }],
      { duration: reduced ? 400 : 1100, easing: 'cubic-bezier(.7,0,.9,.6)', fill: 'forwards' },
    );
    backdrop.value?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: reduced ? 400 : 1100, fill: 'forwards' });
    fx.noise({
      type: 'bandpass', f: 1500, f1: 150, dur: 1.1, gain: 0.1,
    });
  });
  time.at(1.15, () => { dialogShown.value = false; });
  time.at(1.2, () => {
    meterShown.value = true;
    goal = 5 * k;
    drone.gain(0.2, 4);
    wind.gain(0.05, 4);
  });
  time.at(9, () => shimmer.gain(0.022, 6));

  // 2.9 s: what is on screen becomes copies, which go small ones first, faster and faster
  time.at(2.9, () => capture(1, 3, rises ? 10.4 : 17.2));

  // 10.6 s: whatever is left of the first screen goes, and the next screen rises into view. Its
  // blocks play their own entrance as they come into view; they are copied once it is over.
  if (rises) {
    time.at(10.6, () => {
      orbiters.forEach((o) => { if (!o.active && !o.gone) release(o); });
      fx.noise({
        brown: true, type: 'lowpass', f: 150, f1: 700, dur: 1.6, gain: 0.3, attack: 0.9,
      });
    });
    time.tween(10.6, 1.4, (p) => {
      shift = H * (p < 0.5 ? 2 * p * p : 1 - ((-2 * p + 2) ** 2) / 2);
    });
    time.at(12.7, () => capture(2, 12.8, 17.4));
  }

  // 17 s: jets from the poles
  time.at(17, () => jetHiss.gain(0.035, 1));
  // 21 s: whatever is left goes in, then the page itself; the disk collapses, the hole evaporates
  time.at(21, () => {
    orbiters.forEach((o) => { if (!o.gone) swallow(o, true); });
    collapse = true;
    collapseAt = time.t;
    [drone, wind, shimmer, jetHiss].forEach((d) => d.gain(0.0001, 1.4));
    if (reduced) pageAnimation = site.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 1200, fill: 'forwards' });
    else pullIn = time.t;
    fx.noise({
      type: 'lowpass', f: 2000, f1: 80, dur: 1.4, gain: 0.22,
    });
    fx.tone({
      f: 120, f1: 40, dur: 1.3, gain: 0.15,
    });
  });
  time.at(22.2, () => { voidShown.value = true; });
  time.at(22.4, () => fx.noise({
    type: 'bandpass', f: 1200, f1: 6000, q: 0.7, dur: 0.6, gain: 0.25, attack: 0.58,
  }));
  // 23 s: the last point bursts into light
  time.at(23, () => {
    if (!reduced) {
      flash.value?.animate([{ opacity: 0 }, { opacity: 0.95, offset: 0.12 }, { opacity: 0 }], { duration: 950, easing: 'ease-out' });
      singularity.wave(time.t);
      singularity.burst(160, [60, 520], [2, 4], 0.8);
    }
    fx.noise({
      type: 'lowpass', f: 4000, f1: 60, dur: 2.2, gain: 0.45, attack: 0.01,
    });
    fx.tone({
      f: 70, f1: 30, dur: 1.4, gain: 0.4, attack: 0.01,
    });
    fx.tone({
      f: 3200, dur: 0.9, gain: 0.05,
    });
    meterFading.value = true;
  });
  time.at(24, () => wind.gain(0.0001, 0.1));
  time.at(DURATION, () => {
    maxHorizon.value = Math.round(maxRh);
    const seconds = (evaporatedAt || time.t) - collapseAt;
    evaporation.value = `${seconds.toFixed(1).replace('.', isEnglish.value ? '.' : ',')} s`;
    showFinal();
  });

  time.tick((t, dt) => {
    // The horizon grows toward its goal, then during the evaporation it shrinks to a point just
    // before the flash
    if (collapse) {
      rh = Math.max(0, rh - dt * Math.max(rh, 10 * k) * 1.5);
      if (!rh && !evaporatedAt) evaporatedAt = t;
    } else {
      rh += (goal - rh) * Math.min(1, dt * 3);
    }
    maxRh = Math.max(maxRh, rh);
    horizon.value = Math.round(rh);

    if (!collapse) {
      const pull = 1 + clamp((t - 3) / 14, 0, 1);
      for (const o of orbiters) {
        if (o.gone) continue;
        if (!o.active) {
          if (t < o.release || o.inside.some((other) => !other.gone)) continue;
          release(o);
        }
        if (reduced) continue;
        if (moveOrbiter(o, t, dt, rh, pull)) swallow(o, false);
        else renderOrbiter(o);
      }
    }

    // A slow swirl of the whole page around the hole, then the page itself spirals in
    if (!reduced) {
      if (pullIn >= 0) {
        const p = clamp((t - pullIn) / 1.3, 0, 1);
        turn(swirl + 220 * p ** 3, (1 - p) ** 3);
      } else if (t > 6 || shift) {
        swirl = clamp((t - 6) * 0.3, 0, 3.5);
        turn(swirl, 1);
      }
    }

    singularity.frame(t, dt, {
      rh,
      grid: t < 23 ? clamp((t - 1.2) / 3, 0, 1) * 0.2 : clamp(0.12 - (t - 23.5) * 0.05, 0, 0.12),
      jets: t < 17 ? 0 : t < 21 ? clamp((t - 17) / 0.8, 0, 1) : clamp(1 - (t - 21) / 0.8, 0, 1),
      collapse,
    });
  });
}

async function showFinal() {
  phase.value = 'final';
  meterShown.value = false;
  finalShown.value = true;
  await nextTick();
  finalWindow.value?.animate([{ transform: 'scale(.92)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: reduced ? 0 : 400, easing: 'cubic-bezier(.2,.8,.3,1)' });
  bangButton.value?.focus({ preventScroll: true });
}

// Big Bang: everything bursts out of the centre and back into place, then the page takes over
function bigBang() {
  if (phase.value !== 'final' || !page || !hole) return;
  phase.value = 'bang';
  clock?.stop();
  sfx?.close();
  sfx = createSfx();
  clock = startClock();
  const time = clock;
  const fx = sfx;
  const site = page;
  const singularity = hole;
  const X = window.innerWidth / 2;
  const Y = window.innerHeight / 2;
  const k = screenScale();
  finalWindow.value?.animate([{ transform: 'none', opacity: 1 }, { transform: 'scale(0) rotate(-120deg)', opacity: 0 }], { duration: reduced ? 200 : 350, easing: 'cubic-bezier(.7,0,.9,.6)', fill: 'forwards' });
  fx.noise({
    type: 'bandpass', f: 500, f1: 4000, q: 0.7, dur: 0.4, gain: 0.2, attack: 0.38,
  });
  time.at(0.4, () => {
    finalShown.value = false;
    voidShown.value = false;
    // The second screen is below the fold again: its originals come back as they are
    captures.slice(1).forEach((capture) => capture.restore());
    captures = captures.slice(0, 1);
    pageAnimation?.cancel();
    Object.assign(site.style, pageStyle);
    if (layer.value) layer.value.style.transform = '';
    singularity.clear();
    fx.noise({
      type: 'lowpass', f: 3000, f1: 80, dur: 1.2, gain: 0.3, attack: 0.01,
    });
    [523.3, 659.3, 784, 1046.5].forEach((f, i) => fx.tone({
      f, dur: 1.4, gain: 0.04, attack: 0.02, delay: 0.15 + i * 0.09,
    }));
    if (reduced) {
      pageAnimation = site.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 600 });
    } else {
      singularity.flare(time.t);
      singularity.burst(300, [150, 900], [0.8, 1.6], 1.6);
      site.style.transformOrigin = `${X}px ${Y}px`;
      pageAnimation = site.animate([
        { transform: 'scale(0) rotate(-200deg)' },
        { transform: pageStyle.transform || 'none' },
      ], { duration: 1200, easing: 'cubic-bezier(.15,.9,.25,1.12)' });
    }
    orbiters.filter((o) => o.wave === 1).forEach((o) => {
      const { el } = o.body;
      el.getAnimations().forEach((animation) => animation.cancel());
      el.style.display = '';
      el.style.filter = '';
      const home = `translate(${o.body.homeX.toFixed(1)}px, ${o.body.homeY.toFixed(1)}px)`;
      el.style.transform = home;
      const delay = o.big ? rand(0, 0.15) : 0.1 + (o.r0 / (900 * k)) * 0.9 + rand(0, 0.15);
      if (reduced) {
        el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, delay: delay * 500, fill: 'backwards' });
        return;
      }
      el.animate([
        { transform: `translate(${(X - o.body.w0 / 2).toFixed(1)}px, ${(Y - o.body.h0 / 2).toFixed(1)}px) rotate(${Math.random() < 0.5 ? -360 : 360}deg) scale(0)` },
        { transform: home },
      ], {
        duration: 1000, delay: delay * 1000, easing: 'cubic-bezier(.15,.9,.25,1.12)', fill: 'backwards',
      });
    });
  });
  time.tick((t, dt) => singularity.frame(t, dt, {
    rh: 0, grid: 0, jets: 0, collapse: true,
  }));
  time.at(reduced ? 1.4 : 3.2, close);
}

// Escape cancels the confirmation; Tab stays inside the open dialog
function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && phase.value === 'confirm') {
    event.preventDefault();
    cancel();
    return;
  }
  if (event.key !== 'Tab' || phase.value === 'run' || phase.value === 'bang') return;
  const buttons = phase.value === 'confirm' ? [cancelButton.value, confirmButton.value] : [bangButton.value, muteButton.value];
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
/* The site's fonts have no monospace one: the system's, for the meter and the labels */
.terminal-font {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
}

/* The evaporation: white at the centre, warmer toward the edges */
.singularity-flash {
  background: radial-gradient(circle at 50% 50%, #fff 0 30%, rgb(255 250 230) 60%, rgb(255 240 200));
}
</style>
