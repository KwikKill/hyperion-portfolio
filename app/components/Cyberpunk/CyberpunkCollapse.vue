<template>
  <!-- In #cyberpunkroot, next to the page: the page can shake and fall without taking this along,
       and the theme colours still apply -->
  <Teleport to="#cyberpunkroot">
    <!-- Copies of the page and the cracks, over the real page -->
    <div ref="stage" class="pointer-events-none fixed inset-0 z-[60]" aria-hidden="true" inert>
      <div ref="layer" class="absolute inset-0"/>
      <canvas ref="canvas" class="absolute inset-0 size-full"/>
    </div>

    <template v-if="hudShown">
      <div class="collapse-edge pointer-events-none fixed inset-0 z-[70] transition-opacity duration-500" :class="{ 'opacity-0': hudFading }"/>
      <div
        class="font-mono fixed left-7 top-20 z-[70] w-80 border border-red-500 bg-black/80 px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-red-400 transition-opacity duration-500"
        :class="{ 'opacity-0': hudFading }"
        aria-hidden="true"
      >
        {{ isEnglish ? 'Structural integrity' : 'Intégrité structurelle' }}
        <b class="float-right tabular-nums text-white">{{ integrity }} %</b>
        <span class="mt-2 block h-1.5 bg-red-950">
          <span class="block h-full bg-gradient-to-r from-red-500 to-primary transition-[width] duration-200" :style="{ width: `${integrity}%` }"/>
        </span>
      </div>
    </template>

    <button
      v-if="phase !== 'confirm'"
      ref="muteButton"
      type="button"
      class="font-mono fixed right-7 top-20 z-[80] border border-primary/60 bg-bg/90 px-3 py-2 text-xs uppercase tracking-wider text-primary transition-colors hover:border-primary"
      :aria-pressed="!muted"
      @click="toggleMute"
    >
      {{ muted ? (isEnglish ? 'Sound off' : 'Son coupé') : (isEnglish ? 'Sound on' : 'Son activé') }}
    </button>

    <!-- Confirmation: the anchors give way one by one, then the dialog falls too -->
    <div v-if="dialogShown" ref="backdrop" class="fixed inset-0 z-[80] grid place-items-center bg-black/70">
      <div
        ref="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="collapse-title"
        class="w-[37.5rem] max-w-[calc(100vw-2rem)] border-2 border-red-500 bg-black px-9 py-8 text-white shadow-[0_0_40px_rgb(239_68_68/0.3)]"
      >
        <p class="font-mono text-[13px] font-semibold uppercase tracking-[0.16em] text-red-400">
          {{ isEnglish ? 'Self-destruct protocol' : 'Protocole d\'auto-destruction' }}
        </p>
        <h2 id="collapse-title" class="mb-4 mt-2.5 text-[2rem] font-extrabold uppercase leading-tight tracking-wide text-red-500">
          {{ isEnglish ? 'Disable the anchors?' : 'Désactiver les ancrages ?' }}
        </h2>
        <ul>
          <li
            v-for="anchor in anchors"
            :key="anchor.label"
            class="font-mono flex justify-between gap-5 border-b border-neutral-800 py-1.5 text-sm text-neutral-200"
          >
            <code>{{ anchorLabel(anchor) }}</code>
            <span class="font-semibold" :class="anchor.released ? 'text-red-500' : 'text-green-400'">{{ anchorStatus(anchor) }}</span>
          </li>
        </ul>
        <p class="mt-4 text-sm text-red-400">
          {{ isEnglish ? 'Screen shakes, no flash.' : 'Secousses d\'écran, aucun flash.' }}
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
            data-umami-event="collapse-animation"
            @click="confirm"
          >
            {{ isEnglish ? 'Confirm' : 'Confirmer' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Final screen, with the real count of what fell -->
    <div v-if="phase === 'final'" class="fixed inset-0 z-[80] grid place-items-center">
      <div
        ref="finalWindow"
        role="dialog"
        aria-modal="true"
        aria-labelledby="collapse-final-title"
        class="w-[32.5rem] max-w-[calc(100vw-2rem)] rounded-md border-2 border-primary bg-bg text-text shadow-[0_0_24px_rgb(var(--color-primary)/0.35)]"
      >
        <div class="flex h-11 items-center gap-2.5 border-b border-primary/40 px-3.5 text-primary">
          <span class="size-3 bg-primary" aria-hidden="true"/>
          <h2 id="collapse-final-title" class="text-sm uppercase tracking-[0.06em]">
            {{ isEnglish ? 'System collapsed' : 'Système effondré' }}
          </h2>
        </div>
        <dl class="font-mono grid grid-cols-[1fr_auto] gap-x-5 gap-y-2.5 px-6 pb-1 pt-5 text-sm">
          <dt class="text-gray-400">{{ isEnglish ? 'Elements fallen' : 'Éléments tombés' }}</dt>
          <dd class="text-right tabular-nums text-primary">{{ stats.total }}</dd>
          <dt class="text-gray-400">{{ isEnglish ? 'Impacts' : 'Impacts' }}</dt>
          <dd class="text-right tabular-nums text-primary">{{ stats.impacts }}</dd>
          <dt class="text-gray-400">{{ isEnglish ? 'Still standing' : 'Encore debout' }}</dt>
          <dd class="text-right tabular-nums text-primary">0</dd>
        </dl>
        <button
          ref="rebuildButton"
          type="button"
          class="mx-auto mb-6 mt-5 block border-2 border-primary bg-bg px-7 py-3.5 font-semibold uppercase tracking-[0.1em] text-primary transition-colors hover:bg-primary/10"
          @click="rebuild"
        >
          {{ isEnglish ? 'Rebuild' : 'Reconstruire' }}
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
  captureScreen, crackSeeds, createEffects, createWorld, scanScreen,
  type Body, type Capture, type Effects, type Rect, type World,
} from '@/utils/collapse';
import { prefersReducedMotion } from '@/utils/motion';
import { findPage, lockScroll, primaryColor } from '@/utils/selfDestructScreen';
import { startClock, type SequenceClock } from '@/utils/sequenceClock';
import {
  createSfx, isMuted, setMuted, type Sfx,
} from '@/utils/sfx';

const emit = defineEmits<{ close: [] }>();

const DURATION = 26;
const rand = (a: number, b: number) => a + Math.random() * (b - a);

const preferencesStore = usePreferencesStore();
const isEnglish = computed(() => preferencesStore.isEnglish);

type Phase = 'confirm' | 'run' | 'final' | 'rebuild';
const phase = ref<Phase>('confirm');
const dialogShown = ref(true);
const hudShown = ref(false);
const hudFading = ref(false);
const integrity = ref(100);
const muted = ref(isMuted());
const stats = reactive({ total: 0, impacts: 0 });

interface Anchor { label: string; gravity: boolean; released: boolean }
const anchors = reactive<Anchor[]>([
  { label: 'header.fixed', gravity: false, released: false },
  { label: 'grid.hero', gravity: false, released: false },
  { label: 'flex.gap', gravity: false, released: false },
  { label: 'position: relative', gravity: false, released: false },
  { label: '', gravity: true, released: false },
]);
const anchorLabel = (anchor: Anchor) => {
  if (!anchor.gravity) return anchor.label;
  return isEnglish.value ? 'gravity' : 'gravité';
};
function anchorStatus(anchor: Anchor) {
  if (anchor.gravity) {
    if (anchor.released) return isEnglish.value ? 'DISABLED' : 'DÉSACTIVÉE';
    return isEnglish.value ? 'UNDER CONTROL' : 'SOUS CONTRÔLE';
  }
  if (anchor.released) return isEnglish.value ? 'RELEASED' : 'LIBÉRÉ';
  return isEnglish.value ? 'ANCHORED' : 'ANCRÉ';
}

const stage = ref<HTMLElement | null>(null);
const layer = ref<HTMLElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
const backdrop = ref<HTMLElement | null>(null);
const dialog = ref<HTMLElement | null>(null);
const cancelButton = ref<HTMLButtonElement | null>(null);
const confirmButton = ref<HTMLButtonElement | null>(null);
const finalWindow = ref<HTMLElement | null>(null);
const rebuildButton = ref<HTMLButtonElement | null>(null);
const muteButton = ref<HTMLButtonElement | null>(null);

// State of a run, outside Vue's reactivity
let clock: SequenceClock | null = null;
let sfx: Sfx | null = null;
let capture: Capture | null = null;
let world: World | null = null;
let effects: Effects | null = null;
let page: HTMLElement | null = null;
let pageFall: Animation | null = null;
let pageTransform = '';
let unlockScroll: (() => void) | null = null;
let opener: HTMLElement | null = null;
let reduced = false;

function toggleMute() {
  muted.value = !muted.value;
  setMuted(muted.value);
}

function boom(gain: number) {
  if (!sfx) return;
  sfx.noise({
    type: 'highpass', f: 2200, dur: 0.06, gain: gain * 0.5,
  });
  sfx.noise({
    type: 'lowpass', f: 4500, f1: 60, dur: 2.4, gain, attack: 0.01,
  });
  sfx.tone({
    f: 70, f1: 26, dur: 1.6, gain: gain * 0.8, attack: 0.01,
  });
}

// Everything back as it was: the real page, its scroll, its position. Safe to call twice.
function restorePage() {
  clock?.stop();
  clock = null;
  sfx?.close();
  sfx = null;
  capture?.restore();
  capture = null;
  world = null;
  effects?.clear();
  effects = null;
  pageFall?.cancel();
  pageFall = null;
  if (page) page.style.transform = pageTransform;
  page = null;
  if (stage.value) stage.value.style.transform = '';
  unlockScroll?.();
  unlockScroll = null;
}

function close() {
  restorePage();
  emit('close');
  // Back to the button or the terminal that opened the sequence, without scrolling to it
  opener?.focus({ preventScroll: true });
}

function cancel() {
  if (phase.value === 'confirm') close();
}

function confirm() {
  if (phase.value !== 'confirm' || !layer.value || !canvas.value || !stage.value) return;
  phase.value = 'run';
  reduced = prefersReducedMotion();
  page = findPage();
  if (!page) {
    close();
    return;
  }
  pageTransform = page.style.transform;
  unlockScroll = lockScroll();
  sfx = createSfx();
  effects = createEffects(canvas.value, primaryColor());
  clock = startClock();
  run(clock, sfx, effects, page, layer.value, stage.value);
}

function run(time: SequenceClock, fx: Sfx, fxCanvas: Effects, target: HTMLElement, debris: HTMLElement, scene: HTMLElement) {
  const H = window.innerHeight;
  const W = window.innerWidth;
  let tremor = 0;
  let released = 0;
  let crumbs: Rect[] = [];
  const shakes: { amp: number; start: number; dur: number }[] = [];
  const shake = (amp: number, dur: number) => {
    if (!reduced) shakes.push({ amp, start: time.t, dur });
  };

  function release(body: Body) {
    if (!world?.release(body) || !stats.total) return;
    released += 1;
    integrity.value = Math.round(100 * Math.max(0, 1 - released / stats.total));
  }
  function shakeThenRelease(body: Body, at: number) {
    body.relAt = at;
    time.at(at - 0.35, () => { if (!body.active && !reduced) body.wob = time.t; });
    time.at(at, () => release(body));
  }
  function impact(body: Body, speed: number) {
    stats.impacts += 1;
    const halfWidth = (body.lying ? body.h0 : body.w0) / 2;
    const ground = body.cy + (body.lying ? body.w0 : body.h0) / 2;
    for (let i = 0; i < Math.min(10, 2 + Math.floor(speed / 300)); i += 1) {
      fxCanvas.dust({
        x: body.cx + rand(-halfWidth, halfWidth), y: ground, vx: rand(-110, 110), vy: rand(-150, -30), g: 480, drag: 2.5, size: rand(2, 5), color: 'rgba(170,170,160,.6)', life: rand(0.6, 1.2), circle: true,
      });
    }
    const mass = Math.sqrt(body.w0 * body.h0) / 60;
    fx.noise({
      type: 'lowpass', f: 160 + Math.min(speed, 2000) / 4, dur: 0.12 + Math.min(0.25, body.w0 / 2500), gain: Math.min(0.32, 0.04 + (speed / 6000) * mass), pan: (body.cx / W) * 2 - 1,
    });
    shake(Math.min(3.5, (speed / 900) * mass), 0.18);
  }
  const insideHeader = (body: Body) => {
    const header = capture?.header?.src;
    return !!header && !!body.src && body !== capture?.header && header.contains(body.src);
  };

  // 0 → 1.2 s: the anchors give way one by one, then the dialog falls
  anchors.forEach((anchor, i) => time.at(0.15 + i * 0.2, () => {
    anchor.released = true;
    fx.tone({
      type: 'square', f: 260 - i * 30, dur: 0.07, gain: 0.05,
    });
  }));
  time.at(1.2, () => {
    dialog.value?.animate([
      { transform: 'none' },
      { transform: 'translateY(26px) rotate(-3deg)', offset: 0.3 },
      { transform: `translateY(${H}px) rotate(14deg)` },
    ], { duration: 1000, easing: 'cubic-bezier(.5,0,.9,.4)', fill: 'forwards' });
    backdrop.value?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 800, fill: 'forwards' });
    fx.noise({
      type: 'lowpass', f: 380, dur: 0.4, gain: 0.18, delay: 0.6,
    });
  });
  time.at(2.2, () => { dialogShown.value = false; });
  time.at(2.3, () => { hudShown.value = true; });

  // A rumble, a growing tremor and low creaks
  const rumble = fx.drone({ brown: true, filter: 'lowpass', f: 110 });
  time.at(1.2, () => rumble.gain(0.5, 5));
  if (!reduced) time.tween(1.2, 5.8, (p) => { tremor = 2.6 * p; });
  for (let t = 1.8; t < 16; t += rand(0.9, 1.7)) {
    time.at(t, () => fx.tone({
      type: 'sawtooth', f: rand(70, 120), f1: rand(45, 70), dur: rand(0.5, 1), gain: 0.03, attack: 0.15, pan: rand(-0.6, 0.6),
    }));
  }

  // Cracks from the corners of the boxes on screen and along the header, then crumbs falling off the text
  if (!reduced) {
    time.at(1.6, () => {
      target.style.transform = pageTransform;
      const scan = scanScreen(target);
      crackSeeds(scan).forEach(([x, y, angle], i) => {
        const start = 1.6 + i * 0.4 + rand(0, 0.3);
        fxCanvas.crack(x, y, angle, rand(120, 260), start);
        time.at(start, () => fx.noise({
          type: 'highpass', f: rand(2500, 4500), dur: 0.04, gain: 0.07, pan: (x / W) * 2 - 1,
        }));
      });
      crumbs = scan.leaves.map((el) => {
        const r = el.getBoundingClientRect();
        return {
          x: r.left, y: r.top, w: r.width, h: r.height,
        };
      });
    });
  }

  // 3.9 s: everything on screen becomes a body, measured without the shake offset
  time.at(3.9, () => {
    target.style.transform = pageTransform;
    capture = captureScreen(target, debris);
    world = createWorld(debris, capture.bodies, { reduced, impact });
    stats.total = capture.bodies.length;
    capture.bodies.forEach((body) => world?.render(body));
  });

  // 4 s: what is in the header drops, then the bar swings and falls
  time.at(4, () => {
    world?.bodies.filter(insideHeader).forEach((body, i) => time.after(i * 0.11, () => release(body)));
    fx.noise({
      type: 'highpass', f: 1600, dur: 0.1, gain: 0.1,
    });
  });
  time.at(4.9, () => {
    const header = capture?.header;
    if (!header || !world) return;
    world.startSwing(header);
    fx.tone({
      type: 'sawtooth', f: 95, f1: 55, dur: 1.3, gain: 0.045, attack: 0.25,
    });
  });
  time.at(6.3, () => {
    const header = capture?.header;
    if (!header || !world?.letGo(header) || !stats.total) return;
    released += 1;
    integrity.value = Math.round(100 * Math.max(0, 1 - released / stats.total));
    fx.noise({
      type: 'highpass', f: 1800, dur: 0.08, gain: 0.12,
    });
  });

  // 7 → 17 s: the cascade, top to bottom, faster and faster; boxes go once emptied
  time.at(7, () => {
    if (!world) return;
    const rest = world.bodies.filter((body) => body.kind === 'leaf' && !body.active && !body.off && !insideHeader(body));
    const keys = new Map(rest.map((body) => [body, body.cy + rand(-60, 60)]));
    rest.sort((a, b) => (keys.get(a) ?? 0) - (keys.get(b) ?? 0));
    rest.forEach((body, i) => shakeThenRelease(body, 7.35 + 9 * (i / rest.length) ** 0.75));
    // The smaller boxes first, so a box inside another goes before it
    const frames = world.bodies.filter((body) => body.kind === 'frame' && !body.active && !body.off && !insideHeader(body))
      .sort((a, b) => a.w0 * a.h0 - b.w0 * b.h0);
    frames.forEach((frame) => {
      const inside = world?.bodies.filter((body) => body !== frame && body.relAt && body.src && frame.src?.contains(body.src)) ?? [];
      const last = inside.length ? Math.max(...inside.map((body) => body.relAt)) : 7.35 + 9 * Math.min(1, Math.max(0, frame.cy / H)) ** 0.75;
      shakeThenRelease(frame, Math.min(16.9, last + 0.6));
    });
  });

  // 20 s: the floor gives way from the middle
  time.at(20, () => {
    fxCanvas.breakFloor(time.t);
    fx.noise({
      type: 'highpass', f: 1400, dur: 0.3, gain: 0.25,
    });
    shake(8, 0.8);
    world?.bodies.forEach((body) => {
      if (body.off) return;
      const distance = Math.abs(body.cx - W / 2) / (W / 2);
      time.at(20.5 + distance * 1.4, () => world?.dropThrough(body));
    });
  });
  time.at(20.5, () => {
    boom(0.55);
    rumble.gain(0.85, 0.4);
    rumble.filter(220, 0.5);
    shake(6, 1.6);
  });
  time.at(22.4, () => rumble.gain(0.0001, 2.5));
  // What is left of the page (backgrounds) falls in turn
  time.at(22.6, () => {
    pageFall = target.animate(
      reduced ? [{ opacity: 1 }, { opacity: 0 }] : [{ transform: 'none', opacity: 1 }, { transform: `translateY(${H * 0.9}px)`, opacity: 0 }],
      { duration: 1500, easing: 'cubic-bezier(.55,0,1,.45)', fill: 'forwards' },
    );
    fx.noise({
      brown: true, type: 'lowpass', f: 300, f1: 60, dur: 1.6, gain: 0.3,
    });
  });
  time.at(23.4, () => { hudFading.value = true; });
  time.at(24.3, () => fx.drone({ filter: 'bandpass', f: 520, q: 0.9 }).gain(0.045, 1.5));
  time.at(DURATION, showFinal);

  time.tick((t, dt) => {
    // The page and its copies shake together
    if (!reduced) {
      let amp = tremor;
      for (let i = shakes.length - 1; i >= 0; i -= 1) {
        const s = shakes[i];
        if (!s) continue;
        const k = (t - s.start) / s.dur;
        if (k >= 1) shakes.splice(i, 1);
        else amp += s.amp * (1 - k);
      }
      const offset = amp < 0.15 ? '' : `translate(${rand(-amp, amp).toFixed(1)}px, ${rand(-amp, amp).toFixed(1)}px)`;
      target.style.transform = offset || pageTransform;
      scene.style.transform = offset;
    }
    if (crumbs.length && t > 2.5 && t < 7 && Math.random() < dt * 16) {
      const r = crumbs[Math.floor(Math.random() * crumbs.length)];
      if (r) {
        fxCanvas.dust({
          x: r.x + rand(0, r.w), y: r.y + r.h, vx: rand(-15, 15), vy: rand(0, 40), g: 1100, size: rand(1.5, 3), life: 1.4,
          color: Math.random() < 0.5 ? `rgba(${primaryColor()},.8)` : 'rgba(200,200,200,.7)',
        });
      }
    }
    world?.frame(t, dt);
    fxCanvas.frame(t, dt, t > 7);
  });
}

async function showFinal() {
  phase.value = 'final';
  hudShown.value = false;
  await nextTick();
  finalWindow.value?.animate([
    { transform: `translateY(${-window.innerHeight}px)`, easing: 'cubic-bezier(.5,0,1,.5)' },
    { transform: 'translateY(0)', offset: 0.6, easing: 'cubic-bezier(0,.5,.5,1)' },
    { transform: 'translateY(-26px)', offset: 0.78, easing: 'cubic-bezier(.5,0,1,.5)' },
    { transform: 'translateY(0)' },
  ], { duration: reduced ? 0 : 900 });
  clock?.after(0.54, () => sfx?.noise({
    type: 'lowpass', f: 260, dur: 0.16, gain: 0.22,
  }));
  rebuildButton.value?.focus({ preventScroll: true });
}

// Everything falls back from above into place, bottom first, with a small bounce
function rebuild() {
  if (phase.value !== 'final' || !world) return;
  phase.value = 'rebuild';
  clock?.stop();
  sfx?.close();
  sfx = createSfx();
  clock = startClock();
  effects?.clear();
  pageFall?.cancel();
  pageFall = null;
  if (page) page.style.transform = pageTransform;
  if (stage.value) stage.value.style.transform = '';
  const H = window.innerHeight;
  const W = window.innerWidth;
  const time = clock;
  const fx = sfx;
  let lastThud = 0;
  world.bodies.forEach((body) => {
    if (body.kind === 'bar') {
      body.el.remove();
      return;
    }
    body.el.getAnimations().forEach((animation) => animation.cancel());
    body.el.style.display = '';
    const home = `translate(${body.homeX.toFixed(1)}px, ${body.homeY.toFixed(1)}px)`;
    body.el.style.transform = `${home} rotate(0rad)`;
    const delay = (body.kind === 'leaf' ? 0.25 : 0) + (1 - (body.homeY + body.h0) / H) * 1.3 + rand(0, 0.15);
    if (reduced) {
      body.el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, delay: delay * 1000, fill: 'backwards' });
      return;
    }
    body.el.animate([
      { transform: `translate(${body.homeX.toFixed(1)}px, ${(-(body.h0 + 80)).toFixed(1)}px) rotate(${rand(-8, 8).toFixed(1)}deg)`, easing: 'cubic-bezier(.5,0,1,.5)' },
      { transform: `${home} rotate(0deg)`, offset: 0.62, easing: 'cubic-bezier(0,.5,.5,1)' },
      { transform: `translate(${body.homeX.toFixed(1)}px, ${(body.homeY - Math.min(14, body.h0 * 0.2)).toFixed(1)}px) rotate(0deg)`, offset: 0.8, easing: 'cubic-bezier(.5,0,1,.5)' },
      { transform: `${home} rotate(0deg)` },
    ], { duration: 750, delay: delay * 1000, fill: 'backwards' });
    time.at(delay + 0.465, () => {
      // One thud at a time, louder for the boxes
      if (time.t - lastThud < 0.045) return;
      lastThud = time.t;
      fx.noise({
        type: 'lowpass', f: 260, dur: 0.12, gain: body.kind === 'leaf' ? 0.07 : 0.22, pan: ((body.homeX + body.w0 / 2) / W) * 2 - 1,
      });
    });
  });
  // The real page takes over once every copy has landed
  time.at(3.1, close);
}

// Escape cancels the confirmation; Tab stays inside the open dialog
function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && phase.value === 'confirm') {
    event.preventDefault();
    cancel();
    return;
  }
  if (event.key !== 'Tab') return;
  const buttons = phase.value === 'confirm' ? [cancelButton.value, confirmButton.value] : [rebuildButton.value, muteButton.value];
  const focusable = buttons.filter((button): button is HTMLButtonElement => !!button && !button.disabled);
  if (!focusable.length || phase.value === 'run' || phase.value === 'rebuild') return;
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
  restorePage();
});
</script>

<style scoped>
/* Red edges pulsing around the screen during the collapse */
.collapse-edge {
  box-shadow: inset 0 0 0 3px rgb(239 68 68 / 0.6), inset 0 0 90px rgb(239 68 68 / 0.25);
  animation: collapse-edge 1.1s ease-in-out infinite;
}

@keyframes collapse-edge {
  50% {
    box-shadow: inset 0 0 0 3px rgb(239 68 68 / 0.2), inset 0 0 90px rgb(239 68 68 / 0.08);
  }
}

@media (prefers-reduced-motion: reduce) {
  .collapse-edge {
    animation: none;
  }
}
</style>
