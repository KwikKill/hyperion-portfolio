<template>
  <section id="projects" class="cyberpunk-terminal relative min-h-screen rounded-md bg-black py-20">
    <!-- Enhanced cyberpunk background with depth -->
    <div class="absolute inset-0 z-0 overflow-hidden">
      <!-- Improved grid background with perspective -->
      <div class="cyber-grid-bg"/>
      <!-- Digital circuit lines -->
      <div class="circuit-lines"/>
      <!-- Scan lines effect -->
      <div class="scan-lines"/>
      <!-- Radial glow overlay -->
      <div class="radial-overlay"/>
    </div>

    <div class="container relative z-10 mx-auto px-4">
      <!-- Desktop header bar -->
      <CyberpunkTerminalWindow class="mb-8" :show-icon="false" no-body>
        <template #title>
          {{ isEnglish ? 'HYPERION v1.0 - PROJECTS DIRECTORY' : 'HYPERION v1.0 - RÉPERTOIRE DES PROJETS' }}
        </template>
      </CyberpunkTerminalWindow>

      <!-- Search and filter bar -->
      <CyberpunkTerminalWindow class="mb-2" :no-title="true">
        <template #body>
          <div class="flex flex-col gap-4 md:flex-row">
            <!-- Search input -->
            <div class="flex flex-1 items-center rounded border border-theme-foreground/30 px-3 py-1 md:border-0">
              <div class="font-mono mr-2 text-cyan-400">
                <div class="font-mono mr-2 text-cyan-400">
                  <span class="blink-cursor">></span>
                </div>
              </div>
              <div class="relative flex-1">
                <input
                  v-model="searchQuery"
                  type="text"
                  :placeholder="isEnglish ? 'SEARCH PROJECTS...' : 'RECHERCHER DES PROJETS...'"
                  class="font-mono w-full border-none bg-transparent uppercase text-theme-foreground outline-none placeholder:text-gray-500 focus:ring-0"
                  @focus="isSearchFocused = true"
                  @blur="isSearchFocused = false"
                />
                <div
                  v-if="searchQuery"
                  class="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-theme-foreground"
                  @click="clearSearch"
                  @keydown.enter="clearSearch"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="size-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Technology filter dropdown -->
            <div class="flex items-center">
              <div class="font-mono mr-2 text-cyan-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              </div>
              <div class="relative">
                <select
                  v-model="selectedTechnology"
                  class="font-mono w-[180px] appearance-none rounded border border-theme-foreground/30 bg-transparent px-3 py-1 uppercase text-theme-foreground focus:outline-none focus:ring-1 focus:ring-theme-foreground"
                >
                  <option value="">
                    {{ isEnglish ? 'NO FILTER' : 'PAS DE FILTRE' }}
                  </option>
                  <option
                    v-for="tech in availableTechnologies"
                    :key="tech as string"
                    :value="tech"
                  >
                    {{ tech }}
                  </option>
                </select>
                <div
                  class="pointer-events-none absolute inset-y-0 right-1 flex items-center px-2 text-theme-foreground"
                >
                  <svg class="size-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
              <div
                v-if="selectedTechnology"
                class="ml-2 cursor-pointer text-gray-500 hover:text-theme-foreground"
                @click="clearTechnologyFilter"
                @keydown.enter="clearTechnologyFilter"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="size-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <!-- Results counter -->
            <div class="font-mono hidden items-center text-sm text-cyan-400 md:flex">
              <span class="rounded border border-theme-foreground/30 bg-black/50 px-2 py-1">
                {{ filteredProjects.length }} {{ isEnglish ? 'FILES' : 'FICHIERS' }}
              </span>
            </div>
          </div>
        </template>
      </CyberpunkTerminalWindow>

      <!-- Desktop icons grid -->
      <CyberpunkTerminalWindow>
        <template #title>
          <div class="flex w-full items-center justify-between gap-2">
            <div>
              {{ isEnglish ? 'PROJECTS EXPLORER' : 'EXPLORATEUR DE PROJETS' }}
            </div>
            <div v-if="selectedTechnology" class="flex items-center text-sm">
              <span class="rounded border border-theme-foreground/30 bg-theme-foreground/20 px-2 py-0.5 text-xs">
                {{ selectedTechnology }}
              </span>
            </div>
          </div>
        </template>
        <template #body>
          <!-- Search status message -->
          <div
            v-if="(searchQuery || selectedTechnology) && filteredProjects.length === 0"
            class="rounded border border-red-500/50 bg-black/50 p-4 text-center"
          >
            <div class="font-mono cyberpunk-text-glow flex items-center justify-center uppercase text-red-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="mr-2 size-5"
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
              {{ isEnglish ? 'NO FILES FOUND' : 'AUCUN FICHIER TROUVÉ' }}
            </div>
            <div class="font-mono mt-2 text-sm text-cyan-400">
              {{ isEnglish ? 'TRY ANOTHER SEARCH TERM OR FILTER' : 'ESSAYEZ UN AUTRE TERME DE RECHERCHE OU FILTRE' }}
            </div>
          </div>
          <div
            class="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
            :class="{
              'mt-5': !((searchQuery || selectedTechnology) && filteredProjects.length === 0),
            }"
          >
            <!-- Project items remain the same -->
            <button
              v-for="project in filteredProjects"
              :id="'project-' + project.file[language ?? 'en']"
              :key="project.localizedName"
              type="button"
              class="group flex cursor-pointer flex-col items-center"
              :class="{ 'search-match': isSearchMatch(project) }"
              :data-umami-event="project.localizedName"
              @click="openProject(project)"
              @keydown.enter="openProject(project)"
            >
              <div class="desktop-folder relative mb-2 transition-transform group-hover:scale-110">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  :class="[
                    'size-16',
                    project.starred ? 'star-glow text-theme-foreground' : 'text-theme-foreground/80',
                  ]"
                >
                  <path
                    d="M19.5 21a3 3 0 003-3v-4.5a3 3 0 00-3-3h-15a3 3 0 00-3 3V18a3 3 0 003 3h15zM1.5 10.146V6a3 3 0 013-3h5.379a2.25 2.25 0 011.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 013 3v1.146A4.483 4.483 0 0019.5 9h-15a4.483 4.483 0 00-3 1.146z"
                  />
                </svg>

                <!-- Star badge for starred projects -->
                <div v-if="project.starred" class="star-badge absolute -right-2 -top-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="size-6" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    />
                  </svg>
                </div>
              </div>

              <!-- Project name -->
              <div class="text-center">
                <div class="font-mono cyberpunk-text-glow bg-black/70 px-2 py-1 text-sm text-theme-foreground">
                  {{ project.localizedName }}
                </div>
                <div class="font-mono mt-1 text-xs text-cyan-400">
                  {{ project.date }}
                </div>
              </div>
            </button>
          </div>
        </template>
      </CyberpunkTerminalWindow>
    </div>

    <!-- Project Modal -->
    <div
      v-if="selectedProject"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      @click.self="closeProject"
      @keydown.esc="closeProject"
    >
      <CyberpunkTerminalWindow body-class="max-w-3xl w-full max-h-[80vh] overflow-y-auto p-4">
        <template #title>
          <div
            class="font-mono cyberpunk-text-glow flex flex-col items-start justify-center text-lg text-theme-foreground md:flex-row md:items-center"
          >
            {{ selectedProject.localizedName }}
            <span v-if="selectedProject.starred" class="star-badge-modal text-theme-foreground md:ml-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="size-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
              <span class="ml-1 text-xs">{{ isEnglish ? 'FEATURED PROJECT' : 'PROJET MIS EN AVANT' }}</span>
            </span>
          </div>
        </template>

        <template #buttons>
          <div class="flex justify-end">
            <button
              class="text-theme-foreground hover:text-yellow-300"
              type="button"
              @click="closeProject"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="size-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </template>

        <template #body>
          <div class="flex flex-col gap-6 md:flex-col">
            <!-- Image Gallery -->
            <div class="relative">
              <!-- Main Image with transition -->
              <div class="relative overflow-hidden rounded-md border-2 border-theme-foreground/70">
                <transition name="fade" mode="out-in">
                  <img
                    :key="currentImageIndex"
                    :src="selectedProject.images[currentImageIndex]"
                    :alt="`${selectedProject.localizedName} - Image ${currentImageIndex + 1}`"
                    class="h-auto w-full object-cover"
                  />
                </transition>

                <!-- Navigation Arrows -->
                <div class="absolute inset-0 flex items-center justify-between px-2">
                  <!-- Previous Button -->
                  <button
                    v-if="selectedProject.images.length > 1"
                    type="button"
                    class="flex size-10 items-center justify-center rounded-full bg-black/50 text-theme-foreground transition-colors hover:bg-theme-foreground/20"
                    aria-label="Previous image"
                    @click.stop="prevImage"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                  </button>

                  <!-- Spacer for single image -->
                  <div v-else class="w-10"/>

                  <!-- Next Button -->
                  <button
                    v-if="selectedProject.images.length > 1"
                    type="button"
                    class="flex size-10 items-center justify-center rounded-full bg-black/50 text-theme-foreground transition-colors hover:bg-theme-foreground/20"
                    aria-label="Next image"
                    @click.stop="nextImage"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </button>

                  <!-- Spacer for single image -->
                  <div v-else class="w-10"/>
                </div>
              </div>

              <!-- Image Indicators -->
              <div
                v-if="selectedProject.images.length > 1"
                class="mt-2 flex justify-center gap-2"
              >
                <button
                  v-for="(_, index) in selectedProject.images"
                  :key="index"
                  type="button"
                  class="h-2 w-8 rounded-full transition-colors"
                  :class="index === currentImageIndex ? 'bg-theme-foreground' : 'bg-gray-600 hover:bg-gray-500'"
                  :aria-label="`Go to image ${index + 1}`"
                  :aria-current="index === currentImageIndex ? 'true' : 'false'"
                  @click.stop="setCurrentImage(index)"
                />
              </div>

              <!-- Image Counter -->
              <div
                v-if="selectedProject.images.length > 1"
                class="absolute bottom-7 right-3 rounded bg-black/70 px-2 py-1 text-xs text-theme-foreground"
              >
                {{ currentImageIndex + 1 }} / {{ selectedProject.images.length }}
              </div>
            </div>

            <div class="">
              <h4 class="font-mono mb-2 flex items-center text-sm uppercase text-cyan-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="mr-2 size-5 text-cyan-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
                DESCRIPTION
              </h4>
              <div class="mb-4 rounded-md border border-theme-foreground/30 bg-black/50 p-4">
                <div class="font-mono text-justify leading-relaxed text-gray-300">
                  {{ selectedProject.localizedDescription }}
                </div>
              </div>

              <div class="mb-4">
                <h4 class="font-mono mb-2 flex items-center text-sm uppercase text-cyan-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="mr-1 size-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {{ isEnglish ? 'TECHNOLOGIES' : 'TECHNOLOGIES' }}
                </h4>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="(tech, index) in selectedProject.technologies"
                    :key="index"
                    class="font-mono cursor-pointer border border-theme-foreground bg-black px-2 py-1 text-xs uppercase text-theme-foreground hover:bg-theme-foreground/10"
                    @click.stop="filterByTechFromModal(tech)"
                    @keydown.enter.stop="filterByTechFromModal(tech)"
                  >
                    {{ tech }}
                  </span>
                </div>
              </div>

              <div class="flex justify-center space-x-4">
                <a
                  v-if="selectedProject.link"
                  :href="selectedProject.link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="font-mono flex items-center bg-theme-foreground px-4 py-2 text-sm uppercase text-black transition-colors hover:bg-yellow-400"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="mr-2 size-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  {{ isEnglish ? 'VIEW PROJECT' : 'VOIR LE PROJET' }}
                </a>
                <a
                  v-if="selectedProject.github"
                  :href="selectedProject.github"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="font-mono flex items-center bg-theme-foreground px-4 py-2 text-sm uppercase text-black transition-colors hover:bg-yellow-400"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 size-4" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                    />
                  </svg>
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </template>
      </CyberpunkTerminalWindow>
    </div>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';

import type { localizedProject } from '../../models/project';
import { usePreferencesStore } from '../../stores/preferences';
import { useProjectsStore } from '../../stores/projects';
import CyberpunkTerminalWindow from './CyberpunkTerminalWindow.vue';

const preferencesStore = usePreferencesStore();
const projectsStore = useProjectsStore();

const isEnglish = computed(() => preferencesStore.isEnglish);
const language = computed(() => preferencesStore.language);
const projects = computed(() => projectsStore.getLocalizedProjects);

const { selectedProject } = storeToRefs(projectsStore);

const searchQuery = ref('');
const isSearchFocused = ref(false);
const lastSearchTime = ref(Date.now());
const selectedTechnology = ref('');
const currentImageIndex = ref(0);

// Get all unique technologies from all projects
const availableTechnologies = computed(() => {
  const techSet = new Set();
  projects.value.forEach((project) => {
    project.technologies.forEach((tech) => {
      techSet.add(tech);
    });
  });
  return Array.from(techSet).sort();
});

// Filter projects based on search query and selected technology
const filteredProjects = computed(() => {
  let result = projects.value;

  // Apply technology filter if selected
  if (selectedTechnology.value) {
    result = result.filter((project) => project.technologies.includes(selectedTechnology.value));
  }

  // Apply search query filter if present
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter((project) => project.localizedName.toLowerCase().includes(query)
        || project.localizedDescription.toLowerCase().includes(query)
        || project.technologies.some((tech) => tech.toLowerCase().includes(query)));
  }

  return result;
});

// Check if a project is a new match for animation purposes
function isSearchMatch(project: localizedProject) {
  if (!searchQuery.value && !selectedTechnology.value) return false;

  let isMatch = true;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    isMatch = project.localizedName.toLowerCase().includes(query)
      || project.localizedDescription.toLowerCase().includes(query)
      || project.technologies.some((tech) => tech.toLowerCase().includes(query));
  }

  if (selectedTechnology.value && isMatch) {
    isMatch = project.technologies.includes(selectedTechnology.value);
  }

  return isMatch;
}

// Image navigation functions
function nextImage() {
  if (!selectedProject.value) return;
  currentImageIndex.value = (currentImageIndex.value + 1) % selectedProject.value.images.length;
}

function prevImage() {
  if (!selectedProject.value) return;
  currentImageIndex.value = (currentImageIndex.value - 1 + selectedProject.value.images.length)
  % selectedProject.value.images.length;
}

function setCurrentImage(index: number) {
  currentImageIndex.value = index;
}

// Clear search
function clearSearch() {
  searchQuery.value = '';
}

// Clear technology filter
function clearTechnologyFilter() {
  selectedTechnology.value = '';
}

function closeProject() {
  selectedProject.value = null;
  // Reset image index when closing the modal
  currentImageIndex.value = 0;
}

// Filter by technology from modal
function filterByTechFromModal(tech: string) {
  selectedTechnology.value = tech;
  closeProject();
}

// Update last search time when query changes (for animation timing)
watch(searchQuery, () => {
  lastSearchTime.value = Date.now();
});

function openProject(project: localizedProject) {
  selectedProject.value = project;
  // Reset image index when opening a new project
  currentImageIndex.value = 0;
}

// Reset current image index when selected project changes
watch(selectedProject, () => {
  currentImageIndex.value = 0;
});
</script>

<style scoped>
/* Enhanced cyberpunk grid background */
.cyber-grid-bg {
  background-color: #000;
  background-image:
    linear-gradient(to right, rgba(254, 238, 59, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(254, 238, 59, 0.1) 1px, transparent 1px);
  background-size: 30px 30px;
  width: 100%;
  height: 100%;
  transform: perspective(500px) rotateX(60deg);
  transform-origin: center top;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: -50%;
  animation: grid-pulse 15s infinite linear;
}

/* Digital circuit lines */
.circuit-lines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(circle at 30% 20%, rgba(0, 255, 255, 0.1) 0%, transparent 10%),
    radial-gradient(circle at 70% 60%, rgba(254, 238, 59, 0.1) 0%, transparent 15%),
    radial-gradient(circle at 40% 80%, rgba(255, 0, 128, 0.1) 0%, transparent 12%);
  opacity: 0.7;
  pointer-events: none;
}

/* Scan lines effect */
.scan-lines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom,
      transparent 50%,
      rgba(0, 0, 0, 0.1) 50%);
  background-size: 100% 4px;
  opacity: 0.3;
  pointer-events: none;
}

/* Radial overlay */
.radial-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center,
      transparent 0%,
      rgba(0, 0, 0, 0.7) 100%);
  pointer-events: none;
}

.desktop-folder::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 3px;
  background-color: rgba(255, 215, 0, 0.5);
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.7);
  border-radius: 3px;
}

/* Star badge styling */
.star-badge {
  color: #FFDA63;
  filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.7));
  animation: star-pulse 3s infinite;
}

.star-glow {
  filter: drop-shadow(0 0 3px rgba(255, 215, 0, 0.5));
}

/* Image transition effects */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes star-pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }

  50% {
    transform: scale(1.1);
    opacity: 0.9;
  }
}

/* Search animations */
.search-match {
  animation: pulse-glow 1.5s ease-in-out;
}

@keyframes pulse-glow {
  0% {
    transform: scale(1);
    filter: brightness(1);
  }

  25% {
    transform: scale(1.05);
    filter: brightness(1.5);
  }

  50% {
    transform: scale(1);
    filter: brightness(1);
  }

  75% {
    transform: scale(1.05);
    filter: brightness(1.5);
  }

  100% {
    transform: scale(1);
    filter: brightness(1);
  }
}

/* Grid animation */
@keyframes grid-pulse {
  0% {
    background-size: 30px 30px;
    opacity: 0.8;
  }

  50% {
    background-size: 32px 32px;
    opacity: 1;
  }

  100% {
    background-size: 30px 30px;
    opacity: 0.8;
  }
}
</style>
