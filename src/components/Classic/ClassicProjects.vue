<template>
  <section id="projects" class="bg-gray-50 pb-20 dark:bg-gray-900">
    <div class="">
      <h2 class="mb-8 bg-gray-200 p-4 text-center text-3xl font-bold text-gray-900 dark:bg-gray-800 dark:text-white">
        {{ isEnglish ? 'My Projects' : 'Mes Projets' }}
      </h2>

      <div class="container mx-auto grid grid-cols-1 gap-8 px-4 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="project in projects"
          :key="project.name[language ?? 'en']"
          class="relative flex flex-col overflow-hidden rounded-lg bg-white shadow-lg transition-transform hover:scale-105 dark:bg-gray-800"
        >
          <img :src="project.image" :alt="project.localizedName" class="h-48 w-full object-cover"/>
          <div
            v-if="project.starred"
            class="absolute left-0 top-0 rounded-br-lg bg-yellow-500 px-2 py-1 text-sm font-bold text-white"
          >
            {{
              isEnglish
                ? 'Featured'
                : 'Mis en avant'
            }}
          </div>
          <div
            class="absolute right-2 top-2 mb-2 rounded-full bg-gray-200 px-2 py-1 text-right text-sm text-gray-500 dark:bg-gray-700 dark:text-gray-400"
          >
            {{ project.date }}
          </div>

          <div class="flex flex-1 flex-col justify-between p-6">
            <div>
              <h3 class="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                {{ project.localizedName }}
              </h3>

              <p class="mb-4 text-gray-700 dark:text-gray-300">
                {{ project.localizedDescription }}
              </p>
            </div>

            <div>
              <div class="mb-4 flex flex-wrap gap-2">
                <span
                  v-for="(tech, index) in project.technologies"
                  :key="index"
                  class="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  {{ tech }}
                </span>
              </div>

              <div class="flex space-x-3">
                <a
                  v-if="project.link"
                  :href="project.link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="rounded-md bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700"
                >
                  {{ isEnglish ? 'View Project' : 'Voir le Projet' }}
                </a>
                <a
                  v-if="project.github"
                  :href="project.github"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="rounded-md bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700"
                >
                  GitHub
                </a>
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
const projects = computed(() => projectsStore.getLocalizedProjects);
const language = computed(() => preferencesStore.language);
</script>
