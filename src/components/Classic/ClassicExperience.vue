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
          <div v-for="(experience, index) in experiences" :key="index" class="relative mb-12">
            <!-- Timeline dot -->
            <div
              class="absolute left-0 size-4 -translate-x-1/2 rounded-full bg-blue-500 md:left-1/2 dark:bg-blue-400"
            />

            <!-- Content container with alternating layout -->
            <div
              class="ml-8 md:ml-0 md:w-5/12"
              :class="{
                'md:ml-auto': index % 2 === 0,
                'md:mr-auto': index % 2 === 1,
              }"
            >
              <div class="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg dark:bg-gray-800">
                <!-- Experience header -->
                <div class="mb-4">
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                    {{ experience.localizedTitle }} | {{ experience.company }}
                  </h3>
                  <div class="mt-1 flex flex-col items-start text-gray-600 dark:text-gray-400">
                    <span class="flex items-center">
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
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {{ experience.localizedLocation }}
                    </span>
                    <span class="flex items-center">
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
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {{ experience.localizedPeriod }}
                    </span>
                  </div>
                </div>

                <!-- Description -->
                <p class="mb-4 text-gray-700 dark:text-gray-300">
                  {{ experience.localizedDescription }}
                </p>

                <!-- Technologies used -->
                <div class="mb-4">
                  <h4 class="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                    {{ isEnglish ? 'Technologies Used:' : 'Technologies Utilisées:' }}
                  </h4>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="(tech, techIndex) in experience.technologies"
                      :key="techIndex"
                      class="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {{ tech }}
                    </span>
                  </div>
                </div>

                <!-- Key achievements -->
                <div>
                  <h4 class="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                    {{ isEnglish ? 'Key Achievements:' : 'Réalisations Principales:' }}
                  </h4>
                  <ul class="list-inside list-disc text-sm text-gray-700 dark:text-gray-300">
                    <li
                      v-for="(achievement, achievementIndex) in experience.localizedAchievements"
                      :key="achievementIndex"
                    >
                      {{ achievement }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { usePreferencesStore } from '../../stores/preferences';
import { useProjectsStore } from '../../stores/projects';

const preferencesStore = usePreferencesStore();
const projectsStore = useProjectsStore();

const isEnglish = computed(() => preferencesStore.isEnglish);
const experiences = computed(() => projectsStore.getLocalizedExperiences);
</script>
