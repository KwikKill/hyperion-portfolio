<template>
  <!-- Section title bar. The first time it scrolls into view, a scan line wipes it in
       and the title decodes from random characters. -->
  <div
    ref="root"
    class="section-header relative"
    :class="{ 'is-pending': state === 'pending', 'is-playing': state === 'playing' }"
    @animationend.self="state = 'idle'"
  >
    <CyberpunkTerminalWindow :show-icon="false" no-body>
      <template #title>
        <span class="sr-only">{{ title }}</span>
        <span aria-hidden="true">{{ displayed }}</span>
      </template>
    </CyberpunkTerminalWindow>
    <span class="section-scanline" aria-hidden="true"/>
  </div>
</template>

<script setup lang="ts">
import {
  onBeforeUnmount, onMounted, ref, watch,
} from 'vue';

import { prefersReducedMotion } from '../../utils/motion';
import CyberpunkTerminalWindow from './CyberpunkTerminalWindow.vue';

const props = defineProps<{
  title: string;
}>();

const RANDOM_CHARS = '0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/';
const DECODE_DURATION = 700;

const root = ref<HTMLElement | null>(null);
// idle: shown as is · pending: hidden until it scrolls into view · playing: wiping in
const state = ref<'idle' | 'pending' | 'playing'>('idle');
const displayed = ref(props.title);

let observer: IntersectionObserver | null = null;
let frame = 0;

const randomChar = () => RANDOM_CHARS.charAt(Math.floor(Math.random() * RANDOM_CHARS.length));

// Characters lock into place from left to right; the rest keep flickering.
function decode() {
  const { title } = props;
  const start = performance.now();
  const step = (now: number) => {
    const progress = Math.min((now - start) / DECODE_DURATION, 1);
    const locked = Math.floor(progress * title.length);
    displayed.value = title.slice(0, locked) + title.slice(locked).replace(/\S/g, randomChar);
    if (progress < 1) frame = requestAnimationFrame(step);
  };
  frame = requestAnimationFrame(step);
}

watch(() => props.title, (title) => {
  cancelAnimationFrame(frame);
  displayed.value = title;
});

onMounted(() => {
  if (!root.value || !('IntersectionObserver' in window) || prefersReducedMotion()) return;
  // Already on screen when the page loads: nothing to reveal.
  if (root.value.getBoundingClientRect().top < window.innerHeight) return;

  state.value = 'pending';
  observer = new IntersectionObserver(([entry]) => {
    if (!entry?.isIntersecting) return;
    observer?.disconnect();
    state.value = 'playing';
    decode();
  }, { threshold: 0.5 });
  observer.observe(root.value);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  cancelAnimationFrame(frame);
});
</script>

<style scoped>
/* Negative insets keep the window's glow visible around the clipped area. */
.section-header.is-pending {
  clip-path: inset(-24px -24px 100% -24px);
}

.section-header.is-playing {
  animation: header-wipe 0.55s cubic-bezier(0.6, 0, 0.2, 1) both;
}

.section-scanline {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background-color: rgb(var(--color-primary));
  box-shadow: 0 0 12px rgb(var(--color-primary));
  opacity: 0;
  pointer-events: none;
}

.section-header.is-playing .section-scanline {
  animation: header-scan 0.6s cubic-bezier(0.6, 0, 0.2, 1) both;
}

@keyframes header-wipe {
  from {
    clip-path: inset(-24px -24px 100% -24px);
  }

  to {
    clip-path: inset(-24px -24px -24px -24px);
  }
}

@keyframes header-scan {
  0% {
    top: 0;
    opacity: 1;
  }

  90% {
    top: 100%;
    opacity: 1;
  }

  100% {
    top: 100%;
    opacity: 0;
  }
}
</style>
