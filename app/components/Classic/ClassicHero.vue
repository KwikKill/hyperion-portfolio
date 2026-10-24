<template>
  <section id="home" class="bg-gray-50 py-20 dark:bg-gray-900">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div class="mb-10 md:mb-0">
          <h1 class="mb-4 text-4xl font-bold text-gray-900 md:text-5xl dark:text-white">
            {{ isEnglish ? 'Hi, I\'m Gabriel Blaisot' : 'Bonjour, je suis Gabriel Blaisot' }}
          </h1>
          <h2 class="mb-6 text-2xl font-semibold text-blue-600 md:text-3xl dark:text-blue-400">
            {{ isEnglish ? 'Software Engineer - Web Developer' : 'Ingénieur logiciel - Développeur Web' }}
            <br/>
            Sopra Steria & Freelance
          </h2>
          <div class="flex flex-col gap-4">
            <p class="text-lg text-gray-700 dark:text-gray-300">
              {{
                isEnglish
                  ? 'Software engineer at Sopra Steria in Rennes, I build web applications end to end.'
                  : 'Ingénieur logiciel chez Sopra Steria à Rennes, je conçois des applications web de bout en bout.'
              }}
            </p>
            <!-- Key facts, from the store: job, freelance, education, location -->
            <ul class="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
              <li v-for="fact in facts" :key="fact.icon" class="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="mt-0.5 size-5 shrink-0 text-blue-600 dark:text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                  aria-hidden="true"
                >
                  <path v-for="path in ICONS[fact.icon]" :key="path" stroke-linecap="round" stroke-linejoin="round" :d="path"/>
                </svg>
                <span>
                  <span class="block text-gray-900 dark:text-white">{{ fact.title }}</span>
                  <span v-if="fact.detail" class="block text-sm text-gray-600 dark:text-gray-400">{{ fact.detail }}</span>
                </span>
              </li>
            </ul>
            <div>
              <p class="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                {{ isEnglish ? 'Day to day' : 'Au quotidien' }}
              </p>
              <ul class="flex flex-wrap gap-2">
                <li
                  v-for="tool in tools"
                  :key="tool"
                  class="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  {{ tool }}
                </li>
              </ul>
            </div>
            <ClassicContact class="rounded-lg shadow-lg"/>
            <div class="flex flex-wrap items-center justify-center gap-4 md:justify-start">
              <a
                :href="CV_URL"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
              >
                {{ isEnglish ? 'View my CV' : 'Voir mon CV' }}
                <svg class="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
              </a>
              <a
                href="#projects"
                class="rounded-md bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
              >
                {{ isEnglish ? 'View Projects' : 'Voir les Projets' }}
              </a>
              <a
                href="#interests"
                class="rounded-md border border-blue-600 px-6 py-3 text-blue-600 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/30"
              >
                {{ isEnglish ? 'My Interests' : 'Mes Intérêts' }}
              </a>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-end">
          <ClassicHighlights class="w-full max-w-lg"/>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { useProfile } from '../../composables/useProfile';
import { usePreferencesStore } from '../../stores/preferences';
import { CV_URL } from '../../utils/links';
import ClassicContact from './ClassicContact.vue';
import ClassicHighlights from './ClassicHighlights.vue';

const preferencesStore = usePreferencesStore();
const {
  job, freelance, formation, degree, toolsOf, dailyTools,
} = useProfile();
const isEnglish = computed(() => preferencesStore.isEnglish);

// Outline icons (24×24), one or more paths each
const ICONS = {
  job: ['M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2'],
  freelance: ['M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4'],
  school: ['M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z'],
  location: ['M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z', 'M15 11a3 3 0 11-6 0 3 3 0 016 0z'],
};

const facts = computed(() => {
  const en = isEnglish.value;
  const company = job.value?.company ?? '';
  return [
    { icon: 'job' as const, title: en ? `Permanent position at ${company}` : `CDI chez ${company}`, detail: job.value?.localizedPeriod },
    { icon: 'freelance' as const, title: en ? 'Freelance developer' : 'Développeur freelance', detail: freelance.value?.localizedPeriod },
    { icon: 'school' as const, title: formation.value.school, detail: `${degree.value} · ${formation.value.graduationYear}` },
    { icon: 'location' as const, title: job.value?.localizedLocation ?? 'Rennes, France', detail: '' },
  ];
});

// The job's daily tools, then the freelance ones: six at most
const tools = computed(() => [...new Set([...dailyTools.value, ...toolsOf(freelance.value)])].slice(0, 6));
</script>
