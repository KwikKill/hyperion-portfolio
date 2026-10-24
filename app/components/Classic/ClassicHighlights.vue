<template>
  <aside class="rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-lg">
    <h3 class="text-sm font-semibold uppercase tracking-wider text-gray-400">
      {{ isEnglish ? 'In numbers' : 'En chiffres' }}
    </h3>
    <ul class="mt-4 grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3">
      <li v-for="stat in stats" :key="stat.label">
        <span class="block text-3xl font-bold leading-tight text-white">
          {{ stat.value }}<sup v-if="stat.sup" class="text-base">{{ stat.sup }}</sup>{{ stat.suffix }}
        </span>
        <span class="mt-1 block text-sm leading-snug text-gray-400">
          {{ stat.label }}
        </span>
      </li>
    </ul>

    <h3 class="mt-6 text-sm font-semibold uppercase tracking-wider text-gray-400">
      {{ isEnglish ? 'Featured projects' : 'Projets phares' }}
    </h3>
    <ul class="mt-3 space-y-3">
      <li v-for="project in featured" :key="project.file.en">
        <a
          :href="project.link"
          target="_blank"
          rel="noopener noreferrer"
          class="group grid grid-cols-[88px_minmax(0,1fr)] items-center gap-4"
        >
          <img
            :src="project.images[0]"
            alt=""
            loading="lazy"
            decoding="async"
            class="h-[52px] w-[88px] rounded-md border border-gray-700 object-cover"
          />
          <span class="min-w-0">
            <span class="block font-semibold text-white transition-colors group-hover:text-blue-400">
              {{ project.localizedName }}
            </span>
            <span class="line-clamp-2 text-sm text-gray-400">
              {{ project.lead }}
            </span>
          </span>
        </a>
      </li>
    </ul>

    <a href="#projects" class="mt-5 inline-block text-sm font-medium text-blue-400 transition-colors hover:text-blue-300">
      {{ isEnglish ? 'See all projects →' : 'Voir tous les projets →' }}
    </a>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { usePreferencesStore } from '../../stores/preferences';
import { useProjectsStore } from '../../stores/projects';
import { parseDescription } from '../../utils/description';
import { firstYear } from '../../utils/years';

const preferencesStore = usePreferencesStore();
const projectsStore = useProjectsStore();

const isEnglish = computed(() => preferencesStore.isEnglish);
const projects = computed(() => projectsStore.getLocalizedProjects);
const experiences = computed(() => projectsStore.getLocalizedExperiences);

// The three most important projects, in this order.
const FEATURED_FILES = ['esportrecrutement.html', 'polis.html', 'rankup.js'];

const sinceYear = computed(() => Math.min(...projects.value.map((project) => firstYear(project.date) ?? Infinity)));
const internshipCount = computed(() => experiences.value.filter((experience) => experience.internship).length);

const stats = computed(() => {
  const en = isEnglish.value;
  const years = new Date().getFullYear() - sinceYear.value;
  return [
    { value: en ? `${years} years` : `${years} ans`, label: en ? `of projects, since ${sinceYear.value}` : `de projets, depuis ${sinceYear.value}` },
    { value: `${projects.value.length}`, label: en ? 'published projects' : 'projets publiés' },
    { value: `${internshipCount.value}`, label: en ? 'internships in companies' : 'stages en entreprise' },
    { value: '600+', label: en ? 'users of the RankUp bot' : 'utilisateurs du bot RankUp' },
    // Non-breaking space: the number stays on one line
    { value: en ? '1,000+' : '1 000+', label: en ? 'Insaplace users in one week' : 'utilisateurs d\'Insaplace en une semaine' },
    { value: '4', sup: en ? 'th' : 'e', suffix: ' / 42', label: en ? 'at the Break the Code contest' : 'au concours Break the Code' },
  ];
});

const featured = computed(() => FEATURED_FILES
  .map((file) => projects.value.find((project) => project.file.en === file))
  .filter((project): project is NonNullable<typeof project> => project !== undefined)
  .map((project) => ({ ...project, lead: parseDescription(project.localizedDescription).lead })));
</script>
