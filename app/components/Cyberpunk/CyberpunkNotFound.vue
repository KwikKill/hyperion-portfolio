<template>
  <div class="relative min-h-dvh overflow-x-clip">
    <!-- The grid, its breach and the hologram (utils/notFoundScene.ts), at the top of the page. As
         tall as the largest viewport, so a phone's toolbar showing or hiding does not rebuild the
         scene; on a phone the page goes on below it, and the floor fades into the background. -->
    <div class="absolute inset-x-0 top-0 h-lvh">
      <canvas ref="canvas" class="size-full" aria-hidden="true" @click="onCanvasClick"/>
      <div class="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg lg:hidden"/>
    </div>

    <!-- The panels leave the middle of the screen to the scene; clicks between them reach it. From
         1024 px, one screen high (taller on short screens) so the middle row takes what is left. -->
    <div
      class="pointer-events-none relative z-10 grid min-h-dvh grid-cols-1 gap-6 px-4 pb-8 max-lg:content-start
        lg:h-dvh lg:min-h-[44rem] lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)_minmax(0,18rem)]
        lg:grid-rows-[auto_minmax(0,1fr)_auto] lg:gap-x-10 lg:px-8 xl:grid-cols-[minmax(0,23rem)_minmax(0,1fr)_minmax(0,23rem)]"
    >
      <header class="pointer-events-auto flex h-16 items-center gap-4 border-b border-primary/40 lg:col-span-3">
        <a
          :href="home"
          class="cyberpunk-text-glow flex shrink-0 items-center gap-2 whitespace-nowrap text-lg font-bold uppercase
            tracking-wide text-primary sm:text-xl"
        >
          <span class="text-gray-500">&lt;</span>
          <img src="@/assets/logo.png" alt="" class="size-8"/>
          <span class="hidden sm:inline">Gabriel Blaisot - Portfolio</span>
          <span class="sm:hidden">Gabriel Blaisot</span>
          <span class="text-gray-500">&gt;</span>
        </a>
        <div class="ml-auto flex items-center gap-5">
          <p
            class="font-mono hidden items-center gap-2 text-xs uppercase tracking-widest md:flex"
            :class="repaired ? 'text-terminal' : 'text-error'"
          >
            <span class="size-2 animate-pulse rounded-full bg-current" aria-hidden="true"/>
            {{ repaired ? t('Signal rétabli', 'Signal restored') : t('Signal perdu', 'Signal lost') }}
          </p>
          <button
            type="button"
            class="font-mono min-h-[44px] border border-primary/50 px-3 text-xs uppercase leading-tight tracking-wider
              text-primary transition-colors hover:border-primary"
            :aria-pressed="soundOn"
            data-umami-event="404-sound"
            @click="toggleSound"
          >
            {{ soundOn ? t('Son activé', 'Sound on') : t('Son coupé', 'Sound off') }}
          </button>
        </div>
      </header>

      <!-- Where the scene puts the hologram and the breach -->
      <div
        ref="holoBox"
        class="h-[54svh] min-h-[320px] lg:col-start-2 lg:row-span-2 lg:row-start-2 lg:h-auto lg:min-h-0"
        aria-hidden="true"
      />

      <!-- What happened, and the way out -->
      <div class="not-found-copy pointer-events-auto relative lg:col-start-1 lg:row-start-3 lg:self-end">
        <p
          class="font-mono flex items-center gap-2 text-xs uppercase tracking-[0.2em]"
          :class="repaired ? 'text-terminal' : 'text-accent'"
        >
          <span class="blink-cursor" aria-hidden="true">▮</span>
          {{ eyebrow }}
        </p>
        <h1 class="not-found-title cyberpunk-text-glow mt-3 uppercase text-primary">
          <span class="sr-only">{{ srTitle }}</span>
          <span class="glitch-text" :data-text="displayedTitle" aria-hidden="true">{{ displayedTitle }}</span>
        </h1>
        <p class="mt-4 leading-relaxed text-text">
          <template v-if="isNotFound">
            {{ t('L\'adresse', 'The address') }}
            <code class="font-mono break-all text-secondary">{{ shownPath }}</code>
            {{ t(
              'pointe vers une zone de la grille qui n\'existe pas, ou plus. Vous êtes hors carte.',
              'points to a part of the grid that does not exist, or no longer does. You are off the map.',
            ) }}
          </template>
          <template v-else>
            {{ t(
              'Une erreur inattendue a fait tomber ce secteur de la grille. Réparer la grille relance le portfolio.',
              'An unexpected error took this sector of the grid down. Repairing the grid restarts the portfolio.',
            ) }}
          </template>
        </p>
        <p v-if="suggestion" class="font-mono mt-3 text-sm text-gray-300">
          {{ suggestion.project
            ? t('Vous cherchiez le projet', 'Looking for the project')
            : t('Vouliez-vous dire', 'Did you mean') }}
          <a
            :href="suggestion.href"
            class="text-primary underline decoration-primary/50 underline-offset-4 transition-colors hover:text-hover"
            data-umami-event="404-suggestion"
          >{{ suggestion.label }}</a>{{ t(' ?', '?') }}
        </p>
        <div class="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            class="not-found-button bg-primary px-6 py-3 font-medium uppercase tracking-wider text-on-primary
              transition-colors hover:bg-hover disabled:cursor-wait"
            :disabled="repairing"
            data-umami-event="404-repair"
            @click="repair"
          >
            {{ repairing ? t('Réparation…', 'Repairing…') : t('Réparer la grille', 'Repair the grid') }}
          </button>
          <a
            href="/"
            class="not-found-button border-2 border-primary px-6 py-3 font-medium uppercase tracking-wider text-primary
              transition-colors hover:bg-primary/10"
          >
            {{ t('Choisir une version', 'Pick a version') }}
          </a>
        </div>
        <p class="font-mono mt-3 text-xs text-gray-400">
          {{ t('La grille réparée, retour à', 'Once repaired, back to') }} {{ home }}
        </p>
      </div>

      <!-- A terminal that knows the pages that do exist -->
      <CyberpunkTerminalWindow
        class="font-mono pointer-events-auto text-sm lg:col-start-3 lg:row-start-3 lg:self-end"
        :show-icon="false"
        body-class="overflow-y-auto max-h-[230px]"
      >
        <template #title>
          kwikkill@hyperion:~/404
        </template>
        <template #body>
          <div ref="terminalContent" @click="onTerminalClick">
            <div v-for="(line, index) in lines" :key="index" class="mb-1 break-words">
              <template v-if="line.kind === 'command'">
                <span class="text-secondary">{{ PROMPT }}</span>
                <span class="ml-2 text-primary">{{ line.text }}</span>
              </template>
              <span v-else-if="line.kind === 'error'" class="text-error">{{ line.text }}</span>
              <span v-else class="text-terminal">{{ line.text }}</span>
              <span v-if="line.links" class="flex flex-wrap gap-x-[2ch]">
                <a
                  v-for="link in line.links"
                  :key="link.href"
                  :href="link.href"
                  class="leading-6 text-terminal underline-offset-2 transition-colors hover:text-terminal-hover
                    hover:underline"
                >{{ link.label }}</a>
              </span>
            </div>
            <form class="mt-2 flex items-center" @submit.prevent="submitCommand">
              <label for="not-found-input" class="shrink-0 text-secondary">{{ PROMPT }}</label>
              <input
                id="not-found-input"
                ref="input"
                v-model="command"
                type="text"
                class="ml-2 min-w-0 flex-1 border-none bg-transparent p-0 text-primary caret-primary outline-none"
                placeholder="ls"
                autocomplete="off"
                autocapitalize="off"
                spellcheck="false"
                :aria-label="t('Commande du terminal', 'Terminal command')"
                @keydown="onInputKeydown"
              />
            </form>
            <div class="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span class="text-gray-500">{{ t('Essayer :', 'Try:') }}</span>
              <button
                v-for="suggested in ['ls', t('ls projets', 'ls projects'), 'theme matrix', 'repair']"
                :key="suggested"
                type="button"
                class="border border-primary/40 bg-primary/10 px-2 py-1 text-primary transition-colors hover:bg-primary/20"
                @click="runCommand(suggested)"
              >
                {{ suggested }}
              </button>
            </div>
          </div>
        </template>
      </CyberpunkTerminalWindow>

      <!-- Kernel log: the error as the system saw it -->
      <CyberpunkTerminalWindow
        class="font-mono pointer-events-auto lg:col-start-1 lg:row-start-2 lg:self-start"
        :show-icon="false"
        body-class="overflow-y-auto max-h-[13rem]"
      >
        <template #title>
          dmesg
        </template>
        <template #body>
          <ol class="space-y-0.5 text-[11px] leading-relaxed">
            <li v-for="(line, index) in trace" :key="index" :class="TRACE_TONES[line.tone]">
              {{ line.text }}
            </li>
          </ol>
          <p class="mt-2 text-[11px] text-gray-400">
            grid ▸ {{ t('intégrité', 'integrity') }}
            <span :class="map.integrity < 0.92 ? 'text-error' : 'text-primary'">{{ integrity }}</span>
            <span class="blink-cursor" aria-hidden="true">_</span>
          </p>
        </template>
      </CyberpunkTerminalWindow>

      <!-- Map of the sector around the breach, live -->
      <CyberpunkTerminalWindow
        class="font-mono pointer-events-auto hidden w-full max-w-[19rem] justify-self-end lg:col-start-3
          lg:row-start-2 lg:block lg:self-start"
        :show-icon="false"
      >
        <template #title>
          {{ t('Secteur', 'Sector') }} {{ sector }}
        </template>
        <template #body>
          <div
            class="grid gap-[3px]"
            :style="{ gridTemplateColumns: `repeat(${map.cols}, minmax(0, 1fr))` }"
            aria-hidden="true"
          >
            <span v-for="(cell, index) in map.cells" :key="index" class="aspect-square" :class="CELL_CLASSES[cell]"/>
          </div>
          <dl class="mt-3 grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 text-xs">
            <dt class="text-gray-400">
              {{ t('Intégrité', 'Integrity') }}
            </dt>
            <dd class="text-right tabular-nums" :class="map.integrity < 0.92 ? 'text-error' : 'text-primary'">
              {{ integrity }}
            </dd>
            <dt class="text-gray-400">
              {{ t('Cellules perdues', 'Lost cells') }}
            </dt>
            <dd class="text-right tabular-nums text-primary">
              {{ map.lost }}
            </dd>
          </dl>
          <span class="mt-2 block h-1 bg-primary/15" aria-hidden="true">
            <span
              class="block h-full transition-[width] duration-300"
              :class="map.integrity < 0.92 ? 'bg-error' : 'bg-primary'"
              :style="{ width: `${Math.max(0, (map.integrity - 0.85) / 0.15) * 100}%` }"
            />
          </span>
        </template>
      </CyberpunkTerminalWindow>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed, nextTick, onBeforeUnmount, onMounted, ref,
} from 'vue';

import cyberpunksFont from '@/assets/fonts/Cyberpunks.otf';
import valoraxFont from '@/assets/fonts/Valorax-lg25V.otf';
import { usePreferencesStore } from '@/stores/preferences';
import { useProjectsStore } from '@/stores/projects';
import { projectAnchor } from '@/utils/anchors';
import { prefersReducedMotion } from '@/utils/motion';
import {
  mountNotFoundScene, type NotFoundScene, type SceneEvent, type SectorMap,
} from '@/utils/notFoundScene';
import { portfolioPath } from '@/utils/routes';
import {
  createSfx, type Drone, setMuted, type Sfx,
} from '@/utils/sfx';
import { sweepTheme } from '@/utils/themeSweep';

import CyberpunkTerminalWindow from './CyberpunkTerminalWindow.vue';

const props = defineProps<{
  // Status of the error: 404 for a missing page, anything else for a crash
  code: number;
  // The address that was asked for
  path: string;
}>();

interface Line {
  kind: 'command' | 'text' | 'error';
  text: string;
  links?: { label: string; href: string }[];
}

interface TraceLine {
  text: string;
  tone: 'log' | 'panic' | 'command' | 'ok';
}

interface TerminalCommand {
  usage?: () => string;
  // Commands without a description are easter eggs, left out of `help`
  description?: () => string;
  run: (args: string[]) => void;
}

const PROMPT = 'kwikkill@hyperion:~/404$';
// The site's display fonts, loaded only here: the hologram's digits and the title
const HOLO_FAMILY = 'Hyperion Holo';
const TITLE_FAMILY = 'Hyperion Title';
const HOLO_FONT = `"${HOLO_FAMILY}", Impact, "Arial Black", sans-serif`;
const RANDOM_CHARS = '0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/';
const THEMES: Record<string, 'default' | 'ghost' | 'matrix' | 'solarpunk'> = {
  cyberpunk: 'default',
  ghost: 'ghost',
  matrix: 'matrix',
  solarpunk: 'solarpunk',
};
// Address words that name the site rather than a project
const NOT_PROJECTS = ['cyberpunk', 'classic', 'classique', 'portfolio', 'projets', 'projects', 'index', 'html'];
const TRACE_TONES = {
  log: 'text-terminal',
  panic: 'text-error font-bold',
  command: 'text-primary',
  ok: 'text-secondary',
};
const CELL_CLASSES = [
  'border border-primary/25',
  'bg-accent shadow-[0_0_6px_rgb(var(--color-accent))]',
  'animate-pulse bg-primary',
  'bg-terminal',
];

const preferencesStore = usePreferencesStore();
const projectsStore = useProjectsStore();
const isEnglish = computed(() => preferencesStore.isEnglish);
const t = (fr: string, en: string) => (isEnglish.value ? en : fr);
const projects = computed(() => projectsStore.getLocalizedProjects);
const isNotFound = computed(() => props.code === 404);
const home = computed(() => portfolioPath(preferencesStore.lang, 'cyberpunk'));
const pages = computed(() => (['fr', 'en'] as const).flatMap((lang) => (['cyberpunk', 'classic'] as const)
  .map((version) => portfolioPath(lang, version))));
const shownPath = computed(() => (props.path.length > 42 ? `${props.path.slice(0, 40)}…` : props.path));

// A number from the address: the same address always opens the same breach, in the same sector
function hashOf(text: string) {
  let h = 7;
  for (let i = 0; i < text.length; i += 1) h = (h * 31 + text.charCodeAt(i)) % 4294967296;
  return h;
}
const seed = hashOf(props.path);
const hex = seed.toString(16).padStart(8, '0').toUpperCase();
const sector = `${hex.slice(0, 2)}:${hex.slice(2, 4)}`;

const stemOf = (file: string) => file.replace(/\.[^.]+$/, '');

function distance(a: string, b: string) {
  let row = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i += 1) {
    const next = [i];
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      next.push(Math.min((row[j] ?? 0) + 1, (next[j - 1] ?? 0) + 1, (row[j - 1] ?? 0) + cost));
    }
    row = next;
  }
  return row[b.length] ?? 0;
}

// What the visitor probably meant: a project named in the address, else a page one typo away
const suggestion = computed(() => {
  const clean = props.path.toLowerCase().replace(/\/+$/, '');
  const words = clean.split(/[^a-z0-9]+/).filter((word) => word.length >= 3 && !NOT_PROJECTS.includes(word));
  const close = (word: string, token: string) => word === token
    || (word.length >= 5 && token.includes(word))
    || (token.length >= 5 && word.includes(token))
    || (token.length >= 5 && distance(word, token) <= 1 + Math.floor(token.length / 6));
  const project = projects.value.find((item) => [item.file.en, item.file.fr]
    .flatMap((file) => stemOf(file).split(/[^a-z0-9]+/))
    .filter((token) => token.length >= 4)
    .some((token) => words.some((word) => close(word, token))));
  if (project) return { href: `${home.value}#${projectAnchor(project)}`, label: project.localizedName, project: true };

  const versions = (['cyberpunk', 'classic'] as const).map((version) => ({
    version,
    d: Math.min(...[`/fr/${version}`, `/en/${version}`, `/${version}`].map((page) => distance(clean, page))),
  })).sort((a, b) => a.d - b.d);
  const best = versions[0];
  if (!best || best.d > 3) return null;
  const href = portfolioPath(preferencesStore.lang, best.version);
  return { href, label: href, project: false };
});

const repaired = ref(false);
const title = computed(() => {
  if (repaired.value) return t('Secteur rétabli', 'Sector restored');
  return isNotFound.value ? t('Secteur introuvable', 'Sector not found') : t('Défaillance système', 'System failure');
});
const eyebrow = computed(() => {
  if (repaired.value) return 'SIGNAL_RESTORED · 200';
  return isNotFound.value ? 'ERR_SECTOR_404' : `ERR_KERNEL_PANIC · ${props.code}`;
});
const srTitle = computed(() => (isNotFound.value
  ? t('Erreur 404 : page introuvable', 'Error 404: page not found')
  : t(`Erreur ${props.code} : le site a rencontré un problème`, `Error ${props.code}: the site ran into a problem`)));

const canvas = ref<HTMLCanvasElement | null>(null);
const holoBox = ref<HTMLElement | null>(null);
const terminalContent = ref<HTMLElement | null>(null);
const input = ref<HTMLInputElement | null>(null);

const displayedTitle = ref(title.value);
const map = ref<SectorMap>({
  cols: 17, rows: 11, cells: Array.from({ length: 17 * 11 }, () => 0), lost: 0, integrity: 1,
});
const integrity = computed(() => `${(map.value.integrity * 100).toLocaleString(isEnglish.value ? 'en-GB' : 'fr-FR', {
  minimumFractionDigits: 1, maximumFractionDigits: 1,
})} %`);
const trace = ref<TraceLine[]>([]);
const lines = ref<Line[]>([]);
const command = ref('');
const repairing = ref(false);
const soundOn = ref(false);

let scene: NotFoundScene | null = null;
let reduced = false;
let started = 0;
let unmounted = false;
let titleFrame = 0;
let mapTimer: ReturnType<typeof setInterval> | null = null;
let boxObserver: ResizeObserver | null = null;
const timers: ReturnType<typeof setTimeout>[] = [];
const history: string[] = [];
let historyIndex = 0;

// ---------- Sound ----------

let sfx: Sfx | null = null;
let ambience: Drone[] = [];
const lastPlayed: Partial<Record<SceneEvent, number>> = {};
const SOUNDS: Partial<Record<SceneEvent, (fx: Sfx) => void>> = {
  crack: (fx) => {
    fx.noise({
      type: 'highpass', f: 3200, dur: 0.06, gain: 0.05, pan: Math.random() * 1.2 - 0.6,
    });
    fx.tone({
      type: 'square', f: 1600, f1: 700, dur: 0.07, gain: 0.015,
    });
  },
  fall: (fx) => {
    fx.noise({
      type: 'lowpass', f: 1400, f1: 90, dur: 1.2, gain: 0.07,
    });
    fx.tone({
      f: 260, f1: 45, dur: 1, gain: 0.05,
    });
  },
  glitch: (fx) => {
    fx.noise({
      type: 'bandpass', f: 2600, q: 3, dur: 0.12, gain: 0.06,
    });
    fx.tone({
      type: 'square', f: 140, dur: 0.05, gain: 0.03,
    });
    fx.tone({
      type: 'square', f: 920, dur: 0.04, gain: 0.02, delay: 0.06,
    });
  },
  burst: (fx) => {
    fx.noise({
      type: 'lowpass', f: 700, f1: 80, dur: 0.5, gain: 0.12,
    });
    fx.tone({
      f: 80, f1: 38, dur: 0.45, gain: 0.16,
    });
  },
  seal: (fx) => {
    fx.tone({
      f: 660, f1: 990, dur: 0.12, gain: 0.04,
    });
    fx.noise({
      type: 'highpass', f: 5000, dur: 0.04, gain: 0.03,
    });
  },
  emerge: (fx) => {
    fx.tone({
      type: 'sawtooth', f: 110, f1: 440, dur: 0.9, gain: 0.035,
    });
    fx.noise({
      type: 'bandpass', f: 400, f1: 3000, q: 1.5, dur: 0.9, gain: 0.05,
    });
  },
};

// Off until asked for: the browser only lets sound start from a click anyway
function toggleSound() {
  soundOn.value = !soundOn.value;
  if (!soundOn.value) {
    sfx?.close();
    sfx = null;
    ambience = [];
    return;
  }
  setMuted(false);
  sfx = createSfx();
  ambience = [
    sfx.drone({ brown: true, filter: 'lowpass', f: 240 }),
    sfx.drone({
      freqs: [55, 82.4, 110.2], type: 'sine', filter: 'lowpass', f: 600,
    }),
  ];
  ambience[0]?.gain(0.07, 1.5);
  ambience[1]?.gain(0.025, 2.5);
}

function play(event: SceneEvent) {
  const sound = SOUNDS[event];
  if (!sfx || !sound) return;
  // The breach opening breaks a dozen cells in a row: one sound every 70 ms is enough
  const now = performance.now();
  if (now - (lastPlayed[event] ?? 0) < 70) return;
  lastPlayed[event] = now;
  sound(sfx);
}

// ---------- Scene ----------

function updateMap() {
  if (scene) map.value = scene.sector();
}

function onSceneEvent(event: SceneEvent) {
  if (event === 'change') {
    updateMap();
    return;
  }
  play(event);
  if (event === 'emerge' && repairing.value) markRepaired();
}

// The scene lays itself out in the free middle of the page, in the canvas's coordinates
function measureBox() {
  const el = holoBox.value;
  if (!el || !scene || !canvas.value) return;
  const rect = el.getBoundingClientRect();
  const origin = canvas.value.getBoundingClientRect();
  scene.setBox({
    x: rect.left - origin.left, y: rect.top - origin.top, w: rect.width, h: rect.height,
  });
}

function onCanvasClick(event: MouseEvent) {
  scene?.burst(event.offsetX, event.offsetY);
}

async function loadFonts() {
  if (!('fonts' in document) || typeof FontFace === 'undefined') return;
  const holo = new FontFace(HOLO_FAMILY, `url(${cyberpunksFont})`);
  const titleFace = new FontFace(TITLE_FAMILY, `url(${valoraxFont})`);
  document.fonts.add(holo);
  document.fonts.add(titleFace);
  titleFace.load().catch(() => {
    // The title keeps its fallback font
  });
  try {
    await holo.load();
    if (!unmounted) scene?.setFont(HOLO_FONT);
  } catch {
    // The hologram keeps its fallback font
  }
}

// ---------- Title and kernel log ----------

// Characters lock into place from left to right; the rest keep flickering
function decodeTitle() {
  cancelAnimationFrame(titleFrame);
  const text = title.value;
  const start = performance.now() + 350;
  const step = (now: number) => {
    const progress = Math.min(Math.max((now - start) / 900, 0), 1);
    const locked = Math.floor(progress * text.length);
    displayedTitle.value = text.slice(0, locked) + text.slice(locked)
      .replace(/\S/g, () => RANDOM_CHARS.charAt(Math.floor(Math.random() * RANDOM_CHARS.length)));
    if (progress < 1) titleFrame = requestAnimationFrame(step);
  };
  titleFrame = requestAnimationFrame(step);
}

// Seconds since the page opened, the way the kernel stamps its log
const stamp = () => `[${((performance.now() - started) / 1000).toFixed(6).padStart(11, ' ')}]`;

function log(text: string, tone: TraceLine['tone'] = 'log') {
  trace.value.push({ text, tone });
}

// Written as the breach opens; each line is built when it shows, with the live figures
function playTrace() {
  const indexed = `${pages.value.length} pages, ${projects.value.length} ${t('projets indexés', 'projects indexed')}`;
  const failure = isNotFound.value
    ? `router: ${t('aucune route ne correspond', 'no route matches')} (${indexed})`
    : `app: ${t('exception non gérée', 'unhandled exception')} (${props.code})`;
  const traceId = hashOf(`${props.path}#${props.code}`).toString(16).padStart(8, '0');
  // In step with the scene: the breach is open at 1.6 s, the code climbs out of it at 1.8 s
  const entries: [number, () => void][] = [
    [0.15, () => log(`${stamp()} hyperion: GET ${shownPath.value}`)],
    [0.45, () => log(`${stamp()} ${failure}`)],
    [0.8, () => log(`${stamp()} grid: ${t('lecture du secteur', 'reading sector')} ${sector}… ${t('échec', 'failed')}`)],
    [1.75, () => log(`${stamp()} grid: ${t('brèche ouverte', 'breach open')}, ${map.value.lost} ${t('cellules perdues', 'cells lost')}`)],
    [1.95, () => log(`${stamp()} mmu: ${t('segment introuvable à', 'no segment at')} 0x${hex}`)],
    [2.2, () => log(`Kernel panic - not syncing: ${isNotFound.value ? 'ERR_SECTOR_404' : `ERR_KERNEL_${props.code}`}`, 'panic')],
    [2.35, () => log(`---[ end trace ${traceId} ]---`)],
  ];
  if (reduced) {
    entries.forEach(([, write]) => write());
    return;
  }
  entries.forEach(([time, write]) => timers.push(setTimeout(write, time * 1000)));
}

// ---------- Repair ----------

// The breach is sealed and the 200 climbs out of it: the page says so too
function markRepaired() {
  if (repaired.value) return;
  repaired.value = true;
  updateMap();
  log(`fsck: ${t('grille intacte, intégrité 100 %', 'grid intact, integrity 100 %')}`, 'ok');
  if (reduced) displayedTitle.value = title.value;
  else decodeTitle();
}

async function repair() {
  if (repairing.value) return;
  repairing.value = true;
  log(`$ fsck.grid --repair ${sector}`, 'command');
  log(`fsck: ${map.value.lost} ${t('cellules à reconstruire', 'cells to rebuild')}`);
  sfx?.tone({
    f: 160, f1: 900, dur: 2.2, gain: 0.03,
  });
  await scene?.repair();
  if (unmounted) return;
  markRepaired();
  log(`200 OK · ${t('redirection vers', 'redirecting to')} ${home.value}`, 'ok');
  sweepTheme(() => window.location.assign(home.value));
}

// ---------- Terminal ----------

function scrollTerminal() {
  nextTick(() => {
    const body = terminalContent.value?.parentElement;
    if (body) body.scrollTop = body.scrollHeight;
  }).catch(() => undefined);
}

function print(line: Line) {
  lines.value.push(line);
  scrollTerminal();
}

const pageName = (href: string) => href.replace(/^\//, '');

function findPage(arg: string) {
  const name = arg.toLowerCase().replace(/^\/+|\/+$/g, '');
  if (['', '~', '..', '.'].includes(name)) return home.value;
  const exact = pages.value.find((page) => pageName(page) === name);
  if (exact) return exact;
  if (['classic', 'classique'].includes(name)) return portfolioPath(preferencesStore.lang, 'classic');
  if (name === 'cyberpunk') return home.value;
  return null;
}

function findProject(query: string) {
  return projects.value.find((project) => stemOf(project.localizedFile) === query)
    ?? projects.value.find((project) => stemOf(project.file.en) === query)
    ?? projects.value.find((project) => project.localizedName.toLowerCase().includes(query));
}

function go(href: string) {
  window.location.assign(href);
}

const repairCommand: TerminalCommand = {
  description: () => t('réparer la grille et rentrer à l\'accueil', 'repair the grid and go home'),
  run: () => {
    if (repairing.value) {
      print({ kind: 'error', text: t('fsck: réparation déjà en cours', 'fsck: repair already running') });
      return;
    }
    print({ kind: 'text', text: t('fsck: réparation de la grille…', 'fsck: repairing the grid…') });
    repair().catch(() => undefined);
  },
};

const COMMANDS: Record<string, TerminalCommand> = {
  help: {
    description: () => t('liste des commandes', 'list the commands'),
    run: () => {
      Object.entries(COMMANDS).forEach(([name, { usage, description }]) => {
        if (description) print({ kind: 'text', text: `${usage?.() ?? name} · ${description()}` });
      });
    },
  },
  ls: {
    usage: () => t('ls [projets]', 'ls [projects]'),
    description: () => t('les pages qui existent, ou les projets', 'the pages that exist, or the projects'),
    run: (args) => {
      if (/^proj/i.test(args[0] ?? '')) {
        print({
          kind: 'text',
          text: '',
          links: projects.value.map((project) => ({
            label: stemOf(project.localizedFile), href: `${home.value}#${projectAnchor(project)}`,
          })),
        });
        return;
      }
      print({ kind: 'text', text: '', links: pages.value.map((page) => ({ label: `${pageName(page)}/`, href: page })) });
      print({ kind: 'text', text: t(`+ ${projects.value.length} projets : ls projets`, `+ ${projects.value.length} projects: ls projects`) });
    },
  },
  cd: {
    usage: () => 'cd <page>',
    description: () => t('aller sur une page (cd fr/classic, cd ~)', 'go to a page (cd en/classic, cd ~)'),
    run: (args) => {
      const target = findPage(args[0] ?? '');
      if (!target) {
        print({ kind: 'error', text: t(`cd: ${args[0] ?? ''}: secteur introuvable. Essayez ls.`, `cd: ${args[0] ?? ''}: no such sector. Try ls.`) });
        return;
      }
      print({ kind: 'text', text: t(`Connexion à ${target}…`, `Connecting to ${target}…`) });
      go(target);
    },
  },
  open: {
    usage: () => t('open <projet>', 'open <project>'),
    description: () => t('ouvrir la fiche d\'un projet', 'open a project\'s page'),
    run: (args) => {
      const query = args.join(' ').toLowerCase();
      const project = query ? findProject(query) : undefined;
      if (!project) {
        print({ kind: 'error', text: t(`open: ${query || '?'}: projet introuvable. Essayez ls projets.`, `open: ${query || '?'}: no such project. Try ls projects.`) });
        return;
      }
      print({ kind: 'text', text: t(`Ouverture de ${project.localizedFile}…`, `Opening ${project.localizedFile}…`) });
      go(`${home.value}#${projectAnchor(project)}`);
    },
  },
  repair: repairCommand,
  // The same, under the names a sysadmin would try
  fsck: { run: repairCommand.run },
  reboot: { run: repairCommand.run },
  theme: {
    usage: () => t('theme <nom>', 'theme <name>'),
    description: () => Object.keys(THEMES).join(', '),
    run: (args) => {
      const name = (args[0] ?? '').toLowerCase();
      const theme = THEMES[name];
      if (!theme) {
        print({ kind: 'error', text: t(`theme: choisissez parmi ${Object.keys(THEMES).join(', ')}`, `theme: pick one of ${Object.keys(THEMES).join(', ')}`) });
        return;
      }
      preferencesStore.setCyberpunkTheme(theme, false);
      print({ kind: 'text', text: t(`Thème ${name} appliqué.`, `Theme ${name} applied.`) });
    },
  },
  clear: {
    description: () => t('effacer l\'écran', 'clear the screen'),
    run: () => {
      lines.value = [];
    },
  },
  whoami: {
    run: () => print({ kind: 'text', text: t(`visiteur@secteur-${sector} : égaré hors de la grille`, `visitor@sector-${sector}: lost off the grid`) }),
  },
  sudo: {
    run: (args) => {
      print({
        kind: 'error',
        text: /^rm\s+-rf/.test(args.join(' '))
          ? t('Trop tard : cette partie de la grille a déjà disparu.', 'Too late: this part of the grid is already gone.')
          : t('sudo : kwikkill n\'est pas dans le fichier sudoers. Cet incident sera signalé.', 'sudo: kwikkill is not in the sudoers file. This incident will be reported.'),
      });
    },
  },
  exit: {
    run: () => print({ kind: 'text', text: t('Pas de sortie ici. Essayez repair.', 'No way out from here. Try repair.') }),
  },
};
function runCommand(raw: string) {
  const line = raw.trim();
  if (!line) return;
  history.push(line);
  historyIndex = history.length;
  print({ kind: 'command', text: line });
  // An address typed as is: cd to it
  const [name = '', ...args] = line.startsWith('/') ? ['cd', line] : line.split(/\s+/);
  const found = COMMANDS[name.toLowerCase()];
  if (found) found.run(args);
  else print({ kind: 'error', text: t(`${name} : commande introuvable. Tapez help.`, `${name}: command not found. Type help.`) });
}

function submitCommand() {
  runCommand(command.value);
  command.value = '';
}

// Completes a command name, or the argument of cd, open and theme
function complete(value: string) {
  const space = value.indexOf(' ');
  if (space === -1) {
    const match = Object.keys(COMMANDS).find((name) => name.startsWith(value.toLowerCase()) && name !== value);
    return match ? `${match} ` : null;
  }
  const name = value.slice(0, space);
  const partial = value.slice(space + 1).toLowerCase();
  const candidates: Record<string, string[]> = {
    cd: pages.value.map(pageName),
    open: projects.value.map((project) => stemOf(project.localizedFile)),
    theme: Object.keys(THEMES),
  };
  const match = (candidates[name] ?? []).find((candidate) => candidate.startsWith(partial) && candidate !== partial);
  return match ? `${name} ${match}` : null;
}

function onInputKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowUp' && history.length) {
    event.preventDefault();
    historyIndex = Math.max(0, historyIndex - 1);
    command.value = history[historyIndex] ?? '';
  } else if (event.key === 'ArrowDown' && history.length) {
    event.preventDefault();
    historyIndex = Math.min(history.length, historyIndex + 1);
    command.value = history[historyIndex] ?? '';
  } else if (event.key === 'Tab' && command.value) {
    const completion = complete(command.value);
    // Tab only stays in the field when there is something to complete
    if (completion) {
      event.preventDefault();
      command.value = completion;
    }
  }
}

function onTerminalClick(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (target.closest('button, a, input') || window.getSelection()?.toString()) return;
  input.value?.focus({ preventScroll: true });
}

// ---------- Lifecycle ----------

onMounted(() => {
  reduced = prefersReducedMotion();
  started = performance.now();
  lines.value = isNotFound.value
    ? [
      { kind: 'command', text: `cd ${shownPath.value}` },
      { kind: 'error', text: t(`cd: ${shownPath.value}: secteur introuvable`, `cd: ${shownPath.value}: no such sector`) },
      { kind: 'text', text: t('Tapez help, ou ls pour voir les pages qui existent.', 'Type help, or ls to see the pages that exist.') },
    ]
    : [
      { kind: 'error', text: `panic: ${t('le noyau a planté', 'the kernel crashed')} (${props.code})` },
      { kind: 'text', text: t('Tapez repair pour relancer, ou ls pour voir les pages.', 'Type repair to restart, or ls to see the pages.') },
    ];
  if (canvas.value) {
    scene = mountNotFoundScene(canvas.value, {
      root: canvas.value,
      code: String(props.code),
      seed,
      font: HOLO_FONT,
      lang: preferencesStore.lang,
      reduced,
      onEvent: onSceneEvent,
    });
  }
  measureBox();
  if (holoBox.value) {
    boxObserver = new ResizeObserver(measureBox);
    boxObserver.observe(holoBox.value);
  }
  loadFonts().catch(() => undefined);
  // Before the log: with reduced motion, the breach is already open and the log says so
  updateMap();
  playTrace();
  if (!reduced) decodeTitle();
  // The breaking cells change state on the scene's clock: the map follows it
  mapTimer = setInterval(updateMap, 200);
});

onBeforeUnmount(() => {
  unmounted = true;
  scene?.destroy();
  scene = null;
  sfx?.close();
  sfx = null;
  boxObserver?.disconnect();
  if (mapTimer) clearInterval(mapTimer);
  timers.forEach((id) => clearTimeout(id));
  cancelAnimationFrame(titleFrame);
});
</script>

<style scoped>
.not-found-title {
  font-family: "Hyperion Title", ui-sans-serif, system-ui, sans-serif;
  font-size: clamp(1.7rem, 2.6vw, 2.6rem);
  line-height: 1.15;
  letter-spacing: 0.04em;
}

/* A dark halo behind the text, which sits on the grid like the home page's */
.not-found-copy::before {
  content: '';
  position: absolute;
  z-index: -1;
  inset: -50px -60px -40px -80px;
  background: radial-gradient(closest-side, rgb(var(--color-background) / 0.85), rgb(var(--color-background) / 0.5) 70%, transparent);
  pointer-events: none;
}

.not-found-button {
  position: relative;
  overflow: hidden;
}

.not-found-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: 0.5s;
}

.not-found-button:hover::before {
  left: 100%;
}
</style>
