<template>
  <!-- The backdrop scrolls, like a page, only when the dialog is taller than the screen:
       no inner scroll area, so no stray scrollbar when everything fits. -->
  <div ref="backdrop" class="fixed inset-0 z-50 overflow-y-auto bg-bg/80 backdrop-blur-sm">
    <div class="flex min-h-full items-center justify-center p-2 sm:p-4" @click.self="requestClose">
      <div
        ref="dialog"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        tabindex="-1"
        class="w-full max-w-5xl origin-top-left outline-none"
      >
        <CyberpunkTerminalWindow>
          <template #title>
            <span class="normal-case">~/{{ isEnglish ? 'projects' : 'projets' }}/{{ project.localizedFile }}</span>
          </template>

          <template #buttons>
            <div class="flex items-center gap-3">
              <button
                type="button"
                class="font-mono hidden items-center gap-1.5 text-xs text-gray-400 transition-colors hover:text-primary sm:flex"
                @click="copyLink"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                </svg>
                <span aria-live="polite">{{ copyLabel }}</span>
              </button>
              <kbd class="hidden rounded border border-b-2 border-gray-600 px-1.5 text-xs text-gray-300 lg:inline">
                {{ isEnglish ? 'Esc' : 'Échap' }}
              </kbd>
              <button
                type="button"
                class="text-primary transition-colors hover:text-hover"
                :aria-label="isEnglish ? 'Close' : 'Fermer'"
                @click="requestClose"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </template>

          <template #body>
            <div>
              <!-- Title band, full width: name on the left, links on the right -->
              <div class="mb-5 flex flex-col gap-4 border-b border-primary/20 pb-4 sm:flex-row sm:items-end sm:justify-between">
                <div class="min-w-0">
                  <h3 :id="titleId" class="font-mono cyberpunk-text-glow text-3xl font-bold uppercase leading-tight text-primary">
                    {{ project.localizedName }}
                  </h3>
                  <div class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-2">
                    <span v-if="project.localizedSubtitle" class="font-mono text-sm text-gray-400">
                      {{ project.localizedSubtitle }}
                    </span>
                    <span v-if="project.starred" class="star-badge-modal gap-1 text-xs text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                      {{ isEnglish ? 'FEATURED PROJECT' : 'PROJET MIS EN AVANT' }}
                    </span>
                  </div>
                </div>

                <div v-if="project.link || project.github" class="flex shrink-0 flex-wrap gap-3">
                  <a
                    v-if="project.link"
                    :href="project.link"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="font-mono flex items-center bg-primary px-4 py-2 text-sm uppercase text-black transition-colors hover:bg-hover"
                  >
                    {{ isEnglish ? 'View project' : 'Voir le projet' }}
                    <svg xmlns="http://www.w3.org/2000/svg" class="ml-2 size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                    </svg>
                  </a>
                  <a
                    v-if="project.github"
                    :href="project.github"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="font-mono flex items-center border border-primary px-4 py-2 text-sm uppercase text-primary transition-colors hover:bg-primary/10"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 size-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub
                  </a>
                </div>
              </div>

              <div class="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
                <!-- Gallery and key facts -->
                <div class="lg:sticky lg:top-4 lg:self-start">
                  <div class="relative aspect-video overflow-hidden rounded-md border-2 border-primary/70 bg-black/40">
                    <div v-if="project.localizedNote" class="absolute right-3 top-3 z-10">
                      <div class="project-note-badge font-mono flex items-center rounded-l-md border-l-4 border-primary bg-bg/80 px-3 py-1 text-sm uppercase text-primary">
                        {{ project.localizedNote }}
                      </div>
                    </div>

                    <transition name="fade" mode="out-in">
                      <img
                        :key="`${project.file.en}-${currentImageIndex}`"
                        :src="project.images[currentImageIndex]"
                        :alt="`${project.localizedName} - image ${currentImageIndex + 1}`"
                        class="size-full object-contain"
                      />
                    </transition>

                    <template v-if="imageCount > 1">
                      <button
                        type="button"
                        class="absolute left-2 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-bg/60 text-primary transition-colors hover:bg-primary/20"
                        :aria-label="isEnglish ? 'Previous image' : 'Image précédente'"
                        @click="showImage(currentImageIndex - 1)"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                        </svg>
                      </button>
                      <button
                        type="button"
                        class="absolute right-2 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-bg/60 text-primary transition-colors hover:bg-primary/20"
                        :aria-label="isEnglish ? 'Next image' : 'Image suivante'"
                        @click="showImage(currentImageIndex + 1)"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg>
                      </button>
                      <span class="font-mono absolute bottom-2 right-2 rounded bg-bg/80 px-2 py-0.5 text-xs text-primary">
                        {{ currentImageIndex + 1 }} / {{ imageCount }}
                      </span>
                    </template>
                  </div>

                  <div v-if="imageCount > 1" class="mt-2 flex flex-wrap gap-2">
                    <button
                      v-for="(image, index) in project.images"
                      :key="image"
                      type="button"
                      class="aspect-video h-12 shrink-0 overflow-hidden border transition-opacity"
                      :class="index === currentImageIndex ? 'border-primary ring-1 ring-primary' : 'border-primary/25 opacity-60 hover:opacity-100'"
                      :aria-label="`Image ${index + 1}`"
                      :aria-current="index === currentImageIndex ? 'true' : undefined"
                      @click="showImage(index)"
                    >
                      <img :src="image" alt="" class="size-full object-cover"/>
                    </button>
                  </div>

                  <dl class="mt-4 grid grid-cols-3 gap-px border border-primary/25 bg-primary/25">
                    <div v-for="item in meta" :key="item.label" class="bg-bg px-3 py-2">
                      <dt class="font-mono text-[10px] uppercase tracking-wider text-gray-500">
                        {{ item.label }}
                      </dt>
                      <dd class="mt-0.5 flex items-center gap-1.5 text-sm text-text">
                        <span v-if="item.dot" class="size-2 shrink-0 rounded-full" :class="item.dot" aria-hidden="true"/>
                        {{ item.value }}
                      </dd>
                    </div>
                  </dl>
                </div>

                <!-- Description: lead, highlights and technologies -->
                <div class="flex min-w-0 flex-col gap-4">
                  <p v-if="description.lead" class="font-sans text-lg leading-relaxed text-text">
                    {{ description.lead }}
                  </p>

                  <div v-if="description.blocks.length">
                    <h4 class="font-mono mb-2 text-xs uppercase tracking-wider text-secondary">
                      {{ isEnglish ? 'Highlights' : 'Points clés' }}
                    </h4>
                    <div class="max-w-prose font-sans">
                      <template v-for="(block, blockIndex) in description.blocks" :key="blockIndex">
                        <ul v-if="block.type === 'list'" class="space-y-2">
                          <li v-for="item in block.lines" :key="item" class="flex gap-2 leading-relaxed text-text/85">
                            <span class="shrink-0 text-primary" aria-hidden="true">&gt;</span>
                            <span>{{ item }}</span>
                          </li>
                        </ul>
                        <p v-else class="mt-2 leading-relaxed text-text/85">
                          {{ block.lines[0] }}
                        </p>
                      </template>
                    </div>
                  </div>

                  <div>
                    <h4 class="font-mono mb-2 text-xs uppercase tracking-wider text-secondary">
                      Technologies
                    </h4>
                    <div class="flex flex-wrap gap-2">
                      <button
                        v-for="tech in project.technologies"
                        :key="tech"
                        type="button"
                        class="font-mono border border-primary/60 bg-bg px-2 py-1 text-xs uppercase text-primary transition-colors hover:bg-primary/10"
                        :title="isEnglish ? `Show projects using ${tech}` : `Voir les projets qui utilisent ${tech}`"
                        @click="emit('filter', tech)"
                      >
                        {{ tech }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Previous / next project, and the keyboard shortcuts -->
              <div class="font-mono mt-6 flex items-center justify-between gap-3 border-t border-primary/20 pt-3 text-xs">
                <button
                  v-if="previous"
                  type="button"
                  class="min-w-0 truncate text-left text-primary transition-colors hover:text-hover"
                  @click="emit('navigate', previous)"
                >
                  ← {{ previous.localizedName }}
                </button>
                <span v-else/>
                <span class="hidden shrink-0 text-gray-500 md:inline">
                  <kbd class="rounded border border-b-2 border-gray-600 px-1 text-gray-300">←</kbd>
                  <kbd class="rounded border border-b-2 border-gray-600 px-1 text-gray-300">→</kbd>
                  images ·
                  <kbd class="rounded border border-b-2 border-gray-600 px-1 text-gray-300">J</kbd>
                  <kbd class="rounded border border-b-2 border-gray-600 px-1 text-gray-300">K</kbd>
                  {{ isEnglish ? 'next / previous project' : 'projet suivant / précédent' }}
                </span>
                <button
                  v-if="next"
                  type="button"
                  class="min-w-0 truncate text-right text-primary transition-colors hover:text-hover"
                  @click="emit('navigate', next)"
                >
                  {{ next.localizedName }} →
                </button>
                <span v-else/>
              </div>
            </div>
          </template>
        </CyberpunkTerminalWindow>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch,
} from 'vue';

import type { localizedProject, ProjectCategory, ProjectStatus } from '../../models/project';
import { usePreferencesStore } from '../../stores/preferences';
import { projectAnchor } from '../../utils/anchors';
import { parseDescription } from '../../utils/description';
import { prefersReducedMotion } from '../../utils/motion';
import CyberpunkTerminalWindow from './CyberpunkTerminalWindow.vue';

const props = defineProps<{
  project: localizedProject;
  previous: localizedProject | null;
  next: localizedProject | null;
}>();

const emit = defineEmits<{
  close: [];
  navigate: [project: localizedProject];
  filter: [technology: string];
}>();

const CATEGORY_LABELS: Record<ProjectCategory, { fr: string; en: string }> = {
  personal: { fr: 'Personnel', en: 'Personal' },
  client: { fr: 'Client', en: 'Client' },
  association: { fr: 'Associatif', en: 'Association' },
  school: { fr: 'École', en: 'School' },
  competition: { fr: 'Compétition', en: 'Competition' },
};

const STATUS_LABELS: Record<ProjectStatus, { fr: string; en: string; dot: string }> = {
  online: { fr: 'En ligne', en: 'Live', dot: 'bg-terminal' },
  finished: { fr: 'Archivé', en: 'Archived', dot: 'bg-gray-500' },
  unfinished: { fr: 'Inachevé', en: 'Unfinished', dot: 'bg-accent' },
};

const preferencesStore = usePreferencesStore();
const isEnglish = computed(() => preferencesStore.isEnglish);
const titleId = useId();

const backdrop = ref<HTMLElement | null>(null);
const dialog = ref<HTMLElement | null>(null);
// Set while the closing animation plays, so a second Esc or click does not restart it.
let closing = false;
const currentImageIndex = ref(0);
const copyState = ref<'idle' | 'done' | 'failed'>('idle');
let copyTimer: ReturnType<typeof setTimeout> | undefined;
// Element that had the focus before the dialog opened, to give it back on close.
let opener: HTMLElement | null = null;

const imageCount = computed(() => props.project.images.length);
const description = computed(() => parseDescription(props.project.localizedDescription));

const meta = computed(() => {
  const lang = isEnglish.value ? 'en' : 'fr';
  const status = STATUS_LABELS[props.project.status];
  return [
    { label: isEnglish.value ? 'Year' : 'Année', value: props.project.date, dot: '' },
    { label: 'Type', value: CATEGORY_LABELS[props.project.category][lang], dot: '' },
    { label: isEnglish.value ? 'Status' : 'Statut', value: status[lang], dot: status.dot },
  ];
});

const copyLabel = computed(() => {
  if (copyState.value === 'done') return isEnglish.value ? 'Link copied' : 'Lien copié';
  if (copyState.value === 'failed') return isEnglish.value ? 'Copy failed' : 'Copie impossible';
  return isEnglish.value ? 'Copy link' : 'Copier le lien';
});

watch(() => props.project.file.en, () => {
  currentImageIndex.value = 0;
});

function showImage(index: number) {
  currentImageIndex.value = (index + imageCount.value) % imageCount.value;
}

// The URL already points to this project (#project-…), so it can be shared as is.
async function copyLink() {
  try {
    await navigator.clipboard.writeText(window.location.href);
    copyState.value = 'done';
  } catch {
    copyState.value = 'failed';
  }
  clearTimeout(copyTimer);
  copyTimer = setTimeout(() => {
    copyState.value = 'idle';
  }, 2000);
}

// Where the dialog starts when opening and ends when closing: over the project's folder
// icon when it is on screen (the window grows out of it), else slightly lower and faded.
function folderKeyframe(): Keyframe {
  const folder = document.getElementById(projectAnchor(props.project))?.querySelector('.desktop-folder');
  const from = folder?.getBoundingClientRect();
  const to = dialog.value?.getBoundingClientRect();
  if (!from || !to || !from.width || from.bottom < 0 || from.top > window.innerHeight) {
    return { transform: 'translateY(16px)', opacity: 0 };
  }
  return {
    transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`,
    opacity: 0.3,
  };
}

function playOpen() {
  if (prefersReducedMotion() || !dialog.value) return;
  dialog.value.animate([folderKeyframe(), { transform: 'none', opacity: 1 }], {
    duration: 420,
    easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
  });
  backdrop.value?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250, easing: 'ease-out' });
}

// Shrinks the window back into its folder, then lets the parent remove it.
async function requestClose() {
  if (closing) return;
  closing = true;
  if (prefersReducedMotion() || !dialog.value) {
    emit('close');
    return;
  }
  // Closed while still opening: measure the window at its real place, not mid-animation.
  dialog.value.getAnimations().forEach((animation) => animation.cancel());
  backdrop.value?.getAnimations().forEach((animation) => animation.cancel());

  const options: KeyframeAnimationOptions = { duration: 320, easing: 'cubic-bezier(0.4, 0, 1, 1)', fill: 'forwards' };
  const animations = [
    dialog.value.animate([{ transform: 'none', opacity: 1 }, folderKeyframe()], options),
    backdrop.value?.animate([{ opacity: 1 }, { opacity: 0 }], options),
  ];
  await Promise.all(animations.map((animation) => animation?.finished.catch(() => undefined)));
  emit('close');
}

// Keeps Tab and Shift+Tab inside the dialog.
function trapFocus(event: KeyboardEvent) {
  const focusable = dialog.value?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
  if (!focusable?.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog.value)) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function onKeydown(event: KeyboardEvent) {
  if (closing || event.altKey || event.ctrlKey || event.metaKey) return;
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;

  if (key === 'Escape') {
    event.preventDefault();
    requestClose().catch(() => undefined);
  } else if (key === 'Tab') {
    trapFocus(event);
  } else if ((key === 'ArrowLeft' || key === 'ArrowRight') && imageCount.value > 1) {
    event.preventDefault();
    showImage(currentImageIndex.value + (key === 'ArrowRight' ? 1 : -1));
  } else if (key === 'j' && props.next) {
    emit('navigate', props.next);
  } else if (key === 'k' && props.previous) {
    emit('navigate', props.previous);
  }
}

onMounted(() => {
  opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  // Keep the page behind the dialog from scrolling.
  document.body.style.overflow = 'hidden';
  window.addEventListener('keydown', onKeydown);
  playOpen();
  nextTick(() => dialog.value?.focus({ preventScroll: true })).catch(() => undefined);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown);
  document.body.style.overflow = '';
  clearTimeout(copyTimer);
  if (opener?.isConnected) opener.focus({ preventScroll: true });
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
