<template>
  <section id="projects" class="py-20 bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold mb-12 text-center text-gray-900 dark:text-white">
        {{ isEnglish ? 'My Projects' : 'Mes Projets' }}
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="project in projects"
          :key="project.id"
          class="relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform hover:transform hover:scale-105 flex flex-col"
        >
          <img
            :src="project.image"
            :alt="project.localizedName"
            class="w-full h-48 object-cover"
          />
          <div
            v-if="project.starred"
            class="absolute top-0 left-0 bg-yellow-500 text-white text-sm font-bold px-2 py-1 rounded-br-lg"
          >
            {{
              isEnglish
              ? 'Featured'
              : 'Mis en avant'
            }}
          </div>
          <div class="text-gray-500 dark:text-gray-400 mb-2 text-right absolute top-2 right-2 text-sm bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-1">
            {{ project.date }}
          </div>

          <div class="p-6 flex-1 flex flex-col justify-between">
            <div>
              <h3 class="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                {{ project.localizedName }}
              </h3>


              <p class="text-gray-700 dark:text-gray-300 mb-4">
                {{ project.localizedDescription }}
              </p>
            </div>

            <div>
              <div class="flex flex-wrap gap-2 mb-4">
                <span
                  v-for="(tech, index) in project.technologies"
                  :key="index"
                  class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                >
                  {{ tech }}
                </span>
              </div>

              <div class="flex space-x-3">
                <a
                  :href="project.link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm"
                  v-if="project.link"
                >
                  {{ isEnglish ? 'View Project' : 'Voir le Projet' }}
                </a>
                <a
                  :href="project.github"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm"
                  v-if="project.github"
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

<script setup>
import { computed } from 'vue'
import { usePreferencesStore } from '../../stores/preferences'
import { useProjectsStore } from '../../stores/projects'

const preferencesStore = usePreferencesStore()
const projectsStore = useProjectsStore()

const isEnglish = computed(() => preferencesStore.isEnglish)
const projects = computed(() => projectsStore.getLocalizedProjects)
</script>

