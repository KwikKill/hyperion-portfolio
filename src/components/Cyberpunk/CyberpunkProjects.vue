<template>
  <section id="projects" class="cyberpunk-terminal py-20 bg-black relative min-h-screen rounded-md">
    <!-- Cyberpunk desktop background with grid -->
    <div class="absolute inset-0 z-0">
      <div class="cyberpunk-grid-bg h-full"></div>
      <div class="absolute inset-0 bg-black/30"></div>
    </div>

    <div class="container mx-auto px-4 relative z-10">
      <!-- Desktop header bar -->
      <CyberpunkTerminalWindow class="mb-8" :showIcon="false" noBody>
        <template #title>
          {{ isEnglish ? 'HYPERION v1.0 - PROJECTS DIRECTORY' : 'HYPERION v1.0 - RÉPERTOIRE DES PROJETS' }}
        </template>
      </CyberpunkTerminalWindow>

      <!-- Search bar -->
      <CyberpunkTerminalWindow class="mb-2" :noTitle="true">
        <template #body>
          <div class="flex items-center">
            <div class="text-cyan-400 mr-2 font-mono">
              <span class="blink-cursor">></span>
            </div>
            <div class="relative flex-1">
              <input type="text" v-model="searchQuery"
                :placeholder="isEnglish ? 'SEARCH PROJECTS, TECHNO,...' : 'RECHERCHER DES PROJETS, TECHNO,...'"
                class="w-full bg-transparent border-none outline-none text-theme-foreground font-mono uppercase placeholder-gray-500 focus:ring-0"
                @focus="isSearchFocused = true" @blur="isSearchFocused = false" />
              <div v-if="searchQuery" @click="clearSearch"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-theme-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd" />
                </svg>
              </div>
            </div>
            <div class="text-gray-500 ml-2 font-mono text-sm">
              {{ filteredProjects.length }} {{ isEnglish ? 'RESULTS' : 'RÉSULTATS' }}
            </div>
          </div>
        </template>
      </CyberpunkTerminalWindow>

      <!-- Desktop icons grid -->
      <CyberpunkTerminalWindow>
        <template #title>
          {{
            isEnglish
              ? 'PROJECTS EXPLORER'
              : 'EXPLORATEUR DE PROJETS'
          }}
        </template>
        <template #body>
          <!-- Search status message -->
          <div v-if="searchQuery && filteredProjects.length === 0" class="text-center mb-6">
            <div class="text-theme-foreground font-mono uppercase cyberpunk-text-glow">
              {{ isEnglish ? 'NO PROJECTS FOUND' : 'AUCUN PROJET TROUVÉ' }}
            </div>
            <div class="text-cyan-400 text-sm font-mono mt-2">
              {{ isEnglish ? 'TRY ANOTHER SEARCH TERM' : 'ESSAYEZ UN AUTRE TERME DE RECHERCHE' }}
            </div>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-5">
            <!-- Project items remain the same -->
            <div v-for="project in filteredProjects" :key="project"
              class="flex flex-col items-center cursor-pointer group" @click="openProject(project)"
              :class="{ 'search-match': isSearchMatch(project) }" :id="'project-' + project.file[language]">
              <div class="desktop-folder mb-2 transition-transform group-hover:scale-110 relative">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" :class="[
                  'w-16 h-16',
                  project.starred ? 'text-theme-foreground star-glow' : 'text-theme-foreground/80'
                ]">
                  <path
                    d="M19.5 21a3 3 0 003-3v-4.5a3 3 0 00-3-3h-15a3 3 0 00-3 3V18a3 3 0 003 3h15zM1.5 10.146V6a3 3 0 013-3h5.379a2.25 2.25 0 011.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 013 3v1.146A4.483 4.483 0 0019.5 9h-15a4.483 4.483 0 00-3 1.146z" />
                </svg>

                <!-- Star badge for starred projects -->
                <div v-if="project.starred" class="absolute -top-2 -right-2 star-badge">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>

              <!-- Project name -->
              <div class="text-center">
                <div class="bg-black/70 px-2 py-1 text-theme-foreground font-mono text-sm cyberpunk-text-glow">
                  {{ project.localizedName }}
                </div>
                <div class="text-xs text-cyan-400 mt-1 font-mono">
                  {{ project.date }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </CyberpunkTerminalWindow>
    </div>

    <!-- Project Modal -->
    <div v-if="selectedProject" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      @click.self="closeProject">
      <CyberpunkTerminalWindow body_class="max-w-3xl w-full max-h-[80vh] overflow-y-auto p-4">
        <template #title>
          <div
            class="flex justify-center items-start md:items-center text-theme-foreground font-mono text-lg cyberpunk-text-glow md:flex-row flex-col">
            {{ selectedProject.localizedName }}
            <span v-if="selectedProject.starred" class="md:ml-2 text-theme-foreground star-badge-modal">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span class="text-xs ml-1">{{ isEnglish ? 'FEATURED PROJECT' : 'PROJET MIS EN AVANT' }}</span>
            </span>
          </div>
        </template>

        <template #buttons>
          <div class="flex justify-end">
            <button @click="closeProject" class="text-theme-foreground hover:text-yellow-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </template>

        <template #body>
          <div class="flex flex-col md:flex-col gap-6">
            <div class="">
              <img :src="selectedProject.image" :alt="selectedProject.localizedName"
                class="w-full h-auto object-cover border-2 border-theme-foreground/70 rounded-md" />
            </div>

            <div class="">
              <h4 class="text-cyan-400 font-mono uppercase text-sm mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-cyan-400" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                DESCRIPTION
              </h4>
              <div class="bg-black/50 p-4 border border-theme-foreground/30 rounded-md mb-4">
                <div class="text-gray-300 font-mono text-justify leading-relaxed">
                  {{ selectedProject.localizedDescription }}
                </div>
              </div>

              <div class="mb-4">
                <h4 class="text-cyan-400 font-mono uppercase text-sm mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {{ isEnglish ? 'TECHNOLOGIES' : 'TECHNOLOGIES' }}
                </h4>
                <div class="flex flex-wrap gap-2">
                  <span v-for="(tech, index) in selectedProject.technologies" :key="index"
                    class="px-2 py-1 bg-black text-theme-foreground text-xs font-mono uppercase border border-theme-foreground">
                    {{ tech }}
                  </span>
                </div>
              </div>

              <div class="flex space-x-4 justify-center">
                <a :href="selectedProject.link" v-if="selectedProject.link" target="_blank" rel="noopener noreferrer"
                  class="px-4 py-2 bg-theme-foreground hover:bg-yellow-400 text-black font-mono uppercase text-sm flex items-center transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  {{ isEnglish ? 'VIEW PROJECT' : 'VOIR LE PROJET' }}
                </a>
                <a :href="selectedProject.github" v-if="selectedProject.github" target="_blank"
                  rel="noopener noreferrer"
                  class="px-4 py-2 bg-theme-foreground hover:bg-yellow-400 text-black font-mono uppercase text-sm flex items-center transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
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

<script setup>
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia';
import { usePreferencesStore } from '../../stores/preferences'
import { useProjectsStore } from '../../stores/projects'
import CyberpunkTerminalWindow from './CyberpunkTerminalWindow.vue'

const preferencesStore = usePreferencesStore()
const projectsStore = useProjectsStore()

const isEnglish = computed(() => preferencesStore.isEnglish)
const language = computed(() => preferencesStore.language)
const projects = computed(() => projectsStore.getLocalizedProjects)

const { selectedProject } = storeToRefs(projectsStore)

const searchQuery = ref('')
const isSearchFocused = ref(false)
const lastSearchTime = ref(Date.now())

// Filter projects based on search query
const filteredProjects = computed(() => {
  if (!searchQuery.value) return projects.value

  const query = searchQuery.value.toLowerCase()
  return projects.value.filter(project => {
    return project.localizedName.toLowerCase().includes(query) ||
      project.localizedDescription.toLowerCase().includes(query) ||
      project.technologies.some(tech => tech.toLowerCase().includes(query))
  })
})

// Check if a project is a new match for animation purposes
function isSearchMatch(project) {
  if (!searchQuery.value) return false

  const query = searchQuery.value.toLowerCase()
  return project.localizedName.toLowerCase().includes(query) ||
    project.localizedDescription.toLowerCase().includes(query) ||
    project.technologies.some(tech => tech.toLowerCase().includes(query))
}

// Clear search
function clearSearch() {
  searchQuery.value = ''
}

// Update last search time when query changes (for animation timing)
watch(searchQuery, () => {
  lastSearchTime.value = Date.now()
})

function openProject(project) {
  selectedProject.value = project
}

function closeProject() {
  selectedProject.value = null
}
</script>

<style scoped>
/* Styles remain the same */
.cyberpunk-grid-bg {
  background-color: #1a1a1a;
  background-image:
    linear-gradient(rgba(255, 215, 0, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 215, 0, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
}

.desktop-folder {
  position: relative;
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

/* Search animations */
.search-match {
  animation: pulse-glow 1.5s ease-in-out;
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
</style>
