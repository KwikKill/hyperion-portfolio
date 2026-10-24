<template>
  <!-- Animated background of a section. The canvas is the height of the screen and stays stuck
       to the top of the section while it scrolls by: its cost does not grow with the section. -->
  <div class="section-background pointer-events-none absolute inset-0 z-0" aria-hidden="true">
    <div ref="stage" class="section-background-stage">
      <canvas ref="canvas" class="absolute inset-0 size-full"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed, onBeforeUnmount, onMounted, ref, watch,
} from 'vue';

import { usePreferencesStore } from '../../stores/preferences';
import type { Focus } from '../../utils/backgrounds/core';
import { mountBackground, type Background } from '../../utils/backgrounds/engine';
import type { SceneName } from '../../utils/backgrounds/scenes';

const props = defineProps<{
  scene: SceneName;
  // Where the background centres its subject from 1024 px, when the section leaves room for
  // it on one side. Centred otherwise.
  wideFocus?: Focus;
}>();

const CENTER: Focus = { fx: 0.5, fy: 0.5 };

const preferencesStore = usePreferencesStore();
const lang = computed(() => (preferencesStore.isEnglish ? 'en' : 'fr'));

const stage = ref<HTMLElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
let background: Background | null = null;
let wide: MediaQueryList | null = null;

const focus = () => (props.wideFocus && wide?.matches ? props.wideFocus : CENTER);
const onWideChange = () => background?.setFocus(focus());

onMounted(() => {
  if (!stage.value || !canvas.value) return;
  wide = window.matchMedia('(min-width: 1024px)');
  wide.addEventListener('change', onWideChange);
  background = mountBackground(stage.value, canvas.value, {
    scene: props.scene,
    focus: focus(),
    lang: lang.value,
    pointer: stage.value.closest('section') ?? stage.value,
  });
});

watch(lang, (value) => background?.setLang(value));

onBeforeUnmount(() => {
  wide?.removeEventListener('change', onWideChange);
  background?.destroy();
});
</script>

<style scoped>
/* clip, not hidden: hidden would make this box the scroll container of the sticky stage */
.section-background {
  overflow: clip;
}

/* The section's edges fade into the page background */
.section-background::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom,
      rgb(var(--color-background)) 0,
      rgb(var(--color-background) / 0) 110px,
      rgb(var(--color-background) / 0) calc(100% - 110px),
      rgb(var(--color-background)) 100%);
}

.section-background-stage {
  position: sticky;
  top: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: rgb(var(--color-background));
}
</style>
