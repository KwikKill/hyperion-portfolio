<template>
  <div>
    <!-- Self Destruct Button -->
    <div
      v-if="!isDestructing && !isComplete"
      class="my-8 hidden w-full flex-col items-center justify-center md:flex"
    >
      <button
        type="button"
        class="font-mono group relative overflow-hidden rounded-none border-2 border-red-500 bg-black px-6 py-3 text-red-500 transition-all duration-300 hover:bg-red-500/10 hover:text-red-400"
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
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span class="uppercase tracking-wider">
            {{ isEnglish ? 'SELF DESTRUCT' : 'AUTO-DESTRUCTION' }}
          </span>
        </div>
      </button>
    </div>

    <!-- Alarm Overlay -->
    <div
      v-if="showAlarm"
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
        <h1 class="glitch-text font-mono mb-4 text-4xl font-bold uppercase tracking-wider text-red-500 md:text-6xl" :data-text="isEnglish ? 'WARNING' : 'ATTENTION'">
          {{ isEnglish ? 'WARNING' : 'ATTENTION' }}
        </h1>

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

              <h1 class="glitch-text font-mono mb-4 text-4xl font-bold uppercase tracking-wider text-primary" :data-text="isEnglish ? 'SYSTEM DESTROYED' : 'SYSTÈME DÉTRUIT'">
                {{ isEnglish ? 'SYSTEM DESTROYED' : 'SYSTÈME DÉTRUIT' }}
              </h1>
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
import {
  computed, nextTick, onMounted, ref,
} from 'vue';
import { usePreferencesStore } from '@/stores/preferences';

import CyberpunkTerminalWindow from './CyberpunkTerminalWindow.vue';

const preferencesStore = usePreferencesStore();
const isEnglish = computed(() => preferencesStore.isEnglish);

// Animation state
const isDestructing = ref(false);
const showAlarm = ref(false);
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

    // Draw all squares
    for (let row = 0; row < gridSize; row += 1) {
      for (let col = 0; col < gridSize; col += 1) {
        if (squares[row][col]) {
          const x = sectionLeft + (col * squareWidth);
          const y = sectionTop - scrollTop + (row * squareHeight);

          // Draw primary color square if in recentSquares
          if (recentSquares.some((s) => s.row === row && s.col === col)) {
            const pattern = createCyberPattern(`rgb(${getComputedStyle(document.documentElement).getPropertyValue('--color-primary')})`);
            ctx.fillStyle = pattern ?? `rgb(${getComputedStyle(document.documentElement).getPropertyValue('--color-primary')})`;
            ctx.fillRect(x, y, squareWidth, squareHeight);
          } else {
            ctx.fillStyle = '#000000';
            ctx.fillRect(x, y, squareWidth, squareHeight);
          }

          // Draw borders if adjacent to a gap
          ctx.save();
          ctx.strokeStyle = `rgb(${getComputedStyle(document.documentElement).getPropertyValue('--color-primary')})`;
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
      ctx.strokeStyle = `rgb(${getComputedStyle(document.documentElement).getPropertyValue('--color-primary')})`;
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
  window.scrollTo({ top: 0, behavior: 'smooth' });
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
