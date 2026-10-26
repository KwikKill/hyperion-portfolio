<template>
  <!-- In #cyberpunkroot, next to the page, so the theme colours apply to the copies -->
  <Teleport to="#cyberpunkroot">
    <div class="pointer-events-none fixed inset-0 z-[60]" aria-hidden="true" inert>
      <!-- Copies of what is on screen, which float, then the liquid over them -->
      <div ref="layer" class="absolute inset-0"/>
      <canvas ref="canvas" class="absolute inset-0 size-full"/>
    </div>

    <div
      v-if="meterShown"
      class="terminal-font fixed left-7 top-20 z-[70] w-80 border border-terminal/80 bg-black/80 px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-terminal transition-opacity duration-500"
      :class="{ 'opacity-0': meterFading }"
      aria-hidden="true"
    >
      {{ isEnglish ? 'Buffer level' : 'Niveau du tampon' }}
      <b class="float-right tabular-nums text-white">{{ level }} %</b>
      <span class="mt-2 block h-1.5 bg-black">
        <span class="block h-full bg-gradient-to-r from-terminal to-secondary" :style="{ width: `${level}%` }"/>
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

    <!-- Confirmation: the gates open, then it slides down and drains away -->
    <div v-if="dialogShown" ref="backdrop" class="fixed inset-0 z-[80] grid place-items-center bg-black/70">
      <div
        ref="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="deluge-title"
        class="w-[37.5rem] max-w-[calc(100vw-2rem)] border-2 border-red-500 bg-black px-9 py-8 text-white shadow-[0_0_40px_rgb(239_68_68/0.3)]"
      >
        <p class="terminal-font text-[13px] font-semibold uppercase tracking-[0.16em] text-red-400">
          {{ isEnglish ? 'Self-destruct protocol' : 'Protocole d\'auto-destruction' }}
        </p>
        <h2 id="deluge-title" class="mb-4 mt-2.5 text-[2rem] font-extrabold uppercase leading-tight tracking-wide text-red-500">
          {{ isEnglish ? 'Open the floodgates?' : 'Ouvrir les vannes ?' }}
        </h2>
        <ul>
          <li class="terminal-font flex justify-between gap-5 border-b border-neutral-800 py-1.5 text-sm text-neutral-200">
            <span>{{ isEnglish ? 'Buffer gates' : 'Vannes du tampon' }}</span>
            <span class="font-semibold" :class="gatesOpen ? 'text-red-500' : 'text-green-400'">
              {{ gatesOpen ? (isEnglish ? 'OPEN' : 'OUVERTES') : (isEnglish ? 'CLOSED' : 'FERMÉES') }}
            </span>
          </li>
          <li class="terminal-font flex justify-between gap-5 border-b border-neutral-800 py-1.5 text-sm text-neutral-200">
            <span>{{ isEnglish ? 'Inflow' : 'Débit entrant' }}</span>
            <span class="font-semibold text-green-400">{{ isEnglish ? '1.2 GB/s' : '1,2 Go/s' }}</span>
          </li>
          <li class="terminal-font flex justify-between gap-5 border-b border-neutral-800 py-1.5 text-sm text-neutral-200">
            <span>{{ isEnglish ? 'Drain pump' : 'Pompe de vidange' }}</span>
            <span class="font-semibold text-red-500">{{ isEnglish ? 'out of order' : 'hors service' }}</span>
          </li>
        </ul>
        <p class="mt-4 text-sm text-red-400">
          {{ isEnglish ? 'No flash. Muffled sound during the submersion.' : 'Aucun flash. Son étouffé pendant la submersion.' }}
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
            data-umami-event="deluge-animation"
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
        aria-labelledby="deluge-final-title"
        class="w-[32.5rem] max-w-[calc(100vw-2rem)] rounded-md border-2 border-primary bg-bg text-text shadow-[0_0_24px_rgb(var(--color-primary)/0.35)]"
      >
        <div class="flex h-11 items-center gap-2.5 border-b border-primary/40 px-3.5 text-primary">
          <span class="size-3 bg-primary" aria-hidden="true"/>
          <h2 id="deluge-final-title" class="text-sm uppercase tracking-[0.06em]">
            {{ isEnglish ? 'System flooded' : 'Système noyé' }}
          </h2>
        </div>
        <dl class="terminal-font grid grid-cols-[1fr_auto] gap-x-5 gap-y-2.5 px-6 pb-1 pt-5 text-sm">
          <dt class="text-gray-400">{{ isEnglish ? 'Elements swept away' : 'Éléments emportés' }}</dt>
          <dd class="text-right tabular-nums text-primary">{{ stats.swept }}</dd>
          <template v-if="stats.splashes">
            <dt class="text-gray-400">{{ isEnglish ? 'Splashes' : 'Éclaboussures' }}</dt>
            <dd class="text-right tabular-nums text-primary">{{ stats.splashes }}</dd>
          </template>
          <dt class="text-gray-400">{{ isEnglish ? 'Peak level' : 'Niveau maximal' }}</dt>
          <dd class="text-right tabular-nums text-primary">100 %</dd>
        </dl>
        <button
          ref="dryButton"
          type="button"
          class="mx-auto mb-6 mt-5 block border-2 border-primary bg-bg px-7 py-3.5 font-semibold uppercase tracking-[0.1em] text-primary transition-colors hover:bg-primary/10"
          :disabled="phase !== 'final'"
          @click="dryOut"
        >
          {{ isEnglish ? 'Dry out' : 'Assécher' }}
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
  barsOf, captureScreen, type Body, type Capture, type Rect,
} from '@/utils/collapse';
import {
  createFlood, createLiquid, floatStep, renderBody, screenScale, toFloater,
  type Flood, type Floater, type Liquid,
} from '@/utils/deluge';
import { prefersReducedMotion } from '@/utils/motion';
import { findPage, lockScroll, themeColor } from '@/utils/selfDestructScreen';
import { startClock, type SequenceClock } from '@/utils/sequenceClock';
import {
  createSfx, isMuted, setMuted, type Sfx,
} from '@/utils/sfx';

const emit = defineEmits<{ close: [] }>();

const DURATION = 26;
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const ease = (p: number) => (p < 0.5 ? 2 * p * p : 1 - ((-2 * p + 2) ** 2) / 2);

const preferencesStore = usePreferencesStore();
const isEnglish = computed(() => preferencesStore.isEnglish);

type Phase = 'confirm' | 'run' | 'final' | 'dry';
const phase = ref<Phase>('confirm');
const dialogShown = ref(true);
const gatesOpen = ref(false);
const meterShown = ref(false);
const meterFading = ref(false);
const level = ref(0);
const finalShown = ref(false);
const stats = reactive({ swept: 0, splashes: 0 });
const muted = ref(isMuted());

const layer = ref<HTMLElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
const backdrop = ref<HTMLElement | null>(null);
const dialog = ref<HTMLElement | null>(null);
const cancelButton = ref<HTMLButtonElement | null>(null);
const confirmButton = ref<HTMLButtonElement | null>(null);
const muteButton = ref<HTMLButtonElement | null>(null);
const finalWindow = ref<HTMLElement | null>(null);
const dryButton = ref<HTMLButtonElement | null>(null);

// State of a run, outside Vue's reactivity
let clock: SequenceClock | null = null;
let sfx: Sfx | null = null;
let flood: Flood | null = null;
let capture: Capture | null = null;
let page: HTMLElement | null = null;
let pageFade: Animation | null = null;
let unlockScroll: (() => void) | null = null;
let opener: HTMLElement | null = null;
let reduced = false;

function toggleMute() {
  muted.value = !muted.value;
  setMuted(muted.value);
}

// The page as it was, without any copy left. Safe to call twice.
function restorePage() {
  capture?.restore();
  capture = null;
  pageFade?.cancel();
  pageFade = null;
  layer.value?.getAnimations().forEach((animation) => animation.cancel());
  flood?.clear();
}

function stopAll() {
  clock?.stop();
  clock = null;
  sfx?.close();
  sfx = null;
  restorePage();
  flood = null;
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
  unlockScroll = lockScroll();
  sfx = createSfx();
  flood = createFlood(canvas.value, themeColor('terminal', '74, 222, 128').replace(/\s/g, ''), reduced);
  clock = startClock();
  run(clock, sfx, flood, page, layer.value);
}

function run(time: SequenceClock, fx: Sfx, drawing: Flood, site: HTMLElement, debris: HTMLElement) {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const k = screenScale();
  const liquid = createLiquid();
  const floaters: Floater[] = [];
  let bodies: Body[] = [];
  let leak: Rect | null = null;
  let lastPlip = 0;
  let lastSplash = 0;

  const seg = (t: number, t0: number, t1: number, a: number, b: number) => a + (b - a) * ease(clamp((t - t0) / (t1 - t0), 0, 1));
  // Rises in two steps, covers everything, then the drain takes it down
  const levelAt = (t: number) => {
    if (t < 2) return H + 30;
    if (t < 8) return seg(t, 2, 8, H + 30, H * 0.58);
    if (t < 15) return seg(t, 8, 15, H * 0.58, H * 0.22);
    if (t < 20.5) return seg(t, 15, 17.5, H * 0.22, -70);
    return -70 + (H + 220) * clamp((t - 20.5) / 3, 0, 1) ** 2;
  };
  // Height of the swell: none when the system asks for less motion
  const ampAt = (t: number) => {
    if (reduced || t < 2) return 0;
    if (t < 8) return seg(t, 2, 8, 0, 14 * k);
    if (t < 15) return seg(t, 8, 10, 14 * k, 55 * k);
    if (t < 20.5) return seg(t, 15, 17.5, 55 * k, 18 * k);
    return seg(t, 20.5, 22, 18 * k, 0);
  };

  function splash(x: number, v: number, width: number) {
    stats.splashes += 1;
    liquid.poke(x, Math.min(260 * k, v * 0.35), Math.max(30, width));
    for (let i = 0; i < Math.min(14, 3 + v / 60); i += 1) {
      drawing.spray({
        x: x + rand(-width / 2, width / 2), y: liquid.at(x) - 2, vx: rand(-120, 120) * k, vy: -rand(150, 420) * k, g: 1300 * k, life: rand(0.5, 1),
      });
    }
    if (time.t - lastSplash > 0.06) {
      lastSplash = time.t;
      fx.noise({
        type: 'bandpass', f: rand(900, 1800), q: 0.8, dur: 0.25 + Math.min(0.4, width / 900), gain: Math.min(0.22, 0.05 + v / 4000), pan: (x / W) * 2 - 1,
      });
    }
  }

  // The liquid reaches an element: it comes loose. A window comes apart into sides that float like
  // planks.
  function release(b: Body) {
    if (b.active || b.off) return;
    if (b.kind === 'frame' && b.sides.length >= 3) {
      barsOf(debris, b).forEach((bar) => {
        Object.assign(bar, { active: true, vx: rand(-30, 30) * k, lying: bar.h0 > bar.w0 });
        if (bar.lying) bar.a = Math.PI / 2;
        floaters.push(toFloater(bar));
      });
      return;
    }
    b.active = true;
    b.vx = rand(-30, 30) * k;
    b.vy = rand(-20, 10) * k;
    if (b.h0 > b.w0 * 1.15) b.lying = true;
  }

  // 0 s: the gates open, then the dialog slides down and drains away
  time.at(0, () => {
    gatesOpen.value = true;
    dialog.value?.animate(
      reduced ? [{ opacity: 1 }, { opacity: 0 }] : [{ transform: 'none', opacity: 1 }, { transform: 'translateY(120px)', opacity: 0 }],
      { duration: 700, easing: 'cubic-bezier(.5,0,.9,.5)', fill: 'forwards' },
    );
    backdrop.value?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 700, fill: 'forwards' });
    fx.noise({
      type: 'bandpass', f: 600, f1: 2400, q: 1, dur: 0.8, gain: 0.1,
    });
  });
  time.at(0.75, () => { dialogShown.value = false; });
  time.at(0.8, () => { meterShown.value = true; });

  // 0.3 s: everything on screen becomes a body, still in place until the liquid reaches it. The
  // leak runs from the largest window (the terminal).
  time.at(0.3, () => {
    capture = captureScreen(site, debris);
    bodies = capture.bodies;
    bodies.forEach(renderBody);
    stats.swept = bodies.length;
    if (!reduced) bodies.forEach((b) => floaters.push(toFloater(b)));
    const [largest] = bodies.filter((b) => b.kind === 'frame').sort((a, b) => b.w0 * b.h0 - a.w0 * a.h0);
    if (largest) {
      leak = {
        x: largest.homeX, y: largest.homeY, w: largest.w0, h: largest.h0,
      };
    }
  });

  // Sound bed: the flow rises, waves roll, everything is muffled under the liquid, then the drain
  // gurgles
  const flow = fx.drone({ brown: true, filter: 'lowpass', f: 420 });
  time.at(1.6, () => flow.gain(0.14, 4));
  time.at(8, () => {
    flow.gain(0.24, 3);
    flow.filter(700, 3);
  });
  for (let t = 8.6; t < 15; t += rand(1.8, 2.6)) {
    time.at(t, () => fx.noise({
      type: 'bandpass', f: 280, f1: 1300, q: 0.7, dur: 1.7, gain: 0.16, attack: 0.6, pan: rand(-0.5, 0.5),
    }));
  }
  time.at(16, () => fx.muffle(520, 1.2));
  for (let t = 16; t < 20.4; t += rand(0.15, 0.45)) {
    time.at(t, () => fx.tone({
      f: rand(300, 700), f1: rand(800, 1400), dur: 0.07, gain: 0.05, pan: rand(-0.7, 0.7),
    }));
  }
  // 18 s: under the liquid, what is left of the page (its backgrounds) dissolves
  time.at(18, () => {
    pageFade = site.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 2000, fill: 'forwards' });
    if (reduced) debris.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 2000, fill: 'forwards' });
  });
  time.at(20.5, () => {
    fx.muffle(20000, 1.8);
    flow.filter(1600, 1);
    flow.gain(0.3, 0.5);
    fx.noise({
      type: 'lowpass', f: 1400, f1: 70, dur: 3.2, gain: 0.28, attack: 0.2,
    });
  });
  for (let t = 20.6; t < 23.4; t += rand(0.12, 0.22)) {
    time.at(t, () => fx.tone({
      f: rand(90, 170), f1: rand(50, 80), dur: 0.12, gain: 0.12,
    }));
  }
  time.at(23.4, () => flow.gain(0.0001, 0.8));
  time.at(25, () => { meterFading.value = true; });
  time.at(DURATION, showFinal);

  time.tick((t, dt) => {
    liquid.level = levelAt(t);
    liquid.amp = ampAt(t);
    liquid.phase += dt * (1.6 + liquid.amp / (40 * k));
    liquid.step(dt);

    if (!reduced) {
      // The leak: drops from the terminal and the top edge, then a few more until the storm
      const rate = t < 2 ? 22 : t < 9 ? 8 : 0;
      if (leak && Math.random() < dt * rate) drawing.drop(rand(leak.x + 20, leak.x + leak.w - 20), leak.y + leak.h, rand(0, 60));
      if (Math.random() < dt * (t < 9 ? 6 : 0)) drawing.drop(rand(0, W), 0, rand(0, 60));
      for (const b of bodies) if (!b.active && !b.off && liquid.at(b.cx) < b.cy) release(b);
      floatStep(floaters, liquid, t, dt, (b, speed) => splash(b.cx, speed, b.w0));
      floaters.forEach(({ body }) => { if (!body.off) renderBody(body); });
      // Bubbles from whatever is under the liquid
      if (t > 15 && t < 20.5 && Math.random() < dt * 25) {
        const b = floaters[Math.floor(Math.random() * floaters.length)]?.body;
        if (b && !b.off) {
          drawing.spray({
            kind: 'bubble', x: b.cx + rand(-10, 10), y: b.cy, vy: -rand(60, 140) * k, r: rand(2, 5), life: 3,
          });
        }
      }
      // Drips on the empty screen at the end
      if (t > 23 && t < 25.5 && Math.random() < dt * 14) {
        const y = rand(0, H * 0.4);
        drawing.spray({
          kind: 'drip', x: rand(20, W - 20), y0: y, y, vy: rand(30, 80), life: rand(1.5, 2.8),
        });
      }
    }
    level.value = Math.round(clamp((H - liquid.level) / H, 0, 1) * 100);
    drawing.frame(dt, liquid, (x) => {
      liquid.poke(x, 40 * k, 16);
      if (t - lastPlip > 0.045) {
        lastPlip = t;
        fx.tone({
          f: rand(1000, 1600), f1: rand(500, 800), dur: 0.05, gain: 0.05, pan: (x / W) * 2 - 1,
        });
      }
    });
  });
}

async function showFinal() {
  phase.value = 'final';
  meterShown.value = false;
  finalShown.value = true;
  await nextTick();
  finalWindow.value?.animate([{ transform: 'translateY(40px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: reduced ? 0 : 450, easing: 'cubic-bezier(.2,.8,.3,1)' });
  dryButton.value?.focus({ preventScroll: true });
}

// Drying out: the liquid rushes up over the screen, the site comes back underneath, then the liquid
// drains away and leaves it intact, a few drops still hanging
function dryOut() {
  if (phase.value !== 'final' || !flood) return;
  phase.value = 'dry';
  clock?.stop();
  sfx?.close();
  sfx = createSfx();
  clock = startClock();
  const time = clock;
  const fx = sfx;
  const drawing = flood;
  const H = window.innerHeight;
  const k = screenScale();
  const liquid: Liquid = createLiquid();
  let sources: Rect[] = [];
  finalWindow.value?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' });
  fx.noise({
    type: 'bandpass', f: 300, f1: 1500, q: 0.7, dur: 0.6, gain: 0.14,
  });
  time.at(0.5, () => {
    finalShown.value = false;
    sources = capture?.bodies.filter((b) => b.kind === 'leaf').map((b) => ({
      x: b.homeX, y: b.homeY, w: b.w0, h: b.h0,
    })) ?? [];
    restorePage();
    fx.noise({
      type: 'lowpass', f: 1500, f1: 80, dur: 1.8, gain: 0.22, attack: 0.1,
    });
  });
  time.tick((t, dt) => {
    liquid.level = t < 0.5 ? (H + 30) - (H + 110) * ease(clamp(t / 0.5, 0, 1)) : -80 + (H + 240) * clamp((t - 0.6) / 1.7, 0, 1) ** 2;
    liquid.amp = !reduced && t < 2.2 ? 10 * k : 0;
    liquid.phase += dt * 2;
    liquid.step(dt);
    // As the level passes below an element, a drop runs from it
    if (!reduced && sources.length && t > 1 && t < 2.6 && Math.random() < dt * 18) {
      const s = sources[Math.floor(Math.random() * sources.length)];
      if (s && liquid.at(s.x) > s.y + s.h) {
        const y = s.y + s.h;
        drawing.spray({
          kind: 'drip', x: s.x + rand(4, Math.max(5, s.w - 4)), y0: y, y, vy: rand(20, 60), life: rand(0.8, 1.5),
        });
        fx.tone({
          f: rand(1000, 1600), f1: rand(500, 800), dur: 0.05, gain: 0.03,
        });
      }
    }
    drawing.frame(dt, liquid, () => {});
  });
  time.at(3.1, close);
}

// Escape cancels the confirmation; Tab stays inside the open dialog
function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && phase.value === 'confirm') {
    event.preventDefault();
    cancel();
    return;
  }
  if (event.key !== 'Tab' || phase.value === 'run' || phase.value === 'dry') return;
  const buttons = phase.value === 'confirm' ? [cancelButton.value, confirmButton.value] : [dryButton.value, muteButton.value];
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
</style>
