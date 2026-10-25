<template>
  <!-- In #cyberpunkroot, next to the page, so the theme colours apply -->
  <Teleport to="#cyberpunkroot">
    <!-- Glitch filters: the wobble of the picture, and tears as horizontal bands shifted sideways -->
    <svg width="0" height="0" class="absolute" aria-hidden="true" focusable="false">
      <filter id="corruption-wobble" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">
        <feTurbulence ref="wobbleNoise" type="fractalNoise" baseFrequency="0.002 0.07" numOctaves="1" seed="3" result="noise"/>
        <feDisplacementMap ref="wobbleMap" in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
      <filter id="corruption-tear" x="-10%" y="0%" width="120%" height="100%" color-interpolation-filters="sRGB">
        <feTurbulence ref="tearNoise" type="fractalNoise" baseFrequency="0 0.012" numOctaves="1" seed="1" result="noise"/>
        <!-- Steps of the noise: most bands stay, a few jump right or left -->
        <feComponentTransfer in="noise" result="bands">
          <feFuncR type="discrete" tableValues="0.5 0.5 0.5 0.5 0.5 0.9 0.5 0.2 0.5 0.5 0.5 0.5"/>
          <feFuncG type="linear" slope="0" intercept="0.5"/>
        </feComponentTransfer>
        <feDisplacementMap ref="tearMap" in="SourceGraphic" in2="bands" scale="0" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
    </svg>

    <!-- The page cannot be used while it is corrupted -->
    <div v-if="phase === 'run'" class="fixed inset-0 z-[59]"/>

    <!-- Hex dumps over blocks of the page -->
    <div ref="layer" class="pointer-events-none fixed inset-0 z-[60]" aria-hidden="true">
      <div
        v-for="hex in hexes"
        :key="hex.id"
        class="hex-dump terminal-font absolute overflow-hidden whitespace-pre bg-black text-xs leading-[15px] text-green-400"
        :style="{ left: `${hex.x}px`, top: `${hex.y}px`, width: `${hex.w}px`, height: `${hex.h}px` }"
      >{{ hex.text }}</div>
    </div>

    <div
      v-if="hudShown"
      class="terminal-font fixed left-7 top-20 z-[70] border border-red-500 bg-black/80 px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-red-400"
      aria-hidden="true"
    >
      {{ isEnglish ? 'Corrupted sectors' : 'Secteurs corrompus' }}
      <b class="ml-2.5 tabular-nums text-white">{{ sectors }}</b>
    </div>

    <!-- Black screen behind the panic, the switch-off and the boot text -->
    <div v-if="blackout" class="fixed inset-0 z-[65] bg-black"/>

    <div v-if="panicShown" ref="panicPanel" class="terminal-font fixed inset-0 z-[66] bg-black text-[15px] leading-relaxed text-neutral-200">
      <p class="bg-primary px-8 py-3 text-lg font-bold tracking-[0.24em] text-on-primary">
        KERNEL PANIC
      </p>
      <pre class="whitespace-pre px-8 py-5 font-[inherit]">{{ panicLines.join('\n') }}</pre>
    </div>
    <div ref="dot" class="crt-dot pointer-events-none fixed left-1/2 top-1/2 z-[67] size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0"/>

    <div v-if="bootShown" class="terminal-font fixed left-11 top-10 z-[67] max-w-[calc(100vw-5.5rem)] text-[19px] leading-[1.7] text-neutral-300">
      <pre class="whitespace-pre-wrap font-[inherit]">{{ bootText }}<span v-if="phase !== 'reboot'" class="boot-cursor">_</span></pre>
      <button
        v-if="phase === 'final'"
        ref="rebootButton"
        type="button"
        class="-ml-1.5 mt-2 px-1.5 py-1 text-neutral-300 hover:bg-neutral-300 hover:text-black focus-visible:bg-neutral-300 focus-visible:text-black focus-visible:outline-none"
        @click="reboot"
      >
        [ {{ isEnglish ? 'REBOOT' : 'REDÉMARRER' }} ]
      </button>
    </div>

    <div v-if="scanlines" ref="scan" class="scanlines pointer-events-none fixed inset-0 z-[67]"/>

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

    <!-- Confirmation: its own text goes bad, then it tears away -->
    <div v-if="dialogShown" ref="backdrop" class="fixed inset-0 z-[80] grid place-items-center bg-black/70">
      <div
        ref="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="corruption-title"
        class="w-[37.5rem] max-w-[calc(100vw-2rem)] border-2 border-red-500 bg-black px-9 py-8 text-white shadow-[0_0_40px_rgb(239_68_68/0.3)]"
      >
        <p class="terminal-font text-[13px] font-semibold uppercase tracking-[0.16em] text-red-400">
          {{ isEnglish ? 'Self-destruct protocol' : 'Protocole d\'auto-destruction' }}
        </p>
        <h2 id="corruption-title" class="mb-4 mt-2.5 text-[2rem] font-extrabold uppercase leading-tight tracking-wide text-red-500">
          {{ isEnglish ? 'Start the memory purge?' : 'Lancer la purge mémoire ?' }}
        </h2>
        <ul>
          <li class="terminal-font flex justify-between gap-5 border-b border-neutral-800 py-1.5 text-sm text-neutral-200">
            <span>{{ isEnglish ? 'Rendering memory' : 'Mémoire du rendu' }}</span>
            <span class="font-semibold text-green-400">0x0000 – 0xFFFF</span>
          </li>
          <li class="terminal-font flex justify-between gap-5 border-b border-neutral-800 py-1.5 text-sm text-neutral-200">
            <span>{{ isEnglish ? 'Signature' : 'Signature' }}</span>
            <span class="font-semibold text-red-500">{{ isEnglish ? 'not verified' : 'non vérifiée' }}</span>
          </li>
          <li class="terminal-font flex justify-between gap-5 border-b border-neutral-800 py-1.5 text-sm text-neutral-200">
            <span>{{ isEnglish ? 'Undo' : 'Retour arrière' }}</span>
            <span class="font-semibold text-red-500">{{ isEnglish ? 'impossible' : 'impossible' }}</span>
          </li>
        </ul>
        <p class="mt-4 text-sm text-red-400">
          {{ isEnglish ? 'Glitches and 3 brief colour inversions.' : 'Glitchs et 3 inversions de couleurs brèves.' }}
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
            class="corruption-confirm border-2 border-red-500 bg-black px-5 py-3 font-semibold uppercase tracking-wider text-red-500 transition-colors hover:bg-red-500/15"
            :disabled="phase !== 'confirm'"
            @click="confirm"
          >
            {{ isEnglish ? 'Start' : 'Lancer' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import {
  computed, nextTick, onBeforeUnmount, onMounted, reactive, ref,
} from 'vue';

import { useProfile } from '@/composables/useProfile';
import { usePreferencesStore } from '@/stores/preferences';
import { scanScreen, type Rect } from '@/utils/collapse';
import {
  collectText, filterTargets, glyph, hexRows, pickBlocks, restoreText, scramble, screenBlocks, writePiece, type TextPiece,
} from '@/utils/corruption';
import { prefersReducedMotion } from '@/utils/motion';
import { findPage, lockScroll } from '@/utils/selfDestructScreen';
import { startClock, type SequenceClock } from '@/utils/sequenceClock';
import {
  createSfx, isMuted, setMuted, type Sfx,
} from '@/utils/sfx';

const emit = defineEmits<{ close: [] }>();

const DURATION = 26;
// The glitch work runs at 14 steps per second: between two steps nothing on the page changes, so
// the browser only recomposites instead of redoing style, layout and filters at every frame
const STEP = 1 / 14;
const INVERSIONS = [10.4, 12.6, 14.2];
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

const preferencesStore = usePreferencesStore();
const isEnglish = computed(() => preferencesStore.isEnglish);
const { projects } = useProfile();

type Phase = 'confirm' | 'run' | 'final' | 'reboot';
const phase = ref<Phase>('confirm');
const dialogShown = ref(true);
const hudShown = ref(false);
const sectors = ref('0x0000');
const muted = ref(isMuted());
const blackout = ref(false);
const panicShown = ref(false);
const panicLines = ref<string[]>([]);
const bootShown = ref(false);
const bootText = ref('');
const scanlines = ref(false);
const hexes = reactive<(Rect & { id: number; rows: number; cols: number; text: string })[]>([]);

const layer = ref<HTMLElement | null>(null);
const backdrop = ref<HTMLElement | null>(null);
const dialog = ref<HTMLElement | null>(null);
const cancelButton = ref<HTMLButtonElement | null>(null);
const confirmButton = ref<HTMLButtonElement | null>(null);
const muteButton = ref<HTMLButtonElement | null>(null);
const rebootButton = ref<HTMLButtonElement | null>(null);
const panicPanel = ref<HTMLElement | null>(null);
const dot = ref<HTMLElement | null>(null);
const scan = ref<HTMLElement | null>(null);
const wobbleNoise = ref<SVGElement | null>(null);
const wobbleMap = ref<SVGElement | null>(null);
const tearNoise = ref<SVGElement | null>(null);
const tearMap = ref<SVGElement | null>(null);

// State of a run, outside Vue's reactivity
let clock: SequenceClock | null = null;
let sfx: Sfx | null = null;
let page: HTMLElement | null = null;
let pieces: TextPiece[] = [];
// Blocks of the page with a text shadow, and their content with the filters, each with its own
// inline value to put back
let shadowed: { el: HTMLElement; value: string }[] = [];
let filtered: { el: HTMLElement; value: string }[] = [];
let pageVisibility = '';
let powerOn: Animation | null = null;
let unlockScroll: (() => void) | null = null;
let opener: HTMLElement | null = null;
let reduced = false;

function toggleMute() {
  muted.value = !muted.value;
  setMuted(muted.value);
}

function clearStyles() {
  shadowed.forEach(({ el, value }) => { el.style.textShadow = value; });
  filtered.forEach(({ el, value }) => { el.style.filter = value; });
  if (layer.value) layer.value.style.filter = '';
}

// The page as it was: text, filters, shadows. Safe to call twice.
function restorePage() {
  restoreText(pieces);
  pieces = [];
  clearStyles();
  shadowed = [];
  filtered = [];
  if (page) page.style.visibility = pageVisibility;
  hexes.splice(0);
  wobbleMap.value?.setAttribute('scale', '0');
  tearMap.value?.setAttribute('scale', '0');
}

function stopAll() {
  clock?.stop();
  clock = null;
  sfx?.close();
  sfx = null;
  restorePage();
  powerOn?.cancel();
  powerOn = null;
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
  if (phase.value !== 'confirm') return;
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
  run(clock, sfx, page);
}

// Types text at a given rate, with a key click per character
function typeLines(time: SequenceClock, fx: Sfx, start: number, text: string, perSecond = 38) {
  time.at(start, () => {
    const from = time.t;
    const base = bootText.value;
    let shown = 0;
    const untick = time.tick((t) => {
      const count = Math.min(text.length, Math.floor((t - from) * perSecond));
      if (count > shown) {
        bootText.value = base + text.slice(0, count);
        if (text[count - 1]?.trim()) {
          fx.noise({
            type: 'highpass', f: 3500, dur: 0.012, gain: 0.05,
          });
        }
        shown = count;
      }
      if (count >= text.length) untick();
    });
  });
}

function run(time: SequenceClock, fx: Sfx, target: HTMLElement) {
  const W = window.innerWidth;
  const H = window.innerHeight;
  // The wave was tuned on a 1280 × 800 screen: it scales with the diagonal
  const reach = Math.hypot(W, H) * 1.13;
  const ragged = (240 * Math.hypot(W, H)) / 1509;
  const blocks = screenBlocks(target);
  shadowed = blocks.map((el) => ({ el, value: el.style.textShadow }));
  filtered = filterTargets(blocks).map((el) => ({ el, value: el.style.filter }));
  const spot = new Map<string, number>();
  let origin = { x: W / 2, y: H / 2 };
  let blocksToDump: Rect[] = [];
  let peak = 0;
  let steps = 0;
  let nextTear = 3;
  let tearUntil = 0;
  let wobble = false;
  let inverted = false;
  let lastFilter = '';
  let lastBlip = 0;

  function applyFilter(t: number) {
    const value = [
      t < tearUntil ? 'url(#corruption-tear)' : '',
      wobble ? 'url(#corruption-wobble)' : '',
      inverted ? 'invert(1) hue-rotate(180deg)' : '',
    ].filter(Boolean).join(' ');
    if (value === lastFilter) return;
    lastFilter = value;
    filtered.forEach(({ el, value: own }) => { el.style.filter = value || own; });
    if (layer.value) layer.value.style.filter = value;
  }

  // 0 → 0.85 s: the dialog itself goes bad, then tears away
  const dialogTexts: Text[] = [];
  if (dialog.value) {
    const walker = document.createTreeWalker(dialog.value, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) if (node instanceof Text && node.nodeValue?.trim()) dialogTexts.push(node);
  }
  const dialogOriginals = dialogTexts.map((node) => node.nodeValue ?? '');
  time.tween(0, 0.55, (p) => {
    scramble(dialogOriginals, p * p).forEach((value, i) => {
      const node = dialogTexts[i];
      if (node) node.nodeValue = value;
    });
  });
  time.at(0.05, () => fx.noise({
    type: 'highpass', f: 2500, dur: 0.5, gain: 0.08,
  }));
  time.at(0.5, () => {
    dialog.value?.animate([
      { clipPath: 'inset(0 0 0 0)', transform: 'none' },
      { clipPath: 'inset(38% 0 44% 0)', transform: 'translateX(40px)' },
      { clipPath: 'inset(50% 0 50% 0)', transform: 'translateX(-70px)' },
    ], { duration: 260, easing: 'steps(5)', fill: 'forwards' });
    backdrop.value?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260, easing: 'steps(3)', fill: 'forwards' });
    fx.noise({
      type: 'highpass', f: 3000, dur: 0.14, gain: 0.16,
    });
  });
  time.at(0.85, () => {
    dialogShown.value = false;
    hudShown.value = true;
    const screen = scanScreen(target);
    // The corruption starts from the top of the largest window on screen (the terminal)
    const largest = screen.frames.map((el) => el.getBoundingClientRect()).sort((a, b) => b.width * b.height - a.width * a.height)[0];
    if (largest) origin = { x: largest.left + 90, y: largest.top + 40 };
    pieces = collectText(screen, origin, ragged);
    blocksToDump = pickBlocks(screen, 5);
  });

  // Text: sporadic flips first, then a wave that turns characters into glyphs
  function scrambleStep(t: number) {
    if (t < 3.6 && Math.random() < 0.6 && pieces.length) {
      const k = Math.floor(Math.random() * pieces.length);
      const piece = pieces[k];
      const i = piece ? Math.floor(Math.random() * piece.chars.length) : 0;
      if (piece?.solid[i]) {
        spot.set(`${k}:${i}`, t + 0.25);
        if (time.t - lastBlip > 0.03) {
          lastBlip = time.t;
          fx.tone({
            type: 'square', f: rand(2000, 4200), dur: 0.025, gain: 0.03,
          });
        }
      }
    }
    const radius = t < 3.5 ? 0 : clamp((t - 3.5) / 9.5, 0, 1) ** 2 * reach;
    let count = 0;
    pieces.forEach((piece, k) => {
      let changed = false;
      for (let i = 0; i < piece.chars.length; i += 1) {
        if (!piece.solid[i]) continue;
        const hit = radius > piece.distance + (piece.noise[i] ?? 0) || (spot.size > 0 && (spot.get(`${k}:${i}`) ?? 0) > t);
        if (hit) {
          count += 1;
          if (!piece.bad[i] || Math.random() < 0.35) {
            piece.current[i] = glyph();
            changed = true;
          }
          piece.bad[i] = true;
        } else if (piece.bad[i]) {
          piece.current[i] = piece.chars[i] ?? '';
          piece.bad[i] = false;
          changed = true;
        }
      }
      if (changed) writePiece(piece);
    });
    for (const [key, until] of spot) if (until <= t) spot.delete(key);
    peak = Math.max(peak, count);
    sectors.value = `0x${(count * 37).toString(16).toUpperCase().padStart(4, '0')}`;
  }

  // Tears, more and more often; each lasts one or two steps
  function tearStep(t: number) {
    if (t < nextTear) return;
    const k = clamp((t - 3) / 11, 0, 1);
    tearUntil = t + rand(0.08, 0.15);
    tearNoise.value?.setAttribute('seed', String(Math.floor(Math.random() * 1000)));
    tearMap.value?.setAttribute('scale', (14 + k * 90).toFixed(0));
    fx.noise({
      type: 'highpass', f: rand(1800, 4000), dur: rand(0.05, 0.1), gain: 0.1,
    });
    nextTear = t + (1.1 - 0.94 * k) * rand(0.6, 1.3);
  }

  // 8 → 15 s: the picture wobbles; three 70 ms inversions, at least 1.5 s apart
  time.at(8, () => { if (!reduced) wobble = true; });
  if (!reduced) {
    INVERSIONS.forEach((at) => {
      time.at(at, () => {
        inverted = true;
        applyFilter(time.t);
        fx.tone({
          type: 'square', f: 90, dur: 0.08, gain: 0.14,
        });
      });
      time.at(at + 0.07, () => {
        inverted = false;
        applyFilter(time.t);
      });
    });
  }

  // Blocks of the page become hex dumps
  for (let i = 0; i < 5; i += 1) {
    time.at(9 + i * 1.1, () => {
      const block = blocksToDump[i];
      if (!block) return;
      const rows = Math.max(1, Math.floor(block.h / 15));
      const cols = Math.max(8, Math.floor(block.w / 7.3));
      hexes.push({
        ...block, id: i, rows, cols, text: hexRows(rows, cols),
      });
      fx.noise({
        type: 'bandpass', f: 3000, q: 3, dur: 0.2, gain: 0.1,
      });
    });
  }

  // Sound bed: data hiss, modem bleeps, a rising whine
  const hiss = fx.drone({ filter: 'bandpass', f: 1800, q: 4 });
  time.at(3.5, () => hiss.gain(0.1, 6));
  const whine = fx.drone({
    freqs: [180], type: 'sawtooth', filter: 'lowpass', f: 500,
  });
  time.at(8, () => {
    whine.gain(0.05, 4);
    whine.freq(6, 7);
    whine.filter(3200, 7);
  });
  let bleep = 0;
  let high = false;

  let acc = 0;
  time.tick((t, dt) => {
    if (t >= 5 && t < 14.8) {
      bleep += dt;
      if (bleep > 0.09) {
        bleep = 0;
        high = !high;
        fx.tone({
          type: 'square', f: high ? 2200 : 1200, dur: 0.04, gain: 0.02,
        });
      }
    }
    acc += dt;
    if (acc < STEP || t >= 15) return;
    acc %= STEP;
    steps += 1;
    scrambleStep(t);
    if (!reduced && t >= 4.5) {
      const split = (0.6 + clamp((t - 4.5) / 8, 0, 1) * 3.5) * (Math.random() < 0.2 ? 2.2 : 1);
      const shadow = `${(-split).toFixed(1)}px 0 rgba(255,0,128,.8), ${split.toFixed(1)}px 0 rgba(0,255,255,.8)`;
      shadowed.forEach(({ el }) => { el.style.textShadow = shadow; });
    }
    if (wobble) {
      wobbleMap.value?.setAttribute('scale', (clamp((t - 8) / 7, 0, 1) * 30 * (Math.random() < 0.15 ? 2 : 1)).toFixed(1));
      if (steps % 2 === 0) wobbleNoise.value?.setAttribute('seed', String(Math.floor(Math.random() * 100)));
    }
    hexes.forEach((hex) => { hex.text = hexRows(hex.rows, hex.cols); });
    if (!reduced && t >= 3) tearStep(t);
    applyFilter(t);
  });

  // 15 s: everything freezes on a kernel panic that lists the real sections of the page
  time.at(15, () => {
    wobble = false;
    inverted = false;
    tearUntil = 0;
    hiss.gain(0.0001, 0.05);
    whine.gain(0.0001, 0.05);
    blackout.value = true;
    panicShown.value = true;
    hudShown.value = false;
    // Under the black screen the page is neither filtered nor painted
    clearStyles();
    hexes.splice(0);
    target.style.visibility = 'hidden';
    const sections = [...target.querySelectorAll('section[id]')].map((section) => section.id);
    const lines = [
      isEnglish.value ? 'hyperion: fatal exception while rendering' : 'hyperion : exception fatale pendant le rendu',
      'RIP: 0010:render_section+0x1f/0x80 [nuxt]',
      'Call Trace:',
      ' <TASK>',
      ...sections.map((id) => ` render_section+0x1f/0x80 [${id}]`),
      ' hydrate_app+0x3c2/0x5a0',
      ' </TASK>',
      `${isEnglish.value ? 'Corrupted sectors:' : 'Secteurs corrompus :'} 0x${(peak * 37).toString(16).toUpperCase()}`,
      isEnglish.value ? 'Kernel panic - not syncing: no healthy pixel left' : 'Kernel panic - not syncing: plus aucun pixel sain',
      '---[ end Kernel panic - not syncing ]---',
    ];
    lines.forEach((line, i) => time.at(15.1 + i * 0.08, () => {
      panicLines.value = [...panicLines.value, `[${(15.204 + i * 0.0007).toFixed(4).padStart(10, ' ')}] ${line}`];
      fx.noise({
        type: 'highpass', f: 3500, dur: 0.012, gain: 0.04,
      });
    }));
    const tone = fx.drone({
      freqs: [440, 466], type: 'square', filter: 'lowpass', f: 1800,
    });
    tone.gain(0.03, 0.05);
    time.at(18.9, () => tone.gain(0.0001, 0.05));
    // The panic text goes bad too
    time.at(17.6, () => {
      const clean = panicLines.value.slice();
      time.tween(17.6, 1.3, (p) => { panicLines.value = scramble(clean, p * p); });
    });
  });

  // 19 s: the tube switches off, down to a line, then a dot
  time.at(19, () => {
    panicPanel.value?.animate(
      reduced
        ? [{ opacity: 1 }, { opacity: 0 }]
        : [
          { transform: 'scale(1, 1)', filter: 'brightness(1)' },
          { transform: 'scale(1, .006)', filter: 'brightness(3)', offset: 0.45 },
          { transform: 'scale(.004, .006)', filter: 'brightness(5)', offset: 0.8 },
          { transform: 'scale(0, 0)', filter: 'brightness(5)' },
        ],
      { duration: 950, easing: 'cubic-bezier(.6,0,.4,1)', fill: 'forwards' },
    );
    if (!reduced) {
      dot.value?.animate([{ opacity: 0 }, { opacity: 0, offset: 0.4 }, { opacity: 1, offset: 0.5 }, { opacity: 0 }], { duration: 2200, fill: 'forwards' });
    }
    fx.tone({
      f: 9000, f1: 5000, dur: 0.6, gain: 0.015,
    });
    fx.tone({
      f: 320, f1: 38, dur: 0.7, gain: 0.3, attack: 0.01, delay: 0.35,
    });
    fx.noise({
      type: 'lowpass', f: 6000, f1: 800, dur: 1.4, gain: 0.08, delay: 0.2,
    });
  });
  time.at(20.3, () => { panicShown.value = false; });

  // Black, then a cursor and a message
  time.at(22.2, () => { bootShown.value = true; });
  typeLines(time, fx, 23.1, isEnglish.value ? 'hyperion: no operating system found.\n' : 'hyperion : aucun système d\'exploitation trouvé.\n');
  typeLines(time, fx, 24.5, isEnglish.value ? 'Press REBOOT to restart the system.\n' : 'Appuyez sur REDÉMARRER pour relancer le système.\n');
  time.at(DURATION, showFinal);
}

async function showFinal() {
  phase.value = 'final';
  await nextTick();
  rebootButton.value?.focus({ preventScroll: true });
}

// A boot screen counts the real projects and sections, then the screen lights up on the page
function reboot() {
  if (phase.value !== 'final' || !page) return;
  phase.value = 'reboot';
  clock?.stop();
  sfx?.close();
  sfx = createSfx();
  clock = startClock();
  const time = clock;
  const fx = sfx;
  const target = page;
  const sections = [...target.querySelectorAll('section[id]')].map((section) => section.id);
  const lines = [
    `HYPERION BIOS v4.2 · (C) 2018-${new Date().getFullYear()} KwikKill`,
    '',
    `${isEnglish.value ? 'Rendering memory .......' : 'Mémoire du rendu .......'} ${projects.value.length} ${isEnglish.value ? 'projects' : 'projets'} OK`,
    `Sections ............... ${sections.join(' ')}`,
    `${isEnglish.value ? 'Style sheet ............' : 'Feuille de style .......'} OK`,
    `${isEnglish.value ? 'Starting nuxt ..........' : 'Démarrage de nuxt ......'} OK`,
  ];
  bootText.value = '';
  time.at(0.1, () => fx.tone({
    type: 'square', f: 1000, dur: 0.16, gain: 0.06,
  }));
  lines.forEach((line, i) => time.at(0.25 + i * 0.28, () => {
    bootText.value += `${line}\n`;
    fx.noise({
      type: 'highpass', f: 3000, dur: 0.02, gain: 0.04,
    });
  }));
  time.at(2.3, async () => {
    restorePage();
    bootShown.value = false;
    blackout.value = false;
    scanlines.value = true;
    // The page lights up from a line, around the middle of the screen
    if (!reduced) {
      target.style.transformOrigin = `50% ${window.innerHeight / 2}px`;
      powerOn = target.animate([
        { transform: 'scale(0, .006)', filter: 'brightness(5)' },
        { transform: 'scale(1, .006)', filter: 'brightness(4)', offset: 0.35 },
        { transform: 'scale(1, 1)', filter: 'brightness(1.8)', offset: 0.7 },
        { transform: 'scale(1, 1)', filter: 'brightness(1)' },
      ], { duration: 800, easing: 'cubic-bezier(.2,.7,.3,1)' });
      powerOn.onfinish = () => { target.style.transformOrigin = ''; };
    }
    fx.noise({
      type: 'bandpass', f: 2000, q: 0.6, dur: 0.35, gain: 0.12,
    });
    fx.tone({
      f: 60, f1: 120, dur: 0.8, gain: 0.12, attack: 0.2,
    });
    await nextTick();
    scan.value?.animate([{ opacity: 0.8 }, { opacity: 0 }], { duration: 1400, fill: 'forwards' });
  });
  time.at(3.9, () => {
    target.style.transformOrigin = '';
    close();
  });
}

// Escape cancels the confirmation; Tab stays inside the open dialog
function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && phase.value === 'confirm') {
    event.preventDefault();
    cancel();
    return;
  }
  if (event.key !== 'Tab' || phase.value === 'run' || phase.value === 'reboot') return;
  const buttons = phase.value === 'confirm' ? [cancelButton.value, confirmButton.value] : [rebootButton.value, muteButton.value];
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
/* The site's fonts have no monospace one: the system's, for the hex dumps, the panic and the boot */
.terminal-font {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
}

/* A hex dump fills its block from the left, in steps */
.hex-dump {
  box-shadow: 0 0 0 1px rgb(74 222 128 / 0.35);
  animation: hex-in 0.3s steps(6);
}

@keyframes hex-in {
  from {
    clip-path: inset(0 100% 0 0);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
}

.corruption-confirm:is(:hover, :focus-visible) {
  text-shadow: -2px 0 rgb(255 0 128 / 0.8), 2px 0 rgb(0 255 255 / 0.8);
}

.crt-dot {
  box-shadow: 0 0 22px 8px rgb(255 255 255 / 0.7);
}

.boot-cursor {
  animation: boot-blink 1s steps(1) infinite;
}

@keyframes boot-blink {
  50% {
    opacity: 0;
  }
}

.scanlines {
  background: repeating-linear-gradient(0deg, rgb(0 0 0 / 0.4) 0 2px, transparent 2px 4px);
}

@media (prefers-reduced-motion: reduce) {
  .hex-dump,
  .boot-cursor {
    animation: none;
  }
}
</style>
