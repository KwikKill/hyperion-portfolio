<template>
  <section id="experience" class="py-20 bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold mb-12 text-center text-gray-900 dark:text-white">
        {{ isEnglish ? 'Work Experience' : 'Expérience Professionnelle' }}
      </h2>

      <div class="max-w-4xl mx-auto">
        <!-- Timeline layout for experiences -->
        <div class="relative">
          <!-- Vertical line -->
          <div class="absolute left-0 md:left-1/2 h-full w-0.5 bg-blue-500 dark:bg-blue-400 transform -translate-x-1/2"></div>

          <!-- Experience items -->
          <div
            v-for="(experience, index) in experiences"
            :key="index"
            class="mb-12 relative"
          >
            <!-- Timeline dot -->
            <div class="absolute left-0 md:left-1/2 w-4 h-4 bg-blue-500 dark:bg-blue-400 rounded-full transform -translate-x-1/2"></div>

            <!-- Content container with alternating layout -->
            <div
              class="ml-8 md:ml-0 md:w-5/12"
              :class="{
                'md:ml-auto': index % 2 === 0,
                'md:mr-auto': index % 2 === 1
              }"
            >
              <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <!-- Experience header -->
                <div class="mb-4">
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                    {{ experience.localizedTitle }} | {{ experience.company }}
                  </h3>
                  <div class="flex flex-col items-start text-gray-600 dark:text-gray-400 mt-1">
                    <span class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {{ experience.localizedLocation }}
                    </span>
                    <span class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {{ experience.localizedPeriod }}
                    </span>
                  </div>
                </div>

                <!-- Description -->
                <p class="text-gray-700 dark:text-gray-300 mb-4">
                  {{ experience.localizedDescription }}
                </p>

                <!-- Technologies used -->
                <div class="mb-4">
                  <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    {{ isEnglish ? 'Technologies Used:' : 'Technologies Utilisées:' }}
                  </h4>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="(tech, techIndex) in experience.technologies"
                      :key="techIndex"
                      class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                    >
                      {{ tech }}
                    </span>
                  </div>
                </div>

                <!-- Key achievements -->
                <div>
                  <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    {{ isEnglish ? 'Key Achievements:' : 'Réalisations Principales:' }}
                  </h4>
                  <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 text-sm">
                    <li v-for="(achievement, achievementIndex) in experience.localizedAchievements" :key="achievementIndex">
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

<script setup>
import { computed } from 'vue'
import { usePreferencesStore } from '../../stores/preferences'
import { useProjectsStore } from '../../stores/projects'

const preferencesStore = usePreferencesStore()
const projectsStore = useProjectsStore()

const isEnglish = computed(() => preferencesStore.isEnglish)
const experiences = computed(() => projectsStore.getLocalizedExperiences)
</script>

