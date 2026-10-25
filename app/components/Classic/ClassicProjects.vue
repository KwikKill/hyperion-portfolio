<template>
  <section id="projects" class="bg-gray-50 pb-20 dark:bg-gray-900">
    <h2 class="mb-8 bg-gray-200 p-4 text-center text-3xl font-bold text-gray-900 dark:bg-gray-800 dark:text-white">
      {{ isEnglish ? 'My Projects' : 'Mes Projets' }}
    </h2>

    <div class="container mx-auto px-4">
      <!-- Featured projects: the starred ones -->
      <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="project in featured"
          :id="project.anchor"
          :key="project.file.en"
          class="flex flex-col overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800"
        >
          <button
            type="button"
            class="block"
            :aria-label="isEnglish ? `Details: ${project.localizedName}` : `Détails : ${project.localizedName}`"
            :data-umami-event="project.localizedTitle"
            @click="openProject(project)"
          >
            <img
              :src="project.images[0]"
              loading="lazy"
              decoding="async"
              alt=""
              class="h-48 w-full object-cover transition-opacity hover:opacity-90"
            />
          </button>
          <div class="flex flex-1 flex-col gap-3 p-6">
            <div class="flex justify-between gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span>{{ CATEGORY_LABELS[project.category][language] }}</span>
              <span>{{ project.date }}</span>
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">
              {{ project.localizedTitle }}
            </h3>
            <p class="leading-relaxed text-gray-700 dark:text-gray-300">
              {{ project.lead }}
            </p>
            <p class="flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-400">
              <span class="size-2 rounded-full bg-current" aria-hidden="true"/>
              {{ project.localizedNote ?? STATUS_LABELS[project.status][language] }}
            </p>
            <ul class="mt-auto flex flex-wrap gap-2 pt-1">
              <li
                v-for="tech in mainTools(project, 4)"
                :key="tech"
                class="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                {{ tech }}
              </li>
            </ul>
            <div class="flex flex-wrap gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
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
              <button
                type="button"
                :class="BUTTON_SECONDARY"
                :data-umami-event="project.localizedTitle"
                @click="openProject(project)"
              >
                {{ isEnglish ? 'Details' : 'Détails' }}
              </button>
            </div>
          </div>
        </article>
      </div>

      <!-- The other projects: one line each, the full page in the dialog -->
      <div class="mt-16">
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ isEnglish ? 'Other projects' : 'Autres projets' }}
        </h3>
        <div class="mt-4 flex flex-wrap gap-2" role="group" :aria-label="isEnglish ? 'Filter by type' : 'Filtrer par type'">
          <button
            v-for="filter in filters"
            :key="filter.key"
            type="button"
            class="rounded-full border px-4 py-1.5 text-sm transition-colors"
            :class="categoryFilter === filter.key
              ? 'border-blue-600 bg-blue-600 text-white'
              : 'border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-400 dark:hover:text-blue-400'"
            :aria-pressed="categoryFilter === filter.key"
            @click="categoryFilter = filter.key"
          >
            {{ filter.label }} · {{ filter.count }}
          </button>
        </div>

        <ul class="mt-6 divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow-sm dark:divide-gray-700 dark:bg-gray-800">
          <li
            v-for="project in visibleOthers"
            :id="project.anchor"
            :key="project.file.en"
            class="group relative flex items-center gap-4 p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
          >
            <img
              :src="project.images[0]"
              loading="lazy"
              decoding="async"
              alt=""
              class="h-14 w-24 shrink-0 rounded-md object-cover sm:h-16 sm:w-28"
            />
            <div class="min-w-0 flex-1">
              <h4>
                <!-- The button covers the whole line; the links below sit above it -->
                <button
                  type="button"
                  class="text-left font-semibold text-gray-900 transition-colors after:absolute after:inset-0 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400"
                  :data-umami-event="project.localizedTitle"
                  @click="openProject(project)"
                >
                  {{ project.localizedTitle }}
                </button>
              </h4>
              <p class="truncate text-sm text-gray-700 dark:text-gray-300">
                {{ project.lead }}
              </p>
              <p class="mt-0.5 text-sm text-gray-600 dark:text-gray-400">
                {{ project.date }} · {{ CATEGORY_LABELS[project.category][language] }}<span class="hidden md:inline"> · {{ mainTools(project, 3).join(' · ') }}</span>
              </p>
            </div>
            <div class="relative z-10 hidden shrink-0 items-center gap-3 md:flex">
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="hidden size-5 shrink-0 text-gray-400 sm:block"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
            </svg>
          </li>
        </ul>
      </div>
    </div>

    <ClassicProjectModal
      v-if="currentProject"
      :project="currentProject"
      :previous="neighbours.previous"
      :next="neighbours.next"
      @close="openFile = null"
      @navigate="openProject"
    />
  </section>
</template>

<script setup lang="ts">
import {
  computed, onMounted, ref, watch,
} from 'vue';

import type { localizedProject, ProjectCategory } from '../../models/project';
import { usePreferencesStore } from '../../stores/preferences';
import { useProjectsStore } from '../../stores/projects';
import { projectAnchor } from '../../utils/anchors';
import { BUTTON_PRIMARY, BUTTON_SECONDARY } from '../../utils/classicButtons';
import { parseDescription } from '../../utils/description';
import { CATEGORY_LABELS, STATUS_LABELS } from '../../utils/projectLabels';
import ClassicProjectModal from './ClassicProjectModal.vue';

const preferencesStore = usePreferencesStore();
const projectsStore = useProjectsStore();

const isEnglish = computed(() => preferencesStore.isEnglish);
const projects = computed(() => projectsStore.getLocalizedProjects);
const language = computed(() => preferencesStore.lang);

// Order of the featured cards; a project starred later comes after them.
const FEATURED_ORDER = ['esportrecrutement.html', 'polis.html', 'rankup.js', 'insalan.html', 'umami.html', 'amphion.html'];
// Part of nearly every project, so they say little on a card.
const BASICS = ['HTML', 'CSS', 'JavaScript', 'Git', 'Docker', 'Caddy'];

const mainTools = (project: localizedProject, count: number) => project.technologies
  .filter((tech) => !BASICS.includes(tech))
  .slice(0, count);
const lastYear = (date: string) => Math.max(...(date.match(/\d{4}/g) ?? ['0']).map(Number));
const featuredRank = (project: localizedProject) => {
  const index = FEATURED_ORDER.indexOf(project.file.en);
  return index === -1 ? FEATURED_ORDER.length : index;
};
const withDetails = (project: localizedProject) => ({
  ...project,
  anchor: projectAnchor(project),
  lead: parseDescription(project.localizedDescription).lead,
});

const featured = computed(() => projects.value
  .filter((project) => project.starred)
  .sort((a, b) => featuredRank(a) - featuredRank(b))
  .map(withDetails));
// Most recent first
const others = computed(() => projects.value
  .filter((project) => !project.starred)
  .sort((a, b) => lastYear(b.date) - lastYear(a.date))
  .map(withDetails));

const categoryFilter = ref<ProjectCategory | 'all'>('all');
const filters = computed(() => {
  const lang = language.value;
  const counts = (Object.keys(CATEGORY_LABELS) as ProjectCategory[])
    .map((key) => ({ key, label: CATEGORY_LABELS[key][lang], count: others.value.filter((project) => project.category === key).length }))
    .filter((filter) => filter.count > 0);
  return [{ key: 'all' as const, label: isEnglish.value ? 'All' : 'Tous', count: others.value.length }, ...counts];
});
const visibleOthers = computed(() => (categoryFilter.value === 'all'
  ? others.value
  : others.value.filter((project) => project.category === categoryFilter.value)));

// The open project, by its English file name: it follows a language switch.
const openFile = ref<string | null>(null);
const currentProject = computed(() => (openFile.value
  ? projects.value.find((project) => project.file.en === openFile.value) ?? null
  : null));

// Previous / next project, in the order shown on the page
const neighbours = computed(() => {
  const current = currentProject.value;
  const shown = [...featured.value, ...visibleOthers.value];
  const list = current && shown.some((project) => project.file.en === current.file.en)
    ? shown
    : [...featured.value, ...others.value];
  if (!current || list.length < 2) return { previous: null, next: null };
  const index = list.findIndex((project) => project.file.en === current.file.en);
  return {
    previous: list[(index - 1 + list.length) % list.length] ?? null,
    next: list[(index + 1) % list.length] ?? null,
  };
});

function openProject(project: localizedProject) {
  openFile.value = project.file.en;
}

// Shareable link, the same as in the cyberpunk version (#project-polis). replaceState
// keeps the router out of it, so nothing scrolls and the history does not grow.
watch(openFile, () => {
  const url = new URL(window.location.href);
  url.hash = currentProject.value ? projectAnchor(currentProject.value) : '';
  window.history.replaceState(window.history.state, '', url);
});

// Opening a shared link: the browser has already scrolled to the project.
onMounted(() => {
  const anchor = window.location.hash.slice(1);
  const project = anchor && projects.value.find((item) => projectAnchor(item) === anchor);
  if (project) openFile.value = project.file.en;
});
</script>
