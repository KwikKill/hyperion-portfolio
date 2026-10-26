<template>
  <div>
    <!-- Self-destruct panel: pick a sequence, then launch it (from the md breakpoint, as before) -->
    <section
      v-if="!isDestructing && !isComplete"
      class="my-8 hidden w-full justify-center px-4 md:flex"
      aria-labelledby="self-destruct-title"
    >
      <div class="self-destruct-panel relative w-full max-w-5xl border border-error/50 bg-bg px-6 pb-6 pt-7">
        <div class="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 id="self-destruct-title" class="font-mono flex items-center gap-2 text-sm uppercase tracking-[0.16em] text-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="size-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" :d="WARNING_ICON"/>
            </svg>
            {{ isEnglish ? 'Self-destruct protocol' : 'Protocole d\'auto-destruction' }}
          </h2>
          <p class="text-xs text-gray-400">
            {{ availability }}
          </p>
        </div>

        <!-- Radio group: one card per sequence -->
        <div
          role="radiogroup"
          :aria-label="isEnglish ? 'Self-destruct sequence' : 'Séquence d\'auto-destruction'"
          class="mx-auto flex flex-wrap justify-center gap-2"
          :style="{ maxWidth: `calc(${CARDS_PER_ROW} * 9.5rem + ${CARDS_PER_ROW - 1} * 0.5rem)` }"
        >
          <button
            v-for="(item, index) in SELF_DESTRUCT_SEQUENCES"
            :id="`self-destruct-sequence-${item.id}`"
            :key="item.id"
            type="button"
            role="radio"
            class="sequence-card relative grid w-[9.5rem] content-start gap-1 rounded border bg-bg p-2 text-left transition-colors"
            :class="item.id === selectedSequence
              ? 'border-primary shadow-[0_0_18px_rgb(var(--color-primary)/0.35)]'
              : 'border-primary/25 hover:border-primary/60'"
            :aria-checked="item.id === selectedSequence"
            :tabindex="item.id === selectedSequence ? 0 : -1"
            @click="selectedSequence = item.id"
            @keydown="onSequenceKeydown($event, index)"
          >
            <span class="sequence-preview" aria-hidden="true">
              <span v-if="item.id === 'grid'" class="preview-grid">
                <i v-for="delay in GRID_PREVIEW_DELAYS" :key="delay" :style="{ animationDelay: `${delay}s` }"/>
              </span>
              <span v-else-if="item.id === 'collapse'" class="preview-fall">
                <i
                  v-for="bar in FALL_PREVIEW_BARS"
                  :key="bar.x"
                  :style="{ left: `${bar.x}px`, width: `${bar.w}px`, animationDelay: `${bar.delay}s`, '--fall-y': `${bar.y}px`, '--fall-r': `${bar.r}deg` }"
                />
              </span>
              <span v-else-if="item.id === 'corruption'" class="preview-glitch">
                <span class="glitch-clean">HYPERION</span>
                <span class="glitch-bad">HY▓ER╳ON</span>
              </span>
              <span v-else-if="item.id === 'fracture'" class="preview-crack">
                <span class="crack-pane"/>
                <svg viewBox="0 0 120 58" preserveAspectRatio="none">
                  <path v-for="path in CRACK_PREVIEW_PATHS" :key="path" :d="path"/>
                </svg>
              </span>
              <span v-else-if="item.id === 'singularity'" class="preview-hole">
                <!-- Flattened, like a tilted disk -->
                <span class="hole-disk">
                  <i
                    v-for="dot in HOLE_PREVIEW_DOTS"
                    :key="dot.a"
                    :style="{ '--hole-a': `${dot.a}deg`, '--hole-r': `${dot.r}px`, animationDelay: `${dot.delay}s` }"
                  />
                </span>
                <b/>
              </span>
              <span v-else-if="item.id === 'overheat'" class="preview-melt">
                <i
                  v-for="(column, i) in MELT_PREVIEW_COLUMNS"
                  :key="i"
                  :style="{ left: `${i * 12.5}%`, animationDelay: `${column.delay}s`, '--melt-y': `${column.y}%` }"
                />
              </span>
              <span v-else-if="item.id === 'megapolis'" class="preview-city">
                <i
                  v-for="tower in CITY_PREVIEW_TOWERS"
                  :key="tower.x"
                  :style="{ left: `${tower.x}%`, width: `${tower.w}%`, height: `${tower.h}%`, animationDelay: `${tower.delay}s` }"
                />
              </span>
              <span v-else-if="item.id === 'deluge'" class="preview-flood">
                <!-- The liquid rises with a wave on top and a bar floating on it, then drains -->
                <span class="flood-water">
                  <svg viewBox="0 0 240 10" preserveAspectRatio="none">
                    <path d="M0 5 Q15 0 30 5 T60 5 T90 5 T120 5 T150 5 T180 5 T210 5 T240 5 V10 H0 Z"/>
                  </svg>
                  <i/>
                </span>
              </span>
              <span v-else-if="item.id === 'disintegration'" class="preview-dust">
                <i
                  v-for="dot in DUST_PREVIEW_DOTS"
                  :key="dot.key"
                  :class="dot.tone"
                  :style="{ left: `${dot.x}px`, top: `${dot.y}px`, animationDelay: `${dot.delay}s`, '--dust-x': `${dot.dx}px`, '--dust-y': `${dot.dy}px` }"
                />
              </span>
            </span>
            <span
              v-if="item.id === selectedSequence"
              class="font-mono absolute right-1.5 top-1.5 rounded-sm bg-primary px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-on-primary"
              aria-hidden="true"
            >
              {{ isEnglish ? 'CHOSEN' : 'CHOISIE' }}
            </span>
            <span class="text-sm font-bold uppercase tracking-wider text-primary">{{ item.name[lang] }}</span>
            <span class="text-xs text-gray-400">{{ item.duration }} s</span>
          </button>
        </div>

        <div class="mt-6 flex flex-col items-center gap-3">
          <button
            type="button"
            class="font-mono group relative overflow-hidden rounded-none border-2 border-red-500 bg-black px-6 py-3 text-red-500 transition-all duration-300 hover:bg-red-500/10 hover:text-red-400"
            aria-describedby="self-destruct-note"
            @click="showAlarm = true"
          >
            <div class="absolute inset-0 bg-red-500/20 opacity-0 transition-opacity group-hover:opacity-100"/>
            <div class="relative flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="size-5 animate-pulse"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="WARNING_ICON"/>
              </svg>
              <span class="uppercase tracking-wider">
                {{ isEnglish ? 'SELF DESTRUCT' : 'AUTO-DESTRUCTION' }} · <b>{{ sequence.name[lang] }}</b>
              </span>
            </div>
          </button>
        </div>
      </div>
    </section>

    <!-- These sequences run on their own, from their confirmation to their rebuild -->
    <CyberpunkCollapse v-if="showAlarm && sequence.id === 'collapse'" @close="showAlarm = false"/>
    <CyberpunkCorruption v-if="showAlarm && sequence.id === 'corruption'" @close="showAlarm = false"/>
    <CyberpunkFracture v-if="showAlarm && sequence.id === 'fracture'" @close="showAlarm = false"/>
    <CyberpunkSingularity v-if="showAlarm && sequence.id === 'singularity'" @close="showAlarm = false"/>
    <CyberpunkOverheat v-if="showAlarm && sequence.id === 'overheat'" @close="showAlarm = false"/>
    <CyberpunkMegapolis v-if="showAlarm && sequence.id === 'megapolis'" @close="showAlarm = false"/>
    <CyberpunkDeluge v-if="showAlarm && sequence.id === 'deluge'" @close="showAlarm = false"/>
    <CyberpunkDisintegration v-if="showAlarm && sequence.id === 'disintegration'" @close="showAlarm = false"/>

    <!-- Alarm Overlay (grid sequence) -->
    <div
      v-if="showAlarm && sequence.id === 'grid'"
      class="alarm-overlay fixed inset-0 z-50 flex items-center justify-center"
    >
      <div class="absolute inset-0 bg-black/80"/>

      <!-- Alarm Sound Effect (Visual) -->
      <div v-if="isDestructing" class="absolute inset-0">
        <div class="alarm-ring-wrapper">
          <div class="alarm-ring" style="animation-delay: 0s;"/>
        </div>
        <div class="alarm-ring-wrapper">
          <div class="alarm-ring" style="animation-delay: 0.4s;"/>
        </div>
        <div class="alarm-ring-wrapper">
          <div class="alarm-ring" style="animation-delay: 0.8s;"/>
        </div>
      </div>

      <!-- Warning Content -->
      <div class="relative z-10 text-center">
        <!-- Warning Icon -->
        <div class="mx-auto mb-8 flex size-32 items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="size-full animate-bounce text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <!-- Warning Text -->
        <h2 class="glitch-text font-mono mb-4 text-4xl font-bold uppercase tracking-wider text-red-500 md:text-6xl" :data-text="isEnglish ? 'WARNING' : 'ATTENTION'">
          {{ isEnglish ? 'WARNING' : 'ATTENTION' }}
        </h2>

        <p
          v-if="isDestructing"
          class="font-mono mb-8 text-xl text-red-400 md:text-2xl"
        >
          {{ isEnglish ? 'SYSTEM SELF-DESTRUCT INITIATED' : 'AUTO-DESTRUCTION DU SYSTÈME INITIÉE' }}
        </p>

        <p
          v-if="!isDestructing"
          class="font-mono mb-8 text-xl text-red-400 md:text-2xl"
        >
          {{
            isEnglish
              ? 'ARE YOU SURE YOU WANT TO DESTROY THE SYSTEM?'
              : 'ÊTES-VOUS SÛR DE VOULOIR SUPPRIMER LE SYSTÈME ?'
          }}
        </p>

        <!-- Countdown -->
        <div
          v-if="isDestructing"
          class="countdown-number font-mono text-8xl font-bold text-red-500 md:text-9xl"
        >
          {{ countdown }}
        </div>

        <p
          v-if="isDestructing"
          class="font-mono mt-4 text-lg text-red-400"
        >
          {{ isEnglish ? 'SECONDS TO DESTRUCTION' : 'SECONDES AVANT DESTRUCTION' }}
        </p>

        <!-- Epilespy Warning -->
        <p
          v-if="!isDestructing"
          class="font-mono mt-4 text-lg text-red-400"
        >
          {{
            isEnglish
              ? 'WARNING: VISUAL EFFECTS MAY TRIGGER EPILEPTIC SEIZURES'
              : 'AVERTISSEMENT : LES EFFETS VISUELS PEUVENT PROVOQUER DES CRISES ÉPILEPTIQUES'
          }}
        </p>

        <div
          v-if="!isDestructing"
          class="mt-8 flex flex-row items-center justify-center gap-4"
        >
          <button
            type="button"
            class="font-mono group relative overflow-hidden rounded-none border-2 bg-gray-800 px-6 py-3 text-gray-300 transition-all duration-300 hover:bg-gray-700 hover:text-gray-100"
            @click="showAlarm = false"
          >
            <div class="absolute inset-0 bg-red-500/20 opacity-0 transition-opacity group-hover:opacity-100"/>
            <div class="relative flex items-center space-x-2">
              <span class="uppercase tracking-wider">
                {{ isEnglish ? 'CANCEL' : 'ANNULER' }}
              </span>
            </div>
          </button>

          <button
            type="button"
            class="font-mono group relative overflow-hidden rounded-none border-2 border-red-500 bg-black px-6 py-3 text-red-500 transition-all duration-300 hover:bg-red-500/10 hover:text-red-400"
            @click="startSelfDestruct"
          >
            <div class="absolute inset-0 bg-red-500/20 opacity-0 transition-opacity group-hover:opacity-100"/>
            <div class="relative flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="size-5 animate-pulse"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span class="uppercase tracking-wider">
                {{ isEnglish ? 'CONFIRM?' : 'CONFIRMER ?' }}
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Section Destruction Overlay -->
    <div
      v-if="showDestruction"
      class="fixed inset-0 z-50 overflow-hidden"
    >
      <div class="absolute inset-0 bg-black/50"/>

      <!-- Current section info -->
      <div class="absolute left-8 top-8 z-10">
        <div class="font-mono rounded border border-primary bg-black/80 px-4 py-2 text-primary">
          {{ isEnglish ? 'DESTROYING SECTION:' : 'DESTRUCTION DE LA SECTION:' }}
          <span class="uppercase text-red-500">{{ sections[currentSection] }}</span>
        </div>
      </div>

      <!-- Progress bar -->
      <div class="absolute inset-x-8 bottom-8 z-10 rounded border border-primary bg-black/80">
        <div class="font-mono mb-2 text-sm text-primary">
          {{ isEnglish ? 'DESTRUCTION PROGRESS:' : 'PROGRÈS DE DESTRUCTION:' }} {{ Math.round(gridProgress) }}%
        </div>
        <div class="h-2 rounded border border-primary bg-black">
          <div
            class="h-full bg-gradient-to-r from-primary to-red-500 transition-all duration-100"
            :style="{ width: `${gridProgress}%` }"
          />
        </div>
      </div>

      <!-- Grid Pattern Overlay -->
      <canvas
        ref="destructionCanvas"
        class="absolute inset-0 size-full"
      />
    </div>

    <!-- Reset Screen -->
    <div
      v-if="isComplete"
      class="fixed inset-0 z-50 flex items-center justify-center border border-primary bg-black"
    >
      <CyberpunkTerminalWindow>
        <template #title>
          {{
            isEnglish
              ? 'SYSTEM RESET'
              : 'SYSTÈME RÉINITIALISÉ'
          }}
        </template>
        <template #body>
          <div class="text-center">
            <div class="mb-8">
              <!-- Skull icon for dramatic effect -->
              <div class="mx-auto mb-6 flex size-32 items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="size-full animate-pulse text-primary"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v-.07zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </div>

              <h2 class="glitch-text font-mono mb-4 text-4xl font-bold uppercase tracking-wider text-primary" :data-text="isEnglish ? 'SYSTEM DESTROYED' : 'SYSTÈME DÉTRUIT'">
                {{ isEnglish ? 'SYSTEM DESTROYED' : 'SYSTÈME DÉTRUIT' }}
              </h2>
              <p class="font-mono text-lg text-secondary">
                {{ isEnglish ? 'All data has been purged from memory' : 'Toutes les données ont été purgées de la mémoire' }}
              </p>

              <!-- Static effect -->
              <div class="static-effect mx-auto my-6 h-1 w-64"/>
            </div>

            <button
              type="button"
              class="font-mono group relative overflow-hidden rounded-none border-2 border-primary bg-black px-8 py-4 text-primary transition-all duration-300 hover:scale-105 hover:bg-primary/10"
              @click="resetSystem"
            >
              <div class="absolute inset-0 bg-primary/20 opacity-0 transition-opacity group-hover:opacity-100"/>
              <div class="relative flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="size-6 group-hover:animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span class="text-xl uppercase tracking-wider">
                  {{ isEnglish ? 'RESET ?' : 'RESET ?' }}
                </span>
              </div>
            </button>
          </div>
        </template>
      </CyberpunkTerminalWindow>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import {
  computed, defineAsyncComponent, nextTick, onMounted, ref,
} from 'vue';
import { usePreferencesStore } from '@/stores/preferences';
import { prefersReducedMotion } from '@/utils/motion';
import { SELF_DESTRUCT_SEQUENCES } from '@/utils/selfDestructSequences';

import CyberpunkTerminalWindow from './CyberpunkTerminalWindow.vue';

const preferencesStore = usePreferencesStore();
const isEnglish = computed(() => preferencesStore.isEnglish);
const lang = computed(() => preferencesStore.lang);

const WARNING_ICON = 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z';
// Up to 6 cards on one row; beyond, two balanced rows rather than one card left alone
const CARDS_PER_ROW = SELF_DESTRUCT_SEQUENCES.length <= 6 ? SELF_DESTRUCT_SEQUENCES.length : Math.ceil(SELF_DESTRUCT_SEQUENCES.length / 2);
// Start of each square of the grid preview, so they fill in a scattered order
const GRID_PREVIEW_DELAYS = [0, 1.1, 0.4, 1.6, 0.2, 0.9, 1.3, 0.6, 1.9, 0.3, 1.5, 0.8, 0.5, 1.7, 0.1, 1.2, 0.7, 1.4];
// Bars of the collapse preview: position, width, how far they fall and how much they tilt
const FALL_PREVIEW_BARS = [
  {
    x: 8, w: 34, y: 38, r: 4, delay: 0,
  },
  {
    x: 50, w: 22, y: 38, r: -8, delay: 0.35,
  },
  {
    x: 24, w: 40, y: 31, r: -3, delay: 0.7,
  },
  {
    x: 78, w: 26, y: 38, r: 10, delay: 1,
  },
];

// Rays of the fracture preview, from the impact point in the middle
const CRACK_PREVIEW_PATHS = [
  'M60 29 L40 18 L22 14 L4 6',
  'M60 29 L78 14 L92 9 L116 2',
  'M60 29 L84 34 L102 44 L118 50',
  'M60 29 L44 40 L30 50 L12 56',
  'M60 29 L58 12 L62 1',
  'M60 29 L64 46 L60 57',
];

// Pieces of the singularity preview: starting angle, starting distance from the hole, and a
// negative delay so the still frame shows them at different points of their spiral
const HOLE_PREVIEW_DOTS = [
  { a: 0, r: 60, delay: 0 },
  { a: 35, r: 40, delay: -1.7 },
  { a: 70, r: 50, delay: -0.3 },
  { a: 110, r: 58, delay: -0.9 },
  { a: 145, r: 34, delay: -2.1 },
  { a: 180, r: 46, delay: -1.5 },
  { a: 215, r: 62, delay: -0.6 },
  { a: 250, r: 38, delay: -1.1 },
  { a: 290, r: 52, delay: -1.9 },
  { a: 325, r: 56, delay: -1.2 },
];

// Columns of the overheat preview: a negative delay so the still frame shows a ragged melt, and
// how far each has slid for the still frame without motion
const MELT_PREVIEW_COLUMNS = [
  { delay: -0.95, y: 18 },
  { delay: -1.05, y: 26 },
  { delay: -0.9, y: 14 },
  { delay: -1.15, y: 34 },
  { delay: -1.3, y: 48 },
  { delay: -1.1, y: 30 },
  { delay: -0.85, y: 10 },
  { delay: -1, y: 22 },
];

// Towers of the megapolis preview: position, width, height (all in % of the box) and a negative
// delay, so the still frame shows the skyline already built
const CITY_PREVIEW_TOWERS = [
  {
    x: 4, w: 9, h: 40, delay: -1.3,
  },
  {
    x: 15, w: 7, h: 70, delay: -1.2,
  },
  {
    x: 24, w: 11, h: 52, delay: -1.4,
  },
  {
    x: 38, w: 8, h: 88, delay: -1.1,
  },
  {
    x: 48, w: 12, h: 62, delay: -1.25,
  },
  {
    x: 63, w: 7, h: 78, delay: -1.35,
  },
  {
    x: 73, w: 10, h: 46, delay: -1.15,
  },
  {
    x: 86, w: 9, h: 66, delay: -1.3,
  },
];

// Pixels of the disintegration preview: a block of 10 × 6, blown away column by column from the
// left. Their drift is spread with fixed formulas rather than at random, so the server and the
// browser render the same thing. The negative delays make the still frame show the wind front.
const DUST_PREVIEW_DOTS = Array.from({ length: 60 }, (_, i) => {
  const row = Math.floor(i / 10);
  const col = i % 10;
  return {
    key: i,
    x: 34 + col * 6,
    y: 11 + row * 6,
    delay: -(1.7 - col * 0.13),
    dx: 50 + ((row * 13 + col * 7) % 40),
    dy: 6 - ((row * 5 + col * 11) % 24),
    tone: ['dust-primary', 'dust-secondary', 'dust-text'][(row + col) % 3],
  };
});

// Sequences other than the grid are loaded only when launched
const CyberpunkCollapse = defineAsyncComponent(() => import('./CyberpunkCollapse.vue'));
const CyberpunkCorruption = defineAsyncComponent(() => import('./CyberpunkCorruption.vue'));
const CyberpunkFracture = defineAsyncComponent(() => import('./CyberpunkFracture.vue'));
const CyberpunkSingularity = defineAsyncComponent(() => import('./CyberpunkSingularity.vue'));
const CyberpunkOverheat = defineAsyncComponent(() => import('./CyberpunkOverheat.vue'));
const CyberpunkMegapolis = defineAsyncComponent(() => import('./CyberpunkMegapolis.vue'));
const CyberpunkDeluge = defineAsyncComponent(() => import('./CyberpunkDeluge.vue'));
const CyberpunkDisintegration = defineAsyncComponent(() => import('./CyberpunkDisintegration.vue'));

// Sequence picker. In the store so the terminal's `sudo rm -rf /` uses the same choice.
const { selfDestructSequence: selectedSequence } = storeToRefs(preferencesStore);
const sequence = computed(() => SELF_DESTRUCT_SEQUENCES.find((item) => item.id === selectedSequence.value) ?? SELF_DESTRUCT_SEQUENCES[0]);
const availability = computed(() => {
  const count = SELF_DESTRUCT_SEQUENCES.length;
  if (isEnglish.value) return `${count} sequence${count > 1 ? 's' : ''} available`;
  return `${count} séquence${count > 1 ? 's' : ''} disponible${count > 1 ? 's' : ''}`;
});

// Radio group: the arrows move both the choice and the focus
function onSequenceKeydown(event: KeyboardEvent, index: number) {
  const count = SELF_DESTRUCT_SEQUENCES.length;
  const moves: Record<string, number> = {
    ArrowRight: (index + 1) % count,
    ArrowDown: (index + 1) % count,
    ArrowLeft: (index - 1 + count) % count,
    ArrowUp: (index - 1 + count) % count,
    Home: 0,
    End: count - 1,
  };
  const target = moves[event.key];
  if (target === undefined) return;
  event.preventDefault();
  selectedSequence.value = SELF_DESTRUCT_SEQUENCES[target]?.id ?? selectedSequence.value;
  document.getElementById(`self-destruct-sequence-${selectedSequence.value}`)?.focus();
}

// Animation state
const isDestructing = ref(false);
// In the store so the terminal can open the alarm too (`sudo rm -rf /`).
const { showSelfDestructAlarm: showAlarm } = storeToRefs(preferencesStore);
const showDestruction = ref(false);
const isComplete = ref(false);
const countdown = ref(5);
const currentSection = ref(0);
const gridProgress = ref(0);
const destructionCanvas = ref<HTMLCanvasElement | null>(null);

// Sections to destroy in order
const sections = ['home', 'about', 'experience', 'projects', 'interests'];

// Setup canvas for destruction animation
const setupCanvas = () => {
  if (!destructionCanvas.value) return;

  const canvas = destructionCanvas.value;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Set canvas size to window size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

// Destroy the next section
const destroyNextSection = () => {
  if (currentSection.value >= sections.length) {
    // All sections destroyed, show reset screen
    showDestruction.value = false;
    isComplete.value = true;
    return;
  }

  const sectionId = sections[currentSection.value];
  const sectionElement = document.getElementById(sectionId);

  if (sectionElement) {
    // Scroll to the section
    sectionElement.scrollIntoView({ behavior: 'instant', block: 'start' });

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    animateGridDestruction(sectionElement);
  } else {
    // Section not found, move to next
    currentSection.value += 1;
    destroyNextSection();
  }
};

function gaussianRandom(mean: number, stdDev: number) {
  // Box-Muller
  const u = 1 - Math.random();
  const v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z * stdDev + mean;
}

function randomCoord(size: number) {
  // 50% de chance de viser le coin gauche (0), 50% le coin droit (size-1)
  const mean = Math.random() < 0.5 ? 0 : size - 1;
  const stdDev = size / 5; // étalement, à ajuster
  const x = Math.round(gaussianRandom(mean, stdDev));

  // clamp entre 0 et size-1
  return Math.max(0, Math.min(size - 1, x));
}

function createCyberPattern(color: string): CanvasPattern | null {
  const pCanvas = document.createElement('canvas');
  pCanvas.width = 8;
  pCanvas.height = 8;
  const pCtx = pCanvas.getContext('2d');

  if (!pCtx) return null;

  pCtx.fillStyle = color;
  pCtx.fillRect(0, 0, 8, 8);

  // tracer une ligne diagonale style "glitch"
  pCtx.strokeStyle = 'black';
  pCtx.beginPath();
  pCtx.moveTo(0, 8);
  pCtx.lineTo(8, 0);
  pCtx.stroke();

  return pCtx.createPattern(pCanvas, 'repeat');
}

// Animate the grid destruction for a section
const animateGridDestruction = (sectionElement: HTMLElement) => {
  if (!destructionCanvas.value) return;

  const canvas = destructionCanvas.value;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Get section position and size
  const rect = sectionElement.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  const sectionTop = rect.top + scrollTop;
  const sectionHeight = window.innerHeight;
  const sectionWidth = window.innerWidth;
  const sectionLeft = rect.left;

  // Grid configuration
  const gridSize = 20;
  const squareWidth = sectionWidth / gridSize;
  const squareHeight = sectionHeight / gridSize;

  // Create array to track which squares are filled
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return
  const squares: boolean[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(false));
  let filledSquares = 0;
  const totalSquares = gridSize * gridSize;

  // Track extra frames after destruction
  let extraFrames = 0;
  const EXTRA_FRAMES = 5;

  gridProgress.value = 0;

  // Store squares added in the last 5 frames
  const lastFramesSquares: { row: number; col: number }[][] = [];

  // Animation function
  const animateSquares = () => {
    // Clear previous frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Add some random squares each frame
    const squaresToAdd = Math.min(3, totalSquares - filledSquares);
    const currentFrameSquares: { row: number; col: number }[] = [];

    for (let i = 0; i < squaresToAdd; i += 1) {
      let row;
      let col;
      do {
        row = randomCoord(gridSize);
        col = randomCoord(gridSize);
      } while (squares[row][col]);

      squares[row][col] = true;
      currentFrameSquares.push({ row, col });
      filledSquares += 1;
    }

    // Update lastFramesSquares (keep only last 5 frames)
    lastFramesSquares.push(currentFrameSquares);
    if (lastFramesSquares.length > 5) {
      lastFramesSquares.shift();
    }

    // Flatten lastFramesSquares to get all squares added in last 5 frames
    const recentSquares = lastFramesSquares.flat();

    const root = document.getElementById('cyberpunkroot')!;

    // Draw all squares
    for (let row = 0; row < gridSize; row += 1) {
      for (let col = 0; col < gridSize; col += 1) {
        if (squares[row][col]) {
          const x = sectionLeft + (col * squareWidth);
          const y = sectionTop - scrollTop + (row * squareHeight);

          // Draw primary color square if in recentSquares
          if (recentSquares.some((s) => s.row === row && s.col === col)) {
            const pattern = createCyberPattern(`rgb(${getComputedStyle(root).getPropertyValue('--color-primary')})`);
            ctx.fillStyle = pattern ?? `rgb(${getComputedStyle(root).getPropertyValue('--color-primary')})`;
            ctx.fillRect(x, y, squareWidth, squareHeight);
          } else {
            ctx.fillStyle = '#000000';
            ctx.fillRect(x, y, squareWidth, squareHeight);
          }

          // Draw borders if adjacent to a gap
          ctx.save();
          ctx.strokeStyle = `rgb(${getComputedStyle(root).getPropertyValue('--color-primary')})`;
          ctx.lineWidth = 2;

          // Top border
          if (row === 0 || !squares[row - 1][col]) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + squareWidth, y);
            ctx.stroke();
          }
          // Bottom border
          if (row === gridSize - 1 || !squares[row + 1][col]) {
            ctx.beginPath();
            ctx.moveTo(x, y + squareHeight);
            ctx.lineTo(x + squareWidth, y + squareHeight);
            ctx.stroke();
          }
          // Left border
          if (col === 0 || !squares[row][col - 1]) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + squareHeight);
            ctx.stroke();
          }
          // Right border
          if (col === gridSize - 1 || !squares[row][col + 1]) {
            ctx.beginPath();
            ctx.moveTo(x + squareWidth, y);
            ctx.lineTo(x + squareWidth, y + squareHeight);
            ctx.stroke();
          }
          ctx.restore();
        }
      }
    }

    // Update progress
    gridProgress.value = (filledSquares / totalSquares) * 100;

    if (filledSquares < totalSquares || extraFrames < EXTRA_FRAMES) {
      // Continue animation
      setTimeout(animateSquares, 50);
      if (filledSquares >= totalSquares) {
        extraFrames += 1; // Count extra frames after full destruction
      }
    } else {
      // Fill the whole section with black
      ctx.fillStyle = '#000000';
      ctx.fillRect(sectionLeft, sectionTop - scrollTop, sectionWidth, sectionHeight);

      // Draw borders around the section
      ctx.save();
      ctx.strokeStyle = `rgb(${getComputedStyle(root).getPropertyValue('--color-primary')})`;
      ctx.lineWidth = 2;
      ctx.strokeRect(sectionLeft, sectionTop - scrollTop, sectionWidth, sectionHeight);
      ctx.restore();

      // Section fully destroyed, hide it and move to next
      setTimeout(() => {
        sectionElement.style.display = 'none';
        currentSection.value += 1;

        // Small delay before next section
        destroyNextSection();
      }, 1000);
    }
  };

  // Start the animation
  animateSquares();
};

// Start the destruction animation
const startDestruction = async () => {
  showDestruction.value = true;
  await nextTick();
  setupCanvas();
  destroyNextSection();
};

// Start the self-destruct sequence
const startSelfDestruct = () => {
  isDestructing.value = true;

  // Disable scrolling
  document.body.style.overflow = 'hidden';

  // scroll to the first section
  const firstSection = document.getElementById(sections[0]);
  if (firstSection) {
    firstSection.scrollIntoView({ behavior: 'instant', block: 'start' });
  }

  // Start countdown
  const countdownInterval = setInterval(() => {
    countdown.value -= 1;
    if (countdown.value <= 0) {
      clearInterval(countdownInterval);

      // Remove the header
      const header = document.querySelector('header');
      if (header) {
        header.style.display = 'none';
      }

      showAlarm.value = false;
      startDestruction().catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Error starting destruction:', error);
      });
    }
  }, 1000);
};

// Reset the system
const resetSystem = () => {
  // Reset all state
  isDestructing.value = false;
  showAlarm.value = false;
  showDestruction.value = false;
  isComplete.value = false;
  countdown.value = 5;
  currentSection.value = 0;
  gridProgress.value = 0;

  // Re-enable scrolling
  document.body.style.overflow = '';

  // Show the header again
  const header = document.querySelector('header');
  if (header) {
    header.style.display = '';
  }

  // Show all sections again
  sections.forEach((sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.style.display = '';
    }
  });

  // Clear canvas
  if (destructionCanvas.value) {
    const ctx = destructionCanvas.value.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, destructionCanvas.value.width, destructionCanvas.value.height);
    }
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
};

// Setup canvas on mount
onMounted(() => {
  // Handle window resize
  const handleResize = () => {
    if (destructionCanvas.value) {
      destructionCanvas.value.width = window.innerWidth;
      destructionCanvas.value.height = window.innerHeight;
    }
  };

  window.addEventListener('resize', handleResize);

  // Cleanup on unmount
  return () => {
    window.removeEventListener('resize', handleResize);
  };
});
</script>

<style scoped>
/* Hazard stripes along the top of the panel */
.self-destruct-panel::before {
  content: '';
  position: absolute;
  top: -1px;
  left: -1px;
  right: -1px;
  height: 5px;
  background: repeating-linear-gradient(
    -45deg,
    rgb(var(--color-primary)) 0 8px,
    rgb(var(--color-background)) 8px 16px
  );
}

.sequence-preview {
  position: relative;
  display: block;
  height: 3.5rem;
  overflow: hidden;
  border: 1px solid rgb(var(--color-primary) / 0.15);
  border-radius: 2px;
}

/* Grid preview: the squares fill in like the real sequence. Still by default, playing on hover,
   focus or on the chosen card, so the bottom of the page stays calm. */
.preview-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 2px;
  height: 100%;
  padding: 5px;
}

.preview-grid i {
  border: 1px solid rgb(var(--color-primary) / 0.2);
  animation: preview-cell 2.6s steps(1) infinite paused;
}

.sequence-card:is(:hover, :focus-visible, [aria-checked="true"]) .preview-grid i {
  animation-play-state: running;
}

@keyframes preview-cell {
  0% {
    background: transparent;
  }
  30% {
    background: repeating-linear-gradient(45deg, rgb(var(--color-primary)) 0 2px, #000 2px 4px);
  }
  42%, 100% {
    background: #000;
    border-color: rgb(var(--color-primary) / 0.7);
  }
}

/* Collapse preview: bars drop to the bottom of the box and tilt as they land */
.preview-fall i {
  position: absolute;
  top: 6px;
  height: 7px;
  background: rgb(var(--color-primary));
  animation: preview-fall 2.8s cubic-bezier(0.5, 0, 1, 0.5) infinite paused;
}

.sequence-card:is(:hover, :focus-visible, [aria-checked="true"]) .preview-fall i {
  animation-play-state: running;
}

@keyframes preview-fall {
  0%, 12% {
    transform: none;
    opacity: 1;
  }
  50%, 86% {
    transform: translateY(var(--fall-y)) rotate(var(--fall-r));
    opacity: 1;
  }
  100% {
    transform: translateY(var(--fall-y)) rotate(var(--fall-r));
    opacity: 0;
  }
}

/* Corruption preview: the name flickers into glyphs with a colour split */
.preview-glitch {
  display: grid;
  height: 100%;
  place-items: center;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: rgb(var(--color-primary));
}

.preview-glitch span {
  grid-area: 1 / 1;
}

.glitch-clean {
  animation: preview-glitch-clean 1.6s steps(1) infinite paused;
}

.glitch-bad {
  opacity: 0;
  color: rgb(var(--color-text));
  text-shadow: -2px 0 rgb(255 0 128), 2px 0 rgb(0 255 255);
  animation: preview-glitch-bad 1.6s steps(1) infinite paused;
}

.sequence-card:is(:hover, :focus-visible, [aria-checked="true"]) :is(.glitch-clean, .glitch-bad) {
  animation-play-state: running;
}

@keyframes preview-glitch-clean {
  0%, 40% {
    opacity: 1;
    transform: none;
  }
  45% {
    opacity: 1;
    transform: translateX(4px);
  }
  50%, 70% {
    opacity: 0;
  }
  75%, 100% {
    opacity: 1;
    transform: none;
  }
}

@keyframes preview-glitch-bad {
  0%, 48% {
    opacity: 0;
  }
  50% {
    opacity: 1;
    transform: translateX(-3px) skewX(-12deg);
  }
  60% {
    opacity: 1;
    transform: translateX(3px);
  }
  72%, 100% {
    opacity: 0;
  }
}

/* Fracture preview: cracks run out from the middle, then the pane drops. The negative delay makes
   the still frame show the cracks already drawn. */
.preview-crack svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.preview-crack path {
  fill: none;
  stroke: rgb(var(--color-text));
  stroke-width: 1.2;
  stroke-dasharray: 80;
  stroke-dashoffset: 80;
  animation: preview-crack 2.8s ease-out -1.5s infinite paused;
}

.crack-pane {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgb(var(--color-primary) / 0.15), transparent 60%);
  animation: preview-pane 2.8s ease-in -1.5s infinite paused;
}

.sequence-card:is(:hover, :focus-visible, [aria-checked="true"]) :is(.preview-crack path, .crack-pane) {
  animation-play-state: running;
}

@keyframes preview-crack {
  0% {
    stroke-dashoffset: 80;
    opacity: 1;
  }
  45%, 70% {
    stroke-dashoffset: 0;
    opacity: 1;
  }
  100% {
    stroke-dashoffset: 0;
    opacity: 0;
  }
}

@keyframes preview-pane {
  0%, 68% {
    transform: none;
    opacity: 1;
  }
  100% {
    transform: translateY(40px) rotate(6deg);
    opacity: 0;
  }
}

/* Singularity preview: pieces spiral into a black hole with its ring of light */
.preview-hole b {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 12px;
  height: 12px;
  margin: -6px;
  border-radius: 50%;
  background: #000;
  box-shadow: 0 0 0 1.5px rgb(255 240 200 / 0.9), 0 0 10px 3px rgb(var(--color-primary) / 0.5);
}

.hole-disk {
  position: absolute;
  inset: 0;
  transform: scaleY(0.38);
}

/* The rim of the disk */
.hole-disk::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  width: 104px;
  height: 104px;
  margin: -52px;
  border: 1px solid rgb(var(--color-primary) / 0.25);
  border-radius: 50%;
}

/* The same functions on both ends, so the turn of more than 360° is kept. The pieces turn back and
   stretch back up, so the flattening of the disk moves them without squashing them. */
.hole-disk i {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 4px;
  height: 4px;
  margin: -2px;
  background: rgb(var(--color-primary));
  animation: preview-spiral 2.4s cubic-bezier(0.5, 0, 0.9, 0.6) infinite paused;
}

.hole-disk i:nth-child(even) {
  background: rgb(var(--color-secondary));
}

.sequence-card:is(:hover, :focus-visible, [aria-checked="true"]) .hole-disk i {
  animation-play-state: running;
}

@keyframes preview-spiral {
  from {
    transform: rotate(var(--hole-a)) translateX(var(--hole-r)) rotate(calc(-1 * var(--hole-a))) scale(1, 2.6);
    opacity: 1;
  }
  to {
    transform: rotate(calc(var(--hole-a) + 540deg)) translateX(0) rotate(calc(-1 * var(--hole-a) - 540deg)) scale(0.2, 0.52);
    opacity: 0;
  }
}

/* Overheat preview: strips of a screen slide down at their own pace over molten metal */
.preview-melt {
  display: block;
  height: 100%;
  background: radial-gradient(ellipse 80% 70% at 50% 120%, #ff7a1a, #c2300c 35%, #2a0502 75%);
}

/* The lines line up from one strip to the next, like the text of one screen */
.preview-melt i {
  position: absolute;
  top: 0;
  width: 12.5%;
  height: 100%;
  background:
    repeating-linear-gradient(180deg, transparent 0 7px, rgb(var(--color-primary) / 0.55) 7px 9px),
    rgb(var(--color-background));
  transform-origin: 50% 0;
  animation: preview-melt 2.8s cubic-bezier(0.5, 0, 0.9, 0.5) infinite paused;
}

.sequence-card:is(:hover, :focus-visible, [aria-checked="true"]) .preview-melt i {
  animation-play-state: running;
}

@keyframes preview-melt {
  0%, 25% {
    transform: none;
  }
  75%, 100% {
    transform: translateY(110%) scaleY(1.2);
  }
}

/* Megapolis preview: a neon skyline grows out of a glowing street, then powers down */
.preview-city {
  display: block;
  height: 100%;
  background: linear-gradient(rgb(45 10 55), #000 85%);
  border-bottom: 1px solid rgb(var(--color-secondary) / 0.7);
}

/* Lit floors: the windows of the towers */
.preview-city i {
  position: absolute;
  bottom: 0;
  background:
    repeating-linear-gradient(0deg, transparent 0 3px, rgb(var(--color-primary) / 0.7) 3px 4px),
    #0b0b12;
  border-top: 1px solid rgb(var(--color-primary));
  transform-origin: 50% 100%;
  animation: preview-rise 3s cubic-bezier(0.2, 0.9, 0.3, 1.15) infinite paused;
}

.preview-city i:nth-child(even) {
  background:
    repeating-linear-gradient(0deg, transparent 0 3px, rgb(var(--color-secondary) / 0.7) 3px 4px),
    #0b0b12;
  border-top-color: rgb(var(--color-secondary));
}

.sequence-card:is(:hover, :focus-visible, [aria-checked="true"]) .preview-city i {
  animation-play-state: running;
}

@keyframes preview-rise {
  0% {
    transform: scaleY(0);
    opacity: 1;
  }
  35%, 80% {
    transform: scaleY(1);
    opacity: 1;
  }
  100% {
    transform: scaleY(1);
    opacity: 0;
  }
}

/* Deluge preview: the liquid rises, its wave rolls, a bar floats on it, then it drains. The
   negative delay makes the still frame show it risen. */
.flood-water {
  position: absolute;
  inset: 0;
  background: rgb(var(--color-terminal) / 0.3);
  animation: preview-flood 3.2s ease-in-out -1.4s infinite paused;
}

/* The wave repeats every half of its width: sliding by half loops seamlessly */
.flood-water svg {
  position: absolute;
  left: 0;
  bottom: 100%;
  width: 200%;
  height: 8px;
  fill: rgb(var(--color-terminal) / 0.3);
  animation: preview-wave 1.2s linear infinite paused;
}

.flood-water i {
  position: absolute;
  top: -7px;
  left: 30%;
  width: 34px;
  height: 6px;
  background: rgb(var(--color-primary));
  animation: preview-bob 0.9s ease-in-out infinite alternate paused;
}

.sequence-card:is(:hover, :focus-visible, [aria-checked="true"]) :is(.flood-water, .flood-water svg, .flood-water i) {
  animation-play-state: running;
}

@keyframes preview-flood {
  0% {
    transform: translateY(100%);
  }
  55%, 80% {
    transform: translateY(30%);
  }
  100% {
    transform: translateY(100%);
  }
}

@keyframes preview-wave {
  to {
    transform: translateX(-50%);
  }
}

@keyframes preview-bob {
  from {
    transform: translateY(-1px) rotate(-8deg);
  }
  to {
    transform: translateY(2px) rotate(7deg);
  }
}

/* Disintegration preview: the pixels of a block blow away to the right and fade */
.preview-dust i {
  position: absolute;
  width: 5px;
  height: 5px;
  animation: preview-dust 2.6s ease-in infinite paused;
}

.preview-dust .dust-primary {
  background: rgb(var(--color-primary));
}

.preview-dust .dust-secondary {
  background: rgb(var(--color-secondary));
}

.preview-dust .dust-text {
  background: rgb(var(--color-text) / 0.8);
}

.sequence-card:is(:hover, :focus-visible, [aria-checked="true"]) .preview-dust i {
  animation-play-state: running;
}

@keyframes preview-dust {
  0%, 20% {
    transform: none;
    opacity: 1;
  }
  75%, 100% {
    transform: translate(var(--dust-x), var(--dust-y)) scale(0.5);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .preview-grid i,
  .preview-fall i,
  .glitch-clean,
  .glitch-bad,
  .preview-crack path,
  .crack-pane,
  .hole-disk i,
  .preview-melt i,
  .preview-city i,
  .flood-water,
  .flood-water svg,
  .flood-water i,
  .preview-dust i {
    animation: none;
  }

  /* Still frame of the deluge preview: the liquid risen */
  .flood-water {
    transform: translateY(35%);
  }

  /* Still frame of the overheat preview: a ragged melt */
  .preview-melt i {
    transform: translateY(var(--melt-y));
  }

  /* Still frame of the fracture preview: the cracks drawn */
  .preview-crack path {
    stroke-dashoffset: 0;
  }

  /* Still frame of the singularity preview: the pieces around the hole */
  .hole-disk i {
    transform: rotate(var(--hole-a)) translateX(var(--hole-r)) rotate(calc(-1 * var(--hole-a))) scale(1, 2.6);
  }
}

@keyframes alarm-flash {
  0%, 100% {
    background-color: rgba(239, 68, 68, 0.1);
  }
  50% {
    background-color: rgba(239, 68, 68, 0.4);
  }
}

@keyframes countdown-pulse {
  0%, 100% {
    transform: scale(1);
    text-shadow: 0 0 20px #ef4444;
  }
  50% {
    transform: scale(1.1);
    text-shadow: 0 0 40px #ef4444, 0 0 60px #ef4444;
  }
}

@keyframes static-noise {
  0%, 100% { opacity: 0.8; }
  25% { opacity: 0.3; }
  50% { opacity: 0.9; }
  75% { opacity: 0.1; }
}

.alarm-overlay {
  animation: alarm-flash 0.5s infinite;
}

.alarm-ring-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, +75%);
}

.alarm-ring {
  width: 100px;
  height: 100px;
  border: 3px solid #ef4444;
  border-radius: 50%;
  animation: alarm-ring 2s infinite;
}

@keyframes alarm-ring {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
}

.countdown-number {
  animation: countdown-pulse 1s infinite;
}

.static-effect {
  background: repeating-linear-gradient(
    90deg,
    rgb(var(--color-primary)) 0px,
    rgb(var(--color-primary)) 1px,
    transparent 1px,
    transparent 3px
  );
  animation: static-noise 0.1s infinite;
}

.glitch-text {
  position: relative;
  display: inline-block;
}

.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.8;
}

.glitch-text::before {
  color: #00ffff;
  z-index: -1;
  animation: glitch 1s cubic-bezier(0.5, 0, 0.5, 1) both infinite;
  animation-delay: 0.1s;
}

.glitch-text::after {
  color: #ff00ff;
  z-index: -1;
  animation: glitch 1s cubic-bezier(0.5, 0, 0.5, 1) reverse both infinite;
  animation-delay: 0.2s;
}

@keyframes glitch {
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 1px); }
  40% { transform: translate(-2px, 1px); }
  60% { transform: translate(2px, 1px); }
  80% { transform: translate(2px, 1px); }
  100% { transform: translate(0); }
}
</style>
