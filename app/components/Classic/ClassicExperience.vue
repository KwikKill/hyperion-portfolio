<template>
  <section id="experience" class="bg-gray-50 py-20 dark:bg-gray-900">
    <div class="container mx-auto px-4">
      <h2 class="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white">
        {{ isEnglish ? 'Work Experience' : 'Expérience Professionnelle' }}
      </h2>

      <div class="mx-auto max-w-4xl">
        <!-- Timeline layout for experiences -->
        <div class="relative">
          <!-- Vertical line -->
          <div class="absolute left-0 h-full w-0.5 -translate-x-1/2 bg-blue-500 md:left-1/2 dark:bg-blue-400"/>

          <!-- Experience items -->
          <ClassicExperienceCard
            v-for="(experience, index) in mainExperiences"
            :key="'main-' + index"
            :experience="experience"
            :index="index"
          />

          <!-- Group toggle -->
          <div v-if="internshipExperiences.length" class="relative mb-12">
            <div
              class="absolute left-0 size-4 -translate-x-1/2 rounded-full bg-blue-500 md:left-1/2 dark:bg-blue-400"
            />
            <div class="flex justify-center">
              <button
                type="button"
                class="flex items-center gap-2 rounded-full bg-white px-6 py-3 font-medium text-blue-600 shadow-md transition-shadow hover:shadow-lg dark:bg-gray-800 dark:text-blue-400"
                @click="showInternships = !showInternships"
              >
                <span class="transition-transform duration-200" :class="{ 'rotate-90': showInternships }">▶</span>
                {{
                  showInternships
                    ? (isEnglish ? 'Hide internships' : 'Masquer les stages')
                    : (isEnglish
                      ? `Show internships ${internshipYearRange} (${internshipExperiences.length})`
                      : `Afficher les stages ${internshipYearRange} (${internshipExperiences.length})`)
                }}
              </button>
            </div>
          </div>

          <template v-if="showInternships">
            <ClassicExperienceCard
              v-for="(experience, index) in internshipExperiences"
              :key="'intern-' + index"
              :experience="experience"
              :index="mainExperiences.length + index"
            />
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import { usePreferencesStore } from '../../stores/preferences';
import { useProjectsStore } from '../../stores/projects';
import ClassicExperienceCard from './ClassicExperienceCard.vue';

const preferencesStore = usePreferencesStore();
const projectsStore = useProjectsStore();

const isEnglish = computed(() => preferencesStore.isEnglish);
const experiences = computed(() => projectsStore.getLocalizedExperiences);
const mainExperiences = computed(() => experiences.value.filter((experience) => !experience.internship));
const internshipExperiences = computed(() => experiences.value.filter((experience) => experience.internship));
const internshipYearRange = computed(() => {
  const years = internshipExperiences.value
    .flatMap((experience) => experience.localizedPeriod.match(/\d{4}/g) ?? [])
    .map(Number);
  if (!years.length) return '';
  const min = Math.min(...years);
  const max = Math.max(...years);
  return min === max ? `${min}` : `${min}-${max}`;
});

const showInternships = ref(false);
</script>
