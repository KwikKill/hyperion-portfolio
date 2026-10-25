<template>
  <!-- Native modal dialog: focus, Esc and the backdrop come with it -->
  <dialog
    ref="dialog"
    class="project-dialog m-auto w-[calc(100%-2rem)] max-w-4xl overflow-hidden rounded-lg border border-gray-200 bg-white p-0 text-gray-900 shadow-2xl dark:border-gray-700 dark:bg-gray-800 dark:text-white"
    :aria-labelledby="titleId"
    @close="emit('close')"
    @click="onDialogClick"
    @keydown="onKeydown"
  >
    <div class="flex max-h-[calc(100dvh-2rem)] flex-col">
      <div class="flex items-start justify-between gap-4 border-b border-gray-200 px-6 py-4 dark:border-gray-700">
        <div class="min-w-0">
          <h3 :id="titleId" class="text-2xl font-bold">
            {{ project.localizedName }}
          </h3>
          <p v-if="project.localizedSubtitle" class="text-gray-600 dark:text-gray-400">
            {{ project.localizedSubtitle }}
          </p>
        </div>
        <button
          type="button"
          class="flex size-10 shrink-0 items-center justify-center rounded-md text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
          :aria-label="isEnglish ? 'Close' : 'Fermer'"
          @click="dialog?.close()"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div ref="body" class="overflow-y-auto px-6 py-5">
        <div class="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <!-- Gallery and key facts -->
          <div>
            <div class="relative aspect-video overflow-hidden rounded-md bg-gray-900">
              <img
                :key="project.images[imageIndex]"
                :src="project.images[imageIndex]"
                :alt="`${project.localizedName} - image ${imageIndex + 1}`"
                class="size-full object-contain"
              />
              <template v-if="imageCount > 1">
                <button
                  type="button"
                  class="absolute left-2 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-gray-900/70 text-white transition-colors hover:bg-gray-900"
                  :aria-label="isEnglish ? 'Previous image' : 'Image précédente'"
                  @click="showImage(imageIndex - 1)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
                  </svg>
                </button>
                <button
                  type="button"
                  class="absolute right-2 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-gray-900/70 text-white transition-colors hover:bg-gray-900"
                  :aria-label="isEnglish ? 'Next image' : 'Image suivante'"
                  @click="showImage(imageIndex + 1)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
                <span class="absolute bottom-2 right-2 rounded bg-gray-900/80 px-2 py-0.5 text-xs text-white">
                  {{ imageIndex + 1 }} / {{ imageCount }}
                </span>
              </template>
            </div>
            <div v-if="imageCount > 1" class="mt-2 flex flex-wrap gap-2">
              <button
                v-for="(image, index) in project.images"
                :key="image"
                type="button"
                class="aspect-video h-12 overflow-hidden rounded border-2 transition-opacity"
                :class="index === imageIndex ? 'border-blue-600 dark:border-blue-400' : 'border-transparent opacity-60 hover:opacity-100'"
                :aria-label="`Image ${index + 1}`"
                :aria-current="index === imageIndex ? 'true' : undefined"
                @click="showImage(index)"
              >
                <img :src="image" alt="" loading="lazy" decoding="async" class="size-full object-cover"/>
              </button>
            </div>
            <dl class="mt-4 grid grid-cols-3 gap-4 rounded-md bg-gray-50 p-4 dark:bg-gray-900">
              <div v-for="item in facts" :key="item.label">
                <dt class="text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400">
                  {{ item.label }}
                </dt>
                <dd class="mt-0.5 text-sm font-medium">
                  {{ item.value }}
                </dd>
              </div>
            </dl>
          </div>

          <!-- Description, technologies and links -->
          <div class="flex flex-col gap-4">
            <p class="text-lg leading-relaxed">
              {{ description.lead }}
            </p>
            <template v-for="(block, blockIndex) in description.blocks" :key="blockIndex">
              <ul v-if="block.type === 'list'" class="list-disc space-y-1 pl-5 text-gray-700 dark:text-gray-300">
                <li v-for="item in block.lines" :key="item">
                  {{ item }}
                </li>
              </ul>
              <p v-else class="leading-relaxed text-gray-700 dark:text-gray-300">
                {{ block.lines[0] }}
              </p>
            </template>
            <p v-if="project.localizedNote" class="flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-400">
              <span class="size-2 rounded-full bg-current" aria-hidden="true"/>
              {{ project.localizedNote }}
            </p>
            <div>
              <h4 class="mb-2 text-sm font-semibold">
                Technologies
              </h4>
              <ul class="flex flex-wrap gap-2">
                <li
                  v-for="tech in project.technologies"
                  :key="tech"
                  class="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  {{ tech }}
                </li>
              </ul>
            </div>
            <div v-if="project.link || project.github" class="flex flex-wrap gap-3">
              <a
                v-if="project.link"
                :href="project.link"
                target="_blank"
                rel="noopener noreferrer"
                :class="BUTTON_PRIMARY"
              >
                {{ isEnglish ? 'View the site ↗' : 'Voir le site ↗' }}
              </a>
              <a
                v-if="project.github"
                :href="project.github"
                target="_blank"
                rel="noopener noreferrer"
                :class="BUTTON_SECONDARY"
              >
                {{ isEnglish ? 'Source code ↗' : 'Code source ↗' }}
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Previous / next project -->
      <div
        v-if="previous || next"
        class="flex items-center justify-between gap-4 border-t border-gray-200 px-6 py-3 text-sm font-medium dark:border-gray-700"
      >
        <button
          v-if="previous"
          type="button"
          class="min-w-0 truncate text-left text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          @click="emit('navigate', previous)"
        >
          ← {{ previous.localizedName }}
        </button>
        <span v-else/>
        <button
          v-if="next"
          type="button"
          class="min-w-0 truncate text-right text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          @click="emit('navigate', next)"
        >
          {{ next.localizedName }} →
        </button>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import {
  computed, onBeforeUnmount, onMounted, ref, useId, watch,
} from 'vue';

import type { localizedProject } from '../../models/project';
import { usePreferencesStore } from '../../stores/preferences';
import { BUTTON_PRIMARY, BUTTON_SECONDARY } from '../../utils/classicButtons';
import { parseDescription } from '../../utils/description';
import { CATEGORY_LABELS, STATUS_LABELS } from '../../utils/projectLabels';

const props = defineProps<{
  project: localizedProject;
  previous: localizedProject | null;
  next: localizedProject | null;
}>();

const emit = defineEmits<{
  close: [];
  navigate: [project: localizedProject];
}>();

const preferencesStore = usePreferencesStore();
const isEnglish = computed(() => preferencesStore.isEnglish);

const titleId = useId();
const dialog = ref<HTMLDialogElement | null>(null);
const body = ref<HTMLElement | null>(null);
const imageIndex = ref(0);
// Element that had the focus before the dialog opened, to give it back on close.
let opener: HTMLElement | null = null;

const imageCount = computed(() => props.project.images.length);
const description = computed(() => parseDescription(props.project.localizedDescription));
const facts = computed(() => {
  const lang = preferencesStore.lang;
  return [
    { label: isEnglish.value ? 'Year' : 'Année', value: props.project.date },
    { label: 'Type', value: CATEGORY_LABELS[props.project.category][lang] },
    { label: isEnglish.value ? 'Status' : 'Statut', value: STATUS_LABELS[props.project.status][lang] },
  ];
});

// Another project: back to its first image and to the top of the page
watch(() => props.project.file.en, () => {
  imageIndex.value = 0;
  body.value?.scrollTo({ top: 0 });
});

function showImage(index: number) {
  imageIndex.value = (index + imageCount.value) % imageCount.value;
}

// A click on the backdrop lands on the <dialog> itself, outside its content
function onDialogClick(event: MouseEvent) {
  if (event.target === dialog.value) dialog.value?.close();
}

function onKeydown(event: KeyboardEvent) {
  if (imageCount.value < 2 || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return;
  event.preventDefault();
  showImage(imageIndex.value + (event.key === 'ArrowRight' ? 1 : -1));
}

onMounted(() => {
  opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  // Keep the page behind the dialog from scrolling.
  document.body.style.overflow = 'hidden';
  dialog.value?.showModal();
});

onBeforeUnmount(() => {
  document.body.style.overflow = '';
  if (opener?.isConnected) opener.focus({ preventScroll: true });
});
</script>

<style scoped>
.project-dialog::backdrop {
  background: rgb(17 24 39 / 0.7);
  backdrop-filter: blur(2px);
}

.project-dialog[open] {
  animation: dialog-in 0.2s ease-out;
}

@keyframes dialog-in {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .project-dialog[open] {
    animation: none;
  }
}
</style>
