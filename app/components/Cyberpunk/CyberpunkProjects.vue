<template>
  <section id="projects" class="relative min-h-screen rounded-md bg-bg py-20">
    <!-- Enhanced cyberpunk background with depth -->
    <div class="absolute inset-0 z-0 overflow-hidden">
      <!-- Digital circuit lines -->
      <div class="circuit-lines"/>
      <!-- Scan lines effect -->
      <div class="scan-lines"/>
      <!-- Radial glow overlay -->
      <div class="radial-overlay"/>
    </div>

    <div class="container relative z-10 mx-auto px-4">
      <!-- Desktop header bar -->
      <CyberpunkSectionHeader
        class="mb-8"
        :title="isEnglish ? 'HYPERION v1.0 - PROJECTS DIRECTORY' : 'HYPERION v1.0 - RÉPERTOIRE DES PROJETS'"
      />

      <!-- Search and filter bar -->
      <CyberpunkTerminalWindow v-reveal="150" class="mb-2" :no-title="true">
        <template #body>
          <div class="flex flex-col gap-4 md:flex-row">
            <!-- Search input -->
            <div class="flex flex-1 items-center rounded border border-primary/30 px-3 py-1 md:border-0">
              <div class="font-mono mr-2 text-secondary">
                <div class="font-mono mr-2 text-secondary">
                  <span class="blink-cursor">></span>
                </div>
              </div>
              <div class="relative flex-1">
                <input
                  v-model="searchQuery"
                  type="text"
                  :placeholder="isEnglish ? 'SEARCH PROJECTS...' : 'RECHERCHER DES PROJETS...'"
                  class="font-mono w-full border-none bg-transparent uppercase text-primary outline-none focus:ring-0"
                  @focus="isSearchFocused = true"
                  @blur="isSearchFocused = false"
                />
                <button
                  v-if="searchQuery"
                  type="button"
                  class="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer hover:text-primary"
                  :aria-label="isEnglish ? 'Clear search' : 'Effacer la recherche'"
                  @click="clearSearch"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Technology filter dropdown -->
            <div class="flex items-center">
              <div class="font-mono mr-2 text-secondary">
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
                <label class="sr-only" :for="'technology-filter'">
                  {{ isEnglish ? 'Filter by technology' : 'Filtrer par technologie' }}
                </label>
                <select
                  id="technology-filter"
                  v-model="selectedTechnology"
                  class="font-mono w-[180px] appearance-none rounded border border-primary/30 bg-transparent px-3 py-1 uppercase text-primary focus:outline-none focus:ring-1 focus:ring-primary"
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
                  class="pointer-events-none absolute inset-y-0 right-1 flex items-center px-2 text-primary"
                >
                  <svg class="size-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
              <button
                v-if="selectedTechnology"
                type="button"
                class="ml-2 cursor-pointer hover:text-primary"
                :aria-label="isEnglish ? 'Clear technology filter' : 'Retirer le filtre de technologie'"
                @click="clearTechnologyFilter"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <!-- Results counter -->
            <div class="font-mono hidden items-center text-sm text-secondary md:flex">
              <span class="rounded border border-primary/30 bg-black/50 px-2 py-1">
                {{ filteredProjects.length }} {{ isEnglish ? 'FILES' : 'FICHIERS' }}
              </span>
            </div>
          </div>
        </template>
      </CyberpunkTerminalWindow>

      <!-- Desktop icons grid -->
      <CyberpunkTerminalWindow v-reveal="250">
        <template #title>
          <div class="flex w-full items-center justify-between gap-2">
            <div>
              {{ isEnglish ? 'PROJECTS EXPLORER' : 'EXPLORATEUR DE PROJETS' }}
            </div>
            <div v-if="selectedTechnology" class="flex items-center text-sm">
              <span class="rounded border border-primary/30 bg-primary/20 px-2 py-0.5 text-xs">
                {{ selectedTechnology }}
              </span>
            </div>
          </div>
        </template>
        <template #body>
          <!-- Search status message -->
          <div
            v-if="(searchQuery || selectedTechnology) && filteredProjects.length === 0"
            class="rounded border border-red-500/50 bg-bg/50 p-4 text-center"
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
            <div class="font-mono mt-2 text-sm text-secondary">
              {{ isEnglish ? 'TRY ANOTHER SEARCH TERM OR FILTER' : 'ESSAYEZ UN AUTRE TERME DE RECHERCHE OU FILTRE' }}
            </div>
          </div>
          <div
            class="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
            :class="{
              'mt-5': !((searchQuery || selectedTechnology) && completedFilteredProjects.length === 0),
            }"
          >
            <!-- Project items remain the same -->
            <button
              v-for="project in completedFilteredProjects"
              :id="projectAnchor(project)"
              :key="project.file.en"
              type="button"
              class="group flex cursor-pointer flex-col items-center"
              :class="{ 'search-match': isSearchMatch(project) }"
              :data-umami-event="project.localizedTitle"
              @click="openProject(project)"
            >
              <div class="desktop-folder relative mb-2 transition-transform group-hover:scale-110">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  :class="[
                    'size-16',
                    project.starred ? 'star-glow text-primary' : 'text-primary/80',
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
                <div class="font-mono cyberpunk-text-glow px-2 py-1 text-sm text-primary">
                  {{ project.localizedTitle }}
                </div>
                <div class="font-mono mt-1 text-xs text-secondary">
                  {{ project.date }}
                </div>
              </div>
            </button>
          </div>
          <div
            v-if="uncompletedFilteredProjects.length > 0"
            class="mt-10 flex items-center justify-center gap-2"
          >
            <div class="h-1 flex-1 rounded bg-primary/30"/>
            <div class="font-mono text-center text-sm text-secondary">
              {{ isEnglish ? 'LEARNING PROJECTS & SCHOOL PROJECTS' : 'PROJETS D\'APPRENTISSAGE & PROJETS SCOLAIRES' }}
            </div>
            <div class="h-1 flex-1 rounded bg-primary/30"/>
          </div>
          <div
            class="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
            :class="{
              'mt-5': !((searchQuery || selectedTechnology) && uncompletedFilteredProjects.length === 0),
            }"
          >
            <!-- Project items remain the same -->
            <button
              v-for="project in uncompletedFilteredProjects"
              :id="projectAnchor(project)"
              :key="project.file.en"
              type="button"
              class="group flex cursor-pointer flex-col items-center"
              :class="{ 'search-match': isSearchMatch(project) }"
              :data-umami-event="project.localizedTitle"
              @click="openProject(project)"
            >
              <div class="desktop-folder relative mb-2 transition-transform group-hover:scale-110">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  :class="[
                    'size-16',
                    project.starred ? 'star-glow text-primary' : 'text-primary/80',
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
                <div class="font-mono cyberpunk-text-glow px-2 py-1 text-sm text-primary">
                  {{ project.localizedTitle }}
                </div>
                <div class="font-mono mt-1 text-xs text-secondary">
                  {{ project.date }}
                </div>
              </div>
            </button>
          </div>
        </template>
      </CyberpunkTerminalWindow>
    </div>

    <!-- Project page: shareable through the URL hash, keyboard friendly -->
    <CyberpunkProjectModal
      v-if="currentProject"
      :project="currentProject"
      :previous="neighbours.previous"
      :next="neighbours.next"
      @close="closeProject"
      @navigate="openProject"
      @filter="filterByTechFromModal"
    />
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import {
  computed, onMounted, ref, watch,
} from 'vue';

import { vReveal } from '../../directives/reveal';
import type { localizedProject } from '../../models/project';
import { usePreferencesStore } from '../../stores/preferences';
import { useProjectsStore } from '../../stores/projects';
import { projectAnchor } from '../../utils/anchors';
import CyberpunkProjectModal from './CyberpunkProjectModal.vue';
import CyberpunkSectionHeader from './CyberpunkSectionHeader.vue';
import CyberpunkTerminalWindow from './CyberpunkTerminalWindow.vue';

const preferencesStore = usePreferencesStore();
const projectsStore = useProjectsStore();

const isEnglish = computed(() => preferencesStore.isEnglish);
const projects = computed(() => projectsStore.getLocalizedProjects);

const { selectedProject } = storeToRefs(projectsStore);

const searchQuery = ref('');
const isSearchFocused = ref(false);
const lastSearchTime = ref(Date.now());
const selectedTechnology = ref('');

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
    result = result.filter((project) => project.localizedTitle.toLowerCase().includes(query)
        || project.localizedDescription.toLowerCase().includes(query)
        || project.technologies.some((tech) => tech.toLowerCase().includes(query)));
  }

  return result;
});

const completedFilteredProjects = computed(() => filteredProjects.value.filter((project) => project.completed));

const uncompletedFilteredProjects = computed(() => filteredProjects.value.filter((project) => !project.completed));

// Check if a project is a new match for animation purposes
function isSearchMatch(project: localizedProject) {
  if (!searchQuery.value && !selectedTechnology.value) return false;

  let isMatch = true;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    isMatch = project.localizedTitle.toLowerCase().includes(query)
      || project.localizedDescription.toLowerCase().includes(query)
      || project.technologies.some((tech) => tech.toLowerCase().includes(query));
  }

  if (selectedTechnology.value && isMatch) {
    isMatch = project.technologies.includes(selectedTechnology.value);
  }

  return isMatch;
}

// The selection can come from the terminal or the skills htop: resolve it again in the
// current language, so the page follows a language switch.
const currentProject = computed(() => {
  const file = selectedProject.value?.file.en;
  return file ? projects.value.find((project) => project.file.en === file) ?? null : null;
});

// Previous / next project, in the explorer's order (or the full list when the
// project was opened from elsewhere and is hidden by the current filters).
const neighbours = computed(() => {
  const current = currentProject.value;
  const shown = [...completedFilteredProjects.value, ...uncompletedFilteredProjects.value];
  const all = [...projects.value.filter((project) => project.completed), ...projects.value.filter((project) => !project.completed)];
  const list = current && shown.some((project) => project.file.en === current.file.en) ? shown : all;
  if (!current || list.length < 2) return { previous: null, next: null };

  const index = list.findIndex((project) => project.file.en === current.file.en);
  return {
    previous: list[(index - 1 + list.length) % list.length],
    next: list[(index + 1) % list.length],
  };
});

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
}

// Shareable link: the open project lives in the URL hash (#project-polis). replaceState
// keeps the router out of it, so nothing scrolls and the history does not grow.
watch(() => currentProject.value?.file.en, () => {
  const url = new URL(window.location.href);
  url.hash = currentProject.value ? projectAnchor(currentProject.value) : '';
  window.history.replaceState(window.history.state, '', url);
});

// Opening a shared link: the browser has already scrolled to the project's folder.
onMounted(() => {
  const anchor = window.location.hash.slice(1);
  const project = anchor && projects.value.find((item) => projectAnchor(item) === anchor);
  if (project) selectedProject.value = project;
});
</script>

<style scoped>
/* Enhanced cyberpunk grid background */
.cyber-grid-bg {
  background-color: rgb(var(--color-background));
  background-image:
    linear-gradient(to right, rgb(var(--color-primary) / 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgb(var(--color-primary) / 0.1) 1px, transparent 1px);
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
      rgb(var(--color-background) / 0.5));
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
      rgb(var(--color-background)));
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
  background-color: rgb(var(--color-primary) / 0.5);
  box-shadow: 0 0 10px rgb(var(--color-primary) / 0.7);
  border-radius: 3px;
}

/* Star badge styling */
.star-badge {
  color: rgb(var(--color-primary) / 0.8);
  filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.5));
  animation: star-pulse 3s infinite;
}

.star-glow {
  filter: drop-shadow(0 0 3px rgba(255, 215, 0, 0.5));
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
